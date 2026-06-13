import { DailyLog } from '../types';
import {
  TRANSPORT_EMISSIONS,
  FOOD_SOURCE_EMISSIONS,
  FOOD_DIET_EMISSIONS,
  LEGACY_FOOD_EMISSIONS,
  DELIVERY_EMISSIONS,
  ENERGY_LAPTOP_EMISSIONS,
  ENERGY_AC_EMISSIONS,
  SHOPPING_EMISSIONS
} from './EmissionFactors';

export const calculateDailyEmissions = (log: Partial<DailyLog>): number => {
  let co2 = 0;

  if (log.transport && TRANSPORT_EMISSIONS[log.transport] !== undefined) {
    co2 += TRANSPORT_EMISSIONS[log.transport];
  }

  if (log.foodSource || log.foodDiet) {
    if (log.foodSource && FOOD_SOURCE_EMISSIONS[log.foodSource] !== undefined) {
      co2 += FOOD_SOURCE_EMISSIONS[log.foodSource];
    }
    if (log.foodDiet && FOOD_DIET_EMISSIONS[log.foodDiet] !== undefined) {
      co2 += FOOD_DIET_EMISSIONS[log.foodDiet];
    }
  } else if (log.food && LEGACY_FOOD_EMISSIONS[log.food] !== undefined) {
    co2 += LEGACY_FOOD_EMISSIONS[log.food];
  }

  if (log.delivery && DELIVERY_EMISSIONS[log.delivery] !== undefined) {
    co2 += DELIVERY_EMISSIONS[log.delivery];
  }

  if (log.energyLaptop && ENERGY_LAPTOP_EMISSIONS[log.energyLaptop] !== undefined) {
    co2 += ENERGY_LAPTOP_EMISSIONS[log.energyLaptop];
  }

  if (log.energyAC && ENERGY_AC_EMISSIONS[log.energyAC] !== undefined) {
    co2 += ENERGY_AC_EMISSIONS[log.energyAC];
  }

  if (log.shopping && SHOPPING_EMISSIONS[log.shopping] !== undefined) {
    co2 += SHOPPING_EMISSIONS[log.shopping];
  }

  return Number(co2.toFixed(2));
};

