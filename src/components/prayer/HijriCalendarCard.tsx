import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HijriDate {
  date: string;
  month: string;
  monthNumber: number;
  year: string;
  designation: string;
  weekday: string;
}

interface HijriCalendarDay {
  day: number;
  gregorianDate: string;
  isToday: boolean;
}

interface HijriCalendarCardProps {
  hijriDate: HijriDate | null;
  prayerTimeRegion?: string;
}

const HijriCalendarCard = ({ hijriDate, prayerTimeRegion }: HijriCalendarCardProps) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(1);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1447);
  const [hijriCalendarDays, setHijriCalendarDays] = useState<HijriCalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hijriDate) {
      setCurrentHijriMonth(hijriDate.monthNumber);
      setCurrentHijriYear(parseInt(hijriDate.year));
      fetchHijriCalendar(hijriDate.monthNumber, parseInt(hijriDate.year));
    }
  }, [hijriDate]);

  const fetchHijriCalendar = async (month: number, year: number) => {
    setLoading(true);
    try {
      let latitude, longitude;

      if (prayerTimeRegion) {
        [latitude, longitude] = prayerTimeRegion.split(',').map(Number);
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const response = await fetch(
        `https://api.aladhan.com/v1/hijriCalendar/${month}/${year}?latitude=${latitude}&longitude=${longitude}&method=2`
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
    } finally {
      setLoading(false);
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

  // Moon phase calculation (simplified)
  const getMoonPhase = (day: number): string => {
    if (day <= 3) return '🌑';
    if (day <= 7) return '🌒';
    if (day <= 11) return '🌓';
    if (day <= 14) return '🌔';
    if (day <= 17) return '🌕';
    if (day <= 21) return '🌖';
    if (day <= 25) return '🌗';
    return '🌘';
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10" />
        
        <div className="relative glass-effect border border-border/50 p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-violet-500" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      {settings.language === 'ar' ? 'التقويم الهجري' : 'Hijri Calendar'}
                    </h2>
                    {hijriDate && (
                      <p className="text-sm text-muted-foreground">
                        {hijriDate.weekday}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {hijriDate && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-2xl">{getMoonPhase(parseInt(hijriDate.date))}</span>
                        <span className="text-2xl font-bold text-primary">{hijriDate.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {hijriDate.month} {hijriDate.year}
                      </p>
                    </div>
                  )}
                  <ChevronLeft className={`h-5 w-5 text-muted-foreground smooth-transition ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="relative glass-effect border border-primary/20 p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateHijriMonth('prev')}
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center smooth-transition hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-primary" />
                  </button>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Moon className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{getHijriMonthName(currentHijriMonth)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentHijriYear} {hijriDate?.designation}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => navigateHijriMonth('next')}
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center smooth-transition hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {(settings.language === 'ar' 
                    ? ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
                    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  ).map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {hijriCalendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium smooth-transition
                          ${day.isToday
                            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg scale-110 ring-2 ring-primary/50'
                            : 'bg-background/50 hover:bg-background/80 hover:scale-105'
                          }`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default HijriCalendarCard;
