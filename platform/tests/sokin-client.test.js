/**
 * Sokin checkout client.
 *
 * These tests run without credentials, against a fake fetch, because the things
 * most likely to be wrong are things the network cannot tell you:
 *
 *   * the header is `x-api-key` with DASHES. The Sokin docs name the value
 *     `x_api_key` with underscores and then, further down, say "DO NOT use
 *     `x_api_key`". Send the underscore form and every call 401s.
 *   * `components.securitySchemes` in the spec is EMPTY, so a client generated
 *     from it carries no auth at all and still looks finished.
 *   * step 2 is on a DIFFERENT host and takes NO api key. Sending the key there,
 *     or sending it to the api host, are both easy and both wrong.
 *   * `message_id` must be unique per request and <= 50 chars. It is not a
 *     Stripe-style idempotency key; reuse is a collision, not a no-op.
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  SOKIN_HOSTS,
  SokinApiError,
  SokinConfigError,
  beginCheckout,
  createOrder,
  createPaymentRequest,
  messageId,
  sokinConfig,
} from '../lib/sokin-client.mjs';

const ENV = { SOKIN_API_KEY: 'key-guid', SOKIN_ENTERPRISE_ID: 'ent-uuid', SOKIN_ENV: 'sandbox' };

/** Records every call so the headers and hosts can be asserted. */
function recorder(responses) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    const r = responses.shift();
    return { ok: r.ok !== false, status: r.status || 200, text: async () => JSON.stringify(r.body) };
  };
  return { calls, fetchImpl };
}

const ORDER = {
  firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com',
  currency: 'USD', totalAmount: 99,
};

/* ── configuration ───────────────────────────────────────────────────────── */

test('config refuses to run without credentials rather than defaulting', () => {
  assert.throws(() => sokinConfig({}), SokinConfigError);
  assert.throws(() => sokinConfig({ SOKIN_API_KEY: 'k' }), SokinConfigError);
});

test('an unknown SOKIN_ENV is rejected, never silently treated as sandbox', () => {
  // A payment client that quietly falls back to sandbox stops taking real money
  // while reporting success on every call.
  assert.throws(() => sokinConfig({ ...ENV, SOKIN_ENV: 'staging' }), SokinConfigError);
});

test('sandbox and production point at different hosts', () => {
  assert.notEqual(SOKIN_HOSTS.sandbox.api, SOKIN_HOSTS.production.api);
  assert.notEqual(SOKIN_HOSTS.sandbox.gateway, SOKIN_HOSTS.production.gateway);
  assert.equal(sokinConfig({ ...ENV, SOKIN_ENV: 'production' }).api, 'https://api.sokin.net');
});

/* ── message_id ──────────────────────────────────────────────────────────── */

test('message_id is unique per call and inside the 50-character cap', () => {
  const ids = new Set(Array.from({ length: 200 }, () => messageId()));
  assert.equal(ids.size, 200, 'message_id must be unique per request — Sokin tracks on it');
  for (const id of ids) assert.ok(id.length <= 50, `${id} is ${id.length} chars, cap is 50`);
});

test('an over-long prefix fails loudly instead of sending a truncated id', () => {
  assert.throws(() => messageId('x'.repeat(40)), SokinConfigError);
});

/* ── the header trap ─────────────────────────────────────────────────────── */

test('the authenticated call sends x-api-key with DASHES, not x_api_key', async () => {
  const { calls, fetchImpl } = recorder([{ body: { success: true, orderId: 'o1' } }]);
  await createOrder(sokinConfig(ENV), ORDER, fetchImpl);
  const h = calls[0].headers;
  assert.ok('x-api-key' in h, 'header must be x-api-key (dashes)');
  assert.ok(!('x_api_key' in h), 'x_api_key with underscores is explicitly forbidden by the docs');
  assert.equal(h['x-api-key'], 'key-guid');
  assert.equal(h.enterprise_id, 'ent-uuid');
  assert.ok(h.message_id && h.message_id.length <= 50);
});

