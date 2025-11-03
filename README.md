# OptiGenius

Analyze Any Website SEO Instantly.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000

## Tech

- Next.js (App Router)
- Tailwind CSS
- Minimal shadcn-style UI primitives (Button, Input, Card, Tabs)
- API route uses node-fetch + cheerio to parse HTML

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub** (or GitLab/Bitbucket)

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Alternative: Deploy via Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```

### Environment Variables

No environment variables are required for basic functionality. If you need to add any in the future, create a `.env.local` file based on `.env.example`.

### Build Configuration

The project uses:
- **Framework:** Next.js 14
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 18.x or higher

## Notes

- Results page calls `/api/analyze?url=...`.
- Simple SEO score (1-100) based on presence of title, meta description, and headings.
- API route uses Node.js runtime for `node-fetch` and `cheerio`.
