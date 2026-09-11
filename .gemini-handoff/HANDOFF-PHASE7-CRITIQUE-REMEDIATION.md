# Handoff to Gemini — Phase 7: critique remediation + second opinion

**Written 2026-09-11 by Claude Opus 5.** Read this whole file before touching anything.
Phases 2, 4, 5 and 6 were executed from this directory and the format has worked; this
follows it.

Two jobs, in this order:

1. **A second opinion on my work** (§1). Adversarial. I want to be caught.
2. **Four remediation tasks** (§3–§6) from a five-agent critique of the live site.

You commit nothing, push nothing, deploy nothing. Leave changes in the working tree and
write `.gemini-handoff/REPORT-PHASE7.md`.

---

## 0. State of the world — verified 2026-09-11, do not re-derive

| Fact | Value |
|---|---|
| Branch | `feat/nexus-core-organic-design-system`, pushed, clean |
| Test suite | **359/359**, but see the landmine below |
| Production | `6ed592c` — **8 commits behind**. The live site is NOT this repo. |
| Deploy | blocked: 4 GitHub secrets unset (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) |
| Critique score | **48/100** — Design 17, Content 16, SEO 8, Conversion 7 (Security 19, separate) |

### Landmines — each of these has already cost real time

- **The test suite is intermittently red.** 1 failure observed in 13 runs.
  `tests/deploy-safety.test.js:180` writes to the real `platform/*.html` while other test
  files read them concurrently. **A single green run is not proof.** Run `npm test` three
  times before claiming green, and say so in your report.
- **`platform/api/` is at exactly 12 functions** — the Vercel Hobby cap, zero headroom.
  `deploy-safety.test.js` counts **recursively** (`api/campaigns/index.js`,
  `api/omni/brief.js`, `api/omni/ingest.js` are 3 of the 12). New server code goes in
  `platform/lib/`, which is not counted.
- **Never edit `platform/assets/css/tokens.css`.** It is generated from
  `platform/lib/tokens.mjs` by `npm run tokens`. `design-tokens.test.js` asserts the
  committed file matches source.
- **`design-system.css` has a byte-identical mirror** at
  `core/design-system/tokens/design-system.css`. Change one, copy to the other, or
  `deploy-safety.test.js` fails.
- **`design-system.css` must contain zero colour literals.** No `#hex`, no `rgba(`.
  Everything through `var(--token)`.
- **`.assetsignore` and `scripts/check-pages-limits.mjs` must agree.**
  `tests/assetsignore-parity.test.js` enforces it in both directions.
- **Headless Chromium has no WebGL by default**, so the hero renders blank and you will
  file a false bug. Launch with
  `['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']`.
- **Scroll with `behavior:'instant'`.** Smooth scrolling swallows IntersectionObserver
  callbacks and makes working sections read as blank.
- **A 200 status proves nothing on this site.** It soft-404s: every missing URL returns
  200 with the homepage HTML. **Check `content-type`, not status.** This is exactly how I
  wrongly reported the og:images as working.

---

## 1. SECOND OPINION — try to prove me wrong

Everything below is work I did today. Verify by re-deriving, not by reading my notes.
**A finding that I was wrong is worth more to me than a clean bill of health.**

1. **`73aa384` — the manifest collision fix.** I changed the media workflow to write
   `assets/video/renditions.json` instead of overwriting `assets/video/manifest.json`,
   because `scripts/build-pages.mjs:308` reads `.poster` from the latter. Check I did not
   break the pipeline's own contract, and that `tests/video-manifest.test.js` actually
   fails when the clobber is simulated.
2. **`5a09999` — `.assetsignore`.** I added `scripts`, `package.json`, `package-lock.json`,
   `.assetsignore`. Confirm nothing shipping needs any of them at runtime, and that the
   parity test's `.git` exception is sound.
3. **`7e1bbf5` — the ambient hero wiring.** I populated all 8 `ENGINE_VIDEOS` keys, which
   makes `createGradientLayer` unreachable. `hero-gradient.js` is still statically imported
   at `video-hero.js:19` and now ships as dead code to every hero page, and the comments at
   `:25` and `:212` say "which is every engine today" — the opposite of the truth.
   **Decide and tell me**: is the shader still needed as a WebGL-absent fallback (in which
   case it must be reachable), or should the import be dropped? Do not change it — argue it.
