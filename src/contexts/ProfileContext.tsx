import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { useAuth } from './AuthContext';
import { useLogs } from './LogsContext';
import { FirebaseService } from '../services/FirebaseService';
import { calculateFlagScore, calculateTrend } from '../utils/ScoreEngine';

interface ProfileContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  awardXP: (amount: number, reason: string) => Promise<{ newLevel: boolean; newCoins: number }>;
  completeOnboarding: (baseProfile: Partial<UserProfile>) => Promise<void>;
  isProfileLoading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setIsAuthLoading } = useAuth();
  const { logs, setLogs, isLogsLoading } = useLogs();
  
  const [baseProfile, setBaseProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Load Profile and handle local storage migration
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!user) {
        setBaseProfile(null);
        setIsProfileLoading(false);
        setIsAuthLoading(false);
        return;
      }
      
      try {
        let p = await FirebaseService.getProfile(user.uid);
        
        // If not found in Firebase, attempt local migration
        if (!p) {
          const { profile: migratedProfile, logs: migratedLogs } = await FirebaseService.migrateLocalData(user.uid);
          if (migratedProfile && isMounted) {
            p = migratedProfile;
            setLogs(migratedLogs);
          }
        }
        
        if (isMounted) {
          setBaseProfile(p);
          setIsProfileLoading(false);
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
        if (isMounted) setIsProfileLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, [user, setLogs, setIsAuthLoading]);

  // Derived State Rule: Daily logs are the source of truth for streak and score.
  const profile = useMemo(() => {
    if (!baseProfile) return null;
    
    const derivedScore = calculateFlagScore(logs);
    const { streak, bestStreak } = calculateTrend(logs);
    
    // Check if derived states differ from base profile. If so, update base profile asynchronously
    const isMismatched = 
      baseProfile.flagScore !== derivedScore || 
      baseProfile.streak !== streak || 
      baseProfile.bestStreak !== Math.max(bestStreak, baseProfile.bestStreak);

    if (isMismatched && user) {
      // Background sync to keep Firebase updated with derived state
      FirebaseService.saveProfile(user.uid, {
        flagScore: derivedScore,
        streak: streak,
        bestStreak: Math.max(bestStreak, baseProfile.bestStreak)
      });
    }

    return {
      ...baseProfile,
      flagScore: derivedScore,
      streak: streak,
      bestStreak: Math.max(bestStreak, baseProfile.bestStreak)
    };
  }, [baseProfile, logs, user]);

  // Once both profile and logs are done loading, we can unblock the Auth Loading screen
  useEffect(() => {
    if (!isProfileLoading && !isLogsLoading) {
      setIsAuthLoading(false);
    }
  }, [isProfileLoading, isLogsLoading, setIsAuthLoading]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setBaseProfile(prev => prev ? { ...prev, ...updates } : null);
    if (user) {
      await FirebaseService.saveProfile(user.uid, updates);
    }
  };

  const completeOnboarding = async (onboardingData: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'Eco Explorer',
      userType: onboardingData.userType || 'day_scholar',
      commuteMethod: onboardingData.commuteMethod || null,
      foodPreferences: onboardingData.foodPreferences || null,
      acPreference: onboardingData.acPreference || null,
      deliveryFrequency: onboardingData.deliveryFrequency || 0,
      chargerHabit: onboardingData.chargerHabit || false,
      flagScore: 50,
      completedOnboarding: true,
      avatarId: 'default',
      streak: 0,
      bestStreak: 0,
      xp: 0,
      level: 1,
      coins: 0,
    };
    
    setBaseProfile(newProfile);
    await FirebaseService.saveProfile(user.uid, newProfile);
  };

  const awardXP = async (amount: number, reason: string) => {
    if (!profile || !user) return { newLevel: false, newCoins: 0 };

    const newXP = profile.xp + amount;
    const newCoins = profile.coins + Math.floor(amount / 3);
    const newLevel = Math.floor(newXP / 1000) + 1;
    const levelUp = newLevel > profile.level;

    await updateProfile({
      xp: newXP,
      coins: newCoins,
      level: newLevel
    });

    return { newLevel: levelUp, newCoins: Math.floor(amount / 3) };
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, awardXP, completeOnboarding, isProfileLoading, setProfile: setBaseProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
