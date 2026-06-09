# Mater Maria Homes - Platform Implementation Plan V2

**Date:** February 22, 2026
**Prepared by:** TAURUS AI Corp
**Version:** 3.0
**Base Platform Fee:** $3,200 USD (₹2,68,800 INR)
**Growth Pipeline Add-Ons:** $10,500 USD (₹8,82,000 INR) over 12–18 months
**Timeline:** 3 weeks (21 calendar days)
**Client Hosting Cost:** Starting ~$15/mo (Tier 1), upgradable to ~$107/mo (Tier 2) when revenue flows.

---

**Goal:** Build a world-class corporate management platform for Mater Maria Homes luxury retirement living in Kottayam, Kerala — marketing website, investor portal, employee management with Indian payroll compliance, and AI-powered operations — in 3 weeks.

**Architecture:** Next.js 16 App Router + FastAPI + Supabase Free/Pro PostgreSQL + Razorpay ecosystem + AI agents. Multi-portal: Marketing Site, Investor Portal, Employee/HR Portal, Admin Dashboard.

---

## Context

Mater Maria Homes is a faith-inspired luxury retirement community ("Wings of Protection" — Psalm 91:4) in Kottayam, Kerala. An existing 6-page static HTML/CSS/JS demo website exists. This plan transforms it into a full corporate platform with employee management, Indian payroll compliance, recurring billing, and AI-powered operations.

**Domain:** MaterMariHomes.com (ICANN recovery in progress)

