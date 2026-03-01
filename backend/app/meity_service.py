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

def get_dummy_changes() -> List[Dict]:
    """Generate dummy high-risk changes for demonstration."""
    from datetime import datetime, timedelta
    
    now = datetime.now()
    
    return [
        {
            "id": "DEMO-001",
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": "MeitY announces mandatory data breach notification within 72 hours - New DPDP Act enforcement guidelines released",
            "detectedAt": (now - timedelta(hours=2)).isoformat() + 'Z',
            "riskLevel": "critical",
            "affectedSector": "Technology, Data Protection",
            "link": "https://www.meity.gov.in/documents/press-release/demo-breach-notification",
            "content": "The Ministry of Electronics and Information Technology has issued new enforcement guidelines under the Digital Personal Data Protection Act 2023. All Data Fiduciaries must now report personal data breaches affecting more than 1000 users to the Data Protection Board within 72 hours. Failure to comply will result in penalties up to ₹200 crores. The notification must include breach details, affected data categories, and remedial actions taken.",
            "matchedKeywords": ["data", "breach", "personal", "protection", "penalty", "reporting", "compliance"]
        },
        {
            "id": "DEMO-002",
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": "Data Protection Board releases consent management framework - Significant Data Fiduciaries must appoint DPO by March 2026",
            "detectedAt": (now - timedelta(hours=5)).isoformat() + 'Z',
            "riskLevel": "high",
            "affectedSector": "Technology, Data Protection",
            "link": "https://www.meity.gov.in/documents/press-release/demo-consent-framework",
            "content": "The Data Protection Board of India has released comprehensive guidelines for consent management under DPDP Act 2023. Organizations processing personal data of over 10 lakh users must implement consent management platforms by June 2026. Significant Data Fiduciaries must appoint a Data Protection Officer and conduct annual compliance audits. The framework mandates clear, specific, and informed consent for all data processing activities.",
            "matchedKeywords": ["data", "consent", "personal", "protection", "fiduciary", "compliance", "board"]
        },
        {
            "id": "DEMO-003",
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": "Cross-border data transfer restrictions updated - Prior approval required for sensitive personal data transfers",
            "detectedAt": (now - timedelta(days=1)).isoformat() + 'Z',
            "riskLevel": "high",
            "affectedSector": "Technology, Data Protection",
            "link": "https://www.meity.gov.in/documents/press-release/demo-cross-border-transfer",
            "content": "MeitY has updated regulations on cross-border transfer of personal data. Organizations must obtain prior approval from the Data Protection Board before transferring sensitive personal data outside India. Standard Contractual Clauses (SCCs) must be implemented for all international data transfers. Companies have 90 days to update their data transfer agreements and notify the Board of existing transfer arrangements.",
            "matchedKeywords": ["data", "personal", "protection", "security", "compliance", "board"]
        },
        {
            "id": "DEMO-004",
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": "Enhanced data security standards mandated - Encryption and access controls required for all personal data",
            "detectedAt": (now - timedelta(days=2)).isoformat() + 'Z',
            "riskLevel": "high",
            "affectedSector": "Technology, Data Protection",
            "link": "https://www.meity.gov.in/documents/press-release/demo-security-standards",
            "content": "The Ministry has issued technical standards for data security under DPDP Act 2023. All organizations processing personal data must implement encryption at rest and in transit, multi-factor authentication, and role-based access controls. Regular security audits and penetration testing are now mandatory. Organizations must maintain detailed logs of all data access and processing activities for audit purposes.",
            "matchedKeywords": ["data", "security", "personal", "protection", "compliance"]
        },
        {
            "id": "DEMO-005",
            "sourceName": "MeitY Press Release",
            "sourceId": "meity",
            "changeSummary": "Data Principal Rights portal launched - Citizens can now request data deletion and correction online",
            "detectedAt": (now - timedelta(days=3)).isoformat() + 'Z',
            "riskLevel": "medium",
            "affectedSector": "Technology, Data Protection",
            "link": "https://www.meity.gov.in/documents/press-release/demo-rights-portal",
            "content": "MeitY has launched a centralized portal for Data Principals to exercise their rights under DPDP Act 2023. Citizens can now submit requests for data access, correction, and deletion directly through the portal. Organizations must respond to these requests within 30 days. The portal also allows users to file complaints with the Data Protection Board regarding non-compliance.",
            "matchedKeywords": ["data", "digital", "personal", "protection", "board"]
        }
    ]

def get_all_changes(page: int = 1, limit: int = 10) -> Dict:
    """Get all relevant press releases with pagination."""
    data = fetch_press_releases(page, limit)
    
    posts = data.get('posts', [])
    processed_changes = []
    seen_ids = set()  # Track seen IDs to avoid duplicates
    
    # Add dummy changes first (for demonstration)
    dummy_changes = get_dummy_changes()
    for dummy in dummy_changes:
        seen_ids.add(dummy['id'])
        processed_changes.append(dummy)
    
    # Then add real changes
    for post in posts:
        post_id = str(post.get('ID', ''))
        
        # Skip if we've already processed this ID
        if post_id in seen_ids:
            continue
            
        processed = process_press_release(post)
        if processed:
            seen_ids.add(post_id)
            processed_changes.append(processed)
    
    return {
        "changes": processed_changes,
        "total": len(processed_changes),
        "page": page,
        "limit": limit,
        "totalPages": 1
    }

def get_change_by_id(change_id: str) -> Optional[Dict]:
    """Get a specific press release by ID."""
    # Check dummy changes first
    dummy_changes = get_dummy_changes()
    for dummy in dummy_changes:
        if dummy['id'] == change_id:
            return dummy
    
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
