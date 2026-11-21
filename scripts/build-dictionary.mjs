// Hunspell Türkçe sözlüğünden (dictionary-tr, MIT) 4-7 harfli yalın kelimeleri
// çıkarıp src/words/dictionary.js dosyasını üretir.
//
// Kullanım:
//   npm install --no-save dictionary-tr
//   node scripts/build-dictionary.mjs [index.dic yolu]
import { readFileSync, writeFileSync } from 'node:fs';

const source = process.argv[2] ?? 'node_modules/dictionary-tr/index.dic';
const LETTERS = /^[abcçdefgğhıijklmnoöprsştuüvyz]+$/; // yalnızca küçük harf: özel adlar elenir
const byLength = { 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set() };

for (const line of readFileSync(source, 'utf8').split('\n').slice(1)) {
  const word = line.split('/')[0].trim();
  if (LETTERS.test(word) && byLength[word.length]) byLength[word.length].add(word);
}

const collator = new Intl.Collator('tr');
let out =
  '// OTOMATİK ÜRETİLDİ — elle düzenlemeyin. Kaynak: dictionary-tr (hunspell-tr, MIT,\n' +
  '// © 2014 Harun Reşit Zafer). Yeniden üretmek için: scripts/build-dictionary.mjs\n' +
  '// Her uzunluk için boşlukla ayrılmış, küçük harfli kelimeler.\n' +
  'export const DICTIONARY = {\n';
for (const [len, set] of Object.entries(byLength)) {
  const words = [...set].sort(collator.compare);
  out += `  ${len}: '${words.join(' ')}',\n`;
  console.log(`${len} harf: ${words.length} kelime`);
}
out += '};\n';
writeFileSync(new URL('../src/words/dictionary.js', import.meta.url), out);
