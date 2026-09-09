import { test } from 'node:test';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('video assets referenced by ENGINE_VIDEOS exist on disk', () => {
  const src = readFileSync(join(ROOT, 'assets/js/video-hero.js'), 'utf8');
  const mapSrc = src.match(/const ENGINE_VIDEOS = \{[\s\S]*?\};/)[0];
  const ENGINE_VIDEOS = new Function(`${mapSrc}; return ENGINE_VIDEOS;`)();
  for (const [key, entry] of Object.entries(ENGINE_VIDEOS)) {
    for (const field of ['mp4', 'webm', 'poster']) {
      const onDisk = join(ROOT, entry[field].replace(/^\//, '')); // publish root, NOT public/ — the browser requests /video/..., so checking public/ passed while every URL 404'd
      if (!existsSync(onDisk)) {
        throw new Error(`engine "${key}" ${field} missing: ${entry[field]}`);
      }
    }
  }
});

// ENGINE_VIDEOS is empty today, so the assertion above passes vacuously — which is
// precisely the shape of test this repo has been bitten by before. This one carries
// the real invariant: the Envato preview tree was moved out of platform/ on
// 2026-09-08 because a preview file carries no licence, and nothing that ships may
// reference it. A page requesting /video/... would 404 in production AND, if the
// files were ever restored, would publish unlicensed footage.
test('nothing that ships references the removed /video/ tree', () => {
  const skipDirs = new Set(['node_modules', '.git', 'prototype', 'tests']);
  const offenders = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (skipDirs.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.(html|js|mjs|css)$/.test(name)) {
        const body = readFileSync(full, 'utf8');
        // The word also appears in prose/comments; only a real URL matters.
        for (const hit of body.match(/["'(]\/video\/[^"')\s]+/g) ?? []) {
          offenders.push(`${full.slice(ROOT.length + 1)} -> ${hit.slice(1)}`);
        }
      }
    }
  };
  walk(ROOT);

  if (offenders.length) {
    throw new Error(
      `unlicensed Envato footage referenced by shipping files:\n  ${offenders.join('\n  ')}`
    );
  }
});

test('platform/video/ is absent from the deploy tree', () => {
  if (existsSync(join(ROOT, 'video'))) {
    throw new Error(
      'platform/video/ is back. Every clip in it is an Envato preview render and ' +
        'carries no licence — see ~/Documents/_platform-media-archive/2026-09-08/README.md'
    );
  }
});

test('engine slugs stay the frozen pre-rebrand routes', () => {
  // HANDOFF §7: slugs are NOT renamed even though engines are.
  for (const slug of ['creative', 'social', 'intel', 'flow', 'estate', 'seo', 'freelance']) {
    if (!existsSync(join(ROOT, slug, 'index.html'))) {
      throw new Error(`frozen route missing: /${slug}/`);
    }
  }
});

test('index.html loads video-hero.js after main.js', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const mainAt = html.indexOf('assets/js/main.js');
  const vhAt = html.indexOf('assets/js/video-hero.js');
  if (mainAt < 0) throw new Error('main.js script tag missing');
  if (vhAt < 0) throw new Error('video-hero.js script tag missing');
  if (vhAt < mainAt) throw new Error('video-hero.js must load after main.js');
});

test('derivatives pipeline script exists and is executable-shaped', () => {
  const script = join(ROOT, '..', 'video-analysis', 'scripts', 'build_derivs.sh');
  const content = readFileSync(script, 'utf8');
  if (!content.includes('libx264')) throw new Error('mp4 encoder missing from pipeline');
  if (!content.includes('libvpx-vp9')) throw new Error('webm encoder missing from pipeline');
  if (!content.includes('faststart')) throw new Error('faststart missing from pipeline');
});