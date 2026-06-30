"""
🎭 Demo Script for Taurus AI Agents
Shows practical usage examples
"""

import asyncio
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Import our agents and registry
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.ollama_local_agent import OllamaLocalAgent
from agents.vibe_marketing_agent import (
    ContentRequest,
    ContentType,
    TargetMarket,
    VibeMarketingAgent,
    VibeProfile,
    VibeStyle,
)


class DemoAIRouter:
    """Demo AI router that provides realistic responses"""

    async def generate_text(self, prompt: str, max_tokens: int = 500, temperature: float = 0.8) -> str:
        """Generate realistic marketing content"""

        if "social media post" in prompt.lower():
            if "uae" in prompt.lower():
                return """🚀 Discover the Future of AI with Taurus AI Corp!

Transform your business with our cutting-edge local AI solutions that understand the UAE market's unique needs.

✨ Why Choose Taurus AI?
• Zero-cost local AI development
• Cultural intelligence for MENA markets
• Luxury and innovation-focused solutions
• Premium business transformation

Ready to elevate your business to the next level? Let's create something extraordinary together!

#TaurusAI #UAEBusiness #Innovation #LuxuryTech #FutureReady #AIRevolution"""

            elif "india" in prompt.lower():
                return """🌟 Transform Your Business with Taurus AI Corp!

Discover how our innovative AI solutions can revolutionize your approach to technology and growth in the Indian market.

🚀 Key Benefits:
✅ Value-driven AI solutions
✅ Family-oriented business approach
✅ Community-focused innovation
✅ Cost-effective development

Join thousands of Indian businesses already transforming with Taurus AI!

Ready to grow together? Let's build the future! 🇮🇳

#TaurusAI #IndiaBusiness #Innovation #Growth #Community #TechForAll"""

            else:
                return """🚀 Unlock Your Business Potential with Taurus AI!

Discover how our innovative AI solutions can transform your business operations and drive unprecedented growth.

✨ What We Offer:
• Local AI development capabilities
• Cultural market intelligence
• Zero-cost AI solutions
• Professional excellence

Ready to revolutionize your business? Let's create something amazing together!

#TaurusAI #Innovation #BusinessGrowth #AIRevolution #Excellence"""

        elif "blog article" in prompt.lower():
            return """# The Future of Business: AI-Powered Transformation

In today's rapidly evolving business landscape, companies are seeking innovative solutions that can provide competitive advantages while maintaining cost efficiency. Taurus AI Corp. is at the forefront of this revolution, offering comprehensive AI solutions that combine local development capabilities with cultural intelligence.

## Why Local AI Matters

Local AI development provides unprecedented advantages for businesses:
- **Privacy & Security**: Your data remains on your infrastructure
- **Cost Efficiency**: Zero ongoing API costs
- **Customization**: Tailored solutions for your specific needs
- **Reliability**: No dependency on external services

## Cultural Intelligence in Business

Our approach goes beyond simple AI implementation. We understand that successful business transformation requires cultural awareness and market-specific insights. Whether you're operating in the UAE, India, Canada, or globally, our solutions are designed to resonate with your target audience.

## The Taurus AI Advantage

By combining cutting-edge AI technology with deep cultural understanding, we're helping businesses create authentic, engaging experiences that drive results.

Ready to transform your business? Contact Taurus AI Corp. today."""

        else:
            return """Taurus AI Corp. - Empowering businesses with intelligent AI solutions.

Our comprehensive platform combines local AI development capabilities with cultural marketing intelligence to deliver results that matter.

Discover the difference that intelligent, culturally-aware AI can make for your business."""

async def demo_vibe_marketing():
    """Demonstrate vibe marketing agent capabilities"""
    print("\n🎨 Vibe Marketing Agent Demo")
    print("=" * 50)

    # Create different vibe profiles for different markets
    markets = [
        (TargetMarket.UAE, "UAE Market", "luxury", "innovation"),
        (TargetMarket.INDIA, "Indian Market", "value", "community"),
        (TargetMarket.CANADA, "Canadian Market", "inclusivity", "sustainability")
    ]

    for target_market, market_name, vibe1, vibe2 in markets:
        print(f"\n🌍 {market_name} Content Generation:")
        print("-" * 30)

        # Create vibe profile
        vibe_profile = VibeProfile(
            brand_name="Taurus AI Corp.",
            industry="Artificial Intelligence & Technology",
            target_audience="Business leaders and developers",
            primary_vibe=VibeStyle.INNOVATIVE,
            secondary_vibes=[VibeStyle.PROFESSIONAL, VibeStyle.COMMUNITY_FOCUSED],
            tone_keywords=[vibe1, vibe2, "innovative", "transformative"],
            avoid_keywords=["generic", "corporate", "boring"],
            brand_values=["innovation", "excellence", "community", "transformation"],
            unique_selling_points=["Local AI development", "Cultural marketing intelligence", "Zero-cost AI"]
        )

        # Create content request
        content_request = ContentRequest(
            content_type=ContentType.SOCIAL_MEDIA_POST,
            vibe_profile=vibe_profile,
            target_market=target_market,
            topic=f"AI Innovation in {market_name}",
            key_messages=[
                f"Transform your business with local AI for {market_name}",
                f"Cultural intelligence for {market_name} markets",
                "Zero-cost AI development solutions"
            ],
            call_to_action="Ready to revolutionize your business? Let's talk!",
            length_requirement="short",
            platform_specific="linkedin",
            include_hashtags=True,
            include_emojis=True
        )

        # Generate content
        agent = VibeMarketingAgent()
        demo_router = DemoAIRouter()
        agent.set_ai_router(demo_router)
        await agent.initialize()

        content = await agent.generate_content(content_request)

        print(f"📊 Engagement Score: {content.estimated_engagement_score}")
        print(f"🎯 Brand Alignment: {content.brand_alignment_score}")
        print(f"🌍 Market Relevance: {content.market_relevance_score}")
        print(f"📝 Content: {content.content[:100]}...")
        print(f"🏷️ Hashtags: {', '.join(content.hashtags[:3])}...")

