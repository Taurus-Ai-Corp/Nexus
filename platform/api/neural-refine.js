// /api/neural-refine.js — Neural Optimization Loop
// Scores a brief, identifies weak neural networks, and applies
// targeted refinements to improve engagement across all 4 networks.
// Returns original + optimized with before/after comparison.

const SIGNALS = {
  van_positive: {
    keywords: ['surprising', 'unexpected', 'never', 'secret', 'revealed',
      'stop', 'wait', 'breakthrough', 'finally', 'introducing', 'new',
      'exclusive', 'first look', 'sneak peek', 'discover', 'shock',
      'revolutionary', 'game-changer', 'this is not', 'what if',
      'the truth about', 'why your', 'the reason', 'forget everything'],
    weight: 0.08,
  },
  van_negative: {
    keywords: ['welcome to', 'introduction', 'as we know', 'traditional',
      'standard', 'usual', 'conventional', 'typical'],
    weight: -0.06,
  },
  dmn_positive: {
    keywords: ['as previously mentioned', 'in conclusion', 'furthermore',
      'moreover', 'additionally', 'it is important to note',
      'as you can see', 'clearly', 'obviously', 'in other words',
      'to summarize', 'in summary'],
    weight: 0.07,
  },
  dmn_negative: {
    keywords: ['you', 'your', 'imagine', 'picture this', 'what would',
      'how to', 'step by step', 'inside', 'behind the scenes',
      'exclusive access', 'limited', 'only', 'now', 'today',
      'deadline', 'hurry', 'last chance', 'act now'],
    weight: -0.05,
  },
  dan_positive: {
    keywords: ['because', 'therefore', 'which means', 'as a result',
      'this is why', 'the reason', 'here\'s how', 'explain',
      'breakdown', 'analysis', 'compare', 'versus', 'vs',
      'data', 'research', 'study', 'statistics', 'percent',
      'numbers', 'strategy', 'framework', 'system', 'method'],
    weight: 0.06,
  },
  dan_negative: {
    keywords: ['complicated', 'complex', 'difficult', 'confusing',
      'messy', 'chaotic', 'overwhelming', 'too many',
      'jargon', 'technical', 'abstract'],
    weight: -0.04,
  },
  limbic_positive: {
    keywords: ['love', 'hate', 'fear', 'excited', 'terrified',
      'beautiful', 'stunning', 'breathtaking', 'incredible',
      'heart', 'soul', 'passion', 'dream', 'nightmare',
      'family', 'home', 'community', 'together', 'belong',
      'future', 'legacy', 'transform', 'change', 'impact',
      'story', 'journey', 'human', 'real', 'authentic'],
    weight: 0.07,
  },
  limbic_negative: {
    keywords: ['functional', 'utility', 'efficient', 'optimized',
      'solution', 'tool', 'feature', 'specification',
      'enterprise', 'scalable', 'robust', 'seamless'],
    weight: -0.04,
  },
};

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

// === Heuristic scoring (mirrors neural-score.js exactly) ===

function heuristicScore(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount < 3) return null;

  let van = 0, dmn = 0, dan = 0, limbic = 0;

  for (const [signal, config] of Object.entries(SIGNALS)) {
    const matches = config.keywords.filter(k => lower.includes(k)).length;
    const contribution = matches * config.weight;
    if (signal.startsWith('van_')) van += contribution;
    else if (signal.startsWith('dmn_')) dmn += contribution;
    else if (signal.startsWith('dan_')) dan += contribution;
    else if (signal.startsWith('limbic_')) limbic += contribution;
  }

  for (const [, config] of Object.entries(SYNTAX_SIGNALS)) {
    const count = (text.match(config.pattern) || []).length;
    van += count * config.weight;
  }

  const lengthFactor = Math.min(1, 80 / Math.max(wordCount, 20));
  van *= lengthFactor; dmn *= lengthFactor;
  dan *= lengthFactor; limbic *= lengthFactor;

  van = Math.max(-1.5, Math.min(1.5, van));
  dmn = Math.max(-1.5, Math.min(1.5, dmn));
  dan = Math.max(-1.5, Math.min(1.5, dan));
  limbic = Math.max(-1.5, Math.min(1.5, limbic));

  return { van, dmn, dan, limbic };
}

function zToPct(z) {
  return Math.round(Math.min(100, Math.max(0, (z + 1.5) / 3 * 100)));
}

function scoreReport(brief, scores) {
  const { van, dmn, dan, limbic } = scores;
  const vanPct = zToPct(van);
  const dmnPct = zToPct(-dmn);
  const danPct = zToPct(dan);
  const limbicPct = zToPct(limbic);

  return {
    van: { z: Math.round(van * 100) / 100, pct: vanPct },
    dmn: { z: Math.round(dmn * 100) / 100, pct: dmnPct },
    dan: { z: Math.round(dan * 100) / 100, pct: danPct },
    limbic: { z: Math.round(limbic * 100) / 100, pct: limbicPct },
  };
}

// === Refinement strategies ===

