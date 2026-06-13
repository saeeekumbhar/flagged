import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra, DailyLog, NavState } from '../../types';
import { getFlagEvolutionStage } from '../../avatars';
import { AvatarDisplay } from '../AvatarDisplay';
import { calculateGlowUp } from '../../services/AnalyticsService';
import { FlagDNACard } from '../FlagDNACard';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAIInsights } from '../../hooks';

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
  const { insights, isLoading } = useAIInsights();
  const dna = insights?.flagDNA;

  const era = calculateEra(profile.flagScore);
  const flagEvolution = getFlagEvolutionStage(profile.flagScore);
  const glowUp = calculateGlowUp(logs, profile);

  const logValues = Object.values(logs).filter(l => l.dailyScore !== undefined).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let bestDay = { score: 0, date: 'N/A' };
  let worstDay = { score: 100, date: 'N/A' };
  let trend = 'Neutral ➖';

  if (logValues.length > 0) {
    logValues.forEach(log => {
      if (log.dailyScore! >= bestDay.score) bestDay = { score: log.dailyScore!, date: log.date };
      if (log.dailyScore! <= worstDay.score) worstDay = { score: log.dailyScore!, date: log.date };
    });

    if (logValues.length >= 2) {
      const firstHalf = logValues.slice(0, Math.floor(logValues.length / 2));
      const secondHalf = logValues.slice(Math.floor(logValues.length / 2));
      const avg1 = firstHalf.reduce((sum, l) => sum + l.dailyScore!, 0) / firstHalf.length;
      const avg2 = secondHalf.reduce((sum, l) => sum + l.dailyScore!, 0) / secondHalf.length;
      if (avg2 > avg1 + 5) trend = 'Improving 📈';
      else if (avg2 < avg1 - 5) trend = 'Declining 📉';
    }
  }
  
  const formatShortDate = (dStr: string) => dStr === 'N/A' ? 'N/A' : new Date(dStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset your profile? This will delete your current onboarding data so you can start over.")) {
      try {
        localStorage.clear();
        if (auth.currentUser) {
           await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        }
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-display text-2xl font-bold drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>Profile</h2>
        <div className="flex items-center gap-2">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="User" className="w-8 h-8 rounded-full border border-white/30 shadow-sm object-cover" />
          ) : (
            <span className="text-[13px] font-bold text-white drop-shadow-md px-1">{profile.name.split(' ')[0]}</span>
          )}
          
          <button onClick={() => onNavigate({ type: 'settings' })} className="w-8 h-8 rounded-full bg-white/10 border border-white/30 flex items-center justify-center shadow-sm active:scale-95 transition-transform hover:bg-white/20 text-white drop-shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="12" cy="12" r="3"></circle>
               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          
          <button onClick={handleSignOut} className="h-8 px-3 rounded-full bg-white/10 border border-white/30 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:bg-white/20">
             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
             </svg>
          </button>
        </div>
      </div>

      {/* Flag DNA Share Card */}
      <FlagDNACard profile={profile} dna={dna} isLoading={isLoading} />

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

      {/* Flag Score Stats */}
      <motion.div className="premium-glass rounded-[32px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-sm font-bold text-[#1A2315] mb-3">Score Analytics</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">30-Day Average</span>
            <span className="text-sm font-bold text-[#347346]">{profile.flagScore}/100</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Best Day</span>
            <span className="text-sm font-bold text-[#1A2315]">{bestDay.date === 'N/A' ? 'N/A' : `${bestDay.score}/100 (${formatShortDate(bestDay.date)})`}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Worst Day</span>
            <span className="text-sm font-bold text-[#A03030]">{worstDay.date === 'N/A' ? 'N/A' : `${worstDay.score}/100 (${formatShortDate(worstDay.date)})`}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-white/40 border border-white/60">
            <span className="text-sm font-semibold text-[#1A2315]">Monthly Trend</span>
            <span className="text-sm font-bold text-[#1A2315]">{trend}</span>
          </div>
        </div>
      </motion.div>

      {/* Glow-Up Counter */}
      <motion.div className="premium-glass rounded-[32px] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#1A2315] mb-1">Glow-Up Stats</h3>
        <p className="text-[10px] text-[#4C3D19] mb-4">Since joining FLAGGED</p>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <div className="bg-[#E4EDE0] rounded-[24px] p-4 flex flex-col justify-center border border-white/60 shadow-inner">
            <div className="text-xl mb-1">🌲</div>
            <div className="text-lg font-bold text-[#1A2315]">{glowUp.treesEquivalent}</div>
            <div className="text-[9px] text-[#2D5D2D] font-bold uppercase tracking-wide leading-tight">Trees worth of CO₂</div>
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
