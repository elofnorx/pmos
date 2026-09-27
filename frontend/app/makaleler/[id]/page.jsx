'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useState } from 'react';

export default function MakaleDetay({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Dummy data based on the ID or just a generic premium article
  const isPremium = params.id === '5'; // We made id 5 premium
  const [isUnlocked, setIsUnlocked] = useState(!isPremium);
  
  const handleUnlock = async () => {
    if (!session) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/makaleler/${params.id}/kilit-ac`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.basarili) {
        setIsUnlocked(true);
        alert('Makalenin kilidi başarıyla açıldı!');
      } else {
        alert(data.mesaj || 'Kilit açılırken hata oluştu. Yetersiz bakiye olabilir.');
      }
    } catch (error) {
      alert('Sunucuya bağlanılamadı.');
    }
  };
  
  return (
    <MainLayout>
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">Egzersiz</span>
            {isPremium && (
              <span className="bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Lock size={14} /> Üyelere Özel
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-text mb-4 leading-tight">
            Özel Rehber: Pelvik Taban Egzersizleriyle Yaşam Kalitenizi Artırın
          </h1>
          <p className="text-text-muted">Fzt. Cansu Yılmaz • 3 gün önce • 15 dk okuma</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg text-text-light relative">
          <p className="mb-6 leading-relaxed">
            Kadın sağlığının en çok ihmal edilen konularından biri pelvik taban sağlığıdır. Pelvik taban kasları, mesane, rahim ve bağırsakları destekleyen bir "hamak" görevi görür. Bu kasların güçlü ve esnek olması, genel yaşam kalitesi için kritik bir öneme sahiptir.
          </p>
          <p className="mb-6 leading-relaxed">
            Özellikle hamilelik, doğum, menopoz veya yoğun stres dönemlerinde pelvik taban kasları zayıflayabilir. Peki bu durumu tersine çevirmek için evde neler yapabilirsiniz? Klasik Kegel egzersizlerinin ötesine geçerek doğru nefes teknikleriyle bu kasları nasıl aktive edeceğinizi inceleyelim.
          </p>

          {/* Premium Restriction Zone */}
          {isPremium && !isUnlocked ? (
            <div className="relative mt-8">
              {/* Blurred Text Dummy */}
              <div className="blur-md opacity-40 select-none pointer-events-none">
                <p className="mb-4">
                  1. Diyafram Nefesi ile Başlayın: Pelvik taban kasları doğrudan diyaframınızla bağlantılıdır. Nefes alırken karnınızın şişmesine izin verin ve kaslarınızın aşağı doğru esnediğini hissedin. Nefes verirken ise kaslarınızı nazikçe yukarı doğru çekin.
                </p>
                <p className="mb-4">
                  2. Yanlış Bilinenler: Çoğu kadın idrarını tutma hissiyle bu kasları çalıştırdığını düşünür, ancak bu uzun vadede mesane problemlerine yol açabilir. Asıl odaklanmanız gereken nokta, pelvisin altındaki o destekleyici hamağı hissetmektir.
                </p>
                <p className="mb-4">
                  3. Gelişmiş Egzersiz Rutini: Haftada 3 gün, günde 10 dakika ayırarak başlayabilirsiniz...
                </p>
              </div>
              
              {/* Overlay Prompt */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent p-6 text-center z-10">
                {!session ? (
                  <>
                    <Lock className="w-12 h-12 text-accent mb-4" />
                    <h3 className="text-2xl font-bold text-text mb-2">Devamını okumak için aramıza katılın!</h3>
                    <p className="text-text-muted mb-6 max-w-md">
                      Bu makale yalnızca PMOS üyelerine özeldir. Alanında uzman doktor ve fizyoterapistlerin hazırladığı tüm rehberlere sınırsız erişmek için hemen ücretsiz kayıt olun.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/kayit" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md">
                        Ücretsiz Kayıt Ol <ArrowRight size={18} />
                      </Link>
                      <Link href="/giris" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text px-8 py-3 rounded-xl font-semibold transition-all">
                        Giriş Yap
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Lock className="w-12 h-12 text-accent mb-4" />
                    <h3 className="text-2xl font-bold text-text mb-2">Bu İçerik Üyelere Özel (Premium)</h3>
                    <p className="text-text-muted mb-4 max-w-md">
                      Toplulukta faydalı cevaplar vererek kazandığın Karma Puanları ile bu makalenin kilidini açabilirsin.
                    </p>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-full mb-6 font-semibold text-text shadow-sm inline-flex items-center gap-2">
                      Mevcut Bakiye: <span className="text-primary">{session.user.karma_puani || 0} Puan</span>
                    </div>
                    <button 
                      onClick={handleUnlock}
                      disabled={(session.user.karma_puani || 0) < 50}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-md ${
                        (session.user.karma_puani || 0) < 50 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-[#148282] hover:bg-teal-700 text-white'
                      }`}
                    >
                      50 Karma Puanı ile Kilidi Aç 🔓
                    </button>
                    {(session.user.karma_puani || 0) < 50 && (
                      <p className="text-xs text-red-500 mt-3 font-medium">Yetersiz bakiye. Toplulukta soru cevaplayarak puan kazanabilirsiniz.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-text mb-4">1. Diyafram Nefesi ile Başlayın</h3>
              <p className="mb-6 leading-relaxed">
                Pelvik taban kasları doğrudan diyaframınızla bağlantılıdır. Nefes alırken karnınızın şişmesine izin verin ve kaslarınızın aşağı doğru esnediğini hissedin. Nefes verirken ise kaslarınızı nazikçe yukarı doğru çekin.
              </p>
              <h3 className="text-xl font-bold text-text mb-4">2. Doğru Teknik: İdrar Tutmak Değil</h3>
              <p className="mb-6 leading-relaxed">
                Çoğu kadın idrarını tutma hissiyle bu kasları çalıştırdığını düşünür, ancak bu uzun vadede mesane problemlerine yol açabilir. Asıl odaklanmanız gereken nokta, pelvisin altındaki o destekleyici hamağı hissetmektir.
              </p>
              <h3 className="text-xl font-bold text-text mb-4">3. Gelişmiş Egzersiz Rutini</h3>
              <p className="mb-6 leading-relaxed">
                Haftada 3 gün, günde 10 dakika ayırarak başlayabilirsiniz. Sırt üstü yatarken, dizleriniz bükülü pozisyonda bu nefes egzersizlerini yapmak en güvenli başlangıçtır.
              </p>
            </div>
          )}
        </div>
      </article>
    </MainLayout>
  );
}
