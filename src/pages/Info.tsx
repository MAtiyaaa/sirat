import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Clock, Droplets, BookOpen, Heart, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const Info = () => {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Fetch prayer times from Aladhan API
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

      if (data.code === 200) {
        setPrayerTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
        });
        setLocation(`${data.data.meta.timezone}`);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      toast.error(settings.language === 'ar' ? 'فشل في جلب أوقات الصلاة' : 'Failed to fetch prayer times');
      // Set default times as fallback
      setPrayerTimes({
        Fajr: '05:00',
        Dhuhr: '12:30',
        Asr: '15:45',
        Maghrib: '18:15',
        Isha: '19:30',
      });
      setLocation(settings.language === 'ar' ? 'الموقع غير متاح' : 'Location unavailable');
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    {
      title: settings.language === 'ar' ? 'الوضوء' : 'Wudu',
      description: settings.language === 'ar' 
        ? 'تعلم كيفية أداء الوضوء بشكل صحيح'
        : 'Learn how to perform wudu correctly',
      icon: Droplets,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      link: '/wudu'
    },
    {
      title: settings.language === 'ar' ? 'الأدعية اليومية' : 'Daily Duas',
      description: settings.language === 'ar'
        ? 'أدعية مهمة للحياة اليومية'
        : 'Essential prayers for daily life',
      icon: Heart,
      gradient: 'from-pink-500/20 to-rose-500/20',
    },
    {
      title: settings.language === 'ar' ? 'الأذكار' : 'Dhikr',
      description: settings.language === 'ar'
        ? 'أذكار الصباح والمساء'
        : 'Morning and evening remembrance',
      icon: BookOpen,
      gradient: 'from-purple-500/20 to-indigo-500/20',
    },
  ];

  const prayerNames = {
    Fajr: settings.language === 'ar' ? 'الفجر' : 'Fajr',
    Dhuhr: settings.language === 'ar' ? 'الظهر' : 'Dhuhr',
    Asr: settings.language === 'ar' ? 'العصر' : 'Asr',
    Maghrib: settings.language === 'ar' ? 'المغرب' : 'Maghrib',
    Isha: settings.language === 'ar' ? 'العشاء' : 'Isha',
  };

  return (
    <div className="space-y-8">
      {/* Prayer Times Section */}
      <div className="glass-effect rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {settings.language === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
            </h1>
            {location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : prayerTimes ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <div
                key={prayer}
                className="glass-effect rounded-2xl p-3 md:p-6 text-center space-y-1 md:space-y-2 hover:scale-105 smooth-transition min-w-0"
              >
                <p className="text-xs md:text-lg font-semibold truncate">
                  {prayerNames[prayer as keyof PrayerTimes]}
                </p>
                <p className="text-lg md:text-3xl font-bold text-primary break-all">{time}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Info Cards Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {settings.language === 'ar' ? 'الموارد الإسلامية' : 'Islamic Resources'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`glass-effect border-0 p-6 space-y-4 hover:scale-105 smooth-transition cursor-pointer bg-gradient-to-br ${card.gradient}`}
                onClick={() => card.link && (window.location.href = card.link)}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Info;
