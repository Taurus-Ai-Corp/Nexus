import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { GlobalWidgets } from "@/components/layout/GlobalWidgets";
import "./globals.css";

// Garabosse — French Renaissance Garalde (self-hosted, OFL license)
// 5 weights: Perle (100) → Nonpareil (300) → Mignon (400) → Gaillard (600) → Parangon (700)
const garabosse = localFont({
  src: [
    { path: "../../public/fonts/garabosse/Garabosse-Perle.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/garabosse/Garabosse-Nonpareil.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/garabosse/Garabosse-Mignon.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/garabosse/Garabosse-Gaillard.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/garabosse/Garabosse-Parangon.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Mater Maria Homes - AI-Powered Smart Living in Kottayam, Kerala",
    template: "%s | Mater Maria Homes",
  },
  description:
    "Kerala's first AI-powered net-zero wellness estate. Smart homes, IoT health monitoring, organic orchards, and a happening community — open to all ages. Kanjirappally, Kottayam.",
  metadataBase: new URL("https://matermariahomes.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Mater Maria Homes",
    title: "Mater Maria Homes - AI-Powered Smart Living in Kerala",
    description:
      "90 premium residences in Kanjirappally, Kottayam. 100% solar, 24/7 medical care, organic orchards, AI-powered smart homes.",
    images: [{ url: "/assets-2025/images/hero-slides/mmh-kmg-a006.webp", width: 1200, height: 630, alt: "Mater Maria Homes estate aerial view" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mater Maria Homes - Kerala's Premier Wellness Estate",
    description:
      "90 premium residences in Kanjirappally. Solar-powered, AI healthcare, organic living.",
    images: ["/assets-2025/images/hero-slides/mmh-kmg-a006.webp"],
  },
  alternates: {
    canonical: "https://matermariahomes.com",
  },
  keywords: [
    "Mater Maria Homes",
    "retirement homes Kerala",
    "senior living Kottayam",
    "NRI investment Kerala",
    "wellness estate India",
    "AI-powered homes Kerala",
    "net-zero estate Kerala",
    "Kanjirappally retirement",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${garabosse.variable} font-body antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-default focus:px-4 focus:py-2 focus:text-text-inverse"
        >
          Skip to content
        </a>
        <PostHogProvider />
        <JsonLd />
        <ThemeProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
            <GlobalWidgets />
            <div className="grain-overlay" aria-hidden="true" />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
