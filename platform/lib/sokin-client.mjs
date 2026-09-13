/**
 * sokin-client.mjs — the server half of Sokin checkout.
 *
 * Sokin replaces Stripe as the payment rail. The Stripe account this platform
 * was wired to (acct_1TiUIiS4Bcpxc1nG) is registered to TAURUS AI CORP - FZCO,
 * a UAE entity retired 2026-08-08; it has never processed a transaction and its
 * `country` is immutably AE, so it cannot become the Canadian entity that
 * actually signs NEORM-ERA. Sokin is the replacement, not an addition.
 *
 * Reference: ~/.ai-context/payments/SOKIN.md and the OpenAPI spec beside it.
 * Everything below is taken from that spec — no shape is invented.
 *
 * THE FLOW IS THREE STEPS, NOT A REDIRECT
 * ---------------------------------------
 * Stripe hands back a URL and you send the browser to it. Sokin does not:
 *
 *   1. POST {api}/api/services/v1/orders          -> { orderId }        [authenticated]
 *   2. POST {gateway}/corporate/spay/customer_payment -> { payment_request_id }
 *                                                       [NO auth, but message_id required]
 *   3. browser: SokinPayments SDK renders an iframe from orderId + paymentRequestId
 *
 * Step 2 is the one that surprises people: it is on a DIFFERENT host from step
 * 1, and it takes no API key. Step 3 cannot be done server-side at all — there
 * is no hosted page to redirect to, so the checkout button cannot simply swap
 * its href the way it could between two redirect-style processors.
 *
 * AUTH — three headers, and one of them is a trap
 * ----------------------------------------------
 * The spec's `components.securitySchemes` is EMPTY, so a generated client gets
 * no auth at all and still looks correct. Auth lives in prose:
 *
 *   x-api-key     GUID   Portal -> Settings -> API Service Configuration
 *   enterprise_id UUID   same page
 *   message_id    unique per request, <= 50 chars
 *
 * The prose names the value `x_api_key` with underscores and then says, in the
 * same document: "DO NOT use `x_api_key`, instead use dashes". The header is
 * `x-api-key`. `message_id` is NOT a Stripe-style idempotency key — reusing one
 * is not a safe no-op, it is a collision in Sokin's tracking.
 */

/** Sandbox and production hosts, per the spec's `servers` block. */
const HOSTS = {
  sandbox: { api: 'https://api.uat.sokin.net', gateway: 'https://payment-gateway.uat.sokin.com' },
  production: { api: 'https://api.sokin.net', gateway: 'https://payment-gateway.sokin.com' },
};

export class SokinConfigError extends Error {}
export class SokinApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * A unique id for every request. Sokin caps this at 50 characters.
 *
 * crypto.randomUUID() is 36, leaving room for a short prefix that makes the id
 * traceable in Sokin's logs without pushing past the cap.
 */
export function messageId(prefix = 'neorm') {
  const id = `${prefix}-${globalThis.crypto.randomUUID()}`;
  if (id.length > 50) throw new SokinConfigError(`message_id would be ${id.length} chars; Sokin caps it at 50`);
  return id;
}

/**
 * Read configuration from the environment, failing loudly rather than
 * defaulting. A payment client that quietly falls back to sandbox is a client
 * that silently stops taking real money.
 */
export function sokinConfig(env = {}) {
  const mode = env.SOKIN_ENV || 'sandbox';
  if (!HOSTS[mode]) {
    throw new SokinConfigError(`SOKIN_ENV must be "sandbox" or "production", got "${mode}"`);
  }
  const apiKey = env.SOKIN_API_KEY;
  const enterpriseId = env.SOKIN_ENTERPRISE_ID;
  if (!apiKey || !enterpriseId) {
    throw new SokinConfigError(
      'SOKIN_API_KEY and SOKIN_ENTERPRISE_ID are required. Both are in the Sokin '
      + 'portal under Settings -> API Service Configuration.',
    );
  }
  return { mode, apiKey, enterpriseId, ...HOSTS[mode] };
}

function authHeaders(cfg, prefix) {
  return {
    'content-type': 'application/json',
    // Dashes. The spec names the value x_api_key and then explicitly forbids
    // that spelling for the header.
    'x-api-key': cfg.apiKey,
    enterprise_id: cfg.enterpriseId,
    message_id: messageId(prefix),
  };
}

async function postJson(url, headers, body, fetchImpl) {
  const res = await (fetchImpl || globalThis.fetch)(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new SokinApiError(`Sokin returned non-JSON from ${url}`, { status: res.status, body: text.slice(0, 300) });
  }
  if (!res.ok || json.success === false) {
    throw new SokinApiError(json.message || `Sokin request failed (${res.status})`, { status: res.status, body: json });
  }
  return json;
}

/**
 * Step 1 — create the order. Field names are camelCase here and snake_case in
 * step 2; that is Sokin's convention, not a typo.
 */
export async function createOrder(cfg, { firstName, lastName, email, currency, totalAmount, description, redirectURL, referenceNo }, fetchImpl) {
  for (const [k, v] of Object.entries({ firstName, lastName, email, currency, totalAmount })) {
    if (v === undefined || v === null || v === '') {
      throw new SokinConfigError(`createOrder: "${k}" is required by POST /api/services/v1/orders`);
    }
  }
  const json = await postJson(
    `${cfg.api}/api/services/v1/orders`,
    authHeaders(cfg, 'order'),
    { firstName, lastName, email, currency, totalAmount, description, redirectURL, referenceNo },
    fetchImpl,
  );
  if (!json.orderId) {
    throw new SokinApiError('Sokin accepted the order but returned no orderId', { body: json });
  }
  return json.orderId;
}

/**
 * Step 2 — exchange the order for a payment request id.
 *
 * Deliberately NOT authenticated and on the gateway host, both per the spec:
 * "This endpoint does not require authentication. Note: You must provide a
 * unique random string in the header as message_id."
 */
export async function createPaymentRequest(cfg, orderId, fetchImpl) {
  if (!orderId) throw new SokinConfigError('createPaymentRequest: orderId is required');
  const json = await postJson(
    `${cfg.gateway}/corporate/spay/customer_payment`,
    { 'content-type': 'application/json', message_id: messageId('payreq') },
    { order_id: orderId },
    fetchImpl,
  );
  if (!json.payment_request_id) {
    throw new SokinApiError('Sokin returned no payment_request_id', { body: json });
  }
  return json.payment_request_id;
}

/**
 * Both server steps. The return value is everything the browser SDK needs —
 * there is no URL to redirect to, which is the part that differs most from the
 * Stripe integration this replaces.
 */
export async function beginCheckout(cfg, order, fetchImpl) {
  const orderId = await createOrder(cfg, order, fetchImpl);
  const paymentRequestId = await createPaymentRequest(cfg, orderId, fetchImpl);
  return { orderId, paymentRequestId, environment: cfg.mode };
}

export const SOKIN_HOSTS = HOSTS;
export const SOKIN_SDK_URL = 'https://pay.sokin.com/sdk/v1/sokin-payments-embed-sdk.umd.min.js';
