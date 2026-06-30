#!/usr/bin/env python3
"""
Registration script for Vertex AI Creative Studio Agent
Registers the agent in the Taurus AI Agent Registry
"""

import asyncio
import sys
from pathlib import Path

# Add registry and agents to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from agents.vertex_ai_creative_agent import VertexAICreativeAgent
from registry.agent_registry import AgentMetadata, get_global_registry


async def register_vertex_ai_creative_agent():
    """Register Vertex AI Creative Agent in the registry"""

    print("🚀 Registering Vertex AI Creative Studio Agent")
    print("=" * 60)

    # Get global registry
    registry = get_global_registry()

    # Create agent metadata
    metadata = AgentMetadata(
        name="vertex_ai_creative",
        version="1.0.0",
        description="AI-powered creative content generation using Google Vertex AI Creative Studio. Generates high-quality images, text content, and optimized prompts for marketing campaigns.",
        capabilities=[
            "image_generation",
            "text_content_creation",
            "prompt_optimization",
            "brand_aligned_creative",
            "marketing_asset_generation",
            "visual_content_creation",
            "ai_powered_design",
            "campaign_creative_development",
            "multimodal_content_generation"
        ],
        dependencies=[
            "google-cloud-aiplatform>=1.40.0",
            "vertexai>=1.38.0",
            "google-cloud-storage>=2.10.0"
        ],
        api_requirements=[
            "GOOGLE_CLOUD_PROJECT",
            "Vertex AI API enabled",
            "Google Cloud Storage access",
            "Imagen API access",
            "Gemini API access"
        ],
        business_domains=["marketing", "creative", "advertising", "branding", "universal"],
        github_repo="https://github.com/googlecloudplatform/vertex-ai-creative-studio",
        author="Google Cloud Platform / Taurus AI Corp Integration",
        status="active"
    )

    # Register the agent
    registry.register_agent(VertexAICreativeAgent, metadata)

    print("✅ Registration Details:")
    print(f"   Agent Name: {metadata.name}")
    print(f"   Version: {metadata.version}")
    print(f"   Capabilities: {len(metadata.capabilities)}")
    print(f"   Business Domains: {', '.join(metadata.business_domains)}")
    print(f"   Dependencies: {len(metadata.dependencies)}")

    # Test agent loading
    print("\n🧪 Testing Agent Loading:")
    try:
        config = {
            "gcp_project_id": "test-project",  # Will be replaced with actual config
            "gcp_location": "us-central1"
        }

        agent = await registry.load_agent("vertex_ai_creative", config)
        if agent:
            print("   ✅ Agent loaded successfully")

            # Test capabilities
            capabilities = agent.get_capabilities()
            print(f"   📊 Available capabilities: {len(capabilities)}")

            # Test metadata
            agent_metadata = agent.get_metadata()
            print(f"   📋 Agent metadata: {agent_metadata.name} v{agent_metadata.version}")
        else:
            print("   ❌ Agent loading failed")

    except Exception as e:
        print(f"   ⚠️ Agent test failed (expected without GCP setup): {str(e)}")

    # Display registry statistics
    print("\n📊 Registry Statistics:")
    stats = registry.get_registry_stats()
    for key, value in stats.items():
        print(f"   {key}: {value}")

    # Export updated registry
    export_file = registry.export_registry()
    print(f"\n💾 Registry exported to: {export_file}")

    return True

if __name__ == "__main__":
    asyncio.run(register_vertex_ai_creative_agent())
