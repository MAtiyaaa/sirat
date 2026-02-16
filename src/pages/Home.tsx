import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  History,
  Calculator,
  Clock
} from 'lucide-react';
import RamadanBanner, { isRamadan } from '@/components/RamadanBanner';
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
        ar: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
        en: "Indeed, Allah loves those who put their trust in Him",
        reference: "Ali 'Imran (3):159"
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

// Map transliterated Surah names to Arabic for reference localization
const surahNameMap: Record<string, string> = {
  "Ash-Sharh": "الشرح",
  "Hud": "هود",
  "Al-Baqarah": "البقرة",
  "At-Talaq": "الطلاق",
  "Ali 'Imran": "آل عمران",
  "Ta-Ha": "طه",
  "Ar-Ra'd": "الرعد",
  "Al-Hadid": "الحديد",
  "Yusuf": "يوسف",
  "An-Nur": "النور",
  "Al-An'am": "الأنعام",
  "Al-A'raf": "الأعراف",
  "An-Nisa": "النساء",
  "Adh-Dhariyat": "الذاريات",
  "Al-Qasas": "القصص",
  "Al-Hajj": "الحج",
};

// Convert Western numerals to Eastern Arabic numerals
const toArabicNumerals = (input: string) => input.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// Format a reference like "Ash-Sharh (94):6" based on language
const formatReference = (reference: string, language: 'ar' | 'en') => {
  if (language === 'en') return reference;
  const match = reference.match(/^\s*(.*?)\s*\((\d+)\):(\d+)\s*$/);
  if (match) {
    const [, name, surahNum, ayahNum] = match;
    const arabicName = surahNameMap[name.trim()] || name.trim();
    const surahNumAr = toArabicNumerals(surahNum);
    const ayahNumAr = toArabicNumerals(ayahNum);
    return `سورة ${arabicName} (${surahNumAr}):${ayahNumAr}`;
  }
  // Fallback: just localize any digits present
  return toArabicNumerals(reference);
};

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);
  const [homePrayerTimes, setHomePrayerTimes] = useState<any>(null);
  const [prayerTimesLoading, setPrayerTimesLoading] = useState(true);
  const [selectedPrayerIndex, setSelectedPrayerIndex] = useState(0);
  const quoteOfDay = getQuoteOfTheDay();
  const showRamadan = isRamadan();

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

  // Fetch prayer times for home carousel
  useEffect(() => {
    const fetchHomePrayer = async () => {
      setPrayerTimesLoading(true);
      try {
        let latitude: number, longitude: number;
        if (settings.prayerTimeRegion) {
          [latitude, longitude] = settings.prayerTimeRegion.split(',').map(Number);
        } else {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        }
        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const data = await response.json();
        if (data.code === 200) {
          setHomePrayerTimes(data.data.timings);
        }
      } catch {
        setHomePrayerTimes({ Fajr: '05:49', Dhuhr: '12:33', Asr: '15:47', Maghrib: '18:13', Isha: '19:17' });
      } finally {
        setPrayerTimesLoading(false);
      }
    };
    fetchHomePrayer();
  }, [settings.prayerTimeRegion]);

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
                {settings.language === 'ar' ? 'بسم الله الرحمن الرحيم' : 'بسم الله الرحمن الرحيم'}
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
                ? 'اقرأ. تدبّر. تذكّر.'
                : 'Read. Reflect. Remember.'}
            </p>
          </div>
        </div>

        {/* Ramadan Banner */}
        {showRamadan && <RamadanBanner variant="home" />}

        {/* Prayer Times Carousel */}
        {(() => {
          const prayerList = homePrayerTimes ? [
            { name: settings.language === 'ar' ? 'الفجر' : 'Fajr', time: homePrayerTimes.Fajr, icon: '🌙' },
            { name: settings.language === 'ar' ? 'الظهر' : 'Dhuhr', time: homePrayerTimes.Dhuhr, icon: '☀️' },
            { name: settings.language === 'ar' ? 'العصر' : 'Asr', time: homePrayerTimes.Asr, icon: '🌤️' },
            { name: settings.language === 'ar' ? 'المغرب' : 'Maghrib', time: homePrayerTimes.Maghrib, icon: '🌅' },
            { name: settings.language === 'ar' ? 'العشاء' : 'Isha', time: homePrayerTimes.Isha, icon: '🌑' },
          ] : [];

          return !prayerTimesLoading && homePrayerTimes ? (
            <div className="animate-fade-in -mt-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
                {prayerList.map((p, i) => (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPrayerIndex(i)}
                    className={`flex-shrink-0 snap-center glass-effect rounded-2xl p-3 text-center cursor-pointer smooth-transition border min-w-[72px] ${
                      selectedPrayerIndex === i
                        ? 'border-primary/40 bg-primary/10 scale-105'
                        : 'border-border/20 hover:border-border/40'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">{p.name}</p>
                    <p className="text-sm font-bold text-foreground">{p.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Sign In Banner for Guests */}
        {!user && (
          <div className="animate-fade-in -mt-4">
            <Link to="/auth">
              <div className="glass-effect rounded-3xl p-4 border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 hover:border-primary/50 smooth-transition backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-tight">
                        {settings.language === 'ar' ? 'سجّل الدخول' : 'Sign In'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {settings.language === 'ar' 
                          ? 'احفظ تقدمك وإشاراتك المرجعية عبر جميع أجهزتك'
                          : 'Sync your progress and bookmarks across devices'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0 rounded-xl">
                    {settings.language === 'ar' ? 'ابدأ' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        )}

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
                          {settings.language === 'ar' ? 'آية اليوم' : 'Daily Ayah'}
                        </p>
                        <h3 className="text-sm font-bold leading-tight">
                          {settings.language === 'ar' ? surahOfDay.name : `${surahOfDay.englishName} (${surahOfDay.number}):1`}
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
                {settings.language === 'ar' ? formatReference(quoteOfDay.reference, 'ar') : formatReference(quoteOfDay.reference, 'en')}
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
