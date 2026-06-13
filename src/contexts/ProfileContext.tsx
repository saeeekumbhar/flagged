import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { useAuth } from './AuthContext';
import { useLogs } from './LogsContext';
import { FirebaseService } from '../services/FirebaseService';

interface ProfileContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (baseProfile: Partial<UserProfile>) => Promise<void>;
  isProfileLoading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setIsAuthLoading } = useAuth();
  const { setLogs, isLogsLoading } = useLogs();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Load Profile and handle local storage migration
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
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
          setProfile(p);
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

  // Once both profile and logs are done loading, we can unblock the Auth Loading screen
  useEffect(() => {
    if (!isProfileLoading && !isLogsLoading) {
      setIsAuthLoading(false);
    }
  }, [isProfileLoading, isLogsLoading, setIsAuthLoading]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    if (user) {
      try {
        await FirebaseService.saveProfile(user.uid, updates);
      } catch (e) {
        console.warn("Update profile rejected by security rules:", e);
      }
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
    
    setProfile(newProfile);
    await FirebaseService.saveProfile(user.uid, newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, completeOnboarding, isProfileLoading, setProfile }}>
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
