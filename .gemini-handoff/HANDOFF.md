# Handoff to Gemini — NEORM-ERA platform, Phases 2 and 4

**From:** Claude Opus 5 · **Date:** 2026-09-10 · **Repo:** `Taurus-Ai-Corp/Nexus`
**Working dir:** `/Users/taurus_ai/Documents/NEXUS-CORE/platform`
**Branch:** `feat/nexus-core-organic-design-system` (already checked out)

You own **Phase 2** and **Phase 4**. Claude owns Phases 1 and 3, all commits, and all deploys.
Read the whole of this file before touching anything. Do not skim.

---

## 0. Rules that override anything else you conclude

1. **Do not run `git commit`, `git push`, `vercel`, or `wrangler`.** Leave your work in the
   working tree. Claude reviews, commits and deploys. Breaking this can take the live site down.
2. **Do not edit `platform/assets/css/tokens.css`.** It is generated from `platform/lib/tokens.mjs`.
   Edit the source and run `npm run tokens`.
3. **Do not add any file under `platform/api/`.** It is at exactly 12 functions, the Vercel Hobby
   hard cap, zero headroom. `deploy-safety.test.js` enforces it. `platform/lib/*.mjs` is not counted.
4. **Do not rename engine slugs.** `/creative/ /social/ /intel/ /flow/ /estate/ /seo/ /freelance/`
   are frozen pre-rebrand routes. The *brands* changed; the URLs deliberately did not.
5. **Do not touch `platform/prototype/`.** Throwaway A/B prototypes, excluded from tests.
6. **Never write a test that cannot fail.** Before you keep an assertion, break the thing it
   guards on purpose and confirm the test goes red. This repo has shipped three vacuous tests;
   one asserted a string was present in HTML while the feature had never executed on any page.

---

## 1. What is ALREADY DONE — do not redo any of it

The plan you were given has a stale baseline. All of this is finished and committed:

| Item | Status |
|---|---|
| Test suite "291/293 → 293/293" | **302/302 green already.** Your baseline is 302, not 293 |
| 4 `rgba()` scrims moved into tokens | Done. They are `--scrim-media-cool/warm/none/procedural` |
| `core/design-system/tokens/` mirror | Done, byte-identical |
| Envato preview videos purged | Done — 49 files, not 8. `platform/video/` no longer exists |
| `creative/index.html` `<h3>…</span>` | Does not exist. Nothing to fix |
| Spacing / type / motion token scales | **Done by Claude today** (`c31eb9e`). 135 tokens available |

**Do NOT add `--scrim-cool`, `--scrim-warm`, `--scrim-none`, `--scrim-procedural`.** Those names
would duplicate the four `--scrim-media-*` tokens that already exist and create exactly the drift
the token file was built to prevent.

**Tokens you now have and should use** instead of writing literals:
`--space-1..12` (4px grid), `--fs-2xs|xs|sm|base|md|lg|h1|h2|h3|lead`,
`--lh-display|body|lead|prose|loose`, `--tracking-*`,
`--dur-instant|fast|base|slow|slower|ambient`, `--ease`, `--ease-smooth`.

---

## 2. PHASE 2 — kill the copy-paste substrate

**Problem.** 29 HTML files carry hand-copied chrome: **17 distinct `<nav>` byte-forms** and
**12 distinct `<footer>` forms**. They differ only in whitespace, link order, the brand lockup
text and the CTA label. Every fix therefore has to be made 29 times, and never is.

**Build** `platform/scripts/build-pages.mjs` — a plain Node ESM script (the repo is
`"type": "module"`, no framework, no bundler) that injects `nav` / `footer` / `head` partials into
each page from a per-page data object: brand stem, CTA label, engine slug, title, description.

Add to `platform/package.json`:
```json
"build": "npm run tokens && node scripts/build-pages.mjs"
```

**Client-side injection is rejected** — do not propose it. Nav and footer would be absent for
crawlers, and `site-integrity.test.js` asserts against file contents, not the rendered DOM.

**The generated markup MUST preserve these shapes.** They are pinned by tests; changing them
turns the suite red:
- `<div class="container nav-inner">` containing `.nav-cta`
- `.nav-links` with unique `href`s (no duplicates)
- footer linking all seven engines, each named **exactly once**
- brand lockup exactly `<span>Name <small>by Taurus AI</small></span>`
- `.nav-dropdown`, `.nav-dropdown-panel`, `.nav-caret`, `.meet-grid` CSS must continue to exist
  in `design-system.css` — `deploy-safety.test.js:21` requires it even though no page uses it

**Also add here, in the template — not in Phase 4:** a `<main>` landmark (only **1** of 29 files
has one today) and a skip link. Accessibility belongs in the shared chrome.

