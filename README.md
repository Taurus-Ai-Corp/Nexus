# NeoSync™ — Social Suite Dashboard

> **TAURUS AI CORP - FZCO** | License #68122, IFZA Dubai
> Operating Brand: NeoVibe by Taurus AI

A comprehensive social media management platform for employees to manage Meta Business Suite, Instagram, BizFlow, and NeoVibe campaigns via natural language commands. Built with open-source models (Ollama) and Hugging Face for cost-effective, privacy-first AI.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NeoSync™ Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Web    │  │   API    │  │   NLP    │  │  HF MCP    │  │
│  │React:Vite│◄─┤FastAPI:8K│◄─┤Node:8001 │  │  Proxy:8K2 │  │
│  │  Vercel  │  │  Render  │  │          │  │            │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────────┘  │
│       │              │              │                        │
│  ┌────┴──────────────┴──────────────┴────────────────────┐  │
│  │              Service Mesh (Internal)                    │  │
│  └────┬──────────────┬──────────────┬────────────────────┘  │
│       │              │              │                        │
│  ┌────┴─────┐  ┌─────┴──────┐  ┌───┴───────┐               │
│  │PostgreSQL│  │   Redis    │  │  External  │               │
│  │  :5432   │  │   :6379    │  │  APIs      │               │
│  │+pgvector │  │            │  │            │               │
│  └──────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite + Framer Motion | Luxury dual-theme dashboard UI |
| Backend | FastAPI (Python 3.11) | REST API, Auth, Orchestration |
| Database | PostgreSQL 17 + pgvector | Relational + vector embeddings |
| Cache | Redis 7 | Session cache, WebSocket pub/sub |
| NLP Engine | Ollama (qwen3-coder, llama3.2) | Local LLM for command interpretation |
| AI Models | Hugging Face Inference API | Fallback NLP, embeddings |
| AI Routing | OpenRouter (Claude, GPT, etc.) | Cloud AI fallback tier |
| Payments | Stripe Checkout | Subscription billing |
| Social APIs | Meta Graph API v18.0 | Facebook Ads, Instagram publishing |
| MCP | Hugging Face MCP Server | Model access, knowledge retrieval |
| Blockchain | Heiro Chain | Transaction audit trails |

## Quick Start

### Prerequisites

- PostgreSQL 17 with `pgvector` extension
- Ollama running locally (`ollama pull qwen3-coder:latest && ollama pull llama3.2:latest`)
- Meta Business Suite developer account (for Instagram/Facebook API access)
- Python 3.11+ and Node.js 18+

### 1. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. Start PostgreSQL

```bash
# Ensure PostgreSQL is running with pgvector extension
# Migrations will auto-apply on API startup
```

### 3. Start API

```bash
cd social-suite-dashboard/api
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Start Web

```bash
cd social-suite-dashboard/web
npm install
npm run dev
```

### 5. Access the Dashboard

- **Web UI**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

### Default Login

- Email: `employee@taurusai.io`
- Password: `employee123`

- Email: `admin@taurusai.io`
- Password: `admin123`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/meta/authorize` | Get Meta OAuth URL |
| GET | `/api/auth/meta/callback` | Meta OAuth callback |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/{id}` | Get campaign by ID |
| PATCH | `/api/campaigns/{id}` | Update campaign |
| POST | `/api/campaigns/{id}/pause` | Pause campaign |
| POST | `/api/campaigns/{id}/resume` | Resume campaign |

### NLP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/nlp/interpret` | Interpret command (rule-based) |
| POST | `/api/nlp/iterate` | Interpret command (Ollama LLM) |

### Meta Business Suite
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meta/accounts` | Get linked FB/IG accounts |
| POST | `/api/meta/instagram/publish` | Publish IG post |
| POST | `/api/meta/instagram/schedule` | Schedule IG post |
| GET | `/api/meta/instagram/insights` | Get IG analytics |
| GET | `/api/meta/instagram/scheduled` | List scheduled posts |

### BizFlow
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bizflow/meta-campaigns` | Create Meta campaign |
| GET | `/api/bizflow/meta-campaigns` | List Meta campaigns |
| GET | `/api/bizflow/clients` | List BizFlow clients |
| POST | `/api/bizflow/workspaces` | Create workspace |

### NeoVibe
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/neovibe/instagram-campaigns` | Create IG campaign |
| GET | `/api/neovibe/instagram-campaigns` | List IG campaigns |
| GET | `/api/neovibe/analytics` | Get NeoVibe analytics |

### Agent Orchestration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agents/orchestrate` | Orchestrate BizFlow/NeoVibe agents |
| POST | `/api/agents/claude-code` | Trigger Claude Code agent |
| POST | `/api/agents/opencode` | Trigger OpenCode agent |

