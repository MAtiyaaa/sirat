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
  Calculator,
  Clock,
  Sun,
  CloudSun,
  Sunset,
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';
import RamadanBanner, { isRamadan } from '@/components/RamadanBanner';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';

const getSurahOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return (dayOfYear % 114) + 1;
};

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
    <div className="min-h-[calc(100vh-8rem)] pb-8">
      <div className="w-full max-w-4xl mx-auto px-4 space-y-7">
        
        {/* Hero Section */}
        <div className="relative pt-12 pb-8 animate-fade-in">
          <div className="absolute inset-0 overflow-hidden pointer-events-none islamic-pattern-subtle opacity-50" />
          
          {/* Ambient gradient orbs */}
          <div className="absolute -top-16 left-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-glow-breathe" />
          <div className="absolute -top-10 right-1/4 w-64 h-64 bg-islamic-gold/5 rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-islamic-emerald/4 rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '3s' }} />

          <div className="relative text-center space-y-6">
            {/* Bismillah Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-card-elevated animate-text-reveal">
              <Star className="h-3.5 w-3.5 text-islamic-gold animate-glow-pulse" />
              <span className="text-xs font-semibold text-foreground/80 tracking-wider">
                بسم الله الرحمن الرحيم
              </span>
              <Star className="h-3.5 w-3.5 text-islamic-gold animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            {/* Main Title */}
            <div className="relative animate-text-reveal" style={{ animationDelay: '150ms' }}>
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
              <div className="absolute inset-0 blur-3xl opacity-12 bg-gradient-to-r from-primary/40 via-islamic-gold/25 to-primary/40 -z-10" />
            </div>
            
            {/* Subtitle */}
            <p className="text-base text-muted-foreground font-light tracking-wide animate-text-reveal" style={{ animationDelay: '300ms' }}>
               {showRamadan
                ? (settings.language === 'ar' ? 'رمضان كريم' : 'Ramadan Kareem')
                : (settings.language === 'ar' ? 'اقرأ. تدبّر. تذكّر.' : 'Read. Reflect. Remember.')}
            </p>
          </div>
        </div>

        {/* Ramadan Banner */}
        {showRamadan && <RamadanBanner variant="home" />}

        {/* Prayer Times Strip */}
        {!prayerTimesLoading && homePrayerTimes && (
          <Link to="/prayer" className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card-elevated rounded-2xl p-1.5 hover-lift hover:border-primary/20 smooth-transition">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {prayerList.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex-1 min-w-[64px] rounded-xl p-3 text-center smooth-transition hover:bg-primary/5 group"
                  >
                    <div className="flex justify-center mb-1.5 group-hover:scale-110 smooth-spring">{prayerIcons[p.iconName]}</div>
                    <p className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">{p.name}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 tabular-nums">{p.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        )}

        {/* Sign In Banner */}
        {!user && (
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <Link to="/auth">
              <div className="glass-card-elevated rounded-2xl p-5 hover:border-primary/30 smooth-transition group hover-lift">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center rich-shadow icon-badge group-hover:scale-105 smooth-spring">
                      <User className="h-5 w-5 text-primary-foreground relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-tight">
                        {settings.language === 'ar' ? 'سجّل الدخول' : 'Sign In'}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {settings.language === 'ar' 
                          ? 'احفظ تقدمك وإشاراتك المرجعية عبر جميع أجهزتك'
                          : 'Sync your progress and bookmarks across devices'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0 rounded-xl primary-glow group-hover:scale-105 smooth-spring font-semibold">
                    {settings.language === 'ar' ? 'ابدأ' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Quick Access Cards */}
        {(surahOfDay || continueReading) && (
          <div className="space-y-3">
            {surahOfDay && (
              <Link to={`/quran/${surahOfDay.number}`} className="block group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="glass-card-elevated rounded-2xl p-5 hover:border-islamic-gold/25 smooth-transition relative overflow-hidden hover-lift">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-islamic-gold/5 rounded-full blur-3xl group-hover:bg-islamic-gold/8 smooth-transition" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-islamic-gold/3 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-islamic-gold/20 to-islamic-gold/5 flex items-center justify-center border border-islamic-gold/20 group-hover:scale-110 smooth-spring group-hover:golden-glow">
                        <Sparkles className="h-5 w-5 text-islamic-gold" />
                      </div>
                      <div>
                        <p className="text-2xs font-bold text-islamic-gold uppercase tracking-widest">
                          {settings.language === 'ar' ? 'سورة اليوم' : 'Surah of the Day'}
                        </p>
                        <h3 className="text-base font-bold leading-tight mt-0.5">
                          {settings.language === 'ar' ? surahOfDay.name : surahOfDay.englishName}
                        </h3>
                        {!settings.language.startsWith('ar') && (
                          <p className="text-xs text-muted-foreground mt-0.5">{surahOfDay.englishNameTranslation}</p>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-islamic-gold/10 flex items-center justify-center group-hover:bg-islamic-gold/20 smooth-transition">
                      <ArrowRight className="h-4 w-4 text-islamic-gold group-hover:translate-x-0.5 smooth-transition" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {continueReading && (
              <Link to={`/quran/${continueReading.number}`} className="block group animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                <div className="glass-card-elevated rounded-2xl p-5 hover:border-primary/25 smooth-transition relative overflow-hidden hover-lift">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 smooth-transition" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 smooth-spring group-hover:primary-glow">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xs font-bold text-primary uppercase tracking-widest">
                          {settings.language === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}
                        </p>
                        <h3 className="text-base font-bold leading-tight mt-0.5">
                          {settings.language === 'ar' ? continueReading.name : continueReading.englishName}
                        </h3>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 smooth-transition">
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 smooth-transition" />
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Quote of the Day */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="relative overflow-hidden rounded-3xl glass-card-elevated p-8 islamic-pattern-subtle">
            <div className="absolute top-0 right-0 w-48 h-48 bg-islamic-gold/6 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/6 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-islamic-emerald/4 rounded-full blur-3xl" />
            
            <div className="relative space-y-5 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
                <Star className="h-4 w-4 text-islamic-gold animate-glow-pulse" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-islamic-gold/40 to-transparent" />
              </div>
              
              <p className={`text-lg md:text-xl font-semibold leading-relaxed ${settings.language === 'ar' ? 'arabic-regal text-2xl md:text-3xl' : ''}`}>
                {settings.language === 'ar' ? quoteOfDay.ar : quoteOfDay.en}
              </p>
              
              <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                {formatReference(quoteOfDay.reference, settings.language)}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-islamic-gold/30 to-transparent" />
                <Star className="h-3 w-3 text-islamic-gold/30" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-islamic-gold/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
          <div className="grid grid-cols-4 gap-5 pt-2 pb-4">
            {appBoxes.map((app, index) => {
              const Icon = app.icon;
              return (
                <Link
                  key={app.link}
                  to={app.link}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  <div className={`w-[60px] h-[60px] rounded-[26%] bg-gradient-to-br ${app.gradient} flex items-center justify-center rich-shadow icon-badge group-hover:scale-110 group-active:scale-95 smooth-spring`}>
                    <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight w-full truncate px-0.5">
                    {app.title[settings.language]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {[
            { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs', color: 'from-primary to-primary/70' },
            { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses', color: 'from-islamic-emerald to-islamic-emerald/70' },
            { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz', color: 'from-islamic-gold to-islamic-gold/70' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center glass-card-elevated rounded-2xl p-4 hover:scale-[1.03] smooth-spring group"
            >
              <div className={`text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1.5 group-hover:scale-105 smooth-spring`}>
                {stat.value}
              </div>
              <div className="text-2xs text-muted-foreground font-bold tracking-widest uppercase">
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
