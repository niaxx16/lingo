// Harf eşleştirme motoru. Saf fonksiyonlar; DOM'a veya oyun durumuna bağlı değildir.

export const CORRECT = 'correct'; // doğru harf, doğru konum
export const PRESENT = 'present'; // doğru harf, yanlış konum
export const ABSENT = 'absent'; // kelimede yok (ya da hakkı tükenmiş tekrar)

/**
 * Tahmini hedefle karşılaştırır. İki geçişli sayım kullanır:
 * 1) Tam konum eşleşmeleri işaretlenir, kalan hedef harfleri sayılır.
 * 2) Kalan harfler soldan sağa, hedefte hâlâ karşılığı varsa "yanlış konum" olur.
 * Böylece bir harf, hedefte bulunduğu sayıdan fazla kez renklenmez.
 */
export function evaluate(guess, target) {
  const g = [...guess];
  const t = [...target];
  if (g.length !== t.length) {
    throw new Error(`Uzunluk uyuşmuyor: ${guess} / ${target}`);
  }

  const result = new Array(g.length).fill(ABSENT);
  const remaining = new Map();

  for (let i = 0; i < g.length; i++) {
    if (g[i] === t[i]) {
      result[i] = CORRECT;
    } else {
      remaining.set(t[i], (remaining.get(t[i]) ?? 0) + 1);
    }
  }

  for (let i = 0; i < g.length; i++) {
    if (result[i] === CORRECT) continue;
    const left = remaining.get(g[i]) ?? 0;
    if (left > 0) {
      result[i] = PRESENT;
      remaining.set(g[i], left - 1);
    }
  }

  return result;
}

export function isSolved(result) {
  return result.every((r) => r === CORRECT);
}
