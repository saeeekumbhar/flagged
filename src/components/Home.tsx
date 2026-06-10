import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, Era, DailyLog } from '../types';
import { getAvatar, getAvatarAura } from '../avatars';
import { AvatarDisplay } from './AvatarDisplay';
import { ACTIVITIES } from '../activities';

interface HomeProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onLogToday: () => void;
}

function getEraConfig(era: Era, score: number) {
  switch (era) {
    case 'Green Flag Era':
      return {
        badgeClass: 'era-badge-green',
        emoji: '🟢',
        gradientFrom: '#E4EDE0',
        gradientTo: '#F4F7F2',
        nextGoal: "You're living the green life 🌸",
      };
    case 'Glow Up Era': {
      const needed = 71 - score;
      return {
        badgeClass: 'era-badge-mixed',
        emoji: '🔥',
        gradientFrom: '#FDF6EC',
        gradientTo: '#F4F7F2',
        nextGoal: `${needed} more points to Green Flag Era 🚩`,
      };
    }
    case 'Red Flag Era': {
      const needed = 41 - score;
      return {
        badgeClass: 'era-badge-red',
        emoji: '🔴',
        gradientFrom: '#FDEEED',
        gradientTo: '#FDF9F3',
        nextGoal: `${needed} more points to Glow Up Era 🔥`,
      };
    }
  }
}

function GrowthRing({ score }: { score: number }) {
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
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
      <circle cx="80" cy="80" r={radius} className="growth-ring-track" strokeWidth="10" />
      <motion.circle cx="80" cy="80" r={radius}
        stroke={score > 40 ? 'url(#growthGradient)' : 'url(#coralGradient)'}
        strokeWidth="10" strokeDasharray={circ} fill="none" strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - fill }}
        transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
        filter="url(#glow)"
      />
    </svg>
  );
}

export function Home({ profile, logs, onLogToday }: HomeProps) {
  const era = calculateEra(profile.flagScore);
  const eraConfig = getEraConfig(era, profile.flagScore);
  const aura = getAvatarAura(profile.flagScore);
  const avatar = getAvatar(profile.avatarId ?? 'av1');

  // AI Coach Logic
  const currentMonth = new Date().getMonth();
  const activityCounts: Record<string, number> = {};
  Object.values(logs).forEach(log => {
    if (new Date(log.date).getMonth() === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
      });
    }
  });

  let coachMessage = `Hey ${profile.name.split(' ')[0]}! Ready to log today's choices?`;
  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);
  if (sortedActivities.length > 0) {
    const topDef = ACTIVITIES.find(a => a.id === sortedActivities[0][0]);
    if (topDef) {
      if (topDef.flagValue < 0) {
        coachMessage = `You've been logging "${topDef.label}" lately. Let's try to avoid that today to keep your streak safe!`;
      } else {
        coachMessage = `You're crushing it with "${topDef.label}". Keep that energy going today!`;
      }
    }
  }

  // Check if today is logged
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isLoggedToday = !!logs[todayStr];

  return (
    <div className="pb-32 max-w-[420px] mx-auto px-4 pt-8 flex flex-col items-center min-h-[85vh] justify-center gap-8">
      
      {/* ── AI Coach Bubble ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ delay: 0.1 }}
        className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[rgba(196,217,188,0.3)] relative"
      >
        <p className="text-[#3A2A1E] text-sm leading-relaxed font-medium">
          "{coachMessage}"
        </p>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b border-r border-[rgba(196,217,188,0.3)] rotate-45" />
      </motion.div>

      {/* ── The Avatar (Primary Anchor) ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.2 }}
        className="relative flex flex-col items-center my-6"
      >
        <div className="relative flex justify-center items-center">
          <motion.div className="absolute inset-[-20px] rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: `radial-gradient(circle, ${aura.glow.replace('0.22', '0.5')} 0%, transparent 70%)` }}
          />
          <GrowthRing score={profile.flagScore} />
          <div className="absolute w-28 h-28 rounded-full flex items-center justify-center text-6xl"
            style={{
              background: aura.bg,
              boxShadow: `0 8px 32px ${aura.glow}, 0 2px 8px rgba(30,26,22,0.06)`,
              border: `4px solid ${aura.ring}`,
              overflow: 'hidden',
            }}>
            <AvatarDisplay avatar={avatar} size={112} />
          </div>
        </div>

        {/* Identity Plate */}
        <div className="mt-8 text-center flex flex-col items-center">
          <span className={eraConfig.badgeClass} style={{ marginBottom: '8px' }}>
            <span>{eraConfig.emoji}</span>{era}
          </span>
          <p className="text-sm text-[#8A8070] font-medium max-w-[200px] leading-tight mt-1">{aura.label}</p>
        </div>
      </motion.div>

      {/* ── Log Today Action ── */}
      <motion.button 
        className="btn-primary w-full max-w-[280px] py-4 text-lg" 
        onClick={onLogToday}
        whileTap={{ scale: 0.96 }} 
        initial={{ opacity: 0, y: 24 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ 
          boxShadow: '0 8px 32px rgba(90,143,90,0.3)',
          background: isLoggedToday ? '#E4EDE0' : undefined,
          color: isLoggedToday ? '#3D6B3D' : undefined,
          borderColor: isLoggedToday ? '#5A8F5A' : undefined
        }}
      >
        <span>{isLoggedToday ? '✏️ Edit Today' : '🚩 Log Today'}</span>
      </motion.button>
      
    </div>
  );
}
