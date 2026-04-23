import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Fingerprint, MapPin, Building2, BookOpen, Calculator } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const QuickAccessGrid = () => {
  const { settings } = useSettings();

  const quickLinks = [
    { to: '/duas', icon: Sparkles, title: settings.language === 'ar' ? 'الأدعية' : "Dua's", description: settings.language === 'ar' ? 'أدعية مباركة' : 'Blessed prayers', gradient: 'from-purple-500 to-pink-500' },
    { to: '/tasbih', icon: Fingerprint, title: settings.language === 'ar' ? 'التسبيح' : 'Tasbih', description: settings.language === 'ar' ? 'عداد الذكر' : 'Dhikr counter', gradient: 'from-emerald-500 to-teal-500' },
    { to: '/mosques', icon: Building2, title: settings.language === 'ar' ? 'المساجد' : 'Mosques', description: settings.language === 'ar' ? 'مساجد قريبة' : 'Nearby mosques', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/holy-cities', icon: MapPin, title: settings.language === 'ar' ? 'المدن المقدسة' : 'Holy Cities', description: settings.language === 'ar' ? 'مكة والمدينة' : 'Makkah & Madinah', gradient: 'from-amber-500 to-orange-500' },
    { to: '/quran', icon: BookOpen, title: settings.language === 'ar' ? 'القرآن' : 'Quran', description: settings.language === 'ar' ? 'اقرأ وتدبر' : 'Read & reflect', gradient: 'from-rose-500 to-red-500' },
    { to: '/zakat', icon: Calculator, title: settings.language === 'ar' ? 'الزكاة' : 'Zakat', description: settings.language === 'ar' ? 'حاسبة الزكاة' : 'Calculator', gradient: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <p className="section-label">
          {settings.language === 'ar' ? 'الوصول السريع' : 'Quick Access'}
        </p>
        <div className="ornate-divider flex-1" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.to}
              to={link.to}
              className="group relative overflow-hidden rounded-2xl press-tile"
            >
              <div className="glass-card p-3.5 text-center smooth-transition group-hover:border-primary/25 relative overflow-hidden h-full">
                {/* Warm accent glow */}
                <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-2xl smooth-transition`} />

                <div className={`w-11 h-11 mx-auto rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-2.5 group-hover:scale-110 smooth-transition shadow-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <Icon className="h-5 w-5 text-white drop-shadow-sm relative z-10" strokeWidth={2.2} />
                </div>
                <p className="font-semibold text-[13px] leading-tight mb-0.5">{link.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
