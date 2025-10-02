import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Clock, Droplets, BookOpen, Heart, MapPin, Loader2, ChevronDown, Calendar, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  day: string;
  month: { en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

interface IslamicEvent {
  name: string;
  nameAr: string;
  date: Date;
  daysUntil: number;
}

const Info = () => {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [suhurTime, setSuhurTime] = useState<string>('');
  const [iftarTime, setIftarTime] = useState<string>('');
  
  const [wuduOpen, setWuduOpen] = useState(false);
  const [hijriOpen, setHijriOpen] = useState(false);
  const [ramadanOpen, setRamadanOpen] = useState(false);

  useEffect(() => {
    fetchPrayerTimes();
    fetchHijriDate();
    fetchIslamicEvents();
  }, [settings.prayerTimeRegion]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        // Use manual region
        [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
      } else {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

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
        setSuhurTime(data.data.timings.Fajr);
        setIftarTime(data.data.timings.Maghrib);
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

  const fetchHijriDate = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/gToH');
      const data = await response.json();
      if (data.code === 200) {
        setHijriDate({
          date: data.data.hijri.date,
          day: data.data.hijri.day,
          month: { en: data.data.hijri.month.en, ar: data.data.hijri.month.ar },
          year: data.data.hijri.year,
          weekday: { en: data.data.hijri.weekday.en, ar: data.data.hijri.weekday.ar }
        });
      }
    } catch (error) {
      console.error('Error fetching Hijri date:', error);
    }
  };

  const fetchIslamicEvents = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${currentYear}`);
      const data = await response.json();
      
      if (data.code === 200) {
        const events: IslamicEvent[] = [];
        const now = new Date();
        
        // Find Ramadan (month 9)
        const ramadanData = data.data.find((month: any) => month[0].hijri.month.number === 9);
        if (ramadanData && ramadanData[0]) {
          const ramadanStart = new Date(ramadanData[0].gregorian.date);
          if (ramadanStart > now) {
            const daysUntil = Math.ceil((ramadanStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            events.push({
              name: 'Ramadan',
              nameAr: 'رمضان',
              date: ramadanStart,
              daysUntil
            });
          }
        }
        
        // Find Eid al-Fitr (1st Shawwal - month 10)
        const shawwalData = data.data.find((month: any) => month[0].hijri.month.number === 10);
        if (shawwalData && shawwalData[0]) {
          const eidFitr = new Date(shawwalData[0].gregorian.date);
          if (eidFitr > now) {
            const daysUntil = Math.ceil((eidFitr.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            events.push({
              name: 'Eid al-Fitr',
              nameAr: 'عيد الفطر',
              date: eidFitr,
              daysUntil
            });
          }
        }
        
        // Find Eid al-Adha (10th Dhul Hijjah - month 12)
        const dhulHijjahData = data.data.find((month: any) => month[0].hijri.month.number === 12);
        if (dhulHijjahData && dhulHijjahData[9]) {
          const eidAdha = new Date(dhulHijjahData[9].gregorian.date);
          if (eidAdha > now) {
            const daysUntil = Math.ceil((eidAdha.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            events.push({
              name: 'Eid al-Adha',
              nameAr: 'عيد الأضحى',
              date: eidAdha,
              daysUntil
            });
          }
        }
        
        setIslamicEvents(events);
      }
    } catch (error) {
      console.error('Error fetching Islamic events:', error);
    }
  };

  const wuduSteps = settings.language === 'ar' ? [
    { step: 1, text: 'النية' },
    { step: 2, text: 'غسل اليدين ثلاث مرات' },
    { step: 3, text: 'المضمضة ثلاث مرات' },
    { step: 4, text: 'الاستنشاق ثلاث مرات' },
    { step: 5, text: 'غسل الوجه ثلاث مرات' },
    { step: 6, text: 'غسل الذراعين إلى المرفقين ثلاث مرات' },
    { step: 7, text: 'مسح الرأس مرة واحدة' },
    { step: 8, text: 'مسح الأذنين مرة واحدة' },
    { step: 9, text: 'غسل القدمين إلى الكعبين ثلاث مرات' },
  ] : [
    { step: 1, text: 'Make intention (Niyyah)' },
    { step: 2, text: 'Wash hands three times' },
    { step: 3, text: 'Rinse mouth three times' },
    { step: 4, text: 'Sniff water into nose three times' },
    { step: 5, text: 'Wash face three times' },
    { step: 6, text: 'Wash arms up to elbows three times' },
    { step: 7, text: 'Wipe head once' },
    { step: 8, text: 'Wipe ears once' },
    { step: 9, text: 'Wash feet up to ankles three times' },
  ];

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
    <div className="space-y-6">
      {/* Wudu Steps Dropdown */}
      <Collapsible open={wuduOpen} onOpenChange={setWuduOpen}>
        <div className="glass-effect rounded-3xl overflow-hidden border border-primary/10">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 smooth-transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">
                  {settings.language === 'ar' ? 'خطوات الوضوء' : 'Wudu Steps'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'تعلم كيفية أداء الوضوء' : 'Learn how to perform ablution'}
                </p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${wuduOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6 pt-2 space-y-3">
              {wuduSteps.map((step) => (
                <div key={step.step} className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background/80 smooth-transition">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{step.step}</span>
                  </div>
                  <p className="text-sm md:text-base">{step.text}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Hijri Calendar Dropdown */}
      <Collapsible open={hijriOpen} onOpenChange={setHijriOpen}>
        <div className="glass-effect rounded-3xl overflow-hidden border border-primary/10">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 smooth-transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">
                  {settings.language === 'ar' ? 'التاريخ الهجري' : 'Hijri Calendar'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'التقويم الإسلامي' : 'Islamic calendar date'}
                </p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${hijriOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6 pt-2">
              {hijriDate ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-center space-y-2">
                  <p className="text-3xl font-bold text-primary">
                    {settings.language === 'ar' 
                      ? `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}`
                      : `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {settings.language === 'ar' ? hijriDate.weekday.ar : hijriDate.weekday.en}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Ramadan & Events Dropdown */}
      <Collapsible open={ramadanOpen} onOpenChange={setRamadanOpen}>
        <div className="glass-effect rounded-3xl overflow-hidden border border-primary/10">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 smooth-transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Moon className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">
                  {settings.language === 'ar' ? 'الأحداث الإسلامية' : 'Islamic Events'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'رمضان والأعياد' : 'Ramadan & Eid countdowns'}
                </p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${ramadanOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6 pt-2 space-y-4">
              {islamicEvents.length > 0 ? (
                <>
                  {islamicEvents.map((event, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">
                          {settings.language === 'ar' ? event.nameAr : event.name}
                        </h4>
                        <span className="text-2xl font-bold text-primary">{event.daysUntil}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {settings.language === 'ar' ? 'أيام متبقية' : 'days remaining'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.date.toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                  
                  {suhurTime && iftarTime && (
                    <div className="p-5 rounded-2xl bg-background/50 border border-primary/10 space-y-3">
                      <h4 className="font-bold text-center mb-3">
                        {settings.language === 'ar' ? 'أوقات رمضان' : 'Ramadan Times'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-xl bg-primary/5">
                          <p className="text-xs text-muted-foreground mb-1">
                            {settings.language === 'ar' ? 'السحور' : 'Suhur'}
                          </p>
                          <p className="text-xl font-bold text-primary">{suhurTime}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-primary/5">
                          <p className="text-xs text-muted-foreground mb-1">
                            {settings.language === 'ar' ? 'الإفطار' : 'Iftar'}
                          </p>
                          <p className="text-xl font-bold text-primary">{iftarTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <div
                key={prayer}
                className="glass-effect rounded-2xl p-4 md:p-6 text-center space-y-1 md:space-y-2 hover:scale-105 smooth-transition"
              >
                <p className="text-sm md:text-lg font-semibold">
                  {prayerNames[prayer as keyof PrayerTimes]}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{time}</p>
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
