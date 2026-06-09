import React from 'react';
import { Shield, Eye, Database, UserCheck } from 'lucide-react';
import { Footer } from '../components/Footer';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-6">Privacy Policy</h1>
            <p className="text-xl text-[#E0E0E0]">Last updated: January 1, 2025</p>
          </div>
          
          <div className="glow-card p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-neon-green" />
                Information We Collect
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-neon-green" />
                How We Use Your Information
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Database className="w-6 h-6 text-neon-green" />
                Data Security
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-neon-green" />
                Your Rights
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                You have the right to access, update, or delete your personal information. Contact us if you would like to exercise these rights.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
