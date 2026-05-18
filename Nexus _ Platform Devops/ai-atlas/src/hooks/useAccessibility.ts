import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  focusIndicator: boolean;
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'normal',
    focusIndicator: true
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_atlas_accessibility');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }

    // Check for system preferences
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (highContrastQuery.matches) {
      setPreferences(prev => ({ ...prev, highContrast: true }));
    }

    if (reducedMotionQuery.matches) {
      setPreferences(prev => ({ ...prev, reducedMotion: true }));
    }

    // Listen for system preference changes
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    highContrastQuery.addEventListener('change', handleContrastChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleContrastChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast mode
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size
    root.classList.remove('font-large', 'font-larger');
    if (preferences.fontSize === 'large') {
      root.classList.add('font-large');
    } else if (preferences.fontSize === 'larger') {
      root.classList.add('font-larger');
    }

    // Focus indicator
    if (preferences.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Save to localStorage
    try {
      localStorage.setItem('ai_atlas_accessibility', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error);
    }
  }, [preferences]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setPreferences({
      highContrast: false,
      reducedMotion: false,
      fontSize: 'normal',
      focusIndicator: true
    });
  };

  // Keyboard navigation helpers
  const handleKeyboardNavigation = (event: KeyboardEvent, handler: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  // Skip link functionality
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Announce to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    preferences,
    updatePreference,
    resetToDefaults,
    handleKeyboardNavigation,
    skipToContent,
    announceToScreenReader
  };
};

// CSS classes to be added to global styles
export const accessibilityStyles = `
  /* High contrast mode */
  .high-contrast {
    --dgsm-primary: #000000;
    --dgsm-secondary: #1a1a1a;
    --dgsm-text-primary: #ffffff;
    --dgsm-text-secondary: #cccccc;
    --dgsm-border: #444444;
    --dgsm-accent-blue: #66ccff;
    --dgsm-accent-purple: #cc99ff;
  }

  /* Reduced motion */
  .reduced-motion *,
  .reduced-motion *::before,
  .reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Font size adjustments */
  .font-large {
    font-size: 115%;
  }

  .font-larger {
    font-size: 130%;
  }

  /* Enhanced focus indicators */
  .enhanced-focus *:focus {
    outline: 3px solid var(--dgsm-accent-blue) !important;
    outline-offset: 2px !important;
  }

  /* Screen reader only content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Skip link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--dgsm-secondary);
    color: var(--dgsm-text-primary);
    padding: 8px;
    border-radius: 4px;
    text-decoration: none;
    z-index: 1000;
    border: 2px solid var(--dgsm-accent-blue);
  }

  .skip-link:focus {
    top: 6px;
  }
`;
