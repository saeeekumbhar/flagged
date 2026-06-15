import { describe, it, expect } from 'vitest';
import { calculateDailyScore, calculateFlagScore, calculateTrend } from '../src/utils/ScoreEngine';

describe('ScoreEngine', () => {
  it('does not crash with an empty log', () => {
    const score = calculateDailyScore({});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('walking gives a higher score than driving a car', () => {
    const walkScore = calculateDailyScore({ transport: 'walk' });
    const carScore = calculateDailyScore({ transport: 'car' });
    expect(walkScore).toBeGreaterThan(carScore);
  });

  it('calculateFlagScore does not crash with empty logs object', () => {
    const score = calculateFlagScore({});
    expect(score).toBe(50); // Default fallback
  });

  it('calculateFlagScore processes single log correctly', () => {
    const logs = {
      '2024-01-01': { date: '2024-01-01', transport: 'walk' as any, dailyScore: 95, totalCarbonEstimate: 0, notes: '' }
    };
    const score = calculateFlagScore(logs);
    expect(score).toBe(95);
  });

  it('calculateTrend handles empty logs correctly', () => {
    const { streak, bestStreak } = calculateTrend({});
    expect(streak).toBe(0);
    expect(bestStreak).toBe(0);
  });

  it('calculateTrend calculates a streak of 3 correctly', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const twoDaysAgo = new Date(today.getTime() - 86400000 * 2);
    
    const d1 = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d2 = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const d3 = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(twoDaysAgo.getDate()).padStart(2, '0')}`;

    const logs = {
      [d1]: { date: d1, totalCarbonEstimate: 0, notes: '' },
      [d2]: { date: d2, totalCarbonEstimate: 0, notes: '' },
      [d3]: { date: d3, totalCarbonEstimate: 0, notes: '' }
    };

    const { streak, bestStreak } = calculateTrend(logs);
    expect(streak).toBe(3);
    expect(bestStreak).toBe(3);
  });

  it('calculateTrend resets streak on missed day', () => {
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 86400000 * 3);
    const fourDaysAgo = new Date(today.getTime() - 86400000 * 4);
    
    const d1 = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d3 = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(threeDaysAgo.getDate()).padStart(2, '0')}`;
    const d4 = `${fourDaysAgo.getFullYear()}-${String(fourDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(fourDaysAgo.getDate()).padStart(2, '0')}`;

    const logs = {
      [d1]: { date: d1, totalCarbonEstimate: 0, notes: '' },
      [d3]: { date: d3, totalCarbonEstimate: 0, notes: '' },
      [d4]: { date: d4, totalCarbonEstimate: 0, notes: '' }
    };

    const { streak, bestStreak } = calculateTrend(logs);
    expect(streak).toBe(1);
    expect(bestStreak).toBe(2);
  });
});
