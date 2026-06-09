#!/bin/bash

# SurfSense Knowledge System - Agent Status Monitor
# Check status of all agents

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
CONFIG_FILE="$SCRIPT_DIR/agent_config.json"
PIDS_DIR="$SCRIPT_DIR/pids"
LOGS_DIR="$SCRIPT_DIR/logs"

# Function to print colored output
print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║         SurfSense Knowledge System - Agent Status            ║"
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

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        print_error "jq is not installed"
        exit 1
    fi
}

# Function to check agent status
check_agent_status() {
    local agent_name=$1
    local agent_config=$(jq -r ".agents.$agent_name" "$CONFIG_FILE")
    local agent_display_name=$(echo "$agent_config" | jq -r '.name')
    local port=$(echo "$agent_config" | jq -r '.port')
    local category=$(echo "$agent_config" | jq -r '.category')

    local pid_file="$PIDS_DIR/${agent_name}.pid"
    local status="STOPPED"
    local pid=""
    local status_icon="✗"
    local status_color="$RED"

    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            status="RUNNING"
            status_icon="✓"
            status_color="$GREEN"
        else
            status="DEAD"
            status_icon="⚠"
            status_color="$YELLOW"
        fi
    fi

    # Format output
    printf "%-30s ${status_color}%-8s${NC} %-8s %-15s %s\n" \
        "$agent_display_name" \
        "$status_icon $status" \
        "Port:$port" \
        "$category" \
        "${pid:-(none)}"
}

# Function to display detailed status
display_detailed_status() {
    print_banner

    check_jq

    echo -e "${MAGENTA}Main Agents (5):${NC}\n"
    printf "%-30s %-15s %-20s %-15s %s\n" "Agent Name" "Status" "Port" "Category" "PID"
    echo "────────────────────────────────────────────────────────────────────────────────"

    check_agent_status "deep_researcher"
    check_agent_status "arxiv_researcher"
    check_agent_status "candidate_analyzer"
    check_agent_status "trend_analyzer"
    check_agent_status "price_monitor"

    echo ""
    echo -e "${MAGENTA}Sub-Agents (5):${NC}\n"
    printf "%-30s %-15s %-20s %-15s %s\n" "Agent Name" "Status" "Port" "Category" "PID"
    echo "────────────────────────────────────────────────────────────────────────────────"

    check_agent_status "startup_validator"
    check_agent_status "blog_writer"
    check_agent_status "newsletter_generator"
    check_agent_status "social_media_manager"
    check_agent_status "job_finder"

    echo ""
}

# Function to count running agents
count_running_agents() {
    local running=0
    local total=10

    for agent in "deep_researcher" "arxiv_researcher" "candidate_analyzer" "trend_analyzer" "price_monitor" \
                 "startup_validator" "blog_writer" "newsletter_generator" "social_media_manager" "job_finder"; do
        local pid_file="$PIDS_DIR/${agent}.pid"
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid > /dev/null 2>&1; then
                ((running++))
            fi
        fi
    done

    echo -e "${CYAN}═══ Summary ═══${NC}"
    echo -e "Running: ${GREEN}$running${NC}/$total agents"

    if [ $running -eq $total ]; then
        echo -e "Status: ${GREEN}All systems operational${NC}"
    elif [ $running -gt 0 ]; then
        echo -e "Status: ${YELLOW}Partial deployment${NC}"
    else
        echo -e "Status: ${RED}All agents stopped${NC}"
    fi
}

# Function to display system resources
display_system_resources() {
    echo ""
    echo -e "${CYAN}═══ System Resources ═══${NC}"

    # Check available ports
    local ports_in_use=0
    for port in {8501..8510}; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            ((ports_in_use++))
        fi
    done
    echo "Ports in use: $ports_in_use/10 (8501-8510)"

    # Check disk space for logs
    if [ -d "$LOGS_DIR" ]; then
        local logs_size=$(du -sh "$LOGS_DIR" 2>/dev/null | cut -f1)
        echo "Logs directory: $logs_size"
    fi

    # Memory usage (simplified)
    if command -v ps &> /dev/null; then
        local total_mem=0
        for agent in "deep_researcher" "arxiv_researcher" "candidate_analyzer" "trend_analyzer" "price_monitor" \
                     "startup_validator" "blog_writer" "newsletter_generator" "social_media_manager" "job_finder"; do
            local pid_file="$PIDS_DIR/${agent}.pid"
            if [ -f "$pid_file" ]; then
                local pid=$(cat "$pid_file")
                if ps -p $pid > /dev/null 2>&1; then
                    local mem=$(ps -o rss= -p $pid 2>/dev/null || echo 0)
                    total_mem=$((total_mem + mem))
                fi
            fi
        done
        local total_mem_mb=$((total_mem / 1024))
        echo "Total memory usage: ${total_mem_mb}MB"
    fi
}

# Function to display quick links
display_quick_links() {
    echo ""
    echo -e "${CYAN}═══ Quick Access URLs ═══${NC}"

    local all_agents=(
        "deep_researcher:8501:Deep Researcher"
        "arxiv_researcher:8502:ArXiv Researcher"
        "candidate_analyzer:8503:Candidate Analyzer"
        "trend_analyzer:8504:Trend Analyzer"
        "price_monitor:8505:Price Monitor"
        "startup_validator:8506:Startup Validator"
        "blog_writer:8507:Blog Writer"
        "newsletter_generator:8508:Newsletter Generator"
        "social_media_manager:8509:Social Media Manager"
        "job_finder:8510:Job Finder"
    )

    for agent_info in "${all_agents[@]}"; do
        IFS=':' read -r agent_name port display_name <<< "$agent_info"
        local pid_file="$PIDS_DIR/${agent_name}.pid"

        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "  ${GREEN}✓${NC} $display_name → http://localhost:$port"
            fi
        fi
    done
}

# Main script
main() {
    case "${1:-status}" in
        status)
            display_detailed_status
            count_running_agents
            display_system_resources
            display_quick_links
            ;;
        brief)
            count_running_agents
            ;;
        urls)
            display_quick_links
            ;;
        help)
            echo "Usage: $0 [status|brief|urls|help]"
            echo ""
            echo "Commands:"
            echo "  status  - Show detailed status of all agents (default)"
            echo "  brief   - Show brief summary"
            echo "  urls    - Show only access URLs for running agents"
            echo "  help    - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"