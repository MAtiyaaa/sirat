import React from 'react';
import { Clock, MapPin, Star } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PrayerHeroProps {
  nextPrayer: { name: string; timeLeft: string; time: string } | null;
  location: string;
  loading: boolean;
}

const PrayerHero = ({ nextPrayer, location, loading }: PrayerHeroProps) => {
  const { settings } = useSettings();

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Layered atmospheric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/12 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-islamic-gold/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Islamic pattern texture */}
      <div className="absolute inset-0 islamic-pattern-bg opacity-40" />

      <div className="relative glass-card p-5 sm:p-7 md:p-10 border-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-islamic-gold animate-glow-pulse" />
          <span className="text-sm font-medium text-foreground/70">
            {settings.language === 'ar' ? 'السلام عليكم' : 'Assalamu Alaikum'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {settings.language === 'ar' ? 'صفحة الصلاة' : 'Prayer Hub'}
        </h1>

        {location && (
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {/* Next Prayer Card */}
        {!loading && nextPrayer && (
          <div className="relative mt-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-islamic-gold/15 rounded-2xl blur-xl" aria-hidden="true" />
            <div className="relative glass-card rounded-2xl p-4 sm:p-5 md:p-7 border-primary/20">
              <div className="flex items-center justify-between gap-3 sm:gap-5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow-pulse" aria-hidden="true" />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/30 to-islamic-gold/15 flex items-center justify-center border border-islamic-gold/30">
                      <Clock className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-bold">
                      {settings.language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
                    </p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary truncate">
                      {nextPrayer.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-foreground/70 truncate">
                      {settings.language === 'ar' ? 'الساعة' : 'at'} {nextPrayer.time}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    {settings.language === 'ar' ? 'متبقي' : 'In'}
                  </p>
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-islamic-gold bg-clip-text text-transparent tabular-nums">
                    {nextPrayer.timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-2xl p-7 animate-pulse mt-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-7 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerHero;
