import { ThemeToggle } from '../components/luxury';

const TermsPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>Terms of Service</h1>
        <ThemeToggle />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>Last updated: May 16, 2026</p>

      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using NeoSync™ Social Suite Dashboard ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>2. Description of Service</h2>
          <p>NeoSync™ is an AI-powered social media management platform that provides campaign management, content generation, and multi-platform orchestration. The Service is provided by TAURUS AI CORP - FZCO (License #68122, IFZA Dubai).</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities under your account. Notify us immediately of any unauthorized access.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>4. Acceptable Use</h2>
          <p>You may not use the Service to: (a) violate any applicable law or regulation; (b) infringe on third-party intellectual property rights; (c) transmit harmful or malicious code; (d) attempt unauthorized access to any portion of the Service; (e) use the Service for spam or unsolicited communications.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>5. Intellectual Property</h2>
          <p>All content, features, and functionality of the Service — including text, graphics, logos, and software — are owned by TAURUS AI CORP - FZCO and protected by intellectual property laws. You retain ownership of content you create using the Service.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>6. Pricing and Payments</h2>
          <p>The Service offers free and paid tiers. Paid subscriptions are billed in advance on a monthly basis. Refunds are provided at our discretion within 14 days of purchase. We reserve the right to modify pricing with 30 days' notice.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, TAURUS AI CORP - FZCO shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>8. Termination</h2>
          <p>We may suspend or terminate your access at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will cease immediately.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>9. Governing Law</h2>
          <p>These Terms are governed by the laws of the United Arab Emirates (Dubai). Any disputes shall be resolved in the courts of Dubai, UAE.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>10. Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:admin@taurusai.io" style={{ color: 'var(--accent-start)' }}>admin@taurusai.io</a></p>
        </section>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginTop: 48 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>Neo<span style={{ color: 'var(--accent-start)' }}>sync</span>™</p>
        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>TAURUS AI CORP - FZCO | License #68122, IFZA Dubai</p>
      </div>
    </div>
  </div>
);

export default TermsPage;
