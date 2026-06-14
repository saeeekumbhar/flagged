import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyLog } from '../types';
import { 
  TRANSPORT_SCORES, 
  FOOD_SOURCE_SCORES, 
  FOOD_DIET_SCORES, 
  LEGACY_FOOD_SCORES, 
  SHOPPING_SCORES, 
  ENERGY_LAPTOP_SCORES, 
  ENERGY_AC_SCORES 
} from '../utils/EmissionFactors';

interface CarbonBreakdownCardProps {
  logs: Record<string, DailyLog>;
}

export function CarbonBreakdownCard({ logs }: CarbonBreakdownCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const dates = Object.keys(logs).sort().reverse();
  const latestLogDate = dates[0];
  const latestLog = latestLogDate ? logs[latestLogDate] : null;

  if (!latestLog) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }}
        className="premium-glass rounded-[32px] p-6 text-center"
      >
        <div className="text-3xl mb-3">🌱</div>
        <p className="text-[15px] font-bold text-[#4C3D19]">
          Complete your first check-in to see your carbon breakdown!
        </p>
      </motion.div>
    );
  }

  // Calculate Sub-scores and Reasons
  
  // Transport
  const tScore = latestLog.transport && TRANSPORT_SCORES[latestLog.transport] !== undefined 
    ? TRANSPORT_SCORES[latestLog.transport] : 100;
  let tImpact = tScore >= 80 ? 'Low carbon impact' : tScore >= 50 ? 'Medium carbon impact' : 'High carbon impact';
  let tReason = "No transport recorded.";
  if (latestLog.transport === 'walk' || latestLog.transport === 'cycle') tReason = "Walking or cycling produces zero emissions. Great job!";
  else if (latestLog.transport === 'metro' || latestLog.transport === 'bus') tReason = "Public transit significantly reduces per-passenger emissions.";
  else if (latestLog.transport === 'car' || latestLog.transport === 'cab') tReason = "Private vehicles have a high carbon footprint. Consider carpooling or public transit.";

  // Food
  let fScore = 100;
  let fReason = "No food recorded.";
  if (latestLog.foodSource || latestLog.foodDiet) {
    const sScore = latestLog.foodSource && FOOD_SOURCE_SCORES[latestLog.foodSource] !== undefined ? FOOD_SOURCE_SCORES[latestLog.foodSource] : 100;
    const dScore = latestLog.foodDiet && FOOD_DIET_SCORES[latestLog.foodDiet] !== undefined ? FOOD_DIET_SCORES[latestLog.foodDiet] : 100;
    fScore = (sScore + dScore) / 2;
    if (fScore >= 80) fReason = "Home-cooked and plant-based meals are excellent for the environment.";
    else if (fScore >= 50) fReason = "Eating out or mixed diets have a moderate environmental cost.";
    else fReason = "Heavy meat consumption and dining out frequently increase your footprint.";
  } else if (latestLog.food && LEGACY_FOOD_SCORES[latestLog.food] !== undefined) {
    fScore = LEGACY_FOOD_SCORES[latestLog.food];
    fReason = fScore > 70 ? "Your food choices were sustainable today." : "Your food choices had a higher footprint today.";
  }
  let fImpact = fScore >= 80 ? 'Low carbon impact' : fScore >= 50 ? 'Medium carbon impact' : 'High carbon impact';

  // Energy (Combining AC and Laptop)
  const elScore = latestLog.energyLaptop && ENERGY_LAPTOP_SCORES[latestLog.energyLaptop] !== undefined ? ENERGY_LAPTOP_SCORES[latestLog.energyLaptop] : 100;
  const eaScore = latestLog.energyAC && ENERGY_AC_SCORES[latestLog.energyAC] !== undefined ? ENERGY_AC_SCORES[latestLog.energyAC] : 100;
  const eScore = (elScore + eaScore) / 2;
  let eImpact = eScore >= 80 ? 'Low carbon impact' : eScore >= 50 ? 'Medium carbon impact' : 'High carbon impact';
  let eReason = "";
  if (eaScore < 50) eReason = "High AC usage uses significant electricity. ";
  else if (eaScore < 100) eReason = "Moderate AC usage. ";
  else eReason = "No AC used! ";
  
  if (elScore < 50) eReason += "Long screen time also adds to your digital footprint.";
  else eReason += "Good job keeping screen time manageable.";

  // Shopping
  const sScore = latestLog.shopping && SHOPPING_SCORES[latestLog.shopping] !== undefined ? SHOPPING_SCORES[latestLog.shopping] : 100;
  let sImpact = sScore >= 80 ? 'Low carbon impact' : sScore >= 50 ? 'Medium carbon impact' : 'High carbon impact';
  let sReason = "No major shopping recorded.";
  if (latestLog.shopping === 'large') sReason = "Large purchases (especially fast fashion/electronics) carry a heavy carbon cost in manufacturing and shipping.";
  else if (latestLog.shopping === 'medium') sReason = "Moderate shopping. Consider if items are necessities or can be bought second-hand.";
  else if (latestLog.shopping === 'small') sReason = "Small purchases have minimal impact.";

  const categories = [
    { id: 'transport', icon: '🚗', title: 'Transport', score: tScore, impact: tImpact, reason: tReason },
    { id: 'food', icon: '🍽️', title: 'Food', score: fScore, impact: fImpact, reason: fReason },
    { id: 'energy', icon: '⚡', title: 'Energy', score: eScore, impact: eImpact, reason: eReason },
    { id: 'shopping', icon: '🛒', title: 'Shopping', score: sScore, impact: sImpact, reason: sReason },
  ];

  return (
    <motion.div 
      className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E5D7C4]"
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl drop-shadow-sm">🌱</span>
        <h3 className="text-[16px] font-bold text-[#1A2315] tracking-wide">Your Impact Breakdown</h3>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#F4F1EC] rounded-2xl p-4 transition-colors hover:bg-[#EAE4DF]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{cat.icon}</div>
                <div>
                  <div className="font-bold text-[#1A2315]">{cat.title}</div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${cat.score >= 80 ? 'text-[#5A8F5A]' : cat.score >= 50 ? 'text-[#D6A066]' : 'text-[#D4614A]'}`}>
                    {cat.impact}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-[#1A2315]">{Math.round(cat.score)}<span className="text-xs text-[#889063]">/100</span></div>
              </div>
            </div>

            <div className="mt-3">
              <button 
                onClick={() => setExpandedSection(expandedSection === cat.id ? null : cat.id)}
                className="text-[12px] font-bold text-[#889063] uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
              >
                Why this score? 
                <span className="transform transition-transform" style={{ rotate: expandedSection === cat.id ? '180deg' : '0deg' }}>↓</span>
              </button>
              
              <AnimatePresence>
                {expandedSection === cat.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/60 rounded-xl p-3 text-[13px] font-medium text-[#4C3D19] leading-snug border border-[#CFBB99]/30">
                      {cat.reason}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 text-center">
        <p className="text-[11px] font-bold text-[#889063] uppercase tracking-widest">Based on your latest log</p>
      </div>
    </motion.div>
  );
}
