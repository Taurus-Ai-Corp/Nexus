# Handoff to Gemini 3 — NEORM-ERA platform, technical state as of 2026-08-26

From: Claude Code (backend / integration / infrastructure).
Scope of this document: **what exists and what is wired**. Design, visual
direction, aesthetics and copy are yours; this file makes no recommendations
about any of them.

Branch: `feat/nexus-core-organic-design-system`
Repo: `Taurus-Ai-Corp/Nexus`, working dir `Documents/NEXUS-CORE`
**9 commits, none pushed. No PR. Nothing deployed.**

---

## 1. Where the site actually is right now

| | |
|---|---|
| Live host | `nexus.taurusai.io` (Vercel). **Serving the OLD pre-rebrand site.** |
| Live content | Five Nexus SKUs. `/estate` and `/seo` return **404** in production. |
| Brand domain | `neorm-era.com` — registered 2026-08-25, **not live** |
| Nameservers | `launch1/launch2.spaceship.net` (parking). `www` has no record. |
| Local branch | Seven-engine NEORM-ERA site, all pages 200 |

So: **production and this branch are different sites.** If you open
`nexus.taurusai.io` you are looking at the old one. Work against the branch.

Preview locally:
```bash
cd platform && npx serve . -p 4173
```
One caveat that will waste your time otherwise: `serve` 301-redirects
`/x.html` → `/x` and **drops the query string**. Production does the opposite
(`/contact.html?x=1` → 200 with query intact, `/contact` → 404). Test
query-dependent pages at `/contact?plan=...` locally, but **keep `.html` in the
hrefs** — that is what production needs.

---

## 2. The nine commits

| Commit | What it did |
|---|---|
| `f2b8834` | NEORM-ERA taxonomy + brand refactor across `platform/` |
| `11836c7` | Engine nav, contact funnel, Stripe checkout wiring |
| `a003b08` | Nav markup, invisible CTA, fallback fonts, brand leaks |
| `5f45b5c` | Checkout redirect origin derived from the request |
| `c00a77a` | Unpriced plans routed to sales |
| `170ec2d` | NEORM-ERA adopted as canonical taxonomy; brand guard armed |
| `d947d91` | Two-part engine naming form recorded |
| `0b9ca86` | Removed a redirect that would have blacked out production |
| `427b7ff` | Page-breaking syntax error + two dead links |

---

## 3. Things that were broken and now are not

**A redirect would have taken the whole site down.** `f2b8834` added a
catch-all in `vercel.json` sending every request on `nexus.taurusai.io` to
`https://www.neorm-era.com` — a host with no DNS record. `nexus.taurusai.io` is
the only host attached to the project, so the first request after deploy would
have 302'd into NXDOMAIN. Removed in `0b9ca86`. The apex→www redirect for
`neorm-era.com` is kept and is inert until that domain is attached.

**All seven checkout buttons were dead.** They navigated by GET; the handler
routes checkout on POST only. Every click returned raw `400` JSON. Fixed.

**Checkout would have charged the wrong price.** `planMap` collapsed
`agency_starter`, `agency_pro`, `agency_enterprise` and `worldcup` onto
`studio`, with a fallback to `starter`. Only `STRIPE_STARTER_*` and
`STRIPE_STUDIO_*` price IDs exist. A working $2,499/mo button would have
charged $399/mo. Unknown plans now return an explicit error.

**Checkout redirected to a dead domain.** `success_url`, `cancel_url`, a
self-referential `fetch` of `/api/leads` and a `deploy_url` were all hardcoded
to `www.neorm-era.com`. Now derived per request — see §5.

**`campaigns/dogfood.html` rendered an empty gallery on every visit** since the
file was created. A string literal was broken across two physical lines, so the
entire inline script failed to parse and `renderCampaigns()` never ran.
`#campaign-list` has no static fallback. Fixed; renders 6 cards, browser-verified.

