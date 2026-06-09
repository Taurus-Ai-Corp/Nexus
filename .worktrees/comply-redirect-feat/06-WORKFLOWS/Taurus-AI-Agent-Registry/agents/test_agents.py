"""
🧪 Test Script for Taurus AI Agents
Demonstrates the agents working together
"""

import asyncio
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Import our agents and registry
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from registry.agent_registry import AgentRegistry
from agents.vibe_marketing_agent import VibeMarketingAgent, VibeProfile, ContentRequest, ContentType, VibeStyle, TargetMarket
from agents.ollama_local_agent import OllamaLocalAgent

class MockAIRouter:
    """Mock AI router for testing the vibe marketing agent"""
    
    async def generate_text(self, prompt: str, max_tokens: int = 500, temperature: float = 0.8) -> str:
        """Mock text generation"""
        # Simulate AI response based on prompt
        if "social media post" in prompt.lower():
            return """🚀 Transform Your Business with Taurus AI!

Discover how our innovative solutions can revolutionize your approach to AI integration.

Key Benefits:
✅ Zero-cost local AI development
✅ Professional marketing content generation
✅ Multi-market cultural awareness
✅ Brand personality alignment

Ready to elevate your business? Let's create something amazing together!

#TaurusAI #Innovation #BusinessGrowth #AIRevolution"""
        
        elif "blog article" in prompt.lower():
            return """# The Future of AI: Local Development Meets Global Marketing

In today's rapidly evolving technological landscape, businesses are seeking innovative solutions that combine the power of artificial intelligence with cultural intelligence. Taurus AI Corp. is leading this revolution with our comprehensive approach to AI agent development and marketing content generation.

## Why Local AI Matters

Local AI development offers unprecedented advantages:
- **Privacy**: Your data stays on your infrastructure
- **Cost Efficiency**: Zero ongoing API costs
- **Customization**: Tailored solutions for your specific needs
- **Reliability**: No dependency on external services

## Cultural Intelligence in Marketing

Our vibe marketing agents understand that successful global marketing requires more than just translation—it requires cultural adaptation. We've built specialized knowledge for markets including:
- UAE: Luxury, innovation, and hospitality focus
- India: Value-driven, family-oriented content
- Canada: Inclusive, sustainable, and diverse messaging

## The Taurus AI Advantage

By combining local AI capabilities with cultural marketing intelligence, we're helping businesses create authentic, engaging content that resonates with their target audiences worldwide.

Ready to join the AI revolution? Contact Taurus AI Corp. today."""
        
        else:
            return """Taurus AI Corp. - Empowering businesses with intelligent AI solutions.

Our comprehensive platform combines local AI development capabilities with cultural marketing intelligence to deliver results that matter.

Discover the difference that intelligent, culturally-aware AI can make for your business."""
    
    async def chat_completion(self, messages: list, model: str = None, **kwargs) -> Dict[str, Any]:
        """Mock chat completion"""
        return {
            "message": {"content": "This is a mock response from the AI router."},
            "model": model or "mock-model"
        }

