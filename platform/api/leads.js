// /api/leads.js — Capture leads with IP+email one-free-credit gate + fingerprinting
// One free neural-score credit per unique IP+device fingerprint
// Multi-email same-IP flagging with geolocation/ASN enrichment

const DEFAULT_WEBHOOK = process.env.LEADS_WEBHOOK_URL || '';
const CREDIT_COST = 1; // 1 credit per neural score

// In-memory stores (production: use Redis/KV with TTL)
const ipCreditStore = new Map();       // ip -> { credits_used, first_seen, emails: Set, fingerprints: Set }
const fingerprintStore = new Map();    // fingerprint -> { ip, emails: Set, credits_used, first_seen, flagged }
const emailStore = new Map();          // email -> { ips: Set, fingerprints: Set, credits_used, first_seen }

// Simple device fingerprint from UA + accept-language + accept-encoding
function makeFingerprint(req) {
  const ua = req.headers['user-agent'] || '';
  const lang = req.headers['accept-language'] || '';
  const enc = req.headers['accept-encoding'] || '';
  const raw = `${ua}|${lang}|${enc}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Extract real client IP
function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (xf) return xf.split(',')[0].trim();
  const xr = req.headers['x-real-ip'];
  if (xr) return xr.trim();
  return req.socket?.remoteAddress?.replace('::ffff:', '') || 'unknown';
}

// Quick geolocation + ASN lookup (free tier ipapi.co, fallback to ip-api.com)
async function enrichIp(ip) {
  if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'local', city: '', asn: '', org: 'private', is_vpn: false, is_proxy: false };
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      return {
        country: data.country_code || '',
        city: data.city || '',
        asn: data.asn || '',
        org: data.org || '',
        is_vpn: data.security?.vpn || false,
        is_proxy: data.security?.proxy || false,
        is_tor: data.security?.tor || false,
        is_hosting: data.security?.hosting || false,
      };
    }
  } catch { /* best-effort: fall through to the next strategy below */ }
  // Fallback
  try {
    const ctrl2 = new AbortController();
    const t2 = setTimeout(() => ctrl2.abort(), 3000);
    const res2 = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,city,as,isp,proxy,hosting`, { signal: ctrl2.signal });
    clearTimeout(t2);
    if (res2.ok) {
      const d = await res2.json();
      if (d.status === 'success') {
        return {
          country: d.countryCode || '',
          city: d.city || '',
          asn: d.as || '',
          org: d.isp || '',
          is_vpn: false,
          is_proxy: d.proxy || false,
          is_tor: false,
          is_hosting: d.hosting || false,
        };
      }
    }
  } catch { /* best-effort: fall through to the next strategy below */ }
  return { country: '', city: '', asn: '', org: '', is_vpn: false, is_proxy: false, is_tor: false, is_hosting: false };
}

// Check if IP+fingerprint has available credit
function checkCredit(ip, fingerprint, email) {
  const ipRec = ipCreditStore.get(ip) || { credits_used: 0, first_seen: Date.now(), emails: new Set(), fingerprints: new Set() };
  const fpRec = fingerprintStore.get(fingerprint) || { ip, emails: new Set(), credits_used: 0, first_seen: Date.now(), flagged: false };
  const emRec = emailStore.get(email) || { ips: new Set(), fingerprints: new Set(), credits_used: 0, first_seen: Date.now() };

  // Track associations
  ipRec.emails.add(email);
  ipRec.fingerprints.add(fingerprint);
  fpRec.emails.add(email);
  emRec.ips.add(ip);
  emRec.fingerprints.add(fingerprint);

  // Flag: multiple emails from same IP (threshold: 3)
  const multiEmailFlag = ipRec.emails.size >= 3;
  // Flag: multiple emails from same fingerprint (threshold: 2)
  const multiEmailFpFlag = fpRec.emails.size >= 2;
  // Flag: same email from different IPs (threshold: 3)
  const emailMultiIpFlag = emRec.ips.size >= 3;
  // Flag: VPN/Proxy/Tor/Hosting
  // (enrichment happens async, so we check stored flags)

  const flagged = multiEmailFlag || multiEmailFpFlag || emailMultiIpFlag || fpRec.flagged;

  // Credit logic: first request from this IP+fingerprint gets free credit
  const ipHasCredit = ipRec.credits_used === 0;
  const fpHasCredit = fpRec.credits_used === 0;
  const hasFreeCredit = ipHasCredit && fpHasCredit;

  return {
    allowed: hasFreeCredit || !flagged, // allow if free credit OR not flagged (paid would go here)
    has_free_credit: hasFreeCredit,
    credits_remaining: hasFreeCredit ? 1 : 0,
    ip_record: { credits_used: ipRec.credits_used, email_count: ipRec.emails.size, fingerprint_count: ipRec.fingerprints.size },
    fp_record: { credits_used: fpRec.credits_used, email_count: fpRec.emails.size, flagged: fpRec.flagged },
    email_record: { credits_used: emRec.credits_used, ip_count: emRec.ips.size, fp_count: emRec.fingerprints.size },
    flags: {
      multi_email_same_ip: multiEmailFlag,
      multi_email_same_fp: multiEmailFpFlag,
      email_multi_ip: emailMultiIpFlag,
    },
    flagged,
  };
}

