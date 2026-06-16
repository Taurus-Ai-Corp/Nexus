# Agent-Reach Cookie Auth Setup Guide
## For LinkedIn, Twitter/X, Reddit outreach via Nexus/Taurus

---

## ⚠️ Critical rule

Use **dedicated test/alt accounts** for cookie auth. Never use your main accounts.
Platforms may detect non-browser API usage and restrict or ban accounts.

---

## Step 1 — Install browser cookie extraction (local machine)

```bash
cd "/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach"
source .venv/bin/activate
pip install browser-cookie3
# or rookiepy if available
```

---

## Step 2 — Export cookies with Cookie-Editor extension

1. Install **Cookie-Editor** in Chrome:
   https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm

2. Log into each platform in Chrome with your **dedicated test account**:
   - https://www.linkedin.com
   - https://x.com
   - https://www.reddit.com
   - https://www.xiaohongshu.com (if needed)

3. For each site, click the Cookie-Editor icon → **Export** → **Netscape format**
   - Or use JSON format and paste below

---

## Step 3 — Save cookies to Agent-Reach config

Agent-Reach stores config at `~/.agent-reach/config.yaml`.

Edit the file:
```bash
nano ~/.agent-reach/config.yaml
```

Add cookie strings in this format:

```yaml
linkedin_cookie: "li_at=YOUR_VALUE; jsessionid=YOUR_VALUE"
twitter_auth_token: "YOUR_AUTH_TOKEN"
twitter_ct0: "YOUR_CT0"
reddit_cookie: "reddit_session=YOUR_VALUE; token_v2=YOUR_VALUE"
xiaohongshu_cookie: "web_session=YOUR_VALUE"
```

To get exact cookie names per platform, use Cookie-Editor export or run:
```bash
python3 -c "import browser_cookie3; print([c.name for c in browser_cookie3.chrome(domain_name='.linkedin.com')])"
```

---

## Step 4 — Verify each channel

```bash
cd "/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach"
source .venv/bin/activate
python -m agent_reach.cli doctor
```

You should see:
- ✅ Twitter/X 推文
- ✅ Reddit 帖子和评论
- ✅ LinkedIn 职业社交

If any shows `[!]` or `[X]`, check the cookie string and retry.

---

## Step 5 — Test search commands

```bash
# Twitter/X
twitter search "Dubai creative agency"

# Reddit (OpenCLI)
opencli reddit search "Dubai marketing agency"

# LinkedIn (MCP or Jina fallback)
# Requires linkedin-mcp server or browser automation
```

---

## Step 6 — Use in Nexus/Taurus workflows

Once configured, Agent-Reach can feed Taurus pipelines:
1. **Lead discovery** — search Twitter/Reddit/LinkedIn for prospects
2. **Social listening** — monitor keywords about Dubai SMBs / AI creative tools
3. **Outreach personalization** — read prospect profiles and craft cold messages
4. **Content sourcing** — pull trending discussions into campaign briefs

---

## Automated helper script

A helper script is saved at:
`/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/agent-reach-cookie-helper.py`

Run it to load cookies from browser_cookie3 and save to Agent-Reach config:
```bash
source "/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach/.venv/bin/activate"
python "/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/agent-reach-cookie-helper.py"
```

This only works if you are logged in with the test accounts in Chrome.

---

## Next step

Log into LinkedIn, Twitter/X, and Reddit with test accounts in Chrome, then run the helper script.
