// /api/guardrail.js — Content Safety Filter for Nexus Creative
// Uses NVIDIA NIM nemotron-70b-instruct to check:
//   - Copyright/trademark violations
//   - NSFW/explicit content
//   - Defamation risk
//   - UAE cultural sensitivity
// Returns: { safe: boolean, flags: [...], severity: 'low'|'medium'|'high' }

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'nvidia/nemotron-70b-instruct';

const GUARDRAIL_SYSTEM = `You are a brand safety and legal compliance auditor for Nexus Creative by Taurus AI, a creative agency operating in the UAE, India, and international markets.

Your job is to review campaign text and imagery descriptions for:

1. **Copyright/Trademark**: Does the text reference protected brand names, logos, slogans, or IP without clearance? Flag any use of real brand names (Gucci, Nike, Apple, etc.) unless clearly parodic or editorial.

2. **NSFW/Explicit**: Any sexual content, explicit language, suggestive imagery descriptions, or content unsuitable for public advertising.

3. **Defamation**: Any statements that could be considered defamatory, libelous, or that make negative claims about identifiable persons or businesses.

4. **UAE Cultural Sensitivity**: Content that may violate UAE cultural norms including:
   - Disrespectful depictions of Islam, Islamic symbols, or religious figures
   - Alcohol promotion (prohibited in UAE advertising)
   - Immodest clothing/imagery descriptions for UAE public audience
   - LGBTQ+ themes in contexts targeting UAE markets
   - Political content sensitive to UAE government
   - Gambling or gambling-adjacent content

Rate overall severity:
- 'low': Minor issues that can be resolved with wording changes
- 'medium': Significant issues requiring revision before publication
- 'high': Content must not be published; fundamental legal or cultural violation

Return JSON ONLY:
{
  "safe": true/false,
  "flags": [
    { "category": "copyright|nsfw|defamation|uae_cultural", "description": "specific issue", "severity": "low|medium|high", "suggestion": "how to fix" }
  ],
  "severity": "low|medium|high"
}

If everything is clean, return: { "safe": true, "flags": [], "severity": "low" }
Be thorough but fair. Fashion/editorial references are normal in campaign copy — only flag genuine legal/cultural risks.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { text, image_url } = req.body || {};

  if (!text && !image_url) {
    return res.status(400).json({ error: 'Provide at least one of: text, image_url' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured on server.' });
  }

  // Build review content
  let reviewContent = '';
  if (text) {
    reviewContent += `CAMPAIGN TEXT TO REVIEW:\n${text}\n\n`;
  }
  if (image_url) {
    reviewContent += `IMAGE URL TO REVIEW: ${image_url}\n(Note: Image URL provided for context — review any text description above for image-related issues.)\n`;
  }

  try {
    const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: GUARDRAIL_SYSTEM },
          { role: 'user', content: reviewContent },
        ],
        temperature: 0.1, // Low temperature for consistent safety evaluation
        top_p: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error?.message || errText; } catch { errMsg = errText; }
      return res.status(response.status).json({ error: `NVIDIA NIM error: ${errMsg}`, model: MODEL });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'Empty response from guardrail model.', model: MODEL });
    }

    // Parse JSON response
    let result;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return a conservative fail-safe
      result = {
        safe: false,
        flags: [{ category: 'system', description: 'Guardrail model returned non-JSON response; manual review required.', severity: 'medium', suggestion: 'Have a human reviewer check the content before publishing.' }],
        severity: 'medium',
      };
    }

    // Validate required fields
    if (typeof result.safe !== 'boolean') result.safe = false;
    if (!Array.isArray(result.flags)) result.flags = [];
    if (!['low', 'medium', 'high'].includes(result.severity)) result.severity = 'medium';

    return res.status(200).json({
      ...result,
      _meta: { model: MODEL, tokens: data.usage || null },
    });

  } catch (err) {
    console.error('[/api/guardrail] error:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
}
