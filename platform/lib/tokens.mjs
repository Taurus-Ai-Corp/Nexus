/**
 * NEXUS-CORE — design tokens, single source of truth.
 *
 * Normative source: `HANDOFF-Claude-Code.md` §3 ("Design system — exact tokens"),
 * extended by `NEXUS-CORE - Liquid Crystal Decisions.dc.html` decision 2 (the Ember
 * ramp) and bounded by decision 3 rule R3 ("warm chrome, cold canvas").
 *
 * WHY THIS FILE EXISTS — Convergence Analysis §5, rejection E2:
 *
 *   "The compiler's prompt hardcodes the palette and the font stack as literal
 *    strings, and in the source I read one of the colour values is already
 *    truncated mid-value. A design system that exists in two places is a design
 *    system that drifts... The prompt must be generated from the token package at
 *    build time. Adopt the harness; reject the literals."
 *
 * So: no stylesheet, page, or model prompt may hand-type a hex. Everything derives
 * from here via `scripts/build-tokens.mjs`, which emits `assets/css/tokens.css`.
 * If you are about to paste a colour into a `.css` or `.html` file — don't. Add it
 * here and regenerate.
 *
 * Handoff §3 opens with: "Lift these literally. Do not substitute 'close enough'
 * values, do not introduce a new neutral, do not add a gradient." The absence of
 * gradient tokens below is deliberate, not an oversight.
 */

/** Handoff §3.2 — INK / TEXT. */
export const ink = {
  ink: '#17150F', // primary text, dark panels, sidebar
  inkSoft: '#3B372D', // secondary heading, footer prose
  muted: '#6B6559', // body secondary
  muted2: '#8A8375', // labels, mono meta
  faint: '#B9B2A3', // axis labels, disabled
};

/** Handoff §3.2 — PAPER (light surfaces). */
export const paper = {
  paper: '#F7F4EE', // cards
  paperAlt: '#F2EEE6', // status bar, seam strips, page chrome
  paperDeep: '#EDE8DE', // card headers/footers, app background
  paperHover: '#E4DED2', // button hover
  cardHover: '#FBF9F4', // card hover
};

/** Handoff §3.2 — ON-DARK, for use inside `#17150F` panels. */
export const onDark = {
  text: '#EDE8DE',
  secondary: '#A69E90',
  label: '#8A8375',
  faint: '#7E776A',
  code: '#CFC8BA',
  navInactive: '#A69E90',
  navKbd: '#5E574B',
  terracotta: '#D9A48E',
  green: '#A8C48A',
};

/** Handoff §3.2 — BORDERS. Alpha over ink; kept as rgba so they composite. */
export const border = {
  hairlineStrong: 'rgba(23,21,15,.13)', // card border, chrome dividers
  hairlineRow: 'rgba(23,21,15,.08)', // table row dividers
  hairlineControl: 'rgba(23,21,15,.16)', // inputs, buttons
  hairlineControlStrong: 'rgba(23,21,15,.20)',
  onDark: 'rgba(237,232,222,.11)',
  onDarkSoft: 'rgba(237,232,222,.10)',
  onDarkStrong: 'rgba(237,232,222,.14)',
};

/**
 * Handoff §3.2 — ACCENTS. Semantic; the comment "do not repurpose" is load-bearing.
 * `terracotta` is identical to the Ember ramp's rest state — same pigment, and the
 * two systems agree on it exactly.
 */
export const accent = {
  terracotta: '#B44A24', // PRIMARY. active nav, gates, video/premium cost, "now"
  terracottaAlert: '#C25A2E', // alert / rejection / overspend
  terracottaText: '#8E3617', // terracotta text on light
  blue: '#4A6B8A', // Social vertical, client-facing, inbound
  blueText: '#3A5570',
  gold: '#B8862B', // Intel vertical, regulatory, pending/warning
  goldText: '#8A6318',
  green: '#7FA05F', // local inference, healthy, 0-credit, pass
  greenText: '#4F6B37',
  neutralBar: '#C9BFAD', // inactive chart bars
};

/**
 * Liquid Crystal decision 2 — the Ember ramp.
 *
 * "Iron at rest is rust; iron under heat glows coral. Same material, two states of
 * energy." Rust is the MATERIAL state: pigment, ink, print, matte, anything at rest
 * or structural. Coral is the EMISSIVE state: light, glow, live signal, anything
 * under load or being decided.
 *
 * Step 0 is `accent.terracotta` — deliberately the same value, not a near-miss.
 * Application model is M1 Ember ("state decides"): one earned coral object per
 * screen, never decorative.
 */
