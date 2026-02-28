# Quick Start Guide

## Get the App Running in 3 Steps

### Step 1: Start the Database

```bash
docker-compose up -d
```

### Step 2: Start the Backend

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
npm run dev
```

Backend will run at http://localhost:8000

### Step 3: Start the Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run at http://localhost:5173

## What You'll See

The dashboard displays live data from MeitY (Ministry of Electronics and Information Technology) press releases:

- **Recent Changes**: Latest DPDP Act-related announcements
- **Statistics**: Number of sources monitored, changes detected, risk alerts
- **Risk Distribution**: Visual breakdown of compliance changes by severity
- **Monitored Sources**: Status of MeitY press release monitoring

## How It Works

1. **Backend** fetches press releases from MeitY WordPress API
2. **Backend** filters for DPDP-related keywords (data, privacy, protection, etc.)
3. **Backend** calculates risk levels based on content
4. **Frontend** displays the data in a clean dashboard

## Test the API

```bash
# Health check
curl http://localhost:8000/health

# Get changes
curl http://localhost:8000/api/changes

# Get statistics
curl http://localhost:8000/api/stats
```

## Troubleshooting

### Backend won't start

Make sure you activated the virtual environment:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### Frontend shows no data

1. Check backend is running: http://localhost:8000/health
2. Check browser console for errors (F12)
3. Verify CORS is configured correctly

### Database connection failed

Make sure Docker is running and PostgreSQL container is up:
```bash
docker-compose ps
```

## Next Steps

- Explore the Changes Feed page to see all detected changes
- Check the Sources page to manage monitored sources
- Review the System Status page for health checks

For detailed integration information, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
