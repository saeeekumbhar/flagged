// A simple synthesizer using Web Audio API to avoid external assets.

let audioCtx: AudioContext | null = null;
let ambientAudio: HTMLAudioElement | null = null;

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
      if (!ambientAudio) {
        ambientAudio = new Audio('/forest-ambient.mp3');
        ambientAudio.loop = true;
        ambientAudio.volume = 0;
      }
      
      ambientAudio.play().then(() => {
        // Fade in
        let vol = 0;
        const fade = setInterval(() => {
          if (vol < 0.4) {
            vol += 0.05;
            if (ambientAudio) ambientAudio.volume = Math.min(vol, 0.4);
          } else {
            clearInterval(fade);
          }
        }, 200);
      }).catch(e => {
        console.warn("Autoplay blocked for forest ambient", e);
      });
    } catch (e) {
      console.warn("Ambient sound failed", e);
    }
  },

  stopAmbient: () => {
    try {
      if (ambientAudio) {
        // Fade out
        let vol = ambientAudio.volume;
        const fade = setInterval(() => {
          if (vol > 0.05) {
            vol -= 0.05;
            if (ambientAudio) ambientAudio.volume = Math.max(vol, 0);
          } else {
            clearInterval(fade);
            if (ambientAudio) {
               ambientAudio.pause();
               ambientAudio.volume = 0;
            }
          }
        }, 100);
      }
    } catch (e) {
      console.warn("Stop ambient failed", e);
    }
  },

  resumeContext: () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(e => console.warn('Failed to resume audio context', e));
    }
    // Also try to play the ambient audio if it was blocked
    if (ambientAudio && ambientAudio.paused && ambientAudio.volume > 0) {
      ambientAudio.play().catch(e => console.warn('Failed to resume forest ambient', e));
    }
  }
};
