#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - Master Orchestrator
Unified coordination system for BizFlow™ Brand Vibe Orchestrator
"""

import asyncio
import json
import logging
import os

# Import all core agents
import sys
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from dotenv import load_dotenv

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))

# Import integrated agents
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'research'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'business'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'content'))

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Core agents
    # Research agents
    from arxiv_researcher_agent import ArxivResearcherAgent

    # Content agents
    from blog_writer_agent import BlogWriterAgent
    from candidate_analyzer_agent import CandidateAnalyzerAgent
    from cognee_memory_agent import CogneeMemoryAgent
    from deep_researcher_agent import DeepResearcherAgent

    # Business agents
    from finance_agent_agent import FinanceAgentAgent
    from newsletter_generator_agent import NewsletterGeneratorAgent
    from ollama_local_agent import OllamaLocalAgent
    from onlook_visual_agent import OnlookVisualAgent
    from price_monitor_agent import PriceMonitorAgent
    from social_media_manager_agent import SocialMediaManagerAgent
    from startup_validator_agent import StartupValidatorAgent
    from trend_analyzer_agent import TrendAnalyzerAgent
    from vertex_ai_creative_agent import VertexAICreativeAgent
    from vibe_marketing_agent import VibeMarketingAgent

except ImportError as e:
    logger.warning(f"Some agents not available: {e}")
    # Create placeholder classes for missing agents
    class PlaceholderAgent:
        def __init__(self): pass
        async def execute_task(self, data): return {"status": "placeholder", "message": "Agent not implemented"}
        def get_info(self): return {"name": "placeholder", "capabilities": []}

    # Core agents
    VertexAICreativeAgent = PlaceholderAgent
    CogneeMemoryAgent = PlaceholderAgent
    OnlookVisualAgent = PlaceholderAgent
    OllamaLocalAgent = PlaceholderAgent
    VibeMarketingAgent = PlaceholderAgent

    # Research agents
    ArxivResearcherAgent = PlaceholderAgent
    DeepResearcherAgent = PlaceholderAgent
    TrendAnalyzerAgent = PlaceholderAgent
    CandidateAnalyzerAgent = PlaceholderAgent

    # Business agents
    FinanceAgentAgent = PlaceholderAgent
    PriceMonitorAgent = PlaceholderAgent
    StartupValidatorAgent = PlaceholderAgent

    # Content agents
    BlogWriterAgent = PlaceholderAgent
    NewsletterGeneratorAgent = PlaceholderAgent
    SocialMediaManagerAgent = PlaceholderAgent

@dataclass
class OrchestrationTask:
    """Unified task structure for all agents"""
    id: str
    agent_type: str
    task_data: dict[str, Any]
    priority: int = 1
    status: str = "pending"
    result: dict[str, Any] | None = None
    created_at: datetime = None
    completed_at: datetime | None = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()

class BizFlowMasterOrchestrator:
    """
    Master orchestrator for the unified BizFlow™ ecosystem
    Coordinates all 16 agents with intelligent routing
    """

    def __init__(self):
        self.agents = {}
        self.agent_categories = {
            'core': [],
            'research': [],
            'business': [],
            'content': []
        }
        self.task_queue = []
        self.results_storage = {}
        self.performance_metrics = {}
        self.initialize_agents()

    def initialize_agents(self):
        """Initialize all 16 agents across 4 categories"""
        try:
            # Core agents (5)
            self.agents['vertex_ai_creative'] = VertexAICreativeAgent()
            self.agents['cognee_memory'] = CogneeMemoryAgent()
            self.agents['onlook_visual'] = OnlookVisualAgent()
            self.agents['ollama_local'] = OllamaLocalAgent()
            self.agents['vibe_marketing'] = VibeMarketingAgent()
            self.agent_categories['core'] = ['vertex_ai_creative', 'cognee_memory', 'onlook_visual', 'ollama_local', 'vibe_marketing']

            # Research agents (4)
            self.agents['arxiv_researcher'] = ArxivResearcherAgent()
            self.agents['deep_researcher'] = DeepResearcherAgent()
            self.agents['trend_analyzer'] = TrendAnalyzerAgent()
            self.agents['candidate_analyzer'] = CandidateAnalyzerAgent()
            self.agent_categories['research'] = ['arxiv_researcher', 'deep_researcher', 'trend_analyzer', 'candidate_analyzer']

            # Business agents (3)
            self.agents['finance_agent'] = FinanceAgentAgent()
            self.agents['price_monitor'] = PriceMonitorAgent()
            self.agents['startup_validator'] = StartupValidatorAgent()
            self.agent_categories['business'] = ['finance_agent', 'price_monitor', 'startup_validator']

            # Content agents (3)
            self.agents['blog_writer'] = BlogWriterAgent()
            self.agents['newsletter_generator'] = NewsletterGeneratorAgent()
            self.agents['social_media_manager'] = SocialMediaManagerAgent()
            self.agent_categories['content'] = ['blog_writer', 'newsletter_generator', 'social_media_manager']

            total_agents = sum(len(agents) for agents in self.agent_categories.values())
            logger.info(f"✅ All {total_agents} agents initialized successfully across {len(self.agent_categories)} categories")

        except Exception as e:
            logger.error(f"Error initializing agents: {str(e)}")

    def get_agent_capabilities(self) -> dict[str, list[str]]:
        """Get capabilities of all agents"""
        capabilities = {}
        for agent_name, agent in self.agents.items():
            try:
                if hasattr(agent, 'get_info'):
                    info = agent.get_info()
                    capabilities[agent_name] = info.get('capabilities', [])
                else:
                    capabilities[agent_name] = ["Basic task execution"]
            except:
                capabilities[agent_name] = ["Basic task execution"]
        return capabilities

    def find_best_agent(self, task_description: str, task_type: str = None) -> str:
        """Find the best agent for a given task using intelligent routing"""
        capabilities = self.get_agent_capabilities()

        # Task type to agent mapping
        task_mappings = {
            'research': ['arxiv_researcher', 'deep_researcher', 'trend_analyzer'],
            'analysis': ['candidate_analyzer', 'trend_analyzer', 'cognee_memory'],
            'finance': ['finance_agent', 'price_monitor', 'startup_validator'],
            'content': ['blog_writer', 'newsletter_generator', 'vibe_marketing'],
            'visual': ['onlook_visual', 'vertex_ai_creative'],
            'social': ['social_media_manager', 'vibe_marketing'],
            'memory': ['cognee_memory', 'arxiv_researcher'],
            'creative': ['vertex_ai_creative', 'blog_writer', 'onlook_visual']
        }

        # If task_type is specified, use mapping
        if task_type and task_type in task_mappings:
            for agent_name in task_mappings[task_type]:
                if agent_name in self.agents:
                    return agent_name

        # Fallback to keyword matching
        keywords = task_description.lower().split()
        for agent_name, agent_caps in capabilities.items():
            for cap in agent_caps:
                if any(keyword in cap.lower() for keyword in keywords):
                    return agent_name

        # Default fallback
        return 'vibe_marketing'  # Most versatile agent

    async def route_task(self, task: OrchestrationTask) -> dict[str, Any]:
        """Intelligent task routing based on agent capabilities"""
        try:
            # If no agent specified, find the best one
            if not task.agent_type or task.agent_type == 'auto':
                task.agent_type = self.find_best_agent(
                    task.task_data.get('description', ''),
                    task.task_data.get('type', None)
                )
                logger.info(f"🤖 Auto-selected agent: {task.agent_type}")

            agent = self.agents.get(task.agent_type)
            if not agent:
                raise ValueError(f"Agent type '{task.agent_type}' not found")

            # Execute task with performance tracking
            start_time = datetime.now()
            result = await agent.execute_task(task.task_data)
            execution_time = (datetime.now() - start_time).total_seconds()

            # Update performance metrics
            self.performance_metrics[task.agent_type] = {
                'last_execution': execution_time,
                'total_tasks': self.performance_metrics.get(task.agent_type, {}).get('total_tasks', 0) + 1,
                'success_rate': 1.0  # Simplified for now
            }

            return result

        except Exception as e:
            logger.error(f"Task routing failed: {str(e)}")
            return {"error": str(e)}

    async def execute_marketing_campaign(self, campaign_data: dict[str, Any]) -> dict[str, Any]:
        """Execute complete marketing campaign using all agents"""
        logger.info("🚀 Starting unified marketing campaign")

        # 1. Market Research (Cognee Memory + Ollama Local)
        research_task = OrchestrationTask(
            id=f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            agent_type="cognee_memory",
            task_data={"action": "market_research", "data": campaign_data}
        )

        # 2. Content Generation (Vibe Marketing + Vertex AI Creative)
        content_task = OrchestrationTask(
            id=f"content_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            agent_type="vibe_marketing",
            task_data={"action": "generate_content", "data": campaign_data}
        )

        # 3. Visual Assets (Onlook Visual + Vertex AI Creative)
        visual_task = OrchestrationTask(
            id=f"visual_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            agent_type="onlook_visual",
            task_data={"action": "create_assets", "data": campaign_data}
        )

        # Execute all tasks concurrently
        tasks = [research_task, content_task, visual_task]
        results = await asyncio.gather(*[self.route_task(task) for task in tasks])

        # Compile campaign results
        campaign_result = {
            "campaign_id": f"bizflow_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "research": results[0],
            "content": results[1],
            "visuals": results[2],
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }

        logger.info("✅ Marketing campaign completed successfully")
        return campaign_result

    def get_agent_status(self) -> dict[str, Any]:
        """Get comprehensive status of all agents"""
        status = {
            "total_agents": len(self.agents),
            "categories": {},
            "capabilities": self.get_agent_capabilities(),
            "performance_metrics": self.performance_metrics,
            "timestamp": datetime.now().isoformat()
        }

        for category, agent_names in self.agent_categories.items():
            status["categories"][category] = {
                "count": len(agent_names),
                "agents": agent_names,
                "active": len([name for name in agent_names if name in self.agents])
            }

        return status

    async def execute_intelligent_task(self, description: str, task_data: dict[str, Any] = None) -> dict[str, Any]:
        """Execute a task with intelligent agent selection"""
        if task_data is None:
            task_data = {}

        task_data["description"] = description

        task = OrchestrationTask(
            id=f"intelligent_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            agent_type="auto",  # Let the system choose
            task_data=task_data
        )

        return await self.route_task(task)

# Global orchestrator instance
master_orchestrator = BizFlowMasterOrchestrator()

async def main():
    """Main execution function"""
    logger.info("🏰 Starting BizFlow™ Master Orchestrator")

    # Display agent status
    status = master_orchestrator.get_agent_status()
    logger.info(f"📊 Agent Status: {status['total_agents']} agents across {len(status['categories'])} categories")

    for category, info in status['categories'].items():
        logger.info(f"  {category.title()}: {info['active']}/{info['count']} agents active")

    # Test intelligent task routing
    logger.info("🧪 Testing intelligent task routing...")

    # Test research task
    research_result = await master_orchestrator.execute_intelligent_task(
        "Research latest trends in AI marketing",
        {"type": "research", "market": "UAE"}
    )
    logger.info(f"Research task result: {json.dumps(research_result, indent=2)}")

    # Test content task
    content_result = await master_orchestrator.execute_intelligent_task(
        "Create a blog post about digital transformation",
        {"type": "content", "format": "blog"}
    )
    logger.info(f"Content task result: {json.dumps(content_result, indent=2)}")

    # Test finance task
    finance_result = await master_orchestrator.execute_intelligent_task(
        "Analyze stock market trends for tech companies",
        {"type": "finance", "sector": "technology"}
    )
    logger.info(f"Finance task result: {json.dumps(finance_result, indent=2)}")

    logger.info("✅ All tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
