// /api/omni/ingest — Google Flow / Gemini Omni asset ingestion
// POST { asset_url|asset_base64, filename?, scene?, prompt_hash?, metadata? }
// Stores the asset record and returns a tag + next-step checklist.
// Delegates to the shared pipeline handler but exposes a clean /api/omni/* path.

import handler from '../campaign-pipeline.js';

export default async function ingestHandler(req, res) {
  if (!req.body) req.body = {};
  req.body = { ...req.body, action: 'omni_ingest' };
  return handler(req, res);
}
