/**
 * Lazily-constructed Stripe client.
 *
 * WHY THIS EXISTS — module scope runs too early on Cloudflare Pages.
 *
 * api/stripe.js and api/webhook.js each built their client at module scope:
 *
 *     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { ... });
 *
 * On Vercel that is safe — the environment is populated before the module is
 * evaluated. On Cloudflare Pages it is not safe to assume. Pages exposes
 * bindings on `context.env`, and functions/api/[[route]].js merges them into
 * `process.env` — but that merge happens inside onRequest, which runs AFTER
 * every module in the import graph has been evaluated. A module-scope read can
 * therefore capture `undefined`, leaving a permanently unauthenticated client
 * that raises nothing until the first API call fails deep inside the SDK.
 *
 * `nodejs_compat` is enabled on this project and may well populate process.env
 * before module evaluation. But "may well" is not a property to hang billing
 * on, and the failure mode is silent. Reading the key at call time removes the
 * question entirely.
 *
 * Note this only ever affected SDK calls. Checkout-session creation builds its
 * own Authorization header at request time, and webhook signature verification
 * uses node:crypto directly — so neither depended on this client. What did
 * depend on it was every credit-granting call in the webhook, which is the part
 * that must not fail quietly.
 *
 * The client is cached against the key it was built with: the common path costs
 * one string comparison, and a rotated secret rebuilds rather than serving a
 * stale client for the lifetime of the isolate.
 */
import Stripe from 'stripe';

const API_VERSION = '2024-12-18.acacia';

let client = null;
let clientKey = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    // Thrown rather than returned as null. Every caller dereferences the client
    // immediately, so a null would surface as "cannot read properties of null"
    // several frames from the real cause. The adapter logs this message and
    // returns a generic error to the caller, so the reason lands in the logs
    // without leaking configuration state to the public.
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }

  if (client && clientKey === key) return client;

  clientKey = key;
  client = new Stripe(key, { apiVersion: API_VERSION });
  return client;
}

/** Test seam: drop the cached client so a test can vary the key. */
export function resetStripeClient() {
  client = null;
  clientKey = null;
}
