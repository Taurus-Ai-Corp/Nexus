import assert from 'node:assert';
import { describe, it } from 'node:test';
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
  const LIVE_HOSTS = new Set(['nexus.taurusai.io']);

  const cfg = JSON.parse(readFileSync(join(platform, 'vercel.json'), 'utf8'));
  const redirects = cfg.redirects ?? [];

  it('has redirects to check', () => assert.ok(redirects.length > 0, 'no redirects parsed'));

  for (const [i, r] of redirects.entries()) {
    const sources = (r.has ?? []).filter((h) => h.type === 'host').map((h) => h.value);
    it(`redirect ${i} (${sources.join(',') || 'any host'}) does not strand live traffic`, () => {
      const stranded = sources.filter((h) => LIVE_HOSTS.has(h));
      assert.deepEqual(
        stranded,
        [],
        `redirect ${i} sends ${stranded.join(', ')} — which is live — to ${r.destination}. `
          + 'Re-add this only after the destination host resolves.',
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
