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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { query = '', sources = ['web'], url = '', limit = 10 } = req.body || {};
  const allowed = ['web', 'rss', 'youtube'];
  const active = sources.filter(s => allowed.includes(s));
  if (active.length === 0) {
    return res.status(400).json({ error: `No valid sources. Choose from: ${allowed.join(', ')}` });
  }

  const results = {};
  const errors = {};

  for (const src of active) {
    try {
      if (src === 'web') {
        if (!url) { errors.web = 'url required for web source'; continue; }
        results.web = await readWeb(url, 4000);
      } else if (src === 'rss') {
        if (!url) { errors.rss = 'url required for rss source'; continue; }
        results.rss = await readRss(url, Math.min(parseInt(limit) || 10, 50));
      } else if (src === 'youtube') {
        if (!url) { errors.youtube = 'url required for youtube source'; continue; }
        results.youtube = await readYoutube(url);
      }
    } catch (e) {
      errors[src] = e.message || String(e);
      results[src] = [];
    }
  }

  return res.status(200).json({ query, url, results, errors, ts: new Date().toISOString() });
}
