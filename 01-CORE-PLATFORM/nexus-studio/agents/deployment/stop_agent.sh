#!/bin/bash

# SurfSense Knowledge System - Agent Stopper
# Usage: ./stop_agent.sh <agent_name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/agent_config.json"
PIDS_DIR="$SCRIPT_DIR/pids"

# Function to print colored output
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

# Function to stop an agent
stop_agent() {
    local agent_name=$1
    local pid_file="$PIDS_DIR/${agent_name}.pid"

    if [ ! -f "$pid_file" ]; then
        print_error "No PID file found for agent '$agent_name'"
        print_info "Agent may not be running or was started manually"
        return 1
    fi

    local pid=$(cat "$pid_file")

    if ps -p $pid > /dev/null 2>&1; then
        print_info "Stopping agent '$agent_name' (PID: $pid)..."
        kill $pid

        # Wait for process to stop
        local count=0
        while ps -p $pid > /dev/null 2>&1; do
            sleep 1
            count=$((count + 1))
            if [ $count -ge 10 ]; then
                print_warning "Process not responding, forcing kill..."
                kill -9 $pid
                break
            fi
        done

        rm -f "$pid_file"
        print_success "Agent '$agent_name' stopped successfully"
        return 0
    else
        print_warning "Process with PID $pid is not running"
        rm -f "$pid_file"
        return 1
    fi
}

# Main script
main() {
    if [ $# -eq 0 ]; then
        print_error "Usage: $0 <agent_name>"
        echo ""
        echo "Available agents:"
        if [ -d "$PIDS_DIR" ] && [ "$(ls -A $PIDS_DIR 2>/dev/null)" ]; then
            for pid_file in "$PIDS_DIR"/*.pid; do
                agent=$(basename "$pid_file" .pid)
                echo "  - $agent"
            done
        else
            echo "  (no agents currently running)"
        fi
        exit 1
    fi

    local agent_name=$1
    stop_agent "$agent_name"
}

main "$@"
