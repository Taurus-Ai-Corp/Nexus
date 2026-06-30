#!/usr/bin/env python3
"""
TAURUS AI CORP - Legacy Agent Activator
Systematically activate and integrate 200+ archived agents into active ecosystem
"""

import asyncio
import json
import logging
import shutil
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AgentDiscovery:
    """Agent discovery result"""
    name: str
    path: str
    agent_type: str
    description: str
    capabilities: list[str]
    dependencies: list[str]
    status: str = "discovered"
    activation_priority: int = 5  # 1-10, higher = more priority

@dataclass
class ActivationResult:
    """Agent activation result"""
    agent_name: str
    original_path: str
    new_path: str
    status: str
    error_message: str | None = None
    activated_at: str = None

class LegacyAgentActivator:
    """
    Systematically discover, analyze, and activate legacy agents from Archives
    """

    def __init__(self):
        self.base_path = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects")
        self.archives_paths = [
            self.base_path / "Archives",
            self.base_path / "STRUCTURE_OPTIMIZATION_BACKUP",
            self.base_path / "TAURUS AI CORP" / "Development-Sandbox" / "experiments"
        ]
        self.active_agents_path = self.base_path / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "activated"
        self.discovered_agents: list[AgentDiscovery] = []
        self.activation_results: list[ActivationResult] = []

    async def discover_all_legacy_agents(self) -> list[AgentDiscovery]:
        """Discover all legacy agents in archive directories"""
        logger.info("🔍 Starting comprehensive legacy agent discovery...")

        agent_patterns = [
            "*agent*.py",
            "*_agent.py",
            "agent_*.py",
            "*orchestrator*.py",
            "*automation*.py",
            "*intelligence*.py",
            "*monitoring*.py"
        ]

        discovered_count = 0

        for archive_path in self.archives_paths:
            if not archive_path.exists():
                continue

            logger.info(f"Scanning: {archive_path}")

            for pattern in agent_patterns:
                for agent_file in archive_path.rglob(pattern):
                    if agent_file.is_file() and agent_file.suffix == '.py':
                        agent_info = await self._analyze_agent_file(agent_file)
                        if agent_info:
                            self.discovered_agents.append(agent_info)
                            discovered_count += 1

        logger.info(f"✅ Discovered {discovered_count} legacy agents")
        await self._categorize_agents()
        return self.discovered_agents

    async def _analyze_agent_file(self, agent_file: Path) -> AgentDiscovery | None:
        """Analyze individual agent file to extract metadata"""
        try:
            with open(agent_file, encoding='utf-8') as f:
                content = f.read()

            # Extract basic information
            name = agent_file.stem
            description = self._extract_description(content)
            capabilities = self._extract_capabilities(content)
            dependencies = self._extract_dependencies(content)
            agent_type = self._determine_agent_type(name, content)
            priority = self._calculate_priority(agent_type, capabilities)

            return AgentDiscovery(
                name=name,
                path=str(agent_file),
                agent_type=agent_type,
                description=description,
                capabilities=capabilities,
                dependencies=dependencies,
                activation_priority=priority
            )

        except Exception as e:
            logger.warning(f"Failed to analyze {agent_file}: {e}")
            return None

    def _extract_description(self, content: str) -> str:
        """Extract agent description from docstring or comments"""
        lines = content.split('\n')
        for i, line in enumerate(lines[:20]):  # Check first 20 lines
            if '"""' in line or "'''" in line:
                # Found docstring start
                description_lines = []
                for j in range(i+1, min(i+10, len(lines))):
                    if '"""' in lines[j] or "'''" in lines[j]:
                        break
                    description_lines.append(lines[j].strip())
                return ' '.join(description_lines)[:200]

        # Fallback to first comment
        for line in lines[:10]:
            if line.strip().startswith('#') and len(line.strip()) > 5:
                return line.strip()[1:].strip()[:100]

        return "Legacy agent - description not found"

    def _extract_capabilities(self, content: str) -> list[str]:
        """Extract agent capabilities from code analysis"""
        capabilities = []

        # Look for common capability indicators
        capability_patterns = {
            'web_scraping': ['requests', 'beautifulsoup', 'selenium', 'scrapy'],
            'data_analysis': ['pandas', 'numpy', 'matplotlib', 'seaborn'],
            'ai_integration': ['openai', 'anthropic', 'langchain', 'transformers'],
            'database': ['sqlalchemy', 'psycopg2', 'sqlite', 'mongodb'],
            'api_integration': ['fastapi', 'flask', 'requests', 'aiohttp'],
            'social_media': ['twitter', 'facebook', 'instagram', 'linkedin'],
            'email': ['smtplib', 'sendgrid', 'mailgun', 'resend'],
            'file_processing': ['pathlib', 'shutil', 'os', 'glob'],
            'automation': ['schedule', 'celery', 'asyncio', 'threading'],
            'monitoring': ['logging', 'prometheus', 'grafana', 'alerts']
        }

        content_lower = content.lower()
        for capability, indicators in capability_patterns.items():
            if any(indicator in content_lower for indicator in indicators):
                capabilities.append(capability)

        return capabilities if capabilities else ['general_automation']

    def _extract_dependencies(self, content: str) -> list[str]:
        """Extract Python dependencies from imports"""
        dependencies = []
        lines = content.split('\n')

        for line in lines:
            line = line.strip()
            if line.startswith('import ') or line.startswith('from '):
                # Extract package name
                if line.startswith('import '):
                    pkg = line.replace('import ', '').split('.')[0].split(' as ')[0]
                elif line.startswith('from '):
                    pkg = line.replace('from ', '').split('.')[0].split(' import')[0]

                if pkg and not pkg.startswith('.') and pkg not in ['os', 'sys', 'json', 'datetime', 'typing']:
                    dependencies.append(pkg)

        return list(set(dependencies))

    def _determine_agent_type(self, name: str, content: str) -> str:
        """Determine agent type based on name and content"""
        name_lower = name.lower()
        content_lower = content.lower()

        type_indicators = {
            'orchestrator': ['orchestrat', 'master', 'coordinator'],
            'intelligence': ['intelligen', 'research', 'monitor', 'competitor'],
            'content': ['content', 'blog', 'social', 'marketing', 'newsletter'],
            'integration': ['integrat', 'api', 'webhook', 'connector', 'mcp'],
            'automation': ['automat', 'workflow', 'task', 'scheduler'],
            'performance': ['performan', 'monitor', 'analytics', 'metrics'],
            'business': ['business', 'crm', 'finance', 'sales', 'lead'],
            'webflow': ['webflow', 'design', 'template', 'cms'],
            'ecommerce': ['ecommerce', 'shop', 'product', 'order', 'payment']
        }

        for agent_type, indicators in type_indicators.items():
            if any(indicator in name_lower or indicator in content_lower for indicator in indicators):
                return agent_type

        return 'general'

    def _calculate_priority(self, agent_type: str, capabilities: list[str]) -> int:
        """Calculate activation priority (1-10, higher = more priority)"""
        priority_map = {
            'orchestrator': 10,
            'intelligence': 9,
            'integration': 8,
            'performance': 7,
            'business': 7,
            'webflow': 6,
            'content': 6,
            'automation': 5,
            'ecommerce': 5,
            'general': 3
        }

        base_priority = priority_map.get(agent_type, 3)

        # Boost priority based on capabilities
        if 'ai_integration' in capabilities:
            base_priority += 2
        if 'database' in capabilities:
            base_priority += 1
        if len(capabilities) > 5:
            base_priority += 1

        return min(base_priority, 10)

    async def _categorize_agents(self):
        """Categorize discovered agents by type and priority"""
        logger.info("📊 Categorizing discovered agents...")

        categories = {}
        for agent in self.discovered_agents:
            if agent.agent_type not in categories:
                categories[agent.agent_type] = []
            categories[agent.agent_type].append(agent)

        # Sort each category by priority
        for category in categories:
            categories[category].sort(key=lambda x: x.activation_priority, reverse=True)

        logger.info("Agent categories discovered:")
        for category, agents in categories.items():
            logger.info(f"  • {category}: {len(agents)} agents (priority: {agents[0].activation_priority if agents else 0})")

    async def activate_high_priority_agents(self, max_agents: int = 50) -> list[ActivationResult]:
        """Activate highest priority agents first"""
        logger.info(f"🚀 Activating top {max_agents} priority agents...")

        # Sort all agents by priority
        sorted_agents = sorted(self.discovered_agents, key=lambda x: x.activation_priority, reverse=True)

        # Create activation directory
        self.active_agents_path.mkdir(parents=True, exist_ok=True)

        activation_results = []

        for i, agent in enumerate(sorted_agents[:max_agents]):
            result = await self._activate_single_agent(agent)
            activation_results.append(result)
            self.activation_results.append(result)

            if result.status == "activated":
                logger.info(f"✅ Activated: {agent.name} (priority: {agent.activation_priority})")
            else:
                logger.warning(f"❌ Failed: {agent.name} - {result.error_message}")

        return activation_results

    async def _activate_single_agent(self, agent: AgentDiscovery) -> ActivationResult:
        """Activate a single agent"""
        try:
            source_path = Path(agent.path)

            # Create category directory
            category_dir = self.active_agents_path / agent.agent_type
            category_dir.mkdir(exist_ok=True)

            # Determine new filename
            new_filename = f"{agent.name}.py"
            counter = 1
            while (category_dir / new_filename).exists():
                new_filename = f"{agent.name}_{counter}.py"
                counter += 1

            destination_path = category_dir / new_filename

            # Copy agent file
            shutil.copy2(source_path, destination_path)

            # Create agent metadata file
            metadata_path = category_dir / f"{new_filename.replace('.py', '_metadata.json')}"
            metadata = {
                "original_path": agent.path,
                "agent_type": agent.agent_type,
                "description": agent.description,
                "capabilities": agent.capabilities,
                "dependencies": agent.dependencies,
                "activation_priority": agent.activation_priority,
                "activated_at": datetime.now().isoformat(),
                "status": "active"
            }

            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)

            return ActivationResult(
                agent_name=agent.name,
                original_path=agent.path,
                new_path=str(destination_path),
                status="activated",
                activated_at=datetime.now().isoformat()
            )

        except Exception as e:
            return ActivationResult(
                agent_name=agent.name,
                original_path=agent.path,
                new_path="",
                status="failed",
                error_message=str(e)
            )

    async def generate_activation_report(self) -> dict[str, Any]:
        """Generate comprehensive activation report"""
        successful_activations = [r for r in self.activation_results if r.status == "activated"]
        failed_activations = [r for r in self.activation_results if r.status == "failed"]

        # Category breakdown
        category_stats = {}
        for agent in self.discovered_agents:
            if agent.agent_type not in category_stats:
                category_stats[agent.agent_type] = 0
            category_stats[agent.agent_type] += 1

        report = {
            "activation_summary": {
                "total_discovered": len(self.discovered_agents),
                "successfully_activated": len(successful_activations),
                "failed_activations": len(failed_activations),
                "activation_rate": f"{len(successful_activations)/len(self.discovered_agents)*100:.1f}%" if self.discovered_agents else "0%"
            },
            "category_breakdown": category_stats,
            "high_priority_agents": [
                asdict(agent) for agent in sorted(self.discovered_agents, key=lambda x: x.activation_priority, reverse=True)[:20]
            ],
            "successful_activations": [asdict(r) for r in successful_activations],
            "failed_activations": [asdict(r) for r in failed_activations],
            "generated_at": datetime.now().isoformat()
        }

        # Save report
        report_path = self.active_agents_path / "activation_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)

        return report

async def main():
    """Main activation process"""
    activator = LegacyAgentActivator()

    # Step 1: Discover all legacy agents
    discovered_agents = await activator.discover_all_legacy_agents()

    # Step 2: Activate high priority agents
    activation_results = await activator.activate_high_priority_agents(max_agents=75)

    # Step 3: Generate report
    report = await activator.generate_activation_report()

    print("\n🎉 LEGACY AGENT ACTIVATION COMPLETE!")
    print("=" * 50)
    print(f"📊 Total Discovered: {report['activation_summary']['total_discovered']}")
    print(f"✅ Successfully Activated: {report['activation_summary']['successfully_activated']}")
    print(f"❌ Failed Activations: {report['activation_summary']['failed_activations']}")
    print(f"📈 Activation Rate: {report['activation_summary']['activation_rate']}")
    print("\n📂 Activated agents location:")
    print("   /TAURUS AI CORP/BizFlow-Orchestrator/agents/activated/")
    print("\n📋 Full report saved to: activation_report.json")

if __name__ == "__main__":
    asyncio.run(main())
