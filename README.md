# Harfiyen

TV'deki kelime yarışmalarından esinlenen, Türkçe dil kurallarına uygun bir kelime tahmin oyunu.
İlk harf açık gelir; kelimeyi 5 denemede ve süre dolmadan bulursun. 4 harfle başlar, bildikçe 7 harfe tırmanır.

Bağımlılık ve derleme adımı yoktur: düz HTML, CSS ve ES modülleri.

> Bu proje bağımsız bir çalışmadır; herhangi bir TV programı ya da yayıncıyla bağlantısı yoktur.

## Çalıştırma

Node.js 20+ yeterli.

```bash
npm start
```

Ardından <http://localhost:5173> adresini aç. (`PORT=8080 npm start` ile port değişir.)

ES modülleri `file://` üzerinden yüklenmediği için bir HTTP sunucusu gerekir; `server.js` yerine
herhangi bir statik sunucu da olur (`python3 -m http.server`, GitHub Pages vb.).

Testler:

```bash
npm test
```

## Oyun kuralları

| | |
|---|---|
| **Kırmızı** | Doğru harf, doğru konum |
| **Altın** | Harf kelimede var, konumu yanlış |
| **Koyu** | Harf kelimede yok |

- Her kelimenin ilk harfi açıktır ve tahminler o harfle başlar.
- Doğru konumda bulunan harfler sonraki satırda silik ipucu olarak görünür.
- Tekrarlayan harfler doğru sayılır: bir harf hedefte kaç kez geçiyorsa en fazla o kadar renklenir
  (hedef `KALEM` iken `KAZAK` tahmininde yalnızca ilk `K` ve ilk `A` kırmızı olur).
- Geçersiz ya da eksik tahmin hak götürmez; satır titrer ve uyarı çıkar.
- Haklar ya da süre bitince kelime ve kısa anlamı gösterilir.

**Modlar**

- **Yarışma:** 4 → 5 → 6 → 7 harf. Her harf sayısında 2 kelime bilince üst tura geçilir. 3 can vardır;
  bilinemeyen her kelime 1 can götürür. 7 harfli final turu ayarlardan kapatılabilir.
- **Pratik:** Sabit harf sayısı (4–7), can yok, istediğin kadar kelime. Jokerler 5 kelimede bir yenilenir.

**Jokerler** (oyun başına birer adet): *Harf Aç* kapalı bir harfi gösterir, *Harf Ele* kelimede olmayan
5 harfi klavyeden kapatır.

**Puan:** `harf sayısı × 10 + kalan deneme × 15 + kalan saniye ÷ 3`, üst üste bilinen her kelime için
+%10 seri çarpanı (en çok +%50). Yarışmayı bitirince kalan her can +100 puan.

**Ayarlar:** kelime başına süre (süresiz / 60 / 90 / 120 sn), sözlük kontrolü (sıkı / esnek), ses.
Ayarlar ve rekorlar tarayıcıda (`localStorage`) saklanır.

## Mimari

```
index.html              Tek sayfa: üst bar, pano, klavye, modallar
styles.css              Tema, duyarlı yerleşim, animasyonlar
server.js               Bağımlılıksız geliştirme sunucusu
src/
  turkish.js            Türk alfabesi, i/İ – ı/I dönüşümleri, tuş → harf
  engine.js             Harf eşleştirme motoru (saf fonksiyon, iki geçişli sayım)
  game.js               Oyun durumu ve kuralları: turlar, canlar, puan, jokerler (DOM'suz)
  main.js               Arayüz: çizim, fiziksel + ekran klavyesi, zamanlayıcı, modallar
  audio.js              Web Audio API ile sentezlenen efektler (ses dosyası yok)
  storage.js            Ayarlar ve rekorlar
  words/
    targets.js          Sorulan kelimeler + anlamları (elle seçilmiş)
    dictionary.js       Geçerli tahmin sözlüğü (otomatik üretilmiş, ~43.000 kelime)
    index.js            Kelime havuzu API'si: hedef seçimi, geçerlilik kontrolü
scripts/build-dictionary.mjs   dictionary.js üreticisi
tests/                  node:test ile birim testleri
```

`engine.js`, `game.js`, `turkish.js` ve `words/` DOM'a dokunmaz; bu yüzden Node'da doğrudan test edilir.
Kurallarla ilgili sayılar (deneme hakkı, can, tur başına kelime, joker adedi) `src/game.js` içindeki
`CONFIG` nesnesindedir.

### Türkçe harfler

Büyük/küçük harf dönüşümü ortamın locale ayarına bırakılmaz; `trUpper` / `trLower` `i → İ` ve `ı → I`
eşlemesini açıkça yapar. Oyun içinde tüm kelimeler büyük harfle tutulur, `I` ve `İ` ayrı harflerdir.
Türkçe olmayan fiziksel klavyede `i` tuşu `İ`, `Shift+i` ise `I` yazar; ekran klavyesinde ikisi de vardır.

### Kelime havuzunu genişletme

- **Sorulacak kelime eklemek:** `src/words/targets.js` içinde ilgili uzunluğa `kelime|kısa anlam`
  satırı ekle. Testler uzunluğu, harfleri ve tekrarları denetler.
- **Yalnızca geçerli tahmin eklemek:** `src/words/index.js` içindeki `EXTRA_VALID_WORDS` dizisine yaz.
- **Sözlüğü yeniden üretmek:**

  ```bash
  npm install --no-save dictionary-tr
  ```

  ```bash
  npm run build:dict
  ```

### Geçerli kelime kontrolü

`isValidGuess(word, mode)` iki modda çalışır:

- `strict` (varsayılan): tahmin sözlükte ya da hedef havuzunda olmalı. Sözlük kök/yalın biçimleri
  içerir; çekimli biçimler (`evler`, `geldi`) kabul edilmez.
- `lenient`: doğru uzunlukta, Türkçe harflerden oluşan her dizi kabul edilir. Sözlükte eksik bir
  kelimeye takılmamak için yeni oyun ekranından açılır.

## Kaynaklar

Tahmin sözlüğü, MIT lisanslı [dictionary-tr](https://github.com/wooorm/dictionaries/tree/main/dictionaries/tr)
(hunspell-tr, © 2014 Harun Reşit Zafer) paketindeki kelime köklerinden üretilmiştir.
