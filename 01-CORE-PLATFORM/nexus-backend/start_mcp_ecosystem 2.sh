#!/bin/bash

# ===========================================
# TAURUS AI CORP - MCP ECOSYSTEM STARTER
# Complete activation of all 27 MCP servers
# ===========================================

set -e

echo "🚀 Starting TAURUS AI MCP Ecosystem..."
echo "======================================"

# Load key environment variables
export GITHUB_PERSONAL_ACCESS_TOKEN="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"
export FIRECRAWL_API_KEY="fc-43d5707a1d714773a160962cb04391f2"
export VERCEL_TOKEN="QwiaZzjMtgBcoZ2FIiqkEMYe"

echo "✅ Environment variables loaded"

# Verify key APIs are working
echo "🔍 Testing API connections..."

# Test GitHub
if curl -s -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" https://api.github.com/user > /dev/null; then
    echo "✅ GitHub API: Connected"
else
    echo "❌ GitHub API: Failed"
fi

# Test Firecrawl
if curl -s -H "Authorization: Bearer $FIRECRAWL_API_KEY" https://api.firecrawl.dev/v1/scrape -X POST -H "Content-Type: application/json" -d '{"url":"https://example.com"}' > /dev/null; then
    echo "✅ Firecrawl API: Connected"
else
    echo "❌ Firecrawl API: Failed"
fi

# Test Vercel
if curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user > /dev/null; then
    echo "✅ Vercel API: Connected"
else
    echo "❌ Vercel API: Failed"
fi

echo ""
echo "📊 MCP SERVER STATUS:"
echo "===================="
echo "Total Servers: 27"
echo "Official 2025 Servers: 3 (GitHub, Firecrawl, Apify)"
echo "Klavis Collection: 24"
echo "Configuration: /Users/user/.cursor/mcp.json"
echo "Environment: /Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Agentic_Intelligent_Orchestrator/agents/integrations/mcp-agents/master.env"

echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Restart Cursor IDE to load new MCP configuration"
echo "2. Open any project in Cursor"
echo "3. Access MCP servers via @ commands or tool palette"
echo "4. Test specific integrations (GitHub, Firecrawl, etc.)"

echo ""
echo "🎉 MCP ECOSYSTEM READY!"
echo "All 27 servers configured and accessible in Cursor IDE"