**Brand (Mater Maria V0017):**
- Logo: Two interlocked "MM" wings symbol
- Tagline: *Living Refined*
- Primary: Gold (#C7A036 to #E1A901) + Navy (#0D1D2F)
- Secondary: Royal Blue (#4A5AB4) + Kerala Olive Green (#4A7C59)
- Typography: Playfair Display (display), Cormorant Garamond (headings), Inter (body)
- Spiritual: Isaiah 40:31, Psalm 91:4 — faith, protection, strength

**Design Inspiration:** Lonepine (primary), Sanctuary-O, Heavenest, Altuz — adapted to senior-friendly luxury retirement niche.

**Existing Assets to Reuse:**
- Static website (6 pages, 1800-line CSS, full accessibility)
- Market research (5 Kerala competitors analyzed)
- FastAPI backend (port 8000)
- Supabase database schema (clients, leads, deals tables)
- HubSpot CRM models
- 23 specialized AI agents
- Pre-configured integrations: Stripe, SendGrid, Twilio
- Docker compose with 8 services

---

## PRICING STRUCTURE

### Base Platform — $3,200 USD / ₹2,68,800 INR

**INCLUDED in $3,200 one-time development fee:**

| Deliverable | Value to Client | Market Rate |
|-------------|-----------------|-------------|
| 10-page Next.js marketing website (SSG, SEO-optimized) | Lead generation machine | $1,500-3,000 |
| Brand design system (Mater Maria colors, animations) | Professional identity | $500-1,000 |
| Investor portal (public + authenticated dashboard) | Capital raising tool | $1,000-2,000 |
| Admin dashboard (KPIs, leads, residents) | Management visibility | $800-1,500 |
| GST-compliant invoicing | Legal compliance | $300-500 |
| Mobile-responsive + WCAG 2.1 AA accessible | 70%+ mobile traffic India | $300-500 |
| Supabase database (15+ tables, full schema) | Data foundation | $400-800 |
| Deployment + CI/CD setup | Production-ready | $300-500 |
| **Base market value** | | **$5,100-9,800** |

### Growth Pipeline Add-Ons — $10,500 USD / ₹8,82,000 INR (Over 12–18 months)

Not included in base $3,200. Add when your business needs them.

| # | Add-On Feature | USD | INR | Best Timing |
|---|----------------|-----|-----|-------------|
| 1 | **CRM — HubSpot Integration** (lead management + nurture) | $800 | ₹67,200 | Month 1–2 |
| 2 | **Analytics — GA4 + Facebook Pixel + PostHog** (traffic + conversion) | $500 | ₹42,000 | Month 1–2 |
| 3 | **Communication — WhatsApp (Twilio) + SendGrid** (notifications + marketing) | $1,200 | ₹1,00,800 | Month 2–3 |
| 4 | **Razorpay Integration** (UPI, cards, subscriptions) | $1,000 | ₹84,000 | Month 3–4 |
| 5 | **360° VR Villa Tours** (Photo Sphere Viewer / Three.js) | $1,500 | ₹1,26,000 | Month 3–6 |
| 6 | **Employee Management** (HR + Indian Payroll — EPF, ESI, TDS, PT, LWF) | $3,000 | ₹2,52,000 | Month 4–8 |
| 7 | **AI Shift Scheduler** (AI-optimized 24/7 care rosters, labor law compliance) | $1,500 | ₹1,26,000 | Month 6–12 |
| 8 | **AI Compliance Bot** (auto-filing EPF/ESI/TDS) | $1,000 | ₹84,000 | Month 9–18 |
| | **GROWTH PIPELINE TOTAL** | **$10,500** | **₹8,82,000** | Over 12–18 months |

### Total Platform Investment

| Component | USD | INR |
|-----------|-----|-----|
| Base Platform (3 weeks) | $3,200 | ₹2,68,800 |
| Growth Pipeline (12–18 months) | $10,500 | ₹8,82,000 |
| **Grand Total** | **$13,700** | **₹11,50,800** |

### Payment Structure (Base Platform)

| Milestone | USD | INR | % | Deliverable |
|-----------|-----|-----|---|-------------|
| Project Start (Day 1) | $1,280 | ₹1,07,520 | 40% | Kickoff, design system, brand setup |
| Mid-project (Day 10) | $960 | ₹80,640 | 30% | Marketing site + investor portal |
| Final Delivery (Day 21) | $960 | ₹80,640 | 30% | Admin dashboard + deployment + handoff |
| **Total** | **$3,200** | **₹2,68,800** | 100% | Base platform delivered |

---

## INFRASTRUCTURE BUDGET TIERS (Monthly Hosting Costs)

> **Note:** These are the client's ongoing hosting/service costs (separate from the $3,200 base development fee). Recommend starting with Tier 1 and upgrading when revenue flows.

### Tier 1: STARTER — ~$15/mo (Rs 1,360/mo) — START HERE

| Service | Choice | Cost |
|---------|--------|------|
| Database | Supabase Free (500MB, 50K MAU) | $0 |
| Frontend Hosting | Vercel Hobby | $0 |
| Backend Hosting | Railway Hobby | $5/mo |
| CDN | Cloudflare Free | $0 |
| Payments | Razorpay Standard (2% + GST) | Per-txn |
| Payroll | RazorpayX Payroll Free (unlimited employees) | $0 |
| Email | SendGrid Free (100/day) | $0 |
| WhatsApp | Click-to-chat links (no API) | $0 |
| CRM | HubSpot Free (1M contacts) | $0 |
| Domain | .in domain | ~$10/yr |
| **Total** | | **~$15/mo** |

### Tier 2: PROFESSIONAL — ~$107/mo (Rs 9,700/mo) — RECOMMENDED

| Service | Choice | Cost |
|---------|--------|------|
| Database | Supabase Pro (8GB, 100K MAU, daily backups) | $25/mo |
| Frontend | Vercel Pro (1TB bandwidth, Mumbai bom1 edge) | $20/mo |
| Backend | Railway Pro (FastAPI + workers) | $20/mo |
| CDN | Cloudflare Free | $0 |
| Payments | Razorpay Subscriptions (~1% + GST) | Per-txn |
| Payroll | RazorpayX Payroll Pro (Rs 100/employee/mo) | ~$12/mo |
| Email | SendGrid Essentials (50K/mo) | $15/mo |
| WhatsApp | Twilio WhatsApp Business API | ~$15/mo |
| CRM | HubSpot Free (sufficient) | $0 |
| Monitoring | Vercel Analytics + PostHog Free | $0 |
| **Total** | | **~$107/mo** |

### Tier 3: ENTERPRISE — ~$450-900/mo (Rs 40,000-82,000/mo)

| Service | Choice | Cost |
|---------|--------|------|
| Database (Option A) | Supabase Team (SOC 2, SSO, HIPAA-ready) | $599/mo |
| Database (Option B) | AWS RDS Multi-AZ (Mumbai ap-south-1) | $110/mo |
| Frontend | Vercel Pro (2 users) | $40/mo |
| Backend | AWS EC2 t3.medium + ALB (Mumbai) | $60/mo |
| CDN | AWS CloudFront Pro (WAF, DDoS) | $200/mo |
| Payments | Razorpay Enterprise (custom rates ~0.5%) | Per-txn |
| Payroll | RazorpayX Payroll Pro + Keka HR | ~$50/mo |
| Email | SendGrid Pro (100K/mo) | $90/mo |
| WhatsApp | Twilio WhatsApp + dedicated number | ~$50/mo |
| **Total (Option A)** | | **~$904/mo** |
| **Total (Option B)** | | **~$450/mo** |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| Animations | GSAP, Framer Motion, Lenis smooth scroll |
| VR Tours | Photo Sphere Viewer (Three.js), Gyroscope API, WebXR |
| Backend | FastAPI (Python) |
| Database | Supabase PostgreSQL |
| Payments | Razorpay (UPI, cards, net banking, subscriptions) |
| Payroll | RazorpayX Payroll (salary disbursement, compliance) |
| Communication | Twilio WhatsApp Business API, SendGrid |
| CRM | HubSpot |
| Workflows | N8N automation |
| Deployment | Vercel (Mumbai region) + Railway |

---

## 3-WEEK SPRINT PLAN

### WEEK 1: Foundation + Marketing Website + Employee System (Days 1-7)

#### Day 1-2: Project Scaffolding & Design System

**Initialize Next.js 16 project** with TypeScript, Tailwind CSS 4, shadcn/ui, and the complete Mater Maria design token system.

**Design Tokens:**

| Token | Value | Usage |
|-------|-------|-------|
| Gold 500 | #C7A036 | Primary brand gold |
| Gold 400 | #E1A901 | Active/hover states |
| Navy 500 | #0D1D2F | Primary navy |
| Royal 500 | #4A5AB4 | Accent/links |
| Kerala 500 | #4A7C59 | Nature accents |
| Cream | #F5F0EB | Page backgrounds |
| Ivory | #FFFDF7 | Card backgrounds |
| Charcoal | #1A1A1A | Primary text |

**Typography:**

| Purpose | Font |
|---------|------|
| Display | Playfair Display (serif) |
| Headings | Cormorant Garamond (serif) |
| Body | Inter (sans-serif) |

**Animation System:** Senior-friendly (prefers-reduced-motion respected), gentle fade-ups 0.6s, max parallax 30px, no flashing/spinning.

---

#### Day 2-4: Marketing Website — All Pages (SSG)

**Pages (10):** Homepage, About, Residences, Amenities, Wellness, Gallery, Contact, Investors (public), Blog, Virtual Tour

**Components (30+):**
```
src/components/
├── marketing/   Header, Footer, HeroSection, WhatsAppCTA, LeadCaptureForm,
│                ResidenceCard, AmenityGrid, TestimonialSlider, InvestorCTA,
│                KeralaLifestyle, VirtualTourCTA, SEOHead
├── effects/     ScrollReveal, ParallaxImage, TextReveal, GoldParticles,
│                CursorGlow, SmoothScroll
├── vr/          VirtualTour, VRModal, Hotspot, GyroscopeViewer, VRCardboardPrompt
├── investor/    ProjectTimeline, ROICalculator, DocumentVault, ProgressGallery
├── hr/          EmployeeDashboard, PayrollSummary, AttendanceTracker,
│                LeaveManager, ComplianceCalendar, ShiftScheduler
└── payments/    RazorpayButton, SubscriptionManager, InvoiceGenerator
```

**Homepage (10 sections):**
1. Hero — cinematic fullscreen, MM wings animation, gold particles, stats counter, dual CTA
2. Why Kottayam — 6-card grid, scroll stagger reveal, Kerala parallax
3. Residences — horizontal scroll villa cards, each opens to 360° VR tour
4. Amenities — tabbed (Healthcare, Comfort, Community, Wellness)
5. Virtual Tour CTA — 360° preview with gyroscope teaser
6. Testimonials — auto-carousel with resident photos
7. Investment Opportunity — progress bar, ROI teaser
8. Blog — masonry grid (3 latest)
9. Kerala Lifestyle — full-bleed parallax gallery
10. Final CTA — lead form + WhatsApp

---

#### Day 4-5: 360° VR Villa Tour System

**Technology:** Photo Sphere Viewer (Three.js) with gyroscope, hotspots, autorotate, Google Cardboard.

**4 Experience Tiers:**

| Tier | Device | Experience |
|------|--------|------------|
| 1 | Desktop | Click + drag, hotspot navigation |
| 2 | Mobile Touch | Swipe, pinch zoom |
| 3 | Mobile Gyroscope | Phone as viewfinder (tilt to look) |
| 4 | VR Headset | Google Cardboard split-screen ($2-10 in India) |

**India Performance:** Progressive JPEG (200KB → 2MB → 8MB), lazy load on "Start Tour", fallback static gallery. Target: <3s on 4G, <8s on 3G.

**3 Villa Tours:**
- Serenity Studio (650 sq.ft, 3-5 rooms)
- Harmony Suite (950 sq.ft, 4-6 rooms)
- Tranquility Villa (1,350 sq.ft, 5-7 rooms)

---

#### Day 5-7: Database Schema + Employee Management Foundation

**15+ Database Tables:**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| mm_residents | Resident management | room_type, status, monthly_fee, medical_history (JSONB) |
| mm_family_members | Family portal access | resident_id, relationship, whatsapp, portal_access |
| mm_investors | Investment tracking | pan_number, investment_amount, equity_percentage |
| mm_inquiries | Lead capture | inquiry_type, source, utm params, lead_score, hubspot_id |
| mm_project_phases | Construction progress | progress_percentage, budget, spent, photos (JSONB) |
| mm_employees | Employee management | department, designation, salary, compliance IDs (encrypted) |
| mm_payroll_runs | Monthly payroll | status, totals, razorpay_payout_id |
| mm_payslips | Per-employee payslips | earnings, deductions, EPF/ESI/TDS/PT/LWF breakdowns |
| mm_attendance | Daily attendance | check_in, check_out, shift, overtime_hours |
| mm_leave_balances | Annual leave tracking | casual, sick, earned, maternity, paternity |
| mm_leave_requests | Leave applications | leave_type, dates, approval status |
| mm_compliance_deadlines | Statutory filing calendar | EPF, ESI, TDS, Professional Tax, LWF deadlines |
| mm_subscriptions | Resident billing | tier, amount, GST, razorpay_subscription_id |
| mm_invoices | GST-compliant invoices | CGST, SGST, SAC code, e-invoice IRN |

All tables use UUID primary keys, TIMESTAMPTZ for dates, JSONB for flexible data.

---

### WEEK 2: Employee Management + Investor Portal + Integrations (Days 8-14)

#### Day 8-9: Employee Management System (Full HR)

**Portal Pages:**
- HR Dashboard — KPIs: headcount, payroll cost, compliance status
- Employee Directory — add/edit employees, department filtering
- Payroll Processing — monthly calculation with all statutory deductions
- Attendance Tracker — daily check-in/out, shift management
- Leave Management — apply, approve, balance tracking
- Compliance Calendar — EPF/ESI/TDS filing deadlines with alerts
- Shift Scheduling — 24/7 care facility roster management

**Indian Payroll Engine — All Statutory Components:**

| Compliance | Rate/Rule | Filing | Portal |
|------------|-----------|--------|--------|
| EPF | 12% employee + 12% employer | Monthly by 15th | epfindia.gov.in |
| ESI | 0.75% + 3.25% (if gross ≤ Rs 21K) | Monthly by 15th | esic.gov.in |
| TDS | Per income tax slabs (new regime) | Quarterly (Form 24Q) | incometax.gov.in |
| Professional Tax | Rs 0-1250/half-year (Kerala slabs) | Half-yearly (Aug 30, Feb 28) | tax.kerala.gov.in |
| LWF | Rs 50 + Rs 50/month | Bi-annual (Jun 30, Dec 31) | lc.kerala.gov.in |
| Gratuity | (15/26) x basic x years | On separation after 5 years | — |
| Bonus | 8.33-20% of salary | Annual | — |
| Shops License | Kerala Shops & Establishments Act | Annual renewal | lc.kerala.gov.in |
| Min Wage | Rs 600-900/day (by sector) | — | labour.kerala.gov.in |

**Leave Entitlements (Kerala):**

| Leave Type | Days/Year | Rules |
|------------|-----------|-------|
| Casual Leave | 12 | Cannot be carried forward |
| Sick Leave | 12 | Medical certificate for 3+ days |
| Earned Leave | 15 | Can accumulate, encashable |
| Maternity | 180 | Full pay, after 80 days working |
| Paternity | 10 | Kerala govt employees (extend to private) |
| Weekly Off | 52 | Mandatory 1 day/week |
| Public Holidays | 10+ | Kerala gazetted holidays |

---

#### Day 9-10: AI-Powered HR Features

**Growth Pipeline Add-Ons (not included in base $3,200):**

1. **AI Shift Scheduler** — 24/7 care facility optimization, constraint satisfaction for nurses/doctors/kitchen/security, labor law compliance (8hr max, overtime at 2x), sick leave backfill — **$1,500 / ₹1,26,000** (Month 6–12)
2. **AI Compliance Bot** — auto EPF/ESI/TDS filing, tracks ALL deadlines, auto-alerts 15/7/1 days before, generates pre-filled forms — **$1,000 / ₹84,000** (Month 9–18)

**Future Add-Ons (beyond Growth Pipeline):**

3. **AI HR WhatsApp Chatbot** — self-service leave/payslip queries in English + Malayalam (future pricing)
4. **AI Attrition Predictor** — ML model for care staff retention risk (future pricing)
5. **AI Recruitment Screener** — healthcare credential verification (future pricing)

---

#### Day 10-11: Investor Portal (Authenticated)

**Public Page:** Project overview, phase timeline, investment tiers, RERA badge, prospectus PDF download.

**Authenticated Portal:**
- Dashboard: animated donut charts (Recharts), returns tracker, project timeline
- Projects: Gantt chart, drone photos, milestone alerts
- Financials: quarterly PDFs, ROI projections, distribution history
- Documents: RERA certs, NOCs, DocuSign e-signatures
- Updates: construction photo galleries, WhatsApp opt-in

**Investor Distribution:** Razorpay Route for automated split payments to investor bank accounts.

---

#### Day 11-12: Recurring Payments + Billing

**Resident Subscription Tiers:**

| Tier | Monthly | Daily Rate | GST (12%) | Total |
|------|---------|------------|-----------|-------|
| Basic | Rs 25,000 | Rs 833 | Rs 3,000 | Rs 28,000 |
| Premium | Rs 75,000 | Rs 2,500 | Rs 9,000 | Rs 84,000 |
| Luxury | Rs 1,50,000 | Rs 5,000 | Rs 18,000 | Rs 1,68,000 |

**Payment Collection Methods (elderly-friendly hierarchy):**
1. Paper NACH (no limit) — most comfortable for elderly
2. eNACH (up to Rs 10 lakh) — digital bank auto-debit
3. UPI Autopay (up to Rs 15,000) — growing adoption
4. Standing Instruction — bank-managed, familiar
5. Post-dated Cheques — still common in Kerala

**Razorpay Integration:**
- Razorpay Subscriptions API (~1% + GST) for recurring billing
- Razorpay Route for investor distribution splits
- RazorpayX Payroll for employee salary disbursement
- Razorpay eMandate + Paper NACH for elderly residents
- International payments for NRI families (~3% + GST)

---

#### Day 12-14: Lead Capture + WhatsApp + CRM + SEO

**Lead Flow:**
1. Form submit → Supabase `mm_inquiries` insert
2. → HubSpot contact create (sync)
3. → WhatsApp welcome message (Twilio)
4. → N8N nurture workflow trigger
5. → SendGrid email confirmation

**WhatsApp CTA:** Floating button, pre-filled "Hi, I'm interested in Mater Maria Homes..."

**SEO:** Schema.org (LocalBusiness, RetirementCommunity), sitemap.ts, robots.ts, GA4 + Facebook Pixel, blog content hub. Keywords: "retirement homes Kottayam", "senior living Kerala", "luxury retirement India".

---

### WEEK 3: Admin Dashboard + Polish + Deploy (Days 15-21)

#### Day 15-16: Admin Dashboard

**Dashboard KPIs:**
- Occupancy rate (% of rooms filled)
- Active leads pipeline (by stage)
- Monthly revenue (subscriptions + one-time)
- Employee count by department
- Compliance status (EPF/ESI/TDS filing status)
- Investor capital raised vs target

**Portal Pages:** Leads (Kanban pipeline), Residents, Employees, Financials (revenue, billing, GST)

---

#### Day 16-17: Payroll Processing + RazorpayX Integration

**Payroll Flow:**
1. Auto-calculate on 25th of each month (attendance + leaves + deductions)
2. Generate payslips with all statutory breakdowns
3. Manager reviews and approves
4. RazorpayX disburses to employee bank accounts (instant 24/7)
5. Auto-generate EPF ECR, ESI contribution files
6. TDS calculated and Form 24Q data prepared quarterly
7. Compliance calendar updated with filing status

**RazorpayX Payroll Options:**

| Plan | Cost | Features |
|------|------|----------|
| Free | Rs 0 | Basic payroll, unlimited employees, TDS/PF/ESI auto-calc |
| Pro | Rs 100/emp/mo | Advanced: multi-location, flexible benefits, reimbursements |

---

#### Day 17-18: Communication Automation + N8N Workflows

**WhatsApp Templates:**
- Welcome message (new inquiry)
- Visit confirmation + directions to Kottayam
- Monthly billing reminder (3 days before)
- Payslip notification (employee)
- Compliance deadline alert (HR)
- Construction update (investor)

**N8N Workflows:**
- Lead nurture: Day 0 WhatsApp → Day 1 Email → Day 3 Follow-up → Day 7 Call reminder
- Resident onboarding: Welcome → Document collection → Room assignment → Tour scheduling
- Payroll: Auto-calculate → Approval notification → Disburse → Filing reminder
- Investor updates: Monthly progress photo → Quarterly financial report

---

#### Day 18-19: Testing + Accessibility + Performance

- Lighthouse audit: target 90+ performance, 100 accessibility
- WCAG 2.1 AA: senior-friendly (18px+ font, high contrast Gold/Navy, skip nav, ARIA labels)
- Mobile testing: Chrome DevTools + real Android (Samsung, Xiaomi, OnePlus)
- VR tour: test gyroscope on Android/iOS, fallback on older devices
- Payroll: test calculation with sample employees (nurse Rs 20K, doctor Rs 80K, admin Rs 15K)
- Payment: Razorpay test mode end-to-end
- Load: test with 100 concurrent users

---

#### Day 19-20: Deployment

**Recommended Tier 2 Deployment:**
- Supabase Pro (Mumbai) — apply mater_maria.sql schema
- Vercel Pro (Mumbai bom1) — Next.js frontend
- Railway Pro — FastAPI backend

**Environment Variables Required:**
- Supabase: URL, Anon Key, Service Role Key
- Razorpay: Key ID, Secret, Webhook Secret
- RazorpayX: Account Number, Key ID, Secret
- Twilio: Account SID, Auth Token, WhatsApp Number
- HubSpot: Access Token
- SendGrid: API Key
- Analytics: GA4 ID, Facebook Pixel ID

---

#### Day 20-21: Documentation + Handoff

- Admin user guide
- HR portal training document
- API documentation (Swagger from FastAPI)
- Deployment runbook
- Backup/restore procedures
- Budget tier comparison sheet for client decision

---

## RESIDENT SUBSCRIPTION PRICING MODEL

```
BASIC TIER — Rs 25,000/month (Rs 28,000 with GST)
├── Furnished villa (Serenity Studio 650 sq.ft)
├── 3 meals/day (vegetarian + non-veg options)
├── Basic housekeeping (weekly)
├── 24/7 security
├── WiFi
└── Common area access

PREMIUM TIER — Rs 75,000/month (Rs 84,000 with GST)
├── All Basic features
├── Larger villa (Harmony Suite 950 sq.ft)
├── Daily housekeeping
├── Healthcare monitoring (weekly doctor visit)
├── Wellness programs (yoga, physiotherapy)
├── Activity center + library
├── Scheduled transportation
└── Laundry service

LUXURY TIER — Rs 1,50,000/month (Rs 1,68,000 with GST)
├── All Premium features
├── Premium villa (Tranquility Villa 1,350 sq.ft with garden)
├── Personal care assistant
├── 24/7 nursing staff on-call
├── Priority medical response (doctor on call)
├── Ayurvedic wellness sessions
├── Concierge services
├── Guest room (2 nights/month free)
└── Private transportation
```

---

## EMPLOYEE DEPARTMENT STRUCTURE (Typical 50-person facility)

| Department | Roles | Headcount | Avg Salary Range |
|------------|-------|-----------|-----------------|
| Nursing | Staff Nurse, Head Nurse, Nursing Aide | 12 | Rs 15,000-45,000 |
| Medical | Visiting Doctor, Physiotherapist | 3 | Rs 30,000-1,00,000 |
| Kitchen | Chef, Cook, Helper | 6 | Rs 10,000-25,000 |
| Housekeeping | Supervisor, Attendant | 8 | Rs 10,000-18,000 |
| Security | Guard, Supervisor | 6 | Rs 12,000-20,000 |
| Wellness | Yoga Instructor, Ayurveda Therapist | 3 | Rs 15,000-35,000 |
| Admin | Manager, Receptionist, Accountant | 5 | Rs 15,000-50,000 |
| Management | GM, HR, Marketing | 4 | Rs 40,000-1,00,000 |
| Maintenance | Electrician, Plumber, Gardener | 3 | Rs 12,000-20,000 |

---

## AI AGENT UTILIZATION MAP

| Agent | Week | Innovation |
|-------|------|------------|
| Next.js Frontend | 1 | All pages + portals |
| UX Designer | 1 | Senior-friendly WCAG 2.1 AA |
| SEO Specialist | 1 | Schema, sitemap, keywords |
| Data Engineer | 1 | Full schema with payroll tables |
| **AI Shift Scheduler** | 2 | **Constraint satisfaction for 24/7 care rosters** |
| **AI Compliance Monitor** | 2 | **Auto-track EPF/ESI/TDS/PT/LWF deadlines** |
| API Developer | 2 | Payroll, billing, investor APIs |
| Billing Expert | 2 | Razorpay + GST + e-Invoice |
| DevOps Engineer | 3 | Multi-tier deployment |
| Security Auditor | 3 | Aadhaar/PAN encryption audit |
| Performance Engineer | 3 | Lighthouse 90+ on Indian 4G |

---

## INTEGRATION REALITY CHECK (India-Specific)

| Category | Free/Budget | Mid-Tier | Enterprise | Reason |
|----------|-------------|----------|------------|--------|
| Database | Supabase Free | Supabase Pro $25/mo | AWS RDS Multi-AZ $110/mo | Scale path clear |
| Hosting | Railway $5/mo | Vercel+Railway $40/mo | AWS Full Stack $200/mo | India regions available |
| Payments | Razorpay Standard 2% | Razorpay Subs 1% | Razorpay Enterprise custom | UPI is mandatory |
| Payroll | RazorpayX Free | RazorpayX Pro Rs 100/emp | Keka HR Rs 100/emp | Indian compliance built-in |
| CRM | HubSpot Free | HubSpot Free | HubSpot Starter $20/mo | Free tier is powerful |
| Email | SendGrid Free 100/day | SendGrid $15/mo 50K/mo | SendGrid Pro $90/mo | Already configured |
| WhatsApp | Click-to-chat links | Twilio API $15/mo | Twilio dedicated $50/mo | India's primary channel |
| VR Tours | Static gallery | Photo Sphere Viewer | Matterport $69/mo | Open source sufficient |

---

## VERIFICATION PLAN

1. **Design System** — Compare against Mater Maria brand guideline PDF
2. **Marketing Site** — Lighthouse 90+ performance, 100 accessibility
3. **Lead Capture** — Form → Supabase + HubSpot + WhatsApp message
4. **Payments** — Razorpay test mode: subscription create → auto-debit → invoice
5. **Payroll** — Calculate sample payslips (3 salary levels), verify EPF/ESI/TDS amounts
6. **Employee Portal** — Apply leave → approval → balance update
7. **Investor Portal** — Login → dashboard → download document
8. **Compliance** — Verify all deadlines populated for FY 2026-27
9. **VR Tour** — Desktop drag + mobile gyroscope + fallback gallery
10. **Mobile** — Chrome DevTools + real Android device (Samsung/Xiaomi)
11. **SEO** — Search Console + sitemap + schema markup validation
12. **Deployment** — Verify Vercel + Railway + Supabase on production

---

*Prepared by TAURUS AI Corp for Mater Maria Homes*
*Luxury Retirement Living — Kottayam, Kerala, India*
*"Under His Wings You Will Find Refuge" — Psalm 91:4*
