# Handoff: Deploy YQG Assistant Worker — Zero-Subscription Path

**For: Claude Desktop agent (or any human operator with terminal access)**
**From: Claude Code session, 2026-04-24**
**Objective: Make `https://yqg-assistant.vercel.app` actually speak when Tim clicks "Talk to your YQG Assistant" — at $0/month until revenue lands.**

---

## Current state (read this first)

- ✅ Frontend deployed to Vercel: `yqg-assistant.vercel.app`
- ✅ LiveKit token endpoint works, returns clean tokens
- ✅ YQG persona prompt written: `prompts/yqg-persona.txt`
- ✅ YQG worker module written: `backend/yqg_worker.py`
- ✅ Fly deploy config written: `backend/fly.yqg-worker.toml`
- ✅ YQG tool integrations scaffolded: `backend/yqg_tools.py`
- ❌ **No worker process is running anywhere.** Button click → silence.
- ❌ LiveKit project URL leaks "nexus-voice-agent" subdomain in network tab.

All source in: `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant/`

---

## The rule: $0 subscription until revenue

Do NOT enable any paid tier unless the operator explicitly approves it. Fly.io bills ~$5–15/mo per worker after the initial $5 free credit exhausts (typically ~30–45 days). Until YQG or another client pays, prefer one of the free-tier paths below.

---

## Deployment paths — pick in order of preference

### Path A: Run worker locally on operator's MacBook (FREE, tied to laptop uptime)

**Best for:** Today's demo window. Operator is running the laptop during Tim's test window anyway.

**Cost:** $0 forever. Electricity only.

**Catch:** Worker dies when laptop sleeps. For a 1-hour pitch window, fine. For 24/7, pick Path B or C.

**Steps:**
```bash
cd /Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/backend

# 1. Install deps (~3–5 min first run)
python3 -m pip install --user -e ".[dev]" \
  "livekit-agents[silero,groq,deepgram]>=1.0"

# 2. Drop in YQG persona files (copy from fork)
FORK=/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant
cp "$FORK/backend/yqg_worker.py" src/integrations/
cp "$FORK/backend/yqg_tools.py"  src/tools/
mkdir -p prompts && cp "$FORK/prompts/yqg-persona.txt" prompts/

# 3. Run worker (keep this terminal open)
NEXUS_AGENT_NAME=yqg-agent \
  YQG_PERSONA_PROMPT="$(cat prompts/yqg-persona.txt)" \
  python3 -m src.integrations.yqg_worker dev
```

Flip Vercel env:
```bash
cd "$FORK"
vercel env rm AGENT_NAME production --yes
echo "yqg-agent" | vercel env add AGENT_NAME production
vercel --prod --yes
```

**Test:** open `https://yqg-assistant.vercel.app`, click Talk. Worker terminal should log `"Job received — room:"`.

---

### Path B: Fly.io with free $5 credit (works ~30–45 days free, then ~$8/mo)

**Best for:** You need always-on reliability and you're OK with ~$8/mo after ~45 days.

**Free-credit math:** $5 Fly credit / (~$0.20/day for shared-cpu-1x@1gb) ≈ 25–30 days.

**Steps:**
```bash
cd /Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/backend

# One-time auth (opens browser)
~/.fly/bin/fly auth login
# If fly CLI not installed:
#   curl -L https://fly.io/install.sh | sh

# Drop in YQG files (same as Path A)
FORK=/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant
cp "$FORK/backend/yqg_worker.py" src/integrations/
cp "$FORK/backend/yqg_tools.py"  src/tools/
cp "$FORK/backend/fly.yqg-worker.toml" .
mkdir -p prompts && cp "$FORK/prompts/yqg-persona.txt" prompts/

# Launch app (takes no machine yet)
~/.fly/bin/fly launch \
  --config fly.yqg-worker.toml \
  --name nexus-local-worker-yqg \
  --no-deploy \
  --copy-config \
  --region iad

# Load secrets (pull from existing backend .env)
ENV=./.env
~/.fly/bin/fly secrets set \
  NEXUS_AGENT_NAME=yqg-agent \
  YQG_PERSONA_PROMPT="$(cat prompts/yqg-persona.txt)" \
  GROQ_API_KEY="$(grep ^GROQ_API_KEY= $ENV | cut -d= -f2- | tr -d '"')" \
  LIVEKIT_URL="$(grep ^LIVEKIT_URL= $ENV | cut -d= -f2- | tr -d '"')" \
  LIVEKIT_API_KEY="$(grep ^LIVEKIT_API_KEY= $ENV | cut -d= -f2- | tr -d '"')" \
  LIVEKIT_API_SECRET="$(grep ^LIVEKIT_API_SECRET= $ENV | cut -d= -f2- | tr -d '"')" \
  --app nexus-local-worker-yqg

# Deploy
~/.fly/bin/fly deploy --config fly.yqg-worker.toml --remote-only

# Scale down to 0 when not pitching (saves credits):
~/.fly/bin/fly scale count worker=0 --app nexus-local-worker-yqg
# Scale back up before a demo:
~/.fly/bin/fly scale count worker=1 --app nexus-local-worker-yqg
```

