import React from 'react';
import { motion } from 'motion/react';
import { PixelCard } from './PixelCard';
import { UserProfile, calculateEra } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onBack: () => void;
}

export function Profile({ profile, onBack }: ProfileProps) {
  const era = calculateEra(profile.flagScore);

  return (
    <div className="space-y-6 pb-20 max-w-md mx-auto p-4 pt-10">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="font-pixel text-[#D98A7A] mr-4 hover:-translate-x-1 transition-transform">{"< BACK"}</button>
        <h2 className="font-sans font-black text-xl text-[#3A3532] uppercase">Player Profile</h2>
      </div>

      <PixelCard className="text-center">
        <div className="w-24 h-24 mx-auto bg-[#FFFFFF] flex items-center justify-center border-4 border-[#8BA888] mb-4 brutal-shadow-inset overflow-hidden">
           <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover pixelated" />
        </div>
        <h3 className="font-sans font-black text-2xl text-[#3A3532]">{profile.name}</h3>
        <p className="font-pixel text-xs text-[#8BA888] uppercase tracking-widest mt-1">{era}</p>
      </PixelCard>

      <div className="grid grid-cols-2 gap-4">
        <PixelCard className="p-4 text-center">
          <div className="font-pixel text-2xl mb-1 text-[#D98A7A]">🔥 {profile.streak}</div>
          <div className="text-[10px] font-sans text-[#3A3532]/60 font-bold uppercase tracking-wider">Wk Streak</div>
        </PixelCard>
        <PixelCard className="p-4 text-center">
           <div className="font-pixel text-2xl mb-1 text-[#8BA888]">3</div>
           <div className="text-[10px] font-sans text-[#3A3532]/60 font-bold uppercase tracking-wider">Badges</div>
        </PixelCard>
      </div>

      <PixelCard>
        <h4 className="font-pixel text-sm mb-4 text-[#3A3532]">Badges</h4>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#FFFFFF] border-2 border-[#8BA888] flex items-center justify-center text-xl">🌱</div>
            <span className="text-[10px] font-pixel text-[#3A3532]/60 uppercase">Seed</span>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#FFFFFF] border-2 border-[#8BA888] flex items-center justify-center text-xl">🚲</div>
            <span className="text-[10px] font-pixel text-[#3A3532]/60 uppercase">Rider</span>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#FFFFFF] border-2 border-[#8BA888] flex items-center justify-center text-xl">💧</div>
            <span className="text-[10px] font-pixel text-[#3A3532]/60 uppercase">Hydro</span>
          </div>
        </div>
      </PixelCard>

      <PixelCard>
        <h4 className="font-pixel text-sm mb-4 text-[#3A3532]">Semester Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm bg-[#FFFFFF] p-2 border-l-4 border-[#8BA888]">
            <span className="text-xs font-bold uppercase text-[#3A3532]/80">Mess Meals</span>
            <span className="font-mono font-bold text-[#8BA888]">+24</span>
          </div>
          <div className="flex justify-between items-center text-sm bg-[#FFFFFF] p-2 border-l-4 border-[#8BA888]">
            <span className="text-xs font-bold uppercase text-[#3A3532]/80">Cycle/Walk</span>
            <span className="font-mono font-bold text-[#8BA888]">+16</span>
          </div>
          <div className="flex justify-between items-center text-sm bg-[#FFFFFF] p-2 border-l-4 border-[#D98A7A]">
            <span className="text-xs font-bold uppercase text-[#3A3532]/80">Delivery</span>
            <span className="font-mono font-bold text-[#D98A7A]">-4</span>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
