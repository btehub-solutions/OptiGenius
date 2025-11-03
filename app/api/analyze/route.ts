import type { NextRequest } from "next/server";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    return u.toString();
  } catch {
    return `https://${input}`;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const url = normalizeUrl(target);

  try {
    const res = await fetch(url, { redirect: "follow" as any, headers: { "user-agent": "OptiGeniusBot/0.1" } });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch: ${res.status}` }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = ($("title").first().text() || "").trim();
    const metaDescription = ($('meta[name="description"]').attr("content") || "").trim();

    const headings: { h1: string[]; h2: string[]; h3: string[] } = { h1: [], h2: [], h3: [] };
    $("h1").each((_, el) => {
      headings.h1.push($(el).text().trim());
      return;
    });
    $("h2").each((_, el) => {
      headings.h2.push($(el).text().trim());
      return;
    });
    $("h3").each((_, el) => {
      headings.h3.push($(el).text().trim());
      return;
    });

    const links: { href: string; text: string }[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      let absolute = href;
      try {
        absolute = new URL(href, url).toString();
      } catch {}
      const text = $(el).text().trim().replace(/\s+/g, " ");
      links.push({ href: absolute, text });
      return;
    });

    const scoreParts = [title ? 35 : 0, metaDescription ? 35 : 0, headings.h1.length ? 20 : 0, (headings.h2.length || headings.h3.length) ? 10 : 0];
    const score = scoreParts.reduce((a, b) => a + b, 0);

    // Extract main content from the page (limit to first 3000 chars to stay within token limits)
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);

    // Generate AI insights if OpenAI API key is available
    let aiInsights = null;
    if (openai) {
      try {
        const prompt = `Analyze this webpage for SEO optimization:

URL: ${url}
Title: ${title}
Meta Description: ${metaDescription}
H1 Headings: ${headings.h1.join(", ") || "None"}
Content Preview: ${bodyText}

Provide:
1. A brief 2-3 sentence summary of the page content
2. 3-5 specific, actionable SEO improvement suggestions

Format your response as JSON with this structure:
{
  "summary": "your summary here",
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content || "{}";
        aiInsights = JSON.parse(responseText);
      } catch (aiError: any) {
        console.error("AI insights error:", aiError?.message);
        // Continue without AI insights if there's an error
      }
    }

    // GEO (Generative Engine Optimization) Analysis
    let geoAnalysis = null;
    if (openai) {
      try {
        const geoPrompt = `Analyze this webpage for AI/LLM readiness (Generative Engine Optimization):

URL: ${url}
Title: ${title}
Meta Description: ${metaDescription}
Content Preview: ${bodyText}

Evaluate:
1. AI-Readiness Score (1-100): How well-structured and clear is the content for AI understanding?
2. Named Entities: Extract key people, organizations, products, or locations mentioned
3. AI Ranking Prediction (1-100): How likely would this page rank well in AI-generated responses?

Consider:
- Content clarity and factual quality
- Structured information presentation
- Authority signals
- Specific, answerable information

Format as JSON:
{
  "aiReadinessScore": 75,
  "entities": ["Entity 1", "Entity 2", "Entity 3"],
  "aiRankingScore": 80,
  "readinessFactors": ["factor 1", "factor 2"]
}`;

        const geoCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: geoPrompt }],
          temperature: 0.5,
          max_tokens: 400,
        });

        const geoResponseText = geoCompletion.choices[0]?.message?.content || "{}";
        geoAnalysis = JSON.parse(geoResponseText);
      } catch (geoError: any) {
        console.error("GEO analysis error:", geoError?.message);
        // Continue without GEO analysis if there's an error
      }
    }

    const payload = {
      url,
      title,
      metaDescription,
      headings,
      links: links.slice(0, 100),
      score,
      aiInsights,
      geoAnalysis,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
