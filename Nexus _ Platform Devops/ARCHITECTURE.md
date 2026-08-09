# NeoSync™ — Orchestrated Intelligent Platform Architecture

> **TAURUS AI Corp.** | License #68122, IFZA Dubai
> Operating Brand: NeoVibe by Taurus AI
> Document: Architecture v1.0 — Open-Source First, Locally-Hosted Intelligence
> Date: 2026-05-16

---

## EXECUTIVE SUMMARY

NeoSync™ is a **novel, open-source-first social media management platform** that composes 27+ existing services, 8 local AI models, 356+ cloud models via OpenRouter, 26 open-source databases, and 12 MCP servers into a single orchestrated intelligent platform. Zero vendor lock-in. Privacy-first. PQC-secured.

**Core Innovation**: A three-tier AI routing system that intelligently dispatches every task to the optimal compute layer — local Ollama (free), OpenRouter cloud (pay-per-use), or Hugging Face inference (open models) — with automatic fallback chains.

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          NeoSync™ Intelligent Platform                           │
│                     TAURUS AI Corp. | Open-Source First                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                        PRESENTATION LAYER                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐  │   │
│  │  │  Dashboard  │ │  NLP Cmd    │ │  Analytics  │ │  Agent Control     │  │   │
│  │  │  React+Vite │ │  Interface  │ │  Grafana    │ │  Center            │  │   │
│  │  │  :3000      │ │  Panel      │ │  :3001      │ │  Panel             │  │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └────────┬───────────┘  │   │
│  └─────────┼───────────────┼───────────────┼─────────────────┼──────────────┘   │
│            │               │               │                 │                  │
│  ┌─────────┴───────────────┴───────────────┴─────────────────┴──────────────┐   │
│  │                        API GATEWAY LAYER                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │   │
│  │  │  FastAPI Gateway (:8000) — Auth, Routing, Rate Limiting, Validation │ │   │
│  │  │  ├── /api/auth          — JWT + OAuth2 (Meta/IG/FB)                │ │   │
│  │  │  ├── /api/campaigns     — Campaign CRUD (GridDB)                    │ │   │
│  │  │  ├── /api/nlp           — Command interpretation (3-tier AI)        │ │   │
│  │  │  ├── /api/meta          — Meta Business Suite Graph API v18.0       │ │   │
│  │  │  ├── /api/neovibe       — Instagram publishing/scheduling           │ │   │
│  │  │  ├── /api/agents        — Agent orchestration (5 frameworks)        │ │   │
│  │  │  ├── /api/content       — GenMedia generation (Imagen/Veo/Lyria)    │ │   │
│  │  │  ├── /api/analytics     — Campaign metrics (TimescaleDB+Qdrant)     │ │   │
│  │  │  └── /api/bizflow       — BizFlow workspace/client sync             │ │   │
│  │  └─────────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│            │                                                                    │
│  ┌─────────┴────────────────────────────────────────────────────────────────┐   │
│  │                    THREE-TIER AI ROUTING ENGINE                            │   │
│  │                                                                          │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐   │   │
│  │  │  TIER 1:     │    │  TIER 2:     │    │  TIER 3:                 │   │   │
│  │  │  LOCAL       │    │  CLOUD       │    │  OPEN MODELS             │   │   │
│  │  │  (FREE)      │    │  (PAID)      │    │  (HF INFERENCE)          │   │   │
│  │  │              │    │              │    │                          │   │   │
│  │  │  Ollama      │───▶│  OpenRouter  │───▶│  HuggingFace             │   │   │
│  │  │  :11434      │    │  API         │    │  Inference API           │   │   │
│  │  │              │    │              │    │                          │   │   │
│  │  │  Hermes-4-14B│    │  Claude-4.6  │    │  Llama-3.1-8B            │   │   │
│  │  │  Llama3      │    │  GPT-5.2     │    │  Mistral-7B              │   │   │
│  │  │  Qwen3-coder │    │  Gemini-2.5  │    │  BGE-M3 embeddings       │   │   │
│  │  │  Qwen2.5-7b  │    │  DeepSeek-v3 │    │  Qwen3-embedding-8b      │   │   │
│  │  │  + 4 cloud   │    │  + 350 more  │    │  + 100K+ HF models       │   │   │
│  │  └──────────────┘    └──────────────┘    └──────────────────────────┘   │   │
│  │                                                                          │   │
│  │  ROUTING LOGIC:                                                          │   │
│  │  1. Try local Ollama first (free, private, <2s latency)                 │   │
│  │  2. If local fails or task needs premium quality → OpenRouter           │   │
│  │  3. If OpenRouter rate-limited → Hugging Face Inference                 │   │
│  │  4. Auto-fallback with model arrays: [primary, fallback1, fallback2]    │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│            │                                                                    │
│  ┌─────────┴────────────────────────────────────────────────────────────────┐   │
│  │                    AGENT ORCHESTRATION LAYER (5 Frameworks)                │   │
│  │                                                                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │   │
│  │  │  ORCA CrewAI │ │  Hedera      │ │  Multi-Agent │ │  Swarm Spawner │  │   │
│  │  │  (Social     │ │  Orchestrator│ │  Pipeline    │ │  (Ephemeral    │  │   │
│  │  │  Media)      │ │  (Workflows) │ │  (DAG/Recon) │ │  Agents)       │  │   │
│  │  │              │ │              │ │              │ │                │  │   │
│  │  │  Conductor   │ │  Workflow    │ │  Scientist   │ │  Spawn/Execute │  │   │
│  │  │  Research    │ │  Engine      │ │  Research    │ │  /Die          │  │   │
│  │  │  Content     │ │  HITL Gates  │ │  Scraper     │ │  PQC Identity  │  │   │
│  │  │  Examiner    │ │  MCP Server  │ │  Killer      │ │  HCS Audit     │  │   │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └───────┬────────┘  │   │
│  └─────────┼────────────────┼────────────────┼─────────────────┼────────────┘   │
│            │                │                │                 │                │
│  ┌─────────┴────────────────┴────────────────┴─────────────────┴────────────┐   │
│  │                    DATA LAYER (6 Database Categories)                      │   │
│  │                                                                          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │   │
│  │  │  Primary   │ │  Vector    │ │  Time-     │ │  Cache + Search      │  │   │
│  │  │  Store     │ │  Search    │ │  Series    │ │                      │  │   │
│  │  │            │ │            │ │            │ │  Valkey (Redis-alt)  │  │   │
│  │  │  PostgreSQL│ │  Qdrant    │ │  Timescale │ │  Meilisearch         │  │   │
│  │  │  + pgvector│ │  (Rust)    │ │  DB        │ │  (typo-tolerant)     │  │   │
│  │  │            │ │            │ │            │ │                      │  │   │
│  │  │  Campaigns │ │  Semantic  │ │  Analytics │ │  Sessions + Search   │  │   │
│  │  │  Users     │ │  Matching  │ │  Metrics   │ │                      │  │   │
│  │  │  Assets    │ │  Audience  │ │  Events    │ │                      │  │   │
│  │  │  OAuth     │ │  Similarity│ │  KPIs      │ │                      │  │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └──────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│            │                                                                    │
│  ┌─────────┴────────────────────────────────────────────────────────────────┐   │
│  │                    EXTERNAL INTEGRATIONS                                   │   │
│  │                                                                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │   │
│  │  │  Meta/IG     │ │  BizFlow     │ │  GenMedia    │ │  Google        │  │   │
│  │  │  Graph API   │ │  tRPC API    │ │  MCP Servers │ │  Workspace     │  │   │
│  │  │  v18.0       │ │  :4000       │ │  (5 tools)   │ │  CLI Bridge    │  │   │
│  │  │              │ │              │ │              │ │                │  │   │
│  │  │  Publish     │ │  Clients     │ │  Imagen      │ │  Sheets/Docs   │  │   │
│  │  │  Schedule    │ │  Workspaces  │ │  Veo         │ │  Drive/Calendar│  │   │
│  │  │  Insights    │ │  Workflows   │ │  Chirp3      │ │  NotebookLM    │  │   │
│  │  │  Accounts    │ │  Analytics   │ │  Lyria       │ │  Pipelines     │  │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│            │                                                                    │
│  ┌─────────┴────────────────────────────────────────────────────────────────┐   │
│  │                    SECURITY & COMPLIANCE LAYER                             │   │
│  │                                                                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                     │   │
│  │  │  PQC         │ │  Heiro Chain │ │  Audit       │                     │   │
│  │  │  Encryption  │ │  (Blockchain)│ │  Logging     │                     │   │
│  │  │              │ │              │ │              │                     │   │
│  │  │  ML-DSA-65   │ │  HCS Topics  │ │  All actions │                     │   │
│  │  │  ML-KEM-768  │ │  Immutable   │ │  logged with │                     │   │
│  │  │  Sign/Verify │ │  Audit Trail │ │  timestamps  │                     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. THREE-TIER AI ROUTING ENGINE (Core Innovation)

