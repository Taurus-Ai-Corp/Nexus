# Environment Variables Guide

## Overview

This guide explains the environment variable system for Cursor subscription vs API modes and MCP server configuration.

## File Structure

```
agents/integrations/mcp-agents/
├── master.env                    # Main environment file (used by MCP config)
├── .env.subscription             # Subscription mode (ANTHROPIC_API_KEY commented)
└── .env.api                      # API mode (ANTHROPIC_API_KEY active)
```

## Subscription Mode (.env.subscription)

**Purpose:** Use Claude.ai subscription for Cursor chat, API keys only for MCP servers

**Key Characteristics:**
- `ANTHROPIC_API_KEY` is **commented out** or **not set**
- MCP server API keys are **active** (Perplexity, Firecrawl, GitHub, etc.)
- `CURSOR_USE_SUBSCRIPTION=true`
- `CURSOR_AUTH_MODE=subscription`

**Usage:**
```bash
# Switch to subscription mode
./scripts/switch_cursor_mode.sh subscription

# This copies .env.subscription to master.env
```

## API Mode (.env.api)

**Purpose:** Use API key for Cursor chat (for testing or when subscription unavailable)

**Key Characteristics:**
- `ANTHROPIC_API_KEY` is **active**
- MCP server API keys are **active**
- `CURSOR_USE_SUBSCRIPTION=false`
- `CURSOR_AUTH_MODE=api`

**Usage:**
```bash
# Switch to API mode
./scripts/switch_cursor_mode.sh api

# This copies .env.api to master.env
```

## Environment Variables by Service

### Cursor Chat (Subscription Mode)
- **No ANTHROPIC_API_KEY needed** - Uses Claude.ai subscription
- Authentication via Cursor IDE account settings

### MCP Servers (Always Use API Keys)

| Service | Variable | Purpose |
|---------|----------|---------|
| Perplexity | `PERPLEXITY_API_KEY` | AI-powered search |
| Firecrawl | `FIRECRAWL_API_KEY` | Web scraping |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | Repository operations |
| Gmail | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Email integration |
| Google Sheets | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Spreadsheet integration |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN` | Team communication |
| Notion | `NOTION_API_KEY` | Knowledge base |
| Figma | `FIGMA_ACCESS_TOKEN` | Design tool |

### Fine-Tuning Service

| Variable | Purpose | Required For |
|----------|---------|--------------|
| `ANTHROPIC_API_KEY` | Claude fine-tuning | Claude fine-tuning jobs |
| `OLLAMA_URL` | Local fine-tuning | Ollama fine-tuning (default: http://localhost:11434) |
| `OPENAI_API_KEY` | Evaluation/comparison | Optional, for model comparison |

## Switching Between Modes

### Manual Switch

```bash
# Copy subscription mode file
cp agents/integrations/mcp-agents/.env.subscription agents/integrations/mcp-agents/master.env

# Or copy API mode file
cp agents/integrations/mcp-agents/.env.api agents/integrations/mcp-agents/master.env

# Restart Cursor IDE
```

### Using Scripts

```bash
# Switch to subscription mode
./scripts/switch_cursor_mode.sh subscription

# Switch to API mode
./scripts/switch_cursor_mode.sh api

# Verify current mode
./scripts/verify_cursor_subscription.sh
```

## Verification

Check current mode:

```bash
# Check environment variables
env | grep ANTHROPIC_API_KEY

# If empty or commented → Subscription mode
# If set → API mode

# Verify with script
./scripts/verify_cursor_subscription.sh
```

## Best Practices

1. **Default to Subscription Mode** - Better rate limits, unlimited usage
2. **Keep API Keys for MCP Servers** - Required for external services
3. **Use API Mode Only for Testing** - Or when subscription unavailable
4. **Never Commit .env Files** - Keep secrets secure
5. **Document Changes** - Update this guide when adding new variables

## Security Notes

- ⚠️ Never commit `.env` files to version control
- ⚠️ Keep API keys secure and rotate regularly
- ⚠️ Use separate API keys for different environments
- ⚠️ Set file permissions: `chmod 600 .env*`

---

**Last Updated:** November 19, 2025


