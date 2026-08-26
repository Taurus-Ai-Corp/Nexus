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
  // The host is no longer a literal -- it is derived per request by
  // lib/site-origin.mjs, because the hardcoded one had no DNS record. So the
  // paths are now the tail of a concatenation rather than the tail of a URL.
  // If these regexes stop matching, the per-path assertions below vanish and the
  // suite still looks green -- which is why `extracts at least one redirect path`
  // exists, and it is what caught this change.
  const PATH_SOURCES = [
    /\borigin\s*\+\s*'(\/[^'?#]*)/g,            // origin + '/campaigns/thanks.html?...'
    /\$\{siteOrigin\(req\)\}(\/[^`'"?#\s]*)/g,  // `${siteOrigin(req)}/#pricing`
  ];
  const urls = PATH_SOURCES.flatMap((re) => [...src.matchAll(re)].map((m) => m[1]));

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
