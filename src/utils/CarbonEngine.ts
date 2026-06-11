import { DailyLog } from '../types';

export const calculateDailyEmissions = (log: Partial<DailyLog>): number => {
  let co2 = 0;

  switch (log.transport) {
    case 'walk': case 'cycle': case 'none': co2 += 0; break;
    case 'metro': co2 += 1; break;
    case 'bus': co2 += 1.5; break;
    case 'auto': co2 += 3; break;
    case 'car': case 'cab': co2 += 8; break;
  }

  switch (log.food) {
    case 'mess': case 'home': co2 += 1.5; break;
    case 'veg': co2 += 2; break;
    case 'mixed': co2 += 3; break;
    case 'nonveg': co2 += 6; break;
    case 'none': co2 += 0; break;
  }

  switch (log.delivery) {
    case 'no': co2 += 0; break;
    case 'once': co2 += 2; break;
    case 'multiple': co2 += 5; break;
  }

  switch (log.energyLaptop) {
    case '<2h': co2 += 0.1; break;
    case '2-4h': co2 += 0.3; break;
    case '4-8h': co2 += 0.6; break;
    case '8+h': co2 += 1.0; break;
    case 'none': co2 += 0; break;
  }

  switch (log.energyAC) {
    case 'none': co2 += 0; break;
    case '<2h': co2 += 1.5; break;
    case '2-6h': co2 += 4; break;
    case '6+h': co2 += 8; break;
  }

  switch (log.shopping) {
    case 'no': co2 += 0; break;
    case 'small': co2 += 2; break;
    case 'medium': co2 += 5; break;
    case 'large': co2 += 15; break;
  }

  return Number(co2.toFixed(2));
};

export const calculateDailyFlagImpact = (log: Partial<DailyLog>): number => {
  let impact = 0;

  switch (log.transport) {
    case 'walk': case 'cycle': impact += 10; break;
    case 'bus': case 'metro': impact += 5; break;
    case 'auto': impact -= 2; break;
    case 'car': case 'cab': impact -= 5; break;
  }

  switch (log.food) {
    case 'mess': case 'home': case 'veg': impact += 5; break;
    case 'mixed': impact += 2; break;
    case 'nonveg': impact -= 5; break;
  }

  switch (log.delivery) {
    case 'no': impact += 5; break;
    case 'once': impact -= 3; break;
    case 'multiple': impact -= 8; break;
  }

  switch (log.energyLaptop) {
    case '<2h': impact += 5; break;
    case '8+h': impact -= 2; break;
  }

  switch (log.energyAC) {
    case 'none': impact += 10; break;
    case '2-6h': impact -= 5; break;
    case '6+h': impact -= 10; break;
  }

  switch (log.shopping) {
    case 'no': impact += 5; break;
    case 'medium': impact -= 2; break;
    case 'large': impact -= 8; break;
  }

  // Removed legacy activities fallback

  return impact;
};
