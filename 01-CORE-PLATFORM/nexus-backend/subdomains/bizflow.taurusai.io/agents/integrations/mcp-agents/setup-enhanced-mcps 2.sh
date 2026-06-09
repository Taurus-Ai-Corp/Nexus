#!/bin/bash

echo "🚀 Setting up Enhanced BizFlow MCP Ecosystem for Taurus AI Corp"
echo "=============================================================="

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_info "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18 or newer."
    exit 1
fi

# Check Python
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    print_status "Python found: $PYTHON_VERSION"
else
    print_error "Python not found. Please install Python 3.12 or newer."
    exit 1
fi

# Build Playwright MCP
print_info "Building Microsoft Playwright MCP..."
cd external-mcps/playwright-mcp
if npm install && npm run build; then
    print_status "Playwright MCP built successfully"
else
    print_error "Failed to build Playwright MCP"
fi
cd ../..

# Install Gmail MCP dependencies
print_info "Installing Gmail MCP..."
cd external-mcps/klavis/mcp_servers/gmail
if npm install; then
    print_status "Gmail MCP installed successfully"
else
    print_warning "Gmail MCP installation had issues, check manually"
fi
cd ../../../..

# Install key Python MCPs
print_info "Installing Python MCP dependencies..."

PYTHON_MCPS=(
    "google_sheets"
    "slack" 
    "notion"
    "hubspot"
    "airtable"
    "linear"
)

for mcp in "${PYTHON_MCPS[@]}"; do
    print_info "Installing $mcp MCP..."
    cd external-mcps/klavis/mcp_servers/$mcp
    if [ -f requirements.txt ]; then
        if pip install -r requirements.txt > /dev/null 2>&1; then
            print_status "$mcp MCP dependencies installed"
        else
            print_warning "$mcp MCP installation had issues, check manually"
        fi
    else
        print_warning "No requirements.txt found for $mcp"
    fi
    cd ../../../..
done

# Build original MCP agents
print_info "Verifying original MCP agents..."

ORIGINAL_MCPS=(
    "tailwind-mcp"
    "design-tokens-mcp"
    "component-library-mcp"
    "icon-assets-mcp"
)

for mcp in "${ORIGINAL_MCPS[@]}"; do
    cd $mcp
    if [ -f package.json ]; then
        if npm install > /dev/null 2>&1; then
            print_status "$mcp verified and ready"
        else
            print_warning "$mcp has dependency issues"
        fi
    fi
    cd ..
done

# Create environment template
print_info "Creating environment template..."
cat > .env.template << 'EOL'
# Enhanced BizFlow MCP Environment Configuration
# Copy this file to .env and fill in your actual tokens

# Design Tools
FIGMA_ACCESS_TOKEN=your_figma_token_here
DESIGN_TOKENS_PATH=/path/to/your/tokens

# Google Services  
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Communication
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_USER_TOKEN=xoxp-your-slack-user-token

# Project Management
NOTION_API_KEY=secret_your_notion_api_key
LINEAR_API_KEY=your_linear_api_key

# CRM & Marketing
HUBSPOT_ACCESS_TOKEN=your_hubspot_token
AIRTABLE_ACCESS_TOKEN=your_airtable_token

# Code Management
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
EOL

print_status "Environment template created as .env.template"

# Final setup information
echo ""
echo "🎉 Enhanced BizFlow MCP Setup Complete!"
echo "======================================"
print_info "Next steps:"
echo "1. Copy .env.template to .env and fill in your API tokens"
echo "2. Copy enhanced-cursor-mcp-config.json to your Cursor MCP settings"
echo "3. Test individual agents using the commands in ENHANCED_BIZFLOW_MCP_GUIDE.md"
echo "4. Start using your enhanced BizFlow ecosystem with Claude Code!"
echo ""
print_info "Available MCP Agents:"
echo "• Development: Figma, Tailwind, Design Tokens, Components, Icons"
echo "• Automation: Microsoft Playwright"  
echo "• Business: Gmail, Google Sheets, Slack, Notion, HubSpot, Airtable, Linear, GitHub"
echo ""
print_info "Documentation: See ENHANCED_BIZFLOW_MCP_GUIDE.md for detailed usage"
echo "Configuration: Use enhanced-cursor-mcp-config.json in Cursor"
echo ""
print_status "Happy coding with your enhanced BizFlow ecosystem! 🚀"