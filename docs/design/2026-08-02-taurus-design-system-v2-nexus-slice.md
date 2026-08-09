# TAURUS AI Design System v2.0 — the NEXUS slice

**Source:** `docs/design/source/TAURUS-AI-Design-System-v2.dc.html` (96,746 b), extracted from
`~/Downloads/Brand kit for Corporate Platform.zip`, authored **2026-08-02 23:51** in Claude
Design. Companion: `TAURUS-AI-Brand-Kit.dc.html` (78,337 b).
**Spec version:** `DESIGN SYSTEM v2.0 · DTCG 2025.10`
**Status:** extracted and documented. **Nothing here has been applied to the site.** See the
companion gap analysis and the conflict note before acting on it.

> This file records the **NEXUS** portion only. The source is a four-brand corporate system;
> GRIDERA, BIO-FOUNDRY and corporate-level material are deliberately omitted per scope.

---

## The thesis

> **One void. Four light sources.**
>
> Every TAURUS AI surface is the same black room with the same addressable grid. A platform is
> not a different design — it is a different emitter switched on inside it. Structure is shared;
> light is owned.

This matters more than the hex values. It means a Nexus redesign is **not** a licence to invent
a Nexus look; it is permission to change three values inside a fixed room.

## The three governing rules (verbatim)

**RULE 01 · SHARED**
> Void ground, grid pitch, type scale, spacing, radii, motion curves, component behaviour.
> A platform never redefines these.

**RULE 02 · OWNED**
> Exactly three values: `emitter`, `void-tint`, `geometry`. A new platform is a 3-line config
> file, not a design project.

**RULE 03 · ENDORSEMENT**
> Every platform footer and every first-party surface carries *"a TAURUS AI CORP platform"* at
> 10.5px mono, 46% ink. No exceptions, no lockup variants.

## NEXUS — the three owned values

Read directly from the export's brand-mapping table.

| Property | Value |
|---|---|
| Tier | `PLATFORM 02` |
| Emitter | **`#4F7DF3`** |
| Void | **`#04060C`** |
| Wire | `rgba(79,125,243,.15)` |
| Glow | `rgba(79,125,243,.55)` |
| Geometry | **Dynamic Flow Torus & Nodes** |
| Domain | `nexus.taurusai.io` |
| Focus | Agentic marketing & creative studio |
| Role | Agentic creative studio |

For context only — the other three emitters, so the Nexus blue is not chosen in isolation:
corporate `#FFFFFF`, GRIDERA `#00CCAA`, BIO-FOUNDRY `#00FF99`. Nexus is the only cool-blue
emitter in the portfolio.

## Inherited primitives Nexus may not fork (RULE 01)

### 03 · Colour & Light

> Colour is budgeted, not decorated. Roughly **92% of every surface is void and hairline**; the
> emitter is reserved for the one thing on screen that is live, verified, or actionable.
> **If two things glow, neither reads.**

This is the single hardest constraint for the current Nexus site, which glows in four colours.

### 04 · Typography

Two families, no exceptions.

- **Voice — Instrument Sans.** 400 / 500 / 600 / 700. Optical tracking `−0.045em @ 96px →
  0em @ 14px`. Headlines never exceed weight 700 nor fall below `−0.02em`.
- **Evidence — IBM Plex Mono.** 300 / 400 / 500 / 600. Every hash, token, timestamp, address and
  status label is monospaced — *"in a verification product the machine-readable must look
  machine-readable."* Labels uppercase, `.14–.20em` tracking, 9.5–11px. Hashes and IDs at 400,
  no tracking, tabular figures.

### 05 · The Addressable Grid

> Nothing floats. Every element resolves to an integer address on an **8px lattice**, and every
> 3D focal point projects to the same lattice. A card at `(14, 6)` means the same thing in the
> DOM, in Figma and in the WebGL scene.

`LATTICE PITCH 8 · MAJOR EVERY 8 UNITS · CONTENT SNAPS TO MAJOR`

### 06 · Motion — Stepper-Quantized

> The signature is machine motion: things arrive at discrete addresses rather than easing into
> place. Continuous easing is reserved for opacity and colour. Anything that represents a state
> in a verifiable pipeline moves in steps — the motion itself asserts that the system is
> deterministic.

Scroll position `0→1` is floored to seven addresses; the emitter never occupies an intermediate
position, so a screenshot at any moment is a legible system state.

### 07 · Component Library Architecture + versioning

Components are brand-parameterised — the export carries an enum
`["taurus","gridera","nexus","biofoundry"]` — so Nexus consumes the shared library with its
emitter swapped in, rather than maintaining its own components.

> Tokens are versioned like code: semver, staged deprecation, codemods for renames. A token is
> never silently repointed — a rename ships as an alias for one minor version, then warns, then
> breaks.

---

## What this does not tell us

- **No Nexus-specific component designs.** The system defines the room and the rules; it does
  not lay out `/social`, `/creative`, or the pillar grid.
- **"Dynamic Flow Torus & Nodes" is named, not specified.** No geometry file, mesh, or
  parameters accompany it in the export.
- **No mapping to the existing CSS custom properties.** The current stylesheet's token names
  (`--accent`, `--grad-brand`, `--surface-2`) have no counterpart here; adopting v2 means a new
  token vocabulary, not a find-and-replace of values.
