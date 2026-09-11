/**
 * video-hero.js — NEORM-ERA platform static-site hero video module (ESM).
 *
 * Progressive enhancement over the existing static hero markup:
 *   1. Injects a <video> background layer into `.hero` with a poster-first
 *      paint (never a black flash), IntersectionObserver gating so off-screen
 *      videos never decode, `prefers-reduced-motion` respect, and graceful
 *      no-JS/no-video fallback to the existing CSS hero.
 *   2. Optional Lenis smooth-scroll + GSAP ScrollTrigger motion provider,
 *      loaded lazily from esm.sh and silently skipped when unreachable or
 *      under reduced motion — the site must work with zero network deps.
 *
 * Data attribution per video-analysis/output/video-tokens.json; overlays and
 * safe zones are applied per-engine via data attributes on .hero.
 */

/* global window, document, IntersectionObserver */

// hero-gradient.js is intentionally NOT imported — see initHeroMedia() for why.
// Importing it shipped ~120 lines of WebGL to every hero page for a branch that
// can no longer be reached.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Per-engine background footage. EMPTY ON PURPOSE — an engine with no entry here
 * renders the procedural shader instead, which is every engine today.
 *
 * Every clip that used to live under video/ was an Envato *preview* render of an
 * AE/PPro template — verified 2026-08-31 by resolving all eight item IDs. Their
 * frames carry the vendor's demo copy and, on seo/, a visible ENVATO badge.
 * Envato's terms: "you are not permitted to use preview files in any End Product."
 * A preview carries no licence, and re-encoding one does not launder it.
 *
 * Six engines had already moved to the shader because it is simply better for a
 * gradient plate: no decode, no seek, no iOS Low-Power-Mode failure, ~5 KB instead
 * of 3-5 MB. On 2026-09-08 the remaining two followed, for licensing rather than
 * craft reasons, and platform/video/ was moved out of the deploy tree entirely:
 *   estate — corporate template with burned-in dashboard UI over stock office footage
 *   seo    — carried the ENVATO badge
 *
 * The video path below is kept live, not deleted, so licensed footage can be
 * reinstated by adding one entry. `tests/video-hero.test.js` asserts that whatever
 * is listed here actually exists on disk, and that nothing shipping references
 * /video/ — so an entry pointing at a missing or unlicensed file fails the suite
 * rather than 404ing in production.
 *
 * 2026-09-11: footage is back, and this time we own it. Phase 5 generated a single
 * ambient clip on Higgsfield (kling3_0, 7.5 credits) — no third-party licence, no
 * preview terms. Filenames are content-hashed because /assets/* ships
 * `immutable, max-age=31536000`; an unhashed name there is unrevisable forever.
 *
 * ONE clip, re-tinted per engine — see .gemini-handoff/HANDOFF-PHASE5-HIGGSFIELD.md:25.
 * Engine identity is carried by --vertical-*, not by eight separate renders. The
 * warm/cool split mirrors the shader's own PALETTES weighting in hero-gradient.js:40:
 * clay/rose-forward engines take the warm scrim, slate-forward ones the cool, and
 * default stays untinted. Only `cool`, `warm` and `none` have CSS rules
 * (design-system.css:544-546) — `procedural` is a class on the shader layer, not a
 * valid overlay value here.
 *
 * AMBIENT is deliberately a separate const so the content hash lives in exactly one
 * place; `tests/video-hero.test.js` evaluates both declarations together.
 */
const AMBIENT = {
  mp4: '/assets/video/ambient.2b43ddea.mp4',
  webm: '/assets/video/ambient.2b43ddea.webm',
  poster: '/assets/video/ambient.2b43ddea.webp',
};

const ENGINE_VIDEOS = {
  default: { ...AMBIENT, overlay: 'none' },
  creative: { ...AMBIENT, overlay: 'warm' },
  social: { ...AMBIENT, overlay: 'cool' },
  intel: { ...AMBIENT, overlay: 'cool' },
  flow: { ...AMBIENT, overlay: 'warm' },
  estate: { ...AMBIENT, overlay: 'warm' },
  seo: { ...AMBIENT, overlay: 'cool' },
  freelance: { ...AMBIENT, overlay: 'warm' },
};

