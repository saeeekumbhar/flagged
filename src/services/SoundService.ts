// A simple synthesizer using Web Audio API to avoid external assets.

let audioCtx: AudioContext | null = null;

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
    console.log("Ambient music disabled to save repository size.");
  },

  stopAmbient: () => {
    // Stubbed
  },

  resumeContext: () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(e => console.warn('Failed to resume audio context', e));
    }
  }
};
