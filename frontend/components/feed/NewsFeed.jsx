'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Heart, MessageCircle, Share2, Bookmark, Eye, Clock,
  ArrowBigUp, ArrowBigDown, CheckCircle, ChevronRight,
  TrendingUp, Sparkles, Filter
} from 'lucide-react';

// Dummy article data
const dummyArticles = [
  {
    id: 1,
    type: 'makale',
    title: 'Sonbaharda Bağışıklık Sistemini Güçlendiren 10 Süper Besin',
    excerpt: 'Havaların soğumasıyla birlikte bağışıklık sistemimizi desteklemek her zamankinden önemli. İşte sofranızdan eksik etmemeniz gereken 10 süper besin ve pratik tarif önerileri...',
    author: { name: 'Dr. Ayşe Yılmaz', avatar: null, role: 'Beslenme Uzmanı' },
    category: 'Beslenme',
    tags: ['Beslenme', 'Bağışıklık', 'Sonbahar'],
    coverImage: null,
    readTime: '8 dk',
    views: 1247,
    likes: 89,
    comments: 23,
    publishedAt: '2 saat önce',
    slug: 'sonbaharda-bagisiklik-sistemi',
    featured: true
  },
  {
    id: 2,
    type: 'makale',
    title: 'Adet Döngüsüne Göre Egzersiz Planı: Her Faz İçin En Uygun Antrenman',
    excerpt: 'Menstrüel döngünüzün her fazında vücudunuz farklı tepkiler verir. Foliküler, ovülasyon, luteal ve menstrüasyon fazlarına uygun egzersiz programı...',
    author: { name: 'Selin Kaya', avatar: null, role: 'Fitness Eğitmeni' },
    category: 'Egzersiz',
    tags: ['Döngü', 'Egzersiz', 'Sağlık'],
    coverImage: null,
    readTime: '12 dk',
    views: 2340,
    likes: 156,
    comments: 41,
    publishedAt: '5 saat önce',
    slug: 'adet-dongusune-gore-egzersiz',
    featured: false
  },
  {
    id: 3,
    type: 'makale',
    title: 'Stres ve Cilt: Kortizolün Cildinize Etkileri ve Çözüm Önerileri',
    excerpt: 'Kronik stres, kortizol seviyenizi yükselterek cildinizde akne, kuruluk ve erken yaşlanma belirtilerine neden olabilir. Dermatoloji uzmanlarının önerileri...',
    author: { name: 'Dr. Elif Demir', avatar: null, role: 'Dermatolog' },
    category: 'CiltBakımı',
    tags: ['Stres', 'CiltBakımı', 'Sağlık'],
    coverImage: null,
    readTime: '6 dk',
    views: 890,
    likes: 67,
    comments: 15,
    publishedAt: '1 gün önce',
    slug: 'stres-ve-cilt-iliskisi',
    featured: false
  }
];

const dummyQuestions = [
  {
    id: 101,
    type: 'soru',
    title: 'Sürekli yorgunluk hissediyorum, hangi tahlilleri yaptırmalıyım?',
    content: 'Merhaba, son 3 aydır sürekli bir yorgunluk var. Kahve de artık işe yaramıyor. Tiroit mi bakmalıyım, demir mi? Benzer durumu yaşayan var mı?',
    author: { name: 'zeynep_sk', avatar: null },
    category: 'Sağlık',
    tags: ['Sağlık', 'Yorgunluk', 'Tahlil'],
    votes: 24,
    answers: 18,
    views: 342,
    status: 'aktif',
    publishedAt: '45 dk önce',
    isHot: true
  },
  {
    id: 102,
    type: 'soru',
    title: 'Hamilelik planlayanlar için en iyi folik asit markası hangisi?',
    content: 'Hamilelik planlamaya başladık, folik asit almam gerektiğini biliyorum ama piyasada çok fazla marka var. Kullananlar deneyimlerini paylaşabilir mi?',
    author: { name: 'elif_anne', avatar: null },
    category: 'Hamilelik',
    tags: ['Hamilelik', 'Vitamin', 'Sağlık'],
    votes: 31,
    answers: 26,
    views: 567,
    status: 'aktif',
    publishedAt: '2 saat önce',
    isHot: false
  },
  {
    id: 103,
    type: 'soru',
    title: 'PCOS tanısı aldım, beslenme önerileriniz neler?',
    content: 'Bugün doktorum PCOS tanısı koydu. Kilo vermem gerekiyor dedi ama nereden başlayacağımı bilmiyorum. Aynı durumda olan arkadaşlar yardım edebilir mi?',
    author: { name: 'deryacim', avatar: null },
    category: 'Sağlık',
    tags: ['PCOS', 'Beslenme', 'Diyet'],
    votes: 45,
    answers: 32,
    views: 891,
    status: 'cozuldu',
    publishedAt: '6 saat önce',
    isHot: true
  },
  {
    id: 104,
    type: 'soru',
    title: 'Uyku kalitesini artırmak için ne yapıyorsunuz?',
    content: 'Gece saat 2-3\'e kadar uyuyamıyorum, sabah da çok zor kalkıyorum. Melatonin dışında doğal yöntem önerisi olan var mı?',
    author: { name: 'gece_kusu', avatar: null },
    category: 'Uyku',
    tags: ['Uyku', 'Sağlık', 'DoğalYöntem'],
    votes: 19,
    answers: 14,
    views: 234,
    status: 'aktif',
    publishedAt: '1 gün önce',
    isHot: false
  }
];

