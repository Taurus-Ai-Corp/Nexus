---
title: "TAURUS AI Corp — Candidate Meeting Playbook"
subtitle: "Anuz Subedi Interview: Communication Script, Expected Answers & Next Steps"
author: "Prepared by Claude Code for TAURUS AI Corp"
date: "2026-06-24"
geometry: margin=1in
fontsize: 11pt
mainfont: "Helvetica"
sansfont: "Helvetica"
monofont: "Menlo"
colorlinks: true
linkcolor: "taurusterracotta"
urlcolor: "taurusterracotta"
toc: true
header-includes: |
  \definecolor{taurusterracotta}{HTML}{B85C38}
---

# Executive Summary

**Candidate:** Anuz Subedi (`anuzsubedi`)  
**Location:** Toronto / Windsor area contact  
**Stack:** JavaScript, Python, TypeScript, React/Next.js, macOS/SwiftUI, CSS/HTML  
**Current status:** Pre-revenue bootstrapped startup seeking experience; open to co-op / unpaid-with-equity arrangement.

**Your reality:** TAURUS AI Corp is a Canadian corporation, bootstrapped, pre-revenue, with significant product momentum but no salary runway today. You cannot legally employ someone unpaid at a for-profit Ontario corporation unless it is a true academic co-op placement or a narrowly defined training exception.

**Best path forward:** Structure this as a **paid co-op or short-term project contract** funded by the **Ontario Co-operative Education Tax Credit** and/or the **Student Work Placement Program (SWPP / Talent Opportunities Program)**. A $10,000 four-month co-op placement can cost you as little as $2,000–$3,000 out of pocket after subsidies.

This document contains:
1. A full 30–45 minute meeting script.
2. The 10 questions to ask and the answers you want to hear.
3. Red flags to watch for.
4. A practical skills test.
5. Concrete starter projects.
6. Funding options and next-step checklist.

---

# Before the Meeting

**Confirm logistics:**
- Send a calendar invite with a Google Meet or Zoom link.
- Attach this one-pager: *“Taurus AI — What we build and how we work.”*
- Ask him to bring: resume, transcript or co-op letter (if enrolled), and one GitHub repo he is proud of.

**Have these links ready to screen-share:**
- `https://tera-package.vercel.app` — live client brand package (shipped today).
- `https://github.com/Taurus-Ai-Corp/Nexus` — monorepo scale.
- Any live Mater Maria Homes or Nexus Real Estate URL.

---

# Part 1 — Full Meeting Script

## Opening (2 minutes)

> “Thanks for reaching out, Anuz. I looked at your portfolio, your GitHub, and `askk`. I’m glad you’re interested. Before we talk about a role, I want to be straight with you: **TAURUS AI Corp is a bootstrapped Canadian corporation.** We have a lot of IP and product momentum, but we are pre-revenue right now. That means any arrangement we build has to be honest, legal, and mutually useful. If you’re open to that, I think there is real work here that could accelerate both of us.”

## Company Story (3–4 minutes)

> “We are **TAURUS AI Corp**, a Windsor-based AI infrastructure and automation company operating the **Nexus** agency brand. We build three layers of things:
>
> 1. **AI-powered client platforms** — brand sites, social automation, real-estate tools, eldercare SaaS, pet-care apps.
> 2. **Deep-tech infrastructure** — post-quantum cryptography tooling, Hedera/Hiero blockchain audit trails, multi-agent orchestration, open-source payment orchestration.
> 3. **Internal agency systems** — our own Google Workspace bridge, grant automation, design studio, and deploy pipeline.
>
> We have roughly a dozen active projects. Some are client deliverables like the TERA package I just shipped today [show `https://tera-package.vercel.app`]. Some are R&D like our PQC CLI and agent orchestrator. We are also in the middle of grant applications that could fund the next phase.”

## The Opportunity (3 minutes)

> “I’m looking for someone who can help us do three things:
>
> 1. **Turn AI-generated brand assets into real, deployable client surfaces** — landing pages, demo galleries, pitch decks.
> 2. **Prototype front-ends for our Phase 0 products** so we can demo them to clients and grant reviewers.
> 3. **Support documentation and grant application work** — formatting, research, and clear technical writing.
>
> Because we are pre-revenue, I can’t offer a market salary today. What I *can* offer is:
>
> - Real shipping work under your name.
> - Mentorship across AI/LLM, blockchain, and agency systems.
> - A path to paid equity or revenue-share as products monetize.
> - Help structuring this as a formal co-op so you get school credit and we can access wage subsidies that make this nearly cost-neutral for us.
>
> If you are currently enrolled in a co-op program at a Canadian college or university, we can likely pay you a modest wage and have grants cover most of it.”

