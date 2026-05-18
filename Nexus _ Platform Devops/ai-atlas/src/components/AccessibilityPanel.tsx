import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

const AccessibilityPanel: React.FC = () => {
  const { preferences, updatePreference, resetToDefaults, announceToScreenReader } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key: keyof typeof preferences, value: any) => {
    updatePreference(key, value);
    announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-dgsm-secondary border border-dgsm-border text-dgsm-text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 group"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Skip Link */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={() => announceToScreenReader('Skip link focused')}
      >
        Skip to main content
      </a>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-dgsm-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-dgsm-secondary/95 backdrop-blur-md rounded-2xl border border-dgsm-border shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dgsm-border">
              <div>
                <h2 id="accessibility-title" className="text-2xl font-bold text-dgsm-text-primary">
                  Accessibility Settings
                </h2>
                <p className="text-dgsm-text-secondary">Customize your 🚀 Atlas AI experience</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dgsm-text-muted hover:text-dgsm-text-primary transition-colors p-2 rounded-lg hover:bg-dgsm-border/50"
                aria-label="Close accessibility settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-dgsm-text-primary font-medium" htmlFor="high-contrast">
                    High Contrast Mode
                  </label>
                  <p className="text-sm text-dgsm-text-secondary">
                    Increases contrast for better visibility
                  </p>
                </div>
                <button
                  id="high-contrast"
                  role="switch"
                  aria-checked={preferences.highContrast}
                  onClick={() => handleToggle('highContrast', !preferences.highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-dgsm-accent-blue focus:ring-offset-2 ${
                    preferences.highContrast ? 'bg-dgsm-accent-blue' : 'bg-dgsm-border'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-dgsm-text-primary font-medium" htmlFor="reduced-motion">
                    Reduced Motion
                  </label>
                  <p className="text-sm text-dgsm-text-secondary">
                    Minimizes animations and transitions
                  </p>
                </div>
                <button
                  id="reduced-motion"
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  onClick={() => handleToggle('reducedMotion', !preferences.reducedMotion)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-dgsm-accent-blue focus:ring-offset-2 ${
                    preferences.reducedMotion ? 'bg-dgsm-accent-blue' : 'bg-dgsm-border'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-dgsm-text-primary font-medium block mb-3">
                  Font Size
                </label>
                <div className="space-y-2">
                  {(['normal', 'large', 'larger'] as const).map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size}
                        checked={preferences.fontSize === size}
                        onChange={() => handleToggle('fontSize', size)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          preferences.fontSize === size
                            ? 'border-dgsm-accent-blue bg-dgsm-accent-blue'
                            : 'border-dgsm-border'
                        }`}
                      >
                        {preferences.fontSize === size && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-dgsm-text-secondary capitalize">
                        {size} {size === 'normal' ? '(default)' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enhanced Focus */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-dgsm-text-primary font-medium" htmlFor="focus-indicator">
                    Enhanced Focus Indicators
                  </label>
                  <p className="text-sm text-dgsm-text-secondary">
                    More visible focus outlines for keyboard navigation
                  </p>
                </div>
                <button
                  id="focus-indicator"
                  role="switch"
                  aria-checked={preferences.focusIndicator}
                  onClick={() => handleToggle('focusIndicator', !preferences.focusIndicator)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-dgsm-accent-blue focus:ring-offset-2 ${
                    preferences.focusIndicator ? 'bg-dgsm-accent-blue' : 'bg-dgsm-border'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.focusIndicator ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-dgsm-border">
                <button
                  onClick={() => {
                    resetToDefaults();
                    announceToScreenReader('Accessibility settings reset to defaults');
                  }}
                  className="w-full bg-dgsm-border hover:bg-dgsm-border/80 text-dgsm-text-primary py-2 px-4 rounded-lg transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-dgsm-border bg-dgsm-primary/20">
              <p className="text-sm text-dgsm-text-muted text-center">
                These settings are saved to your browser and will persist across sessions.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;
