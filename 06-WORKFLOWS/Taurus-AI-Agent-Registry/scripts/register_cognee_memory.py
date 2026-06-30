#!/usr/bin/env python3
"""
Registration script for Cognee Memory Agent
Registers the cognitive intelligence agent in the Taurus AI Agent Registry
"""

import asyncio
import sys
from pathlib import Path

# Add registry and agents to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from agents.cognee_memory_agent import CogneeMemoryAgent
from registry.agent_registry import AgentMetadata, get_global_registry


async def register_cognee_memory_agent():
    """Register Cognee Memory Agent in the registry"""

    print("🧠 Registering Cognee AI Memory Agent")
    print("=" * 60)

    # Get global registry
    registry = get_global_registry()

    # Create agent metadata
    metadata = AgentMetadata(
        name="cognee_memory",
        version="1.0.0",
        description="AI-powered cognitive memory and intelligence using Cognee framework. Provides knowledge graphs, semantic search, contextual memory, and business intelligence extraction for advanced AI workflows.",
        capabilities=[
            "intelligent_memory_management",
            "knowledge_graph_generation",
            "semantic_search",
            "contextual_information_retrieval",
            "business_intelligence_extraction",
            "cognitive_data_processing",
            "multi_modal_memory",
            "dynamic_knowledge_connections",
            "insight_generation",
            "strategic_analysis",
            "memory_contextualization",
            "cognitive_automation"
        ],
        dependencies=[
            "cognee>=0.1.0",
            "pydantic>=2.0.0",
            "asyncio"
        ],
        api_requirements=[
            "LLM provider API key (OpenAI/Anthropic/other)",
            "Optional: Vector database access",
            "Optional: Graph database access",
            "Python 3.10+"
        ],
        business_domains=["intelligence", "memory", "knowledge", "analytics", "marketing", "universal"],
        github_repo="https://github.com/topoteretes/cognee",
        author="topoteretes / Taurus AI Corp Integration",
        status="active"
    )

    # Register the agent
    registry.register_agent(CogneeMemoryAgent, metadata)

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
            "llm_provider": "anthropic",
            "anthropic_api_key": "test-key",  # Will be replaced with actual config
            "vector_database": "default"
        }

        agent = await registry.load_agent("cognee_memory", config)
        if agent:
            print("   ✅ Agent loaded successfully")

            # Test capabilities
            capabilities = agent.get_capabilities()
            print(f"   📊 Available capabilities: {len(capabilities)}")

            # Test memory stats
            stats = agent.get_memory_stats()
            print(f"   🧠 Memory contexts: {stats['memory_contexts']}")

            # Test metadata
            agent_metadata = agent.get_metadata()
            print(f"   📋 Agent metadata: {agent_metadata.name} v{agent_metadata.version}")
        else:
            print("   ❌ Agent loading failed")

    except Exception as e:
        print(f"   ⚠️ Agent test failed (expected without Cognee setup): {str(e)}")

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
    asyncio.run(register_cognee_memory_agent())
