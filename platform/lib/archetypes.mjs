/**
 * archetypes.mjs — seven page architectures, one per engine.
 *
 * The palette and backdrop work (engine-identity.mjs) gave each engine its own
 * world. Underneath, every engine page was still the same four beats in the
 * same order:
 *
 *     hero  ->  .grid-3 of .feature  ->  .cta-band  ->  dl.faq-list
 *
 * Same skeleton, same rhythm, same card in a row of three. That is what makes
 * seven products read as one template, and colour alone does not fix it.
 *
 * Each archetype here RE-COMPOSES those same elements into a different
 * structure. No page loses content and no route changes — the difference is
 * architectural: what sits beside what, what carries a number, where the eye
 * travels, whether the thing reads as a gallery, a feed, an instrument, a
 * flowchart, a floorplan, a document or a board.
 *
 * WHY CSS RATHER THAN SEVEN HAND-WRITTEN PAGE TEMPLATES
 * -----------------------------------------------------
 * The content is already correct and already on the pages. Re-authoring seven
 * pages by hand would risk the copy, the schema, the canonical URLs and the
 * link graph for a layout change — and every one of those has a test guarding
 * it that would then need rewriting too. Restructuring by stylesheet keeps the
 * markup (and every guarantee attached to it) intact, and keeps the seven
 * architectures side by side in one file where they can be compared and told
 * apart. Counters and pseudo-elements carry the numbering and the connectors,
 * so no page needs decorative markup added to it.
 *
 * Scoped to `body.arch-<name>`, which build-engine-css.mjs writes onto each
 * engine page beside its existing `theme-<slug>`.
 */

/** gallery — creative. Editorial plates, staggered, captions in the margin. */
const gallery = `
/* Not a row of three equal cards: an asymmetric two-column plate grid with a
   dropped second column, the way a printed portfolio sets an opening spread. */
body.arch-gallery :is(.grid-3, .grid-2) { grid-template-columns: 1.15fr 0.85fr; gap: var(--space-8) var(--space-10); }
body.arch-gallery :is(.grid-3, .grid-2) > :is(.feature, .card):nth-child(even) { margin-top: var(--space-10); }
body.arch-gallery :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: block; padding: 0; border: 0; background: none;
  border-top: 2px solid var(--accent); padding-top: var(--space-4);
}
body.arch-gallery :is(.grid-3, .grid-2) > :is(.feature, .card) h3 {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.5rem, 2.6vw, 2.1rem); line-height: 1.1; margin-bottom: var(--space-3);
}
body.arch-gallery :is(.grid-3, .grid-2) > :is(.feature, .card) p { font-size: var(--fs-sm); max-width: 44ch; color: var(--text-muted); }
/* A two-column plate spread is a desktop composition. Held at phone width it
   gave 105px columns — roughly one word per line. Collapse it, and drop the
   stagger with it: an offset second column means nothing in a single file. */
@media (max-width: 760px) {
  body.arch-gallery :is(.grid-3, .grid-2) { grid-template-columns: 1fr; gap: var(--space-7); }
  body.arch-gallery :is(.grid-3, .grid-2) > :is(.feature, .card):nth-child(even) { margin-top: 0; }
}
/* Plates are numbered like figures, not bulleted like features. */
body.arch-gallery .faq-list { counter-reset: plate; }
body.arch-gallery .faq-item { border: 0; border-top: 1px solid var(--border); background: none; }
body.arch-gallery .faq-question::before {
  counter-increment: plate; content: "PL." counter(plate, decimal-leading-zero);
  display: block; font-family: var(--font-mono); font-size: 0.68rem;
  letter-spacing: .16em; color: var(--accent); margin-bottom: var(--space-2);
}`;

/** stream — social. A feed with a continuous rail, each item a dispatch. */
const stream = `
/* One column, read top to bottom like a timeline, with a rail running the
   length of the section and a node on each entry. */
body.arch-stream :is(.grid-3, .grid-2) { grid-template-columns: 1fr; gap: 0; max-width: 68ch; margin-inline: auto; }
body.arch-stream :is(.grid-3, .grid-2) { position: relative; }
body.arch-stream :is(.grid-3, .grid-2)::before {
  content: ""; position: absolute; left: 11px; top: 12px; bottom: 12px;
  width: 2px; background: linear-gradient(var(--accent), transparent);
}
body.arch-stream :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: block; position: relative; border: 0; background: none;
  padding: 0 0 var(--space-8) var(--space-8);
}
body.arch-stream :is(.grid-3, .grid-2) > :is(.feature, .card)::before {
  content: ""; position: absolute; left: 4px; top: 6px; width: 16px; height: 16px;
  border-radius: 50%; background: var(--bg); border: 2px solid var(--accent);
}
body.arch-stream :is(.grid-3, .grid-2) > :is(.feature, .card) h3 { font-size: var(--fs-md); margin-bottom: var(--space-2); }
/* Answers read as replies under the question, indented and ruled. */
body.arch-stream .faq-item { border: 0; border-left: 2px solid var(--border); background: none; padding-left: var(--space-5); }
body.arch-stream .faq-answer { border-left: 2px solid var(--accent); padding-left: var(--space-4); margin-left: var(--space-3); }`;

