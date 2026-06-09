#!/bin/bash

# 🧪 Taurus AI MCP Agent Testing Suite
echo "🧪 Testing All MCP Agents for Taurus AI BizFlow..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0

# Function to test an agent
test_agent() {
    local name=$1
    local command=$2
    local expected_output=$3
    
    echo -e "\n${YELLOW}Testing $name...${NC}"
    
    # Run the test command with timeout
    if timeout 10s $command >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name - PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $name - FAILED${NC}"
        ((FAILED++))
    fi
}

# Test Node.js availability
echo -e "\n${YELLOW}Checking Prerequisites...${NC}"
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Node.js $(node --version) - Available${NC}"
else
    echo -e "${RED}❌ Node.js - Not Available${NC}"
    exit 1
fi

if command -v python3 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Python $(python3 --version) - Available${NC}"
else
    echo -e "${RED}❌ Python3 - Not Available${NC}"
    exit 1
fi

# Test Custom MCP Agents (These should work in MCP mode, not HTTP)
echo -e "\n${YELLOW}Testing Custom MCP Agents...${NC}"

# Test Figma MCP (Check if it can import without errors)
if node -e "require('./figma-mcp/index.js')" 2>/dev/null; then
    echo -e "${GREEN}✅ Figma MCP - Module loads correctly${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Figma MCP - Module loading failed${NC}"
    ((FAILED++))
fi

# Test Tailwind MCP
if node -e "require('./tailwind-mcp/index.js')" 2>/dev/null; then
    echo -e "${GREEN}✅ Tailwind MCP - Module loads correctly${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Tailwind MCP - Module loading failed${NC}"
    ((FAILED++))
fi

# Test Design Tokens MCP
if node -e "require('./design-tokens-mcp/index.js')" 2>/dev/null; then
    echo -e "${GREEN}✅ Design Tokens MCP - Module loads correctly${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Design Tokens MCP - Module loading failed${NC}"
    ((FAILED++))
fi

# Test Component Library MCP
if node -e "require('./component-library-mcp/index.js')" 2>/dev/null; then
    echo -e "${GREEN}✅ Component Library MCP - Module loads correctly${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Component Library MCP - Module loading failed${NC}"
    ((FAILED++))
fi

# Test Icon Assets MCP
if node -e "require('./icon-assets-mcp/index.js')" 2>/dev/null; then
    echo -e "${GREEN}✅ Icon Assets MCP - Module loads correctly${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Icon Assets MCP - Module loading failed${NC}"
    ((FAILED++))
fi

# Test Klavis MCP Servers (Check if they exist and have proper structure)
echo -e "\n${YELLOW}Testing Klavis MCP Servers...${NC}"

KLAVIS_AGENTS=("gmail" "google_sheets" "slack" "notion" "hubspot" "airtable" "linear" "github")

for agent in "${KLAVIS_AGENTS[@]}"; do
    if [ -d "external-mcps/klavis/mcp_servers/$agent" ]; then
        echo -e "${GREEN}✅ $agent MCP - Directory exists${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $agent MCP - Directory missing${NC}"
        ((FAILED++))
    fi
done

# Test if Playwright is available (for browser automation)
echo -e "\n${YELLOW}Testing Browser Automation...${NC}"
if npm list playwright >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Playwright - Available${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Playwright - Not installed (will install when needed)${NC}"
fi

# Final Results
echo -e "\n=================================================="
echo -e "${YELLOW}Test Results Summary:${NC}"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your MCP agents are ready!${NC}"
    echo -e "${GREEN}🚀 You can now restart Cursor and use your agents!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi




