import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, calculateEra } from '../types';
import { AVATARS, getAvatar, getAvatarAura } from '../avatars';

interface ProfileProps {
  profile: UserProfile;
  onBack: () => void;
  onAvatarChange?: (avatarId: string) => void;
}

const BADGES = [
  { emoji: '🚩', label: 'First Flag', desc: 'Started your journey' },
  { emoji: '🚲', label: 'Active Mover', desc: '5 days active commute' },
  { emoji: '💧', label: 'Mindful Energy', desc: 'Unplugged 7 times' },
];

export function Profile({ profile, onBack, onAvatarChange }: ProfileProps) {
  const era = calculateEra(profile.flagScore);
  const aura = getAvatarAura(profile.flagScore);
  const avatar = getAvatar(profile.avatarId ?? 'av1');
  const [changingAvatar, setChangingAvatar] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(profile.avatarId ?? 'av1');

  const eraStyle = era === 'Green Flag Era' ? 'era-badge-green'
    : era === 'Glow Up Era' ? 'era-badge-mixed'
    : 'era-badge-red';

  const eraEmoji = era === 'Green Flag Era' ? '🟢' : era === 'Glow Up Era' ? '🔥' : '🔴';

  const stats = [
    { label: 'Flag Score', value: profile.flagScore, emoji: '🚩', color: '#5A8F5A' },
    { label: 'Week Streak', value: `${profile.streak}wk`, emoji: '🔥', color: '#D4A574' },
    { label: 'Badges', value: BADGES.length, emoji: '✨', color: '#5A9AB5' },
  ];

  return (
    <div className="pb-24 max-w-[420px] mx-auto px-4 pt-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5A8F5A] transition-colors"
          style={{ background: 'rgba(196,217,188,0.3)' }}>
          ←
        </button>
        <h1 className="text-display text-2xl font-bold text-[#1F3D20]">My Profile</h1>
      </div>

      {/* Profile Hero */}
      <motion.div className="garden-card p-6 text-center"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative w-28 h-28 mx-auto mb-4">
          <motion.div className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: `radial-gradient(circle, ${aura.glow.replace('0.22', '0.5')} 0%, transparent 70%)` }}
          />
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
            style={{
              background: aura.bg,
              boxShadow: `0 6px 28px ${aura.glow}`,
              border: `3px solid ${aura.ring}`,
            }}>
            {avatar.emoji}
          </div>
          {/* Change avatar button */}
          <button
            onClick={() => { setPendingAvatar(profile.avatarId ?? 'av1'); setChangingAvatar(true); }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: '#5A8F5A', color: 'white', boxShadow: '0 2px 8px rgba(90,143,90,0.4)' }}
          >
            ✏️
          </button>
        </div>
        <h2 className="text-display text-2xl font-bold text-[#1F3D20] mb-1">{profile.name}</h2>
        <p className="text-sm text-[#8A8070] mb-3 capitalize">{profile.userType?.replace('_', ' ')}</p>
        <span className={eraStyle}>{eraEmoji} {era}</span>
      </motion.div>

      {/* Avatar Change Drawer */}
      <AnimatePresence>
        {changingAvatar && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="soft-card p-5">
            <p className="text-sm font-bold text-[#1E1A16] mb-4">Choose your avatar</p>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {AVATARS.map(av => (
                <button key={av.id} onClick={() => setPendingAvatar(av.id)}
                  className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all"
                    style={{
                      background: pendingAvatar === av.id ? 'linear-gradient(135deg, #C4D9BC, #E4EDE0)' : 'rgba(253,250,245,0.9)',
                      border: pendingAvatar === av.id ? '2.5px solid #5A8F5A' : '2px solid rgba(196,217,188,0.4)',
                      boxShadow: pendingAvatar === av.id ? '0 4px 14px rgba(90,143,90,0.25)' : undefined,
                    }}>
                    {av.emoji}
                  </div>
                  <span className="text-[9px] font-semibold text-[#5A8070] text-center">{av.tag}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setChangingAvatar(false)}
                className="flex-1 btn-secondary py-2.5 text-sm">Cancel</button>
              <button onClick={() => { onAvatarChange?.(pendingAvatar); setChangingAvatar(false); }}
                className="flex-1 btn-primary py-2.5 text-sm">Save</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="soft-card p-3 text-center"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="font-bold text-lg text-[#1E1A16]" style={{ fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
            <div className="text-[10px] text-[#8A8070] font-semibold uppercase tracking-wide mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-[#1E1A16] mb-4">Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {BADGES.map((badge, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)', boxShadow: '0 2px 10px rgba(90,143,90,0.15)' }}>
                {badge.emoji}
              </div>
              <span className="text-[10px] font-bold text-[#5A8070] uppercase text-center leading-tight max-w-[56px]">{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Semester Summary */}
      <motion.div className="soft-card p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-sm font-bold text-[#1E1A16] mb-4">Semester Highlights</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Mess/Home Meals', value: '+24', positive: true, emoji: '🍱' },
            { label: 'Active Commute Days', value: '+16', positive: true, emoji: '🚶' },
            { label: 'Delivery Orders', value: '-4', positive: false, emoji: '📦' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: item.positive ? 'rgba(196,217,188,0.2)' : 'rgba(232,133,106,0.1)',
                border: `1px solid ${item.positive ? 'rgba(196,217,188,0.5)' : 'rgba(232,133,106,0.2)'}`,
              }}>
              <div className="flex items-center gap-2.5">
                <span>{item.emoji}</span>
                <span className="text-sm font-semibold text-[#1E1A16]">{item.label}</span>
              </div>
              <span className="text-sm font-bold"
                style={{ fontFamily: 'var(--font-mono)', color: item.positive ? '#3D6B3D' : '#D4614A' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
