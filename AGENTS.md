# Nexus Agent Context

## Stack
- languages: JavaScript/Node, Python, TypeScript
- frameworks: platform
- package_managers: npm, pip
- build_commands: npm run build, npm run build:frontend, npm run build:nexus, npm run dev, npm run dev:backend, npm run dev:frontend, npm run dev:nexus, npm run lint, npm run lint:frontend, npm run lint:nexus, npm run orchestrator:start, npm run test, npm run test:backend, npm run test:frontend
- cloud_targets: Docker
- ci_cd: GitHub Actions, pre-commit

## Key Files
- package.json: package.json
- requirements.txt: requirements.txt
- docker-compose.yml: docker-compose.yml
- .github/workflows: .github/workflows
- .pre-commit-config.yaml: .pre-commit-config.yaml
- README.md: README.md
- CLAUDE.md: CLAUDE.md

## Project Conventions
- Work on feature branches; user runs final merge-to-main.
- Do not touch production deploys or production environment variables.
- Prefer revenue-generating or shipping actions over analysis-only work.
- Verify with commands like `dig`, `curl`, or test runners before declaring success.
- Respect the user's explicit blocks on destructive git ops and credential writes.


## From README.md
# Nexus Platform

AI-powered marketing automation and creative design ecosystem by **TAURUS AI CORP**.

## Overview

| Platform | Domain | Purpose |
|----------|--------|---------|
| **NEXUS by Taurus Ai** | nexus.taurusai.io | Social Suite Dashboard |
| **NEXUS by Taurus Ai** | nexus.taurusai.io | Creative Studio |

**Revenue Target**: $1.7M Year 1

## Quick Start

```bash
# Clone and setup
cd /Users/user/Documents/Nexus-Platform

# Install dependencies
npm install
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development stack
docker-compose up -d

# Run backend
npm run dev:backend

# Run frontend (separate terminal)
npm run dev:frontend
```

## Directory Structure

```
Nexus-Platform/
├── 01-CORE-PLATFORM/      # Nexus backend + Nexus studio
├── 02-AGENTS/             # AI orchestrators + MCP integrations
├── 03-CLIENT-MANAGEMENT/  # Custom CRM + HubSpot sync
├── 04-PRODUCT-DEPLOYMENT/ # Docker, K8s, CI/CD
├── 05-DATABASES/          # Supabase + PlanetScale + MongoDB
├── 06-WORKFLOWS/          # N8N + campaign automation
├── 07-API-ROUTES/         # REST APIs + webhooks
├── 08-DOCUMENTATION/      # Technical + user guides
├── 09-ASSETS/             # Design tokens + marketing
└── 10-CONFIG/             # Environment + MCP configs
```

## Technology Stack

- **Backend**: FastAPI (Python 3.12+)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Databases**: Supabase (PostgreSQL) + PlanetScale (MySQL) + MongoDB Atlas
- **CRM**: Custom + HubSpot sync
- **AI Agents**: Agentuity + Custom orchestrators
- **Automation**: N8N workflows

## Agent Ecosystem

| Agent | Capabilities | Revenue Impact |
|-------|--------------|----------------|
| Cultural Intelligence | Market analysis, cultural adaptation | 40% |
| Content Creation | 50 assets/hour, brand consistency | 60% |
| Campaign Optimization | Real-time A/B testing, 574% ROI | 70% |
| Lead Generation | Lead scoring, nurturing | $750K Q4 |
| Client Communication | Automated reporting | Retention |

## Key Commands

```bash
# Development
npm run dev                    # Start all services
npm run dev:backend           # FastAPI only
npm run dev:frontend          # Next.js only

# Docker
npm run docker:up             # Start containers
npm run docker:down           # Stop containers
npm run docker:logs           # View logs

# Database
npm run db:migrate            # Run migrations
npm run db:reset              # Reset database

# Orchestrator
npm run orchestrator:start    # Start agent orchestrator

# Workflows
npm run n8n:export           # Export N8N workflows
npm run n8n:import           # Import N8N workflows
```

## Development Status

- **Phase 1**: 60% Complete (Core Platform)
- **Phase 2**: Pending (Webflow Integration)
- **Phase 3**: Pending (Content Scaling)
- **Phase 4**: Pending (Landing Page Optimization)

## Performance Targets

| Metric | Target | Industry Avg |
|--------|--------|--------------|
| Engagement Rate | 8.7% | 3.2% |
| Cost Per Lead | $59 | $127 |
| Conversion Rate | 23% | 8% |
| ROI | 574% | 200% |

## Documentation

- [Gemini 3 Continuation Prompt](./GEMINI_CONTINUATION_PROMPT.md)
- [Technical Documentation](./08-DOCUMENTATION/technical/)
- [API Documentation](./08-DOCUMENTATION/api-docs/)

## License

## From CLAUDE.md
# Nexus-Platform

## Repository Map

```
01-CORE-PLATFORM/         # Internal platform tooling (nexus-backend, nexus-studio, agents, MCP integrations)
03-CLIENT-MANAGEMENT/       # Client portals, agency ops, marketing assets
06-WORKFLOWS/               # Partnership pitches, demos, and reusable campaign flows
platform/                   # NEXUS by Taurus AI marketing site (nexus.taurusai.io) — STATIC HTML/CSS/JS
SWARM SR Internal Analysis/ # Internal research, analytics, and tooling docs
taurus-agency-os/           # Agency OS frontend
taurus-ai-corp-ci-audit/  # CI/audit clones and external repo mirrors
```

## GWS Bridge (Google Workspace CLI)

