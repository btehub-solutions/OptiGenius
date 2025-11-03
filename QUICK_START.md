# Quick Start Guide - Deploy to Vercel in 5 Minutes

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- Your code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Push to GitHub (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - OptiGenius SEO Analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/OptiGenius.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to vercel.com/new
2. Click "Import Git Repository"
3. Select your OptiGenius repository
4. Click "Import"
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Wait 2-3 minutes

### 3. Your App is Live!
- Vercel will provide a URL like: https://optigenius.vercel.app
- Test it by entering any website URL

## Post-Deployment (Optional)

### Update Your Domain in Configuration
After deployment, update these files with your actual Vercel URL:

1. Update public/robots.txt with your actual domain
2. Add Environment Variable in Vercel Dashboard:
   - Settings > Environment Variables
   - Add: NEXT_PUBLIC_BASE_URL = https://your-actual-domain.vercel.app
   - Redeploy

### Custom Domain (Optional)
1. Go to your project in Vercel
2. Settings > Domains
3. Add your custom domain
4. Follow DNS instructions

## Testing Your Deployment
- Visit your homepage
- Enter a test URL (e.g., example.com)
- Verify results display correctly
- Check API endpoint: /api/analyze?url=example.com

## Need Help?
See DEPLOYMENT.md for detailed troubleshooting and configuration options.
