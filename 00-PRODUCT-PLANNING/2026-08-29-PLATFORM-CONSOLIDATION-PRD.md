# PRD — Platform Consolidation: Cloudflare / Vercel / Spaceship

**Status:** draft · **Date:** 2026-08-29 · **Branch:** `feat/nexus-core-organic-design-system`

Scope: finish the `neorm-era.com` cutover, then decide what — if anything — to move
onto Cloudflare's agent platform. Every product claim below was independently
verified against vendor documentation on 2026-08-29. **Claims marked FALSE or
UNVERIFIED came from the source strategy document and must not be built on.**

---

## 0. Verification summary — read this before planning anything

The source strategy document mixed genuinely shipped Aug-2026 material with wrong
specifics. What survived checking:

### Cloudflare

| Claim | Verdict |
|---|---|
| Apex Pages domain requires the zone on Cloudflare DNS | **VERIFIED — load-bearing, see §1** |
| Sub-agents: isolated SQLite per agent, typed RPC stubs | VERIFIED |
| Agent Traces: OTel spans for model calls, tools, approvals | VERIFIED (per-agent *cost* field: partly) |
| `@cloudflare/ci`, Cloudflare OS, Artifacts, Kitesurf, WebMCP | VERIFIED |
| AI Search free embedding + reranking on default models; `/search` + `/mcp` | VERIFIED |
| AI Gateway: unified binding, prepaid wallet across providers, failover | VERIFIED |
| "Cloudflare Agents launched Aug 2026" | **FALSE** — launched Sept 2024; Aug 2026 was Agents Week |
| Workflows "unlimited steps" | **FALSE** — 1,024 free / 10,000 default / 25,000 hard cap |
| `npx wrangler ai-search create --namespace X` | **FALSE syntax** — it is `wrangler ai-search namespace create` |
| `@cloudflare/computer` "100x faster, zero cold start, not containers" | **UNVERIFIED** — package is real but *preview, not production-suitable*, and uses containers as one backend |
| AI Gateway "classifier picks the best model" | **UNVERIFIED** — real routing picks a *provider* for a model you name |
| FLUX.2 on Workers AI | **UNVERIFIED** — not found in catalog |
| Workflows `waitForApproval()`, `step.do()`, 30 min/step | VERIFIED |

### Vercel

| Claim | Verdict |
|---|---|
| Fluid Compute Active CPU — I/O wait not billed | VERIFIED |
| Hobby free tier: 4h Active CPU, 360 GB-hr memory, 1M invocations | VERIFIED |
| Hobby 12-function cap | VERIFIED — matches `platform/tests/deploy-safety.test.js` |
| `waitUntil()`, VCR/Docker, Services (public beta), MCP Apps, `@ai-sdk/otel` | VERIFIED |
| AI SDK **7** is current | VERIFIED — the "AI SDK v5" reference in the source doc is stale |
| `WorkflowAgent` durable/resumable across deploys | VERIFIED |
| "100 cron jobs on free tier" | **MISLEADING** — count is real, but Hobby crons fire **once per day max** |
| Vercel Agent "opens fix PRs autonomously" | **FALSE** — read-only by default, requires explicit human approval |
| `HarnessAgent` | PARTLY — real but **canary/experimental**, not stable v7 |
| `SandboxSession` | **UNVERIFIED** — likely a fabricated API name |
| Edge Config "sub-millisecond" | PARTLY — docs say ≤5ms typical, 99% under 15ms |
| Apex A record `216.198.79.1` | PARTLY — per-project anycast; read it from the project's domain card, never hardcode |

---

## 1. Phase 1 — finish the domain cutover (in progress)

**Problem.** `neorm-era.com` was registered 2026-08-25 and parked. The Pages project
`neorm-era` serves the post-pivot site; `nexus.taurusai.io` on Vercel still serves the
pre-pivot five-SKU site.

**Root cause, confirmed twice.** Cloudflare Pages cannot serve an **apex** custom domain
when DNS lives at an external provider. Spaceship *does* flatten `ALIAS` at the apex into
A records — DNS resolves correctly — but Cloudflare returns **error 1001** because the
hostname has no configuration at its edge. Subdomains work from external DNS via CNAME;
the apex does not. Cloudflare's own Pages docs state the zone must be added to Cloudflare
with nameservers pointed at it.

**Done**

- Spaceship API credentials issued and stored in `~/.env-secrets`
- `CNAME www` + `ALIAS @` written at Spaceship → `www.neorm-era.com` live, HTTP 200,
  serving the post-pivot site (verified by content, not just status code)
- Cloudflare token `Nexus-Core` (id `103cb1e1…`) granted `Zone Write` + `DNS Write`
- Cloudflare zone `neorm-era.com` created — id `156ca332…`, nameservers
  `dexter.ns.cloudflare.com` / `gina.ns.cloudflare.com`

**Remaining**

1. Create `CNAME @` and `CNAME www` → `neorm-era.pages.dev` **in the Cloudflare zone**,
   proxied. Must happen *before* the nameserver switch so `www` never drops.
