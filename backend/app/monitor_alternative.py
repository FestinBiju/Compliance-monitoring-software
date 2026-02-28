import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re

BASE_URL = "https://pib.gov.in"
PIB_RELEASES_URL = "https://pib.gov.in/allRel.aspx"

KEYWORDS = [
    "data", "digital", "personal", "protection", "privacy", 
    "breach", "consent", "security", "reporting", "fiduciary", 
    "board", "penalty"
]

def fetch_and_filter_press_releases():
    print("Fetching PIB press releases (Ministry of Electronics & IT)...")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        params = {
            'relid': '0',
            'lang': '1',
            'state': '0',
            'ministry': '54'  # Ministry of Electronics & IT
        }
        
        response = requests.get(PIB_RELEASES_URL, headers=headers, params=params, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching press releases: {e}")
        return
    
    soup = BeautifulSoup(response.content, "lxml")
    
    items = []
    relevant_items = []
    
    # PIB uses specific structure for press releases
    press_items = soup.find_all("div", class_="content-area")
    
    if not press_items:
        press_items = soup.find_all("div", class_="main-div")
    
    if not press_items:
        # Try finding all links in content area
        content_area = soup.find("div", id="content") or soup.find("div", class_="container")
        if content_area:
            press_items = content_area.find_all("a", href=True)
    
    for item in press_items:
        try:
            if item.name == "a":
                title_tag = item
                parent = item.parent
            else:
                title_tag = item.find("a")
                parent = item
            
            if not title_tag:
                continue
            
            title = title_tag.get_text(strip=True)
            
            if not title or len(title) < 15:
                continue
            
            # Skip navigation links
            if any(x in title.lower() for x in ["home", "about", "contact", "login", "skip", "menu"]):
                continue
            
            link = title_tag.get("href", "")
            if not link:
                continue
            
            if not link.startswith("http"):
                link = urljoin(BASE_URL, link)
            
            # Extract date
            date = "N/A"
            if parent:
                date_patterns = [
                    r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
                    r'\d{4}[-/]\d{1,2}[-/]\d{1,2}',
                    r'\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}'
                ]
                parent_text = parent.get_text()
                for pattern in date_patterns:
                    date_match = re.search(pattern, parent_text, re.IGNORECASE)
                    if date_match:
                        date = date_match.group()
                        break
            
            # Extract snippet
            snippet = ""
            if parent:
                snippet_tag = parent.find(["p", "div", "span"], class_=lambda x: x and ("desc" in str(x).lower() or "content" in str(x).lower()))
                if snippet_tag:
                    snippet = snippet_tag.get_text(strip=True)[:300]
                elif parent.name in ["p", "div"]:
                    snippet = parent.get_text(strip=True)[:300]
            
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
    
    # Remove duplicates based on title
    seen_titles = set()
    unique_items = []
    for item in items:
        if item["title"] not in seen_titles:
            seen_titles.add(item["title"])
            unique_items.append(item)
    
    seen_relevant = set()
    unique_relevant = []
    for item in relevant_items:
        if item["title"] not in seen_relevant:
            seen_relevant.add(item["title"])
            unique_relevant.append(item)
    
    print(f"Total items found: {len(unique_items)}")
    print(f"Relevant DPDP-related items found: {len(unique_relevant)}")
    print()
    
    if len(unique_items) == 0:
        print("Warning: No items found.")
        print("The website structure may have changed or requires JavaScript rendering.")
        return
    
    for item in unique_relevant:
        print(f"Title: {item['title']}")
        print(f"Date: {item['date']}")
        print(f"Link: {item['link']}")
        print(f"Matched Keywords: {', '.join(item['matched_keywords'])}")
        print("-" * 80)

if __name__ == "__main__":
    fetch_and_filter_press_releases()
