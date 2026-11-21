// Ayarlar ve rekorlar için localStorage sarmalayıcısı. Depolama kullanılamıyorsa
// (gizli sekme, engelli site verisi) oyun varsayılanlarla çalışmaya devam eder.

const KEY = 'harfiyen:v1';

export const DEFAULT_SETTINGS = {
  sound: true,
  mode: 'ladder', // ladder | practice
  practiceLength: 5,
  include7: true,
  timer: 90, // saniye; 0 = süresiz
  validation: 'strict', // strict | lenient
  seenHelp: false,
  best: { ladder: 0, practice: 0 },
};

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { ...DEFAULT_SETTINGS, ...saved, best: { ...DEFAULT_SETTINGS.best, ...saved.best } };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // yoksay
  }
}
