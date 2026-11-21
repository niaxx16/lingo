// Arayüz katmanı: DOM, klavye, zamanlayıcı, animasyon ve ses. Kurallar game.js'te.

import { Game, CONFIG } from './game.js';
import { keyToLetter } from './turkish.js';
import { play, setSoundEnabled } from './audio.js';
import { loadSettings, saveSettings } from './storage.js';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const KEY_ROWS = ['ERTYUIOPĞÜ', 'ASDFGHJKLŞİ', 'ZCVBNMÖÇ'];
const REVEAL_STEP = 260; // ms, harf harf açılma aralığı

const settings = loadSettings();
setSoundEnabled(settings.sound);

let game = null;
let busy = false; // satır açılırken giriş kilitli
let tiles = []; // tiles[satır][sütun]
const keyEls = new Map();

const timer = { total: 0, left: 0, last: 0, running: false, lastTick: -1 };

// ---------- Pano ----------

function buildBoard() {
  const board = $('board');
  board.style.setProperty('--n', game.length);
  board.style.setProperty('--rows', game.maxAttempts);
  board.replaceChildren();
  tiles = [];
  for (let r = 0; r < game.maxAttempts; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.setAttribute('role', 'row');
    const rowTiles = [];
    for (let c = 0; c < game.length; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.setAttribute('role', 'gridcell');
      row.append(tile);
      rowTiles.push(tile);
    }
    board.append(row);
    tiles.push(rowTiles);
  }
}

/** Aktif satırı (yazılan harfler + ipuçları) çizer. */
function renderCurrentRow() {
  if (game.status !== 'playing') return;
  const r = game.rows.length;
  const typed = [...game.current];
  tiles[r].forEach((tile, c) => {
    const hint = game.hints[c];
    tile.className = 'tile active';
    if (c === 0) {
      tile.textContent = typed[0];
      tile.classList.add('locked');
    } else if (c < typed.length) {
      tile.textContent = typed[c];
      tile.classList.add('filled');
    } else if (hint) {
      tile.textContent = hint;
      tile.classList.add('hint');
    } else {
      tile.textContent = '';
    }
    tile.classList.toggle('cursor', c === typed.length);
  });
}

function popTile(col) {
  const tile = tiles[game.rows.length]?.[col];
  if (!tile) return;
  tile.classList.remove('pop');
  void tile.offsetWidth; // animasyonu yeniden başlat
  tile.classList.add('pop');
}

function shakeRow() {
  const row = tiles[game.rows.length][0].parentElement;
  row.classList.remove('shake');
  void row.offsetWidth;
  row.classList.add('shake');
}

async function revealRow(rowIndex, guess, result) {
  const rowTiles = tiles[rowIndex];
  [...guess].forEach((ch, c) => {
    rowTiles[c].className = 'tile filled';
    rowTiles[c].textContent = ch;
  });
  play('lock');
  await sleep(140);
  for (let c = 0; c < rowTiles.length; c++) {
    const tile = rowTiles[c];
    tile.classList.add('flip');
    await sleep(REVEAL_STEP / 2);
    tile.classList.remove('filled');
    tile.classList.add(result[c]);
    play(result[c]);
    await sleep(REVEAL_STEP / 2);
  }
}

// ---------- Klavye ----------

function buildKeyboard() {
  const kb = $('keyboard');
  kb.replaceChildren();
  KEY_ROWS.forEach((letters, i) => {
    const row = document.createElement('div');
    row.className = 'kb-row';
    if (i === 2) row.append(makeKey('Enter', 'GİR', 'wide enter', 'Tahmini gönder'));
    for (const ch of letters) {
      const key = makeKey(ch, ch);
      keyEls.set(ch, key);
      row.append(key);
    }
    if (i === 2) row.append(makeKey('Backspace', '⌫', 'wide', 'Sil'));
    kb.append(row);
  });
  // Tıklanan tuş odak almasın; fiziksel Enter/boşluk yanlışlıkla tuşu tekrar tetiklemesin.
  kb.addEventListener('mousedown', (e) => e.preventDefault());
  kb.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (key) handleInput(key.dataset.key);
  });
}

function makeKey(value, label, extra = '', aria = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `key ${extra}`.trim();
  btn.dataset.key = value;
  btn.textContent = label;
  if (aria) btn.setAttribute('aria-label', aria);
  return btn;
}

function renderKeyboard() {
  for (const [ch, el] of keyEls) {
    const state = game.keyStates.get(ch) ?? (game.eliminated.has(ch) ? 'absent' : '');
    el.className = `key ${state}`.trim();
  }
}

