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
      <div className="flex justify-between items-center py-3 border-b border-[#CFBB99]/30 last:border-0">
        <span className="text-sm font-bold text-[#889063] uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-[#354024] capitalize">{formatMap[value] || value}</span>
      </div>
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-[#E5D7C4] overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#354024] bg-white/40 backdrop-blur-md border border-[#CFBB99] active:scale-95 transition-transform"
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
          <div className="text-7xl drop-shadow-lg mb-4">
            {getEmoji(existingLog?.reflection)}
          </div>
          <div className={`text-2xl font-bold ${existingLog?.totalFlagImpact && existingLog.totalFlagImpact > 0 ? 'text-[#889063]' : 'text-[#A03030]'}`}>
            {existingLog?.totalFlagImpact && existingLog.totalFlagImpact > 0 ? '+' : ''}{existingLog?.totalFlagImpact || 0} pts
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-[#CFBB99] rounded-[24px] p-6 shadow-sm mb-6">
          <SummaryItem label={profile.userType === 'hostelier' ? 'Mess Usage' : 'Transport'} value={existingLog?.transport} />
          <SummaryItem label="Food" value={existingLog?.food} />
          <SummaryItem label="Delivery" value={existingLog?.delivery} />
          <SummaryItem label="Laptop Usage" value={existingLog?.energyLaptop} />
          <SummaryItem label="AC Usage" value={existingLog?.energyAC} />
          <SummaryItem label="Shopping" value={existingLog?.shopping} />
          
          {/* Fallback for legacy activities */}
          {(!existingLog?.transport && !existingLog?.food && existingLog?.activities && existingLog.activities.length > 0) && (
            <div className="py-3">
              <span className="text-sm font-bold text-[#889063] uppercase tracking-wider block mb-2">Legacy Logged Actions</span>
              <div className="flex flex-wrap gap-2">
                {existingLog.activities.map(a => (
                  <div key={a.activityId} className="bg-[#CFBB99]/30 text-[#354024] text-xs font-bold px-2 py-1 rounded-md">
                    {a.activityId.replace('quick_', '').replace('_', ' ')} x{a.count}
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
            className="w-full py-4 bg-white/60 text-[#354024] border border-[#CFBB99] rounded-[16px] font-bold text-base shadow-sm active:scale-[0.98] transition-transform"
          >
            Edit Entry
          </button>
        </div>

      </div>
    </motion.div>
  );
}