### How It Works

Every NLP request, content generation task, or agent reasoning flows through the routing engine:

```python
# Three-tier routing logic (api/routing_engine.py)

class AIRoutingEngine:
    """Intelligent AI model router with automatic fallback"""
    
    ROUTING_TABLE = {
        # Task type → [primary, fallback1, fallback2, fallback3]
        "nlp_interpret": {
            "tier1_local": "ollama/hermes-4-14b",        # Free, private
            "tier2_cloud": "anthropic/claude-sonnet-4.6", # Best quality
            "tier3_open": "meta-llama/llama-3.1-8b",      # HF inference
        },
        "content_generation": {
            "tier1_local": "ollama/hermes-4-14b",
            "tier2_cloud": "openai/gpt-5.2",
            "tier3_open": "google/gemma-4-26b",
        },
        "bulk_content": {
            "tier1_local": "ollama/llama3",
            "tier2_cloud": "deepseek/deepseek-v3.2",      # 10x cheaper
            "tier3_open": "minimax/minimax-m2.5",
        },
        "code_generation": {
            "tier1_local": "ollama/qwen2.5-coder-7b",
            "tier2_cloud": "qwen/qwen3-coder",            # 1M context
            "tier3_open": "qwen/qwen3-coder:free",
        },
        "embeddings": {
            "tier1_local": "local-sentence-transformers",  # Via HF MCP
            "tier2_cloud": "qwen/qwen3-embedding-8b",     # $0.01/1M
            "tier3_open": "baai/bge-m3",                   # Multilingual
        },
        "image_analysis": {
            "tier1_local": "N/A",                          # No local vision
            "tier2_cloud": "google/gemini-2.5-flash",      # Best value
            "tier3_open": "nvidia/nemotron-nano-12b:free", # Free vision
        },
        "agent_orchestration": {
            "tier1_local": "ollama/deepseek-v3.1:671b-cloud",
            "tier2_cloud": "anthropic/claude-opus-4.7",
            "tier3_open": "google/gemini-2.5-pro",
        },
    }
    
    async def route(self, task_type: str, prompt: str, context: dict = None):
        """Route task through 3-tier system with automatic fallback"""
        routes = self.ROUTING_TABLE.get(task_type, {})
        
        # Tier 1: Try local Ollama first (free, private)
        try:
            return await self._call_ollama(routes["tier1_local"], prompt, context)
        except (ConnectionError, TimeoutError):
            pass
        
        # Tier 2: Fall back to OpenRouter cloud (pay-per-use)
        try:
            return await self._call_openrouter(routes["tier2_cloud"], prompt, context)
        except (RateLimitError, APIError):
            pass
        
        # Tier 3: Fall back to Hugging Face inference (open models)
        try:
            return await self._call_huggingface(routes["tier3_open"], prompt, context)
        except Exception as e:
            raise AIRoutingError(f"All tiers failed for {task_type}: {e}")
```

