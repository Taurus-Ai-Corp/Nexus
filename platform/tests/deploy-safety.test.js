import assert from 'node:assert';
import { describe, it } from 'node:test';
// No writeFileSync: this suite is read-only by design now. The idempotency test
// used to write and restore platform/*.html, which raced other test files.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const platform = join(here, '..');

// These guards exist because production drifted ahead of the repo: every
// nexus-platform deploy is a CLI deploy from a working tree, so `git log` is
// not a record of what is live. Both regressions below were real.

describe('design-system.css completeness', () => {
  // The stylesheet was once "restored" from an older snapshot in
  // core/design-system/tokens/, silently dropping the nav dropdown rules that
  // flow/index.html depends on. Status codes do not catch this — every page
  // still returns 200, just unstyled.
  const css = readFileSync(join(platform, 'assets/css/design-system.css'), 'utf8');

  for (const cls of ['nav-dropdown', 'nav-dropdown-panel', 'nav-caret', 'meet-grid']) {
    it(`defines .${cls}`, () => {
      assert.ok(css.includes(`.${cls}`), `.${cls} missing from design-system.css`);
    });
  }

  it('stays in sync with core/design-system/tokens copy', () => {
    const core = readFileSync(
      join(platform, '..', 'core/design-system/tokens/design-system.css'),
      'utf8'
    );
    assert.strictEqual(css, core, 'platform and core copies of design-system.css have diverged');
  });
});

describe('campaign pages present', () => {
  // These six were deleted locally while still serving 200 in production.
  const pages = [
    'agency.html',
    'case-studies.html',
    'colab.html',
    'dogfood.html',
    'thanks.html',
    'world-cup-2026.html',
  ];

  for (const page of pages) {
    it(`ships campaigns/${page}`, () => {
      const size = statSync(join(platform, 'campaigns', page)).size;
      assert.ok(size > 1000, `campaigns/${page} is missing or suspiciously small (${size}b)`);
    });
  }
});

describe('Vercel Hobby function budget', () => {
  // Hard cap is 12 serverless functions. api/ is at exactly 12 — zero headroom.
  const MAX = 12;

  const countFunctions = (dir) =>
    readdirSync(dir, { withFileTypes: true }).reduce((n, e) => {
      if (e.isDirectory()) return n + countFunctions(join(dir, e.name));
      return n + (e.name.endsWith('.js') ? 1 : 0);
    }, 0);

  it(`stays at or under ${MAX} functions`, () => {
    const count = countFunctions(join(platform, 'api'));
    assert.ok(count <= MAX, `platform/api has ${count} functions, exceeding the Hobby cap of ${MAX}`);
  });
});

describe('no redirect black-holes the host that actually serves the site', () => {
  // f2b8834 added a catch-all redirect sending every request on
  // nexus.taurusai.io — the ONLY host attached to this project — to
  // https://www.neorm-era.com, which has no DNS record. Deploying it would
  // have taken the entire site down on the first request, before any page,
  // any API call or any checkout was reached. It was invisible to every other
  // test here because those read files; this one reads the deploy contract.
  //
  // LIVE_HOSTS is the set of hosts that resolve and serve this project. Adding
  // neorm-era.com here is part of the DNS cutover, not a way to silence a
  // failure: verify with `dig +short www.neorm-era.com` first.
  const LIVE_HOSTS = new Set(['nexus.taurusai.io', 'neorm-era.com', 'www.neorm-era.com']);

  // Deliberate cutover redirects. A live host may be a redirect SOURCE only
  // when its destination is itself live — that is the difference between a
  // cutover and the f2b8834 outage, where the destination had no DNS record.
  //
  // Verified 2026-08-30 before this entry was added:
  //   dig +short www.neorm-era.com          -> 172.64.80.1  (Cloudflare)
  //   curl -sI  https://www.neorm-era.com/  -> 200, server: cloudflare
  //   curl -s   .../api/leads               -> 200 application/json, not an
  //                                            HTML catch-all — Pages Functions
  //                                            give full API parity with api/
  // Re-run all three before adding an entry. A destination that only returns
  // 200 on the homepage is not enough; the API must answer too, or checkout
  // and the Stripe webhook break silently after the redirect lands.
  const CUTOVER = new Map([
    ['nexus.taurusai.io', 'www.neorm-era.com'], // brand cutover: retire the old host
    ['neorm-era.com', 'www.neorm-era.com'], // apex -> www canonicalisation
  ]);

  const destHost = (d) => {
    try {
      return new URL(d).host;
    } catch {
      return null;
    }
  };

  const cfg = JSON.parse(readFileSync(join(platform, 'vercel.json'), 'utf8'));
  const redirects = cfg.redirects ?? [];

  it('has redirects to check', () => assert.ok(redirects.length > 0, 'no redirects parsed'));

  for (const [i, r] of redirects.entries()) {
    const sources = (r.has ?? []).filter((h) => h.type === 'host').map((h) => h.value);
    it(`redirect ${i} (${sources.join(',') || 'any host'}) does not strand live traffic`, () => {
      const dest = destHost(r.destination);
      const stranded = sources.filter((h) => {
        if (!LIVE_HOSTS.has(h)) return false; // not live: nothing to strand
        // Live source is allowed only as a declared cutover whose destination
        // is this redirect's actual destination AND is itself live.
        return !(CUTOVER.get(h) === dest && LIVE_HOSTS.has(dest));
      });
      assert.deepEqual(
        stranded,
        [],
        `redirect ${i} sends ${stranded.join(', ')} — which is live — to ${r.destination}. `
          + 'Allowed only as a CUTOVER entry whose destination is a verified-live host. '
          + 'Re-add this only after the destination host resolves and serves /api/.',
      );
    });
  }

  it('a catch-all with no host condition never leaves the site', () => {
    // A source of "/(.*)" with no `has` applies to every host including the
    // live one, so it is the same outage with no host filter to notice.
    const unconditional = redirects.filter(
      (r) => r.source === '/(.*)' && !(r.has ?? []).some((h) => h.type === 'host'),
    );
    assert.deepEqual(unconditional, [], 'unconditional catch-all redirect would strand every host');
  });
});