// ---------- Üst bar / durum ----------

function renderHud() {
  $('score').textContent = game.score;
  $('streak').textContent = game.streak;
  $('round').textContent = `${game.length} harf`;

  const progress = $('progress');
  progress.replaceChildren();
  if (game.mode === 'ladder') {
    const ladder = document.createElement('div');
    ladder.className = 'ladder';
    game.stages.forEach((len, i) => {
      const step = document.createElement('span');
      step.className = 'step';
      if (i < game.stageIndex) step.classList.add('done');
      if (i === game.stageIndex) step.classList.add('now');
      const pips = i < game.stageIndex ? CONFIG.wordsPerStage : i === game.stageIndex ? game.stageProgress : 0;
      step.innerHTML = `<b>${len}</b>` + Array.from({ length: CONFIG.wordsPerStage }, (_, p) => `<i class="${p < pips ? 'on' : ''}"></i>`).join('');
      ladder.append(step);
    });
    const lives = document.createElement('div');
    lives.className = 'lives';
    lives.setAttribute('aria-label', `${game.lives} can`);
    lives.innerHTML = Array.from({ length: CONFIG.lives }, (_, i) => `<span class="${i < game.lives ? 'on' : ''}">♥</span>`).join('');
    progress.append(ladder, lives);
  } else {
    const info = document.createElement('div');
    info.className = 'practice-info';
    info.textContent = `Pratik · ${game.stats.solved}/${game.stats.played} kelime`;
    progress.append(info);
  }

  $('jokerRevealCount').textContent = game.jokers.reveal;
  $('jokerEliminateCount').textContent = game.jokers.eliminate;
  const playing = game.status === 'playing' && !busy;
  $('jokerReveal').disabled = !playing || game.jokers.reveal <= 0 || game.hints.every(Boolean);
  $('jokerEliminate').disabled = !playing || game.jokers.eliminate <= 0;
}

let toastTimer = 0;
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

function renderSound() {
  const btn = $('soundBtn');
  btn.classList.toggle('muted', !settings.sound);
  btn.setAttribute('aria-pressed', String(settings.sound));
  btn.setAttribute('aria-label', settings.sound ? 'Sesi kapat' : 'Sesi aç');
}

// ---------- Zamanlayıcı ----------

function resetTimer() {
  timer.total = settings.timer * 1000;
  timer.left = timer.total;
  timer.lastTick = -1;
  $('timer').hidden = timer.total === 0;
  renderTimer();
}

function startTimer() {
  if (timer.total === 0 || game.status !== 'playing') return;
  timer.running = true;
  timer.last = performance.now();
}

function pauseTimer() {
  timer.running = false;
}

function secondsLeft() {
  return timer.total === 0 ? 0 : Math.ceil(timer.left / 1000);
}

function renderTimer() {
  if (timer.total === 0) return;
  const secs = secondsLeft();
  $('timerFill').style.transform = `scaleX(${Math.max(0, timer.left / timer.total)})`;
  $('timerText').textContent = secs;
  $('timer').classList.toggle('low', secs <= 10);
}

setInterval(() => {
  if (!timer.running) return;
  const now = performance.now();
  timer.left -= now - timer.last;
  timer.last = now;
  const secs = secondsLeft();
  if (secs <= 10 && secs > 0 && secs !== timer.lastTick) {
    timer.lastTick = secs;
    play('tick');
  }
  if (timer.left <= 0) {
    timer.left = 0;
    pauseTimer();
    renderTimer();
    if (game.timeUp()) endRound();
    return;
  }
  renderTimer();
}, 100);

// ---------- Oyun akışı ----------

function newGame() {
  game = new Game({
    mode: settings.mode,
    length: settings.practiceLength,
    include7: settings.include7,
    validation: settings.validation,
  });
  beginWord();
}

function beginWord() {
  busy = false;
  buildBoard();
  renderCurrentRow();
  renderKeyboard();
  renderHud();
  resetTimer();
  startTimer();
}

async function handleInput(key) {
  if (!game || busy || game.status !== 'playing' || openModal()) return;

  if (key === 'Backspace') {
    if (game.backspace()) {
      play('del');
      renderCurrentRow();
    }
    return;
  }

  if (key === 'Enter') {
    await submitGuess();
    return;
  }

  if (game.type(key)) {
    play('key');
    renderCurrentRow();
    popTile(game.current.length - 1);
  }
}