### Cost Optimization

| Task Type | Tier 1 (Local) | Tier 2 (Cloud) | Tier 3 (HF) | Savings vs Cloud-Only |
|-----------|---------------|----------------|-------------|----------------------|
| NLP Interpret | FREE | $3/M tokens | FREE | **70-90%** |
| Content Gen | FREE | $1.75-5/M | FREE | **60-85%** |
| Bulk Content | FREE | $0.21/M | FREE | **95%+** |
| Code Gen | FREE | $0.22/M | FREE | **80-95%** |
| Embeddings | FREE | $0.01/M | FREE | **99%+** |
| Image Analysis | N/A | $0.30/M | FREE | **50-100%** |
| Agent Orchestration | FREE | $5-25/M | $1.25/M | **60-90%** |

**Estimated monthly cost for 10K users**: $200-500 (vs $3,000-5,000 cloud-only)

---

## 3. LOCAL OLLAMA MODEL INVENTORY

| Model | Size | Purpose in NeoSync™ | Latency | Quality |
|-------|------|---------------------|---------|---------|
| **Hermes-4-14B (Q4_K_M)** | 9.0 GB | Primary local NLP, content generation, command interpretation | ~2-3s | ★★★★☆ |
| **llama3:latest** | 4.7 GB | Fast text classification, sentiment analysis, hashtag generation | ~1-2s | ★★★☆☆ |
| **qwen2.5-coder:7b** | 4.7 GB | Local code generation, workflow scripting, API integration | ~2-3s | ★★★★☆ |
| **qwen3-coder:480b-cloud** | Cloud | Premium code generation, complex agent orchestration | ~3-5s | ★★★★★ |
| **deepseek-v3.1:671b-cloud** | Cloud | Deep reasoning, campaign strategy, competitive analysis | ~5-8s | ★★★★★ |
| **kimi-k2.5:cloud** | Cloud | Long-context analysis (research reports, trend analysis) | ~5-8s | ★★★★☆ |
| **glm-5:cloud** | Cloud | Multi-modal content understanding | ~3-5s | ★★★★☆ |
| **minimax-m2.5:cloud** | Cloud | High-volume short-form content generation | ~1-2s | ★★★☆☆ |

