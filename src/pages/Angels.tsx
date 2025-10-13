import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Angels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'الملائكة' : 'Angels',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'تعرف على الملائكة العظام وأدوارهم في الإسلام'
      : 'Learn about the mighty angels and their roles in Islam',
  };

  const angels = [
    { nameAr: 'جبريل عليه السلام', nameEn: 'Jibril (Gabriel)', roleAr: 'ملك الوحي', roleEn: 'Angel of Revelation', descAr: 'أعظم الملائكة، موكل بإنزال الوحي على الأنبياء والرسل', descEn: 'The greatest angel, responsible for delivering revelation to prophets and messengers', detailsAr: 'روح القدس الذي نزل بالقرآن على قلب النبي محمد صلى الله عليه وسلم', detailsEn: 'The Holy Spirit who brought down the Quran to the heart of Prophet Muhammad ﷺ', references: [{ source: 'Quran', ref: '2:97', textAr: 'قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ', textEn: 'Say, "Whoever is an enemy to Gabriel - it is [none but] he who has brought the Quran down upon your heart' }] },
    { nameAr: 'ميكائيل عليه السلام', nameEn: 'Mikail (Michael)', roleAr: 'ملك الرزق', roleEn: 'Angel of Sustenance', descAr: 'موكل بإنزال المطر وإنبات النبات والرزق', descEn: 'Responsible for bringing rain, plant growth, and provisions', detailsAr: 'الملك الموكل بالقطر والنبات، يدبر أمور الرزق بإذن الله', detailsEn: 'The angel in charge of rain and plants, managing sustenance by Allah permission', references: [{ source: 'Quran', ref: '2:98', textAr: 'مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ', textEn: 'Whoever is an enemy to Allah and His angels and His messengers and Gabriel and Michael' }] },
    { nameAr: 'إسرافيل عليه السلام', nameEn: 'Israfil', roleAr: 'ملك الصور', roleEn: 'Angel of the Trumpet', descAr: 'موكل بالنفخ في الصور يوم القيامة', descEn: 'Tasked with blowing the trumpet on the Day of Judgment', detailsAr: 'ينفخ في الصور نفختين: نفخة الفناء ونفخة البعث', detailsEn: 'Will blow the trumpet twice: the blast of destruction and the blast of resurrection', references: [{ source: 'Quran', ref: '39:68', textAr: 'وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ', textEn: 'And the Horn will be blown, and whoever is in the heavens will fall dead' }] },
    { nameAr: 'ملك الموت عليه السلام', nameEn: 'Azrael', roleAr: 'ملك الموت', roleEn: 'Angel of Death', descAr: 'موكل بقبض الأرواح عند الموت', descEn: 'Responsible for taking souls at the time of death', detailsAr: 'يقبض أرواح العباد عندما يأتي أجلهم المحدد', detailsEn: 'Takes the souls of servants when their appointed time comes', references: [{ source: 'Quran', ref: '32:11', textAr: 'قُلْ يَتَوَفَّاكُم مَّلَكُ الْمَوْتِ الَّذِي وُكِّلَ بِكُمْ', textEn: 'Say, The angel of death will take you who has been entrusted with you' }] },
    { nameAr: 'رضوان عليه السلام', nameEn: 'Ridwan', roleAr: 'خازن الجنة', roleEn: 'Keeper of Paradise', descAr: 'الملك الموكل بالجنة وخزانتها', descEn: 'The angel in charge of Paradise and its treasures', detailsAr: 'يستقبل أهل الجنة ويفتح لهم أبوابها', detailsEn: 'Welcomes the people of Paradise and opens its gates for them', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'رضوان خازن الجنة', textEn: 'Ridwan, the keeper of Paradise' }] },
    { nameAr: 'مالك عليه السلام', nameEn: 'Malik', roleAr: 'خازن النار', roleEn: 'Keeper of Hellfire', descAr: 'الملك الموكل بالنار وعذابها', descEn: 'The angel in charge of Hellfire and its punishment', detailsAr: 'لا يضحك أبداً ولا يبتسم من شدة ما يرى من عذاب النار', detailsEn: 'Never laughs or smiles due to the severity of what he sees of the Fire punishment', references: [{ source: 'Quran', ref: '43:77', textAr: 'وَنَادَوْا يَا مَالِكُ لِيَقْضِ عَلَيْنَا رَبُّكَ', textEn: 'And they will call, O Malik, let your Lord put an end to us!' }] },
    { nameAr: 'منكر ونكير', nameEn: 'Munkar and Nakir', roleAr: 'ملائكة القبر', roleEn: 'Angels of the Grave', descAr: 'الموكلان بسؤال الموتى في قبورهم', descEn: 'Responsible for questioning the dead in their graves', detailsAr: 'يسألان الميت: من ربك؟ وما دينك؟ ومن نبيك؟', detailsEn: 'They ask the deceased: Who is your Lord? What is your religion? Who is your prophet?', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'إذا قُبر الميت أتاه ملكان', textEn: 'When the deceased is buried, two angels come to him' }] },
    { nameAr: 'رقيب وعتيد', nameEn: 'Raqib and Atid', roleAr: 'ملائكة الكتابة', roleEn: 'Recording Angels', descAr: 'الموكلان بكتابة أعمال بني آدم', descEn: 'Tasked with recording the deeds of humans', detailsAr: 'أحدهما عن اليمين يكتب الحسنات، والآخر عن الشمال يكتب السيئات', detailsEn: 'One on the right records good deeds, the other on the left records bad deeds', references: [{ source: 'Quran', ref: '50:17-18', textAr: 'مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ', textEn: 'Man does not utter any word except that with him is an observer prepared' }] },
    { nameAr: 'حملة العرش', nameEn: 'Bearers of the Throne', roleAr: 'حملة عرش الرحمن', roleEn: 'Carriers of Allahs Throne', descAr: 'الموكلون بحمل عرش الله العظيم', descEn: 'Responsible for carrying the Magnificent Throne of Allah', detailsAr: 'هم الآن أربعة، ويوم القيامة يكونون ثمانية', detailsEn: 'They are currently four, and on the Day of Judgment they will be eight', references: [{ source: 'Quran', ref: '69:17', textAr: 'وَيَحْمِلُ عَرْشَ رَبِّكَ فَوْقَهُمْ يَوْمَئِذٍ ثَمَانِيَةٌ', textEn: 'And there will bear the Throne of your Lord above them, that Day, eight' }] },
    { nameAr: 'الزبانية', nameEn: 'Az-Zabaniyah', roleAr: 'ملائكة العذاب', roleEn: 'Angels of Punishment', descAr: 'الموكلون بتعذيب أهل النار', descEn: 'Responsible for punishing the inhabitants of Hell', detailsAr: 'تسعة عشر ملكاً غلاظاً شداداً لا يعصون الله', detailsEn: 'Nineteen stern and severe angels who never disobey Allah', references: [{ source: 'Quran', ref: '74:30-31', textAr: 'عَلَيْهَا تِسْعَةَ عَشَرَ', textEn: 'Over it are nineteen angels' }] },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 neomorph hover:neomorph-pressed">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.back}
        </Button>
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{content.description}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {angels.map((angel, index) => (
            <AccordionItem key={index} value={`angel-${index}`} className="border-none">
              <Card className="neomorph transition-all hover:neomorph-inset">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full">
                    <CardTitle className="text-left text-xl font-bold">
                      {settings.language === 'ar' ? angel.nameAr : angel.nameEn}
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm">{settings.language === 'ar' ? angel.descAr : angel.descEn}</p>
                    <p className="text-sm text-muted-foreground">{settings.language === 'ar' ? angel.detailsAr : angel.detailsEn}</p>
                    {angel.references?.map((ref, i) => (
                      <Button key={i} variant="outline" className="w-full neomorph hover:neomorph-pressed" onClick={() => ref.source === 'Quran' && navigate(`/quran/${ref.ref.split(':')[0]}`)}>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="font-semibold text-sm">{ref.source} {ref.ref}</div>
                          <div className="text-xs text-muted-foreground">{settings.language === 'ar' ? ref.textAr : ref.textEn}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
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
