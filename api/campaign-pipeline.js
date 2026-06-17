// /api/campaign-pipeline.js — Full campaign pipeline orchestrator
// Brief → Neural Score → Refine → Generate Campaign → Deploy
// Returns the complete campaign kit ready for deploy
//
// Now powered by the Ad Campaign Prompt Bible (9-block universal skeleton).
// See lib/prompt-bible.mjs for the full framework.

import { buildBibleCampaignKit, ARCHETYPES, CATEGORY_ELEMENTS } from '../lib/prompt-bible.mjs';

function heuristicScore(text) {
  const SIGNALS = {
    van_positive: { keywords: ['surprising', 'unexpected', 'never', 'secret', 'revealed', 'stop', 'wait', 'breakthrough', 'finally', 'introducing', 'new', 'exclusive', 'first look', 'sneak peek', 'discover', 'shock', 'revolutionary', 'game-changer', 'this is not', 'what if', 'the truth about', 'why your', 'the reason', 'forget everything'], weight: 0.08 },
    van_negative: { keywords: ['welcome to', 'introduction', 'as we know', 'traditional', 'standard', 'usual', 'conventional', 'typical'], weight: -0.06 },
    dmn_positive: { keywords: ['as previously mentioned', 'in conclusion', 'furthermore', 'moreover', 'additionally', 'it is important to note', 'as you can see', 'clearly', 'obviously', 'in other words', 'to summarize', 'in summary'], weight: 0.07 },
    dmn_negative: { keywords: ['you', 'your', 'imagine', 'picture this', 'what would', 'how to', 'step by step', 'inside', 'behind the scenes', 'exclusive access', 'limited', 'only', 'now', 'today', 'deadline', 'hurry', 'last chance', 'act now'], weight: -0.05 },
    dan_positive: { keywords: ['because', 'therefore', 'which means', 'as a result', 'this is why', 'the reason', 'here\'s how', 'explain', 'breakdown', 'analysis', 'compare', 'versus', 'vs', 'data', 'research', 'study', 'statistics', 'percent', 'numbers', 'strategy', 'framework', 'system', 'method'], weight: 0.06 },
    dan_negative: { keywords: ['complicated', 'complex', 'difficult', 'confusing', 'messy', 'chaotic', 'overwhelming', 'too many', 'jargon', 'technical', 'abstract'], weight: -0.04 },
    limbic_positive: { keywords: ['love', 'hate', 'fear', 'excited', 'terrified', 'beautiful', 'stunning', 'breathtaking', 'incredible', 'heart', 'soul', 'passion', 'dream', 'nightmare', 'family', 'home', 'community', 'together', 'belong', 'future', 'legacy', 'transform', 'change', 'impact', 'story', 'journey', 'human', 'real', 'authentic'], weight: 0.07 },
    limbic_negative: { keywords: ['functional', 'utility', 'efficient', 'optimized', 'solution', 'tool', 'feature', 'specification', 'enterprise', 'scalable', 'robust', 'seamless'], weight: -0.04 },
  };
  const SYNTAX = { exclamation: { pattern: /!/g, weight: 0.12 }, question: { pattern: /\?/g, weight: 0.08 }, ellipsis: { pattern: /\.\.\./g, weight: 0.10 }, em_dash: { pattern: /—/g, weight: 0.06 }, numbers: { pattern: /\d+/g, weight: 0.04 } };

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const wc = words.length;
  if (wc < 3) return null;

  let van = 0, dmn = 0, dan = 0, limbic = 0;
  for (const [sig, cfg] of Object.entries(SIGNALS)) {
    const m = cfg.keywords.filter(k => lower.includes(k)).length;
    const c = m * cfg.weight;
    if (sig.startsWith('van_')) van += c;
    else if (sig.startsWith('dmn_')) dmn += c;
    else if (sig.startsWith('dan_')) dan += c;
    else if (sig.startsWith('limbic_')) limbic += c;
  }
  for (const [, cfg] of Object.entries(SYNTAX)) {
    van += (text.match(cfg.pattern) || []).length * cfg.weight;
  }
  const lf = Math.min(1, 80 / Math.max(wc, 20));
  van *= lf; dmn *= lf; dan *= lf; limbic *= lf;
  van = Math.max(-1.5, Math.min(1.5, van));
  dmn = Math.max(-1.5, Math.min(1.5, dmn));
  dan = Math.max(-1.5, Math.min(1.5, dan));
  limbic = Math.max(-1.5, Math.min(1.5, limbic));
  return { van, dmn, dan, limbic };
}

function zToPct(z) { return Math.round(Math.min(100, Math.max(0, (z + 1.5) / 3 * 100))); }

