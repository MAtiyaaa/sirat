import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Moon, Sun, Sunrise, Sunset, Clock } from 'lucide-react';

// Ramadan 1447: Feb 18 – March 19, 2026 (Eid is March 20)
// Show until end of March 20 (user said remove on 21st)
const RAMADAN_START = new Date(2026, 1, 18); // Feb 18
const RAMADAN_END = new Date(2026, 2, 21);   // March 21 (exclusive)

export const isRamadan = () => {
  const now = new Date();
  return now >= RAMADAN_START && now < RAMADAN_END;
};

interface PrayerTimesData {
  Fajr: string;
  Maghrib: string;
}

interface RamadanBannerProps {
  variant?: 'home' | 'prayer';
  prayerTimes?: { Fajr: string; Maghrib: string } | null;
}

const RamadanBanner = ({ variant = 'home', prayerTimes: externalTimes }: RamadanBannerProps) => {
  const { settings } = useSettings();
  const [times, setTimes] = useState<PrayerTimesData | null>(externalTimes || null);
  const [loading, setLoading] = useState(!externalTimes);

  useEffect(() => {
    if (externalTimes) {
      setTimes(externalTimes);
      setLoading(false);
      return;
    }
    fetchTimes();
  }, [externalTimes, settings.prayerTimeRegion]);

  const fetchTimes = async () => {
    try {
      let latitude: number, longitude: number;
      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      if (data.code === 200) {
        setTimes({ Fajr: data.data.timings.Fajr, Maghrib: data.data.timings.Maghrib });
      }
    } catch {
      // Fallback Dubai times
      setTimes({ Fajr: '05:49', Maghrib: '18:13' });
    } finally {
      setLoading(false);
    }
  };

  if (!isRamadan()) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl animate-fade-in">
      {/* Background with warm Ramadan colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-primary/10 to-purple-600/15" />
      
      {/* Floating lantern decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lantern left */}
        <div className="absolute top-2 left-6 flex flex-col items-center animate-pulse" style={{ animationDuration: '3s' }}>
          <div className="w-px h-4 bg-amber-400/40" />
          <div className="text-2xl">🏮</div>
        </div>
        {/* Lantern right */}
        <div className="absolute top-2 right-6 flex flex-col items-center animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <div className="w-px h-4 bg-amber-400/40" />
          <div className="text-2xl">🏮</div>
        </div>
        {/* Stars */}
        <div className="absolute top-3 left-1/4 text-amber-400/30 text-xs animate-pulse" style={{ animationDuration: '2s' }}>✦</div>
        <div className="absolute top-5 right-1/3 text-amber-400/20 text-sm animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>✧</div>
        <div className="absolute top-2 left-1/2 text-amber-400/25 text-xs animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>✦</div>
        {/* Light string across top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        {/* Glow orbs */}
        <div className="absolute -top-10 left-1/3 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative glass-effect border border-amber-500/20 p-6 md:p-8">
        {/* Ramadan Kareem Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 mb-2">
            <Moon className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              {settings.language === 'ar' ? 'شهر رمضان المبارك' : 'Blessed Month'}
            </span>
            <Moon className="h-5 w-5 text-amber-500 scale-x-[-1]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent arabic-regal">
            {settings.language === 'ar' ? 'رمضان كريم' : 'Ramadan Kareem'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {settings.language === 'ar' ? 'كل عام وأنتم بخير' : 'May this month bring you blessings'}
          </p>
        </div>

        {/* Suhoor & Iftar Times */}
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Clock className="h-5 w-5 animate-spin text-amber-500" />
          </div>
        ) : times ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Suhoor */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4 text-center">
              <div className="absolute top-1 right-2 text-blue-400/20 text-lg">☽</div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sunrise className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {settings.language === 'ar' ? 'السحور' : 'Suhoor'}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {times.Fajr}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {settings.language === 'ar' ? 'توقف الأكل قبل أذان الفجر' : 'Stop eating before Fajr'}
              </p>
            </div>
            {/* Iftar */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 text-center">
              <div className="absolute top-1 right-2 text-amber-400/20 text-lg">☀</div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sunset className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  {settings.language === 'ar' ? 'الإفطار' : 'Iftar'}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {times.Maghrib}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {settings.language === 'ar' ? 'وقت الإفطار عند أذان المغرب' : 'Break fast at Maghrib'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RamadanBanner;
