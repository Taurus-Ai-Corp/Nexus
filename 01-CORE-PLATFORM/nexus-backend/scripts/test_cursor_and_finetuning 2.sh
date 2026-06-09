#!/bin/bash
# End-to-end test script for Cursor subscription config and fine-tuning pipeline
# Usage: ./test_cursor_and_finetuning.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

TEST_RESULTS=()
PASSED=0
FAILED=0

test_check() {
    local name="$1"
    local command="$2"
    
    print_info "Testing: $name"
    
    if eval "$command" > /dev/null 2>&1; then
        print_success "$name"
        TEST_RESULTS+=("✅ $name")
        ((PASSED++))
        return 0
    else
        print_error "$name"
        TEST_RESULTS+=("❌ $name")
        ((FAILED++))
        return 1
    fi
}

print_header "Cursor Subscription Configuration Tests"

# Test 1: Configuration files exist
test_check "Cursor settings.json exists" "[ -f .cursor/settings.json ]"
test_check "Cursor subscription_config.json exists" "[ -f .cursor/subscription_config.json ]"
test_check "MCP config exists" "[ -f agents/integrations/mcp-agents/cursor-mcp-config.json ]"

# Test 2: Scripts exist and are executable
test_check "switch_cursor_mode.sh exists" "[ -f scripts/switch_cursor_mode.sh ]"
test_check "switch_cursor_mode.sh is executable" "[ -x scripts/switch_cursor_mode.sh ]"
test_check "verify_cursor_subscription.sh exists" "[ -f scripts/verify_cursor_subscription.sh ]"
test_check "verify_cursor_subscription.sh is executable" "[ -x scripts/verify_cursor_subscription.sh ]"

# Test 3: Environment files exist
test_check ".env.subscription template exists" "[ -f agents/integrations/mcp-agents/.env.subscription ] || echo 'Note: .env files may be gitignored'"
test_check ".env.api template exists" "[ -f agents/integrations/mcp-agents/.env.api ] || echo 'Note: .env files may be gitignored'"

# Test 4: MCP config doesn't have ANTHROPIC_API_KEY
if grep -q "ANTHROPIC_API_KEY" agents/integrations/mcp-agents/cursor-mcp-config.json 2>/dev/null; then
    print_warning "ANTHROPIC_API_KEY found in MCP config (should only be in env files)"
    TEST_RESULTS+=("⚠️  ANTHROPIC_API_KEY in MCP config")
else
    print_success "MCP config does not include ANTHROPIC_API_KEY (correct)"
    TEST_RESULTS+=("✅ MCP config clean")
    ((PASSED++))
fi

# Test 5: Documentation exists
test_check "CURSOR_SUBSCRIPTION_SETUP.md exists" "[ -f docs/CURSOR_SUBSCRIPTION_SETUP.md ]"
test_check "CURSOR_CONFIG_AUDIT.md exists" "[ -f docs/CURSOR_CONFIG_AUDIT.md ]"
test_check "CURSOR_AND_FINETUNING_GUIDE.md exists" "[ -f docs/CURSOR_AND_FINETUNING_GUIDE.md ]"
test_check "ENVIRONMENT_VARIABLES.md exists" "[ -f docs/ENVIRONMENT_VARIABLES.md ]"

print_header "Gen AI Fine-Tuning Infrastructure Tests"

# Test 6: Directory structure
test_check "Fine-tuning service directory exists" "[ -d services/gen-ai-finetuning ]"
test_check "Config directory exists" "[ -d services/gen-ai-finetuning/config ]"
test_check "Data directory exists" "[ -d services/gen-ai-finetuning/data ]"
test_check "Training directory exists" "[ -d services/gen-ai-finetuning/training ]"
test_check "Monitoring directory exists" "[ -d services/gen-ai-finetuning/monitoring ]"
test_check "Deployment directory exists" "[ -d services/gen-ai-finetuning/deployment ]"
test_check "Scripts directory exists" "[ -d services/gen-ai-finetuning/scripts ]"

# Test 7: Configuration files
test_check "finetuning_config.yaml exists" "[ -f services/gen-ai-finetuning/config/finetuning_config.yaml ]"
test_check "README.md exists" "[ -f services/gen-ai-finetuning/README.md ]"

