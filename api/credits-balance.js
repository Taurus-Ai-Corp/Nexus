// /api/credits-balance.js — Check remaining credits for a customer
// Uses Stripe Customer metadata for persistence across serverless invocations
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  try {
    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(200).json({
        credits_remaining: 0,
        plan: null,
        message: 'No credits found. Purchase a plan at https://nexus.taurusai.io/#pricing',
      });
    }

    const customer = customers.data[0];
    const creditsRemaining = parseInt(customer.metadata?.credits_remaining || '0', 10);
    const plan = customer.metadata?.plan || null;

    return res.status(200).json({
      credits_remaining: creditsRemaining,
      plan,
      stripe_customer_id: customer.id,
    });
  } catch (err) {
    console.error('[/api/credits-balance] error:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
}
