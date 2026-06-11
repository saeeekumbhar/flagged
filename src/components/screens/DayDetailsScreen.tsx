import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyLog, UserProfile } from '../../types';

interface DayDetailsScreenProps {
  key?: string;
  date: string; // YYYY-MM-DD
  existingLog?: DailyLog;
  profile: UserProfile;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

export function DayDetailsScreen({ date, existingLog, profile, onSave, onCancel }: DayDetailsScreenProps) {
  const [transport, setTransport] = useState(existingLog?.transport || '');
  const [food, setFood] = useState(existingLog?.food || '');
  const [delivery, setDelivery] = useState(existingLog?.delivery || '');
  const [energyLaptop, setEnergyLaptop] = useState(existingLog?.energyLaptop || '');
  const [energyAC, setEnergyAC] = useState(existingLog?.energyAC || '');
  const [shopping, setShopping] = useState(existingLog?.shopping || '');
  const [reflection, setReflection] = useState<'rough' | 'mixed' | 'green' | undefined>(existingLog?.reflection);

  const handleSave = () => {
    let flagImpact = 0;
    let carbonEstimate = 0;

    // Scoring Logic
    if (transport === 'walk' || transport === 'cycle') { flagImpact += 10; carbonEstimate += 0.5; }
    if (transport === 'bus' || transport === 'metro') { flagImpact += 5; carbonEstimate += 2; }
    if (transport === 'auto') { flagImpact -= 2; carbonEstimate += 5; }
    if (transport === 'car' || transport === 'cab') { flagImpact -= 5; carbonEstimate += 12; }

    if (food === 'mess' || food === 'home') { flagImpact += 5; carbonEstimate += 1.5; }
    if (food === 'mixed') { flagImpact += 2; carbonEstimate += 3; }
    if (food === 'nonveg') { flagImpact -= 5; carbonEstimate += 8; }

    if (delivery === 'once') { flagImpact -= 3; carbonEstimate += 3; }
    if (delivery === 'multiple') { flagImpact -= 8; carbonEstimate += 8; }
    if (delivery === 'no') { flagImpact += 5; carbonEstimate += 0; }

    if (energyLaptop === '<2h') { flagImpact += 5; carbonEstimate += 0.2; }
    if (energyLaptop === '8+h') { flagImpact -= 2; carbonEstimate += 1; }
    
    if (energyAC === 'none') { flagImpact += 10; carbonEstimate += 0; }
    if (energyAC === '<2h') { flagImpact += 0; carbonEstimate += 2; }
    if (energyAC === '2-6h') { flagImpact -= 5; carbonEstimate += 6; }
    if (energyAC === '6+h') { flagImpact -= 10; carbonEstimate += 12; }

    if (shopping === 'no') { flagImpact += 5; carbonEstimate += 0; }
    if (shopping === 'small') { flagImpact += 0; carbonEstimate += 2; }
    if (shopping === 'medium') { flagImpact -= 2; carbonEstimate += 5; }
    if (shopping === 'large') { flagImpact -= 8; carbonEstimate += 15; }

    // Add back legacy logic score if any (to preserve previous arbitrary points)
    let legacyImpact = 0;
    let legacyCarbon = 0;
    if (existingLog?.activities && existingLog.activities.length > 0) {
      // If we are overwriting, we might lose old arbitrary points.
      // But if the user edits via this new form, they overwrite with structured data.
      // We'll keep the activities array to not break older references.
    }

    onSave({
      date,
      activities: existingLog?.activities || [],
      transport,
      food,
      delivery,
      energyLaptop,
      energyAC,
      shopping,
      reflection,
      totalFlagImpact: flagImpact,
      totalCarbonEstimate: carbonEstimate,
      notes: existingLog?.notes || ''
    });
  };

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const isHostelier = profile.userType === 'hostelier';

  const SelectionChip = ({ label, value, current, onChange }: { label: string, value: string, current: string, onChange: (v: string) => void }) => {
    const isSelected = current === value;
    return (
      <button
        onClick={() => onChange(value)}
        className={`px-4 py-3 rounded-[20px] text-sm font-bold transition-all ${
          isSelected 
            ? 'bg-[#354024] text-white shadow-md scale-[1.02]' 
            : 'premium-glass text-[#354024] active:scale-95'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-white/70 backdrop-blur-3xl overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#354024] premium-pill active:scale-95 transition-transform"
          >
            ←
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#889063] uppercase tracking-wider mb-0.5">
              Daily Check-In
            </p>
            <h2 className="text-xl font-bold text-[#354024]">
              {displayDate}
            </h2>
          </div>
        </div>

        {/* Section 1: Transport or Mess */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#354024] mb-3">
            {isHostelier ? 'Mess Usage' : 'How did you mostly travel?'}
          </h3>
          {isHostelier ? (
            <div className="grid grid-cols-2 gap-2">
               <SelectionChip label="Skipped" value="skip" current={transport} onChange={setTransport} />
               <SelectionChip label="Ate in Mess" value="mess" current={transport} onChange={setTransport} />
               <SelectionChip label="Ate Outside" value="outside" current={transport} onChange={setTransport} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <SelectionChip label="Walk" value="walk" current={transport} onChange={setTransport} />
              <SelectionChip label="Cycle" value="cycle" current={transport} onChange={setTransport} />
              <SelectionChip label="Bus" value="bus" current={transport} onChange={setTransport} />
              <SelectionChip label="Metro" value="metro" current={transport} onChange={setTransport} />
              <SelectionChip label="Auto" value="auto" current={transport} onChange={setTransport} />
              <SelectionChip label="Car / Cab" value="car" current={transport} onChange={setTransport} />
            </div>
          )}
        </div>

        {/* Section 2: Food */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#354024] mb-3">How were your meals today?</h3>
          <div className="grid grid-cols-2 gap-2">
            <SelectionChip label="Mess Food" value="mess" current={food} onChange={setFood} />
            <SelectionChip label="Home Cooked" value="home" current={food} onChange={setFood} />
            <SelectionChip label="Mostly Veg" value="veg" current={food} onChange={setFood} />
            <SelectionChip label="Mixed" value="mixed" current={food} onChange={setFood} />
            <SelectionChip label="Mostly Non-Veg" value="nonveg" current={food} onChange={setFood} />
          </div>
        </div>

        {/* Section 3: Delivery */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#354024] mb-3">Did you order delivery?</h3>
          <div className="grid grid-cols-3 gap-2">
            <SelectionChip label="No" value="no" current={delivery} onChange={setDelivery} />
            <SelectionChip label="Once" value="once" current={delivery} onChange={setDelivery} />
            <SelectionChip label="Multiple" value="multiple" current={delivery} onChange={setDelivery} />
          </div>
        </div>

        {/* Section 4: Energy */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#354024] mb-3">Approx. laptop usage?</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <SelectionChip label="< 2 hours" value="<2h" current={energyLaptop} onChange={setEnergyLaptop} />
            <SelectionChip label="2 - 4 hours" value="2-4h" current={energyLaptop} onChange={setEnergyLaptop} />
            <SelectionChip label="4 - 8 hours" value="4-8h" current={energyLaptop} onChange={setEnergyLaptop} />
            <SelectionChip label="8+ hours" value="8+h" current={energyLaptop} onChange={setEnergyLaptop} />
          </div>
          <h3 className="text-lg font-bold text-[#354024] mb-3">AC usage?</h3>
          <div className="grid grid-cols-2 gap-2">
            <SelectionChip label="None" value="none" current={energyAC} onChange={setEnergyAC} />
            <SelectionChip label="< 2 hours" value="<2h" current={energyAC} onChange={setEnergyAC} />
            <SelectionChip label="2 - 6 hours" value="2-6h" current={energyAC} onChange={setEnergyAC} />
            <SelectionChip label="6+ hours" value="6+h" current={energyAC} onChange={setEnergyAC} />
          </div>
        </div>

        {/* Section 5: Shopping */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#354024] mb-3">Did you purchase anything?</h3>
          <div className="grid grid-cols-2 gap-2">
            <SelectionChip label="No" value="no" current={shopping} onChange={setShopping} />
            <SelectionChip label="Small" value="small" current={shopping} onChange={setShopping} />
            <SelectionChip label="Medium" value="medium" current={shopping} onChange={setShopping} />
            <SelectionChip label="Large" value="large" current={shopping} onChange={setShopping} />
          </div>
        </div>

        {/* Optional Reflection */}
        <div className="mb-8 p-5 premium-glass rounded-[24px]">
          <h3 className="text-xs font-bold text-[#4C3D19] uppercase tracking-widest text-center mb-4">How was your day?</h3>
          <div className="flex justify-around">
            <button onClick={() => setReflection('rough')} className={`text-3xl transition-transform ${reflection === 'rough' ? 'scale-125 drop-shadow-md' : 'opacity-50 grayscale'}`}>🚩</button>
            <button onClick={() => setReflection('mixed')} className={`text-3xl transition-transform ${reflection === 'mixed' ? 'scale-125 drop-shadow-md' : 'opacity-50 grayscale'}`}>🟡</button>
            <button onClick={() => setReflection('green')} className={`text-3xl transition-transform ${reflection === 'green' ? 'scale-125 drop-shadow-md' : 'opacity-50 grayscale'}`}>🟢</button>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleSave}
            disabled={!transport && !food && !delivery && !energyAC && !shopping}
            className="w-full py-[18px] bg-[#354024] text-white rounded-full font-bold text-[15px] shadow-[0_8px_30px_rgba(53,64,36,0.3)] active:scale-[0.98] transition-transform disabled:opacity-30 disabled:shadow-none"
          >
            Complete Check-In
          </button>
        </div>
      </div>
    </motion.div>
  );
}
