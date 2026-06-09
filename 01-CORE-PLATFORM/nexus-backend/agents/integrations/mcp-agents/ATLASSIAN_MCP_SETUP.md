# Atlassian MCP Server Setup Guide

## Overview
This guide covers the setup and configuration of the Atlassian MCP Server for Cursor IDE integration.

## Configuration Added

### Primary Configuration (Current Cursor)
The Atlassian MCP server has been added to your main Cursor configuration at `/Users/user/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "atlassian-mcp-server": {
      "url": "https://mcp.atlassian.com/v1/sse"
    }
  }
}
```

### Alternative Configuration (Older Cursor Versions)
If you're using an older version of Cursor that doesn't support the URL format, use this configuration instead:

```json
{
  "mcpServers": {
    "mcp-atlassian-api": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.atlassian.com/v1/sse"
      ]
    }
  }
}
```

## Setup Steps

### 1. Restart Cursor
After adding the configuration, restart Cursor IDE to load the new MCP server.

### 2. Verify Connection
1. Open Cursor
2. Check the MCP status in the bottom status bar
3. Look for "atlassian-mcp-server" in the list of connected servers

### 3. Test Integration
Once connected, you should be able to use Atlassian tools in your conversations, such as:
- Creating Jira issues
- Managing Confluence pages
- Accessing project information
- Managing team workflows

## Environment Variables
The Atlassian MCP server may require authentication. Ensure you have the following environment variables set in your master.env file:

```bash
# Atlassian Configuration
ATLASSIAN_API_TOKEN=your_api_token_here
ATLASSIAN_DOMAIN=your-domain.atlassian.net
ATLASSIAN_EMAIL=your-email@domain.com
```

## Troubleshooting

### If the URL format doesn't work:
1. Replace the URL configuration with the command-based configuration
2. Ensure you have `mcp-remote` installed: `npm install -g mcp-remote`
3. Restart Cursor

### If authentication fails:
1. Verify your Atlassian API token is correct
2. Check that your domain is properly formatted
3. Ensure your account has the necessary permissions

### If the server doesn't connect:
1. Check your internet connection
2. Verify the URL is accessible: `https://mcp.atlassian.com/v1/sse`
3. Check Cursor's MCP logs for error messages

## Features Available
Once properly configured, the Atlassian MCP server provides access to:
- Jira issue management
- Confluence page operations
- Project and team management
- Workflow automation
- Reporting and analytics

## Support
For issues with the Atlassian MCP server, refer to:
- Atlassian MCP documentation
- Cursor MCP troubleshooting guide
- Your project's MCP integration logs

---
*Configuration updated: 2025-01-15*
*Total MCP servers: 16*








