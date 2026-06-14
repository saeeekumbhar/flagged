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

      // We use a node graph to create a beautiful, soft ambient pad
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 5); // Increased volume from 0.06 to 0.2
      masterGain.connect(ctx.destination);

      // Create a soft lowpass filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800; // Increased to let higher frequencies through
      filter.connect(masterGain);

      // Slow LFO to make the filter "breathe" (foresty/galactic feel)
      const filterLfo = ctx.createOscillator();
      filterLfo.type = 'sine';
      filterLfo.frequency.value = 0.05; // 20 second cycle
      const filterLfoGain = ctx.createGain();
      filterLfoGain.gain.value = 300; 
      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);
      filterLfo.start();

      // Frequencies for a soothing, spacey chord (Cmaj9: C4, E4, G4, B4)
      const freqs = [261.63, 329.63, 392.00, 493.88];
      const oscs: OscillatorNode[] = [];
      
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle'; // Softer tone
        osc.frequency.value = freq + (Math.random() * 0.4 - 0.2); // Slight detune
        
        // Panner to spread the chord
        const panner = ctx.createStereoPanner();
        panner.pan.value = (i % 2 === 0 ? 1 : -1) * (Math.random() * 0.5 + 0.2);

        // Individual LFO for volume shimmer
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.4;
        lfo.connect(lfoGain);
        
        const voiceGain = ctx.createGain();
        voiceGain.gain.value = 0.5;
        lfoGain.connect(voiceGain.gain);

        osc.connect(voiceGain);
        voiceGain.connect(panner);
        panner.connect(filter);
        
        osc.start();
        lfo.start();
        oscs.push(osc);
      });

      // Store references to stop later
      ambientOscillator = oscs[0]; 
      ambientGain = masterGain;
      (window as any).__ambientOscs = oscs;
      (window as any).__ambientLfo = filterLfo;

    } catch (e) {
      console.warn("Ambient sound failed", e);
    }
  },

  stopAmbient: () => {
    try {
      if (ambientGain && audioCtx) {
        // Fade out
        ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3);
        
        setTimeout(() => {
          if ((window as any).__ambientOscs) {
            (window as any).__ambientOscs.forEach((osc: any) => {
              try { osc.stop(); } catch(e){}
            });
          }
          if ((window as any).__ambientLfo) {
             try { (window as any).__ambientLfo.stop(); } catch(e){}
          }
          ambientOscillator = null;
          ambientGain = null;
        }, 3100);
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
