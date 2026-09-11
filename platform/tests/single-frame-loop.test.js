import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
// Comments explain these very rules, so they must not count as violations.
const code = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// Every hero page once ran TWO frame loops: hero-gradient.js drove the shader on
// its own requestAnimationFrame while video-hero.js drove Lenis on gsap.ticker.
// gsap-advanced-design/references/performance-guide.md §10:
//   "Use requestAnimationFrame alongside GSAP ticker (use one or the other)"
// Nothing caught it — the pages rendered, the suite was green, and the cost was
// invisible without a profiler. These are the guards.

test('only video-hero.js may schedule a frame', () => {
  const offenders = [];
  for (const f of ['assets/js/hero-gradient.js', 'assets/js/main.js']) {
    let src;
    try { src = code(f); } catch { continue; }
    if (/requestAnimationFrame\s*\(/.test(src)) offenders.push(`${f} calls requestAnimationFrame`);
    if (/gsap\.ticker\.add/.test(src)) offenders.push(`${f} adds to gsap.ticker`);
  }
  assert.deepEqual(
    offenders,
    [],
    'a second frame loop is back. video-hero.js owns the single loop; register a '
      + `callback with registerTick() instead.\n  ${offenders.join('\n  ')}`,
  );
});

test('video-hero.js starts at most one driver and converts gsap seconds to ms', () => {
  const src = code('assets/js/video-hero.js');
  assert.match(src, /gsap\.ticker\.add\(\(seconds\) => runTicks\(seconds \* 1000\)\)/,
    'gsap.ticker reports SECONDS and rAF reports MILLISECONDS. Without the *1000 at '
    + 'the boundary the shader animates 1000x too slowly and reads as frozen — a '
    + 'silent failure, which is why it is pinned.');
  assert.match(src, /cancelAnimationFrame\(rafId\)/,
    'adopting gsap.ticker must cancel the rAF, or both drivers run at once');
});

test('no module uses the banned raw scroll listener', () => {
  // design-taste-frontend SKILL.md §5.D: window.addEventListener("scroll", ...) is
  // banned — fires every scroll frame, unbatched, jank-prone. Use ScrollTrigger,
  // IntersectionObserver, or read inside the frame loop.
  const offenders = [];
  for (const f of ['assets/js/hero-gradient.js', 'assets/js/video-hero.js', 'assets/js/main.js']) {
    let src;
    try { src = code(f); } catch { continue; }
    if (/addEventListener\(\s*['"]scroll['"]/.test(src)) offenders.push(f);
  }
  assert.deepEqual(offenders, [], `raw scroll listeners: ${offenders.join(', ')}`);
});

test('Lenis stays off touch devices', () => {
  const src = code('assets/js/video-hero.js');
  assert.match(src, /pointer:\s*coarse/,
    'performance-guide.md §10 DON\'T list: "Add Lenis smooth scroll on mobile '
    + '(conflicts with iOS momentum)". Guard it behind (pointer: coarse).');
});

test('reduced motion suppresses movement but keeps the hero visible', () => {
  const css = read('assets/css/design-system.css');
  const block = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  assert.ok(
    !/\.hero-media\s*\{\s*display:\s*none/.test(block),
    'display:none on .hero-media removes the visual, not just the motion — and for '
      + 'a video hero the poster is the LCP element, so it also costs those users '
      + 'their largest paint. Suppress playback, keep the poster.',
  );
});
