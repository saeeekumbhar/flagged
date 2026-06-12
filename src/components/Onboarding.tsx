import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DailyLog } from '../types';
import { calculateDailyScore } from '../utils/ScoreEngine';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

type Step = 'student_type' | 'commute_method' | 'commute_distance' | 'food_habits' | 'energy_habits' | 'score_reveal';

function ChoiceBtn({ emoji, label, desc, onClick }: { emoji: string; label: string; desc?: string; onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      className="w-full bg-white border border-[#E5D7C4] rounded-2xl p-5 flex items-center gap-5 shadow-sm active:shadow-none transition-shadow text-left"
      onClick={onClick}
    >
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div>
        <div className="font-bold text-[#354024] text-lg">{label}</div>
        {desc && <div className="text-sm text-[#5A8070] mt-0.5 font-medium">{desc}</div>}
      </div>
    </motion.button>
  );
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('student_type');
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    userType: null,
    commuteMethod: null,
    commuteDistance: null,
    foodPreferences: null,
    acPreference: null,
  });

  const nextStep = (step: Step) => setCurrentStep(step);

  const handleFinish = () => {
    // We map answers to a mock DailyLog to generate a realistic initial flagScore via ScoreEngine.
    let mappedTransport = profile.commuteMethod as any;
    if (mappedTransport === 'train') mappedTransport = 'metro';
    if (mappedTransport === 'bike') mappedTransport = 'auto';

    let mappedFood = profile.foodPreferences as any;
    let mappedDelivery: any = 'no';
    if (mappedFood === 'delivery') {
        mappedDelivery = 'multiple';
        mappedFood = 'mixed';
    } else if (mappedFood === 'canteen') {
        mappedFood = 'mixed';
        mappedDelivery = 'once';
    }

    const mockLog: Partial<DailyLog> = {
      transport: mappedTransport || 'none',
      food: mappedFood || 'none',
      energyAC: profile.acPreference as any || 'none',
      delivery: mappedDelivery,
      shopping: 'no',
      energyLaptop: 'none'
    };
    
    const initialScore = calculateDailyScore(mockLog);
    
    onComplete({ 
      ...profile, 
      flagScore: initialScore,
      completedOnboarding: true 
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'student_type':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
            <h2 className="text-[28px] leading-tight font-bold text-[#354024] px-2">What type of student are you?</h2>
            <div className="flex flex-col gap-4">
              <ChoiceBtn emoji="🎒" label="Day Scholar" desc="Travel to campus daily"
                onClick={() => { setProfile({ ...profile, userType: 'day_scholar' }); nextStep('commute_method'); }} />
              <ChoiceBtn emoji="🏠" label="Hosteller" desc="Living on campus"
                onClick={() => { setProfile({ ...profile, userType: 'hostelier' }); nextStep('commute_method'); }} />
            </div>
          </div>
        );

      case 'commute_method':
        const isDay = profile.userType === 'day_scholar';
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
            <h2 className="text-[28px] leading-tight font-bold text-[#354024] px-2">
              {isDay ? "How do you usually reach campus?" : "How do you usually move around campus?"}
            </h2>
            <div className="flex flex-col gap-3 h-[60vh] overflow-y-auto no-scrollbar pb-10">
              <ChoiceBtn emoji="🚶" label="Walk" onClick={() => { setProfile({ ...profile, commuteMethod: 'walk' }); nextStep(isDay ? 'commute_distance' : 'food_habits'); }} />
              <ChoiceBtn emoji="🚲" label="Cycle" onClick={() => { setProfile({ ...profile, commuteMethod: 'cycle' }); nextStep(isDay ? 'commute_distance' : 'food_habits'); }} />
              <ChoiceBtn emoji="🚌" label={isDay ? "Bus" : "Campus Bus"} onClick={() => { setProfile({ ...profile, commuteMethod: 'bus' }); nextStep(isDay ? 'commute_distance' : 'food_habits'); }} />
              {isDay && <ChoiceBtn emoji="🚇" label="Metro" onClick={() => { setProfile({ ...profile, commuteMethod: 'metro' }); nextStep('commute_distance'); }} />}
              {isDay && <ChoiceBtn emoji="🚆" label="Local Train" onClick={() => { setProfile({ ...profile, commuteMethod: 'train' }); nextStep('commute_distance'); }} />}
              {!isDay && <ChoiceBtn emoji="🏍️" label="Bike" onClick={() => { setProfile({ ...profile, commuteMethod: 'bike' }); nextStep('food_habits'); }} />}
              <ChoiceBtn emoji="🛺" label="Auto" onClick={() => { setProfile({ ...profile, commuteMethod: 'auto' }); nextStep(isDay ? 'commute_distance' : 'food_habits'); }} />
              {isDay && <ChoiceBtn emoji="🚗" label="Car" onClick={() => { setProfile({ ...profile, commuteMethod: 'car' }); nextStep('commute_distance'); }} />}
              {isDay && <ChoiceBtn emoji="🚕" label="Cab" onClick={() => { setProfile({ ...profile, commuteMethod: 'cab' }); nextStep('commute_distance'); }} />}
            </div>
          </div>
        );

      case 'commute_distance':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
            <h2 className="text-[28px] leading-tight font-bold text-[#354024] px-2">How far is your daily commute?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="📍" label="< 2 km" onClick={() => { setProfile({ ...profile, commuteDistance: '<2 km' }); nextStep('food_habits'); }} />
              <ChoiceBtn emoji="🗺️" label="2 - 5 km" onClick={() => { setProfile({ ...profile, commuteDistance: '2-5 km' }); nextStep('food_habits'); }} />
              <ChoiceBtn emoji="🛣️" label="5 - 10 km" onClick={() => { setProfile({ ...profile, commuteDistance: '5-10 km' }); nextStep('food_habits'); }} />
              <ChoiceBtn emoji="🌍" label="10+ km" onClick={() => { setProfile({ ...profile, commuteDistance: '10+ km' }); nextStep('food_habits'); }} />
            </div>
          </div>
        );

      case 'food_habits':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
            <h2 className="text-[28px] leading-tight font-bold text-[#354024] px-2">What's your food routine?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="🍽️" label="Mess" onClick={() => { setProfile({ ...profile, foodPreferences: 'mess' }); nextStep('energy_habits'); }} />
              <ChoiceBtn emoji="🍱" label="Home food" onClick={() => { setProfile({ ...profile, foodPreferences: 'home' }); nextStep('energy_habits'); }} />
              <ChoiceBtn emoji="🥪" label="Canteen" onClick={() => { setProfile({ ...profile, foodPreferences: 'canteen' }); nextStep('energy_habits'); }} />
              <ChoiceBtn emoji="🛵" label="Delivery" onClick={() => { setProfile({ ...profile, foodPreferences: 'delivery' }); nextStep('energy_habits'); }} />
              <ChoiceBtn emoji="🥗" label="Mixed" onClick={() => { setProfile({ ...profile, foodPreferences: 'mixed' }); nextStep('energy_habits'); }} />
            </div>
          </div>
        );

      case 'energy_habits':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
            <h2 className="text-[28px] leading-tight font-bold text-[#354024] px-2">Your room setup?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="🎐" label="Fan only" onClick={() => { 
                setProfile({ ...profile, acPreference: 'none' }); 
                nextStep('score_reveal'); 
              }} />
              <ChoiceBtn emoji="❄️" label="Fan + occasional AC" onClick={() => { 
                setProfile({ ...profile, acPreference: '<2h' }); 
                nextStep('score_reveal'); 
              }} />
              <ChoiceBtn emoji="🥶" label="Daily AC" onClick={() => { 
                setProfile({ ...profile, acPreference: '6+h' }); 
                nextStep('score_reveal'); 
              }} />
            </div>
          </div>
        );

      case 'score_reveal':
        let mappedTransport = profile.commuteMethod as any;
        if (mappedTransport === 'train') mappedTransport = 'metro';
        if (mappedTransport === 'bike') mappedTransport = 'auto';

        let mappedFood = profile.foodPreferences as any;
        let mappedDelivery: any = 'no';
        if (mappedFood === 'delivery') {
            mappedDelivery = 'multiple';
            mappedFood = 'mixed';
        } else if (mappedFood === 'canteen') {
            mappedFood = 'mixed';
            mappedDelivery = 'once';
        }

        const tempLog: Partial<DailyLog> = {
          transport: mappedTransport || 'none',
          food: mappedFood || 'none',
          energyAC: profile.acPreference as any || 'none',
          delivery: mappedDelivery, shopping: 'no', energyLaptop: 'none'
        };
        const initialScore = calculateDailyScore(tempLog);

        return (
          <div className="flex flex-col items-center text-center gap-8 w-full max-w-[390px] mx-auto">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative w-48 h-48 rounded-full flex items-center justify-center flex-col"
              style={{ background: 'linear-gradient(135deg, #E4EDE0 0%, #E5D7C4 100%)', boxShadow: '0 12px 40px rgba(90,143,90,0.25)', border: '3px solid rgba(196,217,188,0.6)' }}
            >
              <div className="text-6xl font-black text-[#354024]">{initialScore}</div>
              <div className="text-sm font-bold text-[#5A8070] uppercase tracking-widest mt-2">/ 100</div>
            </motion.div>

            <div>
              <motion.h2 className="text-[28px] leading-tight font-bold text-[#354024] mb-2"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                Your first Flag Score
              </motion.h2>
              <motion.p className="text-[#5A8070] text-lg font-medium"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                Your journey starts here.
              </motion.p>
            </div>

            <motion.button className="w-full bg-[#354024] text-white rounded-2xl py-4 text-lg font-bold shadow-md active:scale-95 transition-transform mt-8" 
              onClick={handleFinish}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            >
              Enter App
            </motion.button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-6 overflow-hidden bg-[#FDFBF7]">
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
