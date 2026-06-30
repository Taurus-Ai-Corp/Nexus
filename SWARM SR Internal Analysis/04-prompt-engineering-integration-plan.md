# CL4R1T4S Prompt-Engineering Integration Plan

**Source repo:** `elder-plinius-CL4R1T4S` — extracted system prompts from Anthropic, OpenAI, xAI, Cursor, Windsurf, Devin, Manus, Replit, Vercel v0, Perplexity, etc.  
**Target ecosystem:** Taurus AI Corp — Nexus-Platform, Q-Grid, social-media-orchestra, multi_agent_pipeline, hedera-orchestrator, @taurus/agent-handoff, bizflow, OpsFlow.  
**Goal:** Re-use the scaffolding patterns found in the leaks to make Taurus prompts more controllable, safer, and product-grade.

---

## 1. Executive Summary

The leaked prompts are not secrets to copy verbatim; they are a catalogue of production-grade prompt-engineering controls:

| Pattern family | What it controls | Taurus value |
|---|---|---|
| XML / tagged policy blocks | Precedence, safety, refusals | Hard-stop rules in client-facing SaaS |
| Embedded tool schemas | Function-call discipline | Reliable agent orchestration |
| Persona + mode primitives | Tone, length, reasoning depth | Social-suite NLP + ad-copy quality |
| Memory / skill / AGENTS.md context | Long-horizon consistency | Reasoning-swarm handoff + devops context |
| Self-check + citation rules | Copyright & IP compliance | Client-facing AI products |
| Planner-todo-event-loop | Multi-step task decomposition | Swarm orchestrator + launch ops |

This document maps each pattern to a concrete Taurus project or workflow and provides implementation notes and risk mitigations.

---

## 2. Reusable Pattern Catalogue

### 2.1 Hierarchical policy blocks (XML tags, section precedence)

**Seen in:** Grok 4.1 `<policy>`, Manus `<planner_module>`, `<coding_rules>`, etc.

**How it works:**
- Highest-priority instructions live inside explicit XML/policy tags and are stated to override later user messages.
- Section headers make the prompt self-documenting for evals and red-teaming.

**Taurus integrations:**

**(c) Client-facing AI products / copyright & safety hardening**  
Create a single `nexus-safety-policy.md` prompt fragment and prepend it to every public-facing model invocation:

```xml
<safety_policy priority="highest">
  - Do not reproduce lyrics, poems, or substantial copyrighted passages.
  - Max direct quote per source: 15 words; one quote per source; then paraphrase.
  - For legal/financial/health questions: provide factual context only; never give personalized advice.
  - For child-safety or exploitation cues: refuse, state the principle, do not narrate detection mechanics.
</safety_policy>
```

Attach this to `Q-Grid.in`, `bizflow` chat surfaces, and any client portal.  
Implementation: store the fragment in a secrets-safe prompt registry (e.g., a small Git submodule or encrypted S3/Vault path) and log a hash of the active policy per request for audit.

**(b) Reasoning-swarm orchestrator**  
Use `<handoff_policy>` tags in `@taurus/agent-handoff` to specify that safety/copyright blocks travel with the message when one agent passes state to another.  Prevents a downstream worker from being "prompt-injected" out of policy.

---

### 2.2 Mode primitives (Explanatory / Formal / Concise / Planning / Standard)

**Seen in:** Anthropic `UserStyle_Modes.md`, Devin planning vs standard mode.

**How it works:**
- A short mode directive switches output length, structure, and tone without rewriting the entire prompt.
- Modes are stateful across the conversation unless the user explicitly overrides them.

**Taurus integrations:**

**(a) Social-suite NLP engine** (`social-media-orchestra`, `opsflow-roaster`)  
Add a `tone_mode` enum to every content-generation request:

- `roast` → punchy, irreverent, one-liner friendly
- `corporate` → Formal Mode (clear sections, full sentences, stakeholder-safe)
- `explainer` → Explanatory Mode (teacher-like, examples, step-by-step)
- `concise` → Concise Mode (minimal preamble, key info only, still complete)

Map the mode into the system prompt before the user task.  This reduces prompt length per request and gives the social-suite a controlled voice palette.

