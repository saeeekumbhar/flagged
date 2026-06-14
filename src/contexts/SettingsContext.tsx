import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { FirebaseService } from '../services/FirebaseService';

export type TextSize = 'small' | 'default' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark' | 'system';
export type MotionMode = 'normal' | 'reduced';

export interface AppSettings {
  textSize: TextSize;
  theme: ThemeMode;
  motion: MotionMode;
  ambientMusic: boolean;
  buttonSounds: boolean;
  achievementSounds: boolean;
  dailyReminder: boolean;
  weeklyReport: boolean;
  challengeReminders: boolean;
  reminderTime: string;
  voiceInsights: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  textSize: 'default',
  theme: 'system',
  motion: 'normal',
  ambientMusic: true,
  buttonSounds: true,
  achievementSounds: true,
  dailyReminder: false,
  weeklyReport: false,
  challengeReminders: false,
  reminderTime: '20:00',
  voiceInsights: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  isDarkMode: boolean;
  isReducedMotion: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = StorageService.getSettings();
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...stored, ambientMusic: true }; // Force true for testing
    }
    return DEFAULT_SETTINGS;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Save settings on change
  useEffect(() => {
    StorageService.saveSettings(settings);

    // Sync notification preferences to Firestore if logged in
    const syncPreferences = async () => {
      try {
        const uid = FirebaseService.getCurrentUserId();
        if (uid) {
          await FirebaseService.saveProfile(uid, {
            // @ts-ignore : Extending UserProfile if we want to save these
            notificationPreferences: {
              dailyReminder: settings.dailyReminder,
              weeklyReport: settings.weeklyReport,
              achievements: settings.achievementSounds,
              reminderTime: settings.reminderTime
            }
          });
        }
      } catch (e) {
        console.warn('Failed to sync notification preferences', e);
      }
    };
    syncPreferences();
  }, [settings]);

  // Apply Theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        setIsDarkMode(mediaQuery.matches);
      }
    };
    
    if (settings.theme === 'dark') {
      setIsDarkMode(true);
    } else if (settings.theme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(mediaQuery.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Apply Theme CSS Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply Text Size
  useEffect(() => {
    const sizeMap: Record<TextSize, string> = {
      small: '14px',
      default: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = sizeMap[settings.textSize];
  }, [settings.textSize]);

  // Apply Reduced Motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (settings.motion === 'normal' && mediaQuery.matches) {
         // Respect OS if normal, but OS is reduced? Actually, explicit settings override OS.
      }
    };

    const reduced = settings.motion === 'reduced' || (settings.motion === 'normal' && mediaQuery.matches);
    setIsReducedMotion(reduced);

    if (reduced) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.motion]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({ settings, updateSetting, isDarkMode, isReducedMotion }), [settings, updateSetting, isDarkMode, isReducedMotion]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
