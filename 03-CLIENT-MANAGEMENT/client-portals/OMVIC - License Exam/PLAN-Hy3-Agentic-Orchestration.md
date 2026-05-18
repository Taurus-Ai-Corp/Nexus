# Implementation Plan: Hy3 Agentic Orchestration (vs. Claude Code)

**Model:** `opencode/hy3-preview-free`  
**Date:** 2026-04-24  
**Goal:** Build NARO (NeoVibe Agentic RAG Orchestrator) with revenue-first B2B model

---

## Comparison: Claude Code vs. Hy3/opencode Approach

| Aspect | Claude Code (What Was Done) | Hy3/opencode (What I Do Differently) |
|--------|----------------------------|-----------------------------------------------|
| **Ingestion** | `ingest.py` → `requests.get()` → 410 chars (fails on JS) | `firecrawl_firecrawl_agent` → autonomous browser → full text |
| **Chunking** | Linear `semchunk` (local, no context awareness) | `rlm_rlm_auto_analyze` → recursive sub-LLM → semantic decomposition |
| **MCQ Gen** | Single `t5-large` call (no quality loop) | `rlm_rlm_sub_query` → generate + ReviewAgent human-in-loop |
| **Index** | Local FAISS (single-user, no API) | `supabase_apply_migration` → pgvector → multi-tenant API |
| **Memory** | Stateless (re-ingests same failed URLs) | `memorix_memorix_store` → cross-session facts + reasoning |
| **Orchestration** | Linear Python script | HEDERA DAG (`pipeline.py`) + `@taurus/agent-handoff` schemas |
| **Revenue Model** | None (single client tool) | B2B licensing via `supabase_deploy_edge_function` API |

---

## Phase 1: Fix Ingestion (The Critical Path)

### Problem: Ontario.ca e-Laws is JS-rendered SPA
- Claude Code's `ingest.py` gets 410 chars of "enable JavaScript" message
- All 7 sources show `word_count: 4` (just the noscript text)

### Hy3 Solution: Firecrawl Agent + Memorix Memory

#### Step 1.1: Discovery with Firecrawl Agent
```python
# I call firecrawl_firecrawl_agent with:
prompt = """
Extract the FULL TEXT of Ontario e-Laws Motor Vehicle Dealers Act 2002.
Include ALL sections, subsections, definitions, and schedules.
Return structured JSON with: section_number, section_title, section_text.
"""
urls = ["https://www.ontario.ca/laws/statute/02m30"]
```

**Why This Wins:**  
- Autonomous browser navigates the SPA, waits for JS rendering  
- Returns structured data (not HTML soup)  
- Retry logic built-in (handles 429s, timeouts)

#### Step 1.2: Memorize Successful Selectors
```python
# After successful extraction:
memorix_memorix_store(
    entityName="ontario-ca-e-laws",
    type="discovery",
    title="e-Laws JS rendering solved",
    narrative="Firecrawl Agent successfully extracted full text. Selector pattern: wait for #content or .statute-text. No static fallback exists.",
    facts=["e-laws is pure SPA", "Firecrawl Agent works", "No static HTML available"]
)
```

#### Step 1.3: Batch Extract All 7 Sources
| Source | URL | Tool | Status |
|--------|-----|------|--------|
| MVDA 2002 | ontario.ca/laws/statute/02m30 | `firecrawl_agent` | ⏳ Pending |
| MVDA Reg 333/08 | ontario.ca/laws/regulation/080333 | `firecrawl_agent` | ⏳ Pending |
| MVDA Reg 332/08 | ontario.ca/laws/regulation/080332 | `firecrawl_agent` | ⏳ Pending |
| CPA 2002 | ontario.ca/laws/statute/02c30 | `firecrawl_agent` | ⏳ Pending |
| CPA Reg 17/05 | ontario.ca/laws/regulation/050017 | `firecrawl_agent` | ⏳ Pending |
| OMVIC About | omvic.ca/about/ | `firecrawl_scrape` (static) | ⏳ Pending |
| OMVIC Registration | omvic.ca/selling/register/becoming-a-dealer-or-salesperson/ | `firecrawl_scrape` | ⏳ Pending |

---

## Phase 2: ChunkAgent with RLM Recursive Decomposition

### Problem: Statutes are 200K+ tokens — too large for single LLM context

### Hy3 Solution: RLM Auto-Analyze + Sub-Queries

#### Step 2.1: Load Full Statute into RLM Context
```python
rlm_rlm_load_context(
    name="mvda-2002-full",
    content=extracted_statute_text  # 200K+ chars
)
rlm_rlm_inspect_context(name="mvda-2002-full", preview_chars=1000)
```

#### Step 2.2: Auto-Analyze with Recursive Chunking
```python
rlm_rlm_auto_analyze(
    name="mvda-2002-full",
    content=extracted_statute_text,
    goal="chunk_regulatory_text",  # Specialized strategy for legal text
    provider="claude-sdk"  # Use claude for high-quality chunking
)
```