Then flip Vercel `AGENT_NAME=yqg-agent` (same as Path A).

---

### Path C: HuggingFace Space (FREE tier, ZeroGPU, BUT Gradio UI only)

**Best for:** Showing the agent as a standalone HF Space demo. Not integrated with the Vercel frontend.

**Cost:** $0 forever on ZeroGPU tier.

**Catch:** Won't power the `yqg-assistant.vercel.app` LiveKit flow. Completely separate surface.

**Steps:**
```bash
cd /Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/hf-space

# Needs huggingface_hub CLI
hf auth login

# Create space (first time only)
hf repo create yqg-assistant --repo-type space --space_sdk gradio

# Clone, copy, push
git clone https://huggingface.co/spaces/Q-GRID/yqg-assistant /tmp/yqg-space
cp app.py requirements.txt /tmp/yqg-space/
cd /tmp/yqg-space
git add . && git commit -m "YQG Assistant HF Space"
git push

# Set secrets in HF UI: huggingface.co/spaces/Q-GRID/yqg-assistant/settings
#   GROQ_API_KEY, plus any tools
```

URL: `https://huggingface.co/spaces/Q-GRID/yqg-assistant`

---

## The one-off IP cleanup to do while you're in the terminal

1. **Create a new LiveKit Cloud project** (2 min, $0 on LK free tier):
   - Go to https://cloud.livekit.io → New Project → name it `yqg-assistant` or `taurus-voice-01`
   - Copy new URL/key/secret from Settings → Keys
   - Update `backend/.env` with the new values
   - Update Vercel env:
     ```bash
     cd "$FORK"
     for K in LIVEKIT_URL LIVEKIT_API_KEY LIVEKIT_API_SECRET; do
       vercel env rm "$K" production --yes
     done
     # Then add the new values
     ```
   - Redeploy worker (Path A or B) + redeploy frontend (`vercel --prod --yes`)
   - **Result:** WebSocket URL Tim sees in network tab becomes `wss://yqg-assistant-xxx.livekit.cloud` instead of `nexus-voice-agent-*`.

2. **Rotate leaked tokens** (the old `.mcp.json` had them committed):
   - HuggingFace: https://hf.co/settings/tokens → revoke old, create new
   - Shodan: https://account.shodan.io → regenerate key
   - Update local shell profile / `.env` with new values. The stripped `.mcp.json` references `${HF_TOKEN}` / `${SHODAN_API_KEY}` env vars.

---

## How to verify it's actually working

```bash
# 1. Frontend still serves
curl -s -o /dev/null -w "%{http_code}\n" https://yqg-assistant.vercel.app
# → 200

# 2. Token endpoint mints valid tokens
curl -s -X POST https://yqg-assistant.vercel.app/api/token \
  -H "Content-Type: application/json" \
  -d '{"roomName":"verify","participantName":"v"}' | python3 -c 'import sys,json; d=json.load(sys.stdin); print("URL clean:", "\\n" not in d["serverUrl"])'
# → URL clean: True

# 3. Worker is dispatched when a browser joins
# → Open yqg-assistant.vercel.app in Chrome, click Talk, allow mic
# → Say: "Draft a proposal for a Windsor plumber, five thousand budget"
# → You should hear the agent respond in under 3 seconds
```

---

## Pricing discipline — what triggers a spend

| Trigger | Cost | Approval needed |
|---|---|---|
| Fly worker running 24/7 past free credit | ~$8/mo | Yes — wait for paid client |
| LiveKit Cloud usage over free tier (~10k mins/mo) | ~$0.005/min | Yes |
| Groq API past free tier (~14.4k req/day) | ~$0.05/1M tok | Yes |
| Firecrawl API for competitor scraping | $19/mo Starter | Yes |
| DataForSEO for real SEO lookups | $5 per 1k keywords | Yes |
| Google Docs API for proposal export | Free (OAuth only) | No |

Until any of those trigger, keep the system on Path A (local worker) or Path B with scale-to-zero.

---

## If something breaks

1. **"No agent answered"** → worker not running. `fly status` or check local terminal.
2. **"Token endpoint 500"** → check Vercel env vars don't have trailing newlines. Use `printf '%s'` not `echo` when piping to `vercel env add`.
3. **"LiveKit connection refused"** → LIVEKIT_URL has `\n` in it. Strip with `tr -d '\n\r'`.
4. **"Module not found: @/enterprise/..."** → the frontend depends on `enterprise/` dir. Make sure it's copied alongside `components/`, `hooks/`, etc.

---

## Who to tell when it's live

Reply to Claude Code session (or the operator's ops channel): *"YQG worker live via Path [A/B/C], AGENT_NAME flipped to yqg-agent, tested end-to-end with proposal prompt."* Then Claude Code will send the PDFs + URL to Tim.

**Do not share the URL with Tim until the end-to-end voice test works.**
