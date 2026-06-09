import React, { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const KeyboardShortcutsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true);
    
    window.addEventListener('showKeyboardHelp', handleShowHelp);
    return () => window.removeEventListener('showKeyboardHelp', handleShowHelp);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  return (
    <div className="fixed inset-0 bg-dgsm-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dgsm-secondary/95 backdrop-blur-md rounded-2xl border border-dgsm-border shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dgsm-border">
          <div>
            <h2 className="text-2xl font-bold text-dgsm-text-primary">Keyboard Shortcuts</h2>
            <p className="text-dgsm-text-secondary">Navigate 🚀 Atlas AI faster with these shortcuts</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-dgsm-text-muted hover:text-dgsm-text-primary transition-colors p-2 rounded-lg hover:bg-dgsm-border/50"
            aria-label="Close shortcuts modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-dgsm-primary/30 border border-dgsm-border/50 hover:bg-dgsm-primary/50 transition-colors"
            >
              <span className="text-dgsm-text-secondary">{shortcut.description}</span>
              <div className="flex items-center space-x-1">
                {formatShortcut(shortcut).split(' + ').map((key, keyIndex, array) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-semibold text-dgsm-text-primary bg-dgsm-border rounded border border-dgsm-border shadow-sm">
                      {key}
                    </kbd>
                    {keyIndex < array.length - 1 && (
                      <span className="text-dgsm-text-muted text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          
          {/* Additional shortcuts */}
          <div className="pt-4 border-t border-dgsm-border">
            <h3 className="text-lg font-semibold text-dgsm-text-primary mb-3">General Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-dgsm-primary/30 border border-dgsm-border/50">
                <span className="text-dgsm-text-secondary">Close this modal</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-dgsm-text-primary bg-dgsm-border rounded border border-dgsm-border shadow-sm">
                  ESC
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-dgsm-primary/30 border border-dgsm-border/50">
                <span className="text-dgsm-text-secondary">Focus search (when available)</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs font-semibold text-dgsm-text-primary bg-dgsm-border rounded border border-dgsm-border shadow-sm">
                    Ctrl
                  </kbd>
                  <span className="text-dgsm-text-muted text-xs">+</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-dgsm-text-primary bg-dgsm-border rounded border border-dgsm-border shadow-sm">
                    K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dgsm-border bg-dgsm-primary/20">
          <p className="text-sm text-dgsm-text-muted text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-dgsm-border rounded">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
