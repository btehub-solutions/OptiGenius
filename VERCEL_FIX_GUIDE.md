# Vercel Deployment Fix Guide

## Problem
Your deployment is failing because of incorrect `vercel.json` configuration. The `@variable_name` syntax is not valid in `vercel.json`.

## Solution Applied
✅ Fixed `vercel.json` to remove invalid environment variable syntax

## Step-by-Step Deployment Instructions

### 1. Push the Fixed Configuration to GitHub
```bash
git add vercel.json
git commit -m "Fix vercel.json configuration"
git push origin main
```

### 2. Set Up Environment Variables in Vercel Dashboard

Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### Required Variables (All Environments: Production, Preview, Development)

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `DATABASE_URL` | `postgres://...` | Vercel Postgres Dashboard (Postgres Pooled Connection) |
| `DIRECT_URL` | `postgres://...` | Vercel Postgres Dashboard (Postgres Direct Connection) |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Your Vercel production URL |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | Run this command in terminal |
| `OPENAI_API_KEY` | `sk-...` | https://platform.openai.com/api-keys |

#### Optional OAuth Variables (if using Google/GitHub login)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

### 3. Set Up Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it (e.g., "optigenius-db")
5. Select region (same as your deployment region)
6. Click **Create**
7. Copy the connection strings:
   - **Postgres Pooled Connection** → Use for `DATABASE_URL`
   - **Postgres Direct Connection** → Use for `DIRECT_URL`

### 4. Trigger a New Deployment

After setting environment variables:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" (optional)
5. Click **Redeploy**

**Option B: Push a new commit**
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

### 5. Run Database Migrations

After successful deployment, you need to initialize your database:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

**Option B: Using Vercel Dashboard**
1. Go to **Settings** → **Functions**
2. Add a build command override: `prisma migrate deploy && prisma generate && next build`

### 6. Verify Deployment

Check these URLs:
- ✅ Homepage: `https://your-domain.vercel.app`
- ✅ API Health: `https://your-domain.vercel.app/api/health`
- ✅ Auth: `https://your-domain.vercel.app/auth/signin`

## Common Issues & Solutions

### Issue: "Module not found: Can't resolve '@prisma/client'"
**Solution:** Ensure `postinstall` script is in `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Issue: "Database connection error"
**Solution:** 
- Verify `DATABASE_URL` and `DIRECT_URL` are set correctly
- Ensure database is in the same region as deployment
- Run `prisma migrate deploy` to initialize schema

### Issue: "NEXTAUTH_URL not configured"
**Solution:**
- Set `NEXTAUTH_URL` to your production domain (e.g., `https://optigenius.vercel.app`)
- Don't include trailing slash

### Issue: Build succeeds but site shows 404
**Solution:**
- Check that `app/page.tsx` exists
- Verify Next.js App Router structure is correct
- Clear Vercel build cache and redeploy

## Checklist

- [ ] Fixed `vercel.json` committed and pushed to GitHub
- [ ] Vercel Postgres database created
- [ ] All environment variables set in Vercel dashboard
- [ ] Database migrations run (`prisma migrate deploy`)
- [ ] Deployment successful (green checkmark in Vercel)
- [ ] Production domain accessible
- [ ] Authentication working
- [ ] API routes responding

## Next Steps After Successful Deployment

1. **Set up custom domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain

2. **Configure production OAuth** (if using)
   - Update Google/GitHub OAuth redirect URIs to include production domain

3. **Monitor logs**
   - Go to Deployments → Click on deployment → View Function Logs

4. **Set up monitoring** (optional)
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, etc.)

## Support

If you continue to have issues:
1. Check Vercel deployment logs: Deployments → [Your Deployment] → Building
2. Check function logs: Deployments → [Your Deployment] → Functions
3. Verify all environment variables are set correctly
4. Ensure GitHub repository has all necessary files committed
