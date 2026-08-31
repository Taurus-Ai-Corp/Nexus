# Continuity Snapshot — 2026-08-30 05:40 EDT

Supersedes the 2026-08-29 03:55 snapshot. That session's work (domain cutover, backend
fixes, PRD fact-check) is **done and still true** — its Landmines section is preserved
verbatim at the bottom because it is still load-bearing.

## Goal

Declutter the Vercel estate, then finish the `neorm-era.com` cutover — specifically the
last 10%: stopping `nexus.taurusai.io` from competing with `neorm-era.com` for the same
search terms.

## Repo

`/Users/taurus_ai/Documents/NEXUS-CORE` · branch `feat/nexus-core-organic-design-system`
· dirty files: ~1472 (pre-existing mid-reorganisation drift per CLAUDE.md — **not** this
session's work) · **3 files changed by this session, all uncommitted** (listed below).

## Done — verified, no action needed

### Vercel estate
- [x] **10 orphan domain attachments detached** (all re-confirmed NXDOMAIN on two
      resolvers immediately before each call, all HTTP 200). Independently verified
      afterwards: **21 custom-domain attachments → 11**. Nothing live was touched.
- [x] **3 attachments deliberately KEPT** — `ca.q-grid.net`, `na.q-grid.net`,
      `rupee.q-grid.in`. They are NXDOMAIN but appear in the taxonomy's FROZEN production
      list, and `ca` has an explicit pending Name.com cutover. Detaching them would undo
      pending work. **Do not "clean these up" without reading that list first.**
- [x] **23 CLI-upload projects archived to disk before any deletion** —
      `~/Documents/TAURUS-LOCAL-WORKSPACE/vercel-decommission/archive/content/`,
      172 files, 5.89 MB, base64-decoded and spot-verified.

### Taxonomy (`~/.ai-context/taxonomy/TAXONOMY.toml`) — synced to 15 files, 3 times
- [x] `neorm-era.com` was recorded as "REGISTERED, NOT YET LIVE, nameservers still on
      Spaceship parking". **That was false** — it has been live on Cloudflare Pages since
      2026-08-26. Corrected.
- [x] Recorded the thing nothing recorded: **two brands are live simultaneously** and no
      canonical host had been chosen.
- [x] SENTINEL domain changed `bio-foundry.taurusai.io/sentinel` → `bio-foundry.io`
      (acquired at Spaceship, auto-renew to 2027-08-25, not yet stood up).

### `neorm-era.com` cutover — code written, TESTED, **NOT DEPLOYED**
- [x] `platform/vercel.json` — 308 from `nexus.taurusai.io/*` → `https://www.neorm-era.com/$1`
- [x] `platform/tests/deploy-safety.test.js` — the guard that blocked it, rewritten to
      check the condition it actually cares about (see Landmines).

## Decisions — settled by the owner 2026-08-31, do not re-litigate

- **The old host is retired. The NEXUS brand is dead. `neorm-era.com` is the future.**
  The 308 stands as written — no 307 trial window was wanted. `nexus.taurusai.io` stays
  as a frozen infrastructure host that redirects; it is not a content surface any more.
- **`mater-maria` build fix is deferred** to a later deployment phase (committed, not
  deployed).
- **Media assets:** LFS is already correctly configured; the open question is quota, not
  setup. See "Untracked media" below.

## NEXT STEP — the one thing that makes the cutover real

```bash
source ~/.env-secrets
vercel deploy --prod --yes --token "$VERCEL_TOKEN" --scope taurus-s-projects \
  --cwd ~/Documents/NEXUS-CORE/platform
```

Read the first Landmine below before running it. It is a 308 and it is sticky.

## Open — owner action required

| # | Item | Why it is blocked |
|---|---|---|
| 1 | **Rotate 3 Webflow secrets** | `agents/specialized/webflow_integration_master/agent.py:235-236` and `08-shared/Web-Platforms/enhanced_webflow_integration.py:69-71`. Both git-tracked → in history. Third one (`access_token`) was missed by the earlier audit. **gitleaks does not catch these** — bare positional hex, no `key =` pattern. |
| 2 | **Delete 27 stale Vercel projects** | Classifier blocks project deletion. Archive is already safe on disk, so this is now zero-risk. List: `.../vercel-decommission/archive/delete-list-20260830-050008.txt` |
| 3 | **gridera.net decision** | Serving a Squarespace "Coming Soon" page. No Squarespace credentials exist here. Recommended: unpublish the site, **keep the registration** (it is the obvious domain for a shipping brand — dropping it invites a squatter). |
| 4 | **apex→www on neorm-era.com** | Low priority; canonical already consolidates. Needs a Cloudflare Redirect Rule, not a `_redirects` file. |
| 5 | **mater-maria build** | Deliberately deferred by owner to a later phase. Fix is written, uncommitted. |

## Uncommitted changes from this session (3 files)

- `platform/vercel.json` — the cutover redirect
- `platform/tests/deploy-safety.test.js` — the rewritten guard
- `package.json` — `@eslint/js` `^10.0.1` → `^9.39.4` (the mater-maria build fix)

**`package.json` also carries two changes that are NOT from this session** and were already
uncommitted: `"my-agent"` added to `workspaces`, and `engines.node` `>=18.0.0` → `24.x`.
Confirm those are intentional before committing — `"my-agent"` looks like a stray.

## Untracked media under `platform/` — do NOT bulk-add

`git ls-files --others` shows ~45 untracked files under `platform/`. Measured 2026-08-31:

| type | files | size | LFS? |
|---|---|---|---|
| `.mp4` | 11 | **284.7 MB** | covered by `.gitattributes` |
| `.jpg` | 15 | 1.3 MB | not covered → normal git |
| `.png` | 7 | 0.6 MB | not covered → normal git |
| text (md/js/html/css) | ~15 | 0.1 MB | n/a |

**LFS is already set up and working** — git-lfs 3.7.1, filters configured, pre-push hook
live, `.gitattributes` covers `mp4/mov/avi/webm/gif`, and **92 files totalling ~730 MB are
already stored**. Nothing needs configuring.

**The blocker is quota, not setup.** 730 MB + 285 MB ≈ **1.0 GB**, and GitHub's free tier is
1 GB LFS storage plus 1 GB/month bandwidth. Adding these videos will land on or over that
ceiling — expect a failed push or a billing prompt. (The 730 MB figure is derived from
`git lfs ls-files -s` in the current checkout; GitHub-side storage counts *every version
ever pushed*, so the real number can be higher. Check the billing page before committing to
a plan.)

**Do not add `*.jpg`/`*.png` to `.gitattributes`.** It is only 1.9 MB — normal git handles
that fine — and routing images through LFS has a real downside: any git-based deploy that
does not fetch LFS renders pointer files instead of images, silently breaking the site.
`mater-maria` deploys from git. The cost/benefit is clearly negative here. Never put `.svg`
in LFS at all; it is text and diffs properly.

**Options for the 285 MB of video, in preference order:**
1. `.gitignore` them — they look like source/working media, and `platform/` deploys via CLI
   from the working tree, so git never needed them to ship.
2. Put them in **Cloudflare R2** — already owned, zero egress fees, and R2 is not yet
   enabled on the account. This is the natural home for large media.
3. Pay for GitHub LFS storage.

## Landmines — new this session

**The cutover redirect is a 308 and browsers cache it hard.** Once deployed,
`nexus.taurusai.io` stops serving pages for anyone who has ever loaded it, and reversing
means fighting browser caches. That is the intent — it is how ranking authority transfers —
but it is not casually reversible. For a safety window, set `permanent: false` (307),
deploy, verify, then flip back.

**`/api/` is excluded from that redirect on purpose.** Stripe does **not** follow 3xx on
webhooks — it treats them as failed delivery. A blanket host redirect would have silently
broken checkout and the webhook. Remove the exclusion only after re-pointing Stripe's
webhook URL to `www.neorm-era.com`.

**`neorm-era.com` has FULL API parity, not just static pages.** `platform/functions/`
contains a Cloudflare Pages Functions catch-all (`api/[[route]]`) and
`https://www.neorm-era.com/api/leads` returns real `application/json`, not an HTML
catch-all with a 200. This is what made the redirect safe. **Re-verify this before trusting
it** — a destination that only 200s on the homepage is not sufficient.

**The `deploy-safety` redirect guard was rewritten, not weakened.** It previously banned any
live host from being a redirect source, which was a proxy for the real rule. It now requires
a live source to have a declared `CUTOVER` entry whose destination is itself live. Proven
non-vacuous by mutation: pointing the destination at a dead host → caught; dropping the host
filter → caught. **Do not silence it by adding entries without re-running the three verify
commands in its comment.**

**23 of 29 stale Vercel projects were CLI-uploads with no git link.** Their deployed content
existed *only* on Vercel — including `canadian-nda-vercel` (36 files), `gmeet-quantum-rupee-nda`,
`mater-proposal`, `taurus-report`, `quantum-rupee-pitch`. "Archive the metadata first" is
**not** sufficient; metadata is not content. Files come back from the API base64-wrapped as
`{"data":"..."}` and must be decoded.

**`nexus.taurusai.io` production is a stale CLI deploy.** Its `/index` canonical is not a repo
bug — `platform/index.html:16` is already correct. Production is simply older than the tree.

**Only `neorm-era.com` is proxied through Cloudflare, and that is fine.** The other hosts are
Vercel-origin and DNS-only by design; Vercel already provides CDN/TLS/DDoS. An earlier
framing of this as "using 2% of Cloudflare" was wrong — do not "fix" it.

**The auto-mode classifier blocks by command shape, not intent.** Confirmed blocked this
session even with explicit user authorization: `vercel deploy`, Vercel **project** deletion,
and writing a script containing `DELETE` calls. Domain **detachment** passed. Decompose and
hand the command to the owner rather than reshaping it to evade the gate.

---

## Landmines — carried forward from 2026-08-29 (still true)

- **The apex needed the zone on Cloudflare.** Spaceship *does* flatten `ALIAS` at the apex
  (DNS resolved fine), but Cloudflare Pages returns **error 1001** for an apex whose zone
  isn't on Cloudflare. Subdomains work by CNAME; the apex does not.
- **`launch1/launch2.spaceship.net` are Spaceship's STANDARD nameservers, not parking.**
  (This snapshot's author violated this landmine once on 2026-08-29 by writing "parking
  nameservers" into the bio-foundry.io taxonomy entry; corrected 2026-08-30.)
- **Cloudflare token permission changes take ~120s to take effect.** DNS writes return 401
  in the meantime and it is *not* a permission failure.
- **The Cloudflare token is account-owned**, so editing it under `/profile/api-tokens`
  silently does nothing. `/user/tokens/verify` returning code 1000 is **not** evidence the
  token is bad — that endpoint only validates user-owned tokens.
