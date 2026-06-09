import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Atlas AI</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/' ? 'font-medium text-blue-600' : ''}`}>Home</Link>
              <Link to="/analytics" className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/analytics' ? 'font-medium text-blue-600' : ''}`}>Analytics</Link>
              <Link to="/ai-tools" className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/ai-tools' ? 'font-medium text-blue-600' : ''}`}>AI Tools</Link>
            </nav>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
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
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-blue-600 bg-gray-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} transition duration-150 ease-in-out`}>Home</Link>
              <Link to="/analytics" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/analytics' ? 'text-blue-600 bg-gray-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} transition duration-150 ease-in-out`}>Analytics</Link>
              <Link to="/ai-tools" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/ai-tools' ? 'text-blue-600 bg-gray-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} transition duration-150 ease-in-out`}>AI Tools</Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500">
              &copy; {new Date().getFullYear()} Atlas AI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">Powered by Advanced AI Technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;