**(d) Ad copy / creative briefs** (`OpsFlow.Taurusai.io`, `bizflow` creative module)  
Use `concise` for ad headlines, `explainer` for landing-page body, and `formal` for creative briefs sent to enterprise clients.  
Add a guard: if the user asks for "more detail" repeatedly, the engine can reply that it is currently in `concise` mode and offer an override — matching the Anthropic behavior exactly.

---

### 2.3 Tool schemas embedded in the system prompt

**Seen in:** Claude Fable 5, Cursor, Windsurf, Grok 4, Codex, Manus.

**How it works:**
- Full JSON schemas for every available tool are pasted into the system prompt.
- Strict rules follow: never call tools not listed, never reveal tool names to users, batch independent calls.

**Taurus integrations:**

**(b) Reasoning-swarm orchestrator**  
In `multi_agent_pipeline` and `hedera-orchestrator`, generate a dynamic "tools manifest" at runtime:

```json
{
  "agent_id": "scraper-agent-7",
  "available_tools": [
    {"name": "webclaw", "schema": "..."},
    {"name": "firecrawl", "schema": "..."},
    {"name": "browser-use", "schema": "..."}
  ],
  "rules": [
    "Default browser interaction tool: browser-use",
    "For deterministic flows with known selectors: Playwright direct",
    "Never expose secrets in tool arguments"
  ]
}
```

This makes each swarm agent aware of only the tools it is authorized to use, and it lets us A/B test tool descriptions to improve function-call accuracy.

**(a) Social-suite NLP engine**  
Embed tools for `post_scheduling`, `sentiment_search`, `image_search`, `render_thread` inside the social-media-orchestra system prompt.  Add the rule "never reveal tool names to the user" so the assistant sounds organic.

---

### 2.4 Memory / skill / AGENTS.md contextual routing

**Seen in:** Claude Fable 5 `available_skills`, Windsurf `create_memory`, Codex `AGENTS.md`, Manus Knowledge/Planner modules.

**How it works:**
- Skills are named, versioned markdown files the model must read before acting on a related task.
- Memories are created proactively, with tags and workspace scopes.
- `AGENTS.md` files give repo-local conventions precedence over generic instructions.

**Taurus integrations:**

**(b) Reasoning-swarm + devops context**  
Adopt the `AGENTS.md` pattern across all Taurus repos:
- `~/.cursorrules` already exists; mirror it as `AGENTS.md` at repo roots so non-Cursor agents (Devin-style, Manus-style) inherit the same rules.
- Add a `skills/` folder per repo with `SKILL.md` files for recurring tasks: `pptx`, `xlsx`, `frontend-design`, `docx`, `pdf`, `compliance-check`, `heiro-tx`.
- Before any file-creation or code-generation step, the orchestrator should read the relevant `SKILL.md` and the nearest `AGENTS.md`.

**(a) Social-suite NLP engine**  
Use the memory pattern to remember brand voice, client preferences, and platform constraints:
- `create_memory` on first client onboarding: tone, forbidden topics, emoji policy, hashtag style.
- Tag each memory with `client_id` + `platform` so the engine retrieves only relevant ones.

**(d) Creative briefs**  
When a creative brief is generated, save key facts as memories (e.g., target persona, campaign objective, mandatory phrases).  On the next generation for the same client, prepend retrieved memories to the prompt.  This gives consistent brand voice across sprints.

---

### 2.5 Copyright & citation self-checks

**Seen in:** Claude Fable 5 `CRITICAL_COPYRIGHT_COMPLIANCE`, Codex citations.

**How it works:**
- Hard numeric limits: 15+ words from a single source is a severe violation; one quote per source maximum.
- Self-check questions before using any source text.
- Citation format enforced (e.g., `F:file_path†Lstart-Lend`).

**Taurus integrations:**

**(c) Hardening client-facing AI products**  
Build a post-processor (`copyright-guard`) that runs on every generated response:
1. Detect near-verbatim matches against a cache of ingested web/search source text.
2. If a 15+ word contiguous match is found, rewrite the sentence as paraphrase and flag the source as "closed for quotation."
3. If the model used web search, require citation tags; reject outputs that cite without tags.

