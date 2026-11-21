// Hedef kelime havuzu: oyunun sorduğu kelimeler ve tur sonunda gösterilen kısa anlamları.
// Genişletmek için ilgili uzunluğa "kelime|anlam" satırı eklemek yeterli
// (küçük harfle yazın; uzunluk ve alfabe kontrolü testlerde yapılır).

const RAW = {
  4: `
masa|Üzerinde yemek yenen, çalışılan mobilya
kapı|Bir yere girip çıkmayı sağlayan açıklık
elma|Kırmızı, sarı ya da yeşil kabuklu meyve
kedi|Evcil, miyavlayan hayvan
kuzu|Koyun yavrusu
çatı|Bir yapının üstünü örten bölüm
deve|Hörgüçlü çöl hayvanı
kale|Savunma amaçlı, surlarla çevrili yapı
ayna|Görüntüyü yansıtan cilalı yüzey
oyun|Eğlenmek için kurallarla yapılan etkinlik
süre|Bir işin başı ile sonu arasındaki zaman
yazı|Düşünceyi harflerle kâğıda dökme işi
dere|Küçük akarsu
köşe|İki kenarın birleştiği yer
ipek|İpek böceği kozasından elde edilen parlak tel
inek|Süt veren büyükbaş hayvan
ayak|Bacağın yere basan bölümü
omuz|Kolun gövdeye bağlandığı bölüm
saat|Zamanı gösteren araç; altmış dakika
gece|Güneşin battığı, havanın karanlık olduğu süre
hava|Dünyayı saran gaz karışımı
ateş|Yanan maddenin ısı ve ışık veren hâli
ağaç|Gövdesi odunlaşmış, dallı büyük bitki
kalp|Kanı vücuda pompalayan organ
ekim|Yılın onuncu ayı; tohum atma işi
yaka|Giysinin boynu çevreleyen bölümü; kıyı
okul|Eğitim ve öğretim yapılan yer
uyku|Dinlenmek için bilincin kapandığı durum
rüya|Uykuda görülen düş
umut|Olması beklenen şeye duyulan güven
şans|Talih, baht
ödül|Bir başarı karşılığında verilen armağan
ülke|Bir devletin sınırları içindeki toprak
ışık|Cisimleri görmeyi sağlayan enerji
iğne|Dikiş dikmeye yarayan sivri uçlu araç
fare|Küçük kemirgen; bilgisayar imleç aygıtı
kuğu|Uzun boyunlu, zarif su kuşu
ayva|Sarı, tüylü kabuklu, mayhoş meyve
erik|Tek çekirdekli, sulu yaz meyvesi
üzüm|Asmanın salkım hâlindeki meyvesi
pide|Yassı, ince ekmek ya da hamur işi
boya|Renk vermek için sürülen madde
çivi|Çakmaya yarayan sivri metal çubuk
halı|Yere serilen kalın, desenli dokuma
kova|Su taşımaya yarayan kulplu kap
lale|Çan biçiminde çiçek açan soğanlı bitki
paça|Pantolonun ayağa yakın alt bölümü
sıra|Art arda diziliş; okulda oturulan mobilya
tava|Kızartma yapılan saplı, yayvan kap
vazo|İçine çiçek konan süs kabı
yuva|Kuşların barındığı yer; ev, ocak
kaya|Büyük ve sert taş kütlesi
çaba|Bir işi başarmak için harcanan güç
dost|Sevilen, güvenilen yakın arkadaş
hece|Bir solukta çıkarılan ses birimi
ilaç|Hastalığı iyileştirmek için kullanılan madde
mavi|Gökyüzünün rengi
para|Alışverişte kullanılan ödeme aracı
borç|Geri ödenmek üzere alınan şey
gemi|Denizde yolcu ya da yük taşıyan büyük taşıt
kule|Yüksek ve dar yapı
`,
  5: `
kalem|Yazı yazmaya yarayan araç
kitap|Ciltli ya da ciltsiz basılı yapıt
kazak|Yünden örülmüş, baştan geçirilen üst giysi
çiçek|Bitkinin renkli, kokulu üreme organı
deniz|Yeryüzünü kaplayan büyük tuzlu su kütlesi
sabah|Günün ilk saatleri
bahçe|Çiçek, sebze ya da ağaç yetiştirilen yer
limon|Sarı kabuklu, ekşi turunçgil
köprü|İki yakayı birbirine bağlayan yapı
sevgi|Birine ya da bir şeye duyulan içten bağlılık
çorap|Ayağa giyilen örme giysi
balık|Suda yaşayan, solungaçlı hayvan
tavuk|Yumurtası ve eti için beslenen kümes hayvanı
incir|İçi çekirdekli, tatlı yaz meyvesi
biber|Acı ya da tatlı türleri olan sebze
şeker|Tatlandırıcı beyaz madde
kahve|Kavrulmuş çekirdekten yapılan içecek
ekmek|Undan yapılan temel besin
simit|Susamlı, halka biçiminde çörek
köfte|Kıymadan yoğrularak yapılan yemek
mısır|Koçan üzerinde taneleri olan tahıl
bulut|Gökyüzünde su buharı kümesi
orman|Ağaçlarla kaplı geniş alan
güneş|Dünya'yı ısıtan ve aydınlatan yıldız
fikir|Düşünce, görüş
ördek|Perde ayaklı, yüzücü kümes hayvanı
araba|Tekerlekli kara taşıtı
vapur|Yolcu taşıyan buharlı ya da motorlu gemi
bilet|Bir yere giriş ya da yolculuk hakkı veren kâğıt
yolcu|Yolculuk eden kimse
saray|Hükümdarların oturduğu büyük yapı
sokak|İki yanında evler bulunan dar yol
cadde|Şehir içindeki geniş, ana yol
meyve|Bitkilerin yenebilen tohumlu ürünü
sebze|Pişirilerek ya da çiğ yenen bitki
çorba|Sulu, sıcak içilen yemek
pilav|Pirinç ya da bulgurdan yapılan yemek
tabak|Yemek konan yayvan kap
çatal|Yemeği ağza götürmeye yarayan dişli araç
kaşık|Sulu yemekleri yemeye yarayan araç
bıçak|Kesmeye yarayan keskin araç
armut|Sulu, tatlı, alt tarafı geniş meyve
kiraz|Küçük, kırmızı, saplı meyve
kavun|İri, kokulu, sarı etli yaz meyvesi
çilek|Kırmızı, küçük, kokulu meyve
turşu|Tuzlu suda ya da sirkede bekletilmiş sebze
reçel|Meyvenin şekerle kaynatılmasıyla yapılan tatlı
kilit|Kapıyı anahtarla kapatmaya yarayan düzenek
sayfa|Kâğıdın iki yüzünden her biri
silgi|Yazıyı silmeye yarayan araç
tahta|Biçilmiş düz ağaç parçası
sınıf|Öğrencilerin ders gördüğü oda
müzik|Seslerin uyumlu düzenlenmesi sanatı
şarkı|Sözlü müzik parçası
davul|Tokmakla çalınan vurmalı çalgı
keman|Yayla çalınan dört telli çalgı
gitar|Parmakla çalınan altı telli çalgı
resim|Bir şeyin kâğıt ya da tuval üzerindeki görüntüsü
sahne|Oyunların sergilendiği yer
perde|Pencereye asılan örtü
dünya|Üzerinde yaşadığımız gezegen
zaman|Olayların geçtiği süre
hafta|Yedi günlük süre
akşam|Güneşin batmaya başladığı saatler
insan|Düşünen, konuşan canlı
çocuk|Küçük yaştaki insan
bebek|Çok küçük çocuk
teyze|Annenin kız kardeşi
komşu|Yakın evde oturan kimse
hekim|Hastaları iyileştiren kimse, doktor
aslan|Yeleli, yırtıcı büyük kedi
tilki|Kurnazlığıyla bilinen, kabarık kuyruklu hayvan
köpek|Sadakatiyle bilinen evcil hayvan
yılan|Ayaksız, uzun gövdeli sürüngen
serçe|Küçük, ötücü kuş
böcek|Altı ayaklı küçük canlı
sinek|İki kanatlı, uçan küçük böcek
`,
  6: `
bardak|Su içilen kap
zeytin|Yağı çıkarılan, salamura yapılan meyve
mektup|Birine gönderilen yazılı haber
defter|Yazı yazmak için ciltlenmiş kâğıtlar
piyano|Tuşlu, telli büyük çalgı
heykel|Taş, tunç gibi maddelerden yapılan üç boyutlu eser
yıldız|Gece gökyüzünde parlayan gök cismi
rüzgar|Havanın yer değiştirmesiyle oluşan esinti
yağmur|Buluttan damla damla düşen su
dakika|Altmış saniyelik süre
gündüz|Günün aydınlık bölümü
kardeş|Aynı anne babadan olan çocuklardan her biri
doktor|Hastaları tedavi eden kimse
kaplan|Çizgili, yırtıcı büyük kedi
tavşan|Uzun kulaklı, hızlı koşan hayvan
kartal|Keskin gözlü, büyük yırtıcı kuş
toprak|Bitkilerin yetiştiği yer kabuğu katmanı
peynir|Sütten mayalanarak yapılan besin
yoğurt|Sütün mayalanmasıyla yapılan ekşimsi besin
ızgara|Üzerinde et pişirilen demir çubuklu araç
kanepe|Birkaç kişinin oturabildiği koltuk
yastık|Yatarken başın altına konan minder
yorgan|Yatakta örtünülen kalın örtü
makine|Bir işi enerjiyle yapan düzenek
klavye|Tuşlardan oluşan yazı aygıtı
kamera|Görüntü kaydeden aygıt
gazete|Günlük haber yayını
hikaye|Olmuş ya da tasarlanmış olayları anlatan yazı türü
cüzdan|Para ve kart taşınan küçük kap
gözlük|Görmeyi düzeltmek için takılan camlı araç
gömlek|Yakalı, düğmeli üst giysi
elbise|Giysi; tek parça kadın giysisi
terlik|Ev içinde giyilen hafif ayakkabı
otobüs|Çok yolcu taşıyan büyük taşıt
kamyon|Yük taşıyan büyük taşıt
kumsal|Deniz kıyısındaki kumluk alan
balina|Denizde yaşayan dev memeli
sincap|Kabarık kuyruklu, ağaçta yaşayan kemirgen
ceylan|İnce bacaklı, zarif, hızlı koşan hayvan
zürafa|Çok uzun boyunlu Afrika hayvanı
maymun|İnsana benzeyen, ağaçlarda yaşayan hayvan
leylek|Uzun bacaklı, göçmen kuş
baykuş|Gece avlanan, iri gözlü kuş
çiftçi|Toprağı ekip biçen kimse
buğday|Unundan ekmek yapılan tahıl
yaprak|Bitkinin dalındaki yeşil, yassı bölüm
zambak|İri, kokulu çiçekler açan soğanlı bitki
sümbül|Salkım hâlinde kokulu çiçekler açan bitki
karpuz|İçi kırmızı, sulu, iri yaz meyvesi
kayısı|Turuncu, tek çekirdekli yaz meyvesi
pirinç|Pilavı yapılan tahıl
bulgur|Kaynatılıp kurutulmuş, kırılmış buğday
eczane|İlaç satılan yer
sinema|Film gösterilen salon
market|Gıda ve ev gereçleri satılan mağaza
kasaba|Köyden büyük, şehirden küçük yerleşim
balkon|Yapının dışarı taşan, korkuluklu bölümü
mutfak|Yemek pişirilen yer
deprem|Yer kabuğunun sarsılması
şimşek|Bulutlar arasındaki elektrik boşalmasının ışığı
mevsim|Yılın dört bölümünden her biri
takvim|Günleri, ayları gösteren çizelge
kültür|Bir toplumun maddi ve manevi değerlerinin bütünü
bayram|Özel önemi olan, kutlanan gün
hediye|Armağan
macera|Beklenmedik olaylarla dolu serüven
hazine|Değerli eşyaların toplandığı yer; gömü
harita|Yeryüzünün küçültülerek çizilmiş görünümü
pusula|Yönü gösteren mıknatıslı araç
korsan|Deniz haydudu
kaptan|Gemiyi ya da takımı yöneten kimse
yelken|Rüzgâr gücüyle tekneyi yürüten bez
`,
  7: `
pencere|Işık ve hava girmesi için duvarda bırakılan açıklık
öğrenci|Öğrenim gören kimse
kırmızı|Kan rengi, al
fırtına|Çok şiddetli rüzgâr
misafir|Konuk
hemşire|Hastalara bakan sağlık görevlisi
karınca|Toplu yaşayan, çalışkan küçük böcek
tencere|Yemek pişirilen kapaklı, derin kap
bulaşık|Yıkanacak kirli kap kacak
çamaşır|Yıkanan iç giysi ve ev tekstili
telefon|Uzaktan konuşmayı sağlayan aygıt
anahtar|Kilidi açıp kapamaya yarayan araç
eldiven|Ele giyilen parmaklı giysi
şemsiye|Yağmurdan ya da güneşten koruyan araç
papağan|Sesleri taklit eden renkli tropik kuş
penguen|Uçamayan, kutuplarda yaşayan deniz kuşu
kelebek|Renkli, pullu kanatlı böcek
örümcek|Ağ ören sekiz bacaklı canlı
traktör|Tarım işlerinde kullanılan güçlü taşıt
menekşe|Mor, kokulu çiçekli küçük bitki
papatya|Ortası sarı, beyaz yapraklı kır çiçeği
şeftali|Tüylü kabuklu, sulu yaz meyvesi
domates|Kırmızı, sulu sebze
patates|Toprak altında yetişen nişastalı yumru
ıspanak|Koyu yeşil yapraklı sebze
bezelye|Yeşil, yuvarlak taneli baklagil
fasulye|Taze ya da kuru yenen baklagil
makarna|İrmik ya da undan yapılan hamur yemeği
baklava|İnce yufka ve şerbetle yapılan tatlı
hastane|Hastaların tedavi edildiği kurum
postane|Mektup ve kargo işlerinin yapıldığı yer
lokanta|Yemek yenen yer, restoran
pastane|Pasta ve tatlı satılan yer
tiyatro|Sahne oyunları sanatı ve yapısı
stadyum|Spor karşılaşmaları yapılan büyük alan
fabrika|Seri üretim yapılan tesis
mahalle|Bir şehrin bölündüğü küçük yerleşim birimi
koridor|Odaları birbirine bağlayan geçit
asansör|Katlar arasında insan ya da yük taşıyan düzenek
gökyüzü|Yeryüzünün üzerindeki sonsuz boşluk, sema
felsefe|Varlık ve bilgi üzerine düşünme bilimi
gelenek|Kuşaktan kuşağa aktarılan alışkanlık
sürpriz|Beklenmedik hoş olay
heyecan|Coşku, güçlü duygu dalgası
cesaret|Yüreklilik, yiğitlik
merhaba|Karşılaşınca söylenen selam sözü
arkadaş|Birbirini seven, yakınlık duyan kimse
denizci|Denizde çalışan kimse, gemici
`,
};

function parse(block) {
  return block
    .trim()
    .split('\n')
    .map((line) => {
      const [word, meaning] = line.split('|');
      return { word: word.trim(), meaning: meaning.trim() };
    });
}

/** { 4: [{ word, meaning }], ... } — kelimeler küçük harfli */
export const TARGETS = Object.fromEntries(
  Object.entries(RAW).map(([len, block]) => [len, parse(block)]),
);
