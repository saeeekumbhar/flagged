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
      variantClasses = "bg-[#8BA888] text-[#3A3532] border-[#4A423D] brutal-shadow hover:shadow-[6px_6px_0px_0px_#4A423D] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
      break;
    case 'secondary':
      variantClasses = "bg-[#FFFFFF] text-[#3A3532] border-[#4A423D] brutal-shadow hover:shadow-[6px_6px_0px_0px_#4A423D] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
      break;
    case 'danger':
      variantClasses = "bg-[#D98A7A] text-[#FDFBF7] border-[#4A423D] brutal-shadow hover:shadow-[6px_6px_0px_0px_#4A423D] hover:-translate-y-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none";
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
