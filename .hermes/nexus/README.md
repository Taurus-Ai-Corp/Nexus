# NEXUS by Taurus AI — Hermes Plan Index

This directory contains the authoritative plans for the current NEXUS operating brand.

## Active Plans

| Plan | Scope | Path |
|------|-------|------|
| NEXUS Marketing Site Rebuild | Static site at `platform/` | `.hermes/nexus/platform/2026-06-30-website-rebuild.md` |
| Contact / SMTP Backend | Brevo/OpenSend email handler | `.hermes/nexus/platform/2026-06-30-contact-smtp.md` |
| Agent Registry Cleanup | Taurus-AI-Agent-Registry audit | `.hermes/nexus/agents/2026-06-30-agent-registry-cleanup.md` |

## Repository Context

Per `CLAUDE.md`, the active codebase is organized as:

- `01-CORE-PLATFORM/` — internal platform tooling (nexus-backend, nexus-studio, agents, MCP integrations)
- `03-CLIENT-MANAGEMENT/` — client portals, agency ops, marketing assets
- `06-WORKFLOWS/` — partnership pitches, demos, reusable campaign flows
- `platform/` — static marketing site for `nexus.taurusai.io`
- `SWARM SR Internal Analysis/` — internal research and analytics
- `taurus-agency-os/` — agency OS frontend

## Operating Rules

- Client-facing brand is **Nexus by Taurus AI**; legal entity **TAURUS AI CORP - FZCO** is used only for invoices, contracts, and NDAs.
- All AI/ML inference for NEXUS planning must use cloud endpoints; no local model references in new plans.
- Destructive changes require dry-run preview and explicit human `PROCEED` gate.

## Archive

Stale NeoSync / BizFlow / NeoVibe-era plans are preserved under:

`.hermes/archive/2026-04-26-bizflow-neovibe-phase2/`
