const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /makale/:makaleId - Makaleye ait yorumları getir
router.get('/makale/:makaleId', async (req, res) => {
  try {
    const { makaleId } = req.params;
    const result = await pool.query(
      'SELECT * FROM yorumlar WHERE makale_id = $1 ORDER BY olusturulma_tarihi ASC',
      [makaleId]
    );
    res.json({ basarili: true, veri: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makale yorumları getirilirken hata oluştu.' });
  }
});

// GET /soru/:soruId - Soruya ait yorumları getir
router.get('/soru/:soruId', async (req, res) => {
  try {
    const { soruId } = req.params;
    const result = await pool.query(
      'SELECT * FROM yorumlar WHERE soru_id = $1 ORDER BY olusturulma_tarihi ASC',
      [soruId]
    );
    res.json({ basarili: true, veri: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Soru yorumları getirilirken hata oluştu.' });
  }
});

// POST / - Yeni yorum oluştur
router.post('/', async (req, res) => {
  try {
    const { icerik, kullanici_id, makale_id, soru_id, ust_yorum_id } = req.body;
    
    if (!makale_id && !soru_id) {
      return res.status(400).json({ basarili: false, mesaj: 'Makale veya soru ID belirtilmelidir.' });
    }

    const result = await pool.query(
      'INSERT INTO yorumlar (icerik, kullanici_id, makale_id, soru_id, ust_yorum_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [icerik, kullanici_id, makale_id || null, soru_id || null, ust_yorum_id || null]
    );
    
    res.status(201).json({ basarili: true, veri: result.rows[0], mesaj: 'Yorum başarıyla eklendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Yorum eklenirken hata oluştu.' });
  }
});

// PUT /:id/oy - Yoruma oy ver (artır/azalt)
router.put('/:id/oy', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { islem } = req.body; // 'artir' veya 'azalt'

    await client.query('BEGIN');

    // 1. Oyu güncelle ve yorumu getir
    let updateQuery = 'UPDATE yorumlar SET oy_sayisi = oy_sayisi + 1 WHERE id = $1 RETURNING *';
    if (islem === 'azalt') {
      updateQuery = 'UPDATE yorumlar SET oy_sayisi = oy_sayisi - 1 WHERE id = $1 RETURNING *';
    }

    const result = await client.query(updateQuery, [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ basarili: false, mesaj: 'Yorum bulunamadı.' });
    }

    const yorum = result.rows[0];

    // 2. Eğer işlem "artir" ise yorumun yazarına karma puanı ekle
    if (islem === 'artir') {
      await client.query(
        'UPDATE kullanicilar SET karma_puani = karma_puani + 5 WHERE id = $1',
        [yorum.yazar_id]
      );
      
      // 3. Karma geçmişine logla
      await client.query(
        "INSERT INTO karma_gecmisi (kullanici_id, islem_turu, puan_degisimi) VALUES ($1, 'upvote_kazanci', 5)",
        [yorum.yazar_id]
      );
    }

    await client.query('COMMIT');
    res.json({ basarili: true, veri: yorum, mesaj: 'Yoruma verilen oy güncellendi ve karma işlendi.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Oy/Karma İşlemi Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Oy işlemi sırasında hata oluştu.' });
  } finally {
    client.release();
  }
});

// DELETE /:id - Yorum sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM yorumlar WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Silinecek yorum bulunamadı.' });
    }

    res.json({ basarili: true, mesaj: 'Yorum başarıyla silindi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Yorum silinirken hata oluştu.' });
  }
});

module.exports = router;
