import { describe, it, expect } from 'vitest';
import { calculateDailyScore, calculateFlagScore, calculateTrend } from '../src/utils/ScoreEngine';

describe('ScoreEngine', () => {
  it('validates empty state safely computes neutral scores', () => {
    // Empty state: Ensure the engine safely defaults to neutral metrics without crashing
    const score = calculateDailyScore({});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('validates normal inputs handle scoring logic', () => {
    // Normal inputs: walking should give a fundamentally higher score than a fossil-fuel car
    const walkScore = calculateDailyScore({ transport: 'walk' });
    const carScore = calculateDailyScore({ transport: 'car' });
    expect(walkScore).toBeGreaterThan(carScore);
  });

  it('validates empty state for flag calculation', () => {
    // Empty state: Flag score calculation defaults to exactly 50 when no data exists
    const score = calculateFlagScore({});
    expect(score).toBe(50); // Default fallback
  });

  it('validates normal inputs for flag calculation', () => {
    // Normal inputs: Flag score reflects a single log correctly
    const logs = {
      '2024-01-01': { date: '2024-01-01', transport: 'walk' as any, dailyScore: 95, totalCarbonEstimate: 0, notes: '' }
    };
    const score = calculateFlagScore(logs);
    expect(score).toBe(95);
  });

  it('validates edge cases: missing timestamps or corrupt dates return safe fallbacks', () => {
    // Invalid/missing data: passing corrupt logs with no dailyScore should fallback safely
    const corruptLogs = {
      'invalid-date': { date: 'wtf', transport: 'walk' as any, totalCarbonEstimate: 0, notes: '' }
    };
    const score = calculateFlagScore(corruptLogs);
    // Should safely fallback because dailyScore is missing
    expect(score).toBe(50);
  });

  it('validates empty state trend calculation', () => {
    // Empty state: Streaks start at exactly 0
    const { streak, bestStreak } = calculateTrend({});
    expect(streak).toBe(0);
    expect(bestStreak).toBe(0);
  });

  it('validates normal inputs: contiguous streak counting', () => {
    // Normal inputs: contiguous dates increment the streak linearly
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

  it('validates edge cases: streak reset mechanics', () => {
    // Edge case: A single missed day entirely resets the current streak, but preserves bestStreak
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

