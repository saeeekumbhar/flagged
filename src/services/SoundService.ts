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

      ambientOscillator = ctx.createOscillator();
      ambientGain = ctx.createGain();

      ambientOscillator.type = 'sine';
      ambientOscillator.frequency.value = 110; // Low A drone

      // Add a slow LFO to the gain to make it "breathe"
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // Very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;

      lfo.connect(lfoGain);
      lfoGain.connect(ambientGain.gain);

      // Master gain for ambient
      ambientGain.gain.setValueAtTime(0.01, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2); // fade in

      ambientOscillator.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOscillator.start();
      lfo.start();
    } catch (e) {
      console.warn("Ambient sound failed", e);
    }
  },

  stopAmbient: () => {
    try {
      if (ambientOscillator && ambientGain && audioCtx) {
        ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); // fade out
        ambientOscillator.stop(audioCtx.currentTime + 1);
        ambientOscillator = null;
        ambientGain = null;
      }
    } catch (e) {
      console.warn("Stop ambient failed", e);
    }
  }
};
