import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DailyLog, LoggedActivity } from '../types';
import { ACTIVITIES } from '../activities';

interface ActivityLoggerProps {
  date: string; // YYYY-MM-DD
  existingLog?: DailyLog;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

export function ActivityLogger({ date, existingLog, onSave, onCancel }: ActivityLoggerProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(30,26,22,0.5)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        className="w-full max-w-[420px]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div
          className="rounded-t-[28px] p-6 pb-10 max-h-[85vh] overflow-y-auto"
          style={{ background: '#FDFAF5', boxShadow: '0 -4px 40px rgba(30,26,22,0.15)' }}
        >
          {/* Handle bar */}
          <div className="w-12 h-1 rounded-full bg-[rgba(196,217,188,0.6)] mx-auto mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-[#7BA87A] uppercase tracking-wider mb-1">
                Log Activity
              </p>
              <h2 className="text-xl font-bold text-[#1F3D20]">
                {displayDate}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8070] hover:bg-[#F2EDE3] transition-colors text-lg"
            >
              ×
            </button>
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {ACTIVITIES.map(act => {
              const isActive = activities.some(a => a.activityId === act.id);
              return (
                <motion.button
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors border-2`}
                  style={{
                    borderColor: isActive ? '#5A8F5A' : 'rgba(196,217,188,0.3)',
                    background: isActive ? '#E4EDE0' : '#FFFFFF',
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
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#5A8070] uppercase tracking-wider mb-2">
              Journal Note (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did you feel about your choices today?"
              className="w-full bg-white border border-[rgba(196,217,188,0.5)] rounded-xl p-3 text-sm focus:outline-none focus:border-[#5A8F5A]"
              rows={3}
            />
          </div>

          <button
            onClick={handleSave}
            className="btn-primary w-full py-4 text-base shadow-sm"
          >
            Save Day
          </button>
        </div>
      </motion.div>
    </div>
  );
}
