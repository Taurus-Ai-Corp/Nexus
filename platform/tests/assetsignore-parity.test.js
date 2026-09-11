import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Two lists describe "what does not ship", and they are read by different
// things:
//
//   .assetsignore                  wrangler reads this. It is what ACTUALLY
//                                  ships.
//   scripts/check-pages-limits.mjs its SKIP set decides what gets size-checked
//                                  before the deploy.
//
// When they disagree, the gap is invisible in both directions and only one
// direction is dangerous: a directory the gate SKIPS but .assetsignore does NOT
// exclude gets uploaded to production with no 25 MiB check and no file-count
// contribution. That is what happened with "scripts" — platform/scripts/tmp/
// holds ~4.5 MB of video intermediates, including the ungraded master, and all
// of it was headed for https://neorm-era.com/scripts/tmp/.
//
// wrangler excludes .git unconditionally, so it is allowed to appear in SKIP
// without appearing in .assetsignore. Nothing else is.
const WRANGLER_IMPLICIT = new Set(['.git']);

function assetsignoreEntries() {
  const p = join(ROOT, '.assetsignore');
  if (!existsSync(p)) throw new Error('platform/.assetsignore is missing');
  return new Set(
    readFileSync(p, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#')),
  );
}

function gateSkipSet() {
  const src = readFileSync(join(ROOT, 'scripts/check-pages-limits.mjs'), 'utf8');
  const m = src.match(/const SKIP = new Set\(\[([\s\S]*?)\]\)/);
  if (!m) throw new Error('could not find the SKIP set in check-pages-limits.mjs');
  return new Set(m[1].match(/"[^"]+"|'[^']+'/g).map((s) => s.slice(1, -1)));
}

test('every directory the limits gate skips is actually excluded from the deploy', () => {
  const ignored = assetsignoreEntries();
  const skipped = gateSkipSet();
  const shipsUnchecked = [...skipped].filter(
    (d) => !ignored.has(d) && !WRANGLER_IMPLICIT.has(d),
  );
  if (shipsUnchecked.length) {
    throw new Error(
      `check-pages-limits.mjs skips ${shipsUnchecked.map((d) => `"${d}"`).join(', ')} ` +
        'but .assetsignore does not exclude them — so they ship to production ' +
        'without any size or file-count check. Add them to platform/.assetsignore, ' +
        'or stop skipping them in the gate.',
    );
  }
});

test('the limits gate does not waste effort on directories that never ship', () => {
  const ignored = assetsignoreEntries();
  const skipped = gateSkipSet();
  // Harmless in production terms, but a >25 MiB file under an excluded
  // directory (platform/prototype/ is 13 MB of scratch) would fail the gate and
  // block a deploy over something that was never going to be uploaded.
  const checkedButNeverShips = [...ignored].filter((d) => !skipped.has(d));
  if (checkedButNeverShips.length) {
    throw new Error(
      `.assetsignore excludes ${checkedButNeverShips.map((d) => `"${d}"`).join(', ')} ` +
        'from the deploy, but check-pages-limits.mjs still walks them — a large ' +
        'file there would block a deploy it cannot affect. Add them to SKIP.',
    );
  }
});

test('scripts/tmp intermediates are not deploy-visible', () => {
  // Specific regression pin: process-ambient-video.mjs writes its scratch to
  // platform/scripts/tmp/ (and creates that directory on import, as a side
  // effect). The directory may or may not exist locally; what must hold is that
  // "scripts" is excluded from the upload.
  const ignored = assetsignoreEntries();
  if (!ignored.has('scripts')) {
    throw new Error(
      '.assetsignore must exclude "scripts": process-ambient-video.mjs leaves ' +
        'raw.mp4 and other intermediates in platform/scripts/tmp/, which would ' +
        'otherwise be published under https://<site>/scripts/tmp/.',
    );
  }
});
