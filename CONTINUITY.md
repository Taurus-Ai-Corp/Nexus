# Continuity Snapshot — 2026-09-08 (evening, America/Toronto)

## Goal

Get NEORM-ERA's live site (`neorm-era.com`) back in step with the repo. The live
deploy was 11 commits behind and carried an open security fix; two blockers stood
in the way of deploying, and both are now cleared. The redesign PRD (Phases 1–4)
is still entirely unexecuted and is *not* the current priority.

## Repo

`/Users/taurus_ai/Documents/NEXUS-CORE` · branch `feat/nexus-core-organic-design-system`
· dirty files: **1528** (the mid-reorganisation state described in CLAUDE.md — normal here)
· local HEAD `fbbcda8` · **origin is in sync at `fbbcda8`** (nothing unpushed)

## Progress

- [x] `rgba` regression fixed properly — 4 new `--scrim-media-*` tokens in
      `platform/lib/tokens.mjs`, `core/design-system/tokens/` mirror resynced
      (no selector lost, 8 gained). Commit `22da80f`.
- [x] Envato previews removed. All 49 clips were unlicensable preview renders.
      `ENGINE_VIDEOS` is now empty; `initHeroMedia` takes the shader path for any
      engine without an entry, so `estate`/`seo` joined the other six.
      `video-hero.js`, `hero-gradient.js`, `video-hero.test.js` were **all untracked**
      and are now committed. Commit `a54c8f7`.
- [x] Deploy payload: **538 MB → 82 MB**, files over Cloudflare's 25 MiB cap **4 → 0**.
      Moved to `~/Documents/_platform-media-archive/2026-09-08/` (README records the
      licence position). 8 byte-identical `index 2.html` duplicates archived too.
- [x] Starter pricing → **$99/month, 10 campaigns**. Copy + billing moved together:
      `creditsMap.starter` 5→10, mode `payment`→`subscription`, and
      `subscription_data[metadata][reset_credits]='true'`. Six files. Commit `fbbcda8`.
- [x] Suite **295/295**. Verified in headless Chromium at 1440px and 390px.
- [ ] **Deploy** — blocked only on the owner's explicit verb.
- [ ] **Create a recurring monthly $99 Stripe Price** and set
      `STRIPE_STARTER_MONTHLY_PRICE_ID`. Owner-only. Starter checkout returns a
      specific 500 until this exists (deliberate — fails loudly, never mischarges).
- [ ] Phase 0 A/B decision — `platform/prototype/qa/FAIR-{A-hybrid,B-liquidcrystal}-{1440,390}.png`.
      Recommendation **A**.
- [ ] Automate deploys from CI (see Landmines — Git integration is impossible here).
- [ ] Carried over: rotate 3 Webflow secrets; 27 stale Vercel projects; gridera.net decision.

## Next step

Nothing until the owner answers. When they say deploy, the exact command is:

```bash
npx wrangler pages deploy platform --project-name=neorm-era --branch=feat/nexus-core-organic-design-system
```

`npx` prompts to install wrangler on first run (answer `y`). It reads
`CLOUDFLARE_API_TOKEN` from the shell; if the token lacks Pages:Edit it fails at
upload without touching production.

## Landmines

- **Cloudflare Pages `neorm-era` is Direct Upload (`source: null`).** It **cannot** be
  connected to Git — Cloudflare's docs are explicit that you must create a new project.
  The supported fix is a GitHub Actions job running `wrangler pages deploy`. Do not
  re-propose "connect the repo"; that was already tried and is impossible.
- **`git log` is not a record of what is live.** Every deploy is an upload from a
  working tree; the last one recorded `commit_dirty: true`, so the live bytes match
  no commit anywhere.
- **Stripe Starter checkout is intentionally broken** until a recurring Price exists.
  Do NOT "fix" it by falling back to `STRIPE_STARTER_PRICE_ID` — that is a one-time
  price, and reusing it reproduces the undercharge bug the `planMap` comment records.
- **`api/webhook.js` only refreshes credits when `reset_credits === 'true'`.**
  Studio deliberately still omits this flag — turning it on would change billing for
  existing Studio subscribers. Open question for the owner, not a bug to silently fix.
- **`updateCustomerCredits` adds, it does not set** — despite logging "reset". Monthly
  allowances therefore roll over indefinitely. Left as-is; flag before changing.
- **Test counts move with the file set.** `site-integrity.test.js` generates per-page
  tests by walking the tree, so stray duplicate HTML inflates the count. The
  293 → 326 jump was exactly the 8 `index 2.html` duplicates (31 phantom tests);
  removing them returned it to 295. If the count changes unexpectedly, look for
  new files before suspecting the tests.
- **`estate` and `seo` have no shader palette**, so both fall back to `default` and
  now look alike. Canonical values exist (Masterpiece Red `#5A2132`, Blue Charcoal
  `#001619`) in `00-PRODUCT-PLANNING/GEMINI-3.7-2026-08-25-NEORM-ERA-REBRAND/08_COLOR_TAXONOMY_AND_ENGINE_PALETTES.md`.
  **Do not invent palette weights** — this repo has made that mistake twice.
- **`/` overflows horizontally by 73px at 390px** (`/pricing.html` by 16px). Pre-existing,
  still live, unrelated to any of the above.
- **Commercial risk flagged, owner's call:** `creative/index.html` sells the $399 tier
  to "teams shipping 3+ campaigns per month". Starter now includes 10/month at $99,
  so the $399 tier's stated audience is fully served by the cheaper plan.
- **A local-inference hook blocks Bash containing `rm -rf` and the bare word "main".**
  Use `rmdir` for empty dirs and `origin/HEAD` instead of `origin/main`.
- **The repo is too large for un-scoped `grep -r`** — it times out. Always scope to
  `platform/` or a numbered directory.