- `gws-bridge status` — check auth + configured sheet/folder IDs
- `gws-bridge pipeline client "Name"` — create client workspace (always ask which platform first)
- GWS CLI resource path is space-separated: `gws sheets spreadsheets values update` (NOT `spreadsheets-values`)
- Helpers: `gws sheets +append`, `gws sheets +read` — shorthand for common ops
- Upload: `gws drive files create --params '{"uploadType": "multipart"}' --json '{"name": "...", "parents": ["ID"]}' --upload "/path" --upload-content-type "mime/type"`
- Move file to folder: `gws drive files update --params '{"fileId": "...", "addParents": "FOLDER_ID"}'`
- Config: `~/.config/gws-bridge/.env` — all folder/sheet IDs with `GWS_` prefix

## Workspace Hierarchy (Google Drive)

- Root: `TAURUS AI — Workspace` → Platform folders (Nexus, Q-Grid) → Client folders
- Each client gets 5 subfolders: Contracts & Invoices, Project Documentation, Assets & Media, Reports & Analytics, Proposals & Upsells
- Each platform gets its own Client Tracker sheet (e.g., "Nexus — Client Tracker")
- Cross-platform ops sheets live in `_Operations/` folder

## Corporate vs. Operating Brand

- Legal docs (invoices, contracts, NDAs): header = "TAURUS AI CORP - FZCO" (License #68122, IFZA Dubai)
- Client-facing (marketing, SaaS, proposals): brand = "Nexus by Taurus AI" / "Q-Grid"
- NEVER mix — government/legal uses FZCO entity, customer-facing uses operating brand

## NotebookLM Integration (`/notebook` command)

- `/notebook` — status, active notebook, sources, artifacts
- `/notebook new "Title"` or `/notebook new --client "Name" --platform Nexus`
- `/notebook ask "question"` — chat with active notebook
- `/notebook source add <url|file>` — auto-detects YouTube, web URL, or local file
- `/notebook source add-yt "query"` — YouTube search + ingest
- `/notebook source add-drive <file-id>` — Google Drive doc
- `/notebook source add-web "query"` — web research
- `/notebook generate <type> "prompt"` — types: audio, slides, report, infographic, video, mind-map, quiz, flashcards, data-table
- `/notebook download <type>` — pull artifacts locally, optionally upload to Drive
- `/notebook share <email>` — share notebook
- Auth expired? User runs: `! notebooklm login`
- CLI: `notebooklm` at `/opt/homebrew/bin/notebooklm`

## Research Pipeline (NotebookLM + Drive)

- `/research "topic" --from drive --client "Name" --platform Nexus` — full pipeline
- `/research "topic" --from youtube` — YouTube-only research (original flow)
- `/research "topic" --from both` — combined internal + external research
- One notebook per client (accumulates sources). Naming: `"Platform — Client Name"`
- Always ask user which docs to ingest (numbered list) and what to generate
- Outputs go to `_Research (Private)` folder in Drive — NOT in client folders
- Bridge helpers: `gws-bridge pipeline research list-docs|create-session|upload`
- NotebookLM generate types: `audio`, `slide-deck`, `report`, `infographic`, `video`, `mind-map`, `quiz`
- NotebookLM source types for Drive: `--mime-type pdf|google-doc|google-sheets|google-slides`
- Filter gws output noise: `grep -v "^\[" | grep -v "^Using"`

## Client Workspace Protocol

Before creating any client workspace, always ask:
1. Which platform? (Nexus / Q-Grid / other)
2. Client industry/type?
3. Engagement type? (project / retainer / hybrid)
4. BDM assignment? (Praveen Varkey for Nexus Kerala market)
5. Phase? (prospect / onboarding / active / upsell)

## AI/ML Stack

### Primary AI Providers

- **OpenRouter** — Cloud AI models (Anthropic, OpenAI, Meta, etc.)
  - API Key: `OPENROUTER_API_KEY` from env
  - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- **Ollama** — Local AI inference
  - Endpoint: `http://localhost:11434/api/chat`
  - Default model: `qwen3-coder:latest`
- **Claude Code** — Agent orchestration via local CLI

### API Key Loading

```typescript
// Priority order for API keys:
1. Environment variables (process.env['KEY_NAME'])
2. Claude Code config (~/.claude/config.json)
3. Local .env files
```

### Key Environment Variables

```
OPENROUTER_API_KEY=sk-or-...
OLLAMA_BASE_URL=http://localhost:11434
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
```

## Heiro Chain (Replacing Hedera)

- Heiro is the primary blockchain/transaction layer for distributed ledger, audit trails, and payment orchestration
- **Hedera SDK** (`@hiero-ledger/sdk` v2.82.0) still used for HCS/HTS operations during transition
- **Config**: `HEIRO_` prefixed env vars; fallback to `HEDERA_` vars for backward compatibility
- **Networks**: mainnet for production, testnet for CI validation
- **Key services**: HCS (consensus), HTS (token service), file service for immutable audit logs

## NEXUS Marketing Site (`platform/`)

Static site for `nexus.taurusai.io` with shared design tokens and four vertical landings:
- **Home**: `platform/index.html`
- **Verticals**: `/social`, `/creative`, `/intel`, `/freelance` (each served via `platform/{vertical}/index.html`)
- **Shared assets**: `platform/assets/css/design-system.css`, `platform/assets/js/main.js`
- **Contact backend**: `platform/api/contact.js` — Nodemailer/SMTP handler
- **Tests**: `platform/api/contact.test.js` (Node built-in test runner)

