import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  showLoginModal: () => void;
  showSignupModal: () => void;
  showUpgradeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
  onShowLogin: () => void;
  onShowSignup: () => void;
  onShowUpgrade: () => void;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  onShowLogin,
  onShowSignup,
  onShowUpgrade
}) => {
  const value = {
    showLoginModal: onShowLogin,
    showSignupModal: onShowSignup,
    showUpgradeModal: onShowUpgrade,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
