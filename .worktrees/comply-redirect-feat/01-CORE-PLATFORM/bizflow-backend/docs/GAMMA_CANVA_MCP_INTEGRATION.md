# Gamma & Canva MCP Integration Guide

## Overview

This guide documents the integration of Gamma AI and Canva MCP servers into the TAURUS AI ecosystem, enabling seamless content creation, editing, publishing, and management workflows across all platform development projects.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [MCP Servers](#mcp-servers)
6. [Specialized Agents](#specialized-agents)
7. [Workflows](#workflows)
8. [Use Cases](#use-cases)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## Introduction

### What is This Integration?

The Gamma & Canva MCP integration provides unified access to:
- **Gamma AI**: Content generation for presentations, documents, webpages, and social posts
- **Canva**: Design creation and management for graphics, templates, and visual content

### Key Benefits

- **Unified Workflow**: Single interface for content and design creation
- **Cross-Platform Integration**: Seamless asset sharing between Gamma and Canva
- **Agent Automation**: Intelligent agents automatically deploy for content creation tasks
- **Brand Consistency**: Unified brand management across platforms
- **Time Savings**: 70% reduction in content creation time

## Architecture

### System Components

```
TAURUS AI Ecosystem
├── MCP Servers
│   ├── Gamma MCP Server (8 tools)
│   └── Canva MCP Server (8 tools)
├── Specialized Agents
│   ├── Gamma Content Agent
│   └── Canva Design Agent
├── Workflows
│   ├── Cross-Platform Workflows
│   └── Nexus Integration
└── Command Integration
    ├── DMA Command (Auto-detection)
    └── IQ Command (Platform recommendation)
```

### Integration Points

1. **MCP Registry**: `08-shared/Configuration/cursor/mcp_registry/mcp_servers_final.json`
2. **Environment Variables**: `agents/integrations/mcp-agents/master.env`
3. **Agent Registry**: `agents/specialized/`
4. **Workflow Library**: `agents/specialized/gamma-canva-workflows/`

## Installation

### Prerequisites

- Node.js >= 18.0.0
- Python 3.8+
- MCP SDK installed
- Gamma API key
- Canva API key (from subscription)

### Step 1: Install MCP Server Dependencies

```bash
cd agents/integrations/mcp-agents/gamma-mcp
npm install

cd ../canva-mcp
npm install
```

### Step 2: Configure Environment Variables

Add to `agents/integrations/mcp-agents/master.env`:

```bash
# Gamma AI
GAMMA_API_KEY=sk-gamma-your-api-key-here
GAMMA_API_BASE_URL=https://public-api.gamma.app/v0.2

# Canva
CANVA_API_KEY=your-canva-api-key-here
CANVA_API_BASE_URL=https://api.canva.com/rest/v1
```

### Step 3: Register MCP Servers

The servers are automatically registered in `mcp_servers_final.json`. Verify configuration:

```bash
grep -A 5 '"gamma"' 08-shared/Configuration/cursor/mcp_registry/mcp_servers_final.json
grep -A 5 '"canva"' 08-shared/Configuration/cursor/mcp_registry/mcp_servers_final.json
```

### Step 4: Restart MCP Client

Restart Claude Code or your MCP client to load the new servers.

## Configuration

### MCP Server Configuration

**Gamma MCP Server:**
- **Path**: `agents/integrations/mcp-agents/gamma-mcp/index.js`
- **Command**: `node`
- **Environment**: `GAMMA_API_KEY`

**Canva MCP Server:**
- **Path**: `agents/integrations/mcp-agents/canva-mcp/index.js`
- **Command**: `node`
- **Environment**: `CANVA_API_KEY`, `CANVA_API_BASE_URL`

### Agent Configuration

Agents are configured via environment variables and can be initialized programmatically:

```python
from agents.specialized.gamma_content.agent import GammaContentAgent
from agents.specialized.canva_design.agent import CanvaDesignAgent

gamma_agent = GammaContentAgent({
    "GAMMA_API_KEY": os.getenv("GAMMA_API_KEY")
})

canva_agent = CanvaDesignAgent({
    "CANVA_API_KEY": os.getenv("CANVA_API_KEY")
})
```

## MCP Servers

### Gamma MCP Server Tools

1. **gamma_generate_presentation** - Create presentations from prompts
2. **gamma_generate_document** - Generate documents
3. **gamma_generate_webpage** - Create webpages
4. **gamma_generate_social_post** - Generate social media content
5. **gamma_get_generation_status** - Check generation status
6. **gamma_list_generations** - List all generations
7. **gamma_update_generation** - Edit existing generations
8. **gamma_publish_generation** - Publish to Gamma platform

### Canva MCP Server Tools

1. **canva_create_design** - Create new designs (preset or custom)
2. **canva_add_asset** - Add assets to designs
3. **canva_list_designs** - List user's designs
4. **canva_get_design** - Retrieve design details
5. **canva_update_design** - Edit design elements
6. **canva_publish_design** - Publish design
7. **canva_list_templates** - Browse available templates
8. **canva_download_design** - Export design assets

## Specialized Agents

### Gamma Content Agent

**Location**: `agents/specialized/gamma-content/agent.py`

**Capabilities**:
- Presentation generation workflows
- Document creation automation
- Social media content generation
- Content editing and updates
- Publishing workflows

**Usage**:
```python
agent = GammaContentAgent()
await agent.initialize()

# Generate presentation
result = await agent.generate_presentation(
    prompt="Create a presentation about AI trends",
    title="AI Trends 2025",
    style="professional"
)

# Generate social post
post = await agent.generate_social_post(
    prompt="Create a LinkedIn post about automation",
    platform="linkedin",
    tone="professional"
)
```

### Canva Design Agent

**Location**: `agents/specialized/canva-design/agent.py`

**Capabilities**:
- Design creation workflows
- Template management
- Asset organization
- Brand consistency enforcement

**Usage**:
```python
agent = CanvaDesignAgent()
await agent.initialize()

# Create design
design = await agent.create_design(
    preset="Instagram Post",
    title="Social Media Graphic"
)

# Add asset
await agent.add_asset(
    design_id=design["id"],
    asset_type="image",
    url="https://example.com/image.png"
)
```

## Workflows

### Cross-Platform Workflows

**Location**: `agents/specialized/gamma-canva-workflows/cross_platform_workflows.py`

**Available Workflows**:

1. **Gamma → Canva**: Extract assets from Gamma presentation, enhance in Canva
2. **Canva → Gamma**: Create designs from templates, export to Gamma format
3. **Unified Brand Management**: Apply brand guidelines across both platforms

**Example**:
```python
from agents.specialized.gamma_canva_workflows.cross_platform_workflows import CrossPlatformWorkflows

workflows = CrossPlatformWorkflows(gamma_agent, canva_agent)

# Gamma to Canva workflow
result = await workflows.gamma_to_canva_workflow(
    gamma_prompt="Create a presentation about our product",
    design_preset="Instagram Post",
    enhance_assets=True
)
```

### Nexus Integration

**Location**: `agents/specialized/gamma-canva-workflows/nexus_integration.py`

**Capabilities**:
- Client campaign creation
- Presentation template generation
- Social media package creation
- Auto-publish to client channels

**Example**:
```python
from agents.specialized.gamma_canva_workflows.nexus_integration import NexusIntegration

integration = NexusIntegration(gamma_agent, canva_agent)

# Create client campaign
campaign = await integration.create_client_campaign(
    client_id="client-123",
    campaign_brief={
        "name": "Q1 Product Launch",
        "objectives": "Increase brand awareness",
        "platforms": ["Instagram Post", "LinkedIn Post"]
    }
)
```

## Use Cases

### Use Case 1: Presentation Generation

**Scenario**: Generate a business presentation with matching social graphics

**Workflow**:
1. Use Gamma to generate presentation
2. Extract key visuals from presentation
3. Create matching Canva graphics for social media
4. Generate social posts using Gamma
5. Publish across platforms

### Use Case 2: Social Media Campaign

**Scenario**: Create complete social media campaign

**Workflow**:
1. Generate campaign presentation (Gamma)
2. Create platform-specific graphics (Canva)
3. Generate social posts (Gamma)
4. Apply brand guidelines (Canva)
5. Schedule and publish

### Use Case 3: Brand Asset Library

**Scenario**: Create unified brand asset library

**Workflow**:
1. Define brand guidelines
2. Create brand assets in Canva
3. Generate brand-compliant content in Gamma
4. Synchronize across platforms
5. Maintain consistency

## API Reference

### Gamma API

**Base URL**: `https://public-api.gamma.app/v0.2`

**Authentication**: Bearer token via `GAMMA_API_KEY`

**Endpoints**:
- `POST /generations` - Create generation
- `GET /generations/{id}` - Get generation status
- `GET /generations` - List generations
- `PATCH /generations/{id}` - Update generation
- `POST /generations/{id}/publish` - Publish generation

### Canva API

**Base URL**: `https://api.canva.com/rest/v1`

**Authentication**: Bearer token via `CANVA_API_KEY`

**Endpoints**:
- `POST /designs` - Create design
- `GET /designs` - List designs
- `GET /designs/{id}` - Get design
- `PATCH /designs/{id}` - Update design
- `POST /designs/{id}/publish` - Publish design
- `POST /designs/{id}/download` - Download design
- `GET /templates` - List templates

## Troubleshooting

### Issue: MCP Server Not Starting

**Symptoms**: Server fails to start or tools unavailable

**Solutions**:
1. Check environment variables are set correctly
2. Verify Node.js version >= 18.0.0
3. Check API keys are valid
4. Review server logs for errors

### Issue: API Authentication Failed

**Symptoms**: 401 Unauthorized errors

**Solutions**:
1. Verify API keys in `master.env`
2. Check API key format (Gamma: `sk-gamma-...`, Canva: `...`)
3. Ensure API keys are not expired
4. Check API key permissions

### Issue: Agent Initialization Failed

**Symptoms**: Agents fail to initialize

**Solutions**:
1. Check agent dependencies installed
2. Verify MCP servers are running
3. Check agent configuration
4. Review agent logs

### Issue: Workflow Execution Failed

**Symptoms**: Workflows fail or timeout

**Solutions**:
1. Check API rate limits
2. Verify network connectivity
3. Review workflow parameters
4. Check error logs for details

## Best Practices

### 1. API Key Management

- Store API keys in `master.env` (never commit to git)
- Rotate keys quarterly
- Use environment-specific keys for production
- Monitor API usage and rate limits

### 2. Error Handling

- Always wrap API calls in try-catch blocks
- Implement retry logic with exponential backoff
- Log errors for debugging
- Provide fallback workflows

### 3. Performance Optimization

- Cache frequently used designs/content
- Batch operations when possible
- Use async/await for concurrent operations
- Monitor API response times

### 4. Brand Consistency

- Define brand guidelines upfront
- Use unified brand management workflows
- Validate content against brand guidelines
- Maintain brand asset library

### 5. Testing

- Test MCP servers independently
- Test agents in isolation
- Test workflows end-to-end
- Use test API keys for development

## Support

For issues or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check agent logs
4. Contact TAURUS AI support

## Version History

- **v1.0.0** (2025-01-15): Initial integration
  - Gamma MCP server (8 tools)
  - Canva MCP server (8 tools)
  - Specialized agents
  - Cross-platform workflows
  - Nexus integration
  - DMA/IQ command integration

