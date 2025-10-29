# Quick Start - Authentication

Get OptiGenius running with authentication in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/optigenius"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OpenAI (optional - for AI insights)
OPENAI_API_KEY="sk-your-key-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Setup Database

Create the database:
```bash
createdb optigenius
```

Run migrations:
```bash
npm run db:migrate
```

### 4. Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## Test the Authentication

### As Anonymous User

1. Go to http://localhost:3000
2. Enter a URL (e.g., `https://example.com`)
3. Click "Analyze"
4. View results - notice AI insights say "Sign in to access"

### Create an Account

1. Click "Sign Up" in the header
2. Enter email and password
3. Click "Sign Up"
4. You'll be automatically signed in

### As Authenticated User

1. Analyze another URL
2. Notice AI insights are now available (if OPENAI_API_KEY is set)
3. Click "Save Report" button
4. Click "Dashboard" to see saved reports
5. Try deleting a report

## What's Working

✅ Anonymous URL analysis  
✅ Email/password registration  
✅ Email/password login  
✅ OAuth (Google/GitHub) - if configured  
✅ AI insights for authenticated users  
✅ Save reports  
✅ View report history  
✅ Delete reports  
✅ Protected dashboard  
✅ Session persistence  

## Optional: Setup OAuth

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### GitHub OAuth

1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add to `.env`:
   ```env
   GITHUB_ID="your-client-id"
   GITHUB_SECRET="your-client-secret"
   ```

## Useful Commands

```bash
# View database in browser
npm run db:studio

# Reset database
npm run db:push

# Generate Prisma client
npm run db:generate

# View database migrations
npx prisma migrate status
```

## Troubleshooting

**Error: "Can't reach database server"**
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env`

**Error: "Prisma Client not found"**
```bash
npm run db:generate
```

**OAuth not working**
- Verify callback URLs match exactly
- Check credentials in `.env`
- Restart dev server after adding OAuth vars

**Session not persisting**
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Restart dev server

## Next Steps

- Read `AUTH_SETUP.md` for detailed configuration
- Read `AUTHENTICATION_IMPLEMENTATION.md` for architecture details
- Configure OAuth providers for social login
- Add your OpenAI API key for AI insights
- Customize the UI to match your brand

## Support

Having issues? Check:
1. `AUTH_SETUP.md` - Detailed setup guide
2. `AUTHENTICATION_IMPLEMENTATION.md` - Implementation details
3. Console logs for error messages
4. Database connection with `npm run db:studio`

Enjoy using OptiGenius! 🚀
