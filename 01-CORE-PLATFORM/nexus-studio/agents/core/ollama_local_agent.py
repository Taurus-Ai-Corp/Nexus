"""
🦙 Taurus AI Corp. - Ollama Local AI Agent
Complete local AI model integration for zero-cost development
"""

import os
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union, AsyncGenerator
from datetime import datetime
import json
from enum import Enum

import ollama
from ollama import AsyncClient
from pydantic import BaseModel

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from registry.base_agent import BaseAgent
from registry.agent_registry import AgentMetadata

logger = logging.getLogger(__name__)

class ModelCapability(Enum):
    CHAT = "chat"
    CODE_GENERATION = "code_generation"
    TEXT_ANALYSIS = "text_analysis"
    SUMMARIZATION = "summarization"
    TRANSLATION = "translation"
    EMBEDDINGS = "embeddings"
    REASONING = "reasoning"
    CREATIVE_WRITING = "creative_writing"

class OllamaModel(BaseModel):
    name: str
    size: str
    capabilities: List[ModelCapability]
    context_length: int
    best_for: List[str]
    performance_tier: str  # "fast", "balanced", "quality"

class OllamaRequest(BaseModel):
    model: Optional[str] = None
    prompt: str
    task_type: str = "chat"
    max_tokens: int = 1000
    temperature: float = 0.7
    stream: bool = False
    system_message: Optional[str] = None
    context: Optional[List[Dict[str, str]]] = None

class OllamaResponse(BaseModel):
    response: str
    model_used: str
    execution_time: float
    tokens_generated: int
    cost: float = 0.0  # Always 0 for local models
    finish_reason: str
    metadata: Dict[str, Any] = {}

