import MainLayout from '@/components/layout/MainLayout';
import NewsFeed from '@/components/feed/NewsFeed';

// SEO Metadata
export const metadata = {
  title: 'PMOS | Kadın Sağlığı ve Yaşam Tarzı Platformu',
  description: 'Kadın sağlığı, beslenme, fitness ve yaşam tarzı hakkında uzman makaleleri okuyun, toplulukla dertleşin. PMOS ile sağlığınızı keşfedin.',
  keywords: 'kadın sağlığı, beslenme, döngü, egzersiz, hamilelik, stres yönetimi, cilt bakımı, PMOS',
  openGraph: {
    title: 'PMOS | Kadın Sağlığı ve Yaşam Tarzı Platformu',
    description: 'Kadın sağlığı, beslenme, fitness ve yaşam tarzı hakkında uzman makaleleri okuyun, toplulukla dertleşin.',
    type: 'website',
    locale: 'tr_TR',
  },
};

import DashboardTrackers from '@/components/trackers/DashboardTrackers';

export default function Home() {
  return (
    <MainLayout>
      <DashboardTrackers />
      <NewsFeed />
    </MainLayout>
  );
}
