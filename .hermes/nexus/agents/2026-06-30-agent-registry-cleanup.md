# NEXUS Agent Registry Cleanup Plan

> Date: 2026-06-30
> Scope: `06-WORKFLOWS/Taurus-AI-Agent-Registry/`

## Objective

Audit the agent registry for stale scripts, duplicate numbered copies, and references to deprecated brands, then publish a canonical `MANIFEST.md` that defines KEEP / MERGE / DELETE decisions.

## Context from CLAUDE.md

- `01-CORE-PLATFORM/` holds internal platform tooling, agents, and MCP integrations.
- `06-WORKFLOWS/` contains partnership pitches, demos, and reusable campaign flows.
- The operating brand is **Nexus by Taurus AI**; avoid NeoSync / BizFlow / NeoVibe naming in new agent work.
- AI/ML inference must use cloud endpoints (OpenRouter, NVIDIA NIM, Anthropic, OpenAI). No local Ollama/llama.cpp/vLLM references in new registry entries.

## Work Items

1. **Scan registry paths**
   - `06-WORKFLOWS/Taurus-AI-Agent-Registry/`
   - `01-CORE-PLATFORM/nexus-backend/agents/`
   - `04-PRODUCT-DEPLOYMENT/platform-dev/`
   - `social-suite-dashboard/`

2. **Classify each untracked `.py` file**
   - **KEEP** — unique entry point (`__main__`, `async def main`, FastAPI route), referenced by committed code, or non-trivial implementation.
   - **MERGE** — similar to an existing committed file; propose merge target.
   - **DELETE** — numbered duplicate, empty stub, or trivial print script.

3. **Create `MANIFEST.md`**
   - Table with file path, category, rationale, and proposed action.
   - Index any KEEP scripts by their primary function.

4. **Archive DELETE files**
   - Move DELETE files to `.hermes/archive/deleted-agent-scripts-2026-06-30/` rather than `rm` so history is preserved.
   - Do not move files without explicit human `PROCEED`.

## Acceptance Criteria

- `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` exists and is committed.
- No untracked numbered duplicates remain in the registry scope.
- `tests/test_agent_script_audit.py` passes.

## Human-in-the-Loop Gate

Present the audit summary (KEEP / MERGE / DELETE counts) and ask for `PROCEED` before moving any DELETE files.
