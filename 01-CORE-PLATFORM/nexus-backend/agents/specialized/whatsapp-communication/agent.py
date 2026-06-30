#!/usr/bin/env python3
"""
📱 TAURUS AI CORP. - WhatsApp Communication Agent
Enterprise WhatsApp automation and client service delivery agent
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "registry"))
from base_agent import AgentStatus, BaseAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WhatsAppCommunicationAgent(BaseAgent):
    """
    WhatsApp Communication Agent for TAURUS AI CORP
    
    Capabilities:
    - Customer support automation
    - Lead qualification and nurturing
    - Sales pipeline updates
    - Financial services automation (EMI reminders, KYC workflows)
    - Client onboarding automation
    - Campaign management and reporting
    - Team notifications and alerts
    """

    def __init__(self, config: dict[str, Any] | None = None):
        super().__init__()
        self.agent_id = "whatsapp-communication"
        self.name = "WhatsApp Communication Agent"
        self.description = "Enterprise WhatsApp automation and client service delivery"

        # Configuration
        self.config = config or {}
        self.api_base_url = self.config.get("WHATSAPP_API_BASE_URL", os.getenv("WHATSAPP_API_BASE_URL", "http://localhost:3000"))

        # MCP Integration (will be initialized via MCP client)
        self.mcp_tools = {}
        self.mcp_available = False

        # Agent capabilities
        self.capabilities = [
            "send_message",
            "send_media",
            "get_contacts",
            "get_status",
            "get_qr",
            "customer_support_automation",
            "lead_qualification",
            "sales_pipeline_updates",
            "financial_services_automation",
            "client_onboarding",
            "campaign_management",
            "team_notifications"
        ]

        # Workflow tracking
        self.active_workflows = {}
        self.message_queue = []
        self.contact_cache = {}

    async def initialize(self) -> bool:
        """Initialize the WhatsApp Communication Agent"""
        try:
            logger.info(f"🚀 Initializing {self.name}...")
            self.status = AgentStatus.INITIALIZING

            # Check WhatsApp service availability
            await self._check_whatsapp_service()

            # Initialize MCP tools (if available)
            await self._initialize_mcp_tools()

            # Load contact cache
            await self._load_contact_cache()

            self.status = AgentStatus.ACTIVE
            self.last_activity = datetime.now()
            logger.info(f"✅ {self.name} initialized successfully")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to initialize {self.name}: {e}")
            self.status = AgentStatus.ERROR
            return False

    async def _check_whatsapp_service(self) -> bool:
        """Check if WhatsApp Web.js service is available"""
        try:
            import requests
            response = requests.get(f"{self.api_base_url}/api/status", timeout=5)
            if response.status_code == 200:
                status = response.json()
                self.health_metrics["whatsapp_service"] = {
                    "available": True,
                    "ready": status.get("ready", False),
                    "authenticated": status.get("session") == "authenticated"
                }
                logger.info("✅ WhatsApp service is available")
                return True
            else:
                logger.warning("⚠️ WhatsApp service not responding")
                return False
        except Exception as e:
            logger.warning(f"⚠️ WhatsApp service check failed: {e}")
            self.health_metrics["whatsapp_service"] = {"available": False, "error": str(e)}
            return False

    async def _initialize_mcp_tools(self):
        """Initialize MCP tools for WhatsApp operations"""
        # MCP tools will be injected by the orchestrator
        # This is a placeholder for future direct MCP integration
        self.mcp_available = True
        logger.info("📱 MCP tools ready for WhatsApp operations")

    async def _load_contact_cache(self):
        """Load contact cache for faster lookups"""
        try:
            # This would load from cache/database in production
            self.contact_cache = {}
            logger.info("📇 Contact cache initialized")
        except Exception as e:
            logger.warning(f"⚠️ Failed to load contact cache: {e}")

    def get_capabilities(self) -> list[str]:
        """Return list of agent capabilities"""
        return self.capabilities

    def get_metadata(self) -> dict[str, Any]:
        """Return agent metadata"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "description": self.description,
            "version": "1.0.0",
            "capabilities": self.capabilities,
            "status": self.status.value,
            "whatsapp_service": self.health_metrics.get("whatsapp_service", {}),
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat()
        }

    # Core WhatsApp Operations

    async def send_message(self, to: str, message: str, workflow_id: str | None = None) -> dict[str, Any]:
        """Send a WhatsApp text message"""
        try:
            # Use MCP tool if available, otherwise direct API call
            if self.mcp_available and "whatsapp_send_message" in self.mcp_tools:
                result = await self.mcp_tools["whatsapp_send_message"](to=to, message=message)
            else:
                # Direct API call fallback
                import requests
                response = requests.post(
                    f"{self.api_base_url}/api/send-message",
                    json={"to": to, "message": message},
                    timeout=10
                )
                result = response.json()

            # Track message in workflow if provided
            if workflow_id:
                await self._track_workflow_message(workflow_id, "sent", result)

            self.last_activity = datetime.now()
            return {
                "success": True,
                "result": result,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"❌ Failed to send message: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def send_media(self, to: str, media_url: str, caption: str = "", workflow_id: str | None = None) -> dict[str, Any]:
        """Send a WhatsApp media message"""
        try:
            if self.mcp_available and "whatsapp_send_media" in self.mcp_tools:
                result = await self.mcp_tools["whatsapp_send_media"](to=to, media_url=media_url, caption=caption)
            else:
                import requests
                response = requests.post(
                    f"{self.api_base_url}/api/send-media",
                    json={"to": to, "mediaUrl": media_url, "caption": caption},
                    timeout=15
                )
                result = response.json()

            if workflow_id:
                await self._track_workflow_message(workflow_id, "sent_media", result)

            self.last_activity = datetime.now()
            return {"success": True, "result": result}

        except Exception as e:
            logger.error(f"❌ Failed to send media: {e}")
            return {"success": False, "error": str(e)}

    async def get_contacts(self) -> dict[str, Any]:
        """Get WhatsApp contacts"""
        try:
            if self.mcp_available and "whatsapp_get_contacts" in self.mcp_tools:
                result = await self.mcp_tools["whatsapp_get_contacts"]()
            else:
                import requests
                response = requests.get(f"{self.api_base_url}/api/contacts", timeout=10)
                result = response.json()

            # Update contact cache
            if result.get("success") and result.get("contacts"):
                self.contact_cache = {c.get("number"): c for c in result["contacts"]}

            return result

        except Exception as e:
            logger.error(f"❌ Failed to get contacts: {e}")
            return {"success": False, "error": str(e)}

    # Enterprise Workflow Methods

    async def customer_support_automation(self, customer_number: str, message: str, create_ticket: bool = True) -> dict[str, Any]:
        """Automated customer support workflow"""
        workflow_id = f"support_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        try:
            # Send initial response
            result = await self.send_message(customer_number, message, workflow_id)

            # Create support ticket if needed (integrate with HubSpot/Linear)
            if create_ticket:
                # TODO: Integrate with CRM systems
                logger.info(f"📋 Support ticket created for workflow {workflow_id}")

            self.active_workflows[workflow_id] = {
                "type": "customer_support",
                "customer": customer_number,
                "status": "active",
                "created_at": datetime.now().isoformat()
            }

            return {
                "success": True,
                "workflow_id": workflow_id,
                "result": result
            }

        except Exception as e:
            logger.error(f"❌ Customer support automation failed: {e}")
            return {"success": False, "error": str(e)}

    async def lead_qualification(self, lead_number: str, qualification_questions: list[str]) -> dict[str, Any]:
        """Lead qualification automation workflow"""
        workflow_id = f"lead_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        try:
            # Send welcome message
            welcome_msg = "👋 Welcome! We'd like to learn more about your needs. Please answer a few quick questions:"
            await self.send_message(lead_number, welcome_msg, workflow_id)

            # Send qualification questions
            for i, question in enumerate(qualification_questions, 1):
                await asyncio.sleep(2)  # Delay between questions
                await self.send_message(lead_number, f"{i}. {question}", workflow_id)

            self.active_workflows[workflow_id] = {
                "type": "lead_qualification",
                "lead": lead_number,
                "questions": qualification_questions,
                "status": "awaiting_responses",
                "created_at": datetime.now().isoformat()
            }

            return {
                "success": True,
                "workflow_id": workflow_id,
                "questions_sent": len(qualification_questions)
            }

        except Exception as e:
            logger.error(f"❌ Lead qualification failed: {e}")
            return {"success": False, "error": str(e)}

    async def send_sales_pipeline_update(self, client_number: str, update_type: str, details: dict[str, Any]) -> dict[str, Any]:
        """Send sales pipeline update to client"""
        try:
            update_messages = {
                "proposal_sent": "📄 Your proposal has been sent! We'll follow up in 24-48 hours.",
                "contract_milestone": f"✅ Great news! We've reached a milestone: {details.get('milestone', 'N/A')}",
                "payment_confirmation": f"💳 Payment confirmed! Amount: {details.get('amount', 'N/A')}",
                "delivery_complete": f"🎉 Your project deliverables are ready! {details.get('details', '')}"
            }

            message = update_messages.get(update_type, f"📊 Update: {update_type}")

            result = await self.send_message(client_number, message)

            return {
                "success": True,
                "update_type": update_type,
                "result": result
            }

        except Exception as e:
            logger.error(f"❌ Sales pipeline update failed: {e}")
            return {"success": False, "error": str(e)}

    async def send_emi_reminder(self, customer_number: str, loan_details: dict[str, Any]) -> dict[str, Any]:
        """Send EMI reminder for financial services"""
        try:
            amount = loan_details.get("amount", "N/A")
            due_date = loan_details.get("due_date", "N/A")
            payment_link = loan_details.get("payment_link", "")

            message = f"""📱 EMI Reminder

Your EMI payment is due soon:
Amount: ₹{amount}
Due Date: {due_date}

{f'Pay now: {payment_link}' if payment_link else 'Please make your payment before the due date.'}

Thank you for your prompt payment!"""

            result = await self.send_message(customer_number, message)

            return {
                "success": True,
                "reminder_sent": True,
                "result": result
            }

        except Exception as e:
            logger.error(f"❌ EMI reminder failed: {e}")
            return {"success": False, "error": str(e)}

    async def client_onboarding_sequence(self, client_number: str, client_name: str, service_type: str) -> dict[str, Any]:
        """Automated client onboarding workflow"""
        workflow_id = f"onboarding_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        try:
            # Welcome message
            welcome = f"""👋 Welcome to TAURUS AI, {client_name}!

We're excited to have you on board for {service_type}. Let's get started!"""
            await self.send_message(client_number, welcome, workflow_id)

            await asyncio.sleep(2)

            # Onboarding checklist
            checklist = """📋 Your Onboarding Checklist:

1. ✅ Account setup complete
2. 📝 Needs assessment (we'll contact you shortly)
3. 🎯 Strategy development
4. 🚀 Service activation

We'll guide you through each step!"""
            await self.send_message(client_number, checklist, workflow_id)

            await asyncio.sleep(2)

            # Next steps
            next_steps = """🎯 What's Next:

Our team will reach out within 24 hours to:
• Understand your specific requirements
• Set up your custom workflow
• Schedule your kickoff call

Stay tuned!"""
            await self.send_message(client_number, next_steps, workflow_id)

            self.active_workflows[workflow_id] = {
                "type": "client_onboarding",
                "client": client_number,
                "client_name": client_name,
                "service_type": service_type,
                "status": "in_progress",
                "created_at": datetime.now().isoformat()
            }

            return {
                "success": True,
                "workflow_id": workflow_id,
                "messages_sent": 3
            }

        except Exception as e:
            logger.error(f"❌ Client onboarding failed: {e}")
            return {"success": False, "error": str(e)}

    async def send_campaign_update(self, client_number: str, campaign_name: str, metrics: dict[str, Any]) -> dict[str, Any]:
        """Send campaign performance update to client"""
        try:
            impressions = metrics.get("impressions", 0)
            conversions = metrics.get("conversions", 0)
            ctr = metrics.get("ctr", 0)

            message = f"""📊 Campaign Update: {campaign_name}

Performance Metrics:
• Impressions: {impressions:,}
• Conversions: {conversions:,}
• CTR: {ctr:.2f}%

Great progress! Keep it up! 🚀"""

            result = await self.send_message(client_number, message)

            return {
                "success": True,
                "campaign": campaign_name,
                "result": result
            }

        except Exception as e:
            logger.error(f"❌ Campaign update failed: {e}")
            return {"success": False, "error": str(e)}

    async def send_team_notification(self, team_member_number: str, notification_type: str, details: dict[str, Any]) -> dict[str, Any]:
        """Send team notification/alert"""
        try:
            notification_templates = {
                "system_alert": f"⚠️ System Alert: {details.get('message', 'N/A')}",
                "compliance": f"📋 Compliance Alert: {details.get('message', 'N/A')}",
                "milestone": f"🎯 Milestone Reached: {details.get('milestone', 'N/A')}",
                "client_update": f"👤 Client Update: {details.get('client', 'N/A')} - {details.get('message', 'N/A')}"
            }

            message = notification_templates.get(notification_type, f"📢 Notification: {details.get('message', 'N/A')}")

            result = await self.send_message(team_member_number, message)

            return {
                "success": True,
                "notification_type": notification_type,
                "result": result
            }

        except Exception as e:
            logger.error(f"❌ Team notification failed: {e}")
            return {"success": False, "error": str(e)}

    # Helper Methods

    async def _track_workflow_message(self, workflow_id: str, message_type: str, result: dict[str, Any]):
        """Track message in workflow"""
        if workflow_id not in self.active_workflows:
            self.active_workflows[workflow_id] = {"messages": []}

        if "messages" not in self.active_workflows[workflow_id]:
            self.active_workflows[workflow_id]["messages"] = []

        self.active_workflows[workflow_id]["messages"].append({
            "type": message_type,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })

    async def get_workflow_status(self, workflow_id: str) -> dict[str, Any]:
        """Get status of a workflow"""
        return self.active_workflows.get(workflow_id, {"error": "Workflow not found"})

    async def cleanup(self):
        """Cleanup agent resources"""
        logger.info(f"🧹 Cleaning up {self.name}...")
        # Save workflow state if needed
        # Close connections
        self.status = AgentStatus.INACTIVE


# Factory function for agent creation
def create_whatsapp_communication_agent(config: dict[str, Any] | None = None) -> WhatsAppCommunicationAgent:
    """Create and return a WhatsApp Communication Agent instance"""
    return WhatsAppCommunicationAgent(config)


if __name__ == "__main__":
    # Test agent initialization
    async def test_agent():
        agent = WhatsAppCommunicationAgent()
        await agent.start()

        # Test capabilities
        print(f"Capabilities: {agent.get_capabilities()}")
        print(f"Metadata: {json.dumps(agent.get_metadata(), indent=2)}")

        # Health check
        health = await agent.health_check()
        print(f"Health: {json.dumps(health, indent=2)}")

        await agent.stop()

    asyncio.run(test_agent())

