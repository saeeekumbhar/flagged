import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra } from '../types';
import { getFlagEvolutionStage } from '../avatars';
import { AvatarDisplay } from './AvatarDisplay';
import { FlagDNA } from '../services/AnalyticsService';

interface FlagDNACardProps {
  profile: UserProfile;
  dna?: FlagDNA;
  isLoading?: boolean;
}

export function FlagDNACard({ profile, dna, isLoading }: FlagDNACardProps) {
  const era = calculateEra(profile.flagScore);
  const evolution = getFlagEvolutionStage(profile.flagScore);

  const renderDots = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div 
            key={dot} 
            className={`w-2 h-2 rounded-full ${dot <= score ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 shadow-md border border-[#CFBB99] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#E4EDE0] to-transparent opacity-50 pointer-events-none" />
      
      {isLoading || !dna ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#889063] border-t-transparent animate-spin"></div>
          <p className="text-sm font-bold text-[#354024] animate-pulse">Gemini sequencing DNA...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-[11px] font-bold text-[#4C3D19] uppercase tracking-wider mb-1">Flag DNA</h3>
          <div className="text-xl font-bold text-[#354024]">{dna.primaryTrait}</div>
        </div>
        <button className="w-8 h-8 rounded-full bg-[#F4F1EC] flex items-center justify-center text-sm border border-[#CFBB99] active:scale-95 transition-transform">
          ↗
        </button>
      </div>

      <div className="flex gap-4 mb-6 relative z-10">
        <div className="w-20 h-20 shrink-0 bg-[#E5D7C4] rounded-2xl flex items-center justify-center border border-[#CFBB99] shadow-sm">
          <AvatarDisplay score={profile.flagScore} size={70} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm font-bold text-[#354024] mb-1">{profile.name}</div>
          <div className="text-xs text-[#889063] font-bold mb-0.5">{evolution.stageName}</div>
          <div className="text-[10px] text-[#4C3D19]">{era} • {profile.flagScore} pts</div>
        </div>
      </div>

      <p className="text-[13px] text-[#354024] italic mb-5 relative z-10 px-2 border-l-2 border-[#889063]">
        "{dna.description}"
      </p>

      <div className="space-y-3 relative z-10 bg-[#E5D7C4] p-4 rounded-2xl border border-[#CFBB99]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#354024]">Transport</span>
          {renderDots(dna.scores.transport)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#354024]">Food</span>
          {renderDots(dna.scores.food)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#354024]">Energy</span>
          {renderDots(dna.scores.energy)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#354024]">Shopping</span>
          {renderDots(dna.scores.shopping)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#354024]">Community</span>
          {renderDots(dna.scores.community)}
        </div>
      </div>

      <button className="w-full mt-4 bg-[#354024] text-white rounded-xl py-3 text-sm font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
        <span>📸</span> Share to Story
      </button>
      </>
      )}
    </motion.div>
  );
}
