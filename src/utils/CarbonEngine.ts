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

  if (log.foodSource || log.foodDiet) {
    if (log.foodSource === 'mess' || log.foodSource === 'home') co2 += 1.5;
    if (log.foodSource === 'outside') co2 += 3.0;
    
    if (log.foodDiet === 'veg') co2 += 0.5;
    if (log.foodDiet === 'mixed') co2 += 1.5;
    if (log.foodDiet === 'nonveg') co2 += 4.5;
  } else if (log.food) {
    switch (log.food) {
      case 'mess': case 'home': co2 += 1.5; break;
      case 'veg': co2 += 2; break;
      case 'mixed': co2 += 3; break;
      case 'nonveg': co2 += 6; break;
      case 'none': co2 += 0; break;
    }
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

