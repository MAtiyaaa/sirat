import React from 'react';
import { Sunrise, Sun, CloudSun, Sunset, Moon } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTimesGridProps {
  prayerTimes: PrayerTimes;
  nextPrayerName: string | undefined;
}

const PrayerTimesGrid = ({ prayerTimes, nextPrayerName }: PrayerTimesGridProps) => {
  const { settings } = useSettings();

  const prayerConfig = [
    {
      key: 'Fajr',
      name: settings.language === 'ar' ? 'الفجر' : 'Fajr',
      icon: Sunrise,
      gradient: 'from-indigo-500/15 via-purple-500/15 to-pink-500/15',
      iconColor: 'text-indigo-500',
      rakaas: { fard: 2, sunnah: 2 },
    },
    {
      key: 'Dhuhr',
      name: settings.language === 'ar' ? 'الظهر' : 'Dhuhr',
      icon: Sun,
      gradient: 'from-amber-500/15 via-orange-500/15 to-yellow-500/15',
      iconColor: 'text-amber-500',
      rakaas: { fard: 4, sunnah: 4 },
    },
    {
      key: 'Asr',
      name: settings.language === 'ar' ? 'العصر' : 'Asr',
      icon: CloudSun,
      gradient: 'from-orange-500/15 via-amber-500/15 to-yellow-500/15',
      iconColor: 'text-orange-500',
      rakaas: { fard: 4, sunnah: 0 },
    },
    {
      key: 'Maghrib',
      name: settings.language === 'ar' ? 'المغرب' : 'Maghrib',
      icon: Sunset,
      gradient: 'from-rose-500/15 via-pink-500/15 to-purple-500/15',
      iconColor: 'text-rose-500',
      rakaas: { fard: 3, sunnah: 2 },
    },
    {
      key: 'Isha',
      name: settings.language === 'ar' ? 'العشاء' : 'Isha',
      icon: Moon,
      gradient: 'from-violet-500/15 via-indigo-500/15 to-blue-500/15',
      iconColor: 'text-violet-500',
      rakaas: { fard: 4, sunnah: 2 },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {prayerConfig.map((prayer, index) => {
        const Icon = prayer.icon;
        const isNext = nextPrayerName === prayer.name;
        const time = prayerTimes[prayer.key as keyof PrayerTimes];

        return (
          <div
            key={prayer.key}
            className={`relative group overflow-hidden rounded-2xl smooth-transition interactive-scale animate-stagger-in ${
              isNext ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-glow-sm' : ''
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${prayer.gradient} opacity-50 group-hover:opacity-80 smooth-transition`} />
            
            {/* Glass overlay */}
            <div className="relative glass-card-elevated border-border/30 group-hover:border-primary/20 p-4 md:p-5 smooth-transition">
              {/* Next badge */}
              {isNext && (
                <div className="absolute -top-1 -right-1 animate-scale-bounce">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur-sm animate-glow-pulse" />
                    <div className="relative bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-glow-sm">
                      {settings.language === 'ar' ? 'القادمة' : 'NEXT'}
                    </div>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 spring-transition ${prayer.iconColor} border border-border/20`}>
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>

              {/* Prayer name */}
              <p className="text-sm font-bold text-muted-foreground mb-1">
                {prayer.name}
              </p>

              {/* Time */}
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {time}
              </p>

              {/* Rakaas */}
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm font-semibold border border-border/20">
                  {settings.language === 'ar' ? 'ف' : 'F'}: {prayer.rakaas.fard}
                </span>
                {prayer.rakaas.sunnah > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm font-semibold border border-border/20">
                    {settings.language === 'ar' ? 'س' : 'S'}: {prayer.rakaas.sunnah}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrayerTimesGrid;
