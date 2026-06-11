// Renders the correct avatar — image if available, emoji fallback otherwise
import React from 'react';
import { AvatarOption } from '../avatars';

interface AvatarDisplayProps {
  avatar: AvatarOption;
  size?: number;           // diameter in px
  score?: number;          // user's flag score for visual evolution
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarDisplay({ avatar, size = 96, score = 50, className = '', style }: AvatarDisplayProps) {
  const fontSize = size * 0.52;

  // Calculate evolution scale and filter based on score (0-100)
  // Score 50 is normal (scale 1, grayscale 0)
  // Score > 50 grows up to 1.15 scale, more vibrant
  // Score < 50 shrinks down to 0.85 scale, becomes more grayscale
  const scale = 0.85 + (score / 100) * 0.3;
  const grayscale = Math.max(0, 100 - (score * 2)); // Grayscale when score < 50
  const saturate = Math.max(100, score * 1.5); // More vibrant when score > 66

  const evolveStyle: React.CSSProperties = {
    width: size, 
    height: size, 
    borderRadius: '50%',
    transform: `scale(${scale})`,
    filter: `grayscale(${grayscale}%) saturate(${saturate}%)`,
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    ...style
  };

  if (avatar.image) {
    return (
      <img
        src={avatar.image}
        alt={avatar.label}
        className={`object-cover object-top ${className}`}
        style={evolveStyle}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, fontSize, ...style, transform: `scale(${scale})` }}
    >
      {avatar.emoji}
    </span>
  );
}
