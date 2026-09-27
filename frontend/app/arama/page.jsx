'use client';

import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Search, BookOpen, MessageCircle, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// Sahte Arama Sonuçları
const mockResults = [
  {
    id: 1,
    type: 'makale',
    title: 'Adet Döngüsüne Göre Beslenme Rehberi',
    description: 'Menstrüel döngünün farklı evrelerinde vücudumuzun ihtiyaç duyduğu vitamin ve mineraller nelerdir?',
    category: 'Beslenme',
    author: 'Dr. Ayşe Yılmaz'
  },
  {
    id: 2,
    type: 'soru',
    title: 'Döngü düzensizliği için hangi doktora gitmeliyim?',
    description: 'Son 3 aydır adet döngümde ciddi gecikmeler yaşıyorum. Kadın Doğum mu yoksa Endokrinoloji mi?',
    category: 'Sağlık',
    author: 'kullanici_adiniz'
  },
  {
    id: 3,
    type: 'makale',
    title: 'Döngü Takibi Neden Önemlidir?',
    description: 'Vücudunuzun ritmini anlamak, hem fiziksel hem de mental sağlığınız için en önemli adımlardan biridir.',
    category: 'Yaşam',
    author: 'Psikolog Elif'
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Basit bir filtreleme mantığı (mock data içinde query kelimesi geçiyorsa)
  const filteredResults = query 
    ? mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : mockResults;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">
            {query ? <>&quot;<span className="text-primary">{query}</span>&quot; için sonuçlar</> : 'Arama'}
          </h1>
          <p className="text-sm text-text-muted">
            {filteredResults.length} sonuç bulundu
          </p>
        </div>
      </div>

      {filteredResults.length > 0 ? (
        <div className="grid gap-4">
          {filteredResults.map((result) => (
            <Link 
              key={result.id} 
              href={result.type === 'makale' ? `/makaleler/${result.id}` : `/topluluk/${result.id}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow group block"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${result.type === 'makale' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {result.type === 'makale' ? <BookOpen size={20} /> : <MessageCircle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      result.type === 'makale' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {result.type === 'makale' ? 'Makale' : 'Topluluk'}
                    </span>
                    <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-1 truncate">
                    {result.title}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">
                    {result.description}
                  </p>
                  <div className="flex items-center text-xs text-text-light gap-1">
                    <User size={14} />
                    {result.author}
                  </div>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">Sonuç bulunamadı</h2>
          <p className="text-text-muted">Farklı anahtar kelimeler deneyerek aramayı genişletebilirsiniz.</p>
        </div>
      )}
    </div>
  );
}

export default function AramaSayfasi() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </MainLayout>
  );
}
