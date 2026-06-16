// /api/ai.js — Combined LLM generation + guardrail endpoint
// POST /api/ai?action=refine|generate → campaign copy generation via NVIDIA NIM
// POST /api/ai?action=guardrail → content safety review

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';

const MODEL_MAP = {
  refine: 'qwen/qwen2.5-7b-instruct',
  generate: 'nvidia/nemotron-3-ultra-550b',
};

const SYSTEM_PROMPTS = {
  refine: `You are Nexus Creative, a world-class campaign copy editor. The user provides a raw campaign brief. Your job:
1. Polish the brief into clean, editorial-grade copy.
2. Suggest 3 headline variants (short, punchy, luxury tone).
3. Provide a platform plan (Instagram, TikTok, LinkedIn, OOH, etc.).
4. List deliverables (hero shot, detail crop, packshot, etc.).
5. Define a color mood with 4-5 swatch names.

Return JSON: { "title": "...", "body": "...", "meta": { "aspect": "...", "retouching": "...", "turnaround": "...", "headlines": ["...","...","..."], "platforms": "...", "deliverables": "...", "color_mood": "..." } }

Keep body formatting with line breaks. Be specific, not generic.`,

  generate: `You are Nexus Creative, a luxury campaign AI. The user provides a product brief. You generate a FULL campaign kit:

1. Campaign concept name (title).
2. Detailed image prompt (editorial photography style, specific lens, lighting, composition).
3. 5 headline variants ranging from minimal to bold.
4. Full platform plan with aspect ratios per platform.
5. Complete deliverables list with shot descriptions.
6. Color mood palette with 4-5 names.
7. Target audience persona.
8. Budget tier indicator (Starter/Studio/Agency).

Return JSON: { "title": "...", "body": "...", "meta": { "aspect": "...", "retouching": "...", "turnaround": "...", "headlines": ["...","...","...","...","..."], "platforms": "...", "deliverables": "...", "color_mood": "...", "audience": "...", "budget_tier": "..." } }

The body should contain the full image prompt with technical detail — lens, lighting, composition, grade. Be specific enough for a photographer or image generation AI to execute directly.`
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
