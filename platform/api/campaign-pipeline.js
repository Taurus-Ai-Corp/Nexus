// /api/campaign-pipeline.js — Full campaign pipeline orchestrator
// Brief → Neural Score → Refine → Generate Campaign → Deploy
// Returns the complete campaign kit ready for deploy
//
// Now powered by the Ad Campaign Prompt Bible (9-block universal skeleton).
// See lib/prompt-bible.mjs for the full framework.

import { siteOrigin } from '../lib/site-origin.mjs';
import { buildBibleCampaignKit, build9BlockPrompt, detectCategory, ARCHETYPES, CATEGORY_ELEMENTS } from '../lib/prompt-bible.mjs';

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


// === GOOGLE FLOW / GEMINI OMNI INTEGRATION ===

const BRAND_COLORS = {
  warm_paper: '#f5f0e4',
  green: '#00843D',
  red: '#CE1126',
  black: '#0e0e0e',
};

const PETPAWSPHERE_CAST = {
  amina: { name: 'Amina', role: 'Emirati pet owner, 28, warm, tech-savvy', species: 'human', look: 'hijab in warm paper tone, soft natural makeup, casual linen outfit, relaxed smile, modern Dubai apartment', voice: 'friendly, confident, bilingual Arabic-English' },
  khalid: { name: 'Khalid', role: 'Verified breeder, 35, professional, trustworthy', species: 'human', look: 'neat beard, polo shirt in PetPawSphere green, standing in clean breeder facility', voice: 'authoritative, calm, Arabic-first' },
  luna: { name: 'Luna', role: 'Persian kitten, fluffy, playful', species: 'cat', look: 'cream Persian kitten, big green eyes, paw raised, warm paper backdrop' },
  simba: { name: 'Simba', role: 'Golden retriever, friendly family dog', species: 'dog', look: 'golden retriever, happy expression, collar with subtle green accent, Dubai park' },
};

function buildFlowBrief(body) {
  const { campaign, client = 'PetPawSphere', variants = 3 } = body || {};
  const brief = body?.brief || campaign?.brief || 'PetPawSphere — UAE-first pet ecosystem with AI breed detection, MOCCAE-verified breeders, escrow on stud fees, and care reminders with OCR. Premium but approachable.';
  const { category } = detectCategory(brief);
  const cat = CATEGORY_ELEMENTS[category] || CATEGORY_ELEMENTS.pet;
  const archetype = campaign?.archetype || cat.bestArchetype || 'ugc';
  const product = { name: campaign?.product_name || 'PetPawSphere app', color: 'warm paper, green #00843D, red #CE1126', finish: 'clean app UI', packaging: 'iPhone/Android screen showing pet match UI', typography: 'modern Arabic-ready sans-serif, PetPawSphere wordmark', formFactor: 'smartphone app interface' };
  const biblePrompt = build9BlockPrompt({ product, category, archetype, aspectRatio: '9:16', vibe: 'premium, trustworthy, UAE family-friendly, bilingual Arabic-English' });
  const scenes = generateOmniScenes(brief, archetype);
  return {
    brief_id: `flow-${Date.now()}`, client, platform: 'Google Flow', archetype, category,
    brand: { name: 'PetPawSphere', colors: BRAND_COLORS, tagline: 'Where every paw finds its trusted path.', market: 'UAE-first, Arabic bilingual, PDPL-compliant' },
    cast: PETPAWSPHERE_CAST, bible_prompt: biblePrompt,
    flow_session_plan: {
      project_name: `${client} Launch Campaign — ${new Date().toISOString().slice(0, 7)}`,
      steps: [
        { step: 1, action: 'Create new project', details: `Name it "${client} Launch Campaign"` },
        { step: 2, action: 'Set recurring cast', details: 'Add Amina, Khalid, Luna, Simba with their descriptions and voices' },
        { step: 3, action: 'Upload reference images', details: 'Use Neorm-Era campaign assets as image references for product UI and brand colors' },
        { step: 4, action: 'Generate scenes', details: scenes },
        { step: 5, action: 'Apply Flow tools', details: ['Video Resizer → 9:16', 'Type Overlays → bilingual CTA', 'MOCCAE Trust Badge Overlay', 'Shader Effects → warm premium grade'] },
        { step: 6, action: 'Download best variants', details: `${variants} video variants + 2 image variants per scene` },
        { step: 7, action: 'Return to Neorm-Era', details: 'POST to /api/campaign-pipeline with action=omni_ingest and files + metadata' },
      ],
    },
    scenes,
    custom_tools_to_build: [
      'PetPawSphere Ad Pack — 3 video variants from one product shot',
      'MOCCAE Trust Badge Overlay — verified breeder graphic',
      'Arabic Text Overlay — bilingual CTA (Arabic + English)',
      'Vertical 9:16 Resizer — one-click format conversion',
    ],
    export_settings: { video: { format: 'MP4', resolution: '1080×1920', aspect_ratio: '9:16', duration: '8-10s' }, image: { format: 'PNG/JPEG', resolution: '1080×1350', aspect_ratio: '4:5' } },
  };
}

