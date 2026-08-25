# Harness Audit — Skills, Commands, Agents, MCP, CLIs

**Audited:** 2026-08-24 · **Method:** read-only inspection of files on disk plus harmless
read-only command invocations (`--version`, `--help`, `doctor`, `list`, `status`, `whoami`).
**Scope:** `~/.claude/`, `~/.claude.json`, `~/.hermes/`, and the `.claude/` trees inside
NEXUS-CORE, HEDERA, GLOBAL_BIO_FOUNDRY.

Every claim below is labelled **VERIFIED** (I ran it or read it) or **UNVERIFIED** (I could
not check it, with the reason). No credential values are printed anywhere in this document.

---

## 0. Headline findings

1. **47 of 73 global skills are switched OFF** by a `skillOverrides` block in
   `~/.claude/settings.json`. They are on disk, they look installed, and they will never
   fire. This is the single largest source of "I have a skill for that but it never runs".
   **VERIFIED** — parsed `settings.json`, cross-checked against `ls ~/.claude/skills`.
2. **8 of the 18 slash commands documented in the global `CLAUDE.md` do not exist**
   (`/scout`, `/hunter`, `/roast`, `/health`, `/ship`, `/launch-checklist`, `/plan`,
   `/plan:status`). **VERIFIED** by `find` across all three command directories.
3. **The `deploy-nexus` project skill is genuinely broken** — its target directory
   `NEXUS-CORE/Nexus _ Platform Devops/social-suite-dashboard/` exists but is **empty**
   (0 entries). The real dashboard is at `06-AUTOMATION/social-suite-dashboard/`.
   **VERIFIED** by `ls`.
4. **All 8 named CLIs are installed and functional.** No CLI-layer breakage found.
   **VERIFIED** by running each.
5. **All 6 configured MCP servers report Connected.** No dead MCP servers.
   **VERIFIED** via `claude mcp list`.
6. **A plaintext third-party API key is stored in `~/.claude.json`** under the
   `/Users/taurus_ai/Documents` project scope (the `rtrvr` HTTP server URL has the key
   inline, while the global entry correctly uses `${RTRVR_API_KEY}`). Value not reproduced
   here. Recommend rotating and switching that entry to the env-var form. **VERIFIED**
   by parsing the file.

---

## 1. Inventory — counts

| Category | On disk | Active | Broken / stale | Notes |
|---|---:|---:|---:|---|
| Global skills (`~/.claude/skills/`) | 73 | **26** | 4 confirmed broken | 47 disabled by config |
| Project skills (NEXUS-CORE) | 1 (+1 empty dup) | 0 | 1 | `deploy-nexus` broken; `deploy-nexus 2` is an empty macOS copy artifact |
| Project skills (HEDERA) | 12 | — | 0 broken paths | 7 are byte-identical duplicates of global skills |
| Project skills (GLOBAL_BIO_FOUNDRY) | 3 | — | 0 checked | descriptions only; scripts not exercised |
| Slash commands (`~/.claude/commands/`) | 13 | 13 | 1 (`scrape.md`) | |
| Slash commands (HEDERA) | 15 | 15 | 2 (`ceo.md`, `scrape.md`) | |
| Slash commands (NEXUS-CORE) | 0 | 0 | — | |
| Custom agents (global) | 11 | 11 | 1 (`proposal-generator`) | |
| Custom agents (NEXUS-CORE) | 2 | 2 | 0 | no `tools:` frontmatter → inherit all |
| MCP servers configured | 6 | 6 connected | 0 | + 2 built-in integrations |
| Plugins installed | 60 entries | **4 enabled** | — | `planning-with-files` not registered at all |
| CLIs checked | 8 | 8 working | 0 | plus 12 supporting CLIs all present |
| Hooks wired | 20 hook commands | 20 | 0 | every referenced script exists |

**Totals: 89 skills on disk, 28 slash commands, 13 custom agents, 6 MCP servers, 8 primary CLIs.**

---

## 2. Global skills — `~/.claude/skills/` (73 on disk)

### 2.1 The 26 that are actually ACTIVE

**VERIFIED** — computed as `ls ~/.claude/skills` minus the 47 `skillOverrides: off` entries.

