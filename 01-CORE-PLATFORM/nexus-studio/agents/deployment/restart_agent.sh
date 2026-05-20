#!/bin/bash

# SurfSense Knowledge System - Agent Restarter
# Restart a specific agent or all agents

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to restart a single agent
restart_agent() {
    local agent_name=$1

    print_info "Restarting agent: $agent_name"

    # Stop the agent
    if bash "$SCRIPT_DIR/stop_agent.sh" "$agent_name" 2>/dev/null; then
        print_info "Agent stopped, waiting 2 seconds..."
        sleep 2
    else
        print_info "Agent was not running, starting fresh..."
    fi

    # Start the agent
    if bash "$SCRIPT_DIR/launch_agent.sh" "$agent_name"; then
        print_success "Agent $agent_name restarted successfully"
        return 0
    else
        print_error "Failed to restart agent $agent_name"
        return 1
    fi
}

# Main script
main() {
    if [ $# -eq 0 ]; then
        print_error "Usage: $0 <agent_name>"
        echo ""
        echo "Available agents:"
        echo "  - deep_researcher"
        echo "  - arxiv_researcher"
        echo "  - candidate_analyzer"
        echo "  - trend_analyzer"
        echo "  - price_monitor"
        echo "  - startup_validator"
        echo "  - blog_writer"
        echo "  - newsletter_generator"
        echo "  - social_media_manager"
        echo "  - job_finder"
        exit 1
    fi

    local agent_name=$1
    restart_agent "$agent_name"
}

main "$@"