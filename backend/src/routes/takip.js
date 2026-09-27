const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/takip/gunluk - Günlük verileri upsert (ekle/güncelle) yap
router.post('/gunluk', authMiddleware, async (req, res) => {
  try {
    const kullanici_id = req.user.id;
    // Client can optionally send a date, otherwise use today (UTC/server time)
    const { 
      tarih = new Date().toISOString().split('T')[0], 
      su_tuketimi, 
      semptomlar, 
      takviyeler_alindi, 
      duygu_durumu 
    } = req.body;

    const query = `
      INSERT INTO gunluk_kayitlar (kullanici_id, tarih, su_tuketimi, semptomlar, takviyeler_alindi, duygu_durumu)
      VALUES ($1, $2, COALESCE($3, 0), COALESCE($4, '[]'::jsonb), COALESCE($5, false), $6)
      ON CONFLICT (kullanici_id, tarih) 
      DO UPDATE SET 
        su_tuketimi = COALESCE(EXCLUDED.su_tuketimi, gunluk_kayitlar.su_tuketimi),
        semptomlar = COALESCE(EXCLUDED.semptomlar, gunluk_kayitlar.semptomlar),
        takviyeler_alindi = COALESCE(EXCLUDED.takviyeler_alindi, gunluk_kayitlar.takviyeler_alindi),
        duygu_durumu = COALESCE(EXCLUDED.duygu_durumu, gunluk_kayitlar.duygu_durumu)
      RETURNING *;
    `;

    const values = [
      kullanici_id, 
      tarih, 
      su_tuketimi !== undefined ? su_tuketimi : null, 
      semptomlar !== undefined ? JSON.stringify(semptomlar) : null, 
      takviyeler_alindi !== undefined ? takviyeler_alindi : null, 
      duygu_durumu !== undefined ? duygu_durumu : null
    ];

    const result = await pool.query(query, values);

    res.status(200).json({ basarili: true, veri: result.rows[0], mesaj: 'Kayıt başarıyla güncellendi.' });
  } catch (error) {
    console.error('Takip Upsert Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Veri kaydedilirken hata oluştu.' });
  }
});

// GET /api/takip/bugun (veya /gunluk GET için) - Bugünkü mevcut kaydı getir
router.get('/gunluk', authMiddleware, async (req, res) => {
  try {
    const kullanici_id = req.user.id;
    const tarih = req.query.tarih || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      'SELECT * FROM gunluk_kayitlar WHERE kullanici_id = $1 AND tarih = $2',
      [kullanici_id, tarih]
    );

    if (result.rows.length === 0) {
      // Return empty default state if not exists
      return res.json({ 
        basarili: true, 
        veri: { su_tuketimi: 0, semptomlar: [], takviyeler_alindi: false, duygu_durumu: null } 
      });
    }

    res.json({ basarili: true, veri: result.rows[0] });
  } catch (error) {
    console.error('Takip Bugün Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Veri getirilirken hata oluştu.' });
  }
});

// GET /api/takip/haftalik - Son 7 günün alışkanlık verilerini getir
router.get('/haftalik', authMiddleware, async (req, res) => {
  try {
    const kullanici_id = req.user.id;
    
    // Calculate last 7 days records
    const result = await pool.query(
      `SELECT tarih, su_tuketimi, semptomlar, takviyeler_alindi, duygu_durumu 
       FROM gunluk_kayitlar 
       WHERE kullanici_id = $1 AND tarih >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY tarih ASC`,
      [kullanici_id]
    );

    const gunler = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    // Generate the last 7 days array
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = gunler[d.getDay()];
      
      const record = result.rows.find(r => {
        // Handle timezone issues if any, extract the exact YYYY-MM-DD
        const recordDate = new Date(r.tarih);
        return recordDate.toISOString().split('T')[0] === isoDate;
      });
      
      let score = 10; // base score
      if (record) {
        if (record.su_tuketimi >= 6) score += 40;
        else if (record.su_tuketimi > 0) score += 20;
        
        if (record.takviyeler_alindi) score += 30;
        if (record.duygu_durumu === 'Mutlu' || record.duygu_durumu === 'Enerjik') score += 20;
      }

      chartData.push({
        gun: dayName,
        tarih: isoDate,
        uyum_yuzdesi: Math.min(score, 100),
        su_tuketimi: record ? record.su_tuketimi : 0,
        takviyeler_alindi: record ? record.takviyeler_alindi : false
      });
    }

    res.json({ basarili: true, veri: chartData });
  } catch (error) {
    console.error('Takip Haftalık Hatası:', error);
    res.status(500).json({ basarili: false, mesaj: 'Haftalık veri getirilirken hata oluştu.' });
  }
});

module.exports = router;
