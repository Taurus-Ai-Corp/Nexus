/**
 * /api/webhook — Sokin payment notifications.
 *
 * The Stripe handler this replaced verified an HMAC signature, so a forged body
 * was rejected before any logic ran. Sokin publishes NO signing scheme: the
 * whole 6,747-line spec has zero mentions of signature, HMAC, secret or token
 * in its webhook documentation.
 *
 * So the property under test is not "does it verify the signature" — there
 * isn't one. It is: **nothing of value may be granted from the request body.**
 * Every test below exists to pin one half of that:
 *
 *   * junk must be cheaply rejected before it reaches Sokin,
 *   * and the only statement that is trusted is the authenticated lookup.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import handler, { GRANTS_VALUE, KNOWN_EVENTS, tokenMatches } from '../api/webhook.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = 'a'.repeat(32);
const ENTERPRISE = 'ent-uuid';

function withEnv(vars, fn) {
  const prior = {};
  for (const [k, v] of Object.entries(vars)) {
    prior[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return Promise.resolve(fn()).finally(() => {
    for (const [k, v] of Object.entries(prior)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
}

const ENV = {
  SOKIN_WEBHOOK_TOKEN: TOKEN,
  SOKIN_API_KEY: 'key',
  SOKIN_ENTERPRISE_ID: ENTERPRISE,
  SOKIN_ENV: 'sandbox',
};

function call(body, { token = TOKEN, method = 'POST' } = {}) {
  const out = {};
  const res = {
    status(c) { out.status = c; return res; },
    json(p) { out.body = p; return res; },
  };
  return handler({ method, query: { token }, body, headers: {} }, res).then(() => out);
}

const paid = (over = {}) => ({
  enterpriseId: ENTERPRISE,
  eventId: `evt-${Math.random()}`,
  notificationType: 'IncomingPaymentProcessed',
  timestamp: '2026-09-13T00:30:00Z',
  payment: { paymentId: 'p1', paymentReference: 'ref-1', classification: 'Incoming' },
  amount: { currency: 'USD', amount: 500 },
  ...over,
});

/* ── the cheap filters ───────────────────────────────────────────────────── */

test('a missing token config CLOSES the endpoint rather than opening it', async () => {
  // An unauthenticated webhook that can grant credits is worse than no webhook.
  const out = await withEnv({ ...ENV, SOKIN_WEBHOOK_TOKEN: undefined }, () => call(paid()));
  assert.equal(out.status, 503);
});

test('a wrong token gets 404, not 401 — a prober learns nothing', async () => {
  const out = await withEnv(ENV, () => call(paid(), { token: 'b'.repeat(32) }));
  assert.equal(out.status, 404);
});

test('token comparison does not short-circuit on the first differing byte', () => {
  // `!==` leaks length and prefix through timing. This is not a signature and
  // is not claimed to be one, but it should not be trivially probeable either.
  assert.equal(tokenMatches('abc', 'abc'), true);
  assert.equal(tokenMatches('abc', 'abd'), false);
  assert.equal(tokenMatches('abc', 'abcd'), false);
  assert.equal(tokenMatches(undefined, 'abc'), false);
  assert.equal(tokenMatches(123, '123'), false);
});

test('a notification for someone else\'s enterpriseId is refused', async () => {
  const out = await withEnv(ENV, () => call(paid({ enterpriseId: 'someone-else' })));
  assert.equal(out.status, 404);
});

test('a replayed eventId is acknowledged but not re-handled', async () => {
  await withEnv(ENV, async () => {
    // Stubbed: without this the first call reaches Sokin's sandbox for real and
    // the test takes five seconds waiting on a network timeout.
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, data: [] }) });
    const body = paid();
    const first = await call(body);
    const second = await call(body);
    assert.equal(second.status, 200, 'a retry must get 2xx or Sokin retries harder');
    assert.equal(second.body.duplicate, true);
    assert.notEqual(first.body.duplicate, true);
  });
});

test('GET is rejected', async () => {
  const out = await withEnv(ENV, () => call(paid(), { method: 'GET' }));
  assert.equal(out.status, 405);
});

/* ── the rule that matters ───────────────────────────────────────────────── */

