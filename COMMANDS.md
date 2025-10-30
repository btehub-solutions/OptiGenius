# Quick Command Reference

## 🚀 Deploy to Vercel

### 1. Generate NEXTAUTH_SECRET
```bash
node generate-secret.js
```
Copy the output and save it for Vercel environment variables.

### 2. Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### 3. After First Successful Deploy - Initialize Database
```bash
# Install Vercel CLI (one time only)
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull production environment variables
vercel env pull .env.production

# Apply database migrations
npx prisma migrate deploy
```

## 🔧 Local Development

### Start Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

### Database Commands
```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Push schema changes without migration
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Build for Production (Test Locally)
```bash
npm run build
npm start
```

## 📊 Vercel CLI Commands

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Pull Environment Variables
```bash
vercel env pull
```

### Deploy Manually
```bash
vercel --prod
```

## 🔍 Troubleshooting Commands

### Check if Prisma Client is Generated
```bash
ls node_modules/.prisma/client
```

### Test Database Connection
```bash
npx prisma db pull
```

### Validate Prisma Schema
```bash
npx prisma validate
```

### Format Prisma Schema
```bash
npx prisma format
```

## 🧹 Clean Build

If you encounter issues, try:
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Regenerate Prisma Client
npx prisma generate

# Rebuild
npm run build
```

## 📦 Environment Setup

### Copy Environment Template
```bash
cp .env.example .env
```

### Required Environment Variables
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate with: node generate-secret.js>"
OPENAI_API_KEY="sk-proj-..."
```

## 🔐 Security

### Generate New Secret
```bash
node generate-secret.js
```

### Or using OpenSSL
```bash
openssl rand -base64 32
```

## 📱 Testing

### Run Linter
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## 🌐 URLs

- **Local Dev:** http://localhost:3000
- **Production:** https://your-app.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Storage:** https://vercel.com/dashboard/stores
