import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

type ToastType = 'green' | 'darkGreen';

interface ToastState {
  msg: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: ToastState | null;
  showToastMsg: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToastMsg = useCallback((msg: string, type?: ToastType) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const value = useMemo(() => ({ toast, showToastMsg }), [toast, showToastMsg]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
