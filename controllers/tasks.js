// JSON dosyasını içeri aktarıyorum.
// bu JSON dosyasının içeriği, İzmir BB ESHOT otobüslerinin duraklarının id'si, adı, enlem-boylam ve duraktan geçen hatlarının bilgisini içeriyor.
const tasksJSON = require("../duraklar.json");

const connectionSuccess = (req, res) => {
  res.send("bağlantı başarılı");
};

const getAllStops = (req, res) => {
  res.json({
    message: `Otobüs durağı listesi`,
    count: tasksJSON.length,
    data: tasksJSON,
  });
};

const getStops = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Lütfen geçerli bir id girin.." });
  }
  const durak = tasksJSON.find((d) => d.DURAK_ID === id);
  if (!durak) {
    return res.status(404).json({
      message: "Aranan ID'de durak bulunamadı..",
      arananID: id,
    });
  } else {
    let acikAdres = "Açık adres bilgisi alınamadı...";
const getStops = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Lütfen geçerli bir id girin.." });
  }
  const durak = tasksJSON.find((d) => d.DURAK_ID === id);
  if (!durak) {
    return res.status(404).json({
      message: "Aranan ID'de durak bulunamadı..",
      arananID: id,
    });
  } else {
    // Adres bulma işini arayüze (frontend) devrettik
    res.json({
      message: `${durak.DURAK_ADI} durağı.`,
      bekleyenYolcuSayisi: Math.round(Math.random() * 10),
      gecen_hatlar: durak.DURAKTAN_GECEN_HATLAR,
      enlem: durak.ENLEM,
      boylam: durak.BOYLAM,
    });
  }
};

    res.json({
      message: `${durak.DURAK_ADI} durağı.`,
      bekleyenYolcuSayisi: Math.round(Math.random() * 10),
      acikAdres: acikAdres,
      gecen_hatlar: durak.DURAKTAN_GECEN_HATLAR,
      enlem: durak.ENLEM,
      boylam: durak.BOYLAM,
    });
  }
};

const getBusLocations = async (req, res) => {
  const hatNo = req.params.hatNo;
  try {
    const response = await fetch(`https://openapi.izmir.bel.tr/api/iztek/hatotobuskonumlari/${hatNo}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Otobüs API hatası: ", error);
    res.status(500).json({ message: "Otobüs konumları alınamadı" });
  }
};

const getLineName = async (req, res) => {
  const hatNo = req.params.hatNo;
  try {
    const response = await fetch(`https://openapi.izmir.bel.tr/api/iztek/hatlar`);
    const veri = await response.json();
    
    // Gelen verinin yapısını terminalde görelim
    console.log(`${hatNo} numaralı hat için API'den gelen veri:`, veri);

    let hatBilgisi = null;

    // Veri yapısına göre arama yapıyoruz
    if (veri && Array.isArray(veri.Hatlar)) {
        hatBilgisi = veri.Hatlar.find(h => h.HatNumarasi == hatNo);
    } else if (Array.isArray(veri)) {
        // Veri doğrudan liste olarak geliyorsa
        hatBilgisi = veri.find(h => h.HatNumarasi == hatNo || h.Id == hatNo);
    } else if (veri && veri.HatlarListesi) {
        // Farklı bir isimle gelme ihtimaline karşı
        hatBilgisi = veri.HatlarListesi.find(h => h.HatNumarasi == hatNo);
    }
    
    if (hatBilgisi) {
        // 'Adi' veya 'HatAdi' gibi farklı formatları destekleyelim
        res.json({ ad: hatBilgisi.Adi || hatBilgisi.HatAdi || "Yön bilgisi bulunamadı" }); 
    } else {
        res.json({ ad: "Bilinmeyen Hat" });
    }
  } catch (error) {
    console.error("Hat API hatası: ", error.message);
    res.status(500).json({ message: "Hat bilgisi alınamadı" });
  }
};

module.exports = {
  connectionSuccess,
  getAllStops,
  getStops,
  getBusLocations,
  getLineName,

};
