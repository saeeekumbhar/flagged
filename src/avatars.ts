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
    bg: 'linear-gradient(135deg, #FDEEED, #E5D7C4)',
    label: 'Keep going — every step counts 🌱',
  };
  if (score <= 70) return {
    ring: 'rgba(212,165,116,0.6)',
    glow: 'rgba(212,165,116,0.22)',
    bg: 'linear-gradient(135deg, #E5D7C4, #E5D7C4)',
    label: "You're glowing up 🔥",
  };
  return {
    ring: 'rgba(90,143,90,0.6)',
    glow: 'rgba(90,143,90,0.22)',
    bg: 'linear-gradient(135deg, #E4EDE0, #F4F7F2)',
    label: 'Living the green life ✨',
  };
}

export interface FlagEvolutionStage {
  stage: number;
  stageName: string;
  mood: string;
  nextThreshold: number | null;
  pointsRemaining: number | null;
  visual: {
    color: string;
    poleColor: string;
    animationLevel: 'minimal' | 'slight' | 'noticeable' | 'strong' | 'legendary';
    hasRibbons: boolean;
    hasParticles: boolean;
    hasEmblem: boolean;
  };
}

export function getFlagEvolutionStage(score: number): FlagEvolutionStage {
  if (score <= 40) {
    return {
      stage: 1,
      stageName: 'Red Flag Era',
      mood: 'Needs improvement',
      nextThreshold: 41,
      pointsRemaining: 41 - score,
      visual: {
        color: '#D4614A',
        poleColor: '#4C3D19',
        animationLevel: 'minimal',
        hasRibbons: false,
        hasParticles: false,
        hasEmblem: false,
      }
    };
  } else if (score <= 60) {
    return {
      stage: 2,
      stageName: 'Recovering Flag',
      mood: 'Recovering',
      nextThreshold: 61,
      pointsRemaining: 61 - score,
      visual: {
        color: '#D4A574',
        poleColor: '#4C3D19',
        animationLevel: 'slight',
        hasRibbons: false,
        hasParticles: false,
        hasEmblem: false,
      }
    };
  } else if (score <= 75) {
    return {
      stage: 3,
      stageName: 'Growing Green Flag',
      mood: 'Building momentum',
      nextThreshold: 76,
      pointsRemaining: 76 - score,
      visual: {
        color: '#889063',
        poleColor: '#4C3D19',
        animationLevel: 'noticeable',
        hasRibbons: false,
        hasParticles: true,
        hasEmblem: false,
      }
    };
  } else if (score <= 90) {
    return {
      stage: 4,
      stageName: 'Green Flag Era',
      mood: 'Green Flag Era',
      nextThreshold: 91,
      pointsRemaining: 91 - score,
      visual: {
        color: '#889063',
        poleColor: '#4C3D19',
        animationLevel: 'strong',
        hasRibbons: true,
        hasParticles: true,
        hasEmblem: false,
      }
    };
  } else {
    return {
      stage: 5,
      stageName: 'Green Flag Legend',
      mood: 'Green Flag Legend',
      nextThreshold: null,
      pointsRemaining: null,
      visual: {
        color: '#889063',
        poleColor: '#CFBB99',
        animationLevel: 'legendary',
        hasRibbons: true,
        hasParticles: true,
        hasEmblem: true,
      }
    };
  }
}
