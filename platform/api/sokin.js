// /api/sokin.js — Sokin checkout, server half.
//
// POST /api/sokin?action=checkout  -> { orderId, paymentRequestId, environment }
//
// This returns IDS, not a URL. Sokin has no hosted checkout page to redirect
// to: the browser loads their SDK and renders an iframe from these two ids.
// That is the substantive difference from the Stripe handler this replaces,
// and it is why /checkout.html exists as a page rather than the button simply
// pointing somewhere new.
//
// Defaults to SANDBOX. A payment integration's first run should never be
// against production, and lib/sokin-client.mjs refuses an unrecognised
// SOKIN_ENV rather than quietly falling back — so a typo in that variable
// fails loudly instead of silently pointing real customers at a test gateway
// (or, far worse, the reverse).

import { siteOrigin } from '../lib/site-origin.mjs';
import { SokinApiError, SokinConfigError, beginCheckout, sokinConfig } from '../lib/sokin-client.mjs';

// Amounts live on the server. A price posted from the browser is a price the
// customer can edit; the plan key is the only thing the client gets to choose.
const PLANS = {
  campaign: { totalAmount: 99, currency: 'USD', description: 'NEORM-ERA Campaign — ten campaign kits per month' },
};

function json(res, status, payload) {
  return res.status(status).json(payload);
}

export default async function handler(req, res) {
  const action = req.query?.action;

  if (req.method !== 'POST' || action !== 'checkout') {
    return json(res, 400, { error: 'Invalid request. Use POST /api/sokin?action=checkout' });
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const { firstName, lastName, email, plan } = body;

  const chosen = PLANS[plan];
  if (!chosen) {
    // Never fall back to a default plan. The Stripe handler's own comments
    // record what that costs: a checkout that looks like it worked while
    // billing the wrong amount.
    return json(res, 400, {
      error: `No plan "${plan ?? ''}". Contact sales rather than checking out at another plan's price.`,
    });
  }
  for (const [field, value] of Object.entries({ firstName, lastName, email })) {
    if (!value || typeof value !== 'string' || !value.trim()) {
      return json(res, 400, { error: `"${field}" is required.` });
    }
  }
  if (!email.includes('@')) return json(res, 400, { error: 'A valid email is required.' });

  let cfg;
  try {
    cfg = sokinConfig(process.env);
  } catch (err) {
    // Missing credentials disable checkout rather than degrade it — the same
    // rule the free tier follows for FREE_TIER_API_KEY. The message never
    // echoes the values.
    if (err instanceof SokinConfigError) {
      console.error('sokin: not configured —', err.message);
      return json(res, 503, { error: 'Checkout is not configured yet. Please contact sales.' });
    }
    throw err;
  }

  try {
    const out = await beginCheckout(cfg, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      currency: chosen.currency,
      totalAmount: chosen.totalAmount,
      description: chosen.description,
      // siteOrigin(req), never a hardcoded host: a checkout begun on a Pages
      // preview must return to that preview. Hardcoding once sent customers to
      // the Vercel site after paying (see lib/site-origin.mjs).
      redirectURL: `${siteOrigin(req)}/campaigns/thanks.html`,
      referenceNo: `neorm-${plan}-${Date.now()}`,
    });
    return json(res, 200, out);
  } catch (err) {
    if (err instanceof SokinApiError) {
      // Sokin wraps failures in a 200 envelope; the client already unwraps
      // that. Surface a generic message and keep the detail in the log.
      console.error('sokin: checkout failed —', err.message, err.status ?? '', JSON.stringify(err.body ?? {}).slice(0, 400));
      return json(res, 502, { error: 'Checkout could not be started. Please try again.' });
    }
    console.error('sokin: unexpected —', err);
    return json(res, 500, { error: 'Checkout is unavailable right now.' });
  }
}

export { PLANS };
