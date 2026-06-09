# Cursor IDE Configuration Audit
**Date:** November 19, 2025  
**Status:** ✅ Complete

## Current Configuration State

### Global Cursor Configuration (`~/.cursor/`)

#### 1. MCP Configuration (`~/.cursor/mcp.json`)
**Current State:**
```json
{
  "mcpServers": {
    "byterover-mcp": {
      "url": "https://mcp.byterover.dev/mcp?machineId=1f088c57-397d-62f0-b516-5a041c4d860f"
    }
  }
}
```

**Findings:**
- ✅ Only Byterover MCP is configured globally
- ✅ No ANTHROPIC_API_KEY references in MCP config
- ⚠️ Project-specific MCP configs exist but not synced to global config

#### 2. CLI Configuration (`~/.cursor/cli-config.json`)
**Current State:**
```json
{
  "version": 1,
  "editor": {
    "vimMode": false
  },
  "hasChangedDefaultModel": false,
  "permissions": {
    "allow": ["Shell(ls)"],
    "deny": []
  }
}
```

**Findings:**
- ✅ Default model settings unchanged
- ⚠️ No explicit subscription preference configured
- ⚠️ No API key vs subscription mode flag

#### 3. IDE State (`~/.cursor/ide_state.json`)
- Contains recently viewed files
- No authentication/subscription settings found

### Project-Specific MCP Configuration

**Location:** `agents/integrations/mcp-agents/cursor-mcp-config.json`

**Current MCP Servers Configured:**
1. `playwright` - No API keys required
2. `figma` - Uses `FIGMA_ACCESS_TOKEN` (external service)
3. `design-tokens` - Uses `DESIGN_TOKENS_PATH` (local path)
4. `tailwind` - No API keys required
5. `components` - No API keys required
6. `icons` - No API keys required
7. `gmail` - Uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (external service)
8. `google-sheets` - Uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (external service)
9. `slack` - Uses `SLACK_BOT_TOKEN` and `SLACK_USER_TOKEN` (external service)
10. `notion` - Uses `NOTION_API_KEY` (external service)
11. `github` - Uses `GITHUB_PERSONAL_ACCESS_TOKEN` (external service)
12. `perplexity` - Uses `PERPLEXITY_API_KEY` (external service)
13. `firecrawl` - Uses `FIRECRAWL_API_KEY` (external service)
14. `whatsapp-web` - Uses `WHATSAPP_API_BASE_URL` (local service)

**Findings:**
- ✅ **No ANTHROPIC_API_KEY in MCP configs** - Good! This means MCP servers don't require Claude API key
- ✅ All API keys are for external services (Perplexity, Firecrawl, GitHub, etc.)
- ⚠️ Environment file path: `/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/master.env`

### Environment Variables

**Location:** `master.env` (referenced in MCP config)

**Expected Contents:**
- External service API keys (Perplexity, Firecrawl, GitHub, etc.)
- No ANTHROPIC_API_KEY should be needed for MCP servers
- Cursor chat should use subscription authentication

## Issues Identified

1. **No Subscription Preference Configuration**
   - Cursor IDE doesn't have explicit setting to prefer subscription over API keys
   - Need to create configuration file to enforce subscription mode

2. **Environment Variable Isolation**
   - No separation between subscription mode and API mode
   - Need separate env files for clarity

3. **Missing Documentation**
   - No guide on how Cursor subscription works vs API keys
   - No troubleshooting guide for subscription issues

## Recommendations

1. ✅ Create `.cursor/settings.json` with subscription preference
2. ✅ Create `.cursor/subscription_config.json` for explicit subscription mode
3. ✅ Create separate env files: `.env.subscription` and `.env.api`
4. ✅ Document which services use subscription vs API keys
5. ✅ Create verification scripts to check subscription status

## Next Steps

1. Configure Cursor to prioritize subscription
2. Update MCP configs to document subscription vs API usage
3. Create environment variable isolation
4. Build verification and testing tools
5. Create comprehensive documentation

---

**Audit Completed By:** TAURUS AI Development Team  
**Next Review:** After implementation complete


