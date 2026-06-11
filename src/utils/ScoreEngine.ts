import { DailyLog, UserProfile } from '../types';
import { calculateDailyFlagImpact } from './CarbonEngine';

export const calculateBaseScore = (profile: Partial<UserProfile>): number => {
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
  return Math.max(0, Math.min(100, score));
};

export interface DerivedScoreState {
  score: number;
  streak: number;
}

export const calculateHistoricalScore = (profile: UserProfile, logs: Record<string, DailyLog>): DerivedScoreState => {
  let score = calculateBaseScore(profile);
  let streak = 0;

  const dates = Object.keys(logs).sort();
  let lastLoggedDate: Date | null = null;

  for (const dateStr of dates) {
    const log = logs[dateStr];
    const logDate = new Date(dateStr);

    // Apply Decay before the log is counted
    if (lastLoggedDate) {
      const daysDiff = Math.floor((logDate.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
      
      // Streak breaks if gap is > 1 day
      if (daysDiff > 1 && streak > 0) {
        streak = 0;
      }
      
      // Decay starts after 3 missed days
      if (daysDiff > 3) {
        const decay = daysDiff - 3;
        if (score > 50) score = Math.max(50, score - decay);
        else if (score < 50) score = Math.min(50, score + decay);
      }
    }

    streak += 1;

    let impact = calculateDailyFlagImpact(log);
    
    // Comeback Multiplier: 1.5x points if in Red Flag Era
    if (score <= 40 && impact > 0) {
      impact = Math.ceil(impact * 1.5);
    }
    
    score = Math.max(0, Math.min(100, score + impact));
    lastLoggedDate = logDate;
  }

  // Final decay check against today
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (lastLoggedDate) {
    const d1 = new Date(todayStr);
    const daysDiff = Math.floor((d1.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff > 1 && streak > 0) {
      streak = 0;
    }
    
    if (daysDiff > 3) {
      const decay = daysDiff - 3;
      if (score > 50) score = Math.max(50, score - decay);
      else if (score < 50) score = Math.min(50, score + decay);
    }
  }

  return { score, streak };
};
