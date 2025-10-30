# Deploy OptiGenius to Vercel - Final Steps

## ✅ Issues Fixed

1. ✅ **Invalid `vercel.json` env syntax** - Removed
2. ✅ **Prisma build error** - Moved `prisma generate` from postinstall to build script
3. ✅ **Configuration optimized** - Simplified for Vercel deployment

## 🚀 Deploy Now - 3 Steps

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Fix Vercel deployment - Prisma and config updates"
git push origin main
```

### Step 2: Set Environment Variables in Vercel

**CRITICAL:** You MUST set these in Vercel Dashboard before deployment works!

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Click **Add New** for each variable below (select all environments: Production, Preview, Development):

| Variable | Value | How to Get |
|----------|-------|------------|
| `DATABASE_URL` | `postgres://...` | Vercel Storage → Postgres → **Postgres Pooled Connection** |
| `DIRECT_URL` | `postgres://...` | Vercel Storage → Postgres → **Postgres Direct Connection** |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel production URL |
| `NEXTAUTH_SECRET` | `[random string]` | Run: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | `sk-proj-...` | https://platform.openai.com/api-keys |

#### Don't Have a Postgres Database Yet?

1. Go to **Vercel Dashboard → Storage**
2. Click **Create Database**
3. Select **Postgres**
4. Name it: `optigenius-db`
5. Select region: **Washington D.C. (iad1)** (same as your deployment)
6. Click **Create**
7. Copy the connection strings and use them for `DATABASE_URL` and `DIRECT_URL`

### Step 3: Trigger Deployment

After pushing to GitHub and setting env vars, Vercel will automatically deploy.

**Or manually trigger:**
1. Go to **Deployments** tab in Vercel
2. Click the **•••** menu on the latest deployment
3. Click **Redeploy**

## 📊 Monitor the Build

Watch the build logs in Vercel. You should see:

```
✓ Cloning repository
✓ Installing dependencies (npm install)
✓ Running build command (npm run build)
  → prisma generate ✓
  → next build ✓
✓ Build completed successfully
✓ Deploying to production
```

## ✅ Verify Deployment

Once deployed, test these URLs:

- [ ] Homepage: `https://your-app.vercel.app`
- [ ] Sign In: `https://your-app.vercel.app/auth/signin`
- [ ] Dashboard: `https://your-app.vercel.app/dashboard` (after login)

## 🔧 Initialize Database (After First Successful Deploy)

Your database needs to be initialized with the schema:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull production environment variables
vercel env pull .env.production

# Run database migrations
npx prisma migrate deploy
```

**Alternative:** Use Vercel Postgres Query Editor
1. Go to **Storage → Your Database → Query**
2. Run the SQL from your migration files

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] All 5 environment variables set in Vercel
- [ ] Postgres database created in Vercel
- [ ] Deployment completed successfully (green checkmark)
- [ ] Homepage loads without errors
- [ ] Can sign in successfully
- [ ] Database migrations applied
- [ ] App is fully functional

## ❌ Troubleshooting

### Build still fails with Prisma error?
- Verify `DATABASE_URL` and `DIRECT_URL` are set correctly
- Check they're set for all environments (Production, Preview, Development)
- Ensure no typos in variable names

### "NEXTAUTH_URL not configured"?
- Set `NEXTAUTH_URL` to your exact production domain
- No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`

### Database connection errors?
- Verify database is in the same region as deployment (iad1)
- Check connection strings are correct
- Ensure database is not paused (Vercel free tier)

### Build succeeds but app shows errors?
- Run database migrations: `npx prisma migrate deploy`
- Check function logs in Vercel Dashboard

## 📚 Additional Resources

- `PRISMA_BUILD_FIX.md` - Details on the Prisma fix
- `VERCEL_FIX_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_QUICK_FIX.md` - Quick reference

## 🆘 Need Help?

Check Vercel logs:
1. **Build logs**: Deployments → [Your Deployment] → Building
2. **Function logs**: Deployments → [Your Deployment] → Functions
3. **Runtime logs**: Deployments → [Your Deployment] → Runtime Logs
