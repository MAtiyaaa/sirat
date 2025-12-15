import React from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PrayerHeroProps {
  nextPrayer: { name: string; timeLeft: string; time: string } | null;
  location: string;
  loading: boolean;
}

const PrayerHero = ({ nextPrayer, location, loading }: PrayerHeroProps) => {
  const { settings } = useSettings();

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      </div>

      {/* Islamic pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative glass-effect border border-primary/20 p-8 md:p-12">
        {/* Header with sparkles */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            {settings.language === 'ar' ? 'السلام عليكم' : 'Assalamu Alaikum'}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {settings.language === 'ar' ? 'صفحة الصلاة' : 'Prayer Hub'}
        </h1>

        {location && (
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {/* Next Prayer Feature Card */}
        {!loading && nextPrayer && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 rounded-2xl blur-xl" />
            <div className="relative glass-effect rounded-2xl p-6 md:p-8 border border-primary/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30">
                      <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {settings.language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      {nextPrayer.name}
                    </h2>
                    <p className="text-lg text-foreground/80">
                      {settings.language === 'ar' ? 'الساعة' : 'at'} {nextPrayer.time}
                    </p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {settings.language === 'ar' ? 'الوقت المتبقي' : 'Time Remaining'}
                  </p>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {nextPrayer.timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-effect rounded-2xl p-8 border border-border/50 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerHero;
