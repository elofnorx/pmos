'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowBigUp, ArrowBigDown, BadgeCheck, MessageCircle, Clock, Eye, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Sahte soru verisi
const soruData = {
  id: 1,
  baslik: 'Sürekli yorgunluk hissediyorum, hangi tahlilleri yaptırmalıyım?',
  icerik: 'Son 3 aydır sürekli bir yorgunluk var. Kahve de artık işe yaramıyor. Tiroit mi bakmalıyım, demir mi? Benzer durumu yaşayan var mı?',
  yazar: { kullanici_adi: 'zeynep_sk', avatar_url: null },
  kategori: 'Sağlık',
  etiketler: ['Yorgunluk', 'Tahlil', 'Sağlık'],
  oy: 24,
  goruntulenme: 342,
  tarih: '45 dk önce',
  durum: 'aktif'
};

// Sahte yorumlar verisi (uzman olanı en başa alacak şekilde API'den geldiğini varsayıyoruz)
const yorumlarData = [
  {
    id: 101,
    icerik: 'Merhaba Zeynep Hanım. Sürekli yorgunluk şikayeti kadınlarda çok sık rastladığımız bir durumdur. Öncelikle Tam Kan Sayımı (Hemogram), Ferritin (Demir deposu), B12 vitamini, D vitamini ve TSH (Tiroit) testlerini yaptırmanızı öneririm. Bu değerlerdeki ufak düşüşler bile yaşam kalitesini çok etkiler. En yakın zamanda bir iç hastalıkları uzmanına başvurunuz.',
    yazar: { kullanici_adi: 'dr_ayse', avatar_url: null, rol: 'uzman', uzmanlik_alani: 'İç Hastalıkları Uzmanı' },
    oy: 15,
    tarih: '30 dk önce',
  },
  {
    id: 102,
    icerik: 'Aynı durumu ben de yaşadım canım. Meğer D vitaminim yerlerde sürünüyormuş. Kesinlikle bir kan tahlili ver.',
    yazar: { kullanici_adi: 'merve_92', avatar_url: null, rol: 'kullanici', uzmanlik_alani: null },
    oy: 4,
    tarih: '15 dk önce',
  },
  {
    id: 103,
    icerik: 'Benim de tiroidim yavaş çalışıyormuş ondan oluyormuş. İhmal etme bence.',
    yazar: { kullanici_adi: 'selin_k', avatar_url: null, rol: 'kullanici', uzmanlik_alani: null },
    oy: 2,
    tarih: '10 dk önce',
  }
];

export default function SoruDetay({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [cevap, setCevap] = useState('');

  // Not: Gerçek uygulamada useEffect ile `/api/sorular/${params.id}` endpoint'inden veri çekilecektir.
  
  const handleCevapYaz = (e) => {
    e.preventDefault();
    if (!session) {
      if(confirm('Cevap yazmak için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?')) {
        router.push('/giris');
      }
      return;
    }
    // API'ye gönderim yapılacak...
    alert('Cevabınız gönderildi!');
    setCevap('');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Soru Gövdesi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <button className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md">
                <ArrowBigUp size={28} />
              </button>
              <span className="font-bold text-lg my-1">{soruData.oy}</span>
              <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md">
                <ArrowBigDown size={28} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-md">
                  {soruData.kategori}
                </span>
                <span className="text-text-muted text-xs flex items-center gap-1">
                  <Clock size={12} /> {soruData.tarih}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text mb-4">{soruData.baslik}</h1>
              <p className="text-text-light leading-relaxed mb-4">{soruData.icerik}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {soruData.etiketler.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-text-light px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {soruData.yazar.kullanici_adi.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text">{soruData.yazar.kullanici_adi}</span>
                </div>
                <div className="flex gap-4 text-text-muted text-sm">
                  <span className="flex items-center gap-1"><Eye size={16}/> {soruData.goruntulenme}</span>
                  <button className="flex items-center gap-1 hover:text-primary"><Share2 size={16}/> Paylaş</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cevaplar Bölümü */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text mb-4">{yorumlarData.length} Cevap</h2>
          
          <div className="space-y-4">
            {yorumlarData.map((yorum) => (
              <div 
                key={yorum.id} 
                className={`p-6 rounded-2xl border ${
                  yorum.yazar.rol === 'uzman' 
                    ? 'bg-[#FDFBF7] border-primary/30 shadow-sm' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <button className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md">
                      <ArrowBigUp size={24} />
                    </button>
                    <span className="font-bold text-sm my-1">{yorum.oy}</span>
                  </div>
                  
                  <div className="flex-1">
                    {/* Yazar Bilgisi (Uzman Vurgusu) */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        yorum.yazar.rol === 'uzman' ? 'bg-primary text-white' : 'bg-gray-100 text-text-light'
                      }`}>
                        {yorum.yazar.kullanici_adi.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-text">{yorum.yazar.kullanici_adi}</span>
                          {yorum.yazar.rol === 'uzman' && (
                            <BadgeCheck size={18} className="text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {yorum.yazar.rol === 'uzman' && yorum.yazar.uzmanlik_alani && (
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-sm">
                              {yorum.yazar.uzmanlik_alani}
                            </span>
                          )}
                          <span className="text-xs text-text-muted">{yorum.tarih}</span>
                        </div>
                      </div>
                    </div>

                    {/* Yorum İçeriği */}
                    <p className="text-text-light leading-relaxed mb-2">
                      {yorum.icerik}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cevap Yazma Formu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-text mb-4">Cevabını Paylaş</h3>
          <form onSubmit={handleCevapYaz}>
            <textarea
              rows="4"
              className="w-full border border-gray-200 rounded-xl p-4 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-4"
              placeholder="Senin deneyimin nedir?"
              value={cevap}
              onChange={(e) => setCevap(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
              >
                Cevabı Gönder
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </MainLayout>
  );
}
