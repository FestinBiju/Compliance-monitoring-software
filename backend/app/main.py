from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from app.db import test_db_connection
from app.meity_service import get_all_changes, get_change_by_id, get_stats
from app.knowledge import initialize_knowledge_base, get_cached_company_profile, get_cached_compliance_knowledge
from app.rag_agent import retrieve_relevant_obligation, construct_prompt, call_gemini_api
from app.auto_analyzer import get_analysis_for_change, get_cache_stats, clear_cache

app = FastAPI(title="Compliance Monitoring API")

# Global variables for knowledge base
company_profile = {}
compliance_knowledge = {}

# Analysis history (in-memory for now)
analysis_history = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for RAG agent
class AnalyzeRequest(BaseModel):
    update_text: str

@app.on_event("startup")
async def startup():
    global company_profile, compliance_knowledge
    
    # Load knowledge base
    company_profile, compliance_knowledge = initialize_knowledge_base()
    
    # Test database connection
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
        return {
            "status": "healthy" if connected else "unhealthy",
            "database": "connected" if connected else "disconnected",
            "knowledge_base": {
                "company_profile_loaded": bool(company_profile),
                "compliance_knowledge_loaded": bool(compliance_knowledge),
                "obligations_count": len(compliance_knowledge.get("obligations", []))
            }
        }
    except Exception as e:
        return {"status": "unhealthy", "database": "error", "error": str(e)}

@app.get("/api/changes")
def get_changes(page: int = 1, limit: int = 10, auto_analyze: bool = False):
    """
    Get all compliance changes from MeitY press releases.
    
    If auto_analyze=true, automatically analyzes high/critical risk items
    and includes cached analysis results.
    """
    try:
        result = get_all_changes(page, limit)
        
        # If auto_analyze is enabled, add analysis to changes
        if auto_analyze:
            for change in result['changes']:
                analysis = get_analysis_for_change(change)
                if analysis:
                    change['ai_analysis'] = analysis
        
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

@app.get("/api/knowledge/company-profile")
def get_company_profile():
    """Get the company profile."""
    return get_cached_company_profile()

@app.get("/api/knowledge/compliance")
def get_compliance():
    """Get compliance knowledge base."""
    return get_cached_compliance_knowledge()

@app.get("/api/knowledge/obligations")
def get_obligations():
    """Get all compliance obligations."""
    knowledge = get_cached_compliance_knowledge()
    return {
        "framework": knowledge.get("framework", "Unknown"),
        "obligations": knowledge.get("obligations", []),
        "total": len(knowledge.get("obligations", []))
    }

@app.get("/api/knowledge/obligations/{obligation_id}")
def get_obligation(obligation_id: str):
    """Get a specific obligation by ID."""
    knowledge = get_cached_compliance_knowledge()
    obligations = knowledge.get("obligations", [])
    
    for obligation in obligations:
        if obligation.get("id") == obligation_id:
            return obligation
    
    raise HTTPException(status_code=404, detail="Obligation not found")

@app.post("/api/analyze-update")
def analyze_update(request: AnalyzeRequest):
    """Analyze a regulatory update using RAG agent."""
    try:
        # Get knowledge base
        knowledge = get_cached_compliance_knowledge()
        profile = get_cached_company_profile()
        
        if not knowledge or not profile:
            raise HTTPException(status_code=500, detail="Knowledge base not loaded")
        
        # Retrieve relevant obligation
        obligation = retrieve_relevant_obligation(request.update_text, knowledge)
        
        # Construct prompt and call Gemini
        prompt = construct_prompt(profile, request.update_text, obligation)
        result = call_gemini_api(prompt)
        
        # Check for errors
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Add retrieved obligation to response
        result['retrieved_obligation'] = obligation
        
        # Save to history
        analysis_entry = {
            "id": len(analysis_history) + 1,
            "timestamp": datetime.now().isoformat(),
            "update_text": request.update_text,
            "result": result
        }
        analysis_history.append(analysis_entry)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analysis-history")
def get_analysis_history():
    """Get history of all analyses."""
    return {"analyses": list(reversed(analysis_history))}  # Most recent first

@app.get("/api/cache-stats")
def get_analysis_cache_stats():
    """Get statistics about the analysis cache."""
    return get_cache_stats()

@app.post("/api/clear-cache")
def clear_analysis_cache():
    """Clear the analysis cache."""
    try:
        clear_cache()
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/changes/{change_id}/analysis")
def get_change_analysis(change_id: str):
    """Get AI analysis for a specific change (from cache or by analyzing)."""
    try:
        change = get_change_by_id(change_id)
        if not change:
            raise HTTPException(status_code=404, detail="Change not found")
        
        analysis = get_analysis_for_change(change)
        if not analysis:
            raise HTTPException(status_code=404, detail="No analysis available for this change")
        
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
