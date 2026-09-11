#!/usr/bin/env bash
# Phase 0.4 derivative pipeline — NEXUS-CORE video-first integration
# Sources: ~/Downloads (8 Envato IDs + GRIDERA Marketing-3.mp4)
# Vision-verified trim windows (decode-accurate passes, 2026-08-31):
#   M3  354.6s: clean = 119.5-128.5 polyhedron void | 138-149.5 globe-vortex-gear | 154-158 cube-chain
#               watermark bottom-right (NotebookLM) -> crop 1280x620:0:50 removes it
#   54939003 28.7s: frame0 black fade-in -> poster @6s; hero 0-28.6 full + 80% center crop (vignette fix)
#   63655991 24.2s: hero 0-13s (clean teal)
#   49539430 20.1s: full as loop
#   32438588 28.7s: 21:9 crop=1920:822:0:129 (hide bottom watermark) + full
#   57594338 23.7s: 540p source - ship as-is + 540 only (social cuts, not hero)
#   60284235 70.0s: hero 21-33s (avoids 14-20s "Minimalist Design" text), poster @22
#   56452417 67.9s: hero 0-12s (zero envato cards start 32s), poster @2
#   56369168 113.6s: chapters 0-30 / 30-60 / 60-100, hero 0-13, SKIP 100-113 endcard
set -euo pipefail
DL=/Users/taurus_ai/Downloads
V=/Users/taurus_ai/Documents/NEXUS-CORE/video-analysis
OUT=/Users/taurus_ai/Documents/NEXUS-CORE/platform/public/video
GRL=/Users/taurus_ai/Documents/HEDERA/gridera-platform/apps/landing/public/video
GRC=/Users/taurus_ai/Documents/HEDERA/gridera-platform/apps/comply/public/video
mkdir -p "$OUT"/{gridera-hero,master-4k,creative,social,intel,flow,estate,seo,freelance} "$GRL"/{hero,master-4k} "$GRC"/{comply,scan,guard,certify} "$V"/tmp

enc_mp4() { # src out [filters]  -> crf26 faststart mp4, no audio
  ffmpeg -v error -y -i "$1" $3 -c:v libx264 -crf 26 -preset fast -pix_fmt yuv420p -an -movflags +faststart "$2"
}
enc_webm() { # src out [filters]
  ffmpeg -v error -y -i "$1" $3 -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 -an "$2"
}
enc_540() { # src out [filters]
  ffmpeg -v error -y -i "$1" $3 -vf "scale=960:-2" -c:v libx264 -crf 28 -preset fast -pix_fmt yuv420p -an -movflags +faststart "$2"
}
poster() { # src out at t
  ffmpeg -v error -y -i "$1" -ss "$3" -frames:v 1 -q:v 3 "$2"
}

echo "== 1. M3 gridera hero loop =="
M3="$DL/GRIDERA Marketing-3.mp4"
# segments: INPUT-side -ss/-t is REQUIRED. Output-side -ss runs the filtergraph over
# the whole file first, so fade=t=out:st=N blacks every frame past N and the trim then
# selects frames long past it -> pure black output. Verified 2026-08-31.
ffmpeg -v error -y -ss 119.5 -t 9 -i "$M3" -vf "crop=1280:620:0:50,fade=t=in:d=0.6,fade=t=out:st=8.4:d=0.6" -c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p -an "$V/derivs/m3_seg1.mp4"
ffmpeg -v error -y -ss 138 -t 11.5 -i "$M3" -vf "crop=1280:620:0:50,fade=t=in:d=0.6,fade=t=out:st=10.4:d=0.6" -c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p -an "$V/derivs/m3_seg2.mp4"
ffmpeg -v error -y -ss 154 -t 4 -i "$M3" -vf "crop=1280:620:0:50,fade=t=in:d=0.6,fade=t=out:st=3.4:d=0.6" -c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p -an "$V/derivs/m3_seg3.mp4"
printf "file '%s'\nfile '%s'\nfile '%s'\n" "$V/derivs/m3_seg1.mp4" "$V/derivs/m3_seg2.mp4" "$V/derivs/m3_seg3.mp4" > "$V/derivs/m3_concat.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$V/derivs/m3_concat.txt" -c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p -an "$V/derivs/m3_join.mp4"
# slowdown 1.4x -> ~29s loop
ffmpeg -v error -y -i "$V/derivs/m3_join.mp4" -vf "setpts=1.4*PTS" -fps_mode cfr -r 30 -c:v libx264 -crf 26 -preset fast -pix_fmt yuv420p -an "$V/derivs/m3_loop.mp4"
cp -f "$V/derivs/m3_loop.mp4" "$OUT/gridera-hero/loop.mp4"
cp -f "$V/derivs/m3_loop.mp4" "$GRL/hero/loop.mp4"
enc_webm "$V/derivs/m3_join.mp4" "$OUT/gridera-hero/loop.webm" "-vf setpts=1.4*PTS,fps=30,crop=1280:620:0:50"
cp -f "$OUT/gridera-hero/loop.webm" "$GRL/hero/loop.webm"
enc_540 "$V/derivs/m3_join.mp4" "$OUT/gridera-hero/loop-540.mp4" "-vf setpts=1.4*PTS,fps=30,crop=1280:620:0:50"
poster "$V/derivs/m3_join.mp4" "$OUT/gridera-hero/poster.jpg" 7.5
cp -f "$OUT/gridera-hero/poster.jpg" "$GRL/hero/poster.jpg"

