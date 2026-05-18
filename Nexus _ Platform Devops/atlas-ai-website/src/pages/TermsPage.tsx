import React from 'react';
import { Shield, FileText, Lock, Globe } from 'lucide-react';
import { Footer } from '../components/Footer';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-6">Terms of Service</h1>
            <p className="text-xl text-[#E0E0E0]">Last updated: January 1, 2025</p>
          </div>
          
          <div className="glow-card p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-neon-green" />
                1. Acceptance of Terms
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                By accessing and using Atlas AI ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-neon-green" />
                2. Use License
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                Permission is granted to temporarily access Atlas AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-neon-green" />
                3. Disclaimer
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                The materials on Atlas AI are provided on an 'as is' basis. Atlas AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Globe className="w-6 h-6 text-neon-green" />
                4. Limitations
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                In no event shall Atlas AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption).
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