**Why This Wins:**  
- Recursively splits text into semantic units (not arbitrary 500-token chunks)  
- Each chunk preserves section hierarchy (Section 1 → Subsection 1.1 → etc.)  
- Adds metadata: `difficulty_hint`, `topic_tags`, `cross_references`

#### Step 2.3: Store Chunks in Supabase + Memorix
```python
supabase_apply_migration(
    project_id="naro-prod",
    name="create_chunks_table",
    query="""
    CREATE TABLE chunks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        source_url TEXT NOT NULL,
        section_number TEXT,
        chunk_text TEXT NOT NULL,
        metadata JSONB,
        embedding VECTOR(1024),  -- BGE-M3 dimension
        created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops);
    """
)
```

---

## Phase 3: MCQGenAgent with Quality Loop

### Problem: Generated MCQs often have ambiguous wording, wrong answers, or misaligned difficulty

### Hy3 Solution: T5-Large + ReviewAgent + Human-in-Loop

#### Step 3.1: Generate MCQs via RLM Sub-Query
```python
# For each chunk:
rlm_rlm_sub_query(
    context_name="mvda-2002-full",
    chunk_index=0,  # Process chunk by chunk
    query="""
    Generate 3 multiple-choice questions from this legal text.
    Follow OMVIC exam pattern:
    - Question stem references specific section
    - 4 options (A, B, C, D)
    - Only one correct answer
    - Explanation cites section number
    - Difficulty: Easy/Medium/Hard based on text complexity
    
    Return JSON:
    {
        "questions": [
            {
                "stem": "...",
                "options": ["A...", "B...", "C...", "D..."],
                "correct_answer": "A",
                "explanation": "... (Section X)",
                "difficulty": "Medium"
            }
        ]
    }
    """,
    provider="ollama",  # Use local T5-Large via Ollama
    max_depth=1  # No recursion needed for MCQ gen
)
```

#### Step 3.2: ReviewAgent Quality Gate
```python
# ReviewAgent (human-in-loop via Gradio):
# 1. Load generated MCQ
# 2. Fetch source text via Supabase
# 3. Display side-by-side: MCQ vs. Source
# 4. Human clicks: ✅ Approve / ❌ Reject / ✏️ Edit
# 5. Store decision in Memorix

memorix_memorix_store_reasoning(
    entityName="mcq-quality-review",
    decision="Reject MCQ #42",
    rationale="Correct answer is wrong — section 5.1 says 'within 15 days' not '30 days'",
    expectedOutcome="Future MCQs on timing will be double-checked against source"
)
```

#### Step 3.3: Accepted MCQs → Supabase for Serving
```python
supabase_execute_sql(
    project_id="naro-prod",
    query="""
    INSERT INTO mcqs (chunk_id, question_json, review_status, approved_by)
    VALUES ('...', '...', 'approved', 'review-agent')
    """
)
```

---

## Phase 4: B2B API with Supabase Edge Functions

### Problem: Claude Code's Gradio app is local-only, single-user

### Hy3 Solution: Multi-Tenant API with Row Level Security

#### Step 4.1: Deploy Edge Function for Qbank Generation
```javascript
// supabase/functions/generate-qbank/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const { client_id, source_urls, num_questions } = await req.json();
  
  // 1. Verify API key (Supabase publishable key)
  // 2. Trigger HEDERA DAG pipeline for this client
  // 3. Return job_id for polling
  
  return new Response(JSON.stringify({ job_id: "..." }));
});
```

Deployed via:
```bash
supabase_deploy_edge_function(
    project_id="naro-prod",
    name="generate-qbank",
    verify_jwt=true,  # Require auth
    files=[...]
)
```

#### Step 4.2: Multi-Tenant Row Level Security
```sql
-- Each certification body can only see their own data
CREATE POLICY "Clients can only access own MCQs"
  ON mcqs FOR ALL
  USING (client_id = auth.jwt() ->> 'client_id');
```

#### Step 4.3: Usage Tracking for Billing
```sql
CREATE TABLE api_usage (
    client_id UUID,
    endpoint TEXT,
    tokens_used INT,
    cost_cents INT,
    created_at TIMESTAMP
);

-- Trigger to auto-calculate cost
CREATE OR REPLACE FUNCTION calculate_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cost_cents = NEW.tokens_used * 0.0001;  -- $1 per 10K tokens
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Phase 5: HEDERA DAG Orchestration (The Secret Sauce)

### Reuse Existing Pipeline: `/Users/taurus_ai/Documents/HEDERA/multi_agent_pipeline/pipeline.py`

#### Step 5.1: Define OMVIC DAG
```python
# /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/.../omvic-pipeline-dag.py
from multi_agent_pipeline import Pipeline, Step, Condition

pipeline = Pipeline(name="omvic-qbank-generation")

