/**
 * engine-backdrop.js — seven engines, seven moving backdrops.
 *
 * Replaces the previous arrangement, where all seven engine pages shared one
 * video clip re-tinted `warm` or `cool`. Each renderer here DEPICTS WHAT ITS
 * ENGINE DOES, which is what stops the seven collapsing back into
 * interchangeable gradients:
 *
 *   darkroom   creative   images surfacing out of developer fluid
 *   broadcast  social     one origin, many destinations
 *   plotter    intel      a curve drawn live against gridlines
 *   graph      flow       work travelling the edges of a DAG
 *   blueprint  estate     floorplan lines drafting themselves
 *   index      seo        lines of text resolving into citations
 *   workspace  freelance  collaborators moving on a shared canvas
 *
 * 2D canvas, not WebGL. Deliberate: WebGL is absent in a lot of headless and
 * low-power contexts — a hero that silently renders nothing is worse than a
 * simpler one that always renders. (A previous WebGL hero shipped ~120 lines
 * that could never execute; see video-hero.js:213.)
 *
 * ACCESSIBILITY / COST
 *   * `prefers-reduced-motion: reduce` paints ONE frame and stops. Not a blank
 *     canvas — the composition still reads, it simply does not move.
 *   * Pauses entirely when the tab is hidden or the hero scrolls out of view,
 *     so an idle background tab costs nothing.
 *   * Purely decorative: aria-hidden, never focusable, never announced.
 *   * Capped at ~30fps and at devicePixelRatio 2 — past that it is spending
 *     battery on pixels nobody can distinguish in a blurred backdrop.
 */
/* global window, document, matchMedia, getComputedStyle, devicePixelRatio,
   requestAnimationFrame, cancelAnimationFrame, IntersectionObserver,
   addEventListener */
/* performance, setTimeout and clearTimeout are deliberately ABSENT above:
   they are already in the eslint config's Node globals, and re-declaring them
   trips no-redeclare — the same trap currency.js:38 records. */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FRAME_MS = 1000 / 30;
const MAX_DPR = 2;

/** Read the engine's palette from CSS so this file never re-declares colour. */
function palette(el) {
  const s = getComputedStyle(el);
  const pick = (n, fallback) => (s.getPropertyValue(n) || '').trim() || fallback;
  return {
    ground: pick('--engine-ground', '#12100E'),
    accent: pick('--engine-accent', '#B44A24'),
    secondary: pick('--engine-secondary', '#E08B5C'),
    glow: pick('--engine-glow', '#FF7A45'),
  };
}

/* ── renderers ─────────────────────────────────────────────────────────────
 * Each is (ctx, w, h, t, p) where t is seconds since start and p the palette.
 * They paint the full field every frame; the caller clears first.
 */

