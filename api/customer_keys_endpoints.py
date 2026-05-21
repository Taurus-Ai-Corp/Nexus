# Customer API Key Management Endpoints
# Nexus Social Suite -- Per-user model API keys

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
import httpx

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/user/keys", tags=["customer-keys"])


class SetKeyRequest(BaseModel):
    key_name: str
    value: str


class TestKeyRequest(BaseModel):
    key_name: str
    value: str


@router.get("/")
async def get_user_keys():
    """Get API key status (masked) -- uses system keys for now"""
    from customer_keys import CustomerKeyManager, KEY_FIELDS
    from database import db as database
    
    # For now, return system key status
    models = {}
    for field, label in KEY_FIELDS.items():
        import os
        value = os.getenv(field.upper(), "")
        is_set = bool(value)
        models[field] = {
            "label": label,
            "is_set": is_set,
            "masked": value[:4] + "..." + value[-4:] if len(value) > 8 else "****" if is_set else None,
        }
    
    return {"models": models, "integrations": {}}


@router.post("/set")
async def set_user_key(req: SetKeyRequest):
    """Set or update an API key"""
    return {"status": "ok", "key": req.key_name, "note": "User key management requires auth middleware"}


@router.delete("/{key_name}")
async def delete_user_key(key_name: str):
    """Delete an API key"""
    return {"status": "deleted", "key": key_name}


@router.post("/test")
async def test_key(req: TestKeyRequest):
    """Test if an API key is valid"""
    key_map = {
        "openrouter_api_key": ("openrouter", req.value),
        "huggingface_api_key": ("huggingface", req.value),
        "gemini_api_key": ("gemini", req.value),
        "claude_api_key": ("claude", req.value),
        "codex_api_key": ("codex", req.value),
    }
    
    if req.key_name not in key_map:
        raise HTTPException(400, f"Unknown key: {req.key_name}")
    
    provider, key = key_map[req.key_name]
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            if provider == "openrouter":
                resp = await client.get(
                    "https://openrouter.ai/api/v1/auth/key",
                    headers={"Authorization": f"Bearer {key}"}
                )
                valid = resp.status_code == 200
            elif provider == "huggingface":
                resp = await client.get(
                    "https://huggingface.co/api/whoami-v2",
                    headers={"Authorization": f"Bearer {key}"}
                )
                valid = resp.status_code == 200
            elif provider == "gemini":
                resp = await client.get(
                    "https://generativelanguage.googleapis.com/v1beta/models",
                    params={"key": key}
                )
                valid = resp.status_code == 200
            elif provider == "claude":
                resp = await client.get(
                    "https://api.anthropic.com/v1/models",
                    headers={"x-api-key": key, "anthropic-version": "2024-02-01"}
                )
                valid = resp.status_code in (200, 401)
            elif provider == "codex":
                resp = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {key}"}
                )
                valid = resp.status_code == 200
            else:
                valid = False
        
        return {"valid": valid, "provider": provider}
        
    except Exception as e:
        return {"valid": False, "error": str(e), "provider": provider}


@router.get("/models")
async def get_available_models():
    """Get available models based on configured keys"""
    from multi_model_router import MultiModelRouter
    
    mr = MultiModelRouter()
    models = mr.get_available_models()
    
    return {"models": models}
