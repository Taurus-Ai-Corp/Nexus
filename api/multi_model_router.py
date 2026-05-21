import asyncio
# Multi-Model Provider Router
# Nexus Social Suite — Unified LLM interface for campaign generation
# Supports: Ollama, OpenRouter, HuggingFace, Gemini, Claude, Codex

import os
import httpx
import json
import logging
from typing import Dict, Any, Optional, List, AsyncIterator
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)


class ModelProvider(Enum):
    OLLAMA = "ollama"
    OPENROUTER = "openrouter"
    HUGGINGFACE = "huggingface"
    GEMINI = "gemini"
    CLAUDE = "claude"
    CODEX = "codex"


class ModelCapability(Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    EMBEDDING = "embedding"
    CODE = "code"


# Model registry with capabilities
MODEL_REGISTRY = {
    # Ollama models (local/self-hosted)
    "llama3": {"provider": "ollama", "capabilities": [ModelCapability.TEXT], "context": 8192},
    "qwen2.5-coder": {"provider": "ollama", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 32768},
    "llava": {"provider": "ollama", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 4096},
    
    # OpenRouter models
    "anthropic/claude-sonnet-4.6": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 200000},
    "anthropic/claude-opus-4.7": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 200000},
    "openai/gpt-5.2": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 128000},
    "google/gemini-2.5-pro": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 1000000},
    "google/gemini-2.5-flash": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 1000000},
    "deepseek/deepseek-v3.2": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT], "context": 128000},
    "qwen/qwen3-coder": {"provider": "openrouter", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 131072},
    
    # HuggingFace models
    "meta-llama/Llama-3.1-8B-Instruct": {"provider": "huggingface", "capabilities": [ModelCapability.TEXT], "context": 8192},
    "mistralai/Mistral-7B-Instruct-v0.3": {"provider": "huggingface", "capabilities": [ModelCapability.TEXT], "context": 32768},
    
    # Gemini (direct) - includes media generation
    "gemini-2.5-flash": {"provider": "gemini", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 1000000},
    "gemini-2.5-pro": {"provider": "gemini", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 1000000},
    "imagen-3": {"provider": "gemini", "capabilities": [ModelCapability.IMAGE], "context": 0},
    "veo-3": {"provider": "gemini", "capabilities": [ModelCapability.VIDEO], "context": 0},
    
    # Claude (direct)
    "claude-sonnet-4-20250514": {"provider": "claude", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 200000},
    "claude-opus-4-20250514": {"provider": "claude", "capabilities": [ModelCapability.TEXT, ModelCapability.CODE], "context": 200000},
    
    # Codex (OpenAI)
    "gpt-4o": {"provider": "codex", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 128000},
    "gpt-4o-mini": {"provider": "codex", "capabilities": [ModelCapability.TEXT, ModelCapability.IMAGE], "context": 128000},
    "o3": {"provider": "codex", "capabilities": [ModelCapability.TEXT], "context": 200000},
}


