/**
 * Resolve the origin this deployment is actually being served from.
 *
 * Every redirect target and self-referential fetch under api/ was hardcoded to
 * https://www.neorm-era.com — a host that has no DNS record. Stripe would have
 * sent every completed checkout to a dead domain, and campaign-pipeline.js
 * fetched its own /api/leads over the public internet at the same dead host.
 * Meanwhile the site actually serves from nexus.taurusai.io, so the hardcoded
 * value was wrong for the live deploy and for every preview deploy too.
 *
 * The Host header is attacker-controlled and these values become redirect
 * targets, so it is validated against an allowlist rather than trusted.
 * SITE_ORIGIN wins when set, which is how the neorm-era.com cutover gets made:
 * set the env var, no code change.
 */

/** Hosts this site is knowingly served from. Extend on a real cutover, not to silence a test. */
const ALLOWED_HOSTS = new Set([
  'nexus.taurusai.io',
  'neorm-era.com',
  'www.neorm-era.com',
  'localhost:3000',
  'localhost:5173',
]);

/** Fallback when the request tells us nothing usable. The host that resolves today. */
export const CANONICAL_ORIGIN = 'https://nexus.taurusai.io';

export function siteOrigin(req) {
  const configured = process.env['SITE_ORIGIN'];
  if (configured) return configured.replace(/\/+$/, '');

  const host = String(req?.headers?.host ?? '').toLowerCase();
  if (!host) return CANONICAL_ORIGIN;

  // Preview/branch deploys get a generated host that cannot be enumerated
  // ahead of time, so each platform gets one suffix rule:
  //   Vercel     <name>.vercel.app
  //   CF Pages   <name>.pages.dev and <branch>.<name>.pages.dev
  // Without the Pages rule a checkout started on neorm-era.pages.dev fell back
  // to CANONICAL_ORIGIN and sent the customer to the Vercel site after paying.
  const trusted =
    ALLOWED_HOSTS.has(host)
    || /^[a-z0-9-]+\.vercel\.app$/.test(host)
    || /^([a-z0-9-]+\.)?[a-z0-9-]+\.pages\.dev$/.test(host);
  if (!trusted) return CANONICAL_ORIGIN;

  const proto = host.startsWith('localhost') ? 'http' : 'https';
  return `${proto}://${host}`;
}
