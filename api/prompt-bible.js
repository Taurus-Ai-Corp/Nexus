// /api/prompt-bible.js — Standalone Ad Campaign Prompt Bible endpoint
// POST { brief, archetype?, product? } → full 9-block Bible prompt
// POST { action: "categories" } → list all supported categories
// POST { action: "archetypes" } → list all supported archetypes
//
// This endpoint generates structured ad campaign prompts using the
// 9-block universal skeleton from the Ad Campaign Prompt Bible skill.
// Works WITHOUT any external API keys — pure prompt engineering.

import {
  build9BlockPrompt,
  buildProductLock,
  detectCategory,
  CATEGORY_ELEMENTS,
  ARCHETYPES,
  SAFETY_SUFFIXES,
  withSafetySuffixes,
} from '../lib/prompt-bible.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const body = req.body || {};
  const action = body.action;

  // Action: list categories
  if (action === 'categories') {
    return res.status(200).json({
      categories: Object.entries(CATEGORY_ELEMENTS).map(([key, val]) => ({
        key,
        label: val.label,
        best_archetype: val.bestArchetype,
        backgrounds: val.backgrounds,
        lighting: val.lighting,
      })),
    });
  }

  // Action: list archetypes
  if (action === 'archetypes') {
    return res.status(200).json({
      archetypes: Object.entries(ARCHETYPES).map(([key, label]) => ({
        key,
        label,
      })),
    });
  }

  // Default: generate prompt
  const { brief, archetype, product, setting, beats, camera, lighting, audio, staticLock, vibe, aspectRatio, includeSafetySuffixes } = body;

  if (!brief || !brief.trim()) {
    return res.status(400).json({ error: 'Missing required field: brief' });
  }

  // Detect category from brief
  const { category, confidence } = detectCategory(brief);
  const cat = CATEGORY_ELEMENTS[category] || CATEGORY_ELEMENTS.saas;

  // Determine archetype
  const chosenArchetype = archetype || cat.bestArchetype;

  // Build product object
  const productObj = product || {};
  if (!productObj.name) productObj.name = brief.split(' ').slice(0, 5).join(' ');
  if (!productObj.lockLine) productObj.lockLine = buildProductLock(productObj);

  // Build the 9-block prompt
  const prompt = build9BlockPrompt({
    product: productObj,
    category,
    archetype: chosenArchetype,
    setting,
    beats,
    camera,
    lighting,
    audio,
    staticLock,
    vibe,
    aspectRatio: aspectRatio || '3:4',
  });

  // Optionally add safety suffixes (for image ads)
  const finalPrompt = includeSafetySuffixes ? withSafetySuffixes(prompt) : prompt;

  // Also build a multi-variant set if requested
  let variants = null;
  if (body.variants) {
    variants = {};
    // Background variants
    for (const [bgType, bgVal] of Object.entries(cat.backgrounds)) {
      if (bgVal === 'n/a') continue;
      variants[`background_${bgType}`] = build9BlockPrompt({
        product: productObj,
        category,
        archetype: chosenArchetype,
        setting: `Set against a ${bgVal} backdrop.`,
        aspectRatio: aspectRatio || '3:4',
        vibe: vibe || `editorial, premium, ${cat.label.toLowerCase()} campaign`,
      });
    }
    // Archetype variants (studio + the detected best)
    for (const archKey of Object.keys(ARCHETYPES)) {
      if (archKey === 'meta' || archKey === 'pixar' || archKey === 'claymation') continue;
      if (archKey === chosenArchetype) continue;
      variants[`archetype_${archKey}`] = build9BlockPrompt({
        product: { ...productObj, duration: '12s', contentType: 'review' },
        category,
        archetype: archKey,
        aspectRatio: aspectRatio || '3:4',
      });
    }
  }

  return res.status(200).json({
    status: 'success',
    prompt: finalPrompt,
    variants,
    metadata: {
      category,
      category_label: cat.label,
      category_confidence: confidence,
      archetype: chosenArchetype,
      archetype_label: ARCHETYPES[chosenArchetype] || chosenArchetype,
      aspect_ratio: aspectRatio || '3:4',
      bible_version: '1.0.0',
      blocks_used: ['preamble', 'product_lock', 'subject', 'setting', 'beats', 'camera', 'lighting', 'audio_or_quality', 'static_lock'],
    },
    product_lock: productObj.lockLine,
    category_elements: {
      backgrounds: cat.backgrounds,
      lighting: cat.lighting,
      intro_style: cat.introStyle,
    },
  });
}