---

# Part 2 — Questions to Ask & Expected Answers

### 1. School / Co-op status
**Ask:** *“Are you currently enrolled in a Canadian post-secondary program? Co-op or internship stream?”*

**Desired answer:**
- Yes, enrolled in a diploma, degree, or certificate program with a formal co-op or work-integrated learning (WIL) component.
- Can provide a co-op letter or school contact.

**What to listen for:**
- Enthusiasm about getting academic credit for work.
- Understanding that this needs institutional paperwork.

**Red flag:**
- No school affiliation and insists on unpaid work indefinitely. That is legally risky for both of you.

---

### 2. Immigration / work status
**Ask:** *“What is your immigration or work status in Canada?”*

**Desired answer:**
- Canadian citizen, permanent resident, or protected refugee with unrestricted Canadian work rights.
- International student with valid study permit and authorized co-op work permit (if applicable).

**What to listen for:**
- Clear, honest answer.
- Willingness to provide documentation if needed for grant compliance.

**Red flag:**
- Evasive answers, no work authorization, or expectation of cash-under-table payment.

---

### 3. Deep-dive on `askk`
**Ask:** *“Walk me through `askk` — what stack, what was the hardest part, and what would you do differently?”*

**Desired answer:**
- Built with SwiftUI / AppKit / macOS native APIs plus a local LLM API client.
- Hardest part was the global hotkey/Spotlight-style window, sandboxing, or managing async LLM streams.
- Would improve error handling, add Ollama auto-discovery, or write tests.

**What to listen for:**
- Ownership of trade-offs.
- Recognition that shipping native apps is harder than web apps.
- Comfort with privacy-first local AI tooling.

**Red flag:**
- Cannot explain the architecture or blames the framework for everything.

---

### 4. Deep-dive on the markdown editor
**Ask:** *“Walk me through your markdown editor — how does the WYSIWYG and PDF export work?”*

**Desired answer:**
- TypeScript / React-based editor with a Markdown parser and live preview.
- PDF export uses a library like `html2pdf.js`, `jsPDF`, `react-pdf`, or `puppeteer` / headless browser.
- Discusses layout control, page breaks, typography, and print CSS.

**What to listen for:**
- Experience with document rendering and export pipelines.
- Attention to formatting details that matter for client deliverables.

**Red flag:**
- “It just uses a library” with no understanding of the rendering pipeline.

---

### 5. Hardest bug solved
**Ask:** *“What is the most complex bug or performance problem you’ve solved?”*

**Desired answer:**
- Describes a specific incident: symptom, diagnosis, fix, and verification.
- Mentions tools like browser DevTools, profiling, logging, or a reproduction test case.
- Shows persistence and methodical debugging.

**What to listen for:**
- Problem-solving process, not just the final answer.
- Ability to communicate technical challenges clearly.

**Red flag:**
- Cannot name a single hard bug, or every bug is “someone else’s fault.”

---

### 6. Certifications
**Ask:** *“When you said you’re prepared to obtain certifications, which ones are you thinking of?”*

**Desired answer:**
- Cloud: AWS Cloud Practitioner, Azure Fundamentals, or GCP Associate.
- Security: CompTIA Security+, CISSP Associate, or similar.
- Web: Meta Front-End Developer, freeCodeCamp, or relevant bootcamp certificates.
- Shows he has researched what your stack needs.

**What to listen for:**
- Self-awareness about gaps.
- Commitment to closing them quickly.

**Red flag:**
- No specific plan — just “whatever you want.”

---

### 7. Learning goals
**Ask:** *“What do you actually want to learn in the next 6–12 months?”*

**Desired answer:**
- AI/LLM integration, agent systems, or local model deployment.
- Full-stack production systems (Next.js, backend, databases, deployment).
- Startup operations: product, fundraising, grants, client delivery.

**What to listen for:**
- Ambition aligned with your roadmap.
- Willingness to wear multiple hats.

**Red flag:**
- Only wants to do one narrow thing and refuses adjacent work.

---

### 8. Why a zero-revenue startup?
**Ask:** *“Why a zero-revenue startup instead of an established company?”*

