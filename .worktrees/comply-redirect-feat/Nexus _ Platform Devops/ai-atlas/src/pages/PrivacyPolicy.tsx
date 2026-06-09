import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import { updatePageSEO, pageSEOConfigs, applySecurityHeaders } from '../utils/seoUtils';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy - Atlas AI Data Protection & Privacy',
      description: 'Atlas AI Privacy Policy - Learn how we collect, use, and protect your data. GDPR compliant privacy practices and your data rights.',
      keywords: 'privacy policy, data protection, GDPR, data rights, privacy practices'
    });
    applySecurityHeaders();
  }, []);

  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dgsm-secondary via-dgsm-primary to-dgsm-secondary py-20">
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-dgsm-accent-blue hover:text-dgsm-accent-purple transition-colors mb-8 focus:ring-2 focus:ring-blue-300 focus:outline-none rounded"
              aria-label="Return to Atlas AI homepage"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to 🚀 Atlas AI
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dgsm-text-primary">
              Privacy Policy
            </h1>
            <p className="text-xl text-dgsm-text-secondary">
              Last updated: June 6, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-dgsm-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">1. Introduction</h2>
            <p className="text-dgsm-text-secondary mb-6">
              🚀 Atlas AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our marketing automation platform and services. 
              This policy applies to all users of 🚀 Atlas AI services worldwide and complies with GDPR, CCPA, and other applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.1 Information You Provide Directly</h3>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, company details, billing information</li>
              <li><strong>Profile Data:</strong> Professional information, preferences, and settings</li>
              <li><strong>Communication Data:</strong> Messages, support tickets, feedback, and survey responses</li>
              <li><strong>Marketing Content:</strong> Campaign data, customer lists, and marketing materials you upload</li>
              <li><strong>Payment Information:</strong> Credit card details, billing addresses (processed securely via third-party providers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.2 Information We Collect Automatically</h3>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Location Data:</strong> IP address, country, city (for compliance and security purposes)</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.3 Third-Party Integrations</h3>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Google OAuth:</strong> Profile information when you sign in with Google</li>
              <li><strong>Analytics:</strong> Google Analytics for usage statistics and performance monitoring</li>
              <li><strong>Customer Support:</strong> Information from support platforms and communication tools</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Service Provision:</strong> Operating and maintaining our platform and services</li>
              <li><strong>Account Management:</strong> Creating accounts, processing payments, providing support</li>
              <li><strong>Communication:</strong> Sending updates, security alerts, and promotional materials (with consent)</li>
              <li><strong>Improvement:</strong> Analyzing usage to enhance features and user experience</li>
              <li><strong>Security:</strong> Detecting fraud, preventing abuse, ensuring platform security</li>
              <li><strong>Legal Compliance:</strong> Meeting regulatory requirements and legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">4. Cookie Policy</h2>
            <p className="text-dgsm-text-secondary mb-4">
              We use cookies and similar technologies to enhance your experience. Our cookie usage includes:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic platform functionality (cannot be disabled)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform (Google Analytics)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Track campaign performance and user engagement (with consent)</li>
            </ul>
            <p className="text-dgsm-text-secondary mb-6">
              You can manage cookie preferences through our cookie consent banner or your browser settings. 
              Disabling certain cookies may limit platform functionality.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">5. Data Sharing and Disclosure</h2>
            <p className="text-dgsm-text-secondary mb-4">We do not sell your personal information. We may share data in these limited circumstances:</p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Service Providers:</strong> Trusted third parties that help us operate our platform (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business assets</li>
              <li><strong>Consent:</strong> When you explicitly consent to sharing with specific third parties</li>
              <li><strong>Security:</strong> To protect our users, platform, or public safety</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">6. Your Rights (GDPR & CCPA)</h2>
            <p className="text-dgsm-text-secondary mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information (right to be forgotten)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="text-dgsm-text-secondary mb-6">
              To exercise these rights, contact us at <strong>privacy@atlasai.io</strong>. We will respond within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">7. Data Security</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We implement industry-standard security measures including encryption in transit and at rest, 
              access controls, regular security audits, and secure data centers. However, no method of 
              transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">8. International Data Transfers</h2>
            <p className="text-dgsm-text-secondary mb-6">
              Your data may be transferred to and processed in countries outside your residence. We ensure 
              adequate protection through standard contractual clauses and other appropriate safeguards 
              compliant with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">9. Contact Information</h2>
            <div className="bg-dgsm-secondary/20 p-6 rounded-lg mb-6">
              <p className="text-dgsm-text-secondary mb-2"><strong>Data Protection Officer:</strong> privacy@atlasai.io</p>
              <p className="text-dgsm-text-secondary mb-2"><strong>General Inquiries:</strong> support@atlasai.io</p>
              <p className="text-dgsm-text-secondary mb-2"><strong>Mailing Address:</strong> Atlas AI, Privacy Department, [Address]</p>
              <p className="text-dgsm-text-secondary"><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
            </div>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">10. Updates to This Policy</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We may update this Privacy Policy periodically. We will notify you of significant changes via 
              email or platform notification. Continued use of our services constitutes acceptance of the updated policy.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
