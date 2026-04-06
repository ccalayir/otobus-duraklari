# İzmir Canlı Otobüs Takip Sistemi

Bu proje, İzmir Büyükşehir Belediyesi (ESHOT) açık veri servislerini kullanarak geliştirilmiş; durak bazlı canlı otobüs takibi, harita entegrasyonu ve tahmini varış süresi hesaplayan bir Full-Stack web uygulamasıdır.

## Öne Çıkan Özellikler
* Akıllı Durak Arama: Otomatik tamamlama sunar ve aynı isimdeki durakları ID bilgisiyle ayrıştırır.
* Canlı Harita Takibi ve Liste: Seçilen durağın konumu ve aktif otobüslerin anlık yerleri Leaflet.js haritası üzerinde ve altındaki detaylı listede gösterilir.
* İstemci Taraflı Adres Çözümleme: Datacenter IP bloklamalarını aşmak ve sunucu yükünü hafifletmek için Nominatim API (reverse geocoding) istekleri doğrudan tarayıcı üzerinden yapılır.
* Varış Süresi Hesaplama: Otobüs ve durak koordinatları arasındaki mesafe Haversine Formülü ile hesaplanarak dinamik varış süresi sunulur.

## Teknolojiler
* Frontend: HTML5, Bootstrap 5, Vanilla JavaScript (ES6+), Leaflet.js
* Backend: Node.js, Express.js, CORS
* Dağıtım (Deployment): Render.com üzerinden tüm API ve ön yüz statik dosyaları (express.static) tek bir servis olarak sunulmaktadır.

## Kurulum ve Çalıştırma
Projeyi bilgisayarınızda yerel olarak çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu klonlayın ve klasöre girin.
2. Terminalde `npm install` komutu ile bağımlılıkları yükleyin.
3. `node index.js` komutu ile sunucuyu başlatın.
4. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanabilirsiniz.

## Kullanılan Matematiksel Model (Haversine)
İki koordinat arasındaki kuş uçuşu mesafe uygulamada şu formülle hesaplanmaktadır:

$$a = \sin^2(\Delta\varphi/2) + \cos \varphi_1 \cdot \cos \varphi_2 \cdot \sin^2(\Delta\lambda/2)$$
$$c = 2 \cdot \operatorname{atan2}(\sqrt{a}, \sqrt{1-a})$$
$$d = R \cdot c$$

## Geliştirici
**[Çağdaş Çalayır](https://ccalayir.github.io/calayir-portfolio/)** - Bilişim Sistemleri Mühendisi Adayı