**Total local model storage**: ~18.4 GB (fits on any modern MacBook)

---

## 4. OPENROUTER API MODEL INVENTORY (356+ Models)

### Primary Models for NeoSync™

| Category | Model | Context | Cost/1M tokens | Use Case |
|----------|-------|---------|----------------|----------|
| **NLP Commands** | `anthropic/claude-sonnet-4.6` | 1M | $3 in / $15 out | Best instruction-following, structured output |
| **Content Gen** | `openai/gpt-5.2` | 400K | $1.75 in / $14 out | High-quality social copy, brand voice |
| **Bulk Content** | `deepseek/deepseek-v3.2` | 131K | $0.25 in / $0.38 out | 10x cheaper, good for A/B variants |
| **Embeddings** | `qwen/qwen3-embedding-8b` | 32K | $0.01 | Semantic search, audience matching |
| **Vision** | `google/gemini-2.5-flash` | 1M | $0.30 in / $2.50 out | Image moderation, ad creative eval |
| **Code/Agents** | `qwen/qwen3-coder` | 1M | $0.22 in / $1.80 out | Agent orchestration, API integration |
| **Trending** | `perplexity/sonar` | 127K | $1 in / $1 out | Real-time web search for trends |
| **Free Tier** | `meta-llama/llama-3.3-70b:free` | 131K | FREE | Dev/testing, simple tasks |

### OpenRouter Features Leveraged
- **Model arrays**: `["claude-sonnet-4.6", "gpt-5.2", "gemini-2.5-flash"]` → auto-failover
- **Zero Completion Insurance**: Failed attempts cost nothing
- **Prompt caching**: Anthropic models cache repeated prompts
- **Streaming**: Real-time content generation with `stream: true`
- **OpenAI-compatible**: Drop-in replacement — same SDK, different base URL

---

## 5. OPEN-SOURCE DATABASE STACK