echo "== 2. 54939003 master 4K =="
S="$DL/54939003.mp4"
enc_mp4 "$S" "$OUT/master-4k/master-c80.mp4" "-vf crop=3072:1728:384:216"
enc_mp4 "$S" "$OUT/master-4k/master-1080.mp4" "-vf scale=1920:1080"
enc_webm "$S" "$OUT/master-4k/master-1080.webm" "-vf scale=1920:1080"
enc_540 "$S" "$OUT/master-4k/master-540.mp4" ""
poster "$S" "$OUT/master-4k/poster.jpg" 6
cp -f "$OUT/master-4k/master-c80.mp4" "$OUT/gridera-hero/master-c80.mp4"
cp -f "$OUT/master-4k/master-c80.mp4" "$GRL/master-4k/master-c80.mp4"
cp -f "$OUT/master-4k/master-1080.mp4" "$GRL/master-4k/master-1080.mp4"
cp -f "$OUT/master-4k/poster.jpg" "$GRL/master-4k/poster.jpg"

echo "== 3. 63655991 -> creative =="
S="$DL/63655991.mp4"
enc_mp4 "$S" "$OUT/creative/hero.mp4" "-t 13"
enc_webm "$S" "$OUT/creative/hero.webm" "-t 13"
enc_540 "$S" "$OUT/creative/hero-540.mp4" "-t 13"
poster "$S" "$OUT/creative/poster.jpg" 0.5

echo "== 4. 49539430 -> social (glass) + comply/certify =="
S="$DL/49539430.mp4"
enc_mp4 "$S" "$OUT/social/glass.mp4" ""
enc_webm "$S" "$OUT/social/glass.webm" ""
enc_540 "$S" "$OUT/social/glass-540.mp4" ""
poster "$S" "$OUT/social/glass-poster.jpg" 1
enc_mp4 "$S" "$GRC/certify/glass.mp4" ""
enc_webm "$S" "$GRC/certify/glass.webm" ""

echo "== 5. 32438588 -> seo (21:9 letterbox) + comply accent =="
S="$DL/32438588.mp4"
enc_mp4 "$S" "$OUT/seo/hero-219.mp4" "-vf crop=1920:822:0:129"
enc_webm "$S" "$OUT/seo/hero-219.webm" "-vf crop=1920:822:0:129"
enc_540 "$S" "$OUT/seo/hero-219-540.mp4" "-vf crop=1920:822:0:129"
poster "$S" "$OUT/seo/poster-219.jpg" 1
enc_mp4 "$S" "$GRC/comply/duotone.mp4" "-t 12 -vf crop=1920:822:0:129"
enc_webm "$S" "$GRC/comply/duotone.webm" "-vf crop=1920:822:0:129"

echo "== 6. 57594338 -> social (540p source, as-is) =="
S="$DL/57594338.mp4"
enc_mp4 "$S" "$OUT/social/violet-540.mp4" ""
enc_webm "$S" "$OUT/social/violet-540.webm" ""
poster "$S" "$OUT/social/violet-poster.jpg" 1

echo "== 7. 60284235 -> flow (hero 21-33) + scan card + freelance =="
S="$DL/60284235.mp4"
enc_mp4 "$S" "$OUT/flow/hero.mp4" "-ss 21 -to 33"
enc_webm "$S" "$OUT/flow/hero.webm" "-ss 21 -to 33"
enc_540 "$S" "$OUT/flow/hero-540.mp4" "-ss 21 -to 33"
poster "$S" "$OUT/flow/poster.jpg" 22
enc_mp4 "$S" "$GRC/scan/cards.mp4" "-ss 21 -to 33"
enc_webm "$S" "$GRC/scan/cards.webm" "-ss 21 -to 33"
cp -f "$OUT/flow/hero.mp4" "$OUT/freelance/hero.mp4"
cp -f "$OUT/flow/hero.webm" "$OUT/freelance/hero.webm"
cp -f "$OUT/flow/poster.jpg" "$OUT/freelance/poster.jpg"

echo "== 8. 56452417 -> intel (hero 0-12) + guard =="
S="$DL/56452417.mp4"
enc_mp4 "$S" "$OUT/intel/hero.mp4" "-t 12"
enc_webm "$S" "$OUT/intel/hero.webm" "-t 12"
enc_540 "$S" "$OUT/intel/hero-540.mp4" "-t 12"
poster "$S" "$OUT/intel/poster.jpg" 2
enc_mp4 "$S" "$GRC/guard/editorial.mp4" "-t 12"
enc_webm "$S" "$GRC/guard/editorial.webm" "-t 12"

echo "== 9. 56369168 -> estate (skip 100-113 endcard) =="
S="$DL/56369168.mp4"
enc_mp4 "$S" "$OUT/estate/hero.mp4" "-t 13"
enc_webm "$S" "$OUT/estate/hero.webm" "-t 13"
enc_540 "$S" "$OUT/estate/hero-540.mp4" "-t 13"
poster "$S" "$OUT/estate/poster.jpg" 4
for c in 1:0:30 2:30:60 3:60:100; do
  n=${c%%:*}; r=${c#*:}; a=${r%%:*}; b=${r#*:}
  enc_mp4 "$S" "$OUT/estate/chapter-$n.mp4" "-ss $a -to $b"
  enc_webm "$S" "$OUT/estate/chapter-$n.webm" "-ss $a -to $b"
done
poster "$S" "$OUT/estate/chapter-1-poster.jpg" 15
poster "$S" "$OUT/estate/chapter-2-poster.jpg" 45
poster "$S" "$OUT/estate/chapter-3-poster.jpg" 75

echo "== DONE =="
du -sh "$OUT" "$GRL" "$GRC" 2>/dev/null