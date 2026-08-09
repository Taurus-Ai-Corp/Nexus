// /api/stripe.js — Combined Stripe checkout + balance endpoint
// POST /api/stripe?action=checkout → create Stripe Checkout Session
// GET /api/stripe?action=balance&email=... → check customer credits

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const creditsMap = { starter: 5, studio: 20 };

async function handleCheckout(req, res) {
  const { email, plan } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  const planMap = {
    starter: 'starter',
    studio: 'studio',
    enterprise: 'studio',
    agency_starter: 'studio',
    agency_pro: 'studio',
    agency_enterprise: 'studio',
    worldcup: 'studio',
    dogfood: 'studio',
  };
  const canonical = planMap[plan] || 'starter';

  if (!['starter', 'studio'].includes(canonical)) {
    return res.status(400).json({ error: 'Invalid plan. Use starter or studio.' });
  }

  const basePriceId = canonical === 'starter'
    ? process.env.STRIPE_STARTER_BASE_PRICE_ID || process.env.STRIPE_STARTER_PRICE_ID
    : process.env.STRIPE_STUDIO_BASE_PRICE_ID || process.env.STRIPE_STUDIO_PRICE_ID;

  const meteredPriceId = canonical === 'starter'
    ? process.env.STRIPE_STARTER_METERED_PRICE_ID
    : process.env.STRIPE_STUDIO_METERED_PRICE_ID;

  const includedCredits = creditsMap[canonical];

  if (!basePriceId) {
    return res.status(500).json({ error: `Stripe price not configured for ${canonical}.` });
  }

  const params = new URLSearchParams();
  params.append('mode', canonical === 'studio' ? 'subscription' : 'payment');
  params.append('customer_email', email);
  // thanks.html lives under /campaigns/ since the nexus-creative-editorial migration.
  // The bare /thanks.html path 404s, which stranded every completed checkout.
  params.append('success_url', 'https://nexus.taurusai.io/campaigns/thanks.html?session_id={CHECKOUT_SESSION_ID}&plan=' + canonical);
  params.append('cancel_url', 'https://nexus.taurusai.io/#pricing');
  params.append('payment_method_types[]', 'card');
  params.append('line_items[0][price]', basePriceId);
  params.append('line_items[0][quantity]', '1');

  if (meteredPriceId) {
    params.append('line_items[1][price]', meteredPriceId);
  }

  if (canonical === 'studio') {
    params.append('subscription_data[metadata][plan]', 'studio');
    params.append('subscription_data[metadata][included_credits]', String(includedCredits));
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
        message: 'No credits found. Purchase a plan at https://nexus.taurusai.io/#pricing',
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
