/**
 * Design-token invariants.
 *
 * These exist because of Convergence Analysis §5 rejection E2 — a design system
 * that exists in two places drifts, and the review caught a colour value already
 * truncated mid-value in a second copy. The assertions below make that failure
 * mode loud: a stale generated file or a hand-typed hex fails the suite rather
 * than shipping as a subtly off-brand page.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { accent, cssVariables, ember, type as typeTokens, verticals } from '../lib/tokens.mjs';
import { renderTokensCss } from '../scripts/build-tokens.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const tokensCss = read('assets/css/tokens.css');
const systemCss = read('assets/css/design-system.css');

describe('design tokens', () => {
  test('committed tokens.css matches lib/tokens.mjs', () => {
    assert.equal(
      tokensCss,
      renderTokensCss(),
      'assets/css/tokens.css is stale — run `npm run tokens` and commit the result',
    );
  });

  test('design-system.css declares no colour of its own', () => {
    // Comments may name a hex when quoting the handoff; strip them first.
    const withoutComments = systemCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const literals = withoutComments.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g) ?? [];
    assert.deepEqual(
      literals,
      [],
      `design-system.css must consume tokens, not declare colours. Found: ${literals.join(', ')}`,
    );
  });

  test('no comment terminates early, swallowing a declaration', () => {
    // Regression: a comment describing the gradient aliases contained an
    // end-comment sequence, which closed the comment early. CSS error recovery
    // then consumed up to the next `;`, silently dropping `--grad-brand` — the
    // nav brand mark rendered with a transparent background. The file parsed,
    // the suite was green, and only a screenshot showed it. Assert that every
    // declaration in the source survives comment-stripping.
    const declared = cssVariables().filter((e) => e.length === 2).map((e) => e[0]);
    const outsideComments = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const name of declared) {
      assert.match(
        outsideComments,
        new RegExp(`${name}\\s*:`),
        `${name} is defined in lib/tokens.mjs but does not survive as a live declaration ` +
          `— a comment above it probably terminates early`,
      );
    }
  });

  test('generated css contains no zero-width characters', () => {
    // An earlier fix used a zero-width space to defuse the sequence above.
    // Invisible characters in generated source are their own failure mode.
    assert.doesNotMatch(tokensCss, /[\u200B-\u200D\uFEFF]/);
  });

  test('Ember rest state is identical to the handoff terracotta', () => {
    // Liquid Crystal decision 2 and handoff §3.2 must agree exactly — a
    // near-miss here is the drift this whole file exists to prevent.
    assert.equal(ember[0], accent.terracotta);
    assert.equal(ember[0], '#B44A24');
  });

  test('Ember ramp is five steps, rest -> live', () => {
    assert.equal(ember.length, 5);
    assert.equal(ember.at(-1), '#F86B57');
    assert.equal(new Set(ember).size, 5, 'ramp steps must be distinct');
  });

  test('locked vertical accents match handoff §3.2', () => {
    assert.equal(verticals.creative, '#B44A24');
    assert.equal(verticals.social, '#4A6B8A');
    assert.equal(verticals.intel, '#B8862B');
    assert.equal(verticals.freelance, '#4F6B37');
  });

  test('no gradient is reintroduced', () => {
    // §3: "do not add a gradient." The old dark system used radial and linear
    // gradients for hero wash and primary buttons; both are now flat.
    for (const [name, css] of [
      ['tokens.css', tokensCss],
      ['design-system.css', systemCss],
    ]) {
      assert.equal(
        /(linear|radial|conic)-gradient\(/.test(css.replace(/\/\*[\s\S]*?\*\//g, '')),
        false,
        `${name} reintroduced a gradient`,
      );
    }
  });

  test('type stack is Instrument Serif / Instrument Sans / JetBrains Mono', () => {
    assert.match(tokensCss, /--font-display:\s*"Instrument Serif"/);
    assert.match(tokensCss, /--font-sans:\s*"Instrument Sans"/);
    assert.match(tokensCss, /--font-mono:\s*"JetBrains Mono"/);
    assert.match(tokensCss, /Instrument\+Serif/);
  });

  test('headings use the display face at weight 400', () => {
    // §3.1: "Instrument Serif ... weight 400 only".
    const rule = systemCss.match(/h1,\s*h2,\s*h3,\s*h4\s*\{[^}]*\}/);
    assert.ok(rule, 'heading rule not found');
    assert.match(rule[0], /font-family:\s*var\(--font-display\)/);
    assert.match(rule[0], /font-weight:\s*400/);
  });
});

describe('pages consume the token layer', () => {
  const pages = [
    'index.html',
    'pricing.html',
    'about.html',
    'contact.html',
    'case-studies.html',
    'security.html',
    'privacy.html',
    'terms.html',
    'social/index.html',
    'creative/index.html',
    'intel/index.html',
    'freelance/index.html',
    'flow/index.html',
    'campaigns/index.html',
    'campaigns/thanks.html',
  ];

  test('every page loads exactly one Google Fonts stylesheet, the §3 one', () => {
    for (const page of pages) {
      const html = read(page);
      const links = html.match(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/g) ?? [];
      assert.equal(links.length, 1, `${page} should have exactly 1 font stylesheet, has ${links.length}`);
      assert.match(links[0], /Instrument\+Serif/, `${page} is not on the §3 type stack`);
      assert.doesNotMatch(links[0], /family=Inter\b/, `${page} still loads Inter`);
    }
  });

  test('the Google Fonts href matches the token package', () => {
    assert.match(read('index.html'), /family=Instrument\+Serif/);
    assert.match(typeTokens.googleFontsHref, /Instrument\+Serif/);
  });
});
