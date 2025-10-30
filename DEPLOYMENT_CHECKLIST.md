# 📋 OptiGenius - Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

---

## ✅ Code Preparation

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] All TypeScript errors resolved (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] `.env` file is in `.gitignore`
- [ ] All sensitive data removed from code
- [ ] Database schema is finalized

---

## ✅ Git Repository

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible
- [ ] `.gitignore` properly configured
- [ ] No `.env` files committed
- [ ] All branches merged to main

---

## ✅ Environment Variables Ready

Prepare these values before deployment:

### Required
- [ ] `DATABASE_URL` - Will be provided by Vercel Postgres
- [ ] `DIRECT_URL` - Will be provided by Vercel Postgres
- [ ] `NEXTAUTH_URL` - Your production URL (e.g., `https://optigenius.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Optional (OAuth)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GITHUB_ID` - From GitHub Developer Settings
- [ ] `GITHUB_SECRET` - From GitHub Developer Settings

---

## ✅ Vercel Account Setup

- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Git provider connected (GitHub/GitLab/Bitbucket)
- [ ] Payment method added (if needed for Pro features)

---

## ✅ Database Setup

- [ ] Prisma schema updated for PostgreSQL
- [ ] Database migrations ready
- [ ] Test data prepared (if needed)

---

## ✅ OAuth Setup (If Using)

### Google OAuth
- [ ] Project created in [Google Cloud Console](https://console.cloud.google.com/)
- [ ] OAuth consent screen configured
- [ ] Credentials created (OAuth 2.0 Client ID)
- [ ] Authorized redirect URIs added:
  - `https://your-domain.vercel.app/api/auth/callback/google`
- [ ] Client ID and Secret saved

### GitHub OAuth
- [ ] OAuth App created in [GitHub Settings](https://github.com/settings/developers)
- [ ] Authorization callback URL set:
  - `https://your-domain.vercel.app/api/auth/callback/github`
- [ ] Client ID and Secret saved

---

## ✅ API Keys & Services

- [ ] OpenAI API key obtained
- [ ] OpenAI account has credits
- [ ] API key tested locally
- [ ] Rate limits understood

---

## ✅ Domain (Optional)

- [ ] Custom domain purchased (if using)
- [ ] DNS access available
- [ ] Domain registrar login ready

---

## 🚀 Deployment Steps

Once all items above are checked:

1. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository

2. **Create Postgres Database**
   - Storage → Create Database → Postgres
   - Note the connection strings

3. **Set Environment Variables**
   - Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   - Vercel will auto-deploy
   - Monitor build logs

5. **Run Migrations**
   ```bash
   vercel env pull .env.production
   npx prisma db push
   ```

6. **Test Production**
   - Visit your URL
   - Test all features
   - Check for errors

---

## ✅ Post-Deployment

- [ ] Production URL accessible
- [ ] User registration works
- [ ] User login works
- [ ] SEO analysis works
- [ ] GEO analysis works
- [ ] AI insights work (with OpenAI key)
- [ ] PDF export works
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Database connections stable
- [ ] OAuth providers work (if configured)

---

## 📊 Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Database monitoring active
- [ ] OpenAI usage tracking enabled

---

## 🔒 Security Review

- [ ] All secrets in environment variables
- [ ] No API keys in code
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting considered
- [ ] Input validation in place

---

## 📝 Documentation

- [ ] README.md updated
- [ ] VERCEL_DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented

---

## 🎉 Ready to Deploy!

If all items are checked, you're ready to deploy OptiGenius to Vercel!

Follow the detailed guide in [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🆘 Need Help?

- **Deployment Guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

**Last Updated:** Ready for deployment
**Version:** 1.0.0
