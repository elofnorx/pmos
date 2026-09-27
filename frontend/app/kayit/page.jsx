'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Lock, Mail, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function KayitSayfasi() {
  const router = useRouter();
  const [hata, setHata] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ kullanici_adi: '', email: '', sifre: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHata('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.basarili) {
        // Kayıt başarılıysa giriş sayfasına yönlendir
        router.push('/giris?kayit=basarili');
      } else {
        setHata(data.mesaj || 'Kayıt olurken bir hata oluştu.');
      }
    } catch (error) {
      setHata('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 cursor-pointer mb-6" onClick={() => router.push('/')}>
          <span className="text-4xl font-bold text-primary tracking-tight">PMOS</span>
          <Heart className="text-accent fill-accent" size={32} />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-text">
          Aramıza Katılın
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Zaten hesabın var mı?{' '}
          <Link href="/giris" className="font-medium text-primary hover:text-primary-dark transition-colors">
            Giriş Yap
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {hata && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-100">
                {hata}
              </div>
            )}
            
            <div>
              <label htmlFor="kullanici_adi" className="block text-sm font-medium text-text">
                Kullanıcı Adı (Takma Ad)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="kullanici_adi"
                  name="kullanici_adi"
                  type="text"
                  required
                  value={form.kullanici_adi}
                  onChange={handleChange}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-gray-50 text-text transition-colors"
                  placeholder="Kullanıcı Adı"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text">
                E-posta Adresi
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-gray-50 text-text transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sifre" className="block text-sm font-medium text-text">
                Şifre
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="sifre"
                  name="sifre"
                  type="password"
                  required
                  value={form.sifre}
                  onChange={handleChange}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-gray-50 text-text transition-colors"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