class OllamaLocalAgent(BaseAgent):
    """Local AI model agent using Ollama for zero-cost development"""
    
    def __init__(self):
        super().__init__()  # Call BaseAgent __init__
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.client: Optional[AsyncClient] = None
        self.available_models: Dict[str, OllamaModel] = {}
        self.model_recommendations = {}
        self.is_initialized = False
        
        # Model definitions with capabilities
        self.supported_models = {
            "llama3.1:8b": OllamaModel(
                name="llama3.1:8b",
                size="4.7GB",
                capabilities=[
                    ModelCapability.CHAT,
                    ModelCapability.REASONING,
                    ModelCapability.TEXT_ANALYSIS,
                    ModelCapability.SUMMARIZATION,
                    ModelCapability.CREATIVE_WRITING
                ],
                context_length=8192,
                best_for=["general_purpose", "reasoning", "analysis", "conversation"],
                performance_tier="quality"
            ),
            "phi3:mini": OllamaModel(
                name="phi3:mini",
                size="2.3GB",
                capabilities=[
                    ModelCapability.CHAT,
                    ModelCapability.CODE_GENERATION,
                    ModelCapability.REASONING
                ],
                context_length=4096,
                best_for=["quick_tasks", "lightweight", "code_assistance"],
                performance_tier="fast"
            ),
            "codellama:13b": OllamaModel(
                name="codellama:13b",
                size="7.3GB",
                capabilities=[
                    ModelCapability.CODE_GENERATION,
                    ModelCapability.TEXT_ANALYSIS,
                    ModelCapability.REASONING
                ],
                context_length=4096,
                best_for=["programming", "code_analysis", "technical_writing"],
                performance_tier="quality"
            ),
            "mistral:7b": OllamaModel(
                name="mistral:7b",
                size="4.1GB",
                capabilities=[
                    ModelCapability.CHAT,
                    ModelCapability.TEXT_ANALYSIS,
                    ModelCapability.SUMMARIZATION,
                    ModelCapability.TRANSLATION
                ],
                context_length=8192,
                best_for=["multilingual", "fast_response", "analysis"],
                performance_tier="balanced"
            ),
            "nomic-embed-text": OllamaModel(
                name="nomic-embed-text",
                size="274MB",
                capabilities=[ModelCapability.EMBEDDINGS],
                context_length=2048,
                best_for=["embeddings", "similarity", "search"],
                performance_tier="fast"
            )
        }
        
        # Task-to-model recommendations
        self.task_model_map = {
            "chat": ["llama3.1:8b", "phi3:mini", "mistral:7b"],
            "code": ["codellama:13b", "phi3:mini"],
            "analysis": ["llama3.1:8b", "mistral:7b"],
            "creative": ["llama3.1:8b", "mistral:7b"],
            "quick": ["phi3:mini", "mistral:7b"],
            "embeddings": ["nomic-embed-text"]
        }
    
    async def initialize(self):
        """Initialize the Ollama local agent"""
        try:
            logger.info("🦙 Initializing Ollama Local Agent...")
            
            # Initialize Ollama client
            self.client = AsyncClient(host=self.ollama_url)
            
            # Check Ollama connection
            await self._check_ollama_status()
            
            # Discover available models
            await self._discover_models()
            
            # Ensure essential models are available
            await self._ensure_essential_models()
            
            self.is_initialized = True
            logger.info("✅ Ollama Local Agent ready")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Ollama Local Agent: {e}")
            self.is_initialized = False
    
    async def _check_ollama_status(self) -> bool:
        """Check if Ollama service is running"""
        try:
            if self.client is None:
                logger.error("❌ Ollama client not initialized")
                return False
            models = await self.client.list()
            logger.info(f"🦙 Ollama connected: {len(models['models'])} models available")
            return True
        except Exception as e:
            logger.error(f"❌ Ollama connection failed: {e}")
            return False
    
    async def _discover_models(self):
        """Discover currently available models"""
        try:
            if self.client is None:
                logger.warning("⚠️ Ollama client not initialized")
                return
            response = await self.client.list()
            installed_models = {model['name'] for model in response['models']}
            
            # Map installed models to our supported models
            for model_name in installed_models:
                if model_name in self.supported_models:
                    self.available_models[model_name] = self.supported_models[model_name]
                    logger.info(f"✅ Model available: {model_name}")
                else:
                    # Create basic model info for unknown models
                    self.available_models[model_name] = OllamaModel(
                        name=model_name,
                        size="unknown",
                        capabilities=[ModelCapability.CHAT],
                        context_length=2048,
                        best_for=["general"],
                        performance_tier="unknown"
                    )
            
            logger.info(f"🔍 Discovered {len(self.available_models)} available models")
            
        except Exception as e:
            logger.warning(f"⚠️ Could not discover models: {e}")
    
    async def _ensure_essential_models(self):
        """Ensure essential models are installed"""
        essential_models = ["llama3.1:8b", "phi3:mini"]
        
        for model in essential_models:
            if model not in self.available_models:
                logger.info(f"📥 Pulling essential model: {model}")
                try:
                    if self.client is None:
                        logger.warning(f"⚠️ Ollama client not initialized, cannot pull {model}")
                        continue
                    await self.client.pull(model)
                    self.available_models[model] = self.supported_models[model]
                    logger.info(f"✅ Model {model} ready")
                except Exception as e:
                    logger.warning(f"⚠️ Could not pull {model}: {e}")
    
    def recommend_model(self, task_type: str, performance_preference: str = "balanced") -> str:
        """Recommend the best model for a given task"""
        
        # Get models suitable for the task
        suitable_models = self.task_model_map.get(task_type, ["llama3.1:8b"])
        
        # Filter by available models
        available_suitable = [m for m in suitable_models if m in self.available_models]
        
        if not available_suitable:
            # Fallback to any available model
            available_suitable = list(self.available_models.keys())
            if not available_suitable:
                return "llama3.1:8b"  # Ultimate fallback
        
        # Apply performance preference
        if performance_preference == "fast":
            # Prefer fast models
            for model in available_suitable:
                if self.available_models[model].performance_tier == "fast":
                    return model
        elif performance_preference == "quality":
            # Prefer quality models
            for model in available_suitable:
                if self.available_models[model].performance_tier == "quality":
                    return model
        
        # Return first available suitable model
        return available_suitable[0]
    
    async def chat_completion(self, request: OllamaRequest) -> OllamaResponse:
        """Generate chat completion using local Ollama model"""
        
        start_time = datetime.now()
        
        # Select model if not specified
        if not request.model:
            request.model = self.recommend_model(request.task_type)
        
        # Ensure model is available
        if request.model not in self.available_models:
            logger.warning(f"⚠️ Model {request.model} not available, using fallback")
            request.model = self.recommend_model("chat")
        
        try:
            # Prepare messages for chat format
            messages = []
            
            if request.system_message:
                messages.append({"role": "system", "content": request.system_message})
            
            if request.context:
                messages.extend(request.context)
            
            messages.append({"role": "user", "content": request.prompt})
            
            # Generate response
            if self.client is None:
                raise Exception("Ollama client not initialized")
            
            response = await self.client.chat(
                model=request.model,
                messages=messages,
                options={
                    "num_predict": request.max_tokens,
                    "temperature": request.temperature
                },
                stream=request.stream
            )
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            if request.stream:
                return await self._handle_streaming_response(response, request.model, execution_time)
            else:
                # Handle non-streaming response
                if isinstance(response, dict) and 'message' in response:
                    content = response['message'].get('content', '')
                    return OllamaResponse(
                        response=content,
                        model_used=f"local:{request.model}",
                        execution_time=execution_time,
                        tokens_generated=len(content.split()) if content else 0,
                        cost=0.0,  # Local models are free!
                        finish_reason="stop",
                        metadata={
                            "total_duration": response.get('total_duration', 0),
                            "load_duration": response.get('load_duration', 0),
                            "prompt_eval_count": response.get('prompt_eval_count', 0),
                            "eval_count": response.get('eval_count', 0)
                        }
                    )
                else:
                    # Fallback for unexpected response format
                    return OllamaResponse(
                        response=str(response),
                        model_used=f"local:{request.model}",
                        execution_time=execution_time,
                        tokens_generated=0,
                        cost=0.0,
                        finish_reason="error",
                        metadata={"error": "Unexpected response format"}
                    )
                
        except Exception as e:
            logger.error(f"❌ Chat completion failed: {e}")
            return OllamaResponse(
                response=f"Error: {str(e)}",
                model_used=f"local:{request.model}",
                execution_time=(datetime.now() - start_time).total_seconds(),
                tokens_generated=0,
                cost=0.0,
                finish_reason="error",
                metadata={"error": str(e)}
            )
    
    async def generate_text(self, 
                           prompt: str, 
                           model: Optional[str] = None,
                           max_tokens: int = 500,
                           temperature: float = 0.7) -> str:
        """Simple text generation interface"""
        
        request = OllamaRequest(
            model=model or "llama3.1:8b",
            prompt=prompt,
            task_type="chat",
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        response = await self.chat_completion(request)
        return response.response
    
    async def generate_code(self, 
                           description: str,
                           language: str = "python",
                           model: Optional[str] = None) -> str:
        """Generate code using the best available code model"""
        
        if not model:
            model = self.recommend_model("code")
        
        prompt = f"""Generate {language} code for the following requirement:

{description}

Please provide clean, well-commented code:"""
        
        request = OllamaRequest(
            model=model or "phi3:mini",
            prompt=prompt,
            task_type="code",
            max_tokens=1000,
            temperature=0.3,  # Lower temperature for code
            system_message=f"You are an expert {language} developer. Provide clean, efficient, and well-documented code."
        )
        
        response = await self.chat_completion(request)
        return response.response
    
    async def analyze_text(self, 
                          text: str, 
                          analysis_type: str = "summary",
                          model: Optional[str] = None) -> str:
        """Analyze text using local models"""
        
        if not model:
            model = self.recommend_model("analysis")
        
        analysis_prompts = {
            "summary": f"Provide a concise summary of the following text:\n\n{text}",
            "sentiment": f"Analyze the sentiment of the following text:\n\n{text}",
            "keywords": f"Extract the main keywords and topics from the following text:\n\n{text}",
            "insights": f"Provide key insights and analysis from the following text:\n\n{text}"
        }
        
        prompt = analysis_prompts.get(analysis_type, analysis_prompts["summary"])
        
        request = OllamaRequest(
            model=model or "llama3.1:8b",
            prompt=prompt,
            task_type="analysis",
            max_tokens=800,
            temperature=0.5
        )
        
        response = await self.chat_completion(request)
        return response.response
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts using local embedding model"""
        
        embeddings = []
        embedding_model = "nomic-embed-text"
        
        # Ensure embedding model is available
        if embedding_model not in self.available_models:
            logger.warning(f"⚠️ Embedding model {embedding_model} not available")
            try:
                if self.client is None:
                    logger.error("❌ Ollama client not initialized")
                    return []
                await self.client.pull(embedding_model)
                self.available_models[embedding_model] = self.supported_models[embedding_model]
            except Exception as e:
                logger.error(f"❌ Could not pull embedding model: {e}")
                return []
        
        try:
            if self.client is None:
                logger.error("❌ Ollama client not initialized")
                return []
            for text in texts:
                response = await self.client.embeddings(
                    model=embedding_model,
                    prompt=text
                )
                embeddings.append(response['embedding'])
            
            return embeddings
            
        except Exception as e:
            logger.error(f"❌ Embedding generation failed: {e}")
            return []
    
    async def _handle_streaming_response(self, 
                                       stream, 
                                       model: str, 
                                       execution_time: float) -> OllamaResponse:
        """Handle streaming response from Ollama"""
        full_response = ""
        
        try:
            async for chunk in stream:
                if isinstance(chunk, dict) and 'message' in chunk:
                    content = chunk['message'].get('content', '')
                    if content:
                        full_response += content
            
            return OllamaResponse(
                response=full_response,
                model_used=f"local:{model}",
                execution_time=execution_time,
                tokens_generated=len(full_response.split()),
                cost=0.0,
                finish_reason="stop",
                metadata={"streaming": True}
            )
            
        except Exception as e:
            logger.error(f"❌ Streaming response error: {e}")
            return OllamaResponse(
                response=full_response or f"Streaming error: {str(e)}",
                model_used=f"local:{model}",
                execution_time=execution_time,
                tokens_generated=len(full_response.split()) if full_response else 0,
                cost=0.0,
                finish_reason="error",
                metadata={"streaming_error": str(e)}
            )
    
    def get_capabilities(self) -> List[str]:
        """Return the capabilities of the Ollama Local Agent"""
        return [
            "local_ai_inference",
            "zero_cost_generation",
            "offline_capability",
            "chat_completion",
            "code_generation",
            "text_analysis",
            "text_summarization",
            "creative_writing",
            "reasoning_tasks",
            "embedding_generation",
            "multilingual_support",
            "streaming_responses",
            "model_recommendation",
            "performance_optimization",
            "privacy_preservation"
        ]
    
    def get_metadata(self) -> AgentMetadata:
        """Return agent metadata for registry"""
        return AgentMetadata(
            name="ollama_local",
            version="1.0.0",
            description="Local AI model agent using Ollama for zero-cost development. Provides chat completion, code generation, text analysis, and embeddings using local models like Llama 3.1, Phi-3, CodeLlama, and Mistral.",
            capabilities=self.get_capabilities(),
            dependencies=[
                "ollama>=0.1.7",
                "asyncio",
                "pydantic>=2.0.0"
            ],
            api_requirements=[
                "Ollama server running on localhost:11434",
                "At least 8GB RAM for quality models",
                "Local model storage space (4-8GB per model)"
            ],
            business_domains=["development", "content", "analysis", "code", "universal"],
            github_repo="https://github.com/ollama/ollama",
            author="Ollama Team / Taurus AI Corp Integration",
            status="active"
        )
    
    async def get_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all available models"""
        return {
            name: {
                "name": model.name,
                "size": model.size,
                "capabilities": [cap.value for cap in model.capabilities],
                "context_length": model.context_length,
                "best_for": model.best_for,
                "performance_tier": model.performance_tier,
                "cost": "Free (Local)",
                "status": "available"
            }
            for name, model in self.available_models.items()
        }
    
    async def get_model_stats(self) -> Dict[str, Any]:
        """Get model usage statistics"""
        return {
            "total_models": len(self.available_models),
            "models_by_tier": {
                "fast": len([m for m in self.available_models.values() if m.performance_tier == "fast"]),
                "balanced": len([m for m in self.available_models.values() if m.performance_tier == "balanced"]),
                "quality": len([m for m in self.available_models.values() if m.performance_tier == "quality"])
            },
            "capabilities_coverage": list(set([
                cap.value for model in self.available_models.values() 
                for cap in model.capabilities
            ])),
            "total_storage": "Varies by installed models",
            "monthly_cost": 0.0,
            "ollama_url": self.ollama_url,
            "initialized": self.is_initialized
        }
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("🧹 Cleaning up Ollama Local Agent...")
        if self.client:
            # Ollama client doesn't require explicit cleanup
            pass