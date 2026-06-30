"""
Social Media Manager Agent for BizFlow-Orchestrator
Category: Content
"""

import sys
from pathlib import Path

# Add agent directory to path
agent_dir = Path(__file__).parent
sys.path.insert(0, str(agent_dir))

class SocialMediaManagerAgent:
    """Social Media Manager Agent wrapper for BizFlow-Orchestrator"""

    def __init__(self):
        self.name = "social_media_manager"
        self.category = "content"
        self.capabilities = self._get_capabilities()

    def _get_capabilities(self):
        """Get agent capabilities"""
        return [
            "Execute social media manager tasks",
            "Process content related requests",
            "Integrate with BizFlow-Orchestrator"
        ]

    async def execute_task(self, task_data):
        """Execute a task using this agent"""
        try:
            # Import and run the agent
            if (agent_dir / "main.py").exists():
                from main import main
                result = await main(task_data)
            elif (agent_dir / "app.py").exists():
                from app import app
                result = await app(task_data)
            else:
                result = {"status": "error", "message": "No main entry point found"}

            return {
                "status": "success",
                "agent": self.name,
                "category": self.category,
                "result": result
            }

        except Exception as e:
            return {
                "status": "error",
                "agent": self.name,
                "category": self.category,
                "error": str(e)
            }

    def get_info(self):
        """Get agent information"""
        return {
            "name": self.name,
            "category": self.category,
            "capabilities": self.capabilities,
            "path": str(agent_dir)
        }