Deploy this for `bizflow` RAG answers, `Q-Grid` research summaries, and `social-media-orchestra` posts that include quoted facts.

**(d) Ad copy / creative briefs**  
Ad copy often borrows competitor language.  Add a pre-flight rule:
- Do not reproduce slogans, taglines, or distinctive short phrases from search results.
- If referencing a competitor claim, paraphrase and cite.

---

### 2.6 Refusal escalation & child-safety framing

**Seen in:** Claude Fable 5 `critical_child_safety_instructions`, `refusal_handling`.

**How it works:**
- Refuse by stating the principle, not the detection mechanics.
- Once a refusal occurs for child-safety reasons, treat subsequent requests in the same conversation with extreme caution.
- Avoid "reframing to make it appropriate" — that is the signal to refuse.

**Taurus integrations:**

**(c) Client-facing AI products**  
Standardize refusal templates across all public Taurus surfaces:
- "I can't help with that because it could involve [principle]. I'm happy to help with [safe alternative]."
- Log refusal category and conversation ID for safety review, but do not log the exact trigger phrase.

For `Q-Grid` (finance/KYC) and `Gridera (Comply)` this is especially important: personalized legal/regulatory advice should be declined with the same principle-first language.

---

### 2.7 Planner-todo-event loop

**Seen in:** Manus `<planner_module>`, `<todo_rules>`, `<agent_loop>`.

**How it works:**
- Planner emits numbered pseudocode steps.
- Agent creates `todo.md`, updates checkboxes after each step, and iterates one tool call at a time.
- Knowledge and Datasource modules provide scoped best practices via the event stream.

**Taurus integrations:**

**(b) Reasoning-swarm orchestrator**  
Extend `multi_agent_pipeline` with a `PlannerAgent` and `KnowledgeAgent`:
- `PlannerAgent` breaks a task into numbered steps and publishes to a shared state store.
- Each worker reads the plan, claims the next open step, and appends a progress event.
- `KnowledgeAgent` injects repo-specific best practices (from `AGENTS.md` / `SKILL.md`) when conditions match.

This maps directly onto the existing ScientistAgent → ResearchAgent → ScraperAgent → KillerAgent pipeline in `opsflow-recon`; add a planner module on top and a persistent `todo.md` artifact.

**(d) Creative briefs / ad copy**  
For a campaign request, the planner can produce steps such as:
1. Research competitor messaging.
2. Draft 3 positioning angles.
3. Generate copy variants per angle.
4. Run copyright/safety guard.
5. Compile brief + variants into Google Slides / docx.

Each step is tracked and retriable, making the workflow auditable for client delivery.

---

### 2.8 Output-format routing (artifacts vs inline vs files)

**Seen in:** Claude Fable 5 `file_creation_advice`, `artifact_usage_criteria`, `tone_and_formatting`.

**How it works:**
- Short conversational answers stay inline; standalone artifacts (blog posts, code >20 lines, reports) become files.
- Prose by default; lists/bullets only when asked or needed for clarity.
- Specific file types for specific deliverables (`.md`, `.html`, `.pptx`, `.docx`, `.xlsx`).

**Taurus integrations:**

**(d) Ad copy / creative briefs**  
Build a `deliverable_router` module:
- "write a tweet thread" → inline text (or render component) but no file.
- "write a campaign brief" → create `.docx` or `.md` in the client Drive folder.
- "make a landing page" → create `.html` / React artifact with preview.
- "build a creative deck" → create `.pptx`.

Connect to the Nexus GWS bridge so the router knows the client's Drive folder and the correct tracker sheet.

**(a) Social-suite NLP engine**  
Use the "prose by default" rule to prevent over-formatted LinkedIn posts that read like bullet lists.  If the user explicitly asks for a thread, switch to list-friendly output.

---

### 2.9 Connector / MCP opt-in pattern

**Seen in:** Claude Fable 5 `mcp_app_suggestions`.

**How it works:**
- Third-party tools (MCP apps) must be surfaced through a `suggest_connectors` step; the model cannot silently choose a provider for the user.
- Only call a connector directly when the user named it, just chose it, or has a durable preference.

**Taurus integrations:**

