#!/usr/bin/env python3
"""
BizFlow™ Connector - Links Registry to BizFlow Business
Enables seamless integration of registry agents with BizFlow™ operations
"""

import asyncio
import os
import sys
from pathlib import Path
from typing import Any

# Add registry to path
registry_path = Path(__file__).parent.parent
sys.path.insert(0, str(registry_path))

from registry.agent_registry import get_global_registry


class BizFlowConnector:
    """
    Connector that bridges the Universal Agent Registry with BizFlow™ business operations
    """

    def __init__(self, bizflow_path: str = None):
        self.registry = get_global_registry()
        self.bizflow_path = bizflow_path or self._detect_bizflow_path()
        self.loaded_agents = {}
        self.loaded_mcps = {}

    def _detect_bizflow_path(self) -> str:
        """Auto-detect BizFlow project path"""
        # Look for BizFlow in common locations
        possible_paths = [
            "/Users/user/Documents/TAAS Canada Inc./CURSOR Projects/BizFlow",
            "../BizFlow",
            "../../BizFlow"
        ]

        for path in possible_paths:
            if os.path.exists(path):
                return os.path.abspath(path)

        # Fallback to current directory
        return os.getcwd()

    async def initialize_for_bizflow(self) -> dict[str, Any]:
        """Initialize all available agents for BizFlow™"""

        print("🚀 Initializing BizFlow™ Registry Connector")
        print("=" * 60)

        # Discover agents suitable for marketing/business
        marketing_agents = self.registry.discover_agents_for_business("marketing")
        universal_agents = self.registry.discover_agents_for_business("universal")

        available_agents = list(set(marketing_agents + universal_agents))

        print(f"📊 Found {len(available_agents)} compatible agents")

        # Load basic configuration (from environment or defaults)
        config = self._get_bizflow_config()

        initialization_results = {
            "available_agents": available_agents,
            "loaded_agents": [],
            "failed_agents": [],
            "loaded_mcps": [],
            "config_used": config
        }

        # Try to load each available agent
        for agent_name in available_agents:
            try:
                agent = await self.registry.load_agent(agent_name, config)
                if agent:
                    self.loaded_agents[agent_name] = agent
                    initialization_results["loaded_agents"].append(agent_name)
                    print(f"   ✅ {agent_name}")
                else:
                    initialization_results["failed_agents"].append(agent_name)
                    print(f"   ❌ {agent_name}")
            except Exception as e:
                initialization_results["failed_agents"].append(agent_name)
                print(f"   💥 {agent_name}: {str(e)}")

        # Load compatible MCPs
        marketing_mcps = self.registry.discover_mcps_for_business("marketing")
        universal_mcps = self.registry.discover_mcps_for_business("universal")
        available_mcps = list(set(marketing_mcps + universal_mcps))

        for mcp_name in available_mcps:
            try:
                mcp = await self.registry.load_mcp(mcp_name, config)
                if mcp:
                    self.loaded_mcps[mcp_name] = mcp
                    initialization_results["loaded_mcps"].append(mcp_name)
                    print(f"   ✅ MCP: {mcp_name}")
            except Exception as e:
                print(f"   💥 MCP {mcp_name}: {str(e)}")

        print("\n📈 Initialization Complete:")
        print(f"   Loaded Agents: {len(initialization_results['loaded_agents'])}")
        print(f"   Loaded MCPs: {len(initialization_results['loaded_mcps'])}")
        print(f"   Failed: {len(initialization_results['failed_agents'])}")

        return initialization_results

    def _get_bizflow_config(self) -> dict[str, Any]:
        """Get BizFlow configuration from environment or defaults"""

        # Try to load from BizFlow .env file
        env_file = os.path.join(self.bizflow_path, ".env")
        config = {}

        if os.path.exists(env_file):
            try:
                with open(env_file) as f:
                    for line in f:
                        if '=' in line and not line.startswith('#'):
                            key, value = line.strip().split('=', 1)
                            config[key.lower()] = value
                print(f"📄 Loaded config from: {env_file}")
            except Exception as e:
                print(f"⚠️ Could not read config file: {e}")

        # Add default values for missing keys
        defaults = {
            'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
            'perplexity_api_key': os.getenv('PERPLEXITY_API_KEY'),
            'firecrawl_api_key': os.getenv('FIRECRAWL_API_KEY'),
            'context7_api_key': os.getenv('CONTEXT7_API_KEY'),
            'business_domain': 'marketing'
        }

        for key, value in defaults.items():
            if key not in config and value:
                config[key] = value

        return config

    async def execute_orchestrated_campaign(self, campaign_data: dict[str, Any]) -> dict[str, Any]:
        """
        Execute a campaign using registry agents - Compatible with BizFlow™ interface
        """

        results = {
            "campaign_id": campaign_data.get("id"),
            "registry_agents_used": [],
            "results": {},
            "errors": [],
            "timestamp": asyncio.get_event_loop().time()
        }

        # Use available agents for the campaign
        if "competitor_analysis" in self.loaded_agents:
            try:
                agent = self.loaded_agents["competitor_analysis"]
                task_data = {
                    "market": campaign_data.get("target_market"),
                    "industry": campaign_data.get("industry", "marketing"),
                    "competitors": campaign_data.get("competitors", [])
                }

                result = await agent.execute(task_data)
                results["results"]["competitor_analysis"] = result
                results["registry_agents_used"].append("competitor_analysis")

            except Exception as e:
                results["errors"].append(f"Competitor analysis failed: {str(e)}")

        # Add more agent executions as they become available...

        return results

    def get_available_capabilities(self) -> dict[str, list[str]]:
        """Get all capabilities available through loaded agents"""
        capabilities = {}

        for agent_name, agent in self.loaded_agents.items():
            try:
                agent_caps = agent.get_capabilities()
                capabilities[agent_name] = agent_caps
            except Exception as e:
                capabilities[agent_name] = [f"Error getting capabilities: {str(e)}"]

        return capabilities

    def get_connector_status(self) -> dict[str, Any]:
        """Get comprehensive status of the connector"""
        return {
            "bizflow_path": self.bizflow_path,
            "registry_stats": self.registry.get_registry_stats(),
            "loaded_agents": list(self.loaded_agents.keys()),
            "loaded_mcps": list(self.loaded_mcps.keys()),
            "total_capabilities": sum(len(caps) for caps in self.get_available_capabilities().values())
        }

    async def add_github_agent(self, repo_url: str) -> dict[str, Any]:
        """
        Add an agent from GitHub repository to the registry and load it for BizFlow™
        """
        print(f"🔄 Adding GitHub agent: {repo_url}")

        # Use registry's GitHub integration (to be implemented)
        success = await self.registry.integrate_github_repo(repo_url, ["marketing", "universal"])

        if success:
            # Reload available agents
            await self.initialize_for_bizflow()
            return {"success": True, "message": f"Agent from {repo_url} integrated successfully"}
        else:
            return {"success": False, "message": f"Failed to integrate agent from {repo_url}"}

# Convenience function for BizFlow™ projects
async def get_bizflow_connector() -> BizFlowConnector:
    """Get a configured BizFlow connector"""
    connector = BizFlowConnector()
    await connector.initialize_for_bizflow()
    return connector

# Test the connector
async def main():
    """Test the BizFlow connector"""

    connector = await get_bizflow_connector()

    # Display status
    status = connector.get_connector_status()
    print("\\n🔍 BizFlow™ Connector Status:")
    for key, value in status.items():
        print(f"   {key}: {value}")

    # Show available capabilities
    capabilities = connector.get_available_capabilities()
    print("\\n🛠️ Available Capabilities:")
    for agent, caps in capabilities.items():
        print(f"   {agent}: {', '.join(caps)}")

if __name__ == "__main__":
    asyncio.run(main())
