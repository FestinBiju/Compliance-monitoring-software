# Frontend-Backend Integration Guide

## Overview

The compliance monitoring platform now connects the frontend dashboard to live data from the MeitY Press Releases API.

## Architecture

```
Frontend (React) → Backend API (FastAPI) → MeitY WordPress API
```

## Backend Setup

### 1. New Files Created

- `backend/app/meity_service.py` - Service layer for fetching and processing MeitY data
- `backend/app/main.py` - Updated with new API endpoints

### 2. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/changes` | GET | Get all compliance changes (paginated) |
| `/api/changes/{id}` | GET | Get specific change by ID |
| `/api/stats` | GET | Get dashboard statistics |
| `/api/sources` | GET | Get list of monitored sources |

### 3. Start Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or using npm:

```bash
npm run dev
```

## Frontend Setup

### 1. New Files Created

- `frontend/src/hooks/useApi.ts` - Custom hook for API data fetching
- `frontend/src/app/components/dashboard-page-live.tsx` - Live dashboard with real data
- `frontend/src/services/api.ts` - Updated with TypeScript types and specific API methods

### 2. Updated Files

- `frontend/src/app/routes.ts` - Now uses live dashboard component

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:5173

## Data Flow

1. **Frontend** makes request to backend API (e.g., `/api/changes`)
2. **Backend** calls `meity_service.py` functions
3. **Service** fetches data from MeitY WordPress API
4. **Service** processes and filters data for DPDP relevance
5. **Backend** returns formatted JSON to frontend
6. **Frontend** displays data in dashboard

## Features

### Dashboard

- **Live Statistics**: Sources monitored, changes this month, risk alerts
- **Recent Changes**: Latest 5 DPDP-related press releases
- **Risk Distribution**: Visual breakdown by risk level
- **Monitored Sources**: Status of MeitY press release monitoring

### Data Processing

The backend automatically:
- Fetches press releases from MeitY API
- Filters for DPDP-related keywords (data, digital, personal, protection, privacy, etc.)
- Calculates risk levels based on keyword matches
- Formats dates and links
- Removes HTML from content

### Risk Levels

- **Critical**: 5+ keywords or 2+ high-priority keywords (breach, penalty, violation)
- **High**: 3-4 keywords
- **Medium**: 2 keywords
- **Low**: Minimal matches

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Get changes
curl http://localhost:8000/api/changes

# Get stats
curl http://localhost:8000/api/stats
```

### Test Frontend

1. Start both backend and frontend
2. Open http://localhost:5173
3. Dashboard should show live data from MeitY
4. Check browser console for any errors

## Environment Variables

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Backend

Already configured in `backend/.env`

## Troubleshooting

### CORS Errors

The backend is configured to allow requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (alternative)

If you use a different port, update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:YOUR_PORT"],
    ...
)
```

### No Data Showing

1. Check backend is running: http://localhost:8000/health
2. Check API response: http://localhost:8000/api/changes
3. Check browser console for errors
4. Verify MeitY API is accessible

### Loading Forever

- Check network tab in browser dev tools
- Verify backend API is responding
- Check for JavaScript errors in console

## Next Steps

1. **Add Changes Feed Page**: Update `changes-feed-page.tsx` to use live data
2. **Add Change Detail Page**: Fetch individual change details
3. **Add Pagination**: Implement page navigation for changes
4. **Add Filtering**: Filter by risk level, date range, keywords
5. **Add Caching**: Cache API responses to reduce load
6. **Add Database**: Store changes in PostgreSQL for history
7. **Add Notifications**: Alert on new critical changes
8. **Add Scheduling**: Run monitor script periodically

## API Response Examples

### GET /api/changes

```json
{
  "changes": [
    {
      "id": "21171",
      "sourceName": "MeitY Press Release",
      "sourceId": "meity",
      "changeSummary": "Secretary, MeitY, Shri S Krishnan lays Foundation Stone...",
      "detectedAt": "2025-01-21T13:02:04Z",
      "riskLevel": "medium",
      "affectedSector": "Technology, Data Protection",
      "link": "https://www.meity.gov.in/documents/press-release/...",
      "content": "...",
      "matchedKeywords": ["data", "digital", "security"]
    }
  ],
  "total": 21,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### GET /api/stats

```json
{
  "sourcesMonitored": 1,
  "totalSources": 1,
  "changesThisMonth": 10,
  "highRiskAlerts": 2,
  "criticalAlerts": 0
}
```
