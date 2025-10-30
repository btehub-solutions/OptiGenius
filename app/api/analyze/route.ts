import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import nlp from "compromise";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GEO Analysis Function
function performGEOAnalysis(
  content: string,
  title: string,
  metaDescription: string,
  h1Tags: string[],
  h2Tags: string[]
) {
  // Extract named entities using compromise
  const doc = nlp(content);
  
  const people = doc.people().out('array').slice(0, 10);
  const organizations = doc.organizations().out('array').slice(0, 10);
  const places = doc.places().out('array').slice(0, 10);
  
  // Calculate AI-readiness score (1-100)
  let aiReadinessScore = 0;
  const factors = [];
  
  // 1. Content clarity (30 points) - based on sentence structure
  const sentences = doc.sentences().out('array');
  const avgSentenceLength = content.split('.').reduce((acc, s) => acc + s.trim().split(' ').length, 0) / Math.max(sentences.length, 1);
  
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
    aiReadinessScore += 30;
    factors.push({ factor: 'Sentence clarity', score: 30, status: 'excellent' });
  } else if (avgSentenceLength > 0) {
    const clarityScore = Math.max(0, 30 - Math.abs(avgSentenceLength - 17) * 2);
    aiReadinessScore += clarityScore;
    factors.push({ factor: 'Sentence clarity', score: clarityScore, status: avgSentenceLength < 10 ? 'too_short' : 'too_long' });
  }
  
  // 2. Content structure (25 points) - headings and organization
  let structureScore = 0;
  if (h1Tags.length === 1) structureScore += 10;
  if (h2Tags.length >= 2 && h2Tags.length <= 8) structureScore += 15;
  else if (h2Tags.length > 0) structureScore += 8;
  
  aiReadinessScore += structureScore;
  factors.push({ factor: 'Content structure', score: structureScore, status: structureScore >= 20 ? 'good' : 'needs_improvement' });
  
  // 3. Factual density (20 points) - presence of entities and specific information
  const entityCount = people.length + organizations.length + places.length;
  const factualScore = Math.min(20, entityCount * 2);
  aiReadinessScore += factualScore;
  factors.push({ factor: 'Factual density', score: factualScore, status: entityCount >= 5 ? 'rich' : 'sparse' });
  
  // 4. Content length (15 points) - adequate information
  const wordCount = content.split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 300 && wordCount <= 2000) {
    lengthScore = 15;
  } else if (wordCount > 100) {
    lengthScore = Math.min(15, (wordCount / 300) * 15);
  }
  aiReadinessScore += lengthScore;
  factors.push({ factor: 'Content length', score: lengthScore, status: wordCount >= 300 ? 'adequate' : 'insufficient' });
  
  // 5. Metadata quality (10 points)
  let metadataScore = 0;
  if (title && title.length >= 30 && title.length <= 60) metadataScore += 5;
  if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) metadataScore += 5;
  aiReadinessScore += metadataScore;
  factors.push({ factor: 'Metadata quality', score: metadataScore, status: metadataScore >= 8 ? 'optimized' : 'needs_work' });
  
  // Calculate AI ranking prediction (1-100)
  // This is a simplified model based on AI-readiness and content quality
  const aiRankingScore = Math.round(
    aiReadinessScore * 0.6 + // AI-readiness is 60% of ranking
    (entityCount >= 5 ? 20 : entityCount * 4) + // Entity richness 20%
    (wordCount >= 500 ? 20 : (wordCount / 500) * 20) // Content depth 20%
  );
  
  // Combine all entities and remove duplicates
  const allEntities = [
    ...people.map((name: string) => ({ type: 'person', name })),
    ...organizations.map((name: string) => ({ type: 'organization', name })),
    ...places.map((name: string) => ({ type: 'place', name }))
  ];
  
  // Remove duplicates based on name
  const uniqueEntities = allEntities.filter((entity, index, self) =>
    index === self.findIndex(e => e.name.toLowerCase() === entity.name.toLowerCase())
  );
  
  return {
    aiReadinessScore: Math.round(aiReadinessScore),
    aiRankingScore: Math.min(100, Math.max(1, aiRankingScore)),
    factors,
    entities: {
      total: uniqueEntities.length,
      people: people.slice(0, 5),
      organizations: organizations.slice(0, 5),
      places: places.slice(0, 5),
      all: uniqueEntities.slice(0, 15)
    },
    contentMetrics: {
      wordCount,
      sentenceCount: sentences.length,
      avgSentenceLength: Math.round(avgSentenceLength)
    },
    recommendations: generateGEORecommendations(aiReadinessScore, factors, uniqueEntities.length, wordCount)
  };
}

