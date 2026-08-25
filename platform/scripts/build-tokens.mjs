#!/usr/bin/env node
/**
 * Generates `assets/css/tokens.css` from `lib/tokens.mjs`.
 *
 * This is the "harness" side of Convergence Analysis rejection E2 — the design
 * system lives in exactly one place, and the CSS is a build artifact rather than a
 * file anyone edits. Run `npm run tokens` after changing `lib/tokens.mjs`.
 *
 * The generated file is committed so that the static deploy needs no build step:
 * `platform/` is served as-is by Vercel. `npm test` asserts the committed file is
 * in sync with the source, so a stale artifact fails CI rather than shipping.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cssVariables, type as typeTokens } from '../lib/tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'assets', 'css', 'tokens.css');

/**
 * CSS has no comment escape, so an end-comment sequence inside comment text
 * terminates the comment
 * early — and the browser's error recovery then swallows declarations up to the
 * next `;`, silently dropping real tokens.
 *
 * This is not hypothetical: prose describing the grad/glow aliases closed its own
 * comment here, ate the `--grad-brand` declaration that followed, and rendered the
 * nav brand mark with a transparent background. Caught by visual verification, not
 * by any assertion — hence `no comment terminates early` in the test suite.
 */
function commentSafe(textValue) {
  return textValue.replaceAll('*/', '* /');
}

export function renderTokensCss() {
  const lines = [
    '/* ==========================================================================',
    '   NEXUS-CORE — design tokens',
    '',
    '   GENERATED FILE — DO NOT EDIT.',
    '   Source: platform/lib/tokens.mjs · regenerate with `npm run tokens`.',
    '',
    '   Normative: HANDOFF-Claude-Code.md §3, extended by Liquid Crystal decision 2',
    '   (Ember ramp) and bounded by decision 3 rule R3 (warm chrome, cold canvas).',
    '   ========================================================================== */',
    '',
    `@import url("${typeTokens.googleFontsHref}");`,
    '',
    ':root {',
  ];

  for (const entry of cssVariables()) {
    if (entry.length === 1) {
      lines.push('', `  /* ${commentSafe(entry[0])} */`);
    } else {
      lines.push(`  ${entry[0]}: ${entry[1]};`);
    }
  }

  lines.push('}', '');
  return lines.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = renderTokensCss();
  writeFileSync(OUT, css, 'utf8');
  const count = cssVariables().filter((e) => e.length === 2).length;
  console.log(`wrote ${OUT} — ${count} custom properties`);
}
