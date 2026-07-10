// /api/ai.js — Combined LLM generation + guardrail endpoint
// POST /api/ai?action=refine|generate → campaign copy generation via NVIDIA NIM
// POST /api/ai?action=guardrail → content safety review

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';

const MODEL_MAP = {
  refine: 'qwen/qwen2.5-7b-instruct',
  generate: 'nvidia/nemotron-3-ultra-550b',
};

const SYSTEM_PROMPTS = {
  refine: `You are Nexus Creative, a world-class campaign copy editor powered by the Ad Campaign Prompt Bible.

The Bible uses a 9-block universal prompt skeleton:
1. PREAMBLE (format header: duration, style, device, lighting, camera angle)
2. PRODUCT IDENTITY LOCK (preserve exact product shape, color, finish, packaging, typography, proportions)
3. SUBJECT / PERSON (age, gender, hair, skin texture, clothing — omit for product-only)
4. SETTING / ENVIRONMENT (lived-in clutter for UGC, pure black for reveal, gradient backdrop for hero)
5. BEATS / SHOT SEQUENCE (UGC: Hook→Show→Demo→Result→Verdict; Hero: macro→grab→dramatic→hero; Reveal: emerge→rotate→close)
6. CAMERA / COMPOSITION (framing, movement, edit style)
7. LIGHTING (cinematic studio, premium beauty, warm natural, rim/edge for reveal)
8. AUDIO (video: phone mic/foley/music; image: quality direction)
9. STATIC LOCK / CONSISTENCY ANCHORS (product must remain visually unchanged in every shot)

The user provides a raw campaign brief. Your job:
1. Polish the brief into clean, editorial-grade copy.
2. Suggest 3 headline variants (short, punchy, luxury tone).
3. Provide a platform plan (Instagram, TikTok, LinkedIn, OOH, etc.).
4. List deliverables (hero shot, detail crop, packshot, etc.).
5. Define a color mood with 4-5 swatch names.
6. Identify the product category (skincare, beverage, food, tech, supplement, fragrance, fashion, home, pet, fitness, real_estate, saas).
7. Recommend the best ad archetype (ugc, reveal, hero, showcase, studio, meta).
8. Generate a full 9-block image prompt using the Bible skeleton.

Return JSON: { "title": "...", "body": "...", "meta": { "aspect": "...", "retouching": "...", "turnaround": "...", "headlines": ["...","...","..."], "platforms": "...", "deliverables": "...", "color_mood": "...", "product_category": "...", "recommended_archetype": "...", "bible_image_prompt": "..." } }

Keep body formatting with line breaks. Be specific, not generic. The bible_image_prompt must use all 9 blocks.`,

  generate: `You are Nexus Creative, a luxury campaign AI powered by the Ad Campaign Prompt Bible.

The Bible uses a 9-block universal prompt skeleton for all ad campaigns:
1. PREAMBLE / FORMAT HEADER — duration + style + device + lighting source + camera angle
2. PRODUCT IDENTITY LOCK — "Product @img1: Preserve the exact product shape, {color}, {finish}, {packaging}, {typography}, label placement, proportions, and packaging identity exactly. Do not change the product branding, text layout, color, {form_factor}, structure, or proportions."
3. SUBJECT / PERSON — age, gender, hair, skin texture (2-3 reality cues: visible pores, slight unevenness, hint of shine — NEVER acne/pimples), clothing. Omit for product-only.
4. SETTING / ENVIRONMENT — UGC: lived-in clutter (3-4 objects); Reveal: pure black void; Hero: single deep-color gradient + reflective surface; Studio: complement product color.
5. BEATS / SHOT SEQUENCE — UGC: Hook→Show→Demo→Result→Verdict with jump cuts; Hero: macro→grab+elemental→dramatic angle→hero+CTA; Reveal: emerge→rotate→close.
6. CAMERA / COMPOSITION — UGC: handheld selfie, jump cuts; Hero: slow-motion macro, smooth no shake; Reveal: all SLOW 3-5s, 360 rotation or push-in; Studio: vertical 3:4, centered, premium framing.
7. LIGHTING — UGC: natural source + flaw (no ring light); Hero: high contrast, product brightest; Reveal: rim/edge, no visible source; Studio: cinematic studio or premium beauty.
8. AUDIO (video) / QUALITY (image) — UGC: phone mic, room ambience; Hero: dramatic music + foley; Reveal: music/SFX only; Studio: photorealistic, luxury campaign finish.
9. STATIC LOCK — "The product from @(img1) must remain visually unchanged in every shot. Maintain product design and label details throughout."

Category element banks:
- Skincare: cream swirl, mist, dewy droplets | deep cobalt, warm beige, wet blue surface
- Beverage: splash, pour, ice, condensation | deep amber, ice white, bar counter
- Food: steam, sizzle, crumbs | warm red, cool blue accent, checkered tablecloth
- Tech: sparks, light trails, smoke | pure black, silver, desk setup
- Supplement: powder explosion, particles | charcoal, silver, kitchen counter
- Fragrance: mist diffusion, glass refraction | matching scent color, ivory, dressing table
- Fashion: fabric texture, raking light | matching tone, editorial contrast
- Home: warm glow, flame flicker | warm brown, ivory, wooden surface
- Real Estate: architectural lines, golden hour | warm stone, brass gold, interior

The user provides a product brief. You generate a FULL campaign kit:

1. Campaign concept name (title).
2. Product category detection.
3. Recommended ad archetype (ugc, reveal, hero, showcase, studio, meta).
4. Full 9-block Bible image prompt using the skeleton above — all 9 blocks, specific to the product.
5. 5 headline variants ranging from minimal to bold.
6. Full platform plan with aspect ratios per platform.
7. Complete deliverables list with shot descriptions.
8. Color mood palette with 4-5 names.
9. Target audience persona.
10. Budget tier indicator (Starter/Studio/Agency).

Return JSON: { "title": "...", "body": "...", "meta": { "aspect": "...", "retouching": "...", "turnaround": "...", "headlines": ["...","...","...","...","..."], "platforms": "...", "deliverables": "...", "color_mood": "...", "audience": "...", "budget_tier": "...", "product_category": "...", "recommended_archetype": "...", "bible_image_prompt": "full 9-block prompt here", "bible_video_prompt": "full 9-block video prompt or null if studio" } }

The body should contain the full image prompt with technical detail. The bible_image_prompt must use all 9 blocks with specific product details. Be specific enough for a photographer or image generation AI to execute directly.`
};

