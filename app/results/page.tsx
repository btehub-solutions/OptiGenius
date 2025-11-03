"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Sparkles, Brain, Download, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDFReport, downloadMarkdown } from "@/lib/export-utils";
import { useSession } from "next-auth/react";
import AIChatPanel from "@/components/ai-chat-panel";

type AnalyzeResponse = {
  url: string;
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  links: { href: string; text: string }[];
  score: number;
  aiInsights?: {
    summary: string;
    suggestions: string[];
  } | null;
  geoAnalysis?: {
    aiReadinessScore: number;
    entities: string[];
    aiRankingScore: number;
    readinessFactors: string[];
  } | null;
};

function ResultsContent() {
  const params = useSearchParams();
  const url = params.get("url") || "";
  const { data: session } = useSession();
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function run() {
      if (!url) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed");
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [url]);

  const scoreColor = useMemo(() => {
    const s = data?.score ?? 0;
    if (s >= 80) return "text-green-600";
    if (s >= 50) return "text-yellow-600";
    return "text-red-600";
  }, [data]);

  const geoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSaveReport = async () => {
    if (!session) {
      alert("Please sign in to save reports");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportData: data }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save report");
      }

      setSaveMessage("Report saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <main className="container py-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Results</h1>
            <p className="text-gray-600">{decodeURIComponent(url)}</p>
          </div>
          {data && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                {session && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveReport}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Report"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadMarkdown(data)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Markdown
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generatePDFReport(data)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF Report
                </Button>
              </div>
              {saveMessage && (
                <p className="text-sm text-green-600">{saveMessage}</p>
              )}
            </div>
          )}
        </div>

      {loading && <p className="text-gray-600">Analyzing...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-bold ${scoreColor}`}>{data.score}</p>
                <p className="mt-2 text-sm text-gray-600">Based on presence of title, meta description, and headings.</p>
              </CardContent>
            </Card>

            {data.geoAnalysis && (
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    GEO Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">AI-Readiness</p>
                      <p className={`text-2xl font-bold ${geoScoreColor(data.geoAnalysis.aiReadinessScore)}`}>
                        {data.geoAnalysis.aiReadinessScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">AI Ranking Score</p>
                      <p className={`text-2xl font-bold ${geoScoreColor(data.geoAnalysis.aiRankingScore)}`}>
                        {data.geoAnalysis.aiRankingScore}
                      </p>
                    </div>
                  </div>
                  
                  {data.geoAnalysis.entities && data.geoAnalysis.entities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-2">Entities Detected</p>
                      <div className="flex flex-wrap gap-2">
                        {data.geoAnalysis.entities.map((entity, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.geoAnalysis.readinessFactors && data.geoAnalysis.readinessFactors.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-2">Key Factors</p>
                      <ul className="space-y-1">
                        {data.geoAnalysis.readinessFactors.map((factor, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-700">
                            <span className="text-blue-600">•</span>
                            <span className="flex-1">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {data.aiInsights && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{data.aiInsights.summary}</p>
                </div>
                
                <div>
                  <button
                    onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                    className="flex items-center justify-between w-full font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors"
                  >
                    <span>SEO Improvement Suggestions</span>
                    {suggestionsExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {suggestionsExpanded && (
                    <ul className="space-y-2 mt-2">
                      {data.aiInsights.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 font-bold">•</span>
                          <span className="flex-1">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          )}


          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="headings">Headings</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-900 break-words">{data.title || "—"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Meta Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-900 break-words">{data.metaDescription || "—"}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="headings">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>H1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {data.headings.h1.length ? data.headings.h1.map((h, i) => <li key={i}>{h}</li>) : <li>None</li>}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>H2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {data.headings.h2.length ? data.headings.h2.map((h, i) => <li key={i}>{h}</li>) : <li>None</li>}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>H3</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {data.headings.h3.length ? data.headings.h3.map((h, i) => <li key={i}>{h}</li>) : <li>None</li>}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle>Links (first 100)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {data.links.length ? (
                      data.links.map((l, i) => (
                        <li key={i} className="break-all">
                          <a href={l.href} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {l.href}
                          </a>
                          {l.text ? <span className="text-gray-600"> — {l.text}</span> : null}
                        </li>
                      ))
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      </main>
      
      {/* AI Chat Panel */}
      <AIChatPanel analysisContext={data} />
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="container py-10"><p className="text-gray-600">Loading...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}
