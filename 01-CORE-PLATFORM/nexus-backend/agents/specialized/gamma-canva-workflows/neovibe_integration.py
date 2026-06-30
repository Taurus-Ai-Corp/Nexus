#!/usr/bin/env python3
"""
🎨 TAURUS AI CORP. - NeoVibe Creative Studio Integration
Gamma and Canva integration for unified content generation workflows
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NeoVibeIntegration:
    """
    NeoVibe Creative Studio integration with Gamma and Canva
    
    Capabilities:
    - Unified content generation workflows
    - Auto-publish to client channels
    - Presentation templates from Gamma
    - Social media graphics from Canva
    - Cross-platform content synchronization
    """

    def __init__(self, gamma_agent=None, canva_agent=None):
        self.gamma_agent = gamma_agent
        self.canva_agent = canva_agent
        self.client_channels = {}
        self.content_library = []

    async def create_client_campaign(self, client_id: str, campaign_brief: dict[str, Any]) -> dict[str, Any]:
        """
        Create complete client campaign using Gamma and Canva
        
        Workflow:
        1. Generate Gamma presentation for campaign overview
        2. Create Canva social media graphics
        3. Generate social posts using Gamma
        4. Auto-publish to client channels
        """
        try:
            logger.info(f"🎨 Creating campaign for client {client_id}")

            campaign_assets = {
                "client_id": client_id,
                "campaign_name": campaign_brief.get("name", "Untitled Campaign"),
                "gamma_presentation": None,
                "canva_graphics": [],
                "social_posts": [],
                "published_channels": []
            }

            # Step 1: Generate Gamma presentation
            logger.info("📊 Step 1: Generating Gamma presentation...")
            presentation_prompt = f"Create a presentation for campaign: {campaign_brief.get('name')}. "
            presentation_prompt += f"Objectives: {campaign_brief.get('objectives', '')}. "
            presentation_prompt += f"Target audience: {campaign_brief.get('audience', '')}"

            presentation = await self.gamma_agent.generate_presentation(
                prompt=presentation_prompt,
                title=campaign_brief.get("name", "Campaign Presentation"),
                style=campaign_brief.get("style", "professional")
            )
            campaign_assets["gamma_presentation"] = presentation

            # Step 2: Create Canva social media graphics
            logger.info("🎨 Step 2: Creating Canva social media graphics...")
            platforms = campaign_brief.get("platforms", ["Instagram Post", "LinkedIn Post", "Facebook Cover"])

            for platform in platforms:
                graphic = await self.canva_agent.create_design(
                    preset=platform,
                    title=f"{campaign_brief.get('name')} - {platform}"
                )
                campaign_assets["canva_graphics"].append({
                    "platform": platform,
                    "design": graphic
                })

            # Step 3: Generate social posts using Gamma
            logger.info("📱 Step 3: Generating social media posts...")
            social_campaign = await self.gamma_agent.social_media_campaign(
                campaign_name=campaign_brief.get("name", "Campaign"),
                platforms=campaign_brief.get("social_platforms", ["linkedin", "twitter", "instagram"]),
                posts_per_platform=campaign_brief.get("posts_per_platform", 3)
            )
            campaign_assets["social_posts"] = social_campaign

            # Step 4: Auto-publish to client channels
            logger.info("🚀 Step 4: Publishing to client channels...")
            published = await self._publish_to_client_channels(client_id, campaign_assets)
            campaign_assets["published_channels"] = published

            # Store in content library
            self.content_library.append(campaign_assets)

            logger.info(f"✅ Campaign created successfully for client {client_id}")
            return campaign_assets

        except Exception as e:
            logger.error(f"❌ Failed to create client campaign: {e}")
            raise

    async def generate_presentation_template(self, template_type: str, client_branding: dict[str, Any]) -> dict[str, Any]:
        """
        Generate presentation template using Gamma with client branding
        
        Workflow:
        1. Create Gamma presentation template
        2. Apply client branding
        3. Create matching Canva cover design
        4. Return template package
        """
        try:
            logger.info(f"📊 Generating {template_type} presentation template")

            # Generate Gamma presentation
            prompt = f"Create a {template_type} presentation template with professional design"
            presentation = await self.gamma_agent.generate_presentation(
                prompt=prompt,
                title=f"{template_type.title()} Template",
                style="professional"
            )

            # Create matching Canva cover
            cover_design = await self.canva_agent.create_design(
                preset="Presentation",
                title=f"{template_type.title()} Cover"
            )

            # Apply branding if provided
            if client_branding:
                cover_id = cover_design.get("id") or cover_design.get("design_id")
                if cover_id:
                    await self.canva_agent.update_design(
                        design_id=cover_id,
                        updates={"branding": client_branding}
                    )

            template_package = {
                "type": template_type,
                "gamma_presentation": presentation,
                "canva_cover": cover_design,
                "branding_applied": bool(client_branding),
                "timestamp": datetime.now().isoformat()
            }

            return template_package

        except Exception as e:
            logger.error(f"❌ Failed to generate presentation template: {e}")
            raise

    async def create_social_media_package(self, content_brief: dict[str, Any]) -> dict[str, Any]:
        """
        Create complete social media package using Gamma and Canva
        
        Workflow:
        1. Generate social posts using Gamma
        2. Create matching graphics using Canva
        3. Package for multi-platform distribution
        """
        try:
            logger.info("📱 Creating social media package")

            package = {
                "posts": [],
                "graphics": [],
                "platforms": content_brief.get("platforms", ["linkedin", "instagram", "twitter"])
            }

            # Generate posts for each platform
            for platform in package["platforms"]:
                # Generate post content
                post = await self.gamma_agent.generate_social_post(
                    prompt=content_brief.get("content_prompt", "Create engaging social media post"),
                    platform=platform,
                    tone=content_brief.get("tone", "professional")
                )

                # Create matching graphic
                preset_map = {
                    "linkedin": "LinkedIn Post",
                    "instagram": "Instagram Post",
                    "twitter": "Twitter Post",
                    "facebook": "Facebook Post"
                }

                graphic = await self.canva_agent.create_design(
                    preset=preset_map.get(platform, "Instagram Post"),
                    title=f"{platform.title()} Graphic"
                )

                package["posts"].append({
                    "platform": platform,
                    "post": post
                })
                package["graphics"].append({
                    "platform": platform,
                    "design": graphic
                })

            logger.info("✅ Social media package created")
            return package

        except Exception as e:
            logger.error(f"❌ Failed to create social media package: {e}")
            raise

    async def _publish_to_client_channels(self, client_id: str, campaign_assets: dict[str, Any]) -> list[str]:
        """Publish campaign assets to client channels"""
        # In production, this would integrate with client's channels (LinkedIn, email, etc.)
        channels = self.client_channels.get(client_id, [])
        published = []

        for channel in channels:
            # Simulate publishing
            published.append(channel)
            logger.info(f"📤 Published to {channel}")

        return published

    def register_client_channel(self, client_id: str, channel: str):
        """Register a client channel for auto-publishing"""
        if client_id not in self.client_channels:
            self.client_channels[client_id] = []
        self.client_channels[client_id].append(channel)
        logger.info(f"📝 Registered channel {channel} for client {client_id}")


# Main execution for testing
if __name__ == "__main__":
    async def main():
        integration = NeoVibeIntegration()
        print("🎨 NeoVibe integration initialized")
        print(json.dumps({
            "status": "ready",
            "capabilities": [
                "create_client_campaign",
                "generate_presentation_template",
                "create_social_media_package"
            ]
        }, indent=2))

    asyncio.run(main())

