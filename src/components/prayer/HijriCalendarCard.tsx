import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Loader2, MoonStar, Star, PartyPopper, ChevronDown } from 'lucide-react';
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
  isHoliday: boolean;
  holidayName?: string;
  holidayNameAr?: string;
}

interface HijriCalendarCardProps {
  hijriDate: HijriDate | null;
  prayerTimeRegion?: string;
}

// Islamic holidays with their Hijri dates
const ISLAMIC_HOLIDAYS: Record<string, { en: string; ar: string }> = {
  '1-1': { en: 'Islamic New Year', ar: 'رأس السنة الهجرية' },
  '1-10': { en: 'Ashura', ar: 'عاشوراء' },
  '3-12': { en: 'Mawlid al-Nabi', ar: 'المولد النبوي' },
  '7-27': { en: "Isra and Mi'raj", ar: 'الإسراء والمعراج' },
  '8-15': { en: 'Shab-e-Barat', ar: 'ليلة النصف من شعبان' },
  '9-1': { en: 'Ramadan Begins', ar: 'بداية رمضان' },
  '9-21': { en: 'Laylat al-Qadr (approx)', ar: 'ليلة القدر' },
  '9-23': { en: 'Laylat al-Qadr (approx)', ar: 'ليلة القدر' },
  '9-25': { en: 'Laylat al-Qadr (approx)', ar: 'ليلة القدر' },
  '9-27': { en: 'Laylat al-Qadr (approx)', ar: 'ليلة القدر' },
  '9-29': { en: 'Laylat al-Qadr (approx)', ar: 'ليلة القدر' },
  '10-1': { en: 'Eid al-Fitr', ar: 'عيد الفطر' },
  '10-2': { en: 'Eid al-Fitr', ar: 'عيد الفطر' },
  '10-3': { en: 'Eid al-Fitr', ar: 'عيد الفطر' },
  '12-8': { en: 'Day of Tarwiyah', ar: 'يوم التروية' },
  '12-9': { en: 'Day of Arafah', ar: 'يوم عرفة' },
  '12-10': { en: 'Eid al-Adha', ar: 'عيد الأضحى' },
  '12-11': { en: 'Eid al-Adha', ar: 'عيد الأضحى' },
  '12-12': { en: 'Eid al-Adha', ar: 'عيد الأضحى' },
  '12-13': { en: 'Eid al-Adha', ar: 'عيد الأضحى' },
};

