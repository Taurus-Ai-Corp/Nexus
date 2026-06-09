import React, { useState, useEffect } from 'react';
import { X, Settings, Check } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true
    };
    
    saveCookiePreferences(allPreferences);
    setIsVisible(false);
    
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
    
    // Configure Google Analytics based on preferences
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied'
      });
    }
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false
    };
    
    saveCookiePreferences(minimalPreferences);
    setIsVisible(false);
    
    // Disable non-essential tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      });
    }
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: Date.now(),
      version: '1.0'
    }));
  };

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'essential') return; // Cannot disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-end">
      <div className="w-full bg-dgsm-secondary/95 backdrop-blur-md border-t border-dgsm-border shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          {!showPreferences ? (
            // Main Cookie Banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dgsm-text-primary mb-2 flex items-center">
                  🍪 Cookie Consent
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">GDPR Compliant</span>
                </h3>
                <p className="text-dgsm-text-secondary text-sm lg:text-base">
                  We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                  Essential cookies are required for basic functionality. You can customize your preferences or accept all cookies.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="text-dgsm-accent-blue hover:text-dgsm-accent-purple text-sm underline"
                  >
                    View Cookie Policy & Manage Preferences
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-dgsm-border text-dgsm-text-secondary hover:bg-dgsm-primary transition-colors rounded-lg text-sm"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 border border-dgsm-border text-dgsm-text-primary hover:bg-dgsm-primary transition-colors rounded-lg text-sm flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-dgsm-accent-blue hover:bg-dgsm-accent-purple text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Cookie Preferences Panel
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-dgsm-text-primary">Cookie Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-dgsm-text-muted hover:text-dgsm-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Essential Cookies */}
                <div className="bg-dgsm-primary/50 p-4 rounded-lg border border-dgsm-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dgsm-text-primary">Essential</h4>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-xs text-dgsm-text-muted">Always Active</span>
                    </div>
                  </div>
                  <p className="text-sm text-dgsm-text-secondary">
                    Required for basic site functionality, security, and user authentication. Cannot be disabled.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-dgsm-primary/50 p-4 rounded-lg border border-dgsm-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dgsm-text-primary">Analytics</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-dgsm-text-secondary">
                    Help us understand how you use our site to improve performance and user experience.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-dgsm-primary/50 p-4 rounded-lg border border-dgsm-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dgsm-text-primary">Marketing</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-dgsm-text-secondary">
                    Enable personalized content and targeted marketing communications.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-dgsm-border text-dgsm-text-secondary hover:bg-dgsm-primary transition-colors rounded-lg"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="px-6 py-2 bg-dgsm-accent-blue hover:bg-dgsm-accent-purple text-white rounded-lg font-medium transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Extend global Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default CookieConsentBanner;
