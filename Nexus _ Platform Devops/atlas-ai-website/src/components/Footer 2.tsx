import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E0E2F] border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-text flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">Atlas AI</span>
            </Link>
            <p className="text-[#E0E0E0] text-sm max-w-xs">
              The most advanced AI automation platform for modern marketing teams.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Platform</h4>
            <div className="space-y-2">
              <Link to="/features" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link to="/pricing" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Pricing
              </Link>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Integrations
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Templates
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Enterprise
              </a>
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Resources</h4>
            <div className="space-y-2">
              <Link to="/insights" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Insights
              </Link>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Documentation
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Learning Center
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                API Reference
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Community
              </a>
              <a href="#" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Support
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Company</h4>
            <div className="space-y-2">
              <Link to="/contact" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Contact
              </Link>
              <Link to="/terms" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link to="/data-protection" className="block text-[#E0E0E0] hover:text-white transition-colors text-sm">
                Data Protection
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#E0E0E0] text-sm">
            2025 Atlas AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p className="text-[#E0E0E0] text-sm">
              Powered by Advanced AI Technology
            </p>
            <span className="text-[#E0E0E0] text-sm">•</span>
            <p className="text-[#E0E0E0] text-sm">
              Created by MiniMax Agent
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
