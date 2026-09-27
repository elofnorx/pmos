import MainLayout from '../../components/layout/MainLayout';
import { Bell, MessageCircle, Heart, Star, Activity } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'yorum',
    title: 'Yeni Yorum',
    message: 'Dr. Ayşe Yılmaz soruna cevap yazdı.',
    time: '5 dk önce',
    isRead: false,
    icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    type: 'begeni',
    title: 'Yeni Beğeni',
    message: 'Zeynep Kaya makaleni beğendi.',
    time: '2 saat önce',
    isRead: false,
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    bgColor: 'bg-rose-50'
  },
  {
    id: 3,
    type: 'sistem',
    title: 'Uzman Başvurusu',
    message: 'Uzmanlık başvurunuz onaylandı! Artık makale yayınlayabilirsiniz.',
    time: '1 gün önce',
    isRead: true,
    icon: <Star className="w-5 h-5 text-amber-500" />,
    bgColor: 'bg-amber-50'
  },
  {
    id: 4,
    type: 'saglik',
    title: 'Hatırlatma',
    message: 'Bugün su içmeyi unuttun mu? Hemen kaydet!',
    time: '2 gün önce',
    isRead: true,
    icon: <Activity className="w-5 h-5 text-emerald-500" />,
    bgColor: 'bg-emerald-50'
  }
];

export default function BildirimlerSayfasi() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-4 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <Bell className="text-primary w-6 h-6" /> Bildirimler
            </h1>
            <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              Tümünü Okundu İşaretle
            </button>
          </div>

          <div className="space-y-4">
            {mockNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex gap-4 p-4 rounded-xl border transition-all ${
                  notification.isRead 
                    ? 'bg-white border-gray-100 opacity-70 hover:opacity-100' 
                    : 'bg-blue-50/30 border-blue-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.bgColor}`}>
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold ${notification.isRead ? 'text-text' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-text-muted">{notification.time}</span>
                  </div>
                  <p className="text-sm text-text-light">{notification.message}</p>
                </div>
                {!notification.isRead && (
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