### Production Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NeoSync™ Data Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PostgreSQL 16 + pgvector + TimescaleDB (Primary Store)     │
│  ├── campaigns        — Campaign definitions, scheduling    │
│  ├── users            — Multi-tenant auth, roles, orgs      │
│  ├── assets           — Media assets, metadata, tags        │
│  ├── platform_accounts — OAuth tokens (Meta/IG/FB/LinkedIn) │
│  ├── approvals        — HITL approval workflow              │
│  ├── agent_sessions   — Agent state, memory, actions        │
│  ├── webhooks         — Webhook configs, delivery logs      │
│  └── embeddings       — pgvector: brand knowledge, RAG      │
│                                                              │
│  Qdrant (Vector Search)                                     │
│  ├── content_similarity — Find similar posts, campaigns     │
│  ├── audience_matching  — Semantic audience targeting       │
│  └── brand_safety       — Content policy compliance scoring │
│                                                              │
│  TimescaleDB (Time-Series Analytics)                        │
│  ├── engagement_metrics — Likes, shares, comments over time │
│  ├── campaign_performance — ROI, CTR, CPC trends            │
│  └── api_rate_tracking  — API usage, rate limit monitoring  │
│                                                              │
│  Valkey (Cache + Pub/Sub)                                   │
│  ├── session_cache    — User sessions, JWT blacklists       │
│  ├── response_cache   — API response caching                │
│  ├── pub/sub          — Real-time notifications, websockets │
│  └── rate_limiting    — Sliding window rate limits          │
│                                                              │
│  Meilisearch (Full-Text Search)                             │
│  ├── content_search   — Search posts, campaigns, assets     │
│  ├── hashtag_search   — Trending hashtags, topic discovery  │
│  └── audience_search  — Influencer discovery, audience match│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Resource Requirements

| Database | RAM | CPU | Disk | Integration |
|----------|-----|-----|------|-------------|
| PostgreSQL + pgvector + TimescaleDB | 2-4 GB | 2-4 cores | 20 GB | Easy |
| Qdrant | 1-2 GB | 2 cores | 5 GB | Easy |
| Valkey | 256 MB | 1 core | Optional | Easy |
| Meilisearch | 512 MB | 1 core | 5 GB | Easy |
| **Total** | **~4-7 GB** | **6-7 cores** | **~30 GB** | — |

---

## 6. AGENT ORCHESTRATION (5 Frameworks Composed)

### Agent Framework Mapping

| Framework | Source | Role in NeoSync™ | Agent Types |
|-----------|--------|-------------------|-------------|
| **ORCA (CrewAI)** | `HEDERA/social-media-orchestra/` | Primary social media orchestration | Conductor, Research, Content, Examiner |
| **Hedera Orchestrator** | `HEDERA/hedera-orchestrator/` | Workflow engine + HITL gates | 7 Hedera agents + subagents |
| **Multi-Agent Pipeline** | `HEDERA/multi_agent_pipeline/` | Research, recon, lead scoring | Scientist, Research, Scraper, Killer |
| **Swarm Spawner** | `HEDERA/swarm-spawner-skill/` | Ephemeral on-demand agents | PQC-certified, HCS-audited |
| **SAAS Orchestrator** | `TAURUS_AI_SAAS/packages/orchestrator/` | MCP gateway + memory | Lead-gen, Support, Spawner |

### Agent Task Routing

```
NLP Command → Router → Agent Framework Selection
    │
    ├── "Create Instagram campaign" → ORCA Content Crew
    ├── "Research trending topics" → Multi-Agent Pipeline (Research)
    ├── "Generate 5 A/B variants" → Swarm Spawner (5 ephemeral agents)
    ├── "Analyze competitor strategy" → Multi-Agent Pipeline (Killer)
    ├── "Schedule posts for next week" → Hedera Orchestrator (workflow)
    ├── "Find influencers in niche" → ORCA Research Crew
    ├── "Moderate this image" → Vision model → Examiner Crew
    └── "Generate ad creative" → GenMedia MCP (Imagen/Veo)
```

---

## 7. MCP SERVER ECOSYSTEM (12+ Servers)

