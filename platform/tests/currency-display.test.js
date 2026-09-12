import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets/js/currency.js');

// The one rule worth a test: a price a visitor SEES must be a price they will
// be CHARGED, or the page must say otherwise in words.
//
// api/stripe.js holds one Stripe Price per plan, so checkout bills USD no matter
// what the page displays. That makes every non-USD figure a promise the checkout
// cannot keep unless it is labelled. These tests pin the three ways that can go
// wrong: mapping a country to a currency nothing is priced in, losing the USD
// fallback, and letting the displayed price drift from the billing code.

const src = () => readFileSync(SRC, 'utf8');

function literalArray(name) {
  const m = src().match(new RegExp(`const ${name} = \\[([^\\]]*)\\]`));
  if (!m) throw new Error(`${name} not found in currency.js`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

test('every currency a country maps to is one we actually support', () => {
  const supported = literalArray('SUPPORTED');
  const map = src().match(/const COUNTRY_TO_CURRENCY = \{([\s\S]*?)\n\};/);
  if (!map) throw new Error('COUNTRY_TO_CURRENCY not found');
  const targets = [...map[1].matchAll(/:\s*'([A-Z]{3})'/g)].map((m) => m[1]);
  const orphans = [...new Set(targets)].filter((c) => !supported.includes(c));
  if (orphans.length) {
    throw new Error(
      `COUNTRY_TO_CURRENCY sends visitors to ${orphans.join(', ')}, which is not in SUPPORTED. ` +
        'They would see a currency with no price behind it.',
    );
  }
});

test('the charge currency is one of the supported currencies', () => {
  const supported = literalArray('SUPPORTED');
  const m = src().match(/const CHARGE_CURRENCY = '([A-Z]{3})'/);
  if (!m) throw new Error('CHARGE_CURRENCY not found');
  if (!supported.includes(m[1])) {
    throw new Error(`CHARGE_CURRENCY ${m[1]} is not in SUPPORTED — the fallback would be unreachable`);
  }
});

test('every displayed price has a USD fallback', () => {
  // render() falls back to data-price-usd when the visitor's currency has no
  // value. An element without one would render empty for anyone outside the US.
  for (const page of ['index.html', 'pricing.html']) {
    const full = join(ROOT, page);
    if (!existsSync(full)) continue;
    const html = readFileSync(full, 'utf8');
    for (const m of html.matchAll(/<[^>]*\sdata-price(?:\s[^>]*)?>/g)) {
      if (!/data-price-usd=/.test(m[0])) {
        throw new Error(`${page}: a [data-price] element has no data-price-usd fallback:\n  ${m[0]}`);
      }
    }
  }
});

test('displayed plan prices match what api/stripe.js would charge', () => {
  // The homepage and pricing page must agree with each other AND with the
  // billing code's plan set. They disagreed three ways before 2026-09-11:
  // homepage AED 299/599, pricing body $49/$199/$349/$799, pricing meta $99.
  const stripe = readFileSync(join(ROOT, 'api/stripe.js'), 'utf8');
  const planMap = stripe.match(/const planMap = \{([\s\S]*?)\};/);
  if (!planMap) throw new Error('planMap not found in api/stripe.js');
  const plans = [...planMap[1].matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
  for (const required of ['starter', 'studio']) {
    if (!plans.includes(required)) {
      throw new Error(`api/stripe.js planMap lost "${required}" — the pricing pages still advertise it`);
    }
  }

  const usdOn = (page) => {
    const html = readFileSync(join(ROOT, page), 'utf8');
    return [...html.matchAll(/data-price-usd="([^"]+)"/g)].map((m) => m[1]);
  };
  const home = usdOn('index.html');
  const pricing = usdOn('pricing.html');
  if (home.length === 0 || pricing.length === 0) {
    throw new Error('expected data-price-usd on both index.html and pricing.html');
  }
  if (JSON.stringify(home) !== JSON.stringify(pricing)) {
    throw new Error(
      `homepage and pricing page advertise different prices:\n  index.html:   ${home.join(', ')}\n  pricing.html: ${pricing.join(', ')}`,
    );
  }
});

test('a non-charge currency is never shown without saying what is billed', () => {
  // The note must key off what was RENDERED, not what the visitor preferred —
  // otherwise a UAE visitor looking at dollars reads "Shown in AED".
  const s = src();
  if (!/renderedNonCharge/.test(s)) {
    throw new Error('render() no longer tracks whether a non-charge currency was actually rendered');
  }
  if (/note\.textContent\s*=\s*currency !== CHARGE_CURRENCY/.test(s)) {
    throw new Error(
      'the billing note is keyed off the PREFERRED currency again. It must key off what was ' +
        'rendered, or it will claim "Shown in AED" over a $99 figure.',
    );
  }
});
