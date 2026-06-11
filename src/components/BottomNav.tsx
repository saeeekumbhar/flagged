import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: TabType; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'journey', icon: '🗺️', label: 'Journey' },
    { id: 'coach', icon: '🦉', label: 'Coach' },
    { id: 'community', icon: '🌍', label: 'Community' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#E5D7C4]/60 backdrop-blur-xl border-t border-[#CFBB99]/50 flex justify-around items-center px-2 pb-1 z-50 shadow-[0_-4px_20px_rgba(30,26,22,0.05)]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform"
          >
            <div className={`text-xl mb-0.5 transition-all ${isActive ? 'scale-110 drop-shadow-md opacity-100' : 'opacity-50 grayscale scale-90'}`}>
              {tab.icon}
            </div>
            <div className={`text-[9px] font-bold transition-colors ${isActive ? 'text-[#889063]' : 'text-[#4C3D19]'}`}>
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
