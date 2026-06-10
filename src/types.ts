export type UserType = 'day_scholar' | 'hostelier';

export interface UserProfile {
  name: string;
  userType: UserType | null;
  commuteMethod: string | null;
  foodPreferences: string | null;
  flagScore: number;
  completedOnboarding: boolean;
  avatar: string; // URL or ID of avatar
  streak: number;
}

export type Era = 'Red Flag Era' | 'Mixed Flags Era' | 'Green Flag Era';

export interface WeeklyCheckIn {
  date: string; // ISO string
  scoreDelta: number;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
}

export const calculateEra = (score: number): Era => {
  if (score <= 40) return 'Red Flag Era';
  if (score <= 70) return 'Mixed Flags Era';
  return 'Green Flag Era';
};
