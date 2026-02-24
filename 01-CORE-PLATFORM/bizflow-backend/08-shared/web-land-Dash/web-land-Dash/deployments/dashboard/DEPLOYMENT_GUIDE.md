# 🚀 TaurusAI Vibe Empire Dashboard - Deployment Guide

## 🌐 Domain Configuration

### Main Domains:
- **Primary**: taurusai.io
- **Dashboard**: vibeEmpire.taurusai.io  
- **Landing**: bizflow.taurusai.io

### Namecheap DNS Setup:
```
Type    Name              Value                    TTL
A       @                 76.76.19.61             300
CNAME   vibeEmpire        vibeEmpire.taurusai.io  300
CNAME   bizflow           bizflow.taurusai.io     300
```

## 📦 Deployment Steps

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy dashboard
cd dashboard
vercel --prod --alias vibeEmpire.taurusai.io

# Deploy landing page  
cd ../landing-page
vercel --prod --alias bizflow.taurusai.io
```

### 2. Environment Variables
```env
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key
FIRECRAWL_API_KEY=your_firecrawl_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Database Setup (Supabase)
```sql
-- Create main tables
CREATE TABLE campaigns (...);
CREATE TABLE leads (...);
CREATE TABLE content (...);
CREATE TABLE analytics (...);
```

## 🔧 MCP Integration

### Required MCPs:
- Playwright MCP (web automation)
- Klavis MCP (orchestration)  
- Design Tokens MCP (styling)
- Tailwind MCP (components)
- Icon Assets MCP (graphics)
- Figma MCP (design sync)

### Integration Commands:
```bash
# Install MCP dependencies
npm install @modelcontextprotocol/server-playwright
npm install @modelcontextprotocol/server-klavis

# Configure MCP servers
cp mcp-config.json ~/.config/mcp/
```

## 📊 Analytics Setup

### Mixpanel Events:
- Dashboard viewed
- Feature used
- Lead generated
- Content created
- Campaign launched

### Google Analytics:
- GA4 property setup
- Conversion tracking
- Custom dimensions
- Attribution modeling

## 🚀 Go Live Checklist

- [ ] Domain DNS configured
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Database tables created
- [ ] MCP servers running
- [ ] Analytics tracking active
- [ ] SSL certificates valid
- [ ] Performance optimized
- [ ] SEO meta tags set
- [ ] Social media integrated

## 📞 Support

For deployment support:
- Email: support@taurusai.io
- Slack: #deployment-help
- Documentation: docs.taurusai.io