/** instrument — intel. Dense readout tiles, figures before prose. */
const instrument = `
/* A panel of gauges rather than a marketing row: tight tiles, ruled, mono
   labels, everything aligned to a grid you can feel. */
/* Three columns, not auto-fit. The hairline effect comes from the container's
   background showing through 1px gaps, which means any cell the items do not
   fill is painted dead grey: auto-fit gave five columns for six tiles and left
   a four-column slab of empty panel under the last one. Three divides the six
   tiles into two full rows. */
body.arch-instrument :is(.grid-3, .grid-2) { grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; }
@media (max-width: 900px) { body.arch-instrument :is(.grid-3, .grid-2) { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { body.arch-instrument :is(.grid-3, .grid-2) { grid-template-columns: 1fr; } }
body.arch-instrument :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: block; border: 0; border-radius: 0; background: var(--surface);
  padding: var(--space-5) var(--space-5) var(--space-6);
}
body.arch-instrument :is(.grid-3, .grid-2) > :is(.feature, .card) h3 {
  font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; color: var(--accent);
  margin-bottom: var(--space-3); padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border);
}
body.arch-instrument :is(.grid-3, .grid-2) > :is(.feature, .card) p { font-size: var(--fs-sm); font-variant-numeric: tabular-nums; }
/* The FAQ is a specification table, ruled and monospaced on the question side. */
body.arch-instrument .faq-item { border: 0; border-bottom: 1px solid var(--border); background: none; border-radius: 0; }
body.arch-instrument .faq-question { font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: .01em; }`;

/** nodal — flow. Steps joined by visible paths. */
const nodal = `
/* Orchestration is a sequence, so the layout is a sequence: numbered nodes
   with the connector drawn between them, not three peers in a row. */
body.arch-nodal :is(.grid-3, .grid-2) { grid-template-columns: 1fr; gap: var(--space-6); counter-reset: step; max-width: 74ch; margin-inline: auto; }
body.arch-nodal :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: grid; grid-template-columns: 52px 1fr; gap: var(--space-5);
  position: relative; border: 0; background: none; padding: 0 0 var(--space-6);
}
body.arch-nodal :is(.grid-3, .grid-2) > :is(.feature, .card)::before {
  counter-increment: step; content: counter(step);
  width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
  font-family: var(--font-mono); font-weight: 600; font-size: var(--fs-sm);
  color: var(--accent); background: var(--tint-1); border: 1px solid var(--accent);
}
body.arch-nodal :is(.grid-3, .grid-2) > :is(.feature, .card) > * { grid-column: 2; }
body.arch-nodal :is(.grid-3, .grid-2) > :is(.feature, .card)::before { grid-column: 1; grid-row: 1; }
/* The path between one step and the next. Not drawn after the last. */
body.arch-nodal :is(.grid-3, .grid-2) > :is(.feature, .card):not(:last-child)::after {
  content: ""; position: absolute; left: 22px; top: 50px; bottom: 6px;
  width: 2px; background: repeating-linear-gradient(var(--accent) 0 5px, transparent 5px 11px);
}
body.arch-nodal .faq-list { counter-reset: branch; }
body.arch-nodal .faq-item { border: 0; border-left: 2px dashed var(--border-strong); background: none; padding-left: var(--space-5); }`;

/** plan — estate. Plan-view rows, alternating, dimension rules. */
const plan = `
/* Property marketing is spatial: wide alternating bands with drafting rules,
   read like a floorplan sheet rather than a card wall. */
body.arch-plan :is(.grid-3, .grid-2) { grid-template-columns: 1fr; gap: 0; }
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); align-items: center;
  border: 0; border-top: 1px dashed var(--border-strong); background: none;
  padding: var(--space-8) 0;
}
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card):last-child { border-bottom: 1px dashed var(--border-strong); }
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card):nth-child(even) { direction: rtl; }
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card):nth-child(even) > * { direction: ltr; }
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card) h3 {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.4rem, 2.4vw, 1.95rem); line-height: 1.15;
}
body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card) p { color: var(--text-muted); }
/* Schedule of accommodation: label left, detail right, ruled. */
body.arch-plan .faq-item { border: 0; border-bottom: 1px dashed var(--border); background: none; border-radius: 0; padding-block: var(--space-4); }
@media (max-width: 760px) {
  body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card) { grid-template-columns: 1fr; gap: var(--space-4); }
  body.arch-plan :is(.grid-3, .grid-2) > :is(.feature, .card):nth-child(even) { direction: ltr; }
}`;

