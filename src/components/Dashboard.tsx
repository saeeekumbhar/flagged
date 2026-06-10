import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, Era } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onCheckInStart: () => void;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
  onOpenProfile?: () => void;
}

// Plant stage based on score
function getPlantStage(score: number): { emoji: string; label: string; desc: string } {
  if (score <= 25) return { emoji: '🌰', label: 'Dormant Seed', desc: 'Your journey is just beginning.' };
  if (score <= 40) return { emoji: '🌱', label: 'Tiny Sprout', desc: 'Something is growing inside you.' };
  if (score <= 55) return { emoji: '🪴', label: 'Young Plant', desc: 'Your habits are taking root.' };
  if (score <= 70) return { emoji: '🌿', label: 'Leafy Growth', desc: 'Your garden is finding its rhythm.' };
  if (score <= 85) return { emoji: '🌸', label: 'Flowering', desc: 'You\'re in full bloom.' };
  return { emoji: '🌳', label: 'Full Garden', desc: 'Your campus garden is thriving.' };
}

function getEraConfig(era: Era) {
  switch (era) {
    case 'Green Flag Era':
      return {
        badgeClass: 'era-badge-green',
        emoji: '🟢',
        gradientFrom: '#E4EDE0',
        gradientTo: '#F4F7F2',
        glowColor: 'rgba(90,143,90,0.25)',
        nextGoal: 'Keep it up — you\'re thriving! 🌸',
        progressColor: '#5A8F5A',
      };
    case 'Mixed Flags Era':
      return {
        badgeClass: 'era-badge-mixed',
        emoji: '🟡',
        gradientFrom: '#FDF6EC',
        gradientTo: '#F4F7F2',
        glowColor: 'rgba(212,165,116,0.2)',
        nextGoal: '12 more points to reach Green Flag Era 🌿',
        progressColor: '#D4A574',
      };
    case 'Red Flag Era':
      return {
        badgeClass: 'era-badge-red',
        emoji: '🔴',
        gradientFrom: '#FDEEED',
        gradientTo: '#FDF9F3',
        glowColor: 'rgba(232,133,106,0.15)',
        nextGoal: 'Start small — one green flag this week 🌱',
        progressColor: '#E8856A',
      };
  }
}

function GrowthRing({ score }: { score: number }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <defs>
        <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A8F5A" />
          <stop offset="50%" stopColor="#7BA87A" />
          <stop offset="100%" stopColor="#5A9AB5" />
        </linearGradient>
        <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4614A" />
          <stop offset="100%" stopColor="#E8856A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle cx="70" cy="70" r={radius} className="growth-ring-track" strokeWidth="10" />
      {/* Fill */}
      <motion.circle
        cx="70" cy="70" r={radius}
        className="growth-ring-fill"
        stroke={score > 40 ? 'url(#growthGradient)' : 'url(#coralGradient)'}
        strokeWidth="10"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - fill }}
        transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
        filter="url(#glow)"
      />
    </svg>
  );
}

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(' ')[0];
  if (hour < 12) return `Good morning, ${first} 🌅`;
  if (hour < 17) return `Good afternoon, ${first} ☀️`;
  return `Good evening, ${first} 🌙`;
}

