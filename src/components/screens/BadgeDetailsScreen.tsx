import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog } from '../../types';

interface BadgeDetailsScreenProps {
  key?: string;
  badgeId: string;
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onBack: () => void;
}

export function BadgeDetailsScreen({ badgeId, profile, logs, onBack }: BadgeDetailsScreenProps) {
  
  // Re-calculate some metrics
  const currentMonth = new Date().getMonth();
  let monthlyGreenFlags = 0;
  const activityCounts: Record<string, number> = {};
  
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
        if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home') || a.activityId === 'quick_green') monthlyGreenFlags++;
      });
    }
  });

  const allBadges = [
    { id: 'b1', icon: '🚩', label: 'First Flag', desc: 'Started your journey', isUnlocked: true, lockedMsg: 'Log your first activity.', unlockedMsg: 'You officially started your journey!' },
    { id: 'b2', icon: '🚲', label: 'Active Mover', desc: '5 days active commute', isUnlocked: (activityCounts['commute_walk_bike'] || 0) >= 5, lockedMsg: 'Walk or cycle for 5 days.', unlockedMsg: 'You are an active commuter!' },
    { id: 'b3', icon: '💧', label: 'Mindful Energy', desc: 'Unplugged 7 times', isUnlocked: (activityCounts['energy_mindful'] || 0) >= 7, lockedMsg: 'Unplug chargers 7 times.', unlockedMsg: 'Great job saving energy!' },
    { id: 'streak7', icon: '🔥', label: 'Streak 7', desc: '7 days in a row', isUnlocked: profile.bestStreak >= 7, lockedMsg: 'Keep logging every day to unlock this.', unlockedMsg: 'Great work earning a 7-day streak!' },
    { id: 'busRider', icon: '🚌', label: 'Bus rider', desc: 'Use public transport', isUnlocked: (activityCounts['commute_public'] || 0) > 0, lockedMsg: 'Use public transport to unlock this.', unlockedMsg: 'You are a bus rider!' },
    { id: 'greenWeek', icon: '🌱', label: 'Green week', desc: '7 green flags', isUnlocked: monthlyGreenFlags >= 7, lockedMsg: 'Log 7 green choices this month to unlock.', unlockedMsg: 'You had a very green week!' },
    { id: '30days', icon: '💎', label: '30 days', desc: '30 days streak', isUnlocked: profile.bestStreak >= 30, lockedMsg: 'Keep logging green choices to unlock this.', unlockedMsg: 'Incredible 30-day streak!' }
  ];

  const badge = allBadges.find(b => b.id === badgeId) || allBadges[0];

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-[#E5D7C4] overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#354024] bg-white/60 backdrop-blur-xl border border-[#CFBB99] shadow-sm active:scale-95 transition-transform"
          >
            ←
          </button>
        </div>

        {/* Badge Presentation */}
        <div className="flex flex-col items-center justify-center flex-1 pb-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className={`w-40 h-40 rounded-[32px] flex items-center justify-center text-[70px] mb-8 shadow-lg border border-[#CFBB99] ${badge.isUnlocked ? 'bg-gradient-to-br from-[#E4EDE0] to-[#E5D7C4]' : 'bg-[#CFBB99] opacity-50 grayscale'}`}
          >
            {badge.icon}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-[#354024] mb-2 text-center">
            {badge.label}
          </h2>
          
          <p className="text-sm font-bold text-[#4C3D19] uppercase tracking-wider mb-6 text-center">
            {badge.desc}
          </p>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-[#CFBB99] shadow-sm w-full">
            <h3 className="text-xs font-bold text-[#354024] uppercase tracking-wider mb-2">Status</h3>
            <p className={`text-sm font-semibold ${badge.isUnlocked ? 'text-[#889063]' : 'text-[#4C3D19]'}`}>
              {badge.isUnlocked ? 'Unlocked!' : 'Locked'}
            </p>
            <p className="text-sm text-[#354024] mt-2">
              {badge.isUnlocked ? badge.unlockedMsg : badge.lockedMsg}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