**(a) + (d) Social suite & creative workflows**  
When a user asks "schedule this post" or "find stock images," the assistant should:
1. Check connected integrations (Buffer, Hootsuite, Unsplash, Google Drive, NotebookLM).
2. If not connected and the user didn't name one, suggest connectors and wait.
3. If connected, call directly.

This avoids surprising users with unintended vendor choices and fits the Nexus client-workspace protocol (ask platform, industry, engagement type before acting).

---

### 2.10 Long-conversation reminders / instruction drift protection

**Seen in:** Claude Fable 5 `long_conversation_reminder`.

**How it works:**
- A lightweight reminder is appended by the system when a classifier fires, helping the model re-anchor on critical instructions without re-sending the full prompt.

**Taurus integrations:**

**(b) Reasoning-swarm orchestrator**  
In long agent runs (e.g., `opsflow-recon`), inject periodic "policy reminder" messages into the worker's context:
- "Remember: never expose secrets, default to `browser-use` for browser actions, cite all web sources."
- Keep reminders short to avoid token bloat; trigger based on turn count or task phase transitions.

**(a) Social-suite NLP engine**  
After 10+ back-and-forth edits to a campaign, remind the agent of the original brand voice and client constraints before it diverges.

---

### 2.11 Persona preamble + identity guardrails

**Seen in:** Claude Fable 5 identity preamble, ChatGPT "You are ChatGPT", Grok "You are Grok 4".

**How it works:**
- The model is named and attributed to a creator at the top of the prompt.
- Product-information boundaries are clearly stated (what it can say about products/pricing, what it must look up).

**Taurus integrations:**

**(a) Social-suite NLP engine**  
Give each client-facing assistant a consistent identity:

```
You are Nexus Assistant, built by Taurus AI Corp.
- For questions about Nexus/Q-Grid pricing, redirect to the client's assigned BDM.
- For product feature questions, search internal docs before answering.
- Never claim features that are not released.
```

This protects against hallucinated product claims in client conversations.

**(d) Ad copy / creative briefs**  
When generating copy for a client, prepend a brand-persona block:

```
Brand: Nexus by Taurus AI
Voice: confident, concise, enterprise-grade, no hype
Forbidden: "revolutionary," "disruptive," unverified superlatives
Mandatory legal entity: client-facing docs use "Nexus by Taurus AI"; legal docs use "TAURUS AI CORP - FZCO"
```

This directly operationalizes the corporate-vs-operating-brand rule from `~/.ai-context/TAURUS_CONTEXT.md`.

---

## 3. Concrete Product Roadmap

### 3.1 `social-media-orchestra` (use case a)

| # | Integration | Priority |
|---|---|---|
| 1 | Add `tone_mode` enum (`roast`, `corporate`, `explainer`, `concise`) to generation jobs | High |
| 2 | Embed tool schemas for scheduling, sentiment search, image search, thread rendering | High |
| 3 | Store client brand memories (voice, forbidden words, emoji policy) and retrieve per job | Medium |
| 4 | Add `copyright-guard` post-processor for quoted facts/source text | High |
| 5 | Route outputs inline vs artifact/file based on deliverable type | Medium |

### 3.2 `multi_agent_pipeline` + `hedera-orchestrator` (use case b)

| # | Integration | Priority |
|---|---|---|
| 1 | Adopt `AGENTS.md` and `skills/` conventions in all repos | High |
| 2 | Runtime tool manifest per agent with explicit schemas and routing rules | High |
| 3 | Planner-todo loop with shared state store | High |
| 4 | Policy reminder injection on long runs and handoffs | Medium |
| 5 | Knowledge module that injects `SKILL.md` and `AGENTS.md` context when task matches | Medium |

### 3.3 Client-facing AI products — `Q-Grid`, `bizflow`, client portals (use case c)

| # | Integration | Priority |
|---|---|---|
| 1 | Standardized `<safety_policy>` fragment prepended to all public prompts | High |
| 2 | Copyright guard: 15-word match limit, one-quote-per-source, paraphrase fallback | High |
| 3 | Refusal templates (principle-first, no detection mechanics) | High |
| 4 | Identity preamble with product-info boundaries | Medium |
| 5 | Citation enforcement for RAG/web-sourced answers | Medium |

