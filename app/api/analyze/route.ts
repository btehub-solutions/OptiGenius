import type { NextRequest } from "next/server";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

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

    const payload = {
      url,
      title,
      metaDescription,
      headings,
      links: links.slice(0, 100),
      score,
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
