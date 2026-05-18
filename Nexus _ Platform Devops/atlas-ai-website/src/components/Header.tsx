import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { PlaceholderModal } from './Modal';

export const Header: React.FC = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E0E2F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-text flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">Atlas AI</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="relative text-white font-medium group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00EEFF] to-[#AA00FF] transform scale-x-100 group-hover:scale-x-110 transition-transform"></span>
              </Link>
              <Link to="/features" className="text-[#E0E0E0] hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/insights" className="text-[#E0E0E0] hover:text-white transition-colors">
                Insights
              </Link>
              <Link to="/pricing" className="text-[#E0E0E0] hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/contact" className="text-[#E0E0E0] hover:text-white transition-colors">
                Contact
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSignInModal(true)}
                className="text-[#E0E0E0] hover:text-white transition-colors"
              >
                Sign In
              </button>
              <Link to="/signup" className="glow-button px-6 py-2">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <PlaceholderModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        type="signin"
      />
    </>
  );
};
