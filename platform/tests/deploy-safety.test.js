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
