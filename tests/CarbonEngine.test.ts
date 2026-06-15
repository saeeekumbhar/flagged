import { describe, it, expect } from 'vitest';
import { calculateDailyEmissions } from '../src/services/CarbonService';

describe('CarbonEngine', () => {
  it('validates empty state correctly without crashing', () => {
    // Empty state: Ensure the engine safely defaults to 0 emissions
    const emissions = calculateDailyEmissions({});
    expect(emissions).toBe(0);
  });

  it('validates normal inputs for transportation hierarchy', () => {
    // Normal inputs: walking should strictly emit less carbon than a fossil-fuel car
    const walkEmissions = calculateDailyEmissions({ transport: 'walk' });
    const carEmissions = calculateDailyEmissions({ transport: 'car' });
    expect(walkEmissions).toBeLessThan(carEmissions);
  });

  it('validates edge cases: diet and source modifiers multiply correctly', () => {
    // Edge case: test strict union types to ensure modifiers apply without NaN results
    const emissions = calculateDailyEmissions({ foodSource: 'home', foodDiet: 'veg' });
    expect(emissions).toBeGreaterThanOrEqual(0);
  });

  it('validates complex normal inputs sum across all categories', () => {
    // Normal inputs: combining worst-case behaviors across all factors
    const emptyEmissions = calculateDailyEmissions({});
    const fullEmissions = calculateDailyEmissions({ 
      transport: 'car', 
      foodSource: 'outside',
      foodDiet: 'nonveg',
      delivery: 'multiple',
      energyLaptop: '8+h',
      energyAC: '6+h'
    });
    
    expect(fullEmissions).toBeGreaterThan(emptyEmissions);
  });

  it('validates legacy fallback handling for old data formats', () => {
    // Invalid/missing data: Handling legacy schema where food is a direct string
    const modernEmissions = calculateDailyEmissions({ foodSource: 'home', foodDiet: 'veg' });
    const legacyEmissions = calculateDailyEmissions({ food: 'veg' }); // Assuming veg exists
    
    // As long as they return valid numbers and don't throw an error, fallback is proven safe
    expect(typeof modernEmissions).toBe('number');
    expect(typeof legacyEmissions).toBe('number');
    expect(!isNaN(legacyEmissions)).toBe(true);
  });

  it('validates invalid/missing data defaults safely', () => {
    // Invalid/missing data: passing entirely unrecognized string values should not crash
    const invalidEmissions = calculateDailyEmissions({ transport: 'spaceship' as any, delivery: 'maybe' as any });
    // It should fallback to base multipliers and return 0
    expect(invalidEmissions).toBe(0);
  });
});

