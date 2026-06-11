import React, { useMemo, useState } from 'react';
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
  onQuickLog: (type: 'green' | 'red') => void;
  onNavigate: (state: NavState) => void;
  showToastMsg: (msg: string, type?: 'green'|'darkGreen') => void;
}

export function HomeTab({ profile, logs, onAwardXP, onQuickLog, onNavigate, showToastMsg }: HomeTabProps) {
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
    <div className="pb-20 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-4 relative z-10 pointer-events-auto">
      
      {/* ── Header (HUD) ── */}
      <motion.div className="flex items-center justify-between pl-1 mb-2"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur-xl rounded-full px-3 py-1 border border-[#CFBB99] text-xs font-semibold text-[#4C3D19] shadow-sm">
            <span>🟡</span> {profile.coins || 0} pts
          </div>
          <button 
            onClick={() => onNavigate({ type: 'tab', tab: 'profile' })}
            className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-xl border border-[#CFBB99] flex items-center justify-center shadow-sm active:scale-95 transition-transform text-[#354024]"
          >
            👤
          </button>
        </div>
      </motion.div>

      {/* ── Era & Level Card ── */}
      <motion.div className="bg-white/60 backdrop-blur-xl rounded-[16px] p-[13px] shadow-sm border border-[#CFBB99] relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <div className="text-[13px] font-bold text-[#354024]">{era}</div>
            <div className="text-[10px] text-[#4C3D19] mt-0.5">Every green flag grows your tree.</div>
          </div>
          <div className="bg-[#889063] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            Lv {profile.level || 1}
          </div>
        </div>
        <div className="h-2.5 bg-[#CFBB99] rounded-full overflow-hidden mb-1">
          <div className="h-full bg-[#889063] rounded-full transition-all duration-1000 ease-out" style={{ width: `${((profile.xp || 0) / 1000) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#4C3D19] font-medium">
          <span>{profile.xp || 0} XP</span>
          <span>1000 XP</span>
        </div>
      </motion.div>

      {/* ── Flag Avatar Status Card ── */}
      <motion.div 
        className="w-full text-left bg-white/60 backdrop-blur-xl rounded-[16px] p-4 shadow-sm border border-[#CFBB99] relative overflow-hidden flex items-center justify-between mb-2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0 pr-3">
          <div className="shrink-0 w-[72px] h-[72px]">
             <AvatarDisplay score={profile.flagScore} size={72} accessories={accessories} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-[14px] font-bold text-[#354024] truncate mb-0.5">{flagEvolution.stageName}</p>
            <p className="text-[12px] font-bold text-[#889063] mb-1.5">Score: {profile.flagScore}</p>
            
            {flagEvolution.nextThreshold ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] font-semibold text-[#4C3D19] pr-1">
                  <span>Next: {flagEvolution.nextThreshold}</span>
                  <span>{flagEvolution.pointsRemaining} left</span>
                </div>
                <div className="w-full h-1.5 bg-[#CFBB99] rounded-full overflow-hidden">
                  <div className="h-full bg-[#889063] rounded-full" 
                       style={{ width: `${Math.min(100, (profile.flagScore / flagEvolution.nextThreshold) * 100)}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-[11px] font-bold text-[#CFBB99]">Legendary Max! 🌟</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleStreakClick}
          className="flex flex-col items-center bg-[#FFF8E8] border-[0.5px] border-[#CFBB99] rounded-xl px-2.5 py-1.5 pointer-events-auto shrink-0 active:scale-95 transition-transform"
        >
          <div className="text-[20px] font-medium text-[#4C3D19] leading-none">{profile.streak}</div>
          <div className="text-[9px] text-[#4C3D19] mt-0.5">day streak</div>
        </button>
      </motion.div>

      {/* ── Flag Forecast Card ── */}
      <motion.div 
        className="bg-gradient-to-r from-[#E5D7C4] to-[#E5D7C4] rounded-[16px] p-3.5 mb-2 shadow-sm border border-[#CFBB99] flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="text-2xl drop-shadow-sm shrink-0">🔮</div>
        <div className="flex-1">
          <h4 className="text-[10px] font-bold text-[#4C3D19] uppercase tracking-wider mb-0.5">Forecast</h4>
          <p className="text-xs font-bold text-[#354024] leading-tight mb-0.5">{forecast.prediction}</p>
          <p className="text-[10px] text-[#889063] leading-tight">{forecast.opportunity}</p>
        </div>
      </motion.div>

      {/* ── Daily Stats ── */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#E5D7C4] rounded-[12px] flex flex-col items-center justify-center py-2.5 px-2 text-center h-[60px]">
          {greenToday === 0 ? (
            <span className="text-[10px] text-[#4C3D19] font-medium leading-tight">Your day is unwritten.<br/>Make it green.</span>
          ) : (
            <>
              <span className="text-[20px] font-medium text-[#354024] leading-none">{greenToday}</span>
              <span className="text-[10px] text-[#4C3D19] mt-0.5">green today</span>
            </>
          )}
        </div>
        <div className="bg-[#E5D7C4] rounded-[12px] flex flex-col items-center justify-center py-2.5 px-2 text-center h-[60px]">
          {redToday === 0 && greenToday === 0 ? (
             <span className="text-[10px] text-[#4C3D19] font-medium leading-tight">No red flags.<br/>Keep it up!</span>
          ) : (
            <>
              <span className="text-[20px] font-medium text-[#354024] leading-none">{redToday}</span>
              <span className="text-[10px] text-[#4C3D19] mt-0.5">red today</span>
            </>
          )}
        </div>
      </div>

      {/* ── Action Cards ── */}
      <div className="mb-2">
        {logs[todayStr] ? (
          <button 
            onClick={() => onNavigate({ type: 'day_summary', date: todayStr })}
            className="w-full bg-[#E5D7C4]/60 backdrop-blur-xl rounded-[16px] py-[16px] px-[16px] border border-[#CFBB99] active:scale-95 transition-transform pointer-events-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-[28px] drop-shadow-sm">📝</div>
              <div className="text-left">
                <div className="text-[14px] font-bold text-[#354024]">Day Logged</div>
                <div className="text-[11px] text-[#4C3D19] mt-0.5">Tap to view summary</div>
              </div>
            </div>
            <div className="text-[#889063] font-bold">→</div>
          </button>
        ) : (
          <button 
            onClick={() => onNavigate({ type: 'day_details', date: todayStr })}
            className="w-full bg-[#889063] rounded-[16px] py-[16px] px-[16px] shadow-md active:scale-95 transition-transform pointer-events-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-[28px] drop-shadow-sm">✨</div>
              <div className="text-left">
                <div className="text-[14px] font-bold text-[#E5D7C4]">Daily Check-In</div>
                <div className="text-[11px] text-[#E5D7C4]/80 mt-0.5">Takes 30 seconds</div>
              </div>
            </div>
            <div className="text-[#E5D7C4] font-bold">→</div>
          </button>
        )}
      </div>

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
              className="bg-white/60 backdrop-blur-xl w-full max-w-[420px] rounded-t-[24px] pb-8 pt-6 px-6 relative shadow-2xl flex flex-col items-center"
            >
              <button onClick={() => setIsStreakModalOpen(false)} className="absolute top-6 right-6 text-[#354024] font-bold text-lg active:scale-90 transition-transform">×</button>
              <div className="w-full flex items-center gap-2 mb-1">
                <h3 className="text-[17px] font-bold text-[#354024]">Streak reward!</h3>
              </div>
              <p className="w-full text-[13px] text-[#354024] mb-8">You claimed your {profile.streak}-day streak bonus.</p>
              
              <div className="text-[50px] mb-6 drop-shadow-md">
                🔥
              </div>
              
              <div className="text-[20px] font-bold text-[#354024] mb-1">
                +50 pts <span className="text-[#4C3D19] font-medium px-1">·</span> +30 XP
              </div>
              <p className="text-[13px] text-[#354024] font-medium text-center">Keep going for the 30-day badge!</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
