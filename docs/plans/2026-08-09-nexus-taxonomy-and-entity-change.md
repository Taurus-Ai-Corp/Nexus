# Nexus: vertical taxonomy expansion + entity change to Canada

**Date:** 2026-08-09
**Supersedes:** `docs/plans/2026-06-25-nexus-platform-website-rebuild.md` (4-vertical architecture)
**Branch:** `feat/unify-nexus-creative-campaigns`

This document exists because the 4-vertical spec has now been rebuilt against twice by
sessions that found it and treated it as current — the same failure the 2026-06-25 doc itself
called out about the older 3-flagship `prd_website_launch.md`. Read this one first.

---

## 1. Contracting entity moved to Canada (2026-08-08)

**"TAURUS AI CORP - FZCO"** (UAE, IFZA Dubai, License #68122) was retired as the NEXUS
contracting entity. NEXUS now contracts through **TAURUS AI Corp.** (Canada — Federal CBCA,
1001270625, 2261 Marentette Ave, Windsor ON N8X 4E9) and serves worldwide.

Changed in the canonical source `~/.ai-context/taxonomy/TAXONOMY.toml` (v1.1.0), which
regenerates 15 agent-context files. **Do not hand-edit the generated blocks.**

Consequences that are easy to miss:

- `platform/terms.html` governing law moved from **DIFC / UAE** to **Ontario / Canada**.
  Flagged for counsel; the wording is a standard form, not legal advice.
- Two Mater Maria invoices (`NV-2026-001`, `INV-MMH-2026-002`) are **unpaid** and their
  UAE VAT-exemption and **UAE-India DTAA Article 7** no-TDS claims do NOT transfer. Their
  tax lines are `PENDING ACCOUNTANT CONFIRMATION` placeholders. The client is in India;
  Canada-India withholding has different rates and its own TRC / Form 10F requirements.
  **Do not fill these in without the accountant.**
- Documents that *reason about* UAE mechanics (free-zone bank accounts, IFZA employer
  health insurance, UAE visa sponsorship) carry superseded headers and were deliberately
  NOT find-and-replaced — renaming the entity there would turn accurate history into
  confident nonsense. See `docs/superpowers/specs/2026-03-21-neovibe-business-structure.*`
  and `2026-03-25-neovibe-moa-praveen-varkey.html`.

Market positioning (UAE/India/GCC copy, AED-first pricing) was deliberately left unchanged.
A Canadian entity can sell into those markets. Repositioning to worldwide is a separate pass.

## 2. Vertical taxonomy: 4 → 5 shipping, 7 planned

The 2026-06-25 doc locked the platform to exactly four verticals and kept Agency OS as a
sibling product. That is superseded.

| Vertical | Path | State |
|---|---|---|
| Nexus Social | `/social/` | shipping |
| Nexus Creative | `/creative/` | shipping |
| Nexus Campaign | `/campaigns/` | shipping — see the caveat below |
| Nexus Intel | `/intel/` | landing only |
| Nexus Freelance | `/freelance/` | skeleton |
| Nexus Orchestra | — | **not deployed**; `/orchestra` 404s |
| Nexus Agency | — | **not deployed**; `/agency` 404s |

**Orchestra and Agency are not in the nav bar on purpose.** Both paths return 404 until the
reverse-proxy mounts land. They appear on the home pillar grid and in the footer as waitlist
CTAs pointing at `/contact.html`, so the taxonomy reads complete without shipping dead links.
When the mounts go live, flip those four links to real paths and drop the `Soon` badges.

**`/flow` is live but deliberately unlinked.** The canonical taxonomy marks Nexus Flow as
roadmap and explicitly "not in site nav". The page returns 200; that is intentional, not an
oversight.

### Caveat: Campaign and Creative are currently the same product

`platform/campaigns/index.html` and `platform/creative/index.html` both render
`<title>Nexus Creative — AI Campaign Studio</title>`. `/campaigns/` is the migrated
`nexus-creative-editorial` site ("The campaign brief. Scored."); `/creative/` is the
platform-native landing.

Promoting `/campaigns/` to its own vertical was an explicit product decision, but the two
pages have not actually been differentiated. Campaign is currently presented as the **$99
campaign-diagnostic entry point** into Creative rather than a separately-priced SKU, and
`pricing.html` says so. **Either differentiate the two pages or merge them** — leaving two
nav entries whose titles both say "Nexus Creative" is the inconsistency this doc is meant
to prevent.

## 3. Operational facts a future session will otherwise rediscover the hard way

- **Production drifts from git.** Every `nexus-platform` deploy is a CLI deploy from a
  working tree. Before deploying, verify the tree is a superset of what is live — this has
  already caused two regressions (a stale stylesheet missing `.nav-dropdown*`, and six
  campaign pages deleted locally while still serving 200).
  `platform/tests/deploy-safety.test.js` guards both.
- **`platform/api/` is at exactly 12/12 Vercel Hobby functions.** Zero headroom. The proxy
  mounts for Orchestra/Agency add none, but any new API route needs consolidation first.
  There is a test asserting the cap.
- **`taurusai.io` is mid-registrar-transfer** (`pendingTransfer` as of 2026-08-08).
  Every subdomain (`nexus`, `orca`, `opsflow`, `bizflow`, `bio-foundry`, `www`) resolves to
  parking and **HTTPS times out** — verified 2026-08-09, now `104.219.250.37` (it was
  `72.251.7.22/.23` on 2026-08-08, so the parking target is still moving). The Cloudflare
  zone `6e3b2864707588f82a4e6b022010002d` exists but is `status: pending`, expecting
  `dexter`/`gina.ns.cloudflare.com`. Verify against `nexus-platform-kohl.vercel.app` until
  delegation lands. `matermariahomes.com` and `q-grid.net` are on separate zones and ARE live.
- **Fix the mis-pointed subdomains BEFORE DNS is restored.** Nothing on `*.taurusai.io` is
  publicly reachable right now, which makes this the cheapest possible window to correct
  them. Two are wrong today (see `docs/plans/2026-08-09-vercel-project-audit.md`):
  `opsflow.taurusai.io` serves an unrelated third party's site, and `orca.taurusai.io` serves
  a retired brand with a broken stylesheet. Both go live the moment delegation lands.
- **Use A records, not a CNAME, for `nexus`.** Vercel recommends
  `CNAME → 416043bc885ff1d4.vercel-dns-017.com`, but `nexus` also needs the Brevo
  `brevo-code:` TXT, and RFC 1034 forbids a CNAME coexisting with another record at the
  same name. Use `216.198.79.1` + `64.29.17.1`, unproxied.
