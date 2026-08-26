/**
 * Structural invariants across the seven engine pages.
 *
 * Every assertion here corresponds to a defect that shipped into the branch and
 * that the existing suites could not see, because they read files for brand
 * strings and config keys but never checked that the pages agree with each other.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
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

describe('Stripe checkout is wired to the handler it actually has', () => {
  const stripe = read('api/stripe.js');
  const checkoutPages = pages.filter((p) => read(p).includes('action=checkout&plan='));
  const buttonCount = checkoutPages.reduce(
    (n, p) => n + (read(p).match(/action=checkout&plan=/g) ?? []).length,
    0,
  );

  test('finds all seven checkout buttons', () => assert.equal(buttonCount, 7));

  for (const page of checkoutPages) {
    test(`${page} does not navigate to the API by GET`, () => {
      // Every button did `window.location.href = '/api/stripe?action=checkout...'`.
      // The handler routes checkout on POST only, so all of them returned
      // 400 {"error":"Invalid request..."} rendered as raw JSON. Even on POST a
      // plain navigation would show the JSON body, because handleCheckout returns
      // {url} rather than issuing a redirect.
      assert.doesNotMatch(
        read(page),
        /window\.location\.href\s*=\s*this\.href/,
        `${page} navigates to /api/stripe by GET; it must POST and follow the returned url`,
      );
    });
  }

  test('an unknown plan is rejected, never silently repriced', () => {
    // planMap collapsed agency_starter ($999), agency_pro ($2,499),
    // agency_enterprise ($10,000-15,000) and worldcup ($2,500) onto 'studio',
    // and fell back to 'starter' for anything unrecognised. Only STARTER and
    // STUDIO price IDs exist, so a successful checkout would have charged $399/mo
    // — an undercharge that looks like a working purchase.
    assert.doesNotMatch(
      stripe,
      /planMap\[plan\]\s*\|\|/,
      'stripe.js falls back to a default plan for an unrecognised plan id',
    );
    for (const unpriced of ['agency_starter', 'agency_pro', 'agency_enterprise', 'worldcup']) {
      assert.doesNotMatch(
        stripe,
        new RegExp(`${unpriced}:\\s*'`),
        `${unpriced} is aliased to a plan whose page advertises a different price`,
      );
    }
  });
});
