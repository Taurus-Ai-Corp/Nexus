#!/bin/bash

echo "🚀 Starting Taurus AI MCP Agents..."

# Kill any existing processes on these ports
echo "🔄 Cleaning up existing processes..."
pkill -f "node.*3001" 2>/dev/null
pkill -f "node.*3002" 2>/dev/null
pkill -f "node.*3003" 2>/dev/null
pkill -f "node.*3004" 2>/dev/null
pkill -f "node.*3005" 2>/dev/null

sleep 2

# Start Figma MCP Agent
echo "🎨 Starting Figma MCP Agent (port 3001)..."
cd figma-mcp
PORT=3001 node index.js &
FIGMA_PID=$!
cd ..

# Start Tailwind MCP Agent
echo "🎨 Starting Tailwind MCP Agent (port 3002)..."
cd tailwind-mcp
PORT=3002 node index.js &
TAILWIND_PID=$!
cd ..

# Start Design Tokens MCP Agent
echo "🎨 Starting Design Tokens MCP Agent (port 3003)..."
cd design-tokens-mcp
PORT=3003 node index.js &
TOKENS_PID=$!
cd ..

# Start Component Library MCP Agent
echo "🧩 Starting Component Library MCP Agent (port 3004)..."
cd component-library-mcp
PORT=3004 node index.js &
COMPONENTS_PID=$!
cd ..

# Start Icon & Assets MCP Agent
echo "🎨 Starting Icon & Assets MCP Agent (port 3005)..."
cd icon-assets-mcp
PORT=3005 node index.js &
ICONS_PID=$!
cd ..

sleep 3

echo ""
echo "✅ All MCP Agents Started Successfully!"
echo ""
echo "📡 Agent Status:"
echo "  🎨 Figma MCP:      http://localhost:3001/health"
echo "  🎨 Tailwind MCP:   http://localhost:3002/health"
echo "  🎨 Design Tokens:  http://localhost:3003/health"
echo "  🧩 Components:     http://localhost:3004/health"
echo "  🎨 Icons:          http://localhost:3005/health"
echo ""
echo "🔧 To test agents, run:"
echo "  curl http://localhost:3001/health"
echo "  curl http://localhost:3002/health"
echo "  curl http://localhost:3003/health"
echo "  curl http://localhost:3004/health"
echo "  curl http://localhost:3005/health"
echo ""
echo "🛑 To stop all agents: ./stop-all-agents.sh"
echo ""

# Save PIDs for later cleanup
echo $FIGMA_PID > .figma.pid
echo $TAILWIND_PID > .tailwind.pid
echo $TOKENS_PID > .tokens.pid
echo $COMPONENTS_PID > .components.pid
echo $ICONS_PID > .icons.pid

echo "🎉 Ready to use with Cursor!"






