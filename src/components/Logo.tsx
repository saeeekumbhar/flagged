import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export function Logo({ className = '', size = 'md', hideText = false }: LogoProps) {
  const sizeMap = {
    sm: { svg: 'w-6 h-6', text: 'text-[16px]', sub: 'text-[8px]', gap: 'gap-2' },
    md: { svg: 'w-10 h-10', text: 'text-[24px]', sub: 'text-[11px]', gap: 'gap-3' },
    lg: { svg: 'w-20 h-20', text: 'text-[42px]', sub: 'text-[16px]', gap: 'gap-5' },
  };

  const { svg, text, sub, gap } = sizeMap[size];

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <svg viewBox="0 0 100 100" className={`${svg} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 25 A 40 40 0 1 0 25 75" stroke="#7D8A68" strokeWidth="6" strokeLinecap="round" />
        <path d="M 45 90 A 40 40 0 0 0 65 85" stroke="#7D8A68" strokeWidth="6" strokeLinecap="round" />
        
        <circle cx="80" cy="55" r="3.5" fill="#7D8A68" />
        <circle cx="72" cy="65" r="3.5" fill="#7D8A68" />
        <circle cx="62" cy="73" r="3.5" fill="#7D8A68" />
        
        <line x1="35" y1="20" x2="35" y2="80" stroke="#2D3324" strokeWidth="6" strokeLinecap="round" />
        <path d="M 38 30 Q 55 20 75 35 Q 55 45 38 45 Z" fill="#7D8A68" />
      </svg>
      
      {!hideText && (
        <div className="flex flex-col justify-center">
          <div className={`${text} font-bold text-[#2D3324] leading-none tracking-widest`} style={{ fontFamily: 'Inter, sans-serif' }}>
            FL<span style={{ display: 'inline-block', transform: 'scale(0.9, 1.1) translateY(-1%)' }}>Λ</span>GGED
          </div>
          <div className={`${sub} text-[#7D8A68] tracking-widest font-medium mt-1 uppercase`} style={{ fontFamily: 'Inter, sans-serif' }}>
            track your carbon footprint
          </div>
        </div>
      )}
    </div>
  );
}
