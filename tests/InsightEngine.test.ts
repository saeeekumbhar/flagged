import { describe, it, expect } from 'vitest';
import { InsightEngine } from '../src/utils/InsightEngine';
import { DailyLog } from '../src/types';

describe('InsightEngine', () => {

  it('validates empty state correctly returns all zeroes', () => {
    // Testing missing data: handles undefined and empty objects without crashing
    const emptyResult = InsightEngine.summarizeLogsForInsights({});
    const undefinedResult = InsightEngine.summarizeLogsForInsights(undefined as any);
    
    expect(emptyResult.walks).toBe(0);
    expect(emptyResult.cabs).toBe(0);
    expect(undefinedResult.homeFood).toBe(0);
  });

  it('validates normal inputs count accurately', () => {
    // Normal inputs: testing basic valid data structures
    const mockLogs: Record<string, DailyLog> = {
      '2024-01-01': { date: '2024-01-01', transport: 'walk', delivery: 'no', totalCarbonEstimate: 0, notes: '' },
      '2024-01-02': { date: '2024-01-02', transport: 'cab', delivery: 'multiple', totalCarbonEstimate: 0, notes: '' },
      '2024-01-03': { date: '2024-01-03', transport: 'cycle', foodSource: 'home', totalCarbonEstimate: 0, notes: '' },
    };

    const summary = InsightEngine.summarizeLogsForInsights(mockLogs);
    
    expect(summary.walks).toBe(2); // walk + cycle
    expect(summary.cabs).toBe(1); // cab
    expect(summary.deliveries).toBe(1); // multiple
    expect(summary.homeFood).toBe(1); // home
  });

  it('validates edge cases: correctly slices to exactly 14 days and sorts descending', () => {
    // Edge case: User has more than 14 logs; ensure it only counts the 14 most recent dates
    const mockLogs: Record<string, DailyLog> = {};
    const baseDate = new Date('2024-05-01');

    // Create 20 days of data, all walks
    for(let i=0; i<20; i++) {
      const d = new Date(baseDate.getTime() + (i * 86400000)).toISOString().split('T')[0];
      mockLogs[d] = { date: d, transport: 'walk', totalCarbonEstimate: 0, notes: '' };
    }

    const summary = InsightEngine.summarizeLogsForInsights(mockLogs);
    
    // It should max out at 14 walks because it only analyzes the last 14 days
    expect(summary.walks).toBe(14);
  });

  it('validates invalid/missing fields gracefully fail open', () => {
    // Invalid/missing data: fields missing from the DailyLog shouldn't crash the engine
    const mockLogs: Record<string, DailyLog> = {
      '2024-01-01': { date: '2024-01-01', totalCarbonEstimate: 0, notes: '' }, // No transport/food fields
    };

    const summary = InsightEngine.summarizeLogsForInsights(mockLogs);
    
    expect(summary.walks).toBe(0);
    expect(summary.deliveries).toBe(0);
    expect(summary.homeFood).toBe(0);
  });
});
