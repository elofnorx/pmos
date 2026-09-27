'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, BookOpen, MessageCircle, TrendingUp, User, Search,
  Menu, X, Bell, PlusCircle, Hash, Bookmark, Settings,
  Heart, Star, ChevronRight
} from 'lucide-react';

// Navigation menu items
const menuItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: BookOpen, label: 'Makaleler', href: '/makaleler' },
  { icon: MessageCircle, label: 'Topluluk', href: '/topluluk' },
  { icon: TrendingUp, label: 'Trend', href: '/trend' },
  { icon: Bookmark, label: 'Kaydedilenler', href: '/kaydedilenler' },
  { icon: User, label: 'Profilim', href: '/profil' },
];

// Popular tags
const popularTags = [
  { name: 'Beslenme', count: 234 },
  { name: 'Döngü', count: 189 },
  { name: 'Stres', count: 156 },
  { name: 'Egzersiz', count: 143 },
  { name: 'CiltBakımı', count: 128 },
  { name: 'Uyku', count: 112 },
  { name: 'Hamilelik', count: 98 },
  { name: 'MentalSağlık', count: 87 },
];

// Trending discussions for right sidebar
const trendTopics = [
  { id: 1, title: 'Sonbahar detoksu yapan var mı?', comments: 47, category: 'Beslenme' },
  { id: 2, title: 'Adet düzensizliği ve stres ilişkisi', comments: 35, category: 'Döngü' },
  { id: 3, title: 'En iyi prenatal vitaminler', comments: 28, category: 'Hamilelik' },
  { id: 4, title: 'Sabah rutini önerileri', comments: 24, category: 'Yaşam' },
  { id: 5, title: 'Yoga mı pilates mi?', comments: 21, category: 'Egzersiz' },
];

export default function MainLayout({ children }) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      {/* Üst Navigasyon Çubuğu */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo ve Mobil Menü */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-text-muted hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-bold text-primary tracking-tight">PMOS</span>
              <Heart className="text-accent fill-accent" size={20} />
            </div>
          </div>

          {/* Arama Çubuğu (md+ ekranlar için) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.search.value;
              if (q.trim()) {
                router.push(`/arama?q=${encodeURIComponent(q.trim())}`);
              }
            }}
            className="hidden md:flex flex-1 max-w-md mx-8 relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="search"
              type="text"
              placeholder="Ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            />
          </form>

          {/* Sağ Üst Aksiyonlar */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <>
                <Link href="/bildirimler" className="relative p-2 text-text-muted hover:text-text hover:bg-gray-100 rounded-full transition-colors" aria-label="Bildirimler">
                  <Bell size={24} />
                  <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </Link>
                <Link href="/topluluk/yeni" className="hidden sm:flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full font-medium transition-colors">
                  <PlusCircle size={20} />
                  <span>Soru Sor</span>
                </Link>
                <div className="relative group cursor-pointer">
                  <Link href="/profil" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 block">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-500" />
                    )}
                  </Link>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-text truncate">{session.user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link href="/profil" className="block px-4 py-2 text-sm text-text hover:bg-gray-50 rounded-lg">Profilim</Link>
                      <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/giris" className="text-sm font-medium text-text hover:text-primary transition-colors px-3 py-2">Giriş Yap</Link>
                <Link href="/kayit" className="text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors px-4 py-2 rounded-full">Kayıt Ol</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex py-6 px-4 sm:px-6 lg:px-8 gap-6">
        
        {/* Sol Kenar Çubuğu */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-8">
            
            {/* Navigasyon Menüsü */}
            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      pathname === item.href 
                        ? 'bg-primary text-white font-medium shadow-sm' 
                        : 'text-text hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-px bg-gray-200 w-full my-4"></div>

            {/* Popüler Etiketler */}
            <div>
              <h3 className="px-4 text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                Popüler Etiketler
              </h3>
              <div className="space-y-1">
                {popularTags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/etiket/${tag.name.toLowerCase()}`}
                    className="flex items-center justify-between px-4 py-2 rounded-xl text-text hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2 text-text-light group-hover:text-primary transition-colors">
                      <Hash size={16} />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 group-hover:bg-white text-gray-500 px-2 py-1 rounded-full border border-transparent group-hover:border-gray-200 transition-all">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ayarlar / Alt Bilgi */}
            <div className="pt-4">
              <Link href="/ayarlar" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-text transition-colors">
                <Settings size={20} />
                <span>Ayarlar</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Orta Sütun (İçerik) */}
        <main className="flex-1 min-w-0 bg-surface rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-[500px]">
          {children}
        </main>

        {/* Sağ Kenar Çubuğu */}
        <aside className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            
            {/* Trend Tartışmalar Kartı */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <TrendingUp size={20} className="text-primary" />
                <h3 className="font-semibold text-text">Trend Tartışmalar</h3>
              </div>
              <div className="space-y-4">
                {trendTopics.map((topic) => (
                  <Link key={topic.id} href={`/topluluk/${topic.id}`} className="block group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded mb-1">
                          {topic.category}
                        </span>
                        <h4 className="text-sm font-medium text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {topic.title}
                        </h4>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                      <MessageCircle size={12} />
                      <span>{topic.comments} yorum</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reklam Alanı 1 */}
            <div className="ad-zone bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center w-[300px] h-[250px] text-gray-400 mx-auto">
              <span className="text-sm uppercase tracking-widest mb-1">Reklam Alanı</span>
              <span className="text-xs">300x250</span>
            </div>

            <div className="h-4"></div>

            {/* Reklam Alanı 2 */}
            <div className="ad-zone bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center w-[300px] h-[600px] text-gray-400 mx-auto">
              <span className="text-sm uppercase tracking-widest mb-1">Geniş Reklam</span>
              <span className="text-xs">300x600</span>
            </div>

          </div>
        </aside>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/' ? 'text-primary' : 'text-text-muted hover:text-text'}`} aria-label="Ana Sayfa">
            <Home size={24} />
          </Link>
          <Link href="/makaleler" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/makaleler' ? 'text-primary' : 'text-text-muted hover:text-text'}`} aria-label="Makaleler">
            <BookOpen size={24} />
          </Link>
          <Link href="/topluluk/yeni" className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg -mt-6 hover:bg-accent-dark transition-colors" aria-label="Soru Sor">
            <PlusCircle size={28} />
          </Link>
          <Link href="/topluluk" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/topluluk' ? 'text-primary' : 'text-text-muted hover:text-text'}`} aria-label="Topluluk">
            <MessageCircle size={24} />
          </Link>
          <Link href="/profil" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/profil' ? 'text-primary' : 'text-text-muted hover:text-text'}`} aria-label="Profil">
            <User size={24} />
          </Link>
        </div>
      </div>

      {/* Mobil Kaydırmalı Menü Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Karanlık Arka Plan */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          ></div>
          
          {/* Menü Paneli */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl h-full transform transition-transform duration-300 translate-x-0">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-black/20 text-white hover:bg-black/40 transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Menüyü kapat</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <span className="text-2xl font-bold text-primary tracking-tight">PMOS</span>
                <Heart className="text-accent fill-accent ml-2" size={20} />
              </div>
              
              <nav className="px-2 space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                        pathname === item.href 
                          ? 'bg-primary text-white' 
                          : 'text-text hover:bg-gray-50 hover:text-primary'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-4 flex-shrink-0 h-6 w-6" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 px-4">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                  Popüler Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/etiket/${tag.name.toLowerCase()}`}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-text px-3 py-1.5 rounded-full text-sm transition-colors"
                    >
                      <Hash size={14} className="text-text-muted" />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