4. **The scrim tint mapping.** I assigned warm/cool/none per engine by mirroring
   `PALETTES` in `hero-gradient.js:40`. Check the contrast maths: I measured
   `--text` at ≥10.8:1 on every scrim and `--text-dim` at 2.23–2.62:1. Re-measure.
5. **The biggest one — is Phase 5 worth its cost?** The design critic called the hero a
   "soft amorphous colour wash," the gradient-blob trope. I measured our replacement:
   `YAVG` 169.6–174.2 across 108 frames, shown at 20–34% through the scrim. It is *also* an
   abstract wash — but it costs 337 KB + video decode where the shader cost ~5 KB.
   **Argue the case that Phase 5 was a lateral move and we should revert to the shader.**
   I think licensing forced our hand, not craft. Tell me if I am wrong about that.

Write your verdict per item as CONFIRMED / CONTRADICTED / NEEDS-EVIDENCE with file:line.

---

## 2. Division of labour — why these four and not others

You get the tasks that are **high-volume, mechanically specified, and reversible**.
I keep deploys, security headers, design tokens, billing and the credit ledger — the
irreversible or judgement-heavy work. The owner keeps secrets and naming decisions.

**Not yours, do not touch:** `platform/lib/tokens.mjs`, `platform/api/**`,
`platform/lib/stripe-client.mjs`, `.github/workflows/**`, anything under
`01-CORE-PLATFORM/`.

---

## 3. TASK A — make the site pass its own product's test (highest value)

**The finding:** `Neormeo Authority` sells GEO/AEO — it promises to "inject Schema.org
JSON-LD automatically" and "optimise for ChatGPT and Perplexity citations." The site has
**zero JSON-LD on all 12 pages**, and `/llms.txt` is a fake 200 serving the homepage.
SEO scored **8/25** almost entirely on this. It is the most quotable failure on the site.

Deliver:

1. **JSON-LD via `scripts/build-pages.mjs`**, not hand-pasted per page — the generator
   already owns page chrome, so add a block there driven by per-page data:
   - `Organization` on every page: name `NEORM-ERA`, `parentOrganization` TAURUS AI Corp.,
     `url`, `logo`, `sameAs`. **Include `addressCountry: "CA"`** — see Task D.
   - `SoftwareApplication` on each of the 7 engine pages (name, description,
     `applicationCategory`, `offers` with the real price).
   - `BreadcrumbList` on every non-home page.
   - `FAQPage` wherever you add the FAQ blocks below.
   - `WebSite` + `SearchAction` on the homepage only.
2. **A real `/llms.txt`** at `platform/llms.txt`, served as `text/plain`. Reference
   implementations that actually rank in this niche: `improvado.io/llms.txt`,
   `realize.com/llms.txt`. Include: what the company is, the seven engines in plain
   language, and an index of the real page URLs.
3. **Extractable answer content.** The critique found zero `<table>`, zero `<dl>`, zero FAQ
   blocks sitewide — nothing an LLM can lift and cite. Add a 4–6 question FAQ block to the
   homepage and to each engine page, written as direct question → direct answer. This is
   the single highest-leverage AEO change after the schema.
4. **Fix the soft-404.** Every missing URL returns 200 with the homepage. Add a real
   `platform/404.html` and set Cloudflare Pages `not_found_handling` appropriately.
   This is the root cause of the og:image failure looking like a success.

**Acceptance:** `curl -s <page> | grep -c 'application/ld+json'` ≥ 1 on all 12 pages;
every JSON-LD block validates against schema.org; `curl -sI /llms.txt` returns
`content-type: text/plain`; a nonexistent URL returns **404**, not 200.

---

## 4. TASK B — dark mode

**The finding:** zero support, verified by forcing `prefers-color-scheme: dark` — the
background stays `rgb(237,232,222)`. The buyer is a marketer who lives in dark-themed ad
platforms.

Do it **through the token layer only**. `design-system.css` must stay free of colour
literals, so every dark value becomes a token override, not a new hex.

