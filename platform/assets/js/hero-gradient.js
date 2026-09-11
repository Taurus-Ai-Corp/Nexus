/**
 * Procedural hero gradient — a licence-free replacement for the stock video plates.
 *
 * Why this exists: the eight clips under video/ are Envato *preview* renders of
 * After Effects / Premiere templates, not licensed footage. Their frames carry the
 * vendor's own demo copy ("8 Placeholders", "NO PLUGINS", an ENVATO badge). A preview
 * file carries no licence, so they cannot ship — and inpainting the text out would
 * produce an unlicensed derivative rather than fix the problem.
 *
 * This draws the same *kind* of soft mesh gradient in the brand palette, from
 * tokens.css, at ~5 KB with no network request, no decode, and no seek.
 *
 * CORRECTION (2026-09-11): an earlier version of this comment claimed that
 * scroll-scrubbing a <video> "fails outright under iOS Low Power Mode". No source
 * supports that. WebKit bug 219889 (WONTFIX) documents Low Power Mode disabling
 * *autoplay*, not seeking — the penalty attaches to the `autoplay` attribute and
 * forces native controls. Scrubbing is still the wrong tool here, but for real
 * reasons: a dense-GOP encode costs roughly 5x the file size, and Chrome, Firefox
 * and Safari diverge sharply on seek quality. The claim was wrong; the conclusion
 * happened to be right, which is the worst way to be wrong.
 *
 * Exports createGradientLayer(paletteName) -> { media, canvas, destroy }
 */

/* global window, document */

/* Brand palette, normalised from assets/css/tokens.css. Keep in sync with that file —
   these are the same hex values, not approximations. */
const P = {
  cream: [0.929, 0.910, 0.871], // --bg      #EDE8DE
  sand: [0.894, 0.871, 0.824], // --surface-2 #E4DED2
  clay: [0.706, 0.290, 0.141], // --accent  #B44A24
  rose: [0.851, 0.643, 0.557], // --panel-accent #D9A48E
  slate: [0.290, 0.420, 0.541], // --accent-2 #4A6B8A
  gold: [0.722, 0.525, 0.169], // --gold    #B8862B
  sage: [0.659, 0.769, 0.541], // --panel-green #A8C48A
};

/* Per-engine weighting so the six heroes are siblings, not clones. Values are the
   mix strengths for [rose, slate, clay, gold, sage] against the cream/sand base. */
const PALETTES = {
  default: [0.72, 0.55, 0.60, 0.28, 0.16],
  creative: [0.86, 0.30, 0.72, 0.34, 0.10], // warmest — clay + rose forward
  social: [0.64, 0.72, 0.44, 0.20, 0.14], // cooler, slate forward
  intel: [0.40, 0.82, 0.34, 0.24, 0.12], // most analytical — slate dominant
  flow: [0.58, 0.48, 0.46, 0.40, 0.26], // gold + sage, motion-ish
  freelance: [0.70, 0.40, 0.52, 0.36, 0.22], // between creative and flow
};

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FS = `precision highp float;
uniform vec2 R; uniform float T; uniform float S; uniform float W[5];
uniform vec3 CREAM,SAND,CLAY,ROSE,SLATE,GOLD,SAGE;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/R.xy; vec2 q=uv; q.x*=R.x/R.y;
  float t=T*.06 + S*2.2;
  vec2 w =vec2(fbm(q*1.6+vec2(0.,t)),        fbm(q*1.6+vec2(5.2,-t*.8)));
  vec2 w2=vec2(fbm(q*2.4+w*1.7+vec2(1.7,9.2)),fbm(q*2.4+w*1.7+vec2(8.3,2.8)));
  float f=fbm(q*1.9+w2*1.9+t*.15);
  float g=fbm(q*2.7+w*1.2-t*.1);
  vec3 c=CREAM;
  c=mix(c,SAND ,smoothstep(.25,.85,f));
  c=mix(c,ROSE ,smoothstep(.42,.92,g)*W[0]);
  c=mix(c,SLATE,smoothstep(.55,1.00,f*g*1.7)*W[1]);
  c=mix(c,CLAY ,smoothstep(.62,1.02,w2.x+f*.45)*W[2]);
  c=mix(c,GOLD ,smoothstep(.72,1.05,w.y+g*.35)*W[3]);
  c=mix(c,SAGE ,smoothstep(.80,1.10,w2.y+f*.25)*W[4]);
  c*=mix(.90,1.0,smoothstep(1.25,.25,length(uv-.5)));
  gl_FragColor=vec4(c,1.);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('[hero-gradient]', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

/**
 * Build the gradient layer. Returns null when WebGL is unavailable so the caller
 * can fall back to the existing static hero rather than render a blank canvas.
 */
export function createGradientLayer(paletteName = 'default') {
  const media = document.createElement('div');
  media.className = `hero-media hero-media--${paletteName} is-procedural`;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-media__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  media.appendChild(canvas);

  const scrim = document.createElement('div');
  scrim.className = 'hero-media__scrim';
  media.appendChild(scrim);

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });
  if (!gl) return null; // caller keeps the static hero

  const prog = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, VS);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  for (const [k, v] of Object.entries(P)) {
    gl.uniform3fv(gl.getUniformLocation(prog, k.toUpperCase()), v);
  }
  gl.uniform1fv(
    gl.getUniformLocation(prog, 'W'),
    new Float32Array(PALETTES[paletteName] || PALETTES.default),
  );

  const uR = gl.getUniformLocation(prog, 'R');
  const uT = gl.getUniformLocation(prog, 'T');
  const uS = gl.getUniformLocation(prog, 'S');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alive = true;

  function resize() {
    // Cap DPR at 2: beyond that the fill cost doubles for no visible gain on a
    // soft gradient, and low-power devices drop frames.
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const r = media.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round((r.width || window.innerWidth) * d));
    canvas.height = Math.max(1, Math.round((r.height || window.innerHeight) * d));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /**
   * Scroll position of this layer, read per frame rather than from a listener.
   *
   * This used to be a `window.addEventListener('scroll', ...)`, which
   * design-taste-frontend SKILL.md §5.D bans outright: it fires on every scroll
   * frame, is not batched, and is a known jank source. Reading the rect inside
   * the tick costs the same layout query at a rate the frame loop already
   * governs, and removes a listener that could fire independently of it.
   */
  function readScroll() {
    const r = media.getBoundingClientRect();
    const span = r.height + window.innerHeight;
    return span > 0 ? Math.min(Math.max((window.innerHeight - r.top) / span, 0), 1) : 0;
  }

  /**
   * Draw one frame. THE CALLER OWNS THE LOOP — this function must never schedule
   * itself.
   *
   * It previously ran its own `requestAnimationFrame` while video-hero.js was
   * separately driving Lenis on `gsap.ticker`, so every hero page ran two
   * independent frame loops. gsap-advanced-design/references/performance-guide.md
   * §10 is explicit: "Use requestAnimationFrame alongside GSAP ticker (use one or
   * the other)."
   *
   * Returns false once it has nothing further to draw, which lets the caller drop
   * it from the loop: under reduced motion the shader paints a single static frame
   * and is done.
   */
  function tick(ms) {
    if (!alive) return false;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 0 : ms * 0.001);
    gl.uniform1f(uS, readScroll());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return !reduced;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  tick(0); // paint immediately so the layer is never briefly blank

  function destroy() {
    alive = false;
    window.removeEventListener('resize', resize);
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }

  return { media, canvas, tick, destroy };
}

export const PROCEDURAL_PALETTES = PALETTES;
