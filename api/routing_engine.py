# Three-Tier AI Routing Engine
# TAURUS AI CORP - FZCO | NeoSync™
# Routes tasks: Local Ollama → OpenRouter Cloud → HuggingFace Inference

import os
import httpx
import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "hermes-4-14b")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL", "meta-llama/Llama-3.1-8B-Instruct")


class AIRoutingError(Exception):
    pass


class ThreeTierRouter:
    """Intelligent AI model router with automatic 3-tier fallback"""

    ROUTING_TABLE = {
        "nlp_interpret": {
            "tier1": {"type": "ollama", "model": "llama3"},
            "tier2": {"type": "openrouter", "model": "anthropic/claude-sonnet-4.6"},
            "tier3": {"type": "huggingface", "model": "meta-llama/Llama-3.1-8B-Instruct"},
        },
        "nlp_iterate": {
            "tier1": {"type": "ollama", "model": "llama3"},
            "tier2": {"type": "openrouter", "model": "openai/gpt-5.2"},
            "tier3": {"type": "huggingface", "model": "mistralai/Mistral-7B-Instruct-v0.3"},
        },
        "content_generation": {
            "tier1": {"type": "ollama", "model": "llama3"},
            "tier2": {"type": "openrouter", "model": "openai/gpt-5.2"},
            "tier3": {"type": "openrouter", "model": "google/gemma-4-26b-a4b-it:free"},
        },
        "bulk_content": {
            "tier1": {"type": "ollama", "model": "llama3"},
            "tier2": {"type": "openrouter", "model": "deepseek/deepseek-v3.2"},
            "tier3": {"type": "openrouter", "model": "minimax/minimax-m2.5:free"},
        },
        "code_generation": {
            "tier1": {"type": "ollama", "model": "qwen2.5-coder:7b"},
            "tier2": {"type": "openrouter", "model": "qwen/qwen3-coder"},
            "tier3": {"type": "openrouter", "model": "qwen/qwen3-coder:free"},
        },
        "embeddings": {
            "tier1": {"type": "local", "model": "sentence-transformers"},
            "tier2": {"type": "openrouter", "model": "qwen/qwen3-embedding-8b"},
            "tier3": {"type": "openrouter", "model": "baai/bge-m3"},
        },
        "image_analysis": {
            "tier1": None,
            "tier2": {"type": "openrouter", "model": "google/gemini-2.5-flash"},
            "tier3": {"type": "openrouter", "model": "nvidia/nemotron-nano-12b-v2-vl:free"},
        },
        "agent_orchestration": {
            "tier1": {"type": "ollama", "model": "deepseek-v3.1:671b-cloud"},
            "tier2": {"type": "openrouter", "model": "anthropic/claude-opus-4.7"},
            "tier3": {"type": "openrouter", "model": "google/gemini-2.5-pro"},
        },
        "trending_research": {
            "tier1": None,
            "tier2": {"type": "openrouter", "model": "perplexity/sonar"},
            "tier3": {"type": "openrouter", "model": "perplexity/sonar-pro"},
        },
    }

    async def route(
        self,
        task_type: str,
        prompt: str,
        system_prompt: str = "",
        messages: Optional[List[Dict]] = None,
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> Dict[str, Any]:
        """Route task through 3-tier system with automatic fallback"""
        routes = self.ROUTING_TABLE.get(task_type, self.ROUTING_TABLE["nlp_interpret"])

        result = {
            "task_type": task_type,
            "prompt": prompt[:100] + "...",
            "tiers_attempted": [],
            "success": False,
            "response": None,
            "model_used": None,
            "tier": None,
            "latency_ms": 0,
            "cost_estimate": 0,
        }

        for tier_name in ["tier1", "tier2", "tier3"]:
            route = routes.get(tier_name)
            if route is None:
                result["tiers_attempted"].append({"tier": tier_name, "status": "skipped", "reason": "no route configured"})
                continue

            tier_num = int(tier_name[-1])
            start = datetime.utcnow()

            try:
                if route["type"] == "ollama":
                    response = await self._call_ollama(route["model"], prompt, system_prompt, messages, max_tokens, temperature)
                    result.update({
                        "success": True,
                        "response": response,
                        "model_used": route["model"],
                        "tier": f"tier{tier_num} (local/free)",
                        "latency_ms": int((datetime.utcnow() - start).total_seconds() * 1000),
                        "cost_estimate": 0,
                    })
                    result["tiers_attempted"].append({"tier": tier_name, "status": "success", "model": route["model"]})
                    return result

                elif route["type"] == "openrouter":
                    response = await self._call_openrouter(route["model"], prompt, system_prompt, messages, max_tokens, temperature)
                    result.update({
                        "success": True,
                        "response": response,
                        "model_used": route["model"],
                        "tier": f"tier{tier_num} (cloud/paid)",
                        "latency_ms": int((datetime.utcnow() - start).total_seconds() * 1000),
                        "cost_estimate": self._estimate_cost(route["model"], prompt),
                    })
                    result["tiers_attempted"].append({"tier": tier_name, "status": "success", "model": route["model"]})
                    return result

                elif route["type"] == "huggingface":
                    response = await self._call_huggingface(route["model"], prompt, system_prompt, max_tokens)
                    result.update({
                        "success": True,
                        "response": response,
                        "model_used": route["model"],
                        "tier": f"tier{tier_num} (open/HF)",
                        "latency_ms": int((datetime.utcnow() - start).total_seconds() * 1000),
                        "cost_estimate": 0,
                    })
                    result["tiers_attempted"].append({"tier": tier_name, "status": "success", "model": route["model"]})
                    return result

                elif route["type"] == "local":
                    response = await self._call_local_embeddings(prompt)
                    result.update({
                        "success": True,
                        "response": response,
                        "model_used": route["model"],
                        "tier": f"tier{tier_num} (local/free)",
                        "latency_ms": int((datetime.utcnow() - start).total_seconds() * 1000),
                        "cost_estimate": 0,
                    })
                    result["tiers_attempted"].append({"tier": tier_name, "status": "success", "model": route["model"]})
                    return result

            except Exception as e:
                result["tiers_attempted"].append({
                    "tier": tier_name,
                    "status": "failed",
                    "model": route.get("model", "unknown"),
                    "error": str(e)[:200],
                })
                logger.warning(f"Tier {tier_name} ({route.get('model')}) failed: {e}")
                continue

        result["tiers_attempted"].append({"tier": "all", "status": "failed", "reason": "all tiers exhausted"})
        raise AIRoutingError(f"All 3 tiers failed for task_type={task_type}. Attempts: {result['tiers_attempted']}")

    async def _call_ollama(self, model: str, prompt: str, system_prompt: str, messages: Optional[List[Dict]], max_tokens: int, temperature: float) -> str:
        """Call local Ollama model"""
        url = f"{OLLAMA_BASE_URL}/api/chat"
        if messages:
            payload = {"model": model, "messages": messages, "stream": False, "options": {"num_predict": max_tokens, "temperature": temperature}}
        else:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt or "You are a helpful AI assistant for a social media management platform."},
                    {"role": "user", "content": prompt},
                ],
                "stream": False,
                "options": {"num_predict": max_tokens, "temperature": temperature},
            }

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise AIRoutingError(f"Ollama error: {resp.status_code} {resp.text}")
            data = resp.json()
            return data.get("message", {}).get("content", "")

    async def _call_openrouter(self, model: str, prompt: str, system_prompt: str, messages: Optional[List[Dict]], max_tokens: int, temperature: float) -> str:
        """Call OpenRouter cloud API"""
        if not OPENROUTER_API_KEY:
            raise AIRoutingError("OPENROUTER_API_KEY not configured")

        url = f"{OPENROUTER_BASE_URL}/chat/completions"
        if messages:
            payload = {"model": model, "messages": messages, "max_tokens": max_tokens, "temperature": temperature}
        else:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt or "You are a helpful AI assistant for a social media management platform."},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": max_tokens,
                "temperature": temperature,
            }

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://neosync.taurusai.io",
            "X-OpenRouter-Title": "NeoSync Social Suite",
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code != 200:
                raise AIRoutingError(f"OpenRouter error: {resp.status_code} {resp.text}")
            data = resp.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content", "")

    async def _call_huggingface(self, model: str, prompt: str, system_prompt: str, max_tokens: int) -> str:
        """Call Hugging Face Inference API"""
        if not HUGGINGFACE_API_KEY:
            raise AIRoutingError("HUGGINGFACE_API_KEY not configured")

        url = f"https://api-inference.huggingface.co/models/{model}"
        full_prompt = f"{system_prompt}\n\nUser: {prompt}\nAssistant:" if system_prompt else prompt
        payload = {
            "inputs": full_prompt,
            "parameters": {"max_new_tokens": max_tokens, "return_full_text": False, "temperature": 0.7},
        }

        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}", "Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code != 200:
                raise AIRoutingError(f"HuggingFace error: {resp.status_code} {resp.text}")
            data = resp.json()
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("generated_text", "")
            return json.dumps(data)

    async def _call_local_embeddings(self, text: str) -> Dict[str, Any]:
        """Generate embeddings using local sentence-transformers via HF MCP"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "http://hf-mcp:8000/embed",
                    json={"texts": [text] if isinstance(text, str) else text},
                )
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass
        raise AIRoutingError("Local embedding service unavailable")

    def _estimate_cost(self, model: str, prompt: str) -> float:
        """Estimate OpenRouter cost for a prompt (rough estimate)"""
        token_count = len(prompt.split()) * 1.3
        prices = {
            "anthropic/claude-sonnet-4.6": {"input": 3.0, "output": 15.0},
            "openai/gpt-5.2": {"input": 1.75, "output": 14.0},
            "deepseek/deepseek-v3.2": {"input": 0.252, "output": 0.378},
            "qwen/qwen3-coder": {"input": 0.22, "output": 1.80},
            "google/gemini-2.5-flash": {"input": 0.30, "output": 2.50},
        }
        price = prices.get(model, {"input": 1.0, "output": 5.0})
        return round((token_count / 1_000_000) * price["input"] * 1.05, 6)

    def get_available_models(self) -> Dict[str, List[str]]:
        """List all configured models by tier"""
        result = {"tier1_local": [], "tier2_cloud": [], "tier3_open": []}
        for task_type, routes in self.ROUTING_TABLE.items():
            for tier_name, route in routes.items():
                if route is None:
                    continue
                if route["type"] == "ollama":
                    if route["model"] not in result["tier1_local"]:
                        result["tier1_local"].append(route["model"])
                elif route["type"] == "openrouter":
                    if route["model"] not in result["tier2_cloud"]:
                        result["tier2_cloud"].append(route["model"])
                elif route["type"] == "huggingface":
                    if route["model"] not in result["tier3_open"]:
                        result["tier3_open"].append(route["model"])
        return result


router = ThreeTierRouter()