`agent-reach`, `brandkit`, `browser-use`, `brutally-honest`, `compliance-regtech`,
`critique`, `data-intelligence`, `execution-guardrails`, `fable-haiku`, `fable-mode`,
`fable-opus`, `full-output-enforcement`, `higgsfield-product-photoshoot`,
`high-end-visual-design`, `last30days`, `launch-ops`, `position-me`, `proposal-generation`,
`redesign-existing-projects`, `reflect`, `reflect-stage`, `sales-ops`, `save-state`,
`security-ops`, `superdesign-website`, `tdd-green`.

Note the shape of that list: the **entire design bench except three** is off, **both memory
read skills** are split (write-side `reflect-stage` on, read-side `recall` **off**), and
`fable-sonnet` is off while `fable-opus` and `fable-haiku` are on — so the middle tier of
the fable ladder is unreachable by name.

### 2.2 The 47 that are DISABLED by `skillOverrides`

**VERIFIED** — all 47 exist on disk; none are orphan config entries.

```
blockchain-ops            deeptech-research         design-taste-frontend
design-taste-frontend-v1  emil-design-eng           fable-sonnet
gpt-taste                 gsap-advanced-design      higgsfield-game-generation
higgsfield-generate       higgsfield-marketplace-cards
higgsfield-soul-id        higgsfield-video-explainer
higgsfield-websites       human-tone                image-to-code
imagegen-frontend-mobile  imagegen-frontend-web     india-fintech
industrial-brutalist-ui   invoice-cli               linkedin-post-generator
luxury-brand-design       map-your-market           marketing-automation
meta-ads-skill            meta-tribeV2-skill        minimalist-ui
nexus-design-system       noise-to-linkedin-carousel
notebooklm                pqc-leads                 pricing-finder
pricing-page-psychology-audit                       producthunt-launch-kit
provenir-lite             recall                    reddit-icp-monitor
stitch-design-taste       taurus-logo-forge         tweet-thread-from-blog
unblock-research          vc-curated-match          vc-finder
webapp-devops             where-your-customer-lives cinematic-video
```

This is a **deliberate config choice, not breakage** — but the practical effect is that most
of the library is invisible. If any of these were turned off only to reduce prompt noise,
the fix is selective re-enabling, not reinstallation.

### 2.3 Skills with BROKEN path references

I extracted every filesystem-looking reference from all 73 `SKILL.md` files and resolved
each one. Most initial hits were false positives (dollar amounts like `~$0.001`, percentages
like `~70%`, and intentional scratch files under `/tmp/`). After filtering, these are the
genuine breakages:

| Skill | Broken reference | Status | Impact |
|---|---|---|---|
| `cinematic-video` | `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/mater_maria_cinematic_v2.py` | **VERIFIED BROKEN** — parent directory does not exist | Skill cannot run its pipeline. Already `off`. |
| `taurus-logo-forge` | `./vectorize.sh` | **VERIFIED BROKEN** — skill directory contains only `SKILL.md` | The vectorize step in the documented workflow is unrunnable. Already `off`. |
| `last30days` | `skills/last30days/nux-wizard.md` | **VERIFIED BROKEN** — not present; `references/` holds only `save-html-brief.md` | First-run onboarding path is dead. Skill is **enabled**, so this one bites. |
| `tdd-green` | `~/Documents/Nexus-Platform/platform`, `~/Documents/HEDERA/petpawsphere` | **VERIFIED BROKEN** — both missing | 2 of 3 rows in its known-repos table are stale. `HEDERA/gridera-platform` row **VERIFIED EXISTS**. Skill still works; the table misleads. |
| `provenir-lite` | `~/.provenir/jobs.db` | **VERIFIED ABSENT** | The DuckDB the skill and both `provenir-*` agents query has never been created. Skill is `off`; the two agents are **not**. |

### 2.4 Skills whose references RESOLVE (refuting the "stale reorg" suspicion)

These looked stale but check out — **VERIFIED EXISTS**:

- `pqc-leads` → `HEDERA/multi_agent_pipeline/agents/{ssl_scanner,lead_scorer,outreach}.py`
  and `pqc_lead_pipeline.py` all present. Skill is `off` despite being functional.
- `security-ops` → `HEDERA/multi_agent_pipeline/recon.py` present.
- `fable-haiku` / `fable-opus` / `fable-sonnet` → their `agents/fable-*.md` targets all
  exist in `~/.claude/agents/`.
- `reflect` / `reflect-stage` → `~/.claude/reflection/` exists; both hook scripts at
  `/Users/taurus_ai/Documents/tools/reflect/hooks/` exist.
