import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { AVATARS } from '../avatars';
import { AvatarDisplay } from './AvatarDisplay';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

type Step = 'welcome' | 'name' | 'commute' | 'food' | 'delivery' | 'device' | 'avatar' | 'reveal';
const STEPS: Step[] = ['welcome', 'name', 'commute', 'food', 'delivery', 'device', 'avatar', 'reveal'];

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 items-center justify-center py-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="h-2 rounded-full"
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i < current ? '#889063' : i === current ? '#889063' : 'rgba(196,217,188,0.4)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function ChoiceBtn({ emoji, label, desc, onClick, selected }: {
  emoji: string; label: string; desc?: string; onClick: () => void; selected?: boolean;
}) {
  return (
    <motion.button whileTap={{ scale: 0.97 }}
      className={`btn-choice text-left flex items-center gap-4 ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div>
        <div className="font-semibold text-[#354024]">{label}</div>
        {desc && <div className="text-sm text-[#4C3D19] mt-0.5">{desc}</div>}
      </div>
    </motion.button>
  );
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    userType: null,
    commuteMethod: null,
    acPreference: null,
    foodPreferences: null,
    deliveryFrequency: 0,
    chargerHabit: null,
    flagScore: 50,
    avatarId: 'av1',
  });
  const [selectedAvatar, setSelectedAvatar] = useState('av1');

  const step = STEPS[currentStep];
  const nextStep = () => setCurrentStep(p => Math.min(p + 1, STEPS.length - 1));

  const handleFinish = () => {
    let score = 50;
    if (profile.commuteMethod === 'walk') score += 20;
    if (profile.commuteMethod === 'bus') score += 10;
    if (profile.commuteMethod === 'car') score -= 15;
    if (profile.acPreference === 'none') score += 15;
    if (profile.acPreference === 'goblin') score -= 20;
    if (profile.foodPreferences === 'mess' || profile.foodPreferences === 'home') score += 10;
    if (profile.foodPreferences === 'eat_out') score -= 5;
    const df = profile.deliveryFrequency || 0;
    if (df === 0) score += 10;
    else if (df > 2 && df <= 4) score -= 10;
    else if (df > 4) score -= 20;
    if (profile.chargerHabit === false) score += 5;
    if (profile.chargerHabit === true) score -= 5;
    score = Math.max(0, Math.min(100, score));
    onComplete({ ...profile, avatarId: selectedAvatar, flagScore: score });
  };

  const firstName = profile.name?.split(' ')[0] || 'you';
  const showDots = !['welcome', 'reveal'].includes(step);
  const dotIndex = Math.max(0, currentStep - 1);
  const chosenAvatar = AVATARS.find(a => a.id === selectedAvatar) ?? AVATARS[0];

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center gap-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative w-40 h-40 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full glow-pulse"
                style={{ background: 'radial-gradient(circle, rgba(90,143,90,0.2) 0%, transparent 70%)' }} />
              <div className="w-36 h-36 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E4EDE0 0%, #E5D7C4 100%)', boxShadow: '0 8px 32px rgba(90,143,90,0.2)' }}>
                <span className="text-7xl plant-float">🚩</span>
              </div>
            </motion.div>
            <div>
              <h1 className="text-display text-4xl font-bold text-[#354024] mb-3 leading-tight">
                Are you a green flag?<br />Let's find out.
              </h1>
              <p className="text-[#5A8070] text-base leading-relaxed">
                Track your footprint. Lower your impact. Live greener.
              </p>
            </div>
            <motion.button className="btn-primary text-lg py-5" onClick={nextStep} whileTap={{ scale: 0.97 }}>
              <span>🚩</span> Begin My Journey
            </motion.button>
          </div>
        );

      case 'name':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2">What should we call you?</h2>
              <p className="text-[#4C3D19] text-sm">Your journey will be uniquely yours.</p>
            </div>
            <input type="text" className="soft-input text-center text-lg"
              placeholder="Your name"
              value={profile.name || ''}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              autoFocus
            />
            {profile.name && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-[#889063] font-semibold">
                Hi {profile.name?.split(' ')[0]}! Let's see your flag 🚩
              </motion.p>
            )}
            <motion.button className="btn-primary py-4" onClick={nextStep}
              disabled={!profile.name} style={{ opacity: profile.name ? 1 : 0.5 }} whileTap={{ scale: 0.97 }}>
              Continue
            </motion.button>
          </div>
        );



      case 'commute':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🛤️</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2">How do you move?</h2>
              <p className="text-[#4C3D19] text-sm">Your commute affects your footprint.</p>
            </div>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="🚶" label="Walk or cycle" desc="Zero emissions 🌿"
                onClick={() => { setProfile({ ...profile, commuteMethod: 'walk' }); nextStep(); }} />
              <ChoiceBtn emoji="🚌" label="College bus" desc="Smart and shared"
                onClick={() => { setProfile({ ...profile, commuteMethod: 'bus' }); nextStep(); }} />
              <ChoiceBtn emoji="🚇" label="Public transport" desc="Every shared ride helps"
                onClick={() => { setProfile({ ...profile, commuteMethod: 'public' }); nextStep(); }} />
              <ChoiceBtn emoji="🛵" label="Car or scooty" desc="Every journey still counts"
                onClick={() => { setProfile({ ...profile, commuteMethod: 'car' }); nextStep(); }} />
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🍱</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2">What's your food vibe?</h2>
            </div>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="🏠" label="Home cooked" desc="Lowest footprint, highest love"
                onClick={() => { setProfile({ ...profile, foodPreferences: 'home' }); nextStep(); }} />
              <ChoiceBtn emoji="🍽️" label="Mess / Canteen" desc="Community and consistent"
                onClick={() => { setProfile({ ...profile, foodPreferences: 'mess' }); nextStep(); }} />
              <ChoiceBtn emoji="👨‍🍳" label="Cook my own" desc="Self-sufficient and mindful"
                onClick={() => { setProfile({ ...profile, foodPreferences: 'cook' }); nextStep(); }} />
              <ChoiceBtn emoji="🥡" label="Eat outside" desc="Balanced, adventurous"
                onClick={() => { setProfile({ ...profile, foodPreferences: 'eat_out' }); nextStep(); }} />
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2">How often does delivery call?</h2>
              <p className="text-[#4C3D19] text-sm">Packaging waste adds up — be honest.</p>
            </div>
            <div className="soft-card p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-mono font-bold text-[#889063]">{profile.deliveryFrequency}×</span>
                <span className="text-sm text-[#4C3D19]">per week</span>
              </div>
              <input type="range" min="0" max="7" value={profile.deliveryFrequency || 0}
                onChange={e => setProfile({ ...profile, deliveryFrequency: parseInt(e.target.value) })}
                className="w-full" />
              <div className="flex justify-between mt-2 text-xs text-[#4C3D19]">
                <span>Never 🌿</span><span>Every day 📦</span>
              </div>
            </div>
            <motion.button className="btn-primary py-4" onClick={nextStep} whileTap={{ scale: 0.97 }}>Continue</motion.button>
          </div>
        );

      case 'device':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔌</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2 leading-tight">
                Leave chargers plugged in when empty?
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <ChoiceBtn emoji="✅" label="No, I unplug them" desc="Saves phantom energy 🌿"
                onClick={() => { setProfile({ ...profile, chargerHabit: false }); nextStep(); }} />
              <ChoiceBtn emoji="😅" label="Yep, all the time" desc="We'll work on it together"
                onClick={() => { setProfile({ ...profile, chargerHabit: true }); nextStep(); }} />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🪞</div>
              <h2 className="text-display text-3xl font-bold text-[#354024] mb-2">Pick your avatar</h2>
              <p className="text-[#4C3D19] text-sm">This will represent you across the app.</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map(av => (
                <motion.button key={av.id} whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedAvatar(av.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all overflow-hidden"
                    style={{
                      background: selectedAvatar === av.id
                        ? 'linear-gradient(135deg, #C4D9BC, #E4EDE0)'
                        : 'rgba(253,250,245,0.9)',
                      border: selectedAvatar === av.id
                        ? '2.5px solid #889063'
                        : '2px solid rgba(196,217,188,0.4)',
                      boxShadow: selectedAvatar === av.id
                        ? '0 4px 16px rgba(90,143,90,0.25)'
                        : '0 2px 8px rgba(30,26,22,0.06)',
                    }}
                  >
                    <AvatarDisplay avatar={av} size={56} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#5A8070] text-center leading-tight">
                    {av.tag}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Preview */}
            <div className="soft-card p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <AvatarDisplay avatar={chosenAvatar} size={48} />
              </div>
              <div>
                <p className="font-bold text-[#354024]">{profile.name?.split(' ')[0] || 'You'}</p>
                <p className="text-xs text-[#4C3D19]">{chosenAvatar.tag} · {chosenAvatar.label}</p>
              </div>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="ml-auto text-[#889063] text-xl">✓</motion.span>
            </div>

            <motion.button className="btn-primary py-4" onClick={nextStep} whileTap={{ scale: 0.97 }}>
              Looks good! Continue
            </motion.button>
          </div>
        );

      case 'reveal':
        return (
          <div className="flex flex-col items-center text-center gap-8">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full glow-pulse"
                style={{ background: 'radial-gradient(circle, rgba(90,143,90,0.3) 0%, transparent 70%)' }} />
              <div className="w-40 h-40 rounded-full overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #E4EDE0 0%, #E5D7C4 100%)', boxShadow: '0 12px 40px rgba(90,143,90,0.25)', border: '3px solid rgba(196,217,188,0.6)' }}>
                <AvatarDisplay avatar={chosenAvatar} size={160} />
              </div>
            </motion.div>

            <div>
              <motion.p className="text-sm font-semibold text-[#889063] uppercase tracking-widest mb-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                Welcome to <span className="font-logo text-[15px]">FLAGGED</span>,
              </motion.p>
              <motion.h1 className="text-display text-4xl font-bold text-[#354024] mb-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                {firstName} 🚩
              </motion.h1>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                className="inline-flex items-center gap-2 era-badge-mixed px-4 py-2 text-base">
                <span>🔥</span> Glow Up Era
              </motion.div>
              <motion.p className="text-[#4C3D19] text-sm mt-4 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                Your footprint journey starts now.<br />Every green flag you earn lowers your impact.
              </motion.p>
            </div>

            <motion.button className="btn-primary text-lg py-5 w-full" onClick={handleFinish}
              whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
              <span>{chosenAvatar.emoji}</span> Enter <span className="font-logo ml-1">FLAGGED</span>
            </motion.button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(196,217,188,0.35) 0%, transparent 65%), #E5D7C4' }}>
      {showDots && <div className="mb-6"><ProgressDots current={dotIndex} total={STEPS.length - 2} /></div>}
      {!showDots && <div className="h-8" />}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