- Propose the dark palette as a **diff against `platform/lib/tokens.mjs`** and put it in
  your report. **Do not edit `tokens.mjs` yourself** — I own it. I will apply it and run
  `npm run tokens`.
- You may write the `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`
  structure in `design-system.css` referencing tokens that do not exist yet.
- Include an explicit toggle, defaulting to system.
- **Re-measure contrast in dark**: `--text` must clear 4.5:1, and fix `--text-dim` while
  you are there — it is **3.08:1 in light mode today and fails AA on every page**.

**Acceptance:** forcing dark changes `body` background; every text token clears 4.5:1 in
both themes; zero colour literals added to `design-system.css`; mirror stays byte-identical.

---

## 5. TASK C — surface the proof, and fix the mobile nav

**Finding C1 — the proof is buried.** `case-studies.html` has **four real case studies**
with hard numbers (CTR 2.3×, CPC −40%, leads +41%, CPL −23%, "POC → $399/mo closed in 48
hours"). It is linked **once**, from the footer, at `index.html:311`. Three critics
independently flagged "no social proof" — they were wrong, and so was I. You have proof and
you are hiding it.

- Pull 2–3 result strips next to the primary CTAs on `/` and `/pricing.html`.
- Every client is anonymised ("A luxury restaurant chain", "Kerala Retailer"). Leave it
  anonymised — do **not** invent names — but add the vertical and the metric to the strip.
- One number is labelled "projected CTR uplift". Keep the word *projected*. Do not launder
  a projection into a result.

**Finding C2 — the homepage mobile nav is broken.** Measured identically on live and local:
`scrollWidth` **463** vs **375** = **88px overflow**; the `.nav-toggle` hamburger sits at
x=423, entirely outside the viewport. The menu is unreachable on a real phone. Engine pages
measure 0px only because their CTA label is shorter — **this is width-dependent, not
page-dependent, so a 0px reading on one page is not evidence of a fix.**

Culprit is `.nav-cta` (`design-system.css:204`). Fix by capping or hiding the text CTA below
~420px, keeping the hamburger reachable.

**Acceptance:** at 375px and 390px, on `/` **and** all 7 engine pages,
`scrollWidth - clientWidth === 0` and the `.nav-toggle` bounding box is fully inside the
viewport. Measure it; do not eyeball it.

---

## 6. TASK D — reconcile pricing and jurisdiction

**Finding D1 — the two pricing surfaces disagree.** Homepage advertises
AED 299 / AED 599 / $399 / $1,500+. `/pricing.html` leads with a different 4-tier grid
($49 / $199 / $349 / $799) and then stacks four more 3-tier grids reusing the same tier
names at different prices — 16 SKUs total. A visitor who reads a homepage price and clicks
through cannot find it.

**Do not invent the resolution.** Produce a table of all 16 SKUs as they exist today and
propose ONE canonical structure. The owner decides; you implement after.

**Finding D2 — the site markets from a retired corporate posture.** UAE/GCC/Dubai appears
on all 5 core pages; **Canada appears on exactly one**. `CLAUDE.md:14` records that TAURUS
AI Corp. (Canada, CBCA 1001270625) has signed NEORM-ERA **"since 2026-08-08, serving
worldwide."** The regional framing predates that.

Add a legal footer line on every page: company name, Canadian incorporation, and
`addressCountry: "CA"` in the Organization schema from Task A. Keep the regional go-to-market
copy — just stop implying the contracting entity is regional.

---

## 7. What I need back

`.gemini-handoff/REPORT-PHASE7.md` containing:

1. **§1 second opinion** — verdict per item, with `file:line`. Be adversarial.
2. Per task: what changed, files touched, and the acceptance evidence **as command output**,
   not prose.
3. `npm test` run **three times**, all three counts reported, because of the flake.
4. Anything you were told here that turned out to be **wrong** — I have been wrong four
   times today (og:images "resolve", case-studies "empty", the api/ count, an empty-bucket
   "loud failure") and each was caught by someone checking rather than trusting.
5. Anything you chose **not** to do, and why.

Do not commit. Do not push. Do not deploy. Do not touch `platform/api/`, `tokens.mjs`,
or `.github/workflows/`.
