/**
 * The seven engines must stay seven, and must stay in step with tokens.mjs.
 *
 * Before this, "per-engine identity" was one CSS custom property and a
 * two-value tint on a single shared video clip. Two failure modes matter now:
 *
 *   1. **Collapse.** Two engines quietly given the same ground, glow or
 *      backdrop is the sameness this work exists to remove, and it would never
 *      announce itself — the pages would just start looking alike again.
 *   2. **Drift.** engine-identity.mjs mirrors the accent from tokens.mjs.
 *      A second copy that can drift is worse than no copy, so the mirror is
 *      only safe because this file fails when it stops matching.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { backdrops, engineCss, engines, slugs } from '../lib/engine-identity.mjs';
import { verticals } from '../lib/tokens.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

test('every engine accent still matches tokens.mjs exactly', () => {
  // Three of these were invented rather than read when this file was written —
  // plausible-looking hexes, one of them a transposition of the real value.
  // Nothing caught it but this comparison.
  const drift = slugs
    .filter((s) => (verticals[s] || '').toLowerCase() !== engines[s].accent.toLowerCase())
    .map((s) => `${s}: tokens.mjs=${verticals[s]} identity=${engines[s].accent}`);
  assert.deepEqual(drift, [], `engine accents have drifted from tokens.mjs:\n  ${drift.join('\n  ')}`);
});

test('all seven engines are present, and the slugs stay the frozen routes', () => {
  assert.deepEqual(
    [...slugs].sort(),
    ['creative', 'estate', 'flow', 'freelance', 'intel', 'seo', 'social'],
    'engine slugs are frozen pre-rebrand routes — see CLAUDE.md, they are not renamed',
  );
});

test('no two engines share a ground, a glow or a backdrop', () => {
  for (const field of ['ground', 'glow', 'backdrop', 'archetype']) {
    const seen = new Map();
    const clashes = [];
    for (const s of slugs) {
      const v = engines[s][field];
      if (seen.has(v)) clashes.push(`${field} "${v}": ${seen.get(v)} and ${s}`);
      seen.set(v, s);
    }
    assert.deepEqual(clashes, [], `two engines share a ${field} — that is the sameness this replaced:\n  ${clashes.join('\n  ')}`);
  }
});

test('every declared backdrop has a renderer that actually exists', () => {
  // A typo'd backdrop name is silent at runtime: mountBackdrop returns null and
  // the hero simply shows a flat ground, which looks deliberate.
  const src = read('assets/js/engine-backdrop.js');
  const missing = backdrops.filter((name) => !new RegExp(`\\n  ${name}\\(ctx,`).test(src));
  assert.deepEqual(missing, [], `declared in engine-identity.mjs with no renderer in engine-backdrop.js: ${missing.join(', ')}`);
});

test('the generated engines.css is current', () => {
  assert.equal(
    read('assets/css/engines.css'),
    engineCss(),
    'assets/css/engines.css is stale — run: node scripts/build-engine-css.mjs',
  );
});

test('every engine page carries its theme class and its backdrop', () => {
  // social, intel and freelance shipped with a bare <body> and therefore never
  // applied their own accent at all. Nothing failed; they just looked generic.
  const problems = [];
  for (const s of slugs) {
    const html = read(`${s}/index.html`);
    if (!html.includes(`class="theme-${s}"`)) problems.push(`${s}/index.html has no body.theme-${s}`);
    if (!html.includes(`data-backdrop="${engines[s].backdrop}"`)) {
      problems.push(`${s}/index.html is missing data-backdrop="${engines[s].backdrop}"`);
    }
    if (!html.includes('engines.css')) problems.push(`${s}/index.html does not link engines.css`);
    if (!html.includes('engine-backdrop.js')) problems.push(`${s}/index.html does not load engine-backdrop.js`);
  }
  assert.deepEqual(problems, [], `engine pages not wired to their identity:\n  ${problems.join('\n  ')}`);
});

test('the backdrop is decorative and can never swallow a click', () => {
  const css = read('assets/css/engines.css');
  assert.match(css, /\.engine-backdrop\s*\{[^}]*pointer-events:\s*none/s,
    '.engine-backdrop must not intercept pointer events — the hero CTA sits in front of it');
  const js = read('assets/js/engine-backdrop.js');
  assert.match(js, /setAttribute\('aria-hidden', 'true'\)/,
    'the canvas is decoration and must not be announced');
});

test('reduced motion still paints a composed frame, not a blank canvas', () => {
  const js = read('assets/js/engine-backdrop.js');
  assert.match(js, /paint\(REDUCED \? [\d.]+ : 0\)/,
    'under prefers-reduced-motion the backdrop must paint one frame at a non-zero time, so the composition still reads');
});
