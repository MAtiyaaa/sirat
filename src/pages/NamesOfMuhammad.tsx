import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NamesOfMuhammad = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'أسماء النبي محمد ﷺ' : 'Names of Prophet Muhammad ﷺ',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'أسماء وألقاب خاتم الأنبياء والمرسلين صلى الله عليه وسلم'
      : 'Names and titles of the Final Prophet and Messenger ﷺ',
  };

  const names = [
    { ar: 'محمد', en: 'Muhammad', meaning: 'The Praised One' },
    { ar: 'أحمد', en: 'Ahmad', meaning: 'Most Praiseworthy' },
    { ar: 'الماحي', en: 'Al-Mahi', meaning: 'The Eraser (of disbelief)' },
    { ar: 'الحاشر', en: 'Al-Hashir', meaning: 'The Gatherer' },
    { ar: 'العاقب', en: 'Al-Aqib', meaning: 'The Last Prophet' },
    { ar: 'المقفى', en: 'Al-Muqaffi', meaning: 'The Successor' },
    { ar: 'نبي التوبة', en: 'Nabi at-Tawbah', meaning: 'Prophet of Repentance' },
    { ar: 'نبي الرحمة', en: 'Nabi ar-Rahmah', meaning: 'Prophet of Mercy' },
    { ar: 'نبي الملحمة', en: 'Nabi al-Malhamah', meaning: 'Prophet of Battles' },
    { ar: 'الشاهد', en: 'Ash-Shahid', meaning: 'The Witness' },
    { ar: 'المبشر', en: 'Al-Mubashshir', meaning: 'The Bearer of Good News' },
    { ar: 'النذير', en: 'An-Nadhir', meaning: 'The Warner' },
    { ar: 'البشير', en: 'Al-Bashir', meaning: 'The Bringer of Good Tidings' },
    { ar: 'السراج المنير', en: 'As-Siraj al-Munir', meaning: 'The Illuminating Lamp' },
    { ar: 'الداعي', en: 'Ad-Da\'i', meaning: 'The Caller' },
    { ar: 'المختار', en: 'Al-Mukhtar', meaning: 'The Chosen One' },
    { ar: 'المصطفى', en: 'Al-Mustafa', meaning: 'The Selected' },
    { ar: 'الأمين', en: 'Al-Amin', meaning: 'The Trustworthy' },
    { ar: 'الصادق', en: 'As-Sadiq', meaning: 'The Truthful' },
    { ar: 'رؤوف', en: 'Ra\'uf', meaning: 'Compassionate' },
    { ar: 'رحيم', en: 'Rahim', meaning: 'Merciful' },
    { ar: 'حبيب الله', en: 'Habib Allah', meaning: 'Beloved of Allah' },
    { ar: 'صفي الله', en: 'Safi Allah', meaning: 'Pure One of Allah' },
    { ar: 'نجي الله', en: 'Naji Allah', meaning: 'Confidant of Allah' },
    { ar: 'كليم الله', en: 'Kalim Allah', meaning: 'One Who Speaks with Allah' },
    { ar: 'حبيب الرحمن', en: 'Habib ar-Rahman', meaning: 'Beloved of the Most Merciful' },
    { ar: 'سيد ولد آدم', en: 'Sayyid Walad Adam', meaning: 'Master of the Children of Adam' },
    { ar: 'سيد المرسلين', en: 'Sayyid al-Mursalin', meaning: 'Master of the Messengers' },
    { ar: 'إمام المتقين', en: 'Imam al-Muttaqin', meaning: 'Leader of the Righteous' },
    { ar: 'خاتم النبيين', en: 'Khatam an-Nabiyyin', meaning: 'Seal of the Prophets' },
    { ar: 'رحمة للعالمين', en: 'Rahmatan lil-Alamin', meaning: 'Mercy to the Worlds' },
    { ar: 'سيد الكونين', en: 'Sayyid al-Kawnain', meaning: 'Master of Both Worlds' },
    { ar: 'سيد الثقلين', en: 'Sayyid ath-Thaqalayn', meaning: 'Master of Humans and Jinn' },
    { ar: 'الرسول', en: 'Ar-Rasul', meaning: 'The Messenger' },
    { ar: 'النبي', en: 'An-Nabi', meaning: 'The Prophet' },
    { ar: 'الأمي', en: 'Al-Ummi', meaning: 'The Unlettered Prophet' },
    { ar: 'القاسم', en: 'Al-Qasim', meaning: 'The Distributor' },
    { ar: 'الفاتح', en: 'Al-Fatih', meaning: 'The Opener' },
    { ar: 'الشفيع', en: 'Ash-Shafi', meaning: 'The Intercessor' },
    { ar: 'المشفع', en: 'Al-Mushaffa', meaning: 'The One Whose Intercession is Accepted' },
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
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">{content.intro}</p>

        <div className="grid md:grid-cols-2 gap-4">
          {names.map((name, index) => (
            <Card key={index} className="p-4 hover:shadow-lg smooth-transition">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary text-center">{name.ar}</div>
                <div className="text-sm font-semibold text-center">{name.en}</div>
                <div className="text-xs text-muted-foreground text-center">{name.meaning}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NamesOfMuhammad;
