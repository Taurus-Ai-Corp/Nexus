# PRD: NeoVibe Agentic RAG Orchestrator (NARO)

**Date:** 2026-04-24  
**Owner:** TAURUS AI Corp.  
**Model:** hy3-preview-free (opencode)  
**Status:** Draft v1.0

---

## Executive Summary

**Revenue-First Thesis:** Don't build "another exam prep tool." Build the **Agentic Content Engine** that generates certification-ready Qbanks from regulatory sources — then license it B2B to certification bodies globally.

**Why Now:** Claude Code built a solo `ingest.py` script. That's 2010s architecture. 2026 demands **agentic orchestration with persistent memory, recursive decomposition, and handoff contracts** — all open-source, all revenue-scalable.

**Market:** Global professional certification market = $24B (Kaplan $1.64B, UWorld $77M). Our SAM: Regulatory certification bodies needing automated content pipelines (OMVIC × 50+ global equivalents).

---

## Problem Statement

### What Claude Code Did (Baseline)
| Component | Status | Limitation |
|-----------|--------|-------------|
| `ingest.py` | ✅ Done | Solo script, no JS rendering (ontario.ca e-Laws fails) |
| `chunk_and_index.py` | ❌ TBD | No agent coordination |
| `generate_mcq.py` | ❌ TBD | No quality review loop |
| `app.py` (Gradio) | ❌ TBD | No multi-tenant B2B model |

### Core Problems
1. **Static ingestion fails on JS-rendered sites** (ontario.ca e-Laws is a SPA — 410 chars of noscript text)
2. **No agent-to-agent handoff** — solo scripts can't self-correct
3. **No persistent memory** — each run is stateless
4. **No revenue scaling** — built for one client, not licensable as platform

---

## Solution: Novel Agentic Orchestration (What Hy3/opencode Does Differently)

### Architecture: HEDERA DAG + OpenCode Tools + Agent Handoff

