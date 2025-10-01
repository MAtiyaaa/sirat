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
    en: 'At-Tawbah is the only surah that does not begin with Bismillah'
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
  },
  {
    ar: 'النبي محمد ﷺ ولد في مكة المكرمة عام 570 ميلادية',
    en: 'Prophet Muhammad (PBUH) was born in Makkah in 570 CE'
  },
  {
    ar: 'أول من آمن بالنبي محمد ﷺ كانت زوجته خديجة رضي الله عنها',
    en: 'The first person to believe in Prophet Muhammad (PBUH) was his wife Khadijah'
  },
  {
    ar: 'الإسراء والمعراج معجزة عظيمة حدثت في السنة العاشرة من البعثة',
    en: 'Isra and Miraj was a miraculous journey in the 10th year of Prophethood'
  },
  {
    ar: 'الصلوات الخمس فرضت ليلة الإسراء والمعراج',
    en: 'The five daily prayers were ordained during the Night Journey'
  },
  {
    ar: 'الكعبة المشرفة هي أول بيت وضع للناس',
    en: 'The Kaaba is the first house of worship established for mankind'
  },
  {
    ar: 'الحجر الأسود من حجارة الجنة',
    en: 'The Black Stone is from the stones of Paradise'
  },
  {
    ar: 'بئر زمزم ماء مبارك نبع منذ أكثر من 4000 سنة',
    en: 'Zamzam well is blessed water that has been flowing for over 4000 years'
  },
  {
    ar: 'الصيام في رمضان هو الركن الرابع من أركان الإسلام',
    en: 'Fasting in Ramadan is the fourth pillar of Islam'
  },
  {
    ar: 'ليلة القدر خير من ألف شهر',
    en: 'The Night of Decree is better than a thousand months'
  },
  {
    ar: 'الزكاة حق الفقراء والمساكين في مال الأغنياء',
    en: 'Zakat is the right of the poor and needy in the wealth of the rich'
  },
  {
    ar: 'الحج يمحو الذنوب ويجعل الإنسان كيوم ولدته أمه',
    en: 'Hajj erases sins and returns one to the purity of a newborn'
  },
  {
    ar: 'يوم عرفة أعظم أيام السنة وصيامه يكفر سنتين',
    en: 'The Day of Arafah is the greatest day of the year, fasting it expiates two years'
  },
  {
    ar: 'صلاة الجماعة تفضل صلاة الفذ بسبع وعشرين درجة',
    en: 'Congregational prayer is 27 times more rewarding than praying alone'
  },
  {
    ar: 'المسجد الأقصى هو أولى القبلتين وثالث الحرمين الشريفين',
    en: 'Al-Aqsa Mosque is the first of the two Qiblahs and the third holiest site'
  },
  {
    ar: 'المسجد النبوي في المدينة المنورة يحتوي على قبر النبي محمد ﷺ',
    en: 'The Prophet\'s Mosque in Madinah contains the grave of Prophet Muhammad (PBUH)'
  },
  {
    ar: 'الجنة تحت أقدام الأمهات',
    en: 'Paradise lies beneath the feet of mothers'
  },
  {
    ar: 'بر الوالدين من أعظم العبادات وأحبها إلى الله',
    en: 'Being dutiful to parents is among the greatest and most beloved acts to Allah'
  },
  {
    ar: 'الصدقة تطفئ الخطيئة كما يطفئ الماء النار',
    en: 'Charity extinguishes sin as water extinguishes fire'
  },
  {
    ar: 'الابتسامة في وجه أخيك صدقة',
    en: 'Smiling at your brother is charity'
  },
  {
    ar: 'أحب الأعمال إلى الله أدومها وإن قل',
    en: 'The most beloved deed to Allah is the most consistent, even if little'
  },
  {
    ar: 'الدعاء هو العبادة وسلاح المؤمن',
    en: 'Supplication is worship and the weapon of the believer'
  },
  {
    ar: 'ساعة الإجابة يوم الجمعة فيها يستجاب الدعاء',
    en: 'Friday has an hour when supplications are answered'
  },
  {
    ar: 'الثلث الأخير من الليل وقت استجابة الدعاء',
    en: 'The last third of the night is a time when supplications are answered'
  },
  {
    ar: 'صلاة الفجر في جماعة كمن قام الليل كله',
    en: 'Praying Fajr in congregation is like praying the whole night'
  },
  {
    ar: 'من صلى البردين دخل الجنة',
    en: 'Whoever prays the two cool prayers (Fajr and Asr) enters Paradise'
  },
  {
    ar: 'الصبر نصف الإيمان',
    en: 'Patience is half of faith'
  },
  {
    ar: 'التوكل على الله من أعظم العبادات',
    en: 'Reliance upon Allah is among the greatest acts of worship'
  },
  {
    ar: 'الشكر سبب لزيادة النعم',
    en: 'Gratitude is a cause for increase in blessings'
  },
  {
    ar: 'ذكر الله تطمئن به القلوب',
    en: 'By the remembrance of Allah, hearts find tranquility'
  },
  {
    ar: 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر خير من الدنيا وما فيها',
    en: 'Glorifying Allah is better than the world and what is in it'
  },
  {
    ar: 'الاستغفار سبب لنزول الرزق والبركة',
    en: 'Seeking forgiveness is a cause for provision and blessings'
  },
  {
    ar: 'من قال لا إله إلا الله دخل الجنة',
    en: 'Whoever says there is no god but Allah will enter Paradise'
  },
  {
    ar: 'أفضل الذكر لا إله إلا الله',
    en: 'The best remembrance is "There is no god but Allah"'
  },
  {
    ar: 'العلم فريضة على كل مسلم ومسلمة',
    en: 'Seeking knowledge is obligatory upon every Muslim'
  },
  {
    ar: 'من سلك طريقاً يلتمس فيه علماً سهل الله له طريقاً إلى الجنة',
    en: 'Whoever takes a path seeking knowledge, Allah makes easy a path to Paradise'
  },
  {
    ar: 'خيركم من تعلم القرآن وعلمه',
    en: 'The best among you are those who learn the Quran and teach it'
  },
  {
    ar: 'الجهاد في سبيل الله ذروة سنام الإسلام',
    en: 'Striving in the path of Allah is the peak of Islam'
  },
  {
    ar: 'المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف',
    en: 'The strong believer is better and more beloved to Allah than the weak believer'
  },
  {
    ar: 'حسن الخلق من أثقل ما يوضع في الميزان',
    en: 'Good character is the heaviest thing on the scales'
  },
  {
    ar: 'الكلمة الطيبة صدقة',
    en: 'A good word is charity'
  },
  {
    ar: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت',
    en: 'Whoever believes in Allah and the Last Day should speak good or remain silent'
  },
  {
    ar: 'لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر',
    en: 'No one with an atom\'s weight of pride in their heart will enter Paradise'
  },
  {
    ar: 'التواضع من صفات المؤمنين',
    en: 'Humility is among the characteristics of believers'
  },
  {
    ar: 'الحياء من الإيمان',
    en: 'Modesty is part of faith'
  },
  {
    ar: 'المسلم من سلم المسلمون من لسانه ويده',
    en: 'A Muslim is one from whose tongue and hand Muslims are safe'
  },
  {
    ar: 'الإيمان بضع وسبعون شعبة',
    en: 'Faith has seventy-odd branches'
  },
  {
    ar: 'أكمل المؤمنين إيماناً أحسنهم خلقاً',
    en: 'The most perfect believers in faith are those with the best character'
  },
  {
    ar: 'الجار له حق عظيم في الإسلام',
    en: 'The neighbor has great rights in Islam'
  },
  {
    ar: 'صلة الرحم تزيد في العمر وتبارك في الرزق',
    en: 'Maintaining family ties increases lifespan and blesses provision'
  },
  {
    ar: 'العدل أساس الملك',
    en: 'Justice is the foundation of governance'
  },
  {
    ar: 'الإسلام دين الرحمة والسلام',
    en: 'Islam is the religion of mercy and peace'
  },
  {
    ar: 'المؤمنون كالجسد الواحد',
    en: 'The believers are like one body'
  },
  {
    ar: 'التعاون على البر والتقوى من أعظم القربات',
    en: 'Cooperating in righteousness and piety is among the greatest acts'
  },
  {
    ar: 'النظافة من الإيمان',
    en: 'Cleanliness is part of faith'
  },
  {
    ar: 'الوضوء يمحو الخطايا',
    en: 'Ablution washes away sins'
  },
  {
    ar: 'السواك مطهرة للفم ومرضاة للرب',
    en: 'The miswak cleanses the mouth and pleases the Lord'
  },
  {
    ar: 'الطهارة شطر الإيمان',
    en: 'Purity is half of faith'
  }
];

export const IslamicFactsLoader = () => {
  const { settings } = useSettings();
  const [currentFact, setCurrentFact] = useState(() => {
    // Start with a random fact
    const randomIndex = Math.floor(Math.random() * islamicFacts.length);
    return islamicFacts[randomIndex];
  });

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
