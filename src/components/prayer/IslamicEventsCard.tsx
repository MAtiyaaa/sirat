import React, { useState, useEffect } from 'react';
import { Moon, ChevronDown, Loader2, Star, PartyPopper, Gift } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface IslamicEvent {
  name: string;
  date: Date;
  hijriDate: string;
  countdown: string;
}

interface IslamicEventsCardProps {
  suhurTime: string;
  iftarTime: string;
  prayerTimeRegion?: string;
}

const IslamicEventsCard = ({ suhurTime, iftarTime, prayerTimeRegion }: IslamicEventsCardProps) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIslamicEvents();
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

  const fetchIslamicEvents = async () => {
    setLoading(true);
    try {
      const events: IslamicEvent[] = [];
      const upcomingDates = [
        { gregorian: '28-02-2026', name: 'Ramadan', hijriDay: 1, hijriMonth: 'Ramadan' },
        { gregorian: '30-03-2026', name: 'Eid al-Fitr', hijriDay: 1, hijriMonth: 'Shawwal' },
        { gregorian: '06-06-2026', name: 'Eid al-Adha', hijriDay: 10, hijriMonth: 'Dhu al-Hijjah' },
      ];

      for (const eventInfo of upcomingDates) {
        try {
          const response = await fetch(`https://api.aladhan.com/v1/gToH/${eventInfo.gregorian}`);
          const data = await response.json();

          if (data.code === 200) {
            const [day, month, year] = eventInfo.gregorian.split('-').map((n) => parseInt(n));
            const eventDate = new Date(year, month - 1, day);

            if (eventDate > new Date()) {
              events.push({
                name: eventInfo.name,
                date: eventDate,
                hijriDate: `${eventInfo.hijriDay} ${eventInfo.hijriMonth} ${data.data.hijri.year}`,
                countdown: '',
              });
            }
          }
        } catch (err) {
          console.log(`Failed to fetch ${eventInfo.name}`);
        }
      }

      setIslamicEvents(events);
    } catch (error) {
      console.error('Error fetching Islamic events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (name: string) => {
    switch (name) {
      case 'Ramadan': return Moon;
      case 'Eid al-Fitr': return PartyPopper;
      case 'Eid al-Adha': return Gift;
      default: return Star;
    }
  };

  const getEventGradient = (name: string) => {
    switch (name) {
      case 'Ramadan': return 'from-violet-500/20 to-purple-500/20';
      case 'Eid al-Fitr': return 'from-emerald-500/20 to-green-500/20';
      case 'Eid al-Adha': return 'from-amber-500/20 to-orange-500/20';
      default: return 'from-primary/20 to-accent/20';
    }
  };

  const getLocalizedName = (name: string) => {
    if (settings.language === 'ar') {
      switch (name) {
        case 'Ramadan': return 'رمضان';
        case 'Eid al-Fitr': return 'عيد الفطر';
        case 'Eid al-Adha': return 'عيد الأضحى';
        default: return name;
      }
    }
    return name;
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
                    const NextEventIcon = getEventIcon(nextEvent.name);
                    return (
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <NextEventIcon className="h-5 w-5 text-primary" />
                          <span className="text-lg font-bold text-primary">{nextEvent.countdown}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getLocalizedName(nextEvent.name)}
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
            {/* Islamic Events */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : islamicEvents.length > 0 ? (
              <div className="grid gap-3">
                {islamicEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl smooth-transition hover:scale-[1.02]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getEventGradient(event.name)}`} />
                      <div className="relative glass-effect border border-primary/20 p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {(() => {
                              const EventIcon = getEventIcon(event.name);
                              return (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                  <EventIcon className="h-6 w-6 text-primary" />
                                </div>
                              );
                            })()}
                            <div>
                              <h3 className="text-lg font-bold">{getLocalizedName(event.name)}</h3>
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

            {/* Suhur & Iftar Times */}
            {suhurTime && iftarTime && (
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10" />
                <div className="relative glass-effect border border-primary/20 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h4 className="text-lg font-bold">
                      {settings.language === 'ar' ? 'أوقات رمضان' : 'Ramadan Times'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-effect rounded-xl p-4 text-center border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">
                        {settings.language === 'ar' ? 'السحور' : 'Suhur'}
                      </p>
                      <p className="text-2xl font-bold text-primary">{suhurTime}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-4 text-center border border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">
                        {settings.language === 'ar' ? 'الإفطار' : 'Iftar'}
                      </p>
                      <p className="text-2xl font-bold text-primary">{iftarTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default IslamicEventsCard;
