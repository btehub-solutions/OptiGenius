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

## Notes

- Results page calls `/api/analyze?url=...`.
- Simple SEO score (1-100) based on presence of title, meta description, and headings.
