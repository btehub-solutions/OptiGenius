# ⚡ OptiGenius - Quick Deploy Guide

**5-Minute Vercel Deployment**

---

## 🚀 Deploy Now (5 Steps)

### 1️⃣ Push to Git (1 min)
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2️⃣ Import to Vercel (1 min)
- Go to [vercel.com/new](https://vercel.com/new)
- Click **"Import Git Repository"**
- Select **OptiGenius**
- Click **"Import"**

### 3️⃣ Add Database (1 min)
- In Vercel dashboard: **Storage** → **Create Database**
- Select **"Postgres"**
- Name it: `optigenius-db`
- Click **"Create"**

✅ `DATABASE_URL` and `DIRECT_URL` auto-added!

### 4️⃣ Set Environment Variables (2 min)
Go to **Settings** → **Environment Variables** and add:

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
OPENAI_API_KEY=sk-your-key-here
```

### 5️⃣ Deploy & Migrate (1 min)
```bash
# Pull environment variables
vercel env pull .env.production

# Run database migration
npx prisma db push

# Done! Visit your URL
```

---

## 🎯 That's It!

Your app is live at: `https://your-app.vercel.app`

---

## 📋 Environment Variables Needed

| Variable | Value | Get From |
|----------|-------|----------|
| `DATABASE_URL` | Auto-added ✅ | Vercel Postgres |
| `DIRECT_URL` | Auto-added ✅ | Vercel Postgres |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `NEXTAUTH_SECRET` | Generate new | `openssl rand -base64 32` |
| `OPENAI_API_KEY` | `sk-...` | [platform.openai.com](https://platform.openai.com/api-keys) |

---

## 🔧 Generate NEXTAUTH_SECRET

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Online:**
[generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

---

## ✅ Test Your Deployment

- [ ] Visit your URL
- [ ] Sign up for an account
- [ ] Analyze a website
- [ ] Check AI insights work
- [ ] Test PDF export
- [ ] Try dark mode toggle

---

## 🆘 Issues?

### Build Failed
```bash
# Test locally first
npm run build
```

### Database Error
```bash
# Re-run migration
npx prisma db push
```

### NextAuth Error
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set

### AI Not Working
- Verify `OPENAI_API_KEY` is correct
- Check OpenAI account has credits

---

## 📚 Need More Details?

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.

---

## 🎉 Success!

Your OptiGenius app is now live on Vercel!

**Share it:** `https://your-app.vercel.app`

---

**Deploy Time:** ~5 minutes
**Cost:** Free tier available
**Support:** [vercel.com/support](https://vercel.com/support)