function generateGEORecommendations(
  aiReadinessScore: number,
  factors: any[],
  entityCount: number,
  wordCount: number
): string[] {
  const recommendations = [];
  
  if (aiReadinessScore < 70) {
    recommendations.push("Improve overall AI-readiness to increase visibility in AI-generated responses");
  }
  
  const clarityFactor = factors.find(f => f.factor === 'Sentence clarity');
  if (clarityFactor && clarityFactor.status !== 'excellent') {
    if (clarityFactor.status === 'too_short') {
      recommendations.push("Expand sentences with more descriptive details for better AI comprehension");
    } else {
      recommendations.push("Break down complex sentences into clearer, more digestible statements");
    }
  }
  
  const structureFactor = factors.find(f => f.factor === 'Content structure');
  if (structureFactor && structureFactor.score < 20) {
    recommendations.push("Add more H2 headings to create clear content sections for AI parsing");
  }
  
  if (entityCount < 5) {
    recommendations.push("Include more specific named entities (people, organizations, products) to improve factual density");
  }
  
  if (wordCount < 300) {
    recommendations.push("Expand content to at least 300 words for better AI understanding and ranking");
  }
  
  const metadataFactor = factors.find(f => f.factor === 'Metadata quality');
  if (metadataFactor && metadataFactor.score < 8) {
    recommendations.push("Optimize title and meta description to match AI-preferred formats");
  }
  
  // Always include at least one positive recommendation
  if (recommendations.length === 0) {
    recommendations.push("Content is well-optimized for AI engines - maintain current quality standards");
  }
  
  return recommendations;
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated (optional for analysis)
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user?.id;

    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the page content
    let response;
    try {
      response = await fetch(targetUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; OptiGenius/1.0; +https://optigenius.com)",
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      console.error("Error details:", {
        name: fetchError.name,
        message: fetchError.message,
        code: fetchError.code,
        cause: fetchError.cause
      });
      
      // Handle specific fetch errors
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        return NextResponse.json(
          { error: `Request timed out while trying to reach ${targetUrl.hostname}. The website may be slow or unresponsive.` },
          { status: 504 }
        );
      } else if (fetchError.code === 'ENOTFOUND' || fetchError.cause?.code === 'ENOTFOUND') {
        return NextResponse.json(
          { error: `Unable to reach ${targetUrl.hostname}. The domain may not exist or there may be a DNS resolution issue. Please verify the URL is correct.` },
          { status: 404 }
        );
      } else if (fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: `Connection refused by ${targetUrl.hostname}. The server may be down or blocking requests.` },
          { status: 503 }
        );
      } else if (fetchError.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { error: `Request timed out while trying to reach ${targetUrl.hostname}.` },
          { status: 504 }
        );
      } else {
        return NextResponse.json(
          { error: `Network error: ${fetchError.message || 'Unable to fetch the URL'}. Please check your internet connection and try again.` },
          { status: 500 }
        );
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract SEO elements
    const title = $("title").text() || "";
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const metaKeywords = $('meta[name="keywords"]').attr("content") || "";
    
    // Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const ogDescription = $('meta[property="og:description"]').attr("content") || "";
    const ogImage = $('meta[property="og:image"]').attr("content") || "";
    
    // Twitter Card tags
    const twitterCard = $('meta[name="twitter:card"]').attr("content") || "";
    const twitterTitle = $('meta[name="twitter:title"]').attr("content") || "";
    const twitterDescription = $('meta[name="twitter:description"]').attr("content") || "";

    // Extract headings
    const h1Tags: string[] = [];
    const h2Tags: string[] = [];
    const h3Tags: string[] = [];

    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });

    $("h2").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h2Tags.push(text);
    });

    $("h3").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h3Tags.push(text);
    });

    // Extract links
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        const linkUrl = new URL(href, targetUrl.toString());
        if (linkUrl.hostname === targetUrl.hostname) {
          internalLinks.push(linkUrl.toString());
        } else {
          externalLinks.push(linkUrl.toString());
        }
      } catch {
        // Invalid URL, skip
      }
    });

    // Extract images
    const images: Array<{ src: string; alt: string; hasAlt: boolean }> = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt") || "";
      images.push({
        src,
        alt,
        hasAlt: !!alt,
      });
    });

    // Calculate SEO score
    let score = 0;
    const maxScore = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Title check (20 points)
    if (title) {
      if (title.length >= 30 && title.length <= 60) {
        score += 20;
      } else if (title.length > 0) {
        score += 10;
        if (title.length < 30) {
          issues.push("Title is too short (recommended: 30-60 characters)");
          recommendations.push("Expand your title to better describe your page content");
        } else {
          issues.push("Title is too long (recommended: 30-60 characters)");
          recommendations.push("Shorten your title to avoid truncation in search results");
        }
      }
    } else {
      issues.push("Missing page title");
      recommendations.push("Add a descriptive title tag to your page");
    }

    // Meta description check (20 points)
    if (metaDescription) {
      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        score += 20;
      } else if (metaDescription.length > 0) {
        score += 10;
        if (metaDescription.length < 120) {
          issues.push("Meta description is too short (recommended: 120-160 characters)");
          recommendations.push("Expand your meta description to provide more context");
        } else {
          issues.push("Meta description is too long (recommended: 120-160 characters)");
          recommendations.push("Shorten your meta description to avoid truncation");
        }
      }
    } else {
      issues.push("Missing meta description");
      recommendations.push("Add a compelling meta description to improve click-through rates");
    }

    // H1 tags check (15 points)
    if (h1Tags.length === 1) {
      score += 15;
    } else if (h1Tags.length === 0) {
      issues.push("No H1 tag found");
      recommendations.push("Add a single H1 tag to define your page's main topic");
    } else {
      score += 8;
      issues.push(`Multiple H1 tags found (${h1Tags.length})`);
      recommendations.push("Use only one H1 tag per page for better SEO");
    }

    // H2 tags check (10 points)
    if (h2Tags.length > 0) {
      score += 10;
    } else {
      issues.push("No H2 tags found");
      recommendations.push("Add H2 tags to structure your content better");
    }

    // H3 tags check (5 points)
    if (h3Tags.length > 0) {
      score += 5;
    }

    // Images with alt tags (10 points)
    if (images.length > 0) {
      const imagesWithAlt = images.filter((img) => img.hasAlt).length;
      const altPercentage = (imagesWithAlt / images.length) * 100;
      
      if (altPercentage === 100) {
        score += 10;
      } else if (altPercentage >= 50) {
        score += 5;
        issues.push(`${images.length - imagesWithAlt} images missing alt text`);
        recommendations.push("Add descriptive alt text to all images for accessibility and SEO");
      } else {
        issues.push(`${images.length - imagesWithAlt} images missing alt text`);
        recommendations.push("Add descriptive alt text to all images for accessibility and SEO");
      }
    }

    // Internal links check (10 points)
    if (internalLinks.length >= 5) {
      score += 10;
    } else if (internalLinks.length > 0) {
      score += 5;
      issues.push("Limited internal linking");
      recommendations.push("Add more internal links to improve site navigation and SEO");
    } else {
      issues.push("No internal links found");
      recommendations.push("Add internal links to connect your content and improve navigation");
    }

    // Open Graph tags check (10 points)
    if (ogTitle && ogDescription && ogImage) {
      score += 10;
    } else if (ogTitle || ogDescription) {
      score += 5;
      issues.push("Incomplete Open Graph tags");
      recommendations.push("Add all Open Graph tags (title, description, image) for better social sharing");
    } else {
      issues.push("Missing Open Graph tags");
      recommendations.push("Add Open Graph tags to improve social media sharing");
    }

    // Ensure score doesn't exceed max
    score = Math.min(score, maxScore);

    // Extract body text for GEO analysis
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const contentPreview = bodyText.slice(0, 5000); // Use more text for GEO analysis

    // GEO Analysis - Generative Engine Optimization
    const geoAnalysis = performGEOAnalysis(contentPreview, title, metaDescription, h1Tags, h2Tags);

    // Generate AI insights using OpenAI (only for authenticated users)
    let aiInsights = null;
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      console.log("OpenAI API Key present:", !!openaiApiKey);
      console.log("User authenticated:", isAuthenticated);
      
      if (openaiApiKey && isAuthenticated) {
        const openai = new OpenAI({
          apiKey: openaiApiKey,
        });

        // Extract page content for AI analysis
        const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);
        
        console.log("Calling OpenAI API...");
        
        const prompt = `Analyze this webpage for SEO optimization:

URL: ${targetUrl.toString()}
Title: ${title}
Meta Description: ${metaDescription}
H1 Tags: ${h1Tags.join(", ")}
Content Preview: ${bodyText}

Provide:
1. A brief summary of the page content (2-3 sentences)
2. 5-7 specific, actionable SEO improvement suggestions

Format your response as JSON with this structure:
{
  "summary": "your summary here",
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert SEO consultant. Provide clear, actionable advice."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        console.log("OpenAI API response received");

        const aiResponse = completion.choices[0]?.message?.content;
        console.log("AI Response:", aiResponse);
        
        if (aiResponse) {
          try {
            // Remove markdown code blocks if present
            let cleanedResponse = aiResponse.trim();
            if (cleanedResponse.startsWith("```json")) {
              cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            } else if (cleanedResponse.startsWith("```")) {
              cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }
            
            aiInsights = JSON.parse(cleanedResponse);
            console.log("Successfully parsed AI insights");
          } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.log("Raw response:", aiResponse);
            // If JSON parsing fails, try to extract content manually
            aiInsights = {
              summary: "Unable to generate AI summary at this time.",
              suggestions: ["Please check your API configuration and try again."]
            };
          }
        }
      } else if (!isAuthenticated) {
        console.log("User not authenticated - AI insights not available");
        aiInsights = {
          summary: "Sign in to access AI-powered insights and suggestions.",
          suggestions: ["Create an account to unlock advanced AI analysis features"]
        };
      } else {
        console.log("No OpenAI API key found in environment variables");
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      // Continue without AI insights if there's an error
    }

    const seoData = {
      url: targetUrl.toString(),
      score,
      title,
      metaDescription,
      metaKeywords,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
      },
      twitter: {
        card: twitterCard,
        title: twitterTitle,
        description: twitterDescription,
      },
      headings: {
        h1: h1Tags,
        h2: h2Tags,
        h3: h3Tags,
      },
      links: {
        internal: internalLinks.slice(0, 50), // Limit to first 50
        external: externalLinks.slice(0, 50),
        internalCount: internalLinks.length,
        externalCount: externalLinks.length,
      },
      images: {
        total: images.length,
        withAlt: images.filter((img) => img.hasAlt).length,
        withoutAlt: images.filter((img) => !img.hasAlt).length,
        list: images.slice(0, 20), // Limit to first 20
      },
      issues,
      recommendations,
      aiInsights,
      geoAnalysis,
      isAuthenticated,
    };

    return NextResponse.json(seoData);
  } catch (error) {
    console.error("Error analyzing URL:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to analyze URL. Please check the URL and try again.";
    
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('ENOTFOUND')) {
        errorMessage = "Unable to reach the domain. Please verify the URL is correct and the website is online.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Request timed out. The website may be slow or unresponsive.";
      } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
        errorMessage = "SSL certificate error. The website may have security issues.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
