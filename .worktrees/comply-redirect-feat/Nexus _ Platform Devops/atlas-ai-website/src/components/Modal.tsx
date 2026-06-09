import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glow-card p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface PlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'signin' | 'demo' | 'template';
}

export const PlaceholderModal: React.FC<PlaceholderModalProps> = ({ isOpen, onClose, type }) => {
  const getContent = () => {
    switch (type) {
      case 'signin':
        return {
          title: 'Sign In',
          content: (
            <div className="space-y-4">
              <p className="text-[#E0E0E0]">
                Sign in functionality is coming soon! For now, you can start with our free trial.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 glow-button-outline py-2"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    window.location.href = '/signup';
                  }}
                  className="flex-1 glow-button py-2"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          )
        };
      case 'demo':
        return {
          title: 'Watch Demo',
          content: (
            <div className="space-y-4">
              <p className="text-[#E0E0E0]">
                Demo video is coming soon! In the meantime, start your free trial to explore all features.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 glow-button-outline py-2"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    window.location.href = '/signup';
                  }}
                  className="flex-1 glow-button py-2"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          )
        };
      case 'template':
        return {
          title: 'Get Template',
          content: (
            <div className="space-y-4">
              <p className="text-[#E0E0E0]">
                Templates are available after signup! Start your free trial to access 60+ automation templates.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 glow-button-outline py-2"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    window.location.href = '/signup';
                  }}
                  className="flex-1 glow-button py-2"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {content}
    </Modal>
  );
};
