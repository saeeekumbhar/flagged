/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavState, DailyLog } from './types';
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
import { useAuth, useProfile, useLogs } from './hooks';

export default function App() {
  const { user, isAuthLoading } = useAuth();
  const { profile, updateProfile, awardXP, completeOnboarding, isProfileLoading } = useProfile();
  const { logs, addLog, isLogsLoading } = useLogs();
  
  const [navState, setNavState] = useState<NavState>({ type: 'tab', tab: 'home' });
  const [toast, setToast] = useState<{msg: string, type?: 'green'|'darkGreen'} | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogSave = async (log: Partial<DailyLog>) => {
    const result = await addLog(log);
    
    if (result && result.updates) {
      updateProfile(result.updates);
      
      if (result.log.dailyScore && result.log.dailyScore >= 50) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    }

    if (navState.type === 'day_details') {
      setNavState({ type: 'tab', tab: 'home' });
    }
  };

  const handleAvatarChange = (avatarId: string) => {
    if (profile) updateProfile({ avatarId });
  };

  const handleAwardXP = async (xpAmount: number, coinsAmount: number, reason: string) => {
    await awardXP(xpAmount, reason);
    if (xpAmount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const showToastMsg = (msg: string, type?: 'green'|'darkGreen') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
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
                  {navState.tab === 'home' && profile && <HomeTab profile={profile} logs={logs} onAwardXP={handleAwardXP} onNavigate={setNavState} showToastMsg={showToastMsg} />}
                  {navState.tab === 'journey' && profile && <JourneyTab profile={profile} logs={logs} onNavigate={setNavState} />}
                  {navState.tab === 'insights' && profile && <InsightsTab profile={profile} logs={logs} />}
                  {navState.tab === 'community' && profile && <CommunityTab profile={profile} onAwardXP={handleAwardXP} showToastMsg={showToastMsg} />}
                  {navState.tab === 'profile' && profile && <ProfileTab profile={profile} logs={logs} onNavigate={setNavState} onAvatarChange={handleAvatarChange} />}
                </>
              )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav activeTab={navState.type === 'tab' ? navState.tab : 'home'} onTabChange={(tab) => setNavState({ type: 'tab', tab })} />

            {/* Detail Screens */}
            <AnimatePresence>
              {navState.type === 'day_details' && profile && (
                <DayDetailsScreen
                  key="day_details"
                  profile={profile}
                  date={navState.date}
                  existingLog={logs[navState.date]}
                  onSave={handleLogSave}
                  onCancel={() => setNavState({ type: 'tab', tab: 'journey' })}
                />
              )}
              {navState.type === 'badge_details' && profile && (
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
          </>
        )}
      </div>
    </div>
  );
}
