import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onStart: () => void;
}

const PLANT_STAGES = [
  { emoji: '🌰', label: 'Dormant', bg: 'from-[#F5E4C8] to-[#FDF6EC]', color: '#B8835A' },
  { emoji: '🌱', label: 'Sprouting', bg: 'from-[#D4E8CC] to-[#E4EDE0]', color: '#5A8F5A' },
  { emoji: '🌿', label: 'Growing', bg: 'from-[#C4D9BC] to-[#D8EDCE]', color: '#3D6B3D' },
];

export function Splash({ onStart }: SplashProps) {
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 900);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => setReady(true), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const current = PLANT_STAGES[stage];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% 0%, rgba(196,217,188,0.4) 0%, transparent 70%), #FDFAF5'
      }}
    >
      {/* Top area — decorative */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-10">

        {/* Animated plant container */}
        <div className="relative flex items-center justify-center">
          {/* Ambient glow */}
          <div
            className="absolute w-48 h-48 rounded-full glow-pulse"
            style={{
              background: `radial-gradient(circle, ${current.color}33 0%, transparent 70%)`,
              transition: 'background 0.8s ease',
            }}
          />

          {/* Plant stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0.6, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${current.bg} flex items-center justify-center`}
              style={{
                boxShadow: `0 8px 32px ${current.color}40, 0 2px 8px rgba(30,26,22,0.08)`
              }}
            >
              <span className="text-6xl plant-float select-none">{current.emoji}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Brand */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h1 className="text-display text-5xl font-bold text-[#1F3D20] mb-2 tracking-tight">
            FLAGGED
          </h1>
          <p className="text-[#5A8070] text-base font-medium">
            Green flag behavior starts here.
          </p>
        </motion.div>

        {/* Stage dots */}
        <div className="flex gap-2 items-center">
          {PLANT_STAGES.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{
                width: i === stage ? 24 : 8,
                backgroundColor: i <= stage ? '#5A8F5A' : 'rgba(196,217,188,0.5)',
              }}
              transition={{ duration: 0.35 }}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="w-full max-w-sm pb-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="btn-primary text-lg py-5"
          onClick={onStart}
          whileTap={{ scale: 0.97 }}
        >
          <span>🌿</span>
          Begin Your Journey
        </motion.button>

        <p className="text-center text-xs text-[#8A8070] mt-4">
          Build better habits. Grow your garden.
        </p>
      </motion.div>
    </div>
  );
}
