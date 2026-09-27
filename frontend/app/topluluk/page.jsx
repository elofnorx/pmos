'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowBigUp, ArrowBigDown, MessageCircle, Eye, Clock,
  PlusCircle, TrendingUp, CheckCircle, Filter, Search,
  Users, Hash, ChevronRight, Flame
} from 'lucide-react';

// ─── Kategori Etiketleri ─────────────────────────────────────
const etiketler = [
  'Tümü', 'Sağlık', 'Beslenme', 'Döngü', 'Hamilelik',
  'Stres', 'Egzersiz', 'Uyku', 'Cilt Bakımı',
];

// ─── Sahte Soru Verileri ─────────────────────────────────────
const sorular = [
  {
    id: 1,
    baslik: 'Sürekli yorgunluk hissediyorum, hangi tahlilleri yaptırmalıyım?',
    icerik: 'Son 3 aydır sürekli bir yorgunluk var. Kahve de artık işe yaramıyor. Tiroit mi bakmalıyım, demir mi? Benzer durumu yaşayan var mı?',
    yazar: 'zeynep_sk',
    kategori: 'Sağlık',
    etiketler: ['Yorgunluk', 'Tahlil', 'Sağlık'],
    oy: 24,
    yorum: 18,
    goruntulenme: 342,
    tarih: '45 dk önce',
    durum: 'aktif',
    sicak: true,
  },
  {
    id: 2,
    baslik: 'Hamilelik planlayanlar için en iyi folik asit markası hangisi?',
    icerik: 'Hamilelik planlamaya başladık, folik asit almam gerektiğini biliyorum ama piyasada çok fazla marka var. Kullananlar deneyimlerini paylaşabilir mi?',
    yazar: 'elif_anne',
    kategori: 'Hamilelik',
    etiketler: ['Hamilelik', 'Vitamin', 'Öneri'],
    oy: 31,
    yorum: 26,
    goruntulenme: 567,
    tarih: '2 saat önce',
    durum: 'aktif',
    sicak: false,
  },
  {
    id: 3,
    baslik: 'PCOS tanısı aldım, beslenme önerileriniz neler?',
    icerik: 'Bugün doktorum PCOS tanısı koydu. Kilo vermem gerekiyor dedi ama nereden başlayacağımı bilmiyorum. Aynı durumda olan arkadaşlar yardım edebilir mi?',
    yazar: 'deryacim',
    kategori: 'Sağlık',
    etiketler: ['PCOS', 'Beslenme', 'Diyet'],
    oy: 45,
    yorum: 32,
    goruntulenme: 891,
    tarih: '6 saat önce',
    durum: 'cozuldu',
    sicak: true,
  },
  {
    id: 4,
    baslik: 'Uyku kalitesini artırmak için ne yapıyorsunuz?',
    icerik: 'Gece saat 2-3\'e kadar uyuyamıyorum, sabah da çok zor kalkıyorum. Melatonin dışında doğal yöntem önerisi olan var mı?',
    yazar: 'gece_kusu',
    kategori: 'Uyku',
    etiketler: ['Uyku', 'DoğalYöntem', 'Sağlık'],
    oy: 19,
    yorum: 14,
    goruntulenme: 234,
    tarih: '1 gün önce',
    durum: 'aktif',
    sicak: false,
  },
  {
    id: 5,
    baslik: 'Yoğun stres döneminde ciltte çıkan kızarıklıklar normal mi?',
    icerik: 'İş yerinde çok stresli bir dönemden geçiyorum ve yanaklarımda kırmızı lekeler oluştu. Dermatoloğa mı gitmeliyim, kendiliğinden geçer mi?',
    yazar: 'stresli_kiz',
    kategori: 'Cilt Bakımı',
    etiketler: ['Stres', 'CiltBakımı', 'Dermatoloji'],
    oy: 12,
    yorum: 9,
    goruntulenme: 178,
    tarih: '1 gün önce',
    durum: 'aktif',
    sicak: false,
  },
  {
    id: 6,
    baslik: 'Adet öncesi şiddetli migren yaşayan var mı?',
    icerik: 'Her döngüden 2-3 gün önce dayanılmaz migren ağrılarım oluyor. Doktorum hormonal dedi ama ağrı kesiciler işe yaramıyor. Ne yapabilirim?',
    yazar: 'migren_savasçısı',
    kategori: 'Döngü',
    etiketler: ['Döngü', 'Migren', 'Hormon'],
    oy: 38,
    yorum: 22,
    goruntulenme: 456,
    tarih: '2 gün önce',
    durum: 'aktif',
    sicak: true,
  },
];

