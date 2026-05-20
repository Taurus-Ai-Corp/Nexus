#!/bin/bash

# SurfSense Knowledge System - Individual Agent Launcher
# Usage: ./launch_agent.sh <agent_name>

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
LOGS_DIR="$SCRIPT_DIR/logs"
PIDS_DIR="$SCRIPT_DIR/pids"

# Create necessary directories
mkdir -p "$LOGS_DIR"
mkdir -p "$PIDS_DIR"

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

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        print_error "jq is not installed. Please install it first:"
        echo "  macOS: brew install jq"
        echo "  Linux: sudo apt-get install jq"
        exit 1
    fi
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to get agent configuration
get_agent_config() {
    local agent_name=$1
    jq -r ".agents.$agent_name" "$CONFIG_FILE"
}

# Function to launch an agent
launch_agent() {
    local agent_name=$1

    print_info "Launching $agent_name..."

    # Get agent configuration
    local config=$(get_agent_config "$agent_name")

    if [ "$config" == "null" ]; then
        print_error "Agent '$agent_name' not found in configuration"
        exit 1
    fi

    # Parse configuration
    local agent_display_name=$(echo "$config" | jq -r '.name')
    local agent_path=$(echo "$config" | jq -r '.path')
    local app_file=$(echo "$config" | jq -r '.app_file')
    local port=$(echo "$config" | jq -r '.port')
    local env_vars=$(echo "$config" | jq -r '.env_vars[]' 2>/dev/null)

    print_info "Agent: $agent_display_name"
    print_info "Path: $agent_path"
    print_info "Port: $port"

    # Check if path exists
    if [ ! -d "$agent_path" ]; then
        print_error "Agent path does not exist: $agent_path"
        exit 1
    fi

    # Check if app file exists
    if [ ! -f "$agent_path/$app_file" ]; then
        print_error "App file does not exist: $agent_path/$app_file"
        exit 1
    fi

    # Check if port is available
    if ! check_port $port; then
        print_error "Port $port is already in use"
        print_info "You can check what's using the port with: lsof -i :$port"
        exit 1
    fi

    # Check for environment variables
    print_info "Checking environment variables..."
    local missing_vars=()
    if [ -n "$env_vars" ]; then
        while IFS= read -r var; do
            if [ -z "${!var}" ]; then
                missing_vars+=("$var")
            fi
        done <<< "$env_vars"
    fi

    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_warning "Missing environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_info "The agent may still launch, but some features might not work"
    fi

    # Check for virtual environment
    local venv_path="$agent_path/venv"
    local python_cmd="python3"

    if [ -d "$venv_path" ]; then
        print_info "Using virtual environment at $venv_path"
        python_cmd="$venv_path/bin/python"
    else
        print_warning "No virtual environment found. Using system Python."
        print_info "To create a virtual environment, run:"
        echo "  cd $agent_path"
        echo "  python3 -m venv venv"
        echo "  source venv/bin/activate"
        echo "  pip install -r requirements.txt  # or pip install -e ."
    fi

    # Launch the agent
    cd "$agent_path"

    local log_file="$LOGS_DIR/${agent_name}.log"
    local pid_file="$PIDS_DIR/${agent_name}.pid"

    print_info "Starting Streamlit application..."

    # Launch Streamlit in the background
    nohup $python_cmd -m streamlit run "$app_file" \
        --server.port=$port \
        --server.headless=true \
        --browser.gatherUsageStats=false \
        > "$log_file" 2>&1 &

    local pid=$!
    echo $pid > "$pid_file"

    # Wait a moment and check if process is still running
    sleep 3

    if ps -p $pid > /dev/null; then
        print_success "$agent_display_name launched successfully!"
        print_success "PID: $pid"
        print_success "Port: $port"
        print_success "URL: http://localhost:$port"
        print_success "Logs: $log_file"
        print_info "To stop this agent, run: ./stop_agent.sh $agent_name"
        return 0
    else
        print_error "Failed to launch agent. Check logs at: $log_file"
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
        jq -r '.agents | keys[]' "$CONFIG_FILE" | while read agent; do
            echo "  - $agent"
        done
        exit 1
    fi

    local agent_name=$1

    check_jq
    launch_agent "$agent_name"
}

main "$@"