const RENDERERS = {
  /** creative — chemical bloom, as if a print were coming up in developer. */
  darkroom(ctx, w, h, t, p) {
    for (let i = 0; i < 5; i++) {
      const ph = t * 0.06 + i * 1.27;
      const x = w * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(ph)));
      const y = h * (0.25 + 0.5 * (0.5 + 0.5 * Math.cos(ph * 0.8 + i)));
      const r = Math.min(w, h) * (0.18 + 0.1 * Math.sin(ph * 1.3));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexA(i % 2 ? p.glow : p.accent, 0.22));
      g.addColorStop(1, hexA(p.accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  },

  /** social — pulses leaving one origin for many destinations. */
  broadcast(ctx, w, h, t, p) {
    const ox = w * 0.22;
    const oy = h * 0.52;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const r = ((t * 60 + i * 90) % Math.max(w, h)) * 1.1;
      ctx.strokeStyle = hexA(p.glow, 0.16 * (1 - r / (Math.max(w, h) * 1.1)));
      arcStroke(ctx, ox, oy, r, -Math.PI / 2.2, Math.PI / 2.2);
    }
    for (let i = 0; i < 5; i++) {
      const y = h * (0.18 + i * 0.16);
      const travel = (t * 0.22 + i * 0.2) % 1;
      ctx.fillStyle = hexA(p.secondary, 0.5);
      dot(ctx, ox + (w - ox) * travel, oy + (y - oy) * travel, 2.2);
    }
  },

  /** intel — a live trace over gridlines. */
  plotter(ctx, w, h, t, p) {
    ctx.strokeStyle = hexA(p.secondary, 0.1);
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) line(ctx, x, 0, x, h);
    for (let y = 0; y < h; y += 64) line(ctx, 0, y, w, y);

    ctx.strokeStyle = hexA(p.glow, 0.75);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const k = x / w;
      const y = h * (0.62 - 0.22 * Math.sin(k * 6 + t * 0.5) * Math.sin(k * 2.1 + t * 0.2) - 0.12 * k);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  /** flow — a DAG with work moving along its edges. */
  graph(ctx, w, h, t, p) {
    const cols = 4;
    const rows = 3;
    const nx = (c) => w * (0.14 + (c / (cols - 1)) * 0.72);
    const ny = (r) => h * (0.22 + (r / (rows - 1)) * 0.56);
    ctx.lineWidth = 1;
    for (let c = 0; c < cols - 1; c++) {
      for (let r = 0; r < rows; r++) {
        for (let r2 = 0; r2 < rows; r2++) {
          if ((c + r + r2) % 2) continue;
          ctx.strokeStyle = hexA(p.secondary, 0.34);
          line(ctx, nx(c), ny(r), nx(c + 1), ny(r2));
          const k = (t * 0.3 + (c + r + r2) * 0.17) % 1;
          ctx.fillStyle = hexA(p.glow, 0.85);
          dot(ctx, nx(c) + (nx(c + 1) - nx(c)) * k, ny(r) + (ny(r2) - ny(r)) * k, 2.4);
        }
      }
    }
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        ctx.fillStyle = hexA(p.accent, 0.6);
        dot(ctx, nx(c), ny(r), 4.2);
      }
    }
  },

  /** estate — plan-view lines drafting themselves. */
  blueprint(ctx, w, h, t, p) {
    const u = Math.min(w, h) / 9;
    ctx.strokeStyle = hexA(p.secondary, 0.12);
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += u) line(ctx, x, 0, x, h);
    for (let y = 0; y < h; y += u) line(ctx, 0, y, w, y);

    const rooms = [
      [1, 1, 4, 3], [5, 1, 3, 2], [1, 4, 2, 3], [3, 4, 5, 3], [5, 3, 3, 1],
    ];
    ctx.lineWidth = 1.8;
    rooms.forEach(([x, y, rw, rh], i) => {
      const draw = clamp((t * 0.34 - i * 0.55) / 1.1, 0, 1);
      if (draw <= 0) return;
      ctx.strokeStyle = hexA(p.glow, 0.5);
      const per = 2 * (rw + rh) * u;
      ctx.setLineDash([per * draw, per]);
      ctx.strokeRect(x * u, y * u, rw * u, rh * u);
    });
    ctx.setLineDash([]);
  },

  /** seo — lines of text resolving, a few becoming citations. */
  index(ctx, w, h, t, p) {
    const lh = 22;
    const rows = Math.ceil(h / lh);
    for (let r = 0; r < rows; r++) {
      const seed = Math.sin(r * 12.9898) * 43758.5453;
      const frac = seed - Math.floor(seed);
      const len = w * (0.24 + frac * 0.5);
      const on = clamp(Math.sin(t * 0.55 + r * 0.42) * 1.6, 0, 1);
      ctx.fillStyle = hexA(p.secondary, 0.1 + 0.14 * on);
      ctx.fillRect(w * 0.1, r * lh, len, 3);
      if (r % 5 === 2) {
        ctx.fillStyle = hexA(p.glow, 0.25 + 0.55 * on);
        ctx.fillRect(w * 0.1 + len + 10, r * lh, 26, 3);
      }
    }
  },

  /** freelance — collaborators drifting across a shared canvas. */
  workspace(ctx, w, h, t, p) {
    const cards = [
      [0.12, 0.2, 0.2, 0.22], [0.38, 0.14, 0.18, 0.3],
      [0.62, 0.26, 0.22, 0.24], [0.22, 0.54, 0.24, 0.2], [0.56, 0.58, 0.2, 0.18],
    ];
    cards.forEach(([x, y, cw, ch], i) => {
      const bob = Math.sin(t * 0.4 + i) * 4;
      ctx.fillStyle = hexA(p.secondary, 0.09);
      ctx.strokeStyle = hexA(p.secondary, 0.22);
      ctx.lineWidth = 1;
      roundRect(ctx, x * w, y * h + bob, cw * w, ch * h, 10);
      ctx.fill();
      ctx.stroke();
    });
    for (let i = 0; i < 3; i++) {
      const ph = t * 0.32 + i * 2.1;
      const cx = w * (0.3 + 0.4 * (0.5 + 0.5 * Math.sin(ph)));
      const cy = h * (0.3 + 0.4 * (0.5 + 0.5 * Math.cos(ph * 1.3)));
      ctx.fillStyle = hexA(i === 1 ? p.glow : p.accent, 0.9);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 9, cy + 7);
      ctx.lineTo(cx + 4, cy + 8);
      ctx.lineTo(cx + 2, cy + 13);
      ctx.closePath();
      ctx.fill();
    }
  },
};

