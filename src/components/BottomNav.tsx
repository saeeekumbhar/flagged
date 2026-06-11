import React from 'react';
import { TabType } from '../types';
import { NavBar } from './ui/tubelight-navbar';
import { Home, Map, Lightbulb, Globe, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { name: 'Home', id: 'home', icon: Home },
    { name: 'Journey', id: 'journey', icon: Map },
    { name: 'Insights', id: 'insights', icon: Lightbulb },
    { name: 'Community', id: 'community', icon: Globe },
    { name: 'Profile', id: 'profile', icon: User }
  ];

  return <NavBar items={navItems} activeTab={activeTab} onTabChange={onTabChange} />;
}