class MultiModelRouter:
    """Routes requests to any model provider with unified interface"""
    
    def __init__(self, api_keys: Optional[Dict[str, str]] = None):
        """
        api_keys: {
            "ollama_base_url": "http://localhost:11434",
            "openrouter_api_key": "sk-or-...",
            "huggingface_api_key": "hf_...",
            "gemini_api_key": "AIza...",
            "claude_api_key": "sk-ant-...",
            "codex_api_key": "sk-..."  # OpenAI
        }
        """
        self.api_keys = api_keys or {}
        self._resolve_keys()
    
    def _resolve_keys(self):
        """Resolve API keys from user config -> env -> defaults"""
        self.ollama_url = self.api_keys.get("ollama_base_url") or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.openrouter_key = self.api_keys.get("openrouter_api_key") or os.getenv("OPENROUTER_API_KEY", "")
        self.huggingface_key = self.api_keys.get("huggingface_api_key") or os.getenv("HUGGINGFACE_API_KEY", "")
        self.gemini_key = self.api_keys.get("gemini_api_key") or os.getenv("GEMINI_API_KEY", "")
        self.claude_key = self.api_keys.get("claude_api_key") or os.getenv("ANTHROPIC_API_KEY", "")
        self.codex_key = self.api_keys.get("codex_api_key") or os.getenv("OPENAI_API_KEY", "")
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """Return all available models with their capabilities"""
        models = []
        for model_id, info in MODEL_REGISTRY.items():
            has_key = self._has_key_for_provider(info["provider"])
            models.append({
                "id": model_id,
                "provider": info["provider"],
                "capabilities": [c.value for c in info["capabilities"]],
                "context_window": info["context"],
                "available": has_key,
            })
        return models
    
    def _has_key_for_provider(self, provider: str) -> bool:
        if provider == "ollama":
            return True  # Ollama is local, no key needed
        key_map = {
            "openrouter": self.openrouter_key,
            "huggingface": self.huggingface_key,
            "gemini": self.gemini_key,
            "claude": self.claude_key,
            "codex": self.codex_key,
        }
        return bool(key_map.get(provider))
    
    async def generate_text(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        system_prompt: Optional[str] = None,
        json_schema: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Generate text using specified model"""
        if model not in MODEL_REGISTRY:
            raise ValueError(f"Unknown model: {model}")
        
        info = MODEL_REGISTRY[model]
        provider = info["provider"]
        
        if system_prompt and messages[0].get("role") != "system":
            messages = [{"role": "system", "content": system_prompt}] + messages
        
        dispatch = {
            "ollama": self._ollama_chat,
            "openrouter": self._openrouter_chat,
            "huggingface": self._huggingface_chat,
            "gemini": self._gemini_chat,
            "claude": self._claude_chat,
            "codex": self._codex_chat,
        }
        
        handler = dispatch.get(provider)
        if not handler:
            raise ValueError(f"Unsupported provider: {provider}")
        
        return await handler(model, messages, temperature, max_tokens, json_schema)
    
    async def generate_image(
        self,
        model: str,
        prompt: str,
        size: str = "1024x1024",
        n: int = 1,
    ) -> List[str]:
        """Generate images. Returns list of base64 or URLs"""
        if model not in MODEL_REGISTRY:
            raise ValueError(f"Unknown model: {model}")
        
        info = MODEL_REGISTRY[model]
        provider = info["provider"]
        
        if provider == "gemini":
            return await self._gemini_generate_image(model, prompt, size, n)
        elif provider == "codex":
            return await self._codex_generate_image(model, prompt, size, n)
        elif provider == "openrouter" and "image" in str(info["capabilities"]):
            return await self._openrouter_generate_image(model, prompt, size, n)
        
        raise ValueError(f"Model {model} does not support image generation")
    
    async def generate_video(
        self,
        model: str,
        prompt: str,
        duration_seconds: int = 5,
    ) -> str:
        """Generate video. Returns URL or base64"""
        if model not in MODEL_REGISTRY:
            raise ValueError(f"Unknown model: {model}")
        
        info = MODEL_REGISTRY[model]
        provider = info["provider"]
        
        if provider == "gemini" and ModelCapability.VIDEO in info["capabilities"]:
            return await self._gemini_generate_video(model, prompt, duration_seconds)
        
        raise ValueError(f"Model {model} does not support video generation")
    
    # ── Provider Implementations ──
    
    async def _ollama_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        async with httpx.AsyncClient(timeout=120) as client:
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False,
            }
            if json_schema:
                payload["format"] = json_schema
            
            resp = await client.post(f"{self.ollama_url}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return {
                "content": data.get("message", {}).get("content", ""),
                "model": model,
                "provider": "ollama",
                "usage": {"total_tokens": data.get("eval_count", 0)},
            }
    
    async def _openrouter_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        if not self.openrouter_key:
            raise ValueError("OpenRouter API key not configured")
        
        async with httpx.AsyncClient(timeout=120) as client:
            headers = {
                "Authorization": f"Bearer {self.openrouter_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://nexus-social-suite.vercel.app",
                "X-Title": "Nexus Social Suite",
            }
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if json_schema:
                payload["response_format"] = {"type": "json_object", "schema": json_schema}
            
            resp = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            choice = data["choices"][0]
            return {
                "content": choice["message"]["content"],
                "model": model,
                "provider": "openrouter",
                "usage": data.get("usage", {}),
            }
    
    async def _huggingface_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        if not self.huggingface_key:
            raise ValueError("HuggingFace API key not configured")
        
        async with httpx.AsyncClient(timeout=120) as client:
            headers = {"Authorization": f"Bearer {self.huggingface_key}"}
            # Convert messages to HF format
            prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "return_full_text": False,
                }
            }
            
            resp = await client.post(
                f"https://api-inference.huggingface.co/models/{model}",
                headers=headers, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            content = data[0]["generated_text"] if isinstance(data, list) else data["generated_text"]
            return {
                "content": content,
                "model": model,
                "provider": "huggingface",
                "usage": {},
            }
    
    async def _gemini_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        if not self.gemini_key:
            raise ValueError("Gemini API key not configured")
        
        async with httpx.AsyncClient(timeout=120) as client:
            # Convert messages to Gemini format
            contents = []
            for msg in messages:
                role = "model" if msg["role"] == "assistant" else "user"
                contents.append({"role": role, "parts": [{"text": msg["content"]}]})
            
            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": temperature,
                    "maxOutputTokens": max_tokens,
                }
            }
            if json_schema:
                payload["generationConfig"]["response_mime_type"] = "application/json"
                payload["generationConfig"]["response_schema"] = json_schema
            
            version = "v1beta"
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent",
                params={"key": self.gemini_key}, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            return {
                "content": content,
                "model": model,
                "provider": "gemini",
                "usage": {},
            }
    
    async def _claude_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        if not self.claude_key:
            raise ValueError("Claude API key not configured")
        
        async with httpx.AsyncClient(timeout=120) as client:
            headers = {
                "x-api-key": self.claude_key,
                "anthropic-version": "2024-02-01",
                "content-type": "application/json",
            }
            
            system_msg = None
            claude_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    system_msg = msg["content"]
                else:
                    claude_messages.append({"role": msg["role"], "content": msg["content"]})
            
            payload = {
                "model": model,
                "messages": claude_messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            if system_msg:
                payload["system"] = system_msg
            if json_schema:
                payload["response_format"] = {"type": "json_object"}
            
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            content = data["content"][0]["text"]
            return {
                "content": content,
                "model": model,
                "provider": "claude",
                "usage": data.get("usage", {}),
            }
    
    async def _codex_chat(self, model, messages, temperature, max_tokens, json_schema=None):
        if not self.codex_key:
            raise ValueError("OpenAI/Codex API key not configured")
        
        async with httpx.AsyncClient(timeout=120) as client:
            headers = {
                "Authorization": f"Bearer {self.codex_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if json_schema:
                payload["response_format"] = {"type": "json_object", "schema": json_schema}
            
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            choice = data["choices"][0]
            return {
                "content": choice["message"]["content"],
                "model": model,
                "provider": "codex",
                "usage": data.get("usage", {}),
            }
    
    async def _gemini_generate_image(self, model, prompt, size, n):
        """Generate images via Imagen 3"""
        if not self.gemini_key:
            raise ValueError("Gemini API key not configured")
        
        async with httpx.AsyncClient(timeout=300) as client:
            payload = {
                "instances": [{"prompt": prompt}],
                "parameters": {
                    "sampleCount": n,
                    "aspectRatio": size.replace("x", ":"),
                }
            }
            
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predict",
                params={"key": self.gemini_key}, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            images = []
            for pred in data.get("predictions", []):
                images.append(pred.get("bytesBase64Encoded", ""))
            return images
    
    async def _codex_generate_image(self, model, prompt, size, n):
        """Generate images via DALL-E"""
        if not self.codex_key:
            raise ValueError("OpenAI API key not configured")
        
        async with httpx.AsyncClient(timeout=300) as client:
            headers = {"Authorization": f"Bearer {self.codex_key}"}
            payload = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": n,
                "size": size,
                "quality": "hd",
            }
            
            resp = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            return [img.get("url", img.get("b64_json", "")) for img in data.get("data", [])]
    
    async def _openrouter_generate_image(self, model, prompt, size, n):
        """Generate images via OpenRouter-compatible endpoints"""
        # OpenRouter doesn't directly support image gen, fallback to codex
        return await self._codex_generate_image(model, prompt, size, n)
    
    async def _gemini_generate_video(self, model, prompt, duration_seconds):
        """Generate video via Veo 3"""
        if not self.gemini_key:
            raise ValueError("Gemini API key not configured")
        
        async with httpx.AsyncClient(timeout=600) as client:
            payload = {
                "prompt": prompt,
                "durationSeconds": duration_seconds,
                "aspectRatio": "16:9",
            }
            
            # Veo uses long-running operations
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predictLongRunning",
                params={"key": self.gemini_key}, json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            operation_name = data.get("name", "")
            
            # Poll for completion
            for _ in range(60):  # Max 5 minutes
                import asyncio; await asyncio.sleep(5)
                status_resp = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/{operation_name}",
                    params={"key": self.gemini_key}
                )
                status_data = status_resp.json()
                if status_data.get("done"):
                    return status_data.get("response", {}).get("videoUrl", "")
            
            raise TimeoutError("Video generation timed out")
