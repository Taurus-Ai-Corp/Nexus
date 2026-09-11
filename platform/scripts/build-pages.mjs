#!/usr/bin/env node
/**
 * build-pages.mjs — Unified templating engine for NEORM-ERA platform.
 *
 * Injects shared nav, footer, skip link, <main> landmark, theme scripts,
 * Schema.org JSON-LD graphs, FAQ sections, and head partials
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
    breadcrumbName: 'Home',
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
    breadcrumbName: 'About',
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
    breadcrumbName: 'Pricing',
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
    breadcrumbName: 'Contact',
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
    breadcrumbName: 'Case Studies',
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
    breadcrumbName: 'Privacy Policy',
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
    breadcrumbName: 'Security',
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
    breadcrumbName: 'Terms of Service',
    title: 'Terms of Service — NEORM-ERA by Taurus AI',
    description: 'Terms of Service and commercial agreement for using the NEORM-ERA platform and services.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  '404.html': {
    brandStem: 'NEORM-ERA',
    brandLockup: '<span style="white-space:nowrap">NEORM-ERA <small>Agentic Studio</small></span>',
    ctaLabel: 'Book audit',
    ctaHref: '/contact.html',
    engineSlug: null,
    breadcrumbName: '404',
    title: '404 — Page Not Found | NEORM-ERA by Taurus AI',
    description: 'The requested page could not be found. Explore the NEORM-ERA AI agentic studio engines.',
    ogImage: '/assets/og-nexus-platform.png',
  },
  'creative/index.html': {
    brandStem: 'Neormative',
    brandLockup: '<span>Neormative <small>by Taurus AI</small></span>',
    ctaLabel: '$99/mo',
    ctaHref: '/contact.html',
    engineSlug: 'creative',
    engineFullName: 'Engine 01 · Neormative Ads',
    offerPrice: '99',
    breadcrumbName: 'Neormative Ads',
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
    engineFullName: 'Engine 02 · Neormedia Sync',
    offerPrice: '49',
    breadcrumbName: 'Neormedia Sync',
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
    engineFullName: 'Engine 03 · Neormintel Data',
    offerPrice: '199',
    breadcrumbName: 'Neormintel Data',
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
    engineFullName: 'Engine 05 · Neormestate Reels',
    offerPrice: '149',
    breadcrumbName: 'Neormestate Reels',
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
    engineFullName: 'Engine 06 · Neormeo Authority',
    offerPrice: '199',
    breadcrumbName: 'Neormeo Authority',
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
    engineFullName: 'Engine 07 · Neormence Studio',
    offerPrice: '399',
    breadcrumbName: 'Neormence Studio',
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
    engineFullName: 'Engine 04 · Neormestra Flow',
    offerPrice: '349',
    breadcrumbName: 'Neormestra Flow',
    title: 'Neormestra — Autonomous Workflow Orchestration | NEORM-ERA by Taurus AI',
    description: 'Neormestra (Engine 04) orchestrates end-to-end multi-agent marketing pipelines across creation, approval, distribution, and attribution.',
    ogImage: '/assets/og-nexus-flow.png',
  }
};

export const FAQS_DATA = {
  'index.html': [
    {
      q: 'What is NEORM-ERA?',
      a: 'NEORM-ERA by TAURUS AI Corp. is an AI agentic studio for performance marketing. It operates seven specialized engines covering autonomous ad creative generation, social distribution, real-time ROAS attribution, real estate video tours, GEO search authority, agency workspaces, and workflow orchestration.'
    },
    {
      q: 'Which engines are currently shipping in NEORM-ERA?',
      a: 'Engine 01 (Neormative Ads) and Engine 02 (Neormedia Sync) are currently shipping. Engine 03 (Neormintel Data), Engine 05 (Neormestate Reels), and Engine 06 (Neormeo Authority) have live landing demos and early access. Engine 04 (Neormestra Flow) and Engine 07 (Neormence Studio) are in private preview.'
    },
    {
      q: 'Where is NEORM-ERA incorporated and operating?',
      a: 'NEORM-ERA is developed and operated worldwide by TAURUS AI Corp., a federally incorporated Canadian corporation (CBCA 1001270625), with primary regional market hubs across the UAE, GCC, and India.'
    },
    {
      q: 'What results have businesses achieved using NEORM-ERA engines?',
      a: 'Case studies demonstrate measurable outcomes including a 2.3× projected CTR uplift for luxury dining, a 41% increase in qualified leads with a 23% CPL reduction for retail chains, and proof-of-concept deployments converting to $399/month subscriptions within 48 hours.'
    },
    {
      q: 'How does NEORM-ERA integrate with existing ad accounts?',
      a: 'NEORM-ERA connects directly to Meta Ads Manager, Instagram Graph API, Google Business Profile, and WhatsApp Business API without requiring replacement of your existing ad accounts or creative stack.'
    }
  ],
  'creative/index.html': [
    {
      q: 'What does Neormative Ads do?',
      a: 'Neormative Ads (Engine 01) autonomously generates editorial-grade ad concepts, multi-platform copy variants, visual art direction briefs, and heuristic ad quality scores directly from product URLs or campaign briefs.'
    },
    {
      q: 'How does Neormative score ad concepts before publishing?',
      a: 'Neormative evaluates ad drafts against a predictive heuristic scoring model assessing hook strength, value proposition clarity, emotional resonance, and brand safety before any ad spend is committed.'
    },
    {
      q: 'What ad formats does Neormative generate?',
      a: 'Neormative outputs 1:1 square feeds, 9:16 vertical stories and reels, 16:9 landscape display banners, and multi-line carousel copy for Meta, Instagram, LinkedIn, and Google Performance Max.'
    },
    {
      q: 'How much does Neormative Ads cost?',
      a: 'Neormative Ads starts at $99 per month for growth teams and includes unlimited brief analysis, copy generation, and heuristic scoring.'
    }
  ],
  'social/index.html': [
    {
      q: 'What is Neormedia Sync?',
      a: 'Neormedia Sync (Engine 02) is an autonomous social media management and distribution system connecting Meta, Instagram, WhatsApp Business, and Google Business Profile for scheduled multi-channel publishing and automated customer engagement.'
    },
    {
      q: 'Does Neormedia Sync support two-way WhatsApp messaging?',
      a: 'Yes, Neormedia Sync integrates with the WhatsApp Business API to handle inbound prospect queries, qualify leads with AI conversational agents, and route high-intent conversations to sales representatives.'
    },
    {
      q: 'How does Neormedia maintain Google Business Profile visibility?',
      a: 'Neormedia schedules weekly localized GBP updates, manages photo uploads, and drafts automated review responses to maximize local 3-pack search rankings.'
    },
    {
      q: 'How much does Neormedia Sync cost?',
      a: 'Neormedia Sync starts at $49 per month for single-location businesses and scales to $199 per month for multi-location brands and agencies.'
    }
  ],
  'intel/index.html': [
    {
      q: 'What is Neormintel Data?',
      a: 'Neormintel Data (Engine 03) is a real-time marketing intelligence platform providing cross-channel attribution, predictive ROAS modeling, and automated cost-per-lead (CPL) anomaly alerts across Meta and Google ad channels.'
    },
    {
      q: 'How does Neormintel detect ad fatigue and CPL spikes?',
      a: 'Neormintel continuously monitors impression saturation, frequency shifts, and hourly conversion velocities, alerting marketing teams via webhook or Slack before wasted ad budget exceeds threshold limits.'
    },
    {
      q: 'Can Neormintel predict ROAS before ad spend is finalized?',
      a: 'Yes, Neormintel uses historical cohort performance, creative feature vectors, and seasonal benchmark data to estimate blended ROAS confidence intervals for planned campaign budgets.'
    },
    {
      q: 'What is the pricing for Neormintel Data?',
      a: 'Neormintel Data is available in early access starting at $199 per month for brands spending up to $25,000 monthly on paid acquisition.'
    }
  ],
  'estate/index.html': [
    {
      q: 'How does Neormestate Reels generate real estate videos?',
      a: 'Neormestate Reels (Engine 05) accepts an MLS number or property listing URL, extracts architectural photos, highlights key amenities, and synthesizes 9:16 vertical video tours with motion graphics, captions, and licensed music in under 90 seconds.'
    },
    {
      q: 'Does Neormestate also generate the Meta lead campaign?',
      a: 'Yes, alongside video rendering, Neormestate writes hyper-local ad copy, selects neighborhood demographic targeting parameters, and formats instant lead generation forms for Facebook and Instagram.'
    },
    {
      q: 'Can agents white-label Neormestate videos with their own branding?',
      a: 'Yes, agent headshots, brokerage logos, contact details, and custom brand colors can be automatically watermarked into all video outputs and lead form banners.'
    },
    {
      q: 'How much does Neormestate Reels cost?',
      a: 'Neormestate Reels pricing starts at $149 per month for individual real estate agents, covering up to 10 property video packages per month.'
    }
  ],
  'seo/index.html': [
    {
      q: 'What is Generative Engine Optimization (GEO) in Neormeo Authority?',
      a: 'Neormeo Authority (Engine 06) optimizes digital content, schema markup, and entity definitions specifically to be cited as authoritative sources by LLM search engines like ChatGPT Search, Perplexity, and Google Gemini AI Overviews.'
    },
    {
      q: 'What structured data does Neormeo implement?',
      a: 'Neormeo injects comprehensive Schema.org JSON-LD graphs including Organization, SoftwareApplication, FAQPage, BreadcrumbList, and Person entities with precise disambiguation URIs and sameAs citations.'
    },
    {
      q: 'How does Neormeo measure LLM search visibility?',
      a: 'Neormeo monitors prompt query benchmarks across major AI answer engines, tracking brand citation frequency, sentiment polarity, and direct URL attribution over time.'
    },
    {
      q: 'What is the subscription cost for Neormeo Authority?',
      a: 'Neormeo Authority starts at $199 per month for businesses seeking enhanced entity visibility across conversational and generative search platforms.'
    }
  ],
  'freelance/index.html': [
    {
      q: 'What is Neormence Studio?',
      a: 'Neormence Studio (Engine 07) is a collaborative workspace designed for marketing agencies, creative studios, and freelance strategists to manage client campaigns under their own white-label domain.'
    },
    {
      q: 'How does Neormence handle client data isolation?',
      a: 'Neormence provides isolated multi-tenant client portals with role-based access control, ensuring brand assets, API credentials, campaign performance data, and billing remain strictly segregated between accounts.'
    },
    {
      q: 'Can agencies white-label reports and dashboards?',
      a: 'Yes, agencies can customize the platform domain, favicon, logo, and email notifications to deliver an end-to-end proprietary branded client experience.'
    },
    {
      q: 'How much does Neormence Studio cost?',
      a: 'Neormence Studio pricing starts at $399 per month and includes 5 client portals, white-label reporting, and team collaboration seats.'
    }
  ],
  'flow/index.html': [
    {
      q: 'What is Neormestra Flow?',
      a: 'Neormestra Flow (Engine 04) is an autonomous marketing orchestration engine that connects creative generation, compliance validation, client approvals, and ad publishing into unified agentic pipelines.'
    },
    {
      q: 'How do human-in-the-loop approvals work in Neormestra Flow?',
      a: 'Before any campaign is published or ad spend committed, Neormestra Flow generates an interactive approval card sent via email or Slack, allowing account managers or clients to approve, edit, or reject assets with one click.'
    },
    {
      q: 'What external systems can Neormestra Flow connect with?',
      a: 'Neormestra Flow integrates via REST API and webhooks with CRM platforms (HubSpot, Salesforce), advertising networks (Meta, Google), analytics suites, and messaging systems.'
    },
    {
      q: 'When will Neormestra Flow be publicly available?',
      a: 'Neormestra Flow is currently in private preview with waitlist access for select enterprise partners, with standard tier pricing planned at $349 per month.'
    }
  ]
};

export const THEME_SCRIPT = `  <script id="theme-persist">
    (function(){
      var s = localStorage.getItem('theme');
      if(s) document.documentElement.setAttribute('data-theme', s);
      document.addEventListener('DOMContentLoaded', function(){
        var btn = document.getElementById('theme-toggle');
        if(btn){
          btn.addEventListener('click', function(){
            var cur = document.documentElement.getAttribute('data-theme');
            var isDark = cur === 'dark' || (!cur && window.matchMedia('(prefers-color-scheme: dark)').matches);
            var next = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
          });
        }
      });
    })();
  </script>`;

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
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle dark/light mode"><span class="theme-icon-light" aria-hidden="true">☀️</span><span class="theme-icon-dark" aria-hidden="true">🌙</span></button>
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
        <span>© <span data-year>2026</span> TAURUS AI Corp. (Canada CBCA 1001270625). All rights reserved. Serving worldwide.</span>
        <div class="legal"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></div>
      </div>
    </div>
  </footer>`;
}

export function renderFaqSection(faqs) {
  if (!faqs || !faqs.length) return '';
  const items = faqs.map(f => `        <div class="faq-item reveal">
          <dt class="faq-question">${f.q}</dt>
          <dd class="faq-answer">${f.a}</dd>
        </div>`).join('\n');
  return `  <section class="section faq-section" id="faq">
    <div class="container narrow">
      <div class="section-head reveal">
        <div class="eyebrow">FAQ</div>
        <h2>Frequently asked questions.</h2>
        <p class="lead">Direct answers about capabilities, workflow integration, and pricing.</p>
      </div>
      <dl class="faq-list">
${items}
      </dl>
    </div>
  </section>`;
}

export function renderJsonLd(relPath, cfg) {
  const origin = 'https://www.neorm-era.com';
  const pageUrl = relPath === 'index.html' ? origin : `${origin}/${relPath.replace('index.html', '')}`;
  const graph = [];

  // 1. Organization on every page
  graph.push({
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    'name': 'NEORM-ERA',
    'url': origin,
    'logo': `${origin}/assets/favicon.svg`,
    'parentOrganization': {
      '@type': 'Organization',
      'name': 'TAURUS AI Corp.',
      'url': 'https://www.taurusai.io',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'CA'
      }
    },
    'sameAs': [
      'https://www.linkedin.com/company/taurus-ai-corp'
    ]
  });

  // 2. WebSite on homepage only
  if (relPath === 'index.html') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      'name': 'NEORM-ERA',
      'url': origin,
      'publisher': {
        '@id': `${origin}/#organization`
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${origin}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
  }

  // 3. BreadcrumbList on every non-home page
  if (relPath !== 'index.html') {
    const crumbName = cfg.breadcrumbName || cfg.brandStem || 'Page';
    graph.push({
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': origin
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': crumbName,
          'item': pageUrl
        }
      ]
    });
  }

  // 4. SoftwareApplication on each engine page
  if (cfg.engineSlug) {
    graph.push({
      '@type': 'SoftwareApplication',
      'name': cfg.engineFullName || cfg.brandStem,
      'description': cfg.description,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': cfg.offerPrice || '99',
        'priceCurrency': 'USD'
      },
      'creator': {
        '@id': `${origin}/#organization`
      }
    });
  }

  // 5. FAQPage if page has FAQs
  const faqs = FAQS_DATA[relPath];
  if (faqs && faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    });
  }

  const jsonString = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  return `  <script type="application/ld+json" id="schema-org">\n${jsonString}\n  </script>`;
}

export function buildPage(relPath) {
  const fullPath = join(platform, relPath);
  let html = readFileSync(fullPath, 'utf8');
  const cfg = PAGES_CONFIG[relPath];
  if (!cfg) return;

  // 1. Unified nav replacement
  const navHtml = renderNav(cfg);
  html = html.replace(/^[ \t]*<nav[\s\S]*?<\/nav>/m, navHtml);

  // 2. Unified footer replacement
  const footerHtml = renderFooter();
  html = html.replace(/^[ \t]*<footer[\s\S]*?<\/footer>/m, footerHtml);

  // 3. Skip link injection (immediately following <body...>)
  const skipLink = '<a href="#main-content" class="skip-link">Skip to main content</a>';
  if (!html.includes('class="skip-link"')) {
    html = html.replace(/(<body[^>]*>)/i, `$1\n  ${skipLink}`);
  }

  // 4. <main id="main-content"> landmark
  if (!html.includes('<main id="main-content">')) {
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

  // 9. Inject theme toggle persistence script in head
  if (html.includes('id="theme-persist"')) {
    html = html.replace(/^[ \t]*<script id="theme-persist">[\s\S]*?<\/script>/m, THEME_SCRIPT);
  } else if (html.includes("localStorage.getItem('theme')")) {
    html = html.replace(/<script(?![^>]*\bsrc=)[^>]*>(?:(?!<\/script>)[\s\S])*?localStorage\.getItem\('theme'\)[\s\S]*?<\/script>/, THEME_SCRIPT.trim());
  } else {
    html = html.replace(/(<\/head>)/i, `${THEME_SCRIPT}\n$1`);
  }

  // 10. Inject Schema.org JSON-LD graph in head
  const jsonLdSnippet = renderJsonLd(relPath, cfg);
  if (html.includes('id="schema-org"')) {
    html = html.replace(/^[ \t]*<script type="application\/ld\+json" id="schema-org">[\s\S]*?<\/script>/m, jsonLdSnippet);
  } else {
    html = html.replace(/(<\/head>)/i, `${jsonLdSnippet}\n$1`);
  }

  // 11. Inject or update FAQ block if configured for page
  const faqs = FAQS_DATA[relPath];
  if (faqs && faqs.length) {
    const faqSectionHtml = renderFaqSection(faqs);
    if (html.includes('id="faq"')) {
      html = html.replace(/^[ \t]*<section[^>]*id="faq"[\s\S]*?<\/section>/m, faqSectionHtml);
    } else {
      html = html.replace(/(<\/main>)/i, `${faqSectionHtml}\n  $1`);
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
