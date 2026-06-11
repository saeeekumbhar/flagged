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
    { id: 'insights', icon: '👣', label: 'Insights' },
    { id: 'community', icon: '🌍', label: 'Community' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 premium-glass border-t border-white/60 flex justify-around items-center px-2 pb-1 z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.05)] rounded-t-[32px]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform"
          >
            <div className={`text-xl mb-0.5 transition-all ${isActive ? 'scale-110 drop-shadow-sm opacity-100 text-[#354024]' : 'opacity-40 grayscale scale-90 text-[#354024]'}`}>
              {tab.icon}
            </div>
            <div className={`text-[9px] font-bold transition-colors ${isActive ? 'text-[#354024]' : 'text-[#354024]/40'}`}>
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