export const ember = [
  '#B44A24', // 0 — rest
  '#C85431', // 1
  '#DC5F3E', // 2
  '#EC684C', // 3
  '#F86B57', // 4 — live
];

/**
 * Handoff §3.2 — "Vertical accent assignment (locked)".
 * Core/company is ink, not an accent; that is intentional.
 *
 * ESTATE / SEO / FLOW — added 2026-09-11, and NOT taken verbatim from the
 * engine matrix. The reason is measured, not aesthetic.
 *
 * `00-PRODUCT-PLANNING/.../08_COLOR_TAXONOMY_AND_ENGINE_PALETTES.md` gives each
 * engine a triad: a dark base and a vivid accent. That matrix was written for the
 * Liquid Crystal direction — its own §3 mandates a #EEF2F5 / #F2F1EC ground, with
 * the base absorbed at 8% into a glass card and the vivid cast as a caustic glow.
 * We shipped the Hybrid direction instead: flat warm paper (--bg #EDE8DE), no
 * gradients, no glass. On that ground neither half of the triad functions.
 *
 * Contrast against #EDE8DE, measured:
 *
 *   shipped band   creative 4.36:1 · social 4.57:1 · freelance 4.93:1
 *   body text      #17150F  14.95:1
 *
 *   estate base    #5A2132  10.13:1   vivid #EFE9E9  1.02:1
 *   seo base       #001619  15.24:1   vivid #50E8F4  1.21:1
 *   flow base      #1F0E06  15.31:1   vivid #C6E385  1.17:1
 *
 * The seo and flow bases are DARKER than body text — ship them and those two
 * engines have no visible identity at all. Every vivid is invisible on paper.
 *
 * So each value below keeps its engine's identifying HUE from the matrix and
 * moves only lightness, until contrast lands on the shipped band (~4.55:1, AA for
 * body text). For seo and flow the identifying hue is the vivid, not the base —
 * the bases are all but black and carry no identity. This is the same operation
 * the four original verticals already represent: creative's matrix base is
 * Midnight Blue #1E223D, yet --vertical-creative ships as terracotta.
 *
 * If the Liquid Crystal direction is ever adopted, revert these to the matrix
 * bases — on dark glass they are correct and these are not.
 */
export const verticals = {
  creative: accent.terracotta,
  social: accent.blue,
  intel: accent.gold,
  freelance: accent.greenText,
  estate: '#B04162', // hue of Masterpiece Red #5A2132, fitted — 4.55:1
  seo: '#08747C', // hue of Fluorescent Blue #50E8F4, fitted — 4.53:1
  flow: '#56711A', // hue of Yellow Green #C6E385, fitted — 4.56:1
  partners: accent.greenText,
  core: ink.ink,
};

/** Handoff §3.1 — Type. Display is weight 400 only. */
export const type = {
  display: '"Instrument Serif", Georgia, "Times New Roman", serif',
  sans: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  googleFontsHref:
    'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
};

/** Handoff §3.3 — chrome dimensions taken from the shell. */
export const chrome = {
  sidebar: '236px',
  topBar: '58px',
  statusBar: '27px',
  contentMax: '1220px',
  contentPad: '30px',
};

/**
 * Spacing — 4px grid.
 *
 * There were no spacing tokens at all: every gap/padding/margin in
 * design-system.css was a raw literal. An audit of that file found 28 distinct
 * px values (2,4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,36,40,48,56,60,64,
 * 70,110,120,130,150) — i.e. no grid, just accretion. This ladder is the target
 * the common ones already sit on; the stragglers (5, 18, 26, 70, 130…) are
 * migrated as each rule is touched, not in one sweep that no one can review.
 *
 * `--content-pad: 30px` predates this and is deliberately left alone — it is a
 * chrome dimension from handoff §3.3, not a spacing step.
 */
export const space = {
  1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px',
  7: '32px', 8: '40px', 9: '48px', 10: '64px', 11: '80px', 12: '120px',
};

/**
 * Type scale. Every value below is one the stylesheet already uses — the four
 * fluid sizes are lifted verbatim from the h1/h2/h3/.lead rules so the display
 * ramp stops living inline in four separate places.
 */
export const fontSize = {
  '2xs': '0.72rem', xs: '0.78rem', sm: '0.85rem',
  base: '0.95rem', md: '1.05rem', lg: '1.2rem',
  h3: 'clamp(1.3rem, 2vw, 1.6rem)',
  h2: 'clamp(1.9rem, 3.6vw, 2.9rem)',
  h1: 'clamp(2.4rem, 5.2vw, 4.1rem)',
  lead: 'clamp(1.05rem, 1.6vw, 1.3rem)',
};

