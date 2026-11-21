import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, isSolved } from '../src/engine.js';

const C = 'correct', P = 'present', A = 'absent';

test('tam eşleşme', () => {
  const r = evaluate('KALEM', 'KALEM');
  assert.deepEqual(r, [C, C, C, C, C]);
  assert.ok(isSolved(r));
});

test('hiç eşleşme yok', () => {
  assert.deepEqual(evaluate('BULUT', 'İNCİR'), [A, A, A, A, A]);
});

test('doğru harf, yanlış konum', () => {
  assert.deepEqual(evaluate('MASA', 'ASMA'), [P, P, P, C]);
});

test('KAZAK: tahminde fazla tekrar eden harf yalnızca hedefteki kadar renklenir', () => {
  // Hedefte 2 K, 2 A var.
  assert.deepEqual(evaluate('KAKAO', 'KAZAK'), [C, C, P, C, A]);
  // Tahminde 3 A: ikisi yerinde, üçüncüsü yok sayılır.
  assert.deepEqual(evaluate('ARABA', 'KAZAK'), [P, A, P, A, A]);
  assert.deepEqual(evaluate('KAZAK', 'KAZAK'), [C, C, C, C, C]);
});

test('SÜS: tek S içeren tahmin ve çift S içeren hedef', () => {
  assert.deepEqual(evaluate('SÜS', 'SÜS'), [C, C, C]);
  assert.deepEqual(evaluate('SSÜ', 'SÜS'), [C, P, P]);
  // Hedefte tek S: ikinci S absent olmalı
  assert.deepEqual(evaluate('SÜS', 'SÜT'), [C, C, A]);
});

test('doğru konum eşleşmesi, yanlış konum eşleşmesinden önce sayılır', () => {
  // Hedef ELMA'da tek A var ve tahminin son A'sı yerinde: baştaki A absent kalır.
  assert.deepEqual(evaluate('AYNA', 'ELMA'), [A, A, A, C]);
  // Hedefte tek E: yerindeki E sayılır, öndeki E absent.
  assert.deepEqual(evaluate('EKLE', 'KALE'), [A, P, C, C]);
});

test('Türkçe I / İ ayrı harflerdir', () => {
  assert.deepEqual(evaluate('IŞIK', 'İŞİN'), [A, C, A, A]);
});

test('uzunluk uyuşmazlığı hata verir', () => {
  assert.throws(() => evaluate('MASA', 'KALEM'));
});
