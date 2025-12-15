import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Fingerprint, MapPin, Building2, BookOpen, Calculator } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const QuickAccessGrid = () => {
  const { settings } = useSettings();

  const quickLinks = [
    {
      to: '/duas',
      icon: Sparkles,
      title: settings.language === 'ar' ? 'الأدعية' : "Dua's",
      description: settings.language === 'ar' ? 'أدعية مباركة' : 'Blessed prayers',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
    },
    {
      to: '/tasbih',
      icon: Fingerprint,
      title: settings.language === 'ar' ? 'التسبيح' : 'Tasbih',
      description: settings.language === 'ar' ? 'عداد الذكر' : 'Dhikr counter',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      to: '/mosques',
      icon: Building2,
      title: settings.language === 'ar' ? 'المساجد' : 'Mosques',
      description: settings.language === 'ar' ? 'مساجد قريبة' : 'Nearby mosques',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      to: '/holy-cities',
      icon: MapPin,
      title: settings.language === 'ar' ? 'المدن المقدسة' : 'Holy Cities',
      description: settings.language === 'ar' ? 'مكة والمدينة' : 'Makkah & Madinah',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-500',
    },
    {
      to: '/quran',
      icon: BookOpen,
      title: settings.language === 'ar' ? 'القرآن' : 'Quran',
      description: settings.language === 'ar' ? 'اقرأ وتدبر' : 'Read & reflect',
      gradient: 'from-rose-500/20 to-red-500/20',
      iconColor: 'text-rose-500',
    },
    {
      to: '/zakat',
      icon: Calculator,
      title: settings.language === 'ar' ? 'الزكاة' : 'Zakat',
      description: settings.language === 'ar' ? 'حاسبة الزكاة' : 'Calculator',
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        {settings.language === 'ar' ? 'الوصول السريع' : 'Quick Access'}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className="group relative overflow-hidden rounded-2xl smooth-transition hover:scale-105"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-60 group-hover:opacity-100 smooth-transition`} />
              
              {/* Content */}
              <div className="relative glass-effect border border-border/50 group-hover:border-primary/30 p-4 text-center smooth-transition">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-background/50 flex items-center justify-center mb-3 group-hover:scale-110 smooth-transition ${link.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-semibold text-sm mb-0.5">{link.title}</p>
                <p className="text-xs text-muted-foreground truncate">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
