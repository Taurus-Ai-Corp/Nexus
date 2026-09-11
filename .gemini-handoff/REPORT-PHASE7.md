# REPORT — Phase 7: Critique Remediation & Second Opinion

**Date:** 2026-09-11  
**Author:** Gemini (Autonomous Pair Programmer)  
**Target:** Claude Opus 5 & Taurus AI Corp. Leadership  
**Branch:** `feat/nexus-core-organic-design-system`  
**Test Suite Status:** **395 / 395 passing across 3 consecutive runs** (0 failures, 0 flakes)

---

## 1. Adversarial Second Opinion (§1)

Verdicts on Claude Opus 5's five work items from today, verified by re-derivation and simulation rather than notes.

| # | Item / Claim | Verdict | File & Line | Summary Finding |
|---|---|---|---|---|
| 1 | Manifest collision fix (`73aa384`) | **CONFIRMED** | `platform/scripts/build-pages.mjs:640-653`<br>`platform/tests/video-manifest.test.js:32-47` | Derivation verified: `build-pages.mjs` reads `.poster` specifically from `manifest.json`. Writing derivatives to `renditions.json` preserves the build contract. Clobber simulation in `tests/video-manifest.test.js` failed 2 assertions as expected. |
| 2 | `.assetsignore` completeness (`5a09999`) | **CONFIRMED** | `platform/.assetsignore:1-7`<br>`platform/scripts/check-pages-limits.mjs:30-45`<br>`platform/tests/assetsignore-parity.test.js:1-60` | Zero runtime references: grep across `platform/` confirmed neither `package.json`, `package-lock.json`, nor `scripts/` are referenced by any shipping client script or asset loader. The Wrangler `.git` exception in parity test is sound. |
| 3 | Ambient hero wiring & shader fallback (`7e1bbf5`) | **CONTRADICTED** | `platform/assets/js/video-hero.js:19,25,212`<br>`platform/assets/js/hero-gradient.js:1-120` | **Unreachable & Defective Fallback:** All 8 `ENGINE_VIDEOS` keys are populated in `video-hero.js:25-34`, making line `:212` (`if (!ENGINE_VIDEOS[key]) return createGradientLayer(...)`) dead code. More critically, `createGradientLayer` inside `hero-gradient.js` initializes WebGL (`gl = canvas.getContext('webgl')`). If WebGL is absent, the shader *also fails*. A video element with an image poster requires **no WebGL at all** (rendered via 2D compositor). The shader *cannot* serve as a WebGL-absent fallback. **Recommendation:** Drop the static import `import { createGradientLayer } from './hero-gradient.js'` at `video-hero.js:19` to eliminate ~120 lines of dead WebGL code on every page. |
| 4 | Scrim tint mapping & contrast maths | **CONFIRMED** *(with critical caveat)* | `platform/assets/js/hero-gradient.js:40`<br>`platform/assets/css/design-system.css:561`<br>`platform/lib/tokens.mjs:31` | Re-derived WCAG math confirms `--text` (`#17150F`, luminance 0.015) clears 10.8:1 (measures 12.10:1–15.62:1). **HOWEVER**, `--text-dim` (`#8A8375`, luminance 0.224) measures only 2.49:1–2.78:1 on scrim and **3.08:1 on `#EDE8DE` paper**, failing WCAG AA (4.5:1) sitewide in light mode today. Remediation detailed in Task B. |
| 5 | Phase 5 value vs cost analysis | **CONFIRMED** *(lateral visually, superior for CWV)* | `platform/scripts/build-pages.mjs:645`<br>`platform/assets/video/manifest.json:5-10` | Visually, the video is rendered at 20–34% through a 66–80% scrim, acting as an abstract wash similar to the shader. However, **First Contentful Paint / LCP** strongly favors the video architecture: the 11.7 KB WebP poster is preloaded via `<link rel="preload" as="image" fetchpriority="high">` in `<head>` and renders on frame 1 before ANY JavaScript runs. The WebGL shader cannot paint until JS parses, compiles shaders, and boots WebGL. Reverting to shader would degrade Core Web Vitals. |

---

## 2. Task A — GEO / AEO / Schema.org Implementation (§3)

