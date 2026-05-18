import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    template: "%s | Atlas AI",
    default: "Atlas AI - AI-Powered Marketing Automation Platform"
  },
  description: "Transform your marketing with AI-powered automation. Create campaigns 10x faster with 60+ templates and 25+ AI agents. Start your free trial today.",
  keywords: ["AI marketing", "marketing automation", "AI campaigns", "digital marketing", "marketing tools"],
  authors: [{ name: "Atlas AI" }],
  creator: "Atlas AI",
  publisher: "Atlas AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://atlas-ai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Atlas AI - AI-Powered Marketing Automation",
    description: "Transform your marketing with AI-powered automation. Create campaigns 10x faster.",
    url: "https://atlas-ai.vercel.app",
    siteName: "Atlas AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas AI - AI-Powered Marketing Automation",
    description: "Transform your marketing with AI-powered automation. Create campaigns 10x faster.",
    creator: "@atlasai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white min-h-screen antialiased">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}