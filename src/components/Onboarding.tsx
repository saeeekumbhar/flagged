import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const steps = [
  { id: 'welcome', title: "Welcome" },
  { id: 'type', title: "Who are you?" },
  { id: 'commute', title: "Commute?" },
  { id: 'room', title: "Room Setup?" },
  { id: 'food', title: "Food vibe?" },
  { id: 'delivery', title: "Delivery?" },
  { id: 'device', title: "Device Usage?" },
  { id: 'reveal', title: "Reveal" }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "Player 1",
    userType: null,
    commuteMethod: null,
    acPreference: null,
    foodPreferences: null,
    deliveryFrequency: 0,
    chargerHabit: null,
    flagScore: 50, // base score
    avatar: '/avatar.png', // default
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleFinish = () => {
    let score = 50;
    
    // Commute
    if (profile.commuteMethod === 'walk') score += 20;
    if (profile.commuteMethod === 'bus') score += 10;
    if (profile.commuteMethod === 'car') score -= 15;
    
    // AC
    if (profile.acPreference === 'none') score += 15;
    if (profile.acPreference === 'night') score += 0;
    if (profile.acPreference === 'goblin') score -= 20;

    // Food
    if (profile.foodPreferences === 'mess' || profile.foodPreferences === 'home') score += 10;
    if (profile.foodPreferences === 'eat_out') score -= 5;
    
    // Delivery Frequency
    const df = profile.deliveryFrequency || 0;
    if (df === 0) score += 10;
    else if (df > 2 && df <= 4) score -= 10;
    else if (df > 4) score -= 20;

    // Charger
    if (profile.chargerHabit === false) score += 5; // Good
    if (profile.chargerHabit === true) score -= 5; // Bad
    
    // Ensure score bounded 0-100
    score = Math.max(0, Math.min(100, score));

    let avatar = '/avatar.png';

    onComplete({ ...profile, flagScore: score, avatar });
  };

  const renderContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <PixelCard className="text-center py-12">
             <div className="w-32 h-32 mx-auto bg-white flex items-center justify-center border-4 border-[#4A423D] mb-6 brutal-shadow opacity-90 overflow-hidden">
               <img src="/avatar.png" alt="Silhouette" className="w-full h-full object-cover pixelated opacity-50 grayscale" />
             </div>
            <h1 className="font-sans font-black text-2xl mb-4 text-[#3A3532] uppercase tracking-tighter">Character Creation</h1>
            <p className="mb-8 font-sans font-bold text-[#3A3532]/70 italic text-sm">Let's build your player profile.</p>
            <PixelButton onClick={nextStep} className="w-full text-lg">CONTINUE</PixelButton>
          </PixelCard>
        );
      case 'type':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212]">College Life</h2>
            <div className="space-y-4">
              <PixelButton 
                variant={profile.userType === 'hostelier' ? 'primary' : 'secondary'}
                className="w-full block py-6"
                onClick={() => { setProfile({ ...profile, userType: 'hostelier' }); nextStep(); }}
              >
                <div className="text-3xl mb-2">🛏️</div>
                Hostelier
              </PixelButton>
              <PixelButton 
                variant={profile.userType === 'day_scholar' ? 'primary' : 'secondary'}
                className="w-full block py-6"
                onClick={() => { setProfile({ ...profile, userType: 'day_scholar' }); nextStep(); }}
              >
                <div className="text-3xl mb-2">🎒</div>
                Day Scholar
              </PixelButton>
            </div>
          </PixelCard>
        );
      case 'commute':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212]">Your Ride</h2>
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <PixelButton variant="secondary" className="w-full block m-0 !border-2" onClick={() => { setProfile({ ...profile, commuteMethod: 'walk' }); nextStep(); }}>Walk / Cycle</PixelButton>
              <PixelButton variant="secondary" className="w-full block m-0 !border-2" onClick={() => { setProfile({ ...profile, commuteMethod: 'bus' }); nextStep(); }}>College Bus</PixelButton>
              <PixelButton variant="secondary" className="w-full block m-0 !border-2 text-xs sm:text-sm" onClick={() => { setProfile({ ...profile, commuteMethod: 'public' }); nextStep(); }}>Public Transport</PixelButton>
              <PixelButton variant="secondary" className="w-full block m-0 !border-2 text-xs sm:text-sm" onClick={() => { setProfile({ ...profile, commuteMethod: 'car' }); nextStep(); }}>Car / Scooty</PixelButton>
            </div>
          </PixelCard>
        );
      case 'room':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212]">AC Preferences?</h2>
            <div className="space-y-4">
              <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, acPreference: 'none' }); nextStep(); }}>Non-AC (Sweat it out)</PixelButton>
              <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, acPreference: 'night' }); nextStep(); }}>AC Only at Night</PixelButton>
              <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, acPreference: 'goblin' }); nextStep(); }}>AC Goblin (24/7)</PixelButton>
            </div>
          </PixelCard>
        );
      case 'food':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212]">Food Vibe</h2>
            <div className="space-y-4">
              {profile.userType === 'day_scholar' ? (
                <>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'home' }); nextStep(); }}>Home Cooked (Dabba)</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'canteen' }); nextStep(); }}>College Canteen</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'eat_out' }); nextStep(); }}>Eat Outside</PixelButton>
                </>
              ) : (
                <>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'mess' }); nextStep(); }}>Mess / Canteen</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'cook' }); nextStep(); }}>Cook My Own</PixelButton>
                </>
              )}
            </div>
          </PixelCard>
        );
      case 'delivery':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-2 text-center text-[#121212]">Delivery Habits</h2>
            <p className="text-center font-bold text-xs text-[#121212]/60 mb-8 font-sans">How often is the delivery guy calling you?</p>
            <div className="mb-10 px-2">
              <input 
                type="range" 
                min="0" max="7" 
                value={profile.deliveryFrequency || 0}
                onChange={(e) => setProfile({ ...profile, deliveryFrequency: parseInt(e.target.value) })}
                className="w-full h-4 bg-white border-2 border-[#121212] rounded-none appearance-none cursor-pointer brutal-shadow"
              />
              <div className="flex justify-between mt-4 font-pixel text-[10px] text-[#121212]/70">
                 <span>0 (Never)</span>
                 <span>7 (Every Day)</span>
              </div>
            </div>
            <PixelButton variant="primary" className="w-full block" onClick={nextStep}>CONFIRM</PixelButton>
          </PixelCard>
        );
      case 'device':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212] px-2">Leave chargers plugged in empty?</h2>
            <div className="space-y-4">
               <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, chargerHabit: false }); nextStep(); }}>No (Safe)</PixelButton>
               <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, chargerHabit: true }); nextStep(); }}>Yes (Energy Vampire)</PixelButton>
            </div>
          </PixelCard>
        );
      case 'reveal':
        return (
          <PixelCard variant="green" className="text-center py-10 !bg-[#FDFBF7] !border-[#4A423D]">
            <h2 className="font-sans font-black text-xl mb-8 text-[#3A3532] uppercase tracking-wider">You are starting in the...</h2>
            
            <motion.div 
               initial={{ scale: 0.8, rotate: -5 }}
               animate={{ scale: 1, rotate: 0 }}
               className="w-32 h-32 mx-auto bg-white rounded-none flex items-center justify-center border-4 border-[#4A423D] mb-6 brutal-shadow-green overflow-hidden relative"
            >
              <img src="/tree.png" alt="Background" className="absolute inset-0 w-full h-full object-cover pixelated opacity-30" />
              <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover pixelated relative z-10" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 font-black text-[#8BA888] uppercase font-sans text-2xl tracking-widest drop-shadow-[2px_2px_0px_#4A423D]"
            >
              GREEN FLAG ERA
            </motion.h1>
            
            <PixelButton onClick={handleFinish} variant="secondary" className="w-full !bg-[#8BA888] !text-[#3A3532] border-[#4A423D]">Enter Campus</PixelButton>
          </PixelCard>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7] relative">
      {/* XP Bar Progress */}
      {currentStep < steps.length - 1 && (
        <div className="fixed top-0 left-0 right-0 h-3 bg-white border-b-2 border-[#4A423D] z-50">
          <div 
            className="h-full bg-[#8BA888] transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 2)) * 100}%` }}
          />
        </div>
      )}

      <div className="w-full max-w-md pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
