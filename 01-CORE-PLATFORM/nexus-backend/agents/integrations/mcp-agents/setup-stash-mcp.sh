#!/bin/bash

# Stash MCP Server Setup Script
# This script sets up the Stash MCP server for Cursor integration

set -e

echo "🚀 Setting up Stash MCP Server for Cursor integration..."
echo "=================================================="

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.0.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION is supported"

# Install dependencies
echo "📦 Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dependencies installed successfully"
else
    echo "❌ package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

# Make the Stash MCP server executable
echo "🔧 Making Stash MCP server executable..."
chmod +x stash-mcp-server.js
echo "✅ Stash MCP server is now executable"

# Check if master.env exists
if [ -f "../master.env" ]; then
    echo "📝 Found master.env file"
    
    # Check if Stash environment variables are set
    if grep -q "STASH_URL" "../master.env" || grep -q "BITBUCKET_URL" "../master.env"; then
        echo "✅ Stash/Bitbucket environment variables found"
    else
        echo "⚠️  Stash/Bitbucket environment variables not found in master.env"
        echo "   Please add the following variables to your master.env file:"
        echo ""
        echo "   # Stash Configuration (Legacy)"
        echo "   STASH_URL=https://stash.yourcompany.com"
        echo "   STASH_USERNAME=your_username"
        echo "   STASH_PASSWORD=your_password"
        echo "   STASH_API_TOKEN=your_api_token"
        echo ""
        echo "   # Bitbucket Configuration (Modern)"
        echo "   BITBUCKET_URL=https://bitbucket.org"
        echo "   BITBUCKET_USERNAME=your_username"
        echo "   BITBUCKET_APP_PASSWORD=your_app_password"
        echo ""
    fi
else
    echo "⚠️  master.env file not found. Please create it with the required environment variables."
fi

# Test the MCP server
echo "🧪 Testing Stash MCP server..."
if node stash-mcp-server.js --test 2>/dev/null; then
    echo "✅ Stash MCP server test passed"
else
    echo "⚠️  Stash MCP server test failed (this is normal if no credentials are configured)"
fi

# Check Cursor configuration
CURSOR_CONFIG="$HOME/.cursor/mcp.json"
if [ -f "$CURSOR_CONFIG" ]; then
    if grep -q "stash-mcp-server" "$CURSOR_CONFIG"; then
        echo "✅ Stash MCP server found in Cursor configuration"
    else
        echo "❌ Stash MCP server not found in Cursor configuration"
        echo "   Please add the following to your Cursor MCP configuration:"
        echo ""
        cat << 'EOF'
    "stash-mcp-server": {
      "command": "node",
      "args": [
        "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/stash-mcp-server.js"
      ],
      "env": {
        "STASH_URL": "${STASH_URL}",
        "STASH_USERNAME": "${STASH_USERNAME}",
        "STASH_PASSWORD": "${STASH_PASSWORD}",
        "STASH_API_TOKEN": "${STASH_API_TOKEN}",
        "BITBUCKET_URL": "${BITBUCKET_URL}",
        "BITBUCKET_USERNAME": "${BITBUCKET_USERNAME}",
        "BITBUCKET_APP_PASSWORD": "${BITBUCKET_APP_PASSWORD}"
      }
    }
EOF
    fi
else
    echo "❌ Cursor MCP configuration not found at $CURSOR_CONFIG"
fi

echo ""
echo "🎉 Stash MCP Server setup complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Add your Stash/Bitbucket credentials to master.env"
echo "2. Restart Cursor to load the new MCP server"
echo "3. Test the integration by asking Cursor to list repositories"
echo ""
echo "For detailed usage instructions, see STASH_MCP_SETUP.md"
echo ""
echo "Available tools:"
echo "- list_repositories: List all repositories"
echo "- get_repository_info: Get detailed repository information"
echo "- list_branches: List branches in a repository"
echo "- get_commit_info: Get commit details"
echo "- list_pull_requests: List pull requests"
echo "- create_pull_request: Create new pull requests"
echo ""





