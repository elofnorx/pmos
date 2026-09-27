'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HelpCircle, Tag, AlignLeft, Info } from 'lucide-react';

export default function YeniSoru() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kategori, setKategori] = useState('Sağlık');
  const [etiketler, setEtiketler] = useState('');
  
  // Eğer kullanıcı giriş yapmamışsa yönlendir
  useEffect(() => {
    if (status === 'unauthenticated') {
      alert('Soru sormak için giriş yapmalısınız.');
      router.push('/giris');
    }
  }, [status, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!baslik || !icerik) return alert('Lütfen başlık ve içerik alanlarını doldurun.');
    
    // API isteği simülasyonu
    alert('Sorunuz başarıyla paylaşıldı!');
    router.push('/topluluk');
  };

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6 flex items-start gap-4">
          <Info className="text-primary mt-1 shrink-0" />
          <div>
            <h2 className="font-bold text-primary mb-1">Topluluğa Soru Sorarken</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Sorunuzu net ve anlaşılır bir dille sorun. Başlığınız sorunuzun kısa bir özeti olmalıdır.
              Doğru kategori ve etiketleri seçerek uzmanların ve topluluğun size daha hızlı ulaşmasını sağlayabilirsiniz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-text mb-6">Yeni Soru Sor</h1>
          
          <div className="space-y-6">
            {/* Başlık */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text mb-2">
                <HelpCircle size={16} className="text-text-muted" /> Soru Başlığı
              </label>
              <input 
                type="text" 
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Örn: Spora yeni başladım, nasıl bir beslenme programı uygulamalıyım?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
              <p className="text-xs text-text-muted mt-1.5">Sorunuzu tek bir cümlede özetleyin.</p>
            </div>

            {/* İçerik */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text mb-2">
                <AlignLeft size={16} className="text-text-muted" /> Detaylar
              </label>
              <textarea 
                rows="6"
                value={icerik}
                onChange={(e) => setIcerik(e.target.value)}
                placeholder="Durumunuzu ve merak ettiklerinizi detaylıca açıklayın..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Kategori</label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option>Sağlık</option>
                  <option>Beslenme</option>
                  <option>Egzersiz & Fitness</option>
                  <option>Psikoloji</option>
                  <option>Hamilelik</option>
                  <option>Yaşam Tarzı</option>
                </select>
              </div>

              {/* Etiketler */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-text mb-2">
                  <Tag size={16} className="text-text-muted" /> Etiketler
                </label>
                <input 
                  type="text" 
                  value={etiketler}
                  onChange={(e) => setEtiketler(e.target.value)}
                  placeholder="Örn: fitness, diyet, motivasyon"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <p className="text-xs text-text-muted mt-1.5">Virgül ile ayırarak en fazla 5 etiket ekleyin.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-xl font-medium text-text-muted hover:text-text hover:bg-gray-50 transition-colors"
              >
                İptal Et
              </button>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
              >
                Soruyu Paylaş
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
