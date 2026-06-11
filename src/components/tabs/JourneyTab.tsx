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
      <h2 className="text-display text-2xl font-bold drop-shadow-md px-1" style={{ color: '#FFFFFF' }}>Your Journey</h2>

      {/* Calendar Section */}
      <motion.div className="premium-glass rounded-[32px] p-6 shadow-sm border border-white/60" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-[#1A2315]">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#1A2315] active:scale-95 transition-transform bg-black/5">{'<'}</button>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#1A2315] active:scale-95 transition-transform bg-black/5">{'>'}</button>
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
            let textColor = '#1A2315';
            let fontWeight = '600';

            if (isToday) {
              bgColor = '#347346';
              textColor = '#FFFFFF';
              fontWeight = 'bold';
            } else if (log) {
              if (log.totalFlagImpact > 0) { bgColor = '#EAF3EA'; textColor = '#1A2315'; fontWeight = 'bold'; }
              else if (log.totalFlagImpact < 0) { bgColor = '#FDECEE'; textColor = '#A03030'; fontWeight = 'bold'; }
              else { bgColor = '#E5D7C4'; textColor = '#1A2315'; fontWeight = 'bold'; }
            }

            return (
              <motion.button
                key={day}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate({ type: 'day_details', date: dateStr })}
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
          <h3 className="text-sm font-bold drop-shadow-md" style={{ color: '#FFFFFF' }}>Recent Activity</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentLogs.map(log => (
            <div key={log.date} className="premium-glass rounded-[24px] p-4 flex flex-col gap-2 shadow-sm" onClick={() => onNavigate({ type: 'day_details', date: log.date })}>
              <div className="text-sm font-bold text-[#1A2315]">
                {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(log.activities.reduce((acc, a) => {
                  acc[a.activityId] = acc[a.activityId] || { ...a, count: 0 };
                  acc[a.activityId].count += a.count;
                  return acc;
                }, {} as Record<string, { activityId: string, count: number }>)).map((act, i) => {
                  const isRed = act.activityId.includes('red') || act.activityId.includes('car') || act.activityId.includes('ac') || act.activityId.includes('delivery') || act.activityId.includes('major');
                  return (
                    <div key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${isRed ? 'bg-[#FDECEE]/80 text-[#A03030]' : 'bg-[#EAF3EA]/80 text-[#1A2315]'}`}>
                      <div className={`w-2 h-2 rounded-full ${isRed ? 'bg-[#D4614A]' : 'bg-[#889063]'}`} />
                      <span className="capitalize">{act.activityId.replace('quick_', '').replace('_', ' ')}</span>
                      <span className="opacity-60 ml-0.5">x{act.count}</span>
                    </div>
                  );
                })}
              </div>
              {log.notes && <div className="text-xs italic text-[#4C3D19] mt-1">"{log.notes}"</div>}
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="text-center text-white/80 drop-shadow-sm text-sm py-6 font-medium">No recent activities.</div>
          )}
        </div>
      </motion.div>

      {/* Trends Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold drop-shadow-md mb-3 px-1" style={{ color: '#FFFFFF' }}>All-Time Trends</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="premium-glass rounded-[24px] p-5 flex flex-col justify-center border-l-4 border-l-[#889063]">
            <div className="text-[10px] uppercase tracking-widest text-[#4C3D19] font-bold mb-1">Green Flags</div>
            <div className="text-3xl font-bold text-[#1A2315] leading-none">{totalGreen}</div>
          </div>
          <div className="premium-glass rounded-[24px] p-5 flex flex-col justify-center border-l-4 border-l-[#D4614A]">
            <div className="text-[10px] uppercase tracking-widest text-[#4C3D19] font-bold mb-1">Red Flags</div>
            <div className="text-3xl font-bold text-[#D4614A] leading-none">{totalRed}</div>
          </div>
        </div>
        <div className="premium-glass rounded-[24px] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl drop-shadow-sm">🔥</div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#4C3D19] font-semibold">Longest Streak</div>
              <div className="text-sm font-bold text-[#1A2315]">{profile.bestStreak} Days</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
