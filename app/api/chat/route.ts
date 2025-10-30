import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  context: {
    url: string;
    score: number;
    title: string;
    metaDescription: string;
    geoAnalysis: any;
    aiInsights: any;
    issues: string[];
    recommendations: string[];
  };
  conversationHistory?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to use AI chat" },
        { status: 401 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, context, conversationHistory = [] } = body;

    if (!message || !context) {
      return NextResponse.json(
        { error: "Message and context are required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Build system prompt with analysis context
    const systemPrompt = `You are an expert SEO and GEO (Generative Engine Optimization) consultant helping users understand and improve their website's performance. 

You have access to the following analysis data for ${context.url}:

**SEO Score:** ${context.score}/100
**Page Title:** ${context.title || "Not set"}
**Meta Description:** ${context.metaDescription || "Not set"}

**GEO Analysis:**
- AI Readiness Score: ${context.geoAnalysis?.aiReadinessScore || "N/A"}/100
- AI Ranking Prediction: ${context.geoAnalysis?.aiRankingScore || "N/A"}/100
- Content Metrics: ${context.geoAnalysis?.contentMetrics?.wordCount || 0} words, ${context.geoAnalysis?.contentMetrics?.sentenceCount || 0} sentences

**Key Issues:**
${context.issues?.slice(0, 5).map((issue: string) => `- ${issue}`).join('\n') || "None"}

**Top Recommendations:**
${context.recommendations?.slice(0, 5).map((rec: string) => `- ${rec}`).join('\n') || "None"}

${context.aiInsights?.summary ? `**AI Summary:** ${context.aiInsights.summary}` : ''}

Your role is to:
1. Answer follow-up questions about the analysis
2. Provide specific, actionable advice
3. Explain SEO and GEO concepts clearly
4. Help rewrite meta descriptions, titles, or content for better AI ranking
5. Compare URLs when asked (though you'll need the second URL's data)
6. Be concise but thorough

Always reference the specific data from the analysis when answering questions.`;

    // Build messages array
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage,
    });

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to process chat request" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
