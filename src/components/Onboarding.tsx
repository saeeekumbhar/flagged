import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

type Step = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'final';

const stepsOrder: Step[] = ['welcome', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'final'];

function ChoiceBtn({ emoji, label, selected, onClick }: { emoji?: string; label: string; selected?: boolean; onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      className={`w-full backdrop-blur-md border ${selected ? 'bg-white/25 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/10 border-white/20'} rounded-2xl p-5 flex items-center gap-5 shadow-sm active:shadow-none transition-all text-left text-white`}
      onClick={onClick}
    >
      {emoji && <span className="text-3xl flex-shrink-0 drop-shadow-md">{emoji}</span>}
      <div className="font-bold text-lg drop-shadow-sm">{label}</div>
    </motion.button>
  );
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = stepsOrder[currentStepIndex];

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStepIndex < stepsOrder.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 1) { // 0 is welcome, 1 is q1.
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const selectAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const handleFinish = () => {
    onComplete({
      userType: (answers.q1 === 'Day Scholar' ? 'day_scholar' : 'hostelier') as any,
      completedOnboarding: true
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="flex flex-col h-full items-center justify-center text-center gap-6 w-full max-w-[390px] mx-auto">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-md tracking-wide">
                Hey!
              </h1>
              <h2 className="text-2xl font-bold text-white/90 drop-shadow">Welcome to FLAGGED</h2>
            </motion.div>
            
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/80 text-lg font-medium px-4 drop-shadow-sm leading-relaxed">
              Your student journey to understanding and reducing your carbon footprint starts here.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} 
              className="bg-white/10 backdrop-blur-xl p-6 rounded-[32px] w-full border border-white/20 mt-4 text-left shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            >
              <p className="text-sm font-bold text-white/70 mb-5 uppercase tracking-widest text-center drop-shadow-sm">FLAGGED helps you track</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl font-bold text-white flex items-center gap-3 border border-white/10 shadow-sm"><span className="text-2xl drop-shadow">🚲</span> Travel</div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl font-bold text-white flex items-center gap-3 border border-white/10 shadow-sm"><span className="text-2xl drop-shadow">🍱</span> Food</div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl font-bold text-white flex items-center gap-3 border border-white/10 shadow-sm"><span className="text-2xl drop-shadow">⚡</span> Energy</div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl font-bold text-white flex items-center gap-3 border border-white/10 shadow-sm"><span className="text-2xl drop-shadow">🌱</span> Habits</div>
              </div>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white/20 backdrop-blur-lg border border-white/40 text-white rounded-full py-4 text-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-8 hover:bg-white/30 transition-colors" 
              onClick={handleNext}
            >
              Start Journey
            </motion.button>
          </div>
        );

      case 'q1':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">Are you a...</h2>
            <div className="flex flex-col gap-4">
              <ChoiceBtn emoji="🏠" label="Day Scholar" selected={answers.q1 === 'Day Scholar'} onClick={() => selectAnswer('q1', 'Day Scholar')} />
              <ChoiceBtn emoji="🏡" label="Hosteler / PG" selected={answers.q1 === 'Hosteler'} onClick={() => selectAnswer('q1', 'Hosteler')} />
            </div>
          </div>
        );

      case 'q2':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16 h-full pb-10">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">How do you usually travel to campus?</h2>
            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
              <ChoiceBtn emoji="🚶" label="Walk" selected={answers.q2 === 'Walk'} onClick={() => selectAnswer('q2', 'Walk')} />
              <ChoiceBtn emoji="🚲" label="Cycle" selected={answers.q2 === 'Cycle'} onClick={() => selectAnswer('q2', 'Cycle')} />
              <ChoiceBtn emoji="🚌" label="Bus" selected={answers.q2 === 'Bus'} onClick={() => selectAnswer('q2', 'Bus')} />
              <ChoiceBtn emoji="🚆" label="Train" selected={answers.q2 === 'Train'} onClick={() => selectAnswer('q2', 'Train')} />
              <ChoiceBtn emoji="🚇" label="Metro" selected={answers.q2 === 'Metro'} onClick={() => selectAnswer('q2', 'Metro')} />
              <ChoiceBtn emoji="🛺" label="Auto / Rickshaw" selected={answers.q2 === 'Auto'} onClick={() => selectAnswer('q2', 'Auto')} />
              <ChoiceBtn emoji="🚗" label="Car" selected={answers.q2 === 'Car'} onClick={() => selectAnswer('q2', 'Car')} />
            </div>
          </div>
        );

      case 'q3':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16 h-full pb-10">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">How do you usually eat during college days?</h2>
            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
              <ChoiceBtn emoji="🍱" label="Mess food" selected={answers.q3 === 'Mess'} onClick={() => selectAnswer('q3', 'Mess')} />
              <ChoiceBtn emoji="🏠" label="Home food" selected={answers.q3 === 'Home'} onClick={() => selectAnswer('q3', 'Home')} />
              <ChoiceBtn emoji="🥗" label="Mostly vegetarian" selected={answers.q3 === 'Veg'} onClick={() => selectAnswer('q3', 'Veg')} />
              <ChoiceBtn emoji="🍗" label="Mixed diet" selected={answers.q3 === 'Mixed'} onClick={() => selectAnswer('q3', 'Mixed')} />
              <ChoiceBtn emoji="🍔" label="Frequent outside food" selected={answers.q3 === 'Outside'} onClick={() => selectAnswer('q3', 'Outside')} />
            </div>
          </div>
        );

      case 'q4':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">How often do you order online food or products?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn label="Never" selected={answers.q4 === 'Never'} onClick={() => selectAnswer('q4', 'Never')} />
              <ChoiceBtn label="Sometimes" selected={answers.q4 === 'Sometimes'} onClick={() => selectAnswer('q4', 'Sometimes')} />
              <ChoiceBtn label="Few times a week" selected={answers.q4 === 'Few times'} onClick={() => selectAnswer('q4', 'Few times')} />
              <ChoiceBtn label="Almost daily" selected={answers.q4 === 'Daily'} onClick={() => selectAnswer('q4', 'Daily')} />
            </div>
          </div>
        );

      case 'q5':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">Your daily screen/laptop usage?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn label="< 2 hours" selected={answers.q5 === '<2h'} onClick={() => selectAnswer('q5', '<2h')} />
              <ChoiceBtn label="2-4 hours" selected={answers.q5 === '2-4h'} onClick={() => selectAnswer('q5', '2-4h')} />
              <ChoiceBtn label="4-8 hours" selected={answers.q5 === '4-8h'} onClick={() => selectAnswer('q5', '4-8h')} />
              <ChoiceBtn label="8+ hours" selected={answers.q5 === '8+h'} onClick={() => selectAnswer('q5', '8+h')} />
            </div>
          </div>
        );

      case 'q6':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto mt-16">
            <h2 className="text-[28px] leading-tight font-bold text-white drop-shadow-md px-2">Your sustainability goal?</h2>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="🌱" label="Learn my impact" selected={answers.q6 === 'Learn'} onClick={() => selectAnswer('q6', 'Learn')} />
              <ChoiceBtn emoji="🌱" label="Build better habits" selected={answers.q6 === 'Habits'} onClick={() => selectAnswer('q6', 'Habits')} />
              <ChoiceBtn emoji="🌱" label="Reduce my footprint" selected={answers.q6 === 'Reduce'} onClick={() => selectAnswer('q6', 'Reduce')} />
              <ChoiceBtn emoji="🌱" label="Become a Green Flag" selected={answers.q6 === 'GreenFlag'} onClick={() => selectAnswer('q6', 'GreenFlag')} />
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="flex flex-col items-center justify-center text-center gap-8 w-full max-w-[390px] mx-auto h-full">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative w-48 h-48 rounded-full flex items-center justify-center flex-col bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <motion.div 
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-7xl drop-shadow-lg"
              >🌱</motion.div>
            </motion.div>

            <div>
              <motion.h2 className="text-[32px] leading-tight font-black text-white mb-4 drop-shadow-md"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                You're all set 🌱
              </motion.h2>
              <motion.p className="text-white/90 text-lg font-medium px-4 drop-shadow-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                Let's start building your Green Flag journey.
              </motion.p>
            </div>

            <motion.button 
              className="w-full bg-white/20 backdrop-blur-lg border border-white/40 text-white rounded-full py-4 text-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-8 hover:bg-white/30 transition-colors" 
              onClick={handleFinish}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            >
              Enter FLAGGED
            </motion.button>
          </div>
        );

      default: return null;
    }
  };

  const showNav = currentStep !== 'welcome' && currentStep !== 'final';
  const progressPercent = showNav ? ((currentStepIndex) / (stepsOrder.length - 2)) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative z-10 font-sans bg-transparent">
      
      {/* Top Navigation for Questions */}
      {showNav && (
        <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-4 pb-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleBack} 
              disabled={currentStep === 'q1'} 
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${currentStep === 'q1' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <span className="text-2xl text-white font-bold drop-shadow">←</span>
            </button>
            <button 
              onClick={handleNext} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl text-white font-bold drop-shadow">→</span>
            </button>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mx-2 max-w-[calc(100%-16px)] backdrop-blur-sm border border-white/10">
             <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 pb-6 pt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
            className="w-full h-full flex flex-col justify-center"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