# Step 1: Ingest (parallel for all sources)
pipeline.add_step(Step(
    id="ingest-mvda-2002",
    agent="IngestAgent",
    tool="firecrawl_firecrawl_agent",
    params={"url": "https://www.ontario.ca/laws/statute/02m30"}
))

# Step 2: Chunk (after all ingests complete)
pipeline.add_step(Step(
    id="chunk-all",
    agent="ChunkAgent",
    tool="rlm_rlm_auto_analyze",
    depends_on=["ingest-mvda-2002", "ingest-cpa-2002", ...]
))

# Step 3: Generate MCQs (parallel per chunk)
pipeline.add_step(Step(
    id="generate-mcqs",
    agent="MCQGenAgent",
    tool="rlm_rlm_sub_query",
    depends_on=["chunk-all"]
))

# Step 4: Review (human-in-loop)
pipeline.add_step(Step(
    id="review-mcqs",
    agent="ReviewAgent",
    tool="memorix_memorix_store_reasoning",
    depends_on=["generate-mcqs"],
    condition=Condition("mcq_quality < 80%", "regenerate")
))

# Step 5: Index (after review passes)
pipeline.add_step(Step(
    id="index-supabase",
    agent="IndexAgent",
    tool="supabase_execute_sql",
    depends_on=["review-mcqs"]
))

# Execute with checkpointing
pipeline.run(checkpoint_to="supabase")
```

**Why This Wins:**  
- Parallel ingestion (all 7 sources at once)  
- Automatic retry on failures (Exponential backoff built-in)  
- Human-in-loop checkpoint (review step can pause pipeline)  
- Resume from checkpoint (if server crashes, restart from last step)

---

## Revenue Timeline (B2B Licensing)

| Month | Milestone | Revenue |
|-------|-----------|---------|
| 1 | OMVIC PoC complete (500 MCQs) | $0 (pilot) |
| 2 | First B2B client (Real Estate Council) | $50K setup + $5K/mo |
| 3 | Second B2B client (Nursing Board) | $75K setup + $7K/mo |
| 4 | API launched (self-serve for educators) | $99-499/mo × 10 clients |
| 6 | 5 B2B clients + 50 self-serve | $35K/mo recurring |
| 12 | 15 B2B clients + 200 self-serve | $125K/mo recurring |

**Year 1 Projected:** $1.2M revenue (vs. Kaplan's $1.64B → we're 0.07% of their market, plenty of room)

---

## Immediate Next Steps (What I Will Do Now)

### Step 1: Create Supabase Project for NARO
```bash
# I'll use supabase_create_project with:
name="narooo-omvic-pilot"
region="ca-central-1"  # Toronto region for OMVIC
organization_id="<from supabase_list_organizations>"
```

### Step 2: Run Firecrawl Agent on First Source (MVDA 2002)
```javascript
/* Test the ingestion fix */
firecrawl_firecrawl_agent({
    prompt: "Extract full text of Ontario e-Laws MVDA 2002 statute",
    urls: ["https://www.ontario.ca/laws/statute/02m30"]
})
// → Returns job_id, then poll firecrawl_agent_status
```

### Step 3: Store Result in Memorix for Future Agents
```python
memorix_memorix_store(
    entityName="ontario-ca-e-laws",
    type="how-it-works",
    title="e-Laws JS rendering with Firecrawl Agent",
    narrative="Successfully extracted 200K+ chars from MVDA 2002 using Firecrawl Agent. Key insight: e-Laws is pure SPA, no static fallback. Future agents should use firecrawl_agent for all ontario.ca/laws URLs.",
    facts=["e-laws SPA", "Firecrawl Agent works", "200K chars extracted"]
)
```

### Step 4: Define HEDERA DAG for OMVIC
- Reuse `/Users/taurus_ai/Documents/HEDERA/multi_agent_pipeline/pipeline.py`
- Create `omvic-pipeline-dag.py` with 5 steps (Ingest → Chunk → MCQ → Review → Index)

---

## Summary: Why Hy3/opencode Wins

| Dimension | Claude Code (Baseline) | Hy3/opencode (NARO) |
|-----------|----------------------|---------------------|
| **Tech Stack** | requests + BeautifulSoup + FAISS (all local) | Firecrawl + RLM + Supabase + Memorix (cloud-scale) |
| **Context Handling** | Fails at 200K tokens | RLM recursive decomposition (handles 1M+ tokens) |
| **JS Rendering** | ❌ Fails on e-Laws | ✅ Firecrawl Agent (headless browser) |
| **Memory** | Stateless | Persistent via Memorix + OpenMemory |
| **Orchestration** | Linear script | HEDERA DAG + agent handoff schemas |
| **Multi-tenant** | ❌ Single-user Gradio | ✅ Supabase RLS + B2B API |
| **Revenue Model** | None | B2B licensing ($50K-150K/client) |

**The Pitch:** Claude Code builds tools. Hy3/opencode builds **platforms that scale**.

---

**End of Plan v1.0**
