# OptiGenius - SEO & GEO Analyzer

A modern Next.js web application that analyzes live URLs for both traditional SEO (Search Engine Optimization) and GEO (Generative Engine Optimization) metrics, providing actionable insights for both traditional search engines and AI-powered platforms.

## Features

- 🔍 **Instant SEO & GEO Analysis** - Analyze any website URL in seconds
- 📊 **Dual Scoring System** - Get separate scores for traditional SEO and AI-readiness (GEO)
- 🤖 **AI-Powered Insights** - Get intelligent content summaries and improvement suggestions powered by OpenAI
- 🧠 **GEO Analysis** - Optimize for AI engines like ChatGPT, Perplexity, and Gemini
- 🎯 **Detailed Reports** - View meta tags, headings, links, images, social tags, and AI-readiness factors
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Built with Tailwind CSS and ShadCN UI components
- 💾 **Save Reports** - Authenticated users can save and manage analysis history
- 📥 **Export Options** - Download reports as PDF or Markdown

## What Gets Analyzed

### SEO Analysis (Traditional Search Engines)
- **Meta Tags**: Page title, meta description, keywords
- **Headings**: H1, H2, and H3 tags structure
- **Links**: Internal and external link analysis
- **Images**: Image count and alt text coverage
- **Social Tags**: Open Graph and Twitter Card tags
- **SEO Score**: Overall score (1-100) with issues and recommendations

### GEO Analysis (Generative Engine Optimization)
- **AI-Readiness Score**: How well your content performs with AI engines
- **AI Ranking Prediction**: Predicted ranking in AI-generated responses
- **Sentence Clarity**: Readability and clarity for AI comprehension
- **Content Structure**: Logical organization and hierarchy
- **Factual Density**: Presence of specific facts, entities, and data
- **Named Entities**: Detection of people, organizations, and places
- **Content Metrics**: Word count, sentence count, and average sentence length
- **GEO Recommendations**: Specific suggestions for AI optimization

### AI-Powered Insights
- **Content Summary**: AI-generated overview of your page content
- **Improvement Suggestions**: Actionable recommendations for both SEO and GEO

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
2. Click "Analyze" to start the analysis
3. View the comprehensive results with clearly separated sections:
   - **SEO Analysis** (Green theme): Traditional search engine metrics
   - **GEO Analysis** (Blue theme): AI engine optimization metrics
   - **AI-Powered Insights** (Purple theme): AI-generated recommendations
   - **SEO Issues & Recommendations**: Specific problems and fixes
   - **SEO Technical Details**: Detailed breakdown across tabs
4. **Authenticated users** can:
   - Save reports to their dashboard
   - View analysis history
   - Export reports as PDF or Markdown
   - Access AI chat for interactive insights

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

## Scoring Systems

### SEO Score (1-100)
Calculated based on traditional search engine factors:
- **Title Tag** (20 points): Presence and optimal length (30-60 characters)
- **Meta Description** (20 points): Presence and optimal length (120-160 characters)
- **H1 Tags** (15 points): Exactly one H1 tag per page
- **H2 Tags** (10 points): Presence of H2 tags for content structure
- **H3 Tags** (5 points): Presence of H3 tags
- **Image Alt Tags** (10 points): Percentage of images with alt text
- **Internal Links** (10 points): Adequate internal linking
- **Open Graph Tags** (10 points): Complete OG tags for social sharing

### GEO Score (1-100)
Calculated based on AI engine optimization factors:
- **Sentence Clarity** (30 points): Clear, concise sentences for AI comprehension
- **Content Structure** (25 points): Logical hierarchy and organization
- **Factual Density** (20 points): Presence of specific facts and entities
- **Content Length** (15 points): Adequate word count for AI context
- **Citation Quality** (10 points): Authoritative and verifiable information

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
