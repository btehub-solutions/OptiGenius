"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, ExternalLink, Sparkles, ChevronDown, ChevronUp, Brain, TrendingUp, Users, Building2, MapPin, Download, FileText, Save } from "lucide-react";
import { exportToPDF, exportToMarkdown } from "@/lib/exportUtils";
import AIChatPanel from "@/components/AIChatPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/Footer";

interface SEOData {
  url: string;
  score: number;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: {
    internal: string[];
    external: string[];
    internalCount: number;
    externalCount: number;
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    list: Array<{ src: string; alt: string; hasAlt: boolean }>;
  };
  issues: string[];
  recommendations: string[];
  aiInsights: {
    summary: string;
    suggestions: string[];
  } | null;
  geoAnalysis: {
    aiReadinessScore: number;
    aiRankingScore: number;
    factors: Array<{
      factor: string;
      score: number;
      status: string;
    }>;
    entities: {
      total: number;
      people: string[];
      organizations: string[];
      places: string[];
      all: Array<{ type: string; name: string }>;
    };
    contentMetrics: {
      wordCount: number;
      sentenceCount: number;
      avgSentenceLength: number;
    };
    recommendations: string[];
  };
  isAuthenticated?: boolean;
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const url = searchParams.get("url");
    if (!url) {
      setError("No URL provided");
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
        
        // Get the response text first
        const responseText = await response.text();
        
        if (!response.ok) {
          // Try to parse as JSON, but handle HTML responses
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.error || "Failed to analyze URL");
          } catch (parseError) {
            // If JSON parsing fails, it's likely an HTML error page
            throw new Error(`Failed to analyze URL: ${response.status} ${response.statusText}`);
          }
        }
        
        // Parse the successful response
        try {
          const result = JSON.parse(responseText);
          setData(result);
        } catch (parseError) {
          throw new Error("Received invalid response from server. Please try again.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [searchParams]);

  const handleSaveReport = async () => {
    if (!session || !data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.url,
          score: data.score,
          data: data,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Analyzing your website...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to load results"}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">Website Analysis Results</h1>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {data.url}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex gap-3">
              <ThemeToggle />
              {session && (
                <Button
                  onClick={handleSaveReport}
                  disabled={saving || saved}
                  className={saved ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saved ? "Saved!" : saving ? "Saving..." : "Save Report"}
                </Button>
              )}
              <Button
                onClick={() => exportToPDF(data)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => exportToMarkdown(data)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Markdown
              </Button>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Analysis</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-green-400 to-green-600 rounded"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Traditional Search Engine Optimization metrics</p>
        
        {/* SEO Score Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
            <CardHeader>
              <CardTitle>Overall SEO Score</CardTitle>
              <CardDescription>Based on key SEO factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(data.score)}`}>
                    {data.score}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">out of 100</div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className={`text-xl font-semibold ${getScoreColor(data.score)}`}>
                      {getScoreLabel(data.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        data.score >= 80
                          ? "bg-green-600"
                          : data.score >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* GEO Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">GEO Analysis</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-blue-400 to-blue-600 rounded"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Generative Engine Optimization for AI-powered platforms</p>

        {/* GEO Score Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                GEO Score
              </CardTitle>
              <CardDescription>AI Engine Optimization readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(data.geoAnalysis.aiReadinessScore)}`}>
                    {data.geoAnalysis.aiReadinessScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">AI-Ready</div>
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">AI Ranking Prediction</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(data.geoAnalysis.aiRankingScore)}`}>
                      {data.geoAnalysis.aiRankingScore}/100
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GEO Analysis Detailed Card */
        <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              GEO Analysis - Generative Engine Optimization
            </CardTitle>
            <CardDescription>How well your content performs with AI engines like ChatGPT, Perplexity, and Gemini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Readiness Factors */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                AI-Readiness Factors
              </h3>
              <div className="grid gap-3">
                {data.geoAnalysis.factors.map((factor, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{factor.factor}</span>
                      <span className={`text-lg font-bold ${getScoreColor(factor.score)}`}>
                        {factor.score}/
                        {factor.factor === 'Sentence clarity' ? '30' : 
                         factor.factor === 'Content structure' ? '25' :
                         factor.factor === 'Factual density' ? '20' :
                         factor.factor === 'Content length' ? '15' : '10'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          factor.score >= (factor.factor === 'Sentence clarity' ? 24 : 
                                          factor.factor === 'Content structure' ? 20 :
                                          factor.factor === 'Factual density' ? 16 :
                                          factor.factor === 'Content length' ? 12 : 8)
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                        style={{ 
                          width: `${(factor.score / (
                            factor.factor === 'Sentence clarity' ? 30 : 
                            factor.factor === 'Content structure' ? 25 :
                            factor.factor === 'Factual density' ? 20 :
                            factor.factor === 'Content length' ? 15 : 10
                          )) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Named Entities */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">🏷️</span>
                Named Entities Detected ({data.geoAnalysis.entities.total})
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {data.geoAnalysis.entities.people.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">People ({data.geoAnalysis.entities.people.length})</span>
                    </div>
                    <ul className="space-y-1">
                      {data.geoAnalysis.entities.people.map((person, idx) => (
                        <li key={idx} className="text-sm text-gray-700 truncate">• {person}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.geoAnalysis.entities.organizations.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Organizations ({data.geoAnalysis.entities.organizations.length})</span>
                    </div>
                    <ul className="space-y-1">
                      {data.geoAnalysis.entities.organizations.map((org, idx) => (
                        <li key={idx} className="text-sm text-gray-700 truncate">• {org}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.geoAnalysis.entities.places.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm">Places ({data.geoAnalysis.entities.places.length})</span>
                    </div>
                    <ul className="space-y-1">
                      {data.geoAnalysis.entities.places.map((place, idx) => (
                        <li key={idx} className="text-sm text-gray-700 truncate">• {place}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {data.geoAnalysis.entities.total === 0 && (
                <p className="text-gray-500 italic bg-white p-4 rounded-lg">No named entities detected. Consider adding specific people, organizations, or places to improve factual density.</p>
              )}
            </div>

            {/* Content Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">📈</span>
                Content Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.geoAnalysis.contentMetrics.wordCount}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.geoAnalysis.contentMetrics.sentenceCount}</div>
                  <div className="text-sm text-gray-600">Sentences</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.geoAnalysis.contentMetrics.avgSentenceLength}</div>
                  <div className="text-sm text-gray-600">Avg Words/Sentence</div>
                </div>
              </div>
            </div>

            {/* GEO Recommendations */}
            {data.geoAnalysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  GEO Recommendations
                </h3>
                <ul className="space-y-2">
                  {data.geoAnalysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* AI Insights Card */}
        {data.aiInsights && (
          <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Generated by artificial intelligence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="text-purple-600">📄</span>
                  Content Summary
                </h3>
                <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg shadow-sm">
                  {data.aiInsights.summary}
                </p>
              </div>

              {/* SEO Suggestions */}
              <div>
                <button
                  onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                  className="w-full flex items-center justify-between text-lg font-semibold mb-3 hover:text-purple-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-purple-600">💡</span>
                    Improvement Suggestions ({data.aiInsights.suggestions.length})
                  </span>
                  {suggestionsExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                {suggestionsExpanded && (
                  <ul className="space-y-3">
                    {data.aiInsights.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SEO Issues and Recommendations */}
        {(data.issues.length > 0 || data.recommendations.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 flex-1 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">SEO Issues & Recommendations</h2>
              <div className="h-1 flex-1 bg-gradient-to-l from-green-400 to-green-600 rounded"></div>
            </div>
          <div className="grid md:grid-cols-2 gap-6">
            {data.issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {data.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          </div>
        )}

        {/* SEO Detailed Analysis */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">SEO Technical Details</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-green-400 to-green-600 rounded"></div>
          </div>
        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="meta">Meta Tags</TabsTrigger>
            <TabsTrigger value="headings">Headings</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="meta">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Title</CardTitle>
                  <CardDescription>
                    {data.title ? `${data.title.length} characters` : "Not found"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.title ? (
                    <p className="text-lg">{data.title}</p>
                  ) : (
                    <p className="text-gray-500 italic">No title tag found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meta Description</CardTitle>
                  <CardDescription>
                    {data.metaDescription ? `${data.metaDescription.length} characters` : "Not found"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.metaDescription ? (
                    <p>{data.metaDescription}</p>
                  ) : (
                    <p className="text-gray-500 italic">No meta description found</p>
                  )}
                </CardContent>
              </Card>

              {data.metaKeywords && (
                <Card>
                  <CardHeader>
                    <CardTitle>Meta Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{data.metaKeywords}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="headings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>H1 Tags ({data.headings.h1.length})</CardTitle>
                  <CardDescription>
                    {data.headings.h1.length === 1
                      ? "Perfect! One H1 tag found"
                      : data.headings.h1.length === 0
                      ? "Warning: No H1 tag found"
                      : `Warning: ${data.headings.h1.length} H1 tags found (should be 1)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.headings.h1.length > 0 ? (
                    <ul className="space-y-2">
                      {data.headings.h1.map((h1, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded">
                          {h1}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No H1 tags found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>H2 Tags ({data.headings.h2.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.headings.h2.length > 0 ? (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {data.headings.h2.map((h2, index) => (
                        <li key={index} className="p-2 bg-gray-50 rounded text-sm">
                          {h2}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No H2 tags found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>H3 Tags ({data.headings.h3.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.headings.h3.length > 0 ? (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {data.headings.h3.map((h3, index) => (
                        <li key={index} className="p-2 bg-gray-50 rounded text-sm">
                          {h3}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No H3 tags found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Link Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {data.links.internalCount}
                      </div>
                      <div className="text-sm text-gray-600">Internal Links</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {data.links.externalCount}
                      </div>
                      <div className="text-sm text-gray-600">External Links</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internal Links (showing first 50)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.links.internal.length > 0 ? (
                    <ul className="space-y-1 max-h-96 overflow-y-auto">
                      {data.links.internal.map((link, index) => (
                        <li key={index} className="text-sm text-blue-600 truncate">
                          {link}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No internal links found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>External Links (showing first 50)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.links.external.length > 0 ? (
                    <ul className="space-y-1 max-h-96 overflow-y-auto">
                      {data.links.external.map((link, index) => (
                        <li key={index} className="text-sm text-purple-600 truncate">
                          {link}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No external links found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{data.images.total}</div>
                      <div className="text-sm text-gray-600">Total Images</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{data.images.withAlt}</div>
                      <div className="text-sm text-gray-600">With Alt Text</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">{data.images.withoutAlt}</div>
                      <div className="text-sm text-gray-600">Without Alt Text</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images (showing first 20)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.images.list.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {data.images.list.map((img, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex items-start gap-2 mb-1">
                            {img.hasAlt ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{img.src}</div>
                              {img.alt ? (
                                <div className="text-sm text-gray-600 mt-1">Alt: {img.alt}</div>
                              ) : (
                                <div className="text-sm text-red-600 mt-1">No alt text</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No images found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Tags</CardTitle>
                  <CardDescription>For Facebook, LinkedIn, and other platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">OG Title</div>
                      {data.openGraph.title ? (
                        <p>{data.openGraph.title}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">OG Description</div>
                      {data.openGraph.description ? (
                        <p>{data.openGraph.description}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">OG Image</div>
                      {data.openGraph.image ? (
                        <p className="text-blue-600 truncate">{data.openGraph.image}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Tags</CardTitle>
                  <CardDescription>For Twitter/X sharing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Card Type</div>
                      {data.twitter.card ? (
                        <p>{data.twitter.card}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Twitter Title</div>
                      {data.twitter.title ? (
                        <p>{data.twitter.title}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Twitter Description</div>
                      {data.twitter.description ? (
                        <p>{data.twitter.description}</p>
                      ) : (
                        <p className="text-gray-500 italic">Not set</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        analysisContext={{
          url: data.url,
          score: data.score,
          title: data.title,
          metaDescription: data.metaDescription,
          geoAnalysis: data.geoAnalysis,
          aiInsights: data.aiInsights,
          issues: data.issues,
          recommendations: data.recommendations,
        }}
        isAuthenticated={!!session}
      />
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
