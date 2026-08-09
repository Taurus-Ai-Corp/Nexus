import assert from 'node:assert';
import { describe, it } from 'node:test';
import briefHandler from '../api/omni/brief.js';
import ingestHandler from '../api/omni/ingest.js';

function mockRes() {
  const headers = [];
  let statusCode = null;
  let body = null;
  return {
    setHeader(k, v) { headers.push([k, v]); },
    status(n) { statusCode = n; return this; },
    json(o) { body = o; return this; },
    getStatus() { return statusCode; },
    getBody() { return body; },
    getHeaders() { return headers; },
  };
}

function mockReq(overrides = {}) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {},
    ...overrides,
  };
}

describe('/api/omni/brief', () => {
  it('returns a Flow brief for a pet campaign', async () => {
    const req = mockReq({
      body: {
        campaign: { brief: 'PetPawSphere — UAE-first pet ecosystem with AI breed detection and MOCCAE verified breeders.' },
        client: 'PetPawSphere',
        variants: 2,
      },
    });
    const res = mockRes();
    await briefHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    const body = res.getBody();
    assert.strictEqual(body.status, 'success');
    assert.strictEqual(body.client, 'PetPawSphere');
    assert.strictEqual(body.platform, 'Google Flow');
    assert.ok(body.brief_id, 'expected brief_id');
    assert.ok(Array.isArray(body.scenes), 'expected scenes array');
    assert.ok(body.flow_session_plan, 'expected flow_session_plan');
    assert.ok(Array.isArray(body.custom_tools_to_build), 'expected custom_tools_to_build');
  });

  it('rejects non-POST methods', async () => {
    const req = mockReq({ method: 'GET' });
    const res = mockRes();
    await briefHandler(req, res);
    assert.strictEqual(res.getStatus(), 405);
  });
});

describe('/api/omni/ingest', () => {
  it('ingests an asset by URL', async () => {
    const req = mockReq({
      body: {
        asset_url: 'https://example.com/videos/hero_match_v1.mp4',
        filename: 'hero_match_v1.mp4',
        scene: 'hero_match',
        prompt_hash: 'sha256:abc123',
        metadata: { model: 'veo-3.1', aspect_ratio: '9:16', duration_seconds: 8 },
      },
    });
    const res = mockRes();
    await ingestHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    const body = res.getBody();
    assert.strictEqual(body.status, 'success');
    assert.ok(body.asset.id, 'expected asset id');
    assert.strictEqual(body.asset.scene, 'hero_match');
    assert.ok(Array.isArray(body.next_steps), 'expected next_steps');
  });

  it('rejects ingest when no asset is provided', async () => {
    const req = mockReq({ body: { scene: 'hero_match' } });
    const res = mockRes();
    await ingestHandler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.ok(res.getBody().error.includes('asset_url'), 'expected asset_url error');
  });
});
