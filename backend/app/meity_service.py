"""
Service for fetching and processing MeitY press releases.
"""

import requests
from typing import List, Dict, Optional
from datetime import datetime
import re

API_URL = "https://www.meity.gov.in/cms/wp-json/document/documents"
BASE_URL = "https://www.meity.gov.in"

# Keywords for DPDP Act filtering
KEYWORDS = [
    "data", "digital", "personal", "protection", "privacy", 
    "breach", "consent", "security", "reporting", "fiduciary", 
    "board", "penalty", "dpdp", "dpdpa"
]

def calculate_risk_level(matched_keywords: List[str], title: str, content: str) -> str:
    """Calculate risk level based on keywords and content."""
    keyword_count = len(matched_keywords)
    combined_text = f"{title} {content}".lower()
    
    # Critical: Multiple high-priority keywords
    critical_keywords = ["breach", "penalty", "violation", "enforcement", "compliance"]
    critical_matches = sum(1 for kw in critical_keywords if kw in combined_text)
    
    if critical_matches >= 2 or keyword_count >= 5:
        return "critical"
    elif keyword_count >= 3:
        return "high"
    elif keyword_count >= 2:
        return "medium"
    else:
        return "low"

def fetch_press_releases(page: int = 1, limit: int = 10) -> Dict:
    """Fetch press releases from MeitY API."""
    params = {
        "type": "Press Release",
        "limit": limit,
        "page": page
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
    }
    
    try:
        response = requests.get(API_URL, params=params, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching from MeitY API: {e}")
        return {"posts": [], "total_items": 0, "total_pages": 0, "current_page": page}

def process_press_release(post: Dict) -> Optional[Dict]:
    """Process a single press release and return formatted data."""
    try:
        title = post.get('post_title', '').strip()
        
        if not title or len(title) < 20:
            return None
        
        # Extract date
        date_str = post.get('post_date', '')
        detected_at = date_str
        if date_str:
            try:
                dt = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
                detected_at = dt.isoformat() + 'Z'
            except:
                pass
        
        # Get link
        post_slug = post.get('post_slug', '')
        link = f"{BASE_URL}/documents/press-release/{post_slug}" if post_slug else post.get('guid', '')
        
        # Extract content
        content = post.get('post_excerpt', '') or post.get('post_content', '')
        if content:
            content = re.sub(r'<[^>]+>', '', content).strip()
        
        # Filter by keywords
        combined_text = f"{title} {content}".lower()
        matched_keywords = [kw for kw in KEYWORDS if kw in combined_text]
        
        # Only return if relevant (2+ keywords)
        if len(matched_keywords) < 2:
            return None
        
        # Calculate risk level
        risk_level = calculate_risk_level(matched_keywords, title, content)
        
        return {
            "id": str(post.get('ID', '')),
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": title,
            "detectedAt": detected_at,
            "riskLevel": risk_level,
            "affectedSector": "Technology, Data Protection",
            "link": link,
            "content": content[:500] if content else "",
            "matchedKeywords": matched_keywords
        }
    except Exception as e:
        print(f"Error processing press release: {e}")
        return None

def get_all_changes(page: int = 1, limit: int = 10) -> Dict:
    """Get all relevant press releases with pagination."""
    data = fetch_press_releases(page, limit)
    
    posts = data.get('posts', [])
    processed_changes = []
    
    for post in posts:
        processed = process_press_release(post)
        if processed:
            processed_changes.append(processed)
    
    return {
        "changes": processed_changes,
        "total": data.get('total_items', 0),
        "page": page,
        "limit": limit,
        "totalPages": data.get('total_pages', 0)
    }

def get_change_by_id(change_id: str) -> Optional[Dict]:
    """Get a specific press release by ID."""
    # Fetch recent pages to find the specific change
    for page in range(1, 4):  # Check first 3 pages
        data = fetch_press_releases(page, 10)
        posts = data.get('posts', [])
        
        for post in posts:
            if str(post.get('ID', '')) == change_id:
                return process_press_release(post)
    
    return None

def get_stats() -> Dict:
    """Get statistics about monitored changes."""
    # Fetch first page to get counts
    data = get_all_changes(1, 10)
    changes = data['changes']
    
    critical_count = sum(1 for c in changes if c['riskLevel'] == 'critical')
    high_count = sum(1 for c in changes if c['riskLevel'] == 'high')
    
    return {
        "sourcesMonitored": 1,
        "totalSources": 1,
        "changesThisMonth": len(changes),
        "highRiskAlerts": high_count + critical_count,
        "criticalAlerts": critical_count
    }
