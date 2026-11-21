// Türkçe harf işlemleri. Ortamın locale desteğine güvenmemek için i/ı dönüşümleri
// açıkça yapılır: i -> İ, ı -> I (ve tersi).

export const ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

const ALPHABET_SET = new Set(ALPHABET);

export function trUpper(text) {
  return text.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
}

export function trLower(text) {
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
}

export function isTurkishLetter(ch) {
  return ALPHABET_SET.has(ch);
}

/** Yalnızca Türk alfabesindeki büyük harflerden mi oluşuyor? */
export function isTurkishWord(word) {
  return word.length > 0 && [...word].every(isTurkishLetter);
}

/**
 * Fiziksel klavyeden gelen tuşu oyundaki büyük harfe çevirir; harf değilse null.
 * Türkçe olmayan klavyelerde: "i" -> İ, Shift+"i" (yani "I") -> I.
 */
export function keyToLetter(key) {
  if (typeof key !== 'string' || key.length !== 1) return null;
  const upper = trUpper(key);
  return isTurkishLetter(upper) ? upper : null;
}
