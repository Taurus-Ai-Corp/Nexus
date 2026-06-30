#!/usr/bin/env python3
"""
MCP Business Integrator for TAURUS AI CORP
Integrates OpenAI MCP connectors and servers for business automation
"""

import logging
import os
from datetime import datetime
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv('master.env')

class MCPBusinessIntegrator:
    """Main class for integrating MCP connectors with business workflows"""

    def __init__(self):
        """Initialize the MCP Business Integrator"""
        try:
            # Initialize OpenAI client with explicit configuration
            self.client = OpenAI(
                api_key=os.getenv('OPENAI_API_KEY'),
                timeout=30.0
            )
        except Exception as e:
            print(f"Warning: OpenAI client initialization failed: {e}")
            print("MCP functionality will be limited without OpenAI client")
            self.client = None
        self.logger = self._setup_logging()

        # Available connectors configuration
        self.connectors = {
            "gmail": {
                "connector_id": "connector_gmail",
                "authorization": os.getenv("GOOGLE_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Gmail email management and automation"
            },
            "calendar": {
                "connector_id": "connector_googlecalendar",
                "authorization": os.getenv("GOOGLE_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Google Calendar scheduling and management"
            },
            "drive": {
                "connector_id": "connector_googledrive",
                "authorization": os.getenv("GOOGLE_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Google Drive document collaboration"
            },
            "dropbox": {
                "connector_id": "connector_dropbox",
                "authorization": os.getenv("DROPBOX_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Dropbox file management and sharing"
            },
            "teams": {
                "connector_id": "connector_microsoftteams",
                "authorization": os.getenv("MICROSOFT_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Microsoft Teams communication and collaboration"
            },
            "outlook_calendar": {
                "connector_id": "connector_outlookcalendar",
                "authorization": os.getenv("MICROSOFT_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Outlook Calendar enterprise scheduling"
            },
            "outlook_email": {
                "connector_id": "connector_outlookemail",
                "authorization": os.getenv("MICROSOFT_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "Outlook Email enterprise communication"
            },
            "sharepoint": {
                "connector_id": "connector_sharepoint",
                "authorization": os.getenv("MICROSOFT_OAUTH_TOKEN"),
                "require_approval": "never",
                "description": "SharePoint enterprise document management"
            }
        }

        # Business workflow templates
        self.workflow_templates = {
            "email_management": {
                "connectors": ["gmail", "calendar"],
                "description": "Automated email management and scheduling"
            },
            "document_collaboration": {
                "connectors": ["drive", "calendar", "gmail"],
                "description": "Document creation, sharing, and collaboration"
            },
            "team_communication": {
                "connectors": ["teams", "calendar", "outlook_email"],
                "description": "Team communication and meeting management"
            },
            "enterprise_workflow": {
                "connectors": ["sharepoint", "outlook_calendar", "outlook_email"],
                "description": "Enterprise document and communication management"
            },
            "file_management": {
                "connectors": ["dropbox", "drive", "gmail"],
                "description": "Cross-platform file management and sharing"
            }
        }

    def _setup_logging(self) -> logging.Logger:
        """Set up logging for the MCP integrator"""
        logger = logging.getLogger('MCPBusinessIntegrator')
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    def create_mcp_tools(self, selected_connectors: list[str]) -> list[dict[str, Any]]:
        """Create MCP tools configuration for selected connectors"""
        tools = []

        for connector in selected_connectors:
            if connector in self.connectors:
                tool = {
                    "type": "mcp",
                    "server_label": connector,
                    **self.connectors[connector]
                }
                tools.append(tool)
                self.logger.info(f"Added MCP tool: {connector}")
            else:
                self.logger.warning(f"Connector not found: {connector}")

        return tools

    def process_business_request(
        self,
        request: str,
        connectors: list[str],
        model: str = "gpt-5"
    ) -> dict[str, Any]:
        """Process business request using MCP connectors"""
        try:
            if self.client is None:
                return {
                    "success": False,
                    "error": "OpenAI client not initialized. Please check your API key configuration.",
                    "timestamp": datetime.now().isoformat()
                }

            tools = self.create_mcp_tools(connectors)

            self.logger.info(f"Processing request with {len(tools)} MCP tools")
            self.logger.info(f"Request: {request[:100]}...")

            response = self.client.responses.create(
                model=model,
                tools=tools,
                input=request
            )

            self.logger.info("Request processed successfully")
            return {
                "success": True,
                "response": response,
                "tools_used": len(tools),
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            self.logger.error(f"Error processing request: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def execute_workflow(
        self,
        workflow_name: str,
        custom_request: str | None = None
    ) -> dict[str, Any]:
        """Execute a predefined business workflow"""
        if workflow_name not in self.workflow_templates:
            return {
                "success": False,
                "error": f"Workflow not found: {workflow_name}",
                "available_workflows": list(self.workflow_templates.keys())
            }

        workflow = self.workflow_templates[workflow_name]
        connectors = workflow["connectors"]

        # Use custom request or default workflow request
        if custom_request:
            request = custom_request
        else:
            request = self._get_default_workflow_request(workflow_name)

        return self.process_business_request(request, connectors)

    def _get_default_workflow_request(self, workflow_name: str) -> str:
        """Get default request for workflow"""
        default_requests = {
            "email_management": """
            Check my Gmail for urgent emails from clients, 
            categorize them by priority, and schedule 
            follow-up tasks in my calendar.
            """,
            "document_collaboration": """
            Create a project proposal document in Google Drive,
            share it with the team, and schedule a review meeting
            for next week.
            """,
            "team_communication": """
            Send a team update via Microsoft Teams about the 
            current project status and schedule a team meeting
            for next week.
            """,
            "enterprise_workflow": """
            Create a quarterly report in SharePoint, 
            schedule a review meeting in Outlook Calendar,
            and send the report to stakeholders via Outlook Email.
            """,
            "file_management": """
            Organize files in Dropbox and Google Drive,
            create a summary of recent changes,
            and email the summary to the team.
            """
        }

        return default_requests.get(workflow_name, "Process the business request")

    def get_available_connectors(self) -> dict[str, dict[str, Any]]:
        """Get list of available connectors"""
        return self.connectors

    def get_available_workflows(self) -> dict[str, dict[str, Any]]:
        """Get list of available workflows"""
        return self.workflow_templates

    def test_connector(self, connector_name: str) -> dict[str, Any]:
        """Test a specific connector"""
        if connector_name not in self.connectors:
            return {
                "success": False,
                "error": f"Connector not found: {connector_name}"
            }

        # Simple test request
        test_request = f"Test connection to {connector_name}"

        try:
            result = self.process_business_request(
                test_request,
                [connector_name]
            )
            return result
        except Exception as e:
            return {
                "success": False,
                "error": f"Test failed: {str(e)}"
            }

    def generate_business_report(self, workflow_results: list[dict[str, Any]]) -> str:
        """Generate a business report from workflow results"""
        report = f"""
# MCP Business Integration Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
Total Workflows Executed: {len(workflow_results)}
Successful: {sum(1 for r in workflow_results if r.get('success', False))}
Failed: {sum(1 for r in workflow_results if not r.get('success', False))}

## Detailed Results
"""

        for i, result in enumerate(workflow_results, 1):
            status = "✅ SUCCESS" if result.get('success', False) else "❌ FAILED"
            report += f"""
### Workflow {i}
Status: {status}
Timestamp: {result.get('timestamp', 'N/A')}
Tools Used: {result.get('tools_used', 'N/A')}
"""

            if result.get('error'):
                report += f"Error: {result['error']}\n"

        return report


def main():
    """Main function for testing the MCP Business Integrator"""
    print("🚀 MCP Business Integrator for TAURUS AI CORP")
    print("=" * 50)

    # Initialize integrator
    integrator = MCPBusinessIntegrator()

    # Display available connectors
    print("\n📋 Available Connectors:")
    connectors = integrator.get_available_connectors()
    for name, config in connectors.items():
        print(f"  • {name}: {config['description']}")

    # Display available workflows
    print("\n🔄 Available Workflows:")
    workflows = integrator.get_available_workflows()
    for name, config in workflows.items():
        print(f"  • {name}: {config['description']}")

    # Test a simple workflow
    print("\n🧪 Testing Email Management Workflow...")
    result = integrator.execute_workflow("email_management")

    if result['success']:
        print("✅ Workflow executed successfully!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Workflow failed: {result.get('error', 'Unknown error')}")

    print("\n🎉 MCP Business Integrator ready for use!")


if __name__ == "__main__":
    main()
