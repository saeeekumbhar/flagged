import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, calculateEra } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onBack: () => void;
}

const BADGES = [
  { emoji: '🌱', label: 'First Seed', desc: 'Started your journey' },
  { emoji: '🚲', label: 'Active Mover', desc: '5 days of active commute' },
  { emoji: '💧', label: 'Mindful Energy', desc: 'Unplugged 7 times' },
];

export function Profile({ profile, onBack }: ProfileProps) {
  const era = calculateEra(profile.flagScore);

  const eraStyle = era === 'Green Flag Era'
    ? 'era-badge-green'
    : era === 'Mixed Flags Era'
    ? 'era-badge-mixed'
    : 'era-badge-red';

  const stats = [
    { label: 'Growth Score', value: profile.flagScore, emoji: '🌿', color: '#5A8F5A' },
    { label: 'Week Streak', value: `${profile.streak} wks`, emoji: '🔥', color: '#D4A574' },
    { label: 'Badges', value: BADGES.length, emoji: '✨', color: '#5A9AB5' },
  ];

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5A8F5A] hover:bg-[#E4EDE0] transition-colors"
          style={{ background: 'rgba(196,217,188,0.3)' }}
        >
          ←
        </button>
        <h1 className="text-display text-2xl font-bold text-[#1F3D20]">My Garden</h1>
      </div>

      {/* Profile Hero */}
      <motion.div
        className="garden-card p-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div
            className="absolute inset-0 rounded-full glow-pulse"
            style={{ background: 'radial-gradient(circle, rgba(90,143,90,0.3) 0%, transparent 70%)' }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)', boxShadow: '0 6px 24px rgba(90,143,90,0.2)' }}
          >
            🌱
          </div>
        </div>
        <h2 className="text-display text-2xl font-bold text-[#1F3D20] mb-1">{profile.name}</h2>
        <p className="text-sm text-[#8A8070] mb-3 capitalize">{profile.userType?.replace('_', ' ')}</p>
        <span className={eraStyle}>
          {era === 'Green Flag Era' ? '🟢' : era === 'Mixed Flags Era' ? '🟡' : '🔴'} {era}
        </span>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="soft-card p-3 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="font-bold text-lg text-[#1E1A16]" style={{ fontFamily: 'var(--font-mono)' }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-[#8A8070] font-semibold uppercase tracking-wide mt-0.5">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div
        className="soft-card p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-[#1E1A16] mb-4">Garden Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {BADGES.map((badge, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)', boxShadow: '0 2px 10px rgba(90,143,90,0.15)' }}
              >
                {badge.emoji}
              </div>
              <span className="text-[10px] font-bold text-[#5A8070] uppercase text-center leading-tight max-w-[56px]">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Semester Summary */}
      <motion.div
        className="soft-card p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-sm font-bold text-[#1E1A16] mb-4">Semester Highlights</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Mess/Home Meals', value: '+24', positive: true, emoji: '🍱' },
            { label: 'Active Commute Days', value: '+16', positive: true, emoji: '🚶' },
            { label: 'Delivery Orders', value: '-4', positive: false, emoji: '📦' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: item.positive ? 'rgba(196,217,188,0.2)' : 'rgba(232,133,106,0.1)',
                border: `1px solid ${item.positive ? 'rgba(196,217,188,0.5)' : 'rgba(232,133,106,0.2)'}`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span>{item.emoji}</span>
                <span className="text-sm font-semibold text-[#1E1A16]">{item.label}</span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ fontFamily: 'var(--font-mono)', color: item.positive ? '#3D6B3D' : '#D4614A' }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