async function submitGuess() {
  const rowIndex = game.rows.length;
  const guess = game.current;
  const outcome = game.submit(secondsLeft());

  if (!outcome.ok) {
    if (outcome.reason === 'finished') return;
    play('error');
    shakeRow();
    toast(outcome.reason === 'short' ? `Kelime ${game.length} harfli olmalı` : 'Bu kelime sözlükte yok');
    return;
  }

  busy = true;
  pauseTimer();
  renderHud();
  await revealRow(rowIndex, guess, outcome.result);
  renderKeyboard();

  if (game.status === 'playing') {
    busy = false;
    renderCurrentRow();
    renderHud();
    if (!openModal()) startTimer();
  } else {
    await endRound(rowIndex);
  }
}

async function endRound(winRow = -1) {
  busy = true;
  pauseTimer();
  const round = game.lastRound;
  renderHud();

  if (round.won) {
    tiles[winRow]?.forEach((tile, c) => {
      tile.style.animationDelay = `${c * 70}ms`;
      tile.classList.add('win');
    });
    play(round.levelUp || game.gameEnd === 'champion' ? 'levelup' : 'win');
    await sleep(900);
  } else {
    play('lose');
    await sleep(500);
  }
  showResult();
}

function showResult() {
  const round = game.lastRound;
  const end = game.gameEnd;

  $('resultKicker').textContent = end === 'champion' ? 'Yarışma tamamlandı' : end === 'gameover' ? 'Oyun bitti' : round.won ? 'Doğru!' : round.reason === 'time' ? 'Süre doldu' : 'Haklar tükendi';
  $('resultTitle').textContent = end === 'champion' ? 'Şampiyonsun!' : round.won ? (round.attempts === 1 ? 'İlk denemede!' : 'Bildin!') : 'Kelime buydu';

  const word = $('resultWord');
  word.replaceChildren(
    ...[...round.word].map((ch) => {
      const tile = document.createElement('span');
      tile.className = 'tile correct mini';
      tile.textContent = ch;
      return tile;
    }),
  );
  $('resultMeaning').textContent = round.meaning;

  const stats = [
    ['Kazanılan', `+${round.points}`],
    ['Deneme', round.won ? `${round.attempts}/${game.maxAttempts}` : '—'],
    ['Seri', game.streak],
  ];
  let note = '';

  if (end || game.mode === 'practice') {
    const avg = game.stats.solved ? (game.stats.attemptsOnSolved / game.stats.solved).toFixed(1) : '—';
    if (end) stats[2] = ['En iyi seri', game.bestStreak];
    stats.push(['Toplam puan', game.score], ['Bilinen kelime', `${game.stats.solved}/${game.stats.played}`], ['Ort. deneme', avg]);
  }
  if (end) {
    const previous = settings.best[game.mode] ?? 0;
    if (game.score > previous) {
      settings.best[game.mode] = game.score;
      saveSettings(settings);
      note = `Yeni rekor: ${game.score} puan!`;
    } else {
      note = `Rekorun: ${previous} puan`;
    }
    if (round.lifeBonus) note += ` · Kalan canlar için +${round.lifeBonus} bonus`;
  } else if (round.levelUp) {
    note = `Tur atladın: sırada ${round.levelUp} harfli kelimeler!`;
  } else if (round.jokersRefilled) {
    note = 'Jokerlerin yenilendi.';
  } else if (!round.won && game.mode === 'ladder') {
    note = `Bir can gitti · Kalan can: ${game.lives}`;
  }

  $('resultStats').replaceChildren(
    ...stats.map(([label, value]) => {
      const el = document.createElement('div');
      el.className = 'result-stat';
      el.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      return el;
    }),
  );
  $('resultNote').textContent = note;
  $('resultPrimary').textContent = end ? 'Yeniden Oyna' : 'Yeni Tur';
  $('resultSecondary').textContent = end ? 'Ana Menü' : game.mode === 'practice' ? 'Oyunu Bitir' : 'Ana Menü';
  $('resultModal').querySelector('.card').classList.toggle('lost', !round.won);
  show('resultModal');
}

// ---------- Modallar ----------

function openModal() {
  return document.querySelector('.modal:not([hidden])');
}

function show(id) {
  pauseTimer();
  $(id).hidden = false;
  $(id).querySelector('[data-primary]')?.focus();
}

function hide(id) {
  $(id).hidden = true;
  if (!openModal() && game && !busy) startTimer();
}

