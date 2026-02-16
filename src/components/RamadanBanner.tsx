import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Moon, Sunrise, Sunset, Clock, Lamp, Timer } from 'lucide-react';

// Show Ramadan UI from now until March 21, 2026
// Actual fasting: Feb 28 – March 19, 2026 (Eid is March 20)
const RAMADAN_DISPLAY_END = new Date(2026, 2, 21); // March 21 (exclusive)
const RAMADAN_FAST_START = new Date(2026, 1, 28);   // Feb 28
const RAMADAN_FAST_END = new Date(2026, 2, 20);     // March 20 (Eid day, no fasting)

export const isRamadan = () => {
  const now = new Date();
  return now < RAMADAN_DISPLAY_END;
};

export const isFastingPeriod = () => {
  const now = new Date();
  return now >= RAMADAN_FAST_START && now < RAMADAN_FAST_END;
};

interface PrayerTimesData {
  Fajr: string;
  Maghrib: string;
}

interface RamadanBannerProps {
  variant?: 'home' | 'prayer';
  prayerTimes?: { Fajr: string; Maghrib: string } | null;
}

const getCountdown = (targetTime: string, label: string) => {
  const now = new Date();
  const [h, m] = targetTime.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, label };
};

const RamadanBanner = ({ variant = 'home', prayerTimes: externalTimes }: RamadanBannerProps) => {
  const { settings } = useSettings();
  const [times, setTimes] = useState<PrayerTimesData | null>(externalTimes || null);
  const [loading, setLoading] = useState(!externalTimes);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; label: string } | null>(null);

  useEffect(() => {
    if (externalTimes) {
      setTimes(externalTimes);
      setLoading(false);
      return;
    }
    fetchTimes();
  }, [externalTimes, settings.prayerTimeRegion]);

  useEffect(() => {
    if (!times || !isFastingPeriod()) return;
    
    const update = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [fH, fM] = times.Fajr.split(':').map(Number);
      const [mH, mM] = times.Maghrib.split(':').map(Number);
      const fajrMin = fH * 60 + fM;
      const maghribMin = mH * 60 + mM;
      
      if (currentMinutes < fajrMin) {
        setCountdown(getCountdown(times.Fajr, settings.language === 'ar' ? 'السحور' : 'Suhoor'));
      } else if (currentMinutes < maghribMin) {
        setCountdown(getCountdown(times.Maghrib, settings.language === 'ar' ? 'الإفطار' : 'Iftar'));
      } else {
        setCountdown(getCountdown(times.Fajr, settings.language === 'ar' ? 'السحور' : 'Suhoor'));
      }
    };
    
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [times, settings.language]);

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
      setTimes({ Fajr: '05:49', Maghrib: '18:13' });
    } finally {
      setLoading(false);
    }
  };

  if (!isRamadan()) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl animate-fade-in">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-primary/5 to-amber-600/10" />
      
      {/* Decorative elements - Lucide icons only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-6 animate-pulse" style={{ animationDuration: '3s' }}>
          <Lamp className="h-5 w-5 text-amber-500/30" />
        </div>
        <div className="absolute top-3 right-6 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Lamp className="h-5 w-5 text-amber-500/30" />
        </div>
        <div className="absolute top-2 left-1/4 animate-pulse" style={{ animationDuration: '2.5s' }}>
          <Moon className="h-3 w-3 text-amber-400/20" />
        </div>
        <div className="absolute top-4 right-1/3 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
          <Moon className="h-2.5 w-2.5 text-amber-400/15 scale-x-[-1]" />
        </div>
        {/* Top light strip */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        {/* Glow orbs */}
        <div className="absolute -top-10 left-1/3 w-32 h-32 bg-amber-400/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative glass-effect border border-amber-500/15 p-5 md:p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Moon className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
              {settings.language === 'ar' ? 'شهر رمضان المبارك' : 'Blessed Month'}
            </span>
            <Moon className="h-4 w-4 text-amber-500 scale-x-[-1]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'رمضان كريم' : 'Ramadan Kareem'}
          </h2>
        </div>

        {/* Countdown - sleek tiny */}
        {countdown && isFastingPeriod() && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Timer className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-semibold text-amber-500">
                {countdown.label}
              </span>
              <span className="text-xs font-bold text-foreground">
                {countdown.hours}h {countdown.minutes}m
              </span>
            </div>
          </div>
        )}

        {/* Suhoor & Iftar Times */}
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Clock className="h-4 w-4 animate-spin text-amber-500" />
          </div>
        ) : times && isFastingPeriod() ? (
          <div className="grid grid-cols-2 gap-2.5">
            {/* Suhoor */}
            <div className="rounded-2xl border border-blue-400/15 bg-blue-500/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sunrise className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  {settings.language === 'ar' ? 'السحور' : 'Suhoor'}
                </span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {times.Fajr}
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {settings.language === 'ar' ? 'قبل أذان الفجر' : 'Before Fajr'}
              </p>
            </div>
            {/* Iftar */}
            <div className="rounded-2xl border border-amber-400/15 bg-amber-500/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sunset className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                  {settings.language === 'ar' ? 'الإفطار' : 'Iftar'}
                </span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {times.Maghrib}
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {settings.language === 'ar' ? 'عند أذان المغرب' : 'At Maghrib'}
              </p>
            </div>
          </div>
) : !isFastingPeriod() ? (
  (() => {
    const now = new Date();
    const diff = RAMADAN_FAST_START.getTime() - now.getTime();

    // If we're past the start moment, don't show anything here
    if (diff <= 0) return null;

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-purple-600/10 px-4 py-3 text-center">
        <Timer className="h-4 w-4 text-amber-500" />
        <div className="text-sm font-semibold text-foreground">
          {settings.language === 'ar'
            ? `متبقي على رمضان: ${days} يوم ${hours} ساعة ${minutes} دقيقة`
            : `Ramadan starts in: ${days}d ${hours}h ${minutes}m`}
        </div>
      </div>
    );
  })()
) : null}
      </div>
    </div>
  );
};

export default RamadanBanner;
