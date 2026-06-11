/**
 * @deprecated This legacy activity system is being phased out in favor of the CarbonEngine
 * and structured DailyLog fields (transport, food, delivery, energyLaptop, energyAC, shopping).
 * Do not add new activities here.
 */
import { ActivityDefinition } from './types';

export const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'commute_walk_bike',
    label: 'Walked or Cycled',
    emoji: '🚶',
    carbonImpact: 'Very Low',
    carbonValue: 0.5,
    flagImpact: 'Strong Positive',
    flagValue: 10,
  },
  {
    id: 'commute_public',
    label: 'Public Transport',
    emoji: '🚌',
    carbonImpact: 'Low',
    carbonValue: 2,
    flagImpact: 'Positive',
    flagValue: 5,
  },
  {
    id: 'commute_car',
    label: 'Car or Scooty',
    emoji: '🚗',
    carbonImpact: 'High',
    carbonValue: 12,
    flagImpact: 'Negative',
    flagValue: -5,
  },
  {
    id: 'food_home',
    label: 'Mess / Home Meal',
    emoji: '🍱',
    carbonImpact: 'Low',
    carbonValue: 1.5,
    flagImpact: 'Positive',
    flagValue: 5,
  },
  {
    id: 'food_delivery',
    label: 'Food Delivery',
    emoji: '🥡',
    carbonImpact: 'Medium',
    carbonValue: 6,
    flagImpact: 'Negative',
    flagValue: -8,
  },
  {
    id: 'energy_ac',
    label: 'Heavy AC Usage',
    emoji: '❄️',
    carbonImpact: 'High',
    carbonValue: 10,
    flagImpact: 'Negative',
    flagValue: -10,
  },
  {
    id: 'energy_mindful',
    label: 'Unplugged Chargers',
    emoji: '🔌',
    carbonImpact: 'Very Low',
    carbonValue: 0,
    flagImpact: 'Positive',
    flagValue: 5,
  },
  {
    id: 'purchase_major',
    label: 'Major Purchase',
    emoji: '🛍️',
    carbonImpact: 'High',
    carbonValue: 15,
    flagImpact: 'Negative',
    flagValue: -5,
  },
  {
    id: 'purchase_thrift',
    label: 'Thrifted / Second-hand',
    emoji: '♻️',
    carbonImpact: 'Low',
    carbonValue: 1,
    flagImpact: 'Strong Positive',
    flagValue: 10,
  },
];
