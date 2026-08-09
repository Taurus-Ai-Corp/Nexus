import assert from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, '..', 'vercel.json'), 'utf8'));

describe('vercel.json security headers', () => {
  const REQUIRED = [
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ];
  const globalRule = (config.headers || []).find((r) => r.source === '/(.*)');

  it('has a global headers rule covering all routes', () => {
    assert.ok(globalRule, 'expected a headers rule with source "/(.*)"');
  });

  for (const key of REQUIRED) {
    it(`sets ${key} on all routes`, () => {
      assert.ok(globalRule, 'no global headers rule present');
      const found = globalRule.headers.some(
        (h) => h.key.toLowerCase() === key.toLowerCase() && h.value && h.value.length > 0
      );
      assert.ok(found, `${key} missing from global headers`);
    });
  }
});
