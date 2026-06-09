import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dgsm-secondary via-dgsm-primary to-dgsm-secondary py-20">
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-dgsm-accent-blue hover:text-dgsm-accent-purple transition-colors mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to 🚀 Atlas AI
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dgsm-text-primary">
              Terms of Service
            </h1>
            <p className="text-xl text-dgsm-text-secondary">
              Last updated: June 2, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-dgsm-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">1. Acceptance of Terms</h2>
            <p className="text-dgsm-text-secondary mb-6">
              By accessing and using 🚀 Atlas AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              These Terms of Service constitute a legally binding agreement between you and 🚀 Atlas AI regarding your use of our marketing automation platform.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">2. Description of Service</h2>
            <p className="text-dgsm-text-secondary mb-4">
              🚀 Atlas AI is an AI-powered marketing automation platform that provides:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Advanced campaign management and optimization tools</li>
              <li>AI-powered analytics and predictive insights</li>
              <li>Intelligent content management and personalization</li>
              <li>Comprehensive automation suite for marketing workflows</li>
              <li>Third-party integrations with marketing tools and platforms</li>
              <li>Real-time performance monitoring and reporting</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">3. User Accounts and Registration</h2>
            <p className="text-dgsm-text-secondary mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">4. Acceptable Use Policy</h2>
            <p className="text-dgsm-text-secondary mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Send spam, unsolicited communications, or fraudulent content</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Use the Service for any illegal or unethical marketing practices</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">5. Data and Privacy</h2>
            <p className="text-dgsm-text-secondary mb-6">
              Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, 
              explains how we collect, use, and protect your information. By using the Service, you consent to our data 
              practices as described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">6. Intellectual Property Rights</h2>
            <p className="text-dgsm-text-secondary mb-4">
              The Service and its original content, features, and functionality are owned by 🚀 Atlas AI and are protected by:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Copyright, trademark, patent, trade secret, and other intellectual property laws</li>
              <li>International copyright laws and treaty provisions</li>
              <li>Other proprietary rights and applicable laws</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">7. Payment Terms and Billing</h2>
            <p className="text-dgsm-text-secondary mb-4">
              For paid services:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Subscription fees are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>Price changes will be communicated 30 days in advance</li>
              <li>Failure to pay may result in service suspension or termination</li>
              <li>You are responsible for all taxes associated with your use of the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">8. Service Availability and Modifications</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We reserve the right to 
              modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice 
              for significant changes that may affect your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">9. Limitation of Liability</h2>
            <p className="text-dgsm-text-secondary mb-6">
              To the maximum extent permitted by law, 🚀 Atlas AI shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including without limitation, loss of profits, data, use, 
              goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">10. Indemnification</h2>
            <p className="text-dgsm-text-secondary mb-6">
              You agree to defend, indemnify, and hold harmless 🚀 Atlas AI from and against any claims, damages, costs, 
              and expenses (including attorneys' fees) arising from or related to your use of the Service or violation 
              of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">11. Termination</h2>
            <p className="text-dgsm-text-secondary mb-6">
              Either party may terminate this agreement at any time. Upon termination, your right to use the Service 
              will cease immediately. Provisions that by their nature should survive termination shall survive, 
              including payment obligations, warranty disclaimers, and limitations of liability.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">12. Governing Law and Dispute Resolution</h2>
            <p className="text-dgsm-text-secondary mb-6">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising 
              from these Terms or your use of the Service shall be resolved through binding arbitration, except where 
              prohibited by law.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">13. Changes to Terms</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email 
              or through the Service. Your continued use of the Service after such modifications constitutes acceptance 
              of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">14. Contact Information</h2>
            <p className="text-dgsm-text-secondary mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-dgsm-secondary/50 border border-dgsm-border p-6 rounded-lg text-dgsm-text-secondary">
              <p className="text-dgsm-text-primary"><strong>🚀 Atlas AI Legal Department</strong></p>
              <p>Email: <span className="text-dgsm-accent-blue">legal@atlasai.com</span></p>
              <p>Address: Silicon Valley Innovation Center, CA</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
