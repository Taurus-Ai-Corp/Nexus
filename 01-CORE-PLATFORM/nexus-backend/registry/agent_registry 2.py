"""
🏰 Taurus AI Corp. - Agent Registry
Central management system for all AI agents
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Type
from datetime import datetime
from dataclasses import dataclass
import json

from .base_agent import BaseAgent, AgentStatus

logger = logging.getLogger(__name__)

@dataclass
class AgentMetadata:
    """Metadata for agent registration"""
    name: str
    version: str
    description: str
    capabilities: List[str]
    dependencies: List[str]
    api_requirements: List[str]
    business_domains: List[str]
    github_repo: str
    author: str
    status: str

class AgentRegistry:
    """Central registry for managing all AI agents"""
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.agent_metadata: Dict[str, AgentMetadata] = {}
        self.registry_status: str = "initializing"
        self.created_at: datetime = datetime.now()
        self.last_updated: datetime = datetime.now()
        
    async def register_agent(self, agent: BaseAgent, metadata: AgentMetadata) -> bool:
        """Register a new agent in the registry"""
        try:
            agent_id = f"{metadata.name}_{metadata.version}"
            agent.agent_id = agent_id
            
            self.agents[agent_id] = agent
            self.agent_metadata[agent_id] = metadata
            
            self.last_updated = datetime.now()
            logger.info(f"✅ Registered agent: {agent_id}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to register agent: {e}")
            return False
    
    async def unregister_agent(self, agent_id: str) -> bool:
        """Unregister an agent from the registry"""
        try:
            if agent_id in self.agents:
                # Stop the agent if it's running
                agent = self.agents[agent_id]
                if agent.is_active():
                    await agent.stop()
                
                # Cleanup agent resources
                await agent.cleanup()
                
                # Remove from registry
                del self.agents[agent_id]
                if agent_id in self.agent_metadata:
                    del self.agent_metadata[agent_id]
                
                self.last_updated = datetime.now()
                logger.info(f"✅ Unregistered agent: {agent_id}")
                return True
            else:
                logger.warning(f"⚠️ Agent {agent_id} not found in registry")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to unregister agent {agent_id}: {e}")
            return False
    
    async def start_agent(self, agent_id: str) -> bool:
        """Start a specific agent"""
        try:
            if agent_id in self.agents:
                agent = self.agents[agent_id]
                success = await agent.start()
                if success:
                    self.last_updated = datetime.now()
                    logger.info(f"✅ Started agent: {agent_id}")
                return success
            else:
                logger.error(f"❌ Agent {agent_id} not found in registry")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to start agent {agent_id}: {e}")
            return False
    
    async def stop_agent(self, agent_id: str) -> bool:
        """Stop a specific agent"""
        try:
            if agent_id in self.agents:
                agent = self.agents[agent_id]
                success = await agent.stop()
                if success:
                    self.last_updated = datetime.now()
                    logger.info(f"✅ Stopped agent: {agent_id}")
                return success
            else:
                logger.error(f"❌ Agent {agent_id} not found in registry")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to stop agent {agent_id}: {e}")
            return False
    
    async def start_all_agents(self) -> Dict[str, bool]:
        """Start all registered agents"""
        results = {}
        logger.info("🚀 Starting all agents...")
        
        for agent_id in self.agents:
            results[agent_id] = await self.start_agent(agent_id)
            # Small delay to avoid overwhelming the system
            await asyncio.sleep(0.1)
        
        self.last_updated = datetime.now()
        return results
    
    async def stop_all_agents(self) -> Dict[str, bool]:
        """Stop all registered agents"""
        results = {}
        logger.info("🛑 Stopping all agents...")
        
        for agent_id in self.agents:
            results[agent_id] = await self.stop_agent(agent_id)
            # Small delay to avoid overwhelming the system
            await asyncio.sleep(0.1)
        
        self.last_updated = datetime.now()
        return results
    
    def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """Get a specific agent by ID"""
        return self.agents.get(agent_id)
    
    def get_agent_metadata(self, agent_id: str) -> Optional[AgentMetadata]:
        """Get metadata for a specific agent"""
        return self.agent_metadata.get(agent_id)
    
    def list_agents(self) -> List[str]:
        """List all registered agent IDs"""
        return list(self.agents.keys())
    
    def list_active_agents(self) -> List[str]:
        """List all active agent IDs"""
        return [agent_id for agent_id, agent in self.agents.items() if agent.is_active()]
    
    def list_agents_by_capability(self, capability: str) -> List[str]:
        """List agents that have a specific capability"""
        matching_agents = []
        
        for agent_id, metadata in self.agent_metadata.items():
            if capability in metadata.capabilities:
                matching_agents.append(agent_id)
        
        return matching_agents
    
    def list_agents_by_domain(self, domain: str) -> List[str]:
        """List agents that operate in a specific business domain"""
        matching_agents = []
        
        for agent_id, metadata in self.agent_metadata.items():
            if domain in metadata.business_domains:
                matching_agents.append(agent_id)
        
        return matching_agents
    
    async def health_check_all(self) -> Dict[str, Any]:
        """Perform health check on all agents"""
        health_results = {}
        logger.info("🏥 Performing health check on all agents...")
        
        for agent_id, agent in self.agents.items():
            try:
                health_status = await agent.health_check()
                health_results[agent_id] = health_status
            except Exception as e:
                health_results[agent_id] = {
                    "status": "error",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
        
        # Overall registry health
        active_count = len([r for r in health_results.values() if r.get("status") == "active"])
        total_count = len(health_results)
        
        registry_health = {
            "registry_status": "healthy" if active_count == total_count else "degraded",
            "total_agents": total_count,
            "active_agents": active_count,
            "agent_health": health_results,
            "timestamp": datetime.now().isoformat()
        }
        
        self.last_updated = datetime.now()
        return registry_health
    
    def get_registry_stats(self) -> Dict[str, Any]:
        """Get registry statistics"""
        active_count = len(self.list_active_agents())
        total_count = len(self.agents)
        
        # Capability distribution
        capability_counts = {}
        for metadata in self.agent_metadata.values():
            for capability in metadata.capabilities:
                capability_counts[capability] = capability_counts.get(capability, 0) + 1
        
        # Domain distribution
        domain_counts = {}
        for metadata in self.agent_metadata.values():
            for domain in metadata.business_domains:
                domain_counts[domain] = domain_counts.get(domain, 0) + 1
        
        return {
            "total_agents": total_count,
            "active_agents": active_count,
            "inactive_agents": total_count - active_count,
            "capability_distribution": capability_counts,
            "domain_distribution": domain_counts,
            "registry_uptime": (datetime.now() - self.created_at).total_seconds(),
            "last_updated": self.last_updated.isoformat(),
            "created_at": self.created_at.isoformat()
        }
    
    async def cleanup(self):
        """Cleanup all agents and registry resources"""
        logger.info("🧹 Cleaning up agent registry...")
        
        # Stop and cleanup all agents
        await self.stop_all_agents()
        
        # Clear registry
        self.agents.clear()
        self.agent_metadata.clear()
        
        self.registry_status = "shutdown"
        logger.info("✅ Agent registry cleaned up")
    
    def export_registry(self) -> str:
        """Export registry data as JSON"""
        try:
            export_data = {
                "registry_info": {
                    "status": self.registry_status,
                    "created_at": self.created_at.isoformat(),
                    "last_updated": self.last_updated.isoformat()
                },
                "agents": {
                    agent_id: {
                        "metadata": {
                            "name": metadata.name,
                            "version": metadata.version,
                            "description": metadata.description,
                            "capabilities": metadata.capabilities,
                            "business_domains": metadata.business_domains,
                            "status": metadata.status
                        },
                        "agent_status": agent.status.value,
                        "created_at": agent.created_at.isoformat(),
                        "last_activity": agent.last_activity.isoformat()
                    }
                    for agent_id, (agent, metadata) in zip(self.agents.keys(), 
                                                          zip(self.agents.values(), 
                                                              self.agent_metadata.values()))
                }
            }
            
            return json.dumps(export_data, indent=2)
            
        except Exception as e:
            logger.error(f"❌ Failed to export registry: {e}")
            return json.dumps({"error": str(e)})
    
    def __str__(self) -> str:
        return f"AgentRegistry(agents={len(self.agents)}, status={self.registry_status})"
    
    def __repr__(self) -> str:
        return self.__str__()
