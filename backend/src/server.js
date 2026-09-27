const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Çevresel değişkenleri yükle
dotenv.config();

const app = express();

// Güvenlik başlıkları, CORS ve loglama middleware'leri
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json()); // JSON istek gövdelerini ayrıştırır

// Rate limiting: 15 dakikada maksimum 100 istek
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { basarili: false, mesaj: 'Bu IP adresinden çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.' }
});
app.use('/api', limiter);

// Route importları
const makalelerRoutes = require('./routes/makaleler');
const sorularRoutes = require('./routes/sorular');
const yorumlarRoutes = require('./routes/yorumlar');
const authRoutes = require('./routes/auth');
const takipRoutes = require('./routes/takip');
const uzmanRoutes = require('./routes/uzman');
const adminRoutes = require('./routes/admin');
// const kullanicilarRoutes = require('./routes/kullanicilar');
// const etiketlerRoutes = require('./routes/etiketler');

// Rotaları kullan
app.use('/api/makaleler', makalelerRoutes);
app.use('/api/sorular', sorularRoutes);
app.use('/api/yorumlar', yorumlarRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/takip', takipRoutes);
app.use('/api/uzman', uzmanRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/kullanicilar', kullanicilarRoutes);
// app.use('/api/etiketler', etiketlerRoutes);

// Kök rota (Sağlık kontrolü)
app.get('/', (req, res) => {
  res.json({ basarili: true, mesaj: 'PMOS Backend API Çalışıyor' });
});

// Hata yakalama middleware'i (Tüm yakalanmayan hatalar için)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ basarili: false, mesaj: 'Sunucu tarafında beklenmeyen bir hata oluştu!' });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
