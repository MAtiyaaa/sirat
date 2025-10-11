import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    detailsLabel: isArabic ? 'التفاصيل' : 'Details',
    referencesLabel: isArabic ? 'المراجع' : 'References',
  };

  const names = [
    { 
      ar: 'محمد', 
      en: 'Muhammad', 
      meaning: 'The Praised One',
      detailsAr: 'الكثير الخصال الحميدة، المحمود في السماوات والأرض',
      detailsEn: 'One with abundant praiseworthy qualities, praised in the heavens and earth',
      references: [
        { source: 'Quran', ref: '3:144', textAr: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ', textEn: 'Muhammad is not but a messenger' },
        { source: 'Quran', ref: '48:29', textAr: 'مُّحَمَّدٌ رَّسُولُ اللَّهِ', textEn: 'Muhammad is the Messenger of Allah' },
      ]
    },
    { 
      ar: 'أحمد', 
      en: 'Ahmad', 
      meaning: 'Most Praiseworthy',
      detailsAr: 'أكثر الناس حمداً لله، وأحق الناس بالحمد',
      detailsEn: 'The one who praises Allah the most, and most deserving of praise',
      references: [
        { source: 'Quran', ref: '61:6', textAr: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ', textEn: 'Giving good tidings of a messenger to come after me, whose name is Ahmad' },
      ]
    },
    { 
      ar: 'الماحي', 
      en: 'Al-Mahi', 
      meaning: 'The Eraser (of disbelief)',
      detailsAr: 'الذي يمحو الله به الكفر',
      detailsEn: 'The one through whom Allah erases disbelief',
      references: [
        { source: 'Hadith', ref: 'Bukhari', textAr: 'أنا محمد وأحمد والماحي', textEn: 'I am Muhammad, Ahmad, and Al-Mahi' },
      ]
    },
    { 
      ar: 'خاتم النبيين', 
      en: 'Khatam an-Nabiyyin', 
      meaning: 'Seal of the Prophets',
      detailsAr: 'آخر الأنبياء والمرسلين',
      detailsEn: 'The last of the prophets and messengers',
      references: [
        { source: 'Quran', ref: '33:40', textAr: 'وَخَاتَمَ النَّبِيِّينَ', textEn: 'And [he is] the Seal of the Prophets' },
      ]
    },
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

        <Accordion type="multiple" className="space-y-4">
          {names.map((name, index) => (
            <AccordionItem key={index} value={`name-${index}`} className="border-0">
              <Card className="overflow-hidden neomorph-interactive">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left space-y-2">
                      <div className="text-2xl font-bold text-primary">{name.ar}</div>
                      <div className="text-sm font-semibold">{name.en}</div>
                      <div className="text-xs text-muted-foreground">{name.meaning}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {content.detailsLabel}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? name.detailsAr : name.detailsEn}
                      </p>
                    </div>
                    {name.references && name.references.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">{content.referencesLabel}</h4>
                        <div className="space-y-2">
                          {name.references.map((ref, refIndex) => (
                            <button
                              key={refIndex}
                              onClick={() => {
                                if (ref.source === 'Quran') {
                                  const [surah, ayah] = ref.ref.split(':');
                                  navigate(`/quran/${surah}`);
                                }
                              }}
                              className="w-full text-left p-3 rounded-lg bg-primary/5 hover:bg-primary/10 smooth-transition border border-primary/20"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-primary">{ref.source} {ref.ref}</span>
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
      </div>
    </div>
  );
};

export default NamesOfMuhammad;
