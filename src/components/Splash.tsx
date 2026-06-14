import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseService } from '../services/FirebaseService';

export function Splash() {
  const [view, setView] = useState<'splash' | 'auth'>('splash');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setErrorMsg(null);
      await FirebaseService.signInWithGoogle();
      // Handled by App.tsx observer
    } catch (error: any) {
      console.error('Login failed', error);
      setErrorMsg(error.message || 'Authentication failed. Check console.');
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-6 text-[#1A2315] font-sans relative z-10">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[390px] mx-auto text-center">
        <AnimatePresence mode="wait">
          {view === 'splash' ? (
            <motion.div key="splash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full px-6 py-8 relative z-10"
            >
              <img 
                src="/logo.png" 
                alt="FLAGGED" 
                className="w-48 h-48 object-contain drop-shadow-2xl mb-4" 
                style={{ clipPath: 'circle(47%)' }} 
              />
              <h1 
                className="font-display text-[44px] mt-2 mb-4 tracking-tight leading-[1.05] text-white"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                Green flag behavior<br />starts here.
              </h1>
              <p 
                className="text-white text-xl font-medium leading-relaxed max-w-[280px] opacity-90 drop-shadow-md"
              >
                Find your green flags.<br />Reduce your footprint.
              </p>
            </motion.div>
          ) : (
            <motion.div key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full px-8 py-12 relative z-10"
            >
              <h2 
                className="font-display text-[44px] mb-4 text-white leading-[1.1] text-center tracking-tight"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                Are you a<br />green flag?
              </h2>
              <p 
                className="text-white text-xl font-medium mb-12 opacity-90 text-center drop-shadow-md"
              >
                Let's find out.
              </p>
              
              <button
                className="w-full text-[#1A2315] rounded-[24px] py-4 flex items-center justify-center gap-3 text-lg font-bold active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 4px 16px rgba(255, 255, 255, 0.8), inset 0 -4px 16px rgba(0, 0, 0, 0.05)'
                }}
                onClick={handleSignIn}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                Continue with Google
              </button>
              
              {errorMsg && (
                <div className="mt-4 text-red-800 text-sm font-semibold bg-red-100/80 backdrop-blur-md p-3 rounded-xl w-full">
                  {errorMsg}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[390px] mx-auto pb-6">
        {view === 'splash' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-[#1A2315] py-4 text-xl font-bold active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 4px 16px rgba(255, 255, 255, 0.8), inset 0 -4px 16px rgba(0, 0, 0, 0.05)'
            }}
            onClick={() => setView('auth')}
          >
            Get Started
          </motion.button>
        )}
      </div>
    </div>
  );
}
