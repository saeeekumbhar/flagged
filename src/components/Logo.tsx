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
      <img 
        src="/title_logo.png" 
        alt="Logo" 
        className={`${svg} shrink-0 object-contain mix-blend-multiply`} 
      />
      
      {!hideText && (
        <div className="flex flex-col justify-center">
          <div className={`${text} font-bold text-[#1A2315] leading-none tracking-widest`} style={{ fontFamily: 'Inter, sans-serif' }}>
            FL<span style={{ display: 'inline-block', transform: 'scale(0.9, 1.1) translateY(-1%)' }}>Λ</span>GGED
          </div>
          <div className={`${sub} text-[#354024] tracking-widest font-medium mt-1 uppercase`} style={{ fontFamily: 'Inter, sans-serif' }}>
            track your carbon footprint
          </div>
        </div>
      )}
    </div>
  );
}