| MCP Server | Purpose | Integration Point |
|------------|---------|-------------------|
| **Imagen MCP** | Image generation for ad creatives | `/api/content/image` |
| **Veo MCP** | Video generation for Reels/Stories | `/api/content/video` |
| **Chirp3 MCP** | Text-to-speech for audio posts | `/api/content/audio` |
| **Lyria MCP** | Music generation for branded audio | `/api/content/music` |
| **AVTool MCP** | A/V compositing, editing | `/api/content/composite` |
| **HuggingFace MCP** | NLP model access, embeddings | `/api/nlp/interpret` |
| **Firecrawl MCP** | Web scraping for trend research | `/api/research/trends` |
| **Playwright MCP** | Browser automation for testing | Internal QA |
| **GitHub MCP** | Code management, CI/CD | Internal devops |
| **Gmail MCP** | Email notifications, reports | `/api/notifications/email` |
| **Sheets MCP** | Report generation, CRM sync | `/api/reports/export` |
| **Calendar MCP** | Campaign scheduling | `/api/schedule` |

---

## 8. EXISTING ECOSYSTEM INTEGRATION MAP

### Direct Reuse (Tier 1 — Build on Top)

| Component | Source | NeoSync™ Usage |
|-----------|--------|----------------|
| **ORCA Backend** | `HEDERA/social-media-orchestra/backend/` | Campaign management, content generation, HITL approval |
| **ORCA Frontend** | `HEDERA/social-media-orchestra/frontend/` | Dashboard UI, approval workflow, campaign management |
| **Social Suite API** | `BizFlow-NeoVibe-Platform/social-suite-dashboard/api/` | NLP engine, Meta/IG endpoints, agent orchestration |
| **GenMedia MCP** | `HEDERA/gemini-integration/` | All visual/audio content generation |
| **BizFlow Prisma Schema** | `HEDERA/bizflow/prisma/schema.prisma` | Multi-tenant database schema |

### Adapt & Integrate (Tier 2)

| Component | Source | NeoSync™ Usage |
|-----------|--------|----------------|
| **Swarm Spawner** | `HEDERA/swarm-spawner-skill/` | On-demand content generation swarms |
| **GWS Bridge** | `HEDERA/gws-bridge/` | Google Workspace reports, scheduling |
| **Multi-Agent Pipeline** | `HEDERA/multi_agent_pipeline/` | Competitor analysis, trend detection |
| **OpsFlow Monitoring** | `HEDERA/OpsFlow.Taurusai.io/` | Grafana dashboards, Prometheus metrics |
| **NotebookLM** | CLI integration | Content research, trend reports |

### Reference Patterns (Tier 3)

| Component | Source | NeoSync™ Usage |
|-----------|--------|----------------|
| **Hedera Orchestrator** | `HEDERA/hedera-orchestrator/` | Workflow patterns, HITL gate design |
| **Q-Grid Platform** | `HEDERA/q-grid-platform/` | PQC security patterns, compliance |
| **Agency OS** | `BizFlow-NeoVibe-Platform/taurus-agency-os/` | Client management patterns |

---

## 9. DOCKER COMPOSE — UNIFIED STACK

```yaml
# NeoSync™ Unified Docker Compose
# All services in one stack — local development + production

services:
  # ── DATABASES ──
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: neosync
      POSTGRES_USER: neosync
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports: ["5432:5432"]
    command: >
      postgres
      -c shared_preload_libraries=timescaledb,pg_stat_statements
      -c max_connections=200

  qdrant:
    image: qdrant/qdrant
    volumes:
      - qdrant_data:/qdrant/storage
    ports: ["6333:6333", "6334:6334"]

  valkey:
    image: valkey/valkey:7
    volumes:
      - valkey_data:/data
    ports: ["6379:6379"]

  meilisearch:
    image: getmeili/meilisearch
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
    volumes:
      - meili_data:/meili_data
    ports: ["7700:7700"]

  # ── AI SERVICES ──
  ollama:
    image: ollama/ollama
    volumes:
      - ollama_models:/root/.ollama
    ports: ["11434:11434"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia  # GPU acceleration if available
              capabilities: [gpu]

  hf-mcp:
    image: ghcr.io/huggingface/mcp-server:latest
    environment:
      HF_TOKEN: ${HUGGINGFACE_API_KEY}
    ports: ["8002:8000"]

  # ── APPLICATION ──
  api:
    build: ./social-suite-dashboard/api
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - DATABASE_URL=postgresql://neosync:${POSTGRES_PASSWORD}@postgres:5432/neosync
      - QDRANT_URL=http://qdrant:6333
      - REDIS_URL=valkey://valkey:6379/0
      - MEILISEARCH_URL=http://meilisearch:7700
    ports: ["8000:8000"]
    depends_on: [postgres, qdrant, valkey, meilisearch, ollama]

  web:
    build: ./social-suite-dashboard/web
    ports: ["3000:3000"]
    depends_on: [api]

  # ── MONITORING ──
  grafana:
    image: grafana/grafana
    ports: ["3001:3000"]
    volumes:
      - grafana_data:/var/lib/grafana

  prometheus:
    image: prom/prometheus
    ports: ["9090:9090"]
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  postgres_data:
  qdrant_data:
  valkey_data:
  meili_data:
  ollama_models:
  grafana_data:
```

