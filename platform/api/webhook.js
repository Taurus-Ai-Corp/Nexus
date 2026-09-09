// /api/webhook.js — Stripe webhook handler for metered billing credits
// Handles: checkout.session.completed, customer.subscription.updated,
//          customer.subscription.deleted, invoice.payment_succeeded
import { createHmac, timingSafeEqual } from 'crypto';
// Built per call, not at module scope — see lib/stripe-client.mjs for why.
// Signature verification below uses node:crypto directly and never needed it.
import { getStripe } from '../lib/stripe-client.mjs';

/** Stripe's own default replay window. Signed payloads older than this are refused. */
const SIGNATURE_TOLERANCE_SECONDS = 300;

function verifySignature(body, sigHeader, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  const elements = sigHeader.split(',');
  const sigMap = {};
  for (const el of elements) {
    const [k, v] = el.split('=');
    sigMap[k.trim()] = v.trim();
  }

  const timestamp = sigMap['t'];
  const signature = sigMap['v1'];

  if (!timestamp || !signature) return false;

  // Reject stale payloads. Without this the signature stays valid forever, so a
  // single captured checkout.session.completed request could be replayed to
  // mint credits indefinitely — the grant path has no idempotency key to stop
  // it. Stripe's own libraries enforce the same 300s tolerance.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSeconds - ts) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const payload = `${timestamp}.${body}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  // Constant-time compare: `===` on hex strings leaks how many leading bytes
  // matched, which is enough to forge a signature one byte at a time.
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { verifySignature, SIGNATURE_TOLERANCE_SECONDS };

async function updateCustomerCredits(customerId, creditsDelta, plan) {
  try {
    const customer = await getStripe().customers.retrieve(customerId);
    const currentCredits = parseInt(customer.metadata?.credits_remaining || '0', 10);
    const newCredits = Math.max(0, currentCredits + creditsDelta);

    await getStripe().customers.update(customerId, {
      metadata: {
        ...customer.metadata,
        credits_remaining: String(newCredits),
        plan,
      },
    });

    console.log(`Updated credits for customer ${customerId}: ${currentCredits} → ${newCredits} (${creditsDelta > 0 ? '+' : ''}${creditsDelta})`);
  } catch (err) {
    console.error(`Failed to update customer ${customerId} credits:`, err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured.' });
  }

  const sigHeader = req.headers['stripe-signature'];
  if (!sigHeader) {
    return res.status(400).json({ error: 'Missing Stripe-Signature header.' });
  }

  // Verify webhook signature
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  if (!verifySignature(rawBody, sigHeader, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature.' });
  }

  const event = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
  const { type, data } = event;

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object;
        const plan = session.metadata?.plan || 'starter';
        const creditsIncluded = parseInt(session.metadata?.credits_included || '5', 10);
        const customerId = session.customer;

        if (!customerId) {
          console.error('No customer ID found in checkout session', session.id);
          break;
        }

        // Grant credits via customer metadata
        await updateCustomerCredits(customerId, creditsIncluded, plan);

        console.log(`Credits granted: +${creditsIncluded} to customer ${customerId} (${plan})`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = data.object;
        const newPlan = subscription.metadata?.plan;
        const newCredits = parseInt(subscription.metadata?.included_credits || '20', 10);
        const customerId = subscription.customer;

        // Find the subscription in the customer's subscriptions
        // Reset monthly credits on renewal if metadata indicates it
        if (subscription.metadata?.reset_credits === 'true') {
          await updateCustomerCredits(customerId, newCredits, newPlan || 'studio');
          console.log(`Monthly credits reset for customer ${customerId}: ${newCredits} credits`);
        } else if (newPlan) {
          // Just update plan metadata
          const customer = await getStripe().customers.retrieve(customerId);
          await getStripe().customers.update(customerId, {
            metadata: {
              ...customer.metadata,
              plan: newPlan,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object;
        const customerId = subscription.customer;

        // Remove credits on subscription cancellation
        await getStripe().customers.update(customerId, {
          metadata: {
            ...((await getStripe().customers.retrieve(customerId)).metadata || {}),
            plan: 'none',
            credits_remaining: '0',
          },
        });

        console.log(`Subscription cancelled for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = data.object;
        // Re-grant credits on monthly subscription renewal
        if (invoice.billing_reason === 'subscription_cycle') {
          const subscriptionId = invoice.subscription;
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer;

          if (subscription.metadata?.plan === 'studio') {
            await updateCustomerCredits(customerId, 20, 'studio');
            console.log(`Monthly credits refreshed for customer ${customerId}: 20 credits`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook handler error for ${type}:`, err);
    return res.status(500).json({ error: 'Webhook handler failed.' });
  }
}

// Configure Vercel to parse raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: {
      raw: true,
      type: 'application/json',
    },
  },
};
