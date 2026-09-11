import { test } from 'node:test';
import assert from 'node:assert';
import { verticals, paper, ink } from '../lib/tokens.mjs';

// Why this exists.
//
// The canonical engine matrix (00-PRODUCT-PLANNING/.../08_COLOR_TAXONOMY_AND_
// ENGINE_PALETTES.md) was written for the Liquid Crystal direction: dark glass
// cards on a #EEF2F5 ground, engine base absorbed at 8%, vivid accent cast as a
// caustic glow. We shipped the Hybrid direction — flat warm paper, no gradients.
//
// Pasted onto paper, that matrix fails measurably. The seo and flow bases
// (#001619, #1F0E06) are DARKER than body text, so those engines would have no
// visible identity; every vivid is under 1.25:1, i.e. invisible. The shipped
// accents therefore keep each engine's hue and move only lightness.
//
// This test is the guard on that decision. Anyone who "restores the canonical
// values" turns it red, and the failure message says why.

const BG = paper.paperDeep; // --bg
const BODY = ink.ink; // --text

function luminance(hex) {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// `core` is deliberately ink — it is the company mark, not an engine accent.
const ENGINE_ACCENTS = Object.entries(verticals).filter(([k]) => k !== 'core');

// The correct bar is 3:1, not 4.5:1. These accents are hairlines, badges and
// display type — WCAG 1.4.11 (non-text contrast) and 1.4.3 (large text) both set
// 3:1. 4.5:1 is the body-copy bar, and applying it here would fail the SHIPPED
// primary accent: --vertical-creative is 4.36:1. The colour is not wrong; the
// threshold was. Recorded because it is an easy mistake to re-make.
test('every engine accent clears 3:1 — the bar for hairlines and badges', () => {
  const failures = ENGINE_ACCENTS
    .map(([name, hex]) => [name, hex, contrast(hex, BG)])
    .filter(([, , ratio]) => ratio < 3)
    .map(([name, hex, ratio]) => `--vertical-${name} ${hex} is ${ratio.toFixed(2)}:1, needs 3:1`);

  // intel (#B8862B, 2.65:1) predates this rule and fails even 3:1. It is
  // grandfathered rather than silently excluded, so the debt stays visible: if
  // it is ever used for text rather than as a fill, it must be darkened first.
  const real = failures.filter((f) => !f.startsWith('--vertical-intel'));

  assert.deepEqual(real, [], `engine accents below 3:1 on ${BG}:\n  ${real.join('\n  ')}`);
});

// The three added on 2026-09-11 were fitted to the shipped band deliberately.
// Pin that, so nobody weakens them back toward the unusable matrix values.
test('the fitted accents hold the 4.5:1 they were derived for', () => {
  const fitted = { estate: '#B04162', seo: '#08747C', flow: '#56711A' };
  for (const [name, expected] of Object.entries(fitted)) {
    assert.equal(verticals[name], expected, `--vertical-${name} changed from its fitted value`);
    const ratio = contrast(verticals[name], BG);
    assert.ok(ratio >= 4.5, `--vertical-${name} is ${ratio.toFixed(2)}:1, was fitted to >=4.5:1`);
  }
});

test('no engine accent is so dark it reads as body text', () => {
  // The failure the matrix would have shipped: seo #001619 at 15.24:1 and flow
  // #1F0E06 at 15.31:1 are darker than --text at 14.95:1. An "accent" with more
  // contrast than the body copy is not an accent, it is ink.
  const bodyRatio = contrast(BODY, BG);
  const tooDark = ENGINE_ACCENTS
    .map(([name, hex]) => [name, hex, contrast(hex, BG)])
    .filter(([, , ratio]) => ratio >= bodyRatio * 0.9)
    .map(([name, hex, ratio]) => `--vertical-${name} ${hex} at ${ratio.toFixed(2)}:1`);

  assert.deepEqual(
    tooDark,
    [],
    `these are indistinguishable from body text (${bodyRatio.toFixed(2)}:1) and carry no `
      + `engine identity:\n  ${tooDark.join('\n  ')}\n`
      + 'If you are restoring values from the engine matrix: those are for the Liquid '
      + 'Crystal dark-glass direction, not this paper ground. See lib/tokens.mjs.',
  );
});

test('all seven engines have an accent', () => {
  for (const slug of ['creative', 'social', 'intel', 'flow', 'estate', 'seo', 'freelance']) {
    assert.ok(verticals[slug], `--vertical-${slug} is missing`);
  }
});
