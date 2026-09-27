'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Settings, User, Bell, Lock, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Ayarlar() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profil');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto min-h-screen bg-[#FDFBF7] p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Hesap Ayarları</h1>
            <p className="text-text-muted">Tercihlerinizi ve profil bilgilerinizi yönetin</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Menü - Tablar */}
          <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'profil' 
                  ? 'bg-white shadow-sm border border-primary/20 text-primary' 
                  : 'text-text-muted hover:bg-white hover:text-text'
              }`}
            >
              <User size={20} />
              <span>Profil Bilgileri</span>
            </button>
            <button 
              onClick={() => setActiveTab('guvenlik')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'guvenlik' 
                  ? 'bg-white shadow-sm border border-primary/20 text-primary' 
                  : 'text-text-muted hover:bg-white hover:text-text'
              }`}
            >
              <Lock size={20} />
              <span>Şifre & Güvenlik</span>
            </button>
            <button 
              onClick={() => setActiveTab('bildirimler')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'bildirimler' 
                  ? 'bg-white shadow-sm border border-primary/20 text-primary' 
                  : 'text-text-muted hover:bg-white hover:text-text'
              }`}
            >
              <Bell size={20} />
              <span>Bildirimler</span>
            </button>
            <button 
              onClick={() => setActiveTab('gizlilik')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'gizlilik' 
                  ? 'bg-white shadow-sm border border-primary/20 text-primary' 
                  : 'text-text-muted hover:bg-white hover:text-text'
              }`}
            >
              <Shield size={20} />
              <span>Gizlilik</span>
            </button>
          </div>

          {/* İçerik Alanı */}
          <div className="flex-1">
            {activeTab === 'profil' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-text mb-6">Profil Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Kullanıcı Adı</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      defaultValue={session?.user?.name || 'pmos_user'} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">E-Posta Adresi</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed outline-none" 
                      defaultValue={session?.user?.email || 'kullanici@ornek.com'} 
                      disabled
                    />
                    <p className="text-xs text-text-muted mt-1">E-posta adresini değiştirmek için destek ekibiyle iletişime geçin.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Biyografi</label>
                    <textarea 
                      rows="3" 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="Kendinizden kısaca bahsedin..."
                    ></textarea>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guvenlik' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-text mb-6">Şifre Değiştir</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Mevcut Şifre</label>
                    <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Yeni Şifre</label>
                    <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Yeni Şifre (Tekrar)</label>
                    <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary" />
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button className="bg-text text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-colors">
                      Şifreyi Güncelle
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bildirimler' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-text mb-6">Bildirim Ayarları</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">E-posta Bildirimleri</h3>
                      <p className="text-sm text-text-muted">Sorularıma cevap geldiğinde veya önemli güncellemelerde bana e-posta gönder.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Tarayıcı Bildirimleri</h3>
                      <p className="text-sm text-text-muted">Tarayıcı üzerinden anlık bildirimler al.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
                      Tercihleri Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gizlilik' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-text mb-6">Gizlilik & Güvenlik</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Profil Görünürlüğü</h3>
                      <p className="text-sm text-text-muted">Profilimi arama motorlarına ve dışarıya kapat (Sadece üyeler görebilir).</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text">Sağlık Verileri (Anonim)</h3>
                      <p className="text-sm text-text-muted">Günlük takip verilerimin (adet, semptom) kişisel bilgilerim olmadan akademik analizlerde anonim olarak kullanılmasına izin veriyorum.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button className="text-red-500 font-medium hover:underline">
                      Hesabımı Kalıcı Olarak Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
