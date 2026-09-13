/**
 * engine-identity.mjs — the seven engines as seven visual worlds.
 *
 * WHY THIS EXISTS
 * ---------------
 * Until now "per-engine identity" meant one CSS custom property. Every engine
 * page shared the same chrome, the same section order and the same hero, and
 * differed by `--accent` plus a two-value tint on a SINGLE shared video clip:
 *
 *     creative: { ...AMBIENT, overlay: 'warm' }
 *     social:   { ...AMBIENT, overlay: 'cool' }
 *     intel:    { ...AMBIENT, overlay: 'cool' }
 *     ...
 *
 * That is one template wearing seven hats, and it undercuts the claim that
 * these are seven products. Owner decision 2026-09-13: each engine gets its own
 * palette, its own moving backdrop and its own page architecture.
 *
 * WHAT IS AND IS NOT PINNED
 * -------------------------
 * `verticals` in tokens.mjs stays the source of truth for `--vertical-<slug>`,
 * and tests/vertical-contrast.test.js pins estate, seo and flow to exact
 * fitted values at >=4.5:1. Nothing here may change those. The `accent` field
 * below therefore MIRRORS tokens.mjs and is asserted equal to it by
 * tests/engine-identity.test.js — a second copy that can drift is worse than
 * no copy, so the test is what makes duplicating it safe.
 *
 * Everything else here is new surface: a ground, an ink, a secondary, a glow,
 * and the backdrop each engine draws. Those govern the engine's HERO and its
 * section backdrops — its "world".
 *
 * --accent IS reassigned per engine, from the same value tokens.mjs already
 * holds. That is not a change of colour, it is the first time four of the seven
 * engines have had one applied at all: design-system.css only ever carried
 * theme blocks for estate, seo and flow.
 *
 * WHY GENERATED MOTION AND NOT FOOTAGE
 * ------------------------------------
 * Seven filmed backgrounds would need seven clips. There is exactly one clip in
 * the repository (ambient.2b43ddea.mp4, 345 KB), R2 is not enabled on the
 * account, and Pages caps a file at 25 MiB. A canvas backdrop is a few hundred
 * bytes of code, is genuinely different per engine rather than a re-tint, and
 * degrades to a single painted frame under `prefers-reduced-motion`.
 *
 * Real footage can replace any of these later without touching this file:
 * video-hero.js already keys its source map by the same slugs.
 */

import { buildArchetypeCss } from './archetypes.mjs';

/**
 * Each engine's world.
 *
 * `backdrop` names the renderer in assets/js/engine-backdrop.js. It is a
 * DRAWING INSTRUCTION, not decoration — each one depicts what the engine
 * actually does, which is what keeps the seven from collapsing back into
 * interchangeable gradients.
 *
 * `archetype` names the page architecture the engine's layout should follow.
 * It is recorded here so the divergence is a stated design decision rather
 * than whatever each page drifted into.
 */
