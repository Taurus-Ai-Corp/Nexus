/**
 * Cloudflare Pages Functions adapter for the Vercel-style handlers in api/.
 *
 * Pages Functions receive ({ request, env, params }) and return a Response.
 * The nine handlers in api/ were written for Vercel's (req, res) contract.
 * Rather than rewrite nine files — and fork them from whatever still deploys
 * to Vercel — this shims one contract onto the other. The handlers are
 * imported unchanged.
 *
 * The imports are static and explicit on purpose: a dynamic import built from
 * a path variable is not statically analysable, so the bundler would ship none
 * of them and every route would 404 at runtime with nothing in the build log.
 */
import ai from '../../api/ai.js';
import campaignPipeline from '../../api/campaign-pipeline.js';
import contact from '../../api/contact.js';
import extras from '../../api/extras.js';
import imagen from '../../api/imagen.js';
import leads from '../../api/leads.js';
import neural from '../../api/neural.js';
import stripe from '../../api/stripe.js';
import webhook from '../../api/webhook.js';

const HANDLERS = {
  ai,
  'campaign-pipeline': campaignPipeline,
  contact,
  extras,
  imagen,
  leads,
  neural,
  stripe,
  webhook,
};

export async function onRequest(context) {
  const { request, env, params } = context;
  const route = Array.isArray(params.route) ? params.route[0] : params.route;
  const handler = HANDLERS[route];

  if (!handler) {
    return new Response(JSON.stringify({ error: `No API route "${route ?? ''}".` }), {
      status: 404, headers: { 'content-type': 'application/json' },
    });
  }

  // Pages exposes secrets on env, not process.env. nodejs_compat populates
  // process.env too, but the handlers read it at module scope, which runs
  // before this function — so merge here as well rather than depend on
  // evaluation order.
  if (typeof process !== 'undefined' && process.env) Object.assign(process.env, env);

  const url = new URL(request.url);
  const ct = request.headers.get('content-type') ?? '';
  let body = '';
  if (request.method !== 'GET' && request.method !== 'HEAD') body = await request.text();

  const req = {
    method: request.method,
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers),
    query: Object.fromEntries(url.searchParams),
    body: body && ct.includes('json') ? safeJson(body) : body,
  };

  // Minimal Vercel res. Resolves a Response when the handler terminates.
  let resolve;
  const done = new Promise((r) => { resolve = r; });
  const headers = new Headers();
  let statusCode = 200;

  const res = {
    get statusCode() { return statusCode; },
    set statusCode(v) { statusCode = v; },
    setHeader(k, v) { headers.set(k, v); return res; },
    status(code) { statusCode = code; return res; },
    json(payload) {
      headers.set('content-type', 'application/json');
      resolve(new Response(JSON.stringify(payload), { status: statusCode, headers }));
      return res;
    },
    send(payload) {
      resolve(new Response(typeof payload === 'string' ? payload : JSON.stringify(payload),
        { status: statusCode, headers }));
      return res;
    },
    end(payload) {
      resolve(new Response(payload ?? '', { status: statusCode, headers }));
      return res;
    },
    redirect(code, location) {
      headers.set('location', location);
      resolve(new Response(null, { status: typeof code === 'number' ? code : 302, headers }));
      return res;
    },
  };

  try {
    await Promise.race([handler(req, res), done]);
  } catch (err) {
    // Never leak a stack trace or a credential to the caller.
    console.error(`[api/${route}]`, err);
    return new Response(JSON.stringify({ error: 'Internal error.' }), {
      status: 500, headers: { 'content-type': 'application/json' },
    });
  }
  return done;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}
