import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, Era } from '../types';
import { getAvatar, getAvatarAura } from '../avatars';
import { GreenFlagIcon } from './GreenFlagIcon';
import { AvatarDisplay } from './AvatarDisplay';

interface DashboardProps {
  profile: UserProfile;
  onCheckInStart: () => void;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
  onOpenProfile?: () => void;
}

function getEraConfig(era: Era) {
  switch (era) {
    case 'Green Flag Era':
      return {
        badgeClass: 'era-badge-green',
        emoji: '🟢',
        gradientFrom: '#E4EDE0',
        gradientTo: '#F4F7F2',
        nextGoal: "You're living the green life 🌸",
      };
    case 'Glow Up Era':
      return {
        badgeClass: 'era-badge-mixed',
        emoji: '🔥',
        gradientFrom: '#FDF6EC',
        gradientTo: '#F4F7F2',
        nextGoal: '12 more points to reach Green Flag Era 🚩',
      };
    case 'Red Flag Era':
      return {
        badgeClass: 'era-badge-red',
        emoji: '🔴',
        gradientFrom: '#FDEEED',
        gradientTo: '#FDF9F3',
        nextGoal: 'One green flag this week changes everything 🌱',
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
      <circle cx="70" cy="70" r={radius} className="growth-ring-track" strokeWidth="10" />
      <motion.circle cx="70" cy="70" r={radius}
        stroke={score > 40 ? 'url(#growthGradient)' : 'url(#coralGradient)'}
        strokeWidth="10" strokeDasharray={circ} fill="none" strokeLinecap="round"
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
  const aura = getAvatarAura(profile.flagScore);
  const avatar = getAvatar(profile.avatarId ?? 'av1');
  const greeting = useMemo(() => getGreeting(profile.name), [profile.name]);

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    if (i < (profile.streak % 7)) return 'green';
    if (i === (profile.streak % 7)) return 'mixed';
    return 'empty';
  });

  return (
    <div className="pb-28 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5">

      {/* ── Header ── */}
      <motion.div className="flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <GreenFlagIcon size={26} />
            <span className="font-bold text-[#1F3D20] text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              FLAGGED
            </span>
          </div>
          <p className="text-sm text-[#8A8070] font-medium">{greeting}</p>
        </div>

        <button onClick={onOpenProfile} className="flex items-center gap-2 group">
          <div className="text-right">
            <p className="text-xs text-[#8A8070] font-medium capitalize">{profile.userType?.replace('_', ' ')}</p>
            <p className="text-sm font-bold text-[#1E1A16]">{profile.name}</p>
          </div>
          <motion.div whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-full flex items-center justify-center text-2xl overflow-hidden"
            style={{
              background: aura.bg,
              boxShadow: `0 2px 12px ${aura.glow}`,
              border: `2px solid ${aura.ring}`,
              overflow: 'hidden',
            }}>
            <AvatarDisplay avatar={avatar} size={44} />
          </motion.div>
        </button>
      </motion.div>

      {/* ── Garden Hero Card ── */}
      <motion.div className="garden-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: `linear-gradient(160deg, ${eraConfig.gradientFrom} 0%, ${eraConfig.gradientTo} 100%)` }}>

        <div className="flex items-center justify-between mb-5">
          <span className={eraConfig.badgeClass}>
            <span>{eraConfig.emoji}</span>{era}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#5A8070]">
            <span>🔥</span>
            <span>{profile.streak} week streak</span>
          </div>
        </div>

        {/* Avatar + Ring */}
        <div className="flex items-center justify-between">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <motion.div className="absolute inset-[-14px] rounded-full"
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: `radial-gradient(circle, ${aura.glow.replace('0.22', '0.5')} 0%, transparent 70%)` }}
              />
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                style={{
                  background: aura.bg,
                  boxShadow: `0 6px 28px ${aura.glow}, 0 2px 8px rgba(30,26,22,0.06)`,
                  border: `3px solid ${aura.ring}`,
                overflow: 'hidden',
                }}>
                <AvatarDisplay avatar={avatar} size={96} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#5A8070] uppercase tracking-wider">{profile.name.split(' ')[0]}</p>
              <p className="text-[11px] text-[#8A8070] mt-0.5 max-w-[110px] leading-tight">{aura.label}</p>
            </div>
          </div>

          {/* Growth Ring */}
          <div className="relative">
            <GrowthRing score={profile.flagScore} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-mono text-2xl font-bold text-[#1F3D20]">{profile.flagScore}</span>
              <span className="text-[10px] text-[#8A8070] uppercase tracking-wider font-semibold">Score</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(196,217,188,0.4)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[#5A8070]">Progress</span>
            <span className="text-xs text-[#8A8070]">{eraConfig.nextGoal}</span>
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill" initial={{ width: 0 }}
              animate={{ width: `${profile.flagScore}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }} />
          </div>
        </div>
      </motion.div>

      {/* ── Streak Calendar ── */}
      <motion.div className="soft-card p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-[#1E1A16]">This Week</span>
          <span className="text-xs text-[#8A8070]">☀️ = green flag day</span>
        </div>
        <div className="flex gap-2 justify-between">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
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
        <motion.div className="soft-card-sage p-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🟢</span>
            <span className="text-[11px] font-bold text-[#3D6B3D] uppercase tracking-wider">Green Flag</span>
          </div>
          <p className="text-sm font-semibold text-[#1F3D20] leading-tight">{biggestGreenFlag || 'Check in to reveal'}</p>
        </motion.div>
        <motion.div className="soft-card-coral p-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🔴</span>
            <span className="text-[11px] font-bold text-[#D4614A] uppercase tracking-wider">Red Flag</span>
          </div>
          <p className="text-sm font-semibold text-[#4A1F1A] leading-tight">{biggestRedFlag || 'Check in to reveal'}</p>
        </motion.div>
      </div>

      {/* ── Weekly Insight ── */}
      <motion.div className="soft-card-earth p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🚩</span>
          <span className="text-xs font-bold text-[#5A4030] uppercase tracking-wider">Weekly Insight</span>
        </div>
        <p className="text-sm text-[#3A2A1E] leading-relaxed font-medium italic">
          "{profile.flagScore >= 70
            ? "Your footprint is shrinking and your score shows it. Keep going — this is your era. 🟢"
            : profile.flagScore >= 50
            ? "You're making progress. A few more green flags this week and you'll feel the difference. 🔥"
            : "Every journey starts somewhere. One green choice today can shift your whole week. 🌱"}"
        </p>
        <button className="mt-3 text-xs font-bold text-[#B8835A] flex items-center gap-1 hover:text-[#8B6240] transition-colors">
          Share this card →
        </button>
      </motion.div>

      {/* ── CTA ── */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-[420px] mx-auto z-40">
        <motion.button className="btn-primary text-base py-4" onClick={onCheckInStart}
          whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ boxShadow: '0 8px 32px rgba(90,143,90,0.4), 0 2px 8px rgba(90,143,90,0.2)' }}>
          <span>🚩</span> Weekly Check-In
        </motion.button>
      </div>
    </div>
  );
}
