const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Admin yetki kontrolü middleware'i
const adminMiddleware = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ basarili: false, mesaj: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  next();
};

// GET /api/admin/basvurular - Bekleyen başvuruları listele
router.get('/basvurular', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ub.*, k.kullanici_adi, k.email 
      FROM uzman_basvurulari ub 
      JOIN kullanicilar k ON ub.kullanici_id = k.id 
      WHERE ub.durum = 'bekliyor'
      ORDER BY ub.basvuru_tarihi ASC
    `);

    res.json({ basarili: true, veri: result.rows });
  } catch (error) {
    console.error('Admin Başvuru Listeleme Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Başvurular getirilirken hata oluştu.' });
  }
});

// PUT /api/admin/basvurular/:id/onayla - Başvuruyu onayla
router.put('/basvurular/:id/onayla', authMiddleware, adminMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');

    // Başvuruyu getir ve kilitle
    const basvuruResult = await client.query(
      'SELECT * FROM uzman_basvurulari WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (basvuruResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ basarili: false, mesaj: 'Başvuru bulunamadı.' });
    }

    const basvuru = basvuruResult.rows[0];

    if (basvuru.durum !== 'bekliyor') {
      await client.query('ROLLBACK');
      return res.status(400).json({ basarili: false, mesaj: 'Bu başvuru zaten işleme alınmış.' });
    }

    // 1. Başvuru durumunu güncelle
    await client.query(
      "UPDATE uzman_basvurulari SET durum = 'onaylandi' WHERE id = $1",
      [id]
    );

    // 2. Kullanıcının rolünü ve uzmanlık alanını güncelle
    await client.query(
      "UPDATE kullanicilar SET rol = 'uzman', uzmanlik_alani = $1 WHERE id = $2",
      [basvuru.uzmanlik_alani, basvuru.kullanici_id]
    );

    await client.query('COMMIT');
    res.json({ basarili: true, mesaj: 'Başvuru onaylandı ve kullanıcı uzman yapıldı.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Admin Onay Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Onay işlemi sırasında sunucu hatası.' });
  } finally {
    client.release();
  }
});

// PUT /api/admin/basvurular/:id/reddet - Başvuruyu reddet
router.put('/basvurular/:id/reddet', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "UPDATE uzman_basvurulari SET durum = 'reddedildi' WHERE id = $1 AND durum = 'bekliyor' RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Bekleyen başvuru bulunamadı.' });
    }

    res.json({ basarili: true, mesaj: 'Başvuru reddedildi.' });
  } catch (error) {
    console.error('Admin Reddetme Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Reddetme işlemi sırasında sunucu hatası.' });
  }
});

module.exports = router;
