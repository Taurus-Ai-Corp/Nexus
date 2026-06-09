import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ 
  variable: "--font-sans", 
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAURUS AI Partnership | Zero-Cost Integration",
  description: "Scale your agency without losing your personal touch. AI-powered execution, zero upfront cost.",
  openGraph: {
    title: "TAURUS AI Partnership | Zero-Cost Integration",
    description: "Scale your agency without losing your personal touch.",
    url: "https://yqg-partnership-pitch.vercel.app",
    siteName: "TAURUS AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}