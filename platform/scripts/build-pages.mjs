#!/usr/bin/env node
/**
 * build-pages.mjs — Unified templating engine for NEORM-ERA platform.
 *
 * Injects shared nav, footer, skip link, <main> landmark, and head partials
 * into platform pages from a central page configuration map.
 * Eliminates the copy-paste substrate and prevents multi-file drift.
 *
 * Run via: npm run build (or node scripts/build-pages.mjs)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const platform = join(here, '..');

export const PAGES_CONFIG = {
  'index.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book a 15-min audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'NEORM-ERA — AI Agentic Studio for Performance Marketing | Taurus AI',
    description: 'NEORM-ERA by Taurus AI is the AI agentic studio for performance marketing: 7 purpose-built engines from brief to creative, social autopilot, and predictive ROAS.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'about.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'About — NEORM-ERA by Taurus AI',
    description: 'NEORM-ERA is the AI marketing and creative platform built by TAURUS AI Corp. for UAE, India, and GCC businesses.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'pricing.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Pricing — NEORM-ERA by Taurus AI',
    description: 'Transparent pricing for NEORM-ERA engines. Starter, Pro, and Enterprise tiers for local business, creative teams, real estate, and agencies.',
    ogImage: '/assets/og-nexus-pricing.png',
  },
  'contact.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Contact — NEORM-ERA by Taurus AI',
    description: 'Schedule a strategic performance audit or request custom enterprise AI marketing deployment from TAURUS AI Corp.',
    ogImage: '/assets/og-nexus-contact.png',
  },
  'case-studies.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Case Studies — NEORM-ERA by Taurus AI',
    description: 'Real-world campaign results and performance marketing outcomes across UAE and GCC retail, real estate, and clinic brands.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'privacy.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Privacy Policy — NEORM-ERA by Taurus AI',
    description: 'Privacy Policy and data governance standards for the NEORM-ERA platform and TAURUS AI Corp.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'security.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Security — NEORM-ERA by Taurus AI',
    description: 'Enterprise data security, encryption, and privacy architecture behind the NEORM-ERA platform.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'terms.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    title: 'Terms of Service — NEORM-ERA by Taurus AI',
    description: 'Terms of Service and commercial agreement for using the NEORM-ERA platform and services.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'creative/index.html': {
    brandStem: 'Neormative',
    brandLockup: '<span>Neormative <small>by Taurus AI</small></span>',
    ctaLabel: '$99/mo',
    ctaHref: '/contact.html',
    engineSlug: 'creative',
    title: 'Neormative — AI Campaign Studio | NEORM-ERA by Taurus AI',
    description: 'Neormative (Engine 01) generates editorial-grade ad concepts, multi-platform copy, visual briefs, and heuristic scoring for performance campaigns.',
    ogImage: '/assets/og-nexus-creative.png',
  },
  'social/index.html': {
    brandStem: 'Neormedia',
    brandLockup: '<span>Neormedia <small>by Taurus AI</small></span>',
    ctaLabel: 'Free audit',
    ctaHref: '/contact.html',
    engineSlug: 'social',
    title: 'Neormedia — AI Social Media Automation | NEORM-ERA by Taurus AI',
    description: 'Neormedia (Engine 02) is autonomous social media management: Meta, Instagram, WhatsApp, and Google Business Profile sync with smart publishing.',
    ogImage: '/assets/og-nexus-social.png',
  },
  'intel/index.html': {
    brandStem: 'Neormintel',
    brandLockup: '<span>Neormintel <small>by Taurus AI</small></span>',
    ctaLabel: 'View live demo',
    ctaHref: '/contact.html',
    engineSlug: 'intel',
    title: 'Neormintel — Real-Time Marketing Intelligence | NEORM-ERA by Taurus AI',
    description: 'Neormintel (Engine 03) delivers real-time attribution, ROAS prediction, CPL anomaly tracking, and executive intelligence dashboards.',
    ogImage: '/assets/og-nexus-intel.png',
  },
  'estate/index.html': {
    brandStem: 'Neormestate',
    brandLockup: '<span>Neormestate <small>by Taurus AI</small></span>',
    ctaLabel: 'Get early access',
    ctaHref: '/contact.html',
    engineSlug: 'estate',
    title: 'Neormestate — AI Real Estate Marketing | NEORM-ERA by Taurus AI',
    description: 'Neormestate (Engine 05) turns an MLS or property URL into 9:16 video tours and hyper-local Facebook and Instagram lead ads in 90 seconds.',
    ogImage: '/assets/og-nexus-estate.png',
  },
  'seo/index.html': {
    brandStem: 'Neormeo',
    brandLockup: '<span>Neormeo <small>by Taurus AI</small></span>',
    ctaLabel: 'Get early access',
    ctaHref: '/contact.html',
    engineSlug: 'seo',
    title: 'Neormeo — GEO & AI Search Optimization | NEORM-ERA by Taurus AI',
    description: 'Neormeo (Engine 06) optimizes your brand authority for Generative AI search results, LLM answers, Perplexity citations, and local search visibility.',
    ogImage: '/assets/og-nexus-seo.png',
  },
  'freelance/index.html': {
    brandStem: 'Neormence',
    brandLockup: '<span>Neormence <small>by Taurus AI</small></span>',
    ctaLabel: 'Apply for access',
    ctaHref: '/contact.html',
    engineSlug: 'freelance',
    title: 'Neormence — White-Label Agency Workspace | NEORM-ERA by Taurus AI',
    description: 'Neormence (Engine 07) is a collaborative workspace for marketing agencies and top-tier freelancers with client portals and brand asset isolation.',
    ogImage: '/assets/og-nexus-freelance.png',
  },
  'flow/index.html': {
    brandStem: 'Neormestra',
    brandLockup: '<span>Neormestra <small>by Taurus AI</small></span>',
    ctaLabel: 'Join the waitlist',
    ctaHref: '/contact.html',
    engineSlug: 'flow',
    title: 'Neormestra — Autonomous Workflow Orchestration | NEORM-ERA by Taurus AI',
    description: 'Neormestra (Engine 04) orchestrates end-to-end multi-agent marketing pipelines across creation, approval, distribution, and attribution.',
    ogImage: '/assets/og-nexus-flow.png',
  }
};

export function renderNav(cfg) {
  return `  <nav class="nav">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <span class="mark">NE</span>
        ${cfg.brandLockup}
      </a>
      <div class="nav-links hidden">
        <a href="/">Platform</a>
        <a href="/creative/">Neormative</a>
        <a href="/social/">Neormedia</a>
        <a href="/intel/">Neormintel</a>
        <a href="/estate/">Neormestate</a>
        <a href="/seo/">Neormeo</a>
        <a href="/freelance/">Neormence</a>
        <a href="/pricing.html">Pricing</a>
      </div>
      <div class="nav-cta">
        <a href="${cfg.ctaHref}" class="btn btn-primary" data-track="cta_click" data-track-label="contact">${cfg.ctaLabel}</a>
        <button class="nav-toggle" aria-label="Menu"><span></span></button>
      </div>
    </div>
  </nav>`;
}

export function renderFooter() {
  return `  <footer>
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <a href="/" class="brand"><span class="mark">NE</span><span>NEORM-ERA <small>by Taurus AI</small></span></a>
          <p>AI marketing automation and creative design by TAURUS AI Corp.</p>
        </div>
        <div class="foot-col">
          <h5>Platform</h5>
          <a href="/social/">Neormedia</a>
          <a href="/creative/">Neormative</a>
          <a href="/intel/">Neormintel</a>
          <a href="/estate/">Neormestate</a>
          <a href="/seo/">Neormeo</a>
          <a href="/campaigns/">Neormative demo</a>
          <a href="/freelance/">Neormence</a>
          <a href="/flow/">Neormestra <small>soon</small></a>
          <a href="/contact.html">NEORM-ERA Agency <small>soon</small></a>
        </div>
        <div class="foot-col">
          <h5>Company</h5>
          <a href="/about.html">About</a>
          <a href="/case-studies.html">Case Studies</a>
          <a href="/pricing.html">Pricing</a>
          <a href="/contact.html">Contact</a>
        </div>
        <div class="foot-col">
          <h5>Legal</h5>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/security.html">Security</a>
        </div>
        <div class="foot-col">
          <h5>Connect</h5>
          <a href="mailto:admin@taurusai.io">admin@taurusai.io</a>
          <a href="https://www.linkedin.com/company/taurus-ai-corp" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© <span data-year>2026</span> TAURUS AI Corp. All rights reserved.</span>
        <div class="legal"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></div>
      </div>
    </div>
  </footer>`;
}

export function buildPage(relPath) {
  const fullPath = join(platform, relPath);
  let html = readFileSync(fullPath, 'utf8');
  const cfg = PAGES_CONFIG[relPath];
  if (!cfg) return;

  // 1. Unified nav replacement
  // Idempotent: matches from start of line including leading indentation so repeated builds never drift.
  const navHtml = renderNav(cfg);
  html = html.replace(/^[ \t]*<nav[\s\S]*?<\/nav>/m, navHtml);

  // 2. Unified footer replacement
  // Idempotent: matches from start of line including leading indentation.
  const footerHtml = renderFooter();
  html = html.replace(/^[ \t]*<footer[\s\S]*?<\/footer>/m, footerHtml);

  // 3. Skip link injection (immediately following <body...>)
  const skipLink = '<a href="#main-content" class="skip-link">Skip to main content</a>';
  if (!html.includes('class="skip-link"')) {
    html = html.replace(/(<body[^>]*>)/i, `$1\n  ${skipLink}`);
  }

  // 4. <main id="main-content"> landmark
  // Wrap content between </nav> and <footer> if not already wrapped
  // Fixed: nav and footer replacements are now idempotent (/^[ \t]*<...>/m).
  if (!html.includes('<main id="main-content">')) {
    // Remove any bare <main> if present
    html = html.replace(/<main[^>]*>/i, '').replace(/<\/main>/i, '');
    html = html.replace(
      /(<\/nav>)([\s\S]*?)( {2}<footer|<footer)/i,
      `$1\n  <main id="main-content">$2  </main>\n$3`
    );
  }

  // 5. Ensure favicon in head
  if (!html.includes('href="/assets/favicon.svg"')) {
    html = html.replace(
      /(<\/head>)/i,
      `  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">\n  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">\n$1`
    );
  }

  // 6. Ensure og:image in head
  if (!html.includes('property="og:image"')) {
    html = html.replace(
      /(<\/head>)/i,
      `  <meta property="og:image" content="https://www.neorm-era.com${cfg.ogImage}">\n  <meta name="twitter:image" content="https://www.neorm-era.com${cfg.ogImage}">\n$1`
    );
  }

  // 7. Standardize gtag in head if absent
  if (!html.includes('gtag') && !html.includes('googletagmanager.com')) {
    const gtagSnippet = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-PLACEHOLDER', { send_page_view: true });
  </script>`;
    html = html.replace(/(<\/head>)/i, `${gtagSnippet}\n$1`);
  }

  // 8. Inject ambient video poster preload if video manifest exists and page has a hero
  const videoManifestPath = join(platform, 'assets', 'video', 'manifest.json');
  if (existsSync(videoManifestPath)) {
    try {
      const vManifest = JSON.parse(readFileSync(videoManifestPath, 'utf8'));
      if (vManifest.poster && (html.includes('class="hero"') || html.includes('class="hero ') || html.includes('class="hero-grid'))) {
        const preloadTag = `  <link rel="preload" as="image" href="${vManifest.poster}" type="image/webp" fetchpriority="high">`;
        if (!html.includes(vManifest.poster)) {
          html = html.replace(/(<\/head>)/i, `${preloadTag}\n$1`);
        }
      }
    } catch {
      // Manifest parse error or absent — skip cleanly
    }
  }

  writeFileSync(fullPath, html, 'utf8');
}

/** Fix mixed-case Neorm-Era across all html files */
export function fixBrandCasing() {
  function getHtmlFiles(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      if (['node_modules', 'prototype', '.vercel', 'tests', 'scripts'].includes(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) getHtmlFiles(full, out);
      else if (entry.endsWith('.html')) out.push(full);
    }
    return out;
  }

  const files = getHtmlFiles(platform);
  let totalFixed = 0;
  for (const file of files) {
    let content = readFileSync(file, 'utf8');
    const matches = content.match(/\bNeorm-Era\b/g);
    if (matches) {
      totalFixed += matches.length;
      content = content.replace(/\bNeorm-Era\b/g, 'NEORM-ERA');
      writeFileSync(file, content, 'utf8');
    }
  }
  return totalFixed;
}

// Execute when run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const relPath of Object.keys(PAGES_CONFIG)) {
    buildPage(relPath);
  }
  const fixed = fixBrandCasing();
  console.log(`Successfully built ${Object.keys(PAGES_CONFIG).length} pages with unified chrome.`);
  console.log(`Replaced ${fixed} occurrences of mixed-case Neorm-Era with NEORM-ERA.`);
}