**Two dead links.** `/dogfood` (404) → `/campaigns/dogfood` (200). And see §7
for the notebook.

**Wrong engine names in two headers.** `estate/` and `seo/` were templated from
`freelance/` and both rendered `Neormence` in the nav while their `<title>` said
Neormestate / Neormeo.

**Malformed nav on `flow/`** — a stray `</div>` closed `.nav-inner` early.

**An invisible CTA on `world-cup-2026.html`** — measured contrast 1.00,
foreground and background both `rgb(246,244,239)`. That page defines its own
inverted `:root` where `--ink` is the LIGHT colour. Worth knowing before you
touch its tokens.

---

## 4. Checkout — exact current state

`platform/api/stripe.js`.

**Only two plans have Stripe price IDs**: `STRIPE_STARTER_*`, `STRIPE_STUDIO_*`.

| Plan | Route |
|---|---|
| `starter` | Stripe checkout |
| `studio` | Stripe checkout |
| `dogfood` | Stripe checkout (aliased to `studio` — same product, same price) |
| `agency_starter` | `/contact.html?plan=agency_starter` |
| `agency_pro` | `/contact.html?plan=agency_pro` |
| `agency_enterprise` | `/contact.html?plan=agency_enterprise` |
| `worldcup` | `/contact.html?plan=worldcup` |

The four sales-routed plans land on `contact.html`, which reads `?plan=` and
prefills `#message` and `#vertical`. Browser-verified for all four. Unknown or
hostile `?plan=` values prefill nothing and inject nothing.

**Pricing copy does not agree with itself.** Nine distinct price points across
three ladders: `00_EXECUTIVE_SUMMARY` says $49/$199/$799; `pricing.html` shows
$49/$99/$199/$349/$399/$799/$1,500; `campaigns/agency.html` shows
$399/$999/$2,499/$10,000/$15,000. Two Stripe products exist. Nothing can charge
a price the system cannot honour any more, but the copy is unreconciled. The
decision recorded on 2026-08-26 was **ship with Starter + Studio only**.

---

## 5. `platform/lib/site-origin.mjs` — read this before adding any URL

No hostname may be hardcoded in `platform/api/`. A test enforces it.

```js
import { siteOrigin } from '../lib/site-origin.mjs';
const origin = siteOrigin(req);   // -> "https://nexus.taurusai.io" today
```

Host is attacker-controlled and these values become redirect targets, so it is
allowlisted, not trusted. Verified by capturing the real outbound Stripe body:

```
Host: nexus.taurusai.io      -> https://nexus.taurusai.io/campaigns/thanks.html?...
Host: www.neorm-era.com      -> https://www.neorm-era.com/campaigns/thanks.html?...
Host: preview-abc.vercel.app -> https://preview-abc.vercel.app/campaigns/thanks.html?...
Host: evil.example.com       -> https://nexus.taurusai.io/campaigns/thanks.html?...
```

**`SITE_ORIGIN` overrides everything.** That is the DNS cutover mechanism — set
the env var, no code change.

---

## 6. Brand canon — now enforced, and it will fail your commits

`~/.ai-context/taxonomy/TAXONOMY.toml` is v1.2.0. It had **zero** mention of
NEORM before 2026-08-26; the code and the canon disagreed. Now aligned.

**The naming form is two-part: an indivisible coined stem plus a descriptor.**

| # | Full name | Stem (URL slug) | Card category |
|---|---|---|---|
| 01 | Neormative *Ads* | `Neormative` (`/creative/`) | Creative Studio |
| 02 | Neormedia *Sync* | `Neormedia` (`/social/`) | Social Autopilot |
| 03 | Neormintel *Data* | `Neormintel` (`/intel/`) | Predictive ROAS |
| 04 | Neormestra *Flow* | `Neormestra` (`/flow/`) | Orchestration |
| 05 | Neormestate *Reels* | `Neormestate` (`/estate/`) | Real Estate |
| 06 | Neormeo *Authority* | `Neormeo` (`/seo/`) | GEO & AI Search |
| 07 | Neormence *Studio* | `Neormence` (`/freelance/`) | Agency Workspace |