// Legacy generateCampaignKit — now delegates to the Bible-powered buildBibleCampaignKit
// Kept for backward compatibility; the real logic is in lib/prompt-bible.mjs
function generateCampaignKit(brief, scores, options = {}) {
  return buildBibleCampaignKit(brief, scores, options);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const { brief, email, platform } = req.body || {};

  if (!brief || !brief.trim()) {
    return res.status(400).json({ error: 'Missing required field: brief' });
  }

  // Step 1: Neural score
  const originalScores = heuristicScore(brief.trim());
  if (!originalScores) {
    return res.status(400).json({ error: 'Brief too short (min 3 words).' });
  }

  // Step 2: Generate campaign kit (Bible-powered)
  const kit = generateCampaignKit(brief.trim(), originalScores, {
    archetype: (req.body || {}).archetype,
  });
  const deployKey = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Step 3: Capture lead if email provided
  if (email && email.includes('@')) {
    try {
      await fetch('https://nexus.taurusai.io/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'campaign_pipeline',
          brief: brief.trim(),
          neural_score: kit.neural_scores.overall,
          platform: platform || 'web',
          campaign_headline: kit.campaign.headline,
        }),
      }).catch(() => {});
    } catch {}
  }

  // Step 4: Push to ORCA (Social Media Orchestra) for multi-agent orchestration
  let orcaStatus = 'skipped';
  const orcaWebhookUrl = process.env.ORCA_WEBHOOK_URL || 'https://orca.taurusai.io/api/campaigns';
  const orcaApiKey = process.env.ORCA_API_KEY || '';
  const orcaAutoDeploy = (req.body || {}).orca_deploy !== false;

  if (orcaAutoDeploy) {
    try {
      const platformMap = {
        'LinkedIn carousel (thought leadership)': 'linkedin',
        'Twitter/X thread (hook-driven)': 'twitter',
        'Instagram (visual + emotional)': 'instagram',
        'TikTok short (pattern interrupt)': 'tiktok',
        'LinkedIn post': 'linkedin',
        'Twitter/X thread': 'twitter',
      };
      const orcaPlatforms = [...new Set(kit.campaign.platforms.map(p => platformMap[p] || p))];

      const contentTypes = [];
      if (kit.campaign.tone === 'provocative') contentTypes.push('thread', 'carousel');
      else if (kit.campaign.tone === 'emotional') contentTypes.push('story', 'reel');
      else if (kit.campaign.tone === 'urgent') contentTypes.push('post', 'thread');
      else contentTypes.push('post', 'article');

      const orcaPayload = {
        name: kit.campaign.headline,
        description: kit.campaign.subheadline + '\n\nOriginal brief: ' + brief.trim(),
        brand_profile: {
          name: 'TAURUS AI Corp',
          voice: kit.campaign.tone,
          guidelines: 'Neural-scored campaign from Nexus Creative. Score: ' + kit.neural_scores.overall + '/100',
          colors: {},
        },
        platforms: orcaPlatforms,
        content_types: contentTypes,
        schedule: {
          start_date: new Date().toISOString().split('T')[0],
          frequency: 'once',
          timezone: 'UTC',
        },
      };

      const orcaHeaders = { 'Content-Type': 'application/json' };
      if (orcaApiKey) orcaHeaders['X-API-Key'] = orcaApiKey;

      const orcaRes = await fetch(orcaWebhookUrl, {
        method: 'POST',
        headers: orcaHeaders,
        body: JSON.stringify(orcaPayload),
        signal: AbortSignal.timeout(8000),
      });

      if (orcaRes.ok) {
        const orcaData = await orcaRes.json();
        orcaStatus = 'pushed';
        kit._orca = {
          campaign_id: orcaData.data?.id || null,
          status: orcaData.data?.status || 'draft',
          dashboard_url: 'https://orca.taurusai.io/campaigns',
        };
      } else {
        const errText = await orcaRes.text().catch(() => '');
        orcaStatus = 'failed:' + orcaRes.status;
        kit._orca = { error: errText.slice(0, 200), http_status: orcaRes.status };
      }
    } catch (err) {
      orcaStatus = 'error';
      kit._orca = { error: err.message };
    }
  }

  return res.status(200).json({
    status: 'success',
    deploy_key: deployKey,
    orca: orcaStatus,
    ...kit,
    _meta: {
      source: 'heuristic+bible',
      brief_length: brief.trim().length,
      generated_at: new Date().toISOString(),
      deploy_url: `https://nexus.taurusai.io/dogfood.html#campaign-${deployKey}`,
      bible_version: '1.0.0',
      archetype: kit.campaign.archetype,
      product_category: kit.campaign.product_category,
      archetype_label: ARCHETYPES[kit.campaign.archetype] || kit.campaign.archetype,
      category_label: (CATEGORY_ELEMENTS[kit.campaign.product_category] || {}).label || kit.campaign.product_category,
    },
  });
}
