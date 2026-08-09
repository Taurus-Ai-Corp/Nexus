# Which "Nexus design system" is authoritative?

**Date:** 2026-08-09
**Question:** three artifacts claim to define the Nexus visual identity and assign three
different palettes. One of them auto-loads into any agent that hears the phrase.

## Verdict

**`TAURUS AI Design System v2.0` is authoritative.** Nexus emitter is **`#4F7DF3`** on void
`#04060C`.

The other two are superseded: one was **planned and never executed**, the other is a
**mis-named client design system** that should not answer to "Nexus" at all.

---

## The three candidates

| # | Artifact | Nexus palette | Timestamp | Exists as? |
|---|---|---|---|---|
| 1 | `docs/design/source/TAURUS-AI-Design-System-v2.dc.html` | emitter `#4F7DF3`, void `#04060C` | 2026-08-02 **23:51** | **finished artifact** — 96,746 b, DTCG 2025.10, complete token set |
| 2 | `~/.claude/plans/sprightly-puzzling-blanket.md` Revision A | violet `#7c5cff` | 2026-08-03 **00:55** | **plan only — never executed** |
| 3 | `~/.claude/skills/nexus-design-system/` | charcoal `#1a1f1b` + gold `#d4af37` | 2026-05-19 | shipped skill, **wrong product** |

## Why the 64-minute gap doesn't decide it

Candidate 2 is timestamped **64 minutes after** candidate 1, which initially looked like it
should win. It doesn't, for two reasons.

**They are one lineage, not two opinions.** Both use the same distinctive model — a shared void
with each brand as a light source over it — and both use the unusual term **"stepper-quantized"**
for motion (v2 §06; Revision A's `tokens/motion.tokens.css`). Independent authors do not coin
that phrase twice. Revision A is the local planning thread for the same design effort, and its
own Context section says the intent is to *"build locally now, sync to claude.ai later once the
design MCP is reachable"* — v2 is a Claude Design (`.dc.html`) export, i.e. the claude.ai side of
exactly that plan.

**Revision A was never carried out.** Its stated deliverables do not exist anywhere on the
system — verified by search:

```
output/BRAND/DESIGN-LANGUAGE.md          absent
output/BRAND/BRAND-ARCHITECTURE.md       absent
output/BRAND/tokens/core.tokens.css      absent
output/BRAND/tokens/motion.tokens.css    absent
output/BRAND/brands/nexus.tokens.css     absent
output/BRAND/BRAND-KIT-BOARD.html        absent
```

A plan written later but never executed does not supersede a finished artifact. Candidate 1 is
the only one of the two that produced anything.

**Revision A is independently stale** on two further counts: it records Nexus's signer as
`TAURUS AI CORP - FZCO`, an entity retired 2026-08-08, and its palette reasoning rests on
"NEXUS has no domain, so its identity is free to design" — the premise, not a decision.

Where they disagree, for the record: Revision A assigns BIO-FOUNDRY crimson `#ff3355`; v2 assigns
it green `#00FF99`. v2's green fits "quantum biology" and reads as the later refinement.

## Candidate 3 is a live hazard, not just wrong

`~/.claude/skills/nexus-design-system/SKILL.md` declares:

> Triggers on: **"Nexus design system"**, "brand tokens", "Mater Maria design", "Kerala luxury",
> "NRI website", …

…and then serves charcoal `#1a1f1b` / gold `#d4af37` / Playfair Display, with
`references/tokens.md` titled **"NeoVibe Design Tokens"** — a brand retired in 2026-06. <!-- brand-allow -->

Its actual content is **Mater Maria / Kerala-NRI client work**, which is legitimate and worth
keeping. The defect is purely the name and trigger list: any agent asked about the Nexus design
system loads a client's palette and has no signal that it is wrong.

**Proposed fix — needs approval, touches global agent config outside this repo:**

- rename the skill directory `nexus-design-system` → `mater-maria-design-system`
- drop `"Nexus design system"` and `"brand tokens"` from its triggers
- retitle `references/tokens.md` away from the retired NeoVibe name <!-- brand-allow -->

## Consequences

1. The gap analysis (`2026-08-09-nexus-token-gap-analysis.md`) is measured against the correct
   target. Its conclusions stand.
2. Any future work citing violet `#7c5cff` as the Nexus brand colour is citing an unexecuted
   plan. The **currently shipping** `--accent: #7c5cff` is not evidence of a decision — it
   predates all three documents.
3. `~/.claude/plans/sprightly-puzzling-blanket.md` should carry a superseded banner pointing
   here. It is outside this repo; flagged, not edited.
