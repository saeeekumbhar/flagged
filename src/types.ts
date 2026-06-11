export type UserType = 'day_scholar' | 'hostelier';

export interface UserProfile {
  name: string;
  userType: UserType | null;
  commuteMethod: string | null;
  foodPreferences: string | null;
  acPreference: string | null;
  deliveryFrequency: number;
  chargerHabit: boolean | null;
  flagScore: number;
  completedOnboarding: boolean;
  avatarId: string; // ID from AVATARS list
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  coins: number;
}

export type Era = 'Red Flag Era' | 'Glow Up Era' | 'Green Flag Era';

export interface ActivityDefinition {
  id: string;
  label: string;
  emoji: string;
  carbonImpact: 'Very Low' | 'Low' | 'Medium' | 'High';
  carbonValue: number;
  flagImpact: 'Strong Positive' | 'Positive' | 'Negative' | 'Strong Negative';
  flagValue: number;
}

export interface LoggedActivity {
  activityId: string;
  count: number;
}

export interface DailyLog {
  date: string; // ISO string 'YYYY-MM-DD'
  
  // Legacy
  activities: LoggedActivity[];

  // New Structured Fields
  transport?: string;
  food?: string;
  delivery?: string;
  energyLaptop?: string;
  energyAC?: string;
  shopping?: string;
  reflection?: 'rough' | 'mixed' | 'green';

  totalFlagImpact: number;
  totalCarbonEstimate: number;
  notes: string;
}

export const calculateEra = (score: number): Era => {
  if (score <= 40) return 'Red Flag Era';
  if (score <= 70) return 'Glow Up Era';
  return 'Green Flag Era';
};

export type TabType = 'home' | 'journey' | 'insights' | 'community' | 'profile';

export type NavState = 
  | { type: 'tab'; tab: TabType }
  | { type: 'day_details'; date: string }
  | { type: 'day_summary'; date: string }
  | { type: 'badge_details'; badgeId: string };
