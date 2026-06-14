import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text: string, id: string = 'global') => {
    if (!isSupported) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English Female voice (soft & sweet)
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritize natural neural voices (Cloud-based) across different OS
    const preferredVoices = [
      'Microsoft Jenny Online (Natural)', // Edge Neural Female
      'Microsoft Aria Online (Natural)', // Edge Neural Female
      'Google US English', // Chrome US Female (often cloud-backed)
      'Google UK English Female', // Chrome UK Female
      'Samantha', // Mac US Female (high quality)
      'Victoria', // Mac US Female
      'Microsoft Zira', // Windows US Female (offline fallback)
      'Microsoft Hazel', // Windows UK Female (offline fallback)
    ];

    let selectedVoice = null;
    
    // 1. Try to find an exact match from our preferred list
    for (const pref of preferredVoices) {
      const match = voices.find(v => v.name.includes(pref));
      if (match) {
        selectedVoice = match;
        break;
      }
    }
    
    // 2. Fallback to any female English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl')));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Adjust for a "soft and sweet" vibe
    utterance.rate = 0.95; // Slightly slower for a calmer vibe
    utterance.pitch = 1.2; // Slightly higher pitch for sweetness
    
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    
    window.speechSynthesis.speak(utterance);
    setPlayingId(id);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setPlayingId(null);
  }, [isSupported]);

  return {
    speak,
    stop,
    playingId,
    isSupported
  };
}
