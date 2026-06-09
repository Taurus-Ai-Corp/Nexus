# WhatsApp Communication Agent

## Overview

The WhatsApp Communication Agent provides enterprise-level WhatsApp automation capabilities for TAURUS AI CORP's BizFlow and Nexus platforms. It enables automated customer support, lead management, sales pipeline updates, financial services automation, and client service delivery through WhatsApp messaging.

## Features

### Core Capabilities
- **Message Sending**: Send text and media messages via WhatsApp
- **Contact Management**: Retrieve and manage WhatsApp contacts
- **Status Monitoring**: Check WhatsApp service health and authentication status
- **QR Code Authentication**: Get QR codes for WhatsApp Web authentication

### Enterprise Workflows
- **Customer Support Automation**: Automated support ticket management and responses
- **Lead Qualification**: Automated lead qualification workflows with question sequences
- **Sales Pipeline Updates**: Real-time updates on proposals, contracts, payments, and deliveries
- **Financial Services**: EMI reminders, payment confirmations, loan application workflows
- **Client Onboarding**: Automated onboarding sequences for new clients
- **Campaign Management**: Real-time campaign performance updates
- **Team Notifications**: System alerts, compliance notifications, milestone updates

## Architecture

### Agent Structure
```
WhatsAppCommunicationAgent
├── BaseAgent (inheritance)
├── MCP Integration (WhatsApp MCP Server)
├── Workflow Management
└── Contact Cache
```

### Integration Points
- **WhatsApp MCP Server**: Primary interface for WhatsApp operations
- **CRM Systems**: HubSpot, Linear (for ticket creation)
- **Financial Systems**: QuickBooks, Razorpay (for payment workflows)
- **Campaign Systems**: Marketing automation platforms
- **Business Intelligence**: Analytics and reporting systems

## Usage

### Basic Initialization

```python
from agents.specialized.whatsapp_communication.agent import WhatsAppCommunicationAgent

# Create agent
agent = WhatsAppCommunicationAgent(config={
    "WHATSAPP_API_BASE_URL": "http://localhost:3000"
})

# Start agent
await agent.start()

# Check capabilities
capabilities = agent.get_capabilities()
print(capabilities)
```

### Send Message

```python
# Send a simple text message
result = await agent.send_message(
    to="+1234567890",
    message="Hello from TAURUS AI!"
)

# Send media message
result = await agent.send_media(
    to="+1234567890",
    media_url="https://example.com/image.jpg",
    caption="Check this out!"
)
```

### Customer Support Automation

```python
# Automated customer support workflow
result = await agent.customer_support_automation(
    customer_number="+1234567890",
    message="Thank you for contacting us. We'll respond shortly!",
    create_ticket=True  # Creates ticket in CRM
)
```

### Lead Qualification

```python
# Lead qualification workflow
questions = [
    "What is your company size?",
    "What is your primary use case?",
    "What is your budget range?"
]

result = await agent.lead_qualification(
    lead_number="+1234567890",
    qualification_questions=questions
)
```

### Sales Pipeline Updates

```python
# Send proposal status update
result = await agent.send_sales_pipeline_update(
    client_number="+1234567890",
    update_type="proposal_sent",
    details={"proposal_id": "PROP-12345"}
)

# Send payment confirmation
result = await agent.send_sales_pipeline_update(
    client_number="+1234567890",
    update_type="payment_confirmation",
    details={"amount": "$5,000", "invoice": "INV-12345"}
)
```

### Financial Services - EMI Reminders

```python
# Send EMI reminder
result = await agent.send_emi_reminder(
    customer_number="+1234567890",
    loan_details={
        "amount": "5,000",
        "due_date": "2025-01-15",
        "payment_link": "https://pay.example.com/emi-123"
    }
)
```

### Client Onboarding

```python
# Automated client onboarding sequence
result = await agent.client_onboarding_sequence(
    client_number="+1234567890",
    client_name="Acme Corp",
    service_type="Marketing Automation"
)
```

