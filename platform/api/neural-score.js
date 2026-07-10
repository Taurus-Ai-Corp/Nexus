// /api/neural-score.js — TRIBE v2 Neural Engagement Scorer
// Analyzes brief text for predicted brain response:
//   VAN  (Ventral Attention) — scroll-stopping power
//   DMN  (Default Mode)     — boredom / retention risk
//   DAN  (Dorsal Attention) — cognitive engagement
//   Limbic                  — emotional resonance
//
// Tier 1: Calls RunPod-hosted TRIBE v2 inference (if configured)
// Tier 2: Falls back to heuristic NLP scoring (always works, zero cost)

const SEVERITY_MAP = { 0: 'low', 1: 'medium', 2: 'high' };

// Heuristic keyword banks mapped to expected neural Z-scores
// Based on TRIBE v2 benchmark patterns from meta-tribeV2-skill
const SIGNALS = {
  van_positive: {                   // Pattern interrupt / surprise triggers
    keywords: ['surprising', 'unexpected', 'never', 'secret', 'revealed',
      'stop', 'wait', 'breakthrough', 'finally', 'introducing', 'new',
      'exclusive', 'first look', 'sneak peek', 'discover', 'shock',
      'revolutionary', 'game-changer', 'this is not', 'what if',
      'the truth about', 'why your', 'the reason', 'forget everything'],
    weight: 0.08,
  },
  van_negative: {                   // Familiar / predictable dampeners
    keywords: ['welcome to', 'introduction', 'as we know', 'traditional',
      'standard', 'usual', 'conventional', 'typical'],
    weight: -0.06,
  },
  dmn_positive: {                   // Boredom triggers (avoid these)
    keywords: ['as previously mentioned', 'in conclusion', 'furthermore',
      'moreover', 'additionally', 'it is important to note',
      'as you can see', 'clearly', 'obviously', 'in other words',
      'to summarize', 'in summary'],
    weight: 0.07,
  },
  dmn_negative: {                   // Engagement triggers (suppress DMN)
    keywords: ['you', 'your', 'imagine', 'picture this', 'what would',
      'how to', 'step by step', 'inside', 'behind the scenes',
      'exclusive access', 'limited', 'only', 'now', 'today',
      'deadline', 'hurry', 'last chance', 'act now'],
    weight: -0.05,
  },
  dan_positive: {                   // Logical tracking / cognitive focus
    keywords: ['because', 'therefore', 'which means', 'as a result',
      'this is why', 'the reason', 'here\'s how', 'explain',
      'breakdown', 'analysis', 'compare', 'versus', 'vs',
      'data', 'research', 'study', 'statistics', 'percent',
      'numbers', 'strategy', 'framework', 'system', 'method'],
    weight: 0.06,
  },
  dan_negative: {                   // Cognitive load / confusion
    keywords: ['complicated', 'complex', 'difficult', 'confusing',
      'messy', 'chaotic', 'overwhelming', 'too many',
      'jargon', 'technical', 'abstract'],
    weight: -0.04,
  },
  limbic_positive: {                // Emotional resonance
    keywords: ['love', 'hate', 'fear', 'excited', 'terrified',
      'beautiful', 'stunning', 'breathtaking', 'incredible',
      'heart', 'soul', 'passion', 'dream', 'nightmare',
      'family', 'home', 'community', 'together', 'belong',
      'future', 'legacy', 'transform', 'change', 'impact',
      'story', 'journey', 'human', 'real', 'authentic'],
    weight: 0.07,
  },
  limbic_negative: {                // Emotional flatness
    keywords: ['functional', 'utility', 'efficient', 'optimized',
      'solution', 'tool', 'feature', 'specification',
      'enterprise', 'scalable', 'robust', 'seamless'],
    weight: -0.04,
  },
};

// Punctuation/syntax markers that affect brain response
const SYNTAX_SIGNALS = {
  exclamation: { pattern: /!/g, weight: 0.12 },
  question: { pattern: /\?/g, weight: 0.08 },
  ellipsis: { pattern: /\.\.\./g, weight: 0.10 },
  em_dash: { pattern: /—/g, weight: 0.06 },
  colon: { pattern: /:/g, weight: 0.02 },
  numbers: { pattern: /\d+/g, weight: 0.04 },
  caps_word: { pattern: /\b[A-Z]{3,}\b/g, weight: 0.05 },
  quotes: { pattern: /[""''""]/g, weight: 0.03 },
};

function heuristicScore(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount < 3) return null;

  let van = 0;
  let dmn = 0;
  let dan = 0;
  let limbic = 0;

  // Keyword scoring
  for (const [signal, config] of Object.entries(SIGNALS)) {
    const matches = config.keywords.filter(k => lower.includes(k)).length;
    const contribution = matches * config.weight;
    if (signal.startsWith('van_')) van += contribution;
    else if (signal.startsWith('dmn_')) dmn += contribution;
    else if (signal.startsWith('dan_')) dan += contribution;
    else if (signal.startsWith('limbic_')) limbic += contribution;
  }

  // Syntax scoring (applies to VAN mainly)
  for (const [, config] of Object.entries(SYNTAX_SIGNALS)) {
    const count = (text.match(config.pattern) || []).length;
    van += count * config.weight;
  }

  // Length normalization — longer text needs more signal to maintain impact
  const lengthFactor = Math.min(1, 80 / Math.max(wordCount, 20));
  van *= lengthFactor;
  dmn *= lengthFactor;
  dan *= lengthFactor;
  limbic *= lengthFactor;

  // Clamp to realistic Z-score range
  van = Math.max(-1.5, Math.min(1.5, van));
  dmn = Math.max(-1.5, Math.min(1.5, dmn));
  dan = Math.max(-1.5, Math.min(1.5, dan));
  limbic = Math.max(-1.5, Math.min(1.5, limbic));

  return { van, dmn, dan, limbic };
}

