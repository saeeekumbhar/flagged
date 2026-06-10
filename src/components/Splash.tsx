import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onStart: () => void;
}

// Green flag SVG icon — tilted, grounded, detailed
function GreenFlagIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Flag gradient — rich sage green */}
        <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7BC47A" />
          <stop offset="100%" stopColor="#3D7A3E" />
        </linearGradient>
        {/* Pole gradient */}
        <linearGradient id="poleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E5A2F" />
          <stop offset="60%" stopColor="#4A8A4B" />
          <stop offset="100%" stopColor="#3D7A3E" />
        </linearGradient>
        {/* Ground gradient */}
        <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6BAF6C" />
          <stop offset="100%" stopColor="#4A8A4B" />
        </linearGradient>
        {/* Soil gradient */}
        <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A0704A" />
          <stop offset="100%" stopColor="#7A5235" />
        </linearGradient>
        {/* Drop shadow filter */}
        <filter id="flagShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#1F3D20" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ── Ground soil arc ── */}
      <ellipse cx="36" cy="74" rx="22" ry="6" fill="url(#soilGrad)" opacity="0.55" />

      {/* ── Grass mound ── */}
      <ellipse cx="36" cy="71" rx="20" ry="5.5" fill="url(#groundGrad)" />

      {/* ── Grass tufts ── */}
      {/* left tuft */}
      <path d="M18 71 Q16 65 19 63 Q20 67 21 71Z" fill="#5A9F5B" />
      <path d="M21 71 Q20 64 23 62 Q23 67 24 71Z" fill="#6BAF6C" />
      {/* right tuft */}
      <path d="M48 71 Q50 65 48 63 Q47 67 46 71Z" fill="#5A9F5B" />
      <path d="M51 71 Q53 66 51 63 Q50 68 49 71Z" fill="#6BAF6C" />
      {/* centre tuft */}
      <path d="M33 69 Q32 64 35 62 Q35 66 36 70Z" fill="#7BC47A" />

      {/* ── Pole — tilted ~8° ── */}
      <g transform="rotate(-8, 36, 70)">
        <rect x="34" y="12" width="4.5" height="58" rx="2.25" fill="url(#poleGrad)" />
        {/* Pole highlight */}
        <rect x="34.5" y="14" width="1.5" height="50" rx="0.75" fill="white" opacity="0.18" />

        {/* ── Flag body — waving shape ── */}
        <path
          d="M38.5 13 C50 14, 64 17, 65 22 C64 27, 52 28, 42 32 C50 29, 62 26, 61 22 C62 18, 50 16, 38.5 15Z"
          fill="url(#flagGrad)"
          filter="url(#flagShadow)"
        />
        {/* Flag wave shadow crease */}
        <path
          d="M38.5 15 C50 16, 61 19, 61 22 C60 25, 50 27, 42 30"
          stroke="#2E5A2F"
          strokeWidth="0.6"
          strokeOpacity="0.3"
          fill="none"
        />
        {/* Flag highlight top edge */}
        <path
          d="M38.5 13 C50 14, 63 16.5, 65 22"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.45"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* ── Sparkle dots ── */}
      <circle cx="68" cy="14" r="1.8" fill="#7BC47A" opacity="0.7" />
      <circle cx="72" cy="22" r="1.2" fill="#5A8F5A" opacity="0.5" />
      <circle cx="10" cy="30" r="1.4" fill="#7BC47A" opacity="0.45" />
      <circle cx="14" cy="20" r="1" fill="#A8D5A8" opacity="0.6" />

      {/* ── Star sparkle top-right ── */}
      <path d="M70 10 L70.6 12 L72 10 L70.6 8Z" fill="#B8E0B8" opacity="0.8" />
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
