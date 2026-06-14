import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog } from '../../types';
import { useAIInsights, useSpeech } from '../../hooks';

interface InsightsTabProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
}

export function InsightsTab({ profile, logs }: InsightsTabProps) {
  const { insights, isLoading } = useAIInsights();
  const { speak, stop, playingId, isSupported } = useSpeech();
  
  // Calculate local stats for the visual bar chart
  let walks = 0;
  let homeFood = 0;
  let deliveries = 0;
  let cabs = 0;
  
  const currentMonth = new Date().getMonth();
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      if (log.transport === 'walk' || log.transport === 'cycle' || log.transport === 'bus') walks++;
      if (log.transport === 'cab' || log.transport === 'car') cabs++;
      if (log.foodSource) {
        if (log.foodSource === 'home' || log.foodSource === 'mess') homeFood++;
      } else if (log.food === 'home' || log.food === 'mess') {
        homeFood++;
      }
      if (log.delivery === 'once' || log.delivery === 'multiple') deliveries++;
    }
  });

  const totalTransport = walks + cabs;
  const greenTransportPct = totalTransport > 0 ? (walks / totalTransport) * 100 : 0;

  const totalMeals = homeFood + deliveries;
  const goodFoodPct = totalMeals > 0 ? (homeFood / totalMeals) * 100 : 0;

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h2 className="text-display text-2xl font-bold text-white drop-shadow-md" style={{ color: '#FFFFFF' }}>Insights</h2>
        
        {isSupported && insights && insights.vibeCheck && !isLoading && (
          <button 
            onClick={() => playingId === 'vibe' ? stop() : speak(`${insights.vibeCheck}. Your main quest: ${insights.mainQuest}.`, 'vibe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all shadow-sm active:scale-95 ${playingId === 'vibe' ? 'bg-white text-[#354024] border-white' : 'bg-black/20 border-white/20 text-white/90 hover:bg-black/30'}`}
          >
            <span>{playingId === 'vibe' ? '⏹ Stop Voice' : '🔊 Play Voice'}</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <motion.div className="premium-glass rounded-[32px] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[200px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-10 h-10 rounded-full border-4 border-[#889063] border-t-transparent animate-spin" />
          <p className="text-[15px] font-bold text-[#354024] animate-pulse">Checking the vibes ✨</p>
        </motion.div>
      ) : !insights || !insights.vibeCheck ? (
        <div className="premium-glass rounded-[32px] p-6 text-center text-[#4C3D19] font-bold">
          Not enough data yet. Log some check-ins to unlock your aura!
        </div>
      ) : (
        <>
          {/* Card 1: The Vibe Check */}
          <motion.div className="premium-glass rounded-[32px] p-6 relative overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">✨</span>
                <h3 className="text-[15px] font-bold text-[#1A2315] uppercase tracking-wider">The Vibe Check</h3>
              </div>
            </div>

            <p className="text-[16px] font-semibold text-[#1A2315] leading-snug mb-5 relative z-10">
              {insights.vibeCheck}
            </p>
            
            {/* Visual Data Representation */}
            <div className="flex flex-col gap-4 relative z-10">
              {/* Transport Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide text-[#354024] mb-1.5">
                  <span>Green Transit</span>
                  <span>{Math.round(greenTransportPct)}%</span>
                </div>
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${greenTransportPct}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-[#889063] to-[#A3AA7B]"
                  />
                </div>
              </div>
              
              {/* Food Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide text-[#354024] mb-1.5">
                  <span>Home Cooked</span>
                  <span>{Math.round(goodFoodPct)}%</span>
                </div>
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goodFoodPct}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-[#D6A066] to-[#E5B582]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Main Quest */}
          <motion.div className="bg-[#1A2315] rounded-[32px] p-6 shadow-xl relative overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="absolute -bottom-10 -right-10 text-8xl opacity-10 blur-sm pointer-events-none">🎯</div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="text-2xl drop-shadow-sm">⚔️</span>
              <h3 className="text-[14px] font-bold text-[#CFBB99] uppercase tracking-wider">Main Quest</h3>
            </div>
            <p className="text-[18px] font-bold text-white leading-snug relative z-10">
              {insights.mainQuest}
            </p>
          </motion.div>

          {/* Card 3: Aura & DNA */}
          {insights.aura && (
            <motion.div className="bg-[#EAE4DF] border border-[#D1B8A3] rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-[13px] font-bold text-[#8A3A3A] uppercase tracking-widest mb-4">Your Aura</h3>
              
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#D6A066] blur-xl opacity-20 rounded-full" />
                <div className="bg-gradient-to-br from-[#889063] to-[#354024] text-white px-6 py-3 rounded-2xl shadow-lg border-2 border-[#E4EDE0] rotate-[-2deg] relative z-10">
                  <span className="text-xl font-black uppercase tracking-tight drop-shadow-md">
                    {insights.aura.title}
                  </span>
                </div>
              </div>

              <p className="text-[15px] font-semibold text-[#4C3D19] leading-snug">
                {insights.aura.description}
              </p>
            </motion.div>
          )}

        </>
      )}

    </div>
  );
}
