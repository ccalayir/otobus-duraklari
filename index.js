const cors = require("cors");
const express = require("express");
const app = express();
const tasks = require("./routes/tasks");

// middleware
app.use(express.json());
app.use(cors());

// Ön yüz dosyalarını (HTML, CSS, JS) yayına almak için
app.use(express.static('public'));

//routes
app.use("/hello", (req, res) => {
  res.send("ESHOT Durakları");
});

app.use("/app/stops/", tasks);

// PORT ayarı ve sunucuyu başlatma (Sadece bir tane olmalı)
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda canavar gibi çalışıyor...`);
});