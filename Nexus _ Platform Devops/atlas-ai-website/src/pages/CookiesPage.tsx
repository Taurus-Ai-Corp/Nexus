import React from 'react';
import { Cookie, Settings, BarChart3, Shield } from 'lucide-react';
import { Footer } from '../components/Footer';

export const CookiesPage: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-6">Cookie Policy</h1>
            <p className="text-xl text-[#E0E0E0]">Last updated: January 1, 2025</p>
          </div>
          
          <div className="glow-card p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Cookie className="w-6 h-6 text-neon-green" />
                What Are Cookies?
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings className="w-6 h-6 text-neon-green" />
                How We Use Cookies
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                We use cookies to remember your preferences, analyze site traffic, and improve our services. This helps us provide you with a personalized experience.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-neon-green" />
                Types of Cookies
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-neon-green pl-4">
                  <h4 className="font-semibold text-white">Essential Cookies</h4>
                  <p className="text-[#E0E0E0] text-sm">Required for the website to function properly</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-white">Analytics Cookies</h4>
                  <p className="text-[#E0E0E0] text-sm">Help us understand how visitors interact with our site</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-white">Marketing Cookies</h4>
                  <p className="text-[#E0E0E0] text-sm">Used to deliver relevant ads and track campaign performance</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-neon-green" />
                Managing Cookies
              </h2>
              <p className="text-[#E0E0E0] leading-relaxed">
                You can control and manage cookies through your browser settings. However, disabling cookies may affect your experience on our website.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