const GUARDRAIL_MODEL = 'nvidia/nemotron-70b-instruct';
const GUARDRAIL_SYSTEM = `You are a brand safety and legal compliance auditor for Nexus Creative by Taurus AI, operating in the UAE and international markets.

Review campaign text and imagery descriptions for:
1. Copyright/Trademark — protected brand names, logos, slogans without clearance.
2. NSFW/Explicit — sexual content, explicit language, suggestive imagery.
3. Defamation — negative claims about identifiable persons or businesses.
4. UAE Cultural Sensitivity — disrespect of Islam/Islamic symbols, alcohol promotion, immodest clothing for UAE audience, LGBTQ+ themes targeting UAE, political sensitivity, gambling.

Return JSON ONLY:
{
  "safe": true/false,
  "flags": [
    { "category": "copyright|nsfw|defamation|uae_cultural", "description": "specific issue", "severity": "low|medium|high", "suggestion": "how to fix" }
  ],
  "severity": "low|medium|high"
}
If clean: { "safe": true, "flags": [], "severity": "low" }`;

async function handleGenerate(req, res) {
  const mode = req.query.mode || req.body?.mode || 'refine';
  const brief = req.body?.brief || req.body?.query;

  if (!brief || !brief.trim()) {
    return res.status(400).json({ error: 'Missing required field: brief' });
  }

  if (!MODEL_MAP[mode]) {
    return res.status(400).json({ error: `Invalid mode. Use 'refine' or 'generate'. Got: '${mode}'` });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured on server.' });
  }

  const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_MAP[mode],
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[mode] },
        { role: 'user', content: brief.trim() },
      ],
      temperature: mode === 'refine' ? 0.4 : 0.7,
      top_p: 0.9,
      max_tokens: mode === 'refine' ? 1024 : 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg;
    try { errMsg = JSON.parse(errText).error?.message || errText; } catch { errMsg = errText; }
    return res.status(response.status).json({ error: `NVIDIA NIM error: ${errMsg}`, model: MODEL_MAP[mode] });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return res.status(502).json({ error: 'Empty response from LLM.', model: MODEL_MAP[mode] });

  let parsed;
  try {
    parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch {
    parsed = {
      title: mode === 'generate' ? 'Campaign Kit' : 'Refined Brief',
      body: content,
      meta: { aspect: '4:5 · 9:16', retouching: 'Editorial grade', turnaround: '~3 minutes' },
    };
  }

  return res.status(200).json({ ...parsed, _meta: { model: MODEL_MAP[mode], mode, tokens: data.usage || null } });
}

async function handleGuardrail(req, res) {
  const { text, image_url } = req.body || {};

  if (!text && !image_url) {
    return res.status(400).json({ error: 'Provide at least one of: text, image_url' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured on server.' });
  }

  let reviewContent = '';
  if (text) reviewContent += `CAMPAIGN TEXT TO REVIEW:\n${text}\n\n`;
  if (image_url) reviewContent += `IMAGE URL: ${image_url}\n`;

  const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: GUARDRAIL_MODEL,
      messages: [
        { role: 'system', content: GUARDRAIL_SYSTEM },
        { role: 'user', content: reviewContent },
      ],
      temperature: 0.1,
      top_p: 0.5,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg;
    try { errMsg = JSON.parse(errText).error?.message || errText; } catch { errMsg = errText; }
    return res.status(response.status).json({ error: `NVIDIA NIM error: ${errMsg}`, model: GUARDRAIL_MODEL });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return res.status(502).json({ error: 'Empty response from guardrail model.', model: GUARDRAIL_MODEL });

  let result;
  try {
    result = JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch {
    result = { safe: false, flags: [{ category: 'system', description: 'Non-JSON guardrail response; manual review required.', severity: 'medium', suggestion: 'Human review before publishing.' }], severity: 'medium' };
  }

  if (typeof result.safe !== 'boolean') result.safe = false;
  if (!Array.isArray(result.flags)) result.flags = [];
  if (!['low', 'medium', 'high'].includes(result.severity)) result.severity = 'medium';

  return res.status(200).json({ ...result, _meta: { model: GUARDRAIL_MODEL, tokens: data.usage || null } });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const action = req.query.action || req.body?.action;

  if (action === 'refine' || action === 'generate') {
    return handleGenerate({ ...req, query: { ...req.query, mode: action } }, res);
  }

  if (action === 'guardrail') {
    return handleGuardrail(req, res);
  }

  return res.status(400).json({ error: "Invalid action. Use 'refine', 'generate', or 'guardrail'." });
}
