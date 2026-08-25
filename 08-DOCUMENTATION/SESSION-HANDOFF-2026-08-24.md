# Session handoff — 2026-08-24

Written before a planned restart. Everything below is verified, not assumed.

## Branch state — SAFE, pushed to origin

Branch `feat/nexus-core-organic-design-system`, two commits, both pushed:

| Commit | What |
|---|---|
| `3a5b722` | §3 design system as a generated token package |
| `8ea8775` | Campaign/Creative nav collapse + design-review page + `*.env` ignore fix |

Nothing is merged. Nothing is deployed to production. `main` is untouched.

`npm test` in `platform/`: **52/53**. The single failure is pre-existing local drift
(`core/design-system/tokens/design-system.css` ENOENT) and is NOT caused by this work.

## What was decided this session

- **Canonical domain is `taurusai.io`.** Verified: the Cloudflare account holds exactly
  three zones — `grid-era.com`, `taas-ai.com` (pending, BLOCKED by owner, do not touch),
  `taurusai.io` (active). `taurus.ai` is parked on Spaceship, `torres.ai` is SiteGround —
  neither is ours. This settles Convergence Analysis "conflict one", which was blocking
  the monorepo.
- **Canonical repo is `Taurus-Ai-Corp/Nexus`.** Verified three ways: local remote, Vercel
  prod alias, and the deployed commit SHA resolving inside it. `neovibe-platform` is a
  strict git *ancestor*, not a parallel line.
- **Design tokens = handoff §3 + the Liquid Crystal Ember ramp.** Liquid Crystal does not
  replace §3; it extends it and keeps `#B44A24` byte-identical as the "rest" state.
  Boundary is rule **R3** — warm chrome everywhere, Liquid Crystal only for object fields
  and hero captures. The claude.ai "Organic" `theme.json` (Caprasimo/Figtree) is the parent
  design system and is **superseded** by §3 for this build.
- **Campaign page = the pilot/launch demo for Nexus Creative.** Nav collapsed from two
  entries to one; `/creative/` leads with "Launch the pilot demo" -> `/campaigns/`.

## BLOCKED — needs the owner

1. **Cloudflare DNS.** `nexus.taurusai.io` is **NXDOMAIN**. The site is healthy and serving
   at `nexus-platform-kohl.vercel.app`; DNS is the only break. The `Nexus-Core` token is
   valid but is an **account-scoped** token with no `Zone -> DNS -> Edit` policy, so
   `dns_records` returns `code 10000`. Note `/user/tokens/verify` returns `code 1000` for
   this token by design — that endpoint only validates *user*-owned tokens, so it is NOT
   evidence the token is bad. Record to create once the policy is added:

   ```
   CNAME  nexus  ->  416043bc885ff1d4.vercel-dns-017.com   proxy: DNS only (grey cloud)
   zone id 6e3b2864707588f82a4e6b022010002d
   ```

   Grey cloud matters — orange-cloud proxy in front of Vercel breaks cert issuance.
   Consequence while NXDOMAIN: `platform/api/stripe.js` hardcodes
   `https://nexus.taurusai.io/campaigns/thanks.html` as the Stripe `success_url`, so every
   completed checkout redirects into a domain that does not exist.

2. **PR creation is blocked by a policy hook** (`gh pr list` works, `gh pr create` does
   not). CI only triggers on PRs targeting `main`, so nothing runs until the owner creates
   it themselves:

   ```
   gh pr create --draft --base main --head feat/nexus-core-organic-design-system \
     --title "feat(platform): NEXUS-CORE design system as a generated token package"
   ```

   Expect it to go red for reasons unrelated to this branch — the Ruff job lints ~10,500
   errors across vendored MCP servers and the pytest job targets a placeholder directory.

3. **Production deploy** — not authorised, not attempted. `vercel --prod` is hook-blocked.
   Pointless until DNS resolves anyway.

## URGENT — credential rotation