- `notebooklm` → `~/.notebooklm/` exists.

### 2.5 One cross-skill dependency broken by CONFIG, not disk

`superdesign-website` (**enabled**) instructs the agent to read
`luxury-brand-design/references/animation-library.md` for its Framer Motion presets.
That file **VERIFIED EXISTS** — but `luxury-brand-design` is in the `off` list. The
reference is reachable by `Read` but the skill it belongs to will never load its own
context. **Net effect: a live skill depends on a dead one.**

---

## 3. Project skills

| Path | Skill | Status |
|---|---|---|
| `NEXUS-CORE/.claude/skills/deploy-nexus/` | `deploy-nexus` | **VERIFIED BROKEN** |
| `NEXUS-CORE/.claude/skills/deploy-nexus 2/` | — | **VERIFIED EMPTY** — no `SKILL.md`, macOS duplicate artifact |
| `HEDERA/.claude/skills/` | 12 skills | 7 are **VERIFIED byte-identical duplicates** of global copies |
| `GLOBAL_BIO_FOUNDRY/.claude/skills/` | `bio-coherence-validator`, `grant-writer`, `impeccable` | **UNVERIFIED** — frontmatter read; no scripts referenced to check |

**`deploy-nexus` detail (VERIFIED):** the skill's every step begins
`cd "Nexus _ Platform Devops/social-suite-dashboard/{api,web}"`. That parent directory
exists in NEXUS-CORE and contains a `social-suite-dashboard` entry — but that entry is an
**empty directory (0 files)**. The working dashboard lives at
`06-AUTOMATION/social-suite-dashboard/` (contains `api/`, `web/`, `nlp/`,
`docker-compose.yml`). The skill also names the platform "**NeoSync**", a retired brand
that the repo's own pre-commit brand guard is configured to reject.

*Correction to the project `CLAUDE.md`:* it states deploy-nexus's paths
"no longer exist on disk". The **parent** path does exist — it is the leaf that is empty.
The conclusion (do not use it for working commands) is right; the stated reason is not.

**HEDERA duplicates (VERIFIED via `diff`):** `higgsfield-{generate, game-generation,
marketplace-cards, product-photoshoot, soul-id, video-explainer, websites}` are identical
to the global copies. Six of the seven are globally `off`, so the HEDERA copies are the
only live path when working in that repo — an inconsistency worth resolving one way.

---

## 4. Slash commands (28 total)

### `~/.claude/commands/` — 13 · **VERIFIED all present**

`cli-anything`, `cli-anything-list`, `cli-anything-refine`, `cli-anything-test`,
`cli-anything-validate`, `extend-design-db`, `gws`, `notebook`, `recon`, `research`,
`rtrvr`, `scrape`, `yt-search`.

Underlying dependencies **VERIFIED EXISTS**: `~/bin/gws-bridge`, `~/.config/gws-bridge/.env`,
`~/bin/ollama`, `gws` on PATH, `rtrvr` on PATH.

**One broken:** `scrape.md` references `/Users/user/Documents/HEDERA/data/` — a placeholder
username. `/Users/user/` **VERIFIED does not exist**.

### `HEDERA/.claude/commands/` — 15 · **VERIFIED all present**

`bsv-deploy`, `ceo`, `colab`, `deep-research`, `genmedia`, `gws`, `india-fintech`, `iq`,
`moneyprinter`, `monitor`, `recon`, `scrape`, `videofactory`, `vuln-scan`, `web3-store`.

| Command | Referenced path | Status |
|---|---|---|
| `ceo` | `/Users/user/Documents/HEDERA/**` (5 refs) | **VERIFIED BROKEN** — wrong username |
| `ceo` | `HEDERA/Q-GRID` | **VERIFIED MISSING** — retired brand directory |
| `ceo` | `HEDERA/CONTEXT_RECALL.md`, `gemini-integration/health_monitor.py` | **VERIFIED EXISTS** |
| `scrape` | `/Users/user/Documents/HEDERA/data/` | **VERIFIED BROKEN** |
| `genmedia`, `moneyprinter`, `videofactory` | `HEDERA/gemini-integration/` | **VERIFIED EXISTS** |
| `gws` | `HEDERA/gws-bridge/gws-bridge.sh` | **VERIFIED EXISTS** |

### The 8 documented-but-missing commands

**VERIFIED MISSING** from every command directory: `/scout`, `/hunter`, `/roast`, `/health`,
`/ship`, `/launch-checklist`, `/plan`, `/plan:status`.

