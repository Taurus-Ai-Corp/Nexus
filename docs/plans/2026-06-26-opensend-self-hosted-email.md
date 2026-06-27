# OpenSend Self-Hosted Email Deployment Plan

## Goal

Replace Resend with a self-hosted, multi-domain-capable, Resend-compatible transactional email API that can be reused across all TAURUS AI web applications and pipelines.

## Why OpenSend

- **Resend-compatible API** — minimal code changes, existing `/api/contact.js` already works.
- **Multi-tenant / multi-domain** — one instance, unlimited sending domains.
- **Cloudflare DNS automation** — domain verification handled automatically.
- **No per-domain fees** — runs on your own AWS SES account.
- **Elastic License 2.0** — free to self-host, cannot resell as SaaS.

## Architecture

```
Nexus contact form → Vercel function → OpenSend API → AWS SES → recipient
                        ↑
                   OpenSend dashboard (optional, for logs/analytics)
```

## Infrastructure options

| Platform | Cost | Notes |
|----------|------|-------|
| **Oracle Cloud Free Tier** | Free forever (4 ARM, 24GB RAM, 200GB disk) | Best for always-on email service. Docker Compose deploy. |
| **Railway** | Pay per usage | Faster setup, managed Postgres/Redis. |
| **Self-hosted VPS** | Variable | Any Docker-capable host. |

## Deployment steps (Oracle Cloud Free Tier)

1. **Provision VM**
   - Shape: VM.Standard.A1.Flex (4 OCPU, 24GB RAM)
   - Image: Ubuntu 24.04
   - Networking: allow ingress TCP 22, 80, 443, 3015, 3016

2. **Install Docker + Docker Compose**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```

3. **Clone and configure OpenSend**
   ```bash
   git clone https://github.com/namuh-eng/opensend.git
   cd opensend
   bun run setup   # generates .env with local secrets
   ```

4. **Add external credentials to `.env`**
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — SES credentials
   - `AWS_REGION` — e.g. `us-east-1`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — dashboard auth
   - `CLOUDFLARE_API_TOKEN` — DNS automation (optional)
   - `OPENSEND_API_KEY` — your sending API key

5. **Start services**
   ```bash
   docker compose up -d
   ```

6. **Add domain in dashboard**
   - Open `http://VM_IP:3015`
   - Add `nexus.taurusai.io` (and any other domain)
   - OpenSend will create DKIM/SPF/DMARC records via Cloudflare if token is set.

7. **Verify domain**
   - Wait for DNS propagation.
   - Domain status flips to verified.

8. **Update Vercel env vars for NEXUS**
   ```
   EMAIL_API_BASE_URL=https://opensend.YOUR_DOMAIN
   EMAIL_API_KEY=os_...
   EMAIL_FROM=Nexus Leads <leads@nexus.taurusai.io>
   LEAD_RECIPIENT_EMAIL=admin@taurusai.io
   ```

9. **Redeploy `nexus-platform`**

## Estimated cost

- Oracle Cloud: $0 (Free Tier)
- AWS SES: ~$0.10 per 1,000 emails + $0.12/GB attachments
- Domain: already owned

## API test

```bash
curl -X POST https://opensend.YOUR_DOMAIN/emails \
  -H "Authorization: Bearer os_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Nexus Leads <leads@nexus.taurusai.io>",
    "to": ["admin@taurusai.io"],
    "subject": "Test lead",
    "text": "Test message"
  }'
```

## Reuse across apps

Once OpenSend is running, every TAURUS AI app can use the same endpoint and API key (or scoped keys per app/tenant):

```env
EMAIL_API_BASE_URL=https://opensend.YOUR_DOMAIN
EMAIL_API_KEY=os_...
EMAIL_FROM=App Name <app@domain.com>
```

## Risks / notes

- AWS SES starts in sandbox by default; request production access.
- SES sends must be from verified domains/addresses.
- Keep OpenSend dashboard behind VPN or restrict by IP if exposing port 3015.
- Cloudflare API token needs `Zone:Edit` and `DNS:Edit` permissions.

## Next action

Provision Oracle Cloud Free Tier VM and run the Docker Compose deploy.
