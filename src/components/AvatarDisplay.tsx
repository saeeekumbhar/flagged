import React from 'react';
import { motion } from 'motion/react';
import { getFlagEvolutionStage, AvatarOption } from '../avatars';

interface AvatarDisplayProps {
  avatar?: AvatarOption;   // legacy support for onboarding character avatars
  score?: number;          // user's flag score for visual evolution
  size?: number;           // diameter or box size in px
  accessories?: string[];  // streak accessories, e.g., ['🚲', '🍃']
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarDisplay({ avatar, score = 50, size = 96, accessories = [], className = '', style }: AvatarDisplayProps) {
  
  // Render character avatar if provided (used in Onboarding)
  if (avatar) {
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

  const evolution = getFlagEvolutionStage(score);
  const visual = evolution.visual;

  // Animation variants based on animationLevel
  let rotateValues = [0, 0];
  let transitionConfig: any = { duration: 2, repeat: Infinity, ease: 'easeInOut' };
  
  if (visual.animationLevel === 'minimal') {
    rotateValues = [-1, 1, -1];
    transitionConfig.duration = 4;
  } else if (visual.animationLevel === 'slight') {
    rotateValues = [-3, 3, -3];
    transitionConfig.duration = 3;
  } else if (visual.animationLevel === 'noticeable') {
    rotateValues = [-6, 6, -6];
    transitionConfig.duration = 2.5;
  } else if (visual.animationLevel === 'strong') {
    rotateValues = [-9, 9, -9];
    transitionConfig.duration = 2;
  } else if (visual.animationLevel === 'legendary') {
    rotateValues = [-12, 12, -12];
    transitionConfig.duration = 1.5;
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size, ...style }}>
      
      {/* Background Glow based on score */}
      <div className="absolute inset-0 rounded-full opacity-40 blur-[12px]" style={{ backgroundColor: visual.color }}></div>

      {/* Flag SVG Area */}
      <motion.svg 
        viewBox="0 0 100 100" 
        width="80%" 
        height="80%" 
        className="overflow-visible origin-bottom-left relative z-10"
        animate={{ rotate: rotateValues }}
        transition={transitionConfig}
      >
        {/* Pole */}
        <rect x="25" y="10" width="6" height="85" fill={visual.poleColor} rx="3" />
        
        {/* Flag cloth */}
        {score <= 40 ? (
          // Drooping flag
          <path d="M 31 15 Q 50 40 75 45 L 60 70 Q 40 55 31 55 Z" fill={visual.color} />
        ) : score <= 60 ? (
          // Standard flag
          <path d="M 31 15 Q 55 5 85 20 L 75 55 Q 50 40 31 50 Z" fill={visual.color} />
        ) : (
          // Waving flag
          <motion.path 
            d="M 31 15 Q 55 5 85 20 L 75 55 Q 50 40 31 50 Z" 
            fill={visual.color}
            animate={{ d: [
              "M 31 15 Q 55 5 85 20 L 75 55 Q 50 40 31 50 Z",
              "M 31 15 Q 60 25 85 10 L 75 45 Q 50 50 31 50 Z",
              "M 31 15 Q 55 5 85 20 L 75 55 Q 50 40 31 50 Z"
            ] }}
            transition={{ ...transitionConfig, duration: transitionConfig.duration * 0.8 }}
          />
        )}
        
        {/* Torn edges for Stage 1 */}
        {score <= 40 && (
          <path d="M 75 45 L 70 50 L 75 55" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
        )}

        {/* Emblem for legendary */}
        {visual.hasEmblem && (
          <circle cx="53" cy="35" r="8" fill="#FFF" opacity="0.6" />
        )}
        
        {/* Ribbons */}
        {visual.hasRibbons && (
          <motion.path 
            d="M 28 15 Q 10 30 15 50" 
            stroke="#F5D990" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: ["M 28 15 Q 10 30 15 50", "M 28 15 Q 5 25 20 55", "M 28 15 Q 10 30 15 50"] }}
            transition={transitionConfig}
          />
        )}
      </motion.svg>

      {/* Particles */}
      {visual.hasParticles && (
        <>
          <motion.div animate={{ opacity: [0, 1, 0], y: [0, -30], x: [0, 10] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0 }} className="absolute text-[12px] z-20" style={{ top: '20%', right: '15%' }}>✨</motion.div>
          <motion.div animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, -10] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute text-[10px] z-20" style={{ top: '40%', left: '15%' }}>🍃</motion.div>
        </>
      )}

      {/* Accessories */}
      {accessories.length > 0 && (
        <div className="absolute -bottom-2 flex gap-1 bg-white/90 rounded-full px-2 py-1 shadow-md border border-[#EBE5DA] z-30">
          {accessories.map((acc, i) => (
            <span key={i} className="text-[12px] leading-none drop-shadow-sm">{acc}</span>
          ))}
        </div>
      )}
    </div>
  );
}
