import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export function Splash() {
  const [view, setView] = useState<'splash' | 'auth'>('splash');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setErrorMsg(null);
      await signInWithPopup(auth, provider);
      // Handled by App.tsx observer
    } catch (error: any) {
      console.error('Login failed', error);
      setErrorMsg(error.message || 'Authentication failed. Check console.');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between p-6 bg-[#FDFBF7] text-[#354024]">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[390px] mx-auto text-center">
        <AnimatePresence mode="wait">
          {view === 'splash' ? (
            <motion.div key="splash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full"
            >
              <Logo size="lg" />
              <h1 className="text-3xl font-bold mt-12 mb-4 tracking-tight leading-tight">Green flag behavior<br />starts here.</h1>
              <p className="text-[#5A8070] text-lg leading-relaxed">
                Track your habits.<br />Reduce your impact.
              </p>
            </motion.div>
          ) : (
            <motion.div key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <Logo size="md" />
              <h2 className="text-2xl font-bold mt-8 mb-2">Join the Movement</h2>
              <p className="text-[#5A8070] mb-8">Sign in to start tracking.</p>
              
              <button
                className="w-full bg-white border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 text-lg font-semibold shadow-sm active:scale-95 transition-transform"
                onClick={handleSignIn}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                Continue with Google
              </button>
              
              {errorMsg && (
                <div className="mt-4 text-red-600 text-sm font-semibold bg-red-100/50 p-3 rounded-lg w-full">
                  {errorMsg}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[390px] mx-auto pb-4">
        {view === 'splash' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#354024] text-white rounded-xl py-4 text-lg font-bold shadow-md active:scale-95 transition-transform"
            onClick={() => setView('auth')}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}
