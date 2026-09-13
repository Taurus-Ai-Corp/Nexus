#!/usr/bin/env node
/**
 * deploy-pages.mjs — the only correct way to deploy this site.
 *
 * WHY THIS EXISTS
 * ---------------
 * `wrangler pages deploy platform/` publishes the source tree. `.assetsignore`
 * does NOT prevent it — measured against the live project on 2026-09-13:
 * `.assetsignore` listed `scripts`, `tests`, `package.json` and
 * `package-lock.json`, and wrangler uploaded every one of them. 172 files on
 * disk, 170 uploaded, while `check-pages-limits.mjs` (which DOES honour
 * `.assetsignore`) counted 144. The result was
 * https://neorm-era.com/scripts/build-pages.mjs serving 34 KB of real source.
 *
 * `_redirects` is not a fallback either: `/lib/* /404.html 404` was deployed to
 * a preview and the static asset still won. Confirmed, not assumed.
 *
 * Since Pages serves anything inside the deployed directory, the only reliable
 * exclusion is to put it somewhere else. This script stages:
 *
 *     <stage>/site/        <- deployed; public assets ONLY
 *     <stage>/api/         <- beside it: readable by the bundler, never served
 *     <stage>/lib/
 *     <stage>/node_modules/
 *     <stage>/package.json
 *
 * api/ and lib/ cannot simply be dropped: functions/api/[[route]].js imports
 * ../../api/*.js and those import ../lib/prompt-bible.mjs, so the files must
 * exist when wrangler compiles the Worker. node_modules and package.json are
 * likewise build inputs — without them the build fails with "Could not resolve
 * nodemailer / stripe". wrangler excludes both from the asset upload itself.
 *
 * Moving api/ and lib/ up one level changes the import depth by exactly one
 * `../`, which this script rewrites in the STAGED copy only. The repository is
 * never modified.
 *
 * WHAT prompt-bible.mjs HAS TO DO WITH ANY OF THIS
 * ------------------------------------------------
 * platform/lib/prompt-bible.mjs is the 9-block campaign skeleton. It was
 * publicly downloadable on every production deploy going back to at least
 * 2026-08-26. Staging is what closes that.
 *
 *   node scripts/deploy-pages.mjs                # gate + PREVIEW deploy
 *   node scripts/deploy-pages.mjs --production   # gate + production deploy
 *   node scripts/deploy-pages.mjs --stage-only   # build + audit, deploy nothing
 */

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = "neorm-era";
const PRODUCTION_BRANCH = "feat/nexus-core-organic-design-system";

/** Copied into <stage>/site and therefore PUBLIC. Adding an entry publishes it. */
const PUBLIC = [
  "404.html", "_headers", "_redirects", "about.html", "assets", "campaigns",
  "case-studies.html", "checkout.html", "contact.html", "creative", "estate", "flow", "freelance",
  "functions", "index.html", "intel", "llms.txt", "pricing.html", "privacy.html",
  "public", "robots.txt", "security.html", "seo", "sitemap.xml", "social",
  "terms.html", "vercel.json",
];

/** Copied BESIDE site/: needed to compile the Worker, never served. */
const BUILD_ONLY = ["api", "lib", "node_modules", "package.json"];

/**
 * Nothing matching these may end up inside site/. A denylist alone is what
 * failed before, so this is not the mechanism — it is the alarm on the
 * mechanism, checked after staging and before uploading.
 */
const MUST_NOT_SHIP = [
  { re: /^package(-lock)?\.json$/, why: "dependency manifest" },
  { re: /^\.assetsignore$/, why: "does not work anyway, and names our layout" },
  { re: /^tests\//, why: "test source" },
  { re: /^scripts\//, why: "build scripts" },
  { re: /^lib\//, why: "prompt-bible and shared server code" },
  { re: /^api\/.*\.js$/, why: "serverless handler source" },
  { re: /^node_modules\//, why: "dependencies" },
  { re: /^prototype(\/|$)/, why: "unreleased design explorations" },
  // Matches the directory itself as well as its contents. With a mandatory
  // trailing slash the filter skipped the files but still created an empty
  // assets/user-uploads/ in the staged output — harmless, but it makes the
  // stage misleading to inspect.
  { re: /^assets\/user-uploads(\/|$)/, why: "user-uploaded media" },
  { re: /\.env/, why: "environment file" },
  { re: /^README\.md$/, why: "internal notes" },
];

const arg = (f) => process.argv.includes(f);
const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: "pipe", ...opts }).trim();

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else out.push(relative(base, p));
  }
  return out;
}

function audit(siteDir) {
  const files = walk(siteDir);
  const violations = [];
  for (const f of files) {
    for (const { re, why } of MUST_NOT_SHIP) {
      if (re.test(f)) violations.push(`${f}  (${why})`);
    }
  }
  if (violations.length) {
    console.error(
      `\nREFUSING TO DEPLOY — ${violations.length} file(s) would be published:\n  ` +
        violations.join("\n  ") +
        `\n\nAdd them to BUILD_ONLY, or remove them from PUBLIC in scripts/deploy-pages.mjs.\n`,
    );
    process.exit(1);
  }
  return files.length;
}

