import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, DailyLog, NavState } from '../../types';
import { getFlagEvolutionStage } from '../../avatars';
import { AvatarDisplay } from '../AvatarDisplay';
import { calculateFlagDNA, calculateGlowUp } from '../../utils/growthEngine';
import { FlagDNACard } from '../FlagDNACard';

interface ProfileTabProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onNavigate: (state: NavState) => void;
  onAvatarChange?: (avatarId: string) => void;
}

const BADGES = [
  { id: 'b1', emoji: '🚩', label: 'First Flag', desc: 'Started your journey' },
  { id: 'b2', emoji: '🚲', label: 'Active Mover', desc: '5 days active commute' },
  { id: 'b3', emoji: '💧', label: 'Mindful Energy', desc: 'Unplugged 7 times' },
];

export function ProfileTab({ profile, logs, onNavigate }: ProfileTabProps) {
  const era = calculateEra(profile.flagScore);
  const flagEvolution = getFlagEvolutionStage(profile.flagScore);
  const dna = calculateFlagDNA(logs);
  const glowUp = calculateGlowUp(logs, profile);

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-display text-2xl font-bold text-white drop-shadow-md px-1">Profile</h2>
        <button className="w-10 h-10 rounded-full premium-glass flex items-center justify-center shadow-sm active:scale-95 transition-transform text-xl">
          ⚙️
        </button>
      </div>

      {/* Flag DNA Share Card */}
      <FlagDNACard profile={profile} dna={dna} />

      {/* Evolution Status */}
      <motion.div className="premium-glass rounded-[32px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-sm font-bold text-[#1A2315] mb-3">Evolution Status</h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Current Mood</span>
            <span className="text-sm font-bold text-[#1A2315]">{flagEvolution.mood}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Stage</span>
            <span className="text-sm font-bold text-[#1A2315]">{flagEvolution.stage} / 5</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#1A2315] mb-3">Unlocked Accessories</h3>
        <div className="flex gap-3">
          {['🔥', '🚲', '🏆'].slice(0, Math.floor(profile.flagScore / 20)).map((acc, i) => (
             <div key={i} className="w-12 h-12 rounded-[20px] premium-glass flex items-center justify-center text-xl shadow-sm">
                {acc}
             </div>
          ))}
          {Math.floor(profile.flagScore / 20) === 0 && (
            <span className="text-xs text-[#4C3D19]">Keep logging to unlock accessories.</span>
          )}
        </div>
      </motion.div>

      {/* Glow-Up Counter */}
      <motion.div className="premium-glass rounded-[32px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#1A2315] mb-1">Glow-Up Stats</h3>
        <p className="text-[10px] text-[#4C3D19] mb-4">Since joining FLAGGED</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#E4EDE0] rounded-[24px] p-4 flex flex-col justify-center border border-white/60 shadow-inner">
            <div className="text-xl mb-1">🌲</div>
            <div className="text-lg font-bold text-[#1A2315]">{glowUp.treesEquivalent}</div>
            <div className="text-[9px] text-[#2D5D2D] font-bold uppercase tracking-wide leading-tight">Trees worth of CO₂</div>
          </div>
          <div className="premium-glass rounded-[24px] p-4 flex flex-col justify-center">
            <div className="text-xl mb-1">💸</div>
            <div className="text-lg font-bold text-[#1A2315]">₹{glowUp.moneySaved}</div>
            <div className="text-[9px] text-[#4C3D19] font-bold uppercase tracking-wide leading-tight">Estimated savings</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Green Flags Completed</span>
            <span className="text-sm font-bold text-[#1A2315]">{glowUp.greenFlagsCompleted}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Days Logged</span>
            <span className="text-sm font-bold text-[#1A2315]">{glowUp.daysLogged}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Best Streak</span>
            <span className="text-sm font-bold text-[#D4614A]">{glowUp.bestStreak} 🔥</span>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div className="premium-glass rounded-[32px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-bold text-[#1A2315] mb-4">Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {BADGES.map((badge) => (
            <div 
              key={badge.id} 
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => onNavigate({ type: 'badge_details', badgeId: badge.id })}
            >
              <div className="w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl shadow-sm bg-white/40 border border-white/60">
                {badge.emoji}
              </div>
              <span className="text-[10px] font-bold text-[#1A2315] uppercase text-center leading-tight max-w-[56px]">{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
