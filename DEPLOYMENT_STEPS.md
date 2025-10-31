# 🚀 OptiGenius - Vercel Deployment Steps

## ✅ What Was Fixed

1. **Syntax Error** - Fixed SWC compiler error in `app/results/page.tsx`
2. **Build Script** - Added `postinstall` script to `package.json`

## 📋 Step-by-Step Deployment Guide

### Step 1: Push Fixed Code to GitHub

```bash
git add .
git commit -m "Fix: Resolve build errors for Vercel deployment"
git push origin main
```

### Step 2: Configure Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **Database**
4. Scroll down to **Connection String**
5. Copy both connection strings:
   - **Connection Pooling** (for DATABASE_URL) - includes `?pgbouncer=true`
   - **Direct Connection** (for DIRECT_URL)
6. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Set Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your OptiGenius project
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

#### Required Variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `DATABASE_URL` | `postgresql://...?pgbouncer=true` | Supabase Connection Pooling string |
| `DIRECT_URL` | `postgresql://...` | Supabase Direct Connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | Generate with command below | See below |
| `OPENAI_API_KEY` | `sk-proj-...` | https://platform.openai.com/api-keys |

#### Generate NEXTAUTH_SECRET:

**Windows PowerShell:**
```powershell
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 2: Online generator
# Visit: https://generate-secret.vercel.app/32
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

#### Optional OAuth Variables (for Google/GitHub login):

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID | https://console.cloud.google.com/ |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | https://console.cloud.google.com/ |
| `GITHUB_ID` | Your GitHub Client ID | https://github.com/settings/developers |
| `GITHUB_SECRET` | Your GitHub Client Secret | https://github.com/settings/developers |

**Important:** Set these variables for **Production**, **Preview**, and **Development** environments!

### Step 4: Initialize Database Schema

After setting environment variables, you need to push the Prisma schema to Supabase:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push

# Verify
npx prisma studio
```

**Option B: Manual Setup**
1. Create `.env.local` file in your project root
2. Copy all environment variables from Vercel
3. Run: `npx prisma db push`
4. Run: `npx prisma generate`

### Step 5: Deploy

**Automatic Deployment:**
- Vercel will automatically deploy when you push to GitHub
- Check the deployment status in your Vercel dashboard

**Manual Deployment:**
1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on the latest deployment
4. **IMPORTANT:** Uncheck "Use existing Build Cache"
5. Click **Redeploy**

### Step 6: Verify Deployment

1. Wait for deployment to complete (usually 2-3 minutes)
2. Click **Visit** to open your deployed app
3. Test the following:
   - ✅ Home page loads
   - ✅ Enter a URL and click "Analyze Website"
   - ✅ Results page displays correctly
   - ✅ Sign up/Sign in works
   - ✅ Dashboard shows saved reports (if logged in)

## 🔍 Troubleshooting

### Build Fails with "Prisma Client not found"
**Solution:**
- Verify `postinstall` script exists in `package.json`
- Check that environment variables are set
- Clear build cache and redeploy

### Database Connection Error
**Solution:**
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase database is active
- Ensure password in connection string is correct
- Verify no special characters need URL encoding

### "NEXTAUTH_SECRET is not set" Error
**Solution:**
- Generate a new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Add it to Vercel environment variables
- Redeploy

### 404 on API Routes
**Solution:**
- Verify `NEXTAUTH_URL` matches your Vercel deployment URL
- Check that all environment variables are set for Production
- Redeploy

## 📊 Deployment Checklist

- [ ] Fixed code pushed to GitHub
- [ ] Supabase database created
- [ ] All environment variables set in Vercel
- [ ] Database schema pushed with Prisma
- [ ] Deployment successful
- [ ] Home page loads
- [ ] Website analysis works
- [ ] Authentication works
- [ ] Dashboard accessible

## 🎉 Success!

Once all steps are complete, your OptiGenius app should be live at:
`https://your-app-name.vercel.app`

## 📞 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure Supabase database is accessible
4. Check that Prisma schema was pushed successfully

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- OpenAI API Keys: https://platform.openai.com/api-keys
- Generate Secret: https://generate-secret.vercel.app/32
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
