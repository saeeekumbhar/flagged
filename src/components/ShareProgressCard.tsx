import React, { forwardRef } from 'react';
import { UserProfile, DailyLog, calculateEra } from '../types';
import { calculateGlowUp } from '../services/AnalyticsService';

interface ShareProgressCardProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  aura?: { title: string; description: string };
}

export const ShareProgressCard = forwardRef<HTMLDivElement, ShareProgressCardProps>(
  ({ profile, logs, aura }, ref) => {
    const era = calculateEra(profile.flagScore);
    const glowUp = calculateGlowUp(logs, profile);

    return (
      <div 
        ref={ref}
        className="w-[360px] h-[640px] bg-[#1A2315] relative overflow-hidden flex flex-col font-sans"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Background Gradients & Elements */}
        <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#889063] rounded-full blur-[80px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-20%] w-72 h-72 bg-[#354024] rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5 pointer-events-none">
          🌱
        </div>

        {/* Content Container */}
        <div className="flex flex-col h-full p-8 relative z-10 justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-white font-black text-xl tracking-tight">FLAGGED <span className="text-[#A3AA7B]">🌱</span></span>
            <span className="text-[#A3AA7B] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
              My Green Journey
            </span>
          </div>

          {/* Main Stats Area */}
          <div className="flex flex-col gap-6 mt-8">
            {/* Era & Score */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="text-[#D1B8A3] text-sm font-bold uppercase tracking-wider mb-2">Current Era</div>
              <div className="text-white text-2xl font-black mb-4 leading-tight">
                {era}
              </div>
              
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-[#A3AA7B] tracking-tighter">{profile.flagScore}</span>
                <span className="text-white/60 font-bold mb-1">/ 100</span>
              </div>
            </div>

            {/* Streak & Carbon */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-5 border border-white/20 flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-3xl mb-2">🔥</span>
                <span className="text-white font-bold text-lg">{glowUp.bestStreak} Day</span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Streak</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-5 border border-white/20 flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-3xl mb-2">🌍</span>
                <span className="text-white font-bold text-lg">{glowUp.treesEquivalent}</span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Trees Saved</span>
              </div>
            </div>

            {/* Aura */}
            {aura && (
              <div className="bg-gradient-to-r from-[#D6A066]/20 to-[#E5B582]/10 backdrop-blur-md rounded-[24px] p-5 border border-[#D6A066]/30 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-6xl opacity-20">✨</div>
                <div className="text-[#D6A066] text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Flag DNA</div>
                <div className="text-white text-lg font-bold leading-snug relative z-10">{aura.title}</div>
              </div>
            )}
          </div>

          {/* Footer Quote */}
          <div className="mt-auto mb-4 text-center">
            <div className="w-12 h-1 bg-white/20 mx-auto rounded-full mb-6" />
            <p className="text-white/80 font-medium text-lg italic">
              "Small choices. Real impact."
            </p>
          </div>
          
        </div>
      </div>
    );
  }
);

ShareProgressCard.displayName = 'ShareProgressCard';