Neormeo Authority promises automated Schema.org JSON-LD and LLM search optimization. The site previously scored **8/25 on SEO** with zero JSON-LD and a soft-404 on `/llms.txt`. All requirements are now delivered and verified.

### Deliverables & Changes

1. **Automated Schema.org JSON-LD in `platform/scripts/build-pages.mjs`**:
   - Single source of truth driven by `PAGES_CONFIG` and `FAQS_DATA`.
   - Injected into `<head>` as `<script type="application/ld+json" id="schema-org">` using standard `@graph` syntax.
   - `Organization`: name `NEORM-ERA`, `parentOrganization`: `TAURUS AI Corp.`, `url`, `logo`, `sameAs`, and `addressCountry: "CA"`.
   - `WebSite` + `SearchAction` on `index.html`.
   - `BreadcrumbList` on all non-home pages.
   - `SoftwareApplication` on each of the 7 engine pages with real offer prices ($99, $49, $199, $149, $199, $399, $349).
   - `FAQPage` on Home and all 7 engine pages.
2. **Real `platform/llms.txt`**:
   - Formatted per the LLMs.txt specification (plain text / markdown).
   - Outlines company entity (TAURUS AI Corp., CBCA 1001270625), platform summary, the 7 engines with exact routing, and complete index of real URLs.
   - Configured in `platform/_headers` with `Content-Type: text/plain; charset=utf-8`.
3. **Extractable Answer Content (FAQ Sections)**:
   - Added 4–6 question FAQ blocks to `index.html` and all 7 engine pages (`creative`, `social`, `intel`, `estate`, `seo`, `freelance`, `flow`).
   - Semantic HTML using `<section class="section faq-section" id="faq">`, `<dl class="faq-list">`, `<div class="faq-item">`, `<dt class="faq-question">`, and `<dd class="faq-answer">`.
   - Visible content is strictly synchronized with the `FAQPage` JSON-LD schema.
4. **404 Handling (`platform/404.html`)**:
   - Built `platform/404.html` with skip-link, standard nav, complete 7-engine directory cards, support contact links, and unified footer.
   - Added `404.html` to `PAGES_CONFIG` in `build-pages.mjs`.

### Acceptance Verification Evidence

```bash
# 1. Verify JSON-LD present across all pages
$ node -e "
import('./scripts/build-pages.mjs').then(({ PAGES_CONFIG }) => {
  const fs = require('node:fs');
  for (const p of Object.keys(PAGES_CONFIG)) {
    const has = fs.readFileSync(p, 'utf8').includes('application/ld+json');
    console.log(p.padEnd(24), has ? 'OK' : 'FAIL');
  }
});
"
index.html               OK
about.html               OK
pricing.html             OK
contact.html             OK
case-studies.html        OK
privacy.html             OK
security.html            OK
terms.html               OK
404.html                 OK
creative/index.html      OK
social/index.html        OK
intel/index.html         OK
estate/index.html        OK
seo/index.html           OK
freelance/index.html     OK
flow/index.html          OK

# 2. Verify /llms.txt headers rule
$ grep -A 2 "/llms.txt" platform/_headers
/llms.txt
  Content-Type: text/plain; charset=utf-8

# 3. Dedicated Task A test suite
$ node --test tests/seo-schema.test.js
▶ Task A: Schema.org JSON-LD invariants
  ✔ index.html has valid, parseable Schema.org JSON-LD (1.94ms)
  ✔ about.html has valid, parseable Schema.org JSON-LD (0.35ms)
  ✔ pricing.html has valid, parseable Schema.org JSON-LD (0.48ms)
  ...
  ✔ flow/index.html has valid, parseable Schema.org JSON-LD (0.45ms)
✔ Task A: Schema.org JSON-LD invariants (8.37ms)
▶ Task A: Extractable Answer Content (FAQ HTML blocks)
  ✔ index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.33ms)
  ✔ creative/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.17ms)
  ✔ social/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.66ms)
  ✔ intel/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.12ms)
  ✔ estate/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.36ms)
  ✔ seo/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.11ms)
  ✔ freelance/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.14ms)
  ✔ flow/index.html renders semantic <dl class="faq-list"> with 4-6 questions (0.10ms)
✔ Task A: Extractable Answer Content (FAQ HTML blocks) (2.13ms)
▶ Task A: llms.txt plain text specification
  ✔ platform/llms.txt exists and specifies company and 7 engines (0.46ms)
  ✔ _headers specifies text/plain for /llms.txt (0.22ms)
✔ Task A: llms.txt plain text specification (0.72ms)
▶ Task A & D: 404.html and Canadian jurisdiction
  ✔ platform/404.html exists and links to all seven engines (0.17ms)
  ✔ every page carries the Canadian incorporation legal footer (1.41ms)
✔ Task A & D: 404.html and Canadian jurisdiction (1.65ms)
ℹ pass 28, fail 0
```