// ─── Soru Kartı Bileşeni ─────────────────────────────────────
function SoruKarti({ soru }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [oyDurumu, setOyDurumu] = useState(null); // 'up' | 'down' | null
  const [oylar, setOylar] = useState(soru.oy);

  const oyVer = (tur) => {
    if (!session) {
      if(confirm('Oylama yapmak için giriş yapmalısınız. Giriş sayfasına gitmek ister misiniz?')) {
        router.push('/giris');
      }
      return;
    }

    if (oyDurumu === tur) {
      // Geri al
      setOyDurumu(null);
      setOylar(soru.oy);
    } else {
      setOyDurumu(tur);
      setOylar(tur === 'up' ? soru.oy + 1 : soru.oy - 1);
    }
  };

  return (
    <article className="bg-surface rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex">
        {/* Sol: Oylama Bölümü */}
        <div className="flex flex-col items-center gap-1 px-3 py-4 bg-gray-50/70 border-r border-gray-100 min-w-[56px]">
          <button
            onClick={() => oyVer('up')}
            className={`p-1 rounded-lg transition-all duration-200 ${
              oyDurumu === 'up'
                ? 'text-primary bg-primary/10 scale-110'
                : 'text-gray-400 hover:text-primary hover:bg-primary/5'
            }`}
            aria-label="Yukarı oy"
          >
            <ArrowBigUp size={24} className={oyDurumu === 'up' ? 'fill-primary' : ''} />
          </button>
          <span className={`text-sm font-bold tabular-nums ${
            oyDurumu === 'up' ? 'text-primary' : oyDurumu === 'down' ? 'text-red-500' : 'text-text'
          }`}>
            {oylar}
          </span>
          <button
            onClick={() => oyVer('down')}
            className={`p-1 rounded-lg transition-all duration-200 ${
              oyDurumu === 'down'
                ? 'text-red-500 bg-red-50 scale-110'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            aria-label="Aşağı oy"
          >
            <ArrowBigDown size={24} className={oyDurumu === 'down' ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Sağ: İçerik Bölümü */}
        <div className="flex-1 p-4 min-w-0">
          {/* Üst Rozetler */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Kategori */}
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {soru.kategori}
            </span>
            {/* Durum: Çözüldü */}
            {soru.durum === 'cozuldu' && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle size={12} />
                Çözüldü
              </span>
            )}
            {/* Sıcak/Gündem */}
            {soru.sicak && (
              <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                <Flame size={12} />
                Gündem
              </span>
            )}
          </div>

          {/* Başlık */}
          <h3 className="text-base font-bold text-text hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-1.5">
            {soru.baslik}
          </h3>

          {/* İçerik Önizleme */}
          <p className="text-sm text-text-light line-clamp-2 mb-3 leading-relaxed">
            {soru.icerik}
          </p>

          {/* Etiketler */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {soru.etiketler.map((etiket) => (
              <span
                key={etiket}
                className="inline-flex items-center gap-1 text-xs text-text-muted bg-gray-100 hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                <Hash size={10} />
                {etiket}
              </span>
            ))}
          </div>

          {/* Alt Bilgi Çubuğu */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-dark">
                    {soru.yazar.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-text-light">@{soru.yazar}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {soru.tarih}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MessageCircle size={13} />
                {soru.yorum} cevap
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {soru.goruntulenme}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Ana Sayfa Bileşeni ─────────────────────────────────────
export default function ToplulukSayfasi() {
  const { data: session } = useSession();
  const router = useRouter();
  const [aktifEtiket, setAktifEtiket] = useState('Tümü');
  const [siralama, setSiralama] = useState('yeni');

  const handleSoruSor = () => {
    if (!session) {
      if(confirm('Yeni soru sormak için aramıza katılmalısın. Giriş sayfasına gitmek ister misin?')) {
        router.push('/giris');
      }
      return;
    }
    // Yönlendirme veya modal açma (şimdilik log)
    console.log('Soru sorma modali açılıyor...');
  };

  // Filtreleme
  const filtrelenmis = aktifEtiket === 'Tümü'
    ? sorular
    : sorular.filter((s) => s.kategori === aktifEtiket || s.etiketler.includes(aktifEtiket));

  // Sıralama
  const sirali = [...filtrelenmis].sort((a, b) => {
    if (siralama === 'populer') return b.oy - a.oy;
    if (siralama === 'cevap') return b.yorum - a.yorum;
    return 0; // 'yeni' - orijinal sıra
  });

  return (
    <MainLayout>
      {/* Başlık Alanı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-text">PMOS Topluluk Forumu</h1>
          </div>
          <p className="text-text-light text-sm">
            Sağlık sorularını sor, deneyimlerini paylaş, birlikte güçlen. 💜
          </p>
        </div>

        {/* Yeni Soru Sor Butonu */}
        <button 
          onClick={handleSoruSor}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
        >
          <PlusCircle size={20} />
          Yeni Soru Sor / Dertleş
        </button>
      </div>

      {/* Filtre ve Arama Çubuğu */}
      <div className="space-y-4 mb-6 pb-4 border-b border-gray-100">
        {/* Arama */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Topluluğu ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Etiket Filtreleri */}
        <div className="flex flex-wrap gap-2">
          {etiketler.map((etiket) => (
            <button
              key={etiket}
              onClick={() => setAktifEtiket(etiket)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                aktifEtiket === etiket
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-text-light hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {etiket}
            </button>
          ))}
        </div>

        {/* Sıralama */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          <span className="text-xs text-text-muted mr-1">Sırala:</span>
          {[
            { key: 'yeni', label: 'En Yeni' },
            { key: 'populer', label: 'En Çok Oylanan' },
            { key: 'cevap', label: 'En Çok Cevap' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSiralama(opt.key)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                siralama === opt.key
                  ? 'bg-text text-white'
                  : 'text-text-muted hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Soru Listesi */}
      <div className="space-y-4">
        {sirali.map((soru, index) => (
          <div key={soru.id}>
            <SoruKarti soru={soru} />

            {/* Her 3 sorudan sonra akış içi reklam */}
            {(index + 1) % 3 === 0 && index < sirali.length - 1 && (
              <div className="my-4 ad-zone bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-text-muted text-sm h-20">
                Reklam Alanı - Akış İçi (728×90)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sonuç Yok */}
      {sirali.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Bu kategoride henüz soru yok.</p>
          <p className="text-sm mt-1">İlk soruyu sormaya ne dersin?</p>
        </div>
      )}
    </MainLayout>
  );
}
