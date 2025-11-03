# OptiGenius - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

You need to enable PowerShell scripts first. Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:

```bash
npm install
```

### Step 2: Set Up Environment Variables

Copy the example file:

```bash
copy .env.example .env.local
```

Edit `.env.local` and add these required values:

```env
# Required: Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here

# Required: Generate with PowerShell command below
NEXTAUTH_SECRET=your-generated-secret

# Required: Your local URL
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET** (run in PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and paste it as your `NEXTAUTH_SECRET`.

### Step 3: Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Testing the Features

### Test 1: Anonymous Analysis (No Sign-In Required)
1. Go to http://localhost:3000
2. Enter a URL: `https://example.com`
3. Click "Analyze"
4. View SEO and GEO results
5. Click "PDF Report" or "Markdown" to download

### Test 2: User Registration
1. Click "Register" in the navigation
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"
4. You'll be automatically signed in

### Test 3: Save Reports
1. After signing in, analyze a URL
2. Click "Save Report" button
3. See success message
4. Click "History" in navigation
5. View your saved report

### Test 4: Export Reports
1. On results page, click "PDF Report"
2. PDF downloads automatically
3. Click "Markdown" 
4. Markdown file downloads

### Test 5: Sign Out and Sign In
1. Click "Sign Out"
2. Click "Sign In"
3. Enter your credentials
4. You're back in!

## 🎯 What Works Without Sign-In

✅ Analyze any URL
✅ View SEO scores
✅ View GEO analysis
✅ Download PDF reports
✅ Download Markdown reports

## 🔐 What Requires Sign-In

🔒 Save reports
🔒 View history
🔒 Delete saved reports

## 🐛 Troubleshooting

### "Cannot find module 'next-auth'" error
Run: `npm install`

### "Invalid API key" error
Check your `OPENAI_API_KEY` in `.env.local`

### "Authentication error"
Make sure `NEXTAUTH_SECRET` is set in `.env.local`

### PowerShell execution policy error
Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port 3000 already in use
Change the port:
```bash
npm run dev -- -p 3001
```

## 📚 Optional: Google OAuth Setup

If you want Google Sign-In (optional):

1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 🎉 You're All Set!

Your OptiGenius application is now running with:
- ✅ SEO Analysis
- ✅ GEO Analysis
- ✅ PDF/Markdown Export
- ✅ User Authentication
- ✅ Report Saving
- ✅ History Tracking

## 📖 More Information

- **Features**: See `FEATURES.md`
- **Detailed Setup**: See `SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## 🚀 Deploy to Production

When ready to deploy:

1. Update `.env` on your hosting platform
2. Set `NEXTAUTH_URL` to your production domain
3. Generate a new `NEXTAUTH_SECRET` for production
4. Consider adding a database (see `SETUP.md`)

Happy analyzing! 🎊