/** document — seo. A reference document with a citation margin. */
const document_ = `
/* Authority in AI search is a citation problem, so the page is set as a
   reference document: numbered clauses with the reference living in the
   margin, the way a standard or a paper is typeset. */
body.arch-document :is(.grid-3, .grid-2) { grid-template-columns: 1fr; gap: var(--space-7); counter-reset: clause; max-width: 76ch; margin-inline: auto; }
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: grid; grid-template-columns: 6ch 1fr; gap: var(--space-5);
  border: 0; background: none; padding: 0 0 var(--space-5);
  border-bottom: 1px solid var(--border);
}
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card)::before {
  counter-increment: clause; content: "[" counter(clause) "]";
  font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent);
  padding-top: 0.35em;
}
/* Every child goes in column two. The ::before number is itself a grid item,
   so with two columns and three items the THIRD (the paragraph) wrapped back
   into the 6ch number column and rendered one word per line. */
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card) > * { grid-column: 2; }
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card)::before { grid-column: 1; grid-row: 1; }
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card) h3 { font-size: var(--fs-md); margin-bottom: var(--space-2); }
body.arch-document :is(.grid-3, .grid-2) > :is(.feature, .card) p { color: var(--text-muted); }
/* Footnotes, not an accordion of cards. */
body.arch-document .faq-list { counter-reset: note; }
body.arch-document .faq-item { border: 0; border-top: 1px solid var(--border); background: none; border-radius: 0; }
body.arch-document .faq-question::before {
  counter-increment: note; content: counter(note) ". ";
  font-family: var(--font-mono); color: var(--accent);
}`;

/** board — freelance. A workspace of columns, not a brochure. */
const board = `
/* An agency workspace looks like a board, so the section is columns of stacked
   cards with a ruled column head — the surface the product actually is. */
body.arch-board :is(.grid-3, .grid-2) { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-5); align-items: start; }
body.arch-board :is(.grid-3, .grid-2) > :is(.feature, .card) {
  display: block; background: var(--surface); border: 1px solid var(--border);
  border-top: 3px solid var(--accent); border-radius: var(--r-md);
  padding: var(--space-5); box-shadow: var(--shadow-1);
}
body.arch-board :is(.grid-3, .grid-2) > :is(.feature, .card) h3 {
  font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--space-3);
  padding-bottom: var(--space-2); border-bottom: 1px solid var(--border);
}
body.arch-board :is(.grid-3, .grid-2) > :is(.feature, .card) p { font-size: var(--fs-sm); color: var(--text-muted); }
/* A checklist, which is what a workspace FAQ actually is. */
body.arch-board .faq-item { border: 1px solid var(--border); border-radius: var(--r-md); background: var(--surface); margin-bottom: var(--space-3); }
body.arch-board .faq-question::before {
  content: "\\2713"; display: inline-grid; place-items: center;
  width: 1.1em; height: 1.1em; margin-right: 0.55em; border-radius: 4px;
  font-size: 0.7em; color: var(--accent); border: 1px solid var(--accent);
}`;

export const archetypeCss = {
  gallery,
  stream,
  instrument,
  nodal,
  plan,
  document: document_,
  board,
};

/** Every archetype, for the generator and the tests. */
export const archetypeNames = Object.keys(archetypeCss);

export function buildArchetypeCss(archetypes) {
  const wanted = [...new Set(archetypes)];
  const missing = wanted.filter((a) => !archetypeCss[a]);
  if (missing.length) throw new Error(`no CSS for archetype(s): ${missing.join(', ')}`);
  return [
    '',
    '/* ── page architectures ──────────────────────────────────────────────',
    ' * Each engine re-composes the SAME four beats — hero, feature grid,',
    ' * CTA band, FAQ — into a different structure. Scoped to body.arch-<name>.',
    ' * See lib/archetypes.mjs for why this is a stylesheet and not seven',
    ' * hand-written page templates.',
    ' */',
    ...wanted.map((a) => archetypeCss[a]),
    '',
  ].join('\n');
}