2. Switch nameservers at Spaceship via
   `PUT /v1/domains/neorm-era.com/nameservers` with
   `{"provider":"custom","hosts":["dexter.ns.cloudflare.com","gina.ns.cloudflare.com"]}`
3. Wait for zone `status: active`, confirm both Pages custom domains reach `active`
4. Set `SITE_ORIGIN=https://neorm-era.com` in the Pages project environment

**Do not** point apex A records at Cloudflare anycast IPs. It appears to work and breaks
silently when the IP rotates.

**Exit criteria:** `https://neorm-era.com` and `https://www.neorm-era.com` both return 200
with post-pivot content; Pages reports both domains `active`.

---

## 2. Phase 2 — security debt (blocks nothing, but overdue)

Four credentials are exposed and **none have been rotated**. Deleting files does not
un-leak them; each must be rotated at its provider.

| Credential | Exposure | Blast radius |
|---|---|---|
| Cloudflare API token `Nexus-Core` | plaintext in a session transcript | **account-admin** — holds Billing Write, Account Settings Write, Account API Tokens Write |
| GitHub PAT | tracked `.env` under `neovibe-platform/` | org-wide |
| Stripe webhook signing secret | `nexus-creative-editorial/metered-billing.env` | payment forgery |
| HuggingFace token | hardcoded in `tribev2_inference.ipynb` | model access |

The Cloudflare token is the worst of the four and should be rotated first. Note that it
now carries 275 permission groups; a rotation preserves permissions and only changes the
secret value, so nothing needs re-granting — only `~/.env-secrets` needs updating.

**Also outstanding from the backend audit** (commit `4894f7d` body has detail):
`updateCustomerCredits` in `platform/api/webhook.js` is a read-modify-write against
Stripe customer metadata with no compare-and-set, and webhook delivery is not idempotent.
`credit_ledger.idempotency_key` already exists in `0001_credits.sql` and is the fix; it
requires giving `platform/` a Supabase client it does not currently have.

---

## 3. Phase 3 — what is actually worth migrating

The source document proposed replatforming onto Cloudflare Agents, AI Search, and AI
Gateway. Assessed against what this codebase actually runs:

### 3.1 Recommended — AI Search to replace turbovec RAG

`backend/services/vector_retrieval.py` is 364 lines with a hard numpy dependency, an
optional native `turbovec` module that silently degrades to empty results when absent, and
a `persist()` method with **zero call sites** — the index and its `_documents` map are
never written to disk, so nothing survives a restart.

AI Search is managed, free for embedding and reranking on default models, and exposes an
`/mcp` endpoint. This is the strongest case in the document.

**Caveat the document missed:** the two knowledge endpoints were returning 500 in every
configuration until commit `e030628` (sync/async defect). Whatever replaces this layer,
the replacement needs an integration test — there was none, which is why the outage was
invisible.

### 3.2 Conditional — Cloudflare Agents for `02-AGENTS/`

Sub-agents, isolated SQLite, and OTel traces are all real and map well onto the six
specialized agents. But the "~2 days migration" estimate in the source document is not
grounded in anything, and `@cloudflare/computer` — the piece that makes the story
compelling — is explicitly **preview, not suitable for production**.

**Recommendation:** prototype one agent, measure, then decide. Do not migrate six.

### 3.3 Not recommended yet — AI Gateway as the billing layer

The document proposes deleting ~300 lines of `tenancy.py` / `metering.py` /
`ledger_supabase.py` in favour of AI Gateway credits. This misreads what that code does.

AI Gateway meters **provider spend**. `tenancy.py` encodes a **licensing boundary** —
subscription-tier providers (NotebookLM consumer, Google Flow, Higgsfield subscription)
may not be resold to a billable tenant, enforced at runtime by
`ProviderNotResellableError`. `metering.py` records `cost_cents` *and* `billed_credits` so
margin is computable. AI Gateway replaces neither.

**The real finding is different and more urgent:** that billing core has **zero production
callers**. `grep` for imports outside tests returns only `vector_retrieval`.
`Tenant(...)` is never constructed outside the test suite. What actually bills today is
Stripe customer metadata (§2). Wire it up or retire it — but do not replace a library that
has never run with a service that solves a different problem.

### 3.4 Defer — WebMCP, Kitesurf, Artifacts

All verified real. None are on the critical path to revenue. Revisit after Phase 1 and 2.

---

## 4. Decisions needed

1. **Rotate the Cloudflare token** — yes/no, and when
2. **Wire `generate_and_bill` to a route, or retire the billing core** — it cannot stay
   as tested-but-uncalled code indefinitely
3. **Give `platform/` a Supabase client** — required for webhook idempotency and to fix
   the credit race
4. **AI Search prototype** — approve or defer

## 5. Non-goals

- Renaming `NEXUS-CORE`, `Taurus-Ai-Corp/Nexus`, or `nexus.taurusai.io` — frozen infrastructure
- Migrating all six agents before a measured prototype
- Any change to `taas-ai.com`