/** Line heights, named for role. All five are values already in use. */
export const lineHeight = {
  display: '1.05', body: '1.6', lead: '1.65', prose: '1.7', loose: '1.75',
};

/** Letter-spacing. Negative on display, positive on mono/caps labels. */
export const tracking = {
  tighter: '-0.03em', tight: '-0.02em', snug: '-0.01em', normal: '0',
  wide: '0.02em', wider: '0.04em', caps: '0.08em',
  label: '0.14em', labelWide: '0.16em', eyebrow: '0.18em',
};

/**
 * Motion. There was exactly one token, `--ease`, while durations were scattered
 * as .08/.16/.18/.2/.24/.25/.3/.32/.7/.8/1.1s — eleven values for maybe four
 * intents. These six are the intents; `--ease-smooth` is the symmetric partner
 * to `--ease`, which is deliberately asymmetric (fast out, long settle) and
 * wrong for anything that has to feel reversible, like a toggle.
 */
export const motion = {
  instant: '.08s', fast: '.16s', base: '.25s',
  slow: '.32s', slower: '.8s', ambient: '1.1s',
  easeSmooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

/**
 * Ordered CSS custom properties.
 *
 * The left-hand names are the ones the existing 16 pages already reference
 * (`--bg`, `--text`, `--accent`, …). Keeping them and remapping only the values is
 * what lets the restyle land without touching every page's markup — and it means a
 * page that renders correctly after this change is genuinely reading the token
 * layer rather than carrying its own colours.
 */
export function cssVariables() {
  return [
    ['Surfaces — handoff §3.2 PAPER'],
    ['--bg', paper.paperDeep],
    ['--bg-elev', paper.paperAlt],
    ['--surface', paper.paper],
    ['--surface-2', paper.paperHover],
    ['--card-hover', paper.cardHover],
    ['--border', border.hairlineRow],
    ['--border-strong', border.hairlineStrong],
    ['--border-control', border.hairlineControl],

    ['Text — handoff §3.2 INK'],
    ['--text', ink.ink],
    ['--text-soft', ink.inkSoft],
    ['--text-muted', ink.muted],
    ['--text-dim', ink.muted2],
    ['--text-faint', ink.faint],

    ['Dark panels — handoff §3.2 ON-DARK'],
    ['--panel', ink.ink],
    ['--panel-text', onDark.text],
    ['--panel-text-2', onDark.secondary],
    ['--panel-label', onDark.label],
    ['--panel-faint', onDark.faint],
    ['--panel-code', onDark.code],
    ['--panel-border', border.onDark],
    ['--panel-accent', onDark.terracotta],
    ['--panel-green', onDark.green],

    ['Accents — handoff §3.2, semantic, do not repurpose'],
    ['--accent', accent.terracotta],
    ['--accent-text', accent.terracottaText],
    ['--accent-2', accent.blue],
    ['--accent-2-text', accent.blueText],
    ['--accent-3', accent.gold],
    ['--gold', accent.gold],
    ['--gold-text', accent.goldText],
    ['--success', accent.green],
    ['--success-text', accent.greenText],
    ['--warn', accent.gold],
    ['--danger', accent.terracottaAlert],
    ['--neutral-bar', accent.neutralBar],

    ['Ember ramp — Liquid Crystal decision 2. Step 0 === --accent.'],
    ...ember.map((hex, i) => [`--ember-${i}`, hex]),
    ['--ember-rest', ember[0]],
    ['--ember-live', ember[ember.length - 1]],

    ['Vertical accents — handoff §3.2, locked'],
    ...Object.entries(verticals).map(([k, v]) => [`--vertical-${k}`, v]),

    ['Typography — handoff §3.1'],
    ['--font-display', type.display],
    ['--font-sans', type.sans],
    ['--font-mono', type.mono],

    ['Type scale — sizes the stylesheet already uses, named once'],
    ...Object.entries(fontSize).map(([k, v]) => [`--fs-${k}`, v]),
    ...Object.entries(lineHeight).map(([k, v]) => [`--lh-${k}`, v]),
    ...Object.entries(tracking).map(([k, v]) => [
      `--tracking-${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, v,
    ]),

    ['Spacing — 4px grid'],
    ...Object.entries(space).map(([k, v]) => [`--space-${k}`, v]),

    ['Motion — six intents, replacing eleven scattered durations'],
    ['--dur-instant', motion.instant],
    ['--dur-fast', motion.fast],
    ['--dur-base', motion.base],
    ['--dur-slow', motion.slow],
    ['--dur-slower', motion.slower],
    ['--dur-ambient', motion.ambient],
    ['--ease-smooth', motion.easeSmooth],

    ['Chrome — handoff §3.3'],
    ['--sidebar-w', chrome.sidebar],
    ['--topbar-h', chrome.topBar],
    ['--statusbar-h', chrome.statusBar],
    ['--container', chrome.contentMax],
    ['--container-narrow', '860px'],
    ['--content-pad', chrome.contentPad],
    ['--nav-h', chrome.topBar],

    [
      'Tints and scrims. The dark system tinted surfaces with white alpha\n     (rgba(255,255,255,.03)) and scrimmed the nav with near-black. Both invert\n     on paper — white-on-white vanishes and the nav reads as a black bar — so\n     every one of those is replaced by an ink-alpha tint or a paper scrim.',
    ],
    ['--tint-1', 'rgba(23,21,15,.025)'],
    ['--tint-2', 'rgba(23,21,15,.05)'],
    ['--tint-3', 'rgba(23,21,15,.08)'],
    ['--scrim', 'rgba(242,238,230,.82)'],
    ['--scrim-solid', 'rgba(242,238,230,.97)'],

    [
      'Hero-media scrims. Same paper pigment as --scrim, four alphas because the\n     layer beneath differs: arbitrary footage needs a heavy veil to hold text\n     contrast, while the procedural canvas already renders on our own palette and\n     a heavy veil would flatten its gradient to a flat colour.',
    ],
    ['--scrim-media-cool', 'rgba(242,238,230,.72)'],
    ['--scrim-media-warm', 'rgba(242,238,230,.66)'],
    ['--scrim-media-none', 'rgba(242,238,230,.8)'],
    ['--scrim-media-procedural', 'rgba(242,238,230,.18)'],
    ['--on-accent', onDark.text],
    ['--accent-tint', 'rgba(180,74,36,.10)'],
    ['--accent-tint-border', 'rgba(180,74,36,.26)'],
    ['--accent-2-tint', 'rgba(74,107,138,.10)'],
    ['--accent-2-tint-border', 'rgba(74,107,138,.26)'],
    ['--gold-tint', 'rgba(184,134,43,.10)'],
    ['--gold-tint-border', 'rgba(184,134,43,.26)'],
    ['--success-tint', 'rgba(127,160,95,.12)'],
    ['--success-tint-border', 'rgba(127,160,95,.28)'],
    ['--estate-tint', 'rgba(176,65,98,.10)'],
    ['--estate-tint-border', 'rgba(176,65,98,.26)'],
    ['--seo-tint', 'rgba(8,116,124,.10)'],
    ['--seo-tint-border', 'rgba(8,116,124,.26)'],
    ['--flow-tint', 'rgba(86,113,26,.12)'],
    ['--flow-tint-border', 'rgba(86,113,26,.28)'],

    [
      'Flattened legacy aliases. §3: "do not add a gradient." The old dark system\n     used --grad-*/--glow in 9 places; rather than leave them undefined (which\n     renders as transparent and silently breaks buttons), they resolve to flat\n     token values. Do not reintroduce a gradient here.',
    ],
    ['--grad-brand', accent.terracotta],
    ['--grad-text', ink.ink],
    ['--grad-surface', 'transparent'],
    ['--glow', `0 0 0 1px ${border.hairlineControlStrong}`],

    ['Radii + elevation — flat by design; §3 forbids gradients'],
    ['--r-sm', '4px'],
    ['--r-md', '6px'],
    ['--r-lg', '10px'],
    ['--r-xl', '14px'],
    ['--shadow-accent', '0 6px 18px -8px rgba(180,74,36,.35)'],
    ['--shadow-accent-hover', '0 10px 26px -8px rgba(180,74,36,.45)'],
    [
      'macOS window-control dots in the terminal motif. Not brand colour — these\n     are a literal depiction of a real UI, so they stay at their real values.',
    ],
    ['--dot-r', '#ff5f57'],
    ['--dot-y', '#febc2e'],
    ['--dot-g', '#28c840'],
    ['--shadow-1', '0 1px 2px rgba(23,21,15,.06)'],
    ['--shadow-2', '0 12px 32px -16px rgba(23,21,15,.20)'],
    ['--ease', 'cubic-bezier(0.22, 1, 0.36, 1)'],
  ];
}
