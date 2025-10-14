import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Book, MessageSquare, Sparkles, BookMarked, Hand, CircleDot, Scroll,
  Bookmark, User, MapPin, Settings as SettingsIcon, Moon, Calculator
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';

// Helpers -------------------------------------------------
const getSurahOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return (dayOfYear % 114) + 1;
};

const toArabicNumerals = (input: string) => input.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

const surahNameMap: Record<string, string> = {
  "Ash-Sharh": "الشرح", "Hud": "هود", "Al-Baqarah": "البقرة", "At-Talaq": "الطلاق",
  "Ali 'Imran": "آل عمران", "Ta-Ha": "طه", "Ar-Ra'd": "الرعد", "Al-Hadid": "الحديد",
  "Yusuf": "يوسف", "An-Nur": "النور", "Al-An'am": "الأنعام", "Al-A'raf": "الأعراف",
  "An-Nisa": "النساء", "Adh-Dhariyat": "الذاريات", "Al-Qasas": "القصص", "Al-Hajj": "الحج",
};

const formatReference = (reference: string, language: 'ar' | 'en') => {
  if (language === 'en') return reference;
  const m = reference.match(/^\s*(.*?)\s*\((\d+)\):(\d+)\s*$/);
  if (m) {
    const [, name, sn, an] = m;
    const arabicName = surahNameMap[name.trim()] || name.trim();
    return `سورة ${arabicName} (${toArabicNumerals(sn)}):${toArabicNumerals(an)}`;
  }
  return toArabicNumerals(reference);
};

