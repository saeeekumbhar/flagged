import { DailyLog, UserProfile } from '../types';

export interface FlagDNA {
  scores: {
    transport: number; // 0 to 5
    food: number;
    energy: number;
    shopping: number;
    community: number;
  };
  primaryTrait: string;
  description: string;
}

export function calculateFlagDNA(logs: Record<string, DailyLog>): FlagDNA {
  let transportScore = 2; // Base 2
  let foodScore = 2;
  let energyScore = 2;
  let shoppingScore = 2;
  let communityScore = 2;

  Object.values(logs).forEach(log => {
    // Transport Trait
    if (log.transport === 'walk' || log.transport === 'cycle' || log.transport === 'bus') transportScore += 0.5;
    if (log.transport === 'car' || log.transport === 'cab') transportScore -= 0.5;
    
    // Food Trait
    if (log.food === 'home' || log.food === 'mess' || log.food === 'veg') foodScore += 0.5;
    if (log.food === 'nonveg' || log.food === 'mixed') foodScore -= 0.5;
    
    // Energy Trait
    if (log.energyAC === 'none' && (log.energyLaptop === 'none' || log.energyLaptop === '<2h')) energyScore += 0.5;
    if (log.energyAC === '6+h' || log.energyLaptop === '8+h') energyScore -= 0.5;
    
    // Shopping Trait
    if (log.shopping === 'no' || log.shopping === 'small') shoppingScore += 0.5;
    if (log.shopping === 'large') shoppingScore -= 0.5;
  });

  // Clamp 1-5 and round
  const clamp = (val: number) => Math.max(1, Math.min(5, Math.round(val)));
  
  const scores = {
    transport: clamp(transportScore),
    food: clamp(foodScore),
    energy: clamp(energyScore),
    shopping: clamp(shoppingScore),
    community: clamp(communityScore + Object.keys(logs).length * 0.1), // small passive community boost for logging
  };

  // Determine Primary Trait
  const categories = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const bestCategory = categories[0][0];
  const bestScore = categories[0][1];

  let primaryTrait = "Eco Explorer";
  let description = "You're exploring various ways to reduce your footprint.";

  if (bestScore >= 4) {
    if (bestCategory === 'transport') {
      primaryTrait = "Conscious Commuter";
      description = "Your transport habits are carrying your Green Flag Era.";
    } else if (bestCategory === 'food') {
      primaryTrait = "Mess Hall Hero";
      description = "Eating local and saving the planet, one plate at a time.";
    } else if (bestCategory === 'energy') {
      primaryTrait = "Energy Saver";
      description = "You keep the AC off and the planet cool.";
    } else if (bestCategory === 'shopping') {
      primaryTrait = "Thrift Legend";
      description = "Fast fashion? Never heard of her.";
    } else if (bestCategory === 'community') {
      primaryTrait = "Community Builder";
      description = "You inspire others with consistent small actions.";
    }
  } else if (bestScore < 3) {
    primaryTrait = "Low-Key Green";
    description = "You're starting out, and every small step counts.";
  }

  return { scores, primaryTrait, description };
}

export interface GlowUpStats {
  co2AvoidedKg: number;
  treesEquivalent: number;
  moneySaved: number;
  greenFlagsCompleted: number;
  daysLogged: number;
  bestStreak: number;
}

export function calculateGlowUp(logs: Record<string, DailyLog>, profile: UserProfile): GlowUpStats {
  let greenFlagsCompleted = 0;
  let co2AvoidedKg = 0;
  let moneySaved = 0;
  
  const baselineCarCO2 = 5; // Assumed baseline emissions without app
  const baselineFoodCO2 = 3; 

  Object.values(logs).forEach(log => {
    // Determine if day was generally green (Score >= 70)
    if (log.dailyScore && log.dailyScore >= 70) {
      greenFlagsCompleted += 1;
    }

    if (log.transport === 'walk' || log.transport === 'cycle' || log.transport === 'bus' || log.transport === 'metro') {
      co2AvoidedKg += baselineCarCO2;
      moneySaved += 50; // ~₹50 saved vs cab
    }
    if (log.food === 'home' || log.food === 'mess' || log.food === 'veg') {
      co2AvoidedKg += baselineFoodCO2;
      moneySaved += 150; // ~₹150 saved vs delivery
    }
    if (log.shopping === 'no') {
      moneySaved += 500; // Simulating not buying fast fashion
    }
  });

  const daysLogged = Object.keys(logs).length;
  // A mature tree absorbs ~21kg CO2 a year.
  const treesEquivalent = Math.floor(co2AvoidedKg / 21) || parseFloat((co2AvoidedKg / 21).toFixed(1));

  return {
    co2AvoidedKg: Math.round(co2AvoidedKg),
    treesEquivalent,
    moneySaved: Math.round(moneySaved),
    greenFlagsCompleted,
    daysLogged,
    bestStreak: profile.bestStreak
  };
}

