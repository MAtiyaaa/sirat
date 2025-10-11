import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    detailsLabel: isArabic ? 'التفاصيل' : 'Details',
    referencesLabel: isArabic ? 'المراجع' : 'References',
  };

  const names = [
    { 
      ar: 'الرَّحْمَن', 
      en: 'Ar-Rahman', 
      meaning: 'The Most Merciful',
      detailsAr: 'ذو الرحمة الواسعة التي وسعت كل شيء',
      detailsEn: 'The One whose Mercy encompasses all creation',
      references: [
        { source: 'Quran', ref: '1:3', textAr: 'الرَّحْمَٰنِ الرَّحِيمِ', textEn: 'The Most Merciful, the Bestower of Mercy' },
      ]
    },
    { 
      ar: 'الرَّحِيم', 
      en: 'Ar-Raheem', 
      meaning: 'The Bestower of Mercy',
      detailsAr: 'الذي يرحم عباده المؤمنين رحمة خاصة',
      detailsEn: 'The One who bestows special mercy on believers',
      references: [
        { source: 'Quran', ref: '1:3', textAr: 'الرَّحْمَٰنِ الرَّحِيمِ', textEn: 'The Most Merciful, the Bestower of Mercy' },
      ]
    },
    { 
      ar: 'الْمَلِك', 
      en: 'Al-Malik', 
      meaning: 'The King',
      detailsAr: 'مالك الملك، له الملك كله',
      detailsEn: 'The Owner of all sovereignty',
      references: [
        { source: 'Quran', ref: '59:23', textAr: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ', textEn: 'He is Allah, other than whom there is no deity, the King' },
      ]
    },
    { 
      ar: 'الْقُدُّوس', 
      en: 'Al-Quddus', 
      meaning: 'The Most Holy',
      detailsAr: 'المنزه عن كل عيب ونقص',
      detailsEn: 'The One free from all imperfections',
      references: [
        { source: 'Quran', ref: '59:23', textAr: 'الْقُدُّوسُ السَّلَامُ', textEn: 'The Most Holy, the Source of Peace' },
      ]
    },
    { 
      ar: 'السَّلاَم', 
      en: 'As-Salam', 
      meaning: 'The Source of Peace',
      detailsAr: 'ذو السلامة من جميع العيوب والنقائص',
      detailsEn: 'The One who is free from all defects',
      references: [
        { source: 'Quran', ref: '59:23', textAr: 'السَّلَامُ الْمُؤْمِنُ', textEn: 'The Source of Peace, the Granter of Security' },
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
            <Heart className="h-8 w-8 text-primary" />
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

export default NamesOfAllah;
