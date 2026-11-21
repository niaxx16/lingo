import test from 'node:test';
import assert from 'node:assert/strict';
import { ALPHABET, trUpper, trLower, keyToLetter, isTurkishWord } from '../src/turkish.js';

test('alfabe 29 benzersiz harf', () => {
  assert.equal(ALPHABET.length, 29);
  assert.equal(new Set(ALPHABET).size, 29);
});

test('i/ı büyük-küçük dönüşümleri', () => {
  assert.equal(trUpper('ışık'), 'IŞIK');
  assert.equal(trUpper('iğne'), 'İĞNE');
  assert.equal(trUpper('çöğüş'), 'ÇÖĞÜŞ');
  assert.equal(trLower('IŞIK'), 'ışık');
  assert.equal(trLower('İĞNE'), 'iğne');
  assert.equal(trLower(trUpper('kırmızı diş')), 'kırmızı diş');
});

test('klavye tuşu -> harf', () => {
  assert.equal(keyToLetter('i'), 'İ');
  assert.equal(keyToLetter('ı'), 'I');
  assert.equal(keyToLetter('I'), 'I');
  assert.equal(keyToLetter('İ'), 'İ');
  assert.equal(keyToLetter('ş'), 'Ş');
  assert.equal(keyToLetter('q'), null);
  assert.equal(keyToLetter('w'), null);
  assert.equal(keyToLetter('x'), null);
  assert.equal(keyToLetter('1'), null);
  assert.equal(keyToLetter('Enter'), null);
});

test('isTurkishWord', () => {
  assert.ok(isTurkishWord('GÖKYÜZÜ'));
  assert.ok(!isTurkishWord('WAX'));
  assert.ok(!isTurkishWord('kalem'));
  assert.ok(!isTurkishWord(''));
});
