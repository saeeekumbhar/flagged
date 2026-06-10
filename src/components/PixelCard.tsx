import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface PixelCardProps extends HTMLMotionProps<'div'> {
  variant?: 'neutral' | 'dark' | 'green' | 'red';
  children: React.ReactNode;
}

export function PixelCard({ variant = 'neutral', children, className = '', ...props }: PixelCardProps) {
  let variantClasses = "";
  switch (variant) {
    case 'neutral':
      variantClasses = "bg-[#1E1E1E] border-4 border-[#2D2D2D] text-[#FEFAE0] brutal-shadow";
      break;
    case 'dark':
      variantClasses = "bg-[#181818] border-4 border-[#52B788] text-[#FEFAE0] brutal-shadow-inset relative overflow-hidden";
      break;
    case 'green':
      variantClasses = "bg-[#2D6A4F] border-4 border-[#52B788] text-white brutal-shadow";
      break;
    case 'red':
      variantClasses = "bg-[#D62828] border-4 border-[#E76F51] text-white brutal-shadow";
      break;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 flex flex-col ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
