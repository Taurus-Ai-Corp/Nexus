#!/bin/bash

# SurfSense Knowledge System - Master Deployment Script
# Deploy all 5 main agents and 5 sub-agents

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

# Function to print colored output
print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║         SurfSense Knowledge System Deployment                ║"
    echo "║              Multi-Agent Orchestration v1.0                  ║"
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

print_section() {
    echo -e "\n${MAGENTA}═══ $1 ═══${NC}\n"
}

# Function to check if jq is installed
check_dependencies() {
    print_section "Checking Dependencies"

    if ! command -v jq &> /dev/null; then
        print_error "jq is not installed. Please install it first:"
        echo "  macOS: brew install jq"
        echo "  Linux: sudo apt-get install jq"
        exit 1
    fi
    print_success "jq is installed"

    if ! command -v python3 &> /dev/null; then
        print_error "python3 is not installed"
        exit 1
    fi
    print_success "python3 is installed"
}

# Function to get agent list by type
get_agents_by_type() {
    local type=$1
    jq -r ".agents | to_entries[] | select(.value.type == \"$type\") | .key" "$CONFIG_FILE"
}

# Function to deploy a single agent
deploy_agent() {
    local agent_name=$1
    local agent_config=$(jq -r ".agents.$agent_name" "$CONFIG_FILE")
    local agent_display_name=$(echo "$agent_config" | jq -r '.name')

    print_info "Deploying: $agent_display_name"

    # Launch the agent
    if bash "$SCRIPT_DIR/launch_agent.sh" "$agent_name"; then
        print_success "$agent_display_name deployed"
        return 0
    else
        print_error "Failed to deploy $agent_display_name"
        return 1
    fi
}

# Function to deploy all agents
deploy_all_agents() {
    print_section "Deploying Main Agents (5)"

    local main_agents=(
        "deep_researcher"
        "arxiv_researcher"
        "candidate_analyzer"
        "trend_analyzer"
        "price_monitor"
    )

    local main_success=0
    local main_failed=0

    for agent in "${main_agents[@]}"; do
        if deploy_agent "$agent"; then
            ((main_success++))
            sleep 5  # Wait between deployments
        else
            ((main_failed++))
        fi
    done

    print_section "Deploying Sub-Agents (5)"

    local sub_agents=(
        "startup_validator"
        "blog_writer"
        "newsletter_generator"
        "social_media_manager"
        "job_finder"
    )

    local sub_success=0
    local sub_failed=0

    for agent in "${sub_agents[@]}"; do
        if deploy_agent "$agent"; then
            ((sub_success++))
            sleep 5  # Wait between deployments
        else
            ((sub_failed++))
        fi
    done

    # Summary
    print_section "Deployment Summary"

    echo -e "Main Agents:"
    echo -e "  ${GREEN}✓ Successfully deployed: $main_success/5${NC}"
    if [ $main_failed -gt 0 ]; then
        echo -e "  ${RED}✗ Failed to deploy: $main_failed/5${NC}"
    fi

    echo -e "\nSub-Agents:"
    echo -e "  ${GREEN}✓ Successfully deployed: $sub_success/5${NC}"
    if [ $sub_failed -gt 0 ]; then
        echo -e "  ${RED}✗ Failed to deploy: $sub_failed/5${NC}"
    fi

    local total_success=$((main_success + sub_success))
    local total_failed=$((main_failed + sub_failed))

    echo -e "\n${CYAN}Total: $total_success/10 agents deployed successfully${NC}"

    if [ $total_failed -gt 0 ]; then
        print_warning "Some agents failed to deploy. Check logs in $SCRIPT_DIR/logs/"
        return 1
    else
        print_success "All agents deployed successfully!"
        return 0
    fi
}

# Function to display agent URLs
display_agent_urls() {
    print_section "Agent Access URLs"

    echo -e "${CYAN}Main Agents:${NC}"
    echo "  1. Deep Researcher      → http://localhost:8501"
    echo "  2. ArXiv Researcher     → http://localhost:8502"
    echo "  3. Candidate Analyzer   → http://localhost:8503"
    echo "  4. Trend Analyzer       → http://localhost:8504"
    echo "  5. Price Monitor        → http://localhost:8505"

    echo -e "\n${CYAN}Sub-Agents:${NC}"
    echo "  6. Startup Validator    → http://localhost:8506"
    echo "  7. Blog Writer          → http://localhost:8507"
    echo "  8. Newsletter Generator → http://localhost:8508"
    echo "  9. Social Media Manager → http://localhost:8509"
    echo " 10. Job Finder           → http://localhost:8510"

    echo ""
}

# Function to deploy specific category
deploy_category() {
    local category=$1

    print_section "Deploying $category agents"

    local agents=$(jq -r ".agents | to_entries[] | select(.value.category == \"$category\") | .key" "$CONFIG_FILE")

    local success=0
    local failed=0

    while IFS= read -r agent; do
        if deploy_agent "$agent"; then
            ((success++))
            sleep 5
        else
            ((failed++))
        fi
    done <<< "$agents"

    echo -e "\n${CYAN}Category '$category': $success deployed successfully${NC}"

    if [ $failed -gt 0 ]; then
        print_warning "$failed agents failed to deploy"
        return 1
    fi

    return 0
}

# Main script
main() {
    print_banner

    case "${1:-all}" in
        all)
            check_dependencies
            deploy_all_agents
            display_agent_urls
            ;;
        main)
            check_dependencies
            print_section "Deploying Main Agents Only"
            for agent in "deep_researcher" "arxiv_researcher" "candidate_analyzer" "trend_analyzer" "price_monitor"; do
                deploy_agent "$agent"
                sleep 5
            done
            ;;
        sub)
            check_dependencies
            print_section "Deploying Sub-Agents Only"
            for agent in "startup_validator" "blog_writer" "newsletter_generator" "social_media_manager" "job_finder"; do
                deploy_agent "$agent"
                sleep 5
            done
            ;;
        research)
            check_dependencies
            deploy_category "research"
            ;;
        business)
            check_dependencies
            deploy_category "business"
            ;;
        content)
            check_dependencies
            deploy_category "content"
            ;;
        help)
            echo "Usage: $0 [all|main|sub|research|business|content|help]"
            echo ""
            echo "Commands:"
            echo "  all      - Deploy all 10 agents (default)"
            echo "  main     - Deploy 5 main agents only"
            echo "  sub      - Deploy 5 sub-agents only"
            echo "  research - Deploy research category agents"
            echo "  business - Deploy business category agents"
            echo "  content  - Deploy content category agents"
            echo "  help     - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"
