import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Flame, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    detailsLabel: isArabic ? 'التفاصيل' : 'Details',
    referencesLabel: isArabic ? 'المراجع' : 'References',
  };

  const levels = [
    {
      nameAr: 'جهنم',
      nameEn: 'Jahannam',
      descAr: 'الطبقة الأولى من النار',
      descEn: 'The first level of the Fire',
      detailsAr: 'للمسلمين العصاة الذين يدخلون النار ثم يخرجون منها بشفاعة أو برحمة الله',
      detailsEn: 'For sinful Muslims who will eventually exit through intercession or Allah\'s mercy',
      references: [
        { source: 'Quran', ref: '4:55', textAr: 'فَمِنْهُم مَّنْ آمَنَ بِهِ وَمِنْهُم مَّن صَدَّ عَنْهُ ۚ وَكَفَىٰ بِجَهَنَّمَ سَعِيرًا', textEn: 'And among them were those who believed in it, and among them were those who were averse to it. And sufficient is Hell as a blaze' },
      ]
    },
    {
      nameAr: 'لظى',
      nameEn: 'Ladha',
      descAr: 'الطبقة الثانية، نار شديدة اللهب',
      descEn: 'The second level, an intensely blazing fire',
      detailsAr: 'نار تتلظى وتشتعل، تنزع الجلد عن العظم',
      detailsEn: 'A fire that blazes intensely, stripping skin from bone',
      references: [
        { source: 'Quran', ref: '70:15-16', textAr: 'كَلَّا ۖ إِنَّهَا لَظَىٰ * نَزَّاعَةً لِّلشَّوَىٰ', textEn: 'No! Indeed, it is the Flame [of Hell], a remover of exteriors' },
      ]
    },
    {
      nameAr: 'سقر',
      nameEn: 'Saqar',
      descAr: 'الطبقة الخامسة، نار لا تبقي ولا تذر',
      descEn: 'The fifth level, a fire that spares nothing and leaves nothing',
      detailsAr: 'تحرق الجلود وتسود الوجوه، لا تبقي على شيء ولا تذر شيئاً',
      detailsEn: 'Burns the skin and blackens faces, sparing nothing and leaving nothing',
      references: [
        { source: 'Quran', ref: '74:26-27', textAr: 'سَأُصْلِيهِ سَقَرَ * وَمَا أَدْرَاكَ مَا سَقَرُ', textEn: 'I will drive him into Saqar. And what can make you know what is Saqar?' },
        { source: 'Quran', ref: '74:28', textAr: 'لَا تُبْقِي وَلَا تَذَرُ', textEn: 'It lets nothing remain and leaves nothing [unburned]' },
      ]
    },
    {
      nameAr: 'الهاوية',
      nameEn: 'Al-Hawiyah',
      descAr: 'الطبقة السابعة وأسفل دركات النار',
      descEn: 'The seventh and lowest level of the Fire',
      detailsAr: 'للمنافقين الذين أظهروا الإيمان وأبطنوا الكفر، أشد العذاب',
      detailsEn: 'For hypocrites who showed faith but concealed disbelief, the severest punishment',
      references: [
        { source: 'Quran', ref: '101:9-11', textAr: 'فَأُمُّهُ هَاوِيَةٌ * وَمَا أَدْرَاكَ مَا هِيَهْ * نَارٌ حَامِيَةٌ', textEn: 'His refuge will be an abyss. And what can make you know what that is? It is a Fire, intensely hot' },
        { source: 'Quran', ref: '4:145', textAr: 'إِنَّ الْمُنَافِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ', textEn: 'Indeed, the hypocrites will be in the lowest depths of the Fire' },
      ]
    },
  ];

  const punishments = {
    titleAr: 'من عذاب النار',
    titleEn: 'Punishments of the Fire',
    itemsAr: [
      'نار حامية شديدة الحرارة',
      'سلاسل وأغلال وأنكال',
      'عذاب دائم لا ينقطع',
      'لا يخفف عنهم العذاب',
    ],
    itemsEn: [
      'Intensely hot blazing fire',
      'Chains, shackles, and fetters',
      'Continuous unending punishment',
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

        <Accordion type="multiple" className="space-y-4 mb-8">
          {levels.map((level, index) => (
            <AccordionItem key={index} value={`level-${index}`} className="border-0">
              <Card className="overflow-hidden border-destructive/20 neomorph-interactive">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{isArabic ? level.nameAr : level.nameEn}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm mb-3">{isArabic ? level.descAr : level.descEn}</p>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {content.detailsLabel}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? level.detailsAr : level.detailsEn}
                      </p>
                    </div>
                    {level.references && level.references.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">{content.referencesLabel}</h4>
                        <div className="space-y-2">
                          {level.references.map((ref, refIndex) => (
                            <button
                              key={refIndex}
                              onClick={() => {
                                if (ref.source === 'Quran') {
                                  const [surah, ayah] = ref.ref.split(':');
                                  navigate(`/quran/${surah}`);
                                }
                              }}
                              className="w-full text-left p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 smooth-transition border border-destructive/20"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-destructive">{ref.source} {ref.ref}</span>
                              </div>
                              <p className="text-sm mt-1">{isArabic ? ref.textAr : ref.textEn}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

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
