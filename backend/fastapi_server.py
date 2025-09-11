from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import time
from agent_runner import get_pipeline_runner

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Analysis Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vusercontent.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
current_analysis = {
    "status": "idle",
    "current_agent": None,
    "progress": 0,
    "error": None,
    "timestamp": time.time(),
    "is_running": False
}

# Initialize pipeline runner
pipeline_runner = get_pipeline_runner()

class AnalysisRequest(BaseModel):
    query: str

class AnalysisResponse(BaseModel):
    status: str
    message: str
    task_id: str

def status_callback(status: dict):
    """Callback to update current analysis status"""
    global current_analysis
    current_analysis.update(status)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def start_analysis(request: AnalysisRequest):
    """Start the analysis pipeline"""
    if pipeline_runner.is_running:
        raise HTTPException(status_code=400, detail="Analysis already running")
    
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Set callback and start pipeline
    pipeline_runner.set_status_callback(status_callback)
    pipeline_runner.run_pipeline_async(request.query)
    
    return AnalysisResponse(
        status="started",
        message="Analysis pipeline started successfully",
        task_id=f"analysis_{int(time.time())}"
    )

@app.get("/api/status")
async def get_analysis_status():
    """Get current analysis status"""
    return current_analysis

@app.get("/api/results")
async def get_analysis_results():
    """Get analysis results"""
    if current_analysis["status"] != "completed":
        raise HTTPException(status_code=400, detail="Analysis not completed yet")
    
    from real_agents import analysis_results
    return {
        "query": analysis_results.get("query", ""),
        "scrape_results": analysis_results.get("scrape_results", ""),
        "cleaned_data": analysis_results.get("cleaned_data", ""),
        "eda_output": analysis_results.get("eda_output", ""),
        "model_info": analysis_results.get("model_info", ""),
        "final_answer": analysis_results.get("final_answer", ""),
        "processing_time": current_analysis.get("timestamp", 0) - current_analysis.get("start_time", 0) if current_analysis.get("start_time") else None,
        "data_sources": analysis_results.get("scrape_results", "").count("Title:") if analysis_results.get("scrape_results") else 0,
        "characters_processed": len(analysis_results.get("cleaned_data", "")),
        "agent_actions": 6
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Analysis Dashboard API",
        "pipeline_running": pipeline_runner.is_running,
        "timestamp": time.time()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Analysis Dashboard API - Real Agent System",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "analyze": "/api/analyze",
            "status": "/api/status",
            "results": "/api/results"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")