---

## 10. NOVEL ARCHITECTURE PATTERNS

### Pattern 1: Three-Tier AI Routing
**Problem**: Cloud AI is expensive, local AI is limited.
**Solution**: Intelligent routing that tries free local models first, falls back to cloud only when needed, with automatic failover across 3 tiers.
**Impact**: 70-95% cost reduction vs cloud-only.

### Pattern 2: Composable Agent Frameworks
**Problem**: No single agent framework handles all use cases.
**Solution**: 5 frameworks composed together — CrewAI for social media, Hedera for workflows, DAG pipeline for research, Swarm for ephemeral tasks, SAAS orchestrator for MCP.
**Impact**: Best tool for each job, no framework lock-in.

### Pattern 3: Multi-Model Database Stack
**Problem**: One database can't handle relational, vector, time-series, search, and cache.
**Solution**: 5 specialized databases (PostgreSQL+pgvector+TimescaleDB, Qdrant, Valkey, Meilisearch) each doing what it does best.
**Impact**: Optimal performance for each data type.

### Pattern 4: PQC-Secured Audit Trail
**Problem**: Social media actions need immutable, quantum-safe audit logs.
**Solution**: Every campaign action signed with ML-DSA-65, anchored to Heiro Chain (HCS) for immutable verification.
**Impact**: EU AI Act compliance, quantum-ready security.

### Pattern 5: MCP-First Integration
**Problem**: Integrating external services requires custom code for each.
**Solution**: 12 MCP servers providing standardized tool interfaces — image gen, web scraping, email, calendar, GitHub, etc.
**Impact**: Add new integrations by adding MCP servers, no code changes.

---

## 11. DEPLOYMENT TOPOLOGY

### Development (Local MacBook)
```
MacBook Pro (M-series, 32GB RAM)
├── Ollama (Hermes-14B + Llama3 + Qwen2.5-coder) — 18GB
├── Docker (PostgreSQL + Qdrant + Valkey + Meilisearch) — 6GB
├── FastAPI API + React Web — 1GB
└── Available RAM: ~7GB for other tasks
```

### Production (Cloud — Oracle Cloud Free Tier / AWS)
```
Oracle Cloud Free Tier (4 ARM CPUs, 24GB RAM, 200GB disk)
├── All databases (PostgreSQL + Qdrant + Valkey + Meilisearch)
├── FastAPI API + React Web (containerized)
├── Prometheus + Grafana monitoring
├── OpenRouter API calls (pay-per-use)
└── Hugging Face Inference (pay-per-use)

OR

AWS (t3.xlarge + RDS + ElastiCache)
├── ECS/Fargate for API + Web
├── RDS PostgreSQL + pgvector + TimescaleDB
├── ElastiCache (Valkey/Redis)
├── Qdrant on EC2
├── Meilisearch on EC2
└── CloudFront CDN + WAF
```

---

## 12. ESTIMATED COSTS

### Development (Local — FREE)
| Component | Cost |
|-----------|------|
| Ollama models | FREE (local compute) |
| Docker databases | FREE (local compute) |
| Application code | FREE |
| **Total** | **$0/month** |

