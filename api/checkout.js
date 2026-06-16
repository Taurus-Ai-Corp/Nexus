// /api/checkout.js — create fresh Stripe Checkout session on each click
export default async function handler(req, res) {
  const { plan } = req.query;

  const priceMap = {
    starter: process.env.STRIPE_STARTER_PRICE_ID,
    studio: process.env.STRIPE_STUDIO_PRICE_ID,
  };

  const modeMap = {
    starter: 'payment',
    studio: 'subscription',
  };

  const priceId = priceMap[plan];
  const mode = modeMap[plan];

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan. Use starter or studio.' });
  }

  const params = new URLSearchParams();
  params.append('payment_method_types[]', 'card');
  params.append('line_items[0][price]', priceId);
  params.append('line_items[0][quantity]', '1');
  params.append('mode', mode);
  params.append('success_url', 'https://nexus.taurusai.io/thanks.html?session_id={CHECKOUT_SESSION_ID}');
  params.append('cancel_url', 'https://nexus.taurusai.io/#pricing');

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ url: data.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
