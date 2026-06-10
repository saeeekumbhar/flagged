import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelButton } from './PixelButton';

interface SplashProps {
  onStart: () => void;
}

export function Splash({ onStart }: SplashProps) {
  const [flagState, setFlagState] = useState<'red' | 'mixed' | 'green'>('red');

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      setFlagState('mixed');
      await new Promise(r => setTimeout(r, 800));
      setFlagState('green');
    };
    sequence();
  }, []);

  const getFlagEmoji = () => {
    switch(flagState) {
      case 'red': return '🥀';
      case 'mixed': return '🪴';
      case 'green': return '🌱';
    }
  };

  const getFlagColor = () => {
    switch(flagState) {
      case 'red': return 'text-[#E76F51] border-[#E76F51]';
      case 'mixed': return 'text-[#E9C46A] border-[#E9C46A]';
      case 'green': return 'text-[#52B788] border-[#52B788]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FEFAE0] relative">
      
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Animated Flag / Icon */}
        <div className="h-40 flex items-end justify-center mb-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={flagState}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-32 h-32 flex items-center justify-center border-4 border-[#4A423D] brutal-shadow bg-white overflow-hidden`}
            >
               {flagState === 'red' && <img src="/tree.png" alt="Icon" className="w-full h-full object-cover pixelated grayscale opacity-50" />}
               {flagState === 'mixed' && <img src="/tree.png" alt="Icon" className="w-full h-full object-cover pixelated opacity-70 sepia" />}
               {flagState === 'green' && <img src="/tree.png" alt="Icon" className="w-full h-full object-cover pixelated" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center flex flex-col items-center"
        >
          <img src="/logo.png" alt="FLAGGED" className="w-64 h-auto pixelated drop-shadow-[4px_4px_0px_#8BA888]" />
          <p className="font-sans font-bold text-[#3A3532]/70 italic text-sm mt-4">
            Track your vibe. Find your era.
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.2, type: "spring" }}
        className="w-full max-w-md pb-8"
      >
        <PixelButton 
          onClick={onStart} 
          className="w-full text-xl py-5 !bg-[#8BA888] !text-[#3A3532] !border-[#4A423D]"
        >
          PRESS START
        </PixelButton>
      </motion.div>
      
    </div>
  );
}
