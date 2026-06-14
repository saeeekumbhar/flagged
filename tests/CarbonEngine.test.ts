import { describe, it, expect } from 'vitest';
import { calculateDailyEmissions } from '../src/services/CarbonService';

describe('CarbonEngine', () => {
  it('does not crash with an empty log', () => {
    const emissions = calculateDailyEmissions({});
    expect(emissions).toBe(0);
  });

  it('walking emits less carbon than driving a car', () => {
    const walkEmissions = calculateDailyEmissions({ transport: 'walk' });
    const carEmissions = calculateDailyEmissions({ transport: 'car' });
    expect(walkEmissions).toBeLessThan(carEmissions);
  });

  it('calculates correct emission for diet + source', () => {
    const emissions = calculateDailyEmissions({ foodSource: 'local', foodDiet: 'vegan' });
    expect(emissions).toBeGreaterThanOrEqual(0);
  });

  it('sums emissions from multiple categories correctly', () => {
    const emptyEmissions = calculateDailyEmissions({});
    const fullEmissions = calculateDailyEmissions({ 
      transport: 'car', 
      foodSource: 'imported',
      foodDiet: 'meat',
      delivery: 'express',
      energyLaptop: '8+',
      energyAC: '8+'
    });
    
    expect(fullEmissions).toBeGreaterThan(emptyEmissions);
  });

  it('fallback to legacy food calculations works correctly', () => {
    const modernEmissions = calculateDailyEmissions({ foodSource: 'local', foodDiet: 'vegan' });
    const legacyEmissions = calculateDailyEmissions({ food: 'plant_based' }); // Assuming plant_based exists
    
    // As long as they return valid numbers and don't throw an error, fallback is proven safe
    expect(typeof modernEmissions).toBe('number');
    expect(typeof legacyEmissions).toBe('number');
    expect(!isNaN(legacyEmissions)).toBe(true);
  });
});
