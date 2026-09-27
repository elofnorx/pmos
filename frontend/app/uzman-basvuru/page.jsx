'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Stethoscope, CheckCircle, Upload, AlertCircle } from 'lucide-react';

const UZMANLIK_ALANLARI = [
  'Diyetisyen',
  'Jinekolog',
  'Psikolog',
  'Fizyoterapist',
  'Yaşam Koçu',
  'Spor Eğitmeni'
];

export default function UzmanBasvuru() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [uzmanlik, setUzmanlik] = useState(UZMANLIK_ALANLARI[0]);
  const [belgeLinki, setBelgeLinki] = useState('');
  const [loading, setLoading] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hata, setHata] = useState('');

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    router.push('/giris');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHata('');
    setBasari(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/uzman/basvuru`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ uzmanlik_alani: uzmanlik, belge_linki: belgeLinki })
      });
      const data = await res.json();

      if (res.ok && data.basarili) {
        setBasari(true);
        setBelgeLinki('');
      } else {
        setHata(data.mesaj || 'Başvuru sırasında hata oluştu.');
      }
    } catch (error) {
      setHata('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#148282] p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Stethoscope size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Uzman Topluluğumuza Katılın</h1>
            <p className="text-[#FDFBF7]/90 text-sm max-w-md mx-auto">
              Bilgi ve deneyiminizle binlerce kadının hayatına dokunun. PMOS onaylı uzmanlar arasına katılmak için başvurunuzu yapın.
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {basari ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-800 mb-2">Başvurunuz Alındı!</h3>
                <p className="text-green-600 text-sm">
                  Uzmanlık başvurunuz yönetim ekibimiz tarafından incelenecek. Onaylandığında e-posta ile bilgilendirileceksiniz.
                </p>
                <button 
                  onClick={() => router.push('/topluluk')}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Topluluğa Geri Dön
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {hata && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} />
                    {hata}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-text mb-2">Uzmanlık Alanınız</label>
                  <select 
                    value={uzmanlik}
                    onChange={(e) => setUzmanlik(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
                  >
                    {UZMANLIK_ALANLARI.map((alan) => (
                      <option key={alan} value={alan}>{alan}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text mb-2">Diploma veya Sertifika Bağlantısı</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Upload size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="url" 
                      required
                      value={belgeLinki}
                      onChange={(e) => setBelgeLinki(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">Lütfen uzmanlığınızı kanıtlayan belgenizin (Drive, Dropbox vb.) erişilebilir bir bağlantısını yapıştırın.</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-sm transition-all ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFB385] hover:bg-[#FFA066]'
                    }`}
                  >
                    {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
