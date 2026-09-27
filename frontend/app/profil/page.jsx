'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import {
  User, Calendar, MapPin, Edit3, Star, Award, Zap, Heart,
  MessageCircle, HelpCircle, CheckCircle, Flame, Shield,
  TrendingUp, BookOpen, Settings, ChevronRight, Hash,
  ArrowBigUp, Clock, Eye
} from 'lucide-react';

// ─── Profil Verisi ───────────────────────────────────────────
const profil = {
  kullaniciAdi: 'Elif_PMOS',
  adSoyad: 'Elif Nur',
  avatar: null,
  bio: 'Sağlıklı yaşamı seven, PCOS ile mücadele eden, topluluk destekçisi. 🌿 Beslenme ve döngü takibi hakkında deneyimlerimi paylaşıyorum.',
  katilimTarihi: 'Mart 2025',
  konum: 'İstanbul',
  puan: 1240,
  seviye: 'Altın Üye',
};

// ─── Rozetler (Gamification) ─────────────────────────────────
const rozetler = [
  { icon: HelpCircle, label: 'İlk Soruyu Sordu',    renk: 'from-blue-400 to-blue-600',    kazanildi: true },
  { icon: MessageCircle, label: 'Faydalı Yorumcu',   renk: 'from-emerald-400 to-emerald-600', kazanildi: true },
  { icon: Flame,    label: '7 Günlük Seri',           renk: 'from-orange-400 to-red-500',    kazanildi: true },
  { icon: Heart,    label: '50 Beğeni Aldı',          renk: 'from-pink-400 to-rose-500',     kazanildi: true },
  { icon: Star,     label: 'En İyi Cevap',            renk: 'from-yellow-400 to-amber-500',  kazanildi: false },
  { icon: Shield,   label: 'Topluluk Koruyucusu',     renk: 'from-violet-400 to-purple-600', kazanildi: false },
];

// ─── İstatistikler ───────────────────────────────────────────
const istatistikler = [
  { label: 'Soru',    deger: 12, icon: HelpCircle,    renk: 'text-blue-500 bg-blue-50' },
  { label: 'Yorum',   deger: 48, icon: MessageCircle,  renk: 'text-emerald-500 bg-emerald-50' },
  { label: 'Beğeni',  deger: 234, icon: Heart,         renk: 'text-rose-500 bg-rose-50' },
  { label: 'Cevap',   deger: 31, icon: CheckCircle,    renk: 'text-amber-500 bg-amber-50' },
];

// ─── Kullanıcının Soruları ───────────────────────────────────
const sorularim = [
  {
    id: 1,
    baslik: 'PCOS ile yaşarken en çok işe yarayan beslenme düzeni hangisi?',
    kategori: 'Beslenme',
    oy: 45,
    yorum: 32,
    tarih: '3 gün önce',
    durum: 'cozuldu',
  },
  {
    id: 2,
    baslik: 'Adet düzensizliğinde hangi tahlilleri yaptırmalıyım?',
    kategori: 'Döngü',
    oy: 28,
    yorum: 19,
    tarih: '1 hafta önce',
    durum: 'aktif',
  },
  {
    id: 3,
    baslik: 'Stres kaynaklı uyku bozukluğu için doğal çözüm önerir misiniz?',
    kategori: 'Uyku',
    oy: 19,
    yorum: 14,
    tarih: '2 hafta önce',
    durum: 'aktif',
  },
];

// ─── Kullanıcının Yorumları ──────────────────────────────────
const yorumlarim = [
  {
    id: 1,
    soruBaslik: 'Hamilelik planlayanlar için en iyi folik asit markası hangisi?',
    icerik: 'Ben Solgar folik asit kullandım ve çok memnun kaldım. Doktorum da bu markayı önermişti. Günde 1 tablet yeterli.',
    begeni: 18,
    tarih: '2 gün önce',
  },
  {
    id: 2,
    soruBaslik: 'Sonbahar detoksu yapan var mı?',
    icerik: 'Limonlu ılık su + zencefil çayı kombinasyonu bende çok işe yaradı. Ama en önemlisi şekeri kesmeye çalışmak.',
    begeni: 12,
    tarih: '5 gün önce',
  },
  {
    id: 3,
    soruBaslik: 'Yoga mı pilates mi daha faydalı?',
    icerik: 'İkisini de denedim, bence stres için yoga, postür ve güçlendirme için pilates daha iyi. İkisini de haftada 2-3 yapabilirseniz harika olur!',
    begeni: 24,
    tarih: '1 hafta önce',
  },
];

