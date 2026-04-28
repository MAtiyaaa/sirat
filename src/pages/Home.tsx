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
  Clock,
  Sun,
  CloudSun,
  Sunset,
  ChevronRight,
  Star
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
    { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease", reference: "Ash-Sharh (94):6" },
    { ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", en: "Be patient, for Allah does not allow the reward of good-doers to be lost", reference: "Hud (11):115" },
    { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "Remember Me; I will remember you", reference: "Al-Baqarah (2):152" },
    { ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", en: "Whoever relies upon Allah - then He is sufficient for him", reference: "At-Talaq (65):3" },
    { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient", reference: "Al-Baqarah (2):153" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", en: "Our Lord, give us good in this world and good in the Hereafter", reference: "Al-Baqarah (2):201" },
    { ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا", en: "My Lord, increase me in knowledge", reference: "Ta-Ha (20):114" },
    { ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", en: "Allah does not burden a soul beyond that it can bear", reference: "Al-Baqarah (2):286" },
    { ar: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", en: "Indeed, Allah is Forgiving and Merciful", reference: "Al-Baqarah (2):173" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Surely, by the remembrance of Allah hearts find rest", reference: "Ar-Ra'd (13):28" },
    { ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", en: "He is with you wherever you may be", reference: "Al-Hadid (57):4" },
    { ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", en: "Sufficient for us is Allah, and [He is] the best Disposer of affairs", reference: "Ali 'Imran (3):173" },
    { ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", en: "Whoever fears Allah - He will make for him a way out", reference: "At-Talaq (65):2" },
    { ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", en: "Allah is the Light of the heavens and the earth", reference: "An-Nur (24):35" },
    { ar: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", en: "My mercy encompasses all things", reference: "Al-A'raf (7):156" },
    { ar: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", en: "Indeed, my Lord is near and responsive", reference: "Hud (11):61" },
    { ar: "وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", en: "Perhaps you dislike a thing and it is good for you", reference: "Al-Baqarah (2):216" },
    { ar: "وَاللَّهُ خَيْرٌ حَافِظًا", en: "Allah is the best of protectors", reference: "Yusuf (12):64" },
    { ar: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", en: "Indeed, it is Allah who is the [continual] Provider, the firm possessor of strength", reference: "Adh-Dhariyat (51):58" },
    { ar: "وَمَا عِندَ اللَّهِ خَيْرٌ وَأَبْقَىٰ", en: "What is with Allah is better and more lasting", reference: "Al-Qasas (28):60" },
];

const getQuoteOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return islamicQuotes[dayOfYear % islamicQuotes.length];
};

const surahNameMap: Record<string, string> = {
  "Ash-Sharh": "الشرح", "Hud": "هود", "Al-Baqarah": "البقرة", "At-Talaq": "الطلاق",
  "Ali 'Imran": "آل عمران", "Ta-Ha": "طه", "Ar-Ra'd": "الرعد", "Al-Hadid": "الحديد",
  "Yusuf": "يوسف", "An-Nur": "النور", "Al-An'am": "الأنعام", "Al-A'raf": "الأعراف",
  "An-Nisa": "النساء", "Adh-Dhariyat": "الذاريات", "Al-Qasas": "القصص", "Al-Hajj": "الحج",
};

const toArabicNumerals = (input: string) => input.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

const formatReference = (reference: string, language: 'ar' | 'en') => {
  if (language === 'en') return reference;
  const match = reference.match(/^\s*(.*?)\s*\((\d+)\):(\d+)\s*$/);
  if (match) {
    const [, name, surahNum, ayahNum] = match;
    const arabicName = surahNameMap[name.trim()] || name.trim();
    return `سورة ${arabicName} (${toArabicNumerals(surahNum)}):${toArabicNumerals(ayahNum)}`;
  }
  return toArabicNumerals(reference);
};

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);
  const [homePrayerTimes, setHomePrayerTimes] = useState<any>(null);
  const [prayerTimesLoading, setPrayerTimesLoading] = useState(true);
  const quoteOfDay = getQuoteOfTheDay();
  const showRamadan = isRamadan();

  useEffect(() => {
    const fetchSurahOfDay = async () => {
      const surahNumber = getSurahOfTheDay();
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        if (data.code === 200) {
          setSurahOfDay({
            number: data.data.number, name: data.data.name,
            englishName: data.data.englishName, englishNameTranslation: data.data.englishNameTranslation,
            numberOfAyahs: data.data.numberOfAyahs,
          });
        }
      } catch (error) { console.error('Error fetching Surah of the Day:', error); }
    };
    fetchSurahOfDay();
  }, []);

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
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
        const data = await response.json();
        if (data.code === 200) setHomePrayerTimes(data.data.timings);
      } catch {
        setHomePrayerTimes({ Fajr: '05:49', Dhuhr: '12:33', Asr: '15:47', Maghrib: '18:13', Isha: '19:17' });
      } finally { setPrayerTimesLoading(false); }
    };
    fetchHomePrayer();
  }, [settings.prayerTimeRegion]);

  useEffect(() => {
    const loadContinueReading = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: lastViewed } = await supabase.from('last_viewed_surah').select('surah_number').eq('user_id', session.user.id).maybeSingle();
      if (lastViewed?.surah_number) {
        const { data: progress } = await supabase.from('reading_progress').select('ayah_number').eq('user_id', session.user.id).eq('surah_number', lastViewed.surah_number).maybeSingle();
        try {
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${lastViewed.surah_number}`);
          const data = await response.json();
          if (data.code === 200) {
            setContinueReading({
              number: data.data.number, name: data.data.name,
              englishName: data.data.englishName, englishNameTranslation: data.data.englishNameTranslation,
              numberOfAyahs: data.data.numberOfAyahs, ayahNumber: progress?.ayah_number || 1,
            });
          }
        } catch (error) { console.error('Error fetching continue reading:', error); }
      }
    };
    loadContinueReading();
  }, [user]);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => { setUser(session?.user ?? null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const appBoxes = [
    { icon: Book, title: { ar: 'القرآن', en: 'Quran' }, link: '/quran', gradient: 'from-blue-500 to-cyan-500' },
    { icon: MessageSquare, title: { ar: 'قلم', en: 'Qalam' }, link: '/qalam', gradient: 'from-purple-500 to-pink-500' },
    { icon: BookMarked, title: { ar: 'الأحاديث', en: 'Hadith' }, link: '/hadith', gradient: 'from-green-500 to-emerald-500' },
    { icon: Hand, title: { ar: 'الأدعية', en: 'Duas' }, link: '/duas', gradient: 'from-orange-500 to-amber-500' },
    { icon: CircleDot, title: { ar: 'التسبيح', en: 'Tasbih' }, link: '/tasbih', gradient: 'from-teal-500 to-cyan-500' },
    { icon: Moon, title: { ar: 'الصلاة', en: 'Prayer' }, link: '/prayer', gradient: 'from-sky-500 to-blue-500' },
    { icon: Calculator, title: { ar: 'الزكاة', en: 'Zakat' }, link: '/zakat', gradient: 'from-amber-500 to-yellow-500' },
    { icon: Scroll, title: { ar: 'تعليم', en: 'Education' }, link: '/education', gradient: 'from-indigo-500 to-purple-500' },
    { icon: Bookmark, title: { ar: 'المحفوظات', en: 'Bookmarks' }, link: '/bookmarks', gradient: 'from-rose-500 to-pink-500' },
    { icon: MapPin, title: { ar: 'المساجد', en: 'Mosques' }, link: '/mosquelocator', gradient: 'from-violet-500 to-purple-500' },
    { icon: User, title: { ar: 'الحساب', en: 'Account' }, link: '/account', gradient: 'from-gray-500 to-slate-500' },
    { icon: SettingsIcon, title: { ar: 'الإعدادات', en: 'Settings' }, link: '/settings', gradient: 'from-zinc-500 to-gray-500' },
  ];

  const prayerIcons: Record<string, React.ReactNode> = {
    fajr: <Moon className="h-4 w-4 text-blue-400" />,
    dhuhr: <Sun className="h-4 w-4 text-amber-500" />,
    asr: <CloudSun className="h-4 w-4 text-orange-400" />,
    maghrib: <Sunset className="h-4 w-4 text-rose-400" />,
    isha: <Moon className="h-4 w-4 text-indigo-400" />,
  };

  const prayerList = homePrayerTimes ? [
    { name: settings.language === 'ar' ? 'الفجر' : 'Fajr', time: homePrayerTimes.Fajr, iconName: 'fajr' },
    { name: settings.language === 'ar' ? 'الظهر' : 'Dhuhr', time: homePrayerTimes.Dhuhr, iconName: 'dhuhr' },
    { name: settings.language === 'ar' ? 'العصر' : 'Asr', time: homePrayerTimes.Asr, iconName: 'asr' },
    { name: settings.language === 'ar' ? 'المغرب' : 'Maghrib', time: homePrayerTimes.Maghrib, iconName: 'maghrib' },
    { name: settings.language === 'ar' ? 'العشاء' : 'Isha', time: homePrayerTimes.Isha, iconName: 'isha' },
  ] : [];

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-8 overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-7 md:space-y-8">
        
        {/* Hero Section - Rich & Immersive */}
        <div className="relative pt-8 sm:pt-10 pb-4 sm:pb-6 animate-fade-in">
          {/* Layered background with Islamic pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none islamic-pattern-bg opacity-60" />
          
          {/* Warm gradient orbs */}
          <div className="absolute -top-12 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
          <div className="absolute -top-8 right-1/4 w-56 h-56 bg-islamic-gold/8 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-islamic-emerald/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center space-y-4 sm:space-y-5">
            {/* Bismillah Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full glass-card border-islamic-gold/20">
              <Star className="h-3.5 w-3.5 text-islamic-gold animate-glow-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold text-foreground/80 tracking-wider quran-font">
                بسم الله الرحمن الرحيم
              </span>
              <Star className="h-3.5 w-3.5 text-islamic-gold animate-glow-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Main Title */}
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight ios-26-style relative z-10 px-2">
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
              <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary/40 via-islamic-gold/30 to-primary/40 -z-10" />
            </div>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted-foreground font-light tracking-wide italic">
               {showRamadan
                ? (settings.language === 'ar' ? 'رمضان كريم' : 'Ramadan Kareem')
                : (settings.language === 'ar' ? 'اقرأ. تدبّر. تذكّر.' : 'Read. Reflect. Remember.')}
            </p>
          </div>
        </div>

        {/* Ramadan Banner */}
        {showRamadan && <RamadanBanner variant="home" />}

        {/* Prayer Times — refined mobile glass strip */}
        {!prayerTimesLoading && homePrayerTimes && (
          <Link to="/prayer" className="block animate-fade-in group" style={{ animationDelay: '100ms' }}>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-islamic-gold/8 to-primary/5 blur-xl opacity-70 group-hover:opacity-100 smooth-transition" aria-hidden="true" />
              <div className="relative glass-card rounded-2xl p-2 group-hover:border-primary/30 smooth-transition">
                <div className="flex gap-1 sm:gap-1.5">
                  {prayerList.map((p) => (
                    <div
                      key={p.name}
                      className="flex-1 min-w-0 rounded-xl p-2 sm:p-2.5 text-center smooth-transition hover:bg-primary/8"
                    >
                      <div className="flex justify-center mb-1">{prayerIcons[p.iconName]}</div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wider truncate">{p.name}</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground tabular-nums">{p.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Sign In Banner */}
        {!user && (
          <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <Link to="/auth">
              <div className="glass-card rounded-2xl p-4 hover:border-primary/30 smooth-transition group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center rich-shadow">
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
                  <Button size="sm" className="shrink-0 rounded-xl group-hover:scale-105 smooth-transition">
                    {settings.language === 'ar' ? 'ابدأ' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Quick Access Cards - Rich Depth */}
        {(surahOfDay || continueReading) && (
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '180ms' }}>
            <div className="flex items-center gap-3 px-1">
              <p className="section-label">
                {settings.language === 'ar' ? 'متابعة' : 'For You'}
              </p>
              <div className="ornate-divider flex-1" />
            </div>
            {surahOfDay && (
              <Link to={`/quran/${surahOfDay.number}`} className="block group animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="glass-card rounded-2xl p-4 hover:border-primary/30 smooth-transition relative overflow-hidden">
                  {/* Subtle decorative accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-gold/5 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-islamic-gold/20 to-islamic-gold/5 flex items-center justify-center border border-islamic-gold/20 group-hover:scale-105 smooth-transition">
                        <Sparkles className="h-5 w-5 text-islamic-gold" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-islamic-gold uppercase tracking-wider">
                          {settings.language === 'ar' ? 'آية اليوم' : 'Daily Ayah'}
                        </p>
                        <h3 className="text-sm font-bold leading-tight">
                          {settings.language === 'ar' ? surahOfDay.name : `${surahOfDay.englishName} (${surahOfDay.number}):1`}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 smooth-transition" />
                  </div>
                </div>
              </Link>
            )}

            {continueReading && (
              <Link to={`/quran/${continueReading.number}`} className="block group animate-fade-in" style={{ animationDelay: '250ms' }}>
                <div className="glass-card rounded-2xl p-4 hover:border-primary/30 smooth-transition relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-105 smooth-transition">
                        <Book className="h-5 w-5 text-primary" />
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 smooth-transition" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Quote of the Day - Immersive */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="relative overflow-hidden rounded-2xl glass-card p-7 islamic-pattern-bg">
            {/* Warm glow accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-islamic-gold/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/8 rounded-full blur-3xl" />
            
            <div className="relative space-y-4 text-center">
              {/* Ornamental divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
                <Star className="h-4 w-4 text-islamic-gold animate-glow-pulse" />
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
              </div>
              
              <p className={`text-lg md:text-xl font-semibold leading-relaxed ${settings.language === 'ar' ? 'arabic-regal text-2xl' : ''}`}>
                {settings.language === 'ar' ? quoteOfDay.ar : quoteOfDay.en}
              </p>
              
              <p className="text-xs text-muted-foreground font-medium tracking-wide">
                {formatReference(quoteOfDay.reference, settings.language)}
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
                <Star className="h-3 w-3 text-islamic-gold/40" />
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* App Grid - Rich Icons with depth */}
        <div className="animate-fade-in space-y-3" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center gap-3 px-1">
            <p className="section-label">
              {settings.language === 'ar' ? 'كل التطبيقات' : 'All Apps'}
            </p>
            <div className="ornate-divider flex-1" />
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4 pb-2">
            {appBoxes.map((app) => {
              const Icon = app.icon;
              return (
                <Link
                  key={app.link}
                  to={app.link}
                  className="flex flex-col items-center gap-2 group focus-ring rounded-xl py-1"
                  aria-label={app.title[settings.language]}
                >
                  {/* App icon with rich depth */}
                  <div className={`w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-[24%] bg-gradient-to-br ${app.gradient} flex items-center justify-center rich-shadow group-hover:scale-110 smooth-transition relative overflow-hidden group-active:scale-95`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-0 rounded-[24%] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]" aria-hidden="true" />
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10 drop-shadow-sm" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-center leading-tight w-full break-words px-0.5">
                    {app.title[settings.language]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats - Rich Glass Cards */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 px-1">
            <p className="section-label">
              {settings.language === 'ar' ? 'القرآن بالأرقام' : 'Quran in Numbers'}
            </p>
            <div className="ornate-divider flex-1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs' },
              { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses' },
              { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz' }
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center glass-card rounded-2xl p-4 hover:scale-[1.02] smooth-transition"
              >
                <div className="text-2xl font-bold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
