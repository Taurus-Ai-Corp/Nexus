#!/usr/bin/env node
//
// check-pages-limits.mjs — fail the build before Cloudflare does.
//
//   node scripts/check-pages-limits.mjs .
//
// Cloudflare Pages Free plan hard limits, verified 2026-08-31 against
// https://developers.cloudflare.com/pages/platform/limits/ :
//   - 25 MiB maximum per single site asset
//   - 20,000 files per site (Free; 100,000 on paid with PAGES_WRANGLER_MAJOR_VERSION=4)
//   - 100 rules in _headers, 2,100 rules in _redirects
//
// A 26 MiB file does not fail loudly at deploy time in a way anyone notices —
// it fails as a 404 on one asset while every page still returns 200. That is
// exactly the class of silent regression tests/deploy-safety.test.js exists for.

import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.argv[2] ?? ".";

const FILE_CAP = 25 * 1024 * 1024; // 25 MiB
const FILE_COUNT_CAP = 20_000; // Free plan
const HEADER_RULE_CAP = 100;
const REDIRECT_RULE_CAP = 2100;

// Mirrors what wrangler excludes from a Pages upload — which is .assetsignore,
// NOT this list. Keep the two in sync; tests/assetsignore-parity.test.js fails
// if they drift.
//
// They did drift, and it mattered: this set skipped "scripts" while
// .assetsignore did not, so everything under platform/scripts/ shipped to
// production without ever being size-checked — including scripts/tmp/, where
// process-ambient-video.mjs leaves ~4.5 MB of intermediates (raw.mp4 is the
// ungraded Higgsfield master). A skipped directory that still uploads is the
// exact silent failure this gate exists to prevent.
//
// ".git" is listed here but not in .assetsignore because wrangler excludes it
// unconditionally; the parity test knows about that one exception.
const SKIP = new Set([
  "node_modules",
  ".git",
  ".vercel",
  "functions",
  "tests",
  "scripts",
  "prototype",
  // Files, not directories. All three were being SERVED from the production
  // origin — verified 2026-09-11 against neorm-era.com:
  //   /package.json       200 application/json,    287 b
  //   /package-lock.json  200 application/json, 10,947 b  (full dep tree,
  //                       exact versions — the useful one for an attacker
  //                       matching known CVEs)
  //   /.assetsignore      200,                     47 b  (the exclusion list
  //                       itself, which is its own small joke)
  // A static marketing site needs none of them at runtime.
  "package.json",
  "package-lock.json",
  ".assetsignore",
]);

const failures = [];
let count = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    count += 1;
    const { size } = statSync(full);
    if (size > FILE_CAP) {
      failures.push(
        `${relative(ROOT, full)} is ${(size / 1048576).toFixed(1)} MiB — over the 25 MiB ` +
          `Pages asset cap. Move it to R2 and reference it from media.neorm-era.com.`,
      );
    }
  }
}

walk(ROOT);

if (count > FILE_COUNT_CAP) {
  failures.push(`${count} files — over the ${FILE_COUNT_CAP} file cap on the Pages Free plan.`);
}

function countRules(file, cap, label) {
  const path = join(ROOT, file);
  if (!existsSync(path)) return;
  const rules = readFileSync(path, "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && /^\s/.test(l)).length;
  if (rules > cap) failures.push(`${file} has ${rules} ${label} rules — over the ${cap} cap.`);
}

countRules("_headers", HEADER_RULE_CAP, "header");
countRules("_redirects", REDIRECT_RULE_CAP, "redirect");

if (failures.length) {
  console.error("Cloudflare Pages limit violations:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`Pages limits OK — ${count} files, all under 25 MiB.`);