// ─── Ana Bileşen ─────────────────────────────────────────────
export default function ProfilSayfasi() {
  const [aktifSekme, setAktifSekme] = useState('sorular');

  return (
    <MainLayout>
      {/* ═══ Profil Üst Bilgi Kartı ═══ */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-teal-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold">EN</span>
            </div>
            {/* Seviye Rozeti */}
            <div className="absolute -bottom-1 -right-1 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
              <Star size={10} className="fill-white" />
              Altın
            </div>
          </div>

          {/* Bilgiler */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{profil.adSoyad}</h1>
              <span className="text-white/60 text-sm">@{profil.kullaniciAdi}</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3 max-w-lg">
              {profil.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {profil.katilimTarihi}&#39;dan beri üye
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {profil.konum}
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} />
                <strong className="text-white">{profil.puan.toLocaleString('tr-TR')}</strong> puan
              </span>
            </div>
          </div>

          {/* Düzenle Butonu */}
          <Link href="/ayarlar" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <Edit3 size={16} />
            Düzenle
          </Link>
        </div>
      </div>

      {/* ═══ İstatistikler ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {istatistikler.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${stat.renk} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <p className="text-xl font-bold text-text">{stat.deger}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ═══ Rozetler (Gamification) ═══ */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-amber-500" />
          <h2 className="text-lg font-bold text-text">Rozetlerim</h2>
          <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
            {rozetler.filter(r => r.kazanildi).length}/{rozetler.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {rozetler.map((rozet) => {
            const Icon = rozet.icon;
            return (
              <div
                key={rozet.label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  rozet.kazanildi
                    ? 'border-gray-100 bg-white hover:shadow-sm'
                    : 'border-dashed border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rozet.renk} flex items-center justify-center flex-shrink-0 ${
                  !rozet.kazanildi ? 'grayscale' : 'shadow-sm'
                }`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{rozet.label}</p>
                  <p className="text-xs text-text-muted">
                    {rozet.kazanildi ? '✅ Kazanıldı' : '🔒 Kilitli'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Sekmeli İçerik ═══ */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* Sekme Başlıkları */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setAktifSekme('sorular')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all relative ${
              aktifSekme === 'sorular'
                ? 'text-primary'
                : 'text-text-muted hover:text-text hover:bg-gray-50'
            }`}
          >
            <HelpCircle size={16} />
            Sorduğum Sorular
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{sorularim.length}</span>
            {aktifSekme === 'sorular' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setAktifSekme('yorumlar')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all relative ${
              aktifSekme === 'yorumlar'
                ? 'text-primary'
                : 'text-text-muted hover:text-text hover:bg-gray-50'
            }`}
          >
            <MessageCircle size={16} />
            Yorumlarım
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{yorumlarim.length}</span>
            {aktifSekme === 'yorumlar' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Sekme İçerikleri */}
        <div className="p-4">
          {/* ── Sorular Sekmesi ── */}
          {aktifSekme === 'sorular' && (
            <div className="space-y-3">
              {sorularim.map((soru) => (
                <div key={soru.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  {/* Oy */}
                  <div className="flex flex-col items-center justify-center min-w-[44px] bg-gray-100 group-hover:bg-white rounded-xl py-2 transition-colors">
                    <ArrowBigUp size={16} className="text-primary" />
                    <span className="text-sm font-bold text-text">{soru.oy}</span>
                  </div>
                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {soru.kategori}
                      </span>
                      {soru.durum === 'cozuldu' && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} />
                          Çözüldü
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-text group-hover:text-primary transition-colors line-clamp-1">
                      {soru.baslik}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><MessageCircle size={11} />{soru.yorum} cevap</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{soru.tarih}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary self-center transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* ── Yorumlar Sekmesi ── */}
          {aktifSekme === 'yorumlar' && (
            <div className="space-y-3">
              {yorumlarim.map((yorum) => (
                <div key={yorum.id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                    <BookOpen size={12} />
                    <span className="text-primary font-medium group-hover:underline">{yorum.soruBaslik}</span>
                  </div>
                  <p className="text-sm text-text leading-relaxed mb-2 line-clamp-2">
                    &ldquo;{yorum.icerik}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Heart size={11} className="text-rose-400" />{yorum.begeni} beğeni
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />{yorum.tarih}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