function main() {
  const production = arg("--production");
  const stageOnly = arg("--stage-only");

  // Deploying modified-but-uncommitted work is how the sibling Vercel project
  // lost track of what was live. Untracked files are already safe — the
  // whitelist never copies them — so only tracked modifications are refused.
  const dirty = sh("git", ["status", "--porcelain", "--", ROOT])
    .split("\n")
    .filter((l) => l && !l.startsWith("??"));
  if (dirty.length && !arg("--allow-dirty")) {
    console.error(
      `Refusing to deploy: ${dirty.length} tracked file(s) modified but not committed.\n  ` +
        dirty.map((l) => l.trim()).join("\n  ") +
        `\nCommit them, or pass --allow-dirty if you really mean it.`,
    );
    process.exit(1);
  }

  const commit = sh("git", ["rev-parse", "HEAD"]);
  const stage = mkdtempSync(join(tmpdir(), "neorm-deploy-"));
  const site = join(stage, "site");

  // The whitelist alone is not enough: `assets` is public wholesale but
  // contains assets/user-uploads/, which is not. Caught by the audit on the
  // first run of this script — 12 untracked user-uploaded images that a
  // developer-machine deploy would have published. So the copy applies the
  // same rule the audit does, and the audit stays as the alarm behind it.
  const forbidden = (relPath) => MUST_NOT_SHIP.some(({ re }) => re.test(relPath));

  // Check the INTENT before the copy, because the filter below would otherwise
  // mask it. Adding "lib" to PUBLIC used to produce a silently-empty lib/ in
  // the stage and a clean audit — safe, but it reads as success, and the next
  // person concludes publishing lib/ is fine. Naming a forbidden path in
  // PUBLIC is a mistake worth stopping loudly.
  const misdeclared = PUBLIC.filter((e) => forbidden(e) || forbidden(`${e}/`));
  if (misdeclared.length) {
    console.error(
      `PUBLIC names path(s) that must never ship: ${misdeclared.join(", ")}\n` +
        `Move them to BUILD_ONLY, or remove the matching MUST_NOT_SHIP rule if the\n` +
        `decision has genuinely changed.`,
    );
    process.exit(1);
  }

  for (const entry of PUBLIC) {
    const src = join(ROOT, entry);
    if (!existsSync(src)) continue;
    cpSync(src, join(site, entry), {
      recursive: true,
      filter: (from) => !forbidden(relative(ROOT, from)),
    });
  }
  for (const entry of BUILD_ONLY) {
    const src = join(ROOT, entry);
    if (!existsSync(src)) {
      console.error(`Missing build input: ${entry}. Run npm ci in platform/ first.`);
      process.exit(1);
    }
    cpSync(src, join(stage, entry), { recursive: true });
  }

  writeFileSync(
    join(site, "build.json"),
    JSON.stringify(
      {
        commit,
        ref: production ? PRODUCTION_BRANCH : sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]),
        run_id: `deploy-pages-${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`,
        built_at: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
      },
      null,
      2,
    ) + "\n",
  );

  // api/ and lib/ moved up one level, so the Function's relative imports need
  // one more `../`. Staged copy only; the repository is untouched.
  const route = join(site, "functions/api/[[route]].js");
  const before = readFileSync(route, "utf8");
  const after = before.replaceAll("from '../../api/", "from '../../../api/");
  if (after === before) {
    console.error(`Import rewrite matched nothing in the staged functions/api/[[route]].js — the Worker would not build. Expected \`from '../../api/'\` imports.`);
    process.exit(1);
  }
  writeFileSync(route, after);

  const shipped = audit(site);
  console.log(`staged ${shipped} public files at ${site}`);

  // Gates run against the repository, which is what the staged copy mirrors.
  execFileSync("node", ["scripts/stamp-assets.mjs", "--check"], { cwd: ROOT, stdio: "inherit" });
  execFileSync("node", ["scripts/check-pages-limits.mjs", site], { cwd: ROOT, stdio: "inherit" });
  execFileSync("npm", ["test"], { cwd: ROOT, stdio: "inherit" });

  if (stageOnly) {
    console.log(`\n--stage-only: nothing deployed. Inspect ${site}`);
    return;
  }

  const branch = production ? PRODUCTION_BRANCH : `preview-${commit.slice(0, 7)}`;
  console.log(`\ndeploying ${commit.slice(0, 7)} to ${production ? "PRODUCTION" : "preview"} (${branch})`);
  execFileSync(
    "npx",
    ["--yes", "wrangler@4", "pages", "deploy", ".",
     `--project-name=${PROJECT}`, `--branch=${branch}`,
     `--commit-hash=${commit}`, `--commit-message=deploy-pages ${commit.slice(0, 7)}`,
     "--commit-dirty=true"],
    { cwd: site, stdio: "inherit" },
  );

  console.log(
    `\nVerify by CONTENT-TYPE, never status — every missing URL on this host returns\n` +
      `200 with homepage HTML:\n` +
      `  curl -sI https://neorm-era.com/build.json      # application/json, commit ${commit.slice(0, 7)}\n` +
      `  curl -sI https://neorm-era.com/api/contact     # application/json (405), not text/html\n` +
      `  curl -sI https://neorm-era.com/lib/prompt-bible.mjs  # must NOT be application/javascript\n`,
  );
}

main();
