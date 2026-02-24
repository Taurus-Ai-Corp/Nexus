#!/bin/bash

# Setup script for all SurfSense agents
# This will create virtual environments and install dependencies for each agent

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_DIR="/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS AI CORP/NeoVibe-Vibe_Marketing_Studio"

echo -e "${BLUE}══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    SurfSense Agent Setup - Installing Dependencies${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════${NC}"

# Function to setup an agent
setup_agent() {
    local name=$1
    local path=$2

    echo -e "\n${YELLOW}Setting up: $name${NC}"
    echo -e "${BLUE}Path: $path${NC}"

    if [ -d "$path" ]; then
        cd "$path"

        # Remove existing venv if present
        if [ -d "venv" ]; then
            echo -e "${YELLOW}Removing existing virtual environment...${NC}"
            rm -rf venv
        fi

        # Create new virtual environment
        echo -e "${BLUE}Creating virtual environment...${NC}"
        python3 -m venv venv

        # Activate and install dependencies
        echo -e "${BLUE}Installing dependencies...${NC}"
        ./venv/bin/pip install --upgrade pip setuptools wheel >/dev/null 2>&1

        # Install streamlit first (common to all)
        ./venv/bin/pip install streamlit >/dev/null 2>&1

        # Check for requirements files
        if [ -f "requirements.txt" ]; then
            ./venv/bin/pip install -r requirements.txt >/dev/null 2>&1
        elif [ -f "pyproject.toml" ]; then
            # Try installing with pip directly for pyproject.toml
            ./venv/bin/pip install -e . >/dev/null 2>&1 || {
                # If that fails, install common dependencies
                ./venv/bin/pip install agno python-dotenv pydantic openai tavily-python groq >/dev/null 2>&1
            }
        else
            # Install common dependencies
            ./venv/bin/pip install agno python-dotenv pydantic openai tavily-python groq >/dev/null 2>&1
        fi

        echo -e "${GREEN}✅ $name setup complete${NC}"
    else
        echo -e "${RED}✗ Path not found: $path${NC}"
    fi
}

# Kill the existing Deep Researcher on port 8501
echo -e "${YELLOW}Stopping existing Deep Researcher on port 8501...${NC}"
lsof -ti:8501 | xargs kill -9 2>/dev/null || true

# Setup Main Agents
echo -e "\n${BLUE}═══ Setting up Main Agents ═══${NC}"
setup_agent "Deep Researcher" "$BASE_DIR/agents/research/deep_researcher"
setup_agent "ArXiv Researcher" "$BASE_DIR/agents/research/arxiv_researcher"
setup_agent "Candidate Analyzer" "$BASE_DIR/agents/research/candidate_analyzer"
setup_agent "Trend Analyzer" "$BASE_DIR/agents/research/trend_analyzer"
setup_agent "Price Monitor" "$BASE_DIR/agents/business/price_monitor"

# Setup Sub-Agents
echo -e "\n${BLUE}═══ Setting up Sub-Agents ═══${NC}"
setup_agent "Startup Validator" "$BASE_DIR/agents/business/startup_validator"
setup_agent "Blog Writer" "$BASE_DIR/agents/content/blog_writer"
setup_agent "Newsletter Generator" "$BASE_DIR/agents/content/newsletter_generator"
setup_agent "Social Media Manager" "$BASE_DIR/agents/content/social_media_manager"
setup_agent "Job Finder" "$BASE_DIR/agents/integrations/mcp-agents/external-mcps/awesome-ai-apps/advance_ai_agents/job_finder_agent"

echo -e "\n${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    All agents have been set up successfully!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Set environment variables in ~/.surfsense_env"
echo -e "2. Source the environment: source ~/.surfsense_env"
echo -e "3. Run deployment: ./deploy_all.sh"