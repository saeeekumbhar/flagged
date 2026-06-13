import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // We do not set isAuthLoading to false here immediately if u exists, 
      // because we want the ProfileContext and LogsContext to finish loading their data first.
      // But for simplicity of decoupling, AuthContext only cares about Firebase Auth state.
      // The delay/loading state for data will be handled by the other contexts or App.tsx.
      if (!u) {
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // We expose a setter for isAuthLoading so the data contexts can clear the loading state once synced.
  const value = { user, isAuthLoading, setIsAuthLoading };

  return <AuthContext.Provider value={value as any}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType & { setIsAuthLoading: (v: boolean) => void };
};
