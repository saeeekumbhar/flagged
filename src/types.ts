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
}

export type Era = 'Red Flag Era' | 'Glow Up Era' | 'Green Flag Era';

export interface WeeklyCheckIn {
  date: string; // ISO string
  scoreDelta: number;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
}

export const calculateEra = (score: number): Era => {
  if (score <= 40) return 'Red Flag Era';
  if (score <= 70) return 'Glow Up Era';
  return 'Green Flag Era';
};
