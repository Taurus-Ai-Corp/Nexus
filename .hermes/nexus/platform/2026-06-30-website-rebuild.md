# NEXUS Marketing Site Rebuild Plan

> Date: 2026-06-30
> Scope: `platform/` static site for `nexus.taurusai.io`

## Objective

Rebuild and harden the NEXUS by Taurus AI marketing site so it reflects the current operating-brand split and converts inbound leads reliably.

## Context from CLAUDE.md

The site is static HTML/CSS/JS under `platform/`:

- Home: `platform/index.html`
- Verticals: `/social`, `/creative`, `/intel`, `/freelance` — each served via `platform/{vertical}/index.html`
- Shared design tokens: `platform/assets/css/design-system.css`
- Shared JS: `platform/assets/js/main.js`
- Contact backend: `platform/api/contact.js` (Nodemailer / SMTP)
- Tests: `platform/api/contact.test.js`
- Vercel config: `platform/vercel.json` with rewrites, security headers, asset caching

## Work Items

1. **Design-system audit**
   - Verify all four verticals consume `design-system.css` and do not duplicate tokens.
   - Remove any leftover NeoVibe / BizFlow / NeoSync color or copy references.

2. **Vertical completeness**
   - `/social` — agency social content landing
   - `/creative` — creative design studio landing
   - `/intel` — market intelligence landing
   - `/freelance` — freelancer / gig-economy landing
   - Each vertical must have a distinct CTA that posts to `/api/contact`.

3. **Contact pipeline**
   - `platform/api/contact.js` uses Brevo SMTP relay (`smtp-relay.brevo.com:587`).
   - `EMAIL_FROM=Nexus Leads <leads@nexus.taurusai.io>`.
   - `LEAD_RECIPIENT_EMAIL=admin@taurusai.io`.
   - Add rate limiting and honeypot field to reduce spam.

4. **Vercel / DNS hygiene**
   - `vercel.json` rewrites must keep `/api/contact` hitting the serverless handler.
   - Confirm Cloudflare DNS records for `nexus` subdomain are DNS-only where required by Brevo DKIM.

5. **Testing**
   - `npm test` in `platform/` must pass before any prod deploy.
   - Add a smoke test that hits each vertical path and asserts 200.

## Acceptance Criteria

- `npx serve . -p 3000` from `platform/` renders all pages.
- `npm test` passes.
- No stale brand names in `platform/` copy or assets.
- Vercel `--prod` deploy succeeds.

## Human-in-the-Loop Gate

Before changing `vercel.json` or DNS records, present a dry-run diff and ask for `PROCEED`.
