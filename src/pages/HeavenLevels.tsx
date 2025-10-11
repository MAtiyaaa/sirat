import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Cloud, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    detailsLabel: isArabic ? 'التفاصيل' : 'Details',
    referencesLabel: isArabic ? 'المراجع' : 'References',
  };

  const levels = [
    {
      nameAr: 'دار المقامة',
      nameEn: 'Dar Al-Muqamah (Abode of Residence)',
      descAr: 'دار الإقامة الدائمة التي لا ظعن فيها ولا رحيل',
      descEn: 'The abode of permanent residence with no departure or travel',
      detailsAr: 'مكان الاستقرار والخلود، لا يمسنا فيها نصب ولا يمسنا فيها لغوب',
      detailsEn: 'A place of stability and eternity, where neither fatigue nor weariness touches us',
      references: [
        { source: 'Quran', ref: '35:35', textAr: 'الَّذِي أَحَلَّنَا دَارَ الْمُقَامَةِ مِن فَضْلِهِ', textEn: 'Who has settled us in the home of eternal residence out of His bounty' },
      ]
    },
    {
      nameAr: 'دار السلام',
      nameEn: 'Dar As-Salam (Abode of Peace)',
      descAr: 'الدار الآمنة الخالية من كل آفة ومنغصات',
      descEn: 'The safe abode free from all calamities and troubles',
      detailsAr: 'فيها السلامة من كل بلاء وشر وآفة، والسلام من الله عز وجل',
      detailsEn: 'Safety from all affliction, evil, and calamity, and peace from Allah',
      references: [
        { source: 'Quran', ref: '6:127', textAr: 'لَهُمْ دَارُ السَّلَامِ عِندَ رَبِّهِمْ', textEn: 'For them is the Home of Peace with their Lord' },
      ]
    },
    {
      nameAr: 'الفردوس الأعلى',
      nameEn: 'Al-Firdaws Al-A\'la',
      descAr: 'أعلى درجات الجنة، سقفها عرش الرحمن',
      descEn: 'The highest level of Paradise, its ceiling is the Throne of the Most Merciful',
      detailsAr: 'أفضل الجنان وأعلاها، ومنها تتفجر أنهار الجنة الأربعة',
      detailsEn: 'The best and highest of Paradise, from which the four rivers of Paradise spring forth',
      references: [
        { source: 'Quran', ref: '18:107', textAr: 'كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا', textEn: 'They will have the Gardens of Paradise as a lodging' },
        { source: 'Hadith', ref: 'Bukhari', textAr: 'فإذا سألتم الله فاسألوه الفردوس', textEn: 'When you ask Allah, ask Him for Al-Firdaws' },
      ]
    },
  ];

  const features = {
    titleAr: 'من نعيم الجنة',
    titleEn: 'Blessings of Paradise',
    itemsAr: [
      'لا موت فيها ولا نصب ولا تعب',
      'أنهار من ماء ولبن وعسل وخمر',
      'قصور وخيام من لؤلؤ مجوف',
      'رؤية وجه الله الكريم',
    ],
    itemsEn: [
      'No death, fatigue, or weariness',
      'Rivers of water, milk, honey, and wine',
      'Palaces and tents made of hollowed pearls',
      'Seeing the Noble Face of Allah',
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

        <Accordion type="multiple" className="space-y-4 mb-8">
          {levels.map((level, index) => (
            <AccordionItem key={index} value={`level-${index}`} className="border-0">
              <Card className="overflow-hidden neomorph-interactive">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
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
                              className="w-full text-left p-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 smooth-transition border border-emerald-500/20"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{ref.source} {ref.ref}</span>
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
