# NLP Pipeline API Endpoints
# Nexus Social Suite -- LLM-powered campaign generation

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/nlp", tags=["nlp-pipeline"])


class NLPCommandRequest(BaseModel):
    command: str
    model: Optional[str] = None
    generate_visuals: bool = True
    auto_launch: bool = False


@router.get("/models")
async def list_available_models():
    """List all available models"""
    from multi_model_router import MultiModelRouter, MODEL_REGISTRY, ModelCapability
    mr = MultiModelRouter()
    models = mr.get_available_models()
    return {"models": models}


@router.post("/interpret")
async def interpret_command(req: NLPCommandRequest):
    """Interpret a natural language command"""
    from llm_nlp_engine import LLMNLPInterpreter
    from multi_model_router import MultiModelRouter
    
    mr = MultiModelRouter()
    model = req.model or "anthropic/claude-sonnet-4.6"
    nlp = LLMNLPInterpreter(router=mr, default_model=model)
    
    start = time.time()
    result = await nlp.interpret_command(req.command, model=model)
    elapsed = int((time.time() - start) * 1000)
    
    return {**result, "processing_time_ms": elapsed}


@router.post("/generate-campaign")
async def generate_campaign(req: NLPCommandRequest):
    """Execute full campaign generation pipeline"""
    from campaign_generator import CampaignPipeline
    from llm_nlp_engine import LLMNLPInterpreter
    from multi_model_router import MultiModelRouter
    
    mr = MultiModelRouter()
    model = req.model or "anthropic/claude-sonnet-4.6"
    nlp = LLMNLPInterpreter(router=mr, default_model=model)
    pipeline = CampaignPipeline(router=mr, nlp=nlp)
    
    result = await pipeline.execute_pipeline(
        command=req.command,
        user_id=0,  # TODO: get from auth
        model=model,
        generate_visuals=req.generate_visuals,
        auto_launch=req.auto_launch,
    )
    
    return result


@router.post("/generate-copy")
async def generate_copy(brief: Dict[str, Any], model: Optional[str] = None):
    """Generate ad copy variations only"""
    from campaign_generator import CampaignPipeline
    from llm_nlp_engine import LLMNLPInterpreter
    from multi_model_router import MultiModelRouter
    
    mr = MultiModelRouter()
    model = model or "anthropic/claude-sonnet-4.6"
    nlp = LLMNLPInterpreter(router=mr, default_model=model)
    pipeline = CampaignPipeline(router=mr, nlp=nlp)
    
    copies = await pipeline.generate_copy_only(brief, model=model)
    return {"copies": copies}


@router.post("/generate-visual")
async def generate_visual(prompt: str, model: str = "imagen-3", size: str = "1080x1080", n: int = 3):
    """Generate ad visuals only"""
    from multi_model_router import MultiModelRouter
    
    mr = MultiModelRouter()
    images = await mr.generate_image(model=model, prompt=prompt, size=size, n=n)
    return {"images": images, "model": model}
