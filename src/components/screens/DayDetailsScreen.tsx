import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyLog, UserProfile } from '../../types';

interface DayDetailsScreenProps {
  key?: string;
  date: string; // YYYY-MM-DD
  existingLog?: DailyLog;
  profile: UserProfile;
  onSave: (log: Partial<DailyLog>) => void;
  onCancel: () => void;
}

export function DayDetailsScreen({ date, existingLog, onSave, onCancel }: DayDetailsScreenProps) {
  const [transport, setTransport] = useState(existingLog?.transport || '');
  const [foodSource, setFoodSource] = useState(existingLog?.foodSource || '');
  const [foodDiet, setFoodDiet] = useState(existingLog?.foodDiet || '');
  const [delivery, setDelivery] = useState(existingLog?.delivery || '');
  const [energyLaptop, setEnergyLaptop] = useState(existingLog?.energyLaptop || '');
  const [energyAC, setEnergyAC] = useState(existingLog?.energyAC || '');
  const [shopping, setShopping] = useState(existingLog?.shopping || '');

  const handleSave = () => {
    const logData: Partial<DailyLog> = {
      date,
      transport: transport as DailyLog['transport'],
      foodSource: foodSource as DailyLog['foodSource'],
      foodDiet: foodDiet as DailyLog['foodDiet'],
      delivery: delivery as DailyLog['delivery'],
      energyLaptop: energyLaptop as DailyLog['energyLaptop'],
      energyAC: energyAC as DailyLog['energyAC'],
      shopping: shopping as DailyLog['shopping'],
      notes: existingLog?.notes || ''
    };

    onSave(logData);
  };

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const SelectionChip = ({ label, value, current, onChange }: { label: string, value: string, current: string, onChange: (v: string) => void }) => {
    const isSelected = current === value;
    return (
      <button
        onClick={() => onChange(isSelected ? '' : value)}
        className={`px-4 py-3 rounded-[16px] text-sm font-bold transition-all border focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
          isSelected 
            ? 'bg-white border-white text-[#1A2315] shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-[1.02]' 
            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 active:scale-95'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-details-title"
      className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[40px] overflow-y-auto no-scrollbar pointer-events-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-[420px] mx-auto min-h-[100dvh] flex flex-col p-5 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            ←
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">
              Daily Check-In
            </p>
            <h2 id="day-details-title" className="text-xl font-bold text-white drop-shadow-md">
              {displayDate}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Section 1: Transport */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-[24px] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">
              How did you mostly travel?
            </h3>
            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              <SelectionChip label="Walk" value="walk" current={transport} onChange={setTransport} />
              <SelectionChip label="Cycle" value="cycle" current={transport} onChange={setTransport} />
              <SelectionChip label="Bus" value="bus" current={transport} onChange={setTransport} />
              <SelectionChip label="Metro" value="metro" current={transport} onChange={setTransport} />
              <SelectionChip label="Auto" value="auto" current={transport} onChange={setTransport} />
              <SelectionChip label="Car / Cab" value="car" current={transport} onChange={setTransport} />
            </div>
          </div>

          {/* Section 2: Food Source & Diet */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-[24px] shadow-lg relative overflow-hidden">
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">Where did you eat?</h3>
            <div className="grid grid-cols-3 gap-2.5 mb-6 relative z-10">
              <SelectionChip label="Mess" value="mess" current={foodSource} onChange={setFoodSource} />
              <SelectionChip label="Home" value="home" current={foodSource} onChange={setFoodSource} />
              <SelectionChip label="Outside" value="outside" current={foodSource} onChange={setFoodSource} />
            </div>
            
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">What did you eat?</h3>
            <div className="grid grid-cols-3 gap-2.5 relative z-10">
              <SelectionChip label="Veg" value="veg" current={foodDiet} onChange={setFoodDiet} />
              <SelectionChip label="Mixed" value="mixed" current={foodDiet} onChange={setFoodDiet} />
              <SelectionChip label="Non-Veg" value="nonveg" current={foodDiet} onChange={setFoodDiet} />
            </div>
          </div>

          {/* Section 3: Delivery */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-[24px] shadow-lg relative overflow-hidden">
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">Did you order delivery?</h3>
            <div className="grid grid-cols-3 gap-2.5 relative z-10">
              <SelectionChip label="No" value="no" current={delivery} onChange={setDelivery} />
              <SelectionChip label="Once" value="once" current={delivery} onChange={setDelivery} />
              <SelectionChip label="Multiple" value="multiple" current={delivery} onChange={setDelivery} />
            </div>
          </div>

          {/* Section 4: Energy */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-[24px] shadow-lg relative overflow-hidden">
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">Approx. laptop usage?</h3>
            <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10">
              <SelectionChip label="< 2 hours" value="<2h" current={energyLaptop} onChange={setEnergyLaptop} />
              <SelectionChip label="2 - 4 hours" value="2-4h" current={energyLaptop} onChange={setEnergyLaptop} />
              <SelectionChip label="4 - 8 hours" value="4-8h" current={energyLaptop} onChange={setEnergyLaptop} />
              <SelectionChip label="8+ hours" value="8+h" current={energyLaptop} onChange={setEnergyLaptop} />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">AC usage?</h3>
            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              <SelectionChip label="None" value="none" current={energyAC} onChange={setEnergyAC} />
              <SelectionChip label="< 2 hours" value="<2h" current={energyAC} onChange={setEnergyAC} />
              <SelectionChip label="2 - 6 hours" value="2-6h" current={energyAC} onChange={setEnergyAC} />
              <SelectionChip label="6+ hours" value="6+h" current={energyAC} onChange={setEnergyAC} />
            </div>
          </div>

          {/* Section 5: Shopping */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-[24px] shadow-lg relative overflow-hidden">
            <h3 className="text-[15px] font-bold text-white mb-4 drop-shadow-md">Did you purchase anything?</h3>
            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              <SelectionChip label="No" value="no" current={shopping} onChange={setShopping} />
              <SelectionChip label="Small" value="small" current={shopping} onChange={setShopping} />
              <SelectionChip label="Medium" value="medium" current={shopping} onChange={setShopping} />
              <SelectionChip label="Large" value="large" current={shopping} onChange={setShopping} />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleSave}
            disabled={!transport && !foodSource && !foodDiet && !delivery && !energyAC && !shopping}
            className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-[20px] font-bold text-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            Complete Check-In
          </button>
        </div>
      </div>
    </motion.div>
  );
}
