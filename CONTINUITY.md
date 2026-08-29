# Continuity Snapshot — 2026-08-29 03:55 EDT

## Goal
Ship `neorm-era.com` on Cloudflare Pages with the domain registered at Spaceship, and
fact-check the platform-consolidation strategy document before any of it gets built.

## Repo
`/Users/taurus_ai/Documents/NEXUS-CORE` · branch: `feat/nexus-core-organic-design-system`
· dirty files: 1472 (pre-existing mid-reorganisation drift, see CLAUDE.md — **not** this
session's work) · unpushed: 1 (`de95fe7`)

## Progress

### Domain cutover — COMPLETE, verified live
- [x] Spaceship API creds in `~/.env-secrets` (`SPACESHIP_API_KEY` / `SPACESHIP_API_SECRET`)
- [x] Cloudflare token `Nexus-Core` (id `103cb1e17e5b889be94e2846925b4e5a`, **account-owned**)
      granted `Zone Write` (`e6d2666161e84845a636613608cee8d5`) then `DNS Write`
      (`4755a26eedb94da69e1066d98aa820be`) — now 275 permission groups
- [x] Cloudflare zone `neorm-era.com` created — id `156ca33294fa5079ed59a0705297c8f0`,
      NS `dexter.ns.cloudflare.com` / `gina.ns.cloudflare.com`, status **active**
- [x] `CNAME @` + `CNAME www` → `neorm-era.pages.dev`, proxied, created **in the Cloudflare
      zone before** the NS switch so `www` never dropped
- [x] Spaceship NS switched to Cloudflare via `PUT /v1/domains/neorm-era.com/nameservers`
      with `{"provider":"custom","hosts":[...]}` → HTTP 200
- [x] Verified: apex + www + `/estate/` + `/seo/` + `/creative/` all 200; content carries
      9× `NEORM-ERA`; `POST /api/contact` returns 400 (handler validating, not a routing
      failure); all five security headers from `_headers` present

### Code fixes — committed, pushed
- [x] `e030628` `backend/services/vector_retrieval.py` + `backend/main.py` —
      `_get_embeddings`/`ingest_documents`/`search` made async. Both `/api/knowledge/*`
      endpoints were returning 500 **in every configuration** (`asyncio.run()` called from
      inside FastAPI's running loop). Also replaced the `hash()` Redis cache key with
      SHA-256 — `hash()` is per-process salted, so the cache never hit.
- [x] `c58b66d` `platform/lib/site-origin.mjs` — `*.pages.dev` added to the host allowlist
- [x] `4894f7d` `platform/api/webhook.js` + `platform/tests/webhook-signature.test.js` —
      Stripe `t=` timestamp was parsed and never checked (a request captured 100 days
      earlier still validated); added 300s tolerance + `timingSafeEqual`. 10 new tests.
- [x] `de95fe7` `00-PRODUCT-PLANNING/2026-08-29-PLATFORM-CONSOLIDATION-PRD.md` — **UNPUSHED**

### Strategy doc fact-check — COMPLETE (3 agents, vendor docs)
- [x] Results are in the PRD, tagged VERIFIED / PARTLY / FALSE / UNVERIFIED

## Next step

```bash
git push origin feat/nexus-core-organic-design-system
```

Then rotate the Cloudflare API token (see Landmines).

## Landmines

**Do not re-litigate these — they are settled and cost real time to establish:**

- **The apex needed the zone on Cloudflare.** Spaceship *does* flatten `ALIAS` at the apex
  (DNS resolved fine), but Cloudflare Pages returns **error 1001** for an apex whose zone
  isn't on Cloudflare. Subdomains work by CNAME; the apex does not. I retracted this
  correctly-reached conclusion once mid-session on partial evidence — don't repeat that.
- **`launch1/launch2.spaceship.net` are Spaceship's STANDARD nameservers, not parking.**
  Records set via the API resolve through them. A source claimed otherwise; it was wrong.
- **Spaceship `ALIAS` is stored and returned as `CNAME` at `@`.** The field is `aliasName`
  for ALIAS and `cname` for CNAME. `ANAME` is not a supported type.
- **Spaceship has no redirect/URL-forwarding API.** Probed `/domains/{d}/redirects`,
  `/dns/redirects/{d}`, `/domains/{d}/forwarding` — all 404. Dashboard-only.
- **Cloudflare token permission changes take ~120s to take effect.** DNS record writes
  returned `10000 Authentication error` for two minutes after `DNS Write` was granted.
  Retry; do not conclude the permission failed.
- **The token is ACCOUNT-owned.** It verifies at `/accounts/{id}/tokens/verify` and returns
  `1000 Invalid API Token` at `/user/tokens/verify`. Editing it in the dashboard means
  **Manage Account → API Tokens**, NOT `/profile/api-tokens`. A permission edit made in the
  wrong list silently did nothing.
- **Token edits are whole-policy PUTs.** Always build `existing groups + new`, and check the
  count and null-ids before sending, or you strip all 275 and brick the token that runs
  Pages. Snapshot: `scratchpad/cf-token-before.json`.
- **The user's shell is zsh.** `read -p` fails (`no coprocess`); use `read -r "var?prompt"`.
  Any command handed over must be zsh-tested, and if interactive, show the prompts.
- **`platform/tests/deploy-safety.test.js` has 1 known local failure** —
  `core/design-system/tokens/design-system.css` is deleted on disk but present in git.
  Local drift, documented in CLAUDE.md. Do not "fix" it by deleting the assertion.
  Baseline: **284 tests, 283 pass**. Backend: **49 pass, 9 skipped**.
- **Design/UI/UX is explicitly OUT OF SCOPE** — handed to Gemini 3. Do not propose design.
- **`taas-ai.com` is BLOCKED.** Do not touch.
- No working venv is checked in. Scratch venv with numpy/pytest/pyjwt/bcrypt/fastapi:
  `<scratchpad>/.venv/bin/python`.

## Open decisions (from the PRD, need the user)

1. **Rotate the Cloudflare token** — it holds Billing Write, Account Settings Write and
   Account API Tokens Write, and its plaintext value was pasted into a session transcript.
   Rotation preserves permissions; only `~/.env-secrets` needs the new value.
   Three other credentials also remain unrotated: GitHub PAT, Stripe webhook secret,
   HuggingFace token.
2. **Wire `generate_and_bill` to a route, or retire the billing core.** `grep` for imports
   outside tests returns only `vector_retrieval`; `Tenant(...)` is never constructed outside
   the test suite. What actually bills today is Stripe customer metadata.
3. **Give `platform/` a Supabase client** — required to fix the `updateCustomerCredits`
   read-modify-write race and to make webhook delivery idempotent
   (`credit_ledger.idempotency_key` already exists in `0001_credits.sql`).
4. **`SITE_ORIGIN`** — currently unset; `siteOrigin()` derives correctly from Host, so
   checkout redirects work today. Setting it explicitly needs a redeploy.
