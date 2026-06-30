HeyGen HyperFrames — Repo Analysis for Video Ad Creative
========================================================

Researched: 2026-06-16
Repo: https://github.com/heygen-com/hyperframes
License: Apache 2.0 | Language: TypeScript | Stars: 28,116
Latest activity: 2026-06-17 (active, shipping in production at HeyGen)


WHAT THIS REPO ACTUALLY IS
--------------------------

This is NOT a video-template library or a "stock footage" pack. HyperFrames is
HeyGen's open-source HTML-to-video rendering engine — a direct, simpler
alternative to Remotion (the React-based video framework). The bet: instead of
composing video in React+JSX, you compose it in plain HTML+CSS+GSAP, and the
engine seeks each frame in headless Chrome and encodes the result with FFmpeg.

The actual ad-creative value is not the renderer itself — it's the **massive
catalog of reusable ad blocks and a battle-tested creative-direction
playbook** that ships alongside it. The repo includes:

  - 100+ installable ad blocks under registry/blocks/ and registry/components/
  - 10 ad-category playbooks under skills/motion-graphics/categories/
  - 9+ skills (AGENTS.md) that map "I want a video" to a concrete workflow
  - A full creative-direction docset (house-style, video-composition,
    beat-direction, motion-principles, typography, narration) that encodes
    the actual rules HeyGen uses to make their own ads.

In production at HeyGen; tldraw and TanStack are listed public adopters.


THE 9 VIDEO WORKFLOWS (this is the ad taxonomy)
-----------------------------------------------

From skills/AGENTS.md — these are the categories the framework routes intent
into. The ad-relevant ones are marked:

  /product-launch-video     ★ CORE AD WORKFLOW — product URL or script
                              → launch/promo video, sweet spot 30-90s
  /website-to-video          ★ Captures a real site (screenshots+assets)
                              → tour/showcase/social clip of the site itself
  /faceless-explainer        ★ All visuals invented (typography, abstract
                              graphics, diagram, data-viz) — no live footage
  /motion-graphics           ★ Short (<10s) kinetic-type, stat count-up,
                              logo sting, lower-third, callout, animated
                              tweet — motion IS the message
  /embedded-captions         ★ Talking-head video → kinetic captions
                              overlay (karaoke, climax, cinematic)
  /graphic-overlays          ★ Talking-head/podcast → kinetic titles,
                              lower-thirds, data callouts, pull-quotes
  /pr-to-video               GitHub PR → code-change explainer
  /general-video             Fallback for any longer/multi-scene piece
  /remotion-to-hyperframes   Port an existing Remotion project over

The motion-graphics skill splits further into 10 sub-categories that map
directly to ad patterns:

  Form (no search): kinetic-type, stat, charts, logo-reveal, lower-thirds
  Search-driven:   webpage, news, tweet, asset-fusion (RWA diegetic)


THE 100+ BLOCK LIBRARY (the actual toolkit to steal from)
---------------------------------------------------------

The full catalog is in registry/registry.json. The ad-critical blocks:

  Social CTAs (drop-in overlays):
    instagram-follow, tiktok-follow, yt-lower-third, x-post,
    reddit-post, spotify-card, macos-notification, app-showcase,
    vpn-youtube-spot, north-korea-locked-down, youtube-spot

  Transitions (30+ — both WebGL shader and CSS):
    Shader (GPU): domain-warp, ridged-burn, whip-pan, sdf-iris,
      ripple-waves, gravitational-lens, cinematic-zoom,
      chromatic-split, swirl-vortex, thermal-distortion,
      flash-through-white, cross-warp-morph, light-leak, glitch
    CSS (13 cats): push/slide, scale/zoom, radial/clip, 3D, dissolve,
      cover/blinds, light, distortion, blur, mechanical, grid,
      destruction, other

  Visual effects (vfx-*): liquid-glass, liquid-background, portal,
    magnetic, shatter, text-cursor, iphone-device

  Caption effects (16 variants — this is the secret weapon):
    caption-pill-karaoke, caption-neon-accent, caption-weight-shift,
    caption-emoji-pop, caption-editorial-emphasis, caption-parallax-layers,
    caption-glitch-rgb, caption-matrix-decode, caption-particle-burst,
    caption-texture, caption-clip-wipe, caption-kinetic-slam,
    caption-gradient-fill, caption-neon-glow, caption-highlight,
    caption-blend-difference

  Cinematic patterns: cinematic-zoom, whip-pan, light-leak,
    whip-pan, code-3d-extrude, code-shader-dissolve, code-particle-assemble,
    blue-sweater-intro-video (the famous Preset/TanStack ad style)

  Composition examples (starters):
    product-promo (20s Figma-style multi-scene: logo-intro → canvas →
      outro with piece-converge + ring pulse), play-mode, swiss-grid,
    vignelli, kinetic-type, decision-tree, nyt-graph, warm-grain,
    vscode-theme-visualizer

