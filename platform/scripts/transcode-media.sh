#!/usr/bin/env bash
#
# transcode-media.sh — masters -> web delivery renditions.
#
# The same script runs locally and in CI. Given the same masters and the same
# pinned ffmpeg build it produces byte-identical output, which is what lets a
# Pages deployment be reproduced from a commit.
#
#   ./scripts/transcode-media.sh <masters-dir> <out-dir>
#
# Output naming is CONTENT-ADDRESSED: <name>-<tier>-<first 8 of master sha256>.mp4
# A changed master therefore yields a new URL. Combined with the immutable
# Cache-Control on /assets/* this makes it impossible for a replaced file to
# silently shadow the old one — the drift failure mode this repo already hit
# once with design-system.css.
#
# Tier policy (measured on assets/biofoundry-master-dark.mp4, 54.05s 1080p30):
#
#   tier      settings                        bytes        Pages 25 MiB cap
#   scrub1080 1920 crf26 g15 30fps            33.0 MB      OVER  -> R2
#   scrub1080 1920 crf28 g12 24fps            26.85 MB     OVER  -> R2
#   scrub720  1280 crf27 g15 30fps            17.6 MB      fits  -> git/Pages
#
# VP9 was measured too (1280 crf36 g15) at 35 MB — LARGER than H.264 here,
# because a 0.5s keyframe interval destroys VP9's inter-frame advantage.
# Do not add a WebM tier for scrub content.
#
# Why g=15 / g=12: scroll-scrubbing seeks to arbitrary timestamps. The browser
# must decode from the nearest preceding keyframe, so keyframe spacing is the
# scrub latency. 0.5s spacing is the usable ceiling; sc_threshold=0 forces the
# spacing to be uniform instead of scene-driven.

set -euo pipefail

MASTERS_DIR="${1:?usage: transcode-media.sh <masters-dir> <out-dir>}"
OUT_DIR="${2:?usage: transcode-media.sh <masters-dir> <out-dir>}"

PAGES_FILE_CAP=26214400 # 25 MiB, Cloudflare Pages hard per-asset limit

mkdir -p "$OUT_DIR"

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1
  else shasum -a 256 "$1" | cut -d' ' -f1; fi
}

filesize() {
  if stat --version >/dev/null 2>&1; then stat -c %s "$1"; else stat -f %z "$1"; fi
}

FFMPEG_VERSION="$(ffmpeg -version | head -1)"
entries=()

shopt -s nullglob
for master in "$MASTERS_DIR"/*.mp4 "$MASTERS_DIR"/*.mov; do
  base="$(basename "${master%.*}")"
  msum="$(sha256 "$master")"
  short="${msum:0:8}"

  echo "==> $base (master sha256 ${short})"

  # --- 720p scrub tier: ships inside the Pages deployment -------------------
  o720="$OUT_DIR/${base}-scrub720-${short}.mp4"
  [ -f "$o720" ] || ffmpeg -nostdin -y -v error -i "$master" \
    -an -vf "scale=1280:-2,fps=30" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 27 -preset slow \
    -g 15 -keyint_min 15 -sc_threshold 0 \
    -movflags +faststart "$o720"

  # --- 1080p scrub tier: too large for Pages, goes to R2 -------------------
  o1080="$OUT_DIR/${base}-scrub1080-${short}.mp4"
  [ -f "$o1080" ] || ffmpeg -nostdin -y -v error -i "$master" \
    -an -vf "scale=1920:-2,fps=30" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 26 -preset slow \
    -g 15 -keyint_min 15 -sc_threshold 0 \
    -movflags +faststart "$o1080"

  # --- poster: the first frame, so the hero paints before any video byte ---
  oposter="$OUT_DIR/${base}-poster-${short}.avif"
  [ -f "$oposter" ] || ffmpeg -nostdin -y -v error -i "$master" \
    -frames:v 1 -vf "scale=1920:-2" -c:v libaom-av1 -crf 34 -still-picture 1 \
    "$oposter" 2>/dev/null || ffmpeg -nostdin -y -v error -i "$master" \
    -frames:v 1 -vf "scale=1920:-2" -q:v 6 "${oposter%.avif}.jpg"

  for f in "$o720" "$o1080" "$OUT_DIR/${base}-poster-${short}."*; do
    [ -f "$f" ] || continue
    sz="$(filesize "$f")"
    tier="pages"
    [ "$sz" -gt "$PAGES_FILE_CAP" ] && tier="r2"
    entries+=("$(printf '{"file":"%s","master":"%s","master_sha256":"%s","bytes":%s,"sha256":"%s","host":"%s"}' \
      "$(basename "$f")" "$(basename "$master")" "$msum" "$sz" "$(sha256 "$f")" "$tier")")
    printf '    %-52s %10s bytes  -> %s\n' "$(basename "$f")" "$sz" "$tier"
  done
done
shopt -u nullglob

{
  printf '{\n  "generated_by": %s,\n' "$(printf '%s' "$FFMPEG_VERSION" | sed 's/"/\\"/g;s/.*/"&"/')"
  printf '  "pages_file_cap_bytes": %s,\n' "$PAGES_FILE_CAP"
  printf '  "renditions": [\n'
  for i in "${!entries[@]}"; do
    printf '    %s' "${entries[$i]}"
    [ "$i" -lt $((${#entries[@]} - 1)) ] && printf ','
    printf '\n'
  done
  printf '  ]\n}\n'
} > "$OUT_DIR/manifest.json"

echo "==> wrote $OUT_DIR/manifest.json (${#entries[@]} renditions)"
