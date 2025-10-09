import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HellLevels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'دركات جهنم' : 'Levels of Hell',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'لجهنم سبع دركات، كل دركة أشد من التي فوقها عذاباً'
      : 'Hellfire has seven levels, each one more severe in punishment than the one above it',
    warning: isArabic ? 'نعوذ بالله من النار' : 'We seek refuge in Allah from the Fire',
  };

  const levels = [
    {
      nameAr: 'جهنم',
      nameEn: 'Jahannam',
      descAr: 'الطبقة الأولى من النار، وهي للمسلمين العصاة الذين يدخلون النار ثم يخرجون منها بشفاعة أو برحمة الله',
      descEn: 'The first level of the Fire, for sinful Muslims who will enter but eventually exit through intercession or Allah\'s mercy',
    },
    {
      nameAr: 'لظى',
      nameEn: 'Ladha',
      descAr: 'الطبقة الثانية، نار شديدة اللهب، تلظى على من فيها',
      descEn: 'The second level, an intensely blazing fire that burns those within',
    },
    {
      nameAr: 'الحطمة',
      nameEn: 'Al-Hutamah',
      descAr: 'الطبقة الثالثة، وهي نار تحطم كل ما يلقى فيها',
      descEn: 'The third level, a fire that crushes everything thrown into it',
    },
    {
      nameAr: 'السعير',
      nameEn: 'As-Sa\'ir',
      descAr: 'الطبقة الرابعة، نار مستعرة شديدة الإحراق',
      descEn: 'The fourth level, an intensely blazing and burning fire',
    },
    {
      nameAr: 'سقر',
      nameEn: 'Saqar',
      descAr: 'الطبقة الخامسة، نار لا تبقي ولا تذر، تحرق الجلود',
      descEn: 'The fifth level, a fire that spares nothing and leaves nothing, burning the skin',
    },
    {
      nameAr: 'الجحيم',
      nameEn: 'Al-Jahim',
      descAr: 'الطبقة السادسة، نار شديدة التأجج والاشتعال',
      descEn: 'The sixth level, an extremely fierce and raging fire',
    },
    {
      nameAr: 'الهاوية',
      nameEn: 'Al-Hawiyah',
      descAr: 'الطبقة السابعة وأسفل دركات النار، للمنافقين الذين أظهروا الإيمان وأبطنوا الكفر',
      descEn: 'The seventh and lowest level of the Fire, for the hypocrites who showed faith but concealed disbelief',
    },
  ];

  const punishments = {
    titleAr: 'من عذاب النار',
    titleEn: 'Punishments of the Fire',
    itemsAr: [
      'نار حامية شديدة الحرارة',
      'سلاسل وأغلال وأنكال',
      'طعام من زقوم وضريع',
      'شراب من حميم وغساق وصديد',
      'ثياب من نار وقطران',
      'عذاب دائم لا ينقطع',
      'كلما نضجت جلودهم بدلهم جلوداً غيرها',
      'لا يخفف عنهم العذاب',
    ],
    itemsEn: [
      'Intensely hot blazing fire',
      'Chains, shackles, and fetters',
      'Food of zaqqum and dari\'',
      'Drink of scalding water, pus, and discharge',
      'Garments of fire and tar',
      'Continuous unending punishment',
      'When their skins are burnt, they are replaced with new ones',
      'The punishment will not be lightened',
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
            <Flame className="h-8 w-8 text-destructive" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <p className="text-muted-foreground">{content.intro}</p>
          <p className="text-destructive font-semibold">{content.warning}</p>
        </div>

        <div className="grid gap-4 mb-8">
          {levels.map((level, index) => (
            <Card key={index} className="hover:shadow-lg smooth-transition border-destructive/20">
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold">
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

        <Card className="bg-gradient-to-br from-destructive/10 to-orange-500/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              {isArabic ? punishments.titleAr : punishments.titleEn}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(isArabic ? punishments.itemsAr : punishments.itemsEn).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
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

export default HellLevels;
