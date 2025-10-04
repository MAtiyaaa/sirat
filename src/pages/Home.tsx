import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  MessageSquare, 
  Sparkles, 
  BookMarked, 
  Hand, 
  CircleDot, 
  Scroll, 
  Bookmark, 
  User, 
  Settings as SettingsIcon,
  Droplet,
  History
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';

// Get Surah of the Day based on current date
const getSurahOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return (dayOfYear % 114) + 1;
};

// Islamic Quotes
const islamicQuotes = [
  {
    ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    en: "Indeed, with hardship comes ease",
    reference: "Quran 94:6"
  },
  {
    ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    en: "Be patient, for Allah does not allow the reward of good-doers to be lost",
    reference: "Quran 11:115"
  },
  {
    ar: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    en: "Remember Me; I will remember you",
    reference: "Quran 2:152"
  },
  {
    ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    en: "Whoever relies upon Allah - then He is sufficient for him",
    reference: "Quran 65:3"
  },
  {
    ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    en: "Indeed, Allah is with the patient",
    reference: "Quran 2:153"
  },
  {
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    en: "Our Lord, give us good in this world and good in the Hereafter",
    reference: "Quran 2:201"
  },
  {
    ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    en: "My Lord, increase me in knowledge",
    reference: "Quran 20:114"
  },
  {
    ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    en: "Allah does not burden a soul beyond that it can bear",
    reference: "Quran 2:286"
  }
];

const getQuoteOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return islamicQuotes[dayOfYear % islamicQuotes.length];
};

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);
  const quoteOfDay = getQuoteOfTheDay();

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

  useEffect(() => {
    const loadContinueReading = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get last viewed surah
      const { data: lastViewed } = await supabase
        .from('last_viewed_surah')
        .select('surah_number')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (lastViewed?.surah_number) {
        // Get progress for that surah
        const { data: progress } = await supabase
          .from('reading_progress')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', lastViewed.surah_number)
          .maybeSingle();

        // Fetch surah details
        try {
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${lastViewed.surah_number}`);
          const data = await response.json();
          if (data.code === 200) {
            setContinueReading({
              number: data.data.number,
              name: data.data.name,
              englishName: data.data.englishName,
              englishNameTranslation: data.data.englishNameTranslation,
              numberOfAyahs: data.data.numberOfAyahs,
              ayahNumber: progress?.ayah_number || 1,
            });
          }
        } catch (error) {
          console.error('Error fetching continue reading:', error);
        }
      }
    };

    loadContinueReading();
  }, [user]);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const appBoxes = [
    {
      icon: Book,
      title: { ar: 'القرآن', en: 'Quran' },
      link: '/quran',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: { ar: 'قلم', en: 'Qalam' },
      link: '/qalam',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookMarked,
      title: { ar: 'الأحاديث', en: 'Hadith' },
      link: '/hadith',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Hand,
      title: { ar: 'الأدعية', en: 'Duas' },
      link: '/duas',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: CircleDot,
      title: { ar: 'التسبيح', en: 'Tasbih' },
      link: '/tasbih',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Droplet,
      title: { ar: 'الصلاة', en: 'Prayer' },
      link: '/wudu',
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      icon: Scroll,
      title: { ar: 'القصص', en: 'Stories' },
      link: '/prophet-stories',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Bookmark,
      title: { ar: 'المحفوظات', en: 'Bookmarks' },
      link: '/bookmarks',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: History,
      title: { ar: 'السجل', en: 'History' },
      link: '/chat-history',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: User,
      title: { ar: 'الحساب', en: 'Account' },
      link: '/account',
      gradient: 'from-gray-500 to-slate-500',
    },
    {
      icon: SettingsIcon,
      title: { ar: 'الإعدادات', en: 'Settings' },
      link: '/settings',
      gradient: 'from-zinc-500 to-gray-500',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-8">
      <div className="w-full max-w-4xl mx-auto px-4 space-y-12">
        
        {/* Hero Section - Phenomenal Islamic Design */}
        <div className="relative pt-12 pb-8 animate-fade-in">
          {/* Decorative Islamic Pattern Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0 L20 10 L10 20 L0 10 Z M10 5 L15 10 L10 15 L5 10 Z" fill="currentColor"/>
              </pattern>
              <rect width="100" height="100" fill="url(#islamic-pattern)" />
            </svg>
          </div>

          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

          <div className="relative text-center space-y-4">
            {/* Bismillah Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wider">
                {settings.language === 'ar' ? 'بسم الله الرحمن الرحيم' : 'In the name of Allah'}
              </span>
            </div>
            
            {/* Main Title - Stunning Typography */}
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight ios-26-style relative z-10">
                {settings.language === 'ar' ? (
                  <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent arabic-regal drop-shadow-sm" style={{ lineHeight: '1.1' }}>
                    صراط
                  </span>
                ) : (
                  <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-sm" style={{ lineHeight: '1.1' }}>
                    Sirat
                  </span>
                )}
              </h1>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 -z-10" />
            </div>
            
            {/* Subtitle */}
            <p className="text-base text-muted-foreground font-light tracking-wide">
              {settings.language === 'ar' 
                ? 'رفيقك الإسلامي الشامل'
                : 'Your Complete Islamic Companion'}
            </p>
          </div>
        </div>

        {/* Quick Access Cards - More Compact */}
        {(surahOfDay || continueReading) && (
          <div className="space-y-2.5 -mt-4">
            {/* Surah of the Day */}
            {surahOfDay && (
              <Link 
                to={`/quran/${surahOfDay.number}`}
                className="block group animate-fade-in"
              >
                <div className="glass-effect rounded-3xl p-3.5 border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {settings.language === 'ar' ? 'سورة اليوم' : 'Surah of the Day'}
                        </p>
                        <h3 className="text-sm font-bold leading-tight">
                          {settings.language === 'ar' ? surahOfDay.name : surahOfDay.englishName}
                        </h3>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary/40">
                      {surahOfDay.number}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Continue Reading */}
            {continueReading && (
              <Link 
                to={`/quran/${continueReading.number}`}
                className="block group animate-fade-in"
              >
                <div className="glass-effect rounded-3xl p-3.5 border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Book className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {settings.language === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}
                        </p>
                        <h3 className="text-sm font-bold leading-tight">
                          {settings.language === 'ar' ? continueReading.name : continueReading.englishName}
                        </h3>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary/40">
                      {continueReading.number}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Quote of the Day - Between Continue Reading and Apps */}
        <div className="animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-6 backdrop-blur-xl">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
            
            <div className="relative space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30" />
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30" />
              </div>
              
              <p className={`text-lg md:text-xl font-semibold leading-relaxed ${settings.language === 'ar' ? 'arabic-regal' : ''}`}>
                {settings.language === 'ar' ? quoteOfDay.ar : quoteOfDay.en}
              </p>
              
              <p className="text-xs text-muted-foreground font-medium tracking-wide">
                {quoteOfDay.reference}
              </p>
            </div>
          </div>
        </div>

        {/* App Grid - iOS 26 Style - Smaller & More Spacing */}
        <div className="grid grid-cols-4 gap-6 pt-6 pb-4 animate-fade-in">
          {appBoxes.map((app, index) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.link}
                to={app.link}
                className="flex flex-col items-center gap-2 group"
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {/* iOS-style app icon - Smaller */}
                <div className={`w-14 h-14 rounded-[22%] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition relative overflow-hidden group-active:scale-95`}>
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-[22%] shadow-inner" />
                  <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" strokeWidth={2.5} />
                </div>
                
                {/* App label */}
                <span className="text-[11px] font-medium text-center leading-tight w-full truncate px-0.5">
                  {app.title[settings.language]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Stats - Elegant & Compact */}
        <div className="grid grid-cols-3 gap-2.5 pt-6">
          {[
            { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs' },
            { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses' },
            { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center glass-effect rounded-2xl p-3 border border-border/20 hover:border-border/40 smooth-transition"
            >
              <div className="text-2xl font-bold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent mb-0.5">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">
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
