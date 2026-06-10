// Shared avatar definitions used across Onboarding, Dashboard, and Profile

export interface AvatarOption {
  id: string;
  emoji?: string;       // emoji fallback (for small sizes)
  image?: string;       // path to illustrated image asset
  label: string;
  tag: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'av_f1', image: '/avatar_female.png', emoji: '🎧', label: 'Zara',  tag: 'She/Her' },
  { id: 'av_m1', image: '/avatar_male.png',   emoji: '🎧', label: 'Arjun', tag: 'He/Him'  },
];

export const getAvatar = (id: string): AvatarOption =>
  AVATARS.find(a => a.id === id) ?? AVATARS[0];

/** Returns aura config based on score for the avatar display */
export function getAvatarAura(score: number) {
  if (score <= 40) return {
    ring: 'rgba(212,97,74,0.5)',
    glow: 'rgba(212,97,74,0.2)',
    bg: 'linear-gradient(135deg, #FDEEED, #FDF9F3)',
    label: 'Keep going — every step counts 🌱',
  };
  if (score <= 70) return {
    ring: 'rgba(212,165,116,0.6)',
    glow: 'rgba(212,165,116,0.22)',
    bg: 'linear-gradient(135deg, #FDF6EC, #FDFAF5)',
    label: "You're glowing up 🔥",
  };
  return {
    ring: 'rgba(90,143,90,0.6)',
    glow: 'rgba(90,143,90,0.22)',
    bg: 'linear-gradient(135deg, #E4EDE0, #F4F7F2)',
    label: 'Living the green life ✨',
  };
}
