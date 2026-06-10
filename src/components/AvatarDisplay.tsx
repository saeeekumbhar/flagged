// Renders the correct avatar — image if available, emoji fallback otherwise
import React from 'react';
import { AvatarOption } from '../avatars';

interface AvatarDisplayProps {
  avatar: AvatarOption;
  size?: number;           // diameter in px
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarDisplay({ avatar, size = 96, className = '', style }: AvatarDisplayProps) {
  const fontSize = size * 0.52;

  if (avatar.image) {
    return (
      <img
        src={avatar.image}
        alt={avatar.label}
        className={`object-cover object-top ${className}`}
        style={{ width: size, height: size, borderRadius: '50%', ...style }}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, fontSize, ...style }}
    >
      {avatar.emoji}
    </span>
  );
}
