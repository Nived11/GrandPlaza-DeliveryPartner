// Web Audio API generator for delivery alerts & chimes

let audioCtx: AudioContext | null = null;
let alertLoopInterval: NodeJS.Timeout | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * 🚨 Loud incoming order alert tone (2-tone pulsing ring)
 */
export const playSingleOrderChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const tones = [
      { freq: 659.25, start: 0, duration: 0.14 },    // E5
      { freq: 880.00, start: 0.15, duration: 0.16 },  // A5
      { freq: 659.25, start: 0.32, duration: 0.14 },  // E5
      { freq: 1046.50, start: 0.47, duration: 0.35 }, // C6
    ];

    tones.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.35, now + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (err) {
    console.debug('Audio chime inhibited:', err);
  }
};

/**
 * 🔁 Start looping incoming order alert until accepted or dismissed
 */
export const startIncomingOrderLoop = () => {
  stopIncomingOrderLoop();
  playSingleOrderChime();
  alertLoopInterval = setInterval(() => {
    playSingleOrderChime();
  }, 1800);
};

/**
 * ⏹️ Stop incoming order alert loop
 */
export const stopIncomingOrderLoop = () => {
  if (alertLoopInterval) {
    clearInterval(alertLoopInterval);
    alertLoopInterval = null;
  }
};

/**
 * 🎉 Success chime on delivery completion
 */
export const playDeliveryCompleteChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (err) {
    console.debug('Audio error:', err);
  }
};
