'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Droplet, Activity, Moon, Smile, CheckCircle, Plus, Minus } from 'lucide-react';

const SYMPTOMS = ['Şişkinlik', 'Akne', 'Baş Ağrısı', 'Halsizlik', 'Kramp'];
const MOODS = ['Mutlu', 'Enerjik', 'Stresli', 'Hassas', 'Yorgun'];

export default function DashboardTrackers() {
  const { data: session } = useSession();
  
  const [todayData, setTodayData] = useState({
    su_tuketimi: 0,
    semptomlar: [],
    takviyeler_alindi: false,
    duygu_durumu: null
  });
  
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      fetchTodayData();
      fetchWeeklyData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchTodayData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/takip/gunluk`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      const data = await res.json();
      if (data.basarili && data.veri) {
        setTodayData({
          ...data.veri,
          semptomlar: data.veri.semptomlar || []
        });
      }
    } catch (err) {
      console.error('Bugünkü veriler çekilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/takip/haftalik`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      const data = await res.json();
      if (data.basarili) {
        setWeeklyData(data.veri);
      }
    } catch (err) {
      console.error('Haftalık veriler çekilemedi', err);
    }
  };

  const updateBackend = async (newData) => {
    if (!session) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/takip/gunluk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(newData)
      });
      // Optionally re-fetch weekly data to update the chart
      fetchWeeklyData();
    } catch (err) {
      console.error('Güncelleme başarısız', err);
    }
  };

  const handleWaterChange = (amount) => {
    if (!session) return alert("Verilerinizi takip etmek için giriş yapın.");
    const newAmount = Math.max(0, todayData.su_tuketimi + amount);
    const newData = { ...todayData, su_tuketimi: newAmount };
    setTodayData(newData); // Optimistic UI
    updateBackend(newData);
  };

  const toggleSymptom = (symptom) => {
    if (!session) return alert("Giriş yapmalısınız.");
    let newSymptoms = [...todayData.semptomlar];
    if (newSymptoms.includes(symptom)) {
      newSymptoms = newSymptoms.filter(s => s !== symptom);
    } else {
      newSymptoms.push(symptom);
    }
    const newData = { ...todayData, semptomlar: newSymptoms };
    setTodayData(newData);
    updateBackend(newData);
  };

  const toggleSupplements = () => {
    if (!session) return alert("Giriş yapmalısınız.");
    const newData = { ...todayData, takviyeler_alindi: !todayData.takviyeler_alindi };
    setTodayData(newData);
    updateBackend(newData);
  };

  const selectMood = (mood) => {
    if (!session) return alert("Giriş yapmalısınız.");
    const newData = { ...todayData, duygu_durumu: todayData.duygu_durumu === mood ? null : mood };
    setTodayData(newData);
    updateBackend(newData);
  };

  if (loading) return <div className="p-4 bg-white rounded-2xl animate-pulse h-32 mb-6"></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* HabitTracker */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          <Droplet className="text-blue-500" size={20} /> Günlük Alışkanlıklar
        </h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-light">Su Tüketimi (Bardak)</span>
            <span className="font-bold text-primary">{todayData.su_tuketimi} / 8</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleWaterChange(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Minus size={16} />
            </button>
            <div className="flex-1 flex gap-1 justify-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-3 flex-1 rounded-full ${i < todayData.su_tuketimi ? 'bg-blue-400' : 'bg-gray-100'}`}></div>
              ))}
            </div>
            <button onClick={() => handleWaterChange(1)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <button 
            onClick={toggleSupplements}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
              todayData.takviyeler_alindi 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            <CheckCircle size={18} />
            {todayData.takviyeler_alindi ? 'Takviyeleri Aldım' : 'Takviyeler Alındı mı?'}
          </button>
        </div>
      </div>

      {/* SymptomTracker */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          <Activity className="text-rose-500" size={20} /> Durum ve Semptomlar
        </h3>
        
        <div className="mb-5">
          <span className="text-xs font-semibold text-text-muted uppercase mb-2 block">Semptomlar</span>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button 
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  todayData.semptomlar.includes(s)
                    ? 'bg-rose-100 text-rose-700 shadow-sm border border-rose-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-text-muted uppercase mb-2 block">Ruh Hali</span>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button 
                key={m}
                onClick={() => selectMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                  todayData.duygu_durumu === m
                    ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <Smile size={14} /> {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WeeklyChart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          <Moon className="text-indigo-500" size={20} /> Haftalık Genel Durum
        </h3>
        
        <div className="h-40 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
          {!session ? (
            <div className="w-full text-center text-sm text-text-muted">Giriş yapın</div>
          ) : weeklyData.length === 0 ? (
            <div className="w-full text-center text-sm text-text-muted">Henüz veri yok</div>
          ) : (
            weeklyData.map((day, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative">
                <div className="w-full bg-gray-50 rounded-t-sm flex items-end justify-center h-24 relative overflow-hidden">
                  <div 
                    className="w-full bg-primary/80 group-hover:bg-primary transition-all rounded-t-sm"
                    style={{ height: `${day.uyum_yuzdesi}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-medium text-text-muted">{day.gun}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {day.uyum_yuzdesi}% Uyum
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
