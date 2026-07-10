// /api/extras.js — Consolidated utility endpoints
// POST /api/extras?action=research { query, sources }
// GET  /api/extras?action=tribe
// POST /api/extras?action=tribe { scores, content }
// POST /api/extras?action=veo { prompt, aspect_ratio, duration, resolution, image_url }
// GET  /api/extras?action=veo&operation=...
// POST /api/extras?action=prompt-bible { brief, archetype?, product? }
// POST /api/extras?action=categories
// POST /api/extras?action=archetypes

// /api/research.js — pure-Node (serverless-safe) research endpoint
// No local Python venv dependency — works on Vercel out of the box.
// POST { query, sources: ['web','rss','youtube'], url, limit }
//
// Sources:
//   web      → Jina Reader API (r.jina.ai)  — free, no key
//   rss      → built-in DOMParser (Node 18+) — no dep
//   youtube  → yt-dlp via @distube/yt-dlp wasm-free static metadata
//              fallback: noembed.com oEmbed (free, public)
//
// Returns { query, results: { source: [items] } }

const JINA = 'https://r.jina.ai';

async function readWeb(url, limit = 4000) {
  const r = await fetch(`${JINA}/${url}`, {
    headers: { 'Accept': 'text/plain', 'X-Return-Format': 'text' },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Jina ${r.status}: ${await r.text()}`);
  const text = await r.text();
  return [{ source: url, text: text.slice(0, limit), length: text.length }];
}

async function readRss(url, limit = 10) {
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`RSS fetch ${r.status}`);
  const xml = await r.text();
  // Lightweight XML → items without a parser dep
  const items = [];
  const itemRe = /<item[\s\S]*?<\/item>/gi;
  const titleRe = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
  const linkRe = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i;
  const pubDateRe = /<pubDate>([\s\S]*?)<\/pubDate>/i;
  const descRe = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i;
  let m;
  while ((m = itemRe.exec(xml)) && items.length < limit) {
    const block = m[0];
    const title = (titleRe.exec(block)?.[1] || '').trim();
    const link = (linkRe.exec(block)?.[1] || '').trim();
    const published = (pubDateRe.exec(block)?.[1] || '').trim();
    const summary = (descRe.exec(block)?.[1] || '').replace(/<[^>]+>/g, '').slice(0, 500).trim();
    if (title || link) items.push({ title, link, published, summary });
  }
  return items;
}

async function readYoutube(url) {
  // Public oEmbed — no key, no rate-limit hell
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const r = await fetch(oembed, { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`oEmbed ${r.status}`);
  const meta = await r.json();
  return [{
    title: meta.title,
    channel: meta.author_name,
    thumbnail: meta.thumbnail_url,
    embed_url: meta.embed_url,
    provider: meta.provider_name,
  }];
}



// /api/tribe-colab.js — TRIBE v2 Colab GPU Bridge
// Provides Colab notebook access + upload endpoint for free GPU inference results

const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/github/taurus-ai/nexus-creative/blob/main/tribev2_inference.ipynb';

let uploadedResults = [];



// /api/veo.js — Gemini API Veo video generation + polling (Vercel-safe, cloud-only)
// POST /api/veo → start video generation
// GET /api/veo?operation=... → poll long-running operation

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const VEO_MODEL = 'veo-3.1-generate-preview';

function getApiKey() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key || key === '***') return null;
  return key;
}

function getOperationParam(req) {
  if (req.query && req.query.operation) return req.query.operation;
  const match = (req.url || '').split('?')[1] && (req.url || '').split('?')[1].match(/operation=([^\u0026]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function handleGenerate(req, res) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured on server.', fix: 'Add a real GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY to Vercel environment variables.', docs: 'https://aistudio.google.com/app/apikey' });
  }

  const body = req.body || {};
  const prompt = body.prompt;
  const aspect_ratio = body.aspect_ratio || '16:9';
  const duration = body.duration || 8;
  const resolution = body.resolution || '720p';
  const image_url = body.image_url;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing required field: prompt' });
  }

  const validAspects = ['16:9', '9:16', '1:1', '4:3', '3:4'];
  if (!validAspects.includes(aspect_ratio)) {
    return res.status(400).json({ error: 'Invalid aspect_ratio. Use one of: ' + validAspects.join(', ') });
  }

  const validDurations = [5, 6, 7, 8, 9, 10];
  const durationNum = Number(duration);
  if (!validDurations.includes(durationNum)) {
    return res.status(400).json({ error: 'Invalid duration. Use one of: ' + validDurations.join(', ') });
  }

  try {
    const instance = { prompt: prompt.trim() };

    if (image_url) {
      const controller = new AbortController();
      const timeout = setTimeout(function() { controller.abort(); }, 30000);
      const imageRes = await fetch(image_url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!imageRes.ok) {
        return res.status(400).json({ error: 'Could not fetch image_url: ' + imageRes.status + ' ' + imageRes.statusText });
      }
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const contentType = imageRes.headers.get('content-type') || 'image/png';
      instance.image = { bytesBase64Encoded: imageBuffer.toString('base64'), mimeType: contentType };
    }

    const predictRes = await fetch(GEMINI_BASE + '/models/' + VEO_MODEL + ':predictLongRunning?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [instance],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspect_ratio,
          durationSeconds: durationNum,
          resolution,
        },
      }),
    });

    if (!predictRes.ok) {
      const errText = await predictRes.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error.message || errText; } catch (e) { errMsg = errText; }
      return res.status(predictRes.status).json({ error: 'Gemini Veo error: ' + errMsg, model: VEO_MODEL });
    }

    const predictData = await predictRes.json();

    if (predictData.error) {
      return res.status(400).json({ error: 'Gemini Veo error: ' + predictData.error.message, model: VEO_MODEL });
    }

    const operationName = predictData.name;
    if (!operationName) {
      const video = extractVideo(predictData);
      return res.status(200).json({
        status: 'done',
        video_url: video.url,
        video_base64: video.base64,
        mime_type: video.mimeType,
        model: VEO_MODEL,
        aspect_ratio,
        duration: durationNum,
        prompt: prompt.trim(),
        image_url: image_url || null,
        operation_name: null,
      });
    }

    return res.status(202).json({
      status: 'pending',
      operation_name: operationName,
      model: VEO_MODEL,
      aspect_ratio,
      duration: durationNum,
      prompt: prompt.trim(),
      image_url: image_url || null,
      poll_url: '/api/veo?operation=' + encodeURIComponent(operationName),
      message: 'Video generation started. Poll poll_url until status becomes "done".',
    });

  } catch (err) {
    console.error('[/api/veo] generate error:', err);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
}

async function handlePoll(req, res) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured.' });
  }

  const operation = getOperationParam(req);
  if (!operation) {
    return res.status(400).json({ error: 'Missing operation query param.' });
  }

  try {
    const pollRes = await fetch(GEMINI_BASE + '/' + operation + '?key=' + apiKey);
    if (!pollRes.ok) {
      const errText = await pollRes.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error.message || errText; } catch (e) { errMsg = errText; }
      return res.status(pollRes.status).json({ status: 'error', error: errMsg, operation });
    }

    const data = await pollRes.json();

    if (data.error) {
      return res.status(400).json({ status: 'error', error: data.error.message, operation });
    }

    if (!data.done) {
      return res.status(202).json({ status: 'pending', operation, metadata: data.metadata || null });
    }

    const response = data.response || data;
    const predictions = response.predictions || [];
    if (predictions.length === 0) {
      return res.status(502).json({ status: 'done', error: 'No predictions in completed operation.', operation });
    }

    const video = extractVideoFromPrediction(predictions[0]);

    return res.status(200).json({
      status: 'done',
      operation,
      video_url: video.url,
      video_base64: video.base64,
      mime_type: video.mimeType,
      model: VEO_MODEL,
    });

  } catch (err) {
    console.error('[/api/veo] poll error:', err);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
}

function extractVideo(data) {
  const response = data.response || data;
  const predictions = response.predictions || [];
  if (predictions.length === 0) {
    return { url: null, base64: null, mimeType: 'video/mp4' };
  }
  return extractVideoFromPrediction(predictions[0]);
}

function extractVideoFromPrediction(pred) {
  if (pred.bytesBase64Encoded) {
    const mimeType = pred.mimeType || 'video/mp4';
    return { url: 'data:' + mimeType + ';base64,' + pred.bytesBase64Encoded, base64: pred.bytesBase64Encoded, mimeType };
  }
  if (pred.video && pred.video.uri) {
    return { url: pred.video.uri, base64: null, mimeType: pred.video.mimeType || 'video/mp4' };
  }
  return { url: null, base64: null, mimeType: 'video/mp4' };
}



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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const action = req.query?.action || req.body?.action;

  if (action === 'research') {
    const { query = '', sources = ['web'], url = '', limit = 10 } = req.body || {};
    const allowed = ['web', 'rss', 'youtube'];
    const active = sources.filter(s => allowed.includes(s));
    if (active.length === 0) {
      return res.status(400).json({ error: `No valid sources. Choose from: ${allowed.join(', ')}` });
    }
    const results = {};
    const errors = {};
    await Promise.all(active.map(async src => {
      try {
        if (src === 'web') results.web = url ? await readWeb(url, limit) : [];
        if (src === 'rss') results.rss = await readRss(url || 'https://news.ycombinator.com/rss', limit);
        if (src === 'youtube') results.youtube = await readYoutube(url || query);
      } catch (e) {
        errors[src] = e.message;
      }
    }));
    return res.status(200).json({ query, url, sources: active, results, errors });
  }

  if (action === 'tribe') {
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'available',
        notebookUrl: 'https://colab.research.google.com/github/taurus-ai/nexus-creative/blob/main/tribev2_inference.ipynb',
        requiresHFToken: true,
        hfTokenHint: 'Get your token at https://huggingface.co/settings/tokens',
        estimatedRuntime: '3-5 minutes (download) + 30s per text analysis',
      });
    }
    const { scores, content, segments, source } = req.body || {};
    if (!scores || !content) return res.status(400).json({ error: 'Missing required fields: scores, content' });
    return res.status(200).json({ status: 'accepted', source: source || 'colab_tribev2' });
  }

  if (action === 'veo') {
    if (req.method === 'GET') return handlePoll(req, res);
    return handleGenerate(req, res);
  }

  if (action === 'prompt-bible' || action === 'categories' || action === 'archetypes') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
    const body = req.body || {};
    if (action === 'categories') {
      return res.status(200).json({
        categories: Object.entries(CATEGORY_ELEMENTS).map(([key, val]) => ({
          key, label: val.label, best_archetype: val.bestArchetype, backgrounds: val.backgrounds, lighting: val.lighting,
        })),
      });
    }
    if (action === 'archetypes') {
      return res.status(200).json({
        archetypes: Object.entries(ARCHETYPES).map(([key, label]) => ({ key, label })),
      });
    }
    const { brief, archetype, product, setting, beats, camera, lighting, audio, staticLock, vibe, aspectRatio, includeSafetySuffixes } = body;
    if (!brief || !brief.trim()) return res.status(400).json({ error: 'Missing required field: brief' });
    const { category, confidence } = detectCategory(brief);
    const cat = CATEGORY_ELEMENTS[category] || CATEGORY_ELEMENTS.saas;
    const chosenArchetype = archetype || cat.bestArchetype;
    const productObj = product || {};
    if (!productObj.name) productObj.name = brief.split(' ').slice(0, 5).join(' ');
    if (!productObj.lockLine) productObj.lockLine = buildProductLock(productObj);
    const prompt = build9BlockPrompt({ product: productObj, category, archetype: chosenArchetype, setting, beats, camera, lighting, audio, staticLock, vibe, aspectRatio: aspectRatio || '3:4' });
    const finalPrompt = includeSafetySuffixes ? withSafetySuffixes(prompt) : prompt;
    return res.status(200).json({
      status: 'success', prompt: finalPrompt, metadata: {
        category, category_label: cat.label, category_confidence: confidence, archetype: chosenArchetype,
        archetype_label: ARCHETYPES[chosenArchetype] || chosenArchetype, aspect_ratio: aspectRatio || '3:4', bible_version: '1.0.0',
      }
    });
  }

  return res.status(400).json({ error: 'Invalid action.' });
}
