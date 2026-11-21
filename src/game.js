// Oyun durumu ve kuralları. DOM, zamanlayıcı ve ses içermez; arayüz bu sınıfı sürer.

import { evaluate, isSolved, CORRECT, PRESENT, ABSENT } from './engine.js';
import { ALPHABET } from './turkish.js';
import { pickTarget, isValidGuess } from './words/index.js';

export const CONFIG = {
  maxAttempts: 5,
  lives: 3, // yarışma modunda can
  wordsPerStage: 2, // bir üst harf sayısına geçmek için bilinmesi gereken kelime
  jokers: { reveal: 1, eliminate: 1 },
  eliminateCount: 5, // "ele" jokerinin kapattığı harf sayısı
  practiceJokerRefill: 5, // pratik modunda kaç kelimede bir joker yenilenir
  championLifeBonus: 100,
};

const KEY_RANK = { [ABSENT]: 1, [PRESENT]: 2, [CORRECT]: 3 };

export class Game {
  /**
   * @param {object} opts
   * @param {'ladder'|'practice'} opts.mode  ladder: 4→5→6(→7) kademeli; practice: sabit uzunluk
   * @param {number} [opts.length]           pratik modunda harf sayısı
   * @param {boolean} [opts.include7]        yarışma modunda 7 harfli tur olsun mu
   * @param {'strict'|'lenient'} [opts.validation]
   * @param {() => number} [opts.rng]
   */
  constructor({ mode = 'ladder', length = 5, include7 = true, validation = 'strict', rng = Math.random } = {}) {
    this.mode = mode;
    this.validation = validation;
    this.rng = rng;
    this.stages = mode === 'ladder' ? (include7 ? [4, 5, 6, 7] : [4, 5, 6]) : [length];
    this.stageIndex = 0;
    this.stageProgress = 0;
    this.lives = mode === 'ladder' ? CONFIG.lives : Infinity;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.jokers = { ...CONFIG.jokers };
    this.stats = { played: 0, solved: 0, attemptsOnSolved: 0 };
    this.used = new Set();
    this.gameEnd = null; // null | 'gameover' | 'champion'
    this.startWord();
  }

  get length() {
    return this.stages[this.stageIndex];
  }

  get maxAttempts() {
    return CONFIG.maxAttempts;
  }

  startWord() {
    const { word, meaning } = pickTarget(this.length, this.used, this.rng);
    this.used.add(word);
    this.target = word;
    this.meaning = meaning;
    this.rows = []; // { guess, result }
    this.current = word[0]; // ilk harf her zaman açık ve sabit
    this.hints = [...word].map((ch, i) => (i === 0 ? ch : null)); // bilinen doğru konumlar
    this.keyStates = new Map(); // harf -> correct | present | absent
    this.eliminated = new Set(); // jokerle elenen harfler
    this.status = 'playing'; // playing | won | lost
    this.lastRound = null;
  }

  type(letter) {
    if (this.status !== 'playing' || this.current.length >= this.length) return false;
    if (!ALPHABET.includes(letter)) return false;
    this.current += letter;
    return true;
  }

  backspace() {
    if (this.status !== 'playing' || this.current.length <= 1) return false;
    this.current = this.current.slice(0, -1);
    return true;
  }

  /** @returns {{ok:false, reason:'short'|'invalid'|'finished'} | {ok:true, result:string[], status:string}} */
  submit(secondsLeft = 0) {
    if (this.status !== 'playing') return { ok: false, reason: 'finished' };
    if (this.current.length < this.length) return { ok: false, reason: 'short' };
    if (!isValidGuess(this.current, this.validation)) return { ok: false, reason: 'invalid' };

    const guess = this.current;
    const result = evaluate(guess, this.target);
    this.rows.push({ guess, result });

    [...guess].forEach((ch, i) => {
      if (result[i] === CORRECT) this.hints[i] = ch;
      if ((KEY_RANK[result[i]] ?? 0) > (KEY_RANK[this.keyStates.get(ch)] ?? 0)) {
        this.keyStates.set(ch, result[i]);
      }
    });

    if (isSolved(result)) this.#finish(true, 'solved', secondsLeft);
    else if (this.rows.length >= this.maxAttempts) this.#finish(false, 'attempts', 0);
    else this.current = this.target[0];

    return { ok: true, result, status: this.status };
  }

  /** Süre dolduğunda arayüz çağırır. */
  timeUp() {
    if (this.status !== 'playing') return false;
    this.#finish(false, 'time', 0);
    return true;
  }

  /** Joker: henüz bilinmeyen bir konumdaki harfi açar. Açılan konumu döndürür. */
  useRevealJoker() {
    if (this.status !== 'playing' || this.jokers.reveal <= 0) return null;
    const closed = this.hints.map((h, i) => (h === null ? i : -1)).filter((i) => i >= 0);
    if (closed.length === 0) return null;
    const index = closed[Math.floor(this.rng() * closed.length)];
    this.hints[index] = this.target[index];
    this.jokers.reveal--;
    return index;
  }

  /** Joker: kelimede olmayan birkaç harfi klavyede kapatır. Elenen harfleri döndürür. */
  useEliminateJoker() {
    if (this.status !== 'playing' || this.jokers.eliminate <= 0) return null;
    const candidates = [...ALPHABET].filter(
      (ch) => !this.target.includes(ch) && !this.keyStates.has(ch) && !this.eliminated.has(ch),
    );
    if (candidates.length === 0) return null;
    const picked = [];
    while (picked.length < CONFIG.eliminateCount && candidates.length > 0) {
      const [ch] = candidates.splice(Math.floor(this.rng() * candidates.length), 1);
      picked.push(ch);
      this.eliminated.add(ch);
    }
    this.jokers.eliminate--;
    return picked;
  }

  /** Tur bittikten sonra sıradaki kelimeye geçer. Oyun bittiyse false döner. */
  next() {
    if (this.status === 'playing' || this.gameEnd) return false;
    this.startWord();
    return true;
  }

  #finish(won, reason, secondsLeft) {
    const attempts = this.rows.length;
    let points = 0;
    this.stats.played++;

    if (won) {
      const base = this.length * 10 + (this.maxAttempts - attempts) * 15 + Math.floor(secondsLeft / 3);
      const multiplier = 1 + Math.min(this.streak, 5) * 0.1; // seri bonusu, en çok x1.5
      points = Math.round(base * multiplier);
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.stats.solved++;
      this.stats.attemptsOnSolved += attempts;
    } else {
      this.streak = 0;
    }

    this.status = won ? 'won' : 'lost';
    const round = { won, reason, attempts, word: this.target, meaning: this.meaning, length: this.length };

    if (this.mode === 'ladder') {
      if (won) {
        this.stageProgress++;
        if (this.stageProgress >= CONFIG.wordsPerStage) {
          if (this.stageIndex === this.stages.length - 1) {
            this.gameEnd = 'champion';
            round.lifeBonus = this.lives * CONFIG.championLifeBonus;
            points += round.lifeBonus;
          } else {
            this.stageIndex++;
            this.stageProgress = 0;
            round.levelUp = this.length;
          }
        }
      } else {
        this.lives--;
        if (this.lives <= 0) this.gameEnd = 'gameover';
      }
    } else if (this.stats.played % CONFIG.practiceJokerRefill === 0) {
      this.jokers = { ...CONFIG.jokers };
      round.jokersRefilled = true;
    }

    this.score += points;
    round.points = points;
    this.lastRound = round;
  }
}
