/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DailyLog, NavState } from './types';
import { calculateFlagScore, calculateTrend, calculateDailyScore } from './utils/ScoreEngine';
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
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [navState, setNavState] = useState<NavState>({ type: 'tab', tab: 'home' });
  const [toast, setToast] = useState<{msg: string, type?: 'green'|'darkGreen'} | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) setIsAuthLoading(true);
      setUser(u);
      if (u) {
        try {
          // Timeout to release loading state if Firestore hangs
          const timer = setTimeout(() => {
            setIsAuthLoading(false);
          }, 4000);

          const profRef = doc(db, 'users', u.uid);
          const pSnap = await getDoc(profRef);
          
          clearTimeout(timer);
          
          let p: UserProfile | null = null;
          let l: Record<string, DailyLog> = {};

            if (pSnap.exists()) {
              p = pSnap.data() as UserProfile;
              
              // Auto-sync Google profile info if missing or default
              let needsUpdate = false;
              if (u.displayName && (p.name === 'Player 1' || !p.name)) {
                 p.name = u.displayName;
                 needsUpdate = true;
              }
              if (u.photoURL && !p.photoURL) {
                 p.photoURL = u.photoURL;
                 needsUpdate = true;
              }
              if (needsUpdate) {
                 setDoc(profRef, p);
              }
              
              const logsSnap = await getDocs(collection(db, 'users', u.uid, 'dailyLogs'));
              
              logsSnap.forEach(docSnap => {
                const date = docSnap.id;
                l[date] = docSnap.data() as DailyLog;
              });

              // Recalculate true points
              if (p.coins > 100 || p.coins === 1036 || p.bestStreak > Object.keys(l).length) {
                 let realCoins = 0;
                 let realXP = 0;
                 Object.values(l).forEach(log => {
                    if (log.dailyScore && log.dailyScore >= 50) {
                       realCoins += 5;
                       realXP += 15;
                    } else if (log.dailyScore) {
                       realXP += 5;
                    }
                 });
                 p.coins = realCoins;
                 p.xp = realXP;
                 p.level = Math.floor(realXP / 1000) + 1;
                 
                 // Clear phantom streak data if impossible
                 if (p.bestStreak > Object.keys(l).length) {
                   p.streak = 0;
                   p.bestStreak = 0;
                 }
                 
                 await setDoc(profRef, p);
              }

              setProfile(p);
              setLogs(l);
            } else {
            // Migration Step
            const savedProfile = localStorage.getItem('flagged_profile');
            const savedLogs = localStorage.getItem('flagged_logs');
            let didMigrate = false;
            
            if (savedProfile) {
              try { 
                p = JSON.parse(savedProfile); 
                if (p) {
                  p.uid = u.uid;
                  p.email = u.email;
                  await setDoc(profRef, p);
                  setProfile(p);
                  didMigrate = true;
                }
              } catch(e) {}
            }
            if (savedLogs) {
               try { 
                  l = JSON.parse(savedLogs); 
                  setLogs(l);
                  for (const date in l) {
                    await setDoc(doc(db, 'users', u.uid, 'dailyLogs', date), l[date]);
                  }
               } catch(e) {}
            }
            if (didMigrate) {
              localStorage.removeItem('flagged_profile');
              localStorage.removeItem('flagged_logs');
            }
          }
        } catch (error: any) {
          console.warn("Firestore sync failed, falling back to local memory mode:", error);
          // Don't crash the app, let it run in memory
        }
      } else {
        setProfile(null);
        setLogs({});
        setNavState({ type: 'tab', tab: 'home' });
      }
      // Force navigation to home tab on successful login load
      if (u) {
        setNavState({ type: 'tab', tab: 'home' });
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveProfile = async (p: UserProfile) => {
    setProfile(p);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), p, { merge: true });
      } catch (e) {
        console.warn("Failed to save to Firestore (local mode fallback)");
      }
    }
  };

  const handleOnboardingComplete = async (partialProfile: Partial<UserProfile>) => {
    if (!user) return;
    const fullProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      createdAt: Date.now(),
      name: user.displayName || 'Player 1',
      photoURL: user.photoURL || null,
      userType: 'day_scholar',
      commuteMethod: 'walk',
      foodPreferences: 'mess',
      acPreference: 'none',
      deliveryFrequency: 0,
      chargerHabit: false,
      flagScore: 50,
      completedOnboarding: true,
      avatarId: 'av1', // fallback
      streak: 0,
      bestStreak: 0,
      xp: 0,
      level: 1,
      coins: 0,
      ...partialProfile,
    };
    await saveProfile(fullProfile);
    setNavState({ type: 'tab', tab: 'home' });
  };

  const handleLogSave = async (log: DailyLog) => {
    setLogs(prev => ({ ...prev, [log.date]: log }));
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'dailyLogs', log.date), log);
      } catch (e) {}
    }

    if (profile) {
      if (log.dailyScore && log.dailyScore >= 50) {
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

  // handleQuickLog was removed as it relied on the legacy action-spam system.

  const showToastMsg = (msg: string, type?: 'green'|'darkGreen') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const derivedProfile = useMemo(() => {
    if (!profile) return null;
    const score = calculateFlagScore(logs);
    const { streak, bestStreak: calculatedBestStreak } = calculateTrend(logs);
    
    // Determine true best streak. If the profile has a mathematically impossible phantom best streak
    // (e.g. from deleted mock data), we override it with the calculated true best streak.
    let trueBestStreak = profile.bestStreak || 0;
    if (trueBestStreak > Object.keys(logs).length) {
      trueBestStreak = calculatedBestStreak;
    }

    // Auto-update best streak silently in profile if the current streak beats it
    if (streak > trueBestStreak) {
       trueBestStreak = streak;
    }
    
    // Save to db if our derived trueBestStreak is different than what's stored
    if (trueBestStreak !== profile.bestStreak) {
       setTimeout(() => {
         saveProfile({ ...profile, bestStreak: trueBestStreak });
       }, 0);
    }
    
    return {
      ...profile,
      flagScore: score,
      streak: streak,
      bestStreak: trueBestStreak
    };
  }, [profile, logs]);

  const isSplashOrOnboarding = !user || (!derivedProfile || !derivedProfile.completedOnboarding);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
      <div 
        className={`w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[url('/bg-green.png')] bg-cover bg-center bg-no-repeat sm:rounded-[40px] sm:border-[8px] sm:border-white/20 sm:shadow-[0_0_40px_rgba(0,0,0,0.2)] relative overflow-hidden ring-1 ring-black/5 ${isShaking ? 'shake-anim' : ''}`}
        style={{ contain: 'paint' }}
      >
        {isAuthLoading ? (
          <div className="h-full w-full flex items-center justify-center bg-white/20 backdrop-blur-md text-[#354024] font-bold text-xl">Loading...</div>
        ) : !user ? (
          <Splash />
        ) : isSplashOrOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <>
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
                  {navState.tab === 'home' && <HomeTab profile={derivedProfile} logs={logs} onAwardXP={handleAwardXP} onNavigate={setNavState} showToastMsg={showToastMsg} />}
                  {navState.tab === 'journey' && <JourneyTab profile={derivedProfile} logs={logs} onNavigate={setNavState} />}
                  {navState.tab === 'insights' && <InsightsTab profile={derivedProfile} logs={logs} />}
                  {navState.tab === 'community' && <CommunityTab profile={derivedProfile} onAwardXP={handleAwardXP} showToastMsg={showToastMsg} />}
                  {navState.tab === 'profile' && <ProfileTab profile={derivedProfile} logs={logs} onNavigate={setNavState} onAvatarChange={handleAvatarChange} />}
                </>
              )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav activeTab={navState.type === 'tab' ? navState.tab : 'home'} onTabChange={(tab) => setNavState({ type: 'tab', tab })} />

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
          </>
        )}
      </div>
    </div>
  );
}