// Consume credit
function consumeCredit(ip, fingerprint, email) {
  const ipRec = ipCreditStore.get(ip) || { credits_used: 0, first_seen: Date.now(), emails: new Set(), fingerprints: new Set() };
  const fpRec = fingerprintStore.get(fingerprint) || { ip, emails: new Set(), credits_used: 0, first_seen: Date.now(), flagged: false };
  const emRec = emailStore.get(email) || { ips: new Set(), fingerprints: new Set(), credits_used: 0, first_seen: Date.now() };

  ipRec.credits_used += CREDIT_COST;
  fpRec.credits_used += CREDIT_COST;
  emRec.credits_used += CREDIT_COST;

  ipCreditStore.set(ip, ipRec);
  fingerprintStore.set(fingerprint, fpRec);
  emailStore.set(email, emRec);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    // Admin: return stats (protect in production)
    return res.status(200).json({
      status: 'leads endpoint active',
      ip_entries: ipCreditStore.size,
      fingerprint_entries: fingerprintStore.size,
      email_entries: emailStore.size,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST or GET.' });
  }

  const { email, source, brief, neural_score, platform, campaign_headline } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  const ip = getClientIp(req);
  const fingerprint = makeFingerprint(req);
  const ua = req.headers['user-agent'] || '';

  // Enrich IP (async, non-blocking for response)
  const enrichmentPromise = enrichIp(ip);

  // Check credit gate
  const creditCheck = checkCredit(ip, fingerprint, email);

  // If no free credit and flagged, still allow but mark (paid tier would go here)
  // For now: allow first free credit per IP+device, then require upgrade
  if (!creditCheck.has_free_credit && creditCheck.flagged) {
    return res.status(402).json({
      error: 'Free credit used. Multiple accounts detected from this device/network.',
      upgrade_required: true,
      flags: creditCheck.flags,
      fingerprint: fingerprint.slice(0, 8) + '...',
    });
  }

  if (!creditCheck.has_free_credit) {
    return res.status(402).json({
      error: 'Free credit used for this device/network.',
      upgrade_required: true,
      credits_remaining: 0,
    });
  }

  // Consume the free credit
  consumeCredit(ip, fingerprint, email);

  // Wait for enrichment (max 2s)
  let enrichment = { country: '', city: '', asn: '', org: '', is_vpn: false, is_proxy: false, is_tor: false, is_hosting: false };
  try {
    enrichment = await Promise.race([
      enrichmentPromise,
      new Promise(r => setTimeout(() => r(enrichment), 2000)),
    ]);
  } catch { /* best-effort: fall through to the next strategy below */ }

  // Update fingerprint record with enrichment
  const fpRec = fingerprintStore.get(fingerprint);
  if (fpRec) {
    fpRec.enrichment = enrichment;
    fpRec.flagged = fpRec.flagged || enrichment.is_vpn || enrichment.is_proxy || enrichment.is_tor || enrichment.is_hosting;
    fingerprintStore.set(fingerprint, fpRec);
  }

  const lead = {
    email,
    source: source || 'direct',
    brief: brief || '',
    neural_score: neural_score || null,
    platform: platform || 'web',
    campaign_headline: campaign_headline || '',
    timestamp: new Date().toISOString(),
    ip,
    fingerprint: fingerprint.slice(0, 12),
    user_agent: ua,
    enrichment,
    credit_check: {
      has_free_credit: creditCheck.has_free_credit,
      flags: creditCheck.flags,
      flagged: creditCheck.flagged,
    },
  };

  // Forward to webhook if configured
  let webhookResult = null;
  if (DEFAULT_WEBHOOK) {
    try {
      const whRes = await fetch(DEFAULT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      webhookResult = whRes.ok ? 'sent' : 'failed';
    } catch {
      webhookResult = 'error';
    }
  }

  console.log('[LEAD]', JSON.stringify(lead));

  return res.status(200).json({
    status: 'success',
    message: creditCheck.has_free_credit ? 'Lead captured. Free credit applied.' : 'Lead captured.',
    lead_id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    webhook: webhookResult || 'not_configured',
    credit: {
      free_credit_used: creditCheck.has_free_credit,
      credits_remaining: 0,
      fingerprint: fingerprint.slice(0, 8) + '...',
    },
    enrichment: {
      country: enrichment.country,
      city: enrichment.city,
      asn: enrichment.asn,
      org: enrichment.org,
      risk: enrichment.is_vpn || enrichment.is_proxy || enrichment.is_tor || enrichment.is_hosting ? 'high' : 'low',
    },
    flags: creditCheck.flags,
  });
}