- `/plan`, `/status` **do exist** as files inside
  `HEDERA/.claude/plugins/planning-with-files/commands/` — but that plugin is
  **VERIFIED not present in `enabledPlugins`**, so it is never loaded. Fixable by
  registering the plugin.
- `/scout`, `/hunter`, `/roast` correspond to `HEDERA/.cursor/skills/opsflow-{recon,roaster,scraper}/`,
  which **VERIFIED EXIST** but live under `.cursor/` — Cursor IDE only, not Claude Code.
- `/health`, `/ship`, `/launch-checklist` have **no backing file anywhere**. The global
  `CLAUDE.md` documents `/ship` with a full 5-stage pipeline description; that pipeline
  exists only as prose.

---

## 5. Custom agents (13)

### Global — `~/.claude/agents/` (11) · **VERIFIED all files present**

| Agent | Model | Tool allowlist | Status |
|---|---|---|---|
| `fable-orchestrator` | opus | Read, Grep, Glob, Bash, Task, TodoWrite | **VERIFIED** — deliberately Write-less |
| `fable-verifier` | haiku | Read, Grep, Glob, Bash | **VERIFIED** — read-only by design |
| `fable-worker-haiku` | haiku | Read, Write, Edit, Grep, Glob, Bash, WebSearch, WebFetch | **VERIFIED** |
| `fable-worker-sonnet` | sonnet | same as above | **VERIFIED** |
| `nexus-freelance` | opus | Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Task | **VERIFIED** |
| `proposal-generator` | opus | ~180 entries: `vscode/*`, `browser/*`, `com.supabase/mcp/*`, `com.vercel/*`, `playwright/*`, `huggingface/*`, `tavily`, `mongodb`, `context7` | **VERIFIED BROKEN** — see below |
| `provenir-outreach` | inherit | Read, Write | **VERIFIED** — no-network gate is intentional |
| `provenir-sourcer` | inherit | Read, Bash, Write, Glob, Grep | **VERIFIED** file; **depends on absent `~/.provenir/jobs.db`** |
| `tech-innovation-strategist` | opus | (none declared → all tools) | **VERIFIED** |
| `uae-urban-planning-officer` | opus | (none declared → all tools) | **VERIFIED**; description references dead brands `AssetGrid` and `BizFlow` |
| `web-architect` | opus | Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Task | **VERIFIED** |

**`proposal-generator` is the broken one.** Its `tools:` list is written in VS Code /
Copilot tool-ID syntax and names MCP servers that are **not configured in this harness** —
Supabase MCP, Vercel MCP, Playwright MCP, HuggingFace MCP, Tavily, MongoDB, Context7.
**VERIFIED** against `claude mcp list`, which returns only 6 servers, none of them these.
The agent will still run (unrecognised entries do not hard-fail) but every research tool it
was designed around is absent, and its `WebSearch`/`WebFetch` are *not* in the list either.
Effectively it has been quietly downgraded to a Read/Write/Edit agent.

### NEXUS-CORE — `.claude/agents/` (2) · **VERIFIED present**

`docker-compose-validator`, `security-auditor`. Neither declares a `tools:` key, so both
inherit the full tool set — worth tightening for `security-auditor` given it is described
as an audit-only agent.

---

## 6. MCP servers

### Configured and live · **VERIFIED via `claude mcp list` (all "✔ Connected")**

| Server | Transport / package | Credential | Resolves? |
|---|---|---|---|
| `rlm` | `uv run --directory GLOBAL_BIO_FOUNDRY/tools/oss-ai-tools/rlm python -m src.rlm_mcp_server` | none | **VERIFIED** — `uv` on PATH, project dir exists with `pyproject.toml`, `src/` |
| `memorix` | `memorix serve` (v1.0.10) | none | **VERIFIED** — binary at `/opt/homebrew/bin/memorix` |
| `open-memory` | `opm mcp` | none | **VERIFIED** — binary at `/opt/homebrew/bin/opm` |
| `rtrvr` | HTTP `https://mcp.rtrvr.ai` | `RTRVR_API_KEY` — **PRESENT** | **VERIFIED** |
| `notebooklm` | `npx -y notebooklm-mcp-server` | Google auth via `~/.notebooklm/` — dir **EXISTS** | **VERIFIED** |
| `chrome-devtools` | plugin, `npx chrome-devtools-mcp@1.7.0` | none | **VERIFIED** |

