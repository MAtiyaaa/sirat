import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HeavenLevels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'درجات الجنة' : 'Levels of Heaven',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'للجنة درجات بعضها فوق بعض، أعلاها الفردوس الأعلى'
      : 'Paradise has levels, some above others, the highest being Al-Firdaws Al-A\'la',
  };

  const levels = [
    {
      nameAr: 'الفردوس الأعلى',
      nameEn: 'Al-Firdaws Al-A\'la',
      descAr: 'أعلى درجات الجنة ووسطها، وهي أفضل الجنان، سقفها عرش الرحمن، ومنها تتفجر أنهار الجنة',
      descEn: 'The highest and middle level of Paradise, its ceiling is the Throne of the Most Merciful, from which the rivers of Paradise spring forth',
    },
    {
      nameAr: 'جنة عدن',
      nameEn: 'Jannat Adn (Gardens of Eternity)',
      descAr: 'جنة الإقامة الدائمة، وهي مقر الأنبياء والصديقين والشهداء والصالحين',
      descEn: 'The Garden of eternal residence, home to prophets, the truthful, martyrs, and the righteous',
    },
    {
      nameAr: 'جنة النعيم',
      nameEn: 'Jannat An-Na\'im (Gardens of Delight)',
      descAr: 'جنة التنعم والسرور والبهجة، فيها أنواع النعيم المختلفة',
      descEn: 'The Garden of delight, joy, and pleasure, containing various types of bliss',
    },
    {
      nameAr: 'جنة المأوى',
      nameEn: 'Jannat Al-Ma\'wa (Garden of Refuge)',
      descAr: 'جنة المأوى والملجأ، التي يأوي إليها المتقون',
      descEn: 'The Garden of refuge and shelter to which the righteous retreat',
    },
    {
      nameAr: 'دار السلام',
      nameEn: 'Dar As-Salam (Abode of Peace)',
      descAr: 'الدار الآمنة الخالية من كل آفة ومنغصات، فيها السلامة من كل بلاء',
      descEn: 'The safe abode free from all calamities and troubles, where there is safety from all afflictions',
    },
    {
      nameAr: 'دار الخلد',
      nameEn: 'Dar Al-Khuld (Abode of Eternity)',
      descAr: 'دار البقاء الأبدي، لا موت فيها ولا فناء',
      descEn: 'The abode of eternal permanence, with no death or perishing',
    },
    {
      nameAr: 'جنة الفردوس',
      nameEn: 'Jannat Al-Firdaws',
      descAr: 'من أرفع درجات الجنة، فيها أعلى النعيم وأجله',
      descEn: 'Among the highest levels of Paradise, containing the most sublime bliss',
    },
    {
      nameAr: 'دار المقامة',
      nameEn: 'Dar Al-Muqamah (Abode of Residence)',
      descAr: 'دار الإقامة الدائمة التي لا ظعن فيها ولا رحيل',
      descEn: 'The abode of permanent residence with no departure or travel',
    },
  ];

  const features = {
    titleAr: 'من نعيم الجنة',
    titleEn: 'Blessings of Paradise',
    itemsAr: [
      'لا موت فيها ولا نصب ولا تعب',
      'أنهار من ماء ولبن وعسل وخمر',
      'قصور وخيام من لؤلؤ مجوف',
      'فواكه وطيور ولحم مما يشتهون',
      'حور عين كأمثال اللؤلؤ المكنون',
      'رؤية وجه الله الكريم',
      'لقاء الأنبياء والصالحين',
      'سماع كلام الله تعالى',
    ],
    itemsEn: [
      'No death, fatigue, or weariness',
      'Rivers of water, milk, honey, and wine',
      'Palaces and tents made of hollowed pearls',
      'Fruits, birds, and meat as they desire',
      'Hoor al-Een like protected pearls',
      'Seeing the Noble Face of Allah',
      'Meeting the prophets and righteous',
      'Hearing the speech of Allah',
    ],
  };

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
            <Cloud className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">{content.intro}</p>

        <div className="grid gap-4 mb-8">
          {levels.map((level, index) => (
            <Card key={index} className="hover:shadow-lg smooth-transition">
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <span>{isArabic ? level.nameAr : level.nameEn}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{isArabic ? level.descAr : level.descEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
          <CardHeader>
            <CardTitle>{isArabic ? features.titleAr : features.titleEn}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(isArabic ? features.itemsAr : features.itemsEn).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeavenLevels;
