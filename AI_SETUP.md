# AI-Powered Insights Setup Guide

This guide will help you set up the AI-powered insights feature in OptiGenius.

## Overview

The AI insights feature uses OpenAI's GPT-4o-mini model to provide:
- **Content Summary**: A brief 2-3 sentence summary of the analyzed page
- **SEO Suggestions**: 5-7 actionable recommendations to improve SEO

## Setup Instructions

### 1. Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the generated key (you won't be able to see it again!)

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Save the file

### 3. Restart the Development Server

If the server is already running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm run dev
```

## How It Works

1. When a URL is analyzed, the API route extracts:
   - Page title
   - Meta description
   - H1 tags
   - First 3000 characters of body content

2. This data is sent to OpenAI's API with a specialized prompt

3. The AI generates:
   - A concise summary of the page content
   - Specific, actionable SEO improvement suggestions

4. Results are displayed in a beautiful card on the results page

## Features

- **Collapsible Suggestions**: Click to expand/collapse the suggestions list
- **Numbered List**: Easy-to-follow numbered suggestions
- **Visual Design**: Purple gradient card with icons for easy identification
- **Graceful Degradation**: App works without API key (just no AI insights)

## Cost Considerations

- Model used: `gpt-4o-mini` (cost-effective)
- Approximate cost: ~$0.001-0.002 per analysis
- Max tokens per request: 800 tokens

## Troubleshooting

### AI Insights Not Showing

1. **Check API Key**: Ensure `OPENAI_API_KEY` is set in `.env.local`
2. **Restart Server**: Environment variables require a server restart
3. **Check Console**: Look for errors in the terminal or browser console
4. **Verify API Key**: Make sure the key is valid and has credits

### Error Messages

- **"Unable to generate AI summary"**: API key might be invalid or quota exceeded
- **No AI card appears**: API key is not configured (this is normal)

## Security Notes

- ✅ API key is stored in `.env.local` (gitignored by default)
- ✅ Key is only accessible on the server-side
- ✅ Never commit `.env.local` to version control
- ✅ Use `.env.example` as a template for team members

## Optional: Disable AI Insights

To disable AI insights:
1. Remove or comment out `OPENAI_API_KEY` in `.env.local`
2. Restart the server
3. The app will work normally without the AI insights card

## Support

For issues or questions:
- Check OpenAI API status: https://status.openai.com/
- Review OpenAI documentation: https://platform.openai.com/docs
- Check your API usage: https://platform.openai.com/usage
