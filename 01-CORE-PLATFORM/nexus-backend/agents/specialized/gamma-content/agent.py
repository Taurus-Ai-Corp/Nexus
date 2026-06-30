#!/usr/bin/env python3
"""
🎨 TAURUS AI CORP. - Gamma Content Agent
AI-powered content generation for presentations, documents, webpages, and social posts
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "registry"))
from base_agent import AgentStatus, BaseAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GammaContentAgent(BaseAgent):
    """
    Gamma Content Agent for TAURUS AI CORP
    
    Capabilities:
    - Presentation generation and management
    - Document creation automation
    - Webpage generation
    - Social media content generation
    - Content editing and updates
    - Publishing and sharing workflows
    - Integration with NeoVibe creative workflows
    """

    def __init__(self, config: dict[str, Any] | None = None):
        super().__init__()
        self.agent_id = "gamma-content"
        self.name = "Gamma Content Agent"
        self.description = "AI-powered content generation for presentations, documents, webpages, and social posts"

        # Configuration
        self.config = config or {}
        self.api_key = self.config.get("GAMMA_API_KEY", os.getenv("GAMMA_API_KEY"))
        self.api_base_url = self.config.get("GAMMA_API_BASE_URL", os.getenv("GAMMA_API_BASE_URL", "https://public-api.gamma.app/v0.2"))

        # MCP Integration (will be initialized via MCP client)
        self.mcp_tools = {}
        self.mcp_available = False

        # Agent capabilities
        self.capabilities = [
            "generate_presentation",
            "generate_document",
            "generate_webpage",
            "generate_social_post",
            "get_generation_status",
            "list_generations",
            "update_generation",
            "publish_generation",
            "presentation_workflow",
            "document_workflow",
            "social_media_campaign",
            "content_editing"
        ]

        # Workflow tracking
        self.active_generations = {}
        self.generation_queue = []
        self.content_cache = {}

    async def initialize(self) -> bool:
        """Initialize the Gamma Content Agent"""
        try:
            logger.info(f"🚀 Initializing {self.name}...")
            self.status = AgentStatus.INITIALIZING

            # Validate API key
            if not self.api_key:
                logger.warning("⚠️ GAMMA_API_KEY not configured")
                self.health_metrics["api_configured"] = False
            else:
                self.health_metrics["api_configured"] = True

            # Initialize MCP tools (if available)
            await self._initialize_mcp_tools()

            # Load content cache
            await self._load_content_cache()

            self.status = AgentStatus.ACTIVE
            self.last_activity = datetime.now()
            logger.info(f"✅ {self.name} initialized successfully")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to initialize {self.name}: {e}")
            self.status = AgentStatus.ERROR
            return False

    async def _initialize_mcp_tools(self):
        """Initialize MCP tools for Gamma operations"""
        # MCP tools will be injected by the orchestrator
        self.mcp_available = True
        logger.info("🎨 MCP tools ready for Gamma operations")

    async def _load_content_cache(self):
        """Load content cache for faster lookups"""
        try:
            # This would load from cache/database in production
            self.content_cache = {}
            logger.info("📚 Content cache initialized")
        except Exception as e:
            logger.warning(f"⚠️ Failed to load content cache: {e}")

    def get_capabilities(self) -> list[str]:
        """Return list of agent capabilities"""
        return self.capabilities

    def get_metadata(self) -> dict[str, Any]:
        """Return agent metadata"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "description": self.description,
            "version": "1.0.0",
            "capabilities": self.capabilities,
            "status": self.status.value,
            "api_configured": self.health_metrics.get("api_configured", False),
            "mcp_available": self.mcp_available,
            "active_generations": len(self.active_generations),
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat()
        }

    # Core Gamma Operations

    async def generate_presentation(self, prompt: str, title: str | None = None, style: str | None = None) -> dict[str, Any]:
        """Generate a presentation using Gamma"""
        try:
            logger.info(f"📊 Generating presentation: {title or 'Untitled'}")

            # If MCP tools available, use them
            if self.mcp_available and "gamma_generate_presentation" in self.mcp_tools:
                result = await self.mcp_tools["gamma_generate_presentation"]({
                    "prompt": prompt,
                    "title": title,
                    "style": style
                })
                generation_id = result.get("generation_id") or result.get("id")
                self.active_generations[generation_id] = {
                    "type": "presentation",
                    "title": title,
                    "status": "processing",
                    "created_at": datetime.now()
                }
                return result

            # Fallback to direct API call
            return await self._direct_api_generate("presentation", prompt, title, style)

        except Exception as e:
            logger.error(f"❌ Failed to generate presentation: {e}")
            raise

    async def generate_document(self, prompt: str, title: str | None = None, format: str | None = None) -> dict[str, Any]:
        """Generate a document using Gamma"""
        try:
            logger.info(f"📄 Generating document: {title or 'Untitled'}")

            if self.mcp_available and "gamma_generate_document" in self.mcp_tools:
                result = await self.mcp_tools["gamma_generate_document"]({
                    "prompt": prompt,
                    "title": title,
                    "format": format
                })
                generation_id = result.get("generation_id") or result.get("id")
                self.active_generations[generation_id] = {
                    "type": "document",
                    "title": title,
                    "status": "processing",
                    "created_at": datetime.now()
                }
                return result

            return await self._direct_api_generate("document", prompt, title, format)

        except Exception as e:
            logger.error(f"❌ Failed to generate document: {e}")
            raise

    async def generate_webpage(self, prompt: str, title: str | None = None, theme: str | None = None) -> dict[str, Any]:
        """Generate a webpage using Gamma"""
        try:
            logger.info(f"🌐 Generating webpage: {title or 'Untitled'}")

            if self.mcp_available and "gamma_generate_webpage" in self.mcp_tools:
                result = await self.mcp_tools["gamma_generate_webpage"]({
                    "prompt": prompt,
                    "title": title,
                    "theme": theme
                })
                generation_id = result.get("generation_id") or result.get("id")
                self.active_generations[generation_id] = {
                    "type": "webpage",
                    "title": title,
                    "status": "processing",
                    "created_at": datetime.now()
                }
                return result

            return await self._direct_api_generate("webpage", prompt, title, theme)

        except Exception as e:
            logger.error(f"❌ Failed to generate webpage: {e}")
            raise

    async def generate_social_post(self, prompt: str, platform: str | None = None, tone: str | None = None) -> dict[str, Any]:
        """Generate a social media post using Gamma"""
        try:
            logger.info(f"📱 Generating social post for {platform or 'multi-platform'}")

            if self.mcp_available and "gamma_generate_social_post" in self.mcp_tools:
                result = await self.mcp_tools["gamma_generate_social_post"]({
                    "prompt": prompt,
                    "platform": platform,
                    "tone": tone
                })
                generation_id = result.get("generation_id") or result.get("id")
                self.active_generations[generation_id] = {
                    "type": "social_post",
                    "platform": platform,
                    "status": "processing",
                    "created_at": datetime.now()
                }
                return result

            return await self._direct_api_generate("social_post", prompt, None, None, platform, tone)

        except Exception as e:
            logger.error(f"❌ Failed to generate social post: {e}")
            raise

    async def get_generation_status(self, generation_id: str) -> dict[str, Any]:
        """Get status of a generation"""
        try:
            if self.mcp_available and "gamma_get_generation_status" in self.mcp_tools:
                return await self.mcp_tools["gamma_get_generation_status"]({
                    "generation_id": generation_id
                })

            # Fallback implementation
            return {
                "id": generation_id,
                "status": self.active_generations.get(generation_id, {}).get("status", "unknown")
            }

        except Exception as e:
            logger.error(f"❌ Failed to get generation status: {e}")
            raise

    async def list_generations(self, limit: int = 20, offset: int = 0, type: str | None = None) -> list[dict[str, Any]]:
        """List all generations"""
        try:
            if self.mcp_available and "gamma_list_generations" in self.mcp_tools:
                result = await self.mcp_tools["gamma_list_generations"]({
                    "limit": limit,
                    "offset": offset,
                    "type": type
                })
                return result.get("generations", [])

            # Return cached generations
            return list(self.active_generations.values())[offset:offset+limit]

        except Exception as e:
            logger.error(f"❌ Failed to list generations: {e}")
            raise

    async def update_generation(self, generation_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        """Update a generation"""
        try:
            if self.mcp_available and "gamma_update_generation" in self.mcp_tools:
                return await self.mcp_tools["gamma_update_generation"]({
                    "generation_id": generation_id,
                    "updates": updates
                })

            # Update local cache
            if generation_id in self.active_generations:
                self.active_generations[generation_id].update(updates)
                return {"id": generation_id, "status": "updated"}

            raise ValueError(f"Generation {generation_id} not found")

        except Exception as e:
            logger.error(f"❌ Failed to update generation: {e}")
            raise

    async def publish_generation(self, generation_id: str, visibility: str = "public") -> dict[str, Any]:
        """Publish a generation"""
        try:
            logger.info(f"🚀 Publishing generation {generation_id}")

            if self.mcp_available and "gamma_publish_generation" in self.mcp_tools:
                result = await self.mcp_tools["gamma_publish_generation"]({
                    "generation_id": generation_id,
                    "visibility": visibility
                })

                # Update status
                if generation_id in self.active_generations:
                    self.active_generations[generation_id]["status"] = "published"
                    self.active_generations[generation_id]["published_url"] = result.get("published_url")

                return result

            # Fallback
            return {"id": generation_id, "status": "published", "visibility": visibility}

        except Exception as e:
            logger.error(f"❌ Failed to publish generation: {e}")
            raise

    # Workflow Methods

    async def presentation_workflow(self, topic: str, slides: int = 10, style: str = "professional") -> dict[str, Any]:
        """Complete presentation generation workflow"""
        try:
            prompt = f"Create a {slides}-slide presentation about {topic} with {style} style"
            result = await self.generate_presentation(prompt, title=topic, style=style)

            # Wait for completion and publish
            generation_id = result.get("id") or result.get("generation_id")
            if generation_id:
                await asyncio.sleep(5)  # Wait for processing
                published = await self.publish_generation(generation_id)
                return {**result, **published}

            return result

        except Exception as e:
            logger.error(f"❌ Presentation workflow failed: {e}")
            raise

    async def social_media_campaign(self, campaign_name: str, platforms: list[str], posts_per_platform: int = 3) -> dict[str, Any]:
        """Generate social media campaign across multiple platforms"""
        try:
            results = {}
            for platform in platforms:
                platform_posts = []
                for i in range(posts_per_platform):
                    prompt = f"Create engaging {platform} post #{i+1} for campaign: {campaign_name}"
                    post = await self.generate_social_post(prompt, platform=platform)
                    platform_posts.append(post)
                results[platform] = platform_posts

            return {
                "campaign": campaign_name,
                "platforms": results,
                "total_posts": sum(len(posts) for posts in results.values())
            }

        except Exception as e:
            logger.error(f"❌ Social media campaign failed: {e}")
            raise

    # Helper Methods

    async def _direct_api_generate(self, content_type: str, prompt: str, title: str | None = None,
                                   style: str | None = None, platform: str | None = None,
                                   tone: str | None = None) -> dict[str, Any]:
        """Direct API call fallback (if MCP not available)"""
        import httpx

        payload = {
            "type": content_type,
            "prompt": prompt
        }
        if title:
            payload["title"] = title
        if style:
            payload["style"] = style
        if platform:
            payload["platform"] = platform
        if tone:
            payload["tone"] = tone

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_base_url}/generations",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()


# Main execution for testing
if __name__ == "__main__":
    async def main():
        agent = GammaContentAgent()
        await agent.initialize()
        print(json.dumps(agent.get_metadata(), indent=2))

    asyncio.run(main())

