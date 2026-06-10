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
      variantClasses = "bg-[#F4F1DE] border-4 border-[#121212] text-[#121212] brutal-shadow";
      break;
    case 'dark':
      variantClasses = "bg-[#FFFFFF] border-4 border-[#52B788] text-[#121212] brutal-shadow-inset relative overflow-hidden";
      break;
    case 'green':
      variantClasses = "bg-[#52B788] border-4 border-[#121212] text-[#121212] brutal-shadow";
      break;
    case 'red':
      variantClasses = "bg-[#E76F51] border-4 border-[#121212] text-[#FEFAE0] brutal-shadow";
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
