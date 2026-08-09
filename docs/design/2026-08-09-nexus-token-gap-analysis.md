# Gap analysis — shipping Nexus CSS vs Design System v2

**Date:** 2026-08-09
**Compares:** `platform/assets/css/design-system.css` (240 rules, 50 custom properties) against
`docs/design/2026-08-02-taurus-design-system-v2-nexus-slice.md`.
**Status:** measurement only. **Recommend, do not apply.** No visual change has shipped.

---

## Verdict in one line

The gap is **not** a token swap. v2's colour budget permits **one** emitter; the site ships
**four** accents plus a two-colour brand gradient. v2 permits **two** type families; the site
loads **seven**. Adopting v2 is a redesign with a rename, not a find-and-replace.

## 1. Colour — the hard constraint

v2 §03: *"Roughly 92% of every surface is void and hairline; the emitter is reserved for the one
thing on screen that is live, verified, or actionable. **If two things glow, neither reads.**"*

| Shipping token | Value | v2 disposition |
|---|---|---|
| `--accent` | `#7c5cff` violet | → replaced by emitter `#4F7DF3` |
| `--accent-2` | `#22d3ee` cyan | **no equivalent — must go** |
| `--accent-3` | `#f0abfc` pink | **no equivalent — must go** |
| `--gold` | `#f5c97a` | **no equivalent — must go** |
| `--grad-brand` | `linear-gradient(135deg,#7c5cff,#22d3ee)` | **no equivalent — v2 has no brand gradient** |
| `--bg` | `#05060a` | → void `#04060C` (near-identical; cheapest single change) |
| — | — | **missing:** `wire rgba(79,125,243,.15)`, `glow rgba(79,125,243,.55)` |

**Good news on containment.** The raw hexes are centralised — each appears only 1–2 times in the
stylesheet, and **zero times in HTML**. Consumers go through `var()`. So the *values* are a
handful of edits.

**Bad news.** The removals are not: `--grad-brand` has **7** consumers, `--accent-2` **6**,
`--accent-3` **4**. Those 17 rules don't get a new value — they need a new design, because v2
offers nothing to point them at.

## 2. Colour-named component classes — the rename tax

The component API encodes colour in class names, which v2's single-emitter model makes
meaningless.

| Class | HTML uses |
|---|---|
| `.pillar.violet` | 3 |
| `.pillar.gold` | 2 |
| `.pillar.cyan` | 2 |
| `.badge.gold` | 5 |
| `.badge.cyan` | 1 |
| `.badge.green` | 1 |

**14 usages across 3 HTML files.** Small, but it forces a naming decision: under v2 a pillar
cannot be "the gold one." Classes need to express *role* (`.pillar.is-live`,
`.badge.is-pending`) rather than hue — which is the point v2 is making with "the emitter is
reserved for the one thing that is live, verified, or actionable."

## 3. Typography — the largest single gap

v2 §04: *"Two families, no exceptions."* Voice = **Instrument Sans**, Evidence = **IBM Plex Mono**.

The site currently loads **seven** families across 21 HTML files:

| Family | v2 status |
|---|---|
| IBM Plex Mono | ✅ already correct — the evidence font, already in use |
| Inter | ✗ replace with Instrument Sans |
| JetBrains Mono | ✗ redundant second mono |
| DM Serif Display | ✗ Creative/Orchestra warm variant |
| Playfair Display | ✗ |
| Plus Jakarta Sans | ✗ |
| Syne | ✗ campaign pages |

**Instrument Sans is not loaded anywhere.** Five families must be retired, one added, across 21
files. This also collides with the `theme-creative` warm editorial variant and the campaign
pages' separate art direction — v2 has no concept of a per-vertical type variant.

Beyond families, v2 specifies rules the current CSS does not express at all: optical tracking
`−0.045em @ 96px → 0em @ 14px`, headline weight ceiling 700, tracking floor `−0.02em`, mono
labels uppercase at `.14–.20em` / 9.5–11px, tabular figures for hashes and IDs.

## 4. Grid and motion — not modelled at all

- **§05 Addressable Grid (8px lattice, content snaps to major).** The stylesheet has spacing
  tokens but no lattice discipline and no integer-address concept. This is additive, not a
  conflict — but it is a real body of work if taken seriously, and it explicitly extends into
  Figma and WebGL.
- **§06 Stepper-Quantized motion.** The site uses continuous easing throughout (`reveal`,
  `d1`–`d4` delay classes). v2 reserves continuous easing for **opacity and colour only** and
  requires state transitions to arrive at discrete addresses. This is a rewrite of the motion
  layer, not a tuning pass.

## 5. RULE 03 — endorsement line is missing

Every first-party surface must carry *"a TAURUS AI CORP platform"* at 10.5px mono, 46% ink.
No Nexus page has it. This is the cheapest v2 conformance win available and is independent of
every other change — it could ship on its own.

---

## Recommended sequencing, if adoption is approved

Ordered by ratio of conformance gained to risk taken. **None of this is approved yet.**

1. **RULE 03 endorsement line** — one footer partial, zero visual risk, immediate conformance.
2. **Void `#05060a` → `#04060C`** — imperceptible, single token, removes one deviation.
3. **Emitter `#7c5cff` → `#4F7DF3`** plus `wire`/`glow` tokens — visible but mechanical.
4. **Retire `--accent-2` / `--accent-3` / `--gold` / `--grad-brand`** — 17 rules needing new
   design, plus the 14 class usages. This is the real project.
5. **Typography consolidation** — 7 families → 2 across 21 files; hardest because it fights the
   Creative/campaign art direction.
6. **Grid + motion** — largest, most speculative; needs the "Dynamic Flow Torus & Nodes"
   geometry to actually be specified first, which the export does not do.

**Blocking dependency:** do not start any of this until the three-way design-system conflict is
resolved (`2026-08-09-nexus-design-system-conflict.md`). A competing plan dated 64 minutes after
this export assigns Nexus violet `#7c5cff` — the exact value step 3 would remove.
