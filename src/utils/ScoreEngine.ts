import { DailyLog, UserProfile } from '../types';

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
  if (log.foodSource || log.foodDiet) {
    let sourceScore = 100;
    if (log.foodSource === 'outside') sourceScore = 50;
    
    let dietScore = 100;
    if (log.foodDiet === 'mixed') dietScore = 75;
    if (log.foodDiet === 'nonveg') dietScore = 40;
    
    fScore = (sourceScore + dietScore) / 2;
  } else if (log.food) {
    switch (log.food) {
      case 'mess': case 'home': case 'veg': case 'none': fScore = 100; break;
      case 'mixed': fScore = 75; break;
      case 'nonveg': fScore = 40; break;
    }
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

export const calculateFlagScore = (logs: Record<string, DailyLog>): number => {
  const dates = Object.keys(logs).sort();
  if (dates.length === 0) return 50;

  const today = new Date();
  today.setHours(0,0,0,0);
  
  let recent7Sum = 0;
  let recent7Count = 0;
  
  let recent30Sum = 0;
  let recent30Count = 0;
  
  let olderSum = 0;
  let olderCount = 0;

  for (const dateStr of dates) {
    const log = logs[dateStr];
    const logDate = new Date(dateStr);
    logDate.setHours(0,0,0,0);
    const dayScore = log.dailyScore !== undefined ? log.dailyScore : calculateDailyScore(log);
    
    const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 7) {
      recent7Sum += dayScore;
      recent7Count += 1;
    }
    if (daysDiff <= 30) {
      recent30Sum += dayScore;
      recent30Count += 1;
    }
    if (daysDiff > 30) {
      olderSum += dayScore;
      olderCount += 1;
    }
  }

  const recent7Avg = recent7Count > 0 ? recent7Sum / recent7Count : 0;
  const recent30Avg = recent30Count > 0 ? recent30Sum / recent30Count : 0;
  const olderAvg = olderCount > 0 ? olderSum / olderCount : 50; // Fallback to 50 if no older history

  let w7 = 0.5;
  let w30 = 0.4;
  let wOlder = 0.1;

  let totalWeight = 0;
  let finalScore = 0;
  
  if (recent7Count > 0) { totalWeight += w7; finalScore += recent7Avg * w7; }
  if (recent30Count > 0) { totalWeight += w30; finalScore += recent30Avg * w30; }
  if (olderCount > 0) { 
    totalWeight += wOlder; finalScore += olderAvg * wOlder; 
  } else if (totalWeight < 1) {
    totalWeight += wOlder; finalScore += olderAvg * wOlder;
  }

  return totalWeight > 0 ? Math.max(0, Math.min(100, Math.round(finalScore / totalWeight))) : 50;
};

export const calculateTrend = (logs: Record<string, DailyLog>): { streak: number, bestStreak: number } => {
  const dates = Object.keys(logs).sort();
  let streak = 0;
  let bestStreak = 0;
  let lastLoggedDate: Date | null = null;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (const dateStr of dates) {
    const logDate = new Date(dateStr);
    if (lastLoggedDate) {
      const daysDiff = Math.floor((logDate.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
      if (daysDiff > 1 && streak > 0) {
        if (streak > bestStreak) bestStreak = streak;
        streak = 0;
      }
    }
    streak += 1;
    if (streak > bestStreak) bestStreak = streak;
    lastLoggedDate = logDate;
  }

  if (lastLoggedDate) {
    const d1 = new Date(todayStr);
    const daysDiff = Math.floor((d1.getTime() - lastLoggedDate.getTime()) / (1000 * 3600 * 24));
    if (daysDiff > 1 && streak > 0) {
       if (streak > bestStreak) bestStreak = streak;
       streak = 0;
    }
  }

  return { streak, bestStreak };
};