### Configured elsewhere

- **`browser-use`** — declared in `~/.claude/settings.json` as `browser-use --mcp`.
  Its tools **are present in this session** (`mcp__browser-use__*`), but it did **not**
  appear in `claude mcp list` output. **UNVERIFIED why** — most likely a health-check
  timeout on process spawn rather than a fault. The CLI itself passes `doctor` cleanly.
- **`claude-in-chrome`** — tools present in session; **no config entry found** in
  `~/.claude.json`, `~/.claude/settings.json`, or any `.mcp.json`. This is the built-in
  Chrome-extension integration, not a configured server. **VERIFIED absent from config.**
- **`sentry`** — configured under project scope
  `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform`. That project path is a dead <!-- brand-allow: quotes a real on-disk path as an audit finding -->
  brand directory. **UNVERIFIED** whether the directory still exists (not checked); the
  server is inert outside that cwd regardless.

### `~/.hermes/config.yaml` · **VERIFIED — this is NOT MCP**

It is a model-router config (Ollama / OpenRouter / Ollama-cloud providers), default
`nvidia/nemotron-3-ultra-550b-a55b` via `https://ollama.com/v1`. Uses `${OPENROUTER_API_KEY}`
env indirection — **PRESENT**. No MCP servers defined here.

### Credential presence (names only — no values read or printed) · **VERIFIED**

