import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog } from '../../types';
import { useAIInsights, useSpeech } from '../../hooks';

interface InsightsTabProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
}

export function InsightsTab({ profile, logs }: InsightsTabProps) {
  const { insights, isLoading } = useAIInsights();
  const { speak, stop, isPlaying, isSupported } = useSpeech();
  const roast = insights?.weeklyRoast;

  let walks = 0;
  let homeFood = 0;
  let noAC = 0;
  let noShopping = 0;
  
  const currentMonth = new Date().getMonth();
  
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      if (log.transport === 'walk' || log.transport === 'cycle') walks++;
      if (log.foodSource) {
        if (log.foodSource === 'home' || log.foodSource === 'mess') homeFood++;
      } else if (log.food === 'home' || log.food === 'mess') {
        homeFood++;
      }
      if (log.energyAC === 'none') noAC++;
      if (log.shopping === 'no') noShopping++;
    }
  });

  const habits = [
    { label: 'Walking/Cycling', count: walks, emoji: '🚶' },
    { label: 'Home Food', count: homeFood, emoji: '🍱' },
    { label: 'Unplugged AC', count: noAC, emoji: '❄️' },
    { label: 'No Shopping', count: noShopping, emoji: '🛍️' }
  ].sort((a, b) => b.count - a.count);

  let topHabitText = "Start logging to discover your best habits!";
  let topHabitEmoji = "⭐";
  
  if (habits[0].count > 0) {
    topHabitText = `Crushing it with ${habits[0].label} — ${habits[0].count} times this month!`;
    topHabitEmoji = habits[0].emoji;
  }

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-white drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>Insights</h2>

      {/* Weekly Report Card */}
      {isLoading ? (
        <motion.div className="premium-glass rounded-[32px] p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[160px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-8 h-8 rounded-full border-2 border-[#889063] border-t-transparent animate-spin"></div>
          <p className="text-sm font-bold text-[#354024] animate-pulse">Gemini is analyzing your week...</p>
        </motion.div>
      ) : insights?.weeklyReport ? (
        <motion.div className="premium-glass rounded-[32px] p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-[13px] font-bold text-[#1A2315] uppercase tracking-wider">Weekly Report</h3>
            </div>
            {isSupported && (
              <button 
                onClick={() => isPlaying ? stop() : speak(`${insights.weeklyReport!.improvementSummary}. Your biggest win: ${insights.weeklyReport!.biggestWin}. Next goal: ${insights.weeklyReport!.nextGoal}.`)}
                className="w-8 h-8 rounded-full bg-white/50 border border-[#CFBB99] flex items-center justify-center text-[#354024] active:scale-95 transition-transform"
              >
                {isPlaying ? '⏹️' : '▶️'}
              </button>
            )}
          </div>
          <p className="text-lg font-bold text-[#1A2315] mb-5 leading-snug">"{insights.weeklyReport.improvementSummary}"</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#EAF3EA] rounded-xl p-3 border border-[#BEE0BE]">
              <div className="text-[10px] uppercase font-bold text-[#2D5D2D] mb-1">Biggest Win</div>
              <div className="text-xs font-semibold text-[#354024] leading-snug">{insights.weeklyReport.biggestWin}</div>
            </div>
            <div className="bg-[#CFBB99] rounded-xl p-3 border border-[#BEE0BE] opacity-90">
              <div className="text-[10px] uppercase font-bold text-[#4C3D19] mb-1">Next Goal</div>
              <div className="text-xs font-semibold text-[#354024] leading-snug">{insights.weeklyReport.nextGoal}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="premium-glass rounded-[32px] p-6 text-center text-[#4C3D19] font-bold">
          Log some check-ins to receive your first weekly report!
        </div>
      )}

      {/* Forecast Card */}
      {insights?.weeklyForecast && (
        <motion.div className="bg-gradient-to-br from-[#1A2315] to-[#354024] rounded-[32px] p-6 shadow-lg relative overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl/50 flex items-center justify-center text-3xl shadow-inner border border-white/20 shrink-0">
              🔮
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-bold text-[#CFBB99] uppercase tracking-wider mb-1">AI Forecast</h4>
              <p className="text-[14px] font-medium text-white/90 leading-snug mb-3">
                {insights.weeklyForecast.likelyWeakArea}
              </p>
              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-[#BEE0BE] mb-1">Suggested Challenge</div>
                <div className="text-xs font-semibold text-white leading-snug">{insights.weeklyForecast.suggestedChallenge}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Personalized Recommendations */}
      {insights?.personalizedRecommendations && (
        <motion.div className="premium-glass rounded-[32px] p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold text-[#354024] mb-4">Coach's Corner</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl">
              <div className="text-xl">🔴</div>
              <div>
                <div className="text-xs font-bold text-[#A03030]">Red Flag</div>
                <div className="text-sm font-medium text-[#1A2315]">{insights.personalizedRecommendations.biggestRedFlag}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl">
              <div className="text-xl">🟢</div>
              <div>
                <div className="text-xs font-bold text-[#2D5D2D]">Green Flag</div>
                <div className="text-sm font-medium text-[#1A2315]">{insights.personalizedRecommendations.biggestGreenFlag}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl">
              <div className="text-xl">💡</div>
              <div>
                <div className="text-xs font-bold text-[#4C3D19]">Improvement Action</div>
                <div className="text-sm font-medium text-[#1A2315]">{insights.personalizedRecommendations.improvementAction}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
