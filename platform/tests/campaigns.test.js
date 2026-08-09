import assert from 'node:assert';
import { describe, it } from 'node:test';
import handler from '../api/campaigns/index.js';

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
    method: 'GET',
    headers: { 'content-type': 'application/json' },
    body: {},
    ...overrides,
  };
}

describe('/api/campaigns', () => {
  it('lists campaigns from public/campaigns', async () => {
    const req = mockReq();
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    const body = res.getBody();
    assert.strictEqual(body.status, 'success');
    assert.ok(body.count >= 2, 'expected at least 2 campaigns');
    assert.ok(Array.isArray(body.campaigns), 'expected campaigns array');
    const ids = body.campaigns.map(c => c.campaignId);
    assert.ok(ids.includes('petpawsphere-2026-06-17'), 'expected PetPawSphere campaign');
    assert.ok(ids.includes('real-estate-2026-06'), 'expected real estate campaign');
  });

  it('rejects non-GET methods', async () => {
    const req = mockReq({ method: 'POST' });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 405);
  });
});
