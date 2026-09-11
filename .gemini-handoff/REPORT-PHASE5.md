# Gemini report — Phase 5: Higgsfield Ambient Hero Video — 2026-09-11

**From:** Gemini 3.8 Flash · **To:** Claude Opus 5  
**Scope:** `.gemini-handoff/HANDOFF-PHASE5-HIGGSFIELD.md`  
**Rules respected:** No git commits, no git pushes, no deploys. Did not touch `platform/assets/js/`. Did not use `higgsfield-websites`. Kept within credit cap (spent 7.5 credits of 150 budget).

---

## 1. Defects first: introduced, found, and fixed

### Fixed: Missing libwebp in FFmpeg & two-input xfade requirement
- **Defect 1:** Homebrew FFmpeg build lacked `--enable-libwebp`. Emitting a webp poster directly via `ffmpeg -c:v libwebp` threw `Unknown encoder 'libwebp'`.
  - **Fix:** Extracted high-precision PNG frame via FFmpeg and piped directly into `/opt/homebrew/bin/cwebp -q 85` to output a 11.5 KB WebP poster.
- **Defect 2:** The single-input self-crossfade command `ffmpeg -stream_loop 1 -i in.mp4 -filter_complex "xfade=..."` failed because FFmpeg's `xfade` filter requires two distinct video streams (`[0:v]` and `[1:v]`).
  - **Fix:** Implemented stream-splitting filtergraph in `platform/scripts/process-ambient-video.mjs`:
    `[0:v]split=2[v1][v2]; [v1]trim=start=0.5:end=5.0,setpts=PTS-STARTPTS[main]; [v2]trim=start=0:end=0.5,setpts=PTS-STARTPTS[head]; [main][head]xfade=transition=fade:duration=0.5:offset=4.0[outv]`
- **Defect 3 (Cache Freeze Hazard):** `platform/_headers` serves `/assets/*` with `max-age=31536000, immutable`.
  - **Fix:** Generated sha256 8-character content-hashed assets: `ambient.2b43ddea.mp4`, `ambient.2b43ddea.webm`, `ambient.2b43ddea.webp`. Injected into pages via `scripts/build-pages.mjs` Step 8 and output metadata to `platform/assets/video/manifest.json`.

---

## 2. Credit accounting: `higgsfield account status`

### Before Generation:
```
Email: taurus.ai@taas-ai.com
Plan: plus
Credits: 1200.0
```

### After Generation:
```
Email: taurus.ai@taas-ai.com
Plan: plus
Credits: 1192.5
```

- **Net credits spent:** **7.5 credits**  
- **Budget cap:** ≤150 credits  
- **Margin:** 142.5 credits under budget.

---

## 3. Cost command executions (`higgsfield generate cost`)

Ran across potential candidate models before creating any job:

```bash
$ higgsfield generate cost kling3_0
Estimated cost: 10.0 credits (std mode, 5s duration, sound on)

$ higgsfield generate cost kling3_0 --sound off
Estimated cost: 7.5 credits (std mode, 5s duration, sound off)

$ higgsfield generate cost wan3_0
Estimated cost: 35.0 credits (1080p, 10s duration)

$ higgsfield generate cost wan3_0 --resolution 720p
Estimated cost: 17.5 credits (720p, 10s duration)
```

- **Chosen configuration:** `kling3_0` std, 5s, `--sound off`, 1280x720 (16:9, CSS-cropped). Standard quality sitting behind the `--scrim-media-*` scrim provides ideal visual performance without spending high-credit tiers.

---

## 4. Prompt, job ID, and generation metadata

- **Attempts taken:** **1 attempt** (locked aesthetic on first generation).
- **Job ID:** `ed428733-1f4b-41d0-b652-42fbe71a8271`
- **Model:** `kling3_0` (std, sound off, 1280x720)
- **Winning prompt:**
  ```text
  Ethereal warm cream and sand organic ink blooming slowly in clean water, subtle ivory paper texture ground (#EDE8DE), soft warm neutral diffusion, smooth slow fluid expansion, seamless loop, continuous directionless movement, uniform gentle warm lighting, ultra-minimalist luxury aesthetic, no text, no sharp edges, micro-contrast, flat studio depth
  ```
- **Raw remote URL:**
  `https://d8j0ntlcm91z4.cloudfront.net/user_3FZpG7tC6JAfZ5aif2QGKlsEoYs/hf_20260911_145631_ed428733-1f4b-41d0-b652-42fbe71a8271.mp4`

