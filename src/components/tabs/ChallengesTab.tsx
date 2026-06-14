import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../../types';

interface ChallengesTabProps {
  profile: UserProfile;
  onAwardXP: (xp: number, coins: number, reason: string) => void;
  showToastMsg: (msg: string, type?: 'green'|'darkGreen') => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const GREEN_CHALLENGES = [
  { id: 'day1', title: 'Day 1: Hydration Hero', description: 'Carry a reusable bottle all day.', emoji: '🚰', xp: 20, coins: 10 },
  { id: 'day2', title: 'Day 2: Delivery Detox', description: 'No online food delivery today.', emoji: '🍔', xp: 20, coins: 10 },
  { id: 'day3', title: 'Day 3: Public Transit', description: 'Use public transport or walk/cycle.', emoji: '🚌', xp: 20, coins: 10 },
  { id: 'day4', title: 'Day 4: Plant Power', description: 'Eat entirely meatless for the day.', emoji: '🥗', xp: 20, coins: 10 },
  { id: 'day5', title: 'Day 5: Zero Waste Snack', description: 'Eat snacks with no plastic wrapper.', emoji: '🍎', xp: 20, coins: 10 },
  { id: 'day6', title: 'Day 6: Unplugged', description: 'Unplug devices when not in use.', emoji: '🔌', xp: 20, coins: 10 },
  { id: 'day7', title: 'Day 7: Green Flag Master', description: 'Complete a full sustainable day.', emoji: '🌱', xp: 20, coins: 10 },
];

export function ChallengesTab({ profile, onAwardXP, showToastMsg, updateProfile }: ChallengesTabProps) {
  const completed = profile.completedChallenges || [];

  const handleComplete = async (challengeId: string) => {
    if (completed.includes(challengeId)) return;
    
    const newCompleted = [...completed, challengeId];
    await updateProfile({ completedChallenges: newCompleted });
    
    // This exact reason string maps to 'challenge_completed' in the App.tsx handler
    onAwardXP(20, 10, 'Challenge done!');
    showToastMsg('Mission completed! 🎉', 'green');
  };

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-white drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>7-Day Challenge</h2>
      <p className="text-white/90 px-1 text-[13px] font-medium leading-snug drop-shadow-sm">
        Compete with yourself. Unlock missions sequentially and build long-lasting green habits.
      </p>

      <div className="flex flex-col gap-3 mt-1">
        {GREEN_CHALLENGES.map((challenge, index) => {
          const isCompleted = completed.includes(challenge.id);
          const isUnlocked = index === 0 || completed.includes(GREEN_CHALLENGES[index - 1].id);
          
          return (
            <motion.div 
              key={challenge.id}
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }}
              className={`premium-glass rounded-[24px] p-5 relative overflow-hidden transition-all ${isCompleted ? 'border-[#BEE0BE] bg-white/20' : isUnlocked ? 'border-white/30' : 'opacity-60 grayscale'}`}
            >
              <div className="flex gap-4 items-start relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${isCompleted ? 'bg-[#889063] text-white shadow-md' : isUnlocked ? 'bg-white/20 text-white' : 'bg-black/20 text-white/50'}`}>
                  {isCompleted ? '✅' : challenge.emoji}
                </div>
                
                <div className="flex-1 min-w-0 pr-10">
                  <h3 className={`font-bold text-[15px] mb-1 truncate ${isCompleted ? 'text-white drop-shadow-sm' : isUnlocked ? 'text-white' : 'text-white/60'}`}>
                    {challenge.title}
                  </h3>
                  <p className={`text-[12px] font-medium leading-snug mb-3 ${isCompleted ? 'text-[#E4EDE0]' : isUnlocked ? 'text-white/80' : 'text-white/40'}`}>
                    {challenge.description}
                  </p>
                  
                  {isUnlocked && !isCompleted && (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleComplete(challenge.id)}
                      className="bg-white/20 hover:bg-white/30 border border-white/40 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm transition-colors backdrop-blur-md"
                    >
                      Complete Mission
                    </button>
                  )}
                  {isCompleted && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#CFBB99] drop-shadow-sm">
                      Completed
                    </div>
                  )}
                  {!isUnlocked && !isCompleted && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <span>🔒</span> Locked
                    </div>
                  )}
                </div>
                
                <div className="absolute top-5 right-5 text-[10px] font-bold text-white/80 bg-white/10 border border-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                  +{challenge.xp} XP
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
