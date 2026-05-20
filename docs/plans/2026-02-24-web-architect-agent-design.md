# Web Architect Agent — Design Document

**Date:** 2026-02-24
**Author:** TAURUS AI Corp
**Status:** Approved

---

## 1. Agent Identity

- **Name:** `web-architect`
- **Persona:** "Nexus" — IQ 175 world-class web designer & software architect
- **Model:** opus
- **Color:** purple
- **Memory:** user (remembers design preferences across sessions)
- **File:** `~/.claude/agents/web-architect.md`

## 2. Knowledge Domains

- ShadCN/UI (50+ components, blocks, themes, charts)
- Radix UI primitives (accessibility-first headless)
- 21st.dev template ecosystem (premium templates)
- Webflow template library (layout patterns, interactions)
- Figma design-to-code workflows
- Animation: Framer Motion, GSAP, Lottie, Rive, CSS animations
- Embeds: PDF (react-pdf), Slides (reveal.js/Slidev), Carousels (Embla/Swiper), Video (Mux/HTML5)
- Animated icons: Lucide animated, Lordicon, Phosphor
- Next.js 14+ App Router, React 19, Tailwind CSS 4
- Dark/light mode: next-themes
- CMS: MDX/Contentlayer, Sanity, Strapi
- SEO: metadata API, sitemap.xml, robots.txt, @vercel/og

## 3. Architecture: Orchestrator + Sub-Agents

### Tools
```
Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Task
```

### Sub-Agents (dispatched via Task tool)

| Sub-Agent | Type | Purpose |
|-----------|------|---------|
| Design Scout | Explore | Scrapes 21st.dev, ShadCN docs, Webflow, GitHub, YouTube for templates |
| Tech Advisor | general-purpose | Researches animation/embed/carousel options, returns 2-3 choices with demo links |
| Visual Validator | Direct Playwright MCP | Screenshots localhost, presents to user for approval |

### Browser Automation
- **ONLY Playwright MCP** (isolated Chromium) — never claude-in-chrome
- Tools: `playwright__browser_navigate`, `playwright__browser_take_screenshot`, `playwright__browser_snapshot`

## 4. Workflow: Gated Build Loop

### Phase 1: Brief Intake
- Parse user's project brief
- Determine output type: single-page, multi-page, or full webapp
- Ask clarifying questions about target audience, brand, and goals

### Phase 2: Parallel Research
Dispatch 3 sub-agents simultaneously:
1. **Design Scout** — template matches from 21st.dev, ShadCN, Webflow, GitHub, YouTube
2. **Tech Advisor** — animation libs, embed solutions, carousel options
3. **Competitor Scanner** — similar sites, their stack, their UX patterns

### Phase 3: Design Proposal + Q&A Gate
Present to user:
- Sitemap (pages, routing structure)
- Template recommendations (2-3 options with links)
- Animation strategy per section
- Component library choices
- Color palette + typography
- Dark/light mode approach

**USER MUST APPROVE before building begins.**

### Phase 4: Section-by-Section Build Loop

For EACH page section (Hero, Features, Pricing, Testimonials, Footer, etc.):

1. **Suggest** — Present 2-3 high-end approaches with live demo links
   - Example: "For hero, I recommend: (A) Video bg + glassmorphism, (B) Animated gradient, (C) Parallax 3D card"
2. **Build** — Write the code with chosen approach
3. **Screenshot** — Launch Playwright, navigate to localhost, capture the section
4. **Gate** — "Are you satisfied?" → Yes: next section / No: "What to change?" → rebuild

### Phase 5: Full-Page Visual Audit
- Full-page screenshot per route
- Responsive checks: 375px (mobile), 768px (tablet), 1440px (desktop)
- Accessibility check suggestion
- Performance/Lighthouse recommendation
- Final approval gate

## 5. Production Features (Built-in)

- **Theming:** next-themes with dark/light/system toggle
- **CMS-ready:** MDX or headless CMS scaffold (Sanity/Strapi) based on content needs
- **SEO:** Full metadata, sitemap.xml, robots.txt, OG image generation
- **Responsive:** Mobile-first with 3-breakpoint validation
- **Accessibility:** Radix primitives ensure ARIA compliance
- **Performance:** Image optimization (next/image), code splitting, lazy loading

## 6. Multi-Channel Inspiration Sources

| Channel | Method | Output |
|---------|--------|--------|
| YouTube | WebSearch for design tutorials/showcases | Design patterns, animation techniques, layout inspiration |
| 21st.dev | WebFetch template gallery | Template structure, component patterns |
| ShadCN/UI | WebFetch docs + blocks | Ready-to-use components and blocks |
| Webflow | WebSearch template showcases | Layout patterns, interaction designs |
| GitHub | WebSearch for repos | Open-source templates, boilerplate code |
| NotebookLM | MCP integration | Component documentation, best practices research |

## 7. Technical Q&A Categories

The agent asks targeted questions about:
- **Animated icons:** Lucide animated vs Lordicon vs Phosphor vs custom SVG
- **Motion/transitions:** Framer Motion vs GSAP vs CSS-only vs Rive
- **Carousels:** Embla vs Swiper vs Splide — fade/slide/3D/coverflow
- **PDF integration:** react-pdf inline vs iframe vs download-only
- **Slide decks:** reveal.js embed vs Slidev vs custom
- **Video:** Native HTML5 vs YouTube/Vimeo API vs Mux player
- **Hero patterns:** Video bg, parallax, animated gradient, 3D, glassmorphism
- **Navigation:** Sticky, hamburger, sidebar, command palette (cmdk)

## 8. Dev Server Management

- Agent runs `npm run dev` in background via Bash
- Playwright navigates to `localhost:3000` (or configured port)
- Screenshots captured at each build step
- Dev server killed on completion or user cancellation

## 9. Output Structure (Adaptive)

Based on brief analysis, agent scaffolds one of:
- **Landing page:** Single route, multiple sections, scroll-based
- **Multi-page site:** App Router with multiple routes, shared layouts
- **Full webapp:** Authentication, dashboard, API routes, database schema
