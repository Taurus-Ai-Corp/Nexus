import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// These tests exist because of a Cloudflare Pages-specific failure mode.
//
// api/stripe.js and api/webhook.js used to build their Stripe client at module
// scope. Pages exposes bindings on context.env and functions/api/[[route]].js
// merges them into process.env inside onRequest — which runs after every module
// has already been evaluated. A module-scope read can therefore capture
// undefined and produce a permanently unauthenticated client that raises nothing
// until a credit-granting call fails deep inside the SDK.
//
// The guard that matters is the import test: it fails the moment anyone moves
// client construction back to module scope.

const KEY = 'STRIPE_SECRET_KEY';
const HANDLERS = ['../api/stripe.js', '../api/webhook.js'];

function withoutKey(fn) {
  const prior = process.env[KEY];
  delete process.env[KEY];
  try { return fn(); } finally { if (prior !== undefined) process.env[KEY] = prior; }
}

// NOTE ON WHY THIS IS A SOURCE ASSERTION AND NOT A BEHAVIOURAL ONE.
// The obvious test — "import the handlers with no key and assert nothing throws"
// is worthless here: `new Stripe(undefined)` does not throw. It returns a fully
// formed, permanently unauthenticated object, which is exactly why the original
// bug was silent. There is no observable difference at import time, so the
// invariant has to be asserted against the source.
test('no handler constructs a Stripe client at module scope', () => {
  const offenders = [];
  for (const rel of HANDLERS) {
    const file = join(ROOT, rel.replace('../', ''));
    const src = readFileSync(file, 'utf8');
    if (/new\s+Stripe\s*\(/.test(src)) offenders.push(`${rel} calls new Stripe(...) directly`);
    if (!src.includes("from '../lib/stripe-client.mjs'")) {
      offenders.push(`${rel} does not import getStripe from lib/stripe-client.mjs`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    'Stripe clients must come from lib/stripe-client.mjs, which reads the key at '
      + 'call time. On Cloudflare Pages a module-scope read can capture undefined '
      + 'and produce a silently unauthenticated client.\n  ' + offenders.join('\n  '),
  );
});

test('lib/stripe-client.mjs is the only place that constructs one', () => {
  const src = readFileSync(join(ROOT, 'lib/stripe-client.mjs'), 'utf8');
  assert.match(src, /new Stripe\(key/, 'the shared factory should build from the call-time key');
});

test('getStripe() names the missing variable instead of dereferencing null', async () => {
  const { getStripe, resetStripeClient } = await import('../lib/stripe-client.mjs');
  withoutKey(() => {
    resetStripeClient();
    assert.throws(() => getStripe(), /STRIPE_SECRET_KEY is not configured/);
  });
});

test('getStripe() reads the key at call time, not at import time', async () => {
  const { getStripe, resetStripeClient } = await import('../lib/stripe-client.mjs');
  resetStripeClient();
  // The module was first imported above while the key was absent. If it had read
  // the key then, setting it now could not help.
  process.env[KEY] = 'sk_test_lazy_read';
  assert.ok(getStripe(), 'client should build once the key is present');
});

test('the client is cached per key, so a rotated secret is not served stale', async () => {
  const { getStripe, resetStripeClient } = await import('../lib/stripe-client.mjs');
  resetStripeClient();

  process.env[KEY] = 'sk_test_first';
  const a = getStripe();
  assert.strictEqual(getStripe(), a, 'same key must reuse the cached client');

  process.env[KEY] = 'sk_test_rotated';
  assert.notStrictEqual(getStripe(), a, 'a changed key must rebuild the client');

  delete process.env[KEY];
  resetStripeClient();
});
