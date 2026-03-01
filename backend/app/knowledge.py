"""
Knowledge loading module for compliance data.

This module handles loading JSON files from the data directory
and provides clean access to company profile and compliance knowledge.
"""

from pathlib import Path
import json
from typing import Dict, List, Optional


# Resolve the backend root directory
# This file is in backend/app/, so we go up one level to get backend/
BACKEND_ROOT = Path(__file__).parent.parent
DATA_DIR = BACKEND_ROOT / "data"


def load_json_file(file_path: Path) -> Optional[Dict]:
    """
    Load a JSON file and return its contents as a dictionary.
    
    Args:
        file_path: Path to the JSON file
        
    Returns:
        Dictionary containing the JSON data, or None if file not found
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: File not found: {file_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {file_path}: {e}")
        return None
    except Exception as e:
        print(f"❌ Error loading {file_path}: {e}")
        return None


def load_company_profile() -> Dict:
    """
    Load the company profile from data/company_profile.json.
    
    Returns:
        Dictionary containing company profile data, or empty dict if not found
    """
    file_path = DATA_DIR / "company_profile.json"
    data = load_json_file(file_path)
    
    if data is None:
        print("⚠️  Warning: Company profile not loaded, using empty profile")
        return {}
    
    return data


def load_compliance_knowledge() -> Dict:
    """
    Load compliance knowledge from data/compliance_knowledge.json.
    
    Returns:
        Dictionary containing compliance knowledge, or empty dict if not found
    """
    file_path = DATA_DIR / "compliance_knowledge.json"
    data = load_json_file(file_path)
    
    if data is None:
        print("⚠️  Warning: Compliance knowledge not loaded, using empty knowledge base")
        return {}
    
    return data


def get_obligations(compliance_data: Dict) -> List[Dict]:
    """
    Extract obligations list from compliance knowledge.
    
    Args:
        compliance_data: Compliance knowledge dictionary
        
    Returns:
        List of obligation dictionaries
    """
    return compliance_data.get("obligations", [])


def get_obligation_by_id(compliance_data: Dict, obligation_id: str) -> Optional[Dict]:
    """
    Get a specific obligation by its ID.
    
    Args:
        compliance_data: Compliance knowledge dictionary
        obligation_id: ID of the obligation to retrieve
        
    Returns:
        Obligation dictionary or None if not found
    """
    obligations = get_obligations(compliance_data)
    for obligation in obligations:
        if obligation.get("id") == obligation_id:
            return obligation
    return None


def get_critical_obligations(compliance_data: Dict) -> List[Dict]:
    """
    Get all critical severity obligations.
    
    Args:
        compliance_data: Compliance knowledge dictionary
        
    Returns:
        List of critical obligation dictionaries
    """
    obligations = get_obligations(compliance_data)
    return [o for o in obligations if o.get("severity") == "critical"]


# Module-level cache for loaded data
_company_profile_cache: Optional[Dict] = None
_compliance_knowledge_cache: Optional[Dict] = None


def initialize_knowledge_base() -> tuple[Dict, Dict]:
    """
    Initialize the knowledge base by loading all data files.
    This should be called once at application startup.
    
    Returns:
        Tuple of (company_profile, compliance_knowledge)
    """
    global _company_profile_cache, _compliance_knowledge_cache
    
    print("📚 Loading knowledge base...")
    
    # Load company profile
    _company_profile_cache = load_company_profile()
    if _company_profile_cache:
        company_name = _company_profile_cache.get("company_name", "Unknown")
        print(f"✓ Company profile loaded successfully: {company_name}")
    
    # Load compliance knowledge
    _compliance_knowledge_cache = load_compliance_knowledge()
    if _compliance_knowledge_cache:
        obligations = get_obligations(_compliance_knowledge_cache)
        framework = _compliance_knowledge_cache.get("framework", "Unknown")
        print(f"✓ Compliance knowledge loaded successfully: {framework}")
        print(f"✓ Loaded {len(obligations)} obligations")
    
    return _company_profile_cache, _compliance_knowledge_cache


def get_cached_company_profile() -> Dict:
    """Get the cached company profile."""
    return _company_profile_cache or {}


def get_cached_compliance_knowledge() -> Dict:
    """Get the cached compliance knowledge."""
    return _compliance_knowledge_cache or {}
