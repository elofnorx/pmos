
\restrict shO4o2ij8Wgp54js7ttvkccDPIES1VbdwVBW8APqwccHZdo0tSC4nWhlJMxB1Cm
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
CREATE FUNCTION public.fn_guncelleme_tarihi_guncelle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$;
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE public.begeniler (
    id integer NOT NULL,
    kullanici_id integer NOT NULL,
    yorum_id integer,
    soru_id integer,
    tur character varying(10) NOT NULL,
    olusturulma_tarihi timestamp with time zone DEFAULT now(),
    CONSTRAINT begeniler_tur_check CHECK (((tur)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying
])::text[]))),
    CONSTRAINT chk_begeni_hedef CHECK ((((yorum_id IS NOT NULL) AND (soru_id IS NULL)) OR ((yorum_id IS NULL) AND (soru
_id IS NOT NULL))))
);
COMMENT ON TABLE public.begeniler IS 'Upvote/downvote oylama sistemi.';
CREATE SEQUENCE public.begeniler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.begeniler_id_seq OWNED BY public.begeniler.id;
CREATE TABLE public.etiketler (
    id integer NOT NULL,
    ad character varying(50) NOT NULL,
    slug character varying(50) NOT NULL
);
COMMENT ON TABLE public.etiketler IS '─░├ğerik etiketleme sistemi - anahtar kelimeler.';
CREATE SEQUENCE public.etiketler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.etiketler_id_seq OWNED BY public.etiketler.id;
CREATE TABLE public.gunluk_kayitlar (
    id integer NOT NULL,
    kullanici_id integer,
    tarih date DEFAULT CURRENT_DATE NOT NULL,
    su_miktari integer DEFAULT 0,
    semptomlar jsonb DEFAULT '[]'::jsonb,
    hareket_edildi boolean DEFAULT false,
    uyku_kalitesi character varying(50),
    ruh_hali character varying(50)
);
CREATE SEQUENCE public.gunluk_kayitlar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.gunluk_kayitlar_id_seq OWNED BY public.gunluk_kayitlar.id;
CREATE TABLE public.karma_gecmisi (
    id integer NOT NULL,
    kullanici_id integer,
    islem_turu character varying(100),
    puan_degisimi integer,
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.karma_gecmisi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.karma_gecmisi_id_seq OWNED BY public.karma_gecmisi.id;
CREATE TABLE public.kategoriler (
    id integer NOT NULL,
    ad character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    renk character varying(7) DEFAULT '#148282'::character varying
);
COMMENT ON TABLE public.kategoriler IS 'Makale ve sorular─▒ grupland─▒ran kategoriler.';
CREATE SEQUENCE public.kategoriler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.kategoriler_id_seq OWNED BY public.kategoriler.id;
CREATE TABLE public.kiliti_acilan_makaleler (
    kullanici_id integer NOT NULL,
    makale_id integer NOT NULL,
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE public.kullanicilar (
    id integer NOT NULL,
    kullanici_adi character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    sifre_hash character varying(255) NOT NULL,
    ad_soyad character varying(100),
    avatar_url character varying(500),
    bio text,
    rol character varying(20) DEFAULT 'kullanici'::character varying,
    olusturulma_tarihi timestamp with time zone DEFAULT now(),
    guncelleme_tarihi timestamp with time zone DEFAULT now(),
    uzmanlik_alani character varying(100),
    karma_puani integer DEFAULT 0,
    CONSTRAINT kullanicilar_karma_puani_check CHECK ((karma_puani >= 0)),
    CONSTRAINT kullanicilar_rol_check CHECK (((rol)::text = ANY ((ARRAY['kullanici'::character varying, 'uzman'::charac
ter varying, 'admin'::character varying])::text[])))
);
COMMENT ON TABLE public.kullanicilar IS 'Platform kullan─▒c─▒lar─▒n─▒ tutar: ├╝yeler, yazarlar ve y├Âneticiler.';
CREATE SEQUENCE public.kullanicilar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.kullanicilar_id_seq OWNED BY public.kullanicilar.id;
CREATE TABLE public.makale_etiketler (
    makale_id integer NOT NULL,
    etiket_id integer NOT NULL
);
COMMENT ON TABLE public.makale_etiketler IS 'Makaleler ve etiketler aras─▒ndaki ├ğoka-├ğok ili┼şki tablosu.';
CREATE TABLE public.makaleler (
    id integer NOT NULL,
    yazar_id integer NOT NULL,
    kategori_id integer,
    baslik character varying(300) NOT NULL,
    slug character varying(300) NOT NULL,
    ozet text,
    icerik text NOT NULL,
    kapak_gorseli character varying(500),
    durum character varying(20) DEFAULT 'taslak'::character varying,
    goruntulenme integer DEFAULT 0,
    yayinlanma_tarihi timestamp with time zone,
    olusturulma_tarihi timestamp with time zone DEFAULT now(),
    guncelleme_tarihi timestamp with time zone DEFAULT now(),
    CONSTRAINT makaleler_durum_check CHECK (((durum)::text = ANY ((ARRAY['taslak'::character varying, 'yayinda'::charac
ter varying, 'arsiv'::character varying])::text[])))
);
COMMENT ON TABLE public.makaleler IS 'Blog makaleleri - SEO uyumlu, uzun formlu editoryal i├ğerikler.';
CREATE SEQUENCE public.makaleler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.makaleler_id_seq OWNED BY public.makaleler.id;
CREATE TABLE public.soru_etiketler (
    soru_id integer NOT NULL,
    etiket_id integer NOT NULL
);
COMMENT ON TABLE public.soru_etiketler IS 'Sorular ve etiketler aras─▒ndaki ├ğoka-├ğok ili┼şki tablosu.';
CREATE TABLE public.sorular (
    id integer NOT NULL,
    yazar_id integer NOT NULL,
    kategori_id integer,
    baslik character varying(300) NOT NULL,
    icerik text NOT NULL,
    durum character varying(20) DEFAULT 'aktif'::character varying,
    oy_sayisi integer DEFAULT 0,
    goruntulenme integer DEFAULT 0,
    olusturulma_tarihi timestamp with time zone DEFAULT now(),
    guncelleme_tarihi timestamp with time zone DEFAULT now(),
    CONSTRAINT sorular_durum_check CHECK (((durum)::text = ANY ((ARRAY['aktif'::character varying, 'cozuldu'::character
 varying, 'kapali'::character varying])::text[])))
);
COMMENT ON TABLE public.sorular IS 'Topluluk forum sorular─▒ - K─▒zlarSoruyor/Reddit tarz─▒ etkile┼şim.';
CREATE SEQUENCE public.sorular_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.sorular_id_seq OWNED BY public.sorular.id;
CREATE TABLE public.uzman_basvurulari (
    id integer NOT NULL,
    kullanici_id integer,
    uzmanlik_alani character varying(100) NOT NULL,
    belge_linki text,
    durum character varying(20) DEFAULT 'bekliyor'::character varying,
    basvuru_tarihi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uzman_basvurulari_durum_check CHECK (((durum)::text = ANY ((ARRAY['bekliyor'::character varying, 'onayla
ndi'::character varying, 'reddedildi'::character varying])::text[])))
);
CREATE SEQUENCE public.uzman_basvurulari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.uzman_basvurulari_id_seq OWNED BY public.uzman_basvurulari.id;
CREATE TABLE public.yorumlar (
    id integer NOT NULL,
    yazar_id integer NOT NULL,
    makale_id integer,
    soru_id integer,
    ust_yorum_id integer,
    icerik text NOT NULL,
    oy_sayisi integer DEFAULT 0,
    olusturulma_tarihi timestamp with time zone DEFAULT now(),
    guncelleme_tarihi timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_yorum_hedef CHECK ((((makale_id IS NOT NULL) AND (soru_id IS NULL)) OR ((makale_id IS NULL) AND (sor
u_id IS NOT NULL))))
);
COMMENT ON TABLE public.yorumlar IS 'Makale ve soru yorumlar─▒. ─░├ğ i├ğe (nested) yan─▒t deste─şi.';
CREATE SEQUENCE public.yorumlar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.yorumlar_id_seq OWNED BY public.yorumlar.id;
ALTER TABLE ONLY public.begeniler ALTER COLUMN id SET DEFAULT nextval('public.begeniler_id_seq'::regclass);
ALTER TABLE ONLY public.etiketler ALTER COLUMN id SET DEFAULT nextval('public.etiketler_id_seq'::regclass);
ALTER TABLE ONLY public.gunluk_kayitlar ALTER COLUMN id SET DEFAULT nextval('public.gunluk_kayitlar_id_seq'::regclass);
ALTER TABLE ONLY public.karma_gecmisi ALTER COLUMN id SET DEFAULT nextval('public.karma_gecmisi_id_seq'::regclass);
ALTER TABLE ONLY public.kategoriler ALTER COLUMN id SET DEFAULT nextval('public.kategoriler_id_seq'::regclass);
ALTER TABLE ONLY public.kullanicilar ALTER COLUMN id SET DEFAULT nextval('public.kullanicilar_id_seq'::regclass);
ALTER TABLE ONLY public.makaleler ALTER COLUMN id SET DEFAULT nextval('public.makaleler_id_seq'::regclass);
ALTER TABLE ONLY public.sorular ALTER COLUMN id SET DEFAULT nextval('public.sorular_id_seq'::regclass);
ALTER TABLE ONLY public.uzman_basvurulari ALTER COLUMN id SET DEFAULT nextval('public.uzman_basvurulari_id_seq'::regcla
ss);
ALTER TABLE ONLY public.yorumlar ALTER COLUMN id SET DEFAULT nextval('public.yorumlar_id_seq'::regclass);
ALTER TABLE ONLY public.begeniler
    ADD CONSTRAINT begeniler_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.etiketler
    ADD CONSTRAINT etiketler_ad_key UNIQUE (ad);
ALTER TABLE ONLY public.etiketler
    ADD CONSTRAINT etiketler_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.etiketler
    ADD CONSTRAINT etiketler_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.gunluk_kayitlar
    ADD CONSTRAINT gunluk_kayitlar_kullanici_id_tarih_key UNIQUE (kullanici_id, tarih);
ALTER TABLE ONLY public.gunluk_kayitlar
    ADD CONSTRAINT gunluk_kayitlar_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.karma_gecmisi
    ADD CONSTRAINT karma_gecmisi_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.kategoriler
    ADD CONSTRAINT kategoriler_ad_key UNIQUE (ad);
ALTER TABLE ONLY public.kategoriler
    ADD CONSTRAINT kategoriler_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.kategoriler
    ADD CONSTRAINT kategoriler_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.kiliti_acilan_makaleler
    ADD CONSTRAINT kiliti_acilan_makaleler_pkey PRIMARY KEY (kullanici_id, makale_id);
ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_email_key UNIQUE (email);
ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_kullanici_adi_key UNIQUE (kullanici_adi);
ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.makale_etiketler
    ADD CONSTRAINT makale_etiketler_pkey PRIMARY KEY (makale_id, etiket_id);
ALTER TABLE ONLY public.makaleler
    ADD CONSTRAINT makaleler_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.makaleler
    ADD CONSTRAINT makaleler_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.soru_etiketler
    ADD CONSTRAINT soru_etiketler_pkey PRIMARY KEY (soru_id, etiket_id);
ALTER TABLE ONLY public.sorular
    ADD CONSTRAINT sorular_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.uzman_basvurulari
    ADD CONSTRAINT uzman_basvurulari_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.yorumlar
    ADD CONSTRAINT yorumlar_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX idx_begeni_soru_tekil ON public.begeniler USING btree (kullanici_id, soru_id) WHERE (soru_id IS NOT
 NULL);
CREATE UNIQUE INDEX idx_begeni_yorum_tekil ON public.begeniler USING btree (kullanici_id, yorum_id) WHERE (yorum_id IS 
NOT NULL);
CREATE INDEX idx_begeniler_kullanici ON public.begeniler USING btree (kullanici_id);
CREATE INDEX idx_makaleler_durum ON public.makaleler USING btree (durum);
CREATE INDEX idx_makaleler_kategori ON public.makaleler USING btree (kategori_id);
CREATE INDEX idx_makaleler_slug ON public.makaleler USING btree (slug);
CREATE INDEX idx_makaleler_tarih ON public.makaleler USING btree (yayinlanma_tarihi DESC);
CREATE INDEX idx_makaleler_yayinda ON public.makaleler USING btree (durum, yayinlanma_tarihi DESC) WHERE ((durum)::text
 = 'yayinda'::text);
CREATE INDEX idx_makaleler_yazar ON public.makaleler USING btree (yazar_id);
CREATE INDEX idx_sorular_durum ON public.sorular USING btree (durum);
CREATE INDEX idx_sorular_kategori ON public.sorular USING btree (kategori_id);
CREATE INDEX idx_sorular_oy ON public.sorular USING btree (oy_sayisi DESC);
CREATE INDEX idx_sorular_tarih ON public.sorular USING btree (olusturulma_tarihi DESC);
CREATE INDEX idx_sorular_yazar ON public.sorular USING btree (yazar_id);
CREATE INDEX idx_yorumlar_makale ON public.yorumlar USING btree (makale_id) WHERE (makale_id IS NOT NULL);
CREATE INDEX idx_yorumlar_soru ON public.yorumlar USING btree (soru_id) WHERE (soru_id IS NOT NULL);
CREATE INDEX idx_yorumlar_tarih ON public.yorumlar USING btree (olusturulma_tarihi DESC);
CREATE INDEX idx_yorumlar_ust_yorum ON public.yorumlar USING btree (ust_yorum_id) WHERE (ust_yorum_id IS NOT NULL);
CREATE INDEX idx_yorumlar_yazar ON public.yorumlar USING btree (yazar_id);
CREATE TRIGGER trg_kullanicilar_guncelle BEFORE UPDATE ON public.kullanicilar FOR EACH ROW EXECUTE FUNCTION public.fn_g
uncelleme_tarihi_guncelle();
CREATE TRIGGER trg_makaleler_guncelle BEFORE UPDATE ON public.makaleler FOR EACH ROW EXECUTE FUNCTION public.fn_guncell
eme_tarihi_guncelle();
CREATE TRIGGER trg_sorular_guncelle BEFORE UPDATE ON public.sorular FOR EACH ROW EXECUTE FUNCTION public.fn_guncelleme_
tarihi_guncelle();
CREATE TRIGGER trg_yorumlar_guncelle BEFORE UPDATE ON public.yorumlar FOR EACH ROW EXECUTE FUNCTION public.fn_guncellem
e_tarihi_guncelle();
ALTER TABLE ONLY public.begeniler
    ADD CONSTRAINT begeniler_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id) ON DELETE 
CASCADE;
ALTER TABLE ONLY public.begeniler
    ADD CONSTRAINT begeniler_soru_id_fkey FOREIGN KEY (soru_id) REFERENCES public.sorular(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.begeniler
    ADD CONSTRAINT begeniler_yorum_id_fkey FOREIGN KEY (yorum_id) REFERENCES public.yorumlar(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.gunluk_kayitlar
    ADD CONSTRAINT gunluk_kayitlar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id) ON D
ELETE CASCADE;
ALTER TABLE ONLY public.karma_gecmisi
    ADD CONSTRAINT karma_gecmisi_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id) ON DEL
ETE CASCADE;
ALTER TABLE ONLY public.kiliti_acilan_makaleler
    ADD CONSTRAINT kiliti_acilan_makaleler_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(
id) ON DELETE CASCADE;
ALTER TABLE ONLY public.kiliti_acilan_makaleler
    ADD CONSTRAINT kiliti_acilan_makaleler_makale_id_fkey FOREIGN KEY (makale_id) REFERENCES public.makaleler(id) ON DE
LETE CASCADE;
ALTER TABLE ONLY public.makale_etiketler
    ADD CONSTRAINT makale_etiketler_etiket_id_fkey FOREIGN KEY (etiket_id) REFERENCES public.etiketler(id) ON DELETE CA
SCADE;
ALTER TABLE ONLY public.makale_etiketler
    ADD CONSTRAINT makale_etiketler_makale_id_fkey FOREIGN KEY (makale_id) REFERENCES public.makaleler(id) ON DELETE CA
SCADE;
ALTER TABLE ONLY public.makaleler
    ADD CONSTRAINT makaleler_kategori_id_fkey FOREIGN KEY (kategori_id) REFERENCES public.kategoriler(id) ON DELETE SET
 NULL;
ALTER TABLE ONLY public.makaleler
    ADD CONSTRAINT makaleler_yazar_id_fkey FOREIGN KEY (yazar_id) REFERENCES public.kullanicilar(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.soru_etiketler
    ADD CONSTRAINT soru_etiketler_etiket_id_fkey FOREIGN KEY (etiket_id) REFERENCES public.etiketler(id) ON DELETE CASC
ADE;
ALTER TABLE ONLY public.soru_etiketler
    ADD CONSTRAINT soru_etiketler_soru_id_fkey FOREIGN KEY (soru_id) REFERENCES public.sorular(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sorular
    ADD CONSTRAINT sorular_kategori_id_fkey FOREIGN KEY (kategori_id) REFERENCES public.kategoriler(id) ON DELETE SET N
ULL;
ALTER TABLE ONLY public.sorular
    ADD CONSTRAINT sorular_yazar_id_fkey FOREIGN KEY (yazar_id) REFERENCES public.kullanicilar(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.uzman_basvurulari
    ADD CONSTRAINT uzman_basvurulari_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id) ON
 DELETE CASCADE;
ALTER TABLE ONLY public.yorumlar
    ADD CONSTRAINT yorumlar_makale_id_fkey FOREIGN KEY (makale_id) REFERENCES public.makaleler(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.yorumlar
    ADD CONSTRAINT yorumlar_soru_id_fkey FOREIGN KEY (soru_id) REFERENCES public.sorular(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.yorumlar
    ADD CONSTRAINT yorumlar_ust_yorum_id_fkey FOREIGN KEY (ust_yorum_id) REFERENCES public.yorumlar(id) ON DELETE CASCA
DE;
ALTER TABLE ONLY public.yorumlar
    ADD CONSTRAINT yorumlar_yazar_id_fkey FOREIGN KEY (yazar_id) REFERENCES public.kullanicilar(id) ON DELETE CASCADE;
\unrestrict shO4o2ij8Wgp54js7ttvkccDPIES1VbdwVBW8APqwccHZdo0tSC4nWhlJMxB1Cm


