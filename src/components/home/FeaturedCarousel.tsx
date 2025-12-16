import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Book, Quote, Hand, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface FeaturedCarouselProps {
  surahOfDay: {
    number: number;
    name: string;
    englishName: string;
  } | null;
  continueReading: {
    number: number;
    name: string;
    englishName: string;
    ayahNumber: number;
    numberOfAyahs: number;
  } | null;
  quoteOfDay: {
    ar: string;
    en: string;
    reference: string;
  };
}

// Map transliterated Surah names to Arabic
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

const toArabicNumerals = (input: string) => input.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

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
  return toArabicNumerals(reference);
};

// Featured Duas for rotation
const featuredDuas = [
  { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي', en: 'My Lord, expand for me my chest', title: { ar: 'دعاء شرح الصدر', en: 'Ease & Relief' } },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', en: 'Our Lord, give us good in this world', title: { ar: 'دعاء الدنيا والآخرة', en: 'Good in Both Worlds' } },
  { ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ', en: 'O Allah, I ask You for wellbeing', title: { ar: 'دعاء العافية', en: 'Wellbeing' } },
];

const FeaturedCarousel = ({ surahOfDay, continueReading, quoteOfDay }: FeaturedCarouselProps) => {
  const { settings } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const dailyDua = featuredDuas[new Date().getDate() % featuredDuas.length];

  const cards = [
    // Surah of the Day
    surahOfDay && {
      id: 'surah',
      link: `/quran/${surahOfDay.number}`,
      gradient: 'from-primary to-primary/70',
      icon: Sparkles,
      label: settings.language === 'ar' ? 'سورة اليوم' : "Today's Surah",
      title: settings.language === 'ar' ? surahOfDay.name : surahOfDay.englishName,
      subtitle: settings.language === 'ar' ? `سورة ${surahOfDay.number}` : `Surah ${surahOfDay.number}`,
    },
    // Continue Reading
    continueReading && {
      id: 'continue',
      link: `/quran/${continueReading.number}`,
      gradient: 'from-blue-500 to-cyan-500',
      icon: Book,
      label: settings.language === 'ar' ? 'متابعة القراءة' : 'Continue Reading',
      title: settings.language === 'ar' ? continueReading.name : continueReading.englishName,
      subtitle: settings.language === 'ar' 
        ? `الآية ${continueReading.ayahNumber} من ${continueReading.numberOfAyahs}`
        : `Ayah ${continueReading.ayahNumber} of ${continueReading.numberOfAyahs}`,
      progress: Math.round((continueReading.ayahNumber / continueReading.numberOfAyahs) * 100),
    },
    // Quote of the Day
    {
      id: 'quote',
      gradient: 'from-purple-500 to-pink-500',
      icon: Quote,
      label: settings.language === 'ar' ? 'آية اليوم' : 'Daily Verse',
      title: settings.language === 'ar' ? quoteOfDay.ar : quoteOfDay.en,
      subtitle: formatReference(quoteOfDay.reference, settings.language),
      isQuote: true,
    },
    // Featured Dua
    {
      id: 'dua',
      link: '/duas',
      gradient: 'from-orange-500 to-amber-500',
      icon: Hand,
      label: settings.language === 'ar' ? 'دعاء اليوم' : "Today's Dua",
      title: dailyDua.title[settings.language],
      subtitle: settings.language === 'ar' ? dailyDua.ar : dailyDua.en,
    },
  ].filter(Boolean);

  return (
    <div className="relative -mx-4">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 smooth-transition shadow-lg"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 smooth-transition shadow-lg"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card: any) => {
          const Icon = card.icon;
          const content = (
            <div className="min-w-[260px] max-w-[260px] glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition snap-start group relative overflow-hidden">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 smooth-transition`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {card.label}
                  </span>
                </div>
                
                <h3 className={`font-bold mb-1 leading-tight ${card.isQuote ? 'text-sm line-clamp-2' : 'text-base'} ${settings.language === 'ar' && !card.isQuote ? 'arabic-regal' : ''}`}>
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{card.subtitle}</p>
                
                {/* Progress bar for continue reading */}
                {card.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${card.gradient} rounded-full smooth-transition`}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{card.progress}% {settings.language === 'ar' ? 'مكتمل' : 'complete'}</p>
                  </div>
                )}
              </div>
            </div>
          );

          return card.link ? (
            <Link key={card.id} to={card.link} className="block">
              {content}
            </Link>
          ) : (
            <div key={card.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
