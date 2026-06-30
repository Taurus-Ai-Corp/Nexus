#!/usr/bin/env python3
"""
📱 TAURUS AI CORP. - WhatsApp Web.js MCP Server
Model Context Protocol server for WhatsApp Web.js integration
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Any

import requests
from mcp.server import NotificationOptions, Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WhatsAppWebMCP:
    """WhatsApp Web.js API client for TAURUS AI CORP - Business logic only"""

    def __init__(self, api_base_url: str = "http://localhost:3000"):
        self.api_base_url = api_base_url
        self.is_connected = False
        self._check_connection()

    def _check_connection(self):
        """Check if WhatsApp Web.js service is running"""
        try:
            response = requests.get(f"{self.api_base_url}/api/status", timeout=5)
            if response.status_code == 200:
                self.is_connected = True
                logger.info("✅ WhatsApp Web.js service is running")
            else:
                logger.warning("⚠️ WhatsApp Web.js service not responding")
                self.is_connected = False
        except requests.exceptions.RequestException:
            logger.warning("⚠️ WhatsApp Web.js service not found - start it first")
            self.is_connected = False

    async def send_message(self, to: str, message: str) -> dict[str, Any]:
        """Send a WhatsApp text message"""
        try:
            response = requests.post(
                f"{self.api_base_url}/api/send-message",
                json={"to": to, "message": message},
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get("messageId"),
                    "status": "Message sent successfully",
                    "to": to
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "to": to
                }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}",
                "to": to
            }

    async def send_media(self, to: str, media_url: str, caption: str = "") -> dict[str, Any]:
        """Send a WhatsApp media message"""
        try:
            response = requests.post(
                f"{self.api_base_url}/api/send-media",
                json={"to": to, "mediaUrl": media_url, "caption": caption},
                timeout=15
            )

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get("messageId"),
                    "status": "Media sent successfully",
                    "to": to,
                    "media_url": media_url
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "to": to
                }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}",
                "to": to
            }

    async def get_contacts(self) -> dict[str, Any]:
        """Get list of WhatsApp contacts"""
        try:
            response = requests.get(f"{self.api_base_url}/api/contacts", timeout=10)

            if response.status_code == 200:
                result = response.json()
                contacts = result.get("contacts", [])
                return {
                    "success": True,
                    "contacts": contacts,
                    "count": len(contacts)
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "contacts": [],
                    "count": 0
                }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}",
                "contacts": [],
                "count": 0
            }

    async def get_status(self) -> dict[str, Any]:
        """Get WhatsApp client status"""
        try:
            response = requests.get(f"{self.api_base_url}/api/status", timeout=5)

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "status": result,
                    "ready": result.get("ready", False),
                    "authenticated": result.get("session") == "authenticated",
                    "timestamp": result.get("timestamp", datetime.now().isoformat())
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "ready": False,
                    "authenticated": False
                }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}",
                "ready": False,
                "authenticated": False
            }

    async def get_qr(self) -> dict[str, Any]:
        """Get QR code for WhatsApp authentication"""
        try:
            response = requests.get(f"{self.api_base_url}/api/qr", timeout=5)

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "qr_code": result.get("qr_code"),
                    "ready": result.get("ready", False),
                    "status": "QR code available for authentication"
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "qr_code": None
                }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}",
                "qr_code": None
            }


class WhatsAppMCPServer:
    """
    MCP Server wrapper for WhatsApp Web.js integration
    Exposes WhatsApp messaging capabilities as MCP tools
    """

    def __init__(self, api_base_url: str = "http://localhost:3000"):
        self.server = Server("whatsapp-web-mcp")
        self.whatsapp = WhatsAppWebMCP(api_base_url)
        self._setup_handlers()

    def _setup_handlers(self):
        """Setup MCP protocol handlers"""

        @self.server.list_tools()
        async def handle_list_tools() -> list[Tool]:
            """List available WhatsApp tools"""
            return [
                Tool(
                    name="whatsapp_send_message",
                    description="Send a WhatsApp text message to a recipient",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "to": {
                                "type": "string",
                                "description": "Recipient phone number with country code (e.g., 1234567890@c.us or +1234567890)"
                            },
                            "message": {
                                "type": "string",
                                "description": "Message text to send"
                            }
                        },
                        "required": ["to", "message"]
                    }
                ),
                Tool(
                    name="whatsapp_send_media",
                    description="Send a WhatsApp media message (image, document, audio, video)",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "to": {
                                "type": "string",
                                "description": "Recipient phone number with country code"
                            },
                            "media_url": {
                                "type": "string",
                                "description": "URL of the media file to send"
                            },
                            "caption": {
                                "type": "string",
                                "description": "Optional caption for the media"
                            }
                        },
                        "required": ["to", "media_url"]
                    }
                ),
                Tool(
                    name="whatsapp_get_contacts",
                    description="Get list of WhatsApp contacts",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                ),
                Tool(
                    name="whatsapp_get_status",
                    description="Get WhatsApp client status and connection info",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                ),
                Tool(
                    name="whatsapp_get_qr",
                    description="Get QR code for WhatsApp authentication (if not authenticated)",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
            """Handle tool execution requests"""

            try:
                if name == "whatsapp_send_message":
                    to = arguments.get("to")
                    message = arguments.get("message")

                    if not to or not message:
                        return [TextContent(
                            type="text",
                            text=json.dumps({
                                "success": False,
                                "error": "Missing required parameters: 'to' and 'message'"
                            }, indent=2)
                        )]

                    result = await self.whatsapp.send_message(to, message)
                    return [TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]

                elif name == "whatsapp_send_media":
                    to = arguments.get("to")
                    media_url = arguments.get("media_url")
                    caption = arguments.get("caption", "")

                    if not to or not media_url:
                        return [TextContent(
                            type="text",
                            text=json.dumps({
                                "success": False,
                                "error": "Missing required parameters: 'to' and 'media_url'"
                            }, indent=2)
                        )]

                    result = await self.whatsapp.send_media(to, media_url, caption)
                    return [TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]

                elif name == "whatsapp_get_contacts":
                    result = await self.whatsapp.get_contacts()

                    if result["success"]:
                        # Format contacts for better readability
                        contacts_list = []
                        for contact in result.get("contacts", [])[:50]:  # Limit to 50 for display
                            contacts_list.append({
                                "name": contact.get("name", "Unknown"),
                                "number": contact.get("number", "No number"),
                                "id": contact.get("id", "")
                            })

                        result["contacts_preview"] = contacts_list

                    return [TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]

                elif name == "whatsapp_get_status":
                    result = await self.whatsapp.get_status()
                    return [TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]

                elif name == "whatsapp_get_qr":
                    result = await self.whatsapp.get_qr()

                    if result["success"] and result.get("qr_code"):
                        # Add instructions to the result
                        result["instructions"] = [
                            "1. Open WhatsApp on your phone",
                            "2. Go to Settings > Linked Devices",
                            "3. Tap 'Link a Device'",
                            "4. Scan the QR code above",
                            "5. Wait for 'Client is ready!' message"
                        ]

                    return [TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]

                else:
                    return [TextContent(
                        type="text",
                        text=json.dumps({
                            "success": False,
                            "error": f"Unknown tool: {name}",
                            "available_tools": [
                                "whatsapp_send_message",
                                "whatsapp_send_media",
                                "whatsapp_get_contacts",
                                "whatsapp_get_status",
                                "whatsapp_get_qr"
                            ]
                        }, indent=2)
                    )]

            except Exception as e:
                logger.error(f"Error executing tool {name}: {str(e)}", exc_info=True)
                return [TextContent(
                    type="text",
                    text=json.dumps({
                        "success": False,
                        "error": str(e),
                        "tool": name,
                        "status": "failed"
                    }, indent=2)
                )]

    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="whatsapp-web-mcp",
                    server_version="1.0.0",
                    capabilities=self.server.get_capabilities(
                        notification_options=NotificationOptions(),
                        experimental_capabilities={}
                    )
                )
            )


async def main():
    """Main entry point for the WhatsApp MCP server"""
    import os

    # Allow API base URL to be configured via environment variable
    api_base_url = os.getenv("WHATSAPP_API_BASE_URL", "http://localhost:3000")

    server = WhatsAppMCPServer(api_base_url)
    await server.run()


if __name__ == "__main__":
    asyncio.run(main())
