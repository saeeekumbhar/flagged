// Shared GreenFlagIcon SVG — used in Splash header and Dashboard header
import React from 'react';

interface GreenFlagIconProps {
  size?: number;
  className?: string;
}

export function GreenFlagIcon({ size = 28, className }: GreenFlagIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dflagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8FD08E" />
          <stop offset="100%" stopColor="#3A7A3B" />
        </linearGradient>
        <linearGradient id="dpoleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A5230" />
          <stop offset="100%" stopColor="#4A8A4C" />
        </linearGradient>
        <linearGradient id="dgroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#72B874" />
          <stop offset="100%" stopColor="#3D7A3E" />
        </linearGradient>
        <filter id="dflagShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1A3D1A" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Ground */}
      <ellipse cx="38" cy="73" rx="24" ry="6.5" fill="url(#dgroundGrad)" opacity="0.9" />

      {/* Tilted group */}
      <g transform="rotate(-6, 38, 73)">
        {/* Pole */}
        <rect x="35.5" y="10" width="5" height="63" rx="2.5" fill="url(#dpoleGrad)" />
        <rect x="36" y="12" width="1.8" height="55" rx="0.9" fill="white" opacity="0.15" />

        {/* Flag body */}
        <path
          d="M40.5 10 C54 11, 72 15, 72 23 C72 31, 56 34, 44 38 C54 33, 68 29, 68 23 C68 17, 54 14, 40.5 13 Z"
          fill="url(#dflagGrad)"
          filter="url(#dflagShadow)"
        />
        {/* Flag top highlight */}
        <path
          d="M40.5 10 C54 11, 71 14.5, 72 23"
          stroke="white" strokeWidth="1.4" strokeOpacity="0.5"
          fill="none" strokeLinecap="round"
        />
        {/* Flag wave crease */}
        <path
          d="M40.5 13 C54 14, 67 17.5, 68 23 C67 28, 55 31, 44 35"
          stroke="#2A5230" strokeWidth="0.8" strokeOpacity="0.25"
          fill="none" strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
