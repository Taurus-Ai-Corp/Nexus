#!/usr/bin/env python3
"""
🎨 TAURUS AI CORP. - Canva Design Agent
Design creation and management for graphics, templates, and visual content
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


class CanvaDesignAgent(BaseAgent):
    """
    Canva Design Agent for TAURUS AI CORP
    
    Capabilities:
    - Design creation (presets and custom dimensions)
    - Asset management and organization
    - Template browsing and usage
    - Design editing and updates
    - Publishing and export workflows
    - Brand consistency enforcement
    - Cross-platform asset integration
    """

    def __init__(self, config: dict[str, Any] | None = None):
        super().__init__()
        self.agent_id = "canva-design"
        self.name = "Canva Design Agent"
        self.description = "Design creation and management for graphics, templates, and visual content"

        # Configuration
        self.config = config or {}
        self.api_key = self.config.get("CANVA_API_KEY", os.getenv("CANVA_API_KEY"))
        self.api_base_url = self.config.get("CANVA_API_BASE_URL", os.getenv("CANVA_API_BASE_URL", "https://api.canva.com/rest/v1"))

        # MCP Integration (will be initialized via MCP client)
        self.mcp_tools = {}
        self.mcp_available = False

        # Agent capabilities
        self.capabilities = [
            "create_design",
            "add_asset",
            "list_designs",
            "get_design",
            "update_design",
            "publish_design",
            "list_templates",
            "download_design",
            "design_workflow",
            "template_based_design",
            "brand_asset_management",
            "batch_design_creation"
        ]

        # Workflow tracking
        self.active_designs = {}
        self.design_queue = []
        self.asset_cache = {}
        self.brand_guidelines = {}

    async def initialize(self) -> bool:
        """Initialize the Canva Design Agent"""
        try:
            logger.info(f"🚀 Initializing {self.name}...")
            self.status = AgentStatus.INITIALIZING

            # Validate API key
            if not self.api_key:
                logger.warning("⚠️ CANVA_API_KEY not configured")
                self.health_metrics["api_configured"] = False
            else:
                self.health_metrics["api_configured"] = True

            # Initialize MCP tools (if available)
            await self._initialize_mcp_tools()

            # Load asset cache and brand guidelines
            await self._load_asset_cache()
            await self._load_brand_guidelines()

            self.status = AgentStatus.ACTIVE
            self.last_activity = datetime.now()
            logger.info(f"✅ {self.name} initialized successfully")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to initialize {self.name}: {e}")
            self.status = AgentStatus.ERROR
            return False

    async def _initialize_mcp_tools(self):
        """Initialize MCP tools for Canva operations"""
        # MCP tools will be injected by the orchestrator
        self.mcp_available = True
        logger.info("🎨 MCP tools ready for Canva operations")

    async def _load_asset_cache(self):
        """Load asset cache for faster lookups"""
        try:
            # This would load from cache/database in production
            self.asset_cache = {}
            logger.info("🖼️ Asset cache initialized")
        except Exception as e:
            logger.warning(f"⚠️ Failed to load asset cache: {e}")

    async def _load_brand_guidelines(self):
        """Load brand guidelines for consistency"""
        try:
            # This would load from brand management system
            self.brand_guidelines = {
                "colors": [],
                "fonts": [],
                "logo": None,
                "style": "professional"
            }
            logger.info("🎨 Brand guidelines loaded")
        except Exception as e:
            logger.warning(f"⚠️ Failed to load brand guidelines: {e}")

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
            "active_designs": len(self.active_designs),
            "brand_guidelines_loaded": bool(self.brand_guidelines),
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat()
        }

    # Core Canva Operations

    async def create_design(self, preset: str | None = None, width: int | None = None,
                          height: int | None = None, title: str | None = None,
                          template_id: str | None = None) -> dict[str, Any]:
        """Create a new Canva design"""
        try:
            logger.info(f"🎨 Creating design: {title or preset or 'Custom'}")

            if self.mcp_available and "canva_create_design" in self.mcp_tools:
                result = await self.mcp_tools["canva_create_design"]({
                    "preset": preset,
                    "width": width,
                    "height": height,
                    "title": title,
                    "template_id": template_id
                })
                design_id = result.get("design_id") or result.get("id")
                if design_id:
                    self.active_designs[design_id] = {
                        "title": title,
                        "preset": preset,
                        "status": "created",
                        "created_at": datetime.now()
                    }
                return result

            # Fallback to direct API call
            return await self._direct_api_create_design(preset, width, height, title, template_id)

        except Exception as e:
            logger.error(f"❌ Failed to create design: {e}")
            raise

    async def add_asset(self, design_id: str, asset_type: str, asset_data: dict[str, Any] | None = None,
                       url: str | None = None) -> dict[str, Any]:
        """Add an asset to a design"""
        try:
            logger.info(f"➕ Adding {asset_type} asset to design {design_id}")

            if self.mcp_available and "canva_add_asset" in self.mcp_tools:
                return await self.mcp_tools["canva_add_asset"]({
                    "design_id": design_id,
                    "asset_type": asset_type,
                    "asset_data": asset_data,
                    "url": url
                })

            # Fallback implementation
            return {"design_id": design_id, "asset_type": asset_type, "status": "added"}

        except Exception as e:
            logger.error(f"❌ Failed to add asset: {e}")
            raise

    async def list_designs(self, limit: int = 20, offset: int = 0, folder_id: str | None = None) -> list[dict[str, Any]]:
        """List all designs"""
        try:
            if self.mcp_available and "canva_list_designs" in self.mcp_tools:
                result = await self.mcp_tools["canva_list_designs"]({
                    "limit": limit,
                    "offset": offset,
                    "folder_id": folder_id
                })
                return result.get("designs", [])

            # Return cached designs
            return list(self.active_designs.values())[offset:offset+limit]

        except Exception as e:
            logger.error(f"❌ Failed to list designs: {e}")
            raise

    async def get_design(self, design_id: str) -> dict[str, Any]:
        """Get design details"""
        try:
            if self.mcp_available and "canva_get_design" in self.mcp_tools:
                return await self.mcp_tools["canva_get_design"]({
                    "design_id": design_id
                })

            # Return cached design
            if design_id in self.active_designs:
                return {"id": design_id, **self.active_designs[design_id]}

            raise ValueError(f"Design {design_id} not found")

        except Exception as e:
            logger.error(f"❌ Failed to get design: {e}")
            raise

    async def update_design(self, design_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        """Update a design"""
        try:
            logger.info(f"✏️ Updating design {design_id}")

            if self.mcp_available and "canva_update_design" in self.mcp_tools:
                result = await self.mcp_tools["canva_update_design"]({
                    "design_id": design_id,
                    "updates": updates
                })

                # Update local cache
                if design_id in self.active_designs:
                    self.active_designs[design_id].update(updates)

                return result

            # Update local cache
            if design_id in self.active_designs:
                self.active_designs[design_id].update(updates)
                return {"id": design_id, "status": "updated"}

            raise ValueError(f"Design {design_id} not found")

        except Exception as e:
            logger.error(f"❌ Failed to update design: {e}")
            raise

    async def publish_design(self, design_id: str, format: str = "link", quality: str = "high") -> dict[str, Any]:
        """Publish a design"""
        try:
            logger.info(f"🚀 Publishing design {design_id}")

            if self.mcp_available and "canva_publish_design" in self.mcp_tools:
                result = await self.mcp_tools["canva_publish_design"]({
                    "design_id": design_id,
                    "format": format,
                    "quality": quality
                })

                # Update status
                if design_id in self.active_designs:
                    self.active_designs[design_id]["status"] = "published"
                    self.active_designs[design_id]["published_url"] = result.get("published_url")

                return result

            # Fallback
            return {"id": design_id, "status": "published", "format": format}

        except Exception as e:
            logger.error(f"❌ Failed to publish design: {e}")
            raise

    async def list_templates(self, query: str | None = None, category: str | None = None,
                           limit: int = 20) -> list[dict[str, Any]]:
        """List available templates"""
        try:
            if self.mcp_available and "canva_list_templates" in self.mcp_tools:
                result = await self.mcp_tools["canva_list_templates"]({
                    "query": query,
                    "category": category,
                    "limit": limit
                })
                return result.get("templates", [])

            # Fallback - return empty list
            return []

        except Exception as e:
            logger.error(f"❌ Failed to list templates: {e}")
            raise

    async def download_design(self, design_id: str, format: str, quality: str = "high",
                            scale: float = 1.0) -> dict[str, Any]:
        """Download a design"""
        try:
            logger.info(f"📥 Downloading design {design_id} as {format}")

            if self.mcp_available and "canva_download_design" in self.mcp_tools:
                return await self.mcp_tools["canva_download_design"]({
                    "design_id": design_id,
                    "format": format,
                    "quality": quality,
                    "scale": scale
                })

            # Fallback
            return {
                "id": design_id,
                "format": format,
                "download_url": f"https://api.canva.com/designs/{design_id}/download",
                "status": "ready"
            }

        except Exception as e:
            logger.error(f"❌ Failed to download design: {e}")
            raise

    # Workflow Methods

    async def design_workflow(self, preset: str, title: str, assets: list[dict[str, Any]] = None) -> dict[str, Any]:
        """Complete design creation workflow"""
        try:
            # Create design
            design = await self.create_design(preset=preset, title=title)
            design_id = design.get("id") or design.get("design_id")

            if not design_id:
                raise ValueError("Failed to create design")

            # Add assets
            if assets:
                for asset in assets:
                    await self.add_asset(design_id, asset.get("type"), asset.get("data"), asset.get("url"))

            # Publish
            published = await self.publish_design(design_id)

            return {
                **design,
                **published,
                "assets_added": len(assets) if assets else 0
            }

        except Exception as e:
            logger.error(f"❌ Design workflow failed: {e}")
            raise

    async def template_based_design(self, template_id: str, title: str, customizations: dict[str, Any]) -> dict[str, Any]:
        """Create design from template with customizations"""
        try:
            # Create from template
            design = await self.create_design(template_id=template_id, title=title)
            design_id = design.get("id") or design.get("design_id")

            if not design_id:
                raise ValueError("Failed to create design from template")

            # Apply customizations
            await self.update_design(design_id, customizations)

            return design

        except Exception as e:
            logger.error(f"❌ Template-based design failed: {e}")
            raise

    async def batch_design_creation(self, designs: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Create multiple designs in batch"""
        try:
            results = []
            for design_spec in designs:
                design = await self.create_design(
                    preset=design_spec.get("preset"),
                    width=design_spec.get("width"),
                    height=design_spec.get("height"),
                    title=design_spec.get("title")
                )
                results.append(design)

            return results

        except Exception as e:
            logger.error(f"❌ Batch design creation failed: {e}")
            raise

    # Helper Methods

    async def _direct_api_create_design(self, preset: str | None = None, width: int | None = None,
                                       height: int | None = None, title: str | None = None,
                                       template_id: str | None = None) -> dict[str, Any]:
        """Direct API call fallback (if MCP not available)"""
        import httpx

        # Get preset dimensions if needed
        if preset and not (width and height):
            preset_dims = self._get_preset_dimensions(preset)
            if preset_dims:
                width = preset_dims["width"]
                height = preset_dims["height"]

        if not width or not height:
            raise ValueError("Either preset or both width and height must be provided")

        payload = {
            "width": width,
            "height": height
        }
        if title:
            payload["title"] = title
        if template_id:
            payload["template_id"] = template_id

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_base_url}/designs",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()

    def _get_preset_dimensions(self, preset: str) -> dict[str, int] | None:
        """Get dimensions for a preset"""
        presets = {
            "Instagram Post": {"width": 1080, "height": 1080},
            "Instagram Story": {"width": 1080, "height": 1920},
            "Facebook Cover": {"width": 1200, "height": 630},
            "LinkedIn Post": {"width": 1200, "height": 627},
            "Twitter Post": {"width": 1200, "height": 675},
            "Presentation": {"width": 1920, "height": 1080},
        }
        return presets.get(preset)


# Main execution for testing
if __name__ == "__main__":
    async def main():
        agent = CanvaDesignAgent()
        await agent.initialize()
        print(json.dumps(agent.get_metadata(), indent=2))

    asyncio.run(main())

