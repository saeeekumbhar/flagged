import { describe, it, expect } from 'vitest';
import { calculateDailyEmissions } from '../src/services/CarbonService';
import { calculateFlagScore, calculateTrend } from '../src/utils/ScoreEngine';
import { InsightEngine } from '../src/utils/InsightEngine';
import { DailyLog } from '../src/types';

describe('100% Coverage Edge Cases', () => {
  it('covers CarbonService shopping branch', () => {
    const emissions = calculateDailyEmissions({ shopping: 'medium' } as Partial<DailyLog>);
    expect(emissions).toBeGreaterThan(0);
  });

  it('covers ScoreEngine recent30 branch', () => {
    const today = new Date();
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15);
    
    const logs = {
      [fifteenDaysAgo.toISOString().split('T')[0]]: { dailyScore: 80 } as DailyLog
    };
    
    const score = calculateFlagScore(logs);
    expect(score).toBeGreaterThan(0);
  });

  it('covers ScoreEngine broken streak today branch', () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const logs = {
      [threeDaysAgo.toISOString().split('T')[0]]: { dailyScore: 80 } as DailyLog
    };
    
    const trend = calculateTrend(logs);
    expect(trend.streak).toBe(0); // Streak broken
    expect(trend.bestStreak).toBe(1);
  });

  it('covers ScoreEngine laptop/ac and recent7 branch', () => {
    const today = new Date();
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(today.getDate() - 4);
    
    // Test laptop/ac paths inside calculateDailyScore
    const log = { energyLaptop: '<2h', energyAC: 'none', dailyScore: 80 } as DailyLog;
    
    const logs = {
      [fourDaysAgo.toISOString().split('T')[0]]: log
    };
    
    const score = calculateFlagScore(logs);
    expect(score).toBeGreaterThan(0);
    
    // specifically test the calculateDailyScore for these branches
    const daily = calculateFlagScore({ '2024-01-01': { energyLaptop: '<2h', energyAC: 'none' } as DailyLog });
    expect(daily).toBeGreaterThan(0);
    
    // Add food, delivery, and shopping
    const complexLog = {
      foodSource: 'home',
      foodDiet: 'veg',
      delivery: 'once',
      shopping: 'small',
      food: 'home'
    } as Partial<DailyLog>;
    
    // Test calculateDailyScore indirectly by passing to calculateFlagScore
    const complexScore = calculateFlagScore({ '2024-01-01': complexLog as DailyLog });
    expect(complexScore).toBeGreaterThan(0);
    
    // legacy food fallback
    const legacyScore = calculateFlagScore({ '2024-01-01': { food: 'home' } as DailyLog });
    expect(legacyScore).toBeGreaterThan(0);
  });

  it('covers InsightEngine acHeavy 2-6h branch', () => {
    const logs = {
      '2024-01-01': { date: '2024-01-01', energyAC: '2-6h' } as DailyLog
    };
    const summary = InsightEngine.summarizeLogsForInsights(logs);
    expect(summary.acHeavy).toBe(1);
  });
});