test('an unconfirmable payment grants NOTHING, even with a perfect body', async () => {
  // The whole point. A forged IncomingPaymentProcessed carrying a valid token
  // and our enterpriseId still must not be believed, because Sokin's own
  // records are the only authenticated statement available.
  const out = await withEnv(ENV, async () => {
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, data: [] }) });
    return call(paid());
  });
  assert.equal(out.status, 200, 'still acknowledged — retrying would not help');
  assert.equal(out.body.confirmed, false);
  assert.equal(out.body.handled, false);
});

test('the handler never reads an amount out of the request body', () => {
  // body.amount is attacker-controlled. Grep the source rather than the
  // behaviour, because the failure is an omission: code that reads it would
  // pass every behavioural test until someone forged a payload.
  // Comments are stripped first: the previous version of this assertion failed
  // on the comment that explains why body.amount must not be read — a guard
  // that trips on its own documentation is a guard nobody keeps.
  const code = readFileSync(join(ROOT, 'api/webhook.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
  assert.doesNotMatch(code, /body\.amount/,
    'body.amount is attacker-controlled and must never be used');
  assert.match(code, /confirmed\.amount/,
    'the amount must come from the authenticated lookup');
});

test('the confirmation call is authenticated, unlike the notification itself', () => {
  const src = readFileSync(join(ROOT, 'api/webhook.js'), 'utf8');
  assert.match(src, /'x-api-key': cfg\.apiKey/, 'the lookup must carry the api key');
  assert.match(src, /transactions_history/, 'confirmation uses Sokin\'s authenticated history API');
});

/* ── the event surface ───────────────────────────────────────────────────── */

test('only one documented event can move value', () => {
  assert.equal(GRANTS_VALUE, 'IncomingPaymentProcessed');
  for (const e of KNOWN_EVENTS) {
    if (e !== GRANTS_VALUE) assert.ok(!/Incoming/.test(e), `${e} must not look like a credit`);
  }
});

test('all eleven documented Sokin events are recognised', () => {
  // Taken from the spec's Supported Events table. An unrecognised type is
  // acknowledged and logged rather than dropped silently.
  for (const e of [
    'OnboardingRequestApproved', 'OnboardingRequestRejected',
    'CorporateActivated', 'CorporateDeactivated', 'IncomingPaymentProcessed',
    'OutgoingPaymentProcessed', 'OutgoingPaymentRejected', 'OutgoingPaymentReversed',
    'PaymentCompliancePass', 'PaymentComplianceFailed', 'OutgoingPaymentReturn',
  ]) assert.ok(KNOWN_EVENTS.has(e), `${e} is documented by Sokin but not handled`);
  assert.equal(KNOWN_EVENTS.size, 11);
});

test('a non-payment event is handled without any lookup', async () => {
  let fetched = false;
  const out = await withEnv(ENV, async () => {
    globalThis.fetch = async () => { fetched = true; return { ok: true, json: async () => ({}) }; };
    return call(paid({ notificationType: 'CorporateActivated' }));
  });
  assert.equal(out.status, 200);
  assert.equal(out.body.handled, true);
  assert.equal(fetched, false, 'events that move no value must not cost an API call');
});

test('an unknown event type is acknowledged, not dropped and not actioned', async () => {
  const out = await withEnv(ENV, () => call(paid({ notificationType: 'SomethingNew' })));
  assert.equal(out.status, 200);
  assert.equal(out.body.handled, false);
});

test('a malformed body is rejected before any credential is read', async () => {
  for (const bad of [{}, { eventId: 'e' }, { notificationType: 'x' }]) {
    const out = await withEnv(ENV, () => call({ enterpriseId: ENTERPRISE, ...bad }));
    assert.equal(out.status, 400, `${JSON.stringify(bad)} must be rejected`);
  }
});

/* ── no Stripe left ──────────────────────────────────────────────────────── */

test('the handler no longer speaks Stripe', () => {
  const src = readFileSync(join(ROOT, 'api/webhook.js'), 'utf8');
  assert.doesNotMatch(src, /stripe-signature|getStripe|STRIPE_WEBHOOK_SECRET/i,
    'the Stripe rail is retired; no part of it may remain in the webhook');
});
