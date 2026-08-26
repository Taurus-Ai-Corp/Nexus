import assert from 'node:assert';
import { describe, it } from 'node:test';
import handler from '../api/contact.js';

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
    headers: { referer: 'https://www.neorm-era.com/contact.html' },
    body: {},
    ...overrides,
  };
}

describe('contact handler', () => {
  it('rejects non-POST methods with 405', async () => {
    const req = mockReq({ method: 'GET' });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 405);
    assert.strictEqual(res.getBody().error, 'Method not allowed');
  });

  it('rejects missing name and email with 400', async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.strictEqual(res.getBody().error, 'Name and email are required');
  });

  it('rejects invalid email with 400', async () => {
    const req = mockReq({ body: { name: 'A', email: 'not-an-email' } });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.strictEqual(res.getBody().error, 'Invalid email address');
  });

  it('returns 503 when SMTP is not configured', async () => {
    const env = { ...process.env };
    delete process.env['SMTP_HOST'];
    delete process.env['SMTP_USER'];
    delete process.env['SMTP_PASS'];
    delete process.env['LEAD_RECIPIENT_EMAIL'];
    const req = mockReq({ body: { name: 'Test User', email: 'test@example.com' } });
    const res = mockRes();
    await handler(req, res);
    process.env = env;
    assert.strictEqual(res.getStatus(), 503);
    assert.strictEqual(res.getBody().ok, false);
    assert.ok(Array.isArray(res.getBody().missing));
  });

  it('traps honeypot submissions', async () => {
    const req = mockReq({ body: { name: 'Bot', email: 'bot@example.com', honeypot: 'x' } });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.strictEqual(res.getBody().error, 'Invalid submission');
  });

  it('rejects an over-long name with 400', async () => {
    const req = mockReq({ body: { name: 'a'.repeat(101), email: 'test@example.com' } });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.strictEqual(res.getBody().error, 'Field exceeds maximum length');
    assert.strictEqual(res.getBody().field, 'name');
  });

  it('rejects an over-long message with 400', async () => {
    const req = mockReq({
      body: { name: 'A', email: 'test@example.com', message: 'x'.repeat(5001) },
    });
    const res = mockRes();
    await handler(req, res);
    assert.strictEqual(res.getStatus(), 400);
    assert.strictEqual(res.getBody().error, 'Field exceeds maximum length');
    assert.strictEqual(res.getBody().field, 'message');
  });
});