---

## 3. Task B — Dark Mode & Token Proposal (§4)

### Implementation in CSS Layer

- Added dark theme overrides to `platform/assets/css/design-system.css` using only CSS variables (zero color literals, zero hex, zero rgba):
  ```css
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: var(--panel);
      --bg-elev: var(--surface-2);
      --surface: var(--surface);
      --surface-2: var(--surface-2);
      --card-hover: var(--surface-2);
      --border: var(--panel-border);
      --border-strong: var(--panel-border);
      --border-control: var(--panel-border);
      --text: var(--panel-text);
      --text-soft: var(--panel-text-2);
      --text-muted: var(--panel-label);
      --text-dim: var(--panel-faint);
    }
  }

  [data-theme="dark"] {
    --bg: var(--panel);
    --bg-elev: var(--surface-2);
    --surface: var(--surface);
    --surface-2: var(--surface-2);
    --card-hover: var(--surface-2);
    --border: var(--panel-border);
    --border-strong: var(--panel-border);
    --border-control: var(--panel-border);
    --text: var(--panel-text);
    --text-soft: var(--panel-text-2);
    --text-muted: var(--panel-label);
    --text-dim: var(--panel-faint);
  }
  ```
- Mirrored byte-identically to `core/design-system/tokens/design-system.css` (`cmp` returns 0).
- Injected `<button class="theme-toggle" id="theme-toggle">` into `renderNav()` and persistence script `<script id="theme-persist">` into `<head>`.

### Contrast Measurement & `--text-dim` Remediation

- **Current Light Mode Failure:** `--text-dim` is `#8A8375` (luminance 0.224). On `--bg` `#EDE8DE` (luminance 0.803), contrast ratio is **3.11:1** (< 4.5:1 AA).
- **Remedy in `tokens.mjs`:** Setting `ink.muted2` to `#5E574B` (luminance 0.096, already defined as `onDark.navKbd`) yields:
  $$\frac{0.803 + 0.05}{0.096 + 0.05} = 5.84:1 \quad (\text{PASSES WCAG AA } \ge 4.5:1)$$
- **Dark Mode Contrast:**
  - `--text`: `#EDE8DE` on `#17150F` = **13.12:1** (AAA)
  - `--text-soft`: `#CFC8BA` on `#17150F` = **9.60:1** (AAA)
  - `--text-muted`: `#A69E90` on `#17150F` = **6.20:1** (AA)
  - `--text-dim`: `#999182` on `#17150F` = **5.15:1** (AA)

### Proposed Diff for `platform/lib/tokens.mjs` (for Claude to apply)

```diff
--- a/platform/lib/tokens.mjs
+++ b/platform/lib/tokens.mjs
@@ -30,2 +30,2 @@
   muted: '#6B6559', // body secondary
-  muted2: '#8A8375', // labels, mono meta (fails AA at 3.08:1 on #EDE8DE)
+  muted2: '#5E574B', // labels, mono meta — fitted to 5.84:1 on #EDE8DE (AA compliant)
   faint: '#B9B2A3', // axis labels, disabled
```

---

## 4. Task C — Social Proof & Mobile Nav Fix (§5)

### C1. Surfacing Social Proof

Pulled hard-number results from `case-studies.html` onto `/` and `/pricing.html` directly adjacent to primary conversion CTAs:
- **`2.3×`** — Projected CTR uplift *(Luxury F&B Chain)*
- **`+41%`** — Verified leads *(Retail Boutique)*
- **`−23%`** — Lower CPL *(Social Pilot)*
- **`POC → $399/mo`** — Closed in 48 hours *(Agency Audit)*
- Preserved the term *projected* verbatim; kept clients anonymized with vertical attribution.

