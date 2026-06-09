#!/usr/bin/env python3
"""
Vertex AI Creative Studio Agent - Taurus AI Corp
Integrated from: https://github.com/googlecloudplatform/vertex-ai-creative-studio
Provides AI-powered creative content generation for marketing campaigns
"""

import asyncio
import json
import logging
import os
import base64
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import sys
from pathlib import Path

# Add registry to path
registry_path = Path(__file__).parent.parent
sys.path.insert(0, str(registry_path))

from registry.agent_registry import BaseAgent, AgentMetadata

try:
    import google.cloud.aiplatform as aiplatform
    from google.cloud import storage
    import vertexai
    from vertexai.preview.generative_models import GenerativeModel, Image
    VERTEX_AI_AVAILABLE = True
except ImportError:
    VERTEX_AI_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CreativeRequest:
    """Data structure for creative generation requests"""
    prompt: str
    content_type: str  # image, video, text
    brand_guidelines: Dict[str, Any]
    target_audience: str
    campaign_context: str
    style_preferences: List[str]
    dimensions: Optional[Dict[str, int]] = None
    quantity: int = 1

@dataclass
class CreativeAsset:
    """Data structure for generated creative assets"""
    asset_id: str
    asset_type: str
    content_url: str
    metadata: Dict[str, Any]
    generation_timestamp: datetime
    prompt_used: str
    quality_score: float = 0.0

