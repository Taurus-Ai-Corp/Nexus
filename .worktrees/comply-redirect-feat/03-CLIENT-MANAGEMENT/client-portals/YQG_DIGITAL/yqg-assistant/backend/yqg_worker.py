"""YQG Digital LiveKit Agent Worker (livekit-agents v1.x).

A rebranded fork of NEXUS-LOCAL's livekit_worker.py that serves the YQG Digital
persona instead of NEXUS. Deploy as a separate Fly app (`nexus-local-worker-yqg`)
alongside the default `nexus-local-worker`.

Drop this file into the NEXUS-LOCAL backend repo at:
    backend/src/integrations/yqg_worker.py

Then update/add a `fly.yqg-worker.toml` to Fly and deploy:

    cd backend
    fly launch --config fly.yqg-worker.toml --name nexus-local-worker-yqg --no-deploy
    fly secrets set NEXUS_AGENT_NAME=yqg-agent \\
                    YQG_PERSONA_PROMPT="$(cat prompts/yqg-persona.txt)" \\
                    GROQ_API_KEY=... \\
                    LIVEKIT_URL=... \\
                    LIVEKIT_API_KEY=... \\
                    LIVEKIT_API_SECRET=... \\
                    --app nexus-local-worker-yqg
    fly deploy --config fly.yqg-worker.toml --remote-only

Run modes:
  Development:  python -m src.integrations.yqg_worker dev
  Production:   python -m src.integrations.yqg_worker start
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession
from livekit.plugins import groq as groq_plugin
from livekit.plugins import silero

from src.integrations.livekit_plugins import build_tts_with_local_fallbacks

logger = logging.getLogger(__name__)


# ── System prompt ──────────────────────────────────────────────────────────

_DEFAULT_PROMPT_FILE = Path(__file__).parent.parent.parent / "prompts" / "yqg-persona.txt"


def _load_yqg_persona() -> str:
    """Load the YQG persona from env var, file, or embedded fallback."""
    # 1. Env var takes priority (useful for Fly secrets)
    env_prompt = os.getenv("YQG_PERSONA_PROMPT", "").strip()
    if env_prompt:
        return env_prompt

    # 2. Env var pointing to a file
    prompt_file = os.getenv("NEXUS_SYSTEM_PROMPT_FILE", "").strip()
    if prompt_file and Path(prompt_file).exists():
        return Path(prompt_file).read_text().strip()

    # 3. Default file shipped with the repo
    if _DEFAULT_PROMPT_FILE.exists():
        return _DEFAULT_PROMPT_FILE.read_text().strip()

    # 4. Hardcoded fallback — short form
    return (
        "You are the YQG Digital AI Assistant, built by TAURUS AI Corp for Tim "
        "Warnholtz and the YQG Digital team in Windsor, Ontario. Help with "
        "proposal drafting, SEO research, competitor teardowns, client FAQs, "
        "and content ideation. Voice-first: respond in 1-3 spoken sentences, "
        "never markdown, always direct and slightly dry. Never sycophantic."
    )


def _yqg_system_prompt() -> str:
    now = datetime.now(timezone.utc).strftime("%A, %B %d, %Y at %H:%M UTC")
    base = _load_yqg_persona()
    return f"{base}\n\nThe current date and time is {now}."


# ── Agent definition ──────────────────────────────────────────────────────

class YQGAgent(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=_yqg_system_prompt())


# ── Server & session handler ──────────────────────────────────────────────

server = AgentServer()


@server.rtc_session(agent_name=os.getenv("NEXUS_AGENT_NAME", "yqg-agent"))
async def yqg_session(ctx: agents.JobContext):
    logger.info("YQG session — room: %s", ctx.room.name)

    vad = silero.VAD.load()
    stt = groq_plugin.STT(model="whisper-large-v3")
    llm = groq_plugin.LLM(model="llama-3.3-70b-versatile")
    tts = await build_tts_with_local_fallbacks()

    session = AgentSession(vad=vad, stt=stt, llm=llm, tts=tts)

    await session.start(room=ctx.room, agent=YQGAgent())

    greeting = os.getenv(
        "YQG_GREETING",
        "Hi — this is your YQG assistant. What can I help with?",
    )
    if greeting:
        await session.say(greeting)


if __name__ == "__main__":
    agents.cli.run_app(server)
