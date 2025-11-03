"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalyzeResponse = {
  url: string;
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  links: { href: string; text: string }[];
  score: number;
};

function ResultsContent() {
  const params = useSearchParams();
  const url = params.get("url") || "";
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-gray-600">{decodeURIComponent(url)}</p>
      </div>

      {loading && <p className="text-gray-600">Analyzing...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${scoreColor}`}>{data.score}</p>
              <p className="mt-2 text-sm text-gray-600">Based on presence of title, meta description, and headings.</p>
            </CardContent>
          </Card>

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
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="container py-10"><p className="text-gray-600">Loading...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}