```
┌─────────────────────────────────────────────────────────────┐
│  NARO: NeoVibe Agentic RAG Orchestrator                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    handoff     ┌──────────────┐        │
│  │  IngestAgent │ ──────────▶ │  ChunkAgent   │        │
│  │  (Firecrawl  │  schemas    │  (RLM chunk)  │        │
│  │   Agent API)  │              │  recursive     │        │
│  └─────────────┘              └──────────────┘        │
│         │                           │                    │
│         │ handoff                   │ handoff           │
│         ▼                           ▼                    │
│  ┌─────────────┐              ┌──────────────┐        │
│  │  ExtractAgent │ ──────────▶ │  MCQGenAgent  │        │
│  │  (Playwright  │  schemas    │  (T5-Large    │        │
│  │   headless)   │              │   + review)    │        │
│  └─────────────┘              └──────────────┘        │
│         │                           │                    │
│         │ handoff                   │ handoff           │
│         ▼                           ▼                    │
│  ┌─────────────┐              ┌──────────────┐        │
│  │  ReviewAgent │ ◀────────── │  IndexAgent   │        │
│  │  (Human-in-   │  feedback    │  (FAISS +     │        │
│  │   loop)       │              │   BGE-M3)     │        │
│  └─────────────┘              └──────────────┘        │
│         │                                                   │
│         │ Memorix memory ↔ OpenMemory facts               │
│         ▼                                                   │
│  ┌─────────────┐              ┌──────────────┐        │
│  │  B2B API     │              │  Multi-tenant│        │
│  │  (Supabase)  │              │  Dashboard   │        │
│  └─────────────┘              └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Key Innovations (Hy3 + opencode tools)

#### 1. **RLM Recursive Sub-LLM for Massive Context**
- Claude Code: Loads 410-char SPA shell, fails
- Hy3: Use `rlm_rlm_auto_analyze` with `firecrawl_scrape` → `rlm_rlm_sub_query` to recursively decompose Ontario e-Laws (200K+ tokens) into digestible chunks, generate MCQs per chunk

#### 2. **Firecrawl Agent for Autonomous Research**
- Claude Code: Static `requests.get()` fails on JS sites
- Hy3: `firecrawl_firecrawl_agent` — autonomous browser agent navigates e-Laws, extracts full statute text, returns structured JSON

#### 3. **Memorix Persistent Memory Across Sessions**
- Claude Code: Stateless (no memory of previous ingestion runs)
- Hy3: `memorix_memorix_store` + `memorix_memorix_search_reasoning` — agents remember which URLs failed, which selectors work, which MCQ patterns pass review

#### 4. **HEDERA DAG Orchestration with Agent Handoff**
- Claude Code: Linear script execution
- Hy3: Reuse `HEDERA/multi_agent_pipeline/pipeline.py` DAG executor + `@taurus/agent-handoff` 14 schemas for typed inter-agent contracts

#### 5. **Supabase Multi-Tenant B2B Backend**
- Claude Code: Local FAISS index (single-user)
- Hy3: `supabase_*` tools → multi-tenant RAG with Row Level Security, publishable API keys for B2B licensing

---

## Revenue Model (B2B SaaS + Licensing)

### Tier 1: OMVIC (Proof of Concept) — $15K-25K
- Build working Qbank for OMVIC License Exam (MVDA 2002, CPA 2002, Code of Ethics)
- Deliver: Web app + 500 MCQs + analytics dashboard
- Timeline: 4 weeks

### Tier 2: Certification Body Pipeline License — $50K-150K/year per client
- License the NARO platform to other certification bodies (Real Estate, Insurance, Nursing, etc.)
- They bring: Their regulatory sources
- We provide: Agentic pipeline that auto-generates Qbanks from their docs
- Revenue: Setup fee + annual license + per-Q bank usage fee

### Tier 3: White-Label SaaS for Educators — $99-499/mo per institution
- Multi-tenant platform where educators upload docs → get Qbank
- Supabase RLS for tenant isolation
- API for LMS integration (Canvas, Blackboard, Moodle)

**Year 1 Projected Revenue:** $500K-1.2M (5-10 certification body clients)

---

## Functional Requirements

### FR-1: IngestAgent (Firecrawl Agent-based)
- **Tool:** `firecrawl_firecrawl_agent` with prompt: "Extract full text of Ontario e-Laws statute including all sections, subsections, and schedules"
- **Input:** URLs from `sources.json`
- **Output:** Structured JSON with section headings, paragraph text, definitions
- **Memory:** Store successful selectors in Memorix for reuse

### FR-2: ChunkAgent (RLM Recursive)
- **Tool:** `rlm_rlm_auto_analyze` with goal: "chunk regulatory text into semantic units suitable for MCQ generation"
- **Strategy:** Recursive decomposition — split 200K token statute into 5K chunks, process each with sub-LLM
- **Output:** Chunks with metadata (section, topic, difficulty hint)

### FR-3: MCQGenAgent (T5-Large + Review Loop)
- **Tool:** `rlm_rlm_sub_query` with prompt: "Generate 3 MCQs from this chunk following OMVIC exam pattern"
- **Schema:** Use `@taurus/agent-handoff` MCQ schema (question, options, correct_answer, explanation, source_section)
- **Quality gate:** ReviewAgent checks against source text, rejects low-quality MCQs

### FR-4: IndexAgent (Supabase Vector Store)
- **Tool:** `supabase_apply_migration` to create `embeddings` table with pgvector
- **Model:** BAAI/bge-m3 via `rlm_rlm_exec` Python for embeddings
- **Output:** Queryable vector store with metadata

### FR-5: ReviewAgent (Human-in-Loop)
- **Tool:** `memorix_memorix_store` for tracking MCQ quality decisions
- **Interface:** Gradio app with "Approve / Reject / Edit" workflow
- **Metrics:** Track acceptance rate, common rejection reasons

### FR-6: B2B API (Supabase + Edge Functions)
- **Tool:** `supabase_deploy_edge_function` for `/generate-qbank` endpoint
- **Auth:** `supabase_get_publishable_keys` for client API access
- **Multi-tenant:** Row Level Security per certification body

---

## Technical Stack (Open Source Integrated)

| Layer | Claude Code (Baseline) | Hy3/opencode (NARO) |
|-------|------------------------|----------------------|
| Ingestion | requests + BeautifulSoup (fails on JS) | Firecrawl Agent API (autonomous browser) |
| Chunking | semchunk (local) | RLM recursive sub-LLM (cloud-scale) |
| Embeddings | sentence-transformers (local) | Supabase pgvector (managed) |
| Index | FAISS (single-user) | Supabase + multi-tenant RLS |
| Orchestration | Linear Python script | HEDERA DAG + agent-handoff |
| Memory | None (stateless) | Memorix + OpenMemory facts |
| UI | Gradio (local) | Supabase Edge Functions + NeoVibe Next.js |
| B2B Model | None | API keys + usage-based billing |

---

## Implementation Plan (6 Sprints)

### Sprint 1: Foundation (Week 1) ✅ PARTIALLY DONE
- [x] Research phase (4 docs done)
- [ ] Set up Supabase project for NARO
- [ ] Create HEDERA DAG definition for OMVIC pipeline
- [ ] Configure agent-handoff schemas for MCQ generation

### Sprint 2: IngestAgent with Firecrawl (Week 2)
- [ ] Replace `ingest.py` with Firecrawl Agent calls
- [ ] Extract full text from all 7 OMVIC sources (including JS-rendered e-Laws)
- [ ] Store ingestion metadata in Memorix

### Sprint 3: Chunk + Index with RLM (Week 3)
- [ ] Implement ChunkAgent using `rlm_rlm_auto_analyze`
- [ ] Set up Supabase pgvector extension
- [ ] Create embeddings table via migration
- [ ] Index all chunks with BGE-M3 embeddings

### Sprint 4: MCQGenAgent + Review Loop (Week 4)
- [ ] Implement MCQGenAgent with T5-Large
- [ ] Add ReviewAgent human-in-loop Gradio interface
- [ ] Generate first 100 MCQs with quality review
- [ ] Store MCQ metadata in Supabase

### Sprint 5: B2B API + Multi-tenant (Week 5-6)
- [ ] Deploy Supabase Edge Functions for `/generate-qbank` endpoint
- [ ] Implement Row Level Security for multi-tenant isolation
- [ ] Create API key management for B2B clients
- [ ] Build usage tracking + billing integration

### Sprint 6: NeoVibe Frontend + Launch (Week 7-8)
- [ ] Build Next.js front-end with NeoVibe design system
- [ ] OMVIC-specific branded experience
- [ ] Analytics dashboard for MCQ performance
- [ ] Pilot with 10 real OMVIC candidates

---

## Success Metrics (Revenue-Focused)

| Metric | Target (3 months) | Target (12 months) |
|--------|-------------------|-------------------|
| OMVIC MCQs generated | 500 | 2,000 |
| MCQ acceptance rate (ReviewAgent) | 80% | 95% |
| B2B pilot clients (Tier 2) | 1 (OMVIC) | 5-10 |
| Monthly Recurring Revenue | $0 (pilot) | $25K-50K |
| API calls (Qbank generations) | 1,000 | 50,000 |
| Certification bodies in pipeline | 3 (prospects) | 20+ |

---

## Competitive Advantage (Why Us, Why Now)

### vs. Kaplan ($1.64B revenue)
- They use manual subject matter experts ($200-500/hour)
- We use agentic pipeline (cost: $0.50-2.00 per MCQ vs. their $50-100)
- **Margin advantage:** 50-100x cost reduction

### vs. Duolingo (Language cert)
- They focus on language exams
- We focus on professional certification (regulatory, legal, medical)
- **Market gap:** No automated content pipeline for regulatory exams

### vs. Open-source RAG tools (Haystack, RAGatouille)
- They provide components, not orchestration
- We provide **end-to-end DAG with agent handoff + persistent memory**
- **Moat:** 14 agent-handoff schemas + Memorix cross-session memory

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| e-Laws JS rendering still fails | Fallback to Ontario.ca API (if exists) or Playwright headless |
| MCQ quality too low | Human-in-loop review + fine-tune T5-Large on accepted MCQs |
| B2B clients want customization | Edge Functions support custom prompt templates per client |
| Supabase costs scale | Start with free tier, migrate to self-hosted Postgres if needed |

---

## Next Steps (Immediate)

1. **Create Supabase project** for NARO (multi-tenant backend)
2. **Define HEDERA DAG** for OMVIC pipeline (reuse `multi_agent_pipeline/pipeline.py`)
3. **Replace `ingest.py`** with Firecrawl Agent calls (solve JS rendering)
4. **Set up Memorix memory** for cross-session agent learning
5. **Build MCQGenAgent** with T5-Large + ReviewAgent loop

---

**Appendix: Tool Mapping (Hy3/opencode → NARO Components)**

| NARO Component | opencode Tool | HEDERA Component |
|---------------|---------------|-----------------|
| IngestAgent | `firecrawl_firecrawl_agent` | `agents/scraper.py` |
| ChunkAgent | `rlm_rlm_auto_analyze` | `pipeline.py` DAG node |
| MCQGenAgent | `rlm_rlm_sub_query` | `handoff_schemas.py` |
| ReviewAgent | `memorix_memorix_store` | `base_agents.py` Analyst |
| IndexAgent | `supabase_apply_migration` | `platform.py` |
| B2B API | `supabase_deploy_edge_function` | N/A (new) |
| Memory | `memorix_memorix_search` | `state.py` PipelineState |

---

**End of PRD v1.0**
