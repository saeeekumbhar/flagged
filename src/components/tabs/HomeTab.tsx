import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, calculateEra, DailyLog, NavState } from '../../types';
import { getFlagEvolutionStage } from '../../avatars';
import { AvatarDisplay } from '../AvatarDisplay';
import { generateFlagForecast } from '../../utils/growthEngine';
import { Logo } from '../Logo';

interface HomeTabProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onAwardXP: (xp: number, coins: number, reason: string) => void;
  onNavigate: (state: NavState) => void;
  showToastMsg: (msg: string, type?: 'green'|'darkGreen') => void;
}

export function HomeTab({ profile, logs, onAwardXP, onNavigate }: HomeTabProps) {
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const era = calculateEra(profile.flagScore);
  const flagEvolution = getFlagEvolutionStage(profile.flagScore);
  const forecast = generateFlagForecast(logs, profile);

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

  const handleStreakClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStreakModalOpen(true);
    
    const claimedDate = localStorage.getItem('flagged_streak_claimed');
    if (claimedDate !== todayStr) {
      onAwardXP(30, 50, 'Streak bonus!');
      localStorage.setItem('flagged_streak_claimed', todayStr);
    }
  };

  const currentMonth = new Date().getMonth();
  const activityCounts: Record<string, number> = {};
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
      });
    }
  });

  const accessories: string[] = [];
  if (profile.bestStreak >= 7) accessories.push('🔥');
  if ((activityCounts['commute_public'] || 0) >= 1) accessories.push('🚲');
  if ((activityCounts['food_home'] || 0) >= 1) accessories.push('🍃');

  return (
    <div className="h-full max-w-[420px] mx-auto px-4 pt-4 pb-4 flex flex-col justify-between relative z-10 pointer-events-auto">
      
      {/* ── Header (HUD) ── */}
      <motion.div className="flex items-center justify-between pl-1 mb-2"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 premium-pill px-3 py-1.5 text-xs font-bold text-white border-white/60">
            <span>🟡</span> {profile.coins || 0} pts
          </div>
          <motion.button 
            onClick={() => onNavigate({ type: 'tab', tab: 'profile' })}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 premium-pill flex items-center justify-center transition-transform border-white/60"
          >
            <span className="text-white">👤</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Era & Level Card ── */}
      <motion.div className="premium-glass rounded-[20px] py-3 px-4 relative overflow-hidden shrink-0"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-[15px] font-bold text-white tracking-wide leading-tight drop-shadow-md">{era}</div>
            <div className="text-[10px] text-white/80 font-medium mt-0.5">Every green flag grows your tree.</div>
          </div>
          <div className="bg-[#889063] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_10px_rgba(136,144,99,0.5)]">
            Lv {profile.level || 1}
          </div>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-1.5 border border-white/10 shadow-inner">
          <div className="h-full bg-[#889063] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(136,144,99,0.8)]" style={{ width: `${((profile.xp || 0) / 1000) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-white/80 font-bold tracking-wider mt-1.5">
          <span>{profile.xp || 0} XP</span>
          <span>1000 XP</span>
        </div>
      </motion.div>

      {/* ── Asymmetrical Grid: Avatar & Streak ── */}
      <div className="grid grid-cols-3 gap-2.5 shrink-0">
        <motion.div 
          className="col-span-2 premium-glass rounded-[20px] p-3 flex flex-col justify-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="flex items-center gap-3 relative z-10">
            <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
               <AvatarDisplay score={profile.flagScore} size={48} accessories={accessories} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-white truncate mb-0.5 tracking-wide drop-shadow-md">{flagEvolution.stageName}</p>
              <p className="text-[10px] font-bold text-[#E4EDE0] mb-1.5 uppercase tracking-wider drop-shadow-sm">Score: {profile.flagScore}</p>
              {flagEvolution.nextThreshold ? (
                 <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                   <div className="h-full bg-[#E4EDE0] rounded-full" style={{ width: `${Math.min(100, (profile.flagScore / flagEvolution.nextThreshold) * 100)}%` }} />
                 </div>
              ) : (
                 <p className="text-[10px] font-bold text-[#F5D990] drop-shadow-md">Legendary Max! 🌟</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.button 
          onClick={handleStreakClick}
          whileTap={{ scale: 0.95 }}
          className="col-span-1 premium-glass rounded-[20px] p-3 flex flex-col items-center justify-center transition-transform"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <div className="text-[28px] mb-1 drop-shadow-md">🔥</div>
          <div className="text-[24px] font-bold text-white leading-none tracking-tight drop-shadow-md">{profile.streak}</div>
          <div className="text-[8px] font-bold text-white/70 uppercase tracking-widest mt-1.5">Streak</div>
        </motion.button>
      </div>

      {/* ── Forecast & Daily Stats ── */}
      <div className="flex flex-col gap-2.5 w-full shrink-0">
        <motion.div 
          className="premium-glass rounded-[20px] p-3.5 flex items-start gap-3"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="text-2xl drop-shadow-md shrink-0">🔮</div>
          <div className="flex-1">
            <h4 className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-1 drop-shadow-sm">Forecast</h4>
            <p className="text-[13px] font-bold text-white leading-tight mb-1 drop-shadow-md">{forecast.prediction}</p>
            <p className="text-[11px] text-[#E4EDE0] leading-tight font-medium drop-shadow-sm">{forecast.opportunity}</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-2.5">
          <motion.div className="premium-glass rounded-[20px] p-3 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="text-[32px] font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tighter leading-none">{greenToday}</div>
            <div className="text-[9px] text-white/80 font-bold uppercase tracking-widest leading-tight drop-shadow-md mt-0.5">Green<br/>Flags</div>
          </motion.div>
          
          <motion.div className="premium-glass rounded-[20px] p-3 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="text-[32px] font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tighter leading-none">{redToday}</div>
            <div className="text-[9px] text-[#FDECEE]/80 font-bold uppercase tracking-widest leading-tight drop-shadow-md mt-0.5">Red<br/>Flags</div>
          </motion.div>
        </div>
      </div>

      {/* ── Action CTA ── */}
      <motion.div className="w-full shrink-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
        {logs[todayStr] ? (
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate({ type: 'day_details', date: todayStr })}
            className="w-full premium-glass rounded-full py-3.5 px-6 transition-transform flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl drop-shadow-sm">📝</div>
              <div className="text-left">
                <div className="text-[14px] font-bold text-white group-hover:text-[#E4EDE0] transition-colors tracking-wide drop-shadow-md">Day Logged</div>
                <div className="text-[10px] text-white/70 font-medium mt-0.5">Tap to edit trackers</div>
              </div>
            </div>
            <div className="text-white font-bold text-base">→</div>
          </motion.button>
        ) : (
          <motion.button 
            whileTap={{ scale: 0.96 }}
            animate={{ boxShadow: ['0 0 0px rgba(136,144,99,0)', '0 0 24px rgba(136,144,99,0.4)', '0 0 0px rgba(136,144,99,0)'] }}
            transition={{ boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
            onClick={() => onNavigate({ type: 'day_details', date: todayStr })}
            className="w-full bg-[#354024] text-white rounded-full py-3.5 px-6 shadow-[0_8px_30px_rgba(53,64,36,0.3)] border border-[#4C3D19] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl drop-shadow-sm">✨</div>
              <div className="text-left">
                <div className="text-[14px] font-bold tracking-wide">Daily Check-In</div>
                <div className="text-[10px] text-white/70 font-bold mt-0.5">Takes 30 seconds</div>
              </div>
            </div>
            <div className="text-white font-bold text-base">→</div>
          </motion.button>
        )}
      </motion.div>

      {/* ── Streak Modal ── */}
      <AnimatePresence>
        {isStreakModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsStreakModalOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="premium-glass w-full max-w-[420px] rounded-t-[40px] pb-10 pt-8 px-6 relative shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col items-center"
            >
              <button onClick={() => setIsStreakModalOpen(false)} className="absolute top-8 right-8 text-[#4C3D19] hover:text-[#1A2315] font-bold text-xl active:scale-90 transition-transform">×</button>
              <div className="w-full flex items-center justify-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-[#1A2315] tracking-wide">Streak reward!</h3>
              </div>
              <p className="text-[13px] text-[#4C3D19] mb-8 font-medium">You claimed your {profile.streak}-day streak bonus.</p>
              
              <div className="text-[60px] mb-8 drop-shadow-md">
                🔥
              </div>
              
              <div className="text-2xl font-bold text-[#889063] mb-2 drop-shadow-sm">
                +50 pts <span className="text-[#CFBB99] font-medium px-2">·</span> +30 XP
              </div>
              <p className="text-[13px] text-[#4C3D19] font-medium text-center">Keep going for the 30-day badge!</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
