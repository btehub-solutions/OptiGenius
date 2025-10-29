# Authentication Setup Guide

This guide explains how to set up the hybrid authentication system in OptiGenius.

## Features

- **Anonymous Access**: Users can analyze URLs without signing in
- **Email/Password Authentication**: Traditional credentials-based login
- **OAuth Providers**: Sign in with Google or GitHub
- **Protected Features**: AI insights, saved reports, and analysis history for authenticated users

## Prerequisites

1. PostgreSQL database
2. Node.js and npm installed
3. (Optional) Google OAuth credentials
4. (Optional) GitHub OAuth credentials

## Setup Steps

### 1. Database Setup

Install and start PostgreSQL, then create a database:

```bash
createdb optigenius
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/optigenius"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional - for AI insights (authenticated users only)
OPENAI_API_KEY="your-openai-api-key"

# Optional - for OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3. Database Migration

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 4. OAuth Setup (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### 5. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## User Flows

### Anonymous Users

- Can analyze any URL without signing in
- See basic SEO analysis and GEO metrics
- Cannot access AI insights
- Cannot save reports or view history

### Authenticated Users

- All anonymous features
- **AI-powered insights and suggestions** (requires OPENAI_API_KEY)
- Save analysis reports
- View analysis history in dashboard
- Delete saved reports

## API Routes

### Public Routes

- `GET /api/analyze?url=<url>` - Analyze URL (anonymous or authenticated)

### Protected Routes (require authentication)

- `POST /api/reports` - Save a report
- `GET /api/reports` - Get user's saved reports
- `GET /api/reports/[id]` - Get specific report
- `DELETE /api/reports/[id]` - Delete a report

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

## Pages

- `/` - Home page (public)
- `/results` - Analysis results (public)
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/dashboard` - User dashboard (protected)

## Database Schema

### User
- id, name, email, password, image
- Relations: accounts, sessions, reports

### Account
- OAuth account information
- Relation: user

### Session
- User session data
- Relation: user

### Report
- Saved SEO analysis reports
- Fields: url, score, data (JSON)
- Relation: user

## Security Features

- Passwords hashed with bcryptjs
- JWT-based sessions
- CSRF protection via NextAuth.js
- Secure HTTP-only cookies
- Protected API routes with session validation

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and DATABASE_URL is correct:

```bash
psql -d optigenius -c "SELECT 1"
```

### Prisma Client Issues

Regenerate Prisma Client:

```bash
npx prisma generate
```

### OAuth Redirect Issues

Ensure callback URLs match exactly in OAuth provider settings and `.env`

### Session Issues

Clear browser cookies and restart the dev server

## Production Deployment

1. Set `NEXTAUTH_URL` to your production domain
2. Use a strong `NEXTAUTH_SECRET`
3. Use production database credentials
4. Update OAuth callback URLs to production domain
5. Enable HTTPS
6. Set `NODE_ENV=production`

## Testing

Test the authentication flow:

1. Visit home page as anonymous user
2. Analyze a URL - should work without sign-in
3. Note that AI insights show "Sign in to access"
4. Sign up for an account
5. Analyze another URL - should see AI insights (if OPENAI_API_KEY is set)
6. Save the report
7. Visit dashboard to see saved reports
8. Sign out and verify anonymous access still works
