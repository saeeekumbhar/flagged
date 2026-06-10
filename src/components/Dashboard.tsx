import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
        nextGoal: `${needed} pt to Green Flag Era →`,
      };
    }
    case 'Red Flag Era': {
      const needed = 41 - score;
      return {
        badgeClass: 'era-badge-red',
        emoji: '🔴',
        gradientFrom: '#FDEEED',
        gradientTo: '#FDF9F3',
        nextGoal: `${needed} pt to Glow Up Era →`,
      };
    }
  }
}

function GrowthRing({ score }: { score: number }) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
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
      </defs>
      <circle cx="40" cy="40" r={radius} className="growth-ring-track" strokeWidth="8" />
      <motion.circle cx="40" cy="40" r={radius}
        stroke={score > 40 ? 'url(#growthGradient)' : 'url(#coralGradient)'}
        strokeWidth="8" strokeDasharray={circ} fill="none" strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - fill }}
        transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
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
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const realToday = new Date();
  
  return (
    <motion.div className="bg-white rounded-[24px] p-6 mb-5 shadow-[0_4px_20px_rgba(30,26,22,0.03)]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      
      {/* Segmented Control */}
      <div className="flex bg-[#F4F1EC] rounded-[20px] p-1.5 mb-6">
        <button className="flex-1 bg-white rounded-[14px] py-2.5 text-xs font-bold text-[#1E1A16] shadow-sm">Calendar</button>
        <button className="flex-1 rounded-[14px] py-2.5 text-xs font-bold text-[#A0988A]">Activity Log</button>
        <button className="flex-1 rounded-[14px] py-2.5 text-xs font-bold text-[#A0988A]">Trends</button>
      </div>

      <div className="flex justify-end gap-2 mb-6">
        <button onClick={handlePrevMonth} className="w-10 h-10 rounded-2xl border border-[#F4F1EC] flex items-center justify-center text-[#C8C0B0] text-sm active:bg-[#F4F1EC] transition-colors pointer-events-auto">{'<'}</button>
        <button onClick={handleNextMonth} className="w-10 h-10 rounded-2xl border border-[#F4F1EC] flex items-center justify-center text-[#C8C0B0] text-sm active:bg-[#F4F1EC] transition-colors pointer-events-auto">{'>'}</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[11px] font-bold text-[#A0988A] mb-1">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-3 gap-x-2">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        
        {days.map(({ day, dateStr, log }) => {
          const isToday = dateStr === `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;
          
          let bgColor = 'transparent';
          let textColor = '#B8B0A5';
          let fontWeight = '600';

          if (isToday) {
            bgColor = '#347346'; // Dark green
            textColor = '#FFFFFF';
            fontWeight = 'bold';
          } else if (log) {
            if (log.totalFlagImpact > 0) { bgColor = '#EAF3EA'; textColor = '#2D5D2D'; fontWeight = 'bold'; } // Light Green
            else if (log.totalFlagImpact < 0) { bgColor = '#FDECEE'; textColor = '#A03030'; fontWeight = 'bold'; } // Light Red
            else { bgColor = '#F4F1EC'; textColor = '#1E1A16'; fontWeight = 'bold'; } // Neutral
          }

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLogDate(dateStr)}
              className="relative aspect-square flex items-center justify-center rounded-[14px] transition-colors pointer-events-auto"
              style={{
                background: bgColor,
                color: textColor,
                fontWeight: fontWeight as any,
              }}
            >
              <span className="text-[13px]">{day}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-8 text-[11px] font-semibold text-[#A0988A] items-center">
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-[4px] bg-[#EAF3EA] border border-[#BEE0BE]" /> Green day</div>
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-[4px] bg-[#FDECEE] border border-[#F4B2B8]" /> Red day</div>
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-[4px] bg-[#347346]" /> Today</div>
      </div>
    </motion.div>
  );
}

export function Dashboard({ profile, logs, onLogDate, onOpenProfile }: DashboardProps) {
  const [toast, setToast] = useState<string | null>(null);

  const era = calculateEra(profile.flagScore);
  const eraConfig = getEraConfig(era, profile.flagScore);
  const aura = getAvatarAura(profile.flagScore);
  const avatar = getAvatar(profile.avatarId ?? 'av1');
  const greeting = useMemo(() => getGreeting(profile.name), [profile.name]);

  // Compute monthly stats
  const currentMonth = new Date().getMonth();
  let monthlyGreenFlags = 0;
  let monthlyRedFlags = 0;
  let totalFlagsInMonth = 0;
  const activityCounts: Record<string, number> = {};
  
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
        totalFlagsInMonth++;
        if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home')) monthlyGreenFlags++;
        if (a.activityId.includes('car') || a.activityId.includes('delivery') || a.activityId.includes('ac') || a.activityId.includes('major')) monthlyRedFlags++;
      });
    }
  });

  const greenRate = totalFlagsInMonth > 0 ? Math.round((monthlyGreenFlags / totalFlagsInMonth) * 100) : 0;
  const daysLogged = Object.keys(logs).length;

  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);
  let topHabitText = "Start logging to discover your best habits!";
  if (sortedActivities.length > 0) {
    const topDef = ACTIVITIES.find(a => a.id === sortedActivities[0][0]);
    if (topDef) {
      topHabitText = `Crushing it with ${topDef.label} — ${sortedActivities[0][1]} days logged!`;
    }
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="pb-8 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-4 relative z-10 pointer-events-auto">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-4 right-4 bg-[#3A2A1E] text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm font-bold text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div className="flex items-center justify-between pl-1"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xl">⚑</span>
          <span className="font-bold text-[#5A8F5A] text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Flagged
          </span>
        </div>

        <button onClick={onOpenProfile} className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-sm border border-[#EBE5DA] transition-transform active:scale-95">
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-lg" style={{ background: aura.bg, border: `1px solid ${aura.ring}` }}>
             <AvatarDisplay avatar={avatar} size={28} />
          </div>
          <span className="text-[11px] font-bold text-[#8A8070]">{profile.userType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {profile.name}</span>
        </button>
      </motion.div>

      {/* ── Hero Card ── */}
      <motion.div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EBE5DA] relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        
        {/* Background gradient hint */}
        <div className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none" style={{ background: `linear-gradient(180deg, ${eraConfig.gradientFrom} 0%, transparent 100%)` }} />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: 'rgba(196,217,188,0.2)', color: '#3D6B3D', borderColor: 'rgba(90,143,90,0.2)' }}>
            💧 {era}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4614A]">
            <span>🔥</span>
            <span>{profile.streak} week streak</span>
          </div>
        </div>

        {/* Avatar + Ring */}
        <div className="flex items-center justify-between relative z-10 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: aura.bg,
                boxShadow: `0 4px 16px ${aura.glow}`,
                border: `2px solid ${aura.ring}`,
              }}>
              <AvatarDisplay avatar={avatar} size={56} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E1A16]">{profile.name.split(' ')[0]}</p>
              <p className="text-xs font-bold text-[#5A8F5A] mt-0.5">You're glowing up 🔥</p>
            </div>
          </div>

          <div className="relative pointer-events-auto">
            <GrowthRing score={profile.flagScore} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5 pointer-events-none">
              <span className="text-xl font-bold text-[#1E1A16]" style={{ letterSpacing: '-0.5px' }}>{profile.flagScore}</span>
              <span className="text-[8px] text-[#8A8070] uppercase font-bold tracking-wider -mt-1">Score</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8A8070]">Progress</span>
            <span className="text-xs font-bold text-[#5A8F5A] flex items-center gap-1">{eraConfig.nextGoal}</span>
          </div>
          <div className="h-2 rounded-full bg-[#F4F1EC] overflow-hidden">
            <motion.div className="h-full rounded-full bg-[#5A8F5A]" initial={{ width: 0 }}
              animate={{ width: `${profile.flagScore}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }} />
          </div>
        </div>
      </motion.div>

      {/* ── Quick Insights ── */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-5 shadow-sm border border-[#EBE5DA]">
          <span className="text-2xl font-bold text-[#EBE5DA] mb-0.5">{greenRate}%</span>
          <span className="text-[10px] font-bold text-[#8A8070] uppercase tracking-wide">Green rate</span>
        </div>
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-5 shadow-sm border border-[#EBE5DA]">
          <span className="text-2xl font-bold text-[#EBE5DA] mb-0.5">{daysLogged}</span>
          <span className="text-[10px] font-bold text-[#8A8070] uppercase tracking-wide">Days logged</span>
        </div>
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-5 shadow-sm border border-[#EBE5DA]">
          <span className="text-2xl font-bold text-[#EBE5DA] mb-0.5">{profile.bestStreak || 0}</span>
          <span className="text-[10px] font-bold text-[#8A8070] uppercase tracking-wide">Best streak</span>
        </div>
      </div>

      {/* ── Monthly Calendar ── */}
      <MonthlyCalendar logs={logs} onLogDate={onLogDate} />

      {/* ── Action Cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <button 
          onClick={() => { onLogDate(todayStr); showToastMsg("Opened logger for Green Choices"); }} 
          className="bg-white rounded-2xl flex flex-col p-4 text-left border border-[rgba(90,143,90,0.3)] shadow-sm active:scale-95 transition-transform pointer-events-auto" 
          style={{ background: 'linear-gradient(145deg, #F4F7F2, #E4EDE0)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] text-[#5A8F5A] border border-[rgba(90,143,90,0.3)]">✓</span>
            <span className="text-[10px] font-bold text-[#3D6B3D] uppercase tracking-wider">Green Choices</span>
          </div>
          <p className="text-3xl font-bold text-[#1F3D20] mb-2">{monthlyGreenFlags}</p>
          <span className="text-[10px] font-bold text-[#5A8F5A] opacity-70">Tap to log a green</span>
        </button>
        
        <button 
          onClick={() => { onLogDate(todayStr); showToastMsg("Opened logger for Red Choices"); }} 
          className="bg-white rounded-2xl flex flex-col p-4 text-left border border-[rgba(212,97,74,0.3)] shadow-sm active:scale-95 transition-transform pointer-events-auto" 
          style={{ background: 'linear-gradient(145deg, #FDF9F3, #FDEEED)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] text-[#D4614A] border border-[rgba(212,97,74,0.3)]">✕</span>
            <span className="text-[10px] font-bold text-[#D4614A] uppercase tracking-wider">Red Choices</span>
          </div>
          <p className="text-3xl font-bold text-[#4A1F1A] mb-2">{monthlyRedFlags}</p>
          <span className="text-[10px] font-bold text-[#D4614A] opacity-70">Tap to log a red</span>
        </button>
      </div>

      {/* ── Best Habit Card ── */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EBE5DA] relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF5D1] to-[#FFE898] flex items-center justify-center text-2xl shadow-inner border border-[#FFE898]">
            ⭐
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-[#8A8070] uppercase tracking-wider mb-1">Best Habit</h4>
            <p className="text-sm font-bold text-[#1E1A16] leading-snug pr-4">
              {topHabitText}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button className="flex-1 py-2.5 rounded-xl border border-[#EBE5DA] text-xs font-bold text-[#8A8070] bg-[#FDFAF5] active:bg-[#EBE5DA] transition-colors" onClick={() => onLogDate(todayStr)}>
            ✏️ Edit today
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-[#EBE5DA] text-xs font-bold text-[#8A8070] bg-[#FDFAF5] active:bg-[#EBE5DA] transition-colors" onClick={() => showToastMsg("Sending habit to Claude for personalized tips... 🤖")}>
            ✨ Tips ↗
          </button>
        </div>
      </div>

    </div>
  );
}
