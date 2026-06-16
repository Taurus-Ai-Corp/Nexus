# Agent-Reach Integration Analysis
## For Taurus AI / Nexus Platform

---

## 1. What Agent-Reach Is

**Agent-Reach** (`Panniantong/Agent-Reach`) is a Python CLI + library that gives AI agents
read/search access to 13+ internet platforms without paid APIs. It is an
**installer + doctor + router** — not a wrapper. After install, agents call
upstream open-source tools directly.

- **License:** MIT
- **Language:** Python 3.10+
- **Architecture:** CLI (`agent_reach/cli.py`) + channel modules (`agent_reach/channels/*.py`) + config/doctor + optional MCP server
- **Design:** Each platform = ordered list of backends (preferred + fallback). `agent-reach doctor` probes which works.

### Supported platforms

| Platform | Tier | Backends used |
|----------|------|---------------|
| Web | 0 (zero-config) | Jina Reader |
| YouTube | 0 | yt-dlp |
| RSS | 0 | feedparser |
| Bilibili | 0/1 | bili-cli, OpenCLI |
| GitHub | 1 | gh CLI |
| Twitter/X | 2 | twitter-cli, OpenCLI, bird |
| Reddit | 2 | OpenCLI, rdt-cli |
| Xiaohongshu | 2 | OpenCLI, xiaohongshu-mcp, xhs-cli |
| LinkedIn | 1/2 | linkedin-mcp, Jina Reader |
| Xueqiu | 0 | native API |
| V2EX | 0 | native API |
| Exa search | 0 | mcporter + Exa MCP |
| Xiaoyuzhou podcast | 2 | Whisper + API |

---

## 2. Why It Matters for Taurus AI

Taurus AI is building:
- **Nexus Creative** — AI campaign studio (copy, images, platform plans)
- **Business intelligence / OSINT pipelines**
- **Multi-agent operations and outreach**

Agent-Reach directly solves four Taurus needs:

### A. Market Intelligence (free)
Read Reddit, Twitter/X, Xiaohongshu, V2EX, Xueqiu, web pages, and RSS feeds
without paid APIs. This feeds competitive analysis, trend spotting, and GTM research.

### B. Content Sourcing (free)
Pull YouTube/Bilibili transcripts, podcast audio, web articles, and RSS updates
that can become campaign briefs or social content.

### C. Social Outreach Automation
After configuration with cookies, Agent-Reach enables reading/searching Twitter,
Reddit, LinkedIn, Xiaohongshu. Taurus can use this to:
- Find prospects by keyword/location
- Monitor brand mentions
- Extract leads for Nexus Creative outreach

### D. Agent Capability Expansion
Any Taurus agent (Hermes, Claude Code, OpenClaw, Cursor) can gain internet
access by installing Agent-Reach and reading its generated `SKILL.md`.

---

## 3. Integration Points

### 3.1 Install as a Taurus capability layer

```bash
# In any Taurus workspace
pip install -e /Users/taurus_ai/Documents/Nexus-Platform/SWARM\ SR\ Internal\ Analysis/Agent-Reach
```

Then agents can run:
```bash
python -m agent_reach.cli doctor
```

### 3.2 Embed into Nexus Creative as a research module

Create a new FastAPI endpoint:
- `POST /api/research` — accepts `{ query, sources: ['reddit','twitter','web','xhs'] }`
- Calls Agent-Reach channels to gather raw results
- Returns summarized findings for campaign briefs

File to create:
`/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/api/research.py`

### 3.3 Add a "Competitive Intel" feature to Nexus

Use Agent-Reach's web + search channels to:
- Read competitor landing pages
- Pull Reddit discussions about a competitor
- Search Twitter for complaints/praise
- Summarize into a competitive gap report

### 3.4 Use as an MCP tool inside Hermes

Agent-Reach exposes an MCP server:
```bash
python -m agent_reach.integrations.mcp_server
```
Tool name: `get_status` (returns doctor report)

This can be added to Hermes' `config.yaml` MCP servers so Hermes can ask
"Which internet channels are currently healthy?"

### 3.5 Feed OSINT pipeline in `02-INTEGRATIONS_OSINT`

The existing Taurus OSINT workspace can use Agent-Reach as a unified fetcher
instead of maintaining separate scrapers for Reddit, Twitter, LinkedIn, etc.

---

## 4. Immediate Action Plan

### Step 1 — Install and test locally (5 min)
```bash
cd "/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach"
pip install -e .
python -m agent_reach.cli doctor
```

Expected result: web, YouTube, RSS, V2EX, Xueqiu should show green immediately.

### Step 2 — Add a Nexus Creative research API (30 min)
Create `/api/research.py` in the Vercel project that:
- Accepts a query and channel list
- Uses Agent-Reach's Python API (or subprocess calls) to fetch
- Returns JSON summary

### Step 3 — Configure high-value channels
For Dubai GTM, priority channels are:
1. **LinkedIn** — B2B prospects, company pages, job posts
2. **Twitter/X** — brand chatter, tech discourse
3. **Reddit** — r/smallbusiness, r/marketing, location subreddits
4. **Web** — competitor pages, press releases
5. **Xiaohongshu** — if targeting Chinese-speaking Dubai consumers

Each requires cookie login. Use dedicated test accounts.

### Step 4 — Add to Hermes MCP / skills
Add the Agent-Reach MCP server to Hermes config and/or install its SKILL.md so
Hermes agents automatically know how to use it.

---

## 5. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Cookie-based auth can trigger platform bans | Use dedicated test/alt accounts, never main accounts |
| Upstream CLI tools break or change | Agent-Reach maintains fallback backends; monitor `doctor` output |
| Legal / ToS concerns for scraping | Read public data only; respect robots.txt; use official tools (gh, yt-dlp) where possible |
| Server deployment needs proxy | Optional $1/month residential proxy only if IP is blocked |
| Vercel serverless can't run subprocess CLIs | Use Python API channels (web.py, rss.py, xueqiu.py, v2ex.py) which are pure Python; avoid CLI-dependent channels in `/api` |

---

## 6. Recommended First Integration

**Start with the zero-config channels inside a Vercel API function:**
- `WebChannel.read(url)` — Jina Reader
- `ExaSearchChannel` — semantic web search via mcporter
- RSS feeds
- V2EX and Xueqiu APIs

These do not require cookies, system packages, or subprocess calls. They work
reliably in a serverless function.

For channels requiring cookies (Twitter, Reddit, LinkedIn, Xiaohongshu), run
Agent-Reach in a persistent Python process or local cron job that feeds a
Notion/Google Sheet/CRM.

---

## 7. Files and Paths

- Repo clone: `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach`
- This analysis: `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/AGENT-REACH-INTEGRATION.md`

---

## 8. Next Decision

Choose one:
1. **Install Agent-Reach locally and run `doctor`** — verify what works now
2. **Build `/api/research.py` for Nexus Creative** — add a zero-config research endpoint
3. **Configure LinkedIn/Twitter/Reddit cookies** — unlock social outreach channels
4. **Add Agent-Reach as an Hermes skill / MCP server** — agent-level internet access

Which do you want first?
