#!/bin/zsh
# Auto-load shared env and run NeoVibe Studio API
set -euo pipefail

ROOT_DIR="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/02-PLATFORM-OPERATIONS/TAURUS AI CORP"
ENV_FILE="$ROOT_DIR/BizFlow-Agentic_Intelligent_Orchestrator/08-shared/secrets/.env.secured"
APP_DIR="$ROOT_DIR/NeoVibe-Vibe_Marketing_Studio/Neural-commerce-System"
PORT=${PORT:-8000}

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Missing env file: $ENV_FILE" >&2
  exit 2
fi

# Export variables from .env safely
set -a
source "$ENV_FILE"
set +a

: ${ATLASSIAN_EMAIL:?:"ATLASSIAN_EMAIL not set"}
: ${ATLASSIAN_API_TOKEN:?:"ATLASSIAN_API_TOKEN not set"}
: ${ATLASSIAN_BASE_URL:?:"ATLASSIAN_BASE_URL not set"}

cd "$APP_DIR"
exec uvicorn neovibe_studio_core:app --host 0.0.0.0 --port $PORT --reload
