// /api/campaign-pipeline.js — Full campaign pipeline orchestrator
// Brief → Neural Score → Refine → Generate Campaign → Deploy
// Returns the complete campaign kit ready for deploy

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

function generateCampaignKit(brief, scores) {
  const { van, dmn, dan, limbic } = scores;
  const vanPct = zToPct(van);
  const dmnPct = zToPct(-dmn);
  const danPct = zToPct(dan);
  const limbicPct = zToPct(limbic);
  const overall = Math.round(vanPct * 0.35 + Math.max(0, -dmn * 33 + 50) * 0.25 + danPct * 0.15 + limbicPct * 0.25);

  const lower = brief.toLowerCase();

  // Generate headline from brief content
  let headline;
  if (lower.includes('pqc') || lower.includes('quantum') || lower.includes('compliance')) {
    headline = 'Your data isn\'t safe. Here\'s why.';
  } else if (lower.includes('agency') || lower.includes('marketing') || lower.includes('social')) {
    headline = 'Your agency is overpaying. We fixed it.';
  } else if (lower.includes('real estate') || lower.includes('home') || lower.includes('villa')) {
    headline = 'The property your competitors haven\'t found.';
  } else if (lower.includes('blockchain') || lower.includes('hedera') || lower.includes('smart contract')) {
    headline = 'Enterprise blockchain. No PhD required.';
  } else {
    headline = van > 0.4
      ? 'This changes everything.'
      : 'What they\'re not telling you.';
  }

  // Generate subheadline
  const subheadline = dmn < 0
    ? brief.split(' ').slice(0, 15).join(' ') + ' — this is why it matters now.'
    : brief.length > 80
      ? brief.substring(0, 80) + '...'
      : brief;

  // Platform plan
  const platforms = [];
  if (danPct > 50) platforms.push('LinkedIn carousel (thought leadership)');
  if (vanPct > 50) platforms.push('Twitter/X thread (hook-driven)');
  if (limbicPct > 50) platforms.push('Instagram (visual + emotional)');
  if (vanPct > 60) platforms.push('TikTok short (pattern interrupt)');
  if (platforms.length === 0) platforms.push('LinkedIn post', 'Twitter/X thread');

  // Image prompt
  const imagePrompt = brief.replace(/[.!?]$/, '') + ' — editorial photography style, premium brand aesthetic, soft natural lighting, shallow depth of field, 35mm, award-winning editorial composition, cinematic color grading.';

  // Call to action
  const cta = dan > 0.2
    ? ['Book a demo', 'See the platform', 'Schedule an audit']
    : limbic > 0.1
      ? ['Get started today', 'Claim your spot', 'Join the waitlist']
      : ['Learn more', 'Get in touch', 'Request access'];

  return {
    campaign: {
      headline,
      subheadline,
      brief: brief.trim(),
      platforms,
      image_prompt: imagePrompt,
      cta_options: cta,
      aspect_ratios: ['4:5', '9:16', '1:1', '16:9'],
      tone: van > 0.5 ? 'provocative' : dmn < -0.2 ? 'urgent' : limbic > 0.2 ? 'emotional' : 'authoritative',
    },
    neural_scores: {
      van: { z: Math.round(van * 100) / 100, pct: vanPct },
      dmn: { z: Math.round(dmn * 100) / 100, pct: dmnPct },
      dan: { z: Math.round(dan * 100) / 100, pct: danPct },
      limbic: { z: Math.round(limbic * 100) / 100, pct: limbicPct },
      overall,
    },
  };
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

  // Step 2: Generate campaign kit
  const kit = generateCampaignKit(brief.trim(), originalScores);
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
      source: 'heuristic',
      brief_length: brief.trim().length,
      generated_at: new Date().toISOString(),
      deploy_url: `https://nexus.taurusai.io/dogfood.html#campaign-${deployKey}`,
    },
  });
}