function generateOmniScenes(brief, archetype) {
  const scenes = [
    { scene: 'hero_match', title: 'AI Breed Detection Match', prompt: 'Close-up of @Amina holding an iPhone. Screen shows PetPawSphere app with AI breed detection result: "94% match — Persian kitten". Warm paper and green color palette. Natural living room, UAE apartment. Soft window light. 9:16 vertical, premium UGC feel.', cast: ['amina'], output: '9:16 video, 8s', tools: ['Video Resizer', 'Type Overlays'] },
    { scene: 'breeder_trust', title: 'MOCCAE Verified Breeder', prompt: '@Khalid stands in a clean modern pet facility. He gestures toward a phone screen showing a breeder profile with green "MOCCAE Verified" badge. Trustworthy, calm, Arabic-first tone. Neutral warm lighting. 9:16 vertical.', cast: ['khalid'], output: '9:16 video, 8s', tools: ['MOCCAE Trust Badge Overlay', 'Type Overlays'] },
    { scene: 'family_moment', title: 'Family + Pet Connection', prompt: 'Emirati family sitting on a warm paper-toned sofa. @Simba the golden retriever rests his head on a child\'s lap. @Amina smiles while holding phone showing PetPawSphere care reminder. Natural window light, premium lifestyle. 9:16 vertical.', cast: ['amina', 'simba'], output: '9:16 video, 10s', tools: ['Video Resizer', 'Shader Effects'] },
  ];
  if (archetype === 'hero') scenes.push({ scene: 'product_hero', title: 'App Hero Reveal', prompt: 'Cinematic macro of @Luna the Persian kitten paw touching a glowing phone screen. Phone displays PetPawSphere app with matching paw-sphere logo animation. Pure warm paper gradient, dramatic soft light. 9:16 vertical, 8s.', cast: ['luna'], output: '9:16 video, 8s', tools: ['Shader Effects'] });
  if (archetype === 'reveal') scenes.push({ scene: 'app_reveal', title: 'Logo Reveal', prompt: 'Dark frame. PetPawSphere paw-sphere logo emerges from black void into warm paper light. App UI appears inside the sphere. Cinematic rim light, 9:16 vertical, 8s.', cast: [], output: '9:16 video, 8s', tools: ['Shader Effects'] });
  return scenes;
}

const omniAssetStore = [];
const omniFeedbackStore = [];

async function handleOmniBrief(req, res) {
  return res.status(200).json({ status: 'success', endpoint: '/api/campaign-pipeline (action=omni_brief)', ...buildFlowBrief(req.body) });
}

async function handleOmniIngest(req, res) {
  const { asset_url, asset_base64, filename, scene, prompt_hash, metadata = {} } = req.body || {};
  if (!asset_url && !asset_base64) return res.status(400).json({ error: 'Missing asset_url or asset_base64' });
  const record = { id: `omni-asset-${Date.now()}`, asset_url: asset_url || `data:video/mp4;base64,${asset_base64?.slice(0, 32)}...`, filename: filename || `omni-asset-${Date.now()}.mp4`, scene: scene || 'unknown', prompt_hash: prompt_hash || null, metadata, ingested_at: new Date().toISOString() };
  omniAssetStore.push(record);
  return res.status(200).json({ status: 'success', message: 'Asset ingested into Neorm-Era', asset: record, next_steps: ['Run compliance check', 'Convert to 9:16 / 1:1 / 16:9', 'Tag with campaign ID and A/B variant', 'Push to Meta/TikTok/Google Ads via ORCA'] });
}

