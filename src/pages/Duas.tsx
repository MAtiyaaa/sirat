import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Heart, Sun, Moon, Utensils, Home, Shield, ArrowRight, CircleDot, Plane, BookOpen, Sparkles, CloudRain, Users, Bed, BedDouble, Droplet } from 'lucide-react';
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
      icon: Bed,
      titleAr: 'دعاء الاستيقاظ',
      titleEn: 'Upon Waking',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
      translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection'
    },
    {
      id: 4,
      icon: BedDouble,
      titleAr: 'دعاء النوم',
      titleEn: 'Before Sleep',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika Allahumma amutu wa ahya',
      translation: 'In Your name O Allah, I die and I live'
    },
    {
      id: 5,
      icon: Utensils,
      titleAr: 'دعاء قبل الطعام',
      titleEn: 'Before Eating',
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa ala barakatillah',
      translation: 'In the name of Allah and with the blessings of Allah'
    },
    {
      id: 6,
      icon: Heart,
      titleAr: 'دعاء بعد الطعام',
      titleEn: 'After Eating',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
      translation: 'All praise is due to Allah who has fed us and given us drink and made us Muslims'
    },
    {
      id: 7,
      icon: Droplet,
      titleAr: 'دعاء بعد الوضوء',
      titleEn: 'After Wudu',
      arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: 'Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan \'abduhu wa rasuluh',
      translation: 'I bear witness that none has the right to be worshipped except Allah, alone without partner, and I bear witness that Muhammad is His slave and Messenger'
    },
    {
      id: 8,
      icon: Home,
      titleAr: 'دعاء دخول المنزل',
      titleEn: 'Entering Home',
      arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
      transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi rabbina tawakkalna',
      translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust'
    },
    {
      id: 9,
      icon: Plane,
      titleAr: 'دعاء السفر',
      titleEn: 'Travel Dua',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
      transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun',
      translation: 'Glory is to Him Who has subjected this to us, and we could never have it by our efforts. Surely, unto our Lord we are returning'
    },
    {
      id: 10,
      icon: Shield,
      titleAr: 'دعاء الحفظ',
      titleEn: 'Protection Dua',
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
      translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created'
    },
    {
      id: 11,
      icon: BookOpen,
      titleAr: 'دعاء طلب العلم',
      titleEn: 'Seeking Knowledge',
      arabic: 'رَبِّ زِدْنِي عِلْمًا',
      transliteration: 'Rabbi zidni \'ilma',
      translation: 'My Lord, increase me in knowledge'
    },
    {
      id: 12,
      icon: Sparkles,
      titleAr: 'دعاء الاستغفار',
      titleEn: 'Seeking Forgiveness',
      arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
      transliteration: 'Astaghfirullaha al-\'Azeem alladhi la ilaha illa Huwal-Hayyul-Qayyum wa atubu ilayh',
      translation: 'I seek forgiveness from Allah the Mighty, Whom there is none worthy of worship except Him, The Living, The Eternal, and I repent to Him'
    },
    {
      id: 13,
      icon: Users,
      titleAr: 'دعاء للوالدين',
      titleEn: 'For Parents',
      arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: 'Rabbir-hamhuma kama rabbayani saghira',
      translation: 'My Lord, have mercy upon them as they brought me up when I was small'
    },
    {
      id: 14,
      icon: CloudRain,
      titleAr: 'دعاء المطر',
      titleEn: 'When it Rains',
      arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
      transliteration: 'Allahumma sayyiban nafi\'a',
      translation: 'O Allah, let it be a beneficial rain'
    },
    {
      id: 15,
      icon: Sparkles,
      titleAr: 'دعاء الاستخارة',
      titleEn: 'Istikhara (Seeking Guidance)',
      arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ',
      transliteration: 'Allahumma inni astakhiruka bi\'ilmika, wa astaqdiruka biqudratika, wa as\'aluka min fadlikal-\'azim, fa innaka taqdiru wa la aqdir, wa ta\'lamu wa la a\'lam, wa anta \'allamul-ghuyub',
      translation: 'O Allah, I seek Your guidance through Your knowledge, and I seek ability through Your power, and I ask You of Your great bounty. You have power; I have none. And You know; I know not. You are the Knower of hidden things'
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
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent text-center pt-8">
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
