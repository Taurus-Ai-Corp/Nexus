# YQG AI Assistant

A voice-first AI assistant built for **YQG Digital** (Windsor, Ontario) by **TAURUS AI Corp**.

Forked from [NEXUS-LOCAL](https://github.com/Taurus-Ai-Corp/nexus-local), rebranded for YQG Digital's five primary agency-owner use cases:

1. Hands-free proposal drafting during client visits
2. Live SEO research (keywords, local intent, competitor rankings)
3. Competitor teardown voice briefs
4. Client FAQ auto-responder
5. Voice memo → structured content brief

## Stack

- **Frontend**: Next.js 15, React 19, LiveKit `@agents-ui`, Tailwind v4
- **Backend**: Shared with NEXUS at `https://nexus-local-api.fly.dev` (persona swapped via `NEXUS_SYSTEM_PROMPT_FILE` env)
- **Voice pipeline**: Silero VAD → Groq Whisper STT → Groq Llama 3.3 70B → TTS (Groq Orpheus or local Kokoro)
- **Agent name**: `yqg-agent` — separate worker process alongside the default `nexus-agent`

## Deploy

```bash
pnpm install
cp .env.example .env.local       # then fill in LiveKit credentials
pnpm dev

# Production
vercel --prod --yes
vercel domains add yqg-assistant.taurusai.io
```

## Backend worker (YQG persona)

The YQG worker lives in the NEXUS repo at
`backend/src/integrations/yqg_worker.py`. Deploy as a separate Fly app
(`nexus-local-worker-yqg`) so the YQG persona is served independently:

```bash
cd NEXUS-LOCAL-VOICE-ASSISTANT/backend
fly auth login
fly launch --config fly.yqg-worker.toml --name nexus-local-worker-yqg --no-deploy
fly secrets set NEXUS_AGENT_NAME=yqg-agent \
                GROQ_API_KEY=$GROQ_API_KEY \
                LIVEKIT_URL=$LIVEKIT_URL \
                LIVEKIT_API_KEY=$LIVEKIT_API_KEY \
                LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET \
                --app nexus-local-worker-yqg
fly deploy --config fly.yqg-worker.toml --remote-only
```

## Demo script (for Tim @ YQG Digital)

Voice prompts that showcase each use case:

- **Proposal**: *"Draft a proposal for a Windsor plumber website, $5K budget."*
- **SEO**: *"What would a local SEO strategy look like for a Windsor HVAC contractor?"*
- **Competitor**: *"Analyze thewebmechanic.com — what should YQG know about them?"*
- **FAQ**: *"A client asks why their rankings dropped last month. How should I respond?"*
- **Content**: *"Give me five blog post ideas for a Windsor-Essex home services company."*

## Brand

Aligned with the TAURUS AI intro PDFs already sent to Tim:
- Accent: `#b88a3d` (warm gold) / `#d9b377` (dark-mode bright)
- Voice: direct, confident, dry — never sycophantic
- Max response: 1–3 spoken sentences (voice-first)
