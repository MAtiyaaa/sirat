import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Clock, HandHeart, Sparkles, ArrowRight, ChevronDown, Calendar, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  month: string;
  monthNumber: number;
  year: string;
  designation: string;
  weekday: string;
}

interface IslamicEvent {
  name: string;
  date: Date;
  hijriDate: string;
  countdown: string;
}

interface HijriCalendarDay {
  day: number;
  gregorianDate: string;
  isToday: boolean;
}

const Wudu = () => {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string; time: string } | null>(null);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [isWuduStepsOpen, setIsWuduStepsOpen] = useState(false);
  const [isHijriOpen, setIsHijriOpen] = useState(false);
  const [isRamadanOpen, setIsRamadanOpen] = useState(false);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [hijriCalendarDays, setHijriCalendarDays] = useState<HijriCalendarDay[]>([]);
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(1);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1447);
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [suhurTime, setSuhurTime] = useState<string>('');
  const [iftarTime, setIftarTime] = useState<string>('');
  const [isQiblaOpen, setIsQiblaOpen] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    fetchPrayerTimes();
    fetchHijriDate();
    fetchIslamicEvents();
    fetchQiblaDirection();
  }, [settings.prayerTimeRegion]);

  useEffect(() => {
    if (!permissionGranted || !isQiblaOpen) return;

    let lastAlpha: number | null = null;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // iOS provides absolute orientation, Android provides relative
        let heading = (event as any).webkitCompassHeading || event.alpha;
        
        // Normalize to 0-360
        if (heading < 0) heading += 360;
        if (heading >= 360) heading -= 360;
        
        // Apply smoothing to reduce jitter
        if (lastAlpha !== null) {
          const diff = heading - lastAlpha;
          if (Math.abs(diff) < 180) {
            heading = lastAlpha + diff * 0.3; // Smooth transition
          }
        }
        
        lastAlpha = heading;
        setDeviceHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('deviceorientationabsolute', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, [permissionGranted, isQiblaOpen]);

  useEffect(() => {
    if (hijriDate) {
      setCurrentHijriMonth(hijriDate.monthNumber);
      setCurrentHijriYear(parseInt(hijriDate.year));
      fetchHijriCalendar(hijriDate.monthNumber, parseInt(hijriDate.year));
    }
  }, [hijriDate]);

  useEffect(() => {
    if (islamicEvents.length > 0) {
      const updateCountdowns = () => {
        const updatedEvents = islamicEvents.map(event => {
          const now = new Date();
          const diff = event.date.getTime() - now.getTime();
          
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { ...event, countdown: `${days}d ${hours}h` };
          } else {
            return { ...event, countdown: settings.language === 'ar' ? 'مضى' : 'Passed' };
          }
        });
        
        setIslamicEvents(updatedEvents);
      };

      updateCountdowns();
      const interval = setInterval(updateCountdowns, 60000);
      return () => clearInterval(interval);
    }
  }, [islamicEvents.length, settings.language]);

  useEffect(() => {
    if (!prayerTimes) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ];

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          const diff = prayerTime - currentTime;
          const hoursLeft = Math.floor(diff / 60);
          const minutesLeft = diff % 60;
          setNextPrayer({
            name: prayerNames[prayer.name as keyof PrayerTimes],
            timeLeft: `${hoursLeft}h ${minutesLeft}m`,
            time: prayer.time,
          });
          return;
        }
      }

      // If no prayer is left today, next is Fajr tomorrow
      const [fajrHours, fajrMinutes] = prayerTimes.Fajr.split(':').map(Number);
      const fajrTime = fajrHours * 60 + fajrMinutes;
      const diff = 24 * 60 - currentTime + fajrTime;
      const hoursLeft = Math.floor(diff / 60);
      const minutesLeft = diff % 60;
      setNextPrayer({
        name: prayerNames.Fajr,
        timeLeft: `${hoursLeft}h ${minutesLeft}m`,
        time: prayerTimes.Fajr,
      });
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes, settings.language]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        // Use manual region
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
      } else {
        // Use geolocation
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

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
        // Set Suhur and Iftar times
        setSuhurTime(data.data.timings.Fajr);
        setIftarTime(data.data.timings.Maghrib);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
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

  const fetchHijriDate = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/gToH');
      const data = await response.json();
      
      if (data.code === 200) {
        setHijriDate({
          date: data.data.hijri.day,
          month: settings.language === 'ar' ? data.data.hijri.month.ar : data.data.hijri.month.en,
          monthNumber: data.data.hijri.month.number,
          year: data.data.hijri.year,
          designation: data.data.hijri.designation.abbreviated,
          weekday: settings.language === 'ar' ? data.data.hijri.weekday.ar : data.data.hijri.weekday.en,
        });
      }
    } catch (error) {
      console.error('Error fetching Hijri date:', error);
    }
  };

  const fetchHijriCalendar = async (month: number, year: number) => {
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const hijriYear = year;
      const response = await fetch(
        `https://api.aladhan.com/v1/hijriCalendar/${month}/${hijriYear}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const today = new Date().toISOString().split('T')[0];
        const days: HijriCalendarDay[] = data.data.map((item: any) => ({
          day: parseInt(item.date.hijri.day),
          gregorianDate: item.date.gregorian.date,
          isToday: item.date.gregorian.date === today,
        }));
        setHijriCalendarDays(days);
      }
    } catch (error) {
      console.error('Error fetching Hijri calendar:', error);
    }
  };

  const navigateHijriMonth = (direction: 'prev' | 'next') => {
    let newMonth = currentHijriMonth;
    let newYear = currentHijriYear;

    if (direction === 'next') {
      newMonth = currentHijriMonth === 12 ? 1 : currentHijriMonth + 1;
      newYear = currentHijriMonth === 12 ? currentHijriYear + 1 : currentHijriYear;
    } else {
      newMonth = currentHijriMonth === 1 ? 12 : currentHijriMonth - 1;
      newYear = currentHijriMonth === 1 ? currentHijriYear - 1 : currentHijriYear;
    }

    setCurrentHijriMonth(newMonth);
    setCurrentHijriYear(newYear);
    fetchHijriCalendar(newMonth, newYear);
  };

  const getHijriMonthName = (monthNumber: number) => {
    const months = settings.language === 'ar' 
      ? ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
      : ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
    return months[monthNumber - 1];
  };

  const fetchIslamicEvents = async () => {
    console.log('🔍 Starting fetchIslamicEvents...');
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
        console.log('📍 Using manual region:', latitude, longitude);
      } else {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log('📍 Using geolocation:', latitude, longitude);
        } catch (geoError) {
          console.log('⚠️ Geolocation failed, using Mecca coordinates');
          latitude = 21.4225;
          longitude = 39.8262;
        }
      }

      const events: IslamicEvent[] = [];
      
      // Use gToHCalendar endpoint to convert specific dates
      // Ramadan 2026 starts around February 28, 2026
      // Eid al-Fitr 2026 around March 30, 2026
      // Eid al-Adha 2026 around June 6, 2026
      
      const upcomingDates = [
        { gregorian: '28-02-2026', name: 'Ramadan', hijriDay: 1, hijriMonth: 'Ramadan' },
        { gregorian: '30-03-2026', name: 'Eid al-Fitr', hijriDay: 1, hijriMonth: 'Shawwal' },
        { gregorian: '06-06-2026', name: 'Eid al-Adha', hijriDay: 10, hijriMonth: 'Dhu al-Hijjah' },
      ];

      for (const eventInfo of upcomingDates) {
        try {
          const url = `https://api.aladhan.com/v1/gToH/${eventInfo.gregorian}`;
          console.log('🌐 Fetching:', url);
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.code === 200) {
            const [day, month, year] = eventInfo.gregorian.split('-').map(n => parseInt(n));
            const eventDate = new Date(year, month - 1, day);
            
            if (eventDate > new Date()) {
              events.push({
                name: eventInfo.name,
                date: eventDate,
                hijriDate: `${eventInfo.hijriDay} ${eventInfo.hijriMonth} ${data.data.hijri.year}`,
                countdown: '',
              });
              console.log(`✅ Added ${eventInfo.name}:`, eventDate.toISOString());
            }
          }
        } catch (err) {
          console.log(`⚠️ Failed to fetch ${eventInfo.name}:`, err);
        }
      }

      console.log('📋 Total events found:', events.length);

      setIslamicEvents(events);
    } catch (error) {
      console.error('❌ Error fetching Islamic events:', error);
    }
  };

  const fetchQiblaDirection = async () => {
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
      } else {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          // Default to Mecca
          latitude = 21.4225;
          longitude = 39.8262;
        }
      }

      const response = await fetch(
        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
      );
      const data = await response.json();

      if (data.code === 200) {
        setQiblaDirection(Math.round(data.data.direction));
      }
    } catch (error) {
      console.error('Error fetching Qibla direction:', error);
      setQiblaDirection(0);
    }
  };

  const requestOrientationPermission = async () => {
    setIsCalibrating(true);
    
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // iOS 13+ requires permission
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          toast.success(settings.language === 'ar' ? 'تم تفعيل البوصلة' : 'Compass activated');
        } else {
          toast.error(settings.language === 'ar' ? 'تم رفض الإذن' : 'Permission denied');
        }
      } else {
        // Android or older browsers
        setPermissionGranted(true);
        toast.success(settings.language === 'ar' ? 'تم تفعيل البوصلة' : 'Compass activated');
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      toast.error(settings.language === 'ar' ? 'خطأ في تفعيل البوصلة' : 'Error activating compass');
    } finally {
      setTimeout(() => setIsCalibrating(false), 500);
    }
  };

  const prayerNames = {
    Fajr: settings.language === 'ar' ? 'الفجر' : 'Fajr',
    Dhuhr: settings.language === 'ar' ? 'الظهر' : 'Dhuhr',
    Asr: settings.language === 'ar' ? 'العصر' : 'Asr',
    Maghrib: settings.language === 'ar' ? 'المغرب' : 'Maghrib',
    Isha: settings.language === 'ar' ? 'العشاء' : 'Isha',
  };

  const prayerRakaas = {
    Fajr: { fard: 2, sunnah: 2 },
    Dhuhr: { fard: 4, sunnah: 4 },
    Asr: { fard: 4, sunnah: 0 },
    Maghrib: { fard: 3, sunnah: 2 },
    Isha: { fard: 4, sunnah: 2 },
  };

  const steps = {
    ar: [
      { title: 'النية', count: null, description: 'انوِ في قلبك الوضوء لله تعالى' },
      { title: 'التسمية', count: null, description: 'قل: بسم الله الرحمن الرحيم' },
      { title: 'اليدين', count: 3, description: 'ابدأ باليد اليمنى ثم اليسرى، اغسل إلى الرسغين' },
      { title: 'الفم والأنف', count: 3, description: 'تمضمض بيدك اليمنى، استنشق بيدك اليمنى واستنثر بيدك اليسرى' },
      { title: 'الوجه', count: 3, description: 'من منابت الشعر إلى الذقن، ومن الأذن إلى الأذن' },
      { title: 'الذراعين', count: 3, description: 'ابدأ باليد اليمنى إلى المرفق، ثم اليسرى إلى المرفق' },
      { title: 'الرأس', count: 1, description: 'امسح من الأمام إلى الخلف ثم من الخلف إلى الأمام' },
      { title: 'الأذنين', count: 1, description: 'امسح داخل الأذنين بالسبابة، وخلفهما بالإبهام' },
      { title: 'القدمين', count: 3, description: 'ابدأ بالقدم اليمنى إلى الكعبين، ثم اليسرى إلى الكعبين' },
    ],
    en: [
      { title: 'Intention', count: null, description: 'Intend in your heart to perform wudu for the sake of Allah' },
      { title: 'Bismillah', count: null, description: 'Say: In the name of Allah, the Most Gracious, the Most Merciful' },
      { title: 'Hands', count: 3, description: 'Start with right hand, then left hand, wash up to wrists' },
      { title: 'Mouth & Nose', count: 3, description: 'Rinse mouth with right hand, sniff water with right hand, blow out with left' },
      { title: 'Face', count: 3, description: 'From hairline to chin, from ear to ear' },
      { title: 'Arms', count: 3, description: 'Start with right arm to elbow, then left arm to elbow' },
      { title: 'Head', count: 1, description: 'Wipe from front to back, then back to front' },
      { title: 'Ears', count: 1, description: 'Wipe inside ears with index fingers, behind with thumbs' },
      { title: 'Feet', count: 3, description: 'Start with right foot to ankles, then left foot to ankles' },
    ],
  };

  const currentSteps = steps[settings.language];

  return (
    <div className="space-y-8">
      {/* Prayer Times Section */}
      <Collapsible open={isPrayerTimesOpen} onOpenChange={setIsPrayerTimesOpen}>
        <div className="glass-effect rounded-3xl p-6 border border-border/50">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HandHeart className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h2 className="text-2xl font-bold">
                      {settings.language === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
                    </h2>
                    {location && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : nextPrayer ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {settings.language === 'ar' ? 'القادمة' : 'Next'}
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {nextPrayer.name}
                      </div>
                      <div className="text-lg font-semibold">
                        {nextPrayer.time}
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isPrayerTimesOpen ? 'rotate-180' : ''}`} />
                  </div>
                ) : null}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            {prayerTimes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(prayerTimes).map(([prayer, time]) => {
                  const rakaas = prayerRakaas[prayer as keyof PrayerTimes];
                  return (
                    <Card key={prayer} className="p-4 text-center glass-effect border-border/50 hover:border-primary/50 smooth-transition">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">
                        {prayerNames[prayer as keyof PrayerTimes]}
                      </div>
                      <div className="text-lg font-bold text-primary mb-2">
                        {time}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>
                          {settings.language === 'ar' ? 'فرض' : 'Fard'}: {rakaas.fard}
                        </div>
                        {rakaas.sunnah > 0 && (
                          <div>
                            {settings.language === 'ar' ? 'سنة' : 'Sunnah'}: {rakaas.sunnah}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Next Prayer Countdown */}
      {nextPrayer && isPrayerTimesOpen && (
        <div className="glass-effect rounded-2xl p-5 border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'الوقت المتبقي حتى' : 'Time till'}
                </p>
                <p className="text-xl font-bold text-primary">
                  {nextPrayer.name}
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">
              {nextPrayer.timeLeft}
            </div>
          </div>
        </div>
      )}

      {/* Qibla Finder */}
      <Collapsible open={isQiblaOpen} onOpenChange={setIsQiblaOpen}>
        <div className="glass-effect rounded-3xl p-6 border border-border/50 overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h2 className="text-2xl font-bold">
                      {settings.language === 'ar' ? 'اتجاه القبلة' : 'Qibla Direction'}
                    </h2>
                    {qiblaDirection !== null && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {qiblaDirection}° {settings.language === 'ar' ? 'من الشمال' : 'from North'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {qiblaDirection !== null && (
                    <div className="relative w-20 h-20">
                      {/* Mini compass background */}
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-primary/30 transition-transform duration-300"
                        style={{ 
                          transform: `rotate(${permissionGranted ? -deviceHeading : 0}deg)`,
                          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background) / 0.8) 70%)',
                          boxShadow: '0 0 20px hsl(var(--primary) / 0.15), inset 0 0 15px hsl(var(--primary) / 0.05)'
                        }}
                      >
                        {/* Cardinal markers on mini compass */}
                        {[0, 90, 180, 270].map((degree) => (
                          <div
                            key={degree}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                            style={{
                              transform: `rotate(${degree}deg) translateY(-50%)`,
                              height: '50%',
                            }}
                          >
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary/30 rounded-full" />
                          </div>
                        ))}
                      </div>
                      
                      {/* Kaaba arrow on mini compass */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                        style={{ 
                          transform: `rotate(${permissionGranted ? (qiblaDirection - deviceHeading) : qiblaDirection}deg)` 
                        }}
                      >
                        <div className="absolute -top-1 flex flex-col items-center">
                          <div className="text-2xl">🕋</div>
                        </div>
                      </div>
                      
                      {/* Center dot */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      </div>
                    </div>
                  )}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isQiblaOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            {qiblaDirection !== null && (
              <div className="space-y-6">
                {/* Alignment Status */}
                {(() => {
                  const angleDiff = Math.abs((qiblaDirection - deviceHeading + 360) % 360);
                  const adjustedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
                  const isAligned = adjustedDiff <= 10;
                  
                  return isAligned && permissionGranted && (
                    <div className="glass-effect rounded-2xl p-4 border-2 border-green-500/50 bg-green-500/10 animate-pulse">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-3xl">🕋</div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {settings.language === 'ar' ? '✓ متوافق مع الكعبة' : '✓ Aligned with Kaaba'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {settings.language === 'ar' ? `خطأ: ${Math.round(adjustedDiff)}°` : `Off by: ${Math.round(adjustedDiff)}°`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Compass */}
                <div className="relative mx-auto aspect-square max-w-[380px]">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl animate-pulse" />
                  
                  {/* Compass background - stays fixed */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"
                       style={{ 
                         background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background)) 70%)',
                         boxShadow: '0 0 40px hsl(var(--primary) / 0.2), inset 0 0 40px hsl(var(--primary) / 0.05)'
                       }} />
                  
                  {/* Rotating compass ring with markers */}
                  <div 
                    className="absolute inset-6 rounded-full border-2 border-primary/40 transition-transform duration-300 ease-out"
                    style={{ 
                      transform: `rotate(${permissionGranted ? -deviceHeading : 0}deg)`,
                    }}
                  >
                    {/* Degree markers */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => {
                      const isCardinal = degree % 90 === 0;
                      return (
                        <div
                          key={degree}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                          style={{
                            transform: `rotate(${degree}deg) translateY(-50%)`,
                            height: '50%',
                          }}
                        >
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${
                            isCardinal ? 'w-1 h-5 bg-primary/60' : 'w-0.5 h-3 bg-primary/30'
                          }`} />
                          {isCardinal && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">
                              {degree === 0 ? 'N' : degree === 90 ? 'E' : degree === 180 ? 'S' : 'W'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Kaaba indicator - rotates to always point at Qibla */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300"
                    style={{ 
                      transform: `rotate(${permissionGranted ? (qiblaDirection - deviceHeading) : qiblaDirection}deg)` 
                    }}
                  >
                    <div className="absolute -top-6 flex flex-col items-center gap-1">
                      <div className="text-5xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))' }}>
                        🕋
                      </div>
                      <div 
                        className="w-1.5 h-[45%] rounded-full"
                        style={{ 
                          background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.3), transparent)',
                          boxShadow: '0 0 15px hsl(var(--primary) / 0.5)' 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Center circle with degree display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-background/95 border-4 border-primary/40 shadow-2xl flex flex-col items-center justify-center"
                         style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.3)' }}>
                      <div className="text-xs text-muted-foreground font-medium">
                        {settings.language === 'ar' ? 'القبلة' : 'Qibla'}
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {Math.round((qiblaDirection - deviceHeading + 360) % 360)}°
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {!permissionGranted ? (
                    <button
                      onClick={requestOrientationPermission}
                      disabled={isCalibrating}
                      className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isCalibrating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {settings.language === 'ar' ? 'جاري التفعيل...' : 'Activating...'}
                        </>
                      ) : (
                        settings.language === 'ar' ? 'تفعيل البوصلة المباشرة' : 'Enable Live Compass'
                      )}
                    </button>
                  ) : (
                    <div className="glass-effect rounded-2xl p-4 border border-primary/20 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {settings.language === 'ar' ? 'البوصلة نشطة' : 'Compass Active'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-sm text-muted-foreground">
                            {settings.language === 'ar' ? 'اتجاهك: ' : 'Your heading: '}
                            <span className="font-bold text-primary">{deviceHeading}°</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calibration Instructions */}
                  <div className="glass-effect rounded-2xl p-6 border border-border/50">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <span className="text-2xl">📱</span>
                      {settings.language === 'ar' ? 'كيفية المعايرة' : 'How to Calibrate'}
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {settings.language === 'ar' ? (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <p>امسك هاتفك بشكل مسطح (موازي للأرض)</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <p>حرك هاتفك في حركة رقم ثمانية (∞) في الهواء</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <p>ابتعد عن المعادن والأجهزة الإلكترونية</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">4</span>
                            </div>
                            <p>أدر جسمك ببطء حتى تشير السهم الأخضر للكعبة (🕋) في الأعلى</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <p>Hold your phone flat (parallel to the ground)</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <p>Move your phone in a figure-eight (∞) motion in the air</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <p>Stay away from metal objects and electronic devices</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">4</span>
                            </div>
                            <p>Slowly turn your body until the Kaaba (🕋) points upward</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Hijri Calendar Dropdown */}
      <Collapsible open={isHijriOpen} onOpenChange={setIsHijriOpen}>
        <div className="glass-effect rounded-3xl p-6 border border-border/50">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h2 className="text-2xl font-bold">
                      {settings.language === 'ar' ? 'التقويم الهجري' : 'Hijri Calendar'}
                    </h2>
                  </div>
                </div>
                
                {hijriDate ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {settings.language === 'ar' ? 'اليوم' : 'Today'}
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {hijriDate.date} {hijriDate.month}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {hijriDate.year} {hijriDate.designation}
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isHijriOpen ? 'rotate-180' : ''}`} />
                  </div>
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="glass-effect rounded-2xl p-6 border border-primary/20 bg-primary/5">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateHijriMonth('prev')}
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="h-5 w-5 rotate-90 text-primary" />
                </button>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {getHijriMonthName(currentHijriMonth)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentHijriYear} {hijriDate?.designation}
                  </div>
                </div>
                <button
                  onClick={() => navigateHijriMonth('next')}
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="h-5 w-5 -rotate-90 text-primary" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {hijriCalendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                      ${day.isToday 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                        : 'bg-background/50 hover:bg-background/80'
                      }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Wudu Steps Dropdown */}
      <Collapsible open={isWuduStepsOpen} onOpenChange={setIsWuduStepsOpen}>
        <div className="glass-effect rounded-3xl p-6 border border-border/50">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HandHeart className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {settings.language === 'ar' ? 'خطوات الوضوء' : 'Wudu Steps'}
                  </h2>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isWuduStepsOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="space-y-3">
              {currentSteps.map((step, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-5 smooth-transition hover:scale-[1.01] apple-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">
                          {step.title}
                        </h3>
                        {step.count && (
                          <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                            <span className="text-lg font-bold text-primary">X{step.count}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-border/50 mt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-2">
                    {settings.language === 'ar' ? 'دعاء بعد الوضوء' : 'Dua After Wudu'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {settings.language === 'ar'
                      ? 'بعد إتمام الوضوء قل: أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله'
                      : 'After completing wudu, say: I bear witness that there is no deity except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger'}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Ramadan & Islamic Events Dropdown */}
      <Collapsible open={isRamadanOpen} onOpenChange={setIsRamadanOpen}>
        <div className="glass-effect rounded-3xl p-6 border border-border/50">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {settings.language === 'ar' ? 'رمضان والأعياد' : 'Ramadan & Islamic Events'}
                  </h2>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isRamadanOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="space-y-4">
              {/* All Islamic Events */}
              {islamicEvents.length > 0 ? (
                islamicEvents.map((event, index) => (
                  <div key={index} className="glass-effect rounded-2xl p-6 border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">
                        {settings.language === 'ar' 
                          ? (event.name === 'Ramadan' ? 'رمضان' : event.name === 'Eid al-Fitr' ? 'عيد الفطر' : 'عيد الأضحى')
                          : event.name}
                      </h3>
                      <div className="text-2xl font-bold text-primary">
                        {event.countdown}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {event.date.toLocaleDateString(
                        settings.language === 'ar' ? 'ar-SA' : 'en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.hijriDate}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Suhur & Iftar Times */}
              {(suhurTime && iftarTime) && (
                <div>
                  <h4 className="text-lg font-bold mb-3">
                    {settings.language === 'ar' ? 'أوقات رمضان' : 'Ramadan Times'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 text-center glass-effect border-border/50">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">
                        {settings.language === 'ar' ? 'السحور' : 'Suhur'}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {suhurTime}
                      </div>
                    </Card>
                    <Card className="p-4 text-center glass-effect border-border/50">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">
                        {settings.language === 'ar' ? 'الإفطار' : 'Iftar'}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {iftarTime}
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Duas Card */}
      <Link to="/duas" className="block group">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-400/10 to-rose-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
          
          <div className="relative glass-effect rounded-3xl p-8 border border-border/50 hover:border-primary/30 smooth-transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {settings.language === 'ar' ? 'الأدعية' : "Dua's"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {settings.language === 'ar' 
                      ? 'زيارة صفحة الأدعية للمزيد'
                      : 'Visit duas for more'}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-1 smooth-transition" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Wudu;
