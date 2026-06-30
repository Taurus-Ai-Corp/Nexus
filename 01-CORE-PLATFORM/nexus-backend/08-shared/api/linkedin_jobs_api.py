"""Unified LinkedIn Jobs API for all TAURUS platforms."""

import logging
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Configure logging
logger = logging.getLogger(__name__)

# Import LinkedIn integration modules
try:
    import sys
    from pathlib import Path

    # Add LinkedIn integration to path
    linkedin_path = Path(__file__).parent.parent.parent / "subdomains" / "bizflow.taurusai.io" / "agents" / "integrations" / "linkedin"
    if linkedin_path.exists():
        sys.path.insert(0, str(linkedin_path.parent))

    from coop_builder import CoOpPositionBuilder, build_coop_position
    from infographic_generator import generate_job_infographic
    from job_generator import generate_job_description

    # Import Jobs API tools
    mcp_path = Path(__file__).parent.parent.parent / "subdomains" / "bizflow.taurusai.io" / "agents" / "integrations" / "mcp-agents" / "external-mcps" / "klavis" / "mcp_servers" / "linkedin" / "tools"
    if mcp_path.exists():
        sys.path.insert(0, str(mcp_path.parent))
        from tools.jobs import (
            close_job_posting,
            create_job_posting,
            get_job_posting,
            list_job_postings,
            update_job_posting,
        )
        JOBS_API_AVAILABLE = True
    else:
        JOBS_API_AVAILABLE = False

    COOP_BUILDER_AVAILABLE = True
except ImportError as e:
    logger.warning(f"LinkedIn integration modules not available: {e}")
    COOP_BUILDER_AVAILABLE = False
    JOBS_API_AVAILABLE = False

# FastAPI app (can be mounted to main app)
app = FastAPI(title="LinkedIn Jobs API", version="1.0.0")


# Request/Response models
class CoOpPositionRequest(BaseModel):
    """Request model for creating co-op positions."""
    platform: str = Field(..., description="Platform name (BizFlow, NeoVibe, AssetGrid, OrionGrid)")
    customizations: dict[str, Any] | None = Field(None, description="Optional customizations")


class JobPostingRequest(BaseModel):
    """Request model for posting jobs."""
    title: str
    description: str
    location: dict[str, Any]
    employmentType: str
    workLocationType: str | None = None
    skills: list[str] | None = None
    functions: list[str] | None = None
    applicationUrl: str | None = None


class InfographicRequest(BaseModel):
    """Request model for generating infographics."""
    job_data: dict[str, Any]
    platform: str | None = None
    output_format: str = "png"


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "jobs_api_available": JOBS_API_AVAILABLE,
        "coop_builder_available": COOP_BUILDER_AVAILABLE
    }


@app.post("/jobs/build-coop")
async def build_coop_endpoint(request: CoOpPositionRequest):
    """
    Build a co-op position for a TAURUS platform.
    
    Args:
        request: Co-op position request
    
    Returns:
        Built co-op position data
    """
    if not COOP_BUILDER_AVAILABLE:
        raise HTTPException(status_code=503, detail="Co-op builder not available")

    try:
        result = await build_coop_position(request.platform, request.customizations)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error building co-op position: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs/post")
async def post_job_endpoint(request: JobPostingRequest):
    """
    Post a job to LinkedIn.
    
    Args:
        request: Job posting request
    
    Returns:
        Posting result
    """
    if not JOBS_API_AVAILABLE:
        raise HTTPException(status_code=503, detail="LinkedIn Jobs API not available")

    try:
        job_data = request.dict()
        result = await create_job_posting(job_data)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error posting job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs/generate-infographic")
async def generate_infographic_endpoint(request: InfographicRequest):
    """
    Generate an infographic for a job posting.
    
    Args:
        request: Infographic request
    
    Returns:
        Infographic generation result
    """
    if not COOP_BUILDER_AVAILABLE:
        raise HTTPException(status_code=503, detail="Infographic generator not available")

    try:
        result = await generate_job_infographic(
            request.job_data,
            request.platform,
            request.output_format
        )
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error generating infographic: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/jobs/{job_id}")
async def get_job_endpoint(job_id: str):
    """
    Get a job posting by ID.
    
    Args:
        job_id: LinkedIn job posting ID
    
    Returns:
        Job posting details
    """
    if not JOBS_API_AVAILABLE:
        raise HTTPException(status_code=503, detail="LinkedIn Jobs API not available")

    try:
        result = await get_job_posting(job_id)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error getting job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/jobs")
async def list_jobs_endpoint(
    status: str | None = None,
    employmentType: str | None = None,
    limit: int = 10,
    start: int = 0
):
    """
    List job postings with filters.
    
    Args:
        status: Filter by status
        employmentType: Filter by employment type
        limit: Maximum number of results
        start: Pagination start index
    
    Returns:
        List of job postings
    """
    if not JOBS_API_AVAILABLE:
        raise HTTPException(status_code=503, detail="LinkedIn Jobs API not available")

    try:
        filters = {}
        if status:
            filters["status"] = status
        if employmentType:
            filters["employmentType"] = employmentType
        filters["limit"] = limit
        filters["start"] = start

        result = await list_job_postings(filters if filters else None)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error listing jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/jobs/{job_id}")
async def update_job_endpoint(job_id: str, updates: dict[str, Any]):
    """
    Update a job posting.
    
    Args:
        job_id: LinkedIn job posting ID
        updates: Dictionary of fields to update
    
    Returns:
        Update result
    """
    if not JOBS_API_AVAILABLE:
        raise HTTPException(status_code=503, detail="LinkedIn Jobs API not available")

    try:
        result = await update_job_posting(job_id, updates)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error updating job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs/{job_id}/close")
async def close_job_endpoint(job_id: str):
    """
    Close a job posting.
    
    Args:
        job_id: LinkedIn job posting ID
    
    Returns:
        Close result
    """
    if not JOBS_API_AVAILABLE:
        raise HTTPException(status_code=503, detail="LinkedIn Jobs API not available")

    try:
        result = await close_job_posting(job_id)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error closing job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

