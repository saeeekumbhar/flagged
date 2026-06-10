import React from 'react';
import { motion } from 'motion/react';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { UserProfile, calculateEra, Era } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onCheckInStart: () => void;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
  onOpenProfile?: () => void;
}

export function Dashboard({ profile, onCheckInStart, biggestGreenFlag, biggestRedFlag, onOpenProfile }: DashboardProps) {
  const era: Era = calculateEra(profile.flagScore);

  let eraColor = "text-[#3A3532]";
  let eraTextBg = "bg-[#FDFBF7]";
  let eraShadow = "shadow-[6px_6px_0px_0px_#4A423D]";
  
  if (era === 'Green Flag Era') {
    eraColor = "text-[#FDFBF7]";
    eraTextBg = "bg-[#8BA888]";
    eraShadow = "shadow-[6px_6px_0px_0px_#5A715A]";
  } else if (era === 'Red Flag Era') {
    eraColor = "text-[#FDFBF7]";
    eraTextBg = "bg-[#D98A7A]";
    eraShadow = "shadow-[6px_6px_0px_0px_#A35C4E]";
  }

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto p-4 pt-8">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-center mb-6 pb-4 border-b-4 border-[#4A423D]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 pixelated drop-shadow-[2px_2px_0px_#8BA888]" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none font-mono text-[#3A3532]">FLAGGED</h1>
            <p className="text-[10px] text-[#8BA888] font-bold uppercase tracking-widest mt-1 italic">Green flag behavior</p>
          </div>
        </div>
        <button onClick={onOpenProfile} className="flex gap-2 items-center font-mono active:translate-y-1 transition-transform outline-none group text-left">
          <div className="text-right">
            <p className="text-[10px] opacity-60 uppercase">{profile.userType?.replace('_', ' ')}</p>
            <p className="text-xs font-bold text-[#3A3532]">{profile.name}</p>
          </div>
          <div className="w-12 h-12 bg-[#FFFFFF] flex flex-col items-center justify-center border-2 border-[#4A423D] brutal-shadow text-lg group-hover:border-[#8BA888] group-hover:shadow-[4px_4px_0px_0px_#4A423D] transition-colors overflow-hidden">
             <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover pixelated" />
          </div>
        </button>
      </motion.div>

      {/* Center Col: Avatar & Score */}
      <PixelCard variant="dark" className="items-center justify-center py-10 !p-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#8BA888 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        
        <div className="z-10 text-center flex flex-col items-center w-full py-10 relative">
          {/* Main Avatar Area */}
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 w-full h-full bg-[#8BA888] rounded-full opacity-20 blur-xl"></div>
            <img src="/tree.png" alt="Tree" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pixelated opacity-50 pointer-events-none" />
            <img src="/avatar.png" alt="Avatar" className="relative z-10 w-full h-full object-cover pixelated drop-shadow-[4px_4px_0px_rgba(74,66,61,0.5)]" />
          </div>

          <p className="text-xs font-black text-[#8BA888] uppercase tracking-[0.2em] mb-2 font-sans">Currently In Your</p>
          <h2 className={`text-2xl sm:text-3xl font-black italic ${eraTextBg} ${eraColor} px-6 py-2 ${eraShadow} inline-block mb-10 font-sans uppercase`}>{era}</h2>
          
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-7xl font-mono font-black leading-none text-[#8BA888] drop-shadow-[4px_4px_0px_#4A423D]">{profile.flagScore}</span>
            <div className="text-left pb-2">
              <p className="text-xs font-bold uppercase opacity-60 font-sans">Flag Score</p>
            </div>
          </div>
        </div>
      </PixelCard>

      <div className="grid grid-cols-2 gap-4">
        <PixelCard variant="green" className="p-4 flex flex-col justify-between h-28">
          <div className="text-[10px] font-bold uppercase border-b-2 border-white/20 pb-2 mb-2">Top Green Flag</div>
          <div className="font-mono font-bold text-sm leading-tight text-white">{biggestGreenFlag || "None yet"}</div>
        </PixelCard>
        <PixelCard variant="red" className="p-4 flex flex-col justify-between h-28">
          <div className="text-[10px] font-bold uppercase border-b-2 border-white/20 pb-2 mb-2">Top Red Flag</div>
          <div className="font-mono font-bold text-sm leading-tight text-white">{biggestRedFlag || "None yet"}</div>
        </PixelCard>
      </div>

      <PixelCard variant="green" className="!bg-[#5A715A] !border-[#8BA888] !text-[#FDFBF7] !brutal-shadow-lg">
        <h4 className="text-xs font-black uppercase mb-3 font-sans opacity-90 text-[#FDFBF7]">Weekly Insight</h4>
        <p className="text-sm leading-tight italic mb-4 font-mono text-[#FDFBF7]/90">"Clean. Passing on the personal car is a huge green flag. Your era is showing."</p>
        <button className="w-full bg-[#FDFBF7] text-[#5A715A] font-black text-xs py-2 border-b-4 border-[#4A423D] active:translate-y-1 active:border-b-0 uppercase transition-all">Share Card</button>
      </PixelCard>

      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-md mx-auto z-40">
        <PixelButton onClick={onCheckInStart} className="w-full text-lg py-4 flex items-center justify-center gap-3">
          <span>📝</span> Weekly Check-In
        </PixelButton>
      </div>
    </div>
  );
}
