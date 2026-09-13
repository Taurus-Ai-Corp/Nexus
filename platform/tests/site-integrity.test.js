/**
 * Structural invariants across the seven engine pages.
 *
 * Every assertion here corresponds to a defect that shipped into the branch and
 * that the existing suites could not see, because they read files for brand
 * strings and config keys but never checked that the pages agree with each other.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

const platform = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(platform, p), 'utf8');

/** slug -> the name that engine is sold under. */
const ENGINES = {
  creative: 'Neormative',
  social: 'Neormedia',
  intel: 'Neormintel',
  estate: 'Neormestate',
  seo: 'Neormeo',
  freelance: 'Neormence',
  flow: 'Neormestra',
};

function publishedHtml(dir = platform, out = []) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'prototype', '.vercel', 'tests', 'scripts'].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) publishedHtml(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = publishedHtml().map((f) => relative(platform, f));

/**
 * The main site: root-level pages plus the seven engine landings. These share one
 * nav and one footer. `campaigns/` is deliberately excluded — those are the
 * self-contained pilot-demo pages, with their own minimal chrome by design.
 * `public/` is excluded too; it is a stray duplicate tree (see README note).
 */
const mainPages = pages.filter(
  (p) => !p.includes('/') || Object.keys(ENGINES).some((slug) => p === `${slug}/index.html`),
);

/** The campaign pages a visitor can actually land on, excluding embedded asset galleries. */
const campaignPages = pages.filter(
  (p) => p.startsWith('campaigns/') && !p.includes('petpawsphere'),
);

describe('engine pages identify themselves correctly', () => {
  // estate/ and seo/ were templated from freelance/index.html. The nav brand
  // lockup came along unchanged, so both pages rendered "Neormence" in the header
  // while their <title> said Neormestate / Neormeo — the header contradicted the
  // browser tab. Every existing test passed: the page carried no retired brand,
  // and the correct name did appear elsewhere in the file.
  for (const [slug, name] of Object.entries(ENGINES)) {
    test(`${slug}/ brand lockup reads ${name}`, () => {
      const lockup = read(`${slug}/index.html`).match(
        /<span>(Neorm[A-Za-z]*) <small>by Taurus AI<\/small><\/span>/,
      );
      assert.ok(lockup, `${slug}/index.html has no brand lockup`);
      assert.equal(lockup[1], name);
    });
  }
});

describe('no engine page is orphaned', () => {
  // The two newest engines were absent from every footer, and /flow/ was linked
  // from no nav and no footer on any page including its own — while pricing.html
  // twice advertises "seven engines".
  test('finds the main-site pages', () => assert.ok(mainPages.length >= 10, `${mainPages.length}`));

  for (const page of mainPages) {
    const footer = read(page).match(/<footer[\s\S]*?<\/footer>/);
    if (!footer) continue;
    test(`${page} footer reaches all seven engines`, () => {
      const missing = Object.keys(ENGINES).filter((slug) => !footer[0].includes(`href="/${slug}/"`));
      assert.deepEqual(missing, [], `${page} footer omits: ${missing.join(', ')}`);
    });

    test(`${page} footer names each engine once`, () => {
      // Adding the missing engines produced a second Neormestra row: the footer
      // already carried a "Neormestra soon" waitlist entry, so the same engine
      // appeared as both live and unreleased. Compare whole labels with the
      // <small> qualifier stripped, so "Neormestra soon" collides with
      // "Neormestra" while the distinct "Neormative demo" entry does not.
      const labels = [...footer[0].matchAll(/<a\s[^>]*>([\s\S]*?)<\/a>/g)]
        .map((m) => m[1].replace(/<small>[\s\S]*?<\/small>/g, '').replace(/<[^>]+>/g, '').trim());
      const dupes = Object.values(ENGINES).filter(
        (name) => labels.filter((l) => l === name).length > 1,
      );
      assert.deepEqual(dupes, [], `${page} footer lists twice: ${dupes.join(', ')}`);
    });
  }
});

describe('nav markup is well formed', () => {
  for (const [slug] of Object.entries(ENGINES)) {
    const page = `${slug}/index.html`;
    test(`${page} nav has no duplicate link`, () => {
      // flow/ carried a stray </div> that closed .nav-inner early, plus a second
      // Pricing anchor. Both the duplicate and .nav-cta then rendered at x=0
      // below the nav bar rather than inside it.
      // Scoped to .nav-links: the brand lockup also points at "/", and that
      // duplicate is intentional.
      const links = read(page).match(/<div class="nav-links[^"]*">([\s\S]*?)<\/div>/);
      assert.ok(links, `${page} has no .nav-links`);
      const hrefs = [...links[1].matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]);
      const seen = new Set();
      const dupes = hrefs.filter((h) => (seen.has(h) ? true : (seen.add(h), false)));
      assert.deepEqual([...new Set(dupes)], [], `${page} nav links twice to: ${dupes.join(', ')}`);
    });

    test(`${page} nav-cta sits inside nav-inner`, () => {
      const inner = read(page).match(/<div class="container nav-inner">([\s\S]*?)<\/nav>/);
      assert.ok(inner, `${page} has no .nav-inner`);
      assert.match(inner[1], /nav-cta/, `${page} .nav-cta escaped .nav-inner`);
    });
  }
});

