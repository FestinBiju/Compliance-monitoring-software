from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db import test_db_connection
from app.meity_service import get_all_changes, get_change_by_id, get_stats

app = FastAPI(title="Compliance Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    try:
        connected = await test_db_connection()
        if connected:
            print("✓ Database connection successful")
        else:
            print("✗ Database connection failed")
    except Exception as e:
        print(f"✗ Database connection error: {e}")

@app.get("/")
def root():
    return {"message": "Compliance Monitoring API", "version": "1.0.0"}

@app.get("/health")
async def health():
    try:
        connected = await test_db_connection()
        if connected:
            return {"status": "healthy", "database": "connected"}
        else:
            return {"status": "unhealthy", "database": "disconnected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "error", "error": str(e)}

@app.get("/api/changes")
def get_changes(page: int = 1, limit: int = 10):
    """Get all compliance changes from MeitY press releases."""
    try:
        result = get_all_changes(page, limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/changes/{change_id}")
def get_change(change_id: str):
    """Get a specific change by ID."""
    try:
        change = get_change_by_id(change_id)
        if not change:
            raise HTTPException(status_code=404, detail="Change not found")
        return change
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
def get_dashboard_stats():
    """Get dashboard statistics."""
    try:
        return get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sources")
def get_sources():
    """Get list of monitored sources."""
    return {
        "sources": [
            {
                "id": "meity",
                "name": "MeitY Press Releases",
                "category": "Government",
                "url": "https://www.meity.gov.in/documents/press-release",
                "status": "active",
                "monitoring": True,
                "lastChecked": None
            }
        ]
    }
