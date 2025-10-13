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
    { ar: 'محمد', en: 'Muhammad', meaning: 'The Praised One', detailsAr: 'الكثير الخصال الحميدة، المحمود في السماوات والأرض', detailsEn: 'One with abundant praiseworthy qualities, praised in the heavens and earth', references: [{ source: 'Quran', ref: '3:144', textAr: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ', textEn: 'Muhammad is not but a messenger' }] },
    { ar: 'أحمد', en: 'Ahmad', meaning: 'Most Praiseworthy', detailsAr: 'أكثر الناس حمداً لله، وأحق الناس بالحمد', detailsEn: 'The one who praises Allah the most, and most deserving of praise', references: [{ source: 'Quran', ref: '61:6', textAr: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ', textEn: 'Giving good tidings of a messenger to come after me, whose name is Ahmad' }] },
    { ar: 'الماحي', en: 'Al-Mahi', meaning: 'The Eraser', detailsAr: 'الذي يمحو الله به الكفر', detailsEn: 'The one through whom Allah erases disbelief', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'أنا محمد وأحمد والماحي', textEn: 'I am Muhammad, Ahmad, and Al-Mahi' }] },
    { ar: 'الحاشر', en: 'Al-Hashir', meaning: 'The Gatherer', detailsAr: 'الذي يُحشر الناس على قدمه', detailsEn: 'The one at whose feet people will be gathered', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'والحاشر الذي يحشر الناس على قدمي', textEn: 'And Al-Hashir, the one at whose feet people will be gathered' }] },
    { ar: 'العاقب', en: 'Al-Aqib', meaning: 'The Last', detailsAr: 'آخر الأنبياء', detailsEn: 'The last of the prophets', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'والعاقب الذي ليس بعده نبي', textEn: 'And Al-Aqib, after whom there is no prophet' }] },
    { ar: 'خاتم النبيين', en: 'Khatam an-Nabiyyin', meaning: 'Seal of the Prophets', detailsAr: 'آخر الأنبياء والمرسلين', detailsEn: 'The last of the prophets and messengers', references: [{ source: 'Quran', ref: '33:40', textAr: 'وَخَاتَمَ النَّبِيِّينَ', textEn: 'And [he is] the Seal of the Prophets' }] },
    { ar: 'نبي الرحمة', en: 'Nabi ar-Rahmah', meaning: 'Prophet of Mercy', detailsAr: 'النبي المرسل رحمة للعالمين', detailsEn: 'The prophet sent as mercy to all worlds', references: [{ source: 'Quran', ref: '21:107', textAr: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', textEn: 'And We have not sent you except as a mercy to the worlds' }] },
    { ar: 'السراج المنير', en: 'As-Siraj al-Munir', meaning: 'The Illuminating Lamp', detailsAr: 'المنير بالهداية والعلم', detailsEn: 'The one who illuminates with guidance and knowledge', references: [{ source: 'Quran', ref: '33:46', textAr: 'وَدَاعِيًا إِلَى اللَّهِ بِإِذْنِهِ وَسِرَاجًا مُّنِيرًا', textEn: 'And as one who invites to Allah by His permission, and an illuminating lamp' }] },
    { ar: 'الأمين', en: 'Al-Amin', meaning: 'The Trustworthy', detailsAr: 'الأمين الذي ائتمنه الله على الوحي', detailsEn: 'The trustworthy one whom Allah entrusted with revelation', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'كان يسمى الأمين', textEn: 'He was called Al-Amin' }] },
    { ar: 'الصادق', en: 'As-Sadiq', meaning: 'The Truthful', detailsAr: 'الصادق في قوله وفعله', detailsEn: 'The truthful in speech and action', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'الصادق المصدوق', textEn: 'The truthful, the believed' }] },
    { ar: 'المصدوق', en: 'Al-Musaddaq', meaning: 'The Believed', detailsAr: 'المصدق الذي صدقه الله في كل ما قال', detailsEn: 'The one believed, whom Allah confirmed in all he said', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'الصادق المصدوق', textEn: 'The truthful, the believed' }] },
    { ar: 'الرسول', en: 'Ar-Rasul', meaning: 'The Messenger', detailsAr: 'المرسل من الله إلى الناس', detailsEn: 'The one sent by Allah to mankind', references: [{ source: 'Quran', ref: '48:29', textAr: 'مُّحَمَّدٌ رَّسُولُ اللَّهِ', textEn: 'Muhammad is the Messenger of Allah' }] },
    { ar: 'النبي', en: 'An-Nabi', meaning: 'The Prophet', detailsAr: 'المختار من الله لتبليغ الرسالة', detailsEn: 'The chosen one by Allah to convey the message', references: [{ source: 'Quran', ref: '33:40', textAr: 'وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ', textEn: 'But [he is] the Messenger of Allah and the Seal of the Prophets' }] },
    { ar: 'الشاهد', en: 'Ash-Shahid', meaning: 'The Witness', detailsAr: 'الشاهد على أمته يوم القيامة', detailsEn: 'The witness over his nation on the Day of Judgment', references: [{ source: 'Quran', ref: '33:45', textAr: 'يَا أَيُّهَا النَّبِيُّ إِنَّا أَرْسَلْنَاكَ شَاهِدًا', textEn: 'O Prophet, indeed We have sent you as a witness' }] },
    { ar: 'المبشر', en: 'Al-Mubashshir', meaning: 'Bearer of Good News', detailsAr: 'المبشر بالجنة لمن أطاع الله', detailsEn: 'The bearer of good news of Paradise to those who obey Allah', references: [{ source: 'Quran', ref: '33:45', textAr: 'وَمُبَشِّرًا', textEn: 'And as a bearer of good tidings' }] },
    { ar: 'النذير', en: 'An-Nadhir', meaning: 'The Warner', detailsAr: 'المنذر من عذاب الله لمن عصاه', detailsEn: 'The warner of punishment to those who disobey', references: [{ source: 'Quran', ref: '33:45', textAr: 'وَنَذِيرًا', textEn: 'And as a warner' }] },
    { ar: 'الداعي إلى الله', en: 'Ad-Dai ila Allah', meaning: 'Caller to Allah', detailsAr: 'الداعي إلى توحيد الله وطاعته', detailsEn: 'The caller to the oneness and obedience of Allah', references: [{ source: 'Quran', ref: '33:46', textAr: 'وَدَاعِيًا إِلَى اللَّهِ بِإِذْنِهِ', textEn: 'And one who invites to Allah by His permission' }] },
    { ar: 'البشير', en: 'Al-Bashir', meaning: 'Announcer of Good', detailsAr: 'البشير بالخير والثواب', detailsEn: 'The announcer of good and reward', references: [{ source: 'Quran', ref: '7:188', textAr: 'إِنْ أَنَا إِلَّا نَذِيرٌ وَبَشِيرٌ', textEn: 'I am only a warner and a bringer of good tidings' }] },
    { ar: 'المصطفى', en: 'Al-Mustafa', meaning: 'The Chosen One', detailsAr: 'المختار والمصطفى من الله', detailsEn: 'The one chosen and selected by Allah', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'إن الله اصطفى من ولد إبراهيم إسماعيل', textEn: 'Allah chose Ismail from the children of Ibrahim' }] },
    { ar: 'حبيب الله', en: 'Habib Allah', meaning: 'Beloved of Allah', detailsAr: 'حبيب الله ومحبوبه', detailsEn: 'The beloved and loved one of Allah', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'أنت حبيب الله', textEn: 'You are the beloved of Allah' }] },
    { ar: 'صفي الله', en: 'Safi Allah', meaning: 'Pure One of Allah', detailsAr: 'الصفي المختار من الله', detailsEn: 'The pure one chosen by Allah', references: [{ source: 'Hadith', ref: 'Ibn Majah', textAr: 'أنا صفي الله', textEn: 'I am the pure one of Allah' }] },
    { ar: 'نبي التوبة', en: 'Nabi at-Tawbah', meaning: 'Prophet of Repentance', detailsAr: 'النبي الذي فتح الله به باب التوبة', detailsEn: 'The prophet through whom Allah opened the door of repentance', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'أنا نبي التوبة', textEn: 'I am the prophet of repentance' }] },
    { ar: 'نبي الملحمة', en: 'Nabi al-Malhamah', meaning: 'Prophet of the Great Battle', detailsAr: 'نبي الملاحم والجهاد', detailsEn: 'The prophet of battles and struggle', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'وأنا نبي الملحمة', textEn: 'And I am the prophet of the great battle' }] },
    { ar: 'المتوكل', en: 'Al-Mutawakkil', meaning: 'Reliant on Allah', detailsAr: 'المتوكل على الله في جميع أموره', detailsEn: 'The one who relies upon Allah in all his affairs', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'أنا المتوكل', textEn: 'I am Al-Mutawakkil' }] },
    { ar: 'الفاتح', en: 'Al-Fatih', meaning: 'The Opener', detailsAr: 'الفاتح الذي فتح الله به الهداية', detailsEn: 'The opener through whom Allah opened guidance', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'أنا الفاتح', textEn: 'I am the opener' }] },
    { ar: 'الأمي', en: 'Al-Ummi', meaning: 'The Unlettered', detailsAr: 'النبي الأمي الذي لم يقرأ ولم يكتب', detailsEn: 'The unlettered prophet who did not read or write', references: [{ source: 'Quran', ref: '7:157', textAr: 'الَّذِينَ يَتَّبِعُونَ الرَّسُولَ النَّبِيَّ الْأُمِّيَّ', textEn: 'Those who follow the Messenger, the unlettered prophet' }] },
    { ar: 'القاسم', en: 'Al-Qasim', meaning: 'The Distributor', detailsAr: 'المقسم الذي يقسم بأمر الله', detailsEn: 'The distributor who distributes by Allah command', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'إنما أنا قاسم والله يعطي', textEn: 'I am only a distributor, and Allah is the giver' }] },
    { ar: 'المقفي', en: 'Al-Muqaffi', meaning: 'The Follower', detailsAr: 'التابع للأنبياء من قبله', detailsEn: 'The one who follows the prophets before him', references: [{ source: 'Hadith', ref: 'Bukhari', textAr: 'أنا المقفي', textEn: 'I am Al-Muqaffi' }] },
    { ar: 'نبي الهدى', en: 'Nabi al-Huda', meaning: 'Prophet of Guidance', detailsAr: 'النبي الهادي إلى الحق', detailsEn: 'The prophet who guides to the truth', references: [{ source: 'Quran', ref: '28:56', textAr: 'إِنَّكَ لَا تَهْدِي مَنْ أَحْبَبْتَ', textEn: 'Indeed, you do not guide whom you like' }] },
    { ar: 'الرؤوف الرحيم', en: 'Ar-Rauf ar-Rahim', meaning: 'Kind and Merciful', detailsAr: 'الرؤوف الرحيم بالمؤمنين', detailsEn: 'The kind and merciful to the believers', references: [{ source: 'Quran', ref: '9:128', textAr: 'بِالْمُؤْمِنِينَ رَءُوفٌ رَّحِيمٌ', textEn: 'To the believers he is kind and merciful' }] },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph-interactive"
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
                              className="w-full text-left p-3 rounded-lg bg-primary/5 hover:bg-primary/10 smooth-transition border border-primary/20 neomorph-inset"
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
