import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface PixelButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function PixelButton({ variant = 'primary', children, className = '', ...props }: PixelButtonProps) {
  const baseClasses = "relative px-6 py-3 font-pixel text-sm uppercase tracking-wider border-4 transition-all duration-75 outline-none";
  
  let variantClasses = "";
  switch (variant) {
    case 'primary':
      variantClasses = "bg-[#52B788] text-[#121212] border-[#121212] brutal-shadow hover:shadow-[6px_6px_0px_0px_#121212] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
      break;
    case 'secondary':
      variantClasses = "bg-[#FFFFFF] text-[#121212] border-[#121212] brutal-shadow hover:shadow-[6px_6px_0px_0px_#121212] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
      break;
    case 'danger':
      variantClasses = "bg-[#E76F51] text-[#FEFAE0] border-[#121212] brutal-shadow hover:shadow-[6px_6px_0px_0px_#121212] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
      break;
  }

  return (
    <motion.button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
