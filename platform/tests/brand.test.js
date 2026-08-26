/**
 * NEORM-ERA brand and deploy-config invariants.
 *
 * Both suites here exist because of failures found during the rebrand that the
 * existing tests could not have caught.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

const platform = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every .html file that is actually published, i.e. excluding tooling dirs. */
function publishedHtml(dir = platform, out = []) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'prototype', '.vercel', 'tests', 'scripts'].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) publishedHtml(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

describe('no legacy brand leaks in published markup', () => {
  // Infrastructure identifiers deliberately keep their old names — renaming an
  // asset filename or a package name breaks references without changing branding.
  const ALLOWED = [
    /og-nexus-[a-z-]+\.png/g,
    /nexus@taurusai\.io/g,
    /nexus-platform-site/g,
    /nexus-creative-editorial/g,
    /taurus-ai\/nexus-creative/g,
    /NEXUS-CORE/g,
    /nexus-hero-01\.png/g,
    /feat\/nexosync-to-nexus-rebrand/g,
  ];

  const files = publishedHtml();

  test('finds html to check', () => assert.ok(files.length > 10, `only found ${files.length}`));

  for (const file of files) {
    const rel = relative(platform, file);
    test(`${rel} carries no retired brand name`, () => {
      let body = readFileSync(file, 'utf8');
      for (const pattern of ALLOWED) body = body.replace(pattern, '');
      // Case-insensitive on purpose. A case-sensitive version of this check
      // passed while `$ nexus deploy --vertical ...` was still rendering inside
      // a terminal mock on the homepage.
      const leaks = body.match(/\bnexus\b/gi) ?? [];
      assert.deepEqual(
        [...new Set(leaks)],
        [],
        `${rel} still renders a retired brand name: ${[...new Set(leaks)].join(', ')}`,
      );
    });
  }
});

describe('vercel.json deploy config', () => {
  const config = JSON.parse(readFileSync(join(platform, 'vercel.json'), 'utf8'));

  test('does not mix legacy `routes` with `headers`/`redirects`', () => {
    // Vercel treats `routes` as mutually exclusive with headers/redirects/rewrites.
    // While both were present, the entire headers block was silently ignored:
    // production served Vercel's default HSTS and NO Permissions-Policy at all,
    // while this suite passed because it only ever read the file.
    if (!('routes' in config)) return;
    for (const key of ['headers', 'redirects', 'rewrites', 'cleanUrls', 'trailingSlash']) {
      assert.ok(
        !(key in config),
        `vercel.json declares both "routes" and "${key}" — "${key}" will be ignored at deploy`,
      );
    }
  });

  test('declares the five security headers on all routes', () => {
    const all = (config.headers ?? []).find((h) => h.source === '/(.*)');
    assert.ok(all, 'no header rule covering all routes');
    const keys = all.headers.map((h) => h.key);
    for (const required of [
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]) {
      assert.ok(keys.includes(required), `missing ${required}`);
    }
  });

  test('HSTS includes subdomains', () => {
    const all = config.headers.find((h) => h.source === '/(.*)');
    const hsts = all.headers.find((h) => h.key === 'Strict-Transport-Security').value;
    assert.match(hsts, /includeSubDomains/, `HSTS lacks includeSubDomains: ${hsts}`);
  });
});

describe('every shipped script parses', () => {
  // A rebrand that renamed a bare token turned `const Nexus = ...` into
  // `const Neorm-Era = ...` — not a legal identifier. main.js threw SyntaxError,
  // never ran, and every page rendered blank below the nav because the scroll
  // reveal never fired. The whole suite stayed green: nothing executed it.
  const scripts = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (['node_modules', 'prototype', '.vercel'].includes(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.js') || entry.endsWith('.mjs')) scripts.push(full);
    }
  })(platform);

  test('finds scripts to check', () => assert.ok(scripts.length > 5));

  for (const script of scripts) {
    const rel = relative(platform, script);
    test(`${rel} is syntactically valid`, () => {
      try {
        execFileSync(process.execPath, ['--check', script], { stdio: 'pipe' });
      } catch (err) {
        assert.fail(`${rel} fails to parse:\n${err.stderr?.toString().split('\n')[2] ?? err.message}`);
      }
    });
  }
});

describe('no malformed email addresses', () => {
  test('no address uses a www. host', () => {
    // `nexus.taurusai.io` -> `www.neorm-era.com` also rewrote the host inside
    // mailto/from addresses, producing `leads@www.neorm-era.com`.
    const offenders = [];
    (function walk(dir) {
      for (const entry of readdirSync(dir)) {
        if (['node_modules', 'prototype', '.vercel', 'tests'].includes(entry)) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(js|mjs|html|json|md|txt|xml)$/.test(entry)) {
          if (/[a-zA-Z0-9._%+-]+@www\./.test(readFileSync(full, 'utf8'))) offenders.push(relative(platform, full));
        }
      }
    })(platform);
    assert.deepEqual(offenders, [], `email addresses with a www. host: ${offenders.join(', ')}`);
  });
});
