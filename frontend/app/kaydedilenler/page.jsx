'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import {
  Bookmark, BookmarkX, BookOpen, MessageCircle, Clock,
  Heart, Eye, ArrowBigUp, ArrowBigDown, Hash, CheckCircle,
  Flame, User, Inbox
} from 'lucide-react';

// ─── Sahte Kaydedilmiş İçerikler ────────────────────────────
const kaydedilenler = [
  {
    id: 1,
    type: 'makale',
    baslik: 'Sonbaharda Bağışıklık Sistemini Güçlendiren 10 Süper Besin',
    ozet: 'Havaların soğumasıyla birlikte bağışıklık sistemimizi desteklemek her zamankinden önemli. Sofranızdan eksik etmemeniz gereken 10 süper besin.',
    yazar: { ad: 'Dr. Ayşe Yılmaz', rol: 'Beslenme Uzmanı' },
    kategori: 'Beslenme',
    okumaSuresi: '8 dk',
    begeni: 89,
    yorum: 23,
    tarih: '2 saat önce',
    kaydTarihi: 'Bugün',
    kapakRenk: 'from-emerald-400 to-teal-500',
  },
  {
    id: 2,
    type: 'soru',
    baslik: 'PCOS tanısı aldım, beslenme önerileriniz neler?',
    ozet: 'Bugün doktorum PCOS tanısı koydu. Kilo vermem gerekiyor dedi ama nereden başlayacağımı bilmiyorum.',
    yazar: { ad: 'deryacim' },
    kategori: 'Sağlık',
    etiketler: ['PCOS', 'Beslenme', 'Diyet'],
    oy: 45,
    yorum: 32,
    tarih: '6 saat önce',
    kaydTarihi: 'Dün',
    durum: 'cozuldu',
  },
  {
    id: 3,
    type: 'makale',
    baslik: 'Adet Döngüsüne Göre Egzersiz Planı: Her Faz İçin En Uygun Antrenman',
    ozet: 'Menstrüel döngünüzün her fazında vücudunuz farklı tepkiler verir. Foliküler, ovülasyon, luteal ve menstrüasyon fazlarına uygun egzersiz programı.',
    yazar: { ad: 'Selin Kaya', rol: 'Fitness Eğitmeni' },
    kategori: 'Egzersiz',
    okumaSuresi: '12 dk',
    begeni: 156,
    yorum: 41,
    tarih: '1 gün önce',
    kaydTarihi: '3 gün önce',
    kapakRenk: 'from-violet-400 to-purple-500',
  },
];

// ─── Kaydedilmiş Makale Kartı ────────────────────────────────
function KayitliMakaleKarti({ icerik, onKaldir }) {
  return (
    <Link href={`/makaleler/${icerik.id}`} className="block">
      <article className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row">
          {/* Mini Kapak */}
          <div className={`sm:w-40 h-32 sm:h-auto bg-gradient-to-br ${icerik.kapakRenk} flex items-center justify-center flex-shrink-0`}>
            <BookOpen size={32} className="text-white/50" />
          </div>

          {/* İçerik */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-primary px-2.5 py-0.5 rounded-full">
                  📝 Makale
                </span>
                <span className="text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-medium">
                  {icerik.kategori}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onKaldir(icerik.id);
                }}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                title="Kaydedilenlerden çıkar"
              >
                <BookmarkX size={14} />
                <span className="hidden sm:inline">Çıkar</span>
              </button>
            </div>

            <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
              {icerik.baslik}
            </h3>
            <p className="text-sm text-text-light line-clamp-2 mb-3">{icerik.ozet}</p>

            <div className="flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {icerik.yazar.ad}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {icerik.okumaSuresi}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {icerik.begeni}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {icerik.yorum}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Kaydedilmiş Soru Kartı ─────────────────────────────────
function KayitliSoruKarti({ icerik, onKaldir }) {
  return (
    <Link href={`/topluluk/${icerik.id}`} className="block">
      <article className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
        <div className="flex">
          {/* Sol: Oy */}
          <div className="flex flex-col items-center gap-0.5 px-3 py-4 bg-gray-50/70 border-r border-gray-100 min-w-[52px]">
            <ArrowBigUp size={20} className="text-gray-300" />
            <span className="text-sm font-bold text-text">{icerik.oy}</span>
            <ArrowBigDown size={20} className="text-gray-300" />
          </div>

          {/* Sağ: İçerik */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white bg-accent px-2.5 py-0.5 rounded-full">
                  ❓ Soru
                </span>
                <span className="text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-medium">
                  {icerik.kategori}
                </span>
                {icerik.durum === 'cozuldu' && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={11} />
                    Çözüldü
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onKaldir(icerik.id);
                }}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                title="Kaydedilenlerden çıkar"
              >
                <BookmarkX size={14} />
                <span className="hidden sm:inline">Çıkar</span>
              </button>
            </div>

            <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
              {icerik.baslik}
            </h3>
            <p className="text-sm text-text-light line-clamp-2 mb-3">{icerik.ozet}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {icerik.etiketler.map((e) => (
                <span key={e} className="inline-flex items-center gap-1 text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                  <Hash size={10} />{e}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <User size={12} />
                @{icerik.yazar.ad}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {icerik.yorum} cevap
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Ana Sayfa Bileşeni ─────────────────────────────────────
export default function KaydedilenlerSayfasi() {
  const [liste, setListe] = useState(kaydedilenler);

  const kaldir = (id) => {
    setListe((prev) => prev.filter((item) => item.id !== id));
  };

  // Tarihe göre gruplama
  const gruplar = {};
  liste.forEach((item) => {
    if (!gruplar[item.kaydTarihi]) gruplar[item.kaydTarihi] = [];
    gruplar[item.kaydTarihi].push(item);
  });

  return (
    <MainLayout>
      {/* Başlık */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Bookmark size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Kaydedilenler</h1>
            <p className="text-text-light text-sm">
              Daha sonra okumak için ayırdığın makaleler ve sorular.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-text-muted">
          <Bookmark size={14} className="text-primary" />
          <span><strong className="text-text">{liste.length}</strong> kayıtlı içerik</span>
        </div>
      </div>

      {/* İçerik Listesi */}
      {liste.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(gruplar).map(([tarih, items]) => (
            <div key={tarih}>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={13} />
                {tarih} kaydedildi
              </h2>
              <div className="space-y-3">
                {items.map((item) =>
                  item.type === 'makale' ? (
                    <KayitliMakaleKarti key={item.id} icerik={item} onKaldir={kaldir} />
                  ) : (
                    <KayitliSoruKarti key={item.id} icerik={item} onKaldir={kaldir} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Inbox size={36} className="text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-text mb-1">Henüz kayıtlı içeriğin yok</p>
          <p className="text-sm text-text-muted">
            Makaleleri ve soruları kaydederek daha sonra kolayca ulaşabilirsin.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
