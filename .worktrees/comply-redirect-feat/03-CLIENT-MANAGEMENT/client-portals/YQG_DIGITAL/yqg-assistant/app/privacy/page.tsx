import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — YQG AI Assistant',
  description: 'Privacy Policy for the YQG AI Assistant by TAURUS AI Corp.',
};

export default function PrivacyPage() {
  const lastUpdated = '2026-03-11';

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24 md:py-32">
      <div className="space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p
            className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase"
            style={{ color: 'rgba(217, 179, 119, 0.6)' }}
          >
            Legal
          </p>
          <h1
            className="font-syne text-4xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f0ece0 30%, rgba(240,236,224,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Privacy Policy
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(240, 236, 224, 0.35)' }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, rgba(217,179,119,0.2), transparent)' }}
        />

        {/* Content */}
        <div
          className="prose prose-invert max-w-none space-y-8 text-sm leading-7"
          style={{ color: 'rgba(240, 236, 224, 0.65)' }}
        >
          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              1. Overview
            </h2>
            <p>
              The YQG AI Assistant is operated by TAURUS AI Corp on behalf of YQG Digital Inc.
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). This Privacy Policy explains
              how we collect, use, and protect information when you use the the Service Voice Intelligence
              Platform (&ldquo;Service&rdquo;).
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              2. Information We Collect
            </h2>
            <p>
              <strong style={{ color: 'rgba(240,236,224,0.85)' }}>Voice Data:</strong> Audio
              captured during voice sessions is processed in real-time for speech recognition and
              response generation. Audio is not stored on our servers beyond the duration of your
              active session.
            </p>
            <p>
              <strong style={{ color: 'rgba(240,236,224,0.85)' }}>Session Data:</strong> We may
              collect anonymized session metadata (session duration, interaction counts) for service
              improvement. No personally identifiable information is linked to this data.
            </p>
            <p>
              <strong style={{ color: 'rgba(240,236,224,0.85)' }}>Technical Data:</strong> Standard
              server logs may include IP addresses, browser type, and request timestamps, retained
              for up to 30 days for security and debugging purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              3. Third-Party Services
            </h2>
            <p>The Service uses the following third-party providers:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong style={{ color: 'rgba(240,236,224,0.8)' }}>LiveKit</strong> — WebRTC
                infrastructure for real-time audio streaming
              </li>
              <li>
                <strong style={{ color: 'rgba(240,236,224,0.8)' }}>Groq</strong> — LLM inference for
                AI responses
              </li>
              <li>
                <strong style={{ color: 'rgba(240,236,224,0.8)' }}>Vercel</strong> — Frontend
                hosting and edge network
              </li>
            </ul>
            <p>
              Each provider is bound by their own privacy policies and data processing agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              4. Data Retention &amp; Security
            </h2>
            <p>
              Voice session data is ephemeral — discarded when your session ends. We implement
              industry-standard security measures including HTTPS/TLS encryption in transit and
              security headers on all responses.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              5. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete your
              data. Contact us at{' '}
              <a
                href="mailto:admin@taurusai.io"
                style={{ color: '#d9b377' }}
                className="transition-opacity hover:opacity-70"
              >
                admin@taurusai.io
              </a>{' '}
              to exercise these rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              6. Contact
            </h2>
            <p>
              For privacy inquiries, contact TAURUS AI Corp at{' '}
              <a
                href="mailto:admin@taurusai.io"
                style={{ color: '#d9b377' }}
                className="transition-opacity hover:opacity-70"
              >
                admin@taurusai.io
              </a>
              .
            </p>
          </section>
        </div>

        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(217,179,119,0.2))' }}
        />

        <Link
          href="/"
          className="font-mono text-xs transition-opacity hover:opacity-70"
          style={{ color: 'rgba(217, 179, 119, 0.6)' }}
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}
