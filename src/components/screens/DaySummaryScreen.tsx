import React from 'react';
import { motion } from 'motion/react';
import { DailyLog, UserProfile } from '../../types';

interface DaySummaryScreenProps {
  key?: string;
  profile: UserProfile;
  date: string;
  existingLog?: DailyLog;
  onEdit: () => void;
  onBack: () => void;
}

export function DaySummaryScreen({ profile, date, existingLog, onEdit, onBack }: DaySummaryScreenProps) {
  
  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const getEmoji = (ref?: string) => {
    if (ref === 'rough') return '🚩';
    if (ref === 'mixed') return '🟡';
    if (ref === 'green') return '🟢';
    return '📝';
  };

  const SummaryItem = ({ label, value }: { label: string, value?: string }) => {
    if (!value) return null;
    
    // Quick formatting map
    const formatMap: Record<string, string> = {
      'walk': 'Walked', 'cycle': 'Cycled', 'bus': 'Bus', 'metro': 'Metro', 'auto': 'Auto', 'car': 'Car/Cab',
      'mess': 'Mess Food', 'home': 'Home Cooked', 'veg': 'Mostly Veg', 'mixed': 'Mixed Diet', 'nonveg': 'Mostly Non-Veg',
      'no': 'None', 'once': 'Once', 'multiple': 'Multiple Times',
      '<2h': 'Less than 2h', '2-4h': '2 to 4 hours', '4-8h': '4 to 8 hours', '8+h': '8+ hours',
      'none': 'None', '2-6h': '2 to 6 hours', '6+h': '6+ hours',
      'small': 'Small Purchase', 'medium': 'Medium Purchase', 'large': 'Major Purchase',
      'skip': 'Skipped Mess', 'outside': 'Ate Outside'
    };

    return (
      <div className="flex justify-between items-center py-3 border-b border-black/5 last:border-0">
        <span className="text-xs font-bold text-[#4C3D19] uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-[#1A2315] capitalize">{formatMap[value] || value}</span>
      </div>
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-white/70 backdrop-blur-3xl overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#354024] premium-pill active:scale-95 transition-transform"
          >
            ←
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#889063] uppercase tracking-wider mb-0.5">
              Day Summary
            </p>
            <h2 className="text-xl font-bold text-[#354024]">
              {displayDate}
            </h2>
          </div>
        </div>

        {/* Reflection Emoji Hero */}
        <div className="flex flex-col items-center justify-center py-6 mb-6">
          <div className="text-7xl drop-shadow-md mb-4">
            {getEmoji(existingLog?.reflection)}
          </div>
          <div className={`text-2xl font-bold ${existingLog?.totalFlagImpact && existingLog.totalFlagImpact > 0 ? 'text-[#889063]' : 'text-[#D4614A]'}`}>
            {existingLog?.totalFlagImpact && existingLog.totalFlagImpact > 0 ? '+' : ''}{existingLog?.totalFlagImpact || 0} pts
          </div>
        </div>

        {/* Details Card */}
        <div className="premium-glass rounded-[24px] p-6 mb-6">
          <SummaryItem label={profile.userType === 'hostelier' ? 'Mess Usage' : 'Transport'} value={existingLog?.transport} />
          <SummaryItem label="Food" value={existingLog?.food} />
          <SummaryItem label="Delivery" value={existingLog?.delivery} />
          <SummaryItem label="Laptop Usage" value={existingLog?.energyLaptop} />
          <SummaryItem label="AC Usage" value={existingLog?.energyAC} />
          <SummaryItem label="Shopping" value={existingLog?.shopping} />
          
          {/* Fallback for legacy activities */}
          {(!existingLog?.transport && !existingLog?.food && existingLog?.activities && existingLog.activities.length > 0) && (
            <div className="py-3">
              <span className="text-xs font-bold text-[#4C3D19] uppercase tracking-widest block mb-3">Legacy Actions</span>
              <div className="flex flex-wrap gap-2">
                {existingLog.activities.map(a => (
                  <div key={a.activityId} className="premium-pill text-[#1A2315] text-xs font-bold px-3 py-1.5 border-white/60">
                    {a.activityId.replace('quick_', '').replace('_', ' ')} <span className="text-[#889063]">x{a.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <div className="mt-auto pt-4">
          <button
            onClick={onEdit}
            className="w-full py-[18px] premium-glass rounded-full font-bold text-[15px] text-[#354024] active:scale-95 transition-transform"
          >
            Edit Entry
          </button>
        </div>

      </div>
    </motion.div>
  );
}
