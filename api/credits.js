// /api/credits.js — Credits-based checkout via Stripe Metered Billing
// Creates Checkout Sessions with metered usage for credit consumption
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { customer_email, plan } = req.body || {};

  if (!customer_email) {
    return res.status(400).json({ error: 'Missing customer_email.' });
  }

  if (!['starter', 'studio'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Use starter or studio.' });
  }

  // Metered price IDs (set up via setup_metered_billing.py)
  const meteredPriceMap = {
    starter: process.env.STRIPE_STARTER_METERED_PRICE_ID,
    studio: process.env.STRIPE_STUDIO_METERED_PRICE_ID,
  };

  // Base price IDs (flat fee charged upfront)
  const basePriceMap = {
    starter: process.env.STRIPE_STARTER_BASE_PRICE_ID,
    studio: process.env.STRIPE_STUDIO_BASE_PRICE_ID,
  };

  // Included credits per plan
  const creditsMap = {
    starter: 5,
    studio: 20,
  };

  const basePriceId = basePriceMap[plan];
  const meteredPriceId = meteredPriceMap[plan];
  const includedCredits = creditsMap[plan];

  if (!basePriceId || !meteredPriceId) {
    return res.status(500).json({
      error: `Metered billing not configured for ${plan}. Run setup_metered_billing.py first.`,
    });
  }

  try {
    const params = new URLSearchParams();
    params.append('mode', plan === 'studio' ? 'subscription' : 'payment');
    params.append('customer_email', customer_email);
    params.append('success_url', 'https://nexus.taurusai.io/thanks.html?session_id={CHECKOUT_SESSION_ID}&plan=' + plan);
    params.append('cancel_url', 'https://nexus.taurusai.io/#pricing');
    params.append('payment_method_types[]', 'card');

    // Line item 1: Base flat fee ($99 starter / $399/mo studio)
    params.append('line_items[0][price]', basePriceId);
    params.append('line_items[0][quantity]', '1');

    // Line item 2: Metered usage (credit consumption)
    params.append('line_items[1][price]', meteredPriceId);

    // Subscription-specific: enable Customer Portal + metered usage
    if (plan === 'studio') {
      params.append('subscription_data[metadata][plan]', 'studio');
      params.append('subscription_data[metadata][included_credits]', String(includedCredits));
    }

    // Metadata for webhook processing
    params.append('metadata[plan]', plan);
    params.append('metadata[credits_included]', String(includedCredits));
    params.append('metadata[customer_email]', customer_email);

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
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const message = data.error?.message || data.raw || 'Stripe error';
      return res.status(response.status).json({ error: message });
    }

    return res.status(200).json({
      url: data.url,
      session_id: data.id,
      plan,
      credits_included: includedCredits,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
