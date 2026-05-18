'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: {
          variables: {
            colorPrimary: '#2563eb',
            colorTextOnPrimaryBackground: '#ffffff',
            colorBackground: '#0f172a',
            colorInputBackground: '#1e293b',
            colorInputText: '#f8fafc',
            fontFamily: 'inherit',
          },
          elements: {
            rootBox: {
              width: '100%',
            },
            card: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
            formButtonPrimary: {
              backgroundColor: '#2563eb',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
            footerActionLink: {
              color: '#60a5fa',
              '&:hover': {
                color: '#3b82f6',
              },
            },
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}