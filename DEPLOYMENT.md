# Vercel Deployment Checklist

## Pre-Deployment Checklist

- [x] All dependencies installed and listed in `package.json`
- [x] Build command configured: `npm run build`
- [x] Next.js configuration optimized for production
- [x] Environment variables documented in `.env.example`
- [x] `.gitignore` and `.vercelignore` configured
- [x] SEO metadata added to layout
- [x] `robots.txt` and sitemap configured
- [x] API routes tested locally

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Prepare Your Repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "Import Project"
   - Select your `OptiGenius` repository

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Click "Environment Variables"
   - Add any required variables (none needed for basic setup)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # For preview deployment
   vercel
   
   # For production deployment
   vercel --prod
   ```

## Post-Deployment

### 1. Test Your Deployment
- [ ] Visit your production URL
- [ ] Test the homepage loads correctly
- [ ] Enter a URL and test the analysis feature
- [ ] Check the results page displays properly
- [ ] Verify API route works: `https://your-domain.vercel.app/api/analyze?url=example.com`

### 2. Update URLs
- [ ] Update `robots.txt` with your actual domain
- [ ] Update sitemap base URL in `app/sitemap.ts`
- [ ] Add `NEXT_PUBLIC_BASE_URL` environment variable in Vercel dashboard

### 3. Configure Custom Domain (Optional)
- Go to your project settings in Vercel
- Click "Domains"
- Add your custom domain
- Follow DNS configuration instructions

### 4. Set Up Analytics (Optional)
- Enable Vercel Analytics in project settings
- Add Vercel Speed Insights for performance monitoring

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### API Routes Not Working
- Verify API route files are in `app/api/` directory
- Check that `runtime = "nodejs"` is set in route files
- Review function logs in Vercel dashboard

### Environment Variables
- Ensure variables are set in Vercel project settings
- Redeploy after adding new environment variables

## Performance Optimization

- [x] React Strict Mode enabled
- [x] Compression enabled
- [x] Image optimization configured
- [x] Metadata optimized for SEO

## Security

- [x] `poweredByHeader` disabled
- [x] Environment variables not committed to git
- [x] API routes validate input

## Monitoring

After deployment, monitor:
- Build times
- Function execution times
- Error rates
- Traffic patterns

Access these in the Vercel dashboard under your project's Analytics and Logs sections.
