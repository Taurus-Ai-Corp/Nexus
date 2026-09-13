/**
 * /api/sokin — the server half of Sokin checkout, and the page that renders it.
 *
 * The endpoint is tested through its handler rather than over HTTP, because the
 * failures that matter here are policy failures, not transport ones:
 *
 *   * falling back to a default plan (the Stripe handler's own comments record
 *     what that costs: a checkout that looks like it worked while billing the
 *     wrong amount),
 *   * trusting an amount posted by the browser,
 *   * and degrading instead of disabling when credentials are absent.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import handler, { PLANS } from '../api/sokin.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/** Minimal req/res doubles matching what functions/api/[[route]].js passes in. */
function call(body, query = { action: 'checkout' }, method = 'POST', headers = {}) {
  const out = {};
  const res = {
    status(code) { out.status = code; return res; },
    json(payload) { out.body = payload; return res; },
  };
  return handler({ method, query, body, headers }, res).then(() => out);
}

const GOOD = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', plan: 'campaign' };

/* ── routing ─────────────────────────────────────────────────────────────── */

test('only POST ?action=checkout is accepted', async () => {
  assert.equal((await call(GOOD, { action: 'checkout' }, 'GET')).status, 400);
  assert.equal((await call(GOOD, { action: 'balance' })).status, 400);
});

/* ── the price must come from the server ─────────────────────────────────── */

test('the amount is never taken from the request body', async () => {
  // A price the browser can post is a price the customer can edit.
  const out = await call({ ...GOOD, totalAmount: 1, currency: 'ZAR' });
  assert.notEqual(out.status, 200, 'without credentials this cannot reach Sokin; it must not 200 either way');
  assert.equal(PLANS.campaign.totalAmount, 99);
  assert.equal(PLANS.campaign.currency, 'USD');
});

test('an unknown plan is refused rather than defaulted', async () => {
  for (const plan of ['starter', 'studio', '', undefined, 'CAMPAIGN']) {
    const out = await call({ ...GOOD, plan });
    assert.equal(out.status, 400, `plan "${plan}" must be refused, not mapped to a default`);
    assert.match(out.body.error, /No plan/);
  }
});

/* ── input ───────────────────────────────────────────────────────────────── */

test('name and a plausible email are required before anything else happens', async () => {
  for (const missing of ['firstName', 'lastName', 'email']) {
    const out = await call({ ...GOOD, [missing]: '   ' });
    assert.equal(out.status, 400, `${missing} must be required`);
  }
  assert.equal((await call({ ...GOOD, email: 'not-an-email' })).status, 400);
});

/* ── configuration ───────────────────────────────────────────────────────── */

test('absent credentials DISABLE checkout with a 503 and leak nothing', async () => {
  const saved = { k: process.env.SOKIN_API_KEY, e: process.env.SOKIN_ENTERPRISE_ID };
  delete process.env.SOKIN_API_KEY;
  delete process.env.SOKIN_ENTERPRISE_ID;
  try {
    const out = await call(GOOD);
    assert.equal(out.status, 503);
    assert.match(out.body.error, /not configured/i);
    assert.ok(!/SOKIN_API_KEY|enterprise/i.test(JSON.stringify(out.body)),
      'the error must not name or echo the credentials');
  } finally {
    if (saved.k) process.env.SOKIN_API_KEY = saved.k;
    if (saved.e) process.env.SOKIN_ENTERPRISE_ID = saved.e;
  }
});

/* ── the page ────────────────────────────────────────────────────────────── */

test('checkout.html loads the Sokin SDK and has a container for the iframe', () => {
  const html = read('checkout.html');
  assert.match(html, /pay\.sokin\.com\/sdk\/v1\/sokin-payments-embed-sdk\.umd\.min\.js/,
    'the SDK must be loaded — Sokin returns no URL to redirect to');
  assert.match(html, /id="payment-container"/, 'the SDK renders into a container element');
  assert.match(html, /renderPayment/, 'the SDK call must be present');
});

test('the page handles the SDK failing to load instead of throwing', () => {
  // A deferred third-party script that 404s would otherwise leave the customer
  // on a dead spinner with a ReferenceError in the console.
  const html = read('checkout.html');
  assert.match(html, /typeof SokinPayments === 'undefined'/,
    'the SDK being absent must be handled explicitly');
});

test('the page is noindex — a checkout page has no business in search results', () => {
  assert.match(read('checkout.html'), /name="robots" content="noindex"/);
});

test('the environment is shown to the user, so a sandbox run is never mistaken for a real one', () => {
  const html = read('checkout.html');
  assert.match(html, /no real payment will be taken/,
    'a non-production environment must say so on screen');
});

/* ── wiring ──────────────────────────────────────────────────────────────── */

test('the Worker router actually dispatches /api/sokin', () => {
  // The handler existing is not the same as it being reachable: the Cloudflare
  // router imports every API module explicitly, so a new file is a 404 until it
  // is added in two places.
  const router = read('functions/api/[[route]].js');
  assert.match(router, /import sokin from '\.\.\/\.\.\/api\/sokin\.js'/, 'sokin must be imported');
  assert.match(router, /\n {2}sokin,/, 'sokin must be registered in HANDLERS');
});
