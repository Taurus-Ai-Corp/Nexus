#!/usr/bin/env node
/**
 * process-ambient-video.mjs — Post-processing and content-hashing pipeline for Phase 5 ambient hero video.
 *
 * Implements Phase 5 requirements:
 * 1. Self-crossfade for seamless loop (ffmpeg split + xfade)
 * 2. H.264 MP4 with +faststart, CRF 23, -an
 * 3. VP9 WebM derivative
 * 4. High-quality WebP poster (LCP element)
 * 5. Content-hashing: emits ambient.<sha256[:8]>.[mp4|webm|webp]
 * 6. Generates manifest.json for build-pages.mjs
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const platform = join(here, '..');
const assetsVideoDir = join(platform, 'assets', 'video');
const tmpDir = join(here, 'tmp');

mkdirSync(assetsVideoDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

export function processVideo(rawInputPath) {
  console.log(`Processing ambient video from: ${rawInputPath}`);

  // Probe duration
  const probeOut = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${rawInputPath}"`,
    { encoding: 'utf8' }
  ).trim();
  const rawDuration = parseFloat(probeOut);
  console.log(`Raw video duration: ${rawDuration.toFixed(2)}s`);

  const fadeDuration = 0.5;
  const mainEnd = Math.floor(rawDuration * 10) / 10; // e.g. 5.0s
  const mainDuration = mainEnd - fadeDuration;      // e.g. 4.5s
  const xfadeOffset = mainDuration - fadeDuration;   // e.g. 4.0s
  const loopedMp4 = join(tmpDir, 'looped.mp4');
  const loopedWebm = join(tmpDir, 'looped.webm');
  const posterWebp = join(tmpDir, 'poster.webp');

  // 1. Self-crossfade seamless loop
  console.log(`Crossfading with fade=${fadeDuration}s, mainEnd=${mainEnd}s, offset=${xfadeOffset.toFixed(2)}s...`);
  const filtergraph = `[0:v]split=2[v1][v2]; [v1]trim=start=${fadeDuration}:end=${mainEnd},setpts=PTS-STARTPTS[main]; [v2]trim=start=0:end=${fadeDuration},setpts=PTS-STARTPTS[head]; [main][head]xfade=transition=fade:duration=${fadeDuration}:offset=${xfadeOffset.toFixed(2)}[outv]`;
  execSync(
    `ffmpeg -v error -y -i "${rawInputPath}" -filter_complex "${filtergraph}" -map "[outv]" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an "${loopedMp4}"`
  );

  // 2. WebM derivative
  console.log('Generating WebM VP9 derivative...');
  execSync(
    `ffmpeg -v error -y -i "${loopedMp4}" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -cpu-used 2 -an "${loopedWebm}"`
  );

  // 3. WebP poster
  console.log('Generating WebP poster frame...');
  const posterPng = join(tmpDir, 'poster_frame.png');
  execSync(`ffmpeg -v error -y -ss 00:00:01 -i "${loopedMp4}" -vframes 1 "${posterPng}"`);
  execSync(`cwebp -q 85 "${posterPng}" -o "${posterWebp}"`);

  // 4. Compute SHA-256 hash of looped MP4
  const mp4Buffer = readFileSync(loopedMp4);
  const hash = createHash('sha256').update(mp4Buffer).digest('hex').slice(0, 8);
  console.log(`Generated content hash: ${hash}`);

  // 5. Emit hashed assets
  const targetMp4 = join(assetsVideoDir, `ambient.${hash}.mp4`);
  const targetWebm = join(assetsVideoDir, `ambient.${hash}.webm`);
  const targetWebp = join(assetsVideoDir, `ambient.${hash}.webp`);

  copyFileSync(loopedMp4, targetMp4);
  copyFileSync(loopedWebm, targetWebm);
  copyFileSync(posterWebp, targetWebp);

  const mp4Size = statSync(targetMp4).size;
  const webmSize = statSync(targetWebm).size;
  const webpSize = statSync(targetWebp).size;

  console.log(`Target MP4:  ${targetMp4} (${(mp4Size / 1024).toFixed(1)} KB)`);
  console.log(`Target WebM: ${targetWebm} (${(webmSize / 1024).toFixed(1)} KB)`);
  console.log(`Target WebP: ${targetWebp} (${(webpSize / 1024).toFixed(1)} KB)`);

  const manifest = {
    hash,
    mp4: `/assets/video/ambient.${hash}.mp4`,
    webm: `/assets/video/ambient.${hash}.webm`,
    poster: `/assets/video/ambient.${hash}.webp`,
    duration: mainDuration,
    sizes: {
      mp4: mp4Size,
      webm: webmSize,
      webp: webpSize,
    },
    generatedAt: new Date().toISOString(),
  };

  const manifestPath = join(assetsVideoDir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Wrote manifest to ${manifestPath}`);

  return manifest;
}

// Run from CLI if argument provided
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node process-ambient-video.mjs <raw-video-path>');
    process.exit(1);
  }
  processVideo(input);
}
