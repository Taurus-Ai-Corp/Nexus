#!/bin/bash
# 🚀 Taurus AI Corp. - Navigation Script
# Quick access to all your projects

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/Users/user/Documents/Taurus AI Corp./Cursor:Claude"

echo -e "${BLUE}🏰 Taurus AI Corp. - Project Navigator${NC}"
echo "=================================================="

# Function to show current location
show_location() {
    echo -e "${YELLOW}📍 Current Location:${NC} $(pwd)"
    echo ""
}

# Function to navigate to Taurus AI Agent Registry
go_taurus() {
    cd "$BASE_DIR/Taurus-AI-Agent-Registry"
    echo -e "${GREEN}✅ Navigated to Taurus AI Agent Registry${NC}"
    show_location
    echo -e "${BLUE}Available commands:${NC}"
    echo "  • cd agents && python3 test_agents.py    # Test agents"
    echo "  • cd agents && python3 demo_agents.py    # Run demo"
    echo "  • python3 start_registry.py              # Start registry server"
}

# Function to navigate to BizFlow
go_bizflow() {
    cd "$BASE_DIR/BizFlow"
    echo -e "${GREEN}✅ Navigated to BizFlow Project${NC}"
    show_location
    echo -e "${BLUE}Available commands:${NC}"
    echo "  • python3 test_models.py                 # Test AI models"
    echo "  • python3 test_campaign.py               # Run test campaigns"
    echo "  • python3 orchestrator.py                # Run orchestrator"
}

# Function to show project status
show_status() {
    echo -e "${BLUE}📊 Project Status:${NC}"
    echo ""
    
    # Check Taurus AI Agent Registry
    if [ -d "$BASE_DIR/Taurus-AI-Agent-Registry" ]; then
        echo -e "${GREEN}✅ Taurus AI Agent Registry${NC}"
        echo "  📁 Location: $BASE_DIR/Taurus-AI-Agent-Registry"
        echo "  🎯 Purpose: AI agents for marketing and local AI"
        echo "  🧪 Test: cd agents && python3 test_agents.py"
    else
        echo -e "${RED}❌ Taurus AI Agent Registry - Not Found${NC}"
    fi
    
    echo ""
    
    # Check BizFlow
    if [ -d "$BASE_DIR/BizFlow" ]; then
        echo -e "${GREEN}✅ BizFlow Project${NC}"
        echo "  📁 Location: $BASE_DIR/BizFlow"
        echo "  🎯 Purpose: AI marketing campaigns and business flow"
        echo "  🧪 Test: python3 test_campaign.py"
    else
        echo -e "${RED}❌ BizFlow Project - Not Found${NC}"
    fi
}

# Function to show quick commands
show_quick_commands() {
    echo -e "${BLUE}⚡ Quick Commands:${NC}"
    echo ""
    echo -e "${YELLOW}Navigation:${NC}"
    echo "  • source navigate.sh taurus    # Go to Taurus AI Registry"
    echo "  • source navigate.sh bizflow    # Go to BizFlow"
    echo "  • source navigate.sh status     # Show project status"
    echo ""
    echo -e "${YELLOW}Testing:${NC}"
    echo "  • source navigate.sh test-all   # Test all projects"
    echo ""
    echo -e "${YELLOW}Help:${NC}"
    echo "  • source navigate.sh help       # Show this help"
}

# Function to test all projects
test_all() {
    echo -e "${BLUE}🧪 Testing All Projects...${NC}"
    echo "=================================================="
    
    # Test Taurus AI Agent Registry
    echo -e "${YELLOW}Testing Taurus AI Agent Registry...${NC}"
    cd "$BASE_DIR/Taurus-AI-Agent-Registry/agents"
    if python3 test_agents.py > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Taurus AI Agent Registry - Tests Passed${NC}"
    else
        echo -e "${RED}❌ Taurus AI Agent Registry - Tests Failed${NC}"
    fi
    
    echo ""
    
    # Test BizFlow
    echo -e "${YELLOW}Testing BizFlow...${NC}"
    cd "$BASE_DIR/BizFlow"
    if python3 test_models.py > /dev/null 2>&1; then
        echo -e "${GREEN}✅ BizFlow - Tests Passed${NC}"
    else
        echo -e "${RED}❌ BizFlow - Tests Failed${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 All tests completed!${NC}"
}

# Main script logic
case "$1" in
    "taurus"|"t")
        go_taurus
        ;;
    "bizflow"|"b")
        go_bizflow
        ;;
    "status"|"s")
        show_status
        ;;
    "test-all"|"test")
        test_all
        ;;
    "help"|"h"|"")
        show_quick_commands
        echo ""
        show_status
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo "Use 'source navigate.sh help' for available commands"
        ;;
esac
