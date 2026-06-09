import React from 'react';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';
import { Footer } from '../components/Footer';

export const DataProtectionPage: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-6">Data Protection</h1>
            <p className="text-xl text-[#E0E0E0]">Last updated: January 1, 2025</p>
          </div>
          
          <div className="glow-card p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-neon-green" />
                Our Commitment to Data Protection
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                At Atlas AI, we are committed to protecting your personal data and ensuring compliance with applicable data protection laws, including GDPR and CCPA.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-neon-green" />
                Data Security Measures
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We implement industry-standard security measures including encryption, secure data transmission, and regular security audits to protect your information.
              </p>
              <ul className="space-y-2 text-[#E0E0E0]">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  End-to-end encryption for data transmission
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  Regular security audits and penetration testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  SOC 2 Type II compliance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  Multi-factor authentication for account access
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-neon-green" />
                Your Data Rights
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                Under applicable data protection laws, you have several rights regarding your personal data:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Right to Access</h4>
                  <p className="text-[#E0E0E0] text-sm">Request access to your personal data</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Right to Rectification</h4>
                  <p className="text-[#E0E0E0] text-sm">Request correction of inaccurate data</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Right to Erasure</h4>
                  <p className="text-[#E0E0E0] text-sm">Request deletion of your data</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Right to Portability</h4>
                  <p className="text-[#E0E0E0] text-sm">Request transfer of your data</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-neon-green" />
                Data Processing Legal Basis
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We process your personal data based on legitimate interests, contract performance, legal obligations, or your consent, depending on the specific purpose.
              </p>
            </div>
            
            <div className="glow-card-green p-6 mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Contact Our Data Protection Officer</h3>
              <p className="text-[#E0E0E0] mb-4">
                If you have any questions about data protection or want to exercise your rights, contact our Data Protection Officer:
              </p>
              <p className="text-white font-semibold">dpo@atlasai.com</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
