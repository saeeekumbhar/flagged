import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, DailyLog, NavState } from '../../types';

interface JourneyTabProps {
  logs: Record<string, DailyLog>;
  profile: UserProfile;
  onNavigate: (state: NavState) => void;
}

export function JourneyTab({ logs, profile, onNavigate }: JourneyTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const startOffset = (firstDayOfWeek + 6) % 7; // Monday = 0
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return { day: d, dateStr, log: logs[dateStr] };
  });

  const blanks = Array.from({ length: startOffset });
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const realToday = new Date();
  
  const recentLogs = Object.values(logs)
    .filter(l => l.activities.length > 0 || l.notes)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Just show the 5 most recent

  const totalGreen = Object.values(logs).reduce((acc, log) => acc + log.activities.filter(a => !(a.activityId.includes('red') || a.activityId.includes('car') || a.activityId.includes('ac') || a.activityId.includes('delivery') || a.activityId.includes('major'))).reduce((sum, a) => sum + a.count, 0), 0);
  const totalRed = Object.values(logs).reduce((acc, log) => acc + log.activities.filter(a => a.activityId.includes('red') || a.activityId.includes('car') || a.activityId.includes('ac') || a.activityId.includes('delivery') || a.activityId.includes('major')).reduce((sum, a) => sum + a.count, 0), 0);

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-6 relative z-10 pointer-events-auto">
      
      {/* Header */}
      <h2 className="text-display text-2xl font-bold text-[#354024] px-1">Your Journey</h2>

      {/* Calendar Section */}
      <motion.div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,26,22,0.03)] border border-[#CFBB99]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-[#354024]">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full border border-[#F4F1EC] flex items-center justify-center text-[#4C3D19] active:bg-[#F4F1EC] transition-colors">{'<'}</button>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full border border-[#F4F1EC] flex items-center justify-center text-[#4C3D19] active:bg-[#F4F1EC] transition-colors">{'>'}</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[11px] font-bold text-[#4C3D19] mb-1">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-3 gap-x-2">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          
          {days.map(({ day, dateStr, log }) => {
            const isToday = dateStr === `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;
            
            let bgColor = 'transparent';
            let textColor = '#B8B0A5';
            let fontWeight = '600';

            if (isToday) {
              bgColor = '#347346';
              textColor = '#FFFFFF';
              fontWeight = 'bold';
            } else if (log) {
              if (log.totalFlagImpact > 0) { bgColor = '#EAF3EA'; textColor = '#2D5D2D'; fontWeight = 'bold'; }
              else if (log.totalFlagImpact < 0) { bgColor = '#FDECEE'; textColor = '#A03030'; fontWeight = 'bold'; }
              else { bgColor = '#F4F1EC'; textColor = '#354024'; fontWeight = 'bold'; }
            }

            return (
              <motion.button
                key={day}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate({ type: log ? 'day_summary' : 'day_details', date: dateStr })}
                className="relative aspect-square flex items-center justify-center rounded-[14px] transition-colors"
                style={{ background: bgColor, color: textColor, fontWeight: fontWeight as any }}
              >
                <span className="text-[13px]">{day}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-sm font-bold text-[#354024]">Recent Activity</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentLogs.map(log => (
            <div key={log.date} className="bg-white/60 backdrop-blur-xl border border-[#CFBB99] rounded-[16px] p-4 flex flex-col gap-2 shadow-sm" onClick={() => onNavigate({ type: 'day_summary', date: log.date })}>
              <div className="text-sm font-bold text-[#354024]">
                {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex flex-wrap gap-2">
                {log.activities.map((act, i) => {
                  const isRed = act.activityId.includes('red') || act.activityId.includes('car') || act.activityId.includes('ac') || act.activityId.includes('delivery') || act.activityId.includes('major');
                  return (
                    <div key={i} className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${isRed ? 'bg-[#FDECEE] text-[#A03030]' : 'bg-[#EAF3EA] text-[#2D5D2D]'}`}>
                      {isRed ? '🔴' : '🟢'} {act.activityId.replace('quick_', '').replace('_', ' ')} x{act.count}
                    </div>
                  );
                })}
              </div>
              {log.notes && <div className="text-xs italic text-[#4C3D19] mt-1">"{log.notes}"</div>}
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="text-center text-[#4C3D19] text-sm py-6 font-medium">No recent activities.</div>
          )}
        </div>
      </motion.div>

      {/* Trends Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#354024] mb-3 px-1">All-Time Trends</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#EAF3EA] rounded-[16px] p-4 flex flex-col items-center justify-center text-center border border-[#BEE0BE]">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-lg font-bold text-[#2D5D2D]">{totalGreen}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#889063] font-semibold mt-1">Green Flags</div>
          </div>
          <div className="bg-[#FDECEE] rounded-[16px] p-4 flex flex-col items-center justify-center text-center border border-[#F4B2B8]">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-lg font-bold text-[#A03030]">{totalRed}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#D4614A] font-semibold mt-1">Red Flags</div>
          </div>
        </div>
        <div className="bg-[#E5D7C4] rounded-[16px] p-4 flex items-center justify-between border border-[#CFBB99]">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔥</div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#4C3D19] font-semibold">Longest Streak</div>
              <div className="text-sm font-bold text-[#354024]">{profile.bestStreak} Days</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