async def test_vibe_marketing_agent():
    """Test the vibe marketing agent"""
    print("\n🎨 Testing Vibe Marketing Agent...")
    
    # Create a vibe profile
    vibe_profile = VibeProfile(
        brand_name="Taurus AI Corp.",
        industry="Artificial Intelligence & Technology",
        target_audience="Business leaders and developers",
        primary_vibe=VibeStyle.INNOVATIVE,
        secondary_vibes=[VibeStyle.PROFESSIONAL, VibeStyle.COMMUNITY_FOCUSED],
        tone_keywords=["innovative", "transformative", "cutting-edge", "revolutionary"],
        avoid_keywords=["generic", "corporate", "boring"],
        brand_values=["innovation", "excellence", "community", "transformation"],
        unique_selling_points=["Local AI development", "Cultural marketing intelligence", "Zero-cost AI"]
    )
    
    # Create content request
    content_request = ContentRequest(
        content_type=ContentType.SOCIAL_MEDIA_POST,
        vibe_profile=vibe_profile,
        target_market=TargetMarket.UAE,
        topic="AI Innovation in Business",
        key_messages=[
            "Transform your business with local AI",
            "Cultural intelligence for global markets",
            "Zero-cost AI development solutions"
        ],
        call_to_action="Ready to revolutionize your business? Let's talk!",
        length_requirement="short",
        platform_specific="linkedin",
        include_hashtags=True,
        include_emojis=True
    )
    
    # Create and initialize the agent
    agent = VibeMarketingAgent()
    mock_router = MockAIRouter()
    agent.set_ai_router(mock_router)
    
    try:
        # Initialize the agent
        await agent.initialize()
        print("✅ Vibe Marketing Agent initialized")
        
        # Generate content
        content = await agent.generate_content(content_request)
        print(f"✅ Content generated: {content.word_count} words")
        print(f"📊 Engagement Score: {content.estimated_engagement_score}")
        print(f"🎯 Brand Alignment: {content.brand_alignment_score}")
        print(f"🌍 Market Relevance: {content.market_relevance_score}")
        
        print("\n📝 Generated Content:")
        print("=" * 50)
        print(f"Headline: {content.headline}")
        print("-" * 50)
        print(content.content)
        print("-" * 50)
        print(f"Call to Action: {content.call_to_action}")
        print(f"Hashtags: {', '.join(content.hashtags)}")
        print(f"Emojis: {', '.join(content.emojis_used)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Vibe Marketing Agent: {e}")
        return False

async def test_ollama_agent():
    """Test the Ollama local agent"""
    print("\n🦙 Testing Ollama Local Agent...")
    
    try:
        # Create and initialize the agent
        agent = OllamaLocalAgent()
        await agent.initialize()
        
        if agent.is_initialized:
            print("✅ Ollama Local Agent initialized")
            
            # Get available models
            models = await agent.get_available_models()
            print(f"📊 Available models: {len(models)}")
            
            # Get model stats
            stats = await agent.get_model_stats()
            print(f"📈 Model stats: {stats}")
            
            return True
        else:
            print("⚠️ Ollama Local Agent not fully initialized (Ollama server not running)")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Ollama Local Agent: {e}")
        return False

async def test_agent_registry():
    """Test the agent registry"""
    print("\n🏰 Testing Agent Registry...")
    
    try:
        # Create registry
        registry = AgentRegistry()
        print("✅ Agent Registry created")
        
        # Create agents
        vibe_agent = VibeMarketingAgent()
        ollama_agent = OllamaLocalAgent()
        
        # Get metadata
        vibe_metadata = vibe_agent.get_metadata()
        ollama_metadata = ollama_agent.get_metadata()
        
        # Register agents
        await registry.register_agent(vibe_agent, vibe_metadata)
        await registry.register_agent(ollama_agent, ollama_metadata)
        
        print(f"✅ Registered agents: {registry.list_agents()}")
        
        # Get registry stats
        stats = registry.get_registry_stats()
        print(f"📊 Registry stats: {stats}")
        
        # Export registry
        export_data = registry.export_registry()
        print(f"📤 Registry exported: {len(export_data)} characters")
        
        # Cleanup
        await registry.cleanup()
        print("✅ Registry cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Agent Registry: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 Starting Taurus AI Agent Tests...")
    print("=" * 60)
    
    results = {}
    
    # Test individual agents
    results["vibe_marketing"] = await test_vibe_marketing_agent()
    results["ollama_local"] = await test_ollama_agent()
    results["agent_registry"] = await test_agent_registry()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Results Summary:")
    print("=" * 60)
    
    for test_name, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name:20} {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print("-" * 60)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 All tests passed! Taurus AI Agents are working correctly.")
    else:
        print(f"\n⚠️ {total_tests - passed_tests} test(s) failed. Check the logs above for details.")

if __name__ == "__main__":
    # Run the tests
    asyncio.run(main())
