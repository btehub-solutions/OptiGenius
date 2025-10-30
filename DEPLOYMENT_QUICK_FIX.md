# Quick Fix for Vercel Deployment Error

## What Was Wrong
Your `vercel.json` had invalid environment variable syntax (`@variable_name`). This syntax doesn't work in `vercel.json` - environment variables must be set in the Vercel dashboard instead.

## What I Fixed
✅ Updated `vercel.json` to remove invalid env syntax
✅ Simplified configuration (Vercel auto-detects Next.js)
✅ Updated `.vercelignore` to be less restrictive

## What You Need to Do Now

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### Step 2: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production, Preview, and Development**:

```
DATABASE_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb
DIRECT_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
OPENAI_API_KEY=sk-proj-xxx
```

### Step 3: Create Vercel Postgres Database

1. In Vercel Dashboard → **Storage** → **Create Database** → **Postgres**
2. Copy the connection strings and use them for `DATABASE_URL` and `DIRECT_URL`

### Step 4: Redeploy

**Option A:** In Vercel Dashboard → **Deployments** → Click ••• → **Redeploy**

**Option B:** Push any commit to trigger rebuild

### Step 5: Initialize Database

After successful deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull production env vars
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

## Verify It Works

- [ ] Build completes successfully (green checkmark in Vercel)
- [ ] Visit `https://your-app.vercel.app` - homepage loads
- [ ] Visit `https://your-app.vercel.app/auth/signin` - auth page loads
- [ ] Can sign in and use the app

## Still Having Issues?

Check the full guide: `VERCEL_FIX_GUIDE.md`

Common issues:
- **Missing env vars**: Double-check all 5 required variables are set
- **Database not initialized**: Run `prisma migrate deploy`
- **Wrong NEXTAUTH_URL**: Must match your production domain exactly
