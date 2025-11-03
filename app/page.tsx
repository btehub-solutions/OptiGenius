"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    const encoded = encodeURIComponent(url.trim());
    router.push(`/results?url=${encoded}`);
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center">
      <section className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Analyze Any Website SEO Instantly
        </h1>
        <p className="mt-4 text-gray-600">
          Enter a URL to get a quick overview of title, meta description, headings, and links.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex w-full items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com or www.example.com"
            type="text"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </section>
    </main>
  );
}
