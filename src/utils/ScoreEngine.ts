import { DailyLog, UserProfile } from '../types';

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

export const calculateDailyScore = (log: Partial<DailyLog>): number => {
  // Transport (35%)
  let tScore = 100;
  switch (log.transport) {
    case 'walk': case 'cycle': case 'none': tScore = 100; break;
    case 'bus': case 'metro': tScore = 85; break;
    case 'auto': tScore = 65; break;
    case 'car': case 'cab': tScore = 35; break;
  }

  // Food (25%)
  let fScore = 100;
  switch (log.food) {
    case 'mess': case 'home': case 'veg': case 'none': fScore = 100; break;
    case 'mixed': fScore = 75; break;
    case 'nonveg': fScore = 40; break;
  }

  // Delivery (10%)
  let dScore = 100;
  switch (log.delivery) {
    case 'no': dScore = 100; break;
    case 'once': dScore = 60; break;
    case 'multiple': dScore = 20; break;
  }

  // Shopping (10%)
  let sScore = 100;
  switch (log.shopping) {
    case 'no': sScore = 100; break;
    case 'small': sScore = 80; break;
    case 'medium': sScore = 50; break;
    case 'large': sScore = 20; break;
  }

  // Energy - Laptop (10%)
  let elScore = 100;
  switch (log.energyLaptop) {
    case '<2h': case 'none': elScore = 100; break;
    case '2-4h': elScore = 80; break;
    case '4-8h': elScore = 60; break;
    case '8+h': elScore = 40; break;
  }

  // Energy - AC (10%)
  let eaScore = 100;
  switch (log.energyAC) {
    case 'none': eaScore = 100; break;
    case '<2h': eaScore = 80; break;
    case '2-6h': eaScore = 50; break;
    case '6+h': eaScore = 20; break;
  }

  return Math.round(
    (tScore * 0.35) +
    (fScore * 0.25) +
    (dScore * 0.10) +
    (sScore * 0.10) +
    (elScore * 0.10) +
    (eaScore * 0.10)
  );
};

export interface DerivedScoreState {
  score: number;
  streak: number;
}

export const calculateHistoricalScore = (profile: UserProfile, logs: Record<string, DailyLog>): DerivedScoreState => {
  const dates = Object.keys(logs).sort();
  let streak = 0;
  let lastLoggedDate: Date | null = null;
  const last30Scores: number[] = [];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  for (const dateStr of dates) {
    const log = logs[dateStr];
    const logDate = new Date(dateStr);

    // Apply Streak logic
    if (lastLoggedDate) {
      const daysDiff = Math.floor((logDate.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
      if (daysDiff > 1 && streak > 0) {
        streak = 0;
      }
    }
    streak += 1;
    lastLoggedDate = logDate;

    // We rely on log.dailyScore, or calculate it on the fly if missing (e.g. migration hasn't fired yet)
    const dayScore = log.dailyScore !== undefined ? log.dailyScore : calculateDailyScore(log);
    
    // Only include in 30-day average if it's within 30 days
    if (logDate >= thirtyDaysAgo) {
      last30Scores.push(dayScore);
    }
  }

  // Final streak check against today
  if (lastLoggedDate) {
    const d1 = new Date(todayStr);
    const daysDiff = Math.floor((d1.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
    if (daysDiff > 1 && streak > 0) {
      streak = 0;
    }
  }

  let finalScore = calculateBaseScore(profile);
  if (last30Scores.length > 0) {
    const sum = last30Scores.reduce((a, b) => a + b, 0);
    finalScore = Math.round(sum / last30Scores.length);
  }

  return { score: finalScore, streak };
};