**Done when:**
```bash
cd platform
for f in $(find . -name '*.html' -not -path './node_modules/*' -not -path './prototype/*'); do
  sed -n '/<nav/,/<\/nav>/p' "$f" | shasum
done | awk '{print $1}' | sort -u | wc -l
# must print 1   (prints 17 today)
```
Repeat for `<footer>` — must print 1 (prints 12 today).

---

## 3. PHASE 4 — correctness

**Ordering matters: do Phase 2 first.** Phase 2 *generates* these files. If you hand-edit them
first, Phase 2 overwrites your work. Every fix below belongs in the templates or the per-page
data object, not in generated output.

| Defect | Detail |
|---|---|
| `Neorm-Era` casing | **37 occurrences across 19 files.** Correct form is `NEORM-ERA`. **Add a test** — nothing catches this today |
| `about.html` stale | Headline "Five products. One core." → seven engines. Its 5 cards still use pre-rebrand words (`Social`, `Creative`, `Intel`, `Freelance`). Two cards share `reveal d2`, so their stagger collides |
| `pricing.html` markup | `page-header` and the first pricing section are mis-nested into each other |
| `pricing.html` styling | `.amount` and `.per` have **no CSS rule at all** — four headline plan prices render unstyled |
| `sitemap.xml` | Omits `/estate/` and `/seo/` |
| Analytics | gtag is the literal `G-PLACEHOLDER` on **12** pages — it collects nothing. `flow` has no gtag at all |
| Social images | All seven `og:image` files are **missing from disk**; every share is imageless. `estate`/`seo` also lack favicon |

**Correct engine names** (two-part: indivisible coined stem + descriptor):
Neormative *Ads* · Neormedia *Sync* · Neormintel *Data* · Neormestra *Flow* ·
Neormestate *Reels* · Neormeo *Authority* · Neormence *Studio*.
Never `NEORM-ERA|Engine`, never `Neorm-Era`, never the old `Nexus <X>` names.

**Copy must stay honest about product status.** Only Neormative and Neormedia actually ship.
Do not write marketing copy implying the other five are live.

**A caching trap:** `/assets/*` is served `immutable, max-age=31536000` with no hash in the
filename. New CSS at the same path is invisible to returning visitors. That header lives in
**both** `vercel.json` and `_headers` and is asserted value-for-value by three test files — if
you change one you must change the other.

---

## 4. Verify before you hand back

```bash
cd /Users/taurus_ai/Documents/NEXUS-CORE/platform
npm run tokens
npm test                 # baseline 302 — expect it to RISE, never fall
npx serve . -p 3000      # then look at the pages
```

**The test count moves with the file set.** `brand.test.js` syntax-checks every `.js`/`.mjs` under
`platform/`, and `site-integrity.test.js` generates per-page tests by walking the tree. If the
count changes, check what files appeared or vanished **before** suspecting a regression. A stray
duplicate HTML file once added 31 phantom tests.

**Look at every page you touch, at 1440px and 390px.** Not a sample. This repo has twice had a
fully green suite while pages rendered blank or unstyled. Screenshots or it did not happen.

Known pre-existing issue, not yours to fix and not a regression you caused: `/` overflows
horizontally by **73px at 390px**, and `/pricing.html` by 16px.

---

## 5. What to hand back — required format

Write your report to `.gemini-handoff/REPORT.md`. **Defects before achievements.** If a section
is empty, write "none" — do not omit it.

```markdown
# Gemini report — Phases 2 & 4 — <date>

## 1. What I did NOT do
Anything you skipped, could not finish, or deliberately left. This section first, always.

## 2. Defects I introduced or found and did not fix
Include anything you are unsure about. An unreported defect costs far more than an admitted one.

## 3. Files changed
Path + one line on why. Flag any file you touched that is NOT in the two phases above.

## 4. Phase 2 proof
Paste the actual terminal output of the nav shasum command and the footer one.
Both must print 1. If they do not, say so — do not describe intent.

## 5. Phase 4 proof
- `grep -rc 'Neorm-Era' --include='*.html' . | grep -v ':0'`  → paste output (expect empty)
- confirm `.amount` / `.per` now have CSS rules
- confirm `/estate/` and `/seo/` are in sitemap.xml

## 6. Test result
Paste the tail of `npm test`. State the count and whether it rose or fell versus 302.
If it fell, that is a regression — say so plainly at the top of section 2.

## 7. New tests, and proof they can fail
For each test you added: what it guards, and what you saw when you deliberately broke it.
A test you did not break is a test you cannot vouch for.

## 8. Screenshots
Paths to 1440px and 390px captures for every page you touched. List them.

## 9. Questions / decisions I had to make
Anything you guessed at. Especially anything where the spec was ambiguous or self-contradictory.
```

**Do not commit. Do not deploy. Do not push.** Leave everything in the working tree and stop.
