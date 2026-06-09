#!/bin/bash
# MCP Tool Management Script

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../tools" && pwd)"
MCP_AGENTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../NeoVibe-Vibe_Marketing_Studio/agents/integrations/mcp-agents" && pwd)"

case "$1" in
    "list")
        echo "📋 Available MCP Tools:"
        ls -1 "$TOOLS_DIR/mcp-tools/" 2>/dev/null | sed 's/\.json$//' || echo "No MCP tools found"
        ;;

    "add")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 add <tool_name>"
            exit 1
        fi

        tool_name="$2"
        echo "➕ Adding MCP tool: $tool_name"

        # Create tool configuration
        cat > "$TOOLS_DIR/mcp-tools/$tool_name.json" << EOF
{
    "name": "$tool_name",
    "version": "1.0.0",
    "description": "MCP tool for $tool_name integration",
    "type": "mcp_server",
    "language": "python",
    "dependencies": [],
    "environment_variables": [],
    "ports": {
        "start": 3000,
        "increment": 1
    },
    "health_check": "/health",
    "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

        # Create tool directory structure
        mkdir -p "$MCP_AGENTS_DIR/$tool_name"
        cp "$TOOLS_DIR/templates/mcp-server-template.py" "$MCP_AGENTS_DIR/$tool_name/server.py"

        echo "✅ MCP tool added: $tool_name"
        ;;

    "remove")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 remove <tool_name>"
            exit 1
        fi

        tool_name="$2"
        echo "➖ Removing MCP tool: $tool_name"

        # Remove tool files
        rm -f "$TOOLS_DIR/mcp-tools/$tool_name.json"
        rm -rf "$MCP_AGENTS_DIR/$tool_name"

        echo "✅ MCP tool removed: $tool_name"
        ;;

    "start")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 start <tool_name>"
            exit 1
        fi

        tool_name="$2"
        echo "🚀 Starting MCP tool: $tool_name"

        tool_config="$TOOLS_DIR/mcp-tools/$tool_name.json"
        if [ ! -f "$tool_config" ]; then
            echo "❌ Tool not found: $tool_name"
            exit 1
        fi

        # Start the tool (customize based on tool type)
        cd "$MCP_AGENTS_DIR/$tool_name"
        python3 server.py &
        echo "✅ MCP tool started: $tool_name (PID: $!)"
        ;;

    "stop")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 stop <tool_name>"
            exit 1
        fi

        tool_name="$2"
        echo "🛑 Stopping MCP tool: $tool_name"

        # Find and kill the process
        pkill -f "$tool_name" || echo "No running process found for $tool_name"
        echo "✅ MCP tool stopped: $tool_name"
        ;;

    "status")
        echo "📊 MCP Tools Status:"
        for tool_file in "$TOOLS_DIR/mcp-tools"/*.json; do
            if [ -f "$tool_file" ]; then
                tool_name=$(basename "$tool_file" .json)
                if pgrep -f "$tool_name" > /dev/null; then
                    echo "  ✅ $tool_name: Running"
                else
                    echo "  ❌ $tool_name: Stopped"
                fi
            fi
        done
        ;;

    "update")
        echo "🔄 Updating all MCP tools..."
        # Add update logic here
        echo "✅ MCP tools updated"
        ;;

    *)
        echo "🔧 MCP Tool Management Commands:"
        echo "  list     - List all available MCP tools"
        echo "  add      - Add new MCP tool"
        echo "  remove   - Remove MCP tool"
        echo "  start    - Start MCP tool"
        echo "  stop     - Stop MCP tool"
        echo "  status   - Show MCP tools status"
        echo "  update   - Update all MCP tools"
        ;;
esac
