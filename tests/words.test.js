import test from 'node:test';
import assert from 'node:assert/strict';
import { WORD_LENGTHS, getTargets, isValidGuess, pickTarget, dictionarySize } from '../src/words/index.js';
import { isTurkishWord } from '../src/turkish.js';

test('hedef kelimeler: doğru uzunluk, Türkçe harfler, tekrar yok, anlam dolu', () => {
  for (const len of WORD_LENGTHS) {
    const list = getTargets(len);
    assert.ok(list.length >= 40, `${len} harfli havuz çok küçük (${list.length})`);
    const seen = new Set();
    for (const { word, meaning } of list) {
      assert.equal([...word].length, len, `${word} ${len} harfli değil`);
      assert.ok(isTurkishWord(word), `${word} geçersiz harf içeriyor`);
      assert.ok(!seen.has(word), `${word} tekrar ediyor`);
      assert.ok(meaning.length > 2, `${word} için anlam yok`);
      seen.add(word);
    }
  }
});

test('her hedef kelime sıkı modda geçerli tahmindir', () => {
  for (const len of WORD_LENGTHS) {
    for (const { word } of getTargets(len)) assert.ok(isValidGuess(word, 'strict'), word);
    assert.ok(dictionarySize(len) > 1000);
  }
});

test('geçerlilik modları', () => {
  assert.ok(isValidGuess('KİTAP', 'strict'));
  assert.ok(!isValidGuess('KZZZP', 'strict'));
  assert.ok(isValidGuess('KZZZP', 'lenient'));
  assert.ok(!isValidGuess('KWXQP', 'lenient'));
  assert.ok(!isValidGuess('EV', 'lenient'));
  assert.ok(!isValidGuess('kitap', 'strict'), 'küçük harf kabul edilmez');
});

test('pickTarget kullanılmış kelimeleri atlar', () => {
  const all = getTargets(4);
  const used = new Set(all.slice(1).map((t) => t.word));
  assert.equal(pickTarget(4, used).word, all[0].word);
  used.add(all[0].word);
  assert.ok(pickTarget(4, used).word); // havuz bitince baştan
});
