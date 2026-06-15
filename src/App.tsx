import React from 'react';
import { AppShell } from './components/AppShell';
import { GlobalSoundListener } from './components/GlobalAudio';
export function App() {
  
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
      <GlobalSoundListener />
      <AppShell />
    </div>
  );
}

import { SettingsProvider } from './contexts/SettingsContext';
import { AppProviders } from './contexts/AppProviders';

export default function AppWrapper() {
  return (
    <SettingsProvider>
      <AppProviders>
        <App />
      </AppProviders>
    </SettingsProvider>
  );
}
