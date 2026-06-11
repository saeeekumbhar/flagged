/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DailyLog, NavState } from './types';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Confetti } from './components/Confetti';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { JourneyTab } from './components/tabs/JourneyTab';
import { CoachTab } from './components/tabs/CoachTab';
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

    if (p) {
      // Calculate missing days for Score Decay and Streak tracking
      const today = new Date();
      // Use local date string YYYY-MM-DD
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const loggedDates = Object.keys(l).sort();
      const lastLoggedDate = loggedDates.length > 0 ? loggedDates[loggedDates.length - 1] : null;

      let needsUpdate = false;
      let newScore = p.flagScore;
      let newStreak = p.streak;

      if (lastLoggedDate) {
        // Calculate diff in calendar days (ignore time)
        const d1 = new Date(todayStr);
        const d2 = new Date(lastLoggedDate);
        const daysDiff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));

        if (daysDiff > 1 && newStreak > 0) {
          // Missed a full day, reset streak
          newStreak = 0;
          needsUpdate = true;
        }

        if (daysDiff > 3) {
          // Decay towards 50 by 1 point per missed day past 3
          const decay = daysDiff - 3;
          if (newScore > 50) {
            newScore = Math.max(50, newScore - decay);
            needsUpdate = true;
          } else if (newScore < 50) {
            newScore = Math.min(50, newScore + decay);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate || p.xp === undefined) {
        const updatedProfile = { 
          ...p, 
          flagScore: newScore, 
          streak: newStreak, 
          bestStreak: p.bestStreak || 0,
          xp: p.xp || 0,
          level: p.level || 1,
          coins: p.coins || 0
        };
        setProfile(updatedProfile);
        localStorage.setItem('flagged_profile', JSON.stringify(updatedProfile));
      } else {
        setProfile(p);
      }
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
           notes: 'Mock entry'
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
      // Recalculate flag score based on new log
      // Just applying the delta of this specific log to current score for now,
      // but ideally we derive score from all logs if we want true sync.
      const previousLogImpact = logs[log.date]?.totalFlagImpact || 0;
      let delta = log.totalFlagImpact - previousLogImpact;
      
      // Comeback Multiplier: 1.5x points for positive actions if in Red Flag Era
      if (profile.flagScore <= 40 && delta > 0) {
        delta = Math.ceil(delta * 1.5);
      }
      
      const newScore = Math.max(0, Math.min(100, profile.flagScore + delta));

      // Streak logic: only increment if this is a new date being logged and it's today or yesterday
      let newStreak = profile.streak;
      if (!logs[log.date]) {
        // It's a new log entry
        newStreak += 1;
      }
      
      const newBestStreak = Math.max(profile.bestStreak || 0, newStreak);

      let newXp = profile.xp || 0;
      let newCoins = profile.coins || 0;
      let newLevel = profile.level || 1;
      
      // Award XP and coins based on the net impact of the log
      if (delta > 0) {
        newXp += 15; // Base XP for positive actions
        newCoins += 5;
        
        // Trigger confetti!
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      } else if (delta < 0) {
        newXp = Math.max(0, newXp - 5); // Small penalty for negative actions
      } else if (!logs[log.date]) {
        // Just logging neutral still gives small XP
        newXp += 5;
      }
      
      // Level up logic (1000 XP per level)
      while (newXp >= 1000) {
        newLevel++;
        newXp -= 1000;
      }

      saveProfile({ 
        ...profile, 
        flagScore: newScore, 
        streak: newStreak, 
        bestStreak: newBestStreak,
        xp: newXp,
        level: newLevel,
        coins: newCoins
      });
    }
    if (navState.type === 'day_details') {
      setNavState({ type: 'tab', tab: 'journey' });
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    if (profile) saveProfile({ ...profile, avatarId });
  };

  const handleAwardXP = (xpAmount: number, coinsAmount: number, reason: string) => {
    if (!profile) return;
    
    let newXp = (profile.xp || 0) + xpAmount;
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
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleQuickLog = (type: 'green' | 'red') => {
    if (!profile) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const prevLog = logs[dateStr] || { date: dateStr, activities: [], notes: '', totalFlagImpact: 0 };
    
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

    let newXp = profile.xp || 0;
    let newCoins = profile.coins || 0;
    let newLevel = profile.level || 1;
    let newScore = profile.flagScore + impactDelta;
    newScore = Math.max(0, Math.min(100, newScore));
    
    if (type === 'green') {
      newXp += 10;
      newCoins += 5;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      newXp = Math.max(0, newXp - 5);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
    
    while (newXp >= 1000) {
      newLevel++;
      newXp -= 1000;
    }
    
    let newStreak = profile.streak;
    if (!logs[dateStr]) newStreak++;
    
    saveProfile({
      ...profile,
      flagScore: newScore,
      xp: newXp,
      coins: newCoins,
      level: newLevel,
      streak: newStreak,
      bestStreak: Math.max(profile.bestStreak || 0, newStreak)
    });
  };

  const showToastMsg = (msg: string, type?: 'green'|'darkGreen') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  if (!hasSeenSplash) return <Splash onStart={() => setHasSeenSplash(true)} />;
  if (!profile || !profile.completedOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
      <div 
        className={`w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[#FDF9F3] sm:rounded-[40px] sm:border-[8px] sm:border-white sm:shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-hidden ring-1 ring-black/5 ${isShaking ? 'shake-anim' : ''}`}
        style={{ contain: 'paint' }}
      >
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <div className="absolute top-6 inset-x-0 z-[100] flex justify-center pointer-events-none px-4">
              <motion.div 
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className={`${toast.type === 'darkGreen' ? 'bg-[#3A6E3A]' : 'bg-[#3A8F3A]'} text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold text-center w-max max-w-full`}
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
              {navState.tab === 'home' && <HomeTab profile={profile} logs={logs} onAwardXP={handleAwardXP} onQuickLog={handleQuickLog} onNavigate={setNavState} showToastMsg={showToastMsg} />}
              {navState.tab === 'journey' && <JourneyTab profile={profile} logs={logs} onNavigate={setNavState} />}
              {navState.tab === 'coach' && <CoachTab profile={profile} logs={logs} />}
              {navState.tab === 'community' && <CommunityTab profile={profile} onAwardXP={handleAwardXP} showToastMsg={showToastMsg} />}
              {navState.tab === 'profile' && <ProfileTab profile={profile} logs={logs} onNavigate={setNavState} onAvatarChange={handleAvatarChange} />}
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
              profile={profile}
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
