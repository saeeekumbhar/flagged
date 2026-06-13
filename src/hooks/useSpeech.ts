import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const goodVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (goodVoice) utterance.voice = goodVoice;
    
    utterance.rate = 1.05; // Slightly faster for energy
    utterance.pitch = 1.1; // Slightly higher
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    isPlaying,
    isSupported
  };
}
