'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Clock, Eye, Heart, MessageCircle, ChevronRight,
  BookOpen, Salad, Activity, Brain, Dumbbell, Sparkles,
  User, ArrowRight, Lock
} from 'lucide-react';

// ─── Kategori Filtreleri ─────────────────────────────────────
const kategoriler = [
  { label: 'Tümü',           slug: 'tumu',           icon: Sparkles },
  { label: 'Beslenme',       slug: 'beslenme',       icon: Salad },
  { label: 'Döngü',          slug: 'dongu',           icon: Activity },
  { label: 'Stres Yönetimi', slug: 'stres-yonetimi', icon: Brain },
  { label: 'Egzersiz',       slug: 'egzersiz',       icon: Dumbbell },
];

// ─── Sahte Makale Verileri ───────────────────────────────────
const makaleler = [
  {
    id: 1,
    baslik: 'Sonbaharda Bağışıklık Sistemini Güçlendiren 10 Süper Besin',
    ozet: 'Havaların soğumasıyla birlikte bağışıklık sistemimizi desteklemek her zamankinden önemli. Sofranızdan eksik etmemeniz gereken besinler ve pratik tarif önerileri.',
    yazar: { ad: 'Dr. Ayşe Yılmaz', rol: 'Beslenme Uzmanı' },
    kategori: 'Beslenme',
    slug: 'beslenme',
    okumaSuresi: '8 dk',
    goruntulenme: 1247,
    begeni: 89,
    yorum: 23,
    tarih: '2 saat önce',
    kapakRenk: 'from-emerald-400 to-teal-500',
  },
  {
    id: 2,
    baslik: 'Adet Döngüsüne Göre Egzersiz Planı: Her Faz İçin En Uygun Antrenman',
    ozet: 'Menstrüel döngünüzün her fazında vücudunuz farklı tepkiler verir. Foliküler, ovülasyon, luteal ve menstrüasyon fazlarına uygun egzersiz programı.',
    yazar: { ad: 'Selin Kaya', rol: 'Fitness Eğitmeni' },
    kategori: 'Egzersiz',
    slug: 'egzersiz',
    okumaSuresi: '12 dk',
    goruntulenme: 2340,
    begeni: 156,
    yorum: 41,
    tarih: '5 saat önce',
    kapakRenk: 'from-violet-400 to-purple-500',
  },
  {
    id: 3,
    baslik: 'Kortizolün Cildinize Etkileri ve Stresle Başa Çıkma Rehberi',
    ozet: 'Kronik stres kortizol seviyenizi yükselterek cildinizde akne, kuruluk ve erken yaşlanma belirtilerine yol açabilir. Dermatoloji uzmanlarının önerileri.',
    yazar: { ad: 'Dr. Elif Demir', rol: 'Dermatolog' },
    kategori: 'Stres Yönetimi',
    slug: 'stres-yonetimi',
    okumaSuresi: '6 dk',
    goruntulenme: 890,
    begeni: 67,
    yorum: 15,
    tarih: '1 gün önce',
    kapakRenk: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    baslik: 'PCOS ve Beslenme: İnsülin Direncini Dengeleyecek Günlük Menü',
    ozet: 'Polikistik over sendromunda beslenme düzeni büyük önem taşır. Uzman diyetisyenimizin hazırladığı haftalık menü örneği ve altın kurallar.',
    yazar: { ad: 'Dyt. Merve Aksoy', rol: 'Klinik Diyetisyen' },
    kategori: 'Beslenme',
    slug: 'beslenme',
    okumaSuresi: '10 dk',
    goruntulenme: 1820,
    begeni: 134,
    yorum: 52,
    tarih: '2 gün önce',
    kapakRenk: 'from-rose-400 to-pink-500',
  },
  {
    id: 5,
    baslik: 'Özel Rehber: Pelvik Taban Egzersizleriyle Yaşam Kalitenizi Artırın',
    ozet: 'Kadın sağlığının en çok ihmal edilen konularından biri pelvik taban sağlığıdır. Uzman fizyoterapist eşliğinde, evde kolayca uygulayabileceğiniz Kegel alternatifleri ve nefes teknikleri.',
    yazar: { ad: 'Fzt. Cansu Yılmaz', rol: 'Pelvik Taban Terapisti' },
    kategori: 'Egzersiz',
    slug: 'egzersiz',
    okumaSuresi: '15 dk',
    goruntulenme: 3450,
    begeni: 420,
    yorum: 89,
    tarih: '3 gün önce',
    kapakRenk: 'from-fuchsia-500 to-purple-600',
    isPremium: true,
  },
];

