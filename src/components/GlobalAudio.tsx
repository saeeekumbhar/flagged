import React, { useEffect } from 'react';
import { useSettings } from '../hooks';
import { SoundService } from '../services/SoundService';
import { User } from 'firebase/auth';

export function GlobalSoundListener() {
  const { settings } = useSettings();
  
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!settings.buttonSounds) return;
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
      
      if (isClickable) {
        SoundService.playBoop();
      }
    };
    
    document.body.addEventListener('click', handleGlobalClick);
    return () => document.body.removeEventListener('click', handleGlobalClick);
  }, [settings.buttonSounds]);
  
  return null;
}

export function GlobalAmbientMusic({ user }: { user: User | null }) {
  const { settings } = useSettings();
  
  useEffect(() => {
    if (settings.ambientMusic && user) {
      SoundService.startAmbient();

      const unlockAudio = () => {
        SoundService.resumeContext();
      };

      document.addEventListener('click', unlockAudio, { once: true });
      document.addEventListener('touchstart', unlockAudio, { once: true });

      return () => {
        SoundService.stopAmbient();
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      };
    } else {
      SoundService.stopAmbient();
    }
  }, [settings.ambientMusic, user]);

  return null;
}
