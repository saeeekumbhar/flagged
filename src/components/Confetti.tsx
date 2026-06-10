import React, { useEffect, useState } from 'react';

const COLORS = ['#3a8f3a', '#c4d9bc', '#f5d990', '#1e1a16'];

export function Confetti({ duration = 1500 }: { duration?: number }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      animationDuration: 0.5 + Math.random() * 1 + 's',
      animationDelay: Math.random() * 0.2 + 's',
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
          }}
        />
      ))}
    </div>
  );
}
