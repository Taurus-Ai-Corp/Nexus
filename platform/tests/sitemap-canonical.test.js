import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = join(ROOT, 'sitemap.xml');

// A sitemap URL and that page's rel=canonical are two declarations of the same
// thing, read by the same crawlers. When they disagree, the sitemap sends a
// crawler to a URL the page itself disowns.
//
// They did disagree. Until 2026-09-11 seven entries were listed as .html
// (pricing, about, contact, case-studies, privacy, terms, security) while every
// one of those pages declared an extensionless canonical, and production
// 308-redirects .html -> extensionless. Nothing caught it: the XML was valid,
// every URL returned 200, and the redirect was invisible unless you followed it.

const locs = () => [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

/** Map a sitemap URL back to the file that should declare it. */
function fileFor(url) {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  if (path === '/') return 'index.html';
  if (path.endsWith('/')) return `${path.slice(1)}index.html`;
  // extensionless -> <name>.html
  return `${path.slice(1)}.html`;
}

test('every sitemap URL matches that page rel=canonical exactly', () => {
  const mismatches = [];
  for (const url of locs()) {
    const rel = fileFor(url);
    const full = join(ROOT, rel);
    if (!existsSync(full)) {
      mismatches.push(`${url} -> no such file (${rel})`);
      continue;
    }
    const m = readFileSync(full, 'utf8').match(/rel="canonical"\s+href="([^"]+)"/);
    if (!m) {
      mismatches.push(`${rel} declares no rel=canonical, but is in the sitemap as ${url}`);
      continue;
    }
    if (m[1] !== url) {
      mismatches.push(`${rel}: sitemap says ${url}, page canonical says ${m[1]}`);
    }
  }
  if (mismatches.length) {
    throw new Error(
      `sitemap.xml disagrees with page canonicals:\n  ${mismatches.join('\n  ')}\n` +
        'Take the URL from the page rel=canonical, not from the filename.',
    );
  }
});

test('no sitemap URL carries a .html extension', () => {
  // Every .html URL on this site 308-redirects to its extensionless form, so a
  // .html entry always costs a redirect hop and always contradicts the canonical.
  const bad = locs().filter((u) => u.endsWith('.html'));
  if (bad.length) {
    throw new Error(
      `sitemap.xml lists .html URLs that redirect away from their own canonical:\n  ${bad.join('\n  ')}`,
    );
  }
});

test('sitemap is well-formed and lists no duplicates', () => {
  const raw = readFileSync(SITEMAP, 'utf8');
  if (!raw.trimStart().startsWith('<?xml')) throw new Error('sitemap.xml lost its XML declaration');
  const urls = locs();
  if (urls.length === 0) throw new Error('sitemap.xml lists no URLs');
  const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
  if (dupes.length) throw new Error(`duplicate sitemap entries: ${[...new Set(dupes)].join(', ')}`);
  const openTags = (raw.match(/<url>/g) || []).length;
  const closeTags = (raw.match(/<\/url>/g) || []).length;
  if (openTags !== closeTags) throw new Error(`unbalanced <url> tags: ${openTags} open, ${closeTags} close`);
});