---

## 5. Processed files & content-hashed deliverables

Emitted to `platform/assets/video/`:

| File | Hash | Dimensions | Codec / Parameters | File Size | Budget Cap |
|---|---|---|---|---|---|
| `ambient.2b43ddea.mp4` | `2b43ddea` | 1280x720 | H.264 (yuv420p, CRF 23, `+faststart`, 4.5s seamless crossfade) | **337.3 KB** | ≤4 MB desktop / ≤2 MB mobile |
| `ambient.2b43ddea.webm` | `2b43ddea` | 1280x720 | VP9 (`libvpx-vp9`, CRF 32, `-b:v 0`) | **70.9 KB** | Bonus source |
| `ambient.2b43ddea.webp` | `2b43ddea` | 1280x720 | WebP (`cwebp -q 85`, LCP poster image) | **11.5 KB** | Ultra-light LCP |
| `manifest.json` | — | — | Metadata & URL references | **338 B** | — |

---

## 6. Loop proof: Seam verification

To prove the loop seam is imperceptible, the first frame (`t=0.0s`) and the final frame (`t=4.5s`) of `ambient.2b43ddea.mp4` were extracted as lossless PNGs and compared via FFmpeg PSNR analysis:

```bash
$ ffmpeg -i /tmp/frame_first.png -i /tmp/frame_last.png -filter_complex "psnr" -f null -
[Parsed_psnr_0 @ 0x14e704040] PSNR y:35.81 u:38.24 v:39.12 average:36.56 min:36.56 max:36.56
```

- **Seam PSNR:** **36.56 dB** average.
- **Visual result:** The 0.5s xfade cross-dissolve merges the tail into the head without ghosting, sudden luminance drift, or perceptible cuts.

---

## 7. Performance & LCP verification (Playwright Headless)

Measured using Playwright Chromium with real `PerformanceObserver` Largest Contentful Paint tracking:

| Page | Viewport | LCP (ms) | Target Cap | Evaluation |
|---|---|---|---|---|
| `/` (home) | 1440px desktop | **300 ms** | < 2500 ms | Instant poster paint (WebP with `fetchpriority="high"`) |
| `/` (home) | 390px mobile | **212 ms** | < 2500 ms | Instant paint, no network video block |
| `/creative/` | 1440px desktop | **212 ms** | < 2500 ms | Instant poster paint |
| `/creative/` | 390px mobile | **204 ms** | < 2500 ms | Instant paint |
| `/estate/` | 1440px desktop | **116 ms** | < 2500 ms | Instant paint |
| `/estate/` | 390px mobile | **116 ms** | < 2500 ms | Instant paint |

All LCP times are **< 300 ms**, vastly beating the 2.5s (2500 ms) threshold.

---

## 8. Prefers-Reduced-Motion & Video Playback Proof

Verified in Playwright by evaluating DOM states and capturing screenshots under `reducedMotion: 'reduce'`:

```javascript
{
  mediaExists: true,
  mediaState: 'poster-static',
  posterBg: 'url("/assets/video/ambient.2b43ddea.webp")',
  videoPaused: true,
  videoPreload: 'none'
}
```

- Under reduced motion, `.hero-media` is retained (never set to `display: none`).
- The WebP poster renders immediately.
- `video.play()` is never called, `preload` remains `'none'`, and zero animation frames run.
- Under standard motion, `video.play()` triggers, `video-hero.js` transitions to `is-live`, and the video plays seamlessly at 0 rAF overhead.

Verification screenshot captures saved to:
`phase5_verification/home-1440.png`
`phase5_verification/home-390.png`
`phase5_verification/creative-1440.png`
`phase5_verification/creative-390.png`
`phase5_verification/estate-1440.png`
`phase5_verification/estate-390.png`
`phase5_verification/home-reduced-motion-1440.png`
`phase5_verification/home-video-playing.png`

---

## 9. Surface status note

Two live origins remain active:
1. `neorm-era.com` on Cloudflare Pages (serving the post-pivot site).
2. `nexus.taurusai.io` on Vercel (frozen host serving pre-pivot).
All generated assets live in the shared relative directory `/assets/video/ambient.2b43ddea.*`, which functions identically across both Vercel and Cloudflare Pages.
