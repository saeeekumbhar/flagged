/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DailyLog, NavState } from './types';
import { calculateHistoricalScore } from './utils/ScoreEngine';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Confetti } from './components/Confetti';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { JourneyTab } from './components/tabs/JourneyTab';
import { InsightsTab } from './components/tabs/InsightsTab';
import { CommunityTab } from './components/tabs/CommunityTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { DayDetailsScreen } from './components/screens/DayDetailsScreen';
import { BadgeDetailsScreen } from './components/screens/BadgeDetailsScreen';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [navState, setNavState] = useState<NavState>({ type: 'tab', tab: 'home' });
  const [toast, setToast] = useState<{msg: string, type?: 'green'|'darkGreen'} | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('flagged_profile');
    const savedLogs = localStorage.getItem('flagged_logs');

    let p: UserProfile | null = null;
    let l: Record<string, DailyLog> = {};

    if (savedProfile) {
      try { p = JSON.parse(savedProfile); }
      catch (e) { console.error('Failed to parse profile', e); }
    }
    
    if (savedLogs) {
      try { l = JSON.parse(savedLogs); }
      catch (e) { console.error('Failed to parse logs', e); }
    }

    // Migration Step for Comma-Separated Legacy Logs
    let migrated = false;
    Object.keys(l).forEach(date => {
      const log = l[date];
      ['transport', 'food', 'delivery', 'energyLaptop', 'energyAC', 'shopping'].forEach(key => {
        const val = log[key as keyof DailyLog];
        if (typeof val === 'string' && val.includes(',')) {
          migrated = true;
          // Just take the first element for safety to clean up impossible multi-selects
          const fixed = val.split(',').filter(Boolean)[0] || 'none';
          (log as any)[key] = fixed;
          console.warn(`Migrated legacy multi-select in log ${date} for ${key}: "${val}" -> "${fixed}"`);
        }
      });
      if (log.notes === 'Mock entry') {
        migrated = true;
        log.notes = '';
        console.warn(`Cleared mock entry notes in log ${date}`);
      }
    });
    if (migrated) {
      localStorage.setItem('flagged_logs', JSON.stringify(l));
    }

    if (p) {
      setProfile(p);
    }
    
    // Auto-seed mock data if empty or just 1 day so the calendar looks populated like the mockup
    if (Object.keys(l).length <= 1) {
      const today = new Date();
      const mockPattern = [1, 1, 1, -1, 1, 1, 1]; // Sequence of green/red days
      
      for(let i = 6; i >= 0; i--) {
         const d = new Date(today);
         d.setDate(today.getDate() - i);
         const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
         
         const isGreen = mockPattern[6 - i] > 0;
         l[dateStr] = {
           date: dateStr,
           activities: isGreen ? [{ activityId: 'commute_walk_bike', count: 1 }] : [{ activityId: 'commute_car', count: 1 }],
           totalFlagImpact: isGreen ? 10 : -5,
           totalCarbonEstimate: isGreen ? 0.5 : 12,
           notes: ''
         };
      }
      localStorage.setItem('flagged_logs', JSON.stringify(l));
      
      // Update profile streak to match the seeded data
      if (p) {
        p.streak = 7;
        p.bestStreak = 7;
        p.flagScore = 75; // Glow up / Green flag era
        p.xp = p.xp || 700;
        p.level = p.level || 7;
        p.coins = p.coins || 240;
        setProfile({...p});
        localStorage.setItem('flagged_profile', JSON.stringify(p));
      }
    }

    setLogs(l);
  }, []);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('flagged_profile', JSON.stringify(p));
  };

  const handleOnboardingComplete = (partialProfile: Partial<UserProfile>) => {
    const fullProfile: UserProfile = {
      name: 'Player 1',
      userType: 'day_scholar',
      commuteMethod: 'walk',
      foodPreferences: 'mess',
      acPreference: 'none',
      deliveryFrequency: 0,
      chargerHabit: false,
      flagScore: 50,
      completedOnboarding: true,
      avatarId: 'av1',
      streak: 7, // Start with a seeded streak
      bestStreak: 7,
      xp: 700,
      level: 7,
      coins: 240,
      ...partialProfile,
    };
    saveProfile(fullProfile);
  };

  const handleLogSave = (log: DailyLog) => {
    setLogs(prev => {
      const updated = { ...prev, [log.date]: log };
      localStorage.setItem('flagged_logs', JSON.stringify(updated));
      return updated;
    });

    if (profile) {
      if (log.totalFlagImpact > 0) {
        handleAwardXP(15, 5, 'Daily check-in positive');
      } else {
        handleAwardXP(5, 0, 'Daily check-in neutral/negative');
      }
    }
    if (navState.type === 'day_details') {
      setNavState({ type: 'tab', tab: 'home' });
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    if (profile) saveProfile({ ...profile, avatarId });
  };

  const handleAwardXP = (xpAmount: number, coinsAmount: number, reason: string) => {
    if (!profile) return;
    
    let newXp = Math.max(0, (profile.xp || 0) + xpAmount);
    let newCoins = (profile.coins || 0) + coinsAmount;
    let newLevel = profile.level || 1;
    
    while (newXp >= 1000) {
      newLevel++;
      newXp -= 1000;
    }
    
    saveProfile({
      ...profile,
      xp: newXp,
      level: newLevel,
      coins: newCoins
    });
    
    if (xpAmount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleQuickLog = (type: 'green' | 'red') => {
    if (!profile) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const prevLog = logs[dateStr] || { date: dateStr, activities: [], notes: '', totalFlagImpact: 0, totalCarbonEstimate: 0 };
    
    const impactDelta = type === 'green' ? 1 : -1;
    const newLog = {
      ...prevLog,
      totalFlagImpact: prevLog.totalFlagImpact + impactDelta,
      activities: [
        ...prevLog.activities,
        { activityId: `quick_${type}`, count: 1 }
      ]
    };
    
    setLogs(prev => {
      const updated = { ...prev, [dateStr]: newLog };
      localStorage.setItem('flagged_logs', JSON.stringify(updated));
      return updated;
    });

    if (type === 'green') {
      handleAwardXP(10, 5, 'Quick Green Action');
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      handleAwardXP(-5, 0, 'Quick Red Action');
    }
  };

  const showToastMsg = (msg: string, type?: 'green'|'darkGreen') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const derivedProfile = useMemo(() => {
    if (!profile) return null;
    const { score, streak } = calculateHistoricalScore(profile, logs);
    
    // Auto-update best streak silently in profile if the derived streak beats it
    if (streak > (profile.bestStreak || 0)) {
       setTimeout(() => {
         saveProfile({ ...profile, bestStreak: streak });
       }, 0);
    }
    
    return {
      ...profile,
      flagScore: score,
      streak: streak,
    };
  }, [profile, logs]);

  if (!hasSeenSplash) return <Splash onStart={() => setHasSeenSplash(true)} />;
  if (!derivedProfile || !derivedProfile.completedOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
      <div 
        className={`w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[url('/bg-green.png')] bg-cover bg-center bg-no-repeat sm:rounded-[40px] sm:border-[8px] sm:border-white/20 sm:shadow-[0_0_40px_rgba(0,0,0,0.2)] relative overflow-hidden ring-1 ring-black/5 ${isShaking ? 'shake-anim' : ''}`}
        style={{ contain: 'paint' }}
      >
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <div className="absolute top-6 inset-x-0 z-[100] flex justify-center pointer-events-none px-4">
              <motion.div 
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className={`${toast.type === 'darkGreen' ? 'bg-[#889063]' : 'bg-[#889063]'} text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold text-center w-max max-w-full`}
              >
                {toast.msg}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Current Tab Render */}
        <div className="absolute inset-0 bottom-16 overflow-y-auto no-scrollbar pb-6">
          {navState.type === 'tab' && (
            <>
              {navState.tab === 'home' && <HomeTab profile={derivedProfile} logs={logs} onAwardXP={handleAwardXP} onQuickLog={handleQuickLog} onNavigate={setNavState} showToastMsg={showToastMsg} />}
              {navState.tab === 'journey' && <JourneyTab profile={derivedProfile} logs={logs} onNavigate={setNavState} />}
              {navState.tab === 'insights' && <InsightsTab profile={derivedProfile} logs={logs} />}
              {navState.tab === 'community' && <CommunityTab profile={derivedProfile} onAwardXP={handleAwardXP} showToastMsg={showToastMsg} />}
              {navState.tab === 'profile' && <ProfileTab profile={derivedProfile} logs={logs} onNavigate={setNavState} onAvatarChange={handleAvatarChange} />}
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={navState.type === 'tab' ? navState.tab : 'home'} onTabChange={(t) => setNavState({ type: 'tab', tab: t })} />

        {/* Detail Screens */}
        <AnimatePresence>
          {navState.type === 'day_details' && (
            <DayDetailsScreen
              key="day_details"
              profile={derivedProfile}
              date={navState.date}
              existingLog={logs[navState.date]}
              onSave={handleLogSave}
              onCancel={() => setNavState({ type: 'tab', tab: 'journey' })}
            />
          )}
          {navState.type === 'badge_details' && (
            <BadgeDetailsScreen
              key="badge_details"
              badgeId={navState.badgeId}
              profile={derivedProfile}
              logs={logs}
              onBack={() => setNavState({ type: 'tab', tab: 'profile' })}
            />
          )}
        </AnimatePresence>

        {showConfetti && <Confetti duration={1500} />}
      </div>
    </div>
  );
}
