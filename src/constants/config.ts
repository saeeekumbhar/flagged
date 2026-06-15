/**
 * @module AppConfig
 * @description Centralized constants to prevent magic numbers across the codebase.
 */
export const AppConfig = {
  // Gamification Constants
  CONFETTI_SCORE_THRESHOLD: 50,
  CONFETTI_DURATION_MS: 2000,
  
  // Time Constants
  MS_IN_DAY: 1000 * 3600 * 24,
  
  // Analytics Constants
  DAYS_FOR_INSIGHT: 14,
} as const;
