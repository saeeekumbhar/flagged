import React from 'react';
import { AuthProvider } from './AuthContext';
import { LogsProvider } from './LogsContext';
import { ProfileProvider } from './ProfileContext';
import { ToastProvider } from './ToastContext';
import { NavigationProvider } from './NavigationContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationProvider>
          <LogsProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </LogsProvider>
        </NavigationProvider>
      </ToastProvider>
    </AuthProvider>
  );
};
