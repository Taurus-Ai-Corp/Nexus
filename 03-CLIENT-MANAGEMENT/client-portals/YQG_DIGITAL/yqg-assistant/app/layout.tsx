import { Public_Sans, Syne } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import Link from 'next/link';
import { PostHogProvider } from '@/components/app/posthog-provider';
import { ThemeProvider } from '@/components/app/theme-provider';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { cn } from '@/lib/shadcn/utils';
import { getAppConfig, getStyles } from '@/lib/utils';
import '@/styles/globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const commitMono = localFont({
  display: 'swap',
  variable: '--font-commit-mono',
  src: [
    {
      path: '../fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-400-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/CommitMono-700-Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);
  const styles = getStyles(appConfig);
  const { pageTitle, pageDescription, companyName, logo, logoDark } = appConfig;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        publicSans.variable,
        commitMono.variable,
        syne.variable,
        'scroll-smooth font-sans antialiased'
      )}
    >
      <head>
        {styles && <style>{styles}</style>}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* Private demo — do not index */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="theme-color" content="#0b0b0b" />
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://yqg-assistant.taurusai.io" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="YQG AI Assistant by TAURUS AI" />
        {/* Twitter Card */}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {/* Canonical */}
        <link rel="canonical" href="https://yqg-assistant.taurusai.io" />
        {/* Structured Data — static JSON-LD, no user input */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'YQG AI Assistant',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              url: 'https://yqg-assistant.taurusai.io',
              description: pageDescription,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: {
                '@type': 'Organization',
                name: 'TAURUS AI Corp',
                url: 'https://taurusai.io',
              },
            }),
          }}
        />
      </head>
      <body className="obsidian-grain overflow-x-hidden">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Ambient orb — always present behind all content */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(217,179,119,0.055) 0%, rgba(217,179,119,0.02) 40%, transparent 70%)',
                animation: 'yqg-glow-breathe 6s ease-in-out infinite',
              }}
            />

            {/* Mobile header — shown only below md breakpoint */}
            <header className="fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between px-5 py-4 md:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={`${companyName} Logo`} className="block size-5 dark:hidden" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoDark ?? logo}
                  alt={`${companyName} Logo`}
                  className="hidden size-5 dark:block"
                />
                <span
                  className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase"
                  style={{
                    background: 'linear-gradient(90deg, #b88a3d, #d9b377)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  YQG
                </span>
              </Link>
              <ThemeToggle />
            </header>

            {/* Desktop header */}
            <header className="fixed top-0 left-0 z-50 hidden w-full flex-row items-center justify-between px-8 py-5 md:flex">
              {/* Left: Logo + wordmark */}
              <Link
                href="/"
                className="group flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={`${companyName} Logo`} className="block size-6 dark:hidden" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoDark ?? logo}
                  alt={`${companyName} Logo`}
                  className="hidden size-6 dark:block"
                />
                <span
                  className="font-mono text-xs font-bold tracking-[0.22em] uppercase"
                  style={{
                    background: 'linear-gradient(90deg, #b88a3d, #d9b377)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  YQG
                </span>
              </Link>

              {/* Right: Company + theme toggle */}
              <div className="flex items-center gap-6">
                <span
                  className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.2em] uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Built by TAURUS AI Corp
                </span>
                <div className="h-3 w-px" style={{ background: 'rgba(184, 138, 61, 0.25)' }} />
                <ThemeToggle />
              </div>
            </header>

            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
