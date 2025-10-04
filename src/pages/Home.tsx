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

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);

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
      title: { ar: 'الوضوء', en: 'Wudu' },
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
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section - Compact */}
        <div className="text-center space-y-3 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight ios-26-style">
            {settings.language === 'ar' ? (
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent arabic-regal">
                صراط
              </span>
            ) : (
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Sirat
              </span>
            )}
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground">
            {settings.language === 'ar' 
              ? 'رفيقك الإسلامي الشامل'
              : 'Your Complete Islamic Companion'}
          </p>
        </div>

        {/* Quick Access Cards */}
        {(surahOfDay || continueReading) && (
          <div className="space-y-3">
            {/* Surah of the Day */}
            {surahOfDay && (
              <Link 
                to={`/quran/${surahOfDay.number}`}
                className="block group animate-fade-in"
              >
                <div className="glass-effect rounded-3xl p-4 border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {settings.language === 'ar' ? 'سورة اليوم' : 'Surah of the Day'}
                        </p>
                        <h3 className="text-base font-bold">
                          {settings.language === 'ar' ? surahOfDay.name : surahOfDay.englishName}
                        </h3>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary/50">
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
                <div className="glass-effect rounded-3xl p-4 border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Book className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {settings.language === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}
                        </p>
                        <h3 className="text-base font-bold">
                          {settings.language === 'ar' ? continueReading.name : continueReading.englishName}
                        </h3>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary/50">
                      {continueReading.number}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* App Grid - iOS 26 Style */}
        <div className="grid grid-cols-4 gap-4 animate-fade-in">
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
                {/* iOS-style app icon */}
                <div className={`w-full aspect-square rounded-[22%] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 smooth-transition relative overflow-hidden`}>
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-white relative z-10" strokeWidth={2} />
                </div>
                
                {/* App label */}
                <span className="text-xs font-medium text-center leading-tight w-full truncate px-1">
                  {app.title[settings.language]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Stats - More compact */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          {[
            { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs' },
            { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses' },
            { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center glass-effect rounded-2xl p-3 border border-border/30"
            >
              <div className="text-xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
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
