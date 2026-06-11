import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../../types';

interface CommunityTabProps {
  profile: UserProfile;
  onAwardXP: (xp: number, coins: number, reason: string) => void;
  showToastMsg: (msg: string, type?: 'green'|'darkGreen') => void;
}

export function CommunityTab({ profile, onAwardXP, showToastMsg }: CommunityTabProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  
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

  const friends = [
    { name: 'Aarav M.', score: 85, isMe: false },
    { name: profile.name, score: profile.flagScore, isMe: true },
    { name: 'Priya K.', score: 42, isMe: false },
    { name: 'Rohan D.', score: 28, isMe: false },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-[#354024] px-1">Community</h2>

      {/* ── Daily Challenges ── */}
      <motion.div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-5 shadow-sm border border-[#CFBB99]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#354024]">Active Challenges</h3>
          <span className="text-[10px] text-[#889063] font-bold bg-[#CFBB99] px-2 py-1 rounded-md">2 New</span>
        </div>
        
        {/* Challenge 1 */}
        <div className="mb-4 cursor-pointer active:scale-[0.98] transition-transform bg-[#E5D7C4] p-3 rounded-xl border border-[#CFBB99]" onClick={() => handleChallengeClick('ch1', 1, 20)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#CFBB99] rounded-xl flex items-center justify-center text-xl shrink-0 border border-[#BEE0BE]">🚌</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#354024] truncate">Use public transport</div>
              <div className="text-[11px] text-[#4C3D19] mt-0.5 truncate">How'd you get here? Bus = green flag.</div>
            </div>
            <div className="text-[11px] font-bold text-[#4C3D19] bg-[#FFF8E8] px-2 py-1 rounded-md">+20 XP</div>
          </div>
          <div className="h-2 bg-[#CFBB99] rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-[#889063] transition-all" style={{ width: `${Math.min(100, ((challengeProgress['ch1'] || 0) / 1) * 100)}%` }} />
          </div>
          <div className="text-[10px] text-[#4C3D19] font-semibold text-right">{Math.min(1, challengeProgress['ch1'] || 0)} / 1</div>
        </div>

        {/* Challenge 2 */}
        <div className="cursor-pointer active:scale-[0.98] transition-transform bg-[#E5D7C4] p-3 rounded-xl border border-[#CFBB99]" onClick={() => handleChallengeClick('ch2', 1, 15)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#CFBB99] rounded-xl flex items-center justify-center text-xl shrink-0 border border-[#BEE0BE]">🥗</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#354024] truncate">Eat a green meal</div>
              <div className="text-[11px] text-[#4C3D19] mt-0.5 truncate">Mess food hits different for the planet tbh.</div>
            </div>
            <div className="text-[11px] font-bold text-[#4C3D19] bg-[#FFF8E8] px-2 py-1 rounded-md">+15 XP</div>
          </div>
          <div className="h-2 bg-[#CFBB99] rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-[#889063] transition-all" style={{ width: `${Math.min(100, ((challengeProgress['ch2'] || 0) / 1) * 100)}%` }} />
          </div>
          <div className="text-[10px] text-[#4C3D19] font-semibold text-right">{Math.min(1, challengeProgress['ch2'] || 0)} / 1</div>
        </div>
      </motion.div>

      {/* ── Friend Leaderboard ── */}
      <motion.div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-5 shadow-sm border border-[#CFBB99]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-sm font-bold text-[#354024] mb-4">Friend Rankings</h3>
        <div className="flex flex-col gap-2">
          {friends.map((friend, index) => (
            <div key={friend.name} className={`flex items-center justify-between p-3 rounded-xl border ${friend.isMe ? 'bg-[#CFBB99] border-[#BEE0BE]' : 'bg-[#E5D7C4] border-[#CFBB99]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0 ? 'bg-[#CFBB99] text-[#4C3D19]' : index === 1 ? 'bg-[#E0E0E0] text-[#606060]' : index === 2 ? 'bg-[#D4A574] text-[#4C3D19]' : 'bg-transparent text-[#4C3D19]'}`}>
                  {index + 1}
                </div>
                <span className={`text-[13px] ${friend.isMe ? 'font-bold text-[#354024]' : 'font-medium text-[#354024]'}`}>
                  {friend.name} {friend.isMe && '(You)'}
                </span>
              </div>
              <span className={`text-[13px] font-bold ${friend.score >= 70 ? 'text-[#889063]' : friend.score <= 40 ? 'text-[#C04A4A]' : 'text-[#D4A574]'}`}>
                {friend.score} pts
              </span>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 rounded-xl border border-[#CFBB99] text-xs font-bold text-[#354024] active:bg-[#F4F1EC] transition-colors">
          Invite Friends
        </button>
      </motion.div>

    </div>
  );
}
