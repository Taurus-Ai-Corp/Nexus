# NEXUS Contact / SMTP Backend Plan

> Date: 2026-06-30
> Scope: `platform/api/contact.js` and Brevo/OpenSend email delivery

## Objective

Make the NEXUS marketing-site contact form trustworthy, spam-resistant, and deliverable.

## Current Configuration

Per `CLAUDE.md`, required Vercel env vars for the `nexus-platform` project:

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<brevo-smtp-user>
SMTP_PASS=<brevo-smtp-master-password>
EMAIL_FROM=Nexus Leads <leads@nexus.taurusai.io>
LEAD_RECIPIENT_EMAIL=admin@taurusai.io
```

## Work Items

1. **Brevo domain authentication**
   - Cloudflare `TXT nexus` record: `brevo-code:c04200853882e0841ae5e3dc4ee9ea69`
   - CNAME DKIM records for `brevo1._domainkey.nexus` and `brevo2._domainkey.nexus` must be **DNS only**.
   - `TXT _dmarc.nexus` DMARC record.
   - After Brevo confirms auth, submit a test lead via `https://nexus.taurusai.io/contact.html`.

2. **OpenSend fallback**
   - Evaluate OpenSend as an alternate transactional provider.
   - If adopted, keep Brevo as primary and OpenSend as failover in `contact.js`.
   - Store provider credentials in Vercel env; never commit secrets.

3. **Handler hardening**
   - `platform/api/contact.js`:
     - Validate email format and required fields.
     - Add a honeypot field (`website` or similar) and reject submissions that fill it.
     - Add per-IP rate limiting (in-memory for serverless, or via Vercel KV if available).
     - Return generic success/error messages to avoid leaking internal state.
   - Update `platform/api/contact.test.js` accordingly.

4. **Logging**
   - Log only sanitized events (no PII, no message body).
   - Send a structured lead summary to `LEAD_RECIPIENT_EMAIL` with origin vertical if available.

## Acceptance Criteria

- Test submission from each vertical (`?ref=social`, `?ref=creative`, etc.) reaches `admin@taurusai.io`.
- DKIM, SPF, and DMARC pass on a mail-tester run.
- Honeypot and rate-limit tests pass.

## Human-in-the-Loop Gate

Changing DNS or email provider requires explicit `PROCEED` after a dry-run of record changes.
