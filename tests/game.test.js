import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, CONFIG } from '../src/game.js';

function typeWord(game, word) {
  while (game.backspace());
  for (const ch of [...word].slice(1)) game.type(ch);
}
function solve(game, seconds = 0) {
  typeWord(game, game.target);
  return game.submit(seconds);
}
function wrongGuess(game) {
  // lenient modda hedefle aynı harfle başlayan ama yanlış bir dizi
  const filler = game.target.includes('Z') ? 'V' : 'Z';
  typeWord(game, game.target[0] + filler.repeat(game.length - 1));
  return game.submit();
}

test('ilk harf açık ve silinemez', () => {
  const g = new Game({ mode: 'practice', length: 5 });
  assert.equal(g.current, g.target[0]);
  assert.equal(g.hints[0], g.target[0]);
  assert.equal(g.backspace(), false);
  assert.equal(g.current.length, 1);
});

test('kısa ve geçersiz tahmin hak götürmez', () => {
  const g = new Game({ mode: 'practice', length: 5, validation: 'strict' });
  assert.deepEqual(g.submit(), { ok: false, reason: 'short' });
  typeWord(g, g.target[0] + 'ĞĞĞĞ');
  assert.deepEqual(g.submit(), { ok: false, reason: 'invalid' });
  assert.equal(g.rows.length, 0);
});

test('yarışma: 4 harften başlar, 2 doğru kelimede bir üst tura geçer, sonunda şampiyon', () => {
  const g = new Game({ mode: 'ladder', include7: true });
  const lengths = [];
  while (!g.gameEnd) {
    lengths.push(g.length);
    assert.equal(solve(g, 30).status, 'won');
    g.next();
  }
  assert.deepEqual(lengths, [4, 4, 5, 5, 6, 6, 7, 7]);
  assert.equal(g.gameEnd, 'champion');
  assert.equal(g.lastRound.lifeBonus, CONFIG.lives * CONFIG.championLifeBonus);
  assert.equal(g.bestStreak, 8);
  assert.equal(g.next(), false);
});

test('yarışma: 7 harfli tur kapatılabilir', () => {
  const g = new Game({ mode: 'ladder', include7: false });
  assert.deepEqual(g.stages, [4, 5, 6]);
});

test('haklar bitince can gider, canlar bitince oyun biter', () => {
  const g = new Game({ mode: 'ladder', validation: 'lenient' });
  for (let life = CONFIG.lives; life > 0; life--) {
    assert.equal(g.lives, life);
    for (let i = 0; i < CONFIG.maxAttempts; i++) wrongGuess(g);
    assert.equal(g.status, 'lost');
    assert.equal(g.lastRound.reason, 'attempts');
    assert.equal(g.streak, 0);
    g.next();
  }
  assert.equal(g.gameEnd, 'gameover');
  assert.equal(g.score, 0);
});

test('süre dolunca tur kaybedilir', () => {
  const g = new Game({ mode: 'practice', length: 6 });
  assert.ok(g.timeUp());
  assert.equal(g.status, 'lost');
  assert.equal(g.lastRound.reason, 'time');
  assert.equal(g.timeUp(), false);
});

test('puan: az deneme ve seri daha çok kazandırır', () => {
  const g = new Game({ mode: 'practice', length: 5 });
  solve(g);
  const first = g.lastRound.points;
  assert.equal(first, 5 * 10 + (CONFIG.maxAttempts - 1) * 15);
  g.next();
  solve(g);
  assert.ok(g.lastRound.points > first, 'seri çarpanı uygulanmalı');
  assert.equal(g.score, first + g.lastRound.points);
});

test('harf açma jokeri bilinmeyen bir konumu açar ve tükenir', () => {
  const g = new Game({ mode: 'practice', length: 6 });
  const i = g.useRevealJoker();
  assert.ok(i > 0);
  assert.equal(g.hints[i], g.target[i]);
  assert.equal(g.useRevealJoker(), null);
});

test('eleme jokeri yalnızca kelimede olmayan harfleri eler', () => {
  const g = new Game({ mode: 'practice', length: 7 });
  const picked = g.useEliminateJoker();
  assert.equal(picked.length, CONFIG.eliminateCount);
  for (const ch of picked) assert.ok(!g.target.includes(ch));
  assert.equal(g.useEliminateJoker(), null);
});

test('doğru konumdaki harfler sonraki satır için ipucu olur', () => {
  const g = new Game({ mode: 'practice', length: 4, validation: 'lenient' });
  const t = g.target;
  const filler = t.includes('Z') ? 'V' : 'Z';
  typeWord(g, t[0] + filler + t[2] + filler);
  g.submit();
  assert.equal(g.hints[2], t[2]);
  assert.equal(g.hints[1], null);
  assert.equal(g.current, t[0]);
  assert.equal(g.keyStates.get(filler), 'absent');
});
