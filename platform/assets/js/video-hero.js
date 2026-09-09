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

import { createGradientLayer } from './hero-gradient.js';

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
 */
const ENGINE_VIDEOS = {};

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

function initHeroMedia() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hero-media')) return;
  if (REDUCED) return; // static CSS hero remains

  const key = engineKey();

  // Shader path: no network, no decode, nothing to license. Taken whenever the
  // engine has no ENGINE_VIDEOS entry, which is every engine today.
  if (!ENGINE_VIDEOS[key]) {
    const layer = createGradientLayer(key);
    // createGradientLayer returns null when WebGL is unavailable — keep the
    // static CSS hero rather than inserting a blank canvas.
    if (layer) {
      hero.insertBefore(layer.media, hero.firstChild);
      layer.media.dataset.state = 'procedural';
      layer.media.classList.add('is-live');
      return;
    }
    return;
  }

  const entry = ENGINE_VIDEOS[key];
  const { media, video } = buildVideoLayer(entry);
  hero.insertBefore(media, hero.firstChild);

  // Paint the poster immediately; the video fades over it once playing.
  video.addEventListener('playing', () => media.classList.add('is-live'));
  // If the source cannot load (deploy without /video), keep the poster.
  video.addEventListener('error', () => media.classList.remove('is-live'));
  media.dataset.state = 'poster';

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

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

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