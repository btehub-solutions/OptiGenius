import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OptiGenius - Analyze Any Website SEO Instantly",
  description: "Analyze Any Website SEO Instantly. Get instant insights on title tags, meta descriptions, headings, and links. Free SEO analysis tool.",
  keywords: ["SEO", "SEO analysis", "website analyzer", "meta tags", "SEO tool"],
  authors: [{ name: "OptiGenius" }],
  creator: "OptiGenius",
  openGraph: {
    title: "OptiGenius - Analyze Any Website SEO Instantly",
    description: "Get instant SEO insights for any website. Analyze title tags, meta descriptions, headings, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptiGenius - Analyze Any Website SEO Instantly",
    description: "Get instant SEO insights for any website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
