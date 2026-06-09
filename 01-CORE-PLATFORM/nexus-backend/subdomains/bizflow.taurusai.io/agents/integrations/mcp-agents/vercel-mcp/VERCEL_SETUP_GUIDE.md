# 🚀 Vercel MCP Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your profile → **Settings**
3. Go to **Tokens** tab
4. Click **Create Token**
5. Name it: `vibe-marketing-mcp`
6. Set scope: **Full Account**
7. Copy the token (starts with `vercel_...`)

### Step 2: Update Your MCP Configuration
1. Open your Cursor MCP settings (`~/.cursor/mcp.json`)
2. Find the `vercel` section
3. Replace `your_vercel_token_here` with your actual token
4. Save and restart Cursor

### Step 3: Test the Integration
In Cursor, try:
```
@vercel deploy_vibe_portfolio
```

## 🎪 Available Commands

### `@vercel deploy_vibe_portfolio`
**One-click deploy your entire Vibe Marketing portfolio!**
- Deploys your interactive HTML presentation
- Includes business portfolio markdown
- Sets up custom domain ready
- Returns live URL instantly

### `@vercel deploy_to_vercel`
**Deploy any project directory**
- `projectPath`: Path to your project
- `projectName`: Name for the deployment

### `@vercel get_deployments`
**List all your deployments**
- Shows latest 10 deployments
- Includes URLs and status

### `@vercel check_deployment_status`
**Check specific deployment**
- `deploymentId`: ID of deployment to check

### `@vercel setup_custom_domain`
**Add custom domain**
- `projectName`: Your project name
- `domain`: Custom domain (e.g., `vibemarketing.com`)

## 🎯 Perfect for Vibe Marketing

### Instant Portfolio Sharing
```
@vercel deploy_vibe_portfolio
```
**Result**: Your portfolio is live at `https://vibe-marketing-empire.vercel.app`

### Custom Domain Setup
```
@vercel setup_custom_domain projectName="vibe-marketing-empire" domain="vibemarketing.com"
```

### Check Live Status
```
@vercel get_deployments projectName="vibe-marketing-empire"
```

## 🚀 What Gets Deployed

When you run `deploy_vibe_portfolio`, it automatically includes:

✅ **Interactive Portfolio** (`vibe-marketing-portfolio-preview.html`)  
✅ **Complete Business Package** (`VIBE_EMPIRE_PORTFOLIO_PACKAGE.md`)  
✅ **Dark Mode Design System** (CSS framework)  
✅ **Marketing Assets** (logos, social media assets)  
✅ **Generated Content** (automated content samples)  
✅ **Auto-redirect** (`index.html` → portfolio)

## 💡 Pro Tips

### 1. **Instant Sharing**
Once deployed, share the live URL with business partners:
- Professional presentation
- No downloads required
- Works on all devices
- Always up-to-date

### 2. **Custom Branding**
Set up `vibemarketing.ae` or `vibemarketing.com` for professional URLs

### 3. **Version Control**
Each deployment gets a unique URL - perfect for A/B testing different versions

### 4. **Analytics Ready**
Add Google Analytics to track visitor engagement on your portfolio

## 🛠️ Troubleshooting

### "VERCEL_TOKEN environment variable is required"
- Make sure you've added your token to the MCP config
- Restart Cursor after updating the config

### "Deployment failed"
- Check that your project files exist
- Ensure you have internet connection
- Verify your Vercel token is valid

### "Custom domain verification failed"
- Update your DNS records as instructed
- Wait 5-10 minutes for propagation
- Check domain spelling

## 🎪 Ready to Deploy?

Your Vibe Marketing Empire is now deployment-ready! 

**One command deploys everything:**
```
@vercel deploy_vibe_portfolio
```

**Share the live URL with your business network and watch the partnership requests pour in!** 🚀




