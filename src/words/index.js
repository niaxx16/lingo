// Kelime havuzu API'si. Oyun yalnızca bu modülü kullanır; listeler ayrı dosyalarda durur:
//   targets.js    -> sorulan kelimeler + anlamları (elle seçilmiş)
//   dictionary.js -> geçerli tahmin sözlüğü (otomatik üretilmiş, geniş)

import { TARGETS } from './targets.js';
import { DICTIONARY } from './dictionary.js';
import { trUpper, isTurkishWord } from '../turkish.js';

export const WORD_LENGTHS = [4, 5, 6, 7];

/** Sözlükte olmayıp kabul edilmesini istediğiniz kelimeleri buraya ekleyin. */
export const EXTRA_VALID_WORDS = [];

/**
 * Geçerlilik modları:
 *   strict  -> tahmin sözlükte (veya hedef havuzunda) olmalı
 *   lenient -> doğru uzunlukta ve Türkçe harflerden oluşan her dizi kabul edilir
 */
export const VALIDATION_MODES = ['strict', 'lenient'];

const targetCache = new Map();
const validCache = new Map();

export function getTargets(length) {
  if (!targetCache.has(length)) {
    const list = (TARGETS[length] ?? []).map(({ word, meaning }) => ({
      word: trUpper(word),
      meaning,
    }));
    targetCache.set(length, list);
  }
  return targetCache.get(length);
}

function getValidSet(length) {
  if (!validCache.has(length)) {
    const set = new Set((DICTIONARY[length] ?? '').split(' ').filter(Boolean).map(trUpper));
    for (const { word } of getTargets(length)) set.add(word);
    for (const word of EXTRA_VALID_WORDS) {
      const upper = trUpper(word);
      if (upper.length === length) set.add(upper);
    }
    validCache.set(length, set);
  }
  return validCache.get(length);
}

export function dictionarySize(length) {
  return getValidSet(length).size;
}

/** `word` büyük harfli (trUpper) olmalıdır. */
export function isValidGuess(word, mode = 'strict') {
  if (!WORD_LENGTHS.includes(word.length) || !isTurkishWord(word)) return false;
  if (mode === 'lenient') return true;
  return getValidSet(word.length).has(word);
}

/** Daha önce sorulmamış rastgele bir hedef seçer; havuz biterse baştan başlar. */
export function pickTarget(length, used = new Set(), rng = Math.random) {
  const all = getTargets(length);
  if (all.length === 0) throw new Error(`${length} harfli hedef kelime yok`);
  let pool = all.filter((t) => !used.has(t.word));
  if (pool.length === 0) pool = all;
  return pool[Math.floor(rng() * pool.length)];
}
