"""
Production monitoring script for MeitY press releases.

This script uses the MeitY WordPress API to fetch press releases directly.
No Selenium required - the API returns English content by default.

API Endpoint: https://www.meity.gov.in/cms/wp-json/document/documents
Parameters:
  - type: "Press Release"
  - limit: 10 (items per page)
  - page: 1 (page number)

For testing with mock data, run: python app/monitor_mock.py
"""

import requests
from urllib.parse import urljoin
import re

BASE_URL = "https://www.meity.gov.in"
API_URL = "https://www.meity.gov.in/cms/wp-json/document/documents"

# Keywords in English for filtering
KEYWORDS = [
    "data", "digital", "personal", "protection", "privacy", 
    "breach", "consent", "security", "reporting", "fiduciary", 
    "board", "penalty", "dpdp", "dpdpa"
]

def fetch_and_filter_press_releases():
    print("Fetching MeitY press releases via API...")
    print(f"API: {API_URL}")
    print()
    
    params = {
        "type": "Press Release",
        "limit": 10,
        "page": 1
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
    }
    
    try:
        response = requests.get(API_URL, params=params, headers=headers, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        if not isinstance(data, dict) or 'posts' not in data:
            print("❌ Error: Unexpected API response format")
            return
        
        posts = data.get('posts', [])
        total_items = data.get('total_items', 0)
        
        print(f"Total press releases available: {total_items}")
        print(f"Fetched: {len(posts)} items")
        print()
        
    except requests.RequestException as e:
        print(f"❌ Error fetching from API: {e}")
        print("\nFor testing, run: python app/monitor_mock.py")
        return
    except Exception as e:
        print(f"❌ Error processing API response: {e}")
        print("\nFor testing, run: python app/monitor_mock.py")
        return
    
    items = []
    relevant_items = []
    
    for post in posts:
        try:
            title = post.get('post_title', '').strip()
            
            if not title or len(title) < 20:
                continue
            
            # Extract date
            date = post.get('post_date', 'N/A')
            if date and date != 'N/A':
                # Format: 2025-01-21 13:02:04 -> 21 Jan 2025
                try:
                    from datetime import datetime
                    dt = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
                    date = dt.strftime('%d %b %Y')
                except:
                    pass
            
            # Get link - use post_slug to construct proper URL
            post_slug = post.get('post_slug', '')
            if post_slug:
                link = f"{BASE_URL}/documents/press-release/{post_slug}"
            else:
                link = post.get('guid', '')
            
            # Extract snippet from content or excerpt
            snippet = post.get('post_excerpt', '') or post.get('post_content', '')
            if snippet:
                # Remove HTML tags
                snippet = re.sub(r'<[^>]+>', '', snippet)
                snippet = snippet.strip()[:300]
            
            items.append({
                "title": title,
                "date": date,
                "link": link,
                "snippet": snippet
            })
            
            # Filter by keywords
            combined_text = f"{title} {snippet}".lower()
            matched_keywords = [kw for kw in KEYWORDS if kw in combined_text]
            
            if len(matched_keywords) >= 2:
                relevant_items.append({
                    "title": title,
                    "date": date,
                    "link": link,
                    "matched_keywords": matched_keywords
                })
        
        except Exception:
            continue
    
    print(f"Total items processed: {len(items)}")
    print(f"Relevant DPDP-related items found: {len(relevant_items)}")
    print()
    
    if len(items) == 0:
        print("⚠️  Warning: No items found.")
        print("The API may have changed or returned unexpected data.")
        print("\nFor testing, run: python app/monitor_mock.py")
        return
    
    if len(relevant_items) == 0:
        print("ℹ️  No DPDP-related press releases found.")
        print("This is normal if there haven't been recent announcements.")
        print("\nShowing first 5 items found:")
        for item in items[:5]:
            print(f"- {item['title'][:80]}...")
        return
    
    print("=" * 80)
    for item in relevant_items:
        print(f"Title: {item['title']}")
        print(f"Date: {item['date']}")
        print(f"Link: {item['link']}")
        print(f"Matched Keywords: {', '.join(item['matched_keywords'])}")
        print("=" * 80)

if __name__ == "__main__":
    fetch_and_filter_press_releases()