| Present | Absent |
|---|---|
| `RTRVR_API_KEY`, `FIRECRAWL_API_KEY`, `PERPLEXITY_API_KEY`, `VERCEL_TOKEN`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `SUPABASE_ACCESS_TOKEN`, `HF_TOKEN` | `GITHUB_TOKEN` (gh uses keyring instead — fine), `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `BROWSER_USE_API_KEY` |

`PERPLEXITY_API_KEY` is present but **no Perplexity MCP server is configured** — a paid
capability sitting unused. `SUPABASE_ACCESS_TOKEN` is present but Supabase MCP is likewise
not configured, which is exactly what `proposal-generator` was written against.

---

## 7. CLIs · **ALL 8 VERIFIED WORKING**

| CLI | Path | Version | Functional check |
|---|---|---|---|
| `browser-use` | `~/.local/bin/browser-use` | (no `--version`; subcommand help renders) | **`doctor` → all 5 checks pass**: package, browser profile, network, cloudflared, profile-use |
| `rtrvr` | `/opt/homebrew/bin/rtrvr` | 0.2.1 | `--help` lists `auth`, `run`, `agent` |
| `firecrawl` | `/opt/homebrew/bin/firecrawl` | 1.6.2 | **`--status` → Authenticated**, 0/2 concurrency, 1,175 credits |
| `gh` | `/opt/homebrew/bin/gh` | 2.88.1 | **`auth status` → logged in** as `Taas-ai` (keyring), ssh protocol, broad scopes |
| `vercel` | `/opt/homebrew/bin/vercel` | 50.35.0 | **`whoami` → `taurusai-io`** |
| `ollama` | `~/bin/ollama` | 0.32.15 | **`list` → 11 models**; only `mannix/llama3.1-8b-abliterated` (4.7 GB) is local, the other 10 are `:cloud` |
| `gws` | `/opt/homebrew/bin/gws` | 0.22.3 | `--help` renders full service/resource/method grammar |
| `agent-reach` | `~/.local/bin/agent-reach` | 1.5.0 | **`doctor --json` → mixed**, see below |

### `agent-reach doctor` detail · **VERIFIED**

| Channel | Status | Note |
|---|---|---|
| youtube | **ok** | yt-dlp backend active; transcription via groq |
| bilibili | **ok** | search API reachable via curl |
| github | **warn** | `gh` present and authed, but doctor declines to verify (avoids writing a device-id) |
| twitter | **warn** | `twitter-cli` installed, credentials incomplete |
| reddit | **off** | no backend installed |
| facebook | **off** | no backend installed |
| instagram | **off** | no backend installed |

So `agent-reach`'s advertised "13 platforms" is, right now, **2 fully working, 2 partial,
3+ off**. **UNVERIFIED:** the remaining channels (xiaohongshu, V2EX, LinkedIn, 小宇宙, 雪球, RSS)
were beyond the head of the JSON output I read.

### Supporting CLIs · **VERIFIED all on PATH**

`tesseract`, `magick`/`convert`, `pdftoppm`, `playwright`, `ruff`, `pytest`, `gitleaks`,
`pre-commit`, `jq`, `yt-dlp`, `cloudflared`, `codemap`, `memorix`, `opm`, `uv`, `node`, `npx`.

---

## 8. Hooks · **VERIFIED — every referenced script exists**

20 hook commands across 6 events. `codemap` (`/opt/homebrew/bin/codemap`) backs 5 of them.
All 11 scripts in `~/.claude/hooks/` and both `tools/reflect/hooks/` scripts resolve.

| Event | Hooks |
|---|---|
| `SessionStart` | `codemap hook session-start`, `account-tripwire.py` |
| `UserPromptSubmit` | `codemap hook prompt-submit`, `fable-5-prompt-inject.py`, **`reflect/hooks/retrieve.py`**, `session-output-dual-format.py` |
| `PreToolUse` (Edit/Write) | `codemap hook pre-edit`, `edit-prevalidate.py` |
| `PreToolUse` (Bash) | `local-inference-block.py`, `fable-5-dangerous-bash.py`, **`hitl-outbound-gate.py`**, `logout-guard.py`, `workspace-escape-guard.py` |
| `PreToolUse` (Artifact) | `public-artifact-gate.py` |
| `PostToolUse` | `codemap hook post-edit` |
| `PreCompact` | `codemap hook pre-compact`, inline continuity-snapshot writer → `.claude/continuity-auto.md` |
| `SessionEnd` | `codemap hook session-stop`, **`reflect/hooks/on_session_end.py`** (async), `mcp-session-cleanup.py` |

One observed failure during this audit: `SessionEnd hook [codemap hook session-stop] failed:
Hook cancelled` when `claude mcp list` exited. **UNVERIFIED** whether this is chronic or an
artifact of a short-lived subprocess session.

NEXUS-CORE adds its own project hooks (`edit-prevalidate.py`, `.env`/`docker-compose` write
blocker, `ruff format` on `.py`) — **VERIFIED** present in
`NEXUS-CORE/.claude/settings.json`.

Permissions: `defaultMode: "auto"`, **75 allow rules, 0 deny rules**. **VERIFIED.** A zero-length
deny list with auto mode is worth a deliberate second look — the `hitl-outbound-gate.py` hook
is currently the only thing standing between the agent and an outbound send.

---

## 9. Stage-to-tool routing map

| Stage | **USE THIS** | Fallback | Why it wins |
|---|---|---|---|
| **Research the web / gather evidence** | Built-in `WebSearch` + `WebFetch` | `firecrawl search --scrape` for citable snapshots; `last30days` skill for recency-weighted social sentiment | Zero setup, no credit burn, allow-listed. `agent-reach` reads well on paper but doctor shows only 2 of 7 checked channels fully live — do not route general research there. `PERPLEXITY_API_KEY` exists with no server to use it: **unused capability**. |
| **Scrape structured data** | `firecrawl` CLI (v1.6.2, authed, 1,175 credits) | `rtrvr cloud_scrape` MCP | Firecrawl is the only scraper verified authenticated with headroom. **Hard limit: 2 concurrent jobs** — always `-o` to a file, never into context. `rtrvr` wins only when the target needs your real logged-in Chrome session. |
| **Drive a browser as a human** | `browser-use` (CLI + MCP; `doctor` all-green) | `rtrvr` MCP for auth'd Chrome-session work | browser-use is the only browser tool that passed a full self-diagnostic. **`claude-in-chrome` is explicitly disallowed** by the global CLAUDE.md (hijacks the Chrome profile) even though its tools are loaded — treat its presence as a trap, not an option. |
| **Visual verification of a rendered page** | `chrome-devtools` MCP `take_screenshot` → `Read` the PNG | `browser-use screenshot`; `tesseract` for OCR of text-heavy captures | Claude reads images natively, so screenshot + `Read` beats OCR for layout judgement. `chrome-devtools` also uniquely offers `lighthouse_audit`, `list_console_messages`, `list_network_requests` — the only verified path to console/network evidence. `tesseract` **VERIFIED installed** but is a fallback for dense text only. |
| **Design and design-system work** | `high-end-visual-design` (enabled) | `redesign-existing-projects` for existing surfaces; `critique` / `position-me` for scored audits | **This stage is the most damaged.** 14 design skills are switched off, including the two strongest (`design-taste-frontend`, `emil-design-eng`) and the whole `imagegen-*`/`image-to-code` chain. `superdesign-website` is enabled but its animation reference lives inside the disabled `luxury-brand-design`. Recommend re-enabling `design-taste-frontend` + `luxury-brand-design` as the highest-leverage single change in this audit. |
| **Write code / implement** | Base Claude Code tools (Read/Edit/Write/Grep) | `fable-mode` / `fable-opus` when the task spans many files or sessions; `code-simplifier` plugin for cleanup | The fable ladder is real and its agent files are all verified. **Gap:** `fable-sonnet` is off, so the cost-balanced middle rung is unreachable — you can only run Opus or Haiku. `context7` (library docs) is installed but **disabled**, so there is no verified live-docs lookup path. |
| **Test and drive a suite to green** | `tdd-green` skill (enabled) | Direct `pytest` / `npm test` per the project CLAUDE.md | Only skill purpose-built for the loop. Caveat: 2 of the 3 repos in its lookup table no longer exist — ignore that table, pass the command explicitly. |
| **Security review** | Built-in `/security-review` for diffs | `security-ops` skill (its `multi_agent_pipeline/recon.py` **verified present**); `/vuln-scan`, `/recon`; NEXUS-CORE `security-auditor` agent; `gitleaks` + `pre-commit` locally | Four overlapping options. `/security-review` wins for changed code because it is scoped to the diff. `security-ops` wins for infrastructure/OSINT. The `security-auditor` project agent inherits **all** tools with no allowlist — prefer the built-in unless you need repo-specific rules. |
| **Deploy** | `vercel` CLI directly (v50.35.0, authed as `taurusai-io`) | `gh` for CI inspection (`gh run view --log-failed`) | **Do not use the `deploy-nexus` skill** — verified broken. Use the per-directory commands in `NEXUS-CORE/CLAUDE.md` (`vercel --cwd platform --prod`). `/ship` is documented but **does not exist**. |
| **Memory and continuity across sessions** | `reflect` + `reflect-stage` (both enabled, both hooks verified wired) | `save-state` skill for explicit checkpoints; `PreCompact` continuity snapshot fires automatically | Four memory systems overlap here: reflect, `memorix` MCP, `open-memory` MCP, and `codemap`. **reflect wins** because it is the only one with both a write hook (`SessionEnd`) and a read hook (`UserPromptSubmit → retrieve.py`) — retrieval is automatic even though the `recall` skill itself is off. `memorix` and `open-memory` are both connected but have no hook wiring, so they only work when explicitly invoked — **pick one and retire the other**. |

### Stages with NO good tool — the real gaps

1. **Live library/API documentation lookup.** `context7` is installed but disabled; no
   Perplexity server despite a valid key. Today this falls back to `WebFetch`, which is
   slower and less reliable for versioned API surfaces. **VERIFIED gap.**
2. **A working end-to-end deploy pipeline command.** `/ship` and `/health` are documented
   in CLAUDE.md and exist nowhere. `deploy-nexus` is broken. There is no single verified
   lint→test→build→deploy→verify entry point. **VERIFIED gap.**
3. **Structured planning.** `/plan` and `/plan:status` are documented and the
   `planning-with-files` plugin files exist — but the plugin is not registered, so neither
   command loads. **VERIFIED gap, and the cheapest one to close.**
4. **Reddit / Twitter / Facebook / Instagram evidence gathering.** `agent-reach` doctor
   reports these `off` or `warn`. `last30days` claims Reddit and X coverage but I did not
   execute it. **PARTIALLY VERIFIED gap.**
5. **Mid-tier staged execution.** `fable-sonnet` off means no Sonnet rung between Opus
   (expensive) and Haiku (the skill's own description warns its quality effect on Haiku
   swung both directions at n=1). **VERIFIED gap.**

---

## 10. Dead weight — what to do about each

Ordered by cost of leaving it in place.

| # | Item | Verdict | Recommended action |
|---|---|---|---|
| **1** | **`skillOverrides` — 47 skills off** in `~/.claude/settings.json` | **VERIFIED** | Not dead weight per se, but it makes 64% of the library invisible. Triage the list: re-enable `design-taste-frontend`, `luxury-brand-design`, `fable-sonnet`, `recall`, `context7`; leave the marketing/VC/pricing cluster off. **Highest-leverage change in this audit.** |
| **2** | **`deploy-nexus` + `deploy-nexus 2`** (NEXUS-CORE) | **VERIFIED BROKEN + VERIFIED EMPTY** | Delete `deploy-nexus 2` (empty macOS artifact). Rewrite `deploy-nexus` against `06-AUTOMATION/social-suite-dashboard/` and strip the dead brand "NeoSync" — or delete it and rely on the CLAUDE.md commands. It will trip the brand guard as written. |
| **3** | **`proposal-generator` agent's tool allowlist** | **VERIFIED BROKEN** | ~180 tool IDs in VS Code syntax naming 9 MCP servers that are not configured. Rewrite the `tools:` key to real Claude Code tools (`Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Task`) or the agent silently runs with no research capability. |
| **4** | **8 phantom slash commands** (`/scout /hunter /roast /health /ship /launch-checklist /plan /plan:status`) | **VERIFIED MISSING** | Two fixes: register the `planning-with-files` plugin to recover `/plan` and `/status`; then **correct the global CLAUDE.md command table** — it currently advertises 18 commands, 8 of which don't exist, which sends every session down dead ends. |
| **5** | **`/Users/user/` placeholder paths** in `~/.claude/commands/scrape.md`, `HEDERA/.claude/commands/{ceo,scrape}.md` | **VERIFIED BROKEN** | Search-and-replace `/Users/user/` → `/Users/taurus_ai/`. Also drop the `HEDERA/Q-GRID` reference in `ceo.md` — retired brand, directory absent. |

### Also worth clearing (lower priority)

| Item | Verdict | Action |
|---|---|---|
| 7 duplicated `higgsfield-*` skills in HEDERA | **VERIFIED byte-identical** to global copies | Delete the HEDERA copies, or delete the global ones — but not both sets. Currently 6 of 7 global copies are `off`, so the HEDERA copies are the live path only inside that repo. Confusing either way. |
| `memorix` **or** `open-memory` MCP | Both **VERIFIED connected**, neither hook-wired | Redundant with each other and with `reflect`. Pick one, remove the other from `~/.claude.json`. |
| `cinematic-video`, `taurus-logo-forge` | **VERIFIED BROKEN** (missing `BizFlow-Nexus-Platform/`, missing `vectorize.sh`) | Already `off`. Delete or repair; do not re-enable as-is. |
| `last30days/nux-wizard.md` | **VERIFIED MISSING**, skill is **enabled** | Reinstall the skill from its marketplace (`mvanhorn/last30days-skill`) to restore the file. |
| `provenir-sourcer` agent | **VERIFIED** file, but `~/.provenir/jobs.db` **absent** | Agent will fail on first query. Either create the DB via its cron, or disable the agent. |
| `sentry` MCP under `BizFlow-NeoVibe-Platform` project scope | Dead brand path | Remove the project-scoped entry from `~/.claude.json`. | <!-- brand-allow: quotes a real on-disk path as an audit finding -->
| Plaintext `rtrvr` API key inline in `~/.claude.json` project scope | **VERIFIED** | Rotate the key, then replace the inline URL with the `${RTRVR_API_KEY}` form already used by the global entry. **Value not recorded in this document.** |
| `permissions.deny` is empty with `defaultMode: "auto"` | **VERIFIED** | Not broken, but the HITL outbound gate is the sole guard. Consider explicit deny rules for `vercel --prod`, `git push`, and send-shaped commands. |

---

## Appendix — what I could NOT verify

- **`browser-use` MCP server registration.** Its tools are live in-session but it did not
  appear in `claude mcp list`. Cause unknown; the CLI passes `doctor` independently.
- **`agent-reach` channels beyond the first 7** (xiaohongshu, V2EX, LinkedIn, 小宇宙, 雪球, RSS) —
  truncated from the JSON output I read.
- **GLOBAL_BIO_FOUNDRY's 3 skills** — frontmatter read only; no scripts to resolve, no
  behaviour exercised.
- **Whether any skill actually *behaves* as described.** I verified existence, path
  integrity, and enablement. I did not execute a skill end-to-end; doing so would have
  meant network writes or file mutation, which the audit brief excluded.
- **The `codemap hook session-stop` failure** seen once during this audit — chronic or
  incidental is unknown.
- **`HEDERA/.claude/skills/` non-higgsfield skills** (`bsv-blockchain-deploy`, `colab-devops`,
  `gws-automation`, `india-fintech-compliance`, `web3-ecommerce`) — descriptions read;
  referenced paths not resolved individually.
