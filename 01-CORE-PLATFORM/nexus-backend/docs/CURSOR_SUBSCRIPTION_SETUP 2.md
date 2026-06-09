# Cursor IDE Subscription Configuration Guide

## Overview

This guide explains how to configure Cursor IDE to prioritize your Claude.ai subscription over API keys for chat functionality, while keeping API keys available for MCP servers that require external service authentication.

## Why This Matters

- **Subscription Benefits:** Unlimited usage, better rate limits, no per-token costs
- **API Key Costs:** Pay-per-use, can get expensive with heavy usage
- **Best Practice:** Use subscription for chat, API keys only for MCP servers

## Current Configuration

### Authentication Flow

```
Cursor Chat → Claude.ai Subscription (via claude.ai account)
MCP Servers → External Service API Keys (Perplexity, Firecrawl, etc.)
```

### What Uses What

| Service | Authentication Method | Reason |
|---------|---------------------|--------|
| Cursor Chat | Subscription (claude.ai) | Unlimited usage, better rate limits |
| Perplexity MCP | API Key | External service requires API key |
| Firecrawl MCP | API Key | External service requires API key |
| GitHub MCP | API Key | External service requires API key |
| Other MCPs | API Keys | External services require authentication |

## Setup Instructions

### Step 1: Verify Subscription Status

1. Open Cursor IDE
2. Go to Settings (Cmd/Ctrl + ,)
3. Navigate to "Account" or "Subscription"
4. Verify you're signed in with your claude.ai account
5. Confirm subscription is active

### Step 2: Install Configuration Files

**Option A: Global Configuration (Recommended)**

```bash
# Copy settings to global Cursor config
cp .cursor/settings.json ~/.cursor/settings.json
cp .cursor/subscription_config.json ~/.cursor/subscription_config.json
```

**Option B: Workspace-Specific Configuration**

```bash
# Configuration files are already in .cursor/ directory
# Cursor will automatically use them for this workspace
```

### Step 3: Verify MCP Configuration

Ensure your MCP config (`~/.cursor/mcp.json` or project `cursor-mcp-config.json`) does NOT include `ANTHROPIC_API_KEY`:

```json
{
  "mcpServers": {
    "perplexity": {
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
        // ✅ Good - No ANTHROPIC_API_KEY here
      }
    }
  }
}
```

### Step 4: Environment Variable Isolation

Create separate environment files:

```bash
# For subscription mode (default)
.env.subscription

# For API mode (if needed for testing)
.env.api
```

See `docs/ENVIRONMENT_VARIABLES.md` for details.

### Step 5: Restart Cursor IDE

1. Completely quit Cursor IDE (Cmd+Q on Mac, Alt+F4 on Windows)
2. Reopen Cursor IDE
3. Configuration will be loaded automatically

## Verification

### Check Subscription Status

Run the verification script:

```bash
./scripts/verify_cursor_subscription.sh
```

Expected output:
```
✅ Cursor subscription is active
✅ MCP servers configured correctly
✅ No ANTHROPIC_API_KEY in MCP configs
```

### Manual Verification

1. Open Cursor Chat (Cmd/Ctrl + L)
2. Check the model selector - should show "Claude 3.5 Sonnet" or your preferred model
3. Send a test message
4. Check usage dashboard - should show subscription usage, not API key usage

## Troubleshooting

### Issue: Cursor Still Using API Key

**Symptoms:**
- Usage shows API key charges
- Rate limits are lower than expected

**Solutions:**
1. Verify you're signed in: Settings → Account → Check subscription status
2. Remove `ANTHROPIC_API_KEY` from environment variables:
   ```bash
   # Check for API key in environment
   env | grep ANTHROPIC_API_KEY
   
   # Remove if found (don't remove from .env files used by MCP servers)
   unset ANTHROPIC_API_KEY
   ```
3. Restart Cursor IDE completely
4. Check Cursor settings: Ensure "Use Subscription" is enabled

### Issue: MCP Servers Not Working

**Symptoms:**
- MCP tools unavailable
- Errors about missing API keys

**Solutions:**
1. Verify MCP config has correct API keys for external services
2. Check environment file is loaded:
   ```bash
   # Verify env file exists
   ls -la master.env
   
   # Check API keys are set (for MCP servers only)
   grep PERPLEXITY_API_KEY master.env
   grep FIRECRAWL_API_KEY master.env
   ```
3. Restart Cursor IDE after changing MCP config

### Issue: Configuration Not Loading

**Symptoms:**
- Settings not applied
- Default behavior unchanged

**Solutions:**
1. Check file locations:
   - Global: `~/.cursor/settings.json`
   - Workspace: `.cursor/settings.json` (in project root)
2. Verify JSON syntax is valid:
   ```bash
   python -m json.tool .cursor/settings.json
   ```
3. Check Cursor logs:
   - Mac: `~/Library/Logs/Cursor/`
   - Windows: `%APPDATA%\Cursor\logs\`

## Configuration Files Reference

### `.cursor/settings.json`

Main Cursor IDE settings with subscription preference.

**Key Settings:**
- `cursor.ai.preferences.authentication.preferSubscription: true`
- `cursor.ai.preferences.authentication.useApiKeyFallback: false`

### `.cursor/subscription_config.json`

Explicit subscription configuration and MCP server documentation.

**Key Settings:**
- `subscription.enabled: true`
- `subscription.priority: "subscription"`
- `apiKeys.usage: "mcp_servers_only"`

### `cursor-mcp-config.json`

MCP server configuration (should NOT include ANTHROPIC_API_KEY).

## Best Practices

1. **Always use subscription for chat** - Better rate limits, unlimited usage
2. **Keep API keys for MCP servers** - Required for external services
3. **Separate environment files** - Clear separation between subscription and API modes
4. **Regular verification** - Run verification script periodically
5. **Document changes** - Update this guide when configuration changes

## Switching Between Modes

### Use Subscription Mode (Default)

```bash
# Already configured - just ensure signed in to claude.ai
# No action needed
```

### Use API Key Mode (For Testing)

```bash
# Switch to API mode
./scripts/switch_cursor_mode.sh api

# Restart Cursor IDE
# Now Cursor will use API key instead of subscription
```

### Switch Back to Subscription

```bash
# Switch back to subscription mode
./scripts/switch_cursor_mode.sh subscription

# Restart Cursor IDE
```

## Additional Resources

- [Cursor IDE Documentation](https://docs.cursor.com/)
- [Claude.ai Subscription](https://claude.ai/pricing)
- [MCP Server Configuration Guide](./MCP_CONFIGURATION.md)
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)

---

**Last Updated:** November 19, 2025  
**Maintained By:** TAURUS AI Development Team


