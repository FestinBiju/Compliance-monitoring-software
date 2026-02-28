import requests
from bs4 import BeautifulSoup

PRESS_RELEASES_URL = "https://www.meity.gov.in/content/press-releases"

response = requests.get(PRESS_RELEASES_URL, timeout=10)
soup = BeautifulSoup(response.content, "lxml")

# Save HTML for inspection
with open("page_structure.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())

print("HTML saved to page_structure.html")

# Try different selectors
print("\n=== Testing different selectors ===")
print(f"views-row: {len(soup.find_all('div', class_='views-row'))}")
print(f"article: {len(soup.find_all('article'))}")
print(f"item-list: {len(soup.find_all('div', class_='item-list'))}")
print(f"view-content: {len(soup.find_all('div', class_='view-content'))}")
print(f"All divs: {len(soup.find_all('div'))}")
print(f"All links: {len(soup.find_all('a'))}")

# Find all classes
all_classes = set()
for tag in soup.find_all(True):
    if tag.get('class'):
        all_classes.update(tag.get('class'))

print(f"\nAll classes found: {sorted(list(all_classes))[:20]}")
