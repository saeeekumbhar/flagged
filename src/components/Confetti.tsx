import React, { useEffect, useState } from 'react';

const COLORS = ['#7BA87A', '#C4D9BC', '#F5D990', '#E8856A', '#7EB3CC'];

export function Confetti({ duration = 1500 }: { duration?: number }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      animationDuration: 2.5 + Math.random() * 2 + 's',
      animationDelay: Math.random() * 0.5 + 's',
      opacity: 0.5 + Math.random() * 0.4,
      width: 6 + Math.random() * 6 + 'px',
      height: 6 + Math.random() * 6 + 'px',
      borderRadius: Math.random() > 0.5 ? '50%' : '2px'
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            backgroundColor: p.backgroundColor,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
            width: p.width,
            height: p.height,
            borderRadius: p.borderRadius
          }}
        />
      ))}
    </div>
  );
}
