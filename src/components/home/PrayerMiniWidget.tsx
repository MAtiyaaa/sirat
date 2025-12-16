import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
}

const prayerNames = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

const PrayerMiniWidget = () => {
  const { settings } = useSettings();
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });

        const { latitude, longitude } = position.coords;
        
        // Fetch location name
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await geoResponse.json();
          setLocation(geoData.address?.city || geoData.address?.town || geoData.address?.state || '');
        } catch {
          // Ignore location name errors
        }

        // Fetch prayer times
        const date = new Date();
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const data = await response.json();
        
        if (data.code === 200) {
          const timings = data.data.timings;
          const prayers: PrayerTime[] = [
            { name: 'Fajr', nameAr: prayerNames.Fajr, time: timings.Fajr },
            { name: 'Dhuhr', nameAr: prayerNames.Dhuhr, time: timings.Dhuhr },
            { name: 'Asr', nameAr: prayerNames.Asr, time: timings.Asr },
            { name: 'Maghrib', nameAr: prayerNames.Maghrib, time: timings.Maghrib },
            { name: 'Isha', nameAr: prayerNames.Isha, time: timings.Isha },
          ];

          // Find next prayer
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          
          let next: PrayerTime | null = null;
          for (const prayer of prayers) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerMinutes = hours * 60 + minutes;
            if (prayerMinutes > currentMinutes) {
              next = prayer;
              break;
            }
          }
          
          // If no prayer found today, next is Fajr tomorrow
          if (!next) {
            next = prayers[0];
          }
          
          setNextPrayer(next);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!nextPrayer) return;

    const updateCountdown = () => {
      const now = new Date();
      const [hours, minutes] = nextPrayer.time.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);
      
      // If prayer time has passed, it's tomorrow's Fajr
      if (prayerTime <= now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }
      
      const diff = prayerTime.getTime() - now.getTime();
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (settings.language === 'ar') {
        setTimeRemaining(`${diffHours} س ${diffMinutes} د`);
      } else {
        setTimeRemaining(`${diffHours}h ${diffMinutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [nextPrayer, settings.language]);

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-3 border border-border/30 animate-pulse">
        <div className="h-14 bg-muted/50 rounded-xl" />
      </div>
    );
  }

  if (!nextPrayer) return null;

  return (
    <Link to="/prayer" className="block group">
      <div className="glass-effect rounded-2xl p-3 border border-border/30 hover:border-primary/30 smooth-transition overflow-hidden relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 smooth-transition" />
        
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {settings.language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">
                  {settings.language === 'ar' ? nextPrayer.nameAr : nextPrayer.name}
                </h3>
                <span className="text-xs text-muted-foreground">{nextPrayer.time}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-bold text-primary">{timeRemaining}</div>
            {location && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-2.5 w-2.5" />
                <span className="truncate max-w-[80px]">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PrayerMiniWidget;
