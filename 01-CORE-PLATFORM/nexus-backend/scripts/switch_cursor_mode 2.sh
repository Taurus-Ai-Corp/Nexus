#!/bin/bash
# Switch Cursor IDE between subscription and API modes
# Usage: ./switch_cursor_mode.sh [subscription|api]

set -e

MODE=${1:-subscription}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_DIR="$PROJECT_ROOT/agents/integrations/mcp-agents"

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

print_success() {
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

if [ "$MODE" != "subscription" ] && [ "$MODE" != "api" ]; then
    print_error "Invalid mode: $MODE"
    echo "Usage: $0 [subscription|api]"
    exit 1
fi

print_info "Switching Cursor IDE to $MODE mode..."

# Check if env files exist, create from master.env if needed
if [ ! -f "$ENV_DIR/.env.$MODE" ]; then
    if [ -f "$ENV_DIR/master.env" ]; then
        print_info "Creating .env.$MODE from master.env..."
        cp "$ENV_DIR/master.env" "$ENV_DIR/.env.$MODE"
        
        # For subscription mode, comment out ANTHROPIC_API_KEY
        if [ "$MODE" == "subscription" ]; then
            print_info "Commenting out ANTHROPIC_API_KEY for subscription mode..."
            sed -i.bak 's/^ANTHROPIC_API_KEY=/#ANTHROPIC_API_KEY=/' "$ENV_DIR/.env.$MODE"
            sed -i.bak 's/^ANTHROPIC_API_KEY_BIZFLOW=/#ANTHROPIC_API_KEY_BIZFLOW=/' "$ENV_DIR/.env.$MODE"
            sed -i.bak 's/^ANTHROPIC_API_KEY_NEOVIBE=/#ANTHROPIC_API_KEY_NEOVIBE=/' "$ENV_DIR/.env.$MODE"
            rm -f "$ENV_DIR/.env.$MODE.bak"
            print_success "Created .env.subscription with ANTHROPIC_API_KEY commented out"
        else
            # For API mode, ensure ANTHROPIC_API_KEY is uncommented
            print_info "Ensuring ANTHROPIC_API_KEY is active for API mode..."
            sed -i.bak 's/^#ANTHROPIC_API_KEY=/ANTHROPIC_API_KEY=/' "$ENV_DIR/.env.$MODE"
            sed -i.bak 's/^#ANTHROPIC_API_KEY_BIZFLOW=/ANTHROPIC_API_KEY_BIZFLOW=/' "$ENV_DIR/.env.$MODE"
            sed -i.bak 's/^#ANTHROPIC_API_KEY_NEOVIBE=/ANTHROPIC_API_KEY_NEOVIBE=/' "$ENV_DIR/.env.$MODE"
            rm -f "$ENV_DIR/.env.$MODE.bak"
            print_success "Created .env.api with ANTHROPIC_API_KEY active"
        fi
    else
        print_error "Neither .env.$MODE nor master.env found in $ENV_DIR"
        print_info "Please create .env.$MODE manually or ensure master.env exists"
        exit 1
    fi
fi

# Backup current master.env if it exists
if [ -f "$ENV_DIR/master.env" ]; then
    BACKUP_FILE="$ENV_DIR/master.env.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$ENV_DIR/master.env" "$BACKUP_FILE"
    print_info "Backed up master.env to $BACKUP_FILE"
fi

# Copy the selected mode file to master.env
cp "$ENV_DIR/.env.$MODE" "$ENV_DIR/master.env"
print_status "Copied .env.$MODE to master.env"

# Update Cursor config if it exists
CURSOR_CONFIG="$PROJECT_ROOT/.cursor/subscription_config.json"
if [ -f "$CURSOR_CONFIG" ]; then
    if [ "$MODE" == "subscription" ]; then
        # Update config to use subscription
        python3 << EOF
import json
import sys

config_path = "$CURSOR_CONFIG"
try:
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    config['subscription']['enabled'] = True
    config['subscription']['priority'] = 'subscription'
    config['subscription']['fallbackToApiKey'] = False
    config['apiKeys']['excludedFromChat'] = True
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Updated Cursor subscription config")
except Exception as e:
    print(f"⚠️  Could not update config: {e}", file=sys.stderr)
    sys.exit(0)
EOF
    else
        # Update config to use API
        python3 << EOF
import json
import sys

config_path = "$CURSOR_CONFIG"
try:
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    config['subscription']['enabled'] = False
    config['subscription']['priority'] = 'api'
    config['subscription']['fallbackToApiKey'] = True
    config['apiKeys']['excludedFromChat'] = False
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Updated Cursor subscription config")
except Exception as e:
    print(f"⚠️  Could not update config: {e}", file=sys.stderr)
    sys.exit(0)
EOF
    fi
fi

print_status "Switched to $MODE mode"
print_warning "Please restart Cursor IDE for changes to take effect"
print_info "To verify: Run ./scripts/verify_cursor_subscription.sh"

