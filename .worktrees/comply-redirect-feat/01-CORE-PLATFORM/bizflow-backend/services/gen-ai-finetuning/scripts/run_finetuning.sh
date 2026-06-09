#!/bin/bash
# One-command fine-tuning execution script
# Usage: ./run_finetuning.sh [claude|ollama] [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$SERVICE_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

MODEL_TYPE=${1:-claude}

if [ "$MODEL_TYPE" != "claude" ] && [ "$MODEL_TYPE" != "ollama" ]; then
    echo "Usage: $0 [claude|ollama] [options]"
    exit 1
fi

print_info "Starting fine-tuning for $MODEL_TYPE..."

if [ "$MODEL_TYPE" == "claude" ]; then
    # Claude fine-tuning
    print_info "Preparing Claude fine-tuning..."
    
    # Check for required environment variables
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        print_warning "ANTHROPIC_API_KEY not set, checking config..."
        if [ -f "config/finetuning_config.yaml" ]; then
            print_info "Config file found, proceeding..."
        else
            echo "Error: ANTHROPIC_API_KEY required for Claude fine-tuning"
            exit 1
        fi
    fi
    
    # Run Claude fine-tuning
    shift  # Remove model type from arguments
    python3 training/train_claude.py "$@"
    
elif [ "$MODEL_TYPE" == "ollama" ]; then
    # Ollama fine-tuning
    print_info "Preparing Ollama fine-tuning..."
    
    # Check for Ollama
    if ! command -v ollama &> /dev/null; then
        echo "Error: Ollama not found. Install from https://ollama.ai"
        exit 1
    fi
    
    # Run Ollama fine-tuning
    shift  # Remove model type from arguments
    python3 training/train_ollama.py "$@"
fi

print_success "Fine-tuning script completed"