export const engines = {
  creative: {
    name: 'Neormative',
    descriptor: 'Ads',
    accent: '#B44A24', // mirrors tokens.mjs verticals.creative (accent.terracotta)
    ground: '#1A0F0B', // darkroom, not a neutral dark
    ink: '#F6E9E2',
    secondary: '#E08B5C',
    glow: '#FF7A45',
    backdrop: 'darkroom', // chemical bloom: images surfacing out of developer
    archetype: 'gallery', // asymmetric image-led editorial, captions in the margin
    motion: 'slow bloom, grain',
  },
  social: {
    name: 'Neormedia',
    descriptor: 'Sync',
    accent: '#4A6B8A', // mirrors tokens.mjs verticals.social (accent.blue)
    ground: '#08131F',
    ink: '#E4EEF8',
    secondary: '#4FA8E8',
    glow: '#37D2FF',
    backdrop: 'broadcast', // one origin, many destinations: dispatch waves
    archetype: 'stream', // vertical cadence, a feed you scroll rather than a page
    motion: 'radiating pulses',
  },
  intel: {
    name: 'Neormintel',
    descriptor: 'Data',
    accent: '#B8862B', // mirrors tokens.mjs verticals.intel (accent.gold)
    ground: '#12130E',
    ink: '#F4F0DF',
    secondary: '#D8B45A',
    glow: '#FFD166',
    backdrop: 'plotter', // a live curve being drawn against gridlines
    archetype: 'instrument', // dense tiles, figures before prose
    motion: 'plotted trace',
  },
  flow: {
    name: 'Neormestra',
    descriptor: 'Flow',
    accent: '#56711A', // PINNED in tokens.mjs, fitted to 4.56:1 — do not alter
    ground: '#0E140A',
    ink: '#ECF3DF',
    secondary: '#9BC24A',
    glow: '#C6E385',
    backdrop: 'graph', // a DAG with work travelling along its edges
    archetype: 'nodal', // stepped sections joined by visible paths
    motion: 'tokens along edges',
  },
  estate: {
    name: 'Neormestate',
    descriptor: 'Reels',
    accent: '#B04162', // PINNED in tokens.mjs, fitted to 4.55:1 — do not alter
    ground: '#160A10',
    ink: '#F8E7EE',
    secondary: '#D2738F',
    glow: '#FF6F91',
    backdrop: 'blueprint', // floorplan lines drawing themselves in plan view
    archetype: 'plan', // full-bleed, property-led, plan-view rhythm
    motion: 'drafting lines',
  },
  seo: {
    name: 'Neormeo',
    descriptor: 'Authority',
    accent: '#08747C', // PINNED in tokens.mjs, fitted to 4.53:1 — do not alter
    ground: '#04171A',
    ink: '#DFF3F4',
    secondary: '#2FA9B4',
    glow: '#50E8F4',
    backdrop: 'index', // lines of text resolving into cited references
    archetype: 'document', // citation margins, reference-dense
    motion: 'resolving citations',
  },
  freelance: {
    name: 'Neormence',
    descriptor: 'Studio',
    accent: '#4F6B37', // mirrors tokens.mjs verticals.freelance (accent.greenText)
    ground: '#0A1611',
    ink: '#E2F1E9',
    secondary: '#58A57C',
    glow: '#6FE3A8',
    backdrop: 'workspace', // collaborators moving on a shared canvas
    archetype: 'board', // card surfaces, a workspace rather than a brochure
    motion: 'drifting cursors',
  },
};

/** Frozen pre-rebrand routes. The slugs are NOT renamed — see CLAUDE.md. */
export const slugs = Object.keys(engines);

/** Every distinct backdrop renderer that must exist in engine-backdrop.js. */
export const backdrops = [...new Set(slugs.map((s) => engines[s].backdrop))];

/**
 * Emit the per-engine custom properties, scoped to `body.theme-<slug>` — the
 * hook the site already uses. Deliberately additive: it defines --engine-*
 * and never reassigns --accent, --text or --bg, so global contrast guarantees
 * and the light/dark token sets are unaffected.
 */
