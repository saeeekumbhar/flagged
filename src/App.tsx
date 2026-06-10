/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserProfile, DailyLog } from './types';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ActivityLogger } from './components/ActivityLogger';
import { Profile } from './components/Profile';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [loggingDate, setLoggingDate] = useState<string | null>(null);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

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

      if (needsUpdate) {
        const updatedProfile = { ...p, flagScore: newScore, streak: newStreak, bestStreak: p.bestStreak || 0 };
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
           activities: isGreen ? [{ activityId: 'commute_walk', count: 1 }] : [{ activityId: 'car_short', count: 1 }],
           totalFlagImpact: isGreen ? 10 : -10,
           totalCarbonEstimate: isGreen ? -0.5 : 2.5,
           notes: 'Mock entry'
         };
      }
      localStorage.setItem('flagged_logs', JSON.stringify(l));
      
      // Update profile streak to match the seeded data
      if (p) {
        p.streak = 7;
        p.bestStreak = 7;
        p.flagScore = 75; // Glow up / Green flag era
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

      saveProfile({ ...profile, flagScore: newScore, streak: newStreak, bestStreak: newBestStreak });
    }
    setLoggingDate(null);
  };

  const handleAvatarChange = (avatarId: string) => {
    if (profile) saveProfile({ ...profile, avatarId });
  };

  if (!hasSeenSplash) return <Splash onStart={() => setHasSeenSplash(true)} />;
  if (!profile || !profile.completedOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  if (viewingProfile) {
    return (
      <div className="min-h-screen font-sans">
        <Profile profile={profile} onBack={() => setViewingProfile(false)} onAvatarChange={handleAvatarChange} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Dashboard
        profile={profile}
        logs={logs}
        onLogDate={(date) => setLoggingDate(date)}
        onOpenProfile={() => setViewingProfile(true)}
      />
      <AnimatePresence>
        {loggingDate && (
          <ActivityLogger
            date={loggingDate}
            existingLog={logs[loggingDate]}
            onSave={handleLogSave}
            onCancel={() => setLoggingDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