test('step 2 goes to the gateway host and carries NO api key', async () => {
  const { calls, fetchImpl } = recorder([{ body: { success: true, payment_request_id: 'pr1' } }]);
  await createPaymentRequest(sokinConfig(ENV), 'o1', fetchImpl);
  const c = calls[0];
  assert.ok(c.url.startsWith(SOKIN_HOSTS.sandbox.gateway), `step 2 must hit the gateway host, got ${c.url}`);
  assert.ok(!('x-api-key' in c.headers), 'the spec states this endpoint does not require authentication');
  assert.ok(c.headers.message_id, 'message_id is still required here');
  assert.deepEqual(c.body, { order_id: 'o1' }, 'step 2 body is snake_case order_id, not orderId');
});

/* ── the two-step flow ───────────────────────────────────────────────────── */

test('beginCheckout returns what the browser SDK needs — and no redirect URL', async () => {
  const { calls, fetchImpl } = recorder([
    { body: { success: true, orderId: 'order-123' } },
    { body: { success: true, payment_request_id: 'req-456' } },
  ]);
  const out = await beginCheckout(sokinConfig(ENV), ORDER, fetchImpl);
  assert.deepEqual(out, { orderId: 'order-123', paymentRequestId: 'req-456', environment: 'sandbox' });
  assert.equal(calls.length, 2);
  assert.ok(calls[0].url.endsWith('/api/services/v1/orders'));
  // Unlike Stripe there is no hosted page: the caller cannot just redirect.
  assert.ok(!('url' in out), 'Sokin returns no checkout URL — the SDK renders an iframe');
});

test('each step gets its OWN message_id', async () => {
  const { calls, fetchImpl } = recorder([
    { body: { success: true, orderId: 'o' } },
    { body: { success: true, payment_request_id: 'p' } },
  ]);
  await beginCheckout(sokinConfig(ENV), ORDER, fetchImpl);
  assert.notEqual(calls[0].headers.message_id, calls[1].headers.message_id,
    'reusing a message_id across requests is a collision in Sokin tracking');
});

/* ── failure must not look like success ──────────────────────────────────── */

test('a 200 carrying success:false is treated as a failure', async () => {
  // Sokin wraps errors in a 200 envelope. Checking only res.ok would report a
  // failed payment as a completed one.
  const { fetchImpl } = recorder([{ body: { success: false, message: 'Insufficient permissions' } }]);
  await assert.rejects(() => createOrder(sokinConfig(ENV), ORDER, fetchImpl), SokinApiError);
});

test('a missing orderId is an error, not an undefined passed downstream', async () => {
  const { fetchImpl } = recorder([{ body: { success: true, message: 'ok' } }]);
  await assert.rejects(() => createOrder(sokinConfig(ENV), ORDER, fetchImpl),
    (e) => e instanceof SokinApiError && /no orderId/.test(e.message));
});

test('a missing payment_request_id is an error', async () => {
  const { fetchImpl } = recorder([{ body: { success: true } }]);
  await assert.rejects(() => createPaymentRequest(sokinConfig(ENV), 'o1', fetchImpl), SokinApiError);
});

test('non-JSON from Sokin does not throw a parse error at the call site', async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, text: async () => '<html>gateway timeout</html>' });
  await assert.rejects(() => createOrder(sokinConfig(ENV), ORDER, fetchImpl),
    (e) => e instanceof SokinApiError && /non-JSON/.test(e.message));
});

test('required order fields are checked before any network call', async () => {
  let called = false;
  const fetchImpl = async () => { called = true; };
  await assert.rejects(
    () => createOrder(sokinConfig(ENV), { ...ORDER, email: '' }, fetchImpl),
    SokinConfigError,
  );
  assert.equal(called, false, 'validation must happen before the request, not after');
});
