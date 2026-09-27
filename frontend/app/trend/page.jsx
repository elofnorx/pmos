'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  TrendingUp, Flame, ArrowBigUp, ArrowBigDown, MessageCircle,
  Eye, Clock, Hash, CheckCircle, ChevronRight, BarChart3,
  Zap, Trophy, User
} from 'lucide-react';

// ─── Sahte Trend Soru / Tartışma Verileri ────────────────────
const trendler = [
  {
    id: 1,
    baslik: 'PCOS tanısı aldım, beslenme önerileriniz neler?',
    icerik: 'Bugün doktorum PCOS tanısı koydu. Kilo vermem gerekiyor dedi ama nereden başlayacağımı bilmiyorum. Aynı durumda olan arkadaşlar yardım edebilir mi?',
    yazar: 'deryacim',
    kategori: 'Sağlık',
    etiketler: ['PCOS', 'Beslenme', 'Diyet'],
    oy: 128,
    yorum: 74,
    goruntulenme: 2340,
    tarih: '4 saat önce',
    durum: 'cozuldu',
    trendSira: 1,
    yukselisYuzdesi: 320,
  },
  {
    id: 2,
    baslik: 'Adet öncesi şiddetli migren yaşayan var mı? Çözüm önerisi arıyorum',
    icerik: 'Her döngüden 2-3 gün önce dayanılmaz migren ağrılarım oluyor. Doktorum hormonal dedi ama ağrı kesiciler işe yaramıyor. Ne yapabilirim?',
    yazar: 'migren_savasçısı',
    kategori: 'Döngü',
    etiketler: ['Döngü', 'Migren', 'Hormon'],
    oy: 96,
    yorum: 58,
    goruntulenme: 1876,
    tarih: '6 saat önce',
    durum: 'aktif',
    trendSira: 2,
    yukselisYuzdesi: 245,
  },
  {
    id: 3,
    baslik: 'Sonbahar detoksu yapan var mı? Deneyimlerinizi paylaşır mısınız?',
    icerik: 'Yaz boyunca beslenme düzenim bozuldu. Sonbaharla birlikte bir detoks programı düşünüyorum ama hangisi gerçekten işe yarıyor bilemedim.',
    yazar: 'saglik_merakli',
    kategori: 'Beslenme',
    etiketler: ['Beslenme', 'Detoks', 'Sonbahar'],
    oy: 82,
    yorum: 47,
    goruntulenme: 1543,
    tarih: '8 saat önce',
    durum: 'aktif',
    trendSira: 3,
    yukselisYuzdesi: 180,
  },
  {
    id: 4,
    baslik: 'Uyku kalitesini artırmak için doğal yöntemler neler?',
    icerik: 'Gece saat 2-3\'e kadar uyuyamıyorum, sabah da çok zor kalkıyorum. Melatonin dışında doğal yöntem önerisi olan var mı?',
    yazar: 'gece_kusu',
    kategori: 'Uyku',
    etiketler: ['Uyku', 'DoğalYöntem', 'Sağlık'],
    oy: 67,
    yorum: 39,
    goruntulenme: 1120,
    tarih: '12 saat önce',
    durum: 'aktif',
    trendSira: 4,
    yukselisYuzdesi: 150,
  },
];

// ─── Trend İstatistik Kartı ──────────────────────────────────
function TrendIstatistik() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-4 text-white text-center">
        <Zap size={22} className="mx-auto mb-1 opacity-80" />
        <p className="text-2xl font-bold">4</p>
        <p className="text-xs opacity-80">Gündem Konusu</p>
      </div>
      <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-4 text-white text-center">
        <MessageCircle size={22} className="mx-auto mb-1 opacity-80" />
        <p className="text-2xl font-bold">218</p>
        <p className="text-xs opacity-80">Toplam Yorum</p>
      </div>
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-white text-center">
        <BarChart3 size={22} className="mx-auto mb-1 opacity-80" />
        <p className="text-2xl font-bold">6.8K</p>
        <p className="text-xs opacity-80">Görüntülenme</p>
      </div>
    </div>
  );
}

// ─── Trend Soru Kartı ────────────────────────────────────────
function TrendKarti({ soru }) {
  const [oyDurumu, setOyDurumu] = useState(null);
  const [oylar, setOylar] = useState(soru.oy);

  const oyVer = (tur) => {
    if (oyDurumu === tur) {
      setOyDurumu(null);
      setOylar(soru.oy);
    } else {
      setOyDurumu(tur);
      setOylar(tur === 'up' ? soru.oy + 1 : soru.oy - 1);
    }
  };

  // Sıra renklerini belirle
  const siraRenkleri = {
    1: 'from-yellow-400 to-amber-500 text-white',
    2: 'from-gray-300 to-gray-400 text-white',
    3: 'from-orange-400 to-orange-500 text-white',
    4: 'from-primary/60 to-primary text-white',
  };

  return (
    <article className="bg-surface rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Üst Trend Şeridi */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100/50">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${siraRenkleri[soru.trendSira]} flex items-center justify-center text-xs font-bold shadow-sm`}>
            {soru.trendSira}
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <Flame size={16} className="fill-orange-500" />
            <span className="text-xs font-bold">Gündem</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <TrendingUp size={13} />
          +%{soru.yukselisYuzdesi}
        </div>
      </div>

      <div className="flex">
        {/* Sol: Oylama */}
        <div className="flex flex-col items-center gap-0.5 px-3 py-4 bg-gray-50/50 border-r border-gray-100 min-w-[56px]">
          <button
            onClick={() => oyVer('up')}
            className={`p-1 rounded-lg transition-all duration-200 ${
              oyDurumu === 'up'
                ? 'text-primary bg-primary/10 scale-110'
                : 'text-gray-400 hover:text-primary hover:bg-primary/5'
            }`}
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
          >
            <ArrowBigDown size={24} className={oyDurumu === 'down' ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Sağ: İçerik */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {soru.kategori}
            </span>
            {soru.durum === 'cozuldu' && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <CheckCircle size={12} />
                Çözüldü
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1.5 cursor-pointer">
            {soru.baslik}
          </h3>
          <p className="text-sm text-text-light line-clamp-2 mb-3 leading-relaxed">
            {soru.icerik}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {soru.etiketler.map((etiket) => (
              <span key={etiket} className="inline-flex items-center gap-1 text-xs text-text-muted bg-gray-100 hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-full transition-colors cursor-pointer">
                <Hash size={10} />{etiket}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-dark">{soru.yazar.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium text-text-light">@{soru.yazar}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />{soru.tarih}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <MessageCircle size={13} />{soru.yorum}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />{soru.goruntulenme.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Ana Bileşen ─────────────────────────────────────────────
export default function TrendSayfasi() {
  return (
    <MainLayout>
      {/* Başlık */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-xl">
            <TrendingUp size={24} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Trend Tartışmalar</h1>
            <p className="text-text-light text-sm">
              PMOS topluluğunda son 24 saatte en çok etkileşim alan konular. 🔥
            </p>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <TrendIstatistik />

      {/* Trend Listesi */}
      <div className="space-y-4">
        {trendler.map((soru) => (
          <TrendKarti key={soru.id} soru={soru} />
        ))}
      </div>
    </MainLayout>
  );
}