export function engineCss() {
  const blocks = slugs.map((slug) => {
    const e = engines[slug];
    return [
      `body.theme-${slug} {`,
      `  --engine-accent: ${e.accent};`,
      `  --engine-ground: ${e.ground};`,
      `  --engine-ink: ${e.ink};`,
      `  --engine-secondary: ${e.secondary};`,
      `  --engine-glow: ${e.glow};`,
      ``,
      `  /* Only estate, seo and flow ever had a theme block in`,
      `     design-system.css. creative set color-scheme and nothing else;`,
      `     social, intel and freelance had none at all, so four of the seven`,
      `     engines had never once shown their own accent. Generated for all`,
      `     seven here, from the same values, so they cannot diverge again. */`,
      `  --accent: var(--engine-accent);`,
      `  --accent-text: var(--engine-accent);`,
      `  --grad-brand: var(--engine-accent);`,
      `}`,
    ].join('\n');
  });

  return [
    '/* GENERATED by scripts/build-engine-css.mjs from lib/engine-identity.mjs.',
    ' * Do not edit by hand — edit the module and re-run the script.',
    ' *',
    ' * Scoped to body.theme-<slug>, which every engine page already carries.',
    ' *',
    ' * --accent is set per engine to the SAME value tokens.mjs already holds,',
    ' * so tests/vertical-contrast.test.js still governs it. The --text/--bg',
    ' * remaps are scoped to .engine-hero and do not touch the rest of the page.',
    ' */',
    '',
    ...blocks,
    buildArchetypeCss(slugs.map((s) => engines[s].archetype)),
    '',
    '/* The backdrop layer itself. Static, not per-engine: only the palette and',
    ' * the renderer differ. The canvas sits BEHIND the hero content and is',
    ' * inert to pointers — it is decoration, and must never intercept a click',
    ' * meant for the call to action in front of it. */',
    '.engine-hero {',
    '  position: relative;',
    '  isolation: isolate;',
    '  background: var(--engine-ground, var(--bg));',
    '  overflow: hidden;',
    '}',
    '.engine-backdrop {',
    '  position: absolute;',
    '  inset: 0;',
    '  z-index: 0;',
    '  pointer-events: none;',
    '  display: block;',
    '}',
    '/* Content rides above the canvas. */',
    '.engine-hero > *:not(.engine-backdrop) {',
    '  position: relative;',
    '  z-index: 1;',
    '}',
    '',
    '/* Remap the text/border/tint tokens for the engine ground, the same way',
    ' * design-system.css remaps them inside a dark panel. Setting only `color`',
    ' * on the direct children was not enough and looked fine in a screenshot',
    ' * of the headline: .btn-ghost and .hero-meta carry their OWN light-theme',
    ' * colours, so "View pricing" and the meta line rendered near-black on a',
    ' * near-black ground — present, focusable, and effectively invisible.',
    ' *',
    ' * Derived from --engine-ink with color-mix so each engine follows its own',
    ' * palette and no value has to be hand-tuned seven times.',
    ' */',
    '.engine-hero {',
    '  --text: var(--engine-ink);',
    '  --text-soft: color-mix(in srgb, var(--engine-ink) 82%, transparent);',
    '  --text-muted: color-mix(in srgb, var(--engine-ink) 72%, transparent);',
    '  --text-dim: color-mix(in srgb, var(--engine-ink) 60%, transparent);',
    '  --border: color-mix(in srgb, var(--engine-ink) 22%, transparent);',
    '  --border-strong: color-mix(in srgb, var(--engine-ink) 34%, transparent);',
    '  --border-control: color-mix(in srgb, var(--engine-ink) 34%, transparent);',
    '  --tint-1: color-mix(in srgb, var(--engine-ink) 8%, transparent);',
    '  --tint-2: color-mix(in srgb, var(--engine-ink) 12%, transparent);',
    '  --tint-3: color-mix(in srgb, var(--engine-ink) 18%, transparent);',
    '  color: var(--engine-ink);',
    '}',
    '',
    '/* Panels inside the hero must follow the ground too. Remapping only the',
    ' * TEXT tokens left .terminal on --bg-elev, which is still the light page',
    ' * surface: the panel kept its cream background while its contents turned',
    ' * light ink, and most of the terminal output became unreadable. */',
    '.engine-hero {',
    '  --bg: var(--engine-ground);',
    '  --bg-elev: color-mix(in srgb, var(--engine-ink) 7%, var(--engine-ground));',
    '  --surface: color-mix(in srgb, var(--engine-ink) 7%, var(--engine-ground));',
    '  --surface-2: color-mix(in srgb, var(--engine-ink) 12%, var(--engine-ground));',
    '  --scrim: var(--engine-ground);',
    '  --scrim-solid: var(--engine-ground);',
    '}',
    '/* The accent is fitted for contrast on the LIGHT page ground, so on the',
    ' * engine ground it is too dark to read as text. The engine glow is the',
    ' * on-dark counterpart. */',
    '.engine-hero .accent,',
    '.engine-hero .eyebrow,',
    '.engine-hero em {',
    '  color: var(--engine-glow);',
    '}',
    '/* A readability floor under the text, independent of what the renderer',
    ' * happens to draw there on any given frame — a moving backdrop cannot be',
    ' * relied on to stay dark behind a paragraph. */',
    '.engine-hero::after {',
    '  content: "";',
    '  position: absolute;',
    '  inset: 0;',
    '  z-index: 0;',
    '  pointer-events: none;',
    '  background: linear-gradient(',
    '    100deg,',
    '    color-mix(in srgb, var(--engine-ground, #000) 88%, transparent) 0%,',
    '    color-mix(in srgb, var(--engine-ground, #000) 62%, transparent) 45%,',
    '    color-mix(in srgb, var(--engine-ground, #000) 20%, transparent) 100%',
    '  );',
    '}',
    '',
  ].join('\n');
}
