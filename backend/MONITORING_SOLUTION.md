# MeitY Press Release Monitoring Solution

## Problem

The MeitY website (https://www.meity.gov.in) presented several challenges:

1. **JavaScript-rendered content**: The website uses Next.js, requiring JavaScript execution to load press releases
2. **Language issues**: The website defaults to Hindi, making content extraction difficult
3. **Complex scraping**: Initial attempts with Selenium faced language switching challenges

## Solution

Instead of scraping the rendered HTML, we discovered and use the **MeitY WordPress API** directly:

### API Endpoint

```
https://www.meity.gov.in/cms/wp-json/document/documents
```

### Parameters

- `type`: "Press Release"
- `limit`: 10 (items per page)
- `page`: 1 (page number)

### Advantages

1. **No Selenium required**: Simple HTTP requests with the `requests` library
2. **English by default**: API returns English content without language switching
3. **Structured data**: Clean JSON response with all metadata
4. **Reliable**: Direct API access is more stable than web scraping
5. **Fast**: No browser overhead or JavaScript execution delays

## Implementation

The monitoring script (`backend/app/monitor.py`) now:

1. Makes a simple GET request to the API
2. Parses the JSON response
3. Filters press releases for DPDP-related keywords
4. Displays relevant items with title, date, and link

## Response Format

```json
{
  "posts": [
    {
      "ID": 21171,
      "post_title": "Secretary, MeitY, Shri S Krishnan lays Foundation Stone...",
      "post_date": "2025-01-21 13:02:04",
      "post_slug": "secretary-meity-shri-s-krishnan-lays-foundation-stone...",
      "post_content": "...",
      "post_excerpt": "...",
      ...
    }
  ],
  "total_items": 21,
  "total_pages": 3,
  "current_page": 1
}
```

## Keywords for Filtering

The script filters for DPDP Act-related content using these keywords:

- data, digital, personal, protection, privacy
- breach, consent, security, reporting, fiduciary
- board, penalty, dpdp, dpdpa

Press releases matching 2+ keywords are flagged as relevant.

## Usage

```bash
cd backend
source venv/bin/activate
python app/monitor.py
```

## Dependencies

- `requests`: HTTP client
- `re`: Regular expressions for text processing

No browser automation libraries needed!
