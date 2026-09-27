const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/register - Yeni Kullanıcı Kaydı
router.post('/register', async (req, res) => {
  const { kullanici_adi, email, sifre } = req.body;
  
  if (!kullanici_adi || !email || !sifre) {
    return res.status(400).json({ basarili: false, mesaj: 'Kullanıcı adı, email ve şifre zorunludur.' });
  }

  try {
    // Email veya kullanıcı adı var mı kontrol et
    const varMi = await pool.query('SELECT id FROM Kullanicilar WHERE email = $1 OR kullanici_adi = $2', [email, kullanici_adi]);
    if (varMi.rows.length > 0) {
      return res.status(400).json({ basarili: false, mesaj: 'Bu e-posta veya kullanıcı adı zaten kullanımda.' });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const sifre_hash = await bcrypt.hash(sifre, salt);

    // Varsayılan avatar
    const avatar_url = `https://ui-avatars.com/api/?name=${kullanici_adi}&background=random`;

    // Kullanıcıyı oluştur
    const yeniKullanici = await pool.query(
      `INSERT INTO Kullanicilar (kullanici_adi, email, sifre_hash, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING id, kullanici_adi, email, avatar_url, rol`,
      [kullanici_adi, email, sifre_hash, avatar_url]
    );

    res.status(201).json({
      basarili: true,
      mesaj: 'Kayıt başarılı.',
      veri: yeniKullanici.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Kayıt olurken sunucu hatası oluştu.' });
  }
});

// POST /api/auth/login - Giriş Yap
router.post('/login', async (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ basarili: false, mesaj: 'E-posta ve şifre zorunludur.' });
  }

  try {
    const sonuc = await pool.query('SELECT * FROM Kullanicilar WHERE email = $1', [email]);
    
    if (sonuc.rows.length === 0) {
      return res.status(401).json({ basarili: false, mesaj: 'Geçersiz e-posta veya şifre.' });
    }

    const kullanici = sonuc.rows[0];

    // Şifre kontrolü
    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre_hash);
    if (!sifreDogruMu) {
      return res.status(401).json({ basarili: false, mesaj: 'Geçersiz e-posta veya şifre.' });
    }

    // Şifre hash'ini veriden çıkar
    delete kullanici.sifre_hash;

    // JWT Token oluştur
    const token = jwt.sign(
      { id: kullanici.id, email: kullanici.email, rol: kullanici.rol },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '30d' }
    );

    res.json({
      basarili: true,
      mesaj: 'Giriş başarılı.',
      veri: { ...kullanici, token }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Giriş yaparken sunucu hatası oluştu.' });
  }
});

module.exports = router;