describe('retired names and misspellings stay out of published copy', () => {
  // tests/brand.test.js scans only for the previous platform name, so a retired
  // sub-brand in body copy passed both it and the pre-commit brand guard.
  const BANNED = [
    // These four name the retired brands on purpose — this list is what keeps
    // them out of published copy, so the guard has to tolerate them here.
    [/\bBizFlow\b/i, 'BizFlow — retired brand'], // brand-allow
    [/\bNeoVibe\b/i, 'NeoVibe — retired brand'], // brand-allow
    [/\bNeoSync\b/i, 'NeoSync — retired brand'], // brand-allow
    [/\bGridDB\b/i, 'GridDB — retired brand'], // brand-allow
    [/\bORCA\b/, 'ORCA — retired brand'],
    [/\bHeiro\b/i, 'Heiro — misspelling of Hiero'],
  ];

  for (const page of pages) {
    test(`${page} is clean`, () => {
      // ORCA_WEBHOOK_URL is a deployment env var and data.orca / orcaHtml are API
      // field and variable names — infrastructure identifiers, not visible copy.
      // Renaming them breaks the contract without changing what a visitor sees.
      const html = read(page).replace(/ORCA_WEBHOOK_URL/g, '').replace(/\borca[A-Za-z_]*\b/g, '');
      const hits = BANNED.filter(([re]) => re.test(html)).map(([, label]) => label);
      assert.deepEqual(hits, [], `${page} contains: ${hits.join('; ')}`);
    });
  }
});

describe('the contact form can receive every engine', () => {
  test('vertical dropdown offers all seven', () => {
    // Three engines were missing from the required dropdown, so every CTA on
    // /estate/, /seo/ and the Real Estate Pro plan funnelled into a form where
    // the visitor's own product was not an option.
    const select = read('contact.html').match(/<select[^>]*name="vertical"[\s\S]*?<\/select>/);
    assert.ok(select, 'no vertical select on contact.html');
    const missing = Object.keys(ENGINES).filter((slug) => !select[0].includes(`value="${slug}"`));
    assert.deepEqual(missing, [], `contact form cannot receive: ${missing.join(', ')}`);
  });
});

describe('the demo pages are not dead ends', () => {
  // /campaigns/ is the pilot demo linked from /creative/. Four of its seven pages
  // carried no link back to the main site at all.
  for (const page of campaignPages) {
    test(`${page} links back to the main site`, () => {
      assert.match(read(page), /href="\/"/, `${page} strands the visitor`);
    });
  }
});

