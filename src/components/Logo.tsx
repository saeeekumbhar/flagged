import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export function Logo({ className = '', size = 'md', hideText = false }: LogoProps) {
  const sizeMap = {
    sm: { text: 'text-[20px]' },
    md: { text: 'text-[28px]' },
    lg: { text: 'text-[48px]' },
  };

  const { text } = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      {!hideText && (
        <div className={`${text} font-bold text-white tracking-widest`} style={{ fontFamily: 'Inter, sans-serif' }}>
          FLAGGED
        </div>
      )}
    </div>
  );
}
