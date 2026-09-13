/**
 * Every shipped page must reference its CSS/JS with a ?v= that matches the
 * file's current contents.
 *
 * This exists because `_headers` promises something the filenames cannot keep:
 *
 *     /assets/*
 *       Cache-Control: public, max-age=31536000, immutable
 *
 * `immutable` tells every cache "this URL's bytes will never change." But
 * design-system.css is always the same URL, so when the bytes DO change there
 * is no way to say so. Measured on production 2026-09-13: the site served a
 * 25,692-byte stylesheet while the deployment contained the 33,957-byte one,
 * `cf-cache-status: HIT`, and a nav fix that had been deployed and verified was
 * invisible to every visitor. A cache purge alone does not fix that — browsers
 * honour `immutable` too, and hold the file for the full year.
 *
 * The ?v= stamp makes the header honest: the URL changes exactly when the
 * bytes change.
 *
 * Deliberately scans EVERY shipped page rather than reading the PAGES list out
 * of stamp-assets.mjs. A test that trusts the same list as the code under test
 * cannot catch an omission from that list — which is the mistake that left
 * campaigns/thanks.html unstamped on the first pass.
 */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Not deployed: excluded from the upload, so their references don't matter. */
const NOT_SHIPPED = new Set(["node_modules", "tests", "prototype", ".vercel", ".wrangler", ".git", "scripts", "public"]);

function shippedHtml(dir = ROOT, out = [], depth = 0) {
  for (const name of readdirSync(dir)) {
    if (NOT_SHIPPED.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (depth < 2) shippedHtml(p, out, depth + 1);
    } else if (name.endsWith(".html")) {
      out.push(p);
    }
  }
  return out;
}

const REF = /(?:href|src)="(\/?(?:\.\.\/)*assets\/(?:css|js)\/[^"?]+)(\?v=([0-9a-f]+))?"/g;

const version = (abs) =>
  createHash("sha256").update(readFileSync(abs)).digest("hex").slice(0, 8);

test("every shipped page stamps its assets with the current content hash", () => {
  const pages = shippedHtml();
  assert.ok(pages.length >= 15, `expected the site's pages, found ${pages.length}`);

  const problems = [];
  let checked = 0;

  for (const page of pages) {
    const html = readFileSync(page, "utf8");
    const rel = page.slice(ROOT.length + 1);
    for (const [, path, , stamp] of html.matchAll(REF)) {
      const abs = path.startsWith("/") ? join(ROOT, path.slice(1)) : resolve(dirname(page), path);
      let want;
      try {
        want = version(abs);
      } catch {
        continue; // broken reference — other tests own that
      }
      checked++;
      if (!stamp) problems.push(`${rel}: ${path} has no ?v= (immutable cache will never refresh it)`);
      else if (stamp !== want) problems.push(`${rel}: ${path}?v=${stamp} but the file hashes to ${want}`);
    }
  }

  assert.ok(checked > 0, "found no asset references to check — the scan is broken, not the site");
  assert.deepEqual(
    problems,
    [],
    `Stale or missing asset stamps. Run: node scripts/stamp-assets.mjs\n  ${problems.join("\n  ")}`,
  );
});

test("a changed asset produces a different stamp", () => {
  // Guards the premise. If the hash did not move with the bytes, every stamp
  // would be decoration and the cache would stay stale exactly as before.
  const a = createHash("sha256").update("body{color:red}").digest("hex").slice(0, 8);
  const b = createHash("sha256").update("body{color:blue}").digest("hex").slice(0, 8);
  assert.notEqual(a, b);
});

test("the immutable header is still the reason this matters", () => {
  // If someone drops the long immutable cache, this whole mechanism becomes
  // optional — and this test should be the thing that tells them so, rather
  // than the stamps quietly persisting for no reason.
  const headers = readFileSync(join(ROOT, "_headers"), "utf8");
  assert.match(
    headers,
    /\/assets\/\*[\s\S]{0,120}immutable/,
    "_headers no longer serves /assets/* as immutable — revisit whether ?v= stamping is still needed",
  );
});