function engineKey() {
  const p = window.location.pathname;
  const seg = p.split('/').filter(Boolean)[0];
  if (!seg) return 'default';
  const known = ['creative', 'social', 'intel', 'flow', 'estate', 'seo', 'freelance'];
  return known.includes(seg) ? seg : 'default';
}

function buildVideoLayer(entry) {
  const media = document.createElement('div');
  media.className = `hero-media hero-media--${entry.overlay}`;
  media.setAttribute('aria-hidden', 'true');

  const poster = document.createElement('div');
  poster.className = 'hero-media__poster';
  poster.style.backgroundImage = `url("${entry.poster}")`;
  media.appendChild(poster);

  const video = document.createElement('video');
  video.className = 'hero-media__video';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoPlay = false; // observer starts it; avoids autoplay policy races
  video.preload = 'none'; // data-saver friendly; observer flips to auto
  video.setAttribute('disablepictureinpicture', '');
  video.tabIndex = -1;
  if (entry.webm) {
    const sWebm = document.createElement('source');
    sWebm.src = entry.webm;
    sWebm.type = 'video/webm';
    video.appendChild(sWebm);
  }
  const sMp4 = document.createElement('source');
  sMp4.src = entry.mp4;
  sMp4.type = 'video/mp4';
  video.appendChild(sMp4);
  media.appendChild(video);

  const scrim = document.createElement('div');
  scrim.className = 'hero-media__scrim';
  media.appendChild(scrim);

  return { media, video, poster };
}

/**
 * The page's single frame loop.
 *
 * Every hero page used to run two: hero-gradient.js drove the shader with its own
 * requestAnimationFrame, while initMotion() below drove Lenis on gsap.ticker.
 * gsap-advanced-design/references/performance-guide.md §10 bans exactly that —
 * "Use requestAnimationFrame alongside GSAP ticker (use one or the other)."
 *
 * So callbacks register here instead. The loop starts on rAF because the hero
 * paints long before GSAP finishes loading from the CDN, and migrates onto
 * gsap.ticker if GSAP ever arrives — cancelling the rAF in the same breath, so
 * the two never overlap. If GSAP fails to load, rAF simply remains the owner.
 *
 * A callback returning false is dropped: that is how the shader retires itself
 * after painting its single static frame under reduced motion, leaving the loop
 * empty and idle rather than spinning on a no-op.
 */
const ticks = new Set();
let rafId = 0;
let driver = 'none'; // 'none' | 'raf' | 'gsap'

function runTicks(ms) {
  for (const fn of ticks) {
    let keep;
    try {
      keep = fn(ms) !== false;
    } catch {
      keep = false; // a throwing callback is dropped, never left to throw every frame
    }
    if (!keep) ticks.delete(fn);
  }
  if (ticks.size === 0) stopLoop();
}

function rafStep(ms) {
  if (driver !== 'raf') return;
  runTicks(ms);
  if (driver === 'raf' && ticks.size) rafId = window.requestAnimationFrame(rafStep);
}

function startLoop() {
  if (driver !== 'none' || ticks.size === 0) return;
  driver = 'raf';
  rafId = window.requestAnimationFrame(rafStep);
}

function stopLoop() {
  if (driver === 'raf' && rafId) window.cancelAnimationFrame(rafId);
  rafId = 0;
  driver = 'none';
}

function registerTick(fn) {
  ticks.add(fn);
  startLoop();
}

/**
 * Hand the loop to GSAP. Called once, only if GSAP actually loaded.
 *
 * gsap.ticker reports elapsed time in SECONDS; requestAnimationFrame reports
 * MILLISECONDS. Every registered callback is written against the rAF contract, so
 * the conversion happens here — once — rather than each callback having to know
 * which driver is currently running. Getting this wrong is silent: the shader
 * would simply animate a thousand times too slowly and read as frozen.
 */
function adoptGsapTicker(gsap) {
  if (driver === 'raf' && rafId) window.cancelAnimationFrame(rafId);
  rafId = 0;
  driver = 'gsap';
  gsap.ticker.add((seconds) => runTicks(seconds * 1000));
}

