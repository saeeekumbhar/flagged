import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyLog } from '../types';
import { Splash } from './Splash';
import { Onboarding } from './Onboarding';

import { BottomNav } from './BottomNav';
import { HomeTab } from './tabs/HomeTab';
import { JourneyTab } from './tabs/JourneyTab';
import { InsightsTab } from './tabs/InsightsTab';
import { ChallengesTab } from './tabs/ChallengesTab';
import { ProfileTab } from './tabs/ProfileTab';
import { useAuth, useProfile, useLogs, useNavigation, useToast } from '../hooks';
import { FirebaseService } from '../services/FirebaseService';

const DayDetailsScreen = React.lazy(() => import('./screens/DayDetailsScreen').then(m => ({ default: m.DayDetailsScreen })));
const BadgeDetailsScreen = React.lazy(() => import('./screens/BadgeDetailsScreen').then(m => ({ default: m.BadgeDetailsScreen })));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const Confetti = React.lazy(() => import('./Confetti').then(m => ({ default: m.Confetti })));
import { XP_REWARDS } from '../constants';

export function AppShell() {
  const { user, isAuthLoading } = useAuth();
  const { profile, updateProfile, completeOnboarding, isProfileLoading } = useProfile();
  const { logs, addLog, isLogsLoading } = useLogs();
  const { navState, handleNavChange } = useNavigation();
  const { toast, showToastMsg } = useToast();
  
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogSave = async (log: Partial<DailyLog>) => {
    const result = await addLog(log);
    if (result && result.updates) {
      updateProfile(result.updates);
      FirebaseService.logAnalyticsEvent('daily_log_created', { score: result.log.dailyScore });
      if (result.log.dailyScore && result.log.dailyScore >= 50) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    }
    if (navState.type === 'day_details') {
      handleNavChange({ type: 'tab', tab: 'home' });
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    if (profile) updateProfile({ avatarId });
  };

  const handleAwardXP = async (xpAmount: number, coinsAmount: number, reason: string) => {
    let actionType = '';
    if (reason === 'Streak bonus!') actionType = 'streak_bonus';
    else if (reason === 'Challenge done!') actionType = 'challenge_completed';
    else actionType = reason;

    try {
      const result = await FirebaseService.awardManualXP(actionType);
      if (result?.updates) {
        updateProfile(result.updates);
        FirebaseService.logAnalyticsEvent('achievement_unlocked', { reason: actionType });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } catch (e) {
      showToastMsg('Failed to award manual XP', 'darkGreen');
    }
  };

  const isSplashOrOnboarding = !user || (!profile || !profile.completedOnboarding);
  
  if (isAuthLoading || (user && (isProfileLoading || isLogsLoading))) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
        <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[url('/bg-green.png')] bg-cover bg-center bg-no-repeat sm:rounded-[40px] sm:border-[8px] sm:border-white/20 sm:shadow-[0_0_40px_rgba(0,0,0,0.2)] flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md text-[#354024] font-bold text-xl px-8 py-4 rounded-3xl shadow-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[url('/bg-green.png')] bg-cover bg-center bg-no-repeat sm:rounded-[40px] sm:border-[8px] sm:border-white/20 sm:shadow-[0_0_40px_rgba(0,0,0,0.2)] relative overflow-hidden ring-1 ring-black/5 ${isShaking ? 'shake-anim' : ''}`}
      style={{ contain: 'paint' }}
    >
      {!user ? (
        <Splash />
      ) : isSplashOrOnboarding ? (
        <Onboarding onComplete={completeOnboarding} />
      ) : (
        <>
          <AnimatePresence>
            {toast && (
              <div className="absolute top-6 inset-x-0 z-[100] flex justify-center pointer-events-none px-4">
                <motion.div 
                  initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                  className={`${toast.type === 'darkGreen' ? 'bg-[#889063]' : 'bg-[#889063]'} text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold text-center w-max max-w-full`}
                  role="alert" aria-live="assertive"
                >
                  {toast.msg}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bottom-16 overflow-y-auto no-scrollbar pb-6">
            {navState.type === 'tab' && (
              <>
                {navState.tab === 'home' && profile && <HomeTab profile={profile} logs={logs} onAwardXP={handleAwardXP} onNavigate={handleNavChange} showToastMsg={showToastMsg} />}
                {navState.tab === 'journey' && profile && <JourneyTab profile={profile} logs={logs} onNavigate={handleNavChange} />}
                {navState.tab === 'insights' && profile && <InsightsTab profile={profile} logs={logs} />}
                {navState.tab === 'challenges' && profile && <ChallengesTab profile={profile} onAwardXP={handleAwardXP} showToastMsg={showToastMsg} updateProfile={updateProfile} />}
                {navState.tab === 'profile' && profile && <ProfileTab profile={profile} logs={logs} onNavigate={handleNavChange} onAvatarChange={handleAvatarChange} updateProfile={updateProfile} showToastMsg={showToastMsg} />}
              </>
            )}
          </div>

          <BottomNav activeTab={navState.type === 'tab' ? navState.tab : 'home'} onTabChange={(tab) => handleNavChange({ type: 'tab', tab })} />

          <AnimatePresence>
            <React.Suspense fallback={<div className="absolute inset-0 bg-[#F4F1EC]/80 backdrop-blur-sm z-50 flex items-center justify-center font-bold text-[#354024]">Loading...</div>}>
              {navState.type === 'day_details' && profile && (
                <DayDetailsScreen
                  key="day_details"
                  profile={profile}
                  date={navState.date}
                  existingLog={logs[navState.date]}
                  onSave={handleLogSave}
                  onCancel={() => handleNavChange({ type: 'tab', tab: 'journey' })}
                />
              )}
              {navState.type === 'badge_details' && profile && (
                <BadgeDetailsScreen
                  key="badge_details"
                  badgeId={navState.badgeId}
                  profile={profile}
                  logs={logs}
                  onBack={() => handleNavChange({ type: 'tab', tab: 'profile' })}
                />
              )}
              {navState.type === 'settings' && (
                <SettingsScreen
                  key="settings"
                  onBack={() => handleNavChange({ type: 'tab', tab: 'profile' })}
                />
              )}
            </React.Suspense>
          </AnimatePresence>

          {showConfetti && (
            <React.Suspense fallback={null}>
              <Confetti duration={1500} />
            </React.Suspense>
          )}
        </>
      )}
    </div>
  );
}
