# 🚀 BizFlow Vercel Deployment Commands

## Quick Deploy (Copy & Paste These Commands)

```bash
# 1. Navigate to project directory
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.superdesign/design_iterations"

# 2. Login to Vercel (will open browser)
npx vercel login

# 3. Deploy to Vercel
npx vercel --name bizflow-marketing-site

# 4. Follow the prompts:
#    - Set up and deploy? Y
#    - Which scope? (choose your account)
#    - Link to existing project? N
#    - What's your project's name? bizflow-marketing-site
#    - In which directory is your code located? ./
#    - Want to modify settings? N

# 5. Deploy to production
npx vercel --prod --name bizflow-marketing-site
```

## Alternative: One-Line Deploy

```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.superdesign/design_iterations" && npx vercel --name bizflow-marketing-site --yes
```

## After Deployment

1. **Set Environment Variables** in Vercel Dashboard:
   - Go to: vercel.com/dashboard
   - Select your project: bizflow-marketing-site
   - Go to: Settings > Environment Variables
   - Add essential variables from `.env.example`

2. **Add Custom Domain** (optional):
   ```bash
   npx vercel domains add yourdomain.com
   ```

## Expected Output
- Preview URL: `https://bizflow-marketing-site-xxxxx.vercel.app`
- Production URL: `https://bizflow-marketing-site.vercel.app`

## Files Ready for Deployment
✅ HTML: bizflow_enhanced_2.html (32KB)
✅ CSS: bizflow_theme_1.css (6KB) 
✅ JS: ai_content_optimizer.js (20KB)
✅ Config: vercel.json
✅ API Routes: /api/analytics.js, /api/optimize.js

Your BizFlow marketing site is ready to go live! 🎉