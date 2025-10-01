import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface IslamicFact {
  ar: string;
  en: string;
}

const islamicFacts: IslamicFact[] = [
  {
    ar: 'القرآن الكريم يحتوي على 114 سورة و 6,236 آية',
    en: 'The Quran contains 114 surahs and 6,236 verses'
  },
  {
    ar: 'أطول سورة في القرآن هي سورة البقرة بـ 286 آية',
    en: 'The longest surah is Al-Baqarah with 286 verses'
  },
  {
    ar: 'أقصر سورة في القرآن هي سورة الكوثر بـ 3 آيات',
    en: 'The shortest surah is Al-Kawthar with 3 verses'
  },
  {
    ar: 'نزل القرآن الكريم على مدى 23 عاماً',
    en: 'The Quran was revealed over 23 years'
  },
  {
    ar: 'كلمة "الله" تتكرر 2,699 مرة في القرآن',
    en: 'The word "Allah" appears 2,699 times in the Quran'
  },
  {
    ar: 'السورة الوحيدة التي لا تبدأ بالبسملة هي سورة التوبة',
    en: 'At-Tawbah is the only surah that doesn\'t begin with Bismillah'
  },
  {
    ar: 'القرآن يذكر 25 نبياً ورسولاً',
    en: 'The Quran mentions 25 prophets and messengers'
  },
  {
    ar: 'سورة الفاتحة تسمى بـ "أم الكتاب" و "السبع المثاني"',
    en: 'Al-Fatihah is called "The Mother of the Book" and "The Seven Oft-Repeated"'
  },
  {
    ar: 'أول ما نزل من القرآن كان "اقرأ باسم ربك الذي خلق"',
    en: 'The first revelation was "Read in the name of your Lord who created"'
  },
  {
    ar: 'سورة الإخلاص تعدل ثلث القرآن',
    en: 'Surah Al-Ikhlas is equivalent to one-third of the Quran'
  },
  {
    ar: 'القرآن الكريم محفوظ من التحريف والتغيير',
    en: 'The Quran is preserved from any alteration or change'
  },
  {
    ar: 'تلاوة آية الكرسي بعد كل صلاة من أسباب دخول الجنة',
    en: 'Reciting Ayat Al-Kursi after each prayer is a means of entering Paradise'
  },
  {
    ar: 'سورة الكهف يستحب قراءتها يوم الجمعة',
    en: 'It is recommended to recite Surah Al-Kahf on Fridays'
  },
  {
    ar: 'القرآن الكريم يحتوي على 30 جزءاً',
    en: 'The Quran is divided into 30 Juz (parts)'
  },
  {
    ar: 'أول سورة نزلت كاملة هي سورة الفاتحة',
    en: 'The first complete surah revealed was Al-Fatihah'
  },
  {
    ar: 'آخر سورة نزلت كاملة هي سورة النصر',
    en: 'The last complete surah revealed was An-Nasr'
  },
  {
    ar: 'سورة يس تسمى "قلب القرآن"',
    en: 'Surah Yasin is called "The Heart of the Quran"'
  },
  {
    ar: 'القرآن نزل في شهر رمضان المبارك',
    en: 'The Quran was first revealed in the blessed month of Ramadan'
  },
  {
    ar: 'تلاوة القرآن الكريم عبادة عظيمة لها أجر كبير',
    en: 'Reciting the Quran is a great act of worship with immense reward'
  },
  {
    ar: 'كل حرف من القرآن بحسنة والحسنة بعشر أمثالها',
    en: 'Every letter of the Quran brings ten rewards'
  }
];

export const IslamicFactsLoader = () => {
  const { settings } = useSettings();
  const [currentFact, setCurrentFact] = useState(islamicFacts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * islamicFacts.length);
      setCurrentFact(islamicFacts[randomIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      
      <div className="max-w-2xl text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wide uppercase">
            {settings.language === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
          </span>
        </div>
        
        <p className={`text-lg md:text-xl text-foreground/90 leading-relaxed ${
          settings.language === 'ar' ? 'font-arabic' : ''
        }`}>
          {settings.language === 'ar' ? currentFact.ar : currentFact.en}
        </p>
      </div>
    </div>
  );
};
