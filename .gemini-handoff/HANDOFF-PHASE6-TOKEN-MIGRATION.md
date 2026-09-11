# Handoff to Gemini — Phase 6: migrate the literals onto the token scales

**From:** Claude Opus 5 · **Date:** 2026-09-11 · Runs **in parallel with Phase 5**, different files.

This is the bulk mechanical half of the design-system work, and it is deliberately yours: it is
~200 discrete substitutions across one large file, each individually trivial and collectively
tedious. Claude built the scales; you move the code onto them.

---

## 0. Rules

Same as before: **no commits, no pushes, no deploys.** Never edit `assets/css/tokens.css` — it is
generated from `lib/tokens.mjs`. Run `npm run tokens` after any token change.

**Every change must be a no-op visually.** This is a refactor, not a redesign. If a substitution
would change a rendered pixel, do not make it — record it in the report instead.

---

## 1. What exists now

`lib/tokens.mjs` gained 47 tokens on 2026-09-10/11 (`c31eb9e`, `c5c1b40`). 138 total:

| Group | Tokens |
|---|---|
| Spacing | `--space-1..12` → 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120px |
| Type | `--fs-2xs xs sm base md lg` + fluid `--fs-h1 h2 h3 lead` |
| Line height | `--lh-display body lead prose loose` → 1.05, 1.6, 1.65, 1.7, 1.75 |
| Tracking | `--tracking-tighter tight snug normal wide wider caps label label-wide eyebrow` |
| Motion | `--dur-instant fast base slow slower ambient` + `--ease-smooth` |
| Engine accents | all seven `--vertical-*` now exist |

## 2. The job

In `assets/css/design-system.css`, replace raw literals with the tokens above.

**Spacing.** 28 distinct px values are in use. The ones that map exactly (4, 8, 12, 16, 20, 24, 32,
40, 48, 64, 80, 120) become `var(--space-N)` mechanically. The stragglers — **2, 5, 6, 10, 14, 18,
22, 26, 28, 30, 36, 56, 60, 70, 110, 130, 150** — do **not** map. Do not round them onto the grid;
that changes the design. Leave them and list them in your report so a human can decide.

**Type.** ~40 bare `font-size` values. The four `clamp()` expressions on `h1/h2/h3/.lead` are now
`--fs-h1/h2/h3/lead` verbatim — substitute those first, they are exact. For the rest, substitute
only exact matches (`0.78rem` → `var(--fs-xs)`); leave near-misses alone and report them.

**Motion.** Eleven durations for perhaps four intents. `.08s`→`--dur-instant`, `.16s`→`--dur-fast`,
`.25s`→`--dur-base`, `.32s`→`--dur-slow`, `.8s`→`--dur-slower`, `1.1s`→`--dur-ambient`.
`.18s`, `.2s`, `.24s`, `.3s`, `.7s` have no exact token — **report, do not round.** Rounding motion
is where a refactor silently becomes a redesign.

**Engine accents.** `estate`, `seo` and `flow` have accents for the first time. Apply them the way
the other four already are — hairlines, badges, metric cards — on `/estate/`, `/seo/`, `/flow/`.
This is the only part of Phase 6 that is design work rather than substitution, and the only part
that should change a pixel. Keep it restrained; Direction A is flat chrome, 4–14px radii,
hairline `--glow`, **no gradients**.

## 2b. FIRST — fix the idempotency defect in your own build script

`scripts/build-pages.mjs` is **not idempotent**. Measured 2026-09-11: every
`npm run build` adds two more spaces of indentation to `<nav>` and `<footer>`, without bound.

    build #1  nav indent 10 chars, footer 8
    build #2               12              10
    build #3               14              12

Rendering is unaffected — HTML ignores the whitespace — and the nav/footer shasum proof still
returns 1, because every page drifts by the same amount. That is exactly why nothing caught it,
and it is the more useful lesson: a proof that all files match does not prove any of them is
*correct*.

A generator you cannot safely run twice is a trap: anyone running `npm run build` in a loop, or
twice before committing, silently bloats all 15 pages. Fix this before Phase 6 proper, because
Phase 6 will have you running the build repeatedly.

There is a comment marking the offending block in the file. **Add a test that runs the build
twice and asserts the second run is a byte-for-byte no-op** — and confirm it goes red against the
current code before you fix it.

## 3. Constraints that will bite

- **`design-tokens.test.js` forbids any colour literal in `design-system.css`** — no hex, no
  `rgba()`, no gradient functions. Colours go in `lib/tokens.mjs` and come back as `var()`.
- **`core/design-system/tokens/design-system.css` is a byte-identical mirror.** `deploy-safety.test.js:27`
  compares them. Any edit to one must be copied to the other, or the suite goes red.
- **`.nav-dropdown*` and `.meet-*` rules must keep existing** even though no page uses them —
  `deploy-safety.test.js:21` requires it.
- **Do not touch `assets/js/`.** Claude is working there (single frame loop, `d0218b0`). Phase 5
  touches `scripts/build-pages.mjs` and `assets/video/`. Stay in CSS and the token source.

## 4. Verify

```bash
cd platform
npm run tokens && npm test          # baseline 346 — must not fall
grep -cE '#[0-9a-fA-F]{3,8}|rgba?\(' assets/css/design-system.css   # must stay 0
```

**Then prove it is a no-op.** Screenshot all 15 pages at 1440px and 390px *before* you start and
again after, and diff them. A pixel diff is the only real evidence that a 200-substitution refactor
changed nothing. Any page that differs, explain why — or revert that substitution.

## 5. Report → `.gemini-handoff/REPORT-PHASE6.md`

Defects first, as always. Plus:

- **Count of substitutions made**, per category.
- **The full list of values you did NOT migrate**, with the reason (no exact token). This list is
  the deliverable that tells us whether the scales need extending — it is more valuable than the
  substitutions themselves.
- **Before/after screenshot diff result** for all 15 pages. State the pixel delta, not "looks fine".
- Any place the token made the CSS *worse* to read. `var(--space-3)` is not automatically better
  than `12px`; if a rule reads worse, say so.
