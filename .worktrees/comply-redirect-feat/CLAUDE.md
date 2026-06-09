# BizFlow-Nexus Platform

## GWS Bridge (Google Workspace CLI)

- `gws-bridge status` — check auth + configured sheet/folder IDs
- `gws-bridge pipeline client "Name"` — create client workspace (always ask which platform first)
- GWS CLI resource path is space-separated: `gws sheets spreadsheets values update` (NOT `spreadsheets-values`)
- Helpers: `gws sheets +append`, `gws sheets +read` — shorthand for common ops
- Upload: `gws drive files create --params '{"uploadType": "multipart"}' --json '{"name": "...", "parents": ["ID"]}' --upload "/path" --upload-content-type "mime/type"`
- Move file to folder: `gws drive files update --params '{"fileId": "...", "addParents": "FOLDER_ID"}'`
- Config: `~/.config/gws-bridge/.env` — all folder/sheet IDs with `GWS_` prefix

## Workspace Hierarchy (Google Drive)

- Root: `TAURUS AI — Workspace` → Platform folders (Nexus, Q-Grid, BizFlow) → Client folders
- Each client gets 5 subfolders: Contracts & Invoices, Project Documentation, Assets & Media, Reports & Analytics, Proposals & Upsells
- Each platform gets its own Client Tracker sheet (e.g., "Nexus — Client Tracker")
- Cross-platform ops sheets live in `_Operations/` folder

## Corporate vs. Operating Brand

- Legal docs (invoices, contracts, NDAs): header = "TAURUS AI CORP - FZCO" (License #68122, IFZA Dubai)
- Client-facing (marketing, SaaS, proposals): brand = "Nexus by Taurus AI" / "Q-Grid" / "BizFlow"
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
1. Which platform? (Nexus / Q-Grid / BizFlow / other)
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

## Deploy Pipeline

### Mater Maria Homes (Static Site)
- **Location**: `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria/`
- **Tech**: Next.js 16.1.6 + Tailwind v4 + static HTML fallback (`public/*.html`)
- **Vercel config**: `vercel.json` with rewrites (`/` → `/index-landing.html`), redirects (`/about` → `/about.html`), and aggressive asset caching
- **Static shadowing**: `public/invest.html` serves at `/invest.html`, shadowing any App Router `/invest` route
- **Active branch**: `feat/nexosync-to-nexus-rebrand` (auto-deploys to Vercel)
- **Asset versioning**: SVGs and images use `?v=3` query param to bust cache

### General Monorepo Deploy
- **Primary**: Vercel (frontend), scoped to subdirectory per project
- **Docker**: Oracle Cloud Free Tier for backend services (Hyperswitch, Lago, etc.)
- **Immutable**: BSV (Bitcoin SV) for tamper-proof document storage
- **CI**: GitHub Actions runs lint → test → build on every PR to `main`
