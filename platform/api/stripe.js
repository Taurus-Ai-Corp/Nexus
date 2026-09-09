// /api/stripe.js — Combined Stripe checkout + balance endpoint
// POST /api/stripe?action=checkout → create Stripe Checkout Session
// GET /api/stripe?action=balance&email=... → check customer credits

import Stripe from 'stripe';
import { siteOrigin } from '../lib/site-origin.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Campaigns included per billing period. Starter moved from a one-time
// $99/campaign POC to $99/month with 10 campaigns on 2026-09-08.
const creditsMap = { starter: 10, studio: 20 };

async function handleCheckout(req, res) {
  const { email, plan } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  // Only two products have Stripe price IDs on file (STRIPE_STARTER_* / STRIPE_STUDIO_*).
  // This map previously collapsed agency_starter, agency_pro, agency_enterprise, worldcup
  // and enterprise onto 'studio' and fell back to 'starter' for anything unrecognised.
  // Those pages advertise $999, $2,499, $10,000-15,000 and $2,500 respectively, so a
  // successful checkout would have charged Studio's $399/mo instead — an undercharge that
  // looks like a working purchase. Only alias a plan here when its page sells the same
  // product at the same price; reject everything else rather than guess a price.
  const planMap = {
    starter: 'starter',
    studio: 'studio',
    dogfood: 'studio', // campaigns/dogfood.html sells Studio by name, at Studio's price
  };
  const canonical = planMap[plan];

  if (!canonical) {
    return res.status(400).json({
      error: `No price is configured for plan "${plan ?? ''}". `
        + 'Contact sales rather than checking out at another plan\'s price.',
    });
  }

  // Starter is a monthly subscription as of 2026-09-08. Stripe rejects a one-time
  // Price in mode=subscription, and STRIPE_STARTER_PRICE_ID / _BASE_ still point at
  // the old one-time $99 POC price — so this deliberately does NOT fall back to them.
  // Silently reusing a one-time price is the same failure mode the planMap comment
  // above records: a checkout that looks like it worked while billing the wrong thing.
  // Set STRIPE_STARTER_MONTHLY_PRICE_ID to a recurring monthly Price before Starter
  // checkout will work.
  const basePriceId = canonical === 'starter'
    ? process.env.STRIPE_STARTER_MONTHLY_PRICE_ID
    : process.env.STRIPE_STUDIO_BASE_PRICE_ID || process.env.STRIPE_STUDIO_PRICE_ID;

  const meteredPriceId = canonical === 'starter'
    ? process.env.STRIPE_STARTER_METERED_PRICE_ID
    : process.env.STRIPE_STUDIO_METERED_PRICE_ID;

  const includedCredits = creditsMap[canonical];

  if (!basePriceId) {
    return res.status(500).json({
      error: canonical === 'starter'
        ? 'Starter is billed monthly; STRIPE_STARTER_MONTHLY_PRICE_ID is not set to a '
          + 'recurring Stripe Price. Contact sales rather than checking out.'
        : `Stripe price not configured for ${canonical}.`,
    });
  }

  const params = new URLSearchParams();
  params.append('mode', 'subscription'); // Starter and Studio are both monthly
  params.append('customer_email', email);
  // thanks.html lives under /campaigns/ since the nexus-creative-editorial migration.
  // The bare /thanks.html path 404s, which stranded every completed checkout.
  // Derived from the request rather than hardcoded: the host these were pinned to
  // has no DNS record, so every completed checkout would have landed on an
  // unresolvable domain. lib/site-origin.mjs explains why the Host header is
  // allowlisted rather than trusted — these values are redirect targets.
  const origin = siteOrigin(req);
  params.append('success_url', origin + '/campaigns/thanks.html?session_id={CHECKOUT_SESSION_ID}&plan=' + canonical);
  params.append('cancel_url', origin + '/#pricing');
  params.append('payment_method_types[]', 'card');
  params.append('line_items[0][price]', basePriceId);
  params.append('line_items[0][quantity]', '1');

  if (meteredPriceId) {
    params.append('line_items[1][price]', meteredPriceId);
  }

  params.append('subscription_data[metadata][plan]', canonical);
  params.append('subscription_data[metadata][included_credits]', String(includedCredits));

  if (canonical === 'starter') {
    // api/webhook.js only tops the balance up on customer.subscription.updated when
    // reset_credits is the string 'true'. Without it a monthly Starter would be billed
    // every month for an allowance granted once at checkout — strictly worse for the
    // customer than the one-time POC it replaced.
    // NOTE: Studio deliberately still omits this flag, because turning it on would
    // change billing behaviour for existing Studio subscribers. See the handover note.
    params.append('subscription_data[metadata][reset_credits]', 'true');
  }

  params.append('metadata[plan]', canonical);
  params.append('metadata[credits_included]', String(includedCredits));
  params.append('metadata[customer_email]', email);

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const buffer = await response.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(buffer);
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!response.ok) {
    return res.status(response.status).json({ error: data.error?.message || data.raw || 'Stripe error' });
  }

  return res.status(200).json({
    url: data.url,
    session_id: data.id,
    plan: canonical,
    credits_included: includedCredits,
  });
}

async function handleBalance(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return res.status(200).json({
        credits_remaining: 0,
        plan: null,
        message: `No credits found. Purchase a plan at ${siteOrigin(req)}/#pricing`,
      });
    }

    const customer = customers.data[0];
    return res.status(200).json({
      credits_remaining: parseInt(customer.metadata?.credits_remaining || '0', 10),
      plan: customer.metadata?.plan || null,
      stripe_customer_id: customer.id,
    });
  } catch (err) {
    console.error('[/api/stripe balance] error:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const action = req.query?.action || req.body?.action;

  if (req.method === 'POST' && action === 'checkout') {
    return handleCheckout(req, res);
  }

  if (req.method === 'GET' && action === 'balance') {
    return handleBalance(req, res);
  }

  return res.status(400).json({ error: 'Invalid request. Use POST ?action=checkout or GET ?action=balance' });
}
