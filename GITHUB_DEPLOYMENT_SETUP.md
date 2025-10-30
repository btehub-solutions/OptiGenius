# 🚀 GitHub & Vercel Deployment Setup Guide

## ✅ Pre-Deployment Checklist

### 1. GitHub Repository Status
- ✅ Repository: `https://github.com/btehub-solutions/OptiGenius.git`
- ✅ Branch: `main`
- ✅ Git initialized and connected

### 2. Required Files (All Present ✅)
- ✅ `.gitignore` - Properly configured
- ✅ `.env.example` - Template for environment variables
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Deployment optimization
- ✅ `package.json` - Dependencies and scripts
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `README.md` - Project documentation

---

## 📋 Step-by-Step Deployment Process

### Step 1: Push Latest Changes to GitHub

```bash
# Add any untracked files you want to keep
git add .

# Commit all changes
git commit -m "Prepare for production deployment"

# Push to GitHub
git push origin main
```

### Step 2: Set Up Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 3: Import Project from GitHub

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select **"btehub-solutions/OptiGenius"**
3. Click **"Import"**

### Step 4: Configure Project Settings

#### Framework Preset
- **Framework**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `prisma generate && next build` (auto-configured)
- **Output Directory**: `.next` (auto-configured)

#### Environment Variables (CRITICAL!)

Click **"Environment Variables"** and add the following:

##### Required Variables:

1. **DATABASE_URL** (from Vercel Postgres)
   ```
   postgres://...
   ```

2. **DIRECT_URL** (from Vercel Postgres)
   ```
   postgres://...
   ```

3. **NEXTAUTH_URL** (your production domain)
   ```
   https://your-app-name.vercel.app
   ```

4. **NEXTAUTH_SECRET** (generate new secret)
   ```bash
   # Run this command to generate:
   openssl rand -base64 32
   ```
   Then paste the output

5. **OPENAI_API_KEY** (from OpenAI)
   ```
   sk-...
   ```

##### Optional OAuth Variables (for Google/GitHub login):

6. **GOOGLE_CLIENT_ID** (optional)
7. **GOOGLE_CLIENT_SECRET** (optional)
8. **GITHUB_ID** (optional)
9. **GITHUB_SECRET** (optional)

### Step 5: Set Up Vercel Postgres Database

1. In your Vercel project, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a region (closest to your users)
5. Click **"Create"**
6. Go to **".env.local"** tab
7. Copy **"DATABASE_URL"** and **"POSTGRES_URL_NON_POOLING"** (use as DIRECT_URL)
8. Paste these into your project's Environment Variables

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Run database migrations

### Step 7: Verify Deployment

1. Click on the deployment URL (e.g., `https://optigenius.vercel.app`)
2. Test key features:
   - ✅ Homepage loads
   - ✅ Sign up/Login works
   - ✅ Dashboard accessible
   - ✅ SEO/GEO analysis works
   - ✅ AI chat functions (for authenticated users)
   - ✅ Export features work
   - ✅ Dark/Light mode toggle

---

## 🔑 Environment Variables Reference

### How to Get Each Variable:

#### 1. DATABASE_URL & DIRECT_URL
- **Source**: Vercel Postgres (created in Step 5)
- **Location**: Vercel Dashboard → Your Project → Storage → Postgres → .env.local tab
- **Format**: 
  - `DATABASE_URL`: Pooled connection (postgres://...)
  - `DIRECT_URL`: Non-pooled connection (postgres://...)

#### 2. NEXTAUTH_URL
- **Source**: Your Vercel deployment URL
- **Format**: `https://your-app-name.vercel.app`
- **Note**: Update this after first deployment if using custom domain

#### 3. NEXTAUTH_SECRET
- **Source**: Generate yourself
- **Command**: `openssl rand -base64 32`
- **Windows Alternative**: Use [this generator](https://generate-secret.vercel.app/32)
- **Format**: Random 32-character base64 string

#### 4. OPENAI_API_KEY
- **Source**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Steps**:
  1. Create account at OpenAI
  2. Go to API Keys section
  3. Click "Create new secret key"
  4. Copy the key (starts with `sk-`)
- **Format**: `sk-...`

#### 5. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (Optional)
- **Source**: [Google Cloud Console](https://console.cloud.google.com/)
- **Steps**:
  1. Create new project
  2. Enable Google+ API
  3. Create OAuth 2.0 credentials
  4. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

#### 6. GITHUB_ID & GITHUB_SECRET (Optional)
- **Source**: [GitHub Developer Settings](https://github.com/settings/developers)
- **Steps**:
  1. Click "New OAuth App"
  2. Set Homepage URL: `https://your-app.vercel.app`
  3. Set Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
  4. Copy Client ID and generate Client Secret

---

## 🔧 Post-Deployment Configuration

### Update NEXTAUTH_URL (if needed)

If you're using a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update **NEXTAUTH_URL** environment variable to your custom domain
4. Redeploy the project

### Database Migrations

Vercel automatically runs migrations on deployment, but if you need to manually migrate:

```bash
# In your local environment
npx prisma migrate deploy
```

### Monitor Deployment

1. **Logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → Function Logs
2. **Analytics**: Vercel Dashboard → Your Project → Analytics
3. **Performance**: Vercel Dashboard → Your Project → Speed Insights

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Prisma Client not generated`
- **Solution**: Ensure `postinstall` script in package.json: `"postinstall": "prisma generate"`

**Error**: `DATABASE_URL not found`
- **Solution**: Add DATABASE_URL in Vercel Environment Variables

### Runtime Errors

**Error**: `NextAuth configuration error`
- **Solution**: Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly

**Error**: `OpenAI API error`
- **Solution**: Check OPENAI_API_KEY is valid and has credits

### Database Connection Issues

**Error**: `Can't reach database server`
- **Solution**: 
  1. Verify DATABASE_URL is correct
  2. Check Vercel Postgres is in same region
  3. Ensure DIRECT_URL is set for migrations

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to GitHub
- [ ] `.env` file is NOT in repository (check .gitignore)
- [ ] `.env.example` is up to date
- [ ] All dependencies are in package.json
- [ ] Prisma schema is finalized
- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables are ready
- [ ] OpenAI API key has credits
- [ ] Database backup strategy in place (if migrating)

---

## 🎯 Quick Deploy Commands

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Generate NEXTAUTH_SECRET (copy output)
openssl rand -base64 32

# 3. Test build locally (optional)
npm run build
npm start
```

---

## 🌐 Your Deployment URLs

- **GitHub Repository**: https://github.com/btehub-solutions/OptiGenius
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production URL**: Will be `https://optigenius.vercel.app` (or custom domain)

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma with Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **NextAuth.js**: https://next-auth.js.org/deployment

---

## ✅ Ready to Deploy!

Your OptiGenius application is fully configured and ready for production deployment. Follow the steps above to deploy to Vercel.

**Estimated deployment time**: 5-10 minutes

Good luck! 🚀