Platform lockup `NEORM-ERA Agentic Studio`; tagline "Seven Specialist Engines.
One Normalized Studio."

**`platform/` currently renders the stem only — no descriptors.** The pages and
the canon disagree on this point. That copy work is not done.

**The URL slugs are the pre-rebrand words and are NOT being renamed.**
`/creative/`, `/seo/`, `/freelance/`. Renaming them breaks every inbound link.

**Frozen — never rename:** `NEXUS-CORE` (directory), `Taurus-Ai-Corp/Nexus`
(repo), `nexus.taurusai.io` (host), `ORCA_WEBHOOK_URL`, `data.orca`, `orcaHtml`.
Brand moved; infrastructure did not.

**The pre-commit brand guard now rejects** `Nexus Creative` / `Nexus Social` /
`Nexus Intel` / `Nexus Freelance` / `Nexus Flow`, plus `NeoVibe`, `BizFlow`,
`NeoSync`, `GridDB`, `ORCA`, `Quantum Grid`. It is **line-based** — put
`<!-- brand-allow -->` on the same physical line, not at the end of a wrapped
paragraph. `brand.test.js` separately matches `/\bnexus\b/i` across whole files.

Three defects were fixed in the taxonomy tooling itself: `RETIRED_BRANDS` was a
hardcoded literal so the `[[retired]]` table enforced nothing; `naming_form` had
no value that fit; and the guard's own failure message taught the string it had
just rejected. Edit the TOML and run
`~/.ai-context/taxonomy/scripts/sync-taxonomy.py --execute` — never hand-edit
the generated blocks. **`~/.ai-context` is not a git repo.**

---

## 7. Security — action required, not by me

**Three credentials are exposed and none are rotated.**

1. **GitHub PAT** — org-wide blast radius. In a tracked `.env` under
   `neovibe-platform/`.
2. **Stripe webhook signing secret** — in `nexus-creative-editorial/metered-billing.env`.
3. **HuggingFace token** — hardcoded inside
   `08-DOCUMENTATION/research/swarm-sr/nexus-creative-editorial/tribev2_inference.ipynb`.

Deleting files or gitignoring them does not un-leak any of these. Rotate at the
provider.

**On the HuggingFace one — a trap you may walk into.** `campaigns/colab.html`
had a "Download Notebook" button pointing at `/tribev2_inference.ipynb`, which
404s. The file sits right there on disk, so the obvious repair is to copy it
into `platform/`. **Do not.** That would publish the token to a public website.
The file is also not valid JSON (an unterminated `"source"` array — Jupyter and
Colab both refuse it), and the "Open in Colab" button beside it pointed at a
GitHub repo that 404s under both `taurus-ai/` and `Taurus-Ai-Corp/`. Both CTAs
were removed in `427b7ff` and replaced with a contact link; the reasoning is in
an HTML comment at the call site.

---

## 8. Tests — 266, 265 passing

```bash
cd platform && npm test
```

The one failure is `core/design-system/tokens/design-system.css` ENOENT — known
local drift from the mid-reorganisation working tree, documented in `CLAUDE.md`.
Not a defect. Everything else is green.

Guards that will fail your commits if you break these invariants:

- every engine page's nav lockup matches its `<title>`
- every footer reaches all seven engines, each named once
- no duplicate link inside `.nav-links`; `.nav-cta` contained by `.nav-inner`
- no retired brand name in published copy
- every checkout button names a plan that has a price
- the four unpriced plans have a sales link
- no `api/` function hardcodes a hostname
- `siteOrigin` rejects an unknown Host header
- **no redirect names a currently-live host as its source**
- **every inline `<script>` compiles**
- **every root-relative href/src resolves**
- `platform/api/` stays at or under 12 functions (Vercel Hobby cap; currently 9)

The last three are new and each was written *before* its fix and observed
failing first.

---

## 9. Measured facts you may want, stated without recommendation

These are `getComputedStyle` readouts and WCAG relative-luminance computations.
They are measurements, not opinions, and what to do about them is your call.

Shared design system (`assets/css/tokens.css`):

| Pair | Ratio |
|---|---|
| `--text-dim #8A8375` on `--bg #EDE8DE` | 3.08 |
| `--on-accent` on `--accent #B44A24` | 4.36 |
| `--accent #B44A24` on `--bg` | 4.36 |
| `--text-muted #6B6559` on `--bg` | 4.74 |
| `--text #17150F` on `--bg` | 14.95 |

`--text-dim` has 19 usages in `design-system.css`, every one set between
0.74rem and 0.88rem (11.8–14px).

Campaign pages, which use a separate palette:

| Pair | Ratio |
|---|---|
| `#B8860B` on `#F3EFE9` (real-estate kickers) | 2.84 |
| `#B8860B` on `#FFFFFF` | 3.25 |
| `#B85C38` on cream | 3.96 |
| `#C84B1E` on cream (world-cup) | 4.09 |

A scratch page rendering these side by side against the real stylesheet is at
`platform/prototype/contrast-proposal.html` (untracked, excluded from tests).
Delete it if it is not useful.

---

## 10. Open, unfinished, or unverified

- **9 commits unpushed.** `gh pr create` and `vercel --prod` are hook-blocked in
  my session.
- **DNS cutover not started.** Nameservers still on Spaceship parking.
- **Engine descriptors are not in the page copy** (§6).
- **Pricing copy unreconciled** (§4).
- **`api/contact.js` sends from `leads@neorm-era.com`** — no MX record. Only
  matters if `EMAIL_FROM` is unset in Vercel; I could not read your env.
- **Campaign footers use `nexus@taurusai.io`**, every other page uses
  `admin@taurusai.io`.
- **`platform/public/` is a stray duplicate tree** holding a second, different
  copy of `campaigns/real-estate/index.html`.
- **`08-DOCUMENTATION/research/` is 7,064 files on disk, 0 tracked.** Commit the
  salvage before retiring anything.
- **Unverified by me:** 390px mobile horizontal overflow on `/` (a QA agent
  measured 73px, `.nav-cta`), and whether the `/intel/` brand lockup wraps. Every
  nav `.brand span` lacks the `white-space:nowrap` its footer twin has — that
  asymmetry is real in the source; the wrapping itself was never measured.
- **Environment bug:** `~/.claude/hooks/local-inference-block.py:63` lists a bare
  `main` in a binary alternation, so any shell command containing "main " is
  blocked with a misleading llama.cpp message. Anchor it as `(\./|/)main\b`.

---

## 11. Two measurement traps that produced false bug reports

Both cost real time. Do not repeat them.

**Scroll-reveal.** A QA agent reported "35 content blocks permanently invisible"
across `/campaigns/`, `agency.html` and `world-cup-2026.html` and diagnosed a
missing `main.js`. It was wrong. Those pages carry their own
`IntersectionObserver` adding `.in-view` — not `.in`, which is what the shared
`assets/js/main.js` adds. Scrolling with default smooth behaviour, or jumping
straight to the bottom in one step, swallows the intermediate callbacks. With
incremental `behavior: "instant"` steps they reach 15/15, 12/12 and 8/8. Acting
on that report would have injected a second observer adding a class those pages
do not use.

**Colour variables.** `campaigns/world-cup-2026.html` defines its own `:root`
where `--ink` is the LIGHT colour. Never infer a colour from a variable name;
read `getComputedStyle`.

Always run a page you know works through the identical measurement as a control
before reporting anything as broken.
