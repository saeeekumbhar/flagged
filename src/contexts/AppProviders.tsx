import React from 'react';
import { AuthProvider } from './AuthContext';
import { LogsProvider } from './LogsContext';
import { ProfileProvider } from './ProfileContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <LogsProvider>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </LogsProvider>
    </AuthProvider>
  );
};
