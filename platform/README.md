# NEXUS by Taurus AI — Marketing Platform

Static marketing site for NEXUS, the AI-powered growth platform from TAURUS AI CORP - FZCO.

## Structure

```
platform/
├── assets/
│   ├── css/design-system.css    # shared tokens, components, themes
│   └── js/main.js               # nav, reveal, FAQ, tabs, typewriter
├── index.html                   # platform home + 4 pillars
├── social/index.html            # nexus.taurusai.io/social
├── creative/index.html          # nexus.taurusai.io/creative
├── intel/index.html             # nexus.taurusai.io/intel
├── freelance/index.html         # nexus.taurusai.io/freelance
├── about.html
├── pricing.html
├── case-studies.html
├── contact.html
├── privacy.html
├── terms.html
├── security.html
└── vercel.json
```

## Development

No build step is required. Open any `.html` file in a browser, or run a local server:

```bash
cd platform
python3 -m http.server 3000
```

## Deploy

Pushes to `feat/nexosync-to-nexus-rebrand` auto-deploy via Vercel. Subpaths are served by `vercel.json` rewrites:

- `/social` → `platform/social/index.html`
- `/creative` → `platform/creative/index.html`
- `/intel` → `platform/intel/index.html`
- `/freelance` → `platform/freelance/index.html`

## Brand notes

- Marketing copy uses **NEXUS by Taurus AI**.
- Legal/footer uses **TAURUS AI CORP - FZCO**.
- Creative vertical uses the warm editorial `.theme-creative` override while sharing the same design tokens.