describe('checkout is wired to the rail that actually exists', () => {
  // Rewritten when the Stripe rail was retired. The old block asserted a
  // pattern that no longer exists: buttons carrying `action=checkout&plan=`
  // straight at /api/stripe. Checkout now goes through /checkout.html, which
  // collects name and email and calls /api/sokin — because Sokin returns no
  // hosted URL to redirect to, only ids for its embed SDK.
  //
  // Two invariants survive the rail change and are what this block is really
  // for: the amount must come from the SERVER, and a plan with no price must
  // reach a human instead of a broken checkout.
  const sokin = read('api/sokin.js');

  test('the plan set and its amounts live on the server', () => {
    // A price the browser can post is a price the customer can edit.
    assert.match(sokin, /const PLANS = \{/, 'api/sokin.js must own the plan set');
    assert.match(sokin, /totalAmount:\s*\d+/, 'amounts must be literal on the server');
    assert.doesNotMatch(
      sokin,
      /totalAmount:\s*(body|req)\./,
      'the amount must never be taken from the request body',
    );
  });

  test('an unknown plan is rejected, never silently repriced', () => {
    // The retired planMap collapsed agency_starter ($999), agency_pro ($2,499),
    // agency_enterprise ($10,000-15,000) and worldcup ($2,500) onto 'studio',
    // and fell back to 'starter' for anything unrecognised — a successful
    // checkout that charged the wrong amount while looking like it worked.
    assert.doesNotMatch(
      sokin,
      /PLANS\[plan\]\s*\|\|/,
      'api/sokin.js falls back to a default plan for an unrecognised plan id',
    );
    assert.match(sokin, /No plan/, 'an unknown plan must be refused explicitly');
  });

  test('no page still points a checkout button at the retired Stripe endpoint', () => {
    const stale = pages.filter((p) => read(p).includes('/api/stripe'));
    assert.deepEqual(stale, [], `these pages still call the removed /api/stripe: ${stale.join(', ')}`);
  });

  test('the unpriced plans route to sales instead', () => {
    // Independent of which rail is live: a plan with no price must reach a
    // human rather than a checkout that always fails.
    const routed = new Set(
      pages.flatMap((p) => [...read(p).matchAll(/href="\/contact\.html\?plan=([a-z_]+)"/g)]
        .map((m) => m[1])),
    );
    for (const plan of ['agency_starter', 'agency_pro', 'agency_enterprise', 'worldcup']) {
      assert.ok(routed.has(plan), `${plan} has neither a priced checkout nor a sales link`);
    }
  });
});

describe('serverless functions do not hardcode a hostname', () => {
  // success_url, cancel_url, a self-referential fetch of /api/leads and a
  // deploy_url were all pinned to a host with no DNS record, so a completed
  // checkout would have redirected the customer to an unresolvable domain and
  // the lead-capture fetch would have thrown. A hardcoded host is also wrong on
  // every preview deploy. lib/site-origin.mjs derives it from the request.
  const fns = readdirSync(join(platform, 'api')).filter((f) => f.endsWith('.js'));

  for (const fn of fns) {
    test(`api/${fn} builds URLs from the request`, () => {
      const src = read(join('api', fn));
      // Strip comments first: the reason this rule exists is written in them.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      const literals = [...code.matchAll(/https?:\/\/(?:www\.)?(neorm-era\.com|nexus\.taurusai\.io)/g)];
      assert.equal(
        literals.length,
        0,
        `api/${fn} hardcodes ${[...new Set(literals.map((m) => m[0]))].join(', ')}; use siteOrigin(req)`,
      );
    });
  }
});

describe('siteOrigin refuses an untrusted Host header', () => {
  // success_url is a redirect target and Host is attacker-controlled, so the
  // allowlist is load-bearing, not defensive decoration.
  test('unknown host falls back to the canonical origin', async () => {
    const { siteOrigin, CANONICAL_ORIGIN } = await import('../lib/site-origin.mjs');
    assert.equal(siteOrigin({ headers: { host: 'evil.example.com' } }), CANONICAL_ORIGIN);
    assert.equal(siteOrigin({ headers: {} }), CANONICAL_ORIGIN);
    assert.equal(siteOrigin({ headers: { host: 'nexus.taurusai.io' } }), 'https://nexus.taurusai.io');
    assert.equal(siteOrigin({ headers: { host: 'x1.vercel.app' } }), 'https://x1.vercel.app');
  });
});

describe('inline scripts parse', () => {
  // campaigns/dogfood.html carried a string literal broken across two physical
  // lines, so the ENTIRE inline script failed to parse and renderCampaigns()
  // never ran. #campaign-list has no static fallback, so the campaign gallery
  // — the substance of the page — rendered empty, on every visit, since the
  // file was created. Nothing caught it: the HTML is well formed, the brand is
  // right, every link resolves, and no test had ever executed the page.
  for (const page of pages) {
    const src = read(page);
    const blocks = [...src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => m[1])
      .filter((b) => b.trim() && !/^\s*\{[\s\S]*\}\s*$/.test(b.trim())); // skip JSON-LD
    if (!blocks.length) continue;
    test(`${page} — ${blocks.length} inline script(s) compile`, () => {
      blocks.forEach((body, i) => {
        // Compiles without executing; a syntax error throws here.
        assert.doesNotThrow(() => new Function(body), `${page} script block ${i} does not parse`);
      });
    });
  }
});

describe('root-relative links resolve to something on disk', () => {
  // campaigns/index.html linked "/dogfood" (404) where the page is at
  // "/campaigns/dogfood". campaigns/colab.html offers a notebook download at
  // "/tribev2_inference.ipynb" which exists nowhere in platform/.
  const skip = (h) => h.startsWith('/api/') || h.startsWith('//');
  for (const page of pages) {
    const hrefs = [...new Set(
      [...read(page).matchAll(/(?:href|src)="(\/[^"'#?]*)/g)].map((m) => m[1]).filter((h) => !skip(h)),
    )];
    if (!hrefs.length) continue;
    test(`${page} — ${hrefs.length} local target(s) exist`, () => {
      const missing = hrefs.filter((h) => {
        const p = h.replace(/^\//, '') || 'index.html';
        return !(existsSync(join(platform, p))
          || existsSync(join(platform, `${p}.html`))
          || existsSync(join(platform, p, 'index.html')));
      });
      assert.deepEqual(missing, [], `${page} links to missing: ${missing.join(', ')}`);
    });
  }
});
