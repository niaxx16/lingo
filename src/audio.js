// Web Audio API ile sentezlenen ses efektleri. Harici ses dosyası yoktur.
// AudioContext ilk kullanıcı etkileşiminde (ilk ses isteğinde) oluşturulur.

let ctx = null;
let enabled = true;

function getContext() {
  const Ctor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Tek bir nota: frekans (Hz), başlangıç gecikmesi ve süre saniye cinsinden. */
function tone(freq, { at = 0, dur = 0.12, type = 'sine', gain = 0.12, slideTo = null } = {}) {
  const ac = getContext();
  if (!ac) return;
  const start = ac.currentTime + at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

const SOUNDS = {
  key: () => tone(520, { dur: 0.05, type: 'triangle', gain: 0.07 }),
  del: () => tone(300, { dur: 0.05, type: 'triangle', gain: 0.06 }),
  error: () => {
    tone(150, { dur: 0.16, type: 'sawtooth', gain: 0.08 });
    tone(110, { at: 0.09, dur: 0.2, type: 'sawtooth', gain: 0.08 });
  },
  lock: () => tone(220, { dur: 0.08, type: 'square', gain: 0.05 }),
  correct: () => tone(880, { dur: 0.16, type: 'triangle', gain: 0.13 }),
  present: () => tone(587, { dur: 0.14, type: 'triangle', gain: 0.11 }),
  absent: () => tone(196, { dur: 0.1, type: 'sine', gain: 0.1 }),
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, { at: i * 0.09, dur: 0.22, type: 'triangle' })),
  lose: () => {
    tone(392, { dur: 0.25, type: 'sawtooth', gain: 0.07, slideTo: 300 });
    tone(294, { at: 0.22, dur: 0.45, type: 'sawtooth', gain: 0.07, slideTo: 150 });
  },
  joker: () => {
    tone(660, { dur: 0.1, type: 'sine' });
    tone(990, { at: 0.08, dur: 0.18, type: 'sine' });
  },
  tick: () => tone(1200, { dur: 0.03, type: 'square', gain: 0.03 }),
  levelup: () => [392, 523, 659, 784, 1047, 1568].forEach((f, i) => tone(f, { at: i * 0.07, dur: 0.25, type: 'square', gain: 0.06 })),
};

export function play(name) {
  if (!enabled) return;
  try {
    SOUNDS[name]?.();
  } catch {
    // Ses çalınamazsa oyun sessizce devam eder.
  }
}

export function setSoundEnabled(value) {
  enabled = Boolean(value);
}

export function isSoundEnabled() {
  return enabled;
}
