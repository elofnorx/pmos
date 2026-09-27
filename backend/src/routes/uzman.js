const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/uzman/basvuru - Yeni uzman başvurusu yap
router.post('/basvuru', authMiddleware, async (req, res) => {
  try {
    const kullanici_id = req.user.id;
    const { uzmanlik_alani, belge_linki } = req.body;

    if (!uzmanlik_alani || !belge_linki) {
      return res.status(400).json({ basarili: false, mesaj: 'Uzmanlık alanı ve belge linki zorunludur.' });
    }

    // Bekleyen başvurusu var mı kontrolü
    const checkResult = await pool.query(
      'SELECT id FROM uzman_basvurulari WHERE kullanici_id = $1 AND durum = $2',
      [kullanici_id, 'bekliyor']
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ basarili: false, mesaj: 'Zaten bekleyen bir başvurunuz bulunmaktadır.' });
    }

    const result = await pool.query(
      'INSERT INTO uzman_basvurulari (kullanici_id, uzmanlik_alani, belge_linki) VALUES ($1, $2, $3) RETURNING *',
      [kullanici_id, uzmanlik_alani, belge_linki]
    );

    res.status(201).json({ basarili: true, veri: result.rows[0], mesaj: 'Başvurunuz başarıyla alındı.' });
  } catch (error) {
    console.error('Uzman Başvuru Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Başvuru sırasında sunucu hatası oluştu.' });
  }
});

module.exports = router;