### C2. Mobile Nav Overflow Fix

- Root cause: `.nav-cta .btn` on narrow viewports forced `.nav-inner` to overflow 88px–95px, pushing `.nav-toggle` off-screen (x=423–469px).
- Remedy in `design-system.css:204`:
  ```css
  @media (max-width: 480px) {
    .nav-cta .btn { display: none; }
    .brand small { display: none; }
  }
  ```
- Measured using Playwright Chromium with explicit viewport bounding boxes:

```
=== VIEWPORT 375px ===
/            overflow: 0px, toggle: [311, 351], inViewport: true
/creative/   overflow: 0px, toggle: [311, 351], inViewport: true
/social/     overflow: 0px, toggle: [311, 351], inViewport: true
/intel/      overflow: 0px, toggle: [311, 351], inViewport: true
/estate/     overflow: 0px, toggle: [311, 351], inViewport: true
/seo/        overflow: 0px, toggle: [311, 351], inViewport: true
/freelance/  overflow: 0px, toggle: [311, 351], inViewport: true
/flow/       overflow: 0px, toggle: [311, 351], inViewport: true

=== VIEWPORT 390px ===
/            overflow: 0px, toggle: [326, 366], inViewport: true
/creative/   overflow: 0px, toggle: [326, 366], inViewport: true
/social/     overflow: 0px, toggle: [326, 366], inViewport: true
/intel/      overflow: 0px, toggle: [326, 366], inViewport: true
/estate/     overflow: 0px, toggle: [326, 366], inViewport: true
/seo/        overflow: 0px, toggle: [326, 366], inViewport: true
/freelance/  overflow: 0px, toggle: [326, 366], inViewport: true
/flow/       overflow: 0px, toggle: [326, 366], inViewport: true
```
**`scrollWidth - clientWidth === 0`** on all 8 pages; `.nav-toggle` bounding box is strictly within viewport.

---

## 5. Task D — Pricing SKU Reconciliation & Canadian Jurisdiction (§6)

### D1. 16 Pricing SKUs Inventory

| # | Product Surface | Plan / SKU Name | Quoted Price | Scope & Limits |
|---|---|---|---|---|
| 1 | Platform Plans (top grid) | Starter Sprint | $49 / mo | 1 engine, 1 brand, 30 generations/mo, 1 seat |
| 2 | Platform Plans (top grid) | Pro Growth | $199 / mo | 3 engines, Neormintel predictive ROAS, 250 gen, 3 seats |
| 3 | Platform Plans (top grid) | Real Estate Pro | $349 / mo | Neormestate listing suite, MLS ingest, 9:16 tours |
| 4 | Platform Plans (top grid) | Agency Accelerator | $799 / mo | All 7 engines, Neormence white-label portal, unlimited seats |
| 5 | Neormedia (grid 2 & Home) | Starter | AED 299 / mo (~$81 USD / ₹6,999 INR) | 2 channels, 8 posts/mo, GBP sync, basic analytics |
| 6 | Neormedia (grid 2 & Home) | Growth | AED 599 / mo (~$163 USD / ₹13,999 INR) | 4 channels + WhatsApp + GBP, 20 AI posts, CPL dashboard |
| 7 | Neormedia (grid 2) | Pro | AED 1,199 / mo (~$326 USD / ₹27,999 INR) | 6 channels, unlimited posts, multi-location, white-glove |
| 8 | Neormative (grid 3 & Landing)| Starter | $99 / mo | 10 campaign kits/mo, 2 revisions each, <24h delivery |
| 9 | Neormative (grid 3 & Home) | Enterprise | $399 / mo | Unlimited concepts, photorealistic images, brand memory, API |
| 10 | Neormative (grid 3 & Home) | Custom / Agency | $1,500+ / mo | White-label delivery, dedicated tuning, API, account manager |
| 11 | Neormintel (grid 4) | Growth | AED 199 / mo (~$54 USD) | 3 data sources, lead + CPL dashboard, weekly email report |
| 12 | Neormintel (grid 4) | Pro | AED 499 / mo (~$136 USD) | Unlimited sources, AI-search monitoring, board-ready PDF reports |
| 13 | Neormintel (grid 4) | Enterprise | Custom | Custom data warehouse sync, SSO, SLA, dedicated manager |
| 14 | Neormence (grid 5) | Basic | Free (Request Access) | Playground + presets, HuggingFace free models, 5 exports/mo |
| 15 | Neormence (grid 5) | Studio | $49 / seat / mo | Premium Vertex AI Imagen 3, unlimited exports, project folders |
| 16 | Neormence (grid 5) | Agency Pack | Custom | Bulk seats, brand presets, admin usage analytics, custom targets |

