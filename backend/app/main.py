from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import test_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
    return {"message": "API running"}

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
