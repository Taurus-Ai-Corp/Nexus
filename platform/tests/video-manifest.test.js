import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'assets/video/manifest.json');

// Two files with two schemas were colliding at assets/video/manifest.json.
//
//   this file   {hash, mp4, webm, poster, duration, sizes} — describes the
//               Higgsfield ambient clip. scripts/build-pages.mjs:308 reads
//               .poster and injects the hero preload tag from it.
//   pipeline    {generated_by, pages_file_cap_bytes, renditions[]} — emitted by
//               scripts/transcode-media.sh. No .poster key.
//
// The media-pipeline workflow used to `cp` the pipeline's output over this
// file, which makes vManifest.poster undefined. build-pages then skips the
// preload injection — silently, because the guard is `if (vManifest.poster &&
// ...)` — and the workflow's "Commit renditions" step persists the clobbered
// file to git. Nothing failed. Nothing logged. The workflow now writes
// renditions.json instead; these tests hold that line.

test('video manifest carries the keys build-pages.mjs depends on', () => {
  if (!existsSync(MANIFEST)) return; // absent is a valid state — build-pages guards with existsSync
  const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));

  // .poster specifically: it is the single field build-pages reads, and losing
  // it degrades LCP without breaking anything loudly enough to notice.
  if (!m.poster) {
    throw new Error(
      'assets/video/manifest.json has no "poster" key. build-pages.mjs:308 reads ' +
        'it to inject the hero preload; without it that injection is skipped ' +
        'silently. If this file was overwritten by transcode-media.sh output, ' +
        'the workflow should be writing renditions.json instead.',
    );
  }
  for (const field of ['mp4', 'webm', 'poster']) {
    if (!m[field]) throw new Error(`video manifest missing "${field}"`);
    const onDisk = join(ROOT, m[field].replace(/^\//, ''));
    if (!existsSync(onDisk)) {
      throw new Error(`video manifest "${field}" points at a missing file: ${m[field]}`);
    }
  }
});

test('video manifest has not been clobbered by the renditions pipeline', () => {
  if (!existsSync(MANIFEST)) return;
  const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  // The pipeline's schema is recognisable by these two keys. Their presence here
  // means transcode-media.sh output landed at the wrong path.
  if ('renditions' in m || 'pages_file_cap_bytes' in m) {
    throw new Error(
      'assets/video/manifest.json holds transcode-media.sh output (has ' +
        '"renditions"/"pages_file_cap_bytes"). That belongs in ' +
        'assets/video/renditions.json — see the "Place renditions" step in ' +
        '.github/workflows/media-pipeline.yml.',
    );
  }
});

test('the poster build-pages would inject matches what the pages already carry', () => {
  if (!existsSync(MANIFEST)) return;
  const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  if (!m.poster) return; // covered by the first test

  // index.html is generated with the preload tag from this manifest. If the two
  // drift, pages preload an asset nothing uses — which is exactly the state the
  // site shipped in before the hero was wired: 8 pages fetching a poster at
  // fetchpriority=high and discarding it.
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  if (html.includes('rel="preload"') && html.includes('/assets/video/') && !html.includes(m.poster)) {
    throw new Error(
      `index.html preloads a video poster that is not the manifest's ("${m.poster}"). ` +
        'One of the two is stale; a preloaded asset the page never uses is a wasted ' +
        'LCP-priority fetch.',
    );
  }
});