async def demo_ollama_integration():
    """Demonstrate Ollama local agent capabilities"""
    print("\n🦙 Ollama Local Agent Demo")
    print("=" * 50)

    try:
        agent = OllamaLocalAgent()
        await agent.initialize()

        if agent.is_initialized:
            print("✅ Ollama Local Agent ready")

            # Show available models
            models = await agent.get_available_models()
            print(f"📊 Available Models: {len(models)}")
            for model_name, model_info in models.items():
                print(f"  • {model_name}: {model_info['size']} - {model_info['performance_tier']}")

            # Show capabilities
            stats = await agent.get_model_stats()
            print(f"🔧 Capabilities: {', '.join(stats['capabilities_coverage'][:5])}...")

            print("\n💡 You can now use this agent for:")
            print("  • Local AI text generation")
            print("  • Code generation and analysis")
            print("  • Text summarization and analysis")
            print("  • Creative writing and content generation")

        else:
            print("⚠️ Ollama not available - install and start Ollama server to use local AI")

    except Exception as e:
        print(f"❌ Ollama demo error: {e}")

async def demo_campaign_generation():
    """Demonstrate campaign suite generation"""
    print("\n🚀 Campaign Suite Generation Demo")
    print("=" * 50)

    # Create a comprehensive vibe profile
    vibe_profile = VibeProfile(
        brand_name="Taurus AI Corp.",
        industry="Artificial Intelligence & Technology",
        target_audience="Global business leaders",
        primary_vibe=VibeStyle.INNOVATIVE,
        secondary_vibes=[VibeStyle.PROFESSIONAL, VibeStyle.COMMUNITY_FOCUSED],
        tone_keywords=["innovative", "transformative", "cutting-edge", "revolutionary"],
        avoid_keywords=["generic", "corporate", "boring"],
        brand_values=["innovation", "excellence", "community", "transformation"],
        unique_selling_points=["Local AI development", "Cultural marketing intelligence", "Zero-cost AI"]
    )

    # Generate campaign suite
    agent = VibeMarketingAgent()
    demo_router = DemoAIRouter()
    agent.set_ai_router(demo_router)
    await agent.initialize()

    content_types = [
        ContentType.SOCIAL_MEDIA_POST,
        ContentType.EMAIL_CAMPAIGN,
        ContentType.BLOG_ARTICLE
    ]

    print("🎯 Generating campaign suite for 'AI Business Transformation'...")

    campaign_content = await agent.generate_campaign_suite(
        vibe_profile=vibe_profile,
        target_market=TargetMarket.GLOBAL,
        campaign_theme="AI Business Transformation",
        content_types=content_types
    )

    print(f"✅ Generated {len(campaign_content)} pieces of content:")

    for content_type, content in campaign_content.items():
        print(f"\n📋 {content_type.replace('_', ' ').title()}:")
        print(f"  • Words: {content.word_count}")
        print(f"  • Engagement: {content.estimated_engagement_score}")
        print(f"  • Brand Alignment: {content.brand_alignment_score}")
        print(f"  • Preview: {content.content[:80]}...")

async def main():
    """Main demo function"""
    print("🎭 Taurus AI Agents Demo")
    print("=" * 60)
    print("This demo showcases the capabilities of our AI agents:")
    print("• 🎨 Vibe Marketing Agent - Cultural marketing content")
    print("• 🦙 Ollama Local Agent - Local AI capabilities")
    print("• 🚀 Campaign Generation - Multi-format content suites")
    print("=" * 60)

    # Run demos
    await demo_vibe_marketing()
    await demo_ollama_integration()
    await demo_campaign_generation()

    print("\n" + "=" * 60)
    print("🎉 Demo Complete!")
    print("=" * 60)
    print("These agents demonstrate how you can:")
    print("• Create culturally-aware marketing content")
    print("• Use local AI for zero-cost development")
    print("• Generate comprehensive marketing campaigns")
    print("• Scale globally while maintaining local relevance")
    print("\nReady to build your own AI empire? 🚀")

if __name__ == "__main__":
    # Run the demo
    asyncio.run(main())
