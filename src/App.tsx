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
    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); }
      catch (e) { console.error('Failed to parse profile', e); }
    }
    
    const savedLogs = localStorage.getItem('flagged_logs');
    if (savedLogs) {
      try { setLogs(JSON.parse(savedLogs)); }
      catch (e) { console.error('Failed to parse logs', e); }
    }
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
      streak: 0,
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
      const delta = log.totalFlagImpact - previousLogImpact;
      
      const newScore = Math.max(0, Math.min(100, profile.flagScore + delta));
      saveProfile({ ...profile, flagScore: newScore, streak: profile.streak + 1 });
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
