import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NamesOfAllah = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'أسماء الله الحسنى' : '99 Names of Allah',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'الأسماء الحسنى التسعة والتسعون لله تعالى'
      : 'The 99 Beautiful Names of Allah',
  };

  const names = [
    { ar: 'الرَّحْمَن', en: 'Ar-Rahman', meaning: 'The Most Merciful' },
    { ar: 'الرَّحِيم', en: 'Ar-Raheem', meaning: 'The Bestower of Mercy' },
    { ar: 'الْمَلِك', en: 'Al-Malik', meaning: 'The King' },
    { ar: 'الْقُدُّوس', en: 'Al-Quddus', meaning: 'The Most Holy' },
    { ar: 'السَّلاَم', en: 'As-Salam', meaning: 'The Source of Peace' },
    { ar: 'الْمُؤْمِن', en: 'Al-Mu\'min', meaning: 'The Granter of Security' },
    { ar: 'الْمُهَيْمِن', en: 'Al-Muhaymin', meaning: 'The Controller' },
    { ar: 'الْعَزِيز', en: 'Al-Aziz', meaning: 'The Almighty' },
    { ar: 'الْجَبَّار', en: 'Al-Jabbar', meaning: 'The Compeller' },
    { ar: 'الْمُتَكَبِّر', en: 'Al-Mutakabbir', meaning: 'The Supreme' },
    { ar: 'الْخَالِق', en: 'Al-Khaliq', meaning: 'The Creator' },
    { ar: 'الْبَارِئ', en: 'Al-Bari', meaning: 'The Maker' },
    { ar: 'الْمُصَوِّر', en: 'Al-Musawwir', meaning: 'The Fashioner' },
    { ar: 'الْغَفَّار', en: 'Al-Ghaffar', meaning: 'The Repeatedly Forgiving' },
    { ar: 'الْقَهَّار', en: 'Al-Qahhar', meaning: 'The Subduer' },
    { ar: 'الْوَهَّاب', en: 'Al-Wahhab', meaning: 'The Bestower' },
    { ar: 'الرَّزَّاق', en: 'Ar-Razzaq', meaning: 'The Provider' },
    { ar: 'الْفَتَّاح', en: 'Al-Fattah', meaning: 'The Opener' },
    { ar: 'اَلْعَلِيْم', en: 'Al-Alim', meaning: 'The All-Knowing' },
    { ar: 'الْقَابِض', en: 'Al-Qabid', meaning: 'The Withholder' },
    { ar: 'الْبَاسِط', en: 'Al-Basit', meaning: 'The Extender' },
    { ar: 'الْخَافِض', en: 'Al-Khafid', meaning: 'The Reducer' },
    { ar: 'الرَّافِع', en: 'Ar-Rafi', meaning: 'The Exalter' },
    { ar: 'الْمُعِز', en: 'Al-Mu\'izz', meaning: 'The Honorer' },
    { ar: 'المُذِل', en: 'Al-Mudhill', meaning: 'The Humiliator' },
    { ar: 'السَّمِيع', en: 'As-Sami', meaning: 'The All-Hearing' },
    { ar: 'الْبَصِير', en: 'Al-Basir', meaning: 'The All-Seeing' },
    { ar: 'الْحَكَم', en: 'Al-Hakam', meaning: 'The Judge' },
    { ar: 'الْعَدْل', en: 'Al-Adl', meaning: 'The Just' },
    { ar: 'اللَّطِيف', en: 'Al-Latif', meaning: 'The Subtle One' },
    { ar: 'الْخَبِير', en: 'Al-Khabir', meaning: 'The All-Aware' },
    { ar: 'الْحَلِيم', en: 'Al-Halim', meaning: 'The Forbearing' },
    { ar: 'الْعَظِيم', en: 'Al-Azim', meaning: 'The Magnificent' },
    { ar: 'الْغَفُور', en: 'Al-Ghafur', meaning: 'The Forgiving' },
    { ar: 'الشَّكُور', en: 'Ash-Shakur', meaning: 'The Appreciative' },
    { ar: 'الْعَلِيّ', en: 'Al-Aliyy', meaning: 'The Most High' },
    { ar: 'الْكَبِير', en: 'Al-Kabir', meaning: 'The Most Great' },
    { ar: 'الْحَفِيظ', en: 'Al-Hafiz', meaning: 'The Preserver' },
    { ar: 'المُقيِت', en: 'Al-Muqit', meaning: 'The Sustainer' },
    { ar: 'الْحسِيب', en: 'Al-Hasib', meaning: 'The Reckoner' },
    { ar: 'الْجَلِيل', en: 'Al-Jalil', meaning: 'The Majestic' },
    { ar: 'الْكَرِيم', en: 'Al-Karim', meaning: 'The Generous' },
    { ar: 'الرَّقِيب', en: 'Ar-Raqib', meaning: 'The Watchful' },
    { ar: 'الْمُجِيب', en: 'Al-Mujib', meaning: 'The Responsive' },
    { ar: 'الْوَاسِع', en: 'Al-Wasi', meaning: 'The All-Encompassing' },
    { ar: 'الْحَكِيم', en: 'Al-Hakim', meaning: 'The All-Wise' },
    { ar: 'الْوَدُود', en: 'Al-Wadud', meaning: 'The Loving' },
    { ar: 'الْمَجِيد', en: 'Al-Majid', meaning: 'The Glorious' },
    { ar: 'الْبَاعِث', en: 'Al-Ba\'ith', meaning: 'The Resurrector' },
    { ar: 'الشَّهِيد', en: 'Ash-Shahid', meaning: 'The Witness' },
    { ar: 'الْحَق', en: 'Al-Haqq', meaning: 'The Truth' },
    { ar: 'الْوَكِيل', en: 'Al-Wakil', meaning: 'The Trustee' },
    { ar: 'الْقَوِيّ', en: 'Al-Qawiyy', meaning: 'The Strong' },
    { ar: 'الْمَتِين', en: 'Al-Matin', meaning: 'The Firm' },
    { ar: 'الْوَلِيّ', en: 'Al-Waliyy', meaning: 'The Protector' },
    { ar: 'الْحَمِيد', en: 'Al-Hamid', meaning: 'The Praiseworthy' },
    { ar: 'الْمُحْصِي', en: 'Al-Muhsi', meaning: 'The Reckoner' },
    { ar: 'الْمُبْدِئ', en: 'Al-Mubdi', meaning: 'The Originator' },
    { ar: 'الْمُعِيد', en: 'Al-Mu\'id', meaning: 'The Restorer' },
    { ar: 'الْمُحْيِي', en: 'Al-Muhyi', meaning: 'The Giver of Life' },
    { ar: 'اَلْمُمِيت', en: 'Al-Mumit', meaning: 'The Bringer of Death' },
    { ar: 'الْحَيّ', en: 'Al-Hayy', meaning: 'The Ever-Living' },
    { ar: 'الْقَيُّوم', en: 'Al-Qayyum', meaning: 'The Sustainer' },
    { ar: 'الْوَاجِد', en: 'Al-Wajid', meaning: 'The Finder' },
    { ar: 'الْمَاجِد', en: 'Al-Majid', meaning: 'The Noble' },
    { ar: 'الْواحِد', en: 'Al-Wahid', meaning: 'The One' },
    { ar: 'اَلاَحَد', en: 'Al-Ahad', meaning: 'The Unique' },
    { ar: 'الصَّمَد', en: 'As-Samad', meaning: 'The Eternal' },
    { ar: 'الْقَادِر', en: 'Al-Qadir', meaning: 'The Capable' },
    { ar: 'الْمُقْتَدِر', en: 'Al-Muqtadir', meaning: 'The Omnipotent' },
    { ar: 'الْمُقَدِّم', en: 'Al-Muqaddim', meaning: 'The Expediter' },
    { ar: 'الْمُؤَخِّر', en: 'Al-Mu\'akhkhir', meaning: 'The Delayer' },
    { ar: 'الأوَّل', en: 'Al-Awwal', meaning: 'The First' },
    { ar: 'الآخِر', en: 'Al-Akhir', meaning: 'The Last' },
    { ar: 'الظَّاهِر', en: 'Az-Zahir', meaning: 'The Manifest' },
    { ar: 'الْبَاطِن', en: 'Al-Batin', meaning: 'The Hidden' },
    { ar: 'الْوَالِي', en: 'Al-Wali', meaning: 'The Governor' },
    { ar: 'الْمُتَعَالِي', en: 'Al-Muta\'ali', meaning: 'The Most Exalted' },
    { ar: 'الْبَرّ', en: 'Al-Barr', meaning: 'The Source of Goodness' },
    { ar: 'التَّوَاب', en: 'At-Tawwab', meaning: 'The Acceptor of Repentance' },
    { ar: 'الْمُنْتَقِم', en: 'Al-Muntaqim', meaning: 'The Avenger' },
    { ar: 'العَفُوّ', en: 'Al-Afuww', meaning: 'The Pardoner' },
    { ar: 'الرَّؤُوف', en: 'Ar-Ra\'uf', meaning: 'The Compassionate' },
    { ar: 'مَالِكُ الْمُلْك', en: 'Malik-ul-Mulk', meaning: 'Owner of All Sovereignty' },
    { ar: 'ذُوالْجَلاَلِ وَالإكْرَام', en: 'Dhul-Jalali wal-Ikram', meaning: 'Lord of Majesty and Bounty' },
    { ar: 'الْمُقْسِط', en: 'Al-Muqsit', meaning: 'The Equitable' },
    { ar: 'الْجَامِع', en: 'Al-Jami', meaning: 'The Gatherer' },
    { ar: 'الْغَنِيّ', en: 'Al-Ghaniyy', meaning: 'The Self-Sufficient' },
    { ar: 'الْمُغْنِي', en: 'Al-Mughni', meaning: 'The Enricher' },
    { ar: 'اَلْمَانِع', en: 'Al-Mani', meaning: 'The Preventer' },
    { ar: 'الضَّار', en: 'Ad-Darr', meaning: 'The Distresser' },
    { ar: 'النَّافِع', en: 'An-Nafi', meaning: 'The Benefactor' },
    { ar: 'النُّور', en: 'An-Nur', meaning: 'The Light' },
    { ar: 'الْهَادِي', en: 'Al-Hadi', meaning: 'The Guide' },
    { ar: 'الْبَدِيع', en: 'Al-Badi', meaning: 'The Incomparable' },
    { ar: 'اَلْبَاقِي', en: 'Al-Baqi', meaning: 'The Everlasting' },
    { ar: 'الْوَارِث', en: 'Al-Warith', meaning: 'The Inheritor' },
    { ar: 'الرَّشِيد', en: 'Ar-Rashid', meaning: 'The Guide to the Right Path' },
    { ar: 'الصَّبُور', en: 'As-Sabur', meaning: 'The Patient' },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">{content.intro}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {names.map((name, index) => (
            <Card key={index} className="p-4 hover:shadow-lg smooth-transition">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">{name.ar}</div>
                <div className="text-sm font-semibold">{name.en}</div>
                <div className="text-xs text-muted-foreground">{name.meaning}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NamesOfAllah;
