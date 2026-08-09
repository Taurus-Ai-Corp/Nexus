import assert from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const platform = join(here, '..');

// The nexus-creative-editorial migration moved these pages under /campaigns/
// but left their links root-relative, so /agency.html, /colab.html,
// /world-cup-2026.html and /thanks.html all 404'd in production.
describe('campaign pages use /campaigns/-prefixed links', () => {
  const MOVED = ['agency', 'colab', 'dogfood', 'thanks', 'world-cup-2026'];
  const dir = join(platform, 'campaigns');
  const pages = readdirSync(dir).filter((f) => f.endsWith('.html'));

  it('has campaign pages to check', () => assert.ok(pages.length > 0));

  for (const page of pages) {
    it(`${page} has no bare root-relative links to moved pages`, () => {
      const html = readFileSync(join(dir, page), 'utf8');
      for (const name of MOVED) {
        assert.ok(
          !html.includes(`href="/${name}.html"`),
          `${page} links to /${name}.html, which 404s — should be /campaigns/${name}.html`
        );
      }
    });
  }
});

describe('Stripe redirect targets resolve to real files', () => {
  // A success_url pointing at a 404 strands the customer after they have paid.
  const src = readFileSync(join(platform, 'api/stripe.js'), 'utf8');
  const urls = [...src.matchAll(/https:\/\/nexus\.taurusai\.io(\/[^'"?#]*)/g)].map((m) => m[1]);

  it('extracts at least one redirect path', () => assert.ok(urls.length > 0));

  for (const path of [...new Set(urls)]) {
    if (path === '/' || path === '') continue;
    it(`${path} exists on disk`, () => {
      assert.ok(
        existsSync(join(platform, path.replace(/^\//, ''))),
        `stripe.js points at ${path}, which has no corresponding file under platform/`
      );
    });
  }
});
