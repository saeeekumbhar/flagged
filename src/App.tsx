/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserProfile } from './types';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CheckIn } from './components/CheckIn';
import { Profile } from './components/Profile';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [biggestGreenFlag, setBiggestGreenFlag] = useState<string | null>(null);
  const [biggestRedFlag, setBiggestRedFlag] = useState<string | null>(null);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  // Simple local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('flagged_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('flagged_profile', JSON.stringify(p));
  };

  const handleOnboardingComplete = (partialProfile: Partial<UserProfile>) => {
    const fullProfile: UserProfile = {
      name: "Player 1",
      userType: "day_scholar", // default fallback
      commuteMethod: "walk",
      foodPreferences: "mess",
      acPreference: "none",
      deliveryFrequency: 0,
      chargerHabit: false,
      flagScore: 50,
      completedOnboarding: true,
      avatar: "/avatar.png",
      streak: 0,
      ...partialProfile,
    };
    saveProfile(fullProfile);
  };

  const handleCheckInComplete = (scoreDelta: number, green: string, red: string) => {
    if (profile) {
      const newScore = Math.max(0, Math.min(100, profile.flagScore + scoreDelta));
      saveProfile({ ...profile, flagScore: newScore, streak: profile.streak + 1 });
      setBiggestGreenFlag(green);
      setBiggestRedFlag(red);
    }
    setIsCheckingIn(false);
  };

  if (!hasSeenSplash) {
    return <Splash onStart={() => setHasSeenSplash(true)} />;
  }

  if (!profile || !profile.completedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (viewingProfile) {
    return (
      <div className="min-h-screen font-sans">
        <Profile profile={profile} onBack={() => setViewingProfile(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Dashboard 
        profile={profile} 
        onCheckInStart={() => setIsCheckingIn(true)} 
        onOpenProfile={() => setViewingProfile(true)}
        biggestGreenFlag={biggestGreenFlag}
        biggestRedFlag={biggestRedFlag}
      />
      
      <AnimatePresence>
        {isCheckingIn && (
          <CheckIn 
            onComplete={handleCheckInComplete} 
            onCancel={() => setIsCheckingIn(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
