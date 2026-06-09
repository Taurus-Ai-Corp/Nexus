#!/bin/bash

# Setup script for Awesome AI Apps MCP Servers
# This script helps configure the MCP servers from the awesome-ai-apps collection

echo "🚀 Setting up Awesome AI Apps MCP Servers..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found. Please install Python 3 first."
    exit 1
fi

# Install required packages
echo "📦 Installing required Python packages..."
python3 -m pip install fastmcp mcp python-dotenv

# Check if Docker is available (for GitHub official MCP)
if command -v docker &> /dev/null; then
    echo "🐳 Docker found - GitHub official MCP server will be available"
    # Pull the official GitHub MCP server
    docker pull ghcr.io/github/github-mcp-server
else
    echo "⚠️  Docker not found - GitHub official MCP server will not be available"
fi

# Create environment template file
ENV_FILE="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.claude/awesome-AI-Apps/.env.template"
cat > "$ENV_FILE" << EOF
# Environment variables for Awesome AI Apps MCP Servers

# Email MCP Server
SENDER_NAME="Your Full Name"
SENDER_EMAIL="your-email@gmail.com"
SENDER_PASSKEY="your-gmail-app-password"

# GitHub Token (for GitHub-related MCP servers)
GITHUB_TOKEN="your_github_personal_access_token"
GITHUB_PERSONAL_ACCESS_TOKEN="your_github_personal_access_token"

# Nebius API Key (for AI-powered services)
NEBIUS_API_KEY="your_nebius_api_key"
EOF

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy and rename .env.template to .env"
echo "2. Fill in your API keys and tokens in the .env file"
echo "3. Configure Claude Code to use the MCP configuration file"
echo "4. Available MCP servers:"
echo "   - email-mcp: Send emails via Gmail SMTP"
echo "   - docs-mcp: Documentation Q&A agent"
echo "   - github-official: Official GitHub MCP server (requires Docker)"
echo "   - mcp-starter: GitHub repository analyzer"
echo ""
echo "Configuration file location:"
echo "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Vibe-Marketing-Ecosystem/mcp-agents/enhanced-cursor-mcp-config.json"