### 3.4 `OpsFlow.Taurusai.io` + `bizflow` creative (use case d)

| # | Integration | Priority |
|---|---|---|
| 1 | `deliverable_router`: map user request to file type (md, docx, pptx, html) | High |
| 2 | Brand persona block per client, with legal-entity switch | High |
| 3 | Connector opt-in for scheduling, image, and doc tools | Medium |
| 4 | Creative-brief planner with tracked steps and copyright guard | High |
| 5 | Memory of campaign constraints across sprints | Medium |

---

## 4. Implementation Architecture

### 4.1 Prompt Registry

Create a lightweight prompt registry (start as a private repo or encrypted directory):

```
/prompts
  /fragments
    safety-policy.xml
    brand-persona-nexus.txt
    tone-modes.txt
    citation-rules.txt
  /skills
    frontend-design.md
    heiro-tx.md
    compliance-check.md
  /agents
    AGENTS.md (root template)
```

Each fragment is versioned and content-addressed.  Every inference request logs `prompt_hash` + `fragment_versions` for audit.

### 4.2 `copyright-guard` Post-Processor

```python
# pseudo-code
class CopyrightGuard:
    def check(self, response, sources):
        for source in sources:
            longest_match = longest_common_substring(response, source.text)
            if longest_match > 15 words:
                rewrite(response, source, style="paraphrase")
                source.close_for_quotation()
        return response, citations
```

Use a cheap local model for the first pass; escalate to a stronger model only when matches are ambiguous.

### 4.3 Planner / Todo Loop

```python
# pseudo-code
class PlannerAgent:
    def plan(self, task):
        steps = llm_generate(task, schema=["step_id", "description", "tool", "deps"])
        todo = Todo(steps)
        return todo

class WorkerAgent:
    def run(self, todo, state):
        while not todo.done():
            step = todo.next()
            skill = skill_router(step)
            result = execute(step, skill)
            todo.complete(step, result)
            handoff_manager.push(result, policy_fragment)
```

Store `todo.md` in the workspace or in the Nexus `_Operations/` Drive folder so clients and PMs can see progress.

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Over-reliance on prompt text leaks IP norms of competitors | Treat patterns, not wording.  Reword all fragments for Taurus voice. |
| XML policy blocks can be jailbreak targets | Prepend with highest-priority statement; validate with red-team evals. |
| Tool schemas bloat context and increase cost | Use dynamic manifest: only include tools the agent can call. |
| Copyright guard creates false positives | Tunable threshold + human review queue for flagged content. |
| Planner loop can stall on ambiguous tasks | Add max iterations and escalation to `ask` tool / human PM. |
| Mode switching may confuse users | Surface active mode in UI; allow one-click override. |

---

## 6. Immediate Next Steps

1. **Create the prompt registry skeleton** under `HEDERA/prompts/` or a new `nexus-prompts` repo.
2. **Draft `AGENTS.md` templates** for `multi_agent_pipeline`, `social-media-orchestra`, and `Q-Grid.in`.
3. **Implement `tone_mode`** in the next `social-media-orchestra` release as a low-risk, high-value test.
4. **Prototype `copyright-guard`** against a corpus of web sources ingested by `opsflow-recon`.
5. **Run an eval**: compare outputs with and without the new policy/skill fragments; measure hallucination, copyright risk, and user satisfaction.

---

## 7. Appendix: Source Files Reviewed

- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/ANTHROPIC/CLAUDE-FABLE-5.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/CURSOR/Cursor_Prompt.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/CURSOR/Cursor_Tools.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/WINDSURF/Windsurf_Prompt.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/WINDSURF/Windsurf_Tools.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/XAI/Grok4-July-10-2025.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/XAI/GROK-4.1_Nov-17-2025.txt`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/ANTHROPIC/UserStyle_Modes.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/OPENAI/ChatGPT_4o_04-25-2025.txt`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/OPENAI/Codex.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/DEVIN/Devin_2.0.md`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/MANUS/Manus_Prompt.txt`
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/elder-plinius-CL4R1T4S/README.md`