### Campaign Updates

```python
# Send campaign performance update
result = await agent.send_campaign_update(
    client_number="+1234567890",
    campaign_name="Q1 Marketing Campaign",
    metrics={
        "impressions": 100000,
        "conversions": 500,
        "ctr": 0.5
    }
)
```

### Team Notifications

```python
# Send system alert
result = await agent.send_team_notification(
    team_member_number="+1234567890",
    notification_type="system_alert",
    details={"message": "Server downtime detected"}
)

# Send milestone notification
result = await agent.send_team_notification(
    team_member_number="+1234567890",
    notification_type="milestone",
    details={"milestone": "1000 customers reached"}
)
```

## Workflow Management

### Track Workflow Status

```python
# Get workflow status
workflow_status = await agent.get_workflow_status(workflow_id)
print(workflow_status)
```

### Workflow Types

1. **customer_support**: Customer support automation workflows
2. **lead_qualification**: Lead qualification sequences
3. **client_onboarding**: Client onboarding processes
4. **campaign_management**: Campaign performance tracking

## Configuration

### Environment Variables

```bash
# WhatsApp API Base URL
WHATSAPP_API_BASE_URL=http://localhost:3000

# Optional: CRM Integration
HUBSPOT_API_KEY=your_hubspot_key
LINEAR_API_KEY=your_linear_key
```

### Agent Configuration

```python
config = {
    "WHATSAPP_API_BASE_URL": "http://localhost:3000",
    "CRM_INTEGRATION": {
        "hubspot": {"api_key": "..."},
        "linear": {"api_key": "..."}
    },
    "CACHE_ENABLED": True,
    "WORKFLOW_TIMEOUT": 3600  # seconds
}

agent = WhatsAppCommunicationAgent(config=config)
```

## Integration with BizFlow Platform

### Master Orchestrator Integration

```python
from agents.orchestration.master_orchestrator import BizFlowMasterOrchestrator

orchestrator = BizFlowMasterOrchestrator()

# Register WhatsApp agent
orchestrator.register_agent("whatsapp_communication", WhatsAppCommunicationAgent())

# Use in workflows
result = await orchestrator.execute_workflow(
    workflow_type="customer_support",
    agent="whatsapp_communication",
    params={"customer_number": "+1234567890", "message": "..."}
)
```

### Workflow Engine Integration

The agent integrates with BizFlow's workflow engine to enable:
- Automated workflow triggers
- Multi-step message sequences
- Conditional routing based on responses
- Integration with other agents (CRM, Analytics, etc.)

## Error Handling

All methods return structured responses:

```python
{
    "success": True/False,
    "result": {...},  # Operation result
    "error": "...",   # Error message if failed
    "timestamp": "..." # ISO timestamp
}
```

## Health Monitoring

### Health Check

```python
health = await agent.health_check()
print(health)
```

### Metrics

The agent tracks:
- Message send success rate
- Workflow completion rates
- Contact cache hit rate
- WhatsApp service availability
- Response times

## Best Practices

1. **Rate Limiting**: Respect WhatsApp rate limits to avoid bans
2. **Error Handling**: Always check `success` field in responses
3. **Workflow Tracking**: Use workflow IDs to track multi-step processes
4. **Contact Caching**: Use contact cache for faster lookups
5. **Monitoring**: Monitor health metrics regularly

## Troubleshooting

### WhatsApp Service Not Available
- Check if WhatsApp Web.js service is running
- Verify `WHATSAPP_API_BASE_URL` configuration
- Check service health at `/api/status`

### Authentication Issues
- Use `whatsapp_get_qr` tool to get QR code
- Scan QR code with WhatsApp mobile app
- Wait for authentication confirmation

### Message Delivery Failures
- Verify recipient phone number format
- Check WhatsApp service status
- Review error messages in response

## License

TAURUS AI CORP. - Internal Use Only

## Support

For issues or questions, contact the TAURUS AI development team.

