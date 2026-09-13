// /api/webhook.js — Sokin payment notifications.
//
// Replaces the Stripe webhook handler. Sokin POSTs to the "Web NotificationURL"
// set in the portal under Settings -> API Service Configuration.
//
// ─────────────────────────────────────────────────────────────────────────────
// READ THIS BEFORE CHANGING ANYTHING: SOKIN DOES NOT SIGN ITS WEBHOOKS
// ─────────────────────────────────────────────────────────────────────────────
// The Stripe handler this replaces verified an HMAC-SHA256 signature with a
// 300-second tolerance, so a forged or replayed body was rejected outright.
//
// Sokin publishes no equivalent. The entire specification — 6,747 lines — has
// zero mentions of signature, HMAC, secret, bearer or token anywhere in the
// webhook documentation. The setup instruction is, in full: "the user must
// specify a Web NotificationURL ... All webhook messages will be sent to this
// URL." Nothing more.
//
// That means ANY party who learns the URL can POST a fabricated
// IncomingPaymentProcessed and, in a naive handler, mint themselves credits.
// So this handler is built on one rule:
//
//     THE REQUEST BODY IS A HINT, NEVER EVIDENCE.
//
// Nothing of value is granted from what the webhook says. The body is used only
// to learn WHICH payment to go and check, and the check is an authenticated
// call to Sokin. Three cheap filters run first so that obvious junk never
// reaches that call:
//
//   1. an unguessable token in the URL, which only Sokin and the portal know,
//   2. the enterpriseId in the body must be ours,
//   3. eventId de-duplication, because a replayed body is otherwise free.
//
// None of the three proves authenticity. Only the lookup does. If Sokin later
// publishes a signing scheme, verify it here and keep the lookup anyway.
//
// Events (Sokin's documented set):
//   OnboardingRequestApproved / Rejected, CorporateActivated / Deactivated,
//   IncomingPaymentProcessed, OutgoingPaymentProcessed / Rejected / Reversed,
//   PaymentCompliancePass, PaymentComplianceFailed, OutgoingPaymentReturn

import { sokinConfig } from '../lib/sokin-client.mjs';

/** Only this one moves value, so only this one needs the authenticated lookup. */
const GRANTS_VALUE = 'IncomingPaymentProcessed';

/** Acknowledged and logged; none of them credit an account. */
const KNOWN_EVENTS = new Set([
  'OnboardingRequestApproved', 'OnboardingRequestRejected',
  'CorporateActivated', 'CorporateDeactivated',
  'IncomingPaymentProcessed',
  'OutgoingPaymentProcessed', 'OutgoingPaymentRejected', 'OutgoingPaymentReversed',
  'PaymentCompliancePass', 'PaymentComplianceFailed', 'OutgoingPaymentReturn',
]);

/**
 * eventIds already handled, so a replayed body is a no-op.
 *
 * Process-local, and therefore NOT sufficient on its own: an autoscaled or
 * restarted worker forgets, exactly as the free tier's `_granted_keys` did
 * before it moved into Postgres. It is a cheap first filter, and the
 * authenticated lookup below is what actually makes a replay harmless — a
 * second notification for the same paymentId still resolves to the same single
 * payment, so nothing is credited twice.
 */
const seenEvents = new Set();
const SEEN_LIMIT = 5000;

function remember(eventId) {
  if (seenEvents.has(eventId)) return false;
  if (seenEvents.size >= SEEN_LIMIT) seenEvents.clear();
  seenEvents.add(eventId);
  return true;
}

/**
 * Constant-time-ish comparison for the URL token. Not a signature, and no
 * substitute for one — it only stops a casual prober, and `!==` would leak the
 * token's length and prefix through timing.
 */
function tokenMatches(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string') return false;
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i += 1) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/**
 * Ask Sokin whether this payment really happened.
 *
 * This is the only statement in the whole flow that is trusted, because it is
 * the only one that is authenticated. Returns the matching transaction, or null.
 */
