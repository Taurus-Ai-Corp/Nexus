// /api/campaigns/index.js — Campaign metadata catalog
// GET /api/campaigns → list all public/campaigns metadata.json files
// GET /api/campaigns/:id → read specific campaign metadata
// Vercel-safe: reads from the filesystem at request time.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const CAMPAIGNS_DIR = join(process.cwd(), 'public', 'campaigns');

async function listCampaigns() {
  const entries = await readdir(CAMPAIGNS_DIR, { withFileTypes: true });
  const campaigns = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const raw = await readFile(join(CAMPAIGNS_DIR, entry.name, 'metadata.json'), 'utf8');
      campaigns.push(JSON.parse(raw));
    } catch {
      // Skip directories without a readable metadata.json — campaign asset
      // folders live alongside catalogued ones and are not an error.
    }
  }
  return campaigns.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });

  try {
    const campaigns = await listCampaigns();
    return res.status(200).json({ status: 'success', count: campaigns.length, campaigns });
  } catch (err) {
    console.error('[/api/campaigns] error:', err);
    return res.status(500).json({ error: 'Could not load campaigns.' });
  }
}
