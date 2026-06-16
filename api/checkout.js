// /api/checkout.js — Create Stripe Checkout session for any plan
// Supported plans:
//   starter     – $99 one-time + 5 metered credits
//   studio      – $399/mo + 20 metered credits
//   agency_starter  – $399/mo
//   agency_pro      – $999/mo
//   agency_enterprise – $2,499/mo
//   worldcup    – $2,500 one-time (World Cup Neural Pack)

const PLANS = {
  starter:          { amount: 9900,  mode: 'payment',      label: 'Nexus Creative Starter' },
  studio:           { amount: 39900, mode: 'subscription',  label: 'Nexus Creative Studio' },
  agency_starter:   { amount: 39900, mode: 'subscription',  label: 'Agency Starter' },
  agency_pro:       { amount: 99900, mode: 'subscription',  label: 'Agency Pro' },
  agency_enterprise:{ amount: 249900,mode: 'subscription',  label: 'Agency Enterprise' },
  worldcup:         { amount: 250000,mode: 'payment',       label: 'World Cup Neural Pack' },
};

async function stripeApi(endpoint, params) {
  const body = typeof params === 'object' && !(params instanceof URLSearchParams)
    ? new URLSearchParams(params).toString()
    : params.toString();
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Stripe error');
  return data;
}

async function ensurePrice(plan, planCfg) {
  // Use env-configured price IDs for starter/studio
  if (plan === 'starter') return process.env.STRIPE_STARTER_BASE_PRICE_ID;
  if (plan === 'studio') return process.env.STRIPE_STUDIO_BASE_PRICE_ID;

  // For other plans, find or create the product + price dynamically
  const productName = planCfg.label;
  const products = await stripeApi('products', { limit: '100' });
  let product = products.data.find(p => p.name === productName && p.active);
  if (!product) {
    product = await stripeApi('products', { name: productName, active: 'true' });
  }

  const prices = await stripeApi('prices', { product: product.id, limit: '100', active: 'true' });
  let price = prices.data.find(p => p.unit_amount === planCfg.amount && p.currency === 'usd');
  if (!price) {
    const priceParams = {
      product: product.id,
      unit_amount: String(planCfg.amount),
      currency: 'usd',
      active: 'true',
    };
    if (planCfg.mode === 'subscription') {
      priceParams['recurring[interval]'] = 'month';
      priceParams['recurring[usage_type]'] = 'licensed';
    }
    price = await stripeApi('prices', priceParams);
  }
  return price.id;
}

export default async function handler(req, res) {
  const { plan, email } = req.query;
  const planCfg = PLANS[plan];

  if (!planCfg) {
    return res.status(400).json({
      error: 'Invalid plan. Valid plans: ' + Object.keys(PLANS).join(', '),
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required. Pass ?email=user@example.com' });
  }

  try {
    const priceId = await ensurePrice(plan, planCfg);

    const params = new URLSearchParams();
    params.append('mode', planCfg.mode);
    params.append('customer_email', email);

    const baseSuccessUrl = plan === 'worldcup'
      ? 'https://nexus.taurusai.io/thanks.html?session_id={CHECKOUT_SESSION_ID}&plan=worldcup'
      : 'https://nexus.taurusai.io/thanks.html?session_id={CHECKOUT_SESSION_ID}&plan=' + plan;

    params.append('success_url', baseSuccessUrl);
    params.append('cancel_url', 'https://nexus.taurusai.io/#pricing');
    params.append('payment_method_types[]', 'card');
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');

    if (planCfg.mode === 'subscription') {
      params.append('subscription_data[metadata][plan]', plan);
    }

    params.append('metadata[plan]', plan);
    params.append('metadata[customer_email]', email);

    const session = await stripeApi('checkout/sessions', params);

    res.setHeader('Location', session.url);
    return res.status(302).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
