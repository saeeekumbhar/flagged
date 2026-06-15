import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../../hooks';

type TextSize = 'small' | 'default' | 'large' | 'xlarge';
type ThemeMode = 'light' | 'dark' | 'system';

import { SoundService } from '../../services/SoundService';
import { NotificationService } from '../../services/NotificationService';
import { FirebaseService } from '../../services/FirebaseService';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { settings, updateSetting } = useSettings();
  const [permissionStatus, setPermissionStatus] = useState<string>('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const requestNotificationPermission = async () => {
    const perm = await NotificationService.requestPermission();
    setPermissionStatus(perm);
    return perm === 'granted';
  };

  const handleToggle = (key: keyof typeof settings) => {
    const newValue = !settings[key as keyof typeof settings];
    updateSetting(key as any, newValue);
    
    if (settings.buttonSounds) SoundService.playBoop();

    if (settings.buttonSounds) SoundService.playBoop();
  };

  const handleSelect = (key: keyof typeof settings, value: string) => {
    updateSetting(key as any, value);
    if (settings.buttonSounds) SoundService.playBoop();
  };

  return (
    <motion.div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#F4F1EC] flex flex-col pointer-events-auto overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-[#F4F1EC]/90 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-[#CFBB99]">
        <button aria-label="Go Back" onClick={() => { if(settings.buttonSounds) SoundService.playBoop(); onBack(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-[#CFBB99] text-[#4C3D19] active:scale-95 transition-transform">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 id="settings-title" className="text-xl font-bold text-[#1A2315] font-display">Settings</h1>
      </div>

      <div className="p-4 flex flex-col gap-6 pb-24">
        
        {/* Appearance & Accessibility */}
        <section>
          <h2 className="text-sm font-bold text-[#4C3D19] uppercase tracking-wider mb-3 px-1">Appearance & Accessibility</h2>
          <div className="bg-white rounded-[24px] border border-[#CFBB99] overflow-hidden shadow-sm">
            
            <div className="p-4 border-b border-[#E5D7C4]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[#1A2315]">Text Size</span>
              </div>
              <div className="flex gap-2">
                {(['small', 'default', 'large', 'xlarge'] as TextSize[]).map((size) => (
                  <button 
                    key={size}
                    onClick={() => handleSelect('textSize', size)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${settings.textSize === size ? 'bg-[#354024] text-white border-[#354024]' : 'bg-[#F4F1EC] text-[#4C3D19] border-[#CFBB99]'}`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-[#E5D7C4]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[#1A2315]">Theme</span>
              </div>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as ThemeMode[]).map((theme) => (
                  <button 
                    key={theme}
                    onClick={() => handleSelect('theme', theme)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${settings.theme === theme ? 'bg-[#354024] text-white border-[#354024]' : 'bg-[#F4F1EC] text-[#4C3D19] border-[#CFBB99]'}`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#1A2315]">Reduced Motion</div>
                <div className="text-xs text-[#889063]">Disable animations & confetti</div>
              </div>
              <div className="flex bg-[#F4F1EC] rounded-xl p-1 border border-[#CFBB99]">
                <button onClick={() => handleSelect('motion', 'normal')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${settings.motion === 'normal' ? 'bg-white shadow-sm text-[#1A2315]' : 'text-[#889063]'}`}>Normal</button>
                <button onClick={() => handleSelect('motion', 'reduced')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${settings.motion === 'reduced' ? 'bg-white shadow-sm text-[#1A2315]' : 'text-[#889063]'}`}>Reduced</button>
              </div>


            </div>
          </div>
        </section>

        {/* Sound & Experience */}
        <section>
          <h2 className="text-sm font-bold text-[#4C3D19] uppercase tracking-wider mb-3 px-1">Sound & Experience</h2>
          <div className="bg-white rounded-[24px] border border-[#CFBB99] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#E5D7C4] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#1A2315]">Ambient Music</div>
                <div className="text-xs text-[#889063]">Calm background audio (Coming soon)</div>
              </div>
              <button onClick={() => handleToggle('ambientMusic')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.ambientMusic ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.ambientMusic ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="p-4 border-b border-[#E5D7C4] flex items-center justify-between">
              <div className="font-semibold text-[#1A2315]">Button Sounds</div>
              <button onClick={() => handleToggle('buttonSounds')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.buttonSounds ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.buttonSounds ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold text-[#1A2315]">Achievement Sounds</div>
              <button onClick={() => handleToggle('achievementSounds')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.achievementSounds ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.achievementSounds ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-sm font-bold text-[#4C3D19] uppercase tracking-wider mb-3 px-1">Notifications</h2>
          <div className="bg-white rounded-[24px] border border-[#CFBB99] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#E5D7C4] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#1A2315]">Daily Reminder</div>
                <div className="text-xs text-[#889063] flex gap-2 items-center mt-1">
                  <input type="time" value={settings.reminderTime} onChange={(e) => handleSelect('reminderTime', e.target.value)} className="bg-[#F4F1EC] rounded px-1 text-[#1A2315] font-mono outline-none" />
                </div>
              </div>
              <button onClick={async () => {
                const granted = settings.dailyReminder ? true : await requestNotificationPermission();
                if (!settings.dailyReminder && !granted) return;
                handleToggle('dailyReminder');
              }} className={`w-12 h-6 rounded-full transition-colors relative ${settings.dailyReminder ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.dailyReminder ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="p-4 border-b border-[#E5D7C4] flex items-center justify-between">
              <div className="font-semibold text-[#1A2315]">Weekly Report</div>
              <button onClick={() => handleToggle('weeklyReport')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.weeklyReport ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.weeklyReport ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold text-[#1A2315]">Challenge Reminders</div>
              <button onClick={() => handleToggle('challengeReminders')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.challengeReminders ? 'bg-[#889063]' : 'bg-[#CFBB99]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.challengeReminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          {permissionStatus === 'denied' && (
            <p className="text-xs text-[#D4614A] mt-2 px-2">Notifications are blocked by your browser. Please enable them in settings.</p>
          )}
          {permissionStatus === 'missing_config' && (
            <p className="text-xs text-[#D4614A] mt-2 px-2">Push notifications are currently disabled by the server configuration.</p>
          )}
        </section>

        {/* Account & Legal */}
        <section>
          <h2 className="text-sm font-bold text-[#4C3D19] uppercase tracking-wider mb-3 px-1">Account & Legal</h2>
          <div className="bg-white rounded-[24px] border border-[#CFBB99] overflow-hidden shadow-sm">
            <button 
              onClick={() => {
                if (settings.buttonSounds) SoundService.playBoop();
                setShowPrivacyPolicy(true);
              }}
              className="w-full p-4 border-b border-[#E5D7C4] flex items-center justify-between text-left active:bg-[#F4F1EC] transition-colors"
            >
              <div className="font-semibold text-[#1A2315]">Privacy Policy</div>
              <div className="text-[#CFBB99]">→</div>
            </button>
            <button 
              onClick={async () => {
                if (settings.buttonSounds) SoundService.playBoop();
                const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
                if (confirm) {
                  try {
                    await FirebaseService.deleteAccount();
                    alert("Account deleted successfully.");
                    window.location.reload();
                  } catch (e) {
                    console.error("Account deletion failed", e);
                    alert("Failed to delete account. Please try again or ensure you have completed the re-authentication popup.");
                  }
                }
              }}
              className="w-full p-4 flex items-center justify-between text-left active:bg-[#FDF2F2] transition-colors group"
            >
              <div className="font-semibold text-[#D4614A]">Delete Account</div>
              <div className="text-[#D4614A] opacity-50 group-hover:opacity-100">→</div>
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-[#CFBB99] flex flex-col items-center text-center pb-8">
          <div className="font-display font-bold text-[#1A2315] mb-1">Credits: Saee Kumbhar</div>
          <div className="text-xs font-bold text-[#889063] uppercase tracking-wider mb-6">All Rights Reserved.</div>
          
          <div className="bg-[#E5D7C4]/50 border border-[#CFBB99] rounded-2xl p-4 max-w-sm mb-6">
            <div className="text-[10px] font-bold text-[#4C3D19] uppercase tracking-wider mb-2">Disclaimer</div>
            <p className="text-xs text-[#4C3D19] leading-relaxed opacity-80">
              This platform is for educational and informational purposes only. It is not affiliated with any official environmental authority or government body. 
            </p>
          </div>

          <div className="text-sm">
            <div className="font-bold text-[#1A2315] mb-0.5">Still have questions?</div>
            <div className="text-[#889063]">Email us at:</div>
            <a href="mailto:saeeekumbhar@gmail.com" className="font-bold text-[#354024] hover:underline mt-1 inline-block">
              saeeekumbhar@gmail.com
            </a>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showPrivacyPolicy && (
          <PrivacyPolicyScreen onBack={() => setShowPrivacyPolicy(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
