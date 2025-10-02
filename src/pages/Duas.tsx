import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Heart, Sun, Moon, Utensils, Home, Shield, ArrowRight, CircleDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Dua {
  id: number;
  icon: any;
  titleAr: string;
  titleEn: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

const Duas = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const duas: Dua[] = [
    {
      id: 1,
      icon: Sun,
      titleAr: 'دعاء الصباح',
      titleEn: 'Morning Dua',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
      transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah',
      translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah'
    },
    {
      id: 2,
      icon: Moon,
      titleAr: 'دعاء المساء',
      titleEn: 'Evening Dua',
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
      transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah',
      translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah'
    },
    {
      id: 3,
      icon: Utensils,
      titleAr: 'دعاء قبل الطعام',
      titleEn: 'Before Eating',
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa ala barakatillah',
      translation: 'In the name of Allah and with the blessings of Allah'
    },
    {
      id: 4,
      icon: Heart,
      titleAr: 'دعاء بعد الطعام',
      titleEn: 'After Eating',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
      translation: 'All praise is due to Allah who has fed us and given us drink and made us Muslims'
    },
    {
      id: 5,
      icon: Home,
      titleAr: 'دعاء دخول المنزل',
      titleEn: 'Entering Home',
      arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
      transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi rabbina tawakkalna',
      translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust'
    },
    {
      id: 6,
      icon: Shield,
      titleAr: 'دعاء الحفظ',
      titleEn: 'Protection Dua',
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
      translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created'
    }
  ];

  const dhikr = [
    {
      id: 1,
      arabic: 'سُبْحَانَ اللَّهِ',
      transliteration: 'SubhanAllah',
      translation: 'Glory be to Allah',
      count: 33
    },
    {
      id: 2,
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      translation: 'All praise is due to Allah',
      count: 33
    },
    {
      id: 3,
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      translation: 'Allah is the Greatest',
      count: 34
    },
    {
      id: 4,
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
      transliteration: 'La ilaha illallah',
      translation: 'There is no god but Allah',
      count: 100
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'الأدعية والأذكار' : 'Daily Duas & Dhikr'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar' 
            ? 'أدعية وأذكار يومية من السنة النبوية'
            : 'Daily supplications and remembrance from the Sunnah'}
        </p>
      </div>

      {/* Daily Duas */}
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          {settings.language === 'ar' ? 'الأدعية اليومية' : 'Daily Duas'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {duas.map((dua) => {
            const Icon = dua.icon;
            return (
              <div key={dua.id} className="glass-effect rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {settings.language === 'ar' ? dua.titleAr : dua.titleEn}
                  </h3>
                </div>
                
                <p className={`text-xl leading-relaxed ${settings.fontType === 'quran' ? 'font-quran' : ''}`} dir="rtl">
                  {dua.arabic}
                </p>
                
                {settings.translationEnabled && settings.translationSource === 'transliteration' && (
                  <p className="text-sm text-muted-foreground italic">
                    {dua.transliteration}
                  </p>
                )}
                
                {settings.translationEnabled && settings.translationSource !== 'transliteration' && (
                  <p className="text-sm text-muted-foreground">
                    {dua.translation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dhikr Counter */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {settings.language === 'ar' ? 'الأذكار' : 'Dhikr'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dhikr.map((item) => (
            <div key={item.id} className="glass-effect rounded-2xl p-6 text-center space-y-3">
              <p className={`text-2xl font-bold ${settings.fontType === 'quran' ? 'font-quran' : ''}`} dir="rtl">
                {item.arabic}
              </p>
              
              {settings.translationEnabled && settings.translationSource === 'transliteration' && (
                <p className="text-sm text-muted-foreground italic">
                  {item.transliteration}
                </p>
              )}
              
              {settings.translationEnabled && settings.translationSource !== 'transliteration' && (
                <p className="text-xs text-muted-foreground">
                  {item.translation}
                </p>
              )}
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                {item.count}×
              </div>
            </div>
          ))}
        </div>
        
        {/* Track Dhikr Card */}
        <div 
          onClick={() => navigate('/tasbih')}
          className="relative overflow-hidden glass-effect rounded-2xl p-8 cursor-pointer hover:scale-[1.02] smooth-transition group border border-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 smooth-transition" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <CircleDot className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  {settings.language === 'ar' ? 'تتبعها' : 'Track Them'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'التسبيح الرقمي' : 'Digital Tasbih Counter'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 smooth-transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Duas;
