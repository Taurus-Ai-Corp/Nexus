import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PostHogProvider } from '@/lib/posthog';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// JSON-LD Structured Data for Organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BizFlow by Taurus AI',
  url: 'https://bizflow.taurusai.io',
  logo: 'https://bizflow.taurusai.io/logo.png',
  description: 'AI-Powered Business Intelligence Automation Platform with 11 specialized AI agents for complete business automation.',
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+971-50-123-4567',
    contactType: 'customer service',
    availableHours: 'Mo-Fr 09:00-18:00 GST',
  },
  sameAs: [
    'https://twitter.com/bizflow_ai',
    'https://linkedin.com/company/bizflow-ai',
  ],
  potentialAction: {
    '@type': 'UseAction',
    target: 'https://bizflow.taurusai.io/#contact',
    name: 'Get Started',
  },
};

export const metadata: Metadata = {
  title: {
    default: 'Nexus — Social Media Management by Taurus AI',
    template: '%s | Nexus',
  },
  description: 'Everything connected. Social media, marketing, analytics.',
  keywords: ['AI automation', 'business intelligence', 'workflow automation', 'predictive analytics', 'AI agents', 'business automation', 'enterprise AI'],
  authors: [{ name: 'BizFlow Team', url: 'https://taurusai.io' }],
  creator: 'Taurus AI Corp',
  publisher: 'Taurus AI Corp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bizflow.taurusai.io'),
  alternates: {
    canonical: '/',
    languages: {
      'en': 'https://bizflow.taurusai.io',
    },
  },
  openGraph: {
    title: 'BizFlow™ - AI-Powered Business Automation',
    description: 'Automate workflows, predict trends, and make smarter decisions with BizFlow\'s cutting-edge AI platform.',
    url: 'https://bizflow.taurusai.io',
    siteName: 'BizFlow',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://bizflow.taurusai.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BizFlow™ - AI-Powered Business Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizFlow™ - AI-Powered Business Automation',
    description: 'Automate workflows, predict trends, and make smarter decisions with BizFlow\'s cutting-edge AI platform.',
    creator: '@bizflow_ai',
    images: ['https://bizflow.taurusai.io/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}

