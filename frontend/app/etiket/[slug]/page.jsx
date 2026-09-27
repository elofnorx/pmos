import MainLayout from '../../../components/layout/MainLayout';

export default function EtiketSayfasi({ params }) {
  // URL'den gelen 'beslenme' veya 'döngü' (URL-encoded) gibi değeri decode ederek alıyoruz
  const mevcutEtiket = decodeURIComponent(params.slug);

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 max-w-3xl mx-auto mt-4">
        <h1 className="text-2xl font-bold text-primary mb-4">
          #{mevcutEtiket.charAt(0).toUpperCase() + mevcutEtiket.slice(1)}
        </h1>
        <p className="text-text-light">
          Bu alanda yakında veritabanından çekilen "{mevcutEtiket}" etiketine ait tüm uzman makaleleri ve topluluk soruları listelenecek.
        </p>
      </div>
    </MainLayout>
  );
}
