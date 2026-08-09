// /api/omni/brief — Google Flow / Gemini Omni brief generator
// POST { campaign, client?, variants? } → structured Flow brief + session plan
// Delegates to the campaign-pipeline Flow logic but exposes a clean /api/omni/* path.

import handler from '../campaign-pipeline.js';

export default async function briefHandler(req, res) {
  // Force action for the shared pipeline handler
  if (!req.body) req.body = {};
  req.body = { ...req.body, action: 'omni_brief' };
  return handler(req, res);
}