// 1. FeedFilters component
const FeedFilters = ({ activeFilter, setActiveFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-surface p-4 rounded-2xl shadow-sm gap-4">
      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        {['Tümü', 'Makaleler', 'Sorular'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === tab.toLowerCase()
                ? 'bg-primary text-white shadow-md'
                : 'bg-background text-text-light hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-text-light" />
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-background text-text text-sm rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary w-full sm:w-auto"
        >
          <option value="yeni">En Yeni</option>
          <option value="populer">En Popüler</option>
          <option value="yorum">En Çok Yorum/Cevap</option>
        </select>
      </div>
    </div>
  );
};

// 2. ArticleCard component
import Link from 'next/link';

const ArticleCard = ({ article }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);

  const checkAuth = () => {
    if (!session) {
      if(confirm('Bu işlem için giriş yapmalısınız. Giriş sayfasına gitmek ister misiniz?')) {
        router.push('/giris');
      }
      return false;
    }
    return true;
  };

  const handleLike = () => {
    if (!checkAuth()) return;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    if (!checkAuth()) return;
    setIsBookmarked(!isBookmarked);
  };
  
  const handleComment = () => {
    router.push(`/makaleler/${article.id}`);
  };

  const handleShare = () => {
    if (!checkAuth()) return;
    navigator.clipboard.writeText(`${window.location.origin}/makaleler/${article.id}`);
    alert('Makale bağlantısı panoya kopyalandı!');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${article.featured ? 'border-l-4 border-l-primary' : ''}`}>
      <div className="p-5">
        {/* Top Meta */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold px-3 py-1 bg-accent/10 text-accent rounded-full">
            {article.category}
          </span>
          <div className="flex items-center text-text-light text-xs gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime} okuma</span>
          </div>
        </div>

        {/* Content */}
        <Link href={`/makaleler/${article.id}`}>
          <h3 className="text-lg font-bold text-text cursor-pointer hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-text-light text-sm line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        {/* Cover Image Placeholder */}
        {article.coverImage !== undefined && (
          <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center">
            <span className="text-text-muted font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-400" /> Makale Görseli
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map(tag => (
            <span key={tag} className="text-[11px] bg-gray-100 text-text-light px-2.5 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <hr className="border-gray-100 mb-4" />

        {/* Footer & Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {article.author.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text">{article.author.name}</span>
              <span className="text-[10px] text-text-light">{article.author.role} • {article.publishedAt}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-text-light">
            <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </button>
            <button onClick={handleComment} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{article.comments}</span>
            </button>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{article.views}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleBookmark} 
                className={`transition-colors ${isBookmarked ? 'text-primary' : 'hover:text-primary'}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. QuestionCard component
const QuestionCard = ({ question }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [voteStatus, setVoteStatus] = useState(0); // 1 for up, -1 for down, 0 neutral
  const [votesCount, setVotesCount] = useState(question.votes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkAuth = () => {
    if (!session) {
      if(confirm('Topluluğa katılmak için giriş yapmalısınız. Giriş sayfasına gitmek ister misiniz?')) {
        router.push('/giris');
      }
      return false;
    }
    return true;
  };

  const handleVote = (value) => {
    if (!checkAuth()) return;
    if (voteStatus === value) {
      // Toggle off
      setVoteStatus(0);
      setVotesCount(prev => prev - value);
    } else {
      // Switch or new vote
      setVotesCount(prev => prev - voteStatus + value);
      setVoteStatus(value);
    }
  };
  
  const handleAnswer = () => {
    router.push(`/topluluk/${question.id}`);
  };

  const handleShare = () => {
    if (!checkAuth()) return;
    navigator.clipboard.writeText(`${window.location.origin}/topluluk/${question.id}`);
    alert('Soru bağlantısı panoya kopyalandı!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex overflow-hidden">
      {/* Left side: Votes */}
      <div className="w-16 bg-gray-50 flex flex-col items-center py-4 border-r border-gray-100 flex-shrink-0">
        <button 
          onClick={() => handleVote(1)}
          className={`p-1 rounded-md transition-colors ${voteStatus === 1 ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-gray-200'}`}
        >
          <ArrowBigUp className={`w-6 h-6 ${voteStatus === 1 ? 'fill-current' : ''}`} />
        </button>
        <span className={`font-bold text-sm my-2 ${voteStatus === 1 ? 'text-primary' : voteStatus === -1 ? 'text-red-500' : 'text-text'}`}>
          {votesCount}
        </span>
        <button 
          onClick={() => handleVote(-1)}
          className={`p-1 rounded-md transition-colors ${voteStatus === -1 ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200'}`}
        >
          <ArrowBigDown className={`w-6 h-6 ${voteStatus === -1 ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Right side: Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-text-light rounded-md">
            {question.category}
          </span>
          {question.status === 'cozuldu' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Çözüldü
            </span>
          )}
          {question.isHot && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> Gündem
            </span>
          )}
        </div>

        <Link href={`/topluluk/${question.id}`}>
          <h3 className="text-[17px] font-semibold text-text cursor-pointer hover:text-primary transition-colors mb-2">
            {question.title}
          </h3>
        </Link>
        <p className="text-text-light text-sm line-clamp-2 mb-4">
          {question.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {question.tags.map(tag => (
            <span key={tag} className="text-[11px] border border-gray-200 text-text-light px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[10px] font-bold">
              {question.author.name.substring(0,2).toUpperCase()}
            </div>
            <span className="text-xs text-text-light">
              <span className="font-medium text-text">{question.author.name}</span> sordu • {question.publishedAt}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-light">
            <button onClick={handleAnswer} className="flex items-center gap-1.5 font-medium text-text hover:text-primary transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{question.answers} Cevap</span>
            </button>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Eye className="w-3.5 h-3.5" />
              <span>{question.views}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="hover:text-primary transition-colors ml-1">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => { if(checkAuth()) setIsBookmarked(!isBookmarked); }} 
                className={`transition-colors ${isBookmarked ? 'text-primary' : 'hover:text-primary'}`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. InFeedAd component
const InFeedAd = () => {
  return (
    <div className="ad-zone bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center min-h-[90px] w-full text-text-muted text-sm my-2">
      Reklam Alanı - Akış İçi (728x90)
    </div>
  );
};

// 5. Main NewsFeed component
export default function NewsFeed() {
  const [activeFilter, setActiveFilter] = useState('tümü');
  const [sortBy, setSortBy] = useState('yeni');

  // Basic implementation to merge and interleave lists
  // In a real scenario, this would rely on exact timestamps for proper chronological sorting.
  const feedItems = [];
  
  // Create a combined copy
  const combined = [...dummyArticles, ...dummyQuestions];
  
  // Basic sorting logic (mock)
  if (sortBy === 'yeni') {
    // keeping as is for mock (assuming id represents recency loosely)
    combined.sort((a, b) => b.id - a.id);
  } else if (sortBy === 'populer') {
    combined.sort((a, b) => {
      const aScore = a.type === 'makale' ? a.likes : a.votes;
      const bScore = b.type === 'makale' ? b.likes : b.votes;
      return bScore - aScore;
    });
  } else if (sortBy === 'yorum') {
    combined.sort((a, b) => {
      const aComments = a.type === 'makale' ? a.comments : a.answers;
      const bComments = b.type === 'makale' ? b.comments : b.answers;
      return bComments - aComments;
    });
  }

  // Filter based on active tab
  const filteredItems = combined.filter(item => {
    if (activeFilter === 'tümü') return true;
    if (activeFilter === 'makaleler') return item.type === 'makale';
    if (activeFilter === 'sorular') return item.type === 'soru';
    return true;
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 pb-10">
      <FeedFilters 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Feed List */}
      <div className="flex flex-col gap-5">
        {filteredItems.map((item, index) => {
          // Render the appropriate component
          const isMakale = item.type === 'makale';
          
          return (
            <div key={`${item.type}-${item.id}`} className="flex flex-col gap-5">
              {isMakale ? (
                <ArticleCard article={item} />
              ) : (
                <QuestionCard question={item} />
              )}
              
              {/* Insert InFeedAd after every 3rd item (index 2, 5, 8...) */}
              {(index + 1) % 3 === 0 && index !== filteredItems.length - 1 && (
                <InFeedAd />
              )}
            </div>
          );
        })}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-text-light">
            Gösterilecek içerik bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
