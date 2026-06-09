# MCP Server Optimization Guide

## Problem Identified
- **27 MCP servers** were configured, creating **81+ tools**
- Cursor IDE has a tool limit (~80 tools) for performance
- This caused servers to show as "enabled" but tools were not accessible

## Solution Applied
Reduced from **27 servers** to **8 essential servers**:

### Active Servers (8):
1. **github-official** - Official GitHub MCP server
2. **firecrawl-official** - Official Firecrawl MCP server  
3. **apify-official** - Official Apify MCP server
4. **clickup** - Project management
5. **webflow** - Website building
6. **vercel** - Deployment
7. **slack** - Communication
8. **notion** - Documentation

### Backup Configuration
- Original 27-server config backed up to: `mcp.json.backup`
- Can restore specific servers as needed

## Next Steps
1. **Restart Cursor IDE** to load optimized configuration
2. Test MCP tools are now accessible
3. Add servers individually if more tools needed (stay under 80 total tools)

## Adding More Servers
To add additional servers without hitting limits:
1. Check current tool count in Cursor settings
2. Add one server at a time
3. Restart Cursor after each addition
4. Monitor tool count to stay under 80

## Disabled Servers (Available for Re-activation)
- playwright, google-admin, figma, design-tokens, tailwind
- components, icons, gmail, google-sheets, perplexity
- byterover-mcp, atlassian-mcp-server, stash-mcp-server
- genspark-mcp-server, supabase, anthropic, openai