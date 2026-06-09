import React from 'react';
import { Shield, Clock, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glow-card p-12 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Transform Your Marketing?
          </h2>
          
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Join thousands of marketers who are already using Atlas AI to automate their workflows,
            increase conversions, and scale their businesses with the power of artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="glow-button px-8 py-4 text-lg flex items-center gap-2">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="glow-button-outline px-8 py-4 text-lg">
              Contact Sales
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-neon-green" />
              <span className="text-[#E0E0E0]">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-neon-green" />
              <span className="text-[#E0E0E0]">24/7 Support</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-neon-green" />
              <span className="text-[#E0E0E0]">AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
