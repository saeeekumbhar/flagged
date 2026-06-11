import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, calculateEra, DailyLog } from '../types';
import { getFlagEvolutionStage } from '../avatars';
import { AvatarDisplay } from './AvatarDisplay';
import { calculateFlagDNA, calculateGlowUp } from '../utils/growthEngine';
import { FlagDNACard } from './FlagDNACard';

interface ProfileProps {
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  onBack: () => void;
  onAvatarChange?: (avatarId: string) => void;
}

const BADGES = [
  { emoji: '🚩', label: 'First Flag', desc: 'Started your journey' },
  { emoji: '🚲', label: 'Active Mover', desc: '5 days active commute' },
  { emoji: '💧', label: 'Mindful Energy', desc: 'Unplugged 7 times' },
];

export function Profile({ profile, logs, onBack, onAvatarChange }: ProfileProps) {
  const era = calculateEra(profile.flagScore);
  const flagEvolution = getFlagEvolutionStage(profile.flagScore);
  const dna = calculateFlagDNA(logs);
  const glowUp = calculateGlowUp(logs, profile);

  const eraStyle = era === 'Green Flag Era' ? 'era-badge-green'
    : era === 'Glow Up Era' ? 'era-badge-mixed'
    : 'era-badge-red';

  const eraEmoji = era === 'Green Flag Era' ? '🟢' : era === 'Glow Up Era' ? '🔥' : '🔴';

  const stats = [
    { label: 'Flag Score', value: profile.flagScore, emoji: '🚩', color: '#5A8F5A' },
    { label: 'Week Streak', value: `${profile.streak}wk`, emoji: '🔥', color: '#D4A574' },
    { label: 'Badges', value: BADGES.length, emoji: '✨', color: '#5A9AB5' },
  ];

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5A8F5A] transition-colors"
          style={{ background: 'rgba(196,217,188,0.3)' }}>
          ←
        </button>
        <h1 className="text-display text-2xl font-bold text-[#1F3D20]">My Profile</h1>
      </div>

      {/* Flag DNA Share Card */}
      <FlagDNACard profile={profile} dna={dna} />

      {/* Evolution History & Accessories */}
      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-sm font-bold text-[#1E1A16] mb-3">Evolution Status</h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EDE4] border border-[#EBE5DA]">
            <span className="text-sm font-semibold text-[#1E1A16]">Current Mood</span>
            <span className="text-sm font-bold text-[#5A8F5A]">{flagEvolution.mood}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EDE4] border border-[#EBE5DA]">
            <span className="text-sm font-semibold text-[#1E1A16]">Stage</span>
            <span className="text-sm font-bold text-[#1E1A16]">{flagEvolution.stage} / 5</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#1E1A16] mb-3">Unlocked Accessories</h3>
        <div className="flex gap-3">
          {['🔥', '🚲', '🏆'].slice(0, Math.floor(profile.flagScore / 20)).map((acc, i) => (
             <div key={i} className="w-12 h-12 rounded-xl bg-white border border-[#EBE5DA] flex items-center justify-center text-xl shadow-sm">
                {acc}
             </div>
          ))}
          {Math.floor(profile.flagScore / 20) === 0 && (
            <span className="text-xs text-[#A0988A]">Keep logging to unlock accessories.</span>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="soft-card p-3 text-center"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="font-bold text-lg text-[#1E1A16]" style={{ fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
            <div className="text-[10px] text-[#8A8070] font-semibold uppercase tracking-wide mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#1E1A16] mb-4">Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {BADGES.map((badge, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)', boxShadow: '0 2px 10px rgba(90,143,90,0.15)' }}>
                {badge.emoji}
              </div>
              <span className="text-[10px] font-bold text-[#5A8070] uppercase text-center leading-tight max-w-[56px]">{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Glow-Up Counter */}
      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-sm font-bold text-[#1E1A16] mb-1">Glow-Up Stats</h3>
        <p className="text-[10px] text-[#A0988A] mb-4">Since joining FLAGGED</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#EAF3DE] rounded-xl p-3 flex flex-col justify-center border border-[#EBE5DA]">
            <div className="text-xl mb-1">🌲</div>
            <div className="text-lg font-bold text-[#1E1A16]">{glowUp.treesEquivalent}</div>
            <div className="text-[9px] text-[#5A8F5A] font-bold uppercase tracking-wide leading-tight">Trees worth of CO₂</div>
          </div>
          <div className="bg-[#FDF6EC] rounded-xl p-3 flex flex-col justify-center border border-[#EBE5DA]">
            <div className="text-xl mb-1">💸</div>
            <div className="text-lg font-bold text-[#1E1A16]">₹{glowUp.moneySaved}</div>
            <div className="text-[9px] text-[#D4A574] font-bold uppercase tracking-wide leading-tight">Estimated savings</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EBE5DA]">
            <span className="text-sm font-semibold text-[#1E1A16]">Green Flags Completed</span>
            <span className="text-sm font-bold text-[#5A8F5A]">{glowUp.greenFlagsCompleted}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EBE5DA]">
            <span className="text-sm font-semibold text-[#1E1A16]">Days Logged</span>
            <span className="text-sm font-bold text-[#1E1A16]">{glowUp.daysLogged}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EBE5DA]">
            <span className="text-sm font-semibold text-[#1E1A16]">Best Streak</span>
            <span className="text-sm font-bold text-[#D4614A]">{glowUp.bestStreak} 🔥</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
