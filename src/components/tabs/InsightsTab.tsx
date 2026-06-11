import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog } from '../../types';
import { generateWeeklyRoast } from '../../utils/growthEngine';
import { ACTIVITIES } from '../../activities';

interface InsightsTabProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
}

export function InsightsTab({ profile, logs }: InsightsTabProps) {
  const roast = generateWeeklyRoast(logs);

  const currentMonth = new Date().getMonth();
  const activityCounts: Record<string, number> = {};
  
  Object.values(logs).forEach(log => {
    log.activities.forEach(a => {
      activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + a.count;
    });
  });

  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);
  let topHabitText = "Start logging to discover your best habits!";
  let topHabitEmoji = "⭐";
  if (sortedActivities.length > 0) {
    const topDef = ACTIVITIES.find(a => a.id === sortedActivities[0][0]);
    if (topDef) {
      topHabitText = `Crushing it with ${topDef.label} — ${sortedActivities[0][1]} times logged!`;
      topHabitEmoji = topDef.emoji;
    }
  }

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-white drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>Insights</h2>

      {/* Weekly Roast Card */}
      {roast ? (
        <motion.div className="premium-glass rounded-[32px] p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h3 className="text-[13px] font-bold text-[#1A2315] uppercase tracking-wider">This Week's Roast</h3>
          </div>
          <p className="text-lg font-bold text-[#1A2315] mb-2 leading-snug">"{roast.roast}"</p>
          <p className="text-sm text-[#4C3D19] italic mb-5">{roast.realityCheck}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FDECEE] rounded-xl p-3 border border-[#F4B2B8]">
              <div className="text-[10px] uppercase font-bold text-[#A03030] mb-1">One Fix</div>
              <div className="text-xs font-semibold text-[#354024] leading-snug">{roast.oneFix}</div>
            </div>
            <div className="bg-[#CFBB99] rounded-xl p-3 border border-[#BEE0BE]">
              <div className="text-[10px] uppercase font-bold text-[#2D5D2D] mb-1">One Win</div>
              <div className="text-xs font-semibold text-[#354024] leading-snug">{roast.oneWin}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="premium-glass rounded-[32px] p-6 text-center text-[#4C3D19] font-bold">
          Log some activities to receive your first roast!
        </div>
      )}

      {/* Best Habit Card */}
      <motion.div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-3xl rounded-[32px] p-6 shadow-lg shadow-black/5 border border-white/60 relative overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-xl/50 flex items-center justify-center text-3xl shadow-inner border border-white/50 shrink-0">
            {topHabitEmoji}
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] font-bold text-[#4C3D19] uppercase tracking-wider mb-1">Top Habit</h4>
            <p className="text-[15px] font-bold text-[#354024] leading-snug">
              {topHabitText}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations / Chat Mockup */}
      <motion.div className="premium-glass rounded-[32px] p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#354024] mb-4">Quick Questions</h3>
        <div className="flex flex-col gap-2">
          <button className="text-left w-full premium-glass rounded-full p-4 text-sm font-semibold text-[#1A2315] active:scale-95 transition-transform">
            "How can I improve my transport score?"
          </button>
          <button className="text-left w-full premium-glass rounded-full p-4 text-sm font-semibold text-[#1A2315] active:scale-95 transition-transform">
            "What's the carbon footprint of my AC?"
          </button>
          <button className="text-left w-full premium-glass rounded-full p-4 text-sm font-semibold text-[#1A2315] active:scale-95 transition-transform">
            "Suggest a weekend challenge for me."
          </button>
        </div>
      </motion.div>

    </div>
  );
}
