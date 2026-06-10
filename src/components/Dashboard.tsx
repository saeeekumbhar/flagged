import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, Era, DailyLog } from '../types';
import { getAvatar, getAvatarAura } from '../avatars';
import { GreenFlagIcon } from './GreenFlagIcon';
import { AvatarDisplay } from './AvatarDisplay';
import { ACTIVITIES } from '../activities';

interface DashboardProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onLogDate: (date: string) => void;
  onOpenProfile?: () => void;
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

function MonthlyCalendar({ logs, onLogDate }: { logs: Record<string, DailyLog>, onLogDate: (date: string) => void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  // Shift so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfWeek + 6) % 7; 
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return { day: d, dateStr, log: logs[dateStr] };
  });

  const blanks = Array.from({ length: startOffset });
  
  return (
    <motion.div className="soft-card p-5 mb-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-[#1E1A16]">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <span className="text-xs text-[#8A8070]">Activity Log</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-[#8A8070]">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        
        {days.map(({ day, dateStr, log }) => {
          const isToday = dateStr === `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          let dotColor = 'transparent';
          if (log) {
            if (log.totalFlagImpact > 0) dotColor = '#5A8F5A'; // Green
            else if (log.totalFlagImpact < 0) dotColor = '#D4614A'; // Red
            else dotColor = '#D4A574'; // Neutral/Mixed
          }

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLogDate(dateStr)}
              className="relative aspect-square flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: isToday ? 'rgba(196,217,188,0.25)' : 'transparent',
                border: isToday ? '1px solid rgba(196,217,188,0.6)' : '1px solid transparent',
              }}
            >
              <span className="text-xs font-semibold" style={{ color: isToday ? '#1F3D20' : '#4A433A' }}>
                {day}
              </span>
              
              {log && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: dotColor }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export function Dashboard({ profile, logs, onLogDate, onOpenProfile }: DashboardProps) {
  const era = calculateEra(profile.flagScore);
  const eraConfig = getEraConfig(era, profile.flagScore);
  const aura = getAvatarAura(profile.flagScore);
  const avatar = getAvatar(profile.avatarId ?? 'av1');
  const greeting = useMemo(() => getGreeting(profile.name), [profile.name]);

  // Compute monthly stats
  const currentMonth = new Date().getMonth();
  let monthlyGreenFlags = 0;
  let monthlyRedFlags = 0;
  const activityCounts: Record<string, number> = {};
  
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
        if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home')) monthlyGreenFlags++;
        if (a.activityId.includes('car') || a.activityId.includes('delivery') || a.activityId.includes('ac') || a.activityId.includes('major')) monthlyRedFlags++;
      });
    }
  });

  // Generate automated insight
  let insightText = "Every journey starts somewhere. One green choice today can shift your whole week. 🌱";
  let insightTitle = "Weekly Insight";
  let insightIcon = "🚩";

  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);
  if (sortedActivities.length > 0) {
    const topActivityId = sortedActivities[0][0];
    const topCount = sortedActivities[0][1];
    const topDef = ACTIVITIES.find(a => a.id === topActivityId);

    if (topDef) {
      if (topDef.flagValue < 0) {
        insightTitle = "Biggest Red Flag";
        insightIcon = "🚨";
        insightText = `You’ve logged "${topDef.label}" ${topCount} times recently. Cutting this down is the easiest way to boost your score. 📉`;
      } else {
        insightTitle = "Best Habit";
        insightIcon = "🌟";
        insightText = `You're crushing it with "${topDef.label}"! You've done this ${topCount} times. This is carrying your score. 🔥`;
      }
    }
  }

  // Check if today is logged
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isLoggedToday = !!logs[todayStr];

  return (
    <div className="pb-28 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5 relative">

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

      {/* ── Hero Card ── */}
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

      {/* ── Monthly Calendar ── */}
      <MonthlyCalendar logs={logs} onLogDate={onLogDate} />

      {/* ── Monthly Insights ── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div className="soft-card-sage p-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🟢</span>
            <span className="text-[11px] font-bold text-[#3D6B3D] uppercase tracking-wider">Green Choices</span>
          </div>
          <p className="text-2xl font-bold text-[#1F3D20]">{monthlyGreenFlags}</p>
        </motion.div>
        
        <motion.div className="soft-card-coral p-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🔴</span>
            <span className="text-[11px] font-bold text-[#D4614A] uppercase tracking-wider">Red Choices</span>
          </div>
          <p className="text-2xl font-bold text-[#4A1F1A]">{monthlyRedFlags}</p>
        </motion.div>
      </div>

      {/* ── Automated Insight Engine ── */}
      <motion.div className="soft-card-earth p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">{insightIcon}</span>
          <span className="text-xs font-bold text-[#5A4030] uppercase tracking-wider">{insightTitle}</span>
        </div>
        <p className="text-sm text-[#3A2A1E] leading-relaxed font-medium italic">
          "{insightText}"
        </p>
        <button className="mt-3 text-xs font-bold text-[#B8835A] flex items-center gap-1 hover:text-[#8B6240] transition-colors">
          Share this insight →
        </button>
      </motion.div>

      {/* ── Fixed Bottom CTA ── */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-[420px] mx-auto z-40">
        <motion.button 
          className="btn-primary text-base py-4 w-full flex items-center justify-center gap-2" 
          onClick={() => onLogDate(todayStr)}
          whileTap={{ scale: 0.97 }} 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ 
            boxShadow: '0 8px 32px rgba(90,143,90,0.4), 0 2px 8px rgba(90,143,90,0.2)',
            background: isLoggedToday ? '#E4EDE0' : undefined,
            color: isLoggedToday ? '#3D6B3D' : undefined,
            borderColor: isLoggedToday ? '#5A8F5A' : undefined
          }}
        >
          <span>{isLoggedToday ? '✏️ Edit Today' : '🚩 Log Today'}</span>
        </motion.button>
      </div>

    </div>
  );
}
