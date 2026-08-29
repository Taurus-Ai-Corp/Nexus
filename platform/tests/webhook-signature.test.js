// Guards on the Stripe webhook signature check in api/webhook.js.
//
// Two defects these lock down, both found 2026-08-28:
//   1. The `t=` timestamp was parsed and then never checked, so a signature
//      stayed valid forever. Combined with the grant path having no
//      idempotency key, one captured checkout.session.completed request could
//      be replayed to mint credits without limit.
//   2. The digest was compared with `===`, which short-circuits on the first
//      differing byte and leaks the match length.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifySignature, SIGNATURE_TOLERANCE_SECONDS } from '../api/webhook.js';

const SECRET = 'whsec_test_not_a_real_secret';
const BODY = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });

const sign = (ts, body = BODY, secret = SECRET) =>
  `t=${ts},v1=${createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;

describe('webhook signature verification', () => {
  const now = 1_800_000_000;

  test('accepts a correctly signed, fresh payload', () => {
    assert.equal(verifySignature(BODY, sign(now), SECRET, now), true);
  });

  test('accepts a payload at the edge of the tolerance window', () => {
    const ts = now - SIGNATURE_TOLERANCE_SECONDS;
    assert.equal(verifySignature(BODY, sign(ts), SECRET, now), true);
  });

  test('REJECTS a valid signature replayed after the tolerance window', () => {
    const ts = now - SIGNATURE_TOLERANCE_SECONDS - 1;
    assert.equal(verifySignature(BODY, sign(ts), SECRET, now), false,
      'a captured request must stop working once it is stale');
  });

  test('REJECTS a far-future timestamp', () => {
    assert.equal(verifySignature(BODY, sign(now + 4000), SECRET, now), false);
  });

  test('rejects a non-numeric timestamp rather than coercing it', () => {
    const sig = sign(now).replace(/^t=\d+/, 't=abc');
    assert.equal(verifySignature(BODY, sig, SECRET, now), false);
  });

  test('rejects a signature made with the wrong secret', () => {
    assert.equal(verifySignature(BODY, sign(now, BODY, 'whsec_wrong'), SECRET, now), false);
  });

  test('rejects a tampered body under an otherwise valid signature', () => {
    const tampered = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed', x: 1 });
    assert.equal(verifySignature(tampered, sign(now), SECRET, now), false);
  });

  test('rejects a truncated signature without throwing', () => {
    const sig = sign(now);
    const short = sig.slice(0, sig.length - 10);
    assert.doesNotThrow(() => verifySignature(BODY, short, SECRET, now));
    assert.equal(verifySignature(BODY, short, SECRET, now), false);
  });

  test('rejects a header missing v1 entirely', () => {
    assert.equal(verifySignature(BODY, `t=${now}`, SECRET, now), false);
  });
});
