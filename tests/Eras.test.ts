import { describe, it, expect } from 'vitest';
import { calculateEra } from '../src/types';

describe('Era Boundary Logic', () => {
  it('correctly assigns Red Flag Era at the lower boundaries', () => {
    expect(calculateEra(0)).toBe('Red Flag Era');
    expect(calculateEra(39)).toBe('Red Flag Era');
    expect(calculateEra(40)).toBe('Red Flag Era'); // Exact boundary
  });

  it('correctly transitions to Glow Up Era', () => {
    expect(calculateEra(41)).toBe('Glow Up Era'); // Just above boundary
    expect(calculateEra(55)).toBe('Glow Up Era');
    expect(calculateEra(70)).toBe('Glow Up Era'); // Exact upper boundary
  });

  it('correctly transitions to Green Flag Era', () => {
    expect(calculateEra(71)).toBe('Green Flag Era'); // Just above boundary
    expect(calculateEra(90)).toBe('Green Flag Era');
    expect(calculateEra(100)).toBe('Green Flag Era'); // Maximum score
  });

  it('handles unexpected edge cases gracefully', () => {
    expect(calculateEra(-10)).toBe('Red Flag Era'); // Out of bounds negative
    expect(calculateEra(150)).toBe('Green Flag Era'); // Out of bounds positive
  });
});