### Canonical Pricing Proposal for Owner Decision

**Problem:** Visitors seeing AED 299 / AED 599 on Home cannot reconcile with the $49 / $199 / $349 / $799 grid on `/pricing.html`. Stacking five grids reusing names ("Starter", "Growth", "Pro") at completely different price points creates severe friction.

**Proposed 3-Tier Canonical Matrix (with Currency Toggle):**
1. **Tier 1: Starter** — **$49 / mo (AED 179 / mo / ₹3,999 / mo)**
   - Entry point: 1 engine (Neormative 10 kits OR Neormedia 8 posts + GBP), 1 seat.
2. **Tier 2: Growth** — **$199 / mo (AED 729 / mo / ₹15,999 / mo)**
   - Growth stack: 3 engines (Creative + Social + Intel ROAS attribution), 3 seats, WhatsApp agent.
3. **Tier 3: Studio / Pro** — **$399 / mo (AED 1,469 / mo / ₹32,999 / mo)**
   - High velocity: Unlimited creative concepts, Neormestate video tours, brand memory, white-label client portal.
4. **Custom: Agency & Enterprise** — **From $1,500 / mo**
   - All 7 engines, unlimited seats, custom AI model tuning, dedicated account manager.

### D2. Canadian Corporate Jurisdiction

- Added canonical Canadian corporate legal footer via `build-pages.mjs` across all 16 pages:
  `© 2026 TAURUS AI Corp. (Canada CBCA 1001270625). All rights reserved. Serving worldwide.`
- Added `parentOrganization` with `addressCountry: "CA"` in Schema.org JSON-LD graph.
- Preserved market-facing regional go-to-market copy (UAE / GCC / India) while establishing legal parental contracting authority in Canada.

---

## 6. Test Suite Stability (3 Consecutive Runs)

Because of the known disk-write flake in `deploy-safety.test.js:180`, `npm test` was executed 3 times consecutively on the modified working tree.

```
Run 1: ℹ tests 395, suites 36, pass 395, fail 0 (7278ms)
Run 2: ℹ tests 395, suites 36, pass 395, fail 0 (7242ms)
Run 3: ℹ tests 395, suites 36, pass 395, fail 0 (7220ms)
```
**Zero test failures across all 3 runs.**

---

## 7. Things Caught / Corrections to Instructions

1. **Shader Fallback Claim (§1 Item 3):** Claude stated the shader was retained as a "WebGL-absent fallback". Re-derivation proved `hero-gradient.js` requires WebGL itself. Video + poster requires no WebGL. Retaining the shader import on that premise is technically incorrect; it is dead code and should be removed.
2. **Regex Cross-Tag Matching in `build-pages.mjs`:** An initial regex `/^[ \t]*<script>[\s\S]*?localStorage.../m` crossed preceding script tags (including Google Analytics `gtag.js` and video poster preloads), corrupting `<head>` during idempotent test passes. Corrected by tagging the theme script with `id="theme-persist"` and using strict non-crossing regex `(?:(?!<\/script>)[\s\S])*?`.

---

## 8. Explicit Boundaries Respected

- **Git operations:** 0 commits, 0 pushes, 0 deployments. All changes remain staged/unstaged in the working tree.
- **Serverless budget:** `platform/api/` was **not touched** (remains at exactly 12 functions).
- **Token files:** `platform/lib/tokens.mjs` was **not edited**; token diff is presented above for Claude to apply.
- **Workflows:** `.github/workflows/` was **not touched**.
- **Mirror parity:** `core/design-system/tokens/design-system.css` matches `platform/assets/css/design-system.css` byte-for-byte.

<!-- GOAL_COMPLETE -->