## NLP Command Examples

```bash
# Create Instagram campaign
curl -X POST http://localhost:8000/api/nlp/interpret \
  -H "Content-Type: application/json" \
  -d '{"text":"Create an Instagram story ad for NeoVibe targeting Detroit females 25-40 with $30/day budget"}'

# Create Meta lead-gen campaign
curl -X POST http://localhost:8000/api/nlp/interpret \
  -H "Content-Type: application/json" \
  -d '{"text":"Run a lead-gen ad for cafés in Windsor with $25/day"}'

# Use Ollama for smarter interpretation
curl -X POST http://localhost:8000/api/nlp/iterate \
  -H "Content-Type: application/json" \
  -d '{"text":"Pause campaign 3 and show me analytics for the last week"}'

# Orchestrate an agent
curl -X POST http://localhost:8000/api/nlp/interpret \
  -H "Content-Type: application/json" \
  -d '{"text":"Run NeoVibe content agent to create 5 posts about PQC migration"}'
```

## Project Structure

```
NeoSync™ _ Platform Devops/
├── .env.example                  # Master environment config template
├── docker-compose.yml            # Docker orchestration (optional)
├── .scout-report.md              # Competitive intelligence report
├── social-suite-dashboard/
│   ├── api/                      # FastAPI backend
│   │   ├── main.py               # Main API (800+ lines, all endpoints)
│   │   ├── database.py           # PostgreSQL client (asyncpg)
│   │   ├── routing_engine.py     # 3-tier AI routing (Ollama→OpenRouter→HF)
│   │   ├── enhanced_nlp_engine.py # Rule-based NLP interpreter
│   │   ├── migrations/           # SQL migrations (auto-applied on startup)
│   │   │   └── 001_initial_schema.sql
│   │   ├── requirements.txt      # Python dependencies
│   │   └── Dockerfile
│   ├── web/                      # React frontend (Vercel deployed)
│   │   ├── src/
│   │   │   ├── App.jsx           # React Router + auth guards
│   │   │   ├── AuthContext.jsx   # JWT auth with mock fallback
│   │   │   ├── ThemeContext.jsx  # Dual theme (navy-black / warm cream)
│   │   │   ├── pages/
│   │   │   │   ├── LandingPage.jsx        # Marketing site + pricing
│   │   │   │   ├── DashboardPage.jsx      # Main dashboard
│   │   │   │   ├── LoginPage.jsx          # Auth with demo fallback
│   │   │   │   ├── MetaCampaignPage.jsx   # Meta Ads campaign CRUD
│   │   │   │   ├── BestTimeToPost.jsx     # Lead magnet tool
│   │   │   │   ├── TermsPage.jsx          # UAE/IFZA compliant ToS
│   │   │   │   └── PrivacyPage.jsx        # Privacy + Cookie Policy
│   │   │   └── components/
│   │   │       ├── luxury/         # GlowCard, MetallicButton, glass panels
│   │   │       ├── platforms/      # BizFlow, NeoVibe, Meta, IG panels
│   │   │       ├── NLPCommandPanel.jsx
│   │   │       └── DashboardOverview.jsx
│   │   ├── index.html            # OG/Twitter meta, PostHog, JSON-LD
│   │   ├── vercel.json           # SPA rewrites + security headers + CSP
│   │   └── package.json
│   └── nlp/                      # NLP service (Ollama + HF fallback)
│       ├── index.js
│       └── package.json
```

## PostgreSQL Integration

PostgreSQL 17 with `pgvector` replaces GridDB as the primary database. The `database.py` module handles:

- Connection pooling via `asyncpg`
- CRUD operations for all entities (users, campaigns, assets, analytics, agent sessions)
- Time-series data support for analytics_events
- JSONB fields for targeting/creatives metadata
- Vector similarity search via pgvector (content embeddings)
- Auto-migration on startup (SQL files in `api/migrations/`)

Schema is auto-initialized from `api/migrations/001_initial_schema.sql` on API startup.

## Branding Guidelines

- **Legal/Corporate**: TAURUS AI CORP - FZCO (License #68122, IFZA Dubai)
- **Client-facing**: NeoVibe by Taurus AI / NeoSync™
- **Never mix** legal entity name with client-facing branding

## Development

```bash
# Run API locally
cd social-suite-dashboard/api
pip install -r requirements.txt
uvicorn main:app --reload

# Run NLP locally
cd social-suite-dashboard/nlp
npm install
node index.js

# Run Web locally
cd social-suite-dashboard/web
npm install
npm run dev
```

## License

© 2026 TAURUS AI CORP - FZCO. All rights reserved.
