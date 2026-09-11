# Handoff to Gemini — Phase 5: Higgsfield ambient hero

**From:** Claude Opus 5 · **Date:** 2026-09-11 · Follows `HANDOFF.md` (Phases 2 & 4, verified good).
Two research agents produced the findings below. Every number is verified unless marked otherwise.

**Account:** `taurus.ai@taas-ai.com`, plus plan, **1200 credits**. CLI `higgsfield` 1.1.19, authenticated.

---

## 0. Rules

1. **`higgsfield generate cost` is free and estimates without creating a job.** Price every
   configuration before you run it. **Never estimate a cost in prose — run the command.**
2. Do not exceed **150 credits total** without checking in. The plan below needs ~60.
3. Same as before: **no commits, no pushes, no deploys.** Claude owns those.
4. **Do NOT use the `higgsfield-websites` skill.** It is not an asset generator — it scaffolds and
   deploys a complete React/TanStack app into a *Higgsfield-owned* Cloudflare Worker with its own
   git repo and hosting. It would replace this site. In `--type website` mode it also explicitly
   forbids AI generation, which is the entire point here. Use `higgsfield-generate` / raw CLI.

---

## 1. The decision, and why

**Build ONE shared ambient clip, not eight.** Re-tint it per engine using the `--scrim-media-*`
tokens that already exist in `design-system.css`. Eight clips would multiply generation cost,
repo weight and revision surface by 8× for a background that is behind a scrim and deliberately
low-contrast. The engine identity is carried by `--vertical-*` (all seven now exist) and the
scrim, not by separate footage.

**Technique: muted autoplay loop, poster-first, IntersectionObserver-gated, with scroll PARALLAX —
not scroll-scrubbing.** Parallax is a composite-only `transform`; scrubbing `currentTime` costs a
video decode per frame and needs a dense-GOP encode that measured **~5× file growth**. Chrome,
Firefox and Safari also diverge badly on seek quality.

**A correction to our own code.** `hero-gradient.js:12-14` claims scroll-scrubbing "fails outright
under iOS Low Power Mode." **No source supports that.** WebKit bug 219889 (WONTFIX) documents that
LPM disables **autoplay**, not seeking. Scrubbing is ruled out on file size and cross-browser
variance — not on LPM. The comment is wrong and Claude will fix it; do not propagate it.

What LPM *does* do is make `video.play()` reject with `NotAllowedError`. `video-hero.js` already
sets `autoPlay = false`, starts playback from the observer, and `.catch()`es the rejection —
which is exactly right, and dodges the un-hideable native play button that the `autoplay`
attribute forces. **Preserve that architecture.**

---

## 2. PREREQUISITE — content-hash the filename. Do this first.

`platform/_headers` serves `/assets/*` as `public, max-age=31536000, immutable` **with no hash in
the filename.** A video at `/assets/video/ambient.mp4` is cached for a year: every returning
visitor is frozen on version one, forever. You cannot revise it.

This is the binding constraint — not Cloudflare's 25 MiB per-file limit, which a 2 MB clip is
nowhere near.

**You own `scripts/build-pages.mjs`, so add hashing there:** emit
`/assets/video/ambient.<first-8-of-sha256>.mp4` and inject the hashed path into the pages.
Do this **before** generating anything. Without it the asset is one-shot.

---

## 3. Generation spec

**Model:** `kling3_0` in **std** mode for iteration — 10 credits per 5s, and it supports
`end_image`. Note `kling3_0_turbo` is the same price but has **no `end_image`**, so it cannot be
looped: do not use turbo. Lock the look cheaply, then do one final pass at `wan3_0` 1080p
(35 cr / 10s) if you want a longer clip. All of these cap at 16:9 — only the Seedance family and
`flux_3_video` offer 21:9, at 45 cr/5s. **Generate 16:9 and CSS-crop**; for an abstract background
behind a scrim the difference is invisible and it is 4.5× cheaper.

**No model has a seamless-loop flag** — verified across all 35 video model schemas. Looping is
achieved two ways, use both:
- Pass the **same image** as `--start-image` and `--end-image` to constrain first≈last frame.
  (Whether that is pixel-exact is UNVERIFIED and costs credits to test — assume it is not.)
- Crossfade the tail into the head with ffmpeg.

**Prompt for loopability.** This is where the real leverage is:
- **Directionless, continuous motion** — drifting fog, liquid diffusion, slow bloom. Any pan,
  dolly or sweep telegraphs the cut.
