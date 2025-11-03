# OptiGenius Setup Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- OpenAI API key (for AI features)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- next-auth (authentication)
- jspdf (PDF export)
- bcryptjs (password hashing)
- openai (AI insights)
- cheerio (web scraping)

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables:

#### Required Variables

```env
# OpenAI API Key (Required for AI features)
OPENAI_API_KEY=sk-your-actual-openai-key

# NextAuth Secret (Required for authentication)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000
```

#### Optional Variables (for Google OAuth)

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

### 4. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it as your `OPENAI_API_KEY` value

**Note**: OpenAI API usage incurs costs. Monitor your usage at https://platform.openai.com/usage

### 5. (Optional) Set Up Google OAuth

If you want to enable Google Sign-In:

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Testing the Application

### Test Anonymous Access
1. Visit http://localhost:3000
2. Enter a URL (e.g., `https://example.com`)
3. View analysis results
4. Download PDF or Markdown report

### Test Authentication
1. Click "Register" in the navigation
2. Create an account with email and password
3. Sign in with your credentials
4. Analyze a URL
5. Click "Save Report"
6. Visit "History" to view saved reports

### Test Google OAuth (if configured)
1. Click "Sign In"
2. Click "Google" button
3. Authorize with your Google account
4. You should be signed in automatically

## Production Deployment

### Environment Variables for Production

Update these in your production environment:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
OPENAI_API_KEY=your-openai-key
```

For Google OAuth, add production redirect URI:
```
https://your-domain.com/api/auth/callback/google
```

### Database Migration (Recommended for Production)

The current implementation uses in-memory storage. For production:

1. Choose a database (PostgreSQL, MongoDB, etc.)
2. Replace `lib/auth-store.ts` with database queries
3. Set up Prisma or your preferred ORM
4. Add database connection string to environment variables

Example with Prisma:
```bash
npm install @prisma/client @next-auth/prisma-adapter
npx prisma init
```

### Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "Cannot find module 'next-auth'" errors
Run `npm install` to ensure all dependencies are installed.

### Authentication not working
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure `NEXTAUTH_URL` matches your application URL
- Check browser console for errors

### AI features not working
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI API quota and billing
- Review server logs for API errors

### PDF export not working
- Ensure `jspdf` is installed: `npm install jspdf`
- Check browser console for errors
- Try a different browser

### Google OAuth not working
- Verify redirect URI is correctly configured in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure OAuth consent screen is configured

## Development Tips

### Hot Reload
Next.js automatically reloads when you make changes to files.

### View Server Logs
Check the terminal where `npm run dev` is running for server-side errors.

### Clear Browser Cache
If you experience issues, clear browser cache and cookies.

### Reset In-Memory Data
Restart the development server to clear all in-memory users and reports.

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Implement rate limiting for API routes in production
- Add CSRF protection for sensitive operations
- Use HTTPS in production
- Regularly update dependencies for security patches

## Support

For issues or questions:
1. Check the documentation in `FEATURES.md`
2. Review the code comments
3. Check Next.js and NextAuth.js documentation
4. Review OpenAI API documentation
