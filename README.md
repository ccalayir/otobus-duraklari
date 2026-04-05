# 🚍 İzmir Canlı Otobüs Takip Sistemi

Bu proje, İzmir Büyükşehir Belediyesi (ESHOT) açık veri servislerini kullanarak tamamen vibe coding (Gemini Pro 3.1) geliştirilmiş; durak bazlı canlı otobüs takibi, harita entegrasyonu ve tahmini varış süresi hesaplayan bir **Full-Stack** web uygulamasıdır.

## 🚀 Öne Çıkan Özellikler

* **Akıllı Durak Arama:** `datalist` desteği ile durak adını yazmaya başladığınızda otomatik tamamlama sunar. Aynı isimdeki durakları ID bilgisiyle birbirinden ayırır.
* **Canlı Harita Takibi:** Seçilen durağın konumu ve o duraktan geçen aktif otobüslerin anlık yerleri [Leaflet.js](https://leafletjs.com/) haritası üzerinde gösterilir.
* **Varış Süresi Hesaplama:** Otobüs ve durak koordinatları arasındaki mesafe **Haversine Formülü** ile hesaplanır. Ortalama hız (20km/s) baz alınarak tahmini varış süresi sunulur.
* **Yön Bilgisi:** Otobüslerin "Gidiş" veya "Dönüş" yönünde olup olmadığı bilgisini anlık olarak verir.
* **Detaylı Liste Görünümü:** Haritadaki ikonlara ek olarak, harita altında tüm yaklaşan otobüsler şık bir liste halinde süreleriyle birlikte gösterilir.

## 🛠️ Teknolojiler

### Frontend
* **HTML5 & Bootstrap 5:** Modern ve duyarlı (responsive) arayüz tasarımı.
* **JavaScript (ES6+):** Asenkron veri çekme (Fetch API) ve dinamik DOM yönetimi.
* **Leaflet.js:** İnteraktif harita katmanları ve özel ikon yönetimi.

### Backend
* **Node.js & Express.js:** API rotalarının yönetimi ve belediye servisleriyle haberleşme.
* **CORS:** Tarayıcı tabanlı güvenlik politikalarının yönetimi.

## 📋 Kurulum ve Çalıştırma

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Backend Sunucusunu Başlatın:**
    ```bash
    node index.js
    ```
    *Sunucu varsayılan olarak `http://127.0.0.1:3000` portunda çalışacaktır.*

3.  **Uygulamayı Açın:**
    `public/index.html` dosyasını tarayıcınızda (Live Server önerilir) açın.

## 🧮 Kullanılan Matematiksel Model (Haversine)

İki koordinat arasındaki kuş uçuşu mesafe şu formülle hesaplanmaktadır:

$$a = \sin^2(\Delta\varphi/2) + \cos \varphi_1 \cdot \cos \varphi_2 \cdot \sin^2(\Delta\lambda/2)$$
$$c = 2 \cdot \operatorname{atan2}(\sqrt{a}, \sqrt{1-a})$$
$$d = R \cdot c$$

## 👨‍💻 Geliştirici
**[Çağdaş Çalayır](https://ccalayir.github.io/calayir-portfolio/)** - *Bilişim Sistemleri Mühendisi Adayı*

---
*Not: Bu uygulama eğitim amaçlı geliştirilmiş olup, veriler ESHOT Genel Müdürlüğü servislerinden anlık çekilmektedir.*