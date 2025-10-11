import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Angels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'الملائكة' : 'Angels',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'الملائكة مخلوقات نورانية خلقها الله من نور، لا يعصون الله ما أمرهم ويفعلون ما يؤمرون'
      : 'Angels are beings of light created by Allah from light, who never disobey Allah and do as they are commanded',
    detailsLabel: isArabic ? 'التفاصيل' : 'Details',
    referencesLabel: isArabic ? 'المراجع' : 'References',
  };

  const angels = [
    { nameAr: 'جبريل عليه السلام', nameEn: 'Jibril (Gabriel)', roleAr: 'ملك الوحي', roleEn: 'Angel of Revelation', descAr: 'أعظم الملائكة، موكل بإنزال الوحي على الأنبياء والرسل', descEn: 'The greatest angel, responsible for delivering revelation to prophets and messengers', detailsAr: 'روح القدس الذي نزل بالقرآن على قلب النبي محمد صلى الله عليه وسلم', detailsEn: 'The Holy Spirit who brought down the Quran to the heart of Prophet Muhammad ﷺ', references: [{ source: 'Quran', ref: '2:97', textAr: 'قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ', textEn: 'Say, "Whoever is an enemy to Gabriel - it is [none but] he who has brought the Qur\'an down upon your heart' }] },
    { nameAr: 'ميكائيل عليه السلام', nameEn: 'Mika\'il (Michael)', roleAr: 'ملك الرزق', roleEn: 'Angel of Sustenance', descAr: 'موكل بإنزال المطر وإنبات النبات والرزق', descEn: 'Responsible for bringing rain, plant growth, and provisions', detailsAr: 'الملك الموكل بالقطر والنبات، يدبر أمور الرزق بإذن الله', detailsEn: 'The angel in charge of rain and plants, managing sustenance by Allah\'s permission', references: [{ source: 'Quran', ref: '2:98', textAr: 'مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ', textEn: 'Whoever is an enemy to Allah and His angels and His messengers and Gabriel and Michael' }] },
    { nameAr: 'إسرافيل عليه السلام', nameEn: 'Israfil', roleAr: 'ملك الصور', roleEn: 'Angel of the Trumpet', descAr: 'موكل بالنفخ في الصور يوم القيامة', descEn: 'Tasked with blowing the trumpet on the Day of Judgment', detailsAr: 'ينفخ في الصور نفختين: نفخة الفناء ونفخة البعث', detailsEn: 'Will blow the trumpet twice: the blast of destruction and the blast of resurrection', references: [{ source: 'Quran', ref: '39:68', textAr: 'وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ', textEn: 'And the Horn will be blown, and whoever is in the heavens will fall dead' }] },
    { nameAr: 'ملك الموت عليه السلام', nameEn: 'Malak al-Mawt (Azrael)', roleAr: 'ملك الموت', roleEn: 'Angel of Death', descAr: 'موكل بقبض الأرواح عند الموت', descEn: 'Responsible for taking souls at the time of death', detailsAr: 'يقبض أرواح العباد عندما يأتي أجلهم المحدد', detailsEn: 'Takes the souls of servants when their appointed time comes', references: [{ source: 'Quran', ref: '32:11', textAr: 'قُلْ يَتَوَفَّاكُم مَّلَكُ الْمَوْتِ الَّذِي وُكِّلَ بِكُمْ', textEn: 'Say, "The angel of death will take you who has been entrusted with you' }] },
    { nameAr: 'رضوان عليه السلام', nameEn: 'Ridwan', roleAr: 'خازن الجنة', roleEn: 'Keeper of Paradise', descAr: 'الملك الموكل بالجنة وخزانتها', descEn: 'The angel in charge of Paradise and its treasures', detailsAr: 'يستقبل أهل الجنة ويفتح لهم أبوابها', detailsEn: 'Welcomes the people of Paradise and opens its gates for them', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'رضوان خازن الجنة', textEn: 'Ridwan, the keeper of Paradise' }] },
    { nameAr: 'مالك عليه السلام', nameEn: 'Malik', roleAr: 'خازن النار', roleEn: 'Keeper of Hellfire', descAr: 'الملك الموكل بالنار وعذابها', descEn: 'The angel in charge of Hellfire and its punishment', detailsAr: 'لا يضحك أبداً ولا يبتسم من شدة ما يرى من عذاب النار', detailsEn: 'Never laughs or smiles due to the severity of what he sees of the Fire\'s punishment', references: [{ source: 'Quran', ref: '43:77', textAr: 'وَنَادَوْا يَا مَالِكُ لِيَقْضِ عَلَيْنَا رَبُّكَ', textEn: 'And they will call, "O Malik, let your Lord put an end to us!"' }] },
    { nameAr: 'الكرام الكاتبين', nameEn: 'Al-Kiram al-Katibin', roleAr: 'الملائكة الحفظة', roleEn: 'The Noble Scribes', descAr: 'الملائكة الموكلون بكتابة أعمال بني آدم', descEn: 'The angels tasked with recording the deeds of humans', detailsAr: 'اثنان مع كل إنسان: أحدهما عن يمينه يكتب الحسنات، والآخر عن شماله يكتب السيئات', detailsEn: 'Two with each person: one on the right records good deeds, the other on the left records bad deeds', references: [{ source: 'Quran', ref: '82:10-12', textAr: 'وَإِنَّ عَلَيْكُمْ لَحَافِظِينَ * كِرَامًا كَاتِبِينَ * يَعْلَمُونَ مَا تَفْعَلُونَ', textEn: 'And indeed, [appointed] over you are keepers, Noble and recording; They know whatever you do' }] },
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
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">{content.intro}</p>

        <Accordion type="multiple" className="space-y-4">
          {angels.map((angel, index) => (
            <AccordionItem key={index} value={`angel-${index}`} className="border-0">
              <Card className="overflow-hidden neomorph-interactive">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left space-y-2">
                      <div className="text-xl font-bold text-primary">
                        {isArabic ? angel.nameAr : angel.nameEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? angel.roleAr : angel.roleEn}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm mb-3">{isArabic ? angel.descAr : angel.descEn}</p>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {content.detailsLabel}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? angel.detailsAr : angel.detailsEn}
                      </p>
                    </div>
                    {angel.references && angel.references.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">{content.referencesLabel}</h4>
                        <div className="space-y-2">
                          {angel.references.map((ref, refIndex) => (
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

export default Angels;
