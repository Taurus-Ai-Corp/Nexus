# NEXT SESSION — Mater Maria Homes Immediate Actions

> Session: sess-mppcrlm1-s520cl | Date: 2026-05-28
> Branch: feat/nexosync-to-nexus-rebrand

---

## 🔴 CRITICAL — DO FIRST (5 min)

### 1. Disable Vercel Deployment Protection
1. Go to https://vercel.com/taurus-s-projects/mater-maria/settings
2. Scroll to **Deployment Protection**
3. Toggle **OFF**
4. Click **Save**

**Why:** The internal bypass URL (`?bypass=internal2026`) currently returns 401 because Vercel's auth wall intercepts the request before our middleware can set the bypass cookie. Once Deployment Protection is off, our custom 503 maintenance page handles everything — and the team can access the real site via the bypass.

---

## 🟡 HIGH PRIORITY — Next 15 min

### 2. Set Environment Variables in Vercel Dashboard
Go to Project Settings → Environment Variables and add:

| Variable | Where to Get | Status |
|----------|-------------|--------|
| `RESEND_API_KEY` | https://resend.com/api-keys | ❌ Not set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key | ❌ Not set |
| `WA_TOKEN` | Meta Business Manager → WhatsApp → API Setup | ❌ Not set |
| `WA_PHONE_ID` | Meta Business Manager → WhatsApp → Phone Number ID | ❌ Not set |

**Why:** The lead pipeline is wired in code (Supabase writes + Resend emails + WhatsApp API) but won't execute until these keys are live. Right now leads only get written to Supabase if env vars are set, but emails and WhatsApp will silently fail.

### 3. Verify Supabase Table Exists
Run this in Supabase SQL Editor:

```sql
-- Verify investor_inquiries table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'investor_inquiries';
```

If it doesn't exist, create it:

```sql
CREATE TABLE IF NOT EXISTS investor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'India',
  unit_type TEXT,
  investment_amount NUMERIC,
  message TEXT,
  subject TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new'
);

-- Enable RLS (Row Level Security) for safety
ALTER TABLE investor_inquiries ENABLE ROW LEVEL SECURITY;
```

---

## 🟢 FOLLOW-UP TASKS

### 4. Test End-to-End Lead Submission
After steps 1-3 are done:
1. Visit `https://mater-maria-61kabiwfr-taurus-s-projects.vercel.app/invest?bypass=internal2026`
2. Fill the lead form with a test email
3. Check Supabase dashboard for the new row
4. Check inbox for Resend auto-responder email

### 5. Remaining Backlog
| # | Task | Status |
|---|------|--------|
| 42 | Install test framework and write TDD suite | pending |
| 45 | Verify Next.js build passes | clean (no errors) |
| 46 | Investigate Mater Maria lead capture architecture | in progress |
| 47 | Fix Vercel auth wall (Deployment Protection) | pending — YOU do this |
| 48 | Wire Supabase leads + Resend auto-responder | deployed, needs env vars |

---

## 📂 Files Changed in This Session
- `src/middleware.ts` — Bypass cookie logic
- `src/app/api/lead/route.ts` — Supabase write + Resend + WhatsApp
- `src/app/api/web3forms/route.ts` — Contact form Supabase write
- `src/app/invest/admin/page.tsx` — Live Supabase data fetch
- `src/lib/supabase/admin.ts` — New admin-level Supabase client
- `.env.local` — Added placeholders for Resend, WhatsApp, n8n
- Deleted: `public/assets-2025/images/board/fr-mathew-puthumana.*`

## 🧠 Session Key
`sess-mppcrlm1-s520cl`
