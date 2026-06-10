// Shared avatar definitions used across Onboarding, Dashboard, and Profile

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  tag: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'av1', emoji: '👩‍🎓', label: 'Scholar', tag: 'She/Her' },
  { id: 'av2', emoji: '🧕', label: 'Aisha', tag: 'She/Her' },
  { id: 'av3', emoji: '👧', label: 'Maya', tag: 'She/Her' },
  { id: 'av4', emoji: '👨‍🎓', label: 'Scholar', tag: 'He/Him' },
  { id: 'av5', emoji: '🧔', label: 'Raj', tag: 'He/Him' },
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
