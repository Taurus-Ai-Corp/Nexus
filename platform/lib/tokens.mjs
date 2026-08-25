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
 */
export const verticals = {
  creative: accent.terracotta,
  social: accent.blue,
  intel: accent.gold,
  freelance: accent.greenText,
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
    ['--on-accent', onDark.text],
    ['--accent-tint', 'rgba(180,74,36,.10)'],
    ['--accent-tint-border', 'rgba(180,74,36,.26)'],
    ['--accent-2-tint', 'rgba(74,107,138,.10)'],
    ['--accent-2-tint-border', 'rgba(74,107,138,.26)'],
    ['--gold-tint', 'rgba(184,134,43,.10)'],
    ['--gold-tint-border', 'rgba(184,134,43,.26)'],
    ['--success-tint', 'rgba(127,160,95,.12)'],
    ['--success-tint-border', 'rgba(127,160,95,.28)'],

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
