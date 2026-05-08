# Mater Maria — Domain & DevOps Handoff

> ## ⚠️ Hard rule — DO NOT CUT GOOGLE WORKSPACE
>
> Google Workspace is the email-of-record AND the identity backbone for matermariahomes.com. The `jose@` and `board@` mailboxes are super-admin recovery addresses for Squarespace, GitHub, HubSpot, Brevo, n8n, Microsoft 365, and every other shared service. There is also an open customer-of-record transfer ticket with Google support (#70930852).
>
> **Never propose, plan, or execute:**
> - Migrating mailboxes off Workspace (no Microsoft 365, Zoho, Fastmail, etc.)
> - Cancelling the Workspace subscription
> - Changing the `MX 1 smtp.google.com` record
> - Removing `google._domainkey` DKIM TXT records
> - Removing `_spf.google.com` from SPF
>
> All DNS, registrar-transfer, and service-audit work in this document is designed around preserving Workspace. The verification script at `scripts/post-cutover-verify.sh` enforces MX/DKIM/SPF integrity as failure conditions.
>
> ---

> **Status as of 2026-05-06:** Phase 0 (account hardening) and Phase 1 pre-flight (Vercel domain attached) **complete**. DNS cutover (Phase 2) is queued and ready for execution after the 24h TTL drain window.
>
> Operator: TAURUS AI Corp / admin@taurusai.io
> Domain: matermariahomes.com
> Project: `mater-maria` Next.js site
> Vercel team: `taurus-s-projects` (`team_ljtVg59YsYUDbIdetyyOVg05`)
> Vercel project: `mater-maria` (`prj_trs39zDiYVuE8VgC9TpxEa56pS6F`)

---

## 1. Current state at handoff

| Layer | Provider | Identifier | Notes |
|---|---|---|---|
| Registrar | Squarespace Domains II LLC | matermariahomes.com | Created 2025-08-22, expires 2026-08-22, last updated 2026-02-21 |
| DNS host | Google Cloud DNS (legacy Google Domains) | `ns-cloud-d{1-4}.googledomains.com` | Inherited when Squarespace bought Google Domains in 2023 |
| Live website host | Google Cloud (Belgium) | `35.205.106.218` | Old/legacy site — about to be replaced |
| Email | Google Workspace | MX `1 smtp.google.com` | Managed inside the Workspace tenant we now have super-admin on |
| Outbound transactional | SPF includes `_spf.google.com` + `sendgrid.net` | — | `sendgrid.net` may be legacy — investigate during Phase 4 |
| New site (built, not yet pointed at domain) | Vercel | `mater-maria.vercel.app` | 20/20 routes building green per `GEMINI_HANDOFF_2026-03-11.md:10` |
| Custom domain on Vercel project | **Attached 2026-05-06** | matermariahomes.com + www.matermariahomes.com | Awaiting DNS verification — see Phase 2 |

### Transferable status

- 60-day post-registration ICANN lock: **expired** (Oct 2025)
- 60-day post-WHOIS-update lock: **expired** (~Apr 22 2026)
- DNSSEC: **off** (no DS records published) — no DNSSEC dance needed at transfer
- Domain is fully transferable to Cloudflare or any other registrar at any time

---

## 2. Account inventory (received from client 2026-05-05)

Source: Google Sheet "MaterMaria Passwords" shared by Paul Jose. Sheet contained 15 credential entries across 12 services, all under `jose@matermariahomes.com` or `board@matermariahomes.com`.

**The sheet has been (or must be) deleted after credentials migrated to TAURUS shared 1Password vault.** It is an insecure transport and should not persist in Drive.

| Service | Account | Where to find post-migration | Hardening required |
|---|---|---|---|
| Squarespace registrar | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Confirm 2FA + recovery codes; rotate password |
| Google Workspace super-admin | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | ✅ Super-admin received 2026-05-06 |
| Google account (board@) | board@matermariahomes.com | 1Password — TAURUS / Mater Maria | Audit role; rotate password |
| GitHub | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Audit repo/org access; enable 2FA on TAURUS authenticator |
| HubSpot CRM | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Export contacts as backup before rotation |
| **Microsoft 365** | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | ⚠️ **TOTP seed `mrdybmwfdw6hrrhc` was exposed in plaintext — RESET 2FA IMMEDIATELY** |
| Microsoft signup | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Same as above |
| Brevo (email marketing) | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Audit lists, sender domains, API keys |
| n8n.cloud (automations) | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Audit running workflows — what's sending email / hitting which APIs? |
| Cursor IDE | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Low ops risk |
| Instagram | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Social account |
| Tally (forms) | jose@matermariahomes.com | 1Password — TAURUS / Mater Maria | Lead capture forms — verify form destinations |

### Still missing — outstanding asks of Paul / Rajeev

- [ ] Squarespace 2FA recovery codes (8-digit codes from initial setup)
- [ ] Whose card is on Squarespace renewal payment method
- [ ] List of any other domains registered for the project (`.in`, `.net`, hyphenated variants)
- [ ] Confirmation that `jose@` and `board@` mailboxes have no auto-forward rules to personal addresses
- [ ] Firebase / Supabase / Razorpay credentials for invest page (separate track — get from Rajeev)

### Open Google Workspace support ticket

- **Ref #:** 70930852
- **Subject:** Workspace billing / customer-of-record transfer
- **SLA:** Up to 7 business days; 1-business-day initial reply confirmed
- **Why it matters:** Admin access (which we have) ≠ legal customer of record. Keep this ticket alive even though operations are unblocked.

---

## 3. Migration phases

### ✅ Phase 0 — Account hardening (do FIRST, ongoing)

Inside `admin.google.com` as super-admin:

- [ ] Account → Admin roles → Super Admin: list every account with the role; demote anything not explicitly TAURUS-controlled. Keep ≥2 super admins.
- [ ] Security → 2-step verification → Enforce ON for super-admin OU; 7-day grace period.
- [ ] For `jose@` and `board@` mailboxes: audit Settings → Filters and Settings → Forwarding/POP/IMAP — remove any auto-forward to personal addresses.
- [ ] Security → API controls → Domain-wide delegation: list service accounts; verify each is still needed.
- [ ] Reset Microsoft 365 2FA at security.microsoft.com (TOTP seed compromised).
- [ ] Rotate all 15 passwords from the Google Sheet → store in 1Password TAURUS shared vault.
- [ ] Delete (and empty trash on) the Google Sheet "MaterMaria Passwords."

### ✅ Phase 1 — DNS pre-flight (completed 2026-05-06)

- [x] Snapshot existing DNS — see `dns-snapshot-2026-05-06.txt` (operator must fill from Squarespace panel before flipping)
- [x] Add `matermariahomes.com` to Vercel `mater-maria` project
- [x] Add `www.matermariahomes.com` to Vercel `mater-maria` project
- [ ] Lower TTL on apex A and `www` A records in Squarespace from 3600s → 300s (operator action — must be done ≥24h before Phase 2)

**Vercel-issued cutover targets (confirmed 2026-05-06):**

```
A   matermariahomes.com.        → 76.76.21.21
A   www.matermariahomes.com.    → 76.76.21.21
```

### ⏸ Phase 2 — DNS cutover (queued, execute after 24h TTL drain)

In Squarespace DNS panel:

1. Replace `A @ → 35.205.106.218` with `A @ → 76.76.21.21`
2. Replace `A www → 35.205.106.218` with `A www → 76.76.21.21`
3. **DO NOT TOUCH:** `MX`, `TXT` (SPF), `_dmarc`, `google._domainkey`, any other DKIM/auth TXT records
4. Save changes
5. Within 1–3 minutes Vercel detects propagation and provisions Let's Encrypt certs
6. Run `./scripts/post-cutover-verify.sh` immediately, then again at +1h and +24h

### ⏸ Phase 3 — Registrar transfer Squarespace → Cloudflare (optional, scheduled later)

Recommended timing: after Phase 2 stable for ≥7 days; before 2026-08-22 expiry minus 30 days (i.e., before ~2026-07-22).

1. At Cloudflare: Add Site → enter `matermariahomes.com` → Free plan → CF auto-imports DNS records
2. **Manually verify** all MX/TXT/DKIM/DMARC records survived the import — this is the single critical check
3. At Squarespace: Settings → Domains → Advanced → toggle off Transfer Lock + Privacy → Get auth code (EPP)
4. At Cloudflare: Domain Registration → Transfer Domains → paste auth code → pay 1-year renewal (~$10 at-cost)
5. Confirm transfer email; ICANN-mandated 5-day waiting period
6. Once live in Cloudflare: change nameservers from Google Cloud DNS to Cloudflare's assigned nameservers

### ⏸ Phase 4 — Service audit & cleanup (parallel to Phase 3)

> Workspace is **excluded** from this list per the hard rule above. Audits below apply only to ancillary services.

- [ ] Microsoft 365 — confirm in use or cancel (likely paying for unused subscription since MX is Google). If partially in use for mail, route around it by forwarding to Workspace — never the other direction.
- [ ] Brevo — audit lists, sender authentication; verify SPF mention is intentional (currently SPF mentions `sendgrid.net` not Brevo)
- [ ] SendGrid — discover account or remove `sendgrid.net` from SPF (legacy entry?)
- [ ] n8n — audit workflows; document each integration; secure API keys
- [ ] HubSpot — export contacts; document pipelines; rotate API keys
- [ ] GitHub — audit repo access; remove org members no longer involved
- [ ] Migrate accounts from `jose@` to role-based `admin@` or `ops@` **mailboxes inside the same Workspace tenant** so they survive personnel changes (this is a Workspace user-management change, not a provider change)

---

## 4. Decisions log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-06 | Use direct DNS flip (not staged preview) | Low traffic landing site; Vercel auto-issues cert; rollback is one DNS edit away |
| 2026-05-06 | Use A record for `www` (not CNAME) | Vercel recommended A; cleaner to have both apex and www on same record type |
| 2026-05-06 | Phase 2 (cutover) before Phase 3 (registrar transfer) | Cutover is reversible in 5 min; transfer takes 5–7 days. Get site live first. |
| 2026-05-06 | Cloudflare Registrar as eventual destination | At-cost pricing (~$10 vs Squarespace ~$20), best DNS, free CDN/WAF in front of Vercel |
| 2026-05-06 | **Keep Google Workspace permanently** (not just "for now") | Hard rule from operator. Workspace is identity backbone for all client services and is open ticket #70930852 with Google. Never reopen this decision. |

### Open decisions

- [ ] Microsoft 365 — kill or keep? Depends on whether any Office licenses are attached to the subscription. **Note:** killing M365 is fine; never reopen the Workspace question.
- [ ] Cloudflare proxy mode (orange cloud) on Vercel records — yes/no? Default is no; orange cloud adds CDN/WAF but introduces an extra hop. Decide at Phase 3.
- [ ] DNSSEC at Cloudflare — enable post-transfer? Recommended yes for compliance/email reputation, but adds operational complexity
- [ ] Migrate `jose@` accounts to role-based `admin@`/`ops@` mailboxes **inside the same Workspace tenant** — soon or after launch?

---

## 5. Verification protocol

### After Phase 2 cutover

```bash
cd /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/devops
./scripts/post-cutover-verify.sh
```

Run at three checkpoints:
1. **+0 min** — immediately after saving DNS changes (expect partial passes; cert may not yet exist)
2. **+1 hour** — full DNS propagation expected; cert provisioned
3. **+24 hours** — confirm stability, all resolvers consistent, no residual cached records

Exit code 0 = green; non-zero = investigate.

### Manual sanity checks beyond the script

- Send a test email from Gmail to `jose@matermariahomes.com`; verify it arrives within 30s
- Send a test email FROM `jose@matermariahomes.com` to a Gmail address; verify SPF=PASS, DKIM=PASS, DMARC=PASS in headers
- Browse https://matermariahomes.com and https://www.matermariahomes.com on mobile + desktop
- Check Vercel dashboard → Domains → both domains show "Valid Configuration"

---

## 6. Rollback procedure

If verification fails or live site is broken, revert in Squarespace DNS panel:

1. Restore `A @ → 35.205.106.218` (from `dns-snapshot-2026-05-06.txt`)
2. Restore `A www → 35.205.106.218`
3. Save. With TTL at 300s, propagation back to old site takes ≤5 minutes.
4. Vercel domains stay attached (no harm; just unverified). When ready to retry, restore the Vercel-target A records.

The Vercel custom domains do **not** need to be removed for rollback. They remain queued and ready.

---

## 7. Long-term plan (12 weeks out)

| Week | Activity |
|---|---|
| W1 (now) | Phase 0 hardening + Phase 2 cutover |
| W2 | Verification stability; address any warnings from script |
| W3-4 | Phase 4 service audit (Microsoft, Brevo, n8n, HubSpot) |
| W5-6 | Phase 3 registrar transfer to Cloudflare |
| W7 | Migrate `jose@` accounts to role-based emails |
| W8 | Add DNSSEC at Cloudflare; harden DMARC from `p=none` to `p=quarantine` then `p=reject` |
| W9-12 | Document for next agent / next ops handoff |

---

## 8. File index (this directory)

```
MATER MARIA HOMES/devops/
├── 2026-05-06-domain-handoff.md         ← this file
├── dns-snapshot-2026-05-06.txt          ← rollback safety net (operator must fill)
└── scripts/
    └── post-cutover-verify.sh            ← run after Phase 2 cutover
```

---

## 9. Quick reference

| Need | Location |
|---|---|
| Vercel project ID | `mater-maria/.vercel/project.json` → `prj_trs39zDiYVuE8VgC9TpxEa56pS6F` |
| Vercel team ID | same file → `team_ljtVg59YsYUDbIdetyyOVg05` |
| Latest production deployment | `mater-maria-ljg3gxwpv-taurus-s-projects.vercel.app` (READY) |
| Vercel dashboard | https://vercel.com/taurus-s-projects/mater-maria |
| Squarespace dashboard | https://account.squarespace.com (login: jose@matermariahomes.com) |
| Workspace admin | https://admin.google.com (super-admin via TAURUS) |
| Project source | `MATER MARIA HOMES/mater-maria/` (Next.js 16, Tailwind v4, ShadCN) |
| Prior session handoff | `MATER MARIA HOMES/mater-maria/GEMINI_HANDOFF_2026-03-11.md` |
| Auto-memory | `~/.claude/projects/-Users-taurus-ai-Documents-BizFlow-NeoVibe-Platform/memory/MEMORY.md` |