Found by the repo audit (report at `08-DOCUMENTATION/research/github-repo-consolidation-audit.md`):

| Location | Exposure |
|---|---|
| `neovibe-platform/…/mcp-agents/.env.subscription` | ~15 live credentials — **GitHub PAT** (reaches the whole org — highest blast radius), OpenAI project key, Google OAuth client secret, Slack bot+user tokens, Notion, Figma, Webflow, Perplexity ×3, OpenRouter ×2, Firecrawl, Supabase |
| `nexus-creative-editorial/metered-billing.env` | live **Stripe webhook signing secret** (`whsec_`) |

Both are in git history on those repos — **rotation at the provider is required; deleting
files does not help.** They also sit untracked on this laptop under
`08-DOCUMENTATION/research/`. `.gitignore` matched `.env*` (prefix) but not `<name>.env`
(suffix), so they were **not ignored** in a directory holding ~7,180 untracked files — one
`git add 08-DOCUMENTATION/` would have committed the Stripe secret into the canonical repo.
Fixed in `8ea8775`; `*.env.example` / `*.env.sample` remain trackable.

## Sequencing constraint before retiring any repo

`08-DOCUMENTATION/research/` holds **7,064 files on disk, 0 tracked**. `09-ASSETS/assets/`
is 70 on disk, 0 tracked. Not gitignored — just never committed. So the salvage from the old
repos currently exists in exactly two places: the source repos, and one folder on one
laptop. **Commit the salvage before retiring anything.**

## Agents

- **GitHub repo consolidation audit — COMPLETE.** Report at
  `08-DOCUMENTATION/research/github-repo-consolidation-audit.md` (403 lines). 34 repos
  classified safe to retire, each with what would be lost. Read-only; nothing was deleted.
  Top cherry-picks: `taurus-neovibe-creative` (mislabelled — it is actually
  `@taurus-ai/dev-config` and holds the only Claude Code→OpenCode agent translator; the
  local `taurus-nexus-creative/` folder is EMPTY, that merge was abandoned),
  `social-media-orchestra` (not dormant — CrewAI crews + RAG, blocked by the ORCA dead
  brand tripping the pre-commit guard), and `nexus-creative-editorial`'s `embed_c2pa.py`
  (only C2PA implementation in the estate).
- **Agency competitive design analysis — KILLED BY RESTART.** Was ~20 min in. Relaunch.
- **Skills / MCP harness audit — KILLED BY RESTART.** Was ~5 min in. Relaunch.

Both were session-local background subagents; a restart does not pause them, it ends them.

## Open questions for the owner

1. Is the editorial-fashion register (the brass-compass photograph) right for *all*
   verticals? Nexus Intel is a data product and may fight it.
2. Do the other four verticals each get a pilot-demo button, matching Nexus Creative?
3. Retirement list — 34 repos. Owner reviews and decides; nothing gets deleted by an agent.

## Process rules adopted this session — keep these

- **Design changes are proposed visually, never as hex codes.** Build a static page, hand
  over the URL. First instance: `08-DOCUMENTATION/design-review/index.html`.
- **Every gate gets OCR/visual verification** in a real browser, and anything broken is
  fixed before moving on. This caught two real bugs a green test suite missed — a CSS
  comment that terminated early and swallowed `--grad-brand` (nav brand mark rendered
  transparent), and `campaigns/thanks.html` linking no stylesheet at all.
- **Tokens are generated, never hand-typed** (Convergence Analysis rejection E2).
  `platform/lib/tokens.mjs` -> `npm run tokens` -> `assets/css/tokens.css`.
  `design-system.css` declares zero colours, enforced by test.

## Local scratch that dies with the session

- `npx serve platform -p 4173` and `npx serve . -p 4174` — the design review page was at
  `http://localhost:4174/08-DOCUMENTATION/design-review/`. It also opens directly from disk
  as a file; the asset paths are relative.
