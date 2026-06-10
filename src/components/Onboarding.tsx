import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const steps = [
  { id: 'welcome', title: "Let's Play FLAGGED" },
  { id: 'type', title: "Who are you?" },
  { id: 'commute', title: "How do you commute?" },
  { id: 'food', title: "Food vibe?" },
  { id: 'reveal', title: "Your Era" }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "Player 1",
    userType: null,
    commuteMethod: null,
    foodPreferences: null,
    flagScore: 50, // base score
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleFinish = () => {
    // Generate a quick random score adjustment based on choices for MVP
    let score = 50;
    if (profile.commuteMethod === 'walk' || profile.commuteMethod === 'bike') score += 20;
    if (profile.foodPreferences === 'mess' || profile.foodPreferences === 'home') score += 10;
    if (profile.commuteMethod === 'car') score -= 15;
    if (profile.foodPreferences === 'delivery' || profile.foodPreferences === 'eat_out') score -= 10;
    
    // Ensure score bounded 0-100
    score = Math.max(0, Math.min(100, score));

    onComplete({ ...profile, flagScore: score });
  };

  const renderContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <PixelCard className="text-center py-12">
            <h1 className="font-mono text-4xl mb-4 text-[#52B788] font-black uppercase tracking-tighter">FLAGGED</h1>
            <p className="mb-8 font-sans font-bold text-[#121212]/70 italic text-sm">Track your vibe. Are you in your Green Flag Era?</p>
            <PixelButton onClick={nextStep} className="w-full">Start Game</PixelButton>
          </PixelCard>
        );
      case 'type':
        return (
          <PixelCard className="py-10">
            <h2 className="font-pixel text-xl mb-6 text-center text-[#121212]">College Life</h2>
            <div className="space-y-4">
              <PixelButton 
                variant={profile.userType === 'day_scholar' ? 'primary' : 'secondary'}
                className="w-full block"
                onClick={() => { setProfile({ ...profile, userType: 'day_scholar' }); nextStep(); }}
              >
                Day Scholar
              </PixelButton>
              <PixelButton 
                variant={profile.userType === 'hostelier' ? 'primary' : 'secondary'}
                className="w-full block"
                onClick={() => { setProfile({ ...profile, userType: 'hostelier' }); nextStep(); }}
              >
                Hostelier
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
              <PixelButton variant="secondary" className="w-full block m-0 !border-2 text-xs sm:text-sm" onClick={() => { setProfile({ ...profile, commuteMethod: 'car' }); nextStep(); }}>Car / Bike / Scooty</PixelButton>
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
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'home' }); nextStep(); }}>Home Cooked</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'canteen' }); nextStep(); }}>College Canteen</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'eat_out' }); nextStep(); }}>Eat Outside</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'delivery' }); nextStep(); }}>Daily Delivery</PixelButton>
                </>
              ) : (
                <>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'mess' }); nextStep(); }}>Mess / Canteen</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'cook' }); nextStep(); }}>Cook My Own</PixelButton>
                  <PixelButton variant="secondary" className="w-full block" onClick={() => { setProfile({ ...profile, foodPreferences: 'delivery' }); nextStep(); }}>Daily Delivery</PixelButton>
                </>
              )}
            </div>
          </PixelCard>
        );
      case 'reveal':
        return (
          <PixelCard variant="green" className="text-center py-10">
            <h2 className="font-pixel text-2xl mb-4 text-[#121212]">Setup Complete!</h2>
            <div className="w-32 h-32 mx-auto bg-[#52B788] rounded-none flex items-center justify-center border-4 border-[#121212] mb-6 brutal-shadow">
              <span className="text-5xl border-transparent">🌱</span>
            </div>
            <p className="mb-6 font-bold text-[#121212]/90 uppercase font-sans text-xs tracking-widest">Your avatar awaits</p>
            <PixelButton onClick={handleFinish} variant="secondary" className="w-full !bg-white !text-[#2D6A4F] border-[#121212]">Enter Dashboard</PixelButton>
          </PixelCard>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FEFAE0]">
      <div className="w-full max-w-md">
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