**Desired answer:**
- Wants breadth, ownership, and real impact.
- Understands the risk and is betting on learning + equity upside.
- Believes in the mission or the founder.

**What to listen for:**
- Realism, not just romanticism.
- Evidence that he has thought about the trade-off.

**Red flag:**
- Desperation or vague “I just need a job” energy.

---

### 9. Time commitment
**Ask:** *“How many hours per week can you realistically commit?”*

**Desired answer:**
- 10–20 hours/week during school; 35–40 hours/week during co-op term.
- Clear boundaries and a proposed schedule.

**What to listen for:**
- Honesty about other commitments.
- Consistency matters more than raw hours.

**Red flag:**
- Promises 40 hours while obviously unable to deliver.

---

### 10. Async work comfort
**Ask:** *“Are you comfortable working mostly async with weekly check-ins?”*

**Desired answer:**
- Yes, and can demonstrate it with Notion, GitHub issues, Linear, or daily standup updates.
- Comfortable asking for help when blocked.

**What to listen for:**
- Self-management and written communication skills.

**Red flag:**
- Needs constant hand-holding or disappears when working remotely.

---

# Part 3 — Red Flags

Watch for these signals during the call:

| Red Flag | Why It Matters |
|---|---|
| Unwilling to discuss school or work status | Legal / payroll / grant eligibility issues. |
| Expects unpaid work indefinitely | Violates Ontario employment law at a for-profit corp. |
| Cannot explain any project architecture | He will need to work in complex existing codebases. |
| Blames tools/frameworks for all failures | Lack of ownership and growth mindset. |
| Only wants to do UI/UX and refuses backend or docs | You need generalists right now. |
| No evidence of shipping anything | The work here requires actual deployed output. |
| Disparages your pre-revenue status | Culture / motivation mismatch. |
| Cannot commit to a 2-week sprint test | Not serious enough to invest time. |

---

# Part 4 — Practical Skills Test

Do **not** give a LeetCode test. Give a **Taurus-shaped practical task** with a 48-hour deadline.

## Recommended Test

**Assignment:** *“Rebuild the hero section of the TERA package (`https://tera-package.vercel.app`) as a Next.js page. Match the look, fonts, and responsive behavior. Deploy it to Vercel or Netlify and send me the URL.”*

**What it tests:**
- Can he read existing code and replicate it?
- Can he deploy a static Next.js site?
- Does he pay attention to typography, spacing, and mobile breakpoints?

**Evaluation rubric:**

| Criterion | Excellent (3) | Good (2) | Needs help (1) |
|---|---|---|---|
| Visual fidelity | Matches within 90% | Minor spacing/font issues | Looks nothing like original |
| Mobile responsiveness | Clean breakpoints | Usable but rough | Broken on mobile |
| Deployment | Live URL works | Deployed with minor issues | Cannot deploy |
| Code quality | Clean, readable | Acceptable | Messy / unreadable |
| Communication | Asks clarifying questions | Silent but ships | No delivery |

**Alternative tests if he lacks Next.js experience:**
- Add a dark-mode toggle to a Taurus landing page.
- Write a one-page summary of how the Ontario Co-op Tax Credit + SWPP could fund his role.
- Build a simple “Grant Tracker” static page listing active grants, deadlines, and statuses.

---

# Part 5 — Concrete Starter Projects

If he passes the test, assign one of these as the first 2-week paid sprint:

1. **Nexus Creative Brand Site**  
   Build a polished landing page for `taurus-nexus-creative` that explains the dev-config package and links to GitHub.

2. **Mater Maria Assets Expansion**  
   Add 2–3 new static pages to the existing Mater Maria client portal (e.g., testimonials, contact form).

3. **Grant Tracker Dashboard**  
   A simple Next.js or static page listing all active grant applications, deadlines, statuses, and documents.

4. **Nexus Real Estate Landing Polish**  
   Improve the existing landing/questionnaire UI, make it mobile-responsive, and add a lead-capture form.

5. **Social Suite Mockups**  
   Build 3 clickable UI mockups for the social-suite-dashboard to demo to prospects.

Each project is self-contained, client- or demo-visible, uses his JS/TS/React skills, low architectural risk, and shippable in 2 weeks.

---

# Part 6 — Funding: How to Pay Him Without Breaking the Bank