async function handleOmniTemplates(req, res) {
  return res.status(200).json({ templates: [
    { id: 'petpawsphere-ad-pack', name: 'PetPawSphere Ad Pack', description: 'Generates 3 video variants from a single product shot.', flow_prompt: 'Build a custom tool named "PetPawSphere Ad Pack". Input: one product photo or app screenshot. Output: three 9:16 videos — UGC owner reaction, product hero close-up, trust-badge breeder demo. Use brand colors warm paper #f5f0e4, green #00843D, red #CE1126.', tags: ['pet', 'ugc', 'hero', 'breeder'] },
    { id: 'moccae-trust-badge', name: 'MOCCAE Trust Badge Overlay', description: 'Adds a verified breeder badge.', flow_prompt: 'Build "MOCCAE Trust Badge Overlay". Input: video/image with breeder profile. Output: same asset with green shield badge "MOCCAE Verified" in Arabic and English, top-right with safe padding.', tags: ['compliance', 'trust', 'breeder'] },
    { id: 'arabic-text-overlay', name: 'Arabic Text Overlay', description: 'Adds bilingual CTA overlays.', flow_prompt: 'Build "Arabic Text Overlay". Input: video + English CTA. Output: video with clean Modern Standard Arabic above/below English, centered, safe zone padding.', tags: ['arabic', 'cta', 'uae'] },
    { id: 'vertical-9-16-resizer', name: 'Vertical 9:16 Resizer', description: 'One-click crop to 9:16.', flow_prompt: 'Build "Vertical 9:16 Resizer". Input: any video/image. Output: 1080×1920 vertical with smart subject tracking and brand-color padding.', tags: ['format', 'vertical', 'mobile'] },
  ], note: 'Copy flow_prompt into Google Flow natural-language custom tool builder.' });
}

async function handleOmniFeedback(req, res) {
  const { brief_id, asset_id, platform, spend = 0, impressions = 0, clicks = 0, conversions = 0, notes } = req.body || {};
  if (!brief_id || !asset_id) return res.status(400).json({ error: 'Missing brief_id and asset_id' });
  const record = { id: `omni-fb-${Date.now()}`, brief_id, asset_id, platform: platform || 'unknown', spend, impressions, clicks, conversions, ctr: impressions > 0 ? clicks / impressions : 0, cvr: clicks > 0 ? conversions / clicks : 0, notes, recorded_at: new Date().toISOString() };
  omniFeedbackStore.push(record);
  return res.status(200).json({ status: 'success', message: 'Feedback recorded for prompt evolution', feedback: record });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const { brief, email, platform, action } = req.body || {};

  // Omni / Google Flow actions
  if (action === "omni_brief") return handleOmniBrief(req, res);
  if (action === "omni_ingest") return handleOmniIngest(req, res);
  if (action === "omni_templates") return handleOmniTemplates(req, res);
  if (action === "omni_feedback") return handleOmniFeedback(req, res);


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
      await fetch(`${siteOrigin(req)}/api/leads`, {
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
    } catch { /* best-effort: fall through to the next strategy below */ }
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
          guidelines: 'Neural-scored campaign from Neormative. Score: ' + kit.neural_scores.overall + '/100',
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
      deploy_url: `${siteOrigin(req)}/campaigns/dogfood.html#campaign-${deployKey}`,
      bible_version: '1.0.0',
      archetype: kit.campaign.archetype,
      product_category: kit.campaign.product_category,
      archetype_label: ARCHETYPES[kit.campaign.archetype] || kit.campaign.archetype,
      category_label: (CATEGORY_ELEMENTS[kit.campaign.product_category] || {}).label || kit.campaign.product_category,
    },
  });
}