describe('_headers and vercel.json agree', () => {
  // The site deploys to Cloudflare Pages (neorm-era.pages.dev) and Vercel
  // (nexus.taurusai.io). Pages ignores vercel.json entirely, so the first
  // Cloudflare deploy silently served the site with NO HSTS, no
  // X-Frame-Options and no Permissions-Policy, and with assets at
  // max-age=0 instead of immutable — confirmed by curling both hosts.
  // Nothing detects that drift except comparing the two files.
  const cfg = JSON.parse(readFileSync(join(platform, 'vercel.json'), 'utf8'));
  const headersFile = readFileSync(join(platform, '_headers'), 'utf8');

  const vercelGlobal = (cfg.headers ?? []).find((h) => h.source === '/(.*)');

  it('vercel.json still declares global headers', () => {
    assert.ok(vercelGlobal, 'no /(.*) headers block in vercel.json');
  });

  for (const { key, value } of vercelGlobal?.headers ?? []) {
    it(`_headers carries ${key}`, () => {
      // Cloudflare sets its own x-content-type-options and referrer-policy,
      // but declaring them keeps the two files a like-for-like comparison.
      const line = headersFile.split('\n').find((l) => l.trim().toLowerCase().startsWith(`${key.toLowerCase()}:`));
      assert.ok(line, `_headers is missing ${key}, which vercel.json sets`);
      assert.equal(line.split(':').slice(1).join(':').trim(), value,
        `_headers and vercel.json disagree on ${key}`);
    });
  }

  it('asset cache policy matches', () => {
    const vercelAssets = (cfg.headers ?? []).find((h) => h.source === '/assets/(.*)');
    assert.ok(vercelAssets, 'vercel.json has no /assets/(.*) block');
    const expected = vercelAssets.headers.find((h) => h.key === 'Cache-Control').value;
    assert.ok(headersFile.includes(expected), `_headers does not set assets to "${expected}"`);
  });
});

describe('build-pages is idempotent', () => {
  it('consecutive builds produce byte-for-byte identical output', async () => {
    const { buildPage, PAGES_CONFIG } = await import('../scripts/build-pages.mjs');
    // Pure: each page is read once, then transformed in memory. This used to
    // build against the live platform/*.html and restore in a finally — but
    // `npm test` runs test files CONCURRENTLY, and site-integrity, brand,
    // links, design-tokens, video-hero and seo-schema all read those same
    // pages. A reader landing inside the write-then-restore window saw a
    // half-built page and failed for no reason: roughly 1 run in 13, and
    // worsening as more page-reading tests were added. Last seen 2026-09-11 as
    // "privacy.html missing Canadian CBCA legal footer" from seo-schema, which
    // passes 28/28 when run alone. Nothing is written now, so the window is
    // gone — and a Ctrl-C mid-test can no longer leave the tree modified.
    for (const relPath of Object.keys(PAGES_CONFIG)) {
      const original = readFileSync(join(platform, relPath), 'utf8');
      const pass1 = buildPage(relPath, { html: original, write: false });
      const pass2 = buildPage(relPath, { html: pass1, write: false });
      assert.strictEqual(
        pass2,
        pass1,
        `buildPage("${relPath}") is not idempotent: second build drifted from first`,
      );
    }
  });
});