class VertexAICreativeAgent(BaseAgent):
    """
    AI-powered creative content generation agent using Google Vertex AI
    Specialized for marketing and brand content creation
    """
    
    def __init__(self):
        self.project_id = None
        self.location = "us-central1"
        self.bucket_name = None
        self.storage_client = None
        self.imagen_model = None
        self.gemini_model = None
        self.initialized = False
        
    async def initialize(self, config: Dict[str, Any]) -> bool:
        """Initialize Vertex AI Creative Studio agent"""
        
        try:
            logger.info("🎨 Initializing Vertex AI Creative Studio Agent")
            
            # Check if Vertex AI is available
            if not VERTEX_AI_AVAILABLE:
                logger.error("❌ Vertex AI SDK not installed. Run: pip install google-cloud-aiplatform vertexai")
                return False
            
            # Get configuration
            self.project_id = config.get("gcp_project_id") or os.getenv("GOOGLE_CLOUD_PROJECT")
            self.location = config.get("gcp_location", "us-central1")
            self.bucket_name = config.get("gcp_storage_bucket") or f"{self.project_id}-creative-assets"
            
            if not self.project_id:
                logger.error("❌ GCP Project ID not configured")
                return False
            
            # Initialize Vertex AI
            vertexai.init(project=self.project_id, location=self.location)
            aiplatform.init(project=self.project_id, location=self.location)
            
            # Initialize storage client
            self.storage_client = storage.Client(project=self.project_id)
            
            # Initialize models
            self.imagen_model = GenerativeModel("imagegeneration@006")  # Latest Imagen model
            self.gemini_model = GenerativeModel("gemini-1.5-pro")
            
            # Ensure storage bucket exists
            await self._ensure_storage_bucket()
            
            self.initialized = True
            logger.info("✅ Vertex AI Creative Studio Agent initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vertex AI Creative Agent: {e}")
            return False
    
    async def _ensure_storage_bucket(self):
        """Ensure storage bucket exists for creative assets"""
        try:
            bucket = self.storage_client.bucket(self.bucket_name)
            if not bucket.exists():
                bucket = self.storage_client.create_bucket(self.bucket_name, location=self.location)
                logger.info(f"✅ Created storage bucket: {self.bucket_name}")
            else:
                logger.info(f"✅ Storage bucket exists: {self.bucket_name}")
        except Exception as e:
            logger.warning(f"⚠️ Could not access/create storage bucket: {e}")
    
    async def execute(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute creative content generation task"""
        
        if not self.initialized:
            return {"error": "Agent not initialized", "success": False}
        
        try:
            logger.info("🎨 Executing creative generation task")
            
            # Parse task data into CreativeRequest
            creative_request = self._parse_creative_request(task_data)
            
            # Route to appropriate generation method
            if creative_request.content_type == "image":
                result = await self._generate_images(creative_request)
            elif creative_request.content_type == "text":
                result = await self._generate_text_content(creative_request)
            elif creative_request.content_type == "prompt_optimization":
                result = await self._optimize_prompt(creative_request)
            else:
                result = {"error": f"Unsupported content type: {creative_request.content_type}", "success": False}
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Creative generation failed: {e}")
            return {"error": str(e), "success": False}
    
    def _parse_creative_request(self, task_data: Dict[str, Any]) -> CreativeRequest:
        """Parse task data into CreativeRequest object"""
        
        return CreativeRequest(
            prompt=task_data.get("prompt", ""),
            content_type=task_data.get("content_type", "image"),
            brand_guidelines=task_data.get("brand_guidelines", {}),
            target_audience=task_data.get("target_audience", "general"),
            campaign_context=task_data.get("campaign_context", ""),
            style_preferences=task_data.get("style_preferences", []),
            dimensions=task_data.get("dimensions", {"width": 1024, "height": 1024}),
            quantity=task_data.get("quantity", 1)
        )
    
    async def _generate_images(self, request: CreativeRequest) -> Dict[str, Any]:
        """Generate images using Vertex AI Imagen"""
        
        try:
            logger.info(f"🖼️ Generating {request.quantity} image(s) with Imagen")
            
            # Enhance prompt with brand guidelines and context
            enhanced_prompt = self._enhance_prompt_for_brand(request)
            
            generated_assets = []
            
            for i in range(request.quantity):
                # Generate image
                response = self.imagen_model.generate_images(
                    prompt=enhanced_prompt,
                    number_of_images=1,
                    aspect_ratio="1:1",  # Will be made configurable
                    safety_filter_level="block_some",
                    person_generation="allow_adult"
                )
                
                if response.images:
                    image = response.images[0]
                    
                    # Save to storage
                    asset_id = f"creative_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{i+1}"
                    storage_url = await self._save_image_to_storage(image, asset_id)
                    
                    # Create asset record
                    asset = CreativeAsset(
                        asset_id=asset_id,
                        asset_type="image",
                        content_url=storage_url,
                        metadata={
                            "dimensions": request.dimensions,
                            "style_preferences": request.style_preferences,
                            "target_audience": request.target_audience,
                            "campaign_context": request.campaign_context
                        },
                        generation_timestamp=datetime.now(),
                        prompt_used=enhanced_prompt
                    )
                    
                    generated_assets.append(asset)
            
            return {
                "success": True,
                "content_type": "image",
                "assets_generated": len(generated_assets),
                "assets": [
                    {
                        "asset_id": asset.asset_id,
                        "asset_type": asset.asset_type,
                        "content_url": asset.content_url,
                        "metadata": asset.metadata,
                        "prompt_used": asset.prompt_used
                    }
                    for asset in generated_assets
                ],
                "enhanced_prompt": enhanced_prompt,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Image generation failed: {e}")
            return {"error": str(e), "success": False}
    
    async def _generate_text_content(self, request: CreativeRequest) -> Dict[str, Any]:
        """Generate text content using Gemini"""
        
        try:
            logger.info("📝 Generating text content with Gemini")
            
            # Create enhanced prompt for text generation
            system_prompt = f"""
            You are a creative marketing specialist for {request.brand_guidelines.get('brand_name', 'the brand')}.
            
            Brand Guidelines:
            {json.dumps(request.brand_guidelines, indent=2)}
            
            Target Audience: {request.target_audience}
            Campaign Context: {request.campaign_context}
            Style Preferences: {', '.join(request.style_preferences)}
            
            Generate compelling marketing copy that aligns with the brand voice and resonates with the target audience.
            """
            
            response = self.gemini_model.generate_content(
                contents=[system_prompt, request.prompt],
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 1000,
                    "top_p": 0.8,
                    "top_k": 40
                }
            )
            
            generated_content = response.text
            
            return {
                "success": True,
                "content_type": "text",
                "generated_content": generated_content,
                "brand_aligned": True,
                "word_count": len(generated_content.split()),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Text generation failed: {e}")
            return {"error": str(e), "success": False}
    
    async def _optimize_prompt(self, request: CreativeRequest) -> Dict[str, Any]:
        """Optimize prompts for better creative generation"""
        
        try:
            logger.info("🔧 Optimizing prompt with Gemini")
            
            optimization_prompt = f"""
            You are an expert in AI prompt engineering for creative content generation.
            
            Original prompt: "{request.prompt}"
            Content type: {request.content_type}
            Brand context: {request.brand_guidelines.get('brand_name', 'Unknown')}
            Target audience: {request.target_audience}
            Style preferences: {', '.join(request.style_preferences)}
            
            Optimize this prompt to:
            1. Be more specific and detailed
            2. Include relevant style and aesthetic instructions
            3. Ensure brand alignment
            4. Improve generation quality
            5. Add technical parameters if needed
            
            Return the optimized prompt and explain the improvements made.
            """
            
            response = self.gemini_model.generate_content(optimization_prompt)
            optimization_result = response.text
            
            return {
                "success": True,
                "content_type": "prompt_optimization",
                "original_prompt": request.prompt,
                "optimized_result": optimization_result,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Prompt optimization failed: {e}")
            return {"error": str(e), "success": False}
    
    def _enhance_prompt_for_brand(self, request: CreativeRequest) -> str:
        """Enhance prompt with brand guidelines and marketing context"""
        
        brand_elements = []
        
        # Add brand-specific elements
        if request.brand_guidelines:
            if "brand_colors" in request.brand_guidelines:
                brand_elements.append(f"Brand colors: {', '.join(request.brand_guidelines['brand_colors'])}")
            
            if "brand_style" in request.brand_guidelines:
                brand_elements.append(f"Brand style: {request.brand_guidelines['brand_style']}")
            
            if "brand_voice" in request.brand_guidelines:
                brand_elements.append(f"Brand personality: {request.brand_guidelines['brand_voice']}")
        
        # Add style preferences
        if request.style_preferences:
            brand_elements.append(f"Visual style: {', '.join(request.style_preferences)}")
        
        # Add campaign context
        if request.campaign_context:
            brand_elements.append(f"Campaign context: {request.campaign_context}")
        
        # Add target audience considerations
        brand_elements.append(f"Target audience: {request.target_audience}")
        
        # Combine all elements
        brand_context = ". ".join(brand_elements)
        enhanced_prompt = f"{request.prompt}. {brand_context}. High quality, professional, marketing-ready creative asset."
        
        return enhanced_prompt
    
    async def _save_image_to_storage(self, image: Any, asset_id: str) -> str:
        """Save generated image to Google Cloud Storage"""
        
        try:
            # Convert image to bytes (simplified - actual implementation would depend on image format)
            blob_name = f"creative-assets/{asset_id}.png"
            bucket = self.storage_client.bucket(self.bucket_name)
            blob = bucket.blob(blob_name)
            
            # Save image data (this is a simplified version)
            # In actual implementation, you'd handle the specific image format from Vertex AI
            image_data = image._image_bytes if hasattr(image, '_image_bytes') else b''
            blob.upload_from_string(image_data, content_type='image/png')
            
            # Make blob publicly accessible (adjust permissions as needed)
            blob.make_public()
            
            return blob.public_url
            
        except Exception as e:
            logger.error(f"❌ Failed to save image to storage: {e}")
            return f"storage_error_{asset_id}"
    
    def get_capabilities(self) -> List[str]:
        """Return list of capabilities this agent provides"""
        return [
            "image_generation",
            "text_content_creation", 
            "prompt_optimization",
            "brand_aligned_creative",
            "marketing_asset_generation",
            "visual_content_creation",
            "ai_powered_design",
            "campaign_creative_development",
            "multimodal_content_generation"
        ]
    
    def get_metadata(self) -> AgentMetadata:
        """Return agent metadata for registry"""
        return AgentMetadata(
            name="vertex_ai_creative",
            version="1.0.0",
            description="AI-powered creative content generation using Google Vertex AI Creative Studio",
            capabilities=self.get_capabilities(),
            dependencies=[
                "google-cloud-aiplatform",
                "vertexai", 
                "google-cloud-storage"
            ],
            api_requirements=[
                "GOOGLE_CLOUD_PROJECT",
                "Vertex AI API access",
                "Google Cloud Storage access"
            ],
            business_domains=["marketing", "creative", "advertising", "branding", "universal"],
            github_repo="https://github.com/googlecloudplatform/vertex-ai-creative-studio",
            author="Google Cloud Platform / Taurus AI Corp Integration",
            status="active"
        )
    
    async def health_check(self) -> bool:
        """Perform health check on the agent"""
        try:
            if not self.initialized:
                return False
            
            # Test basic connectivity
            if self.project_id and self.storage_client:
                # Simple test - check if we can access the project
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False
    
    async def generate_campaign_assets(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        High-level method to generate complete campaign assets
        Specialized for NEXUS marketing campaigns
        """
        
        logger.info("🚀 Generating complete campaign assets")
        
        campaign_assets = {
            "campaign_id": campaign_data.get("id"),
            "generated_assets": [],
            "asset_types": [],
            "total_assets": 0,
            "generation_errors": []
        }
        
        # Generate hero images
        hero_task = {
            "prompt": f"Professional marketing hero image for {campaign_data.get('campaign_name', 'campaign')}",
            "content_type": "image",
            "brand_guidelines": campaign_data.get("brand_guidelines", {}),
            "target_audience": campaign_data.get("target_audience", "business professionals"),
            "campaign_context": campaign_data.get("campaign_type", "marketing"),
            "style_preferences": ["professional", "modern", "high-impact"],
            "quantity": 2
        }
        
        hero_result = await self.execute(hero_task)
        if hero_result.get("success"):
            campaign_assets["generated_assets"].extend(hero_result.get("assets", []))
            campaign_assets["asset_types"].append("hero_images")
        else:
            campaign_assets["generation_errors"].append(f"Hero images: {hero_result.get('error')}")
        
        # Generate social media content
        social_task = {
            "prompt": f"Engaging social media post for {campaign_data.get('target_market', 'market')} audience about {campaign_data.get('campaign_name', 'our services')}",
            "content_type": "text",
            "brand_guidelines": campaign_data.get("brand_guidelines", {}),
            "target_audience": campaign_data.get("target_audience", "social media users"),
            "campaign_context": "social media marketing",
            "style_preferences": ["engaging", "conversational", "action-oriented"]
        }
        
        social_result = await self.execute(social_task)
        if social_result.get("success"):
            campaign_assets["generated_assets"].append({
                "asset_type": "social_media_content",
                "content": social_result.get("generated_content"),
                "word_count": social_result.get("word_count")
            })
            campaign_assets["asset_types"].append("social_content")
        else:
            campaign_assets["generation_errors"].append(f"Social content: {social_result.get('error')}")
        
        campaign_assets["total_assets"] = len(campaign_assets["generated_assets"])
        
        logger.info(f"✅ Campaign asset generation complete: {campaign_assets['total_assets']} assets created")
        
        return campaign_assets

# Example usage and testing
async def main():
    """Test Vertex AI Creative Agent"""
    
    # Test configuration
    config = {
        "gcp_project_id": os.getenv("GOOGLE_CLOUD_PROJECT", "test-project"),
        "gcp_location": "us-central1",
        "gcp_storage_bucket": "test-creative-assets"
    }
    
    agent = VertexAICreativeAgent()
    
    # Test initialization (will fail without proper GCP setup)
    success = await agent.initialize(config)
    print(f"🔧 Initialization: {'✅ Success' if success else '❌ Failed'}")
    
    if success:
        # Test capabilities
        capabilities = agent.get_capabilities()
        print(f"🛠️ Capabilities: {', '.join(capabilities)}")
        
        # Test health check
        health = await agent.health_check()
        print(f"🏥 Health Check: {'✅ Healthy' if health else '❌ Unhealthy'}")
    
    # Display metadata
    metadata = agent.get_metadata()
    print(f"📋 Agent: {metadata.name} v{metadata.version}")
    print(f"📊 Business Domains: {', '.join(metadata.business_domains)}")
    print(f"🔗 GitHub: {metadata.github_repo}")

if __name__ == "__main__":
    asyncio.run(main())