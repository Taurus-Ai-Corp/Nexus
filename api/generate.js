// /api/generate.js — LLM Router for Nexus Creative
// Routes to NVIDIA NIM models based on mode:
//   'refine'  → qwen2.5-7b-instruct (cheap, $0.05/1M tokens)
//   'generate' → nemotron-3-ultra-550b (expensive, $0.10/1M tokens)

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

export default async function handler(req, res) {
  // CORS + method guard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { brief, mode = 'refine' } = req.body || {};

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

  const model = MODEL_MAP[mode];
  const systemPrompt = SYSTEM_PROMPTS[mode];

  try {
    const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
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
      return res.status(response.status).json({ error: `NVIDIA NIM error: ${errMsg}`, model });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'Empty response from LLM.', model });
    }

    // Try to parse JSON from the response; fall back to raw text
    let parsed;
    try {
      // Handle markdown code fences wrapping JSON
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        title: mode === 'generate' ? 'Campaign Kit' : 'Refined Brief',
        body: content,
        meta: { aspect: '4:5 · 9:16', retouching: 'Editorial grade', turnaround: '~3 minutes' },
      };
    }

    return res.status(200).json({
      ...parsed,
      _meta: { model, mode, tokens: data.usage || null },
    });

  } catch (err) {
    console.error('[/api/generate] error:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
}
