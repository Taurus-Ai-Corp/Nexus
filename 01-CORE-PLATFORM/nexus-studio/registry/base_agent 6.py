"""
🏰 Taurus AI Corp. - Base Agent Class
Foundation for all AI agents in the registry
"""

import logging
from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Any

logger = logging.getLogger(__name__)

class AgentStatus(Enum):
    """Agent status enumeration"""
    INACTIVE = "inactive"
    INITIALIZING = "initializing"
    ACTIVE = "active"
    ERROR = "error"
    OFFLINE = "offline"

class BaseAgent(ABC):
    """Base class for all AI agents in the registry"""

    def __init__(self):
        self.agent_id: str | None = None
        self.name: str = self.__class__.__name__
        self.status: AgentStatus = AgentStatus.INACTIVE
        self.created_at: datetime = datetime.now()
        self.last_activity: datetime = datetime.now()
        self.metadata: dict[str, Any] = {}
        self.config: dict[str, Any] = {}
        self.health_metrics: dict[str, Any] = {}

    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize the agent - must be implemented by subclasses"""
        pass

    @abstractmethod
    def get_capabilities(self) -> list[str]:
        """Return list of agent capabilities - must be implemented by subclasses"""
        pass

    @abstractmethod
    def get_metadata(self) -> Any:
        """Return agent metadata - must be implemented by subclasses"""
        pass

    async def start(self) -> bool:
        """Start the agent"""
        try:
            logger.info(f"🚀 Starting {self.name}...")
            self.status = AgentStatus.INITIALIZING

            success = await self.initialize()
            if success:
                self.status = AgentStatus.ACTIVE
                self.last_activity = datetime.now()
                logger.info(f"✅ {self.name} started successfully")
                return True
            else:
                self.status = AgentStatus.ERROR
                logger.error(f"❌ {self.name} failed to start")
                return False

        except Exception as e:
            self.status = AgentStatus.ERROR
            logger.error(f"❌ Error starting {self.name}: {e}")
            return False

    async def stop(self) -> bool:
        """Stop the agent"""
        try:
            logger.info(f"🛑 Stopping {self.name}...")
            self.status = AgentStatus.INACTIVE
            self.last_activity = datetime.now()
            logger.info(f"✅ {self.name} stopped successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Error stopping {self.name}: {e}")
            return False

    async def health_check(self) -> dict[str, Any]:
        """Perform health check on the agent"""
        try:
            health_status = {
                "agent_id": self.agent_id,
                "name": self.name,
                "status": self.status.value,
                "uptime": (datetime.now() - self.created_at).total_seconds(),
                "last_activity": self.last_activity.isoformat(),
                "timestamp": datetime.now().isoformat()
            }

            # Add custom health metrics if available
            if self.health_metrics:
                health_status["custom_metrics"] = self.health_metrics

            self.last_activity = datetime.now()
            return health_status

        except Exception as e:
            logger.error(f"❌ Health check failed for {self.name}: {e}")
            return {
                "agent_id": self.agent_id,
                "name": self.name,
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def update_config(self, config: dict[str, Any]) -> bool:
        """Update agent configuration"""
        try:
            self.config.update(config)
            logger.info(f"⚙️ Configuration updated for {self.name}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to update config for {self.name}: {e}")
            return False

    def get_config(self) -> dict[str, Any]:
        """Get current agent configuration"""
        return self.config.copy()

    def get_status(self) -> AgentStatus:
        """Get current agent status"""
        return self.status

    def is_active(self) -> bool:
        """Check if agent is active"""
        return self.status == AgentStatus.ACTIVE

    def is_healthy(self) -> bool:
        """Check if agent is healthy (active and not in error state)"""
        return self.status == AgentStatus.ACTIVE

    async def cleanup(self):
        """Cleanup agent resources - can be overridden by subclasses"""
        logger.info(f"🧹 Cleaning up {self.name}...")
        # Default cleanup - subclasses can override
        pass

    def __str__(self) -> str:
        return f"{self.name}(id={self.agent_id}, status={self.status.value})"

    def __repr__(self) -> str:
        return self.__str__()
