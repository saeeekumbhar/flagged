import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog } from '../../types';
import { useAIInsights, useSpeech, useSettings } from '../../hooks';

interface InsightsTabProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
}

export function InsightsTab({ profile, logs }: InsightsTabProps) {
  const { insights, isLoading } = useAIInsights();
  const { speak, stop, playingId, isSupported } = useSpeech();
  const { settings } = useSettings();

  const handleVoice = (id: string, text: string) => {
    if (playingId === id) {
      stop();
    } else {
      speak(text, id);
    }
  };

  const VoiceButton = ({ id, text }: { id: string, text: string }) => {
    if (!settings.voiceInsights || !isSupported) return null;
    const isPlaying = playingId === id;
    
    return (
      <button 
        onClick={() => handleVoice(id, text)}
        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 active:scale-95 transition-all ${isPlaying ? 'bg-[#354024] border-[#354024] text-white' : 'bg-white/50 border-[#CFBB99] text-[#354024] hover:bg-white/70'}`}
        aria-label={isPlaying ? "Stop reading" : "Listen to insight"}
      >
        {isPlaying ? '⏹️' : '🔊'}
      </button>
    );
  };

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-white drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>Insights</h2>

      {isLoading ? (
        <motion.div className="premium-glass rounded-[32px] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[200px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-10 h-10 rounded-full border-4 border-[#889063] border-t-transparent animate-spin" />
          <p className="text-[15px] font-bold text-[#354024] animate-pulse">Analyzing your week 🌱</p>
        </motion.div>
      ) : !insights || !insights.weeklySummary ? (
        <div className="premium-glass rounded-[32px] p-6 text-center text-[#4C3D19] font-bold">
          Couldn't generate insights right now. Log more check-ins to receive your first weekly report!
        </div>
      ) : (
        <>
          {/* Card 1: AI Weekly Insight */}
          <motion.div className="premium-glass rounded-[28px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">🌱</span>
                <h3 className="text-[14px] font-bold text-[#1A2315] uppercase tracking-wider">Your Week in Green</h3>
              </div>
              <VoiceButton id="weekly" text={`${insights.weeklySummary}. Your biggest win was ${insights.biggestWin}. The main area for improvement is ${insights.improvementArea}.`} />
            </div>
            <p className="text-[15px] font-semibold text-[#1A2315] leading-snug mb-4">{insights.weeklySummary}</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 rounded-xl p-3 border border-white/20">
                <div className="text-[10px] uppercase font-bold text-[#2D5D2D] mb-1 flex items-center gap-1"><span>📈</span> Top Habit</div>
                <div className="text-[12px] font-bold text-[#1A2315] leading-tight">{insights.biggestWin}</div>
              </div>
              <div className="bg-black/5 rounded-xl p-3 border border-black/5">
                <div className="text-[10px] uppercase font-bold text-[#8A3A3A] mb-1 flex items-center gap-1"><span>📉</span> Focus Area</div>
                <div className="text-[12px] font-bold text-[#1A2315] leading-tight">{insights.improvementArea}</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Action Card */}
          <motion.div className="premium-glass rounded-[28px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">🎯</span>
                <h3 className="text-[14px] font-bold text-[#1A2315] uppercase tracking-wider">Your Next Green Move</h3>
              </div>
              <VoiceButton id="action" text={insights.recommendation} />
            </div>
            <p className="text-[15px] font-semibold text-[#1A2315] leading-snug bg-white/30 p-4 rounded-2xl border border-white/20 mt-2">
              {insights.recommendation}
            </p>
          </motion.div>

          {/* Card 3: AI Challenge Card */}
          <motion.div className="bg-[#354024] rounded-[28px] p-5 shadow-lg relative overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">⚡</span>
                <h3 className="text-[14px] font-bold text-[#E4EDE0] uppercase tracking-wider">This Week's Challenge</h3>
              </div>
              <VoiceButton id="challenge" text={insights.challenge} />
            </div>
            <p className="text-[16px] font-bold text-white leading-snug relative z-10 mb-3">
              {insights.challenge}
            </p>
            <div className="text-[12px] font-medium text-[#CFBB99] relative z-10 italic">
              {insights.encouragement}
            </div>
          </motion.div>

          {/* Card 4: Flag DNA */}
          {insights.flagDNA && (
            <motion.div className="premium-glass rounded-[28px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl drop-shadow-sm">🧬</span>
                  <h3 className="text-[14px] font-bold text-[#1A2315] uppercase tracking-wider">Your Flag DNA</h3>
                </div>
                <VoiceButton id="dna" text={`Your primary trait is ${insights.flagDNA.primaryTrait}. ${insights.flagDNA.identityExplanation}`} />
              </div>
              <div className="bg-white/40 p-4 rounded-2xl border border-white/20 mt-2 flex flex-col items-center text-center">
                <div className="text-[20px] font-black text-[#2D5D2D] uppercase tracking-tight leading-none mb-2">
                  {insights.flagDNA.primaryTrait}
                </div>
                <div className="text-[13px] font-medium text-[#354024] leading-snug">
                  {insights.flagDNA.identityExplanation}
                </div>
              </div>
            </motion.div>
          )}

          {/* Card 5: Weekly Roast */}
          {insights.weeklyRoast && (
            <motion.div className="bg-[#EAE4DF] border border-[#D1B8A3] rounded-[28px] p-5 shadow-sm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl drop-shadow-sm">🔥</span>
                  <h3 className="text-[14px] font-bold text-[#8A3A3A] uppercase tracking-wider">Weekly Roast</h3>
                </div>
                <VoiceButton id="roast" text={insights.weeklyRoast} />
              </div>
              <p className="text-[14px] font-bold text-[#5A2A2A] leading-snug mt-2 italic">
                "{insights.weeklyRoast}"
              </p>
            </motion.div>
          )}

          {/* Card 6: Flag Forecast */}
          {insights.forecast && (
            <motion.div className="premium-glass rounded-[28px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl drop-shadow-sm">🔮</span>
                  <h3 className="text-[14px] font-bold text-[#1A2315] uppercase tracking-wider">Flag Forecast</h3>
                </div>
                <VoiceButton id="forecast" text={`${insights.forecast.prediction}. ${insights.forecast.opportunity}`} />
              </div>
              <div className="flex flex-col gap-3 mt-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#4C3D19] mb-0.5">Prediction</div>
                  <div className="text-[13px] font-bold text-[#1A2315] leading-snug">{insights.forecast.prediction}</div>
                </div>
                <div className="w-full h-[1px] bg-black/10" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#2D5D2D] mb-0.5">Opportunity</div>
                  <div className="text-[13px] font-bold text-[#1A2315] leading-snug">{insights.forecast.opportunity}</div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

    </div>
  );
}