### Production (Cloud — Lean)
| Component | Cost/Month |
|-----------|-----------|
| Oracle Cloud Free Tier | $0 |
| OpenRouter API (10K users) | $200-500 |
| Hugging Face Inference | $50-100 |
| Domain + SSL | $15 |
| **Total** | **$265-615/month** |

### Production (Cloud — Scale)
| Component | Cost/Month |
|-----------|-----------|
| AWS (t3.xlarge + RDS + ElastiCache) | $400-600 |
| OpenRouter API (100K users) | $2,000-5,000 |
| Hugging Face Inference | $200-500 |
| CloudFront + WAF | $100-200 |
| **Total** | **$2,700-6,300/month** |

---

## 13. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up unified Docker Compose stack
- [ ] Migrate Social Suite API to PostgreSQL + pgvector
- [ ] Integrate Three-Tier AI Routing Engine
- [ ] Connect Ollama local models
- [ ] Connect OpenRouter API
- [ ] Connect Hugging Face MCP

### Phase 2: Agent Orchestration (Weeks 3-4)
- [ ] Integrate ORCA CrewAI backend
- [ ] Connect Hedera Orchestrator for workflows
- [ ] Integrate Swarm Spawner for ephemeral agents
- [ ] Build agent task routing logic
- [ ] Connect Multi-Agent Pipeline for research

### Phase 3: Data Layer (Weeks 5-6)
- [ ] Set up Qdrant for vector search
- [ ] Set up TimescaleDB for analytics
- [ ] Set up Valkey for caching
- [ ] Set up Meilisearch for full-text search
- [ ] Build data synchronization between databases

### Phase 4: External Integrations (Weeks 7-8)
- [ ] Meta Business Suite OAuth2 + Graph API
- [ ] Instagram publishing/scheduling/insights
- [ ] BizFlow tRPC API connector
- [ ] GenMedia MCP servers (Imagen/Veo/Chirp3/Lyria)
- [ ] Google Workspace Bridge

### Phase 5: Frontend + UX (Weeks 9-10)
- [ ] Merge ORCA frontend with Social Suite dashboard
- [ ] Build NLP command interface
- [ ] Build analytics dashboard (Grafana integration)
- [ ] Build agent orchestration control panel
- [ ] Mobile responsive design

### Phase 6: Security + Compliance (Weeks 11-12)
- [ ] PQC encryption for sensitive data
- [ ] Heiro Chain audit trail integration
- [ ] JWT rotation + RBAC
- [ ] Rate limiting + input validation
- [ ] GDPR compliance features

### Phase 7: Testing + Launch (Weeks 13-15)
- [ ] End-to-end testing suite
- [ ] Load testing (100 concurrent users)
- [ ] Security audit
- [ ] Beta testing (10-20 external users)
- [ ] Soft launch → Full launch

---

## 14. KEY DIFFERENTIATORS

| Feature | NeoSync™ | Hootsuite | Buffer | Meta Business Suite |
|---------|----------|-----------|--------|---------------------|
| **NLP Commands** | ✅ Natural language | ❌ Manual UI | ❌ Manual UI | ❌ Manual UI |
| **AI Content Gen** | ✅ 3-tier AI routing | ❌ Basic | ❌ Basic | ❌ Basic |
| **Agent Orchestration** | ✅ 5 frameworks | ❌ None | ❌ None | ❌ None |
| **Open-Source** | ✅ Fully OSS | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary |
| **Local AI** | ✅ Ollama (free) | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only |
| **PQC Security** | ✅ ML-DSA-65 | ❌ None | ❌ None | ❌ None |
| **Blockchain Audit** | ✅ Heiro Chain | ❌ None | ❌ None | ❌ None |
| **Multi-Platform** | ✅ Meta/IG/BizFlow | ✅ Multiple | ✅ Multiple | ❌ Meta only |
| **Cost (10K users)** | **$265-615/mo** | $5,000+/mo | $3,000+/mo | Free (limited) |

---

*Generated: 2026-05-16 | TAURUS AI Corp. | NeoSync™ v1.0 Architecture*
*Open-Source First. Locally-Hosted Intelligence. PQC-Secured. Zero Vendor Lock-In.*
