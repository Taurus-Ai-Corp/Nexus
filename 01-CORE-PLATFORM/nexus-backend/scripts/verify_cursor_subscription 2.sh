#!/bin/bash
# Verify Cursor IDE subscription configuration
# Checks if Cursor is configured to use subscription vs API keys

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

echo "🔍 Verifying Cursor IDE Subscription Configuration..."
echo ""

# Check subscription config file
SUBSCRIPTION_CONFIG="$PROJECT_ROOT/.cursor/subscription_config.json"
if [ -f "$SUBSCRIPTION_CONFIG" ]; then
    print_status "Subscription config file found"
    
    # Check if subscription is enabled
    SUBSCRIPTION_ENABLED=$(python3 -c "import json; f=open('$SUBSCRIPTION_CONFIG'); c=json.load(f); print(c.get('subscription', {}).get('enabled', False))" 2>/dev/null || echo "false")
    if [ "$SUBSCRIPTION_ENABLED" == "True" ]; then
        print_status "Subscription mode is enabled in config"
    else
        print_warning "Subscription mode is disabled in config"
    fi
else
    print_warning "Subscription config file not found: $SUBSCRIPTION_CONFIG"
fi

# Check master.env for ANTHROPIC_API_KEY
ENV_FILE="agents/integrations/mcp-agents/master.env"
if [ -f "$ENV_FILE" ]; then
    if grep -q "^ANTHROPIC_API_KEY=" "$ENV_FILE" && ! grep -q "^#.*ANTHROPIC_API_KEY=" "$ENV_FILE"; then
        print_warning "ANTHROPIC_API_KEY is active in master.env (API mode)"
        print_info "For subscription mode, ANTHROPIC_API_KEY should be commented out"
    else
        print_status "ANTHROPIC_API_KEY is commented out or not set (subscription mode)"
    fi
else
    print_warning "master.env file not found: $ENV_FILE"
fi

# Check MCP config
MCP_CONFIG="agents/integrations/mcp-agents/cursor-mcp-config.json"
if [ -f "$MCP_CONFIG" ]; then
    print_status "MCP config file found"
    
    # Check if ANTHROPIC_API_KEY is in MCP config env section (should not be)
    # It's OK if it's only in documentation sections
    if grep -A 5 '"env":' "$MCP_CONFIG" | grep -q "ANTHROPIC_API_KEY"; then
        print_warning "ANTHROPIC_API_KEY found in MCP config env section (should not be there)"
    elif grep -q "ANTHROPIC_API_KEY" "$MCP_CONFIG"; then
        # Check if it's only in documentation/metadata sections
        if grep -q "_authentication\|_metadata\|note\|important" "$MCP_CONFIG"; then
            print_status "MCP config mentions ANTHROPIC_API_KEY only in documentation (correct)"
        else
            print_warning "ANTHROPIC_API_KEY found in MCP config (check if it's in env section)"
        fi
    else
        print_status "MCP config does not include ANTHROPIC_API_KEY (correct)"
    fi
else
    print_warning "MCP config file not found: $MCP_CONFIG"
fi

# Check environment variables
if [ -n "$ANTHROPIC_API_KEY" ]; then
    print_warning "ANTHROPIC_API_KEY is set in environment"
    print_info "This may cause Cursor to use API key instead of subscription"
    print_info "Unset with: unset ANTHROPIC_API_KEY"
else
    print_status "ANTHROPIC_API_KEY is not set in environment (good for subscription)"
fi

# Check Cursor settings
CURSOR_SETTINGS="$PROJECT_ROOT/.cursor/settings.json"
if [ -f "$CURSOR_SETTINGS" ]; then
    print_status "Cursor settings file found"
    
    PREFER_SUBSCRIPTION=$(python3 -c "import json; f=open('$CURSOR_SETTINGS'); c=json.load(f); print(c.get('cursor', {}).get('ai', {}).get('preferences', {}).get('authentication', {}).get('preferSubscription', False))" 2>/dev/null || echo "false")
    if [ "$PREFER_SUBSCRIPTION" == "True" ] || [ "$PREFER_SUBSCRIPTION" == "true" ]; then
        print_status "Cursor settings prefer subscription"
    else
        print_warning "Cursor settings do not prefer subscription (checking subscription_config.json instead)"
        # Also check subscription_config.json as it's the authoritative source
        if [ -f "$PROJECT_ROOT/.cursor/subscription_config.json" ]; then
            SUB_ENABLED=$(python3 -c "import json; f=open('$PROJECT_ROOT/.cursor/subscription_config.json'); c=json.load(f); print(c.get('subscription', {}).get('enabled', False))" 2>/dev/null || echo "false")
            if [ "$SUB_ENABLED" == "True" ] || [ "$SUB_ENABLED" == "true" ]; then
                print_status "Subscription is enabled in subscription_config.json"
            fi
        fi
    fi
else
    print_warning "Cursor settings file not found: $CURSOR_SETTINGS"
fi

echo ""
echo "📋 Summary:"
echo "  - Subscription config: $([ -f "$SUBSCRIPTION_CONFIG" ] && echo "Found" || echo "Missing")"
echo "  - Cursor settings: $([ -f "$CURSOR_SETTINGS" ] && echo "Found" || echo "Missing")"
echo "  - MCP config: $([ -f "$MCP_CONFIG" ] && echo "Found" || echo "Missing")"
echo "  - Environment file: $([ -f "$ENV_FILE" ] && echo "Found" || echo "Missing")"
echo ""
print_info "To switch modes: ./scripts/switch_cursor_mode.sh [subscription|api]"
print_info "Remember to restart Cursor IDE after making changes"

