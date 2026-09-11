/**
 * tests/seo-schema.test.js
 *
 * Verifies Task A (AEO / GEO / Schema.org) invariants across the platform:
 * 1. Every page in PAGES_CONFIG has valid, parseable Schema.org JSON-LD.
 * 2. Organization schema is present on every page with Canadian jurisdiction (addressCountry: "CA").
 * 3. SoftwareApplication schema is present on all 7 engine pages with valid offers and prices.
 * 4. BreadcrumbList schema is present on non-home pages.
 * 5. WebSite schema is present on the homepage.
 * 6. FAQPage schema and semantic <dl class="faq-list"> are present on Home and all 7 engine pages.
 * 7. llms.txt is present, non-empty, and indexed.
 * 8. 404.html is present and links to all 7 engines.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { PAGES_CONFIG, FAQS_DATA } from '../scripts/build-pages.mjs';

const platform = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(platform, rel), 'utf8');

const ENGINES = ['creative', 'social', 'intel', 'estate', 'seo', 'freelance', 'flow'];

describe('Task A: Schema.org JSON-LD invariants', () => {
  for (const relPath of Object.keys(PAGES_CONFIG)) {
    test(`${relPath} has valid, parseable Schema.org JSON-LD`, () => {
      const html = read(relPath);
      const match = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
      assert.ok(match, `${relPath} is missing application/ld+json script tag`);

      let data;
      assert.doesNotThrow(() => {
        data = JSON.parse(match[1]);
      }, `${relPath} JSON-LD failed to parse`);

      assert.strictEqual(data['@context'], 'https://schema.org');
      assert.ok(Array.isArray(data['@graph']), `${relPath} JSON-LD is missing @graph array`);

      // Organization check
      const org = data['@graph'].find((item) => item['@type'] === 'Organization');
      assert.ok(org, `${relPath} missing Organization in @graph`);
      assert.strictEqual(org.name, 'NEORM-ERA');
      assert.strictEqual(org.parentOrganization?.name, 'TAURUS AI Corp.');
      assert.strictEqual(org.parentOrganization?.address?.addressCountry, 'CA', `${relPath} missing addressCountry: CA`);

      // Homepage specific checks
      if (relPath === 'index.html') {
        const website = data['@graph'].find((item) => item['@type'] === 'WebSite');
        assert.ok(website, `index.html missing WebSite in @graph`);
        assert.ok(website.potentialAction, `index.html missing SearchAction in WebSite`);
      } else {
        // Non-home pages breadcrumb check
        const breadcrumb = data['@graph'].find((item) => item['@type'] === 'BreadcrumbList');
        assert.ok(breadcrumb, `${relPath} missing BreadcrumbList in @graph`);
        assert.ok(breadcrumb.itemListElement.length >= 2, `${relPath} BreadcrumbList must have at least 2 items`);
      }

      // Engine pages SoftwareApplication check
      const cfg = PAGES_CONFIG[relPath];
      if (cfg.engineSlug) {
        const app = data['@graph'].find((item) => item['@type'] === 'SoftwareApplication');
        assert.ok(app, `${relPath} missing SoftwareApplication in @graph`);
        assert.ok(app.name, `${relPath} SoftwareApplication missing name`);
        assert.ok(app.description, `${relPath} SoftwareApplication missing description`);
        assert.strictEqual(app.applicationCategory, 'BusinessApplication');
        assert.ok(app.offers?.price, `${relPath} SoftwareApplication missing offers.price`);
        assert.strictEqual(app.offers?.priceCurrency, 'USD');
      }

      // FAQPage check
      if (FAQS_DATA[relPath]) {
        const faq = data['@graph'].find((item) => item['@type'] === 'FAQPage');
        assert.ok(faq, `${relPath} missing FAQPage in @graph`);
        assert.ok(faq.mainEntity.length >= 4, `${relPath} FAQPage must have at least 4 questions`);
        for (const q of faq.mainEntity) {
          assert.strictEqual(q['@type'], 'Question');
          assert.ok(q.name && q.name.length > 5);
          assert.strictEqual(q.acceptedAnswer?.['@type'], 'Answer');
          assert.ok(q.acceptedAnswer?.text && q.acceptedAnswer.text.length > 10);
        }
      }
    });
  }
});

describe('Task A: Extractable Answer Content (FAQ HTML blocks)', () => {
  const faqPages = ['index.html', ...ENGINES.map((e) => `${e}/index.html`)];

  for (const relPath of faqPages) {
    test(`${relPath} renders semantic <dl class="faq-list"> with 4-6 questions`, () => {
      const html = read(relPath);
      assert.ok(html.includes('id="faq"'), `${relPath} missing #faq section`);
      assert.ok(html.includes('<dl class="faq-list">'), `${relPath} missing <dl class="faq-list">`);
      const dtMatches = [...html.matchAll(/<dt class="faq-question">([\s\S]*?)<\/dt>/g)];
      const ddMatches = [...html.matchAll(/<dd class="faq-answer">([\s\S]*?)<\/dd>/g)];

      assert.ok(dtMatches.length >= 4 && dtMatches.length <= 6, `${relPath} has ${dtMatches.length} questions (expected 4-6)`);
      assert.strictEqual(dtMatches.length, ddMatches.length, `${relPath} mismatched questions and answers count`);

      // Verify questions and answers are direct and non-empty
      for (let i = 0; i < dtMatches.length; i++) {
        assert.ok(dtMatches[i][1].trim().endsWith('?'), `${relPath} Q${i + 1} does not end in a question mark`);
        assert.ok(ddMatches[i][1].trim().length > 20, `${relPath} A${i + 1} is too short`);
      }
    });
  }
});

describe('Task A: llms.txt plain text specification', () => {
  test('platform/llms.txt exists and specifies company and 7 engines', () => {
    const fullPath = join(platform, 'llms.txt');
    assert.ok(existsSync(fullPath), 'platform/llms.txt does not exist');
    const content = read('llms.txt');
    assert.ok(content.includes('NEORM-ERA'), 'llms.txt missing NEORM-ERA');
    assert.ok(content.includes('TAURUS AI Corp.'), 'llms.txt missing TAURUS AI Corp.');
    assert.ok(content.includes('CBCA 1001270625'), 'llms.txt missing Canadian CBCA');

    for (const engine of ENGINES) {
      assert.ok(content.includes(`/${engine}/`), `llms.txt missing URL link for /${engine}/`);
    }
  });

  test('_headers specifies text/plain for /llms.txt', () => {
    const headers = read('_headers');
    assert.ok(
      headers.includes('/llms.txt') && headers.includes('Content-Type: text/plain'),
      '_headers does not specify text/plain for /llms.txt',
    );
  });
});

describe('Task A & D: 404.html and Canadian jurisdiction', () => {
  test('platform/404.html exists and links to all seven engines', () => {
    const fullPath = join(platform, '404.html');
    assert.ok(existsSync(fullPath), 'platform/404.html does not exist');
    const content = read('404.html');

    for (const engine of ENGINES) {
      assert.ok(content.includes(`/${engine}/`), `404.html missing link to /${engine}/`);
    }
  });

  test('every page carries the Canadian incorporation legal footer', () => {
    for (const relPath of Object.keys(PAGES_CONFIG)) {
      const html = read(relPath);
      assert.ok(
        html.includes('TAURUS AI Corp. (Canada CBCA 1001270625). All rights reserved. Serving worldwide.'),
        `${relPath} missing Canadian CBCA legal footer`,
      );
    }
  });
});
