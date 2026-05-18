"""
🤖 Local AI Router - Smart Model Selection for the AI Empire
Routes requests between local Ollama models and cloud AI services
"""

import os
import asyncio
import logging
from typing import Dict, List, Optional, Any
from enum import Enum
import time

import ollama
import openai
import anthropic
from anthropic import AsyncAnthropic
from groq import AsyncGroq

logger = logging.getLogger(__name__)

class ModelType(Enum):
    LOCAL = "local"
    CLOUD = "cloud"
    HYBRID = "hybrid"

class TaskComplexity(Enum):
    SIMPLE = "simple"
    MODERATE = "moderate" 
    COMPLEX = "complex"
    SPECIALIZED = "specialized"

class LocalAIRouter:
    """Smart AI model router for the Local AI Empire"""
    
    def __init__(self):
        self.ollama_client = None
        self.claude_client = None
        self.openai_client = None
        self.groq_client = None
        
        # Routing configuration
        self.mode = os.getenv("MODE", "local")
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.cost_limit_daily = float(os.getenv("DAILY_COST_LIMIT", "5.0"))
        
        # Usage tracking
        self.daily_costs = {"claude": 0.0, "openai": 0.0, "perplexity": 0.0}
        self.request_count = {"local": 0, "cloud": 0}
        self.last_model_used = None
        self.is_ready = False
        
        # Model capabilities mapping
        self.local_models = {
            "llama3.1:8b": {"context": 8192, "best_for": ["general", "chat", "simple_tasks"]},
            "codellama:13b": {"context": 4096, "best_for": ["code", "programming", "analysis"]},  
            "mistral:7b": {"context": 8192, "best_for": ["fast_response", "simple_chat"]},
            "phi3:mini": {"context": 4096, "best_for": ["lightweight", "quick_tasks"]},
            "nomic-embed-text": {"context": 2048, "best_for": ["embeddings", "similarity"]}
        }
        
        # Smart routing rules
        self.routing_rules = {
            TaskComplexity.SIMPLE: {"prefer": "local", "models": ["phi3:mini", "mistral:7b"]},
            TaskComplexity.MODERATE: {"prefer": "local", "models": ["llama3.1:8b", "codellama:13b"]},
            TaskComplexity.COMPLEX: {"prefer": "cloud", "fallback": "llama3.1:8b"},
            TaskComplexity.SPECIALIZED: {"prefer": "cloud", "fallback": "codellama:13b"}
        }
    
    async def initialize(self):
        """Initialize the AI router"""
        try:
            logger.info("🤖 Initializing Local AI Router...")
            
            # Initialize Ollama client
            self.ollama_client = ollama.AsyncClient(host=self.ollama_url)
            
            # Initialize cloud clients (only if API keys provided)
            if os.getenv("ANTHROPIC_API_KEY"):
                self.claude_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
                logger.info("☁️ Claude client initialized")
            
            if os.getenv("OPENAI_API_KEY"):
                self.openai_client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                logger.info("☁️ OpenAI client initialized")
            
            if os.getenv("GROQ_API_KEY"):
                self.groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
                logger.info("☁️ Groq client initialized")
            
            # Check Ollama status
            await self.check_ollama_status()
            
            # Pull essential models if not present
            await self.ensure_essential_models()
            
            self.is_ready = True
            logger.info("✅ Local AI Router ready")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize AI Router: {e}")
            self.is_ready = False
    
    async def check_ollama_status(self) -> str:
        """Check if Ollama is running and accessible"""
        try:
            models = await self.ollama_client.list()
            logger.info(f"🦙 Ollama connected: {len(models['models'])} models available")
            return "connected"
        except Exception as e:
            logger.warning(f"⚠️ Ollama not accessible: {e}")
            return "disconnected"
    
    async def ensure_essential_models(self):
        """Ensure essential models are available locally"""
        essential_models = ["llama3.1:8b", "phi3:mini"]
        
        try:
            models = await self.ollama_client.list()
            available_models = [model['name'] for model in models['models']]
            
            for model in essential_models:
                if model not in available_models:
                    logger.info(f"📥 Pulling essential model: {model}")
                    await self.ollama_client.pull(model)
                    logger.info(f"✅ Model {model} ready")
                    
        except Exception as e:
            logger.warning(f"⚠️ Could not ensure essential models: {e}")
    
    async def route_request(self, 
                           task_type: str, 
                           complexity: TaskComplexity = TaskComplexity.MODERATE,
                           model_preference: str = "auto") -> str:
        """Smart routing logic for AI requests"""
        
        # Override: If specific model requested
        if model_preference != "auto":
            if model_preference in self.local_models:
                return f"local:{model_preference}"
            elif model_preference in ["claude", "gpt-4", "gpt-3.5", "groq", "llama3-70b", "llama3-8b"]:
                if self.within_cost_budget():
                    return f"cloud:{model_preference}"
                else:
                    logger.warning("💰 Cost limit exceeded, falling back to local")
        
        # Development mode: Always prefer local
        if self.mode == "development":
            return f"local:{self._select_best_local_model(task_type, complexity)}"
        
        # Production routing based on complexity
        routing_rule = self.routing_rules.get(complexity, self.routing_rules[TaskComplexity.MODERATE])
        
        if routing_rule["prefer"] == "local":
            return f"local:{routing_rule['models'][0]}"
        
        elif routing_rule["prefer"] == "cloud" and self.within_cost_budget():
            if self.groq_client: return "cloud:groq"
            return "cloud:claude"
        
        else:
            # Fallback to local
            fallback_model = routing_rule.get("fallback", "llama3.1:8b")
            return f"local:{fallback_model}"
    
    def _select_best_local_model(self, task_type: str, complexity: TaskComplexity) -> str:
        """Select the best local model for the task"""
        
        # Code-related tasks
        if "code" in task_type.lower() or "programming" in task_type.lower():
            return "codellama:13b"
        
        # Simple/fast tasks  
        if complexity == TaskComplexity.SIMPLE:
            return "phi3:mini"
        
        # Complex tasks
        if complexity == TaskComplexity.COMPLEX:
            return "llama3.1:8b"
        
        # Default
        return "llama3.1:8b"
    
    async def chat_completion(self, 
                            messages: List[Dict], 
                            model_preference: str = "auto",
                            max_tokens: int = 1000,
                            temperature: float = 0.7) -> Dict[str, Any]:
        """Handle chat completion with smart routing"""
        
        # Determine complexity based on message content
        complexity = self._analyze_complexity(messages)
        
        # Route the request
        selected_model = await self.route_request("chat", complexity, model_preference)
        model_type, model_name = selected_model.split(":", 1)
        
        self.last_model_used = selected_model
        
        try:
            if model_type == "local":
                return await self._local_chat_completion(
                    messages, model_name, max_tokens, temperature
                )
            else:
                return await self._cloud_chat_completion(
                    messages, model_name, max_tokens, temperature
                )
        except Exception as e:
            logger.error(f"❌ Chat completion failed for {selected_model}: {e}")
            # Fallback to local
            return await self._local_chat_completion(
                messages, "llama3.1:8b", max_tokens, temperature
            )
    
    async def _local_chat_completion(self, messages, model, max_tokens, temperature):
        """Handle local Ollama chat completion"""
        self.request_count["local"] += 1
        
        # Convert messages to Ollama format
        prompt = self._convert_messages_to_prompt(messages)
        
        response = await self.ollama_client.generate(
            model=model,
            prompt=prompt,
            options={
                "num_predict": max_tokens,
                "temperature": temperature
            }
        )
        
        return {
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": response["response"]
                },
                "finish_reason": "stop"
            }],
            "model": f"local:{model}",
            "usage": {
                "total_tokens": len(response["response"].split()),
                "cost": 0.0
            }
        }
    
    async def _cloud_chat_completion(self, messages, model, max_tokens, temperature):
        """Handle cloud API chat completion"""
        self.request_count["cloud"] += 1
        
        if model == "claude" and self.claude_client:
            # Convert to Claude format
            claude_messages = []
            system_message = None
            
            for msg in messages:
                if msg["role"] == "system":
                    system_message = msg["content"]
                else:
                    claude_messages.append(msg)
            
            response = await self.claude_client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_message,
                messages=claude_messages
            )
            
            # Track costs (approximate)
            cost = (response.usage.input_tokens * 0.00025 + 
                   response.usage.output_tokens * 0.00125) / 1000
            self.daily_costs["claude"] += cost
            
            return {
                "choices": [{
                    "message": {
                        "role": "assistant",
                        "content": response.content[0].text
                    },
                    "finish_reason": response.stop_reason
                }],
                "model": f"cloud:claude",
                "usage": {
                    "total_tokens": response.usage.input_tokens + response.usage.output_tokens,
                    "cost": cost
                }
            }
        
        if model == "groq" and self.groq_client:
            response = await self.groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return {
                "choices": [{
                    "message": {
                        "role": "assistant",
                        "content": response.choices[0].message.content
                    },
                    "finish_reason": response.choices[0].finish_reason
                }],
                "model": f"cloud:groq",
                "usage": {
                    "total_tokens": response.usage.total_tokens,
                    "cost": 0.0 # Groq is free for now or very cheap
                }
            }
        
        # If no cloud client available, fallback to local
        return await self._local_chat_completion(messages, "llama3.1:8b", max_tokens, temperature)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text with smart routing"""
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat_completion(messages, **kwargs)
        return response["choices"][0]["message"]["content"]
    
    def _convert_messages_to_prompt(self, messages: List[Dict]) -> str:
        """Convert chat messages to a single prompt for Ollama"""
        prompt_parts = []
        
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                prompt_parts.append(f"System: {content}\n")
            elif role == "user":
                prompt_parts.append(f"Human: {content}\n")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}\n")
        
        prompt_parts.append("Assistant:")
        return "\n".join(prompt_parts)
    
    def _analyze_complexity(self, messages: List[Dict]) -> TaskComplexity:
        """Analyze message complexity to determine routing"""
        full_text = " ".join([msg.get("content", "") for msg in messages])
        
        # Simple heuristics
        if len(full_text) < 100:
            return TaskComplexity.SIMPLE
        
        # Check for complex keywords
        complex_keywords = [
            "analyze", "complex", "detailed", "comprehensive", "research",
            "algorithm", "optimization", "architecture", "strategy"
        ]
        
        if any(keyword in full_text.lower() for keyword in complex_keywords):
            return TaskComplexity.COMPLEX
        
        return TaskComplexity.MODERATE
    
    def within_cost_budget(self) -> bool:
        """Check if we're within the daily cost budget"""
        total_cost = sum(self.daily_costs.values())
        return total_cost < self.cost_limit_daily
    
    async def get_available_models(self) -> Dict[str, List[str]]:
        """Get all available models (local + cloud)"""
        local_models = []
        cloud_models = []
        
        # Get local models
        try:
            models = await self.ollama_client.list()
            local_models = [model['name'] for model in models['models']]
        except:
            pass
        
        # Cloud models (based on available API keys)
        if self.claude_client:
            cloud_models.append("claude-3-haiku-20240307")
        if self.openai_client:
            cloud_models.extend(["gpt-3.5-turbo", "gpt-4"])
        
        return {
            "local": local_models,
            "cloud": cloud_models,
            "routing_rules": {
                "development_mode": self.mode == "development",
                "cost_limit": self.cost_limit_daily,
                "current_costs": self.daily_costs
            }
        }
    
    async def get_cloud_usage_stats(self) -> Dict[str, Any]:
        """Get cloud usage statistics"""
        return {
            "daily_costs": self.daily_costs,
            "request_counts": self.request_count,
            "cost_limit": self.cost_limit_daily,
            "budget_remaining": max(0, self.cost_limit_daily - sum(self.daily_costs.values())),
            "last_model_used": self.last_model_used
        }
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("🧹 Cleaning up AI Router resources")
        # Close any open connections
        pass