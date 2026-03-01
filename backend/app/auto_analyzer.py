"""
Auto-analysis service for press releases.

Automatically analyzes new press releases and caches results.
"""

from typing import Dict, Optional
from datetime import datetime
import json
from pathlib import Path

# Cache file location
CACHE_DIR = Path(__file__).parent.parent / "data"
ANALYSIS_CACHE_FILE = CACHE_DIR / "analysis_cache.json"

# In-memory cache
_analysis_cache = {}
_cache_loaded = False


def load_cache():
    """Load analysis cache from file."""
    global _analysis_cache, _cache_loaded
    
    if _cache_loaded:
        return
    
    try:
        if ANALYSIS_CACHE_FILE.exists():
            with open(ANALYSIS_CACHE_FILE, 'r', encoding='utf-8') as f:
                _analysis_cache = json.load(f)
            print(f"✓ Loaded {len(_analysis_cache)} cached analyses")
        else:
            _analysis_cache = {}
            print("ℹ No analysis cache found, starting fresh")
    except Exception as e:
        print(f"⚠️  Error loading analysis cache: {e}")
        _analysis_cache = {}
    
    _cache_loaded = True


def save_cache():
    """Save analysis cache to file."""
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        with open(ANALYSIS_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(_analysis_cache, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"⚠️  Error saving analysis cache: {e}")


def get_cached_analysis(change_id: str) -> Optional[Dict]:
    """Get cached analysis for a change."""
    load_cache()
    return _analysis_cache.get(change_id)


def cache_analysis(change_id: str, analysis: Dict):
    """Cache an analysis result."""
    load_cache()
    
    _analysis_cache[change_id] = {
        "analysis": analysis,
        "cached_at": datetime.now().isoformat(),
        "change_id": change_id
    }
    
    save_cache()


def should_analyze(change: Dict) -> bool:
    """Determine if a change should be auto-analyzed."""
    # Only auto-analyze high and critical risk items
    risk_level = change.get('riskLevel', '').lower()
    return risk_level in ['high', 'critical']


def auto_analyze_change(change: Dict) -> Optional[Dict]:
    """
    Auto-analyze a change if not already cached.
    
    Returns cached or new analysis, or None if not analyzed.
    """
    change_id = change.get('id')
    
    if not change_id:
        return None
    
    # Check cache first
    cached = get_cached_analysis(change_id)
    if cached:
        return cached.get('analysis')
    
    # Check if should analyze
    if not should_analyze(change):
        return None
    
    # Perform analysis
    try:
        from app.rag_agent import retrieve_relevant_obligation, construct_prompt, call_gemini_api
        from app.knowledge import get_cached_company_profile, get_cached_compliance_knowledge
        
        profile = get_cached_company_profile()
        knowledge = get_cached_compliance_knowledge()
        
        if not profile or not knowledge:
            return None
        
        # Get the full text for analysis
        update_text = change.get('changeSummary', '')
        if change.get('content'):
            update_text += "\n\n" + change.get('content', '')
        
        # Retrieve obligation and analyze
        obligation = retrieve_relevant_obligation(update_text, knowledge)
        prompt = construct_prompt(profile, update_text, obligation)
        result = call_gemini_api(prompt)
        
        # Check for errors
        if "error" in result or "raw_response" in result:
            return None
        
        # Add retrieved obligation
        result['retrieved_obligation'] = obligation
        
        # Cache the result
        cache_analysis(change_id, result)
        
        print(f"✓ Auto-analyzed change {change_id}: {result.get('risk_level')} risk")
        
        return result
        
    except Exception as e:
        print(f"⚠️  Error auto-analyzing change {change_id}: {e}")
        return None


def get_analysis_for_change(change: Dict) -> Optional[Dict]:
    """
    Get analysis for a change (from cache or by analyzing).
    
    This is the main function to call when you need analysis.
    """
    change_id = change.get('id')
    
    if not change_id:
        return None
    
    # Try cache first
    cached = get_cached_analysis(change_id)
    if cached:
        return cached.get('analysis')
    
    # Auto-analyze if appropriate
    return auto_analyze_change(change)


def clear_cache():
    """Clear the analysis cache."""
    global _analysis_cache
    _analysis_cache = {}
    
    try:
        if ANALYSIS_CACHE_FILE.exists():
            ANALYSIS_CACHE_FILE.unlink()
        print("✓ Analysis cache cleared")
    except Exception as e:
        print(f"⚠️  Error clearing cache: {e}")


def get_cache_stats() -> Dict:
    """Get statistics about the cache."""
    load_cache()
    
    return {
        "total_cached": len(_analysis_cache),
        "cache_file": str(ANALYSIS_CACHE_FILE),
        "cache_exists": ANALYSIS_CACHE_FILE.exists()
    }
