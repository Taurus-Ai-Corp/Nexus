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

// Helvetica Neue Thin — editorial body (.ttf supported by next/font/local)
// Didot is loaded via @font-face in globals.css; --font-heading set in tokens.css
const helveticaThin = localFont({
  src: "../../public/fonts/HelveticaNeue-Thin.ttf",
  variable: "--font-body",
  weight: "100",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Mater Maria Wellness Homes - AI-Powered Smart Living in Kottayam, Kerala",
    template: "%s | Mater Maria Wellness Homes",
  },
  description:
    "Kerala's first AI-powered net-zero wellness estate. Smart homes, IoT health monitoring, organic orchards, and a happening community — open to all ages. Kanjirappally, Kottayam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${helveticaThin.variable} font-body antialiased`}>
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
