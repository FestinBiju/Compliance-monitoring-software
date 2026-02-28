"""
Mock version of the monitor script for testing the filtering logic.
This demonstrates how the script will work once proper web scraping is set up.
"""

KEYWORDS = [
    "data", "digital", "personal", "protection", "privacy", 
    "breach", "consent", "security", "reporting", "fiduciary", 
    "board", "penalty"
]

# Mock press releases data
MOCK_PRESS_RELEASES = [
    {
        "title": "MeitY launches Digital India initiative for rural connectivity",
        "date": "15-02-2026",
        "link": "https://www.meity.gov.in/press/digital-india-rural",
        "snippet": "Ministry announces new digital infrastructure program to connect rural areas with high-speed internet."
    },
    {
        "title": "New Data Protection and Privacy Board constituted under DPDP Act",
        "date": "10-02-2026",
        "link": "https://www.meity.gov.in/press/dpdp-board-constituted",
        "snippet": "The government has constituted the Data Protection Board to oversee compliance with personal data protection regulations and handle breach reporting."
    },
    {
        "title": "Guidelines issued for consent management in digital platforms",
        "date": "05-02-2026",
        "link": "https://www.meity.gov.in/press/consent-guidelines",
        "snippet": "MeitY releases comprehensive guidelines for obtaining user consent for personal data processing by data fiduciaries."
    },
    {
        "title": "India hosts international cybersecurity summit",
        "date": "01-02-2026",
        "link": "https://www.meity.gov.in/press/cyber-summit",
        "snippet": "Global leaders discuss cybersecurity challenges and digital cooperation."
    },
    {
        "title": "Penalty framework announced for data protection violations",
        "date": "28-01-2026",
        "link": "https://www.meity.gov.in/press/penalty-framework",
        "snippet": "Data Protection Board announces penalty structure for breaches of personal data protection and privacy regulations, with fines up to Rs 250 crore."
    },
    {
        "title": "MeitY celebrates National Technology Day",
        "date": "20-01-2026",
        "link": "https://www.meity.gov.in/press/tech-day",
        "snippet": "Ministry organizes events across the country to celebrate technological achievements."
    },
    {
        "title": "New security standards for digital payment systems",
        "date": "15-01-2026",
        "link": "https://www.meity.gov.in/press/payment-security",
        "snippet": "Enhanced security protocols mandated for all digital payment platforms to protect user data and prevent fraud."
    },
    {
        "title": "Data localization norms updated for cloud service providers",
        "date": "10-01-2026",
        "link": "https://www.meity.gov.in/press/data-localization",
        "snippet": "New guidelines require certain categories of personal and sensitive data to be stored within India's borders."
    },
]

def fetch_and_filter_press_releases():
    print("Fetching MeitY press releases... (MOCK DATA)")
    print()
    
    items = MOCK_PRESS_RELEASES
    relevant_items = []
    
    for item in items:
        combined_text = f"{item['title']} {item['snippet']}".lower()
        matched_keywords = [kw for kw in KEYWORDS if kw in combined_text]
        
        if len(matched_keywords) >= 2:
            relevant_items.append({
                **item,
                "matched_keywords": matched_keywords
            })
    
    print(f"Total items found: {len(items)}")
    print(f"Relevant DPDP-related items found: {len(relevant_items)}")
    print()
    
    for item in relevant_items:
        print(f"Title: {item['title']}")
        print(f"Date: {item['date']}")
        print(f"Link: {item['link']}")
        print(f"Matched Keywords: {', '.join(item['matched_keywords'])}")
        print("-" * 80)

if __name__ == "__main__":
    fetch_and_filter_press_releases()
