import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close the mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">🚀Atlas AI</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className={`text-gray-300 hover:text-white transition-colors ${location.pathname === '/' ? 'font-medium text-white' : ''}`}>Home</Link>
              <Link to="/features" className={`text-gray-300 hover:text-white transition-colors ${location.pathname === '/features' ? 'font-medium text-white' : ''}`}>Features</Link>
              <Link to="/insights" className={`text-gray-300 hover:text-white transition-colors ${location.pathname === '/insights' ? 'font-medium text-white' : ''}`}>Insights</Link>
              <Link to="/pricing" className={`text-gray-300 hover:text-white transition-colors ${location.pathname === '/pricing' ? 'font-medium text-white' : ''}`}>Pricing</Link>
              <Link to="/contact" className={`text-gray-300 hover:text-white transition-colors ${location.pathname === '/contact' ? 'font-medium text-white' : ''}`}>Contact</Link>
            </nav>
            
            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white font-medium transition-colors">
                Sign In
              </button>
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:bg-slate-800 transition duration-150 ease-in-out"
                aria-label="Main menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-800`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${location.pathname === '/' ? 'text-white bg-slate-800' : 'text-gray-300 hover:text-white hover:bg-slate-800'}`}>Home</Link>
              <Link to="/features" className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${location.pathname === '/features' ? 'text-white bg-slate-800' : 'text-gray-300 hover:text-white hover:bg-slate-800'}`}>Features</Link>
              <Link to="/insights" className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${location.pathname === '/insights' ? 'text-white bg-slate-800' : 'text-gray-300 hover:text-white hover:bg-slate-800'}`}>Insights</Link>
              <Link to="/pricing" className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${location.pathname === '/pricing' ? 'text-white bg-slate-800' : 'text-gray-300 hover:text-white hover:bg-slate-800'}`}>Pricing</Link>
              <Link to="/contact" className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${location.pathname === '/contact' ? 'text-white bg-slate-800' : 'text-gray-300 hover:text-white hover:bg-slate-800'}`}>Contact</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-slate-800">
              <div className="px-2 space-y-1">
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition duration-150 ease-in-out">
                  Sign In
                </button>
                <Link 
                  to="/signup"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Skip Navigation Links */}
      <div className="sr-only">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#navigation" className="skip-link">Skip to navigation</a>
        <a href="#footer" className="skip-link">Skip to footer</a>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow" id="main-content">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Sales</Link></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Enterprise</span></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Documentation</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Learning Center</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">API Reference</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Community</span></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/data-protection" className="text-gray-400 hover:text-white transition-colors">Data Protection</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold">🚀 Atlas AI</span>
              </div>
              <p className="text-gray-400 mb-4">Powered by Advanced AI Technology</p>
              <p className="text-gray-400 text-sm mb-2">All systems operational</p>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 🚀 Atlas AI. All rights reserved. Created by MiniMax Agent
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;