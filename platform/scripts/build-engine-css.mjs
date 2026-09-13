#!/usr/bin/env node
/**
 * build-engine-css.mjs — generate assets/css/engines.css from
 * lib/engine-identity.mjs, the same way build-tokens.mjs generates tokens.css.
 *
 *   node scripts/build-engine-css.mjs          # write
 *   node scripts/build-engine-css.mjs --check  # exit 1 if the file is stale
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { engineCss } from '../lib/engine-identity.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets/css/engines.css');
const next = engineCss();

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* missing counts as stale */ }
  if (current !== next) {
    console.error('assets/css/engines.css is stale. Run: node scripts/build-engine-css.mjs');
    process.exit(1);
  }
  console.log('engines.css is current.');
} else {
  writeFileSync(OUT, next);
  console.log(`wrote ${OUT.slice(ROOT.length + 1)} (${next.split('\n').length} lines)`);
}
