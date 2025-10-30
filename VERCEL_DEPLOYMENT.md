# 🚀 OptiGenius - Vercel Deployment Guide

Complete step-by-step guide to deploy OptiGenius to Vercel with PostgreSQL database.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A [Vercel account](https://vercel.com/signup) (free tier works)
- ✅ [Vercel CLI](https://vercel.com/docs/cli) installed (optional but recommended)
- ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ An [OpenAI API key](https://platform.openai.com/api-keys) for AI insights

---

## 🎯 Deployment Steps

### Step 1: Push Your Code to Git

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for Vercel deployment"

# Push to your repository (GitHub example)
git remote add origin https://github.com/yourusername/optigenius.git
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANT:** Make sure `.env` is in your `.gitignore` to prevent exposing secrets!

---

### Step 2: Import Project to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your OptiGenius repository
4. Click **"Import"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

---

### Step 3: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

### Step 4: Set Up Vercel Postgres Database

1. In your Vercel project dashboard, go to the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a database name (e.g., `optigenius-db`)
5. Select a region (choose closest to your users)
6. Click **"Create"**

**Vercel will automatically add these environment variables:**
- `POSTGRES_URL` (pooled connection)
- `POSTGRES_URL_NON_POOLING` (direct connection)
- `POSTGRES_PRISMA_URL` (for Prisma migrations)
- `POSTGRES_URL_NO_SSL`

---

### Step 5: Configure Environment Variables

Go to **Settings → Environment Variables** in your Vercel project and add:

#### Required Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Use `POSTGRES_PRISMA_URL` | Copy from Vercel Postgres |
| `DIRECT_URL` | Use `POSTGRES_URL_NON_POOLING` | Copy from Vercel Postgres |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |
| `NEXTAUTH_SECRET` | Generate new secret | See below |
| `OPENAI_API_KEY` | `sk-...` | From OpenAI dashboard |

#### Optional Variables (OAuth)

| Variable | Value | Notes |
|----------|-------|-------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth secret | Optional |
| `GITHUB_ID` | Your GitHub OAuth ID | Optional |
| `GITHUB_SECRET` | Your GitHub OAuth secret | Optional |

#### Generate NEXTAUTH_SECRET

Run this command locally:

```bash
openssl rand -base64 32
```

Or use this online: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

---

### Step 6: Run Database Migrations

After setting up environment variables:

#### Option A: Via Vercel CLI (Recommended)

```bash
# Pull environment variables locally
vercel env pull .env.production

# Run Prisma migrations
npx prisma migrate deploy

# Or use Prisma db push for first deployment
npx prisma db push
```

#### Option B: Via Vercel Dashboard

1. Go to **Settings → Environment Variables**
2. Copy `DATABASE_URL` and `DIRECT_URL` values
3. Add them to a temporary `.env.production` file locally
4. Run: `npx prisma db push`
5. Delete the temporary file

---

### Step 7: Deploy!

#### Automatic Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

#### Manual Deployment

```bash
vercel --prod
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Visit your production URL (e.g., `https://optigenius.vercel.app`)
- [ ] Test user registration and login
- [ ] Test SEO/GEO analysis functionality
- [ ] Test AI insights (requires OpenAI API key)
- [ ] Test dark/light mode toggle
- [ ] Test PDF export functionality
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## 🔧 Common Issues & Solutions

### Issue: "Prisma Client not found"

**Solution:** Ensure `postinstall` script is in `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Issue: Database connection errors

**Solution:** 
1. Verify `DATABASE_URL` and `DIRECT_URL` are set correctly
2. Check that Vercel Postgres database is active
3. Run `npx prisma db push` to sync schema

### Issue: NextAuth errors

**Solution:**
1. Ensure `NEXTAUTH_URL` matches your production domain
2. Verify `NEXTAUTH_SECRET` is set and unique
3. For OAuth: Update redirect URLs in Google/GitHub settings

### Issue: AI insights not working

**Solution:**
1. Verify `OPENAI_API_KEY` is set correctly
2. Check OpenAI API key has credits
3. Ensure users are authenticated (AI features require login)

### Issue: Build fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test
4. Check TypeScript errors: `npm run lint`

---

## 🔄 Updating Your Deployment

### Update Code

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel automatically redeploys on push.

### Update Environment Variables

1. Go to Vercel dashboard → Settings → Environment Variables
2. Update the variable
3. Redeploy: **Deployments → ⋯ → Redeploy**

### Update Database Schema

```bash
# Make changes to prisma/schema.prisma
# Then run:
npx prisma migrate dev --name your_migration_name

# Push to production
git add .
git commit -m "Update database schema"
git push origin main

# Apply migration to production database
vercel env pull .env.production
npx prisma migrate deploy
```

---

## 📊 Monitoring & Analytics

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Performance Monitoring

- Go to **Analytics** tab in Vercel dashboard
- Monitor Web Vitals, page views, and performance metrics

### Database Monitoring

- Go to **Storage** tab in Vercel dashboard
- View connection stats, query performance, and usage

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -base64 32`
3. **Rotate API keys regularly** - Update in Vercel dashboard
4. **Enable HTTPS only** - Vercel does this automatically
5. **Set up OAuth properly** - Use production redirect URLs
6. **Monitor usage** - Check Vercel and OpenAI dashboards

---

## 💰 Cost Considerations

### Vercel Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Edge Network (CDN)

### Vercel Postgres Free Tier:
- ✅ 256 MB storage
- ✅ 60 hours compute/month
- ✅ Suitable for small to medium projects

### OpenAI API Costs:
- GPT-4o-mini: ~$0.15 per 1M input tokens
- Monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings → Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `optigenius.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Update Environment Variables

After adding custom domain:

1. Update `NEXTAUTH_URL` to your custom domain
2. Update OAuth redirect URLs in Google/GitHub
3. Redeploy the application

---

## 🆘 Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Documentation:** [prisma.io/docs](https://www.prisma.io/docs)
- **NextAuth.js Documentation:** [next-auth.js.org](https://next-auth.js.org)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

## 🎉 Success!

Your OptiGenius application is now live on Vercel! 

**Next Steps:**
1. Share your app URL with users
2. Monitor performance and usage
3. Gather user feedback
4. Iterate and improve

**Your Production URL:** `https://your-app.vercel.app`

---

## 📝 Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs --follow

# Pull environment variables
vercel env pull

# Run database migrations
npx prisma migrate deploy

# View deployment info
vercel inspect

# List all deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

---

**Happy Deploying! 🚀**

For questions or issues, check the Vercel dashboard logs or open an issue in your repository.
