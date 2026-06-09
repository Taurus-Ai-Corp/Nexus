import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      altKey: true,
      action: () => navigate('/'),
      description: 'Navigate to Home page'
    },
    {
      key: 'f',
      altKey: true,
      action: () => navigate('/features'),
      description: 'Navigate to Features page'
    },
    {
      key: 'p',
      altKey: true,
      action: () => navigate('/pricing'),
      description: 'Navigate to Pricing page'
    },
    {
      key: 'c',
      altKey: true,
      action: () => navigate('/contact'),
      description: 'Navigate to Contact page'
    },
    {
      key: 's',
      altKey: true,
      action: () => navigate('/signup'),
      description: 'Navigate to Signup page'
    },
    {
      key: 'i',
      altKey: true,
      action: () => navigate('/insights'),
      description: 'Navigate to Insights page'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // Will trigger help modal
        const event = new CustomEvent('showKeyboardHelp');
        window.dispatchEvent(event);
      },
      description: 'Show keyboard shortcuts help'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.altKey === event.altKey &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcuts };
};
