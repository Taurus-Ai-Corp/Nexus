# WhatsApp Web.js MCP Server

## Overview

WhatsApp MCP Server provides Model Context Protocol integration for WhatsApp Web.js, enabling enterprise automation and client service delivery through WhatsApp messaging.

## Features

- **Send Text Messages**: Send WhatsApp text messages to any contact
- **Send Media Messages**: Send images, documents, audio, and video files
- **Contact Management**: Retrieve WhatsApp contacts list
- **Status Monitoring**: Check WhatsApp client connection status
- **QR Code Authentication**: Get QR code for WhatsApp Web authentication

## Prerequisites

1. **WhatsApp Web.js Service**: A running WhatsApp Web.js API service (default: `http://localhost:3000`)
2. **Python 3.8+**: Required for running the MCP server
3. **MCP SDK**: Install via `pip install mcp`

## Installation

```bash
# Install dependencies
pip install mcp requests

# Ensure WhatsApp Web.js service is running
# Default API endpoint: http://localhost:3000
```

## Configuration

The server is configured in `cursor-mcp-config.json`:

```json
{
  "whatsapp-web": {
    "command": "python3",
    "args": [
      "/path/to/whatsapp_web_mcp.py"
    ],
    "env": {
      "WHATSAPP_API_BASE_URL": "http://localhost:3000"
    }
  }
}
```

## Available Tools

### 1. whatsapp_send_message

Send a WhatsApp text message to a recipient.

**Parameters:**
- `to` (string, required): Recipient phone number with country code (e.g., `1234567890@c.us` or `+1234567890`)
- `message` (string, required): Message text to send

**Example:**
```json
{
  "to": "+1234567890",
  "message": "Hello from TAURUS AI!"
}
```

### 2. whatsapp_send_media

Send a WhatsApp media message (image, document, audio, video).

**Parameters:**
- `to` (string, required): Recipient phone number with country code
- `media_url` (string, required): URL of the media file to send
- `caption` (string, optional): Caption for the media

**Example:**
```json
{
  "to": "+1234567890",
  "media_url": "https://example.com/image.jpg",
  "caption": "Check out this image!"
}
```

### 3. whatsapp_get_contacts

Get list of WhatsApp contacts.

**Parameters:** None

**Returns:** List of contacts with name, number, and ID

### 4. whatsapp_get_status

Get WhatsApp client status and connection info.

**Parameters:** None

**Returns:** Connection status, authentication state, and timestamp

### 5. whatsapp_get_qr

Get QR code for WhatsApp authentication (if not authenticated).

**Parameters:** None

**Returns:** QR code data and authentication instructions

## Enterprise Use Cases

### Customer Support Automation
- Automated support ticket management
- Multi-language customer support (Arabic, Hindi, English, French)
- AI-powered intent analysis and routing

### Sales & Lead Management
- Lead qualification automation
- Sales pipeline updates
- Payment confirmations

### Financial Services
- Loan application workflows
- KYC document collection
- EMI reminders and payment collection

### Operations & Internal Communication
- Team notifications and alerts
- Automated reporting
- System health monitoring

## Service Delivery Use Cases

### Client Onboarding
- Automated welcome messages
- Needs assessment via WhatsApp chat
- Onboarding checklist delivery

### Campaign Management
- Real-time campaign updates
- Performance milestone notifications
- Weekly performance summaries

### B2B E-commerce
- Order confirmations
- Shipping updates
- Invoice delivery

## Integration with TAURUS Ecosystem

### BizFlow Platform
- Connected to 729 existing workflows
- Integrated with HubSpot CRM
- Business Intelligence analytics

### NeoVibe Platform
- Marketing automation workflows
- Client communication channels
- Lead nurturing sequences

## Error Handling

All tools return structured JSON responses with:
- `success` (boolean): Operation success status
- `error` (string, optional): Error message if failed
- Tool-specific data fields

## Troubleshooting

### WhatsApp Service Not Found
- Ensure WhatsApp Web.js service is running on configured port
- Check `WHATSAPP_API_BASE_URL` environment variable
- Verify service health at `/api/status` endpoint

### Authentication Issues
- Use `whatsapp_get_qr` to get QR code
- Scan QR code with WhatsApp mobile app
- Wait for "Client is ready!" confirmation

### Connection Problems
- Check network connectivity
- Verify API endpoint is accessible
- Review service logs for errors

## Development

### Running Locally

```bash
# Run the MCP server directly
python3 whatsapp_web_mcp.py

# Or via MCP client
# Server will use stdio transport automatically
```

### Testing

```bash
# Test WhatsApp service connection
curl http://localhost:3000/api/status

# Test MCP server
# Use Claude Code MCP client to test tools
```

## License

TAURUS AI CORP. - Internal Use Only

## Support

For issues or questions, contact the TAURUS AI development team.

