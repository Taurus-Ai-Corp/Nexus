#!/bin/bash

echo "🛑 Stopping Taurus AI MCP Agents..."

# Kill processes by PID if files exist
if [ -f .figma.pid ]; then
    kill $(cat .figma.pid) 2>/dev/null
    rm .figma.pid
    echo "✅ Stopped Figma MCP Agent"
fi

if [ -f .tailwind.pid ]; then
    kill $(cat .tailwind.pid) 2>/dev/null
    rm .tailwind.pid
    echo "✅ Stopped Tailwind MCP Agent"
fi

if [ -f .tokens.pid ]; then
    kill $(cat .tokens.pid) 2>/dev/null
    rm .tokens.pid
    echo "✅ Stopped Design Tokens MCP Agent"
fi

if [ -f .components.pid ]; then
    kill $(cat .components.pid) 2>/dev/null
    rm .components.pid
    echo "✅ Stopped Component Library MCP Agent"
fi

if [ -f .icons.pid ]; then
    kill $(cat .icons.pid) 2>/dev/null
    rm .icons.pid
    echo "✅ Stopped Icon & Assets MCP Agent"
fi

# Also kill by port number as backup
pkill -f "node.*3001" 2>/dev/null
pkill -f "node.*3002" 2>/dev/null
pkill -f "node.*3003" 2>/dev/null
pkill -f "node.*3004" 2>/dev/null
pkill -f "node.*3005" 2>/dev/null

echo "✅ All MCP Agents stopped!"






