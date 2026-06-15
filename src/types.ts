export interface UserProfile {
  uid?: string;
  email?: string | null;
  createdAt?: number;
  name: string;
  photoURL?: string | null;
  commuteMethod: string | null;
  commuteDistance?: '<2 km' | '2-5 km' | '5-10 km' | '10+ km' | null;
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
  completedChallenges?: string[];
}

export type Era = 'Red Flag Era' | 'Glow Up Era' | 'Green Flag Era';



export interface DailyLog {
  date: string; // ISO string 'YYYY-MM-DD'
  
  // New Structured Fields
  transport?: 'walk' | 'cycle' | 'bus' | 'metro' | 'auto' | 'car' | 'cab' | 'none';
  food?: 'mess' | 'home' | 'veg' | 'mixed' | 'nonveg' | 'none';
  foodSource?: 'mess' | 'home' | 'outside' | 'none';
  foodDiet?: 'veg' | 'mixed' | 'nonveg' | 'none';
  delivery?: 'no' | 'once' | 'multiple';
  energyLaptop?: '<2h' | '2-4h' | '4-8h' | '8+h' | 'none';
  energyAC?: 'none' | '<2h' | '2-6h' | '6+h';
  shopping?: 'no' | 'small' | 'medium' | 'large';
  reflection?: 'rough' | 'mixed' | 'green';

  dailyScore?: number; // 0-100 Daily Sustainability Score
  totalCarbonEstimate: number;
  notes: string;
}

export const calculateEra = (score: number): Era => {
  if (score <= 40) return 'Red Flag Era';
  if (score <= 70) return 'Glow Up Era';
  return 'Green Flag Era';
};

export type TabType = 'home' | 'journey' | 'insights' | 'challenges' | 'profile';

export type NavState = 
  | { type: 'tab'; tab: TabType }
  | { type: 'day_details'; date: string }
  | { type: 'badge_details'; badgeId: string }
  | { type: 'settings' };
