import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';

// Get Surah of the Day based on current date
const getSurahOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return (dayOfYear % 114) + 1;
};

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);

  useEffect(() => {
    // Fetch Surah of the Day
    const fetchSurahOfDay = async () => {
      const surahNumber = getSurahOfTheDay();
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        if (data.code === 200) {
          setSurahOfDay({
            number: data.data.number,
            name: data.data.name,
            englishName: data.data.englishName,
            englishNameTranslation: data.data.englishNameTranslation,
            numberOfAyahs: data.data.numberOfAyahs,
          });
        }
      } catch (error) {
        console.error('Error fetching Surah of the Day:', error);
      }
    };

    fetchSurahOfDay();
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Book,
      title: { ar: 'القرآن الكريم', en: 'Holy Quran' },
      description: { 
        ar: 'اقرأ وتعلم مع التفسير والترجمة', 
        en: 'Read and learn with tafsir and translation' 
      },
      link: '/quran',
      gradient: 'from-blue-500/20 via-blue-400/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: MessageSquare,
      title: { ar: 'قلم - المساعد الذكي', en: 'Qalam AI' },
      description: { 
        ar: 'اسأل أسئلة إسلامية واحصل على إجابات', 
        en: 'Islamic questions answered instantly' 
      },
      link: '/qalam',
      gradient: 'from-purple-500/20 via-pink-400/20 to-rose-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {settings.language === 'ar' ? 'بسم الله الرحمن الرحيم' : 'In the name of Allah, the Most Gracious'}
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Sirat
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            {settings.language === 'ar' 
              ? 'رفيقك في رحلة تعلم القرآن الكريم'
              : 'Your companion in the journey of learning the Quran'}
          </p>

          {!user && (
            <Link 
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 smooth-transition"
            >
              {settings.language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Surah of the Day */}
        {surahOfDay && (
          <Link 
            to={`/quran/${surahOfDay.number}`}
            className="block group animate-fade-in max-w-2xl mx-auto"
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
              
              <div className="relative glass-effect rounded-2xl p-4 md:p-5 border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                      {settings.language === 'ar' ? 'سورة اليوم' : 'Surah of the Day'}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary/70">
                    {surahOfDay.number}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    {settings.language === 'ar' ? surahOfDay.name : surahOfDay.englishName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {surahOfDay.englishNameTranslation} • {surahOfDay.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 smooth-transition">
                  <span>
                    {settings.language === 'ar' ? 'اقرأ الآن' : 'Read Now'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 mt-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.link}
                to={feature.link}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                
                <div className="relative glass-effect rounded-2xl p-4 md:p-8 h-full border border-border/30 hover:border-border/50 smooth-transition backdrop-blur-xl">
                  <div className="space-y-3 md:space-y-5">
                    <div className={`inline-flex w-10 h-10 md:w-14 md:h-14 rounded-xl ${feature.iconBg} items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-5 w-5 md:h-7 md:w-7 ${feature.iconColor}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {feature.title[settings.language]}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description[settings.language]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 smooth-transition">
                      <span>
                        {settings.language === 'ar' ? 'استكشف' : 'Explore'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
          {[
            { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs' },
            { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses' },
            { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center glass-effect rounded-xl p-4 md:p-5 border border-border/30 animate-fade-in"
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-1.5 whitespace-nowrap">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