- **No hard edges, no text, no recognisable objects.** Blur and low contrast hide the seam.
- **Uniform luminance across the clip** — brightness drift makes the crossfade read as a flash.
- Say **"seamless loop" / "perfectly looping"** explicitly; some models honour it.
- **Generate 2-3× the length you need** so there is a wide, well-matched overlap to choose from.

**Art direction — it must sit under the Hybrid direction, not fight it.** Warm paper ground
(`#EDE8DE`), flat chrome, no gradients in stylesheets. Ask for something that reads as *paper,
ink diffusion, soft bloom on a warm neutral* — not neon, not glass, not dark. If the clip is dark
or saturated, the scrim cannot rescue it.

---

## 4. Post-processing

Self-crossfade for a guaranteed-seamless loop (fade must be **< half** the source length):

```bash
ffmpeg -stream_loop 1 -i in.mp4 -filter_complex \
  "xfade=transition=fade:duration=0.5:offset=<duration-0.5>" \
  -c:v libx264 -crf 23 -movflags +faststart -an loop.mp4
```

A crossfade over *moving* content leaves a visible ghost — which is why §3 insists on
directionless motion. If the result ghosts, regenerate with a calmer prompt rather than shortening
the fade.

`-movflags +faststart` is mandatory (moov atom at the head, ~1.2s off time-to-first-frame). It is
already used in `video-analysis/scripts/build_derivs.sh` — reuse that script's patterns.
**Its output-side `-ss` bug is already fixed there; do not reintroduce output-side seek, it
produced 16K of black frames.**

**Budget: ≤ 2 MB mobile, ≤ 4 MB desktop, 1080p H.264, 12-20s.** H.264 is mandatory. AV1 is a
bonus source only — **Safari has no software AV1 decode at all**, only hardware on A17 Pro+ / M3+.

---

## 5. Integration

- **The poster is the LCP element.** For a `<video>`, LCP is measured from the poster or the first
  frame, whichever lands first. Ship the poster as **WebP with `fetchpriority="high"`**, keep
  `preload="none"` on the video, and the video never touches LCP. Target LCP < 2.5s.
- **Parallax via ScrollTrigger `scrub: true`** on a `translate3d` — `scrolltrigger-patterns.md` §7
  names `scrub: true` specifically for "Hero backgrounds: direct connection."
- **Never add `window.addEventListener('scroll')`.** `design-taste-frontend` §5.D bans it outright.
  Use ScrollTrigger or IntersectionObserver.
- **Fix the reduced-motion handling.** `design-system.css:531-533` currently does
  `.hero-media { display: none; }` — that removes the *visual*, not just the motion, and destroys
  the LCP element for those users. Correct behaviour: keep `.hero-media` and its poster visible,
  suppress only video playback and parallax.

**Do NOT add a second frame loop.** `gsap-advanced-design/references/performance-guide.md` §10:
*"Use `requestAnimationFrame` alongside GSAP ticker (use one or the other)."* This is **already
violated today** — `hero-gradient.js:160,167` runs its own rAF loop and `:164` a raw scroll
listener, while `video-hero.js:175` starts Lenis on `gsap.ticker`. Two loops on every hero page.
**Claude is collapsing that to one in Phase 3 — coordinate, do not also change it.**

Also from that guide: Lenis must be **guarded off on mobile** (it conflicts with iOS momentum
scrolling). It currently is not.

---

## 6. Report back — `.gemini-handoff/REPORT-PHASE5.md`

Same shape as before, defects first, plus:

- **Credits spent**, from `higgsfield account status` before and after. Paste both.
- **Every `generate cost` output** you ran, and the final model/params chosen.
- **The exact prompt** used for the winning clip, and how many attempts it took.
- **Final file sizes** for mp4/webm/poster, and the hashed filenames.
- **Loop proof** — how you confirmed the seam is invisible. "It looks fine" is not proof; describe
  what you actually inspected (e.g. first and last frame extracted and compared).
- **Screenshots at 1440px and 390px** of at least `/`, `/creative/` and `/estate/`, plus one with
  `prefers-reduced-motion` forced on, showing the poster still visible.
- **LCP measurement** before and after, from Chrome DevTools or Lighthouse.

Last note from the first agent, worth carrying: there are still **two live surfaces** —
`neorm-era.com` on Cloudflare Pages and `nexus.taurusai.io` on Vercel serving the pre-pivot site.
Whichever host these assets land on, the canonical host question is unresolved.
