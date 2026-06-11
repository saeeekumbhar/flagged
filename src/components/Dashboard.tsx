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
  onAwardXP: (xpAmount: number, coinsAmount: number, reason: string) => void;
  onQuickLog?: (type: 'green' | 'red') => void;
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

function MonthlyCalendar({ logs, onLogDate, profile }: { logs: Record<string, DailyLog>, onLogDate: (date: string) => void, profile: UserProfile }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'activity' | 'trends'>('calendar');
  
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
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 rounded-[14px] py-2.5 text-xs font-bold transition-all shadow-sm ${activeTab === 'calendar' ? 'bg-white text-[#1E1A16]' : 'text-[#A0988A] shadow-none bg-transparent hover:text-[#1E1A16]'}`}>Calendar</button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`flex-1 rounded-[14px] py-2.5 text-xs font-bold transition-all shadow-sm ${activeTab === 'activity' ? 'bg-white text-[#1E1A16]' : 'text-[#A0988A] shadow-none bg-transparent hover:text-[#1E1A16]'}`}>Activity Log</button>
        <button 
          onClick={() => setActiveTab('trends')}
          className={`flex-1 rounded-[14px] py-2.5 text-xs font-bold transition-all shadow-sm ${activeTab === 'trends' ? 'bg-white text-[#1E1A16]' : 'text-[#A0988A] shadow-none bg-transparent hover:text-[#1E1A16]'}`}>Trends</button>
      </div>

      {activeTab === 'calendar' && (
        <>
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
                bgColor = '#347346';
                textColor = '#FFFFFF';
                fontWeight = 'bold';
              } else if (log) {
                if (log.totalFlagImpact > 0) { bgColor = '#EAF3EA'; textColor = '#2D5D2D'; fontWeight = 'bold'; }
                else if (log.totalFlagImpact < 0) { bgColor = '#FDECEE'; textColor = '#A03030'; fontWeight = 'bold'; }
                else { bgColor = '#F4F1EC'; textColor = '#1E1A16'; fontWeight = 'bold'; }
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
        </>
      )}

      {activeTab === 'activity' && (
        <div className="flex flex-col gap-3 min-h-[200px] max-h-[300px] overflow-y-auto no-scrollbar pb-4">
          {Object.values(logs)
            .filter(l => l.activities.length > 0 || l.notes)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(log => (
              <div key={log.date} className="bg-[#FDF9F3] rounded-[16px] p-4 flex flex-col gap-2 relative pointer-events-auto" onClick={() => onLogDate(log.date)}>
                <div className="text-sm font-bold text-[#1F3D20]">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div className="flex flex-wrap gap-2">
                  {log.activities.map((act, i) => {
                    const isRed = act.activityId.includes('red') || act.activityId.includes('car') || act.activityId.includes('ac') || act.activityId.includes('delivery') || act.activityId.includes('major');
                    return (
                      <div key={i} className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${isRed ? 'bg-[#FDECEE] text-[#A03030]' : 'bg-[#EAF3EA] text-[#2D5D2D]'}`}>
                        {isRed ? '🔴' : '🟢'} {act.activityId.replace('quick_', '').replace('_', ' ')} x{act.count}
                      </div>
                    );
                  })}
                </div>
                {log.notes && <div className="text-xs italic text-[#8A8070] mt-1">"{log.notes}"</div>}
              </div>
          ))}
          {Object.values(logs).filter(l => l.activities.length > 0 || l.notes).length === 0 && (
            <div className="text-center text-[#A0988A] text-sm py-10 font-medium">No activities logged yet.</div>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="flex flex-col gap-4 py-2 min-h-[200px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#EAF3EA] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-lg font-bold text-[#2D5D2D]">
                {Object.values(logs).reduce((acc, log) => acc + log.activities.filter(a => !(a.activityId.includes('red') || a.activityId.includes('car') || a.activityId.includes('ac') || a.activityId.includes('delivery') || a.activityId.includes('major'))).reduce((sum, a) => sum + a.count, 0), 0)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#5A8F5A] font-semibold mt-1">Green Flags</div>
            </div>
            <div className="bg-[#FDECEE] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl mb-1">⚠️</div>
              <div className="text-lg font-bold text-[#A03030]">
                {Object.values(logs).reduce((acc, log) => acc + log.activities.filter(a => a.activityId.includes('red') || a.activityId.includes('car') || a.activityId.includes('ac') || a.activityId.includes('delivery') || a.activityId.includes('major')).reduce((sum, a) => sum + a.count, 0), 0)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#D4614A] font-semibold mt-1">Red Flags</div>
            </div>
          </div>
          
          <div className="bg-[#FDF9F3] rounded-[16px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#A0988A] font-semibold">Longest Streak</div>
                <div className="text-sm font-bold text-[#1E1A16]">{profile.bestStreak} Days</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function Dashboard({ profile, logs, onLogDate, onOpenProfile, onAwardXP, onQuickLog }: DashboardProps) {
  const [toast, setToast] = useState<{msg: string, type?: 'green'|'darkGreen'} | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<{id: string, icon: string, label: string, isUnlocked: boolean, msg: string} | null>(null);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

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
        if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home') || a.activityId === 'quick_green') monthlyGreenFlags++;
        if (a.activityId.includes('car') || a.activityId.includes('delivery') || a.activityId.includes('ac') || a.activityId.includes('major') || a.activityId === 'quick_red') monthlyRedFlags++;
      });
    }
  });

  const greenRate = totalFlagsInMonth > 0 ? Math.round((monthlyGreenFlags / totalFlagsInMonth) * 100) : 0;
  const daysLogged = Object.keys(logs).length;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  let greenToday = 0;
  let redToday = 0;
  if (logs[todayStr]) {
    logs[todayStr].activities.forEach(a => {
      if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home') || a.activityId === 'quick_green') greenToday += a.count;
      if (a.activityId.includes('car') || a.activityId.includes('delivery') || a.activityId.includes('ac') || a.activityId.includes('major') || a.activityId === 'quick_red') redToday += a.count;
    });
  }

  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);
  let topHabitText = "Start logging to discover your best habits!";
  if (sortedActivities.length > 0) {
    const topDef = ACTIVITIES.find(a => a.id === sortedActivities[0][0]);
    if (topDef) {
      topHabitText = `Crushing it with ${topDef.label} — ${sortedActivities[0][1]} days logged!`;
    }
  }


  const showToastMsg = (msg: string, type?: 'green'|'darkGreen') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`flagged_challenges_${todayStr}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleChallengeClick = (id: string, max: number, xp: number) => {
    const current = challengeProgress[id] || 0;
    if (current >= max) return;
    
    const next = current + 1;
    const newProgress = { ...challengeProgress, [id]: next };
    setChallengeProgress(newProgress);
    localStorage.setItem(`flagged_challenges_${todayStr}`, JSON.stringify(newProgress));
    
    if (next === max) {
      onAwardXP(xp, Math.round(xp / 2), 'Challenge done!');
      showToastMsg(`Challenge done! +${xp} XP`);
    }
  };

  const handleStreakClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStreakModalOpen(true);
    
    const claimedDate = localStorage.getItem('flagged_streak_claimed');
    if (claimedDate !== todayStr) {
      onAwardXP(30, 50, 'Streak bonus!');
      localStorage.setItem('flagged_streak_claimed', todayStr);
    }
  };

  return (
    <div className="pb-8 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-4 relative z-10 pointer-events-auto">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
            <motion.div 
              initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
              className={`${toast.type === 'darkGreen' ? 'bg-[#3A6E3A]' : 'bg-[#3A8F3A]'} text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold text-center w-max max-w-full`}
            >
              {toast.msg}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header (HUD) ── */}
      <motion.div className="flex items-center justify-between pl-1 mb-2"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-logo text-[#3A8F3A] text-[18px]">
            <span className="text-[20px] relative top-[-1px]">⚑</span> FLAGGED
          </div>
          <div className="text-[9px] text-[#8A8070] uppercase tracking-wider font-bold ml-6 -mt-1">
            Carbon Footprint Tracker
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 border border-[#F5D990] text-xs font-semibold text-[#854F0B] shadow-sm">
          <span>🟡</span> {profile.coins || 0} pts
        </div>
      </motion.div>

      {/* ── Era & Level Card ── */}
      <motion.div className="bg-white rounded-[16px] p-[13px] shadow-sm border border-[#EBE5DA] relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <div className="text-[13px] font-bold text-[#1E1A16]">{era}</div>
            <div className="text-[10px] text-[#A0988A] mt-0.5">Every green flag grows your tree.</div>
          </div>
          <div className="bg-[#3A8F3A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            Lv {profile.level || 1}
          </div>
        </div>
        <div className="h-2.5 bg-[#EAF3DE] rounded-full overflow-hidden mb-1">
          <div className="h-full bg-[#3A8F3A] rounded-full transition-all duration-1000 ease-out" style={{ width: `${((profile.xp || 0) / 1000) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#A0988A] font-medium">
          <span>{profile.xp || 0} XP</span>
          <span>1000 XP</span>
        </div>
      </motion.div>

      {/* ── Avatar Profile Card ── */}
      <motion.button 
        onClick={onOpenProfile}
        className="w-full text-left bg-white rounded-[16px] p-[13px] shadow-sm border border-[#EBE5DA] relative overflow-hidden active:scale-[0.98] transition-transform"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center gap-3 relative z-10 w-full">
          {/* Avatar Area */}
          <div className="relative">
            <motion.div key={greenToday + redToday} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl bg-[#E8F4E8] border-[3px] border-[#3A8F3A]"
              style={{
                boxShadow: `0 4px 16px ${aura.glow}`,
              }}>
              <AvatarDisplay avatar={avatar} size={54} score={profile.flagScore} />
            </motion.div>
            <div className="absolute -bottom-1 -right-1 bg-[#3A8F3A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[10px] border-[1.5px] border-white z-10">
              {profile.level || 1}
            </div>
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#1E1A16] truncate">{profile.name.split(' ')[0]}</p>
            <p className="text-[11px] font-bold text-[#3A8F3A] mt-0.5 truncate">Main character energy. Green flag era loading...</p>
          </div>

          {/* Streak Badge */}
          <button 
            onClick={handleStreakClick}
            className="flex flex-col items-center bg-[#FFF8E8] border-[0.5px] border-[#F5D990] rounded-xl px-2.5 py-1.5 pointer-events-auto shrink-0 active:scale-95 transition-transform"
          >
            <div className="text-[20px] font-medium text-[#854F0B] leading-none">{profile.streak}</div>
            <div className="text-[9px] text-[#854F0B] mt-0.5">day streak</div>
          </button>

          {/* Score Ring */}
          <div className="relative w-[50px] h-[50px] pointer-events-auto shrink-0 -mr-1">
            <svg width="50" height="50" viewBox="0 0 58 58" className="-rotate-90">
              <circle cx="29" cy="29" r="23" fill="none" stroke="#EAF3DE" strokeWidth="6" />
              <circle cx="29" cy="29" r="23" fill="none" stroke="#3A8F3A" strokeWidth="6" strokeDasharray="144.5" strokeDashoffset={144.5 * (1 - profile.flagScore / 100)} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[15px] font-bold text-[#1E1A16] leading-none">{profile.flagScore}</span>
              <span className="text-[9px] text-[#A0988A] leading-none mt-0.5">score</span>
            </div>
          </div>
        </div>
      </motion.button>

      {/* ── Daily Stats ── */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#F6F4EE] rounded-[12px] flex flex-col items-center justify-center py-2.5 px-2 text-center h-[60px]">
          {greenToday === 0 ? (
            <span className="text-[10px] text-[#A0988A] font-medium leading-tight">Your day is unwritten.<br/>Make it green.</span>
          ) : (
            <>
              <span className="text-[20px] font-medium text-[#1E1A16] leading-none">{greenToday}</span>
              <span className="text-[10px] text-[#A0988A] mt-0.5">green today</span>
            </>
          )}
        </div>
        <div className="bg-[#F6F4EE] rounded-[12px] flex flex-col items-center justify-center py-2.5 px-2 text-center h-[60px]">
          {redToday === 0 && greenToday === 0 ? (
             <span className="text-[10px] text-[#A0988A] font-medium leading-tight">No red flags.<br/>Keep it up!</span>
          ) : (
            <>
              <span className="text-[20px] font-medium text-[#1E1A16] leading-none">{redToday}</span>
              <span className="text-[10px] text-[#A0988A] mt-0.5">red today</span>
            </>
          )}
        </div>
      </div>

      {/* ── Action Cards ── */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button 
          onClick={() => {
            if (onQuickLog) onQuickLog('green');
            showToastMsg('Green logged! +10 XP +5 pts', 'darkGreen');
          }} 
          className="bg-[#E8F4E8] rounded-[14px] py-[14px] px-[10px] text-center border border-[#B2D9B2] active:scale-95 transition-transform pointer-events-auto flex flex-col items-center gap-[5px] h-[90px] justify-center">
          <div className="text-[28px] drop-shadow-sm">🌿</div>
          <div className="text-[11px] font-bold text-[#3A6E3A]">Green choice</div>
          <div className="text-[10px] text-[#3A6E3A]">+10 XP · +5 pts</div>
        </button>
        
        <button 
          onClick={() => {
            if (onQuickLog) onQuickLog('red');
            showToastMsg('Red logged — you got this!', 'darkGreen');
          }} 
          className="bg-[#FDE8E8] rounded-[14px] py-[12px] px-[10px] text-center border border-[#F5B8B8] active:scale-95 transition-transform pointer-events-auto flex flex-col items-center gap-[2px] h-[90px] justify-center">
          <div className="text-[28px] drop-shadow-sm">💨</div>
          <div className="text-[11px] font-bold text-[#C04A4A]">Red choice</div>
          <div className="text-[9px] text-[#C04A4A] leading-tight opacity-90">Red flag, but fixable.<br/>We don't judge.</div>
        </button>
      </div>

      {/* ── Daily Challenges ── */}
      <div className="bg-white rounded-[16px] p-3 shadow-sm border border-[#EBE5DA] mb-2">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] font-bold text-[#A0988A] uppercase tracking-[0.5px]">Daily challenges</span>
          <span className="text-[10px] text-[#3A8F3A] cursor-pointer">new ↗</span>
        </div>
        
        {/* Challenge 1 */}
        <div className="mb-2.5 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => handleChallengeClick('ch1', 1, 20)}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-[#EAF3DE] rounded-[10px] flex items-center justify-center text-lg shrink-0">🚌</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#1E1A16] truncate">Use public transport</div>
              <div className="text-[10px] text-[#A0988A] mt-0.5 truncate">How'd you get here? Bus = automatic green flag.</div>
            </div>
            <div className="text-[10px] font-bold text-[#854F0B]">+20 XP</div>
          </div>
          <div className="h-1.5 bg-[#EAF3DE] rounded-full overflow-hidden mb-0.5">
            <div className="h-full bg-[#3A8F3A] transition-all" style={{ width: `${Math.min(100, ((challengeProgress['ch1'] || 0) / 1) * 100)}%` }} />
          </div>
          <div className="text-[9px] text-[#A0988A]">{Math.min(1, challengeProgress['ch1'] || 0)} / 1</div>
        </div>

        {/* Challenge 2 */}
        <div className="mb-2.5 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => handleChallengeClick('ch2', 1, 15)}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-[#EAF3DE] rounded-[10px] flex items-center justify-center text-lg shrink-0">🥗</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#1E1A16] truncate">Eat a green meal</div>
              <div className="text-[10px] text-[#A0988A] mt-0.5 truncate">Mess food hits different for the planet tbh.</div>
            </div>
            <div className="text-[10px] font-bold text-[#854F0B]">+15 XP</div>
          </div>
          <div className="h-1.5 bg-[#EAF3DE] rounded-full overflow-hidden mb-0.5">
            <div className="h-full bg-[#3A8F3A] transition-all" style={{ width: `${Math.min(100, ((challengeProgress['ch2'] || 0) / 1) * 100)}%` }} />
          </div>
          <div className="text-[9px] text-[#A0988A]">{Math.min(1, challengeProgress['ch2'] || 0)} / 1</div>
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="bg-white rounded-[16px] p-3 shadow-sm border border-[#EBE5DA] mb-4 overflow-hidden">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] font-bold text-[#A0988A] uppercase tracking-[0.5px]">Badges</span>
          <span className="text-[10px] text-[#A0988A] font-medium">swipe →</span>
        </div>
        <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'streak7', icon: '🔥', label: 'Streak 7', isUnlocked: profile.bestStreak >= 7, lockedMsg: 'Keep logging every day to unlock this.', unlockedMsg: 'Great work earning this achievement!' },
            { id: 'busRider', icon: '🚌', label: 'Bus rider', isUnlocked: (activityCounts['commute_public'] || 0) > 0, lockedMsg: 'Use public transport to unlock this.', unlockedMsg: 'Great work earning this achievement!' },
            { id: 'greenWeek', icon: '🌱', label: 'Green week', isUnlocked: monthlyGreenFlags >= 7, lockedMsg: 'Log 7 green choices this month to unlock.', unlockedMsg: 'Great work earning this achievement!' },
            { id: '30days', icon: '💎', label: '30 days', isUnlocked: profile.bestStreak >= 30, lockedMsg: 'Keep logging green choices to unlock this.', unlockedMsg: 'Great work earning this achievement!' }
          ].map(badge => (
            <button key={badge.id} onClick={() => setSelectedBadge({ ...badge, msg: badge.isUnlocked ? badge.unlockedMsg : badge.lockedMsg })} className="shrink-0 w-16 flex flex-col items-center gap-1 active:scale-95 transition-transform">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-xl border-[0.5px] ${badge.isUnlocked ? 'bg-[#FFF8E8] border-[#F5D990]' : 'bg-[#F0EDE4] border-[#EBE5DA] opacity-50 grayscale'}`}>
                {badge.icon}
              </div>
              <div className="text-[9px] text-[#A0988A] text-center leading-[1.2] whitespace-nowrap">{badge.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Monthly Calendar ── */}
      <MonthlyCalendar logs={logs} onLogDate={onLogDate} profile={profile} />

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

      {/* ── Badge Modal ── */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40" onClick={() => setSelectedBadge(null)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[420px] rounded-t-[24px] pb-8 pt-6 px-6 relative shadow-2xl flex flex-col items-center"
            >
              <button onClick={() => setSelectedBadge(null)} className="absolute top-6 right-6 text-[#1E1A16] font-bold text-lg active:scale-90 transition-transform">×</button>
              <div className="w-full flex items-center gap-2 mb-1">
                <span className="text-xl">{selectedBadge.icon}</span>
                <h3 className="text-[17px] font-bold text-[#1E1A16]">{selectedBadge.label}</h3>
              </div>
              <p className="w-full text-[13px] text-[#1E1A16] mb-8">{selectedBadge.isUnlocked ? "You earned this badge!" : "Not unlocked yet — keep going!"}</p>
              
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-[50px] mb-6 shadow-sm border border-[#EBE5DA] ${selectedBadge.isUnlocked ? 'bg-[#FDF9F3] opacity-100' : 'bg-[#F0EDE4] opacity-50 grayscale'}`}>
                {selectedBadge.icon}
              </div>
              <p className="text-[13px] text-[#1E1A16] font-medium text-center">{selectedBadge.msg}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Streak Modal ── */}
      <AnimatePresence>
        {isStreakModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40" onClick={() => setIsStreakModalOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[420px] rounded-t-[24px] pb-8 pt-6 px-6 relative shadow-2xl flex flex-col items-center"
            >
              <button onClick={() => setIsStreakModalOpen(false)} className="absolute top-6 right-6 text-[#1E1A16] font-bold text-lg active:scale-90 transition-transform">×</button>
              <div className="w-full flex items-center gap-2 mb-1">
                <h3 className="text-[17px] font-bold text-[#1E1A16]">Streak reward!</h3>
              </div>
              <p className="w-full text-[13px] text-[#1E1A16] mb-8">You claimed your {profile.streak}-day streak bonus.</p>
              
              <div className="text-[50px] mb-6 drop-shadow-md">
                🔥
              </div>
              
              <div className="text-[20px] font-bold text-[#1E1A16] mb-1">
                +50 pts <span className="text-[#A0988A] font-medium px-1">·</span> +30 XP
              </div>
              <p className="text-[13px] text-[#1E1A16] font-medium text-center">Keep going for the 30-day badge!</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
