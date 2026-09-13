#!/usr/bin/env node
/**
 * stamp-assets.mjs — make `immutable` honest.
 *
 * `_headers` serves /assets/* with `public, max-age=31536000, immutable`, but
 * the filenames carry no content hash. design-system.css is always the same
 * URL, so a deploy CANNOT invalidate it: Cloudflare and every returning
 * browser keep serving last week's stylesheet for up to a year.
 *
 * Measured on production 2026-09-13 — the site was serving a 25,692-byte
 * stylesheet while the deployment contained the 33,957-byte one,
 * `cf-cache-status: HIT`, and a shipped nav fix was invisible to every
 * visitor. Every CSS and JS change since that header rule landed had the
 * same problem.
 *
 * A cache purge does not fix it on its own: `immutable` binds browsers too, so
 * anyone who already loaded the page keeps the stale file until the year
 * elapses. The only thing that reliably busts it is a different URL.
 *
 * So every local /assets/{css,js}/ reference gets `?v=<first 8 of sha256>`.
 * The URL changes exactly when the bytes change — which is precisely the
 * promise `immutable` makes, so the header stops being a lie.
 *
 * This self-heals without a purge because the HTML is not cached: Pages serves
 * pages as `public, max-age=0, must-revalidate` (verified against
 * neorm-era.com). A visitor always fetches current HTML, and that HTML points
 * at a URL nothing has ever cached.
 *
 * Assets whose NAME already carries a hash (ambient.2b43ddea.webp) are left
 * alone — already immutable-safe, and stamping them would churn the diff for
 * nothing.
 *
 *   node scripts/stamp-assets.mjs          # rewrite in place
 *   node scripts/stamp-assets.mjs --check  # exit 1 if any stamp is stale
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Pages that ship as the marketing site. Listed literally rather than walked,
 * for the same reason build-pages.mjs keeps PAGES_CONFIG explicit: adding a
 * page should be a deliberate act. campaigns/petpawsphere-*\/ and assets/*.html
 * are standalone artifacts with their own styling and are excluded.
 *
 * An explicit list can go stale, and did: campaigns/thanks.html ships and
 * references tokens.css but was missed on the first pass. The guard is
 * tests/asset-versioning.test.js, which scans EVERY shipped page rather than
 * this list, so an omission here fails the suite instead of shipping.
 */
export const PAGES = [
  "404.html", "about.html", "case-studies.html", "checkout.html", "contact.html", "index.html",
  "pricing.html", "privacy.html", "security.html", "terms.html",
  "creative/index.html", "social/index.html", "intel/index.html",
  "freelance/index.html", "flow/index.html", "estate/index.html",
  "seo/index.html", "campaigns/index.html", "campaigns/thanks.html",
];

/**
 * Local css/js reference, with or without a stamp already applied.
 *
 * Three spellings are in use across the site and all three must match, which
 * the first version of this regex got wrong: root-absolute `/assets/js/x.js`
 * (index.html, pricing.html), same-dir `assets/css/x.css` (root pages), and
 * parent `../assets/css/x.css` (engine subdirectories). Missing the absolute
 * form silently left currency.js and video-hero.js unstamped — the exact
 * files whose staleness started this.
 */
const REF = /(href|src)="(\/?(?:\.\.\/)*assets\/(?:css|js)\/[^"?]+)(?:\?v=[0-9a-f]+)?"/g;

/** sha256 of a file's bytes, first 8 hex chars. Cached per run. */
export function assetVersion(absPath, cache = new Map()) {
  if (!cache.has(absPath)) {
    cache.set(absPath, createHash("sha256").update(readFileSync(absPath)).digest("hex").slice(0, 8));
  }
  return cache.get(absPath);
}

/**
 * Rewrite every resolvable asset reference in `html` to carry its current
 * version. `htmlPath` is the absolute path of the page, so that `../assets/…`
 * from an engine subdirectory resolves correctly.
 */
export function stampHtml(html, htmlPath, cache = new Map()) {
  const pageDir = dirname(htmlPath);
  return html.replace(REF, (whole, attr, path) => {
    // A leading slash is site-root-relative, so it resolves against ROOT and
    // NOT against the page's directory — resolving "/assets/…" with the page
    // dir would escape to the filesystem root.
    const abs = path.startsWith("/") ? join(ROOT, path.slice(1)) : resolve(pageDir, path);
    try {
      return `${attr}="${path}?v=${assetVersion(abs, cache)}"`;
    } catch {
      // Unresolvable reference: a broken link, not this script's business.
      // Leave it untouched so the existing link tests still catch it.
      return whole;
    }
  });
}

function main() {
  const check = process.argv.includes("--check");
  const cache = new Map();
  const stale = [];
  let changed = 0;

  for (const rel of PAGES) {
    const abs = join(ROOT, rel);
    let html;
    try {
      html = readFileSync(abs, "utf8");
    } catch {
      continue; // page absent from this tree
    }
    const next = stampHtml(html, abs, cache);
    if (next === html) continue;
    if (check) stale.push(rel);
    else {
      writeFileSync(abs, next);
      changed++;
    }
  }

  if (check) {
    if (stale.length) {
      console.error(
        `stamp-assets --check: ${stale.length} page(s) carry a stale or missing ?v=:\n` +
          stale.map((s) => `  ${s}`).join("\n") +
          `\nRun: node scripts/stamp-assets.mjs`,
      );
      process.exit(1);
    }
    console.log(`stamp-assets: all ${PAGES.length} pages stamped and current.`);
    return;
  }
  console.log(`stamp-assets: ${changed} page(s) updated.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
