import React, { useState, useEffect } from 'react';
import { Moon, ChevronDown, Loader2, Star, PartyPopper, Gift, Calendar, BookOpen, Heart } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface IslamicEvent {
  name: string;
  nameAr: string;
  date: Date;
  hijriDate: string;
  countdown: string;
  type: 'ramadan' | 'eid' | 'holy' | 'other';
}

interface IslamicEventsCardProps {
  suhurTime: string;
  iftarTime: string;
  prayerTimeRegion?: string;
}

// Islamic holidays with their Hijri dates
const ISLAMIC_HOLIDAYS = [
  { nameEn: 'Islamic New Year', nameAr: 'رأس السنة الهجرية', hijriMonth: 1, hijriDay: 1, type: 'holy' as const },
  { nameEn: 'Ashura', nameAr: 'عاشوراء', hijriMonth: 1, hijriDay: 10, type: 'holy' as const },
  { nameEn: 'Mawlid al-Nabi', nameAr: 'المولد النبوي', hijriMonth: 3, hijriDay: 12, type: 'holy' as const },
  { nameEn: 'Isra and Mi\'raj', nameAr: 'الإسراء والمعراج', hijriMonth: 7, hijriDay: 27, type: 'holy' as const },
  { nameEn: 'Shab-e-Barat', nameAr: 'ليلة النصف من شعبان', hijriMonth: 8, hijriDay: 15, type: 'holy' as const },
  { nameEn: 'Ramadan Begins', nameAr: 'بداية رمضان', hijriMonth: 9, hijriDay: 1, type: 'ramadan' as const },
  { nameEn: 'Laylat al-Qadr', nameAr: 'ليلة القدر', hijriMonth: 9, hijriDay: 27, type: 'ramadan' as const },
  { nameEn: 'Eid al-Fitr', nameAr: 'عيد الفطر', hijriMonth: 10, hijriDay: 1, type: 'eid' as const },
  { nameEn: 'Day of Arafah', nameAr: 'يوم عرفة', hijriMonth: 12, hijriDay: 9, type: 'holy' as const },
  { nameEn: 'Eid al-Adha', nameAr: 'عيد الأضحى', hijriMonth: 12, hijriDay: 10, type: 'eid' as const },
];

