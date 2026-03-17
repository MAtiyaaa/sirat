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
    <div className="relative overflow-hidden rounded-2xl animate-fade-in-up">
      {/* Layered atmospheric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 orb-primary rounded-full blur-3xl animate-glow-breathe" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 orb-gold rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Islamic pattern texture */}
      <div className="absolute inset-0 islamic-pattern-bg opacity-30" />

      <div className="relative glass-card-elevated p-7 md:p-10 border-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Star className="h-4 w-4 text-islamic-gold animate-glow-pulse" />
          <span className="text-sm font-medium text-foreground/70">
            {settings.language === 'ar' ? 'السلام عليكم' : 'Assalamu Alaikum'}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ios-26-style animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <span className="bg-gradient-to-r from-foreground via-primary/90 to-foreground bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
            {settings.language === 'ar' ? 'صفحة الصلاة' : 'Prayer Hub'}
          </span>
        </h1>

        {location && (
          <div className="flex items-center gap-2 text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">{location}</span>
          </div>
        )}

        {/* Next Prayer Card */}
        {!loading && nextPrayer && (
          <div className="relative mt-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 to-islamic-gold/8 rounded-2xl blur-xl" />
            <div className="relative glass-card-elevated rounded-2xl p-5 md:p-7 border-primary/15">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/15 rounded-full blur-lg animate-glow-breathe" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center border border-primary/20 shadow-glow-sm">
                      <Clock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                      {settings.language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold gradient-text-primary">
                      {nextPrayer.name}
                    </h2>
                    <p className="text-sm text-foreground/70 font-medium">
                      {settings.language === 'ar' ? 'الساعة' : 'at'} {nextPrayer.time}
                    </p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">
                    {settings.language === 'ar' ? 'الوقت المتبقي' : 'Time Remaining'}
                  </p>
                  <div className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-islamic-gold bg-clip-text text-transparent">
                      {nextPrayer.timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-2xl p-7 mt-2">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded-lg" />
                <div className="h-7 w-32 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerHero;
