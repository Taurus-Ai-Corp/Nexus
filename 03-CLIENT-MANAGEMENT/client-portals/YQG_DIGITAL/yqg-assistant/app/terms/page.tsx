import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — YQG AI Assistant',
  description: 'Terms of Service for the YQG AI Assistant by TAURUS AI Corp.',
};

export default function TermsPage() {
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
            Terms of Service
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
              1. Acceptance
            </h2>
            <p>
              By accessing or using the YQG AI Assistant (&ldquo;Service&rdquo;),
              operated by TAURUS AI Corp (&ldquo;Company&rdquo;), you agree to these Terms of
              Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              2. Use of Service
            </h2>
            <p>You may use the Service for lawful purposes only. You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use the Service for any unlawful, harmful, or abusive purpose</li>
              <li>Attempt to reverse-engineer, disrupt, or circumvent any security measures</li>
              <li>Use automated systems to overload or abuse the Service</li>
              <li>Transmit content that is illegal, defamatory, or violates third-party rights</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              3. Open Source
            </h2>
            <p>
              the Service is open-source software. The source code is available under its respective
              license. These Terms govern the hosted Service only, not your use of the source code
              under its open-source license.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              4. Disclaimers
            </h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED. TAURUS AI Corp DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
            <p>
              AI-generated responses are not guaranteed to be accurate, complete, or appropriate for
              any specific purpose. Do not rely on AI responses for medical, legal, financial, or
              safety-critical decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              5. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAURUS AI Corp SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR
              USE OF OR INABILITY TO USE THE SERVICE.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Service
              after changes constitutes acceptance of the revised Terms. We will update the
              &ldquo;Last updated&rdquo; date above when changes are made.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              7. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the applicable jurisdiction where TAURUS AI
              Corp operates. Any disputes shall be resolved through binding arbitration or the
              courts of that jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="font-syne text-lg font-semibold"
              style={{ color: 'rgba(240, 236, 224, 0.9)' }}
            >
              8. Contact
            </h2>
            <p>
              Questions about these Terms? Contact us at{' '}
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