function renderStartModal() {
  document.querySelectorAll('.mode').forEach((el) => {
    const on = el.dataset.mode === settings.mode;
    el.classList.toggle('selected', on);
    el.setAttribute('aria-checked', String(on));
  });
  document.querySelectorAll('#lengthChips .chip').forEach((el) => {
    const on = Number(el.dataset.length) === settings.practiceLength;
    el.classList.toggle('selected', on);
    el.setAttribute('aria-checked', String(on));
  });
  $('lengthOption').hidden = settings.mode !== 'practice';
  $('include7Option').hidden = settings.mode !== 'ladder';
  $('include7').checked = settings.include7;
  $('ladderDesc').textContent = `${settings.include7 ? '4 → 5 → 6 → 7' : '4 → 5 → 6'} harf. Her turda ${CONFIG.wordsPerStage} kelime, ${CONFIG.lives} can.`;
  $('timerSelect').value = String(settings.timer);
  $('validationSelect').value = settings.validation;
  const best = settings.best[settings.mode] ?? 0;
  $('bestLine').textContent = best > 0 ? `Bu moddaki rekorun: ${best} puan` : '';
  $('startModal').querySelector('.close').hidden = !game || Boolean(game.gameEnd);
}

function openStart() {
  renderStartModal();
  show('startModal');
}

function wireEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const modal = openModal();
    if (modal) {
      if (e.key === 'Enter' && !['BUTTON', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        modal.querySelector('[data-primary]')?.click();
      } else if (e.key === 'Escape') {
        const close = modal.querySelector('.close:not([hidden])');
        close?.click();
      }
      return;
    }
    if (e.key === 'Enter' || e.key === 'Backspace') {
      e.preventDefault();
      handleInput(e.key);
      return;
    }
    const letter = keyToLetter(e.key);
    if (letter) handleInput(letter);
  });

  $('soundBtn').addEventListener('click', () => {
    settings.sound = !settings.sound;
    setSoundEnabled(settings.sound);
    saveSettings(settings);
    renderSound();
    play('key');
  });
  // Satır açılırken (busy) modal açılmaz; animasyon ve tur sonu akışı bölünmesin.
  $('helpBtn').addEventListener('click', () => busy || show('helpModal'));
  $('menuBtn').addEventListener('click', () => busy || openStart());

  document.querySelectorAll('[data-close]').forEach((el) =>
    el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      hide(modal.id);
      if (modal.id === 'helpModal' && !game) openStart();
    }),
  );

  document.querySelectorAll('.mode').forEach((el) =>
    el.addEventListener('click', () => {
      settings.mode = el.dataset.mode;
      renderStartModal();
    }),
  );
  $('lengthChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    settings.practiceLength = Number(chip.dataset.length);
    renderStartModal();
  });
  $('include7').addEventListener('change', (e) => {
    settings.include7 = e.target.checked;
    renderStartModal();
  });
  $('timerSelect').addEventListener('change', (e) => (settings.timer = Number(e.target.value)));
  $('validationSelect').addEventListener('change', (e) => (settings.validation = e.target.value));

  $('startBtn').addEventListener('click', () => {
    saveSettings(settings);
    $('startModal').hidden = true;
    newGame();
  });

  $('resultPrimary').addEventListener('click', () => {
    $('resultModal').hidden = true;
    if (game.gameEnd) newGame();
    else if (game.next()) beginWord();
  });
  $('resultSecondary').addEventListener('click', () => {
    $('resultModal').hidden = true;
    if (game.mode === 'practice' && !game.gameEnd) {
      // Pratik modunu oyuncu bitirir: özet ve rekor için oyunu kapat.
      game.gameEnd = 'gameover';
      showResult();
      return;
    }
    game.gameEnd ??= 'gameover';
    openStart();
  });

  $('jokerReveal').addEventListener('click', () => {
    if (busy || openModal()) return;
    const index = game.useRevealJoker();
    if (index === null) return;
    play('joker');
    renderCurrentRow();
    const tile = tiles[game.rows.length][index];
    tile.classList.add('revealed');
    renderHud();
  });
  $('jokerEliminate').addEventListener('click', () => {
    if (busy || openModal()) return;
    const picked = game.useEliminateJoker();
    if (!picked) return;
    play('joker');
    renderKeyboard();
    picked.forEach((ch) => keyEls.get(ch)?.classList.add('eliminated'));
    toast(`Elenen harfler: ${picked.join(' ')}`);
    renderHud();
  });

  // Sekme arka plana geçince süre işlemesin.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseTimer();
    else if (!openModal() && game && !busy) startTimer();
  });
}

buildKeyboard();
wireEvents();
renderSound();

if (settings.seenHelp) {
  openStart();
} else {
  settings.seenHelp = true;
  saveSettings(settings);
  show('helpModal');
}
