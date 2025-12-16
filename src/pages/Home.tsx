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
  MapPin,
  Settings as SettingsIcon,
  Moon,
  Calculator
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import HomeHero from '@/components/home/HomeHero';
import PrayerMiniWidget from '@/components/home/PrayerMiniWidget';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import PersonalStats from '@/components/home/PersonalStats';
import AchievementBadge from '@/components/home/AchievementBadge';

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
        reference: "Ash-Sharh (94):6"
    },
    {
        ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
        en: "Be patient, for Allah does not allow the reward of good-doers to be lost",
        reference: "Hud (11):115"
    },
    {
        ar: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        en: "Remember Me; I will remember you",
        reference: "Al-Baqarah (2):152"
    },
    {
        ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        en: "Whoever relies upon Allah - then He is sufficient for him",
        reference: "At-Talaq (65):3"
    },
    {
        ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        en: "Indeed, Allah is with the patient",
        reference: "Al-Baqarah (2):153"
    },
    {
        ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
        en: "Our Lord, give us good in this world and good in the Hereafter",
        reference: "Al-Baqarah (2):201"
    },
    {
        ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        en: "My Lord, increase me in knowledge",
        reference: "Ta-Ha (20):114"
    },
    {
        ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        en: "Allah does not burden a soul beyond that it can bear",
        reference: "Al-Baqarah (2):286"
    },
    {
        ar: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
        en: "Indeed, Allah is Forgiving and Merciful",
        reference: "Al-Baqarah (2):173"
    },
    {
        ar: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
        en: "Indeed, Allah loves those who rely [upon Him]",
        reference: "Ali 'Imran (3):159"
    },
    {
        ar: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ",
        en: "Indeed, Allah loves those who are constantly repentant",
        reference: "Al-Baqarah (2):222"
    },
    {
        ar: "إِنَّ اللَّهَ مَعَ الْمُتَّقِينَ",
        en: "Indeed, Allah is with those who fear Him",
        reference: "Al-Baqarah (2):194"
    },
    {
        ar: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        en: "Indeed, Allah is over all things competent",
        reference: "Al-Baqarah (2):20"
    },
    {
        ar: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
        en: "Indeed, Allah loves the doers of good",
        reference: "Ali 'Imran (3):134"
    },
    {
        ar: "إِنَّ اللَّهَ يُحِبُّ الصَّابِرِينَ",
        en: "Indeed, Allah loves the patient",
        reference: "Ali 'Imran (3):146"
    },
    {
        ar: "إِنَّ اللَّهَ يُحِبُّ الْمُتَطَهِّرِينَ",
        en: "Indeed, Allah loves those who purify themselves",
        reference: "Al-Baqarah (2):222"
    },
    {
        ar: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
        en: "My mercy encompasses all things",
        reference: "Al-A'raf (7):156"
    },
    {
        ar: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ",
        en: "Indeed, my Lord is near and responsive",
        reference: "Hud (11):61"
    },
    {
        ar: "وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
        en: "Perhaps you dislike a thing and it is good for you",
        reference: "Al-Baqarah (2):216"
    },
    {
        ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
        en: "Allah is the Light of the heavens and the earth",
        reference: "An-Nur (24):35"
    },
    {
        ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        en: "Surely, by the remembrance of Allah hearts find rest",
        reference: "Ar-Ra'd (13):28"
    },
    {
        ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
        en: "He is with you wherever you may be",
        reference: "Al-Hadid (57):4"
    },
    {
        ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        en: "For indeed, with hardship [will be] ease",
        reference: "Ash-Sharh (94):5"
    },
    {
        ar: "وَاللَّهُ خَيْرٌ حَافِظًا",
        en: "Allah is the best of protectors",
        reference: "Yusuf (12):64"
    },
    {
        ar: "إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ",
        en: "Indeed, Allah is Subtle and Acquainted",
        reference: "Al-An'am (6):103"
    },
    {
        ar: "وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ",
        en: "Allah knows and you do not know",
        reference: "Al-Baqarah (2):216"
    },
    {
        ar: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
        en: "Indeed, Allah will not change the condition of a people until they change what is in themselves",
        reference: "Ar-Ra'd (13):11"
    },
    {
        ar: "وَمَا عِندَ اللَّهِ خَيْرٌ وَأَبْقَىٰ",
        en: "What is with Allah is better and more lasting",
        reference: "Al-Qasas (28):60"
    },
    {
        ar: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
        en: "Indeed, it is Allah who is the [continual] Provider, the firm possessor of strength",
        reference: "Adh-Dhariyat (51):58"
    },
    {
        ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        en: "Sufficient for us is Allah, and [He is] the best Disposer of affairs",
        reference: "Ali 'Imran (3):173"
    },
    {
        ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        en: "Whoever fears Allah - He will make for him a way out",
        reference: "At-Talaq (65):2"
    },
    {
        ar: "إِنَّ اللَّهَ يُدَافِعُ عَنِ الَّذِينَ آمَنُوا",
        en: "Indeed, Allah defends those who have believed",
        reference: "Al-Hajj (22):38"
    },
    {
        ar: "وَكَفَىٰ بِاللَّهِ وَلِيًّا وَكَفَىٰ بِاللَّهِ نَصِيرًا",
        en: "Allah is sufficient as an ally, and sufficient is Allah as a helper",
        reference: "An-Nisa (4):45"
    },
    {
        ar: "إِنَّ اللَّهَ سَمِيعٌ بَصِيرٌ",
        en: "Indeed, Allah is Hearing and Seeing",
        reference: "An-Nisa (4):58"
    }
];

const getQuoteOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return islamicQuotes[dayOfYear % islamicQuotes.length];
};

// Surah ayah counts for progress calculation
const surahAyahCounts: Record<number, number> = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

const totalAyahs = Object.values(surahAyahCounts).reduce((a, b) => a + b, 0);

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [firstName, setFirstName] = useState<string | undefined>();
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);
  const [personalStats, setPersonalStats] = useState<{
    surahsRead: number;
    daysOpened: number;
    bookmarksCount: number;
    quranProgress: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
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
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setStatsLoading(false);
        return;
      }

      // Load profile for first name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (profile?.first_name) {
        setFirstName(profile.first_name);
      }

      // Get last viewed surah for continue reading
      const { data: lastViewed } = await supabase
        .from('last_viewed_surah')
        .select('surah_number')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (lastViewed?.surah_number) {
        const { data: progress } = await supabase
          .from('reading_progress')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', lastViewed.surah_number)
          .maybeSingle();

        try {
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${lastViewed.surah_number}`);
          const data = await response.json();
          if (data.code === 200) {
            setContinueReading({
              number: data.data.number,
              name: data.data.name,
              englishName: data.data.englishName,
              numberOfAyahs: data.data.numberOfAyahs,
              ayahNumber: progress?.ayah_number || 1,
            });
          }
        } catch (error) {
          console.error('Error fetching continue reading:', error);
        }
      }

      // Load personal stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('surahs_read, days_opened_this_year')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const { count: bookmarksCount } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // Calculate Quran progress based on reading_progress
      const { data: readingProgress } = await supabase
        .from('reading_progress')
        .select('surah_number, ayah_number')
        .eq('user_id', session.user.id);

      let totalAyahsRead = 0;
      if (readingProgress) {
        for (const rp of readingProgress) {
          totalAyahsRead += rp.ayah_number;
        }
      }

      const quranProgress = Math.round((totalAyahsRead / totalAyahs) * 100);

      setPersonalStats({
        surahsRead: userStats?.surahs_read || 0,
        daysOpened: userStats?.days_opened_this_year || 0,
        bookmarksCount: bookmarksCount || 0,
        quranProgress: Math.min(quranProgress, 100),
      });

      setStatsLoading(false);
    };

    loadUserData();
  }, [user]);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
      icon: Moon,
      title: { ar: 'الصلاة', en: 'Prayer' },
      link: '/prayer',
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      icon: Calculator,
      title: { ar: 'الزكاة', en: 'Zakat' },
      link: '/zakat',
      gradient: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Scroll,
      title: { ar: 'تعليم', en: 'Education' },
      link: '/education',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Bookmark,
      title: { ar: 'المحفوظات', en: 'Bookmarks' },
      link: '/bookmarks',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: MapPin,
      title: { ar: 'المساجد', en: 'Mosques' },
      link: '/mosquelocator',
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
      <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Hero Section */}
        <HomeHero firstName={firstName} />

        {/* Prayer Mini Widget */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <PrayerMiniWidget />
        </div>

        {/* Achievement Badge */}
        {user && personalStats && (
          <AchievementBadge stats={personalStats} />
        )}

        {/* Featured Carousel */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <FeaturedCarousel
            surahOfDay={surahOfDay}
            continueReading={continueReading}
            quoteOfDay={quoteOfDay}
          />
        </div>

        {/* Personal Stats (only for logged in users) */}
        {user && (
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <PersonalStats stats={personalStats} loading={statsLoading} />
          </div>
        )}

        {/* App Grid */}
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-muted-foreground px-1 mb-3">
            {settings.language === 'ar' ? 'استكشف' : 'Explore'}
          </h2>
          <div className="grid grid-cols-4 gap-5 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {appBoxes.map((app, index) => {
              const Icon = app.icon;
              return (
                <Link
                  key={app.link}
                  to={app.link}
                  className="flex flex-col items-center gap-2 group"
                  style={{
                    animationDelay: `${400 + index * 30}ms`,
                  }}
                >
                  <div className={`w-14 h-14 rounded-[22%] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition relative overflow-hidden group-active:scale-95`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    <div className="absolute inset-0 rounded-[22%] shadow-inner" />
                    <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" strokeWidth={2.5} />
                  </div>
                  
                  <span className="text-[11px] font-medium text-center leading-tight w-full truncate px-0.5">
                    {app.title[settings.language]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Static Quran Stats - Compact */}
        <div className="grid grid-cols-3 gap-2.5 pt-4 pb-4">
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
