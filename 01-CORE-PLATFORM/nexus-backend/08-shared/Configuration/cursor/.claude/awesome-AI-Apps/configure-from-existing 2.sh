#!/bin/bash

# Script to configure awesome-ai-apps MCP servers using existing API keys

echo "🔧 Configuring awesome-ai-apps MCP servers with your existing API keys..."

# Path to existing .env file with API keys
EXISTING_ENV="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Vibe-Marketing-Ecosystem/mcp-agents/.env"
TARGET_ENV="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.claude/awesome-AI-Apps/.env"

# Check if existing .env file exists
if [[ ! -f "$EXISTING_ENV" ]]; then
    echo "❌ Existing .env file not found at: $EXISTING_ENV"
    echo "Please check the path and try again."
    exit 1
fi

echo "📋 Found existing configuration file"
echo "🔑 Extracting API keys..."

# Create new .env file from template
cp "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.claude/awesome-AI-Apps/.env.template" "$TARGET_ENV"

# Extract values from existing .env file
GITHUB_TOKEN=$(grep "GITHUB_PERSONAL_ACCESS_TOKEN=" "$EXISTING_ENV" | cut -d'=' -f2)
GOOGLE_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" "$EXISTING_ENV" | cut -d'=' -f2)
GOOGLE_CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET=" "$EXISTING_ENV" | cut -d'=' -f2)

echo "✏️  Configuring MCP servers with your existing keys..."

# Update the .env file with extracted values
if [[ -n "$GITHUB_TOKEN" && "$GITHUB_TOKEN" != "your_github_token_here" ]]; then
    sed -i '' "s/your_github_personal_access_token/$GITHUB_TOKEN/g" "$TARGET_ENV"
    sed -i '' "s/your_github_token_here/$GITHUB_TOKEN/g" "$TARGET_ENV"
    echo "   ✅ GitHub token configured"
else
    echo "   ⚠️  GitHub token not found or not set"
fi

# For email configuration, check if SMTP settings exist in TaurusAI production.env
TAURUS_ENV="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TaurusAI-BizFlow-0\$Service-package/agents/production.env"
if [[ -f "$TAURUS_ENV" ]]; then
    SMTP_USER=$(grep "SMTP_USER=" "$TAURUS_ENV" | cut -d'=' -f2)
    SMTP_PASSWORD=$(grep "SMTP_PASSWORD=" "$TAURUS_ENV" | cut -d'=' -f2)
    
    if [[ -n "$SMTP_USER" && "$SMTP_USER" != "your-email@gmail.com" ]]; then
        sed -i '' "s/your-email@gmail.com/$SMTP_USER/g" "$TARGET_ENV"
        echo "   ✅ Email address configured from TaurusAI config"
    fi
    
    if [[ -n "$SMTP_PASSWORD" && "$SMTP_PASSWORD" != "your-app-password" ]]; then
        sed -i '' "s/your-gmail-app-password/$SMTP_PASSWORD/g" "$TARGET_ENV"
        echo "   ✅ Email password configured from TaurusAI config"
    fi
fi

# Set a default sender name
sed -i '' 's/Your Full Name/Taurus AI Assistant/g' "$TARGET_ENV"

echo ""
echo "✅ Configuration complete!"
echo ""
echo "📁 Configuration file created at: $TARGET_ENV"
echo ""
echo "🚀 Your MCP servers are now configured with:"
if [[ -n "$GITHUB_TOKEN" && "$GITHUB_TOKEN" != "your_github_token_here" ]]; then
    echo "   ✅ GitHub integration ready"
else
    echo "   ❌ GitHub token needs manual configuration"
fi

if [[ -n "$SMTP_USER" && "$SMTP_USER" != "your-email@gmail.com" ]]; then
    echo "   ✅ Email MCP ready"
else
    echo "   ❌ Email settings need manual configuration"
fi

echo ""
echo "💡 To complete the setup:"
echo "1. Review the generated .env file: $TARGET_ENV"
echo "2. Add any missing API keys (Nebius, etc.)"
echo "3. Your MCP servers are ready to use!"