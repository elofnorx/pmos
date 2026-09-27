const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET / - Aktif soruları listele (sayfalama ve sıralama ile)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest'; // 'newest' veya 'voted'
    const offset = (page - 1) * limit;

    let orderBy = 'olusturulma_tarihi DESC';
    if (sort === 'voted') {
      orderBy = 'oy_sayisi DESC';
    }

    const result = await pool.query(
      `SELECT * FROM sorular WHERE aktif = true ORDER BY ${orderBy} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM sorular WHERE aktif = true');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      basarili: true,
      veri: result.rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Sorular getirilirken hata oluştu.' });
  }
});

// GET /:id - Belirli bir soruyu ve yorumlarını getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const soruResult = await pool.query('SELECT * FROM sorular WHERE id = $1', [id]);
    
    if (soruResult.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Soru bulunamadı.' });
    }

    const yorumlarResult = await pool.query(
      `SELECT y.*, k.kullanici_adi, k.avatar_url, k.rol, k.uzmanlik_alani 
       FROM yorumlar y 
       LEFT JOIN kullanicilar k ON y.yazar_id = k.id 
       WHERE y.soru_id = $1 
       ORDER BY 
         CASE WHEN k.rol = 'uzman' THEN 1 ELSE 2 END ASC, 
         y.olusturulma_tarihi ASC`, 
      [id]
    );

    const veri = {
      ...soruResult.rows[0],
      yorumlar: yorumlarResult.rows
    };

    res.json({ basarili: true, veri });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Soru getirilirken hata oluştu.' });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

// POST / - Yeni soru oluştur (Üyelere özel)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { baslik, icerik, kullanici_id } = req.body;
    const result = await pool.query(
      'INSERT INTO sorular (baslik, icerik, kullanici_id) VALUES ($1, $2, $3) RETURNING *',
      [baslik, icerik, kullanici_id]
    );
    res.status(201).json({ basarili: true, veri: result.rows[0], mesaj: 'Soru başarıyla oluşturuldu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Soru oluşturulurken hata oluştu.' });
  }
});

// PUT /:id/oy - Soruya oy ver (artır/azalt)
router.put('/:id/oy', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { islem } = req.body; // 'artir' veya 'azalt'

    let updateQuery = 'UPDATE sorular SET oy_sayisi = oy_sayisi + 1 WHERE id = $1 RETURNING *';
    if (islem === 'azalt') {
      updateQuery = 'UPDATE sorular SET oy_sayisi = oy_sayisi - 1 WHERE id = $1 RETURNING *';
    }

    const result = await pool.query(updateQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Soru bulunamadı.' });
    }

    res.json({ basarili: true, veri: result.rows[0], mesaj: 'Soruya verilen oy kaydedildi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Oy işlemi sırasında hata oluştu.' });
  }
});

// DELETE /:id - Soru sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sorular WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Silinecek soru bulunamadı.' });
    }

    res.json({ basarili: true, mesaj: 'Soru başarıyla silindi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Soru silinirken hata oluştu.' });
  }
});

// POST /:id/yorumlar - Soruya cevap/yorum yaz (Korunmalı)
router.post('/:id/yorumlar', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { icerik, yazar_id } = req.body;
    
    // Yorumu ekle
    const insertResult = await pool.query(
      'INSERT INTO yorumlar (soru_id, yazar_id, icerik) VALUES ($1, $2, $3) RETURNING *',
      [id, yazar_id, icerik]
    );
    
    const yeniYorum = insertResult.rows[0];

    // Yazarın rol ve uzmanlık bilgilerini çek
    const userResult = await pool.query(
      'SELECT kullanici_adi, avatar_url, rol, uzmanlik_alani FROM kullanicilar WHERE id = $1',
      [yazar_id]
    );

    const yazarBilgisi = userResult.rows[0];

    res.status(201).json({
      basarili: true,
      veri: {
        ...yeniYorum,
        kullanici_adi: yazarBilgisi.kullanici_adi,
        avatar_url: yazarBilgisi.avatar_url,
        rol: yazarBilgisi.rol,
        uzmanlik_alani: yazarBilgisi.uzmanlik_alani
      },
      mesaj: 'Cevabınız başarıyla eklendi.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Cevap eklenirken hata oluştu.' });
  }
});

module.exports = router;
