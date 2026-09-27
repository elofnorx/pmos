'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { ShieldCheck, Check, X, FileText, User } from 'lucide-react';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.rol !== 'admin')) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.rol === 'admin') {
      fetchBasvurular();
    }
  }, [session]);

  const fetchBasvurular = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/basvurular`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      const data = await res.json();
      if (data.basarili) {
        setBasvurular(data.veri);
      }
    } catch (err) {
      console.error('Başvurular çekilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIslem = async (id, islemTuru) => {
    // Optimistic UI update
    setBasvurular(prev => prev.filter(b => b.id !== id));

    try {
      const endpoint = islemTuru === 'onayla' ? 'onayla' : 'reddet';
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/basvurular/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${session.accessToken}` }
      });
      // Handle actual error via rollback if needed, but in optimistic UI we assume success for now
    } catch (err) {
      console.error('İşlem hatası', err);
      // Re-fetch to correct UI
      fetchBasvurular();
    }
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Not an admin, won't render anyway due to redirect, but just in case
  if (session?.user?.rol !== 'admin') return null;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gray-800 text-white rounded-xl shadow-md">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text">Yönetici Paneli</h1>
            <p className="text-text-muted">Bekleyen Uzman Başvuruları</p>
          </div>
        </div>

        {basvurular.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <ShieldCheck size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Bekleyen başvuru yok</h3>
            <p className="text-text-muted">Tüm uzman başvuruları incelenmiş.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Kullanıcı</th>
                    <th className="px-6 py-4 font-semibold">Uzmanlık Alanı</th>
                    <th className="px-6 py-4 font-semibold">Belge</th>
                    <th className="px-6 py-4 font-semibold">Tarih</th>
                    <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {basvurular.map((basvuru) => (
                    <tr key={basvuru.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#148282]/10 text-[#148282] flex items-center justify-center font-bold">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-text">{basvuru.kullanici_adi}</div>
                            <div className="text-xs text-text-muted">{basvuru.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#148282]/10 text-[#148282]">
                          {basvuru.uzmanlik_alani}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={basvuru.belge_linki} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <FileText size={16} /> Görüntüle
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {new Date(basvuru.basvuru_tarihi).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleIslem(basvuru.id, 'onayla')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200"
                            title="Onayla (Uzman Yap)"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleIslem(basvuru.id, 'reddet')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200"
                            title="Reddet"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
