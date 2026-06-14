// A simple synthesizer using Web Audio API to avoid external assets.

let audioCtx: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundService = {
  playBoop: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Sound boop failed", e);
    }
  },

  playSuccess: () => {
    try {
      const ctx = getAudioContext();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      gain.connect(ctx.destination);

      const playNote = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      };

      playNote(523.25, 0); // C5
      playNote(659.25, 0.1); // E5
      playNote(783.99, 0.2); // G5
      playNote(1046.50, 0.3); // C6
    } catch (e) {
      console.warn("Sound success failed", e);
    }
  },

  startAmbient: () => {
    try {
      const ctx = getAudioContext();
      if (ambientOscillator) return; // already playing

      // Use as a flag to know it's playing
      ambientOscillator = ctx.createOscillator(); 

      const playChime = () => {
        if (!ambientOscillator) return; // stopped
        
        // C Major Pentatonic frequencies (soothing, never dissonant)
        // C5, D5, E5, G5, A5, C6
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const freq = scale[Math.floor(Math.random() * scale.length)];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        osc.type = 'sine'; // Pure, sweet tone
        osc.frequency.value = freq;
        
        panner.pan.value = (Math.random() * 2) - 1; // Random left/right panning
        
        // Soft attack, very long gentle release
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5); // Increased volume significantly to 30%
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5);
        
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 5.1);
        
        // Schedule next chime randomly between 1.5 and 4 seconds
        (window as any).__ambientTimer = setTimeout(playChime, 1500 + Math.random() * 2500);
      };

      // Start the loop
      playChime();

    } catch (e) {
      console.warn("Ambient sound failed", e);
    }
  },

  stopAmbient: () => {
    try {
      ambientOscillator = null;
      if ((window as any).__ambientTimer) {
         clearTimeout((window as any).__ambientTimer);
      }
    } catch (e) {
      console.warn("Stop ambient failed", e);
    }
  },

  resumeContext: () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(e => console.warn('Failed to resume audio context', e));
    }
  }
};
