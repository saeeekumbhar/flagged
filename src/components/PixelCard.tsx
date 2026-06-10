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
      variantClasses = "bg-[#FDFBF7] border-4 border-[#4A423D] text-[#3A3532] brutal-shadow";
      break;
    case 'dark':
      variantClasses = "bg-[#FFFFFF] border-4 border-[#8BA888] text-[#3A3532] brutal-shadow-inset relative overflow-hidden";
      break;
    case 'green':
      variantClasses = "bg-[#8BA888] border-4 border-[#4A423D] text-[#3A3532] brutal-shadow";
      break;
    case 'red':
      variantClasses = "bg-[#D98A7A] border-4 border-[#4A423D] text-[#FDFBF7] brutal-shadow";
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
