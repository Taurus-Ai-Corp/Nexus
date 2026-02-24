#!/bin/bash

echo "🚀 Installing Taurus AI MCP Agents for UI/UX Design..."

# Install dependencies for each MCP agent
echo "📦 Installing Figma MCP..."
cd figma-mcp && npm install && cd ..

echo "📦 Installing Design Tokens MCP..."
cd design-tokens-mcp && npm install && cd ..

echo "📦 Installing Tailwind CSS MCP..."
cd tailwind-mcp && npm install && cd ..

echo "📦 Installing Component Library MCP..."
cd component-library-mcp && npm install && cd ..

echo "📦 Installing Icon & Assets MCP..."
cd icon-assets-mcp && npm install && cd ..

echo "✅ All MCP agents installed successfully!"
echo ""
echo "🎯 Available MCP Agents:"
echo "  • Figma MCP - Design file access and token extraction"
echo "  • Design Tokens MCP - CSS/SCSS/JS token generation"
echo "  • Tailwind CSS MCP - Component generation and class optimization"
echo "  • Component Library MCP - Professional UI components"
echo "  • Icon & Assets MCP - Icon management and optimization"
echo ""
echo "🔧 To use with Cursor, add to your settings.json:"
echo "  \"mcp.servers\": {"
echo "    \"figma\": { \"command\": \"node\", \"args\": [\"path/to/figma-mcp/index.js\"] },"
echo "    \"design-tokens\": { \"command\": \"node\", \"args\": [\"path/to/design-tokens-mcp/index.js\"] },"
echo "    \"tailwind\": { \"command\": \"node\", \"args\": [\"path/to/tailwind-mcp/index.js\"] },"
echo "    \"components\": { \"command\": \"node\", \"args\": [\"path/to/component-library-mcp/index.js\"] },"
echo "    \"icons\": { \"command\": \"node\", \"args\": [\"path/to/icon-assets-mcp/index.js\"] }"
echo "  }"