Install: `npx hyperframes add <block-name>` — each is a self-contained HTML
sub-composition with its own GSAP timeline on `window.__timelines`.


THE 7 AD-CREATIVE TECHNIQUES TO STEAL (the actual insight)
==========================================================

These are pulled from the explicit "what makes a video look like an ad" rules
in skills/hyperframes-creative/references/ and the motion principles. They are
the single most valuable finding in the repo.

--------------------------------------------------------------------
1. "8-10 elements per scene" density rule (the empty-frame killer)
--------------------------------------------------------------------

From references/video-composition.md (verbatim):
  "A beat with 3 elements looks empty. A beat with 8-10 feels alive."

Every ad scene needs three layers, with element count between 8 and 10:

  - Background texture: radial glow, oversized ghost type (3-8% opacity,
    slow drift), grain, grid, color panel. NEVER solid flat color.
  - Midground content: the actual message (cards, stats, code, image).
  - Foreground accents: dividers, labels, data bars, registration marks,
    monospace metadata. "The details that make it feel produced, not
    generated."

Practical rule: at least TWO of the 8-10 elements are decorative things
the user didn't ask for. Empty frames look broken. This is the single
biggest difference between an ad and a webpage screenshot.

--------------------------------------------------------------------
2. The video-vs-web scale jump (everything is 2-3x larger)
--------------------------------------------------------------------

From references/video-composition.md (exact table):

  Element            | Web          | Video
  -------------------|--------------|--------------
  Headlines          | 32-48px      | 64-120px
  Body text          | 14-16px      | 28-42px
  Labels             | 12px         | 18-24px
  Decorative opacity | 3-8%         | 12-25%
  Borders            | 1px          | 2-4px
  Padding            | 16-32px      | 60-140px

Justify any font-size under 24px in a video composition. Anything
decorative at <10% opacity is invisible. Web-UI card borders/shadows
are invisible on video.

--------------------------------------------------------------------
3. Motion-verb choreography (not "energy level" — verb per element)
--------------------------------------------------------------------

From references/beat-direction.md — this is the ad-creative motion grammar.
The vocabulary is organized by PHYSICAL CHARACTER, not by energy level:

  Impact / weight:     SLAMS, CRASHES, PUNCHES, STAMPS, SHATTERS, DROPS
  Directional:         SLIDES, PUSHES, PULLS, WIPES, CUTS
  Reveals / builds:    DRAWS, FILLS, GROWS, EXPANDS, ASSEMBLES, COUNTS UP
  Organic / ambient:   FLOATS, DRIFTS, BREATHES, PULSES, ORBITS, MORPHS
  Mechanical / precise: TYPES ON, CLICKS, LOCKS IN, SNAPS, STEPS

Every element gets a verb. If you can't name the verb, the element is not
yet designed. The verb should follow from the beat's CONCEPT — not from
a lookup of "high energy" vs "low energy" presets.

Easing is the adverb (transition=verb, easing=adverb):
  - .out for elements entering (responsive default)
  - .in for elements leaving (throws them off)
  - .inOut for elements moving between positions

Speed communicates weight:
  - 0.15-0.3s: energy/urgency/confidence
  - 0.3-0.5s:  professional (most content)
  - 0.5-0.8s:  gravity/luxury/contemplation
  - 0.8-2.0s:  cinematic/emotional/atmospheric

Asymmetry rule: entrances need longer than exits. A card takes 0.4s to
appear but 0.25s to disappear. Hard cuts = disruption. Crossfades = "this
continues."

--------------------------------------------------------------------
4. Scene structure: Build / Breathe / Resolve (not "show everything")
--------------------------------------------------------------------

From references/motion-principles.md — every scene has three phases:

  Build   (0-30%)   Elements enter, staggered. Don't dump everything.
  Breathe (30-70%)  Content visible, alive with ONE ambient motion
                    (a shared drift/pulse/breath, not a unique tween each).
  Resolve (70-100%) Exit or decisive end. Exits are faster than entrances.

Choreography = hierarchy. The element that moves first is perceived as
most important. Stagger in order of importance, not DOM order. Total
stagger sequence under 500ms regardless of item count.

--------------------------------------------------------------------
5. Velocity-matched transitions (the camera-pan illusion)
--------------------------------------------------------------------

From references/beat-direction.md — this is the trick that makes cuts
between scenes look like a single continuous camera move instead of two
edits:

  Exit:  accelerating ease (power2.in or power3.in) + blur ramp
         (e.g. y:-150, blur:30px, 0.33s)
  Entry: decelerating ease (power2.out or power3.out) + blur clear
         (e.g. y:150→0, blur:30px→0, 1.0s)

