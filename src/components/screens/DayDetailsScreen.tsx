import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyLog, LoggedActivity } from '../../types';
import { ACTIVITIES } from '../../activities';

interface DayDetailsScreenProps {
  key?: string;
  date: string; // YYYY-MM-DD
  existingLog?: DailyLog;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

export function DayDetailsScreen({ date, existingLog, onSave, onCancel }: DayDetailsScreenProps) {
  const [activities, setActivities] = useState<LoggedActivity[]>(existingLog?.activities || []);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const toggleActivity = (id: string) => {
    setActivities(prev => {
      const exists = prev.find(a => a.activityId === id);
      if (exists) {
        return prev.filter(a => a.activityId !== id);
      }
      return [...prev, { activityId: id, count: 1 }];
    });
  };

  const handleSave = () => {
    let totalFlagImpact = 0;
    let totalCarbonEstimate = 0;

    activities.forEach(log => {
      const def = ACTIVITIES.find(a => a.id === log.activityId);
      if (def) {
        totalFlagImpact += def.flagValue * log.count;
        totalCarbonEstimate += def.carbonValue * log.count;
      }
    });

    onSave({
      date,
      activities,
      totalFlagImpact,
      totalCarbonEstimate,
      notes
    });
  };

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-[#FDF9F3] overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5A8F5A] bg-[#EAF3DE] border border-[#BEE0BE] active:scale-95 transition-transform"
          >
            ←
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#8A8070] uppercase tracking-wider mb-0.5">
              Day Details
            </p>
            <h2 className="text-xl font-bold text-[#1E1A16]">
              {displayDate}
            </h2>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {ACTIVITIES.map(act => {
            const isActive = activities.some(a => a.activityId === act.id);
            return (
              <motion.button
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors border"
                style={{
                  borderColor: isActive ? '#5A8F5A' : '#EBE5DA',
                  background: isActive ? '#EAF3DE' : '#FFFFFF',
                }}
              >
                <span className="text-3xl">{act.emoji}</span>
                <span className="text-[10px] font-bold text-center leading-tight text-[#1E1A16]">
                  {act.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Notes */}
        <div className="mb-auto">
          <label className="block text-xs font-bold text-[#1E1A16] uppercase tracking-wider mb-2 pl-1">
            Journal Note
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did you feel about your choices today?"
            className="w-full bg-white border border-[#EBE5DA] rounded-[16px] p-4 text-sm text-[#1E1A16] focus:outline-none focus:border-[#5A8F5A] shadow-sm"
            rows={4}
          />
        </div>

        <div className="pt-8 pb-4">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#1F3D20] text-white rounded-[16px] font-bold text-base shadow-md active:scale-[0.98] transition-transform"
          >
            Save Day
          </button>
        </div>
      </div>
    </motion.div>
  );
}