const IslamicEventsCard = ({ suhurTime, iftarTime, prayerTimeRegion }: IslamicEventsCardProps) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRamadan, setIsRamadan] = useState(false);
  const [realSuhur, setRealSuhur] = useState(suhurTime);
  const [realIftar, setRealIftar] = useState(iftarTime);

  useEffect(() => {
    fetchIslamicEvents();
    fetchRamadanTimes();
  }, [prayerTimeRegion]);

  useEffect(() => {
    if (islamicEvents.length > 0) {
      const updateCountdowns = () => {
        const updatedEvents = islamicEvents.map((event) => {
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

  const fetchRamadanTimes = async () => {
    try {
      let latitude = 25.2048, longitude = 55.2708; // Default to Dubai

      if (prayerTimeRegion) {
        [latitude, longitude] = prayerTimeRegion.split(',').map(Number);
      } else if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (e) {
          console.log('Using default location for Ramadan times');
        }
      }

      // Fetch today's prayer times to get accurate Suhur (Fajr) and Iftar (Maghrib)
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

      if (data.code === 200) {
        // Suhur ends at Fajr, Iftar is at Maghrib
        const fajr = data.data.timings.Fajr.replace(' (PKT)', '').replace(' (GMT)', '').split(' ')[0];
        const maghrib = data.data.timings.Maghrib.replace(' (PKT)', '').replace(' (GMT)', '').split(' ')[0];
        
        setRealSuhur(fajr);
        setRealIftar(maghrib);

        // Check if we're currently in Ramadan
        const hijriMonth = parseInt(data.data.date.hijri.month.number);
        setIsRamadan(hijriMonth === 9);
      }
    } catch (error) {
      console.error('Error fetching Ramadan times:', error);
    }
  };

  const fetchIslamicEvents = async () => {
    setLoading(true);
    try {
      // Get current Hijri date first
      const today = new Date();
      const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      
      const hijriResponse = await fetch(`https://api.aladhan.com/v1/gToH/${todayStr}`);
      const hijriData = await hijriResponse.json();
      
      if (hijriData.code !== 200) {
        setLoading(false);
        return;
      }

      const currentHijriMonth = parseInt(hijriData.data.hijri.month.number);
      const currentHijriDay = parseInt(hijriData.data.hijri.day);
      const currentHijriYear = parseInt(hijriData.data.hijri.year);

      const events: IslamicEvent[] = [];

      // Calculate upcoming events for the next ~13 months
      for (const holiday of ISLAMIC_HOLIDAYS) {
        let targetYear = currentHijriYear;
        
        // If the holiday has passed this year, use next year
        if (holiday.hijriMonth < currentHijriMonth || 
            (holiday.hijriMonth === currentHijriMonth && holiday.hijriDay < currentHijriDay)) {
          targetYear = currentHijriYear + 1;
        }

        try {
          // Convert Hijri date to Gregorian
          const hijriDateStr = `${holiday.hijriDay.toString().padStart(2, '0')}-${holiday.hijriMonth.toString().padStart(2, '0')}-${targetYear}`;
          const convResponse = await fetch(`https://api.aladhan.com/v1/hToG/${hijriDateStr}`);
          const convData = await convResponse.json();

          if (convData.code === 200) {
            const gregDate = convData.data.gregorian;
            const eventDate = new Date(
              parseInt(gregDate.year),
              parseInt(gregDate.month.number) - 1,
              parseInt(gregDate.day)
            );

            // Only include future events
            if (eventDate > today) {
              const hijriMonthNames = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
              
              events.push({
                name: holiday.nameEn,
                nameAr: holiday.nameAr,
                date: eventDate,
                hijriDate: `${holiday.hijriDay} ${hijriMonthNames[holiday.hijriMonth - 1]} ${targetYear}`,
                countdown: '',
                type: holiday.type,
              });
            }
          }
        } catch (err) {
          console.log(`Failed to fetch date for ${holiday.nameEn}`);
        }
      }

      // Sort events by date
      events.sort((a, b) => a.date.getTime() - b.date.getTime());
      setIslamicEvents(events);
    } catch (error) {
      console.error('Error fetching Islamic events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ramadan': return Moon;
      case 'eid': return PartyPopper;
      case 'holy': return Star;
      default: return Calendar;
    }
  };

  const getEventGradient = (type: string) => {
    switch (type) {
      case 'ramadan': return 'from-violet-500/20 to-purple-500/20';
      case 'eid': return 'from-emerald-500/20 to-green-500/20';
      case 'holy': return 'from-amber-500/20 to-orange-500/20';
      default: return 'from-primary/20 to-accent/20';
    }
  };

  const getLocalizedName = (event: IslamicEvent) => {
    return settings.language === 'ar' ? event.nameAr : event.name;
  };

  const nextEvent = islamicEvents[0];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10" />
        
        <div className="relative glass-effect border border-border/50 p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      {settings.language === 'ar' ? 'الأعياد الإسلامية' : 'Islamic Events'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {settings.language === 'ar' ? 'رمضان والأعياد' : 'Ramadan & Holidays'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {!loading && nextEvent && (() => {
                    const NextEventIcon = getEventIcon(nextEvent.type);
                    return (
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <NextEventIcon className="h-5 w-5 text-primary" />
                          <span className="text-lg font-bold text-primary">{nextEvent.countdown}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getLocalizedName(nextEvent)}
                        </p>
                      </div>
                    );
                  })()}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6 space-y-4">
            {/* Suhur & Iftar Times - Show always with real location-based times */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10" />
              <div className="relative glass-effect border border-primary/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h4 className="text-lg font-bold">
                    {settings.language === 'ar' ? 'أوقات الصيام' : 'Fasting Times'}
                  </h4>
                  {isRamadan && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                      {settings.language === 'ar' ? 'رمضان مبارك' : 'Ramadan'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-effect rounded-xl p-4 text-center border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      {settings.language === 'ar' ? 'السحور (قبل الفجر)' : 'Suhur (Before Fajr)'}
                    </p>
                    <p className="text-2xl font-bold text-primary">{realSuhur || suhurTime}</p>
                  </div>
                  <div className="glass-effect rounded-xl p-4 text-center border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      {settings.language === 'ar' ? 'الإفطار (المغرب)' : 'Iftar (Maghrib)'}
                    </p>
                    <p className="text-2xl font-bold text-primary">{realIftar || iftarTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Islamic Events */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : islamicEvents.length > 0 ? (
              <div className="grid gap-3">
                {islamicEvents.slice(0, 6).map((event, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl smooth-transition hover:scale-[1.02]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getEventGradient(event.type)}`} />
                      <div className="relative glass-effect border border-primary/20 p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {(() => {
                              const EventIcon = getEventIcon(event.type);
                              return (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                  <EventIcon className="h-6 w-6 text-primary" />
                                </div>
                              );
                            })()}
                            <div>
                              <h3 className="text-lg font-bold">{getLocalizedName(event)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {event.date.toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
                                  weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{event.hijriDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{event.countdown}</div>
                          <p className="text-xs text-muted-foreground">
                            {settings.language === 'ar' ? 'متبقي' : 'remaining'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {settings.language === 'ar' ? 'لا توجد أحداث قادمة' : 'No upcoming events'}
              </p>
            )}
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default IslamicEventsCard;