The fastest point of both easing curves meets at the cut. The viewer
perceives continuous camera motion, not two discrete animations. Match
exit velocity to entry velocity within ~5% tolerance.

Quick-pick patterns:
  Velocity-matched upward: exit (y:-150, blur:30, 0.33s power2.in)
                           → entry (y:150→0, blur:30→0, 1.0s power2.out)
  Whip pan:               exit (x:-400, blur:24, 0.3s power3.in)
                           → entry (x:400→0, blur:24→0, 0.3s power3.out)
  Blur through:           exit (blur:20, 0.3s) → entry (blur:20→0, 0.25s)
  Zoom through:           exit (scale:1→1.2, blur:20, 0.2s)
                           → entry (scale:0.75→1, blur:20→0, 0.5s)
  Hard cut / smash cut:   instant, for rapid-fire sequences

Rule of thumb: 1-2 shader transitions per 5-7-beat brand reel (the hero
reveal + the CTA). Too many flatten their impact.

--------------------------------------------------------------------
6. The lazy-default list (kill the AI design tells)
--------------------------------------------------------------------

From references/house-style.md — these patterns are "the first thing
every LLM reaches for." If you're about to use one, pause and ask if
it's a deliberate choice or a default:

  - Gradient text (background-clip:text + gradient)
  - Left-edge accent stripes on cards/callouts
  - Cyan-on-dark / purple-to-blue gradients / neon accents
  - Pure #000 or #fff (tint toward your accent hue instead)
  - Identical card grids (same-size cards repeated)
  - Everything centered with equal weight (lead the eye somewhere)
  - Banned fonts: Inter, Roboto, Open Sans, Noto Sans, Lato, Nunito,
    Poppins, Outfit, Sora, Playfair Display, Cormorant Garamond,
    Bodoni Moda, EB Garamond, Cinzel, Prata, Syne (Syne is the
    most-overused "distinctive" display font — an instant AI tell)

Production tips the doc hammers on:
  - One accent hue. Same background across all scenes.
  - Tint neutrals toward your accent (even subtle beats dead gray).
  - Don't pair two sans-serifs (cross the boundary: serif+sans, or
    sans+mono).
  - One expressive font per scene — one performs, one recedes.
  - Weight contrast must be extreme: 300 vs 900 (not 400 vs 700).
  - Body 20px minimum. Headlines 60px+. Data labels 16px minimum.
  - Tracking tighter than web: -0.03em to -0.05em on display sizes.
  - Fixed reading time: 3s on screen = must be readable in 2.
  - Light canvases: 2px+ borders, structural elements, full-saturation
    accent hits, grain/pattern texture (NOT switch to dark).
  - No full-screen linear gradients on dark backgrounds (banding under
    H.264). Use radial gradient / solid / solid+localized glow.

--------------------------------------------------------------------
7. The "produced, not generated" details
--------------------------------------------------------------------

The signal that a video is a real ad and not an LLM render: foreground
metadata. Data bars. Registration marks. Monospace readouts. 8-10
elements per scene where 2 are decorative things the user didn't ask
for. This is the difference between a slide and a moment.

Concrete template: "Camera is already mid-flight over a vast dark
canvas. The gradient wave sweeps across the frame like aurora borealis —
alive, shifting. '$1.9T' SLAMS into existence with such force the wave
ripples in response. This isn't a slide — it's a moment."

Then write the pixels from there. This "describe the experience, then
build the CSS" workflow is the meta-rule: storyboard the experience in
2-3 sentences per beat (concept, mood references like "Josef Albers /
Bauhaus color studies" not hex codes, animation verbs per element,
transition type, depth layers, SFX cues) BEFORE writing any HTML.

A great beat:
  "Dark navy background. '$1.9T' in white, 280px. Logo top-left.
   Wave image bottom-right."

A mediocre beat:
  "Camera is already mid-flight over a vast dark canvas. The gradient
   wave sweeps across the frame like aurora borealis — alive, shifting.
   '$1.9T' SLAMS into existence with such force the wave ripples in
   response. This isn't a slide — it's a moment."

The first describes pixels. The second describes an experience. Write
the second, then figure out the pixels.


ONE BONUS INSIGHT (from the caption library)
--------------------------------------------

