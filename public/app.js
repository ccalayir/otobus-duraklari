const aramaButonu = document.getElementById("aramaButonu");
const durakAdiInput = document.getElementById("durakAdiInput");
const durakListesi = document.getElementById("durakListesi");
const sonucAlani = document.getElementById("sonucAlani");
const haritaAlani = document.getElementById("haritaAlani");
const otobusListesiAlani = document.getElementById("otobusListesiAlani");
const otobusListeIcerik = document.getElementById("otobusListeIcerik");

let harita = null;
let isaretci = null;
let tumDuraklar = [];

// İki koordinat arası mesafeyi (km) hesaplayan fonksiyon
function mesafeHesapla(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
}

// Sayfa açıldığında tüm durakları çekip listeye doldurur
async function duraklariYukle() {
    try {
        const cevap = await fetch('/app/stops/all');
        const veri = await cevap.json();
        tumDuraklar = veri.data;

        let seceneklerHTML = '';
        tumDuraklar.forEach(durak => {
            const gorunenAd = `${durak.DURAK_ADI} (No: ${durak.DURAK_ID})`;
            seceneklerHTML += `<option value="${gorunenAd}">`;
        });
        durakListesi.innerHTML = seceneklerHTML;
    } catch (hata) {
        console.error("Duraklar yüklenirken hata oluştu:", hata);
    }
}
duraklariYukle();

aramaButonu.addEventListener("click", async () => {
    const girilenAd = durakAdiInput.value.trim();

    if (!girilenAd) {
        sonucAlani.innerHTML = '<div class="alert alert-warning">Lütfen bir durak adı seçiniz.</div>';
        return;
    }

    const secilenDurak = tumDuraklar.find(d => `${d.DURAK_ADI} (No: ${d.DURAK_ID})` === girilenAd);

    if (!secilenDurak) {
        sonucAlani.innerHTML = '<div class="alert alert-danger">Lütfen listeden geçerli bir durak seçin.</div>';
        return;
    }

    const id = secilenDurak.DURAK_ID;
    sonucAlani.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div><p>Yükleniyor...</p></div>';
    
    // Her aramada alt listeyi ve haritayı temizle
    otobusListesiAlani.style.display = 'none';
    otobusListeIcerik.innerHTML = '';

    try {
        const response = await fetch(`/app/stops/${id}`);
        const data = await response.json();

        if (!response.ok) {
            sonucAlani.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            return;
        }

        // Durak Bilgilerini Yazdır
        let hatlarDizisi = data.gecen_hatlar ? (Array.isArray(data.gecen_hatlar) ? data.gecen_hatlar : data.gecen_hatlar.toString().split('-').map(h => h.trim())) : [];
        let hatlarHTML = hatlarDizisi.map(hat => `<span class="badge bg-secondary me-1 mb-2">${hat}</span>`).join('');

        sonucAlani.innerHTML = `
            <div class="card border-success mt-3 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-success">${data.message}</h5>
                    <p class="small mb-1"><strong>Adres:</strong> ${data.acikAdres}</p>
                    <p class="small"><strong>Geçen Hatlar:</strong> ${hatlarHTML}</p>
                </div>
            </div>
        `;

        // Haritayı Güncelle
        haritaAlani.style.display = 'block';
        if (!harita) {
            harita = L.map('haritaAlani').setView([data.enlem, data.boylam], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(harita);
            isaretci = L.marker([data.enlem, data.boylam]).addTo(harita);
        } else {
            harita.setView([data.enlem, data.boylam], 16);
            isaretci.setLatLng([data.enlem, data.boylam]);
        }

        if (harita.otobusKatmani) harita.removeLayer(harita.otobusKatmani);
        harita.otobusKatmani = L.layerGroup().addTo(harita);

        const otobusIkonu = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
            iconSize: [32, 32], iconAnchor: [16, 32]
        });

        // Hatları ve Otobüsleri Çek
        if (hatlarDizisi.length > 0) {
            hatlarDizisi.forEach(async (hat) => {
                try {
                    const oCevap = await fetch(`/app/stops/buses/${hat}`);
                    const oVeri = await oCevap.json();
                    
                    if (oVeri.HataVarMi === false && Array.isArray(oVeri.HatOtobusKonumlari)) {
                        otobusListesiAlani.style.display = 'block';

                        oVeri.HatOtobusKonumlari.forEach(otobus => {
                            if (otobus.KoorX && otobus.KoorY) {
                                const e = parseFloat(otobus.KoorX.replace(',', '.'));
                                const b = parseFloat(otobus.KoorY.replace(',', '.'));
                                const m = mesafeHesapla(data.enlem, data.boylam, e, b);
                                const sure = Math.round((m / 20) * 60);
                                const sureYazi = sure < 1 ? "Durağa yaklaştı" : `${sure} dk`;
                                const yon = otobus.Yon === 0 ? "Gidiş" : "Dönüş";

                                // Haritaya ekle
                                L.marker([e, b], {icon: otobusIkonu})
                                 .bindPopup(`<b>Hat: ${hat}</b><br>Yön: ${yon}<br>Süre: ${sureYazi}`)
                                 .addTo(harita.otobusKatmani);

                                // Alt listeye ekle
                                otobusListeIcerik.innerHTML += `
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <div><strong>${hat}</strong> <small class="text-muted">(${yon})</small></div>
                                        <span class="badge bg-danger rounded-pill">${sureYazi}</span>
                                    </div>
                                `;
                            }
                        });
                    }
                } catch (err) {
                    console.error(`${hat} hatası:`, err);
                }
            });
        }
    } catch (error) {
        sonucAlani.innerHTML = `<div class="alert alert-danger">Bağlantı hatası! Sunucu açık mı?</div>`;
    }
});