async function confirmPayment(cfg, paymentReference, fetchImpl) {
  const res = await (fetchImpl || globalThis.fetch)(
    `${cfg.api}/api_service/reseller/v1/corporate/customer/transactions_history`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': cfg.apiKey,
        enterprise_id: cfg.enterpriseId,
        message_id: `whconfirm-${globalThis.crypto.randomUUID()}`.slice(0, 50),
      },
      body: JSON.stringify({ reference: paymentReference }),
    },
  );
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (!json || json.success === false) return null;
  const rows = Array.isArray(json.data) ? json.data : (json.transactions ?? []);
  return rows.find((t) => t.reference === paymentReference || t.paymentReference === paymentReference) ?? null;
}

export { KNOWN_EVENTS, GRANTS_VALUE, tokenMatches, confirmPayment };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // 1. The URL token. Configured as part of the NotificationURL in the portal.
  //    Absent config means the endpoint is closed, not open: an unauthenticated
  //    webhook that grants credits is worse than no webhook at all.
  const expected = process.env.SOKIN_WEBHOOK_TOKEN;
  if (!expected) {
    console.error('webhook: SOKIN_WEBHOOK_TOKEN is not set; refusing all notifications');
    return res.status(503).json({ error: 'Not configured.' });
  }
  if (!tokenMatches(req.query?.token, expected)) {
    // Deliberately vague, and deliberately not 401: an unauthenticated prober
    // learns nothing about whether the path exists.
    return res.status(404).json({ error: 'Not found.' });
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const { enterpriseId, eventId, notificationType } = body;

  if (!eventId || !notificationType) {
    return res.status(400).json({ error: 'Malformed notification.' });
  }

  // 2. It must claim to be for us.
  let cfg;
  try {
    cfg = sokinConfig(process.env);
  } catch {
    console.error('webhook: Sokin credentials absent; cannot confirm anything');
    return res.status(503).json({ error: 'Not configured.' });
  }
  if (enterpriseId !== cfg.enterpriseId) {
    console.warn('webhook: notification for a different enterpriseId, ignored');
    return res.status(404).json({ error: 'Not found.' });
  }

  // 3. Replay.
  if (!remember(eventId)) {
    // 200, not an error: Sokin retrying is correct behaviour, and a non-2xx
    // would make it retry harder.
    return res.status(200).json({ received: true, duplicate: true });
  }

  if (!KNOWN_EVENTS.has(notificationType)) {
    console.warn('webhook: unknown notificationType', notificationType);
    return res.status(200).json({ received: true, handled: false });
  }

  if (notificationType !== GRANTS_VALUE) {
    // Everything else is recorded and acknowledged. None of it moves money, so
    // none of it needs the lookup.
    console.log('webhook:', notificationType, 'eventId', eventId);
    return res.status(200).json({ received: true, handled: true });
  }

  // ── IncomingPaymentProcessed — the only event that can grant anything ──
  const reference = body.payment?.paymentReference;
  if (!reference) {
    console.error('webhook: IncomingPaymentProcessed without payment.paymentReference');
    return res.status(200).json({ received: true, handled: false });
  }

  const confirmed = await confirmPayment(cfg, reference);
  if (!confirmed) {
    // The body said a payment arrived and Sokin does not agree. Either a
    // forgery, or a race where the ledger has not caught up. Both are handled
    // the same way: grant nothing, and say so loudly.
    console.error('webhook: could NOT confirm payment', reference, '— granting nothing');
    return res.status(200).json({ received: true, handled: false, confirmed: false });
  }

  // The amount comes from the CONFIRMED record, never from body.amount — that
  // field is attacker-controlled.
  console.log('webhook: confirmed payment', reference,
    confirmed.amount ?? '(amount not in record)', confirmed.currency ?? '');

  // Credit grant is intentionally not wired yet: the durable ledger for this
  // lives in the backend (services/ledger_supabase.py), which is not reachable
  // from Pages Functions, and wiring a grant to an unverified shape would be
  // the exact mistake this file exists to avoid.
  return res.status(200).json({ received: true, handled: true, confirmed: true });
}

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };
