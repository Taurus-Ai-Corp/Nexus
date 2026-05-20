#!/bin/bash

# SurfSense Knowledge System - Stop All Agents
# Stop all running agents gracefully

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS_DIR="$SCRIPT_DIR/pids"

# Function to print colored output
print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║         SurfSense Knowledge System - Stop All                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main script
main() {
    print_banner

    if [ ! -d "$PIDS_DIR" ] || [ -z "$(ls -A $PIDS_DIR 2>/dev/null)" ]; then
        print_info "No running agents found"
        exit 0
    fi

    print_info "Stopping all agents..."
    echo ""

    local stopped=0
    local failed=0

    for pid_file in "$PIDS_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            agent_name=$(basename "$pid_file" .pid)
            if bash "$SCRIPT_DIR/stop_agent.sh" "$agent_name"; then
                ((stopped++))
            else
                ((failed++))
            fi
        fi
    done

    echo ""
    echo -e "${CYAN}═══ Summary ═══${NC}"
    echo -e "  ${GREEN}✓ Stopped: $stopped${NC}"
    if [ $failed -gt 0 ]; then
        echo -e "  ${RED}✗ Failed: $failed${NC}"
    fi

    if [ $failed -gt 0 ]; then
        print_warning "Some agents failed to stop gracefully"
        exit 1
    else
        print_success "All agents stopped successfully"
        exit 0
    fi
}

main "$@"