function zScoreToPercentile(z) {
  // Approximate Z-score → percentile (0-100)
  return Math.round(Math.min(100, Math.max(0, (z + 1.5) / 3 * 100)));
}

function generateNeuralReport(brief, scores) {
  if (!scores) {
    return {
      status: 'error',
      message: 'Could not score brief (too short or empty).',
    };
  }

  const { van, dmn, dan, limbic } = scores;
  const vanPct = zScoreToPercentile(van);
  const dmnPct = zScoreToPercentile(-dmn);  // Inverted: lower DMN = better retention
  const danPct = zScoreToPercentile(dan);
  const limbicPct = zScoreToPercentile(limbic);

  // Overall engagement score (VAN + retention + emotion weighted)
  const retentionScore = Math.max(0, -dmn * 33 + 50);
  const overall = Math.round(
    vanPct * 0.35 +      // Scroll-stop is most important for digital
    retentionScore * 0.25 +  // Retention
    danPct * 0.15 +      // Cognitive engagement
    limbicPct * 0.25     // Emotional resonance
  );

  // Verdict logic (mirroring meta-tribeV2-skill)
  let verdict;
  let verdictReason;
  if (van > 0.5 && dmn < 0) {
    verdict = 'high';
    verdictReason = 'Strong scroll-stop potential with low boredom risk. This brief is likely to perform well.';
  } else if (dmn > 0.5) {
    verdict = 'low';
    verdictReason = 'High boredom risk. Consider adding a stronger hook, pattern interrupt, or emotional trigger.';
  } else if (van < 0.3 && dmn < 0.5) {
    verdict = 'medium';
    verdictReason = 'Decent structure but weak hook. The body is solid — improve the opening 3 seconds.';
  } else {
    verdict = 'medium';
    verdictReason = 'Moderate neural engagement. Could improve with more specific, concrete language.';
  }

  return {
    status: 'success',
    source: 'heuristic',
    scores: {
      van: { z: Math.round(van * 100) / 100, percentile: vanPct, label: 'Scroll-Stop' },
      dmn: { z: Math.round(dmn * 100) / 100, percentile: dmnPct, label: 'Retention' },
      dan: { z: Math.round(dan * 100) / 100, percentile: danPct, label: 'Cognitive Focus' },
      limbic: { z: Math.round(limbic * 100) / 100, percentile: limbicPct, label: 'Emotional Resonance' },
    },
    overall,
    verdict,
    verdict_reason: verdictReason,
    recommendations: generateRecommendations(scores, brief),
  };
}

function generateRecommendations(scores, brief) {
  const recs = [];
  const lower = brief.toLowerCase();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  if (scores.van < 0.3) {
    if (!/[!?]/.test(brief) && wordCount > 10) {
      recs.push('Add a pattern interrupt — start with a question or bold statement to spike VAN.');
    }
    if (SIGNALS.van_positive.keywords.every(k => !lower.includes(k))) {
      recs.push('Use curiosity-gap language: "what if", "the reason", "why your" — these trigger attention networks.');
    }
  }

  if (scores.dmn > 0) {
    if (SIGNALS.dmn_positive.keywords.some(k => lower.includes(k))) {
      recs.push('Remove filler phrases like "as previously mentioned" or "in conclusion" — these trigger boredom networks.');
    }
    if (!/[?!]/.test(brief)) {
      recs.push('Add direct address ("you", "your") and active questions to suppress the DMN boredom response.');
    }
  }

  if (scores.dan < 0.1) {
    recs.push('Strengthen logical structure with "because", "therefore", or numbered points to boost cognitive tracking.');
  }

  if (scores.limbic < 0.1) {
    recs.push('Add emotional stakes — mention transformation, fear of missing out, or human impact to engage limbic system.');
  }

  if (recs.length === 0) {
    recs.push('Your brief scores well across all neural networks. Proceed to generation.');
  }

  return recs;
}

async function callRunPodTRIBE(text) {
  const endpointId = process.env.RUNPOD_TRIBE_ENDPOINT_ID;
  const apiKey = process.env.RUNPOD_API_KEY;

  if (!endpointId || !apiKey) return null;

  try {
    const response = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          text,
          model: 'tribev2',
          return_scores: true,
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.output || !data.output.scores) return null;

    return {
      van: data.output.scores.van,
      dmn: data.output.scores.dmn,
      dan: data.output.scores.dan,
      limbic: data.output.scores.limbic,
    };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { brief } = req.body || {};

  if (!brief || !brief.trim()) {
    return res.status(400).json({ error: 'Missing required field: brief' });
  }

  // Tier 1: Try RunPod TRIBE v2 inference
  let tribleScores = null;
  try {
    tribleScores = await callRunPodTRIBE(brief.trim());
  } catch {
    // Fall through to heuristic
  }

  // Tier 2: Heuristic fallback
  const scores = tribleScores || heuristicScore(brief.trim());
  const report = generateNeuralReport(brief.trim(), scores);

  return res.status(200).json({
    ...report,
    _meta: {
      source: tribleScores ? 'runpod_tribev2' : 'heuristic',
      brief_length: brief.trim().length,
    },
  });
}