function refineForVAN(brief, scores) {
  const lower = brief.toLowerCase();

  if (scores.van >= 0.3) return brief;

  const hasQuestionHook = /^\s*(what|why|how|did|do|are|is|can|will|when|where)/i.test(brief);
  const hasCuriosity = SIGNALS.van_positive.keywords.some(k => lower.includes(k));

  let refined = brief;

  if (!hasQuestionHook && !hasCuriosity) {
    const hooks = [
      'What if everything you knew about this was wrong? ',
      'The one detail nobody talks about: ',
      'This changes everything you thought you knew. ',
      'Here\'s what nobody tells you: ',
      'Forget everything you\'ve heard. Here\'s the truth: ',
    ];
    refined = hooks[scores.van < 0 ? 2 : scores.van < 0.15 ? 1 : 0] + brief;
  }

  if (scores.van < 0.2 && !lower.includes('surprising') && !lower.includes('secret') && !lower.includes('never')) {
    refined = refined + ' This is the surprising detail most people miss.';
  }

  if (!/[!?]$/.test(refined.trim())) {
    refined = refined.replace(/\s*$/, scores.dmn > 0 ? '?' : '!');
  }

  return refined;
}

function refineForDMN(brief, scores) {
  if (scores.dmn <= 0) return brief;

  let refined = brief;
  const lower = brief.toLowerCase();

  // Remove DMN-positive filler phrases
  for (const filler of SIGNALS.dmn_positive.keywords) {
    const re = new RegExp(filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    refined = refined.replace(re, '');
  }

  // Add direct address if missing
  const words = lower.split(/\s+/).filter(Boolean);
  const hasDirectAddress = /\b(your?)\b/i.test(lower);
  if (!hasDirectAddress && words.length > 5) {
    refined = refined.replace(/^/, 'You need to know this. ');
  }

  // Add urgency if weak
  const hasUrgency = /\b(now|today|limited|only|deadline|hurry|last chance|act now)\b/i.test(lower);
  if (!hasUrgency && scores.dmn > 0.3) {
    refined = refined + ' Act now — this won\'t last.';
  }

  return refined;
}

function refineForDAN(brief, scores) {
  if (scores.dan >= 0.1) return brief;

  let refined = brief;
  const lower = brief.toLowerCase();

  const hasConnector = /\b(because|therefore|which means|as a result|this is why|here's how)\b/i.test(lower);
  if (!hasConnector) {
    refined = refined.replace(/([.!?])\s*$/, ' Here\'s why it matters: because the data proves otherwise.');
  }

  const hasNumbers = /\d+/.test(lower);
  if (!hasNumbers) {
    refined = refined + ' Think of it as a 3-step framework that changes everything.';
  }

  return refined;
}

function refineForLimbic(brief, scores) {
  if (scores.limbic >= 0.1) return brief;

  let refined = brief;
  const lower = brief.toLowerCase();

  const hasEmotion = SIGNALS.limbic_positive.keywords.some(k => lower.includes(k));
  if (!hasEmotion) {
    const emotionTags = [
      ' This is the story of a transformation that changes everything.',
      ' The impact on real people? It\'s nothing short of extraordinary.',
      ' Your future self will thank you for discovering this.',
    ];
    refined = refined + emotionTags[Math.floor(Math.random() * emotionTags.length)];
  }

  const hasStakes = /\b(imagine|dream|future|legacy|fear|love|family)\b/i.test(lower);
  if (!hasStakes && scores.limbic < 0) {
    refined = refined + ' Imagine what this means for the people who matter most.';
  }

  return refined;
}

function applyAllRefinements(brief, scores) {
  const improvements = [];

  let r = brief;

  if (scores.van < 0.3) {
    r = refineForVAN(r, scores);
    improvements.push('added pattern interrupt hook');
  }
  if (scores.dmn > 0) {
    r = refineForDMN(r, scores);
    improvements.push('removed filler phrases, added direct address');
  }
  if (scores.dan < 0.1) {
    r = refineForDAN(r, scores);
    improvements.push('strengthened logical structure with connectors');
  }
  if (scores.limbic < 0.1) {
    r = refineForLimbic(r, scores);
    improvements.push('added emotional stakes and human impact');
  }

  return { refined: r, improvements };
}

// === Entry ===

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

  const originalScores = heuristicScore(brief.trim());
  if (!originalScores) {
    return res.status(400).json({ error: 'Brief too short (minimum 3 words).' });
  }

  const originalReport = scoreReport(brief.trim(), originalScores);

  // Apply refinements
  const { refined, improvements } = applyAllRefinements(brief.trim(), originalScores);

  // Score the optimized version
  const optimizedScores = heuristicScore(refined);
  const optimizedReport = scoreReport(refined, optimizedScores);

  // Calculate deltas
  const deltas = {};
  for (const net of ['van', 'dmn', 'dan', 'limbic']) {
    const zDelta = Math.round((optimizedReport[net].z - originalReport[net].z) * 100) / 100;
    const pctDelta = optimizedReport[net].pct - originalReport[net].pct;
    const direction = zDelta > 0 ? 'up' : zDelta < 0 ? 'down' : 'same';
    const improved = // For DMN, lower is better
      (net === 'dmn' && zDelta < 0) ||
      (net !== 'dmn' && zDelta > 0);
    deltas[net] = { z_delta: zDelta, pct_delta: pctDelta, direction, improved };
  }

  return res.status(200).json({
    status: 'success',
    source: 'heuristic',
    original: { brief: brief.trim(), scores: originalReport },
    optimized: { brief: refined, scores: optimizedReport },
    deltas,
    improvements_made: improvements,
    verdict: originalScores.van > 0.5 && originalScores.dmn < 0 ? 'high' :
             originalScores.dmn > 0.5 ? 'low' : 'medium',
  });
}
