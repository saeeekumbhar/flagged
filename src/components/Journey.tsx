import React from 'react';
import { motion } from 'motion/react';
import { DailyLog } from '../types';
import { ACTIVITIES } from '../activities';

interface JourneyProps {
  logs: Record<string, DailyLog>;
  onLogDate: (date: string) => void;
}

function MonthlyCalendar({ logs, onLogDate }: { logs: Record<string, DailyLog>, onLogDate: (date: string) => void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  // Shift so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfWeek + 6) % 7; 
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return { day: d, dateStr, log: logs[dateStr] };
  });

  const blanks = Array.from({ length: startOffset });
  
  return (
    <div className="soft-card p-5 mb-5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-[#1E1A16]">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <span className="text-xs text-[#8A8070]">Activity Log</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-[#8A8070]">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        
        {days.map(({ day, dateStr, log }) => {
          const isToday = dateStr === `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          let dotColor = 'transparent';
          if (log) {
            if (log.totalFlagImpact > 0) dotColor = '#5A8F5A'; // Green
            else if (log.totalFlagImpact < 0) dotColor = '#D4614A'; // Red
            else dotColor = '#D4A574'; // Neutral/Mixed
          }

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLogDate(dateStr)}
              className="relative aspect-square flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: isToday ? 'rgba(196,217,188,0.25)' : 'transparent',
                border: isToday ? '1px solid rgba(196,217,188,0.6)' : '1px solid transparent',
              }}
            >
              <span className="text-xs font-semibold" style={{ color: isToday ? '#1F3D20' : '#4A433A' }}>
                {day}
              </span>
              
              {log && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: dotColor }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function Journey({ logs, onLogDate }: JourneyProps) {
  // Compute monthly stats
  const currentMonth = new Date().getMonth();
  let monthlyGreenFlags = 0;
  let monthlyRedFlags = 0;
  
  const activityCounts: Record<string, number> = {};
  
  Object.values(logs).forEach(log => {
    const logMonth = new Date(log.date).getMonth();
    if (logMonth === currentMonth) {
      log.activities.forEach(a => {
        activityCounts[a.activityId] = (activityCounts[a.activityId] || 0) + 1;
        if (a.activityId.includes('commute_walk') || a.activityId.includes('thrift') || a.activityId.includes('mindful') || a.activityId.includes('food_home')) monthlyGreenFlags++;
        if (a.activityId.includes('car') || a.activityId.includes('delivery') || a.activityId.includes('ac') || a.activityId.includes('major')) monthlyRedFlags++;
      });
    }
  });

  return (
    <div className="pb-32 max-w-[420px] mx-auto px-4 pt-8 flex flex-col gap-5 min-h-[85vh]">
      
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1F3D20]" style={{ fontFamily: 'var(--font-display)' }}>Your Journey</h1>
        <p className="text-sm text-[#8A8070] font-medium">Review your timeline and progress.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <MonthlyCalendar logs={logs} onLogDate={onLogDate} />
      </motion.div>

      {/* ── Monthly Insights ── */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <motion.div className="soft-card-sage p-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🟢</span>
            <span className="text-[11px] font-bold text-[#3D6B3D] uppercase tracking-wider">Green Choices</span>
          </div>
          <p className="text-2xl font-bold text-[#1F3D20]">{monthlyGreenFlags}</p>
        </motion.div>
        
        <motion.div className="soft-card-coral p-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🔴</span>
            <span className="text-[11px] font-bold text-[#D4614A] uppercase tracking-wider">Red Choices</span>
          </div>
          <p className="text-2xl font-bold text-[#4A1F1A]">{monthlyRedFlags}</p>
        </motion.div>
      </div>

      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
         <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-[#1E1A16]">Timeline</span>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-[#8A8070] italic">Your historical logs will appear here soon.</p>
        </div>
      </motion.div>

    </div>
  );
}
