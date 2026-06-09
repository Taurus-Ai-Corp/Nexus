import React from 'react';

const SkipNavigation: React.FC = () => {
  return (
    <>
      {/* Skip to main content link - WCAG 2.1 AA compliance */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg z-[10001] font-medium transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
        tabIndex={1}
      >
        Skip to main content
      </a>
      
      {/* Additional skip links for complex pages */}
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg z-[10001] font-medium transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
        tabIndex={2}
      >
        Skip to navigation
      </a>
      
      <a 
        href="#footer" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-80 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg z-[10001] font-medium transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
        tabIndex={3}
      >
        Skip to footer
      </a>
    </>
  );
};

export default SkipNavigation;
