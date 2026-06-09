# 🚀 **BizFlow™ Full-Stack MCP Development System**
## *AI-Orchestrated Business Intelligence Platform*

---

## **🎯 PROJECT OVERVIEW**

**Primary Domain:** `taurusai.io` (Main Taurus AI Corp. Hub)  
**Product Domain:** `BizFlow.taurusai.io` (Marketing Intelligence Platform)  
**Architecture:** Multi-tenant SaaS with Advanced Funnel System  
**Goal:** Create sophisticated lead generation pipeline: E-book → Webinar → Free SaaS → Premium Conversion

---

## **🛠️ RECOMMENDED MCP STACK ARCHITECTURE**

### **🏗️ Core Development MCPs:**
1. **Supabase MCP** - Primary database & auth system
2. **Vercel MCP** - Deployment & hosting platform  
3. **GitHub MCP** - Version control & CI/CD
4. **Docker MCP** - Containerization & local development
5. **Buildable MCP** - AI-powered development assistance

### **🎨 Frontend & Design MCPs:**
6. **Figma MCP** - Design system integration
7. **Canva MCP** - Marketing asset generation
8. **Context7 MCP** - Documentation & content management

### **🔗 Integration & Analytics MCPs:**
9. **Cloudflare MCP** - CDN, Workers, & edge functions
10. **Zapier MCP** - Workflow automation
11. **Firecrawl MCP** - Web scraping & data collection
12. **Slack MCP** - Team communication & alerts

---

## **🎬 MASTER DEVELOPMENT PROMPT**

You are the **Chief Technology Architect** for Taurus AI Corp., tasked with building the **BizFlow™ Marketing Intelligence Platform** - a sophisticated, AI-powered lead generation and conversion system. Your mission is to create a world-class, full-stack application that demonstrates the pinnacle of modern AI-driven business intelligence.

### **🏛️ ARCHITECTURE REQUIREMENTS:**

#### **Domain Structure:**
- **Main Hub:** `taurusai.io` - Corporate showcase with AI agent demonstrations
- **Product Platform:** `BizFlow.taurusai.io` - Dedicated marketing intelligence SaaS
- **Data Flow:** Seamless user journey from main domain to product conversion

#### **Technical Stack:**
- **Frontend:** Next.js 14+ with TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Deployment:** Vercel with Edge Functions
- **Containerization:** Docker for development consistency
- **AI Integration:** Claude API + local Ollama models for cost optimization

---

## **🎯 SAMPLE SCENARIO 1: INITIAL SETUP**

### **Prompt for MCP Integration:**
```
@github create_repository name="taurus-ai-bizflow" description="BizFlow™ Marketing Intelligence Platform - Full-Stack SaaS" private=false

@docker create_development_environment 
  - services: [nextjs, supabase, redis, ollama]
  - ports: [3000, 54322, 6379, 11434]
  - volumes: [./src, ./database, ./docs]

@supabase create_project name="bizflow-intelligence" plan="pro"
  - features: [auth, database, storage, edge_functions, realtime]
  - region: "us-east-1"

@vercel create_project 
  - name: "taurus-ai-main" 
  - domain: "taurusai.io"
  - framework: "nextjs"
  - env_vars: [SUPABASE_URL, SUPABASE_ANON_KEY, CLAUDE_API_KEY]

@vercel create_project 
  - name: "bizflow-platform" 
  - domain: "bizflow.taurusai.io"
  - framework: "nextjs"
  - env_vars: [SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_API_KEY]
```

### **Follow-up Questions:**
1. **Database Schema Design:** What specific user journey stages need tracking?
2. **Authentication Flow:** Social login options (Google, LinkedIn, GitHub)?
3. **Payment Integration:** Stripe vs. other payment processors?
4. **Analytics Depth:** Custom events vs. third-party analytics?

---

## **🎯 SAMPLE SCENARIO 2: FUNNEL DEVELOPMENT**

### **Prompt for Advanced Funnel System:**
```
@supabase design_schema
  tables:
    - users (auth integration)
    - leads (acquisition tracking)
    - funnel_stages (e-book → webinar → trial → premium)
    - behavioral_events (page views, clicks, downloads)
    - conversion_analytics (A/B tests, performance metrics)
    - subscription_tiers (free, professional, enterprise)

@buildable generate_components
  - LandingPageHero (taurusai.io main)
  - LeadMagnetForm (e-book download)
  - WebinarRegistration (automated scheduling)
  - TrialSignup (BizFlow.taurusai.io onboarding)
  - PaymentCheckout (subscription upgrade)
  - DashboardAnalytics (user behavior insights)

@zapier create_automation_workflows
  1. E-book download → Email sequence → Webinar invitation
  2. Webinar attendance → Free trial activation → Feature education
  3. Trial usage tracking → Conversion optimization → Premium upgrade
  4. User behavior analysis → Personalized recommendations → Retention campaigns

@cloudflare setup_edge_functions
  - AB testing middleware
  - Real-time analytics collection
  - User segmentation logic
  - Conversion tracking pixels
```

