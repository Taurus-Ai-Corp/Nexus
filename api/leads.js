// /api/leads.js — Capture leads from neural scoring & campaign pipeline
// Stores to Supabase if configured, otherwise logs to console

const DEFAULT_WEBHOOK = process.env.LEADS_WEBHOOK_URL || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'leads endpoint active', count: 0 });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST or GET.' });
  }

  const { email, source, brief, neural_score, platform, campaign_headline } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  const lead = {
    email,
    source: source || 'direct',
    brief: brief || '',
    neural_score: neural_score || null,
    platform: platform || 'web',
    campaign_headline: campaign_headline || '',
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
    user_agent: req.headers['user-agent'] || '',
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
    message: 'Lead captured.',
    lead_id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    webhook: webhookResult || 'not_configured',
  });
}
