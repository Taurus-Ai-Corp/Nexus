#!/usr/bin/env python3
"""
Universal Orchestrator - Taurus AI Corp
Orchestrates agents and MCPs for any business venture using the registry
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import sys
from pathlib import Path

# Add registry to path
registry_path = Path(__file__).parent.parent
sys.path.insert(0, str(registry_path))

from registry.agent_registry import AgentRegistry, get_global_registry

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class BusinessVenture:
    """Configuration for a specific business venture"""
    name: str
    domain: str  # marketing, finance, healthcare, etc.
    required_capabilities: List[str]
    preferred_agents: List[str]
    config: Dict[str, Any]
    budget_limits: Dict[str, float] = None
    
class UniversalOrchestrator:
    """
    Universal orchestrator that can be configured for any Taurus AI Corp business venture
    """
    
    def __init__(self, business_venture: BusinessVenture):
        self.business = business_venture
        self.registry = get_global_registry()
        self.active_agents = {}
        self.active_mcps = {}
        self.task_queue = []
        self.results_storage = {}
        
    async def initialize(self) -> Dict[str, Any]:
        """Initialize orchestrator for the specific business venture"""
        
        logger.info(f"🚀 Initializing Universal Orchestrator for {self.business.name}")
        
        initialization_results = {
            "business_name": self.business.name,
            "domain": self.business.domain,
            "agents_loaded": [],
            "mcps_loaded": [],
            "capabilities_available": [],
            "initialization_errors": []
        }
        
        # Discover suitable agents for this business domain
        available_agents = self.registry.discover_agents_for_business(self.business.domain)
        
        # Load preferred agents if available, otherwise load all suitable ones
        agents_to_load = self.business.preferred_agents if self.business.preferred_agents else available_agents
        
        for agent_name in agents_to_load:
            if agent_name in available_agents:
                try:
                    agent = await self.registry.load_agent(agent_name, self.business.config)
                    if agent:
                        self.active_agents[agent_name] = agent
                        initialization_results["agents_loaded"].append(agent_name)
                        
                        # Collect capabilities
                        agent_capabilities = agent.get_capabilities()
                        initialization_results["capabilities_available"].extend(agent_capabilities)
                        
                        logger.info(f"   ✅ Loaded agent: {agent_name}")
                    else:
                        initialization_results["initialization_errors"].append(f"Failed to load agent: {agent_name}")
                        
                except Exception as e:
                    error_msg = f"Error loading agent {agent_name}: {str(e)}"
                    initialization_results["initialization_errors"].append(error_msg)
                    logger.error(error_msg)
            else:
                logger.warning(f"   ⚠️ Agent {agent_name} not available for domain {self.business.domain}")
        
        # Load suitable MCPs
        available_mcps = self.registry.discover_mcps_for_business(self.business.domain)
        
        for mcp_name in available_mcps:
            try:
                mcp = await self.registry.load_mcp(mcp_name, self.business.config)
                if mcp:
                    self.active_mcps[mcp_name] = mcp
                    initialization_results["mcps_loaded"].append(mcp_name)
                    logger.info(f"   ✅ Loaded MCP: {mcp_name}")
                    
            except Exception as e:
                error_msg = f"Error loading MCP {mcp_name}: {str(e)}"
                initialization_results["initialization_errors"].append(error_msg)
                logger.error(error_msg)
        
        # Check if we have the required capabilities
        available_caps = set(initialization_results["capabilities_available"])
        required_caps = set(self.business.required_capabilities)
        missing_caps = required_caps - available_caps
        
        if missing_caps:
            logger.warning(f"⚠️ Missing required capabilities: {', '.join(missing_caps)}")
            initialization_results["missing_capabilities"] = list(missing_caps)
        
        logger.info(f"📊 Initialization complete for {self.business.name}")
        logger.info(f"   Agents: {len(initialization_results['agents_loaded'])}")
        logger.info(f"   MCPs: {len(initialization_results['mcps_loaded'])}")
        logger.info(f"   Capabilities: {len(set(initialization_results['capabilities_available']))}")
        
        return initialization_results
    
    async def execute_business_process(self, process_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a business process using available agents and MCPs
        """
        
        process_id = process_data.get("id", f"process_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        
        logger.info(f"🎯 Executing business process: {process_id}")
        
        execution_results = {
            "process_id": process_id,
            "business_name": self.business.name,
            "start_time": datetime.now().isoformat(),
            "agent_results": {},
            "mcp_results": {},
            "execution_errors": [],
            "process_status": "running"
        }
        
        # Route tasks to appropriate agents based on capabilities
        tasks_by_capability = self._route_tasks_by_capability(process_data)
        
        # Execute tasks with appropriate agents
        for capability, task_data in tasks_by_capability.items():
            suitable_agent = self._find_agent_for_capability(capability)
            
            if suitable_agent:
                try:
                    logger.info(f"   🔄 Executing {capability} with {suitable_agent}")
                    
                    agent = self.active_agents[suitable_agent]
                    result = await agent.execute(task_data)
                    
                    execution_results["agent_results"][suitable_agent] = {
                        "capability": capability,
                        "result": result,
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    logger.info(f"   ✅ Completed {capability}")
                    
                except Exception as e:
                    error_msg = f"Error executing {capability} with {suitable_agent}: {str(e)}"
                    execution_results["execution_errors"].append(error_msg)
                    logger.error(f"   ❌ {error_msg}")
            else:
                error_msg = f"No suitable agent found for capability: {capability}"
                execution_results["execution_errors"].append(error_msg)
                logger.warning(f"   ⚠️ {error_msg}")
        
        # Execute MCP queries if needed
        mcp_queries = process_data.get("mcp_queries", {})
        for mcp_name, query_data in mcp_queries.items():
            if mcp_name in self.active_mcps:
                try:
                    logger.info(f"   🔄 Querying MCP: {mcp_name}")
                    
                    mcp = self.active_mcps[mcp_name]
                    result = await mcp.query(query_data)
                    
                    execution_results["mcp_results"][mcp_name] = {
                        "query_data": query_data,
                        "result": result,
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    logger.info(f"   ✅ MCP query completed: {mcp_name}")
                    
                except Exception as e:
                    error_msg = f"Error querying MCP {mcp_name}: {str(e)}"
                    execution_results["execution_errors"].append(error_msg)
                    logger.error(f"   ❌ {error_msg}")
        
        # Finalize results
        execution_results["end_time"] = datetime.now().isoformat()
        execution_results["process_status"] = "completed" if not execution_results["execution_errors"] else "completed_with_errors"
        
        # Store results
        self.results_storage[process_id] = execution_results
        
        logger.info(f"🎉 Business process completed: {process_id}")
        logger.info(f"   Status: {execution_results['process_status']}")
        logger.info(f"   Agent results: {len(execution_results['agent_results'])}")
        logger.info(f"   MCP results: {len(execution_results['mcp_results'])}")
        logger.info(f"   Errors: {len(execution_results['execution_errors'])}")
        
        return execution_results
    
    def _route_tasks_by_capability(self, process_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Route tasks to capabilities based on process requirements"""
        
        tasks_by_capability = {}
        
        # Standard capability mappings
        capability_mappings = {
            "market_research": {
                "capability": "market_research",
                "data": {
                    "market": process_data.get("target_market"),
                    "industry": process_data.get("industry"),
                    "research_depth": process_data.get("research_depth", "comprehensive")
                }
            },
            "competitor_analysis": {
                "capability": "competitor_analysis", 
                "data": {
                    "market": process_data.get("target_market"),
                    "competitors": process_data.get("competitors", []),
                    "analysis_type": process_data.get("analysis_type", "full")
                }
            },
            "content_generation": {
                "capability": "content_generation",
                "data": {
                    "content_type": process_data.get("content_type", "marketing"),
                    "target_audience": process_data.get("target_audience"),
                    "brand_voice": process_data.get("brand_voice", "professional")
                }
            },
            "web_scraping": {
                "capability": "web_scraping",
                "data": {
                    "urls": process_data.get("urls_to_scrape", []),
                    "scrape_depth": process_data.get("scrape_depth", "standard")
                }
            }
        }
        
        # Check which capabilities are requested
        requested_tasks = process_data.get("requested_capabilities", [])
        
        for task in requested_tasks:
            if task in capability_mappings:
                mapping = capability_mappings[task]
                tasks_by_capability[mapping["capability"]] = mapping["data"]
        
        return tasks_by_capability
    
    def _find_agent_for_capability(self, capability: str) -> Optional[str]:
        """Find the best agent for a specific capability"""
        
        for agent_name, agent in self.active_agents.items():
            try:
                agent_capabilities = agent.get_capabilities()
                if capability in agent_capabilities:
                    return agent_name
            except Exception as e:
                logger.error(f"Error getting capabilities from {agent_name}: {e}")
        
        return None
    
    def get_orchestrator_status(self) -> Dict[str, Any]:
        """Get comprehensive orchestrator status"""
        
        return {
            "business_venture": {
                "name": self.business.name,
                "domain": self.business.domain,
                "required_capabilities": self.business.required_capabilities
            },
            "active_resources": {
                "agents": list(self.active_agents.keys()),
                "mcps": list(self.active_mcps.keys())
            },
            "available_capabilities": self._get_all_available_capabilities(),
            "stored_results": len(self.results_storage),
            "registry_stats": self.registry.get_registry_stats()
        }
    
    def _get_all_available_capabilities(self) -> List[str]:
        """Get all capabilities available through active agents"""
        all_capabilities = set()
        
        for agent in self.active_agents.values():
            try:
                capabilities = agent.get_capabilities()
                all_capabilities.update(capabilities)
            except Exception as e:
                logger.error(f"Error getting capabilities: {e}")
        
        return list(all_capabilities)
    
    async def add_agent_from_github(self, repo_url: str) -> Dict[str, Any]:
        """Add a new agent from GitHub and integrate it into this orchestrator"""
        
        logger.info(f"🔄 Adding GitHub agent to {self.business.name}: {repo_url}")
        
        # Use registry to integrate the GitHub repo
        success = await self.registry.integrate_github_repo(repo_url, [self.business.domain, "universal"])
        
        if success:
            # Reinitialize to pick up new agents
            await self.initialize()
            return {
                "success": True, 
                "message": f"Agent from {repo_url} integrated into {self.business.name}",
                "new_status": self.get_orchestrator_status()
            }
        else:
            return {
                "success": False, 
                "message": f"Failed to integrate agent from {repo_url}"
            }
    
    def export_results(self, export_path: str = None) -> str:
        """Export all stored results to JSON file"""
        
        if export_path is None:
            export_path = f"{self.business.name.lower()}_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        export_data = {
            "export_metadata": {
                "business_name": self.business.name,
                "export_time": datetime.now().isoformat(),
                "total_results": len(self.results_storage)
            },
            "business_venture": {
                "name": self.business.name,
                "domain": self.business.domain,
                "required_capabilities": self.business.required_capabilities
            },
            "orchestrator_status": self.get_orchestrator_status(),
            "results": self.results_storage
        }
        
        with open(export_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, default=str)
        
        logger.info(f"📤 Results exported to: {export_path}")
        return export_path

# Factory function to create orchestrators for different businesses
async def create_bizflow_orchestrator() -> UniversalOrchestrator:
    """Create an orchestrator specifically configured for BizFlow™"""
    
    bizflow_venture = BusinessVenture(
        name="BizFlow™",
        domain="marketing",
        required_capabilities=[
            "market_research",
            "competitor_analysis", 
            "content_generation",
            "web_scraping"
        ],
        preferred_agents=[
            "competitor_analysis",
            "web_scraping", 
            "mcp_integration"
        ],
        config={
            "business_focus": "vibe_marketing",
            "target_markets": ["UAE", "India", "Canada"],
            "ai_providers": ["claude", "perplexity"]
        }
    )
    
    orchestrator = UniversalOrchestrator(bizflow_venture)
    await orchestrator.initialize()
    
    return orchestrator

# Test the universal orchestrator
async def main():
    """Test the universal orchestrator with BizFlow™"""
    
    # Create BizFlow orchestrator
    orchestrator = await create_bizflow_orchestrator()
    
    # Display status
    status = orchestrator.get_orchestrator_status()
    print("🔍 Universal Orchestrator Status:")
    for key, value in status.items():
        print(f"   {key}: {value}")
    
    # Test business process execution
    test_process = {
        "id": "test_bizflow_process_001",
        "target_market": "UAE", 
        "industry": "digital_marketing",
        "requested_capabilities": ["market_research", "competitor_analysis"],
        "competitors": ["HubSpot", "Mailchimp"],
        "research_depth": "comprehensive"
    }
    
    print("\\n🎯 Testing business process execution...")
    results = await orchestrator.execute_business_process(test_process)
    
    print(f"📊 Process Results:")
    print(f"   Status: {results['process_status']}")
    print(f"   Agent Results: {len(results['agent_results'])}")
    print(f"   Errors: {len(results['execution_errors'])}")
    
    # Export results
    export_file = orchestrator.export_results()
    print(f"\\n💾 Results exported to: {export_file}")

if __name__ == "__main__":
    asyncio.run(main())