import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onStart: () => void;
}

// Green flag SVG icon
function GreenFlagIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pole */}
      <rect x="18" y="12" width="5" height="58" rx="2.5" fill="#3D6B3D" />
      {/* Flag body */}
      <path
        d="M23 14 L62 22 L23 38 Z"
        fill="#5A8F5A"
      />
      {/* Flag shine */}
      <path
        d="M23 14 L62 22 L45 28 L23 23 Z"
        fill="#7BA87A"
        opacity="0.5"
      />
    </svg>
  );
}

const FLAG_STAGES = [
  { color: '#D4614A', opacity: 0.4, label: 'Red' },   // red flag
  { color: '#D4A574', opacity: 0.6, label: 'Mixed' }, // in between
  { color: '#5A8F5A', opacity: 1.0, label: 'Green' }, // green flag
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

  const currentFlag = FLAG_STAGES[stage];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% 0%, rgba(196,217,188,0.4) 0%, transparent 70%), #FDFAF5'
      }}
    >
      {/* Top area — decorative */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-10">

        {/* Animated flag logo */}
        <div className="relative flex items-center justify-center">
          {/* Ambient glow */}
          <motion.div
            className="absolute w-52 h-52 rounded-full"
            animate={{
              background: `radial-gradient(circle, ${currentFlag.color}30 0%, transparent 70%)`,
              scale: [1, 1.06, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Flag container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${currentFlag.color}18, ${currentFlag.color}08)`,
                boxShadow: `0 8px 32px ${currentFlag.color}35, 0 2px 8px rgba(30,26,22,0.06)`,
                border: `2px solid ${currentFlag.color}25`,
              }}
            >
              <motion.div
                animate={{ opacity: currentFlag.opacity }}
                transition={{ duration: 0.6 }}
              >
                <GreenFlagIcon size={72} />
              </motion.div>
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

        {/* Stage dots — red → mixed → green */}
        <div className="flex gap-2 items-center">
          {FLAG_STAGES.map((s, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{
                width: i === stage ? 24 : 8,
                backgroundColor: i === stage ? s.color : i < stage ? '#5A8F5A' : 'rgba(196,217,188,0.4)',
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
          <span>🚩</span>
          Are you a green flag? Let's find out.
        </motion.button>

        <p className="text-center text-xs text-[#8A8070] mt-4">
          Track your footprint. Lower your impact. Live greener.
        </p>
      </motion.div>
    </div>
  );
}
