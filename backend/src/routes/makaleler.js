const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET / - Tüm yayınlanmış makaleleri listele (sayfalama ile)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM makaleler WHERE durum = $1 ORDER BY olusturulma_tarihi DESC LIMIT $2 OFFSET $3',
      ['yayinlandi', limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM makaleler WHERE durum = $1', ['yayinlandi']);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      basarili: true,
      veri: result.rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makaleler getirilirken hata oluştu.' });
  }
});

// GET /:slug - Belirli bir makaleyi slug ile getir (görüntülenme sayısını artırır)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Görüntülenme sayısını artır ve makaleyi getir
    const result = await pool.query(
      'UPDATE makaleler SET goruntulenme_sayisi = goruntulenme_sayisi + 1 WHERE slug = $1 RETURNING *',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Makale bulunamadı.' });
    }

    res.json({ basarili: true, veri: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makale getirilirken hata oluştu.' });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

// POST / - Yeni makale oluştur (Normalde kimlik doğrulama ile korunmalıdır)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { baslik, slug, icerik, yazar_id, durum } = req.body;
    const result = await pool.query(
      'INSERT INTO makaleler (baslik, slug, icerik, yazar_id, durum) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [baslik, slug, icerik, yazar_id, durum || 'taslak']
    );
    res.status(201).json({ basarili: true, veri: result.rows[0], mesaj: 'Makale başarıyla oluşturuldu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makale oluşturulurken hata oluştu.' });
  }
});

// PUT /:id - Makale güncelle (Korunmalı)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { baslik, slug, icerik, durum } = req.body;
    const result = await pool.query(
      'UPDATE makaleler SET baslik = $1, slug = $2, icerik = $3, durum = $4, guncellenme_tarihi = NOW() WHERE id = $5 RETURNING *',
      [baslik, slug, icerik, durum, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Güncellenecek makale bulunamadı.' });
    }

    res.json({ basarili: true, veri: result.rows[0], mesaj: 'Makale güncellendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makale güncellenirken hata oluştu.' });
  }
});

// DELETE /:id - Makale sil (Korunmalı)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM makaleler WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ basarili: false, mesaj: 'Silinecek makale bulunamadı.' });
    }

    res.json({ basarili: true, mesaj: 'Makale başarıyla silindi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ basarili: false, mesaj: 'Makale silinirken hata oluştu.' });
  }
});

// POST /:id/kilit-ac - Premium makalenin kilidini aç (Karma Puanı harcayarak)
router.post('/:id/kilit-ac', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id: makale_id } = req.params;
    const kullanici_id = req.user.id;
    const GEREKLI_PUAN = 50;

    await client.query('BEGIN');

    // 1. Kullanıcının güncel puanını kontrol et
    const userResult = await client.query('SELECT karma_puani FROM kullanicilar WHERE id = $1 FOR UPDATE', [kullanici_id]);
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı.' });
    }

    const { karma_puani } = userResult.rows[0];

    // 2. Makale zaten açılmış mı diye kontrol et (opsiyonel ama sağlıklı)
    const checkResult = await client.query('SELECT * FROM kiliti_acilan_makaleler WHERE kullanici_id = $1 AND makale_id = $2', [kullanici_id, makale_id]);
    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(200).json({ basarili: true, mesaj: 'Bu makalenin kilidi zaten açılmış.' });
    }

    // 3. Puan kontrolü
    if (karma_puani < GEREKLI_PUAN) {
      await client.query('ROLLBACK');
      return res.status(400).json({ basarili: false, mesaj: 'Yetersiz Karma Puanı. Makale kilidini açmak için 50 puana ihtiyacınız var.' });
    }

    // 4. Kullanıcıdan puanı düş
    await client.query('UPDATE kullanicilar SET karma_puani = karma_puani - $1 WHERE id = $2', [GEREKLI_PUAN, kullanici_id]);

    // 5. Karma geçmişine logla
    await client.query(
      "INSERT INTO karma_gecmisi (kullanici_id, islem_turu, puan_degisimi) VALUES ($1, 'makale_kilidi_acma', $2)",
      [kullanici_id, -GEREKLI_PUAN]
    );

    // 6. Kiliti açılan makaleler tablosuna ekle
    await client.query(
      'INSERT INTO kiliti_acilan_makaleler (kullanici_id, makale_id) VALUES ($1, $2)',
      [kullanici_id, makale_id]
    );

    await client.query('COMMIT');
    res.json({ basarili: true, mesaj: 'Tebrikler! Premium makalenin kilidi açıldı.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Kilit Açma Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Makale kilit açma işlemi sırasında hata oluştu.' });
  } finally {
    client.release();
  }
});

module.exports = router;
