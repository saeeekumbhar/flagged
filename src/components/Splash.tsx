import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onStart: () => void;
}

// Green flag SVG — bold, minimal, impressive
function GreenFlagIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8FD08E" />
          <stop offset="100%" stopColor="#3A7A3B" />
        </linearGradient>
        <linearGradient id="poleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A5230" />
          <stop offset="100%" stopColor="#4A8A4C" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#72B874" />
          <stop offset="100%" stopColor="#3D7A3E" />
        </linearGradient>
        <filter id="flagShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1A3D1A" floodOpacity="0.22" />
        </filter>
        <filter id="groundShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1A3D1A" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* ── Ground ── */}
      <ellipse cx="38" cy="73" rx="24" ry="6.5" fill="url(#groundGrad)" filter="url(#groundShadow)" />

      {/* ── Everything tilted slightly ── */}
      <g transform="rotate(-6, 38, 73)">

        {/* Pole — tall, bold, rounded */}
        <rect x="35.5" y="10" width="5" height="63" rx="2.5" fill="url(#poleGrad)" />
        {/* Pole inner highlight */}
        <rect x="36" y="12" width="1.8" height="55" rx="0.9" fill="white" opacity="0.15" />

        {/* ── Flag — large, waving, prominent ── */}
        <path
          d="M40.5 10
             C54 11, 72 15, 72 23
             C72 31, 56 34, 44 38
             C54 33, 68 29, 68 23
             C68 17, 54 14, 40.5 13 Z"
          fill="url(#flagGrad)"
          filter="url(#flagShadow)"
        />
        {/* Flag highlight — top lit edge */}
        <path
          d="M40.5 10 C54 11, 71 14.5, 72 23"
          stroke="white" strokeWidth="1.4" strokeOpacity="0.5"
          fill="none" strokeLinecap="round"
        />
        {/* Flag inner wave crease */}
        <path
          d="M40.5 13 C54 14, 67 17.5, 68 23 C67 28, 55 31, 44 35"
          stroke="#2A5230" strokeWidth="0.8" strokeOpacity="0.25"
          fill="none" strokeLinecap="round"
        />
      </g>
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