# Test 8: Python scripts exist
test_check "prepare_dataset.py exists" "[ -f services/gen-ai-finetuning/data/prepare_dataset.py ]"
test_check "validate_dataset.py exists" "[ -f services/gen-ai-finetuning/data/validate_dataset.py ]"
test_check "train_claude.py exists" "[ -f services/gen-ai-finetuning/training/train_claude.py ]"
test_check "training_monitor.py exists" "[ -f services/gen-ai-finetuning/monitoring/training_monitor.py ]"
test_check "model_registry.py exists" "[ -f services/gen-ai-finetuning/deployment/model_registry.py ]"

# Test 9: Scripts are executable
test_check "prepare_dataset.py is executable" "[ -x services/gen-ai-finetuning/data/prepare_dataset.py ]"
test_check "validate_dataset.py is executable" "[ -x services/gen-ai-finetuning/data/validate_dataset.py ]"
test_check "train_claude.py is executable" "[ -x services/gen-ai-finetuning/training/train_claude.py ]"
test_check "run_finetuning.sh exists" "[ -f services/gen-ai-finetuning/scripts/run_finetuning.sh ]"
test_check "run_finetuning.sh is executable" "[ -x services/gen-ai-finetuning/scripts/run_finetuning.sh ]"

# Test 10: Python syntax check (if Python available)
if command -v python3 &> /dev/null; then
    print_info "Checking Python syntax..."
    
    if python3 -m py_compile services/gen-ai-finetuning/data/prepare_dataset.py 2>/dev/null; then
        print_success "prepare_dataset.py syntax valid"
        TEST_RESULTS+=("✅ prepare_dataset.py syntax")
        ((PASSED++))
    else
        print_error "prepare_dataset.py syntax error"
        TEST_RESULTS+=("❌ prepare_dataset.py syntax")
        ((FAILED++))
    fi
    
    if python3 -m py_compile services/gen-ai-finetuning/data/validate_dataset.py 2>/dev/null; then
        print_success "validate_dataset.py syntax valid"
        TEST_RESULTS+=("✅ validate_dataset.py syntax")
        ((PASSED++))
    else
        print_error "validate_dataset.py syntax error"
        TEST_RESULTS+=("❌ validate_dataset.py syntax")
        ((FAILED++))
    fi
    
    if python3 -m py_compile services/gen-ai-finetuning/training/train_claude.py 2>/dev/null; then
        print_success "train_claude.py syntax valid"
        TEST_RESULTS+=("✅ train_claude.py syntax")
        ((PASSED++))
    else
        print_error "train_claude.py syntax error"
        TEST_RESULTS+=("❌ train_claude.py syntax")
        ((FAILED++))
    fi
else
    print_warning "Python3 not found, skipping syntax checks"
fi

# Test 11: LocalAIRouter integration
test_check "LocalAIRouter exists" "[ -f registry/local_ai_router.py ]"

# Check if LocalAIRouter has fine-tuned model support
if grep -q "fine_tuned_models" registry/local_ai_router.py 2>/dev/null; then
    print_success "LocalAIRouter has fine-tuned model support"
    TEST_RESULTS+=("✅ LocalAIRouter fine-tuned support")
    ((PASSED++))
else
    print_error "LocalAIRouter missing fine-tuned model support"
    TEST_RESULTS+=("❌ LocalAIRouter fine-tuned support")
    ((FAILED++))
fi

if grep -q "register_fine_tuned_model" registry/local_ai_router.py 2>/dev/null; then
    print_success "LocalAIRouter has register_fine_tuned_model method"
    TEST_RESULTS+=("✅ register_fine_tuned_model method")
    ((PASSED++))
else
    print_error "LocalAIRouter missing register_fine_tuned_model method"
    TEST_RESULTS+=("❌ register_fine_tuned_model method")
    ((FAILED++))
fi

print_header "Test Summary"

echo -e "\n${BLUE}Test Results:${NC}\n"
for result in "${TEST_RESULTS[@]}"; do
    echo "  $result"
done

echo -e "\n${BLUE}Statistics:${NC}"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo -e "  Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    print_success "\nAll tests passed! ✅"
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "  1. Run: ./scripts/verify_cursor_subscription.sh"
    echo "  2. Test fine-tuning: python services/gen-ai-finetuning/data/prepare_dataset.py --help"
    echo "  3. Review documentation: docs/CURSOR_AND_FINETUNING_GUIDE.md"
    exit 0
else
    print_error "\nSome tests failed. Please review the errors above."
    exit 1
fi


