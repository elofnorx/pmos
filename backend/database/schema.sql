-- ============================================================
-- PMOS - Kadın Sağlığı ve Yaşam Tarzı Platformu
-- PostgreSQL Veritabanı Şeması
-- Oluşturulma Tarihi: 2026-09-27
-- ============================================================

-- Veritabanını oluştur (gerekirse)
-- CREATE DATABASE pmos_db WITH ENCODING 'UTF8' LC_COLLATE 'tr_TR.UTF-8';

-- UUID extension (opsiyonel)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. KULLANICILAR (Users)
-- Platform üyelerini, yazarları ve yöneticileri tutar.
-- ============================================================
CREATE TABLE Kullanicilar (
    id              SERIAL PRIMARY KEY,
    kullanici_adi   VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    sifre_hash      VARCHAR(255) NOT NULL,
    ad_soyad        VARCHAR(100),
    avatar_url      VARCHAR(500),
    bio             TEXT,
    rol             VARCHAR(20)  DEFAULT 'uye'
                    CHECK (rol IN ('uye', 'yazar', 'admin')),
    olusturulma_tarihi  TIMESTAMPTZ DEFAULT NOW(),
    guncelleme_tarihi   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE Kullanicilar IS 'Platform kullanıcılarını tutar: üyeler, yazarlar ve yöneticiler.';

-- ============================================================
-- 2. KATEGORILER (Categories)
-- Makale ve soruları gruplamak için kullanılan kategoriler.
-- ============================================================
CREATE TABLE Kategoriler (
    id    SERIAL PRIMARY KEY,
    ad    VARCHAR(100) UNIQUE NOT NULL,
    slug  VARCHAR(100) UNIQUE NOT NULL,
    renk  VARCHAR(7) DEFAULT '#148282'
);

COMMENT ON TABLE Kategoriler IS 'Makale ve soruları gruplandıran kategoriler.';

-- Varsayılan kategorileri ekle
INSERT INTO Kategoriler (ad, slug, renk) VALUES
    ('Beslenme',       'beslenme',        '#148282'),
    ('Döngü',          'dongu',           '#E85D75'),
    ('Egzersiz',       'egzersiz',        '#4CAF50'),
    ('Stres',          'stres',           '#FF9800'),
    ('Cilt Bakımı',    'cilt-bakimi',     '#9C27B0'),
    ('Uyku',           'uyku',            '#3F51B5'),
    ('Hamilelik',      'hamilelik',       '#F06292'),
    ('Mental Sağlık',  'mental-saglik',   '#00BCD4'),
    ('Yaşam',          'yasam',           '#FFB385');

-- ============================================================
-- 3. ETIKETLER (Tags)
-- Makale ve sorulara atanan anahtar kelimeler.
-- ============================================================
CREATE TABLE Etiketler (
    id    SERIAL PRIMARY KEY,
    ad    VARCHAR(50) UNIQUE NOT NULL,
    slug  VARCHAR(50) UNIQUE NOT NULL
);

COMMENT ON TABLE Etiketler IS 'İçerik etiketleme sistemi - anahtar kelimeler.';

-- Varsayılan etiketleri ekle
INSERT INTO Etiketler (ad, slug) VALUES
    ('Beslenme',     'beslenme'),
    ('Döngü',        'dongu'),
    ('Stres',        'stres'),
    ('Egzersiz',     'egzersiz'),
    ('CiltBakımı',   'cilt-bakimi'),
    ('Uyku',         'uyku'),
    ('Hamilelik',    'hamilelik'),
    ('MentalSağlık', 'mental-saglik'),
    ('Bağışıklık',   'bagisiklik'),
    ('Vitamin',      'vitamin'),
    ('Diyet',        'diyet'),
    ('Yoga',         'yoga'),
    ('PCOS',         'pcos'),
    ('Tahlil',       'tahlil'),
    ('DoğalYöntem',  'dogal-yontem');

-- ============================================================
-- 4. MAKALELER (Articles / Blog Posts)
-- Uzman yazarlar tarafından oluşturulan editoryal makaleler.
-- ============================================================
CREATE TABLE Makaleler (
    id                  SERIAL PRIMARY KEY,
    yazar_id            INT NOT NULL
                        REFERENCES Kullanicilar(id) ON DELETE CASCADE,
    kategori_id         INT
                        REFERENCES Kategoriler(id) ON DELETE SET NULL,
    baslik              VARCHAR(300) NOT NULL,
    slug                VARCHAR(300) UNIQUE NOT NULL,
    ozet                TEXT,
    icerik              TEXT NOT NULL,
    kapak_gorseli       VARCHAR(500),
    durum               VARCHAR(20) DEFAULT 'taslak'
                        CHECK (durum IN ('taslak', 'yayinda', 'arsiv')),
    goruntulenme        INT DEFAULT 0,
    yayinlanma_tarihi   TIMESTAMPTZ,
    olusturulma_tarihi  TIMESTAMPTZ DEFAULT NOW(),
    guncelleme_tarihi   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE Makaleler IS 'Blog makaleleri - SEO uyumlu, uzun formlu editoryal içerikler.';

-- ============================================================
-- 5. MAKALE_ETIKETLER (Article-Tag Junction)
-- Makaleler ile etiketler arasındaki çoktan-çoğa ilişki.
-- ============================================================
CREATE TABLE Makale_Etiketler (
    makale_id   INT NOT NULL REFERENCES Makaleler(id) ON DELETE CASCADE,
    etiket_id   INT NOT NULL REFERENCES Etiketler(id) ON DELETE CASCADE,
    PRIMARY KEY (makale_id, etiket_id)
);

COMMENT ON TABLE Makale_Etiketler IS 'Makaleler ve etiketler arasındaki çoka-çok ilişki tablosu.';

-- ============================================================
-- 6. SORULAR (Questions / Forum Posts)
-- Topluluk üyelerinin sorduğu sorular (Reddit/Forum tarzı).
-- ============================================================
CREATE TABLE Sorular (
    id                  SERIAL PRIMARY KEY,
    yazar_id            INT NOT NULL
                        REFERENCES Kullanicilar(id) ON DELETE CASCADE,
    kategori_id         INT
                        REFERENCES Kategoriler(id) ON DELETE SET NULL,
    baslik              VARCHAR(300) NOT NULL,
    icerik              TEXT NOT NULL,
    durum               VARCHAR(20) DEFAULT 'aktif'
                        CHECK (durum IN ('aktif', 'cozuldu', 'kapali')),
    oy_sayisi           INT DEFAULT 0,
    goruntulenme        INT DEFAULT 0,
    olusturulma_tarihi  TIMESTAMPTZ DEFAULT NOW(),
    guncelleme_tarihi   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE Sorular IS 'Topluluk forum soruları - KızlarSoruyor/Reddit tarzı etkileşim.';

-- ============================================================
-- 7. SORU_ETIKETLER (Question-Tag Junction)
-- Sorular ile etiketler arasındaki çoktan-çoğa ilişki.
-- ============================================================
CREATE TABLE Soru_Etiketler (
    soru_id     INT NOT NULL REFERENCES Sorular(id) ON DELETE CASCADE,
    etiket_id   INT NOT NULL REFERENCES Etiketler(id) ON DELETE CASCADE,
    PRIMARY KEY (soru_id, etiket_id)
);

COMMENT ON TABLE Soru_Etiketler IS 'Sorular ve etiketler arasındaki çoka-çok ilişki tablosu.';

-- ============================================================
-- 8. YORUMLAR (Comments - Polymorphic)
-- Hem makale hem de soru yorumları. İç içe (nested) destekli.
-- ============================================================
CREATE TABLE Yorumlar (
    id                  SERIAL PRIMARY KEY,
    yazar_id            INT NOT NULL
                        REFERENCES Kullanicilar(id) ON DELETE CASCADE,
    makale_id           INT
                        REFERENCES Makaleler(id) ON DELETE CASCADE,
    soru_id             INT
                        REFERENCES Sorular(id) ON DELETE CASCADE,
    ust_yorum_id        INT
                        REFERENCES Yorumlar(id) ON DELETE CASCADE,
    icerik              TEXT NOT NULL,
    oy_sayisi           INT DEFAULT 0,
    olusturulma_tarihi  TIMESTAMPTZ DEFAULT NOW(),
    guncelleme_tarihi   TIMESTAMPTZ DEFAULT NOW(),

    -- Bir yorum ya bir makaleye ya da bir soruya ait olmalı (ikisine birden değil)
    CONSTRAINT chk_yorum_hedef CHECK (
        (makale_id IS NOT NULL AND soru_id IS NULL)
        OR
        (makale_id IS NULL AND soru_id IS NOT NULL)
    )
);

COMMENT ON TABLE Yorumlar IS 'Makale ve soru yorumları. İç içe (nested) yanıt desteği.';

-- ============================================================
-- 9. BEGENILER (Votes / Likes)
-- Upvote/Downvote sistemi - sorular ve yorumlar için.
-- ============================================================
CREATE TABLE Begeniler (
    id                  SERIAL PRIMARY KEY,
    kullanici_id        INT NOT NULL
                        REFERENCES Kullanicilar(id) ON DELETE CASCADE,
    yorum_id            INT
                        REFERENCES Yorumlar(id) ON DELETE CASCADE,
    soru_id             INT
                        REFERENCES Sorular(id) ON DELETE CASCADE,
    tur                 VARCHAR(10) NOT NULL
                        CHECK (tur IN ('up', 'down')),
    olusturulma_tarihi  TIMESTAMPTZ DEFAULT NOW(),

    -- Bir beğeni ya bir yoruma ya da bir soruya ait olmalı
    CONSTRAINT chk_begeni_hedef CHECK (
        (yorum_id IS NOT NULL AND soru_id IS NULL)
        OR
        (yorum_id IS NULL AND soru_id IS NOT NULL)
    )
);

COMMENT ON TABLE Begeniler IS 'Upvote/downvote oylama sistemi.';

-- Her kullanıcı bir yorumu/soruyu yalnızca bir kez oylayabilir
CREATE UNIQUE INDEX idx_begeni_yorum_tekil
    ON Begeniler (kullanici_id, yorum_id)
    WHERE yorum_id IS NOT NULL;

CREATE UNIQUE INDEX idx_begeni_soru_tekil
    ON Begeniler (kullanici_id, soru_id)
    WHERE soru_id IS NOT NULL;

-- ============================================================
-- PERFORMANS İNDEKSLERİ
-- Sık sorgulanan alanlarda hız optimizasyonu.
-- ============================================================

-- Makaleler indeksleri
CREATE INDEX idx_makaleler_yazar     ON Makaleler (yazar_id);
CREATE INDEX idx_makaleler_kategori  ON Makaleler (kategori_id);
CREATE INDEX idx_makaleler_durum     ON Makaleler (durum);
CREATE INDEX idx_makaleler_slug      ON Makaleler (slug);
CREATE INDEX idx_makaleler_tarih     ON Makaleler (yayinlanma_tarihi DESC);
CREATE INDEX idx_makaleler_yayinda   ON Makaleler (durum, yayinlanma_tarihi DESC)
    WHERE durum = 'yayinda';

-- Sorular indeksleri
CREATE INDEX idx_sorular_yazar       ON Sorular (yazar_id);
CREATE INDEX idx_sorular_kategori    ON Sorular (kategori_id);
CREATE INDEX idx_sorular_durum       ON Sorular (durum);
CREATE INDEX idx_sorular_tarih       ON Sorular (olusturulma_tarihi DESC);
CREATE INDEX idx_sorular_oy          ON Sorular (oy_sayisi DESC);

-- Yorumlar indeksleri
CREATE INDEX idx_yorumlar_yazar      ON Yorumlar (yazar_id);
CREATE INDEX idx_yorumlar_makale     ON Yorumlar (makale_id) WHERE makale_id IS NOT NULL;
CREATE INDEX idx_yorumlar_soru       ON Yorumlar (soru_id) WHERE soru_id IS NOT NULL;
CREATE INDEX idx_yorumlar_ust_yorum  ON Yorumlar (ust_yorum_id) WHERE ust_yorum_id IS NOT NULL;
CREATE INDEX idx_yorumlar_tarih      ON Yorumlar (olusturulma_tarihi DESC);

-- Begeniler indeksleri
CREATE INDEX idx_begeniler_kullanici ON Begeniler (kullanici_id);

-- ============================================================
-- OTOMATİK GÜNCELLEME TETİKLEYİCİSİ (Trigger)
-- 'guncelleme_tarihi' alanını UPDATE sorgularında otomatik günceller.
-- ============================================================

CREATE OR REPLACE FUNCTION fn_guncelleme_tarihi_guncelle()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tüm tablolara trigger uygula
CREATE TRIGGER trg_kullanicilar_guncelle
    BEFORE UPDATE ON Kullanicilar
    FOR EACH ROW EXECUTE FUNCTION fn_guncelleme_tarihi_guncelle();

CREATE TRIGGER trg_makaleler_guncelle
    BEFORE UPDATE ON Makaleler
    FOR EACH ROW EXECUTE FUNCTION fn_guncelleme_tarihi_guncelle();

CREATE TRIGGER trg_sorular_guncelle
    BEFORE UPDATE ON Sorular
    FOR EACH ROW EXECUTE FUNCTION fn_guncelleme_tarihi_guncelle();

CREATE TRIGGER trg_yorumlar_guncelle
    BEFORE UPDATE ON Yorumlar
    FOR EACH ROW EXECUTE FUNCTION fn_guncelleme_tarihi_guncelle();

-- ============================================================
-- ÖRNEK VERİLER (Seed Data)
-- Test amaçlı başlangıç verileri.
-- ============================================================

-- Örnek kullanıcılar (şifre: 'pmos123' - bcrypt hash)
INSERT INTO Kullanicilar (kullanici_adi, email, sifre_hash, ad_soyad, bio, rol) VALUES
    ('dr_ayse', 'ayse@pmos.com', '$2a$10$example_hash_1', 'Dr. Ayşe Yılmaz',
     'Beslenme uzmanı, 15 yıllık klinik deneyim.', 'yazar'),
    ('selin_kaya', 'selin@pmos.com', '$2a$10$example_hash_2', 'Selin Kaya',
     'Fitness eğitmeni ve yaşam koçu.', 'yazar'),
    ('zeynep_sk', 'zeynep@email.com', '$2a$10$example_hash_3', 'Zeynep S.',
     'PMOS topluluğu üyesi.', 'uye'),
    ('admin', 'admin@pmos.com', '$2a$10$example_hash_4', 'PMOS Admin',
     'Platform yöneticisi.', 'admin');

-- ============================================================
-- SON
-- Veritabanı şeması başarıyla oluşturuldu.
-- ============================================================