export interface WeeklyRoast {
  roast: string;
  realityCheck: string;
  oneFix: string;
  oneWin: string;
}

export function generateWeeklyRoast(logs: Record<string, DailyLog>): WeeklyRoast | null {
  const recentLogs = Object.values(logs)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  if (recentLogs.length === 0) return null;

  let deliveries = 0;
  let cabs = 0;
  let ac = 0;
  let walks = 0;
  let homeFood = 0;

  recentLogs.forEach(log => {
    if (log.delivery === 'once' || log.delivery === 'multiple') deliveries++;
    if (log.transport === 'cab' || log.transport === 'car') cabs++;
    if (log.energyAC === '6+h' || log.energyAC === '2-6h') ac++;
    if (log.transport === 'walk' || log.transport === 'cycle') walks++;
    if (log.food === 'home' || log.food === 'mess') homeFood++;
  });

  let roast = "You've been too perfect lately, no roast for you.";
  let realityCheck = "Keep it up!";
  let oneFix = "Try a new challenge.";
  let oneWin = "You logged your daily check-ins.";

  const maxRed = Math.max(deliveries, cabs, ac);

  if (maxRed > 0) {
    if (deliveries === maxRed) {
      roast = "Bestie, the delivery app is starting to think you're family.";
      realityCheck = `You ordered food ${deliveries} times. That plastic packaging adds up!`;
      oneFix = "Swap one delivery this week and gain 3 Flag points.";
    } else if (cabs === maxRed) {
      roast = "That cab streak is getting suspicious.";
      realityCheck = `You took cabs ${cabs} times. Your legs still work, right?`;
      oneFix = "Try public transport once this week.";
    } else if (ac === maxRed) {
      roast = "Your AC had a busier social life than you this week.";
      realityCheck = `Heavy AC use ${ac} times. The polar bears are side-eyeing you.`;
      oneFix = "Turn the AC off 30 mins before leaving the room.";
    }
  }

  const maxGreen = Math.max(walks, homeFood);
  if (walks > 0 && walks === maxGreen) {
    oneWin = `You walked or cycled ${walks} times. Huge green flag!`;
  } else if (homeFood > 0) {
    oneWin = `You ate mess/home food ${homeFood} times. Healthy wallet, healthy planet.`;
  }

  return { roast, realityCheck, oneFix, oneWin };
}

export interface FlagForecast {
  prediction: string;
  opportunity: string;
  suggestedChallenge: string;
}

export function generateFlagForecast(logs: Record<string, DailyLog>, profile: UserProfile): FlagForecast {
  const logValues = Object.values(logs);
  
  // Basic forecast logic
  let prediction = "This week looks balanced.";
  let opportunity = `You are ${profile.flagScore < 91 ? (91 - profile.flagScore) : 0} points away from the Green Flag Era.`;
  let suggestedChallenge = "Log 3 green choices today.";

  if (profile.streak >= 3) {
    prediction = "You're on a hot streak! Transport looks strong.";
    opportunity = "Keep the momentum to reach a new best streak.";
  } else if (logValues.length > 0 && logValues[logValues.length - 1].dailyScore !== undefined && logValues[logValues.length - 1].dailyScore! < 40) {
    prediction = "Food delivery might be your biggest red flag this week.";
    opportunity = "One home-cooked meal could unlock your next milestone.";
    suggestedChallenge = "Eat a green meal";
  } else {
    prediction = "A fresh week means a fresh start.";
    opportunity = "Log one walk today to secure an easy Green Flag.";
    suggestedChallenge = "Use public transport or walk";
  }

  return { prediction, opportunity, suggestedChallenge };
}