// Quotes --------------------------------------------------
const islamicQuotes = [
  { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease", reference: "Ash-Sharh (94):6" },
  { ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", en: "Be patient, for Allah does not allow the reward of good-doers to be lost", reference: "Hud (11):115" },
  { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "Remember Me; I will remember you", reference: "Al-Baqarah (2):152" },
  { ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", en: "Whoever relies upon Allah - then He is sufficient for him", reference: "At-Talaq (65):3" },
  { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient", reference: "Al-Baqarah (2):153" },
  { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", en: "Our Lord, give us good in this world and good in the Hereafter", reference: "Al-Baqarah (2):201" },
  { ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا", en: "My Lord, increase me in knowledge", reference: "Ta-Ha (20):114" },
  { ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", en: "Allah does not burden a soul beyond that it can bear", reference: "Al-Baqarah (2):286" },
  { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Surely, by the remembrance of Allah hearts find rest", reference: "Ar-Ra'd (13):28" },
  { ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", en: "Allah is the Light of the heavens and the earth", reference: "An-Nur (24):35" },
];

const getQuoteOfTheDay = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return islamicQuotes[dayOfYear % islamicQuotes.length];
};

// Component ----------------------------------------------
const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = useState<any>(null);
  const [surahOfDay, setSurahOfDay] = useState<any>(null);
  const [continueReading, setContinueReading] = useState<any>(null);
  const quoteOfDay = useMemo(getQuoteOfTheDay, []);
  const ar = settings.language === 'ar';

  // Subtle starfield (no deps)
  const starsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = starsRef.current;
    if (!el) return;
    const N = 52; const frag = document.createDocumentFragment();
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'absolute w-[2px] h-[2px] rounded-full bg-white/40';
      d.style.left = Math.random() * 100 + '%';
      d.style.top = Math.random() * 100 + '%';
      d.style.opacity = String(0.25 + Math.random() * 0.5);
      d.style.animation = `floatStar ${5 + Math.random() * 6}s ease-in-out ${Math.random() * 3}s infinite`;
      frag.appendChild(d);
    }
    el.appendChild(frag);
    return () => { el.innerHTML = ''; };
  }, []);

  // Data: Surah of Day
  useEffect(() => {
    const run = async () => {
      const surahNumber = getSurahOfTheDay();
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await res.json();
        if (data?.code === 200) {
          setSurahOfDay({
            number: data.data.number,
            name: data.data.name,
            englishName: data.data.englishName,
            englishNameTranslation: data.data.englishNameTranslation,
            numberOfAyahs: data.data.numberOfAyahs,
          });
        }
      } catch (e) { console.error(e); }
    };
    run();
  }, []);

  // Auth + continue reading
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: lastViewed } = await supabase
        .from('last_viewed_surah')
        .select('surah_number')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!lastViewed?.surah_number) return;

      const { data: progress } = await supabase
        .from('reading_progress')
        .select('ayah_number')
        .eq('user_id', session.user.id)
        .eq('surah_number', lastViewed.surah_number)
        .maybeSingle();

      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${lastViewed.surah_number}`);
        const data = await res.json();
        if (data?.code === 200) {
          setContinueReading({
            number: data.data.number,
            name: data.data.name,
            englishName: data.data.englishName,
            englishNameTranslation: data.data.englishNameTranslation,
            numberOfAyahs: data.data.numberOfAyahs,
            ayahNumber: progress?.ayah_number || 1,
          });
        }
      } catch (e) { console.error(e); }
    };
    load();
  }, [user]);

  const appBoxes = [
    { icon: Book,          title: { ar: 'القرآن',     en: 'Quran' },     link: '/quran',          gradient: 'from-blue-500 to-cyan-500' },
    { icon: MessageSquare, title: { ar: 'قلم',        en: 'Qalam' },     link: '/qalam',          gradient: 'from-purple-500 to-pink-500' },
    { icon: BookMarked,    title: { ar: 'الأحاديث',   en: 'Hadith' },    link: '/hadith',         gradient: 'from-green-500 to-emerald-500' },
    { icon: Hand,          title: { ar: 'الأدعية',    en: 'Duas' },      link: '/duas',           gradient: 'from-orange-500 to-amber-500' },
    { icon: CircleDot,     title: { ar: 'التسبيح',    en: 'Tasbih' },    link: '/tasbih',         gradient: 'from-teal-500 to-cyan-500' },
    { icon: Moon,          title: { ar: 'الصلاة',     en: 'Prayer' },    link: '/prayer',         gradient: 'from-sky-500 to-blue-500' },
    { icon: Calculator,    title: { ar: 'الزكاة',     en: 'Zakat' },     link: '/zakat',          gradient: 'from-amber-500 to-yellow-500' },
    { icon: Scroll,        title: { ar: 'تعليم',      en: 'Education' }, link: '/education',      gradient: 'from-indigo-500 to-purple-500' },
    { icon: Bookmark,      title: { ar: 'المحفوظات',  en: 'Bookmarks' }, link: '/bookmarks',      gradient: 'from-rose-500 to-pink-500' },
    { icon: MapPin,        title: { ar: 'المساجد',    en: 'Mosques' },   link: '/mosquelocator',  gradient: 'from-violet-500 to-purple-500' },
    { icon: User,          title: { ar: 'الحساب',     en: 'Account' },   link: '/account',        gradient: 'from-gray-500 to-slate-500' },
    { icon: SettingsIcon,  title: { ar: 'الإعدادات',  en: 'Settings' },  link: '/settings',       gradient: 'from-zinc-500 to-gray-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-10">
      {/* Local styles: float animation */}
      <style>{`
        @keyframes floatStar { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
      `}</style>

      {/* Aurora header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="pointer-events-none absolute inset-x-0 -top-1/3 h-[58vh] blur-3xl opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_48%_35%,rgba(14,165,233,0.35),rgba(14,165,233,0)_60%)] animate-[pulse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_52%_45%,rgba(16,185,129,0.35),rgba(16,185,129,0)_60%)] animate-[pulse_14s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-0 bg-[radial-gradient(32%_45%_at_50%_40%,rgba(99,102,241,0.25),rgba(99,102,241,0)_60%)] animate-[pulse_18s_ease-in-out_infinite]" />
        </div>
        <div ref={starsRef} className="pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-10 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary">{ar ? 'بسم الله الرحمن الرحيم' : 'Bismillah ar-Rahman ar-Raheem'}</span>
          </div>

          {/* Title */}
          <h1
            className="mt-4 font-black leading-none bg-clip-text text-transparent
                       bg-gradient-to-br from-primary via-emerald-400 to-cyan-400"
            style={{ fontSize: 'clamp(40px, 12vw, 112px)', letterSpacing: '-0.04em' }}
          >
            {ar ? 'صراط' : 'Sirat'}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {ar ? 'اقرأ. تدبّر. تذكّر.' : 'Read. Reflect. Remember.'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-5xl px-4 space-y-10">
        {/* Daily widgets */}
        {(surahOfDay || continueReading) && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surahOfDay && (
              <Link to={`/quran/${surahOfDay.number}`} className="group">
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-background/60 p-5 backdrop-blur-xl neomorph hover:neomorph-inset smooth-transition">
                  <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {ar ? 'سورة اليوم' : 'Surah of the Day'}
                      </div>
                      <div className="truncate font-semibold">
                        {ar ? surahOfDay.name : surahOfDay.englishName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {ar
                          ? `عدد الآيات: ${toArabicNumerals(String(surahOfDay.numberOfAyahs))}`
                          : `Ayahs: ${surahOfDay.numberOfAyahs}`}
                      </div>
                    </div>
                    <div className="ml-auto text-xl font-bold text-primary/40">{surahOfDay.number}</div>
                  </div>
                </div>
              </Link>
            )}

            {continueReading && (
              <Link to={`/quran/${continueReading.number}`} className="group">
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-background/60 p-5 backdrop-blur-xl neomorph hover:neomorph-inset smooth-transition">
                  <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-blue-500/15 blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow">
                      <Book className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                        {ar ? 'متابعة القراءة' : 'Continue Reading'}
                      </div>
                      <div className="truncate font-semibold">
                        {ar ? continueReading.name : continueReading.englishName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {ar
                          ? `الآية ${toArabicNumerals(String(continueReading.ayahNumber))} من ${toArabicNumerals(String(continueReading.numberOfAyahs))}`
                          : `Ayah ${continueReading.ayahNumber} of ${continueReading.numberOfAyahs}`}
                      </div>
                    </div>
                    <div className="ml-auto text-xl font-bold text-blue-500/40">{continueReading.number}</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Quote */}
        <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-7 backdrop-blur-xl">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

          <div className="relative text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30" />
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
            <p dir={ar ? 'rtl' : 'ltr'} className={`text-lg md:text-xl font-semibold leading-relaxed ${ar ? 'quran-font' : ''}`}>
              {ar ? quoteOfDay.ar : quoteOfDay.en}
            </p>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              {ar ? formatReference(quoteOfDay.reference, 'ar') : formatReference(quoteOfDay.reference, 'en')}
            </p>
          </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-6 md:grid-cols-6">
          {appBoxes.map((app, i) => {
            const Icon = app.icon;
            return (
              <Link key={app.link} to={app.link} className="group flex flex-col items-center gap-2">
                <div className={`relative w-16 h-16 rounded-[22%] bg-gradient-to-br ${app.gradient}
                                 shadow-lg group-hover:scale-110 group-active:scale-95 smooth-transition flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <Icon className="relative z-10 h-7 w-7 text-white drop-shadow" strokeWidth={2.4} />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight w-full truncate">
                  {app.title[ar ? 'ar' : 'en']}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: ar ? toArabicNumerals('114') : '114', label: ar ? 'سورة' : 'Surahs' },
            { value: ar ? toArabicNumerals('6236') : '6,236', label: ar ? 'آية' : 'Verses' },
            { value: ar ? toArabicNumerals('30') : '30', label: ar ? 'جزء' : 'Juz' }
          ].map((s, i) => (
            <div key={i} className="text-center rounded-2xl p-3 border border-border/20 bg-background/60 backdrop-blur-xl hover:border-border/40 smooth-transition">
              <div className="mb-0.5 bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-primary/70 text-2xl font-bold">
                {s.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
