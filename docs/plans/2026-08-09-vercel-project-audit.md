# Vercel project audit — 69 projects, 13 live surfaces

**Date:** 2026-08-09
**Method:** Vercel API enumeration + HTTP fetch of every domain-holding project's public
alias + browser screenshots of the three most suspicious. All findings below were verified,
not inferred from project names.

**Why this exists:** on 2026-07-13 a Nexus build was accidentally deployed to the unrelated
`orca-ai` production project. That was rolled back, but it raised the obvious question —
what else is mis-pointed? Answer: at least one thing, worse.

---

## P1 — `opsflow.taurusai.io` serves an unrelated third party

Project **`dist`** (`prj_FCxXgyiUplDBOkoHuFCxcoMtLwMd`) holds `opsflow.taurusai.io` and serves
**"Vanillo — آيس كريم فني · Artisan ice cream · Kafr Qasem"**, an artisan ice cream shop.

It is a React-Native-Web / Expo build (`css-175oi2r`-style class names) that never hydrates,
so it paints a blank `#0F0A07` rectangle. Last deployed 2026-02-10.

Two problems, not one: an unrelated business occupies a TAURUS production subdomain, **and**
the app is broken.

**Not currently public** — `opsflow.taurusai.io` HTTPS times out because of the registrar
transfer. That makes now the cheapest time to fix it. It becomes public the instant
delegation lands.

Also note the project is named `dist`, which tells a future reader nothing.

## P1 — `orca.taurusai.io` renders completely unstyled

Project **`orca-ai`** returns HTTP 200 with a correct `<title>`, so every automated check
passes. A screenshot shows raw HTML: default serif type, blue underlined links, no layout.

Root cause, verified: `/_next/static/css/840aedcf9d9514cc.css` loads fine (200, 6,228 bytes)
but contains **15 `@font-face` blocks and shadcn `:root` theme variables and zero Tailwind
utilities** — `.flex` 0, `.text-` 0, `.bg-` 0, `.p-[0-9]` 0, `.rounded` 0. Tailwind's content
scan matched no source files at build time and purged every utility.

It also displays **"ORCA"** prominently, a brand retired in favour of Nexus Social.

> Status codes cannot see this. A purged Tailwind build and a healthy build are identical at
> the HTTP layer. This is the second unstyled-but-200 page found this week; the first was
> `design-system.css` on nexus-platform.

## P2 — Retired brands live on production domains

| Domain | Project | Serves | Rule |
|---|---|---|---|
| `orca.taurusai.io` | `orca-ai` | "ORCA AI — Social Media Intelligence" | ORCA retired → Nexus Social |
| `bizflow.taurusai.io` | `property-assessment-toolkit` | "BizFlow™ by Taurus AI" | BizFlow marked DEAD → OpsFlow |
| `taurusai.in` | `q-grid-in` | `<title>Q_GRID.taurusai.in` | Q-GRID banned as a brand |

**The BizFlow case settles an open taxonomy question.** The TOML says: *"CAVEAT:
property-assessment-toolkit still ships as BizFlow on Vercel… Reopen if that Vercel
deployment is still commercially active."* It is. The site is polished and fully functional —
"Avoid AED 50M+ Rezoning Risks", "Dubai's First AI Property Intelligence Platform", live
"Run Free AI Scan" lead-gen CTAs. **The "BizFlow is DEAD" rule is wrong in practice and needs
a decision:** either retire the deployment or un-retire the brand.

## P2 — Stale production, and domains on dead deployments

- **`mater-maria` production is 33 days stale.** `matermariahomes.com` (live, HTTP 200) serves
  a 2026-06-13 build while a 2026-07-17 build sits unpromoted. This is a paying client's site.
- **`guard.gridera.net`** → project `guard` → **404**.
- **`api.orca.taurusai.io`** → project `orca-api-prod` → **404**.
- **`gridera.net` subdomains are attached to live projects** (`comply.gridera.net`,
  `guard.gridera.net`) even though the taxonomy calls them "DEAD — never hardcode… NOT deploy
  targets."
- **No project holds `grid-era.com`**, and the taxonomy (as of 2026-08-09) confirms it has no
  A record and serves nothing.

## P3 — 69 projects, 56 with no custom domain

Grouped by product family. The count is the problem; most are one-off deploys never cleaned up.

| Family | Count | Notes |
|---|---|---|
| GRIDERA / Q-Grid | 14 | `comply`, `q-grid-comply-ca`, `landing` all serve GRIDERA\|Comply |
| Other / generic | 21 | `api`, `dist`, `public`, `platform`, `frontend`, `website`, `demo` |
| Nexus Social / ORCA | 7 | 4 are API backends |
| Demos | 7 | exact dupes: `india-rural-fintech-demo` + `-cfha` |
| Mater Maria | 6 | |
| Nexus Creative / NeoVibe | 5 | 2 named for a retired brand | <!-- brand-allow -->
| BizFlow / OpsFlow | 5 | |
| AssetGrid | 2 | taxonomy says this product does not exist |

Generic names (`dist`, `api`, `public`, `platform`, `frontend`, `website`) are a standing
hazard — `dist` holding `opsflow.taurusai.io` is exactly how a mis-pointed domain goes
unnoticed for six months.

---

## The 13 live surfaces, as verified

| Project | Domain(s) | Serves | State |
|---|---|---|---|
| `nexus-platform` | nexus.taurusai.io | NEXUS by Taurus AI | OK |
| `landing` | q-grid.net | GRIDERA — Post-Quantum Compliance | OK |
| `comply` | na/eu.q-grid.net, comply.gridera.net | GRIDERA\|Comply | OK, 3 domains |
| `q-grid-comply-ca` | ca.q-grid.net | GRIDERA\|Comply | duplicate of `comply` |
| `mater-maria` | matermariahomes.com | Mater Maria Homes | **33 days stale** |
| `yqg-assistant` | yqg-assistant.taurusai.io | YQG AI Assistant | OK |
| `q-grid-in` | rupee.q-grid.in | Q_GRID.taurusai.in | banned brand form |
| `bio-foundry-web` | 3 × taurusai.io | — | behind Deployment Protection, not verified |
| `property-assessment-toolkit` | bizflow.taurusai.io | BizFlow™ | retired brand, commercially live |
| `orca-ai` | orca.taurusai.io | ORCA AI | **unstyled + retired brand** |
| `orca-api-prod` | api.orca.taurusai.io | — | **404** |
| `guard` | guard.gridera.net | — | **404** |
| `dist` | opsflow.taurusai.io | **Vanillo ice cream** | **wrong site entirely** |

## Coverage limits

- Visual capture on 3 of 13 (`dist`, `orca-ai`, `property-assessment-toolkit`). The other ten
  were verified by `<title>` and DOM extraction, which would not catch an unstyled render.
  `orca-ai` proves that gap is real — sweep the remaining ten before trusting them.
- `bio-foundry-web` sits behind Vercel Deployment Protection and was not inspected at all.
- The 56 domainless projects were grouped by name, not fetched.