const HijriCalendarCard = ({ hijriDate: initialHijriDate, prayerTimeRegion }: HijriCalendarCardProps) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(1);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1446);
  const [hijriCalendarDays, setHijriCalendarDays] = useState<HijriCalendarDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [todayHijri, setTodayHijri] = useState<HijriDate | null>(initialHijriDate);

  // Fetch current Hijri date on mount
  useEffect(() => {
    const fetchCurrentHijriDate = async () => {
      if (initialHijriDate) {
        setTodayHijri(initialHijriDate);
        setCurrentHijriMonth(initialHijriDate.monthNumber);
        setCurrentHijriYear(parseInt(initialHijriDate.year));
        return;
      }

      try {
        const today = new Date();
        const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
        const data = await response.json();

        if (data.code === 200) {
          const hijri = data.data.hijri;
          setTodayHijri({
            date: hijri.day,
            month: settings.language === 'ar' ? hijri.month.ar : hijri.month.en,
            monthNumber: hijri.month.number,
            year: hijri.year,
            designation: hijri.designation.abbreviated,
            weekday: settings.language === 'ar' ? hijri.weekday.ar : hijri.weekday.en,
          });
          setCurrentHijriMonth(hijri.month.number);
          setCurrentHijriYear(parseInt(hijri.year));
        }
      } catch (error) {
        console.error('Error fetching current Hijri date:', error);
      }
    };

    fetchCurrentHijriDate();
  }, [initialHijriDate, settings.language]);

  // Fetch calendar when opened or month/year changes
  useEffect(() => {
    if (isOpen && currentHijriMonth && currentHijriYear) {
      fetchHijriCalendar(currentHijriMonth, currentHijriYear);
    }
  }, [isOpen, currentHijriMonth, currentHijriYear, prayerTimeRegion]);

  const fetchHijriCalendar = async (month: number, year: number) => {
    setLoading(true);
    try {
      let latitude = 25.2048, longitude = 55.2708; // Default to Dubai

      if (prayerTimeRegion) {
        const parts = prayerTimeRegion.split(',').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          [latitude, longitude] = parts;
        }
      } else if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (e) {
          console.log('Using default location for calendar');
        }
      }

      const response = await fetch(
        `https://api.aladhan.com/v1/hijriCalendar/${month}/${year}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

      if (data.code === 200 && data.data && data.data.length > 0) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

        // Get the first day's weekday to properly align the calendar
        const firstDayData = data.data[0];
        const firstDayWeekday = firstDayData.date.gregorian.weekday.en;
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const firstDayIndex = weekdays.indexOf(firstDayWeekday);
        setFirstDayOfWeek(firstDayIndex);

        const days: HijriCalendarDay[] = data.data.map((item: any) => {
          const hijriDay = parseInt(item.date.hijri.day);
          const hijriMonth = parseInt(item.date.hijri.month.number);
          const holidayKey = `${hijriMonth}-${hijriDay}`;
          const holiday = ISLAMIC_HOLIDAYS[holidayKey];

          return {
            day: hijriDay,
            gregorianDate: item.date.gregorian.date,
            isToday: item.date.gregorian.date === todayStr,
            isHoliday: !!holiday,
            holidayName: holiday?.en,
            holidayNameAr: holiday?.ar,
          };
        });
        setHijriCalendarDays(days);
      } else {
        generateFallbackCalendar(month);
      }
    } catch (error) {
      console.error('Error fetching Hijri calendar:', error);
      generateFallbackCalendar(month);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackCalendar = (month: number) => {
    const daysInMonth = month % 2 === 1 ? 30 : 29;
    const todayDay = todayHijri ? parseInt(todayHijri.date) : 0;
    const isCurrentMonth = todayHijri?.monthNumber === month;
    
    setFirstDayOfWeek(0);
    
    const days: HijriCalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const holidayKey = `${month}-${day}`;
      const holiday = ISLAMIC_HOLIDAYS[holidayKey];
      
      return {
        day,
        gregorianDate: '',
        isToday: isCurrentMonth && day === todayDay,
        isHoliday: !!holiday,
        holidayName: holiday?.en,
        holidayNameAr: holiday?.ar,
      };
    });
    
    setHijriCalendarDays(days);
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
  };

  const getHijriMonthName = (monthNumber: number) => {
    const months = settings.language === 'ar'
      ? ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
      : ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
    return months[monthNumber - 1];
  };

  const getMoonPhaseOpacity = (day: number): number => {
    if (day <= 3 || day >= 28) return 0.2;
    if (day <= 7) return 0.4;
    if (day <= 11) return 0.6;
    if (day <= 14) return 0.8;
    if (day <= 17) return 1.0;
    if (day <= 21) return 0.8;
    if (day <= 25) return 0.6;
    return 0.4;
  };

  const monthHolidays = hijriCalendarDays.filter(day => day.isHoliday);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative overflow-hidden rounded-3xl">
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
                    {todayHijri && (
                      <p className="text-sm text-muted-foreground">
                        {todayHijri.weekday}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {todayHijri && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <MoonStar 
                          className="h-5 w-5 text-primary" 
                          style={{ opacity: getMoonPhaseOpacity(parseInt(todayHijri.date)) }}
                        />
                        <span className="text-2xl font-bold text-primary">{todayHijri.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {todayHijri.month} {todayHijri.year}
                      </p>
                    </div>
                  )}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
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
                      {currentHijriYear} {todayHijri?.designation || 'AH'}
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
                    {/* Empty cells for alignment */}
                    {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-square" />
                    ))}
                    {hijriCalendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium smooth-transition relative group cursor-default
                          ${day.isToday
                            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg scale-110 ring-2 ring-primary/50 z-10'
                            : day.isHoliday
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 ring-1 ring-amber-500/30'
                              : 'bg-background/50 hover:bg-background/80 hover:scale-105'
                          }`}
                        title={day.isHoliday ? (settings.language === 'ar' ? day.holidayNameAr : day.holidayName) : undefined}
                      >
                        {day.day}
                        {day.isHoliday && !day.isToday && (
                          <Star className="h-2 w-2 text-amber-500 absolute top-1 right-1" />
                        )}
                        {day.isHoliday && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                            {settings.language === 'ar' ? day.holidayNameAr : day.holidayName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Holidays in this month */}
                {monthHolidays.length > 0 && !loading && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <PartyPopper className="h-4 w-4" />
                      {settings.language === 'ar' ? 'المناسبات هذا الشهر' : 'Events this month'}
                    </h4>
                    <div className="space-y-1">
                      {[...new Map(monthHolidays.map(h => [h.holidayName, h])).values()].map((holiday, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">
                            {settings.language === 'ar' ? holiday.holidayNameAr : holiday.holidayName}
                          </span>
                          <span className="text-muted-foreground">
                            {holiday.day} {getHijriMonthName(currentHijriMonth)}
                          </span>
                        </div>
                      ))}
                    </div>
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