export function Dashboard({ profile, onCheckInStart, biggestGreenFlag, biggestRedFlag, onOpenProfile }: DashboardProps) {
  const era = calculateEra(profile.flagScore);
  const eraConfig = getEraConfig(era);
  const plant = getPlantStage(profile.flagScore);
  const greeting = useMemo(() => getGreeting(profile.name), [profile.name]);

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    if (i < (profile.streak % 7)) return 'green';
    if (i === (profile.streak % 7)) return 'mixed';
    return 'empty';
  });

  return (
    <div className="pb-28 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5">

      {/* ── Header ── */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">🌿</span>
            <span className="font-bold text-[#1F3D20] text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              FLAGGED
            </span>
          </div>
          <p className="text-sm text-[#8A8070] font-medium">{greeting}</p>
        </div>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 group"
        >
          <div className="text-right">
            <p className="text-xs text-[#8A8070] font-medium capitalize">
              {profile.userType?.replace('_', ' ')}
            </p>
            <p className="text-sm font-bold text-[#1E1A16]">{profile.name}</p>
          </div>
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)',
              boxShadow: '0 2px 12px rgba(90,143,90,0.2)',
              border: '2px solid rgba(196,217,188,0.7)'
            }}
          >
            🌱
          </motion.div>
        </button>
      </motion.div>

      {/* ── Garden Hero Card ── */}
      <motion.div
        className="garden-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: `linear-gradient(160deg, ${eraConfig.gradientFrom} 0%, ${eraConfig.gradientTo} 100%)` }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className={eraConfig.badgeClass}>
            <span>{eraConfig.emoji}</span>
            {era}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#5A8070]">
            <span>🔥</span>
            <span>{profile.streak} week streak</span>
          </div>
        </div>

        {/* Plant + Ring */}
        <div className="flex items-center justify-between">
          {/* Plant visual */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="absolute inset-[-12px] rounded-full glow-pulse"
                style={{ background: `radial-gradient(circle, ${eraConfig.glowColor} 0%, transparent 70%)` }}
              />
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${eraConfig.gradientFrom}, rgba(253,250,245,0.8))`,
                  boxShadow: `0 6px 24px ${eraConfig.glowColor}`
                }}
              >
                <span className="text-5xl plant-float">{plant.emoji}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#5A8070] uppercase tracking-wider">{plant.label}</p>
              <p className="text-[11px] text-[#8A8070] mt-0.5 max-w-[100px] leading-tight">{plant.desc}</p>
            </div>
          </div>

          {/* Growth Ring */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <GrowthRing score={profile.flagScore} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-mono text-2xl font-bold text-[#1F3D20]">{profile.flagScore}</span>
                <span className="text-[10px] text-[#8A8070] uppercase tracking-wider font-semibold">Growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar to next era */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(196,217,188,0.4)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[#5A8070]">Progress</span>
            <span className="text-xs text-[#8A8070]">{eraConfig.nextGoal}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${profile.flagScore}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Streak Calendar ── */}
      <motion.div
        className="soft-card p-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-[#1E1A16]">This Week</span>
          <span className="text-xs text-[#8A8070]">☀️ = green flag day</span>
        </div>
        <div className="flex gap-2 justify-between">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`streak-day ${streakDays[i]}`}>
                {streakDays[i] === 'green' ? '☀️' : streakDays[i] === 'mixed' ? '⛅' : '○'}
              </div>
              <span className="text-[10px] text-[#8A8070] font-medium">{d}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Flag Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="soft-card-sage p-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🟢</span>
            <span className="text-[11px] font-bold text-[#3D6B3D] uppercase tracking-wider">Green Flag</span>
          </div>
          <p className="text-sm font-semibold text-[#1F3D20] leading-tight">
            {biggestGreenFlag || 'Check in to reveal'}
          </p>
        </motion.div>

        <motion.div
          className="soft-card-coral p-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🔴</span>
            <span className="text-[11px] font-bold text-[#D4614A] uppercase tracking-wider">Red Flag</span>
          </div>
          <p className="text-sm font-semibold text-[#4A1F1A] leading-tight">
            {biggestRedFlag || 'Check in to reveal'}
          </p>
        </motion.div>
      </div>

      {/* ── Weekly Insight ── */}
      <motion.div
        className="soft-card-earth p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🌿</span>
          <span className="text-xs font-bold text-[#5A4030] uppercase tracking-wider">Garden Insight</span>
        </div>
        <p className="text-sm text-[#3A2A1E] leading-relaxed font-medium italic">
          "{profile.flagScore >= 70
            ? 'Your habits are in full bloom. Keep nurturing your garden — it\'s beautiful. 🌸'
            : profile.flagScore >= 50
            ? 'Your garden is finding its rhythm. Every green flag you plant helps it grow. 🌿'
            : 'Every seed you plant matters. One green flag this week can change everything. 🌱'}"
        </p>
        <button className="mt-3 text-xs font-bold text-[#B8835A] flex items-center gap-1 hover:text-[#8B6240] transition-colors">
          Share this card →
        </button>
      </motion.div>

      {/* ── CTA ── */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-[420px] mx-auto z-40">
        <motion.button
          className="btn-primary text-base py-4 shadow-xl"
          onClick={onCheckInStart}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ boxShadow: '0 8px 32px rgba(90,143,90,0.4), 0 2px 8px rgba(90,143,90,0.2)' }}
        >
          <span>🌿</span>
          Weekly Check-In
        </motion.button>
      </div>
    </div>
  );
}