// ─── Makale Kartı Bileşeni ──────────────────────────────────
function MakaleKarti({ makale }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bepiDi, setBegeniDi] = useState(false);

  const handleInteraction = (type) => {
    if (!session) {
      if (confirm('Bu işlem için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?')) {
        router.push('/giris');
      }
      return;
    }
    if (type === 'like') {
      setBegeniDi(!bepiDi);
    }
  };

  return (
    <article className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {/* Kapak Görseli Alanı */}
      <div className={`h-48 bg-gradient-to-br ${makale.kapakRenk} flex items-center justify-center relative flex-shrink-0`}>
        <BookOpen size={48} className="text-white/40" />
        
        {/* Kategori Rozeti */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {makale.kategori}
          </span>
          {makale.isPremium && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Lock size={12} /> Premium
            </span>
          )}
        </div>
        
        {/* Okuma Süresi */}
        <span className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <Clock size={12} />
          {makale.okumaSuresi}
        </span>
      </div>

      {/* İçerik */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {makale.baslik}
        </h3>
        <p className="text-text-light text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
          {makale.ozet}
        </p>

        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-3 mb-4 mt-auto">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{makale.yazar.ad}</p>
            <p className="text-xs text-text-muted">{makale.yazar.rol}</p>
          </div>
          <span className="ml-auto text-xs text-text-muted">{makale.tarih}</span>
        </div>

        {/* Alt Etkileşim Çubuğu */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-4 text-text-muted text-sm">
            <button
              onClick={() => handleInteraction('like')}
              className={`flex items-center gap-1 transition-colors ${bepiDi ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart size={16} className={bepiDi ? 'fill-red-500' : ''} />
              <span>{bepiDi ? makale.begeni + 1 : makale.begeni}</span>
            </button>
            <button onClick={() => handleInteraction('comment')} className="flex items-center gap-1 hover:text-primary transition-colors">
              <MessageCircle size={16} />
              {makale.yorum}
            </button>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {makale.goruntulenme.toLocaleString('tr-TR')}
            </span>
          </div>
          <a
            href={makale.isPremium && !session ? `/makaleler/${makale.id}` : `/makaleler/${makale.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
          >
            Devamını Oku
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Ana Sayfa Bileşeni ─────────────────────────────────────
export default function MakalelerSayfasi() {
  const [aktifFiltre, setAktifFiltre] = useState('tumu');

  const filtrelenmis = aktifFiltre === 'tumu'
    ? makaleler
    : makaleler.filter((m) => m.slug === aktifFiltre);

  return (
    <MainLayout>
      {/* Başlık Alanı */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-text">Uzman Makaleleri ve Rehberler</h1>
        </div>
        <p className="text-text-light text-sm leading-relaxed">
          Alanında uzman yazarlarımızın kadın sağlığı, beslenme, egzersiz ve yaşam tarzı hakkında
          hazırladığı kapsamlı rehberleri keşfedin.
        </p>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
        {kategoriler.map((kat) => {
          const Icon = kat.icon;
          const aktifMi = aktifFiltre === kat.slug;
          return (
            <button
              key={kat.slug}
              onClick={() => setAktifFiltre(kat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                aktifMi
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-text-light hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon size={16} />
              {kat.label}
            </button>
          );
        })}
      </div>

      {/* Makale Listesi */}
      {filtrelenmis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtrelenmis.map((makale) => (
            <MakaleKarti key={makale.id} makale={makale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-muted">
          <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Bu kategoride henüz makale yok.</p>
          <p className="text-sm mt-1">Yakında yeni içerikler eklenecek!</p>
        </div>
      )}

      {/* Mobil Akış İçi Reklam */}
      <div className="mt-6 ad-zone bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-text-muted text-sm h-24 md:hidden">
        Reklam Alanı - Mobil (320×100)
      </div>
    </MainLayout>
  );
}
