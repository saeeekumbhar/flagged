import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { NavState } from '../types';
import { FirebaseService } from '../services/FirebaseService';

interface NavigationContextType {
  navState: NavState;
  handleNavChange: (newState: NavState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [navState, setNavState] = useState<NavState>({ type: 'tab', tab: 'home' });

  const handleNavChange = useCallback(async (newState: NavState) => {
    setNavState(newState);
    if (newState.type === 'tab' && newState.tab === 'insights') {
      FirebaseService.logAnalyticsEvent('insight_opened');
    }
  }, []);

  const value = useMemo(() => ({ navState, handleNavChange }), [navState, handleNavChange]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