function initHeroMedia() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hero-media')) return;

  // Reduced motion is NOT an early return. It used to be, which meant .hero-media
  // was never created at all and those users got a bare hero — and for the video
  // path the poster is the LCP element, so they also lost their largest paint.
  // The request is less movement, not less design. So the layer is still built:
  // the shader's tick() paints a single static frame and retires itself from the
  // loop, and the video path mounts its poster and never calls play().

  const key = engineKey();

  // The shader path used to live here: `if (!ENGINE_VIDEOS[key]) createGradientLayer(key)`.
  // It went unreachable on 2026-09-11 when all eight engine keys gained an entry,
  // and the import of hero-gradient.js was shipping ~120 lines of WebGL to every
  // hero page that could never execute.
  //
  // It was kept for a while on the theory that the shader was the WebGL-absent
  // fallback. That reasoning was wrong, and Gemini caught it: createGradientLayer
  // opens its own `canvas.getContext('webgl')` and returns null without it — so it
  // needs the very thing it was supposedly covering for. The real no-WebGL path is
  // the video layer's poster, which is a plain background-image and needs no GL at
  // all.
  //
  // assets/js/hero-gradient.js is deliberately NOT deleted. The Envato footage was
  // pulled once already for licensing (2026-09-08), and if the Higgsfield clip ever
  // has to go the same way, restoring the shader is re-adding one import and
  // emptying ENGINE_VIDEOS. tests/single-frame-loop.test.js also still reads it to
  // assert neither file schedules its own rAF.
  const entry = ENGINE_VIDEOS[key];
  // Defensive: an engine with no entry now renders no media layer rather than
  // throwing inside buildVideoLayer. The static CSS hero remains.
  if (!entry) return;
  const { media, video } = buildVideoLayer(entry);
  hero.insertBefore(media, hero.firstChild);

  // Paint the poster immediately; the video fades over it once playing.
  video.addEventListener('playing', () => media.classList.add('is-live'));
  // If the source cannot load (deploy without /video), keep the poster.
  video.addEventListener('error', () => media.classList.remove('is-live'));
  media.dataset.state = 'poster';

  if (REDUCED) {
    // Poster only: visible, static, and never observed so play() is never called.
    media.dataset.state = 'poster-static';
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (changes) => {
        changes.forEach((ch) => {
          if (ch.isIntersecting) {
            if (video.preload !== 'auto') {
              // Start loading on approach, not on page load.
              video.preload = 'auto';
              video.load();
            }
            const p = video.play();
            if (p && p.catch) p.catch(() => media.classList.remove('is-live'));
            media.dataset.state = 'playing';
          } else {
            video.pause();
            media.dataset.state = 'paused';
          }
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(hero);
  }
}

/**
 * Lenis + GSAP ScrollTrigger provider. Never a hard dependency: loaded
 * lazily, skipped under reduced motion, and page behaviour is unchanged
 * if either import fails (offline, blocked CDN, etc.).
 */
async function initMotion() {
  if (REDUCED) return;
  try {
    const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import('https://esm.sh/lenis@1.1.13'),
      import('https://esm.sh/gsap@3.12.5'),
      import('https://esm.sh/gsap@3.12.5/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    // One loop from here on: GSAP takes over from the rAF the hero started with.
    adoptGsapTicker(gsap);
    gsap.ticker.lagSmoothing(0);

    // Lenis is desktop-only. performance-guide.md §10: "Add Lenis smooth scroll on
    // mobile (conflicts with iOS momentum)" sits on its DON'T list. Touch devices
    // keep native momentum scrolling; ScrollTrigger still runs, just off native
    // scroll events rather than Lenis.
    const COARSE = window.matchMedia('(pointer: coarse)').matches;
    if (!COARSE) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      registerTick((time) => {
        lenis.raf(time);
        return true;
      });
    }

    // Reveal choreography: .reveal elements cascade with a soft rise.
    document.querySelectorAll('.reveal, .reveal-hero').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 26, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });
  } catch (err) {
    // Motion layer is decorative; the static site is the baseline.
    if (window.console && console.debug) console.debug('motion layer skipped:', err);
  }
}

function init() {
  initHeroMedia();
  initMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}