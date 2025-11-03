import type { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: NextRequest) {
  if (!openai) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Build context from analysis data
    const contextInfo = context
      ? `
Analysis Context:
URL: ${context.url || "N/A"}
Title: ${context.title || "N/A"}
Meta Description: ${context.metaDescription || "N/A"}
SEO Score: ${context.score || "N/A"}
H1 Headings: ${context.headings?.h1?.join(", ") || "None"}
H2 Headings: ${context.headings?.h2?.slice(0, 5).join(", ") || "None"}
${context.aiInsights?.summary ? `Content Summary: ${context.aiInsights.summary}` : ""}
${context.geoAnalysis ? `AI Readiness Score: ${context.geoAnalysis.aiReadinessScore}` : ""}
${context.geoAnalysis ? `AI Ranking Score: ${context.geoAnalysis.aiRankingScore}` : ""}
${context.geoAnalysis?.entities ? `Key Entities: ${context.geoAnalysis.entities.join(", ")}` : ""}
`
      : "";

    const systemPrompt = `You are an expert SEO and Generative Engine Optimization (GEO) consultant. You help users understand their website analysis results and provide actionable advice.

${contextInfo}

When answering questions:
- Be specific and actionable
- Reference the actual data from the analysis
- Provide concrete examples when suggesting improvements
- Explain technical concepts in simple terms
- For meta description rewrites, create compelling, keyword-rich descriptions under 160 characters
- For SEO score questions, explain what factors are affecting the score
- For comparison questions, highlight key differences and opportunities
- Focus on both traditional SEO and AI/LLM optimization (GEO)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Unknown error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
