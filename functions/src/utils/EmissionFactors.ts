// Emission Factors (kg CO2e)
export const TRANSPORT_EMISSIONS: Record<string, number> = {
  walk: 0,
  cycle: 0,
  none: 0,
  metro: 1.0,
  bus: 1.5,
  auto: 3.0,
  car: 8.0,
  cab: 8.0,
};

export const FOOD_SOURCE_EMISSIONS: Record<string, number> = {
  mess: 1.5,
  home: 1.5,
  outside: 3.0,
  none: 0,
};

export const FOOD_DIET_EMISSIONS: Record<string, number> = {
  veg: 0.5,
  mixed: 1.5,
  nonveg: 4.5,
  none: 0,
};

export const LEGACY_FOOD_EMISSIONS: Record<string, number> = {
  mess: 1.5,
  home: 1.5,
  veg: 2.0,
  mixed: 3.0,
  nonveg: 6.0,
  none: 0,
};

export const DELIVERY_EMISSIONS: Record<string, number> = {
  no: 0,
  once: 2.0,
  multiple: 5.0,
};

export const ENERGY_LAPTOP_EMISSIONS: Record<string, number> = {
  '<2h': 0.1,
  '2-4h': 0.3,
  '4-8h': 0.6,
  '8+h': 1.0,
  none: 0,
};

export const ENERGY_AC_EMISSIONS: Record<string, number> = {
  none: 0,
  '<2h': 1.5,
  '2-6h': 4.0,
  '6+h': 8.0,
};

export const SHOPPING_EMISSIONS: Record<string, number> = {
  no: 0,
  small: 2.0,
  medium: 5.0,
  large: 15.0,
};

// Daily Scores (0-100)
export const TRANSPORT_SCORES: Record<string, number> = {
  walk: 100,
  cycle: 100,
  none: 100,
  bus: 85,
  metro: 85,
  auto: 65,
  car: 35,
  cab: 35,
};

export const FOOD_SOURCE_SCORES: Record<string, number> = {
  mess: 100,
  home: 100,
  outside: 50,
  none: 100,
};

export const FOOD_DIET_SCORES: Record<string, number> = {
  veg: 100,
  mixed: 75,
  nonveg: 40,
  none: 100,
};

export const LEGACY_FOOD_SCORES: Record<string, number> = {
  mess: 100,
  home: 100,
  veg: 100,
  mixed: 75,
  nonveg: 40,
  none: 100,
};

export const DELIVERY_SCORES: Record<string, number> = {
  no: 100,
  once: 60,
  multiple: 20,
};

export const SHOPPING_SCORES: Record<string, number> = {
  no: 100,
  small: 80,
  medium: 50,
  large: 20,
};

export const ENERGY_LAPTOP_SCORES: Record<string, number> = {
  '<2h': 100,
  'none': 100,
  '2-4h': 80,
  '4-8h': 60,
  '8+h': 40,
};

export const ENERGY_AC_SCORES: Record<string, number> = {
  none: 100,
  '<2h': 80,
  '2-6h': 50,
  '6+h': 20,
};