## Option A: Ontario Co-operative Education Tax Credit
- **What:** Refundable Ontario tax credit for hiring co-op students.
- **Rate:** 30% if your prior-year payroll is ≤ $400,000; 25% if ≥ $600,000.
- **Max:** $3,000 per qualifying work placement.
- **Requirement:** Student must be enrolled in a qualifying Ontario college/university co-op program; placement must be at least 10 consecutive weeks.
- **How to claim:** Corporations file Schedule 550 with T2; unincorporated use Form ON479.

## Option B: Student Work Placement Program (SWPP) / Talent Opportunities Program (TOP)
- **What:** Federal wage subsidy delivered in Ontario by the Ontario Chamber of Commerce.
- **Subsidy:** Up to 50% of wages, capped at $5,000 per placement.
- **Net-new rule:** Does **not** apply to businesses with fewer than 100 employees.
- **Eligible students:** Canadian citizens, permanent residents, or protected refugees in a Canadian post-secondary WIL program.
- **Apply:** [occ.ca/talent-opportunities-program](https://occ.ca/talent-opportunities-program/)

## Combined Math (Example)
| Item | Amount |
|---|---|
| 4-month co-op wages (part-time) | $10,000 |
| SWPP/TOP subsidy (50%) | – $5,000 |
| Remaining employer-paid wages | $5,000 |
| Ontario Co-op Tax Credit on employer-paid portion (~30%) | – $1,500 |
| **Net cost to TAURUS AI** | **~$3,500** |

**Bottom line:** For roughly $3,500 out of pocket, you get a motivated co-op developer working on real products for 4 months. This is far safer and more attractive than “unpaid.”

---

# Part 7 — How This Makes You a Better Company

Onboarding Anuz forces you to level up, even without revenue:

| Skill You Build | How Hiring Him Forces It |
|---|---|
| **Prioritization** | You can’t give him 12 projects. You must pick the highest-leverage one. |
| **Spec writing** | You must write down what you want instead of vague ideas. |
| **Delegation** | You learn to trust output you did not personally code. |
| **Legal/HR hygiene** | NDA, contract, payroll/tax setup, grant applications. |
| **Sales/pitch** | You must articulate why someone should join despite no salary. |
| **Culture** | You start defining how TAURUS AI works: async, shipping, documentation. |

Even if he only stays three months, you will have **documentation, a cleaner onboarding path, and a shipped client-facing asset** that did not exist before.

---

# Part 8 — Next Steps Checklist

**Before the call:**
- [ ] Send calendar invite + agenda.
- [ ] Attach one-pager about TAURUS AI.
- [ ] Prepare screen-share links (`tera-package.vercel.app`, GitHub repo).

**During the call:**
- [ ] Use the script in Part 1.
- [ ] Ask all 10 questions from Part 2.
- [ ] Note any red flags from Part 3.

**Within 24 hours after the call:**
- [ ] Send the practical test from Part 4.
- [ ] Ask for school/co-op documentation if he is enrolled.

**If he passes the test:**
- [ ] Draft a 2-week paid sprint agreement (even $500–$1,000 is better than unpaid).
- [ ] Confirm his work authorization and tax details.
- [ ] Apply to SWPP/TOP if eligible: [occ.ca/talent-opportunities-program](https://occ.ca/talent-opportunities-program/)
- [ ] Set up GitHub repo access and weekly 30-min check-ins.

**Use his output in grant narratives:**
- [ ] Add “team expansion / co-op hire” to IRAP, FedDev, and SR&ED applications.
- [ ] Document his work as evidence of product development activity.

---

# Sources & References

- Ontario Co-operative Education Tax Credit: [ontario.ca/page/co-operative-education-tax-credit](https://www.ontario.ca/page/co-operative-education-tax-credit)
- CRA Ontario co-op tax credit details: [canada.ca/.../ontario-operative-education-tax-credit](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/provincial-territorial-corporation-tax/ontario-provincial-corporation-tax/ontario-operative-education-tax-credit.html)
- Ontario Chamber of Commerce — Talent Opportunities Program / SWPP: [occ.ca/talent-opportunities-program](https://occ.ca/talent-opportunities-program/)
- TOP Program Guidelines (March 2026): [occ.ca/wp-content/uploads/TOP-Program-Guidelines-March-2026.pdf](https://occ.ca/wp-content/uploads/TOP-Program-Guidelines-March-2026.pdf)
- TERA live deliverable: [tera-package.vercel.app](https://tera-package.vercel.app)

---

**Prepared by Claude Code for TAURUS AI Corp**  
**Date:** 2026-06-24
