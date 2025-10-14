import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, MapPin } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MakkahHajj = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'الحج' : 'Hajj',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'أركان وأيام الحج - الركن الخامس من أركان الإسلام'
      : 'Pillars and days of Hajj - The fifth pillar of Islam',
  };

  const days = [
    {
      titleAr: 'يوم التروية (8 ذو الحجة)',
      titleEn: 'Day of Tarwiyah (8th Dhul-Hijjah)',
      stepsAr: [
        'الإحرام من مكة للمتمتع، أو من الميقات للمفرد والقارن',
        'التوجه إلى منى',
        'صلاة الظهر والعصر والمغرب والعشاء والفجر في منى',
        'المبيت في منى',
      ],
      stepsEn: [
        'Enter ihram from Makkah for mutamatti, or from miqat for others',
        'Go to Mina',
        'Pray Dhuhr, Asr, Maghrib, Isha, and Fajr in Mina',
        'Stay overnight in Mina',
      ],
    },
    {
      titleAr: 'يوم عرفة (9 ذو الحجة)',
      titleEn: 'Day of Arafah (9th Dhul-Hijjah)',
      stepsAr: [
        'التوجه إلى عرفة بعد طلوع الشمس',
        'الوقوف بعرفة من الظهر إلى غروب الشمس (الركن الأعظم)',
        'الجمع بين الظهر والعصر جمع تقديم',
        'الإكثار من الدعاء والذكر والتضرع إلى الله',
        'الانصراف إلى مزدلفة بعد الغروب',
        'صلاة المغرب والعشاء جمعاً في مزدلفة',
        'جمع الحصى للرمي (70 حصاة صغيرة)',
        'المبيت في مزدلفة حتى الفجر',
      ],
      stepsEn: [
        'Go to Arafah after sunrise',
        'Stand in Arafah from noon until sunset (the greatest pillar)',
        'Combine Dhuhr and Asr prayers',
        'Make abundant dua, dhikr, and supplications',
        'Leave for Muzdalifah after sunset',
        'Combine Maghrib and Isha in Muzdalifah',
        'Collect pebbles for stoning (70 small pebbles)',
        'Stay in Muzdalifah until Fajr',
      ],
    },
    {
      titleAr: 'يوم النحر (10 ذو الحجة)',
      titleEn: 'Day of Sacrifice (10th Dhul-Hijjah)',
      stepsAr: [
        'صلاة الفجر في مزدلفة',
        'الانصراف إلى منى قبل شروق الشمس',
        'رمي جمرة العقبة الكبرى بسبع حصيات',
        'ذبح الهدي (للمتمتع والقارن)',
        'الحلق أو التقصير',
        'التحلل الأول (يُباح كل شيء إلا النساء)',
        'النزول إلى مكة لطواف الإفاضة وسعي الحج',
        'التحلل الثاني بعد طواف الإفاضة (يحل كل شيء)',
        'العودة إلى منى للمبيت',
      ],
      stepsEn: [
        'Pray Fajr in Muzdalifah',
        'Leave for Mina before sunrise',
        'Stone Jamrat al-Aqabah with 7 pebbles',
        'Sacrifice animal (for mutamatti and qarin)',
        'Shave or trim hair',
        'First tahallul (everything permissible except relations)',
        'Go to Makkah for Tawaf al-Ifadah and Hajj sai',
        'Second tahallul after Tawaf al-Ifadah (everything permissible)',
        'Return to Mina to stay overnight',
      ],
    },
    {
      titleAr: 'أيام التشريق (11-12-13 ذو الحجة)',
      titleEn: 'Days of Tashriq (11th-13th Dhul-Hijjah)',
      stepsAr: [
        'المبيت في منى',
        'رمي الجمرات الثلاث بعد الزوال (كل جمرة بسبع حصيات)',
        'الترتيب: الصغرى ثم الوسطى ثم الكبرى',
        'يجوز التعجل في يومين لمن أراد ويخرج قبل الغروب',
        'من تأخر للثالث عشر يرمي الجمرات الثلاث أيضاً',
      ],
      stepsEn: [
        'Stay overnight in Mina',
        'Stone the three pillars after noon (7 pebbles each)',
        'Order: Small, Middle, then Large',
        'May leave after two days before sunset',
        'If staying the 13th, stone all three pillars again',
      ],
    },
    {
      titleAr: 'طواف الوداع',
      titleEn: 'Farewell Tawaf',
      stepsAr: [
        'آخر عهد بالبيت قبل السفر',
        'طواف سبعة أشواط حول الكعبة',
        'صلاة ركعتين خلف المقام',
        'الحائض والنفساء ليس عليهما طواف وداع',
      ],
      stepsEn: [
        'Last act before leaving for travel',
        'Circumambulate the Kaaba seven times',
        'Pray two rakahs behind the Maqam',
        'Not required for menstruating or postpartum women',
      ],
    },
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
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{content.description}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {days.map((day, index) => (
            <AccordionItem key={index} value={`day-${index}`} className="border-none">
              <Card className="neomorph transition-all hover:neomorph-inset">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full">
                    <CardTitle className="text-left text-xl font-bold">
                      {settings.language === 'ar' ? day.titleAr : day.titleEn}
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <ol className="list-decimal list-inside space-y-2">
                      {(settings.language === 'ar' ? day.stepsAr : day.stepsEn).map((step, i) => (
                        <li key={i} className="text-sm leading-relaxed">{step}</li>
                      ))}
                    </ol>
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

export default MakkahHajj;
