# OptiGenius - SEO Analyzer

A modern Next.js web application that analyzes live URLs for basic SEO metrics and provides actionable insights.

## Features

- 🔍 **Instant SEO Analysis** - Analyze any website URL in seconds
- 📊 **Comprehensive Scoring** - Get a score from 1-100 based on key SEO factors
- 🤖 **AI-Powered Insights** - Get intelligent content summaries and SEO suggestions powered by OpenAI
- 🎯 **Detailed Reports** - View meta tags, headings, links, images, and social tags
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Built with Tailwind CSS and ShadCN UI components

## What Gets Analyzed

- **Meta Tags**: Page title, meta description, keywords
- **Headings**: H1, H2, and H3 tags structure
- **Links**: Internal and external link analysis
- **Images**: Image count and alt text coverage
- **Social Tags**: Open Graph and Twitter Card tags
- **SEO Score**: Overall score with issues and recommendations
- **AI Insights**: AI-generated content summary and actionable SEO improvement suggestions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **HTML Parsing**: Cheerio
- **HTTP Client**: node-fetch
- **Icons**: Lucide React
- **AI**: OpenAI API (GPT-4o-mini)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (optional, for AI-powered insights)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd OptiGenius
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The AI insights feature is optional. If you don't provide an API key, the app will still work but won't display AI-generated insights.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter any website URL in the input field on the homepage
2. Click "Analyze" to start the SEO analysis
3. View the comprehensive results including:
   - Overall SEO score
   - **AI-Powered Insights** (if API key is configured):
     - Content summary
     - Actionable SEO improvement suggestions (collapsible)
   - Issues found
   - Recommendations
   - Detailed analysis across multiple tabs

## Project Structure

```
OptiGenius/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for SEO analysis
│   ├── results/
│   │   └── page.tsx              # Results page with tabs
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   └── ui/                       # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── tabs.tsx
├── lib/
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

## SEO Scoring System

The SEO score is calculated based on:

- **Title Tag** (20 points): Presence and optimal length (30-60 characters)
- **Meta Description** (20 points): Presence and optimal length (120-160 characters)
- **H1 Tags** (15 points): Exactly one H1 tag per page
- **H2 Tags** (10 points): Presence of H2 tags for content structure
- **H3 Tags** (5 points): Presence of H3 tags
- **Image Alt Tags** (10 points): Percentage of images with alt text
- **Internal Links** (10 points): Adequate internal linking
- **Open Graph Tags** (10 points): Complete OG tags for social sharing

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
