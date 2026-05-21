# Customer API Key Management
# Nexus Social Suite — Per-user model API keys

import os
import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

# Encrypted storage keys
KEY_FIELDS = {
    "openrouter_api_key": "OpenRouter",
    "huggingface_api_key": "HuggingFace",
    "gemini_api_key": "Google Gemini",
    "claude_api_key": "Anthropic Claude",
    "codex_api_key": "OpenAI (Codex/DALL-E)",
    "ollama_base_url": "Ollama URL",
    "stripe_secret_key": "Stripe",
    "meta_app_id": "Meta App ID",
    "meta_app_secret": "Meta App Secret",
}


class CustomerKeyManager:
    """Manages per-user API keys for AI models and integrations"""
    
    def __init__(self, db):
        self.db = db
    
    async def get_user_keys(self, user_id: int) -> Dict[str, Any]:
        """Get all API keys for a user (masked for display)"""
        keys = await self.db.get_customer_api_keys(user_id)
        if not keys:
            return {"models": {}, "integrations": {}}
        
        config = json.loads(keys.get("config", "{}"))
        return self._mask_keys(config)
    
    async def set_user_key(self, user_id: int, key_name: str, value: str) -> Dict[str, Any]:
        """Set a single API key for a user"""
        keys = await self.db.get_customer_api_keys(user_id)
        config = json.loads(keys.get("config", "{}")) if keys else {}
        config[key_name] = value
        config["updated_at"] = datetime.utcnow().isoformat()
        
        await self.db.upsert_customer_api_keys(user_id, json.dumps(config))
        return {"status": "ok", "key": key_name}
    
    async def delete_user_key(self, user_id: int, key_name: str) -> Dict[str, Any]:
        """Delete a specific API key"""
        keys = await self.db.get_customer_api_keys(user_id)
        if not keys:
            return {"status": "not_found"}
        
        config = json.loads(keys.get("config", "{}"))
        if key_name in config:
            del config[key_name]
            config["updated_at"] = datetime.utcnow().isoformat()
            await self.db.upsert_customer_api_keys(user_id, json.dumps(config))
        
        return {"status": "deleted", "key": key_name}
    
    async def get_effective_keys(self, user_id: int) -> Dict[str, str]:
        """Get actual (unmasked) keys for model routing.
        Falls back to system env vars if user hasn't set a key."""
        keys = await self.db.get_customer_api_keys(user_id)
        config = json.loads(keys.get("config", "{}")) if keys else {}
        
        effective = {}
        for field in KEY_FIELDS:
            effective[field] = config.get(field) or os.getenv(field.upper(), "")
        
        return effective
    
    def _mask_keys(self, config: Dict[str, str]) -> Dict[str, Any]:
        """Mask API keys for safe display"""
        models = {}
        integrations = {}
        
        for field, label in KEY_FIELDS.items():
            value = config.get(field, "")
            is_set = bool(value)
            masked = self._mask_value(value) if is_set else None
            
            if field in ("openrouter_api_key", "huggingface_api_key", "gemini_api_key", 
                         "claude_api_key", "codex_api_key", "ollama_base_url"):
                models[field] = {
                    "label": label,
                    "is_set": is_set,
                    "masked": masked,
                }
            else:
                integrations[field] = {
                    "label": label,
                    "is_set": is_set,
                    "masked": masked,
                }
        
        return {"models": models, "integrations": integrations}
    
    def _mask_value(self, value: str) -> str:
        """Mask a value showing only first 4 and last 4 chars"""
        if len(value) <= 8:
            return "****"
        return value[:4] + "..." + value[-4:]