/* ── helpers ─────────────────────────────────────────────────────────────── */

/**
 * arc() throws IndexSizeError on a negative or non-finite radius, which killed
 * the whole broadcast renderer on first paint: the hero can measure 0x0 before
 * layout settles, and `x % Math.max(w, h)` is NaN when that max is 0. One
 * guarded helper is safer than trusting every call site's arithmetic.
 */
function dot(ctx, x, y, r) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || !(r > 0)) return;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function arcStroke(ctx, x, y, r, a0, a1) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || !(r > 0)) return;
  ctx.beginPath();
  ctx.arc(x, y, r, a0, a1);
  ctx.stroke();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** #rrggbb -> rgba(). Tolerates a missing/!#-prefixed value rather than throwing. */
function hexA(hex, alpha) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return `rgba(255,255,255,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/* ── mount ───────────────────────────────────────────────────────────────── */

export function mountBackdrop(host, name) {
  const render = RENDERERS[name];
  if (!render || !host) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'engine-backdrop';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null; // no 2d context: leave the CSS ground showing
  host.prepend(canvas);

  const p = palette(host);
  let w = 0;
  let h = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  const start = performance.now();

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
    const r = host.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function paint(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.ground;
    ctx.fillRect(0, 0, w, h);
    render(ctx, w, h, t, p);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    last = now;
    paint((now - start) / 1000);
  }

  size();
  // One composed frame either way, so the hero is never blank before the first
  // animation tick — and IS the final state when motion is not wanted.
  paint(REDUCED ? 6.5 : 0);

  if (!REDUCED) {
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(host);
    document.addEventListener('visibilitychange', run);

    function run() {
      const should = visible && !document.hidden;
      if (should && !raf) raf = requestAnimationFrame(frame);
      else if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    run();
  }

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      size();
      paint(REDUCED ? 6.5 : (performance.now() - start) / 1000);
    }, 150);
  });

  return canvas;
}

/** Auto-mount from `body.theme-<slug>` and `[data-backdrop]` on the hero. */
export function init(doc = document) {
  const host = doc.querySelector('[data-backdrop]');
  if (!host) return null;
  return mountBackdrop(host, host.dataset.backdrop);
}

export const RENDERER_NAMES = Object.keys(RENDERERS);

if (typeof window !== 'undefined' && !window.__ENGINE_BACKDROP_MANUAL__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
}
