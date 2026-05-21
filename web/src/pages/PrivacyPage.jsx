import { ThemeToggle } from '../components/luxury';

const PrivacyPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>Privacy Policy</h1>
        <ThemeToggle />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>Last updated: May 16, 2026</p>

      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>1. Introduction</h2>
          <p>TAURUS AI CORP - FZCO ("we," "our," or "us") operates the Nexus Social Suite Dashboard. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. We are committed to protecting your privacy in compliance with UAE data protection laws and international best practices.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>2. Information We Collect</h2>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>2.1 Account Information</h3>
          <p>When you create an account, we collect your email address and a hashed password. We do not store plaintext passwords.</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>2.2 Usage Data</h3>
          <p>We collect analytics data about how you interact with the Service, including page views, feature usage, and session duration. This data is collected via PostHog analytics.</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>2.3 Content</h3>
          <p>Campaign data, social media posts, and AI-generated content you create within the Service are stored securely. We do not use your content to train AI models.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>3. How We Use Your Information</h2>
          <p>We use collected information to: (a) provide, operate, and maintain the Service; (b) process transactions and send related information; (c) improve and personalize your experience; (d) monitor usage patterns and analytics; (e) detect and prevent fraud or abuse.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>4. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information. We may share data with: (a) service providers who assist in operating the Service (hosting, analytics); (b) law enforcement when required by law; (c) in connection with a merger, acquisition, or sale of assets (with notice).</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>5. Data Security</h2>
          <p>We implement industry-standard security measures including JWT authentication, HTTPS encryption, password hashing (bcrypt), and secure session management. While we strive to protect your data, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>6. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. Upon account deletion, your personal data will be removed within 30 days. Analytics data is anonymized after 12 months.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>7. Your Rights</h2>
          <p>You have the right to: (a) access your personal data; (b) correct inaccurate data; (c) request deletion of your data; (d) export your data in a portable format; (e) opt out of analytics tracking. Contact us at <a href="mailto:admin@taurusai.io" style={{ color: 'var(--accent-start)' }}>admin@taurusai.io</a> to exercise these rights.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>8. Cookies and Tracking</h2>
          <p>The Service uses essential cookies for authentication and session management. We use PostHog for analytics, which may set cookies. You can disable analytics cookies via your browser settings or by opting out within the Service.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>9. Third-Party Links</h2>
          <p>The Service may contain links to third-party websites (e.g., Meta, Instagram). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>10. Children's Privacy</h2>
          <p>The Service is not intended for individuals under 16. We do not knowingly collect personal information from children. If you believe we have, please contact us immediately.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated "Last updated" date.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>12. Cookie Policy</h2>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>12.1 What Are Cookies</h3>
          <p>Cookies are small text files stored on your device when you visit our Service. They help us provide a secure, personalized experience.</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>12.2 Cookies We Use</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, marginBottom: 16 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--text-primary)' }}>Cookie</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--text-primary)' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--text-primary)' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--text-primary)' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>access_token</td>
                <td style={{ padding: '8px 0' }}>Essential</td>
                <td style={{ padding: '8px 0' }}>15 min</td>
                <td style={{ padding: '8px 0' }}>JWT authentication</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>refresh_token</td>
                <td style={{ padding: '8px 0' }}>Essential</td>
                <td style={{ padding: '8px 0' }}>7 days</td>
                <td style={{ padding: '8px 0' }}>Session persistence</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>theme</td>
                <td style={{ padding: '8px 0' }}>Functional</td>
                <td style={{ padding: '8px 0' }}>1 year</td>
                <td style={{ padding: '8px 0' }}>Dark/light mode preference</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>ph_*</td>
                <td style={{ padding: '8px 0' }}>Analytics</td>
                <td style={{ padding: '8px 0' }}>12 months</td>
                <td style={{ padding: '8px 0' }}>PostHog session tracking</td>
              </tr>
            </tbody>
          </table>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>12.3 Managing Cookies</h3>
          <p>You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in. Analytics cookies can be disabled without affecting core functionality.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>13. Contact</h2>
          <p>Questions about this Privacy Policy or our Cookie Policy? Contact us at <a href="mailto:admin@taurusai.io" style={{ color: 'var(--accent-start)' }}>admin@taurusai.io</a></p>
          <p style={{ marginTop: 8 }}>TAURUS AI CORP - FZCO | License #68122, IFZA Dubai</p>
        </section>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginTop: 48 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>Neo<span style={{ color: 'var(--accent-start)' }}>sync</span>™</p>
        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>TAURUS AI CORP - FZCO | License #68122, IFZA Dubai</p>
      </div>
    </div>
  </div>
);

export default PrivacyPage;
