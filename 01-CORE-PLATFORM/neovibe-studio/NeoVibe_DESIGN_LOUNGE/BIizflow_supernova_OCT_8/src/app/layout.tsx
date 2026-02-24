import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BizFlow™ - AI-Powered Business Automation',
  description: 'Automate workflows, predict trends, and make smarter decisions with BizFlow\'s cutting-edge AI platform. Deploy 11 specialized AI agents for complete business automation.',
  keywords: ['AI automation', 'business intelligence', 'workflow automation', 'predictive analytics', 'AI agents'],
  authors: [{ name: 'BizFlow Team' }],
  creator: 'BizFlow',
  publisher: 'Taurus AI Corp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bizflow.taurusai.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BizFlow™ - AI-Powered Business Automation',
    description: 'Automate workflows, predict trends, and make smarter decisions with BizFlow\'s cutting-edge AI platform.',
    url: 'https://bizflow.taurusai.io',
    siteName: 'BizFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizFlow™ - AI-Powered Business Automation',
    description: 'Automate workflows, predict trends, and make smarter decisions with BizFlow\'s cutting-edge AI platform.',
    creator: '@bizflow_ai',
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
      </head>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

