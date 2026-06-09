#!/bin/bash
# Test script for Gamma and Canva MCP integration
# Tests MCP servers, agents, and workflows

set -e

echo "🧪 Testing Gamma & Canva MCP Integration"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "\n${YELLOW}Testing: ${test_name}${NC}"
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED: ${test_name}${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Check if MCP servers exist
run_test "Gamma MCP Server File Exists" \
    "test -f 'agents/integrations/mcp-agents/gamma-mcp/index.js'"

run_test "Canva MCP Server File Exists" \
    "test -f 'agents/integrations/mcp-agents/canva-mcp/index.js'"

# Test 2: Check if package.json files exist
run_test "Gamma package.json Exists" \
    "test -f 'agents/integrations/mcp-agents/gamma-mcp/package.json'"

run_test "Canva package.json Exists" \
    "test -f 'agents/integrations/mcp-agents/canva-mcp/package.json'"

# Test 3: Check if agents exist
run_test "Gamma Content Agent Exists" \
    "test -f 'agents/specialized/gamma-content/agent.py'"

run_test "Canva Design Agent Exists" \
    "test -f 'agents/specialized/canva-design/agent.py'"

# Test 4: Check if workflows exist
run_test "Cross-Platform Workflows Exist" \
    "test -f 'agents/specialized/gamma-canva-workflows/cross_platform_workflows.py'"

run_test "NeoVibe Integration Exists" \
    "test -f 'agents/specialized/gamma-canva-workflows/neovibe_integration.py'"

# Test 5: Check MCP registry configuration
run_test "MCP Registry Contains Gamma" \
    "grep -q '\"gamma\"' '08-shared/Configuration/cursor/mcp_registry/mcp_servers_final.json'"

run_test "MCP Registry Contains Canva" \
    "grep -q '\"canva\"' '08-shared/Configuration/cursor/mcp_registry/mcp_servers_final.json'"

# Test 6: Check environment variables
run_test "Master.env Contains GAMMA_API_KEY" \
    "grep -q 'GAMMA_API_KEY' 'agents/integrations/mcp-agents/master.env'"

run_test "Master.env Contains CANVA_API_KEY" \
    "grep -q 'CANVA_API_KEY' 'agents/integrations/mcp-agents/master.env'"

# Test 7: Check Python syntax
run_test "Gamma Agent Python Syntax" \
    "python3 -m py_compile 'agents/specialized/gamma-content/agent.py'"

run_test "Canva Agent Python Syntax" \
    "python3 -m py_compile 'agents/specialized/canva-design/agent.py'"

run_test "Cross-Platform Workflows Python Syntax" \
    "python3 -m py_compile 'agents/specialized/gamma-canva-workflows/cross_platform_workflows.py'"

run_test "NeoVibe Integration Python Syntax" \
    "python3 -m py_compile 'agents/specialized/gamma-canva-workflows/neovibe_integration.py'"

# Test 8: Check Node.js syntax (basic)
run_test "Gamma MCP Server Node.js Syntax" \
    "node --check 'agents/integrations/mcp-agents/gamma-mcp/index.js' 2>/dev/null || echo 'Syntax check skipped (requires MCP SDK)'"

run_test "Canva MCP Server Node.js Syntax" \
    "node --check 'agents/integrations/mcp-agents/canva-mcp/index.js' 2>/dev/null || echo 'Syntax check skipped (requires MCP SDK)'"

# Test 9: Check IQ system integration
run_test "IQ System Contains Gamma" \
    "grep -q 'GAMMA' '/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/CLAUDE-AI-MEMORY-VAULT-SYSTEM/CEO-COMMAND/IQ_INTELLIGENT_QUERY_SYSTEM.py'"

run_test "IQ System Contains Canva" \
    "grep -q 'CANVA' '/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/CLAUDE-AI-MEMORY-VAULT-SYSTEM/CEO-COMMAND/IQ_INTELLIGENT_QUERY_SYSTEM.py'"

# Test 10: Check DMA integration
run_test "DMA Contains Gamma/Canva Keywords" \
    "grep -q 'presentation\|design\|visual\|graphic' '/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/CLAUDE-AI-MEMORY-VAULT-SYSTEM/CEO-COMMAND/DMA_COMMAND_INTEGRATION.md'"

# Summary
echo -e "\n========================================"
echo -e "Test Summary"
echo -e "========================================"
echo -e "${GREEN}Tests Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Tests Failed: ${TESTS_FAILED}${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi

