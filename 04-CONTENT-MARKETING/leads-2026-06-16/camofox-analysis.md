camofox-browser — Analysis for Ad Creative & Ad Verification
============================================================

Repo: https://github.com/jo-inc/camofox-browser  (v1.11.2, MIT)
Cloned to: /tmp/camofox-browser/
Written: 2026-06-16


WHAT THIS REPO ACTUALLY IS
--------------------------

Not what the marketing copy implies. It is NOT a scraping toolkit. It is NOT
"the next Playwright." It IS:

  A thin REST API server (Express, ~6k LOC in server.js) that wraps
  Camoufox — a Firefox fork with C++-level fingerprint spoofing — and
  exposes it to AI agents through token-efficient commands.

  Camoufox patches the browser at the C++ implementation layer:
  navigator.hardwareConcurrency, WebGL renderers, AudioContext, screen
  geometry, WebRTC. Bypasses Google captchas, Cloudflare, DataDome.
  This is the only part of the stack that's truly novel; everything
  else is glue.

The "agent-first" framing is real and useful: instead of returning HTML,
it returns an accessibility-tree YAML with stable element refs
(`e1`, `e2`, `e3`) that an LLM can act on. Snapshot payloads are ~90%
smaller than raw HTML, with offset-based pagination for huge pages.

Architecture in one sentence: Express server → Playwright → Camoufox
binary → JSON snapshots back to an LLM agent over HTTP.


FEATURES THAT MATTER FOR ADS
----------------------------

1. SCREENSHOT ENDPOINTS (server.js L4249, L2984, L3031)
   GET /tabs/:tabId/screenshot
     ?fullPage=true for above-the-fold + scrolled content
     Returns raw PNG bytes (Content-Type: image/png), OR
     ?includeScreenshot=true on /snapshot returns base64 PNG bundled
     with the accessibility tree in one call.

2. DOM IMAGE EXTRACTION (lib/images.js, server.js L4182)
   GET /tabs/:tabId/images?includeData=true&limit=20&maxBytes=20971520
   Walks <img> nodes, returns {src, alt, width, height, mimeType, bytes,
   dataUrl}. Honors currentSrc (CDN/responsive). De-dupes.
   Cap 20MB inline (dataSkipped if larger).

3. STRUCTURED EXTRACT VIA JSON SCHEMA (lib/extract.js, server.js L4531)
   POST /tabs/:tabId/extract
   { schema: { type: "object", properties: { headline: { x-ref: "e1",
   type: "string" }, cta: { x-ref: "e7", type: "string" } } } }
   Deterministic extraction from refs. Coerces number/integer/boolean.
   Throws on required-but-missing.

4. DOWNLOAD CAPTURE (lib/downloads.js, server.js)
   Listens for Playwright `download` events on every page. Auto-saves
   to /tmp, returns {id, url, suggestedFilename, mimeType, bytes,
   dataBase64}. Capped at 20 records/tab (FIFO cleanup).
   Optional inline base64 via ?includeData=true.

5. PLAYWRIGHT TRACE CAPTURE (lib/tracing.js, server.js L1208)
   Per-session opt-in: `{ trace: true }` on first tab creation.
   Captures screenshots + DOM snapshots + network traffic to a zip.
   API to list / fetch / delete traces. Sweep by TTL + max size.

6. VNC VISUAL OBSERVATION (plugins/vnc/)
   Spawns x11vnc + noVNC over Xvfb. Bind 127.0.0.1 by default,
   optional VNC_PASSWORD, VIEW_ONLY=1 for observation-only. Export
   authenticated storage_state.json after solving a CAPTCHA visually.

7. PERSISTENCE (plugins/persistence/)
   ~/.camofox/profiles/<sha256(userId)>/storage_state.json
   Atomic writes, async lifecycle hooks (session:creating /
   session:created / session:cookies:import / server:shutdown).

8. SESSION STATS (server.js L4317)
   GET /tabs/:tabId/stats returns toolCalls, visitedUrls,
   downloadCount, consecutiveFailures. Per-tab usage telemetry.

9. SEARCH MACROS (lib/macros.js)
   @google_search, @youtube_search, @amazon_search, @reddit_search,
   @linkedin_search, @wikipedia_search, @twitter_search, @yelp_search.
   URL-construction short-circuits instead of guessing query strings.

10. PROXY + GEOIP (lib/proxy.js)
    Per-context proxy with automatic locale + timezone derived from
    the proxy IP's geo. Useful for verifying geo-targeted ads.

11. CRASH REPORTER (lib/reporter.js)
    Anonymized telemetry to a Cloudflare Worker. HMAC-hashes domains,
    strips paths/params, redacts tokens/IPs. Opt-out env var.

12. OPENAPI-FIRST DOCS
    /openapi.json + /docs (3-panel UI). swagger-jscodgen from
    @openapi JSDoc blocks. OpenClaw plugin manifest auto-generated.


TECHNIQUES WORTH STEALING (RANKED)
----------------------------------

1. ACCESSIBILITY-TREE SNAPSHOTS, NOT HTML
   Returning an A11y tree (~10% of HTML size) with stable refs is the
   single biggest win. For ad verification, build a snapshot that
   emits structured refs for: headline text, body copy, CTA button,
   image alt, image src, price, rating, badge text. LLM agents can
   then assert "CTA copy matches brief" deterministically.
   > STEAL: stable per-element refs (e1/e2/...) tied to a deterministic
   > extractor. Return tree text, not rendered HTML.

2. BUNDLED SCREENSHOT + STRUCTURED DATA IN ONE CALL
   ?includeScreenshot=true on /snapshot returns base64 PNG alongside
   the text tree. For ad creative review, this is the killer feature:
   one HTTP call yields (visual proof, copy, layout, refs) in one
   round-trip. Process the PNG with a vision model, assert against
   the brief in the same call.
   > STEAL: always co-return screenshot + DOM/snapshot when verifying
   > creative. Don't make the verification loop pay 2x RTTs.

3. STRUCTURED EXTRACT VIA JSON SCHEMA WITH x-ref
   The /extract endpoint is the right abstraction for ad QA. Schema:
     { type: "object",
       properties: {
         headline:  { x-ref: "e1", type: "string" },
         cta:       { x-ref: "e7", type: "string" },
         image_alt: { x-ref: "e3", type: "string" },
         price:     { x-ref: "e12", type: "number" }
       },
       required: ["headline", "cta"] }
   Coerces types; throws on required-missing. Reusable across campaigns.
   > STEAL: schema-first extraction with required-field enforcement.
   > Outputs are typed JSON, not LLM-parsed prose. Zero hallucination.

4. DOM IMAGE EXTRACTION WITH INLINE DATA
   extractPageImages walks <img>, returns src/alt/width/height plus
   dataUrl up to 20MB. Honors currentSrc (responsive/retina variants).
   De-dupes. For ad verification: capture every ad creative image,
   pull it back as base64, hand to a vision model, assert brand/logo
   presence, color compliance, banned-text absence.
   > STEAL: bulk-pull ad images with metadata in one call. Don't
   > screenshot-then-OCR — extract the actual served asset.

5. PLAYWRIGHT TRACE ZIPS FOR DEBUGGING FAILURES
   When an ad doesn't render correctly, the trace gives you
   screenshots + DOM + network in one zip. For ad creative QA,
   auto-capture a trace whenever a verification check fails; the
   zip becomes the bug report.
   > STEAL: on failed verification, emit a trace zip with screenshots
   > + network log + DOM snapshot. Triage from the artifact alone.

6. PROXY + AUTOMATIC GEOIP LOCALE/TIMEZONE
   The proxy module matches browser locale + timezone to the proxy
   IP's geo. For verifying geo-targeted ads (US vs UK pricing,
   locale-specific copy, regulatory disclosures), this is essential.
   Without it your LLM looks at a US-defaulted page and asserts on
   the wrong creative.
   > STEAL: pair proxy with locale+timezone matching. Critical for
   > any geo-split ad test.

7. STABLE PER-USER SESSION ISOLATION + PERSISTED STORAGE STATE
   ~/.camofox/profiles/<sha256(userId)>/ — atomic writes, async
   lifecycle hooks. For ad verification across logged-in flows
   (Meta Ads Manager, Google Ads, TikTok Ads Manager), the cookie
   persistence is what makes the agent survivable across restarts.
   > STEAL: per-user storage_state.json so an ad-verification agent
   > can be restarted without re-logging-in. sha256 the userId.

8. DOWNLOAD CAPTURE LISTENER
   page.on('download') hooked on every page, captures whatever the
   browser would have saved. For ad verification: when an ad click
   triggers a download (PDF brochure, whitepaper), automatically
   capture and stash it for review.
   > STEAL: always-on download listener with FIFO 20-record cap.
   > Don't make the verification flow check downloads explicitly.

9. SEARCH MACROS TO AVOID URL GUESSING
   @google_search + query beats hand-crafted google.com/search?q=...
   URLs. For verifying SERP-driven ad placement (where does our ad
   actually rank for "best running shoes"?), use the macro — Google
   rarely changes the macro's underlying URL but changes the search
   page parameters constantly.
   > STEAL: macro indirection for SERP / marketplace verification.
   > Insulates from constant URL-arg churn.

10. CRASH REPORTER WITH DOMAIN HASHING
    HMAC-hashes domains (so private domains are not leaked), strips
    paths/params, redacts tokens/IPs. For ad verification this maps
    onto: "which ad networks / DSPs / publishers are causing our
    verification flow to fail?" — same privacy guarantees.
    > STEAL: anonymized failure telemetry with domain hashing. Don't
    > leak client URLs into your crash reports.


THINGS DELIBERATELY OUT OF SCOPE / NOT WORTH BORROWING
------------------------------------------------------

  - Camoufox itself: Firefox fork with C++ fingerprint spoofing. Only
    useful if you actually need to bypass bot detection. For internal
    ad verification behind a login wall, plain Playwright Chromium
    is enough.
  - Anti-detection as a goal: not relevant for verification flows
    that are already authenticated.
  - The plugin loader / event bus: over-engineered for a single-app
    ad verification tool. Just write routes.


RECOMMENDED INTEGRATION FOR AD CREATIVE / VERIFICATION
------------------------------------------------------

Build a smaller, focused clone that borrows patterns 1–6 above:

  Stack:  Express + Playwright (Chromium, headless) + sharp
  Routes:
    POST /verify     { url, brief } → bundled screenshot + structured
                                      extract + assertions
    POST /extract    { url, schema } → typed JSON per schema
    POST /preview    { creative_url, geo, device } → screenshot bundle
    POST /archive    { url } → zip of trace + assets + DOM
  Persistence:
    ~/.ad-verify/profiles/<sha256(client_id)>/storage_state.json
  Captcha / login flow:
    VNC fallback if /preview hits a captcha — operator solves,
    storage state exported, flow continues headless
  Telemetry:
    Hash domain, record which verification checks fail most often.


FILE INDEX (cloned at /tmp/camofox-browser/)
--------------------------------------------

  server.js                  ~6133 lines — all routes
  lib/snapshot.js            windowed a11y snapshot pagination
  lib/extract.js             JSON Schema + x-ref deterministic extract
  lib/images.js              bulk DOM image extraction w/ inline data
  lib/downloads.js           download listener + temp file mgmt
  lib/tracing.js             per-user trace zip storage + sweep
  lib/proxy.js               proxy + auto locale/timezone
  lib/macros.js              @google_search etc URL expansion
  lib/persistence.js         atomic storage state read/write
  lib/plugins.js             plugin loader + event bus
  plugins/vnc/               noVNC fallback for visual login
  plugins/youtube/           yt-dlp transcript extractor
  plugins/persistence/       on-by-default storage_state saver
  AGENTS.md                  complete agent-facing API reference
  openapi.json               generated from JSDoc @openapi blocks