The 16 caption-effect variants in registry/components/ are essentially
a complete taxonomy of how to make on-screen text feel alive and ad-like
rather than subtitle-like. The names map to recognizable ad patterns:

  - caption-kinetic-slam     — large words that hit the frame
  - caption-neon-glow        — premium/tech/gaming energy
  - caption-emoji-pop        — casual/social
  - caption-editorial-emphasis — NYT/documentary restraint
  - caption-glitch-rgb       — tech/cyberpunk
  - caption-matrix-decode    — reveal moment
  - caption-particle-burst   — celebration/release
  - caption-clip-wipe        — direction-revealing
  - caption-parallax-layers  — depth
  - caption-weight-shift     — emphasis via font-weight animation
  - caption-pill-karaoke     — TikTok-style word-by-word highlight
  - caption-gradient-fill    — premium brand reveal
  - caption-blend-difference — artistic/dreamy

The technique itself: bind caption text to timecoded audio bands, animate
the per-word transform/style on each word's energy peak. The full
code-snippet patterns are in registry/blocks/code-snippet-* (20 variants
of stylized code blocks for "build in public" / dev-tooling ads).


HOW THIS DIFFERS FROM OTHER APPROACHES
--------------------------------------

vs. Remotion: same renderer (Puppeteer+FFmpeg), different authoring.
  Remotion = React components. HyperFrames = plain HTML+CSS+GSAP.
  Remotion needs a bundler. HyperFrames is "no build step" — index.html
  plays as-is. Critical for AI-agent handoff: agents already write HTML.
  HyperFrames is Apache 2.0; Remotion is source-available (commercial).

vs. After Effects / Motion / Premiere: AE-style is timeline+keyframe-by-
  keyframe, manual. HyperFrames is procedural — express the motion
  intent (slide-in from bottom, hold 1s, button press at 1.0s, spring
  release, color shift) and the seekable engine renders it frame-
  accurately every time. Same input = same output. Built for CI and
  agent-driven iteration.

vs. Runway / Pika / Sora (generative video): generative gives you
  shot-by-shot video you can't precisely control. HyperFrames gives
  you precise, frame-accurate, deterministic motion — usable in
  CI/regression/automated content pipelines. You can use generative
  video as a SOURCE inside a HyperFrames composition (e.g. the
  asset-fusion category: search/generate the asset, then animate it
  with precise control).

vs. Canva/Captions.ai: those are template GUIs. HyperFrames is code.
  Trade-off: HyperFrames requires HTML+GSAP knowledge, but you get
  full control, determinism, agent-handoff, and a real production-grade
  catalog of 100+ blocks.


INTEGRATION PLAN FOR OUR VIDEO-AD PIPELINE
------------------------------------------

Top-priority blocks to study-and-port (in order of ROI):

  1. registry/blocks/instagram-follow/  — proven IG CTA pattern
     (4.5s, slide-in + button press + spring + color flip + follow swap)
  2. registry/blocks/yt-lower-third/    — proven YouTube CTA pattern
  3. registry/blocks/spotify-card/      — recognizable "now playing" mock
  4. registry/examples/product-promo/   — full 5-scene product ad reference
  5. registry/blocks/cinematic-zoom/    — 12-sample RGB-offset zoom blur
     (a transition you'd see in any real ad — direct steal)
  6. registry/blocks/whip-pan/          — 10-sample motion blur + lateral
     crossfade (reads as a camera pan between shots)
  7. registry/blocks/code-3d-extrude/   — the "code typing" pattern
     every dev-tooling ad uses
  8. The 16 caption-* components in registry/components/ — pick 3-4
     and bind them to our audio tracks for kinetic text overlays
  9. The motion verbs + scale table from skills/hyperframes-creative/
     references/ — paste into our prompt template as the "ad grammar"
     the LLM should follow

The creative-direction docs (house-style, video-composition,
beat-direction, motion-principles, typography) are the most valuable
single artifact. The full skill tree is in skills/hyperframes-creative/
references/. Worth reading all of them before generating the next batch
of ads.


REFERENCES (paths inside the repo, all under Apache 2.0)
--------------------------------------------------------

  skills/AGENTS.md                                  — routing table
  skills/hyperframes/SKILL.md                       — entry skill
  skills/hyperframes-creative/SKILL.md              — creative direction
  skills/hyperframes-creative/references/video-composition.md
  skills/hyperframes-creative/references/house-style.md
  skills/hyperframes-creative/references/composition-patterns.md
  skills/hyperframes-creative/references/beat-direction.md
  skills/hyperframes-creative/references/motion-principles.md
  skills/hyperframes-creative/references/typography.md
  skills/hyperframes-creative/references/visual-styles.md
  skills/hyperframes-creative/references/narration.md
  skills/motion-graphics/SKILL.md                   — ad-category taxonomy
  skills/motion-graphics/categories/                — 10 sub-playbooks
  registry/registry.json                            — 100+ block index
  registry/blocks/                                  — installable blocks
  registry/components/                              — caption + effects
  registry/examples/product-promo/                  — full ad reference