### **Follow-up Questions:**
1. **Funnel Complexity:** Multi-path based on user behavior vs. linear progression?
2. **Personalization Depth:** AI-driven content vs. rule-based recommendations?
3. **Integration Requirements:** CRM (HubSpot, Salesforce) vs. built-in system?
4. **Performance Targets:** Conversion rates, load times, user engagement metrics?

---

## **🎯 SAMPLE SCENARIO 3: AI INTELLIGENCE LAYER**

### **Prompt for AI-Powered Features:**
```
@context7 create_knowledge_base
  - BizFlow methodology documentation
  - User onboarding guides
  - Case studies and success stories
  - API documentation for integrations

@buildable implement_ai_features
  1. Intelligent Lead Scoring (behavioral pattern analysis)
  2. Dynamic Content Personalization (AI-driven recommendations)
  3. Predictive Analytics Dashboard (conversion probability)
  4. Automated A/B Test Generation (copy, design, timing optimization)
  5. Smart Funnel Optimization (real-time path adjustment)

@firecrawl setup_competitive_intelligence
  - Monitor competitor pricing changes
  - Track industry benchmark updates
  - Analyze market trend shifts
  - Collect performance data for comparison

@slack create_notification_system
  - High-value lead alerts
  - Conversion milestone notifications
  - System performance warnings
  - Revenue threshold celebrations
```

### **Follow-up Questions:**
1. **AI Model Strategy:** Local Ollama for basic tasks vs. Claude for complex analysis?
2. **Data Privacy:** GDPR/CCPA compliance requirements?
3. **Scalability Planning:** Expected user growth trajectory?
4. **Competitive Analysis:** Real-time vs. scheduled intelligence gathering?

---

## **🎯 SAMPLE SCENARIO 4: DEPLOYMENT & MONITORING**

### **Prompt for Production Deployment:**
```
@vercel deploy_production
  - Environment: production
  - Domain verification: [taurusai.io, bizflow.taurusai.io]
  - SSL certificates: automatic
  - Performance monitoring: enabled
  - Error tracking: integrated

@cloudflare configure_cdn
  - Cache optimization for static assets
  - Geographic distribution (US, EU, APAC)
  - DDoS protection enabled
  - Analytics and performance monitoring

@supabase setup_monitoring
  - Database performance tracking
  - User authentication analytics
  - API usage monitoring
  - Backup scheduling (daily, with point-in-time recovery)

@github setup_cicd
  - Automated testing on pull requests
  - Staging deployment for code review
  - Production deployment on main branch merge
  - Security scanning and dependency updates
```

### **Follow-up Questions:**
1. **Monitoring Depth:** Custom dashboards vs. third-party tools (DataDog, New Relic)?
2. **Backup Strategy:** Multi-region redundancy requirements?
3. **Load Testing:** Expected concurrent user capacity?
4. **Security Auditing:** Penetration testing schedule and compliance needs?

---

## **🔧 RECOMMENDED MCP TOOL PRIORITIES**

### **Phase 1: Foundation (Weeks 1-2)**
1. **Supabase MCP** - Database architecture
2. **GitHub MCP** - Repository setup
3. **Docker MCP** - Development environment
4. **Vercel MCP** - Initial deployment

### **Phase 2: Core Platform (Weeks 3-6)**
5. **Buildable MCP** - Component development
6. **Context7 MCP** - Documentation system
7. **Zapier MCP** - Automation workflows
8. **Figma MCP** - Design system

### **Phase 3: Intelligence Layer (Weeks 7-10)**
9. **Cloudflare MCP** - Performance optimization
10. **Firecrawl MCP** - Data collection
11. **Slack MCP** - Team coordination
12. **Canva MCP** - Marketing assets

---

## **💡 STRATEGIC RECOMMENDATIONS**

### **Domain Architecture Strategy:**
- **taurusai.io:** Corporate authority builder, showcases AI capabilities, drives traffic to BizFlow
- **BizFlow.taurusai.io:** Product-focused conversion engine, detailed functionality, trial-to-paid pipeline

### **Funnel Optimization Approach:**
- **Simple Path (taurusai.io):** Broad audience, educational content, brand building
- **Complex Path (BizFlow.taurusai.io):** Qualified leads, advanced features, revenue generation

### **Technical Excellence:**
- **Performance First:** Sub-3-second load times, 99.9% uptime
- **Security Priority:** SOC 2 compliance preparation, data encryption
- **Scalability Ready:** Multi-tenant architecture, efficient database design

---

## **🚀 NEXT STEPS WORKFLOW**

1. **Initialize MCP Environment** (Day 1)
2. **Set up Domain Infrastructure** (Days 2-3)
3. **Develop Core Funnel Logic** (Week 1)
4. **Implement AI Intelligence Features** (Week 2)
5. **Deploy and Test Everything** (Week 3)
6. **Launch with Performance Monitoring** (Week 4)

**Ready to build the future of AI-powered marketing intelligence?**