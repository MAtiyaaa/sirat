import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MakkahUmrah = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'العمرة' : 'Umrah',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'خطوات وأركان أداء العمرة'
      : 'Steps and pillars of performing Umrah',
  };

  const sections = [
    {
      titleAr: 'الإحرام',
      titleEn: 'Ihram',
      stepsAr: [
        'الاغتسال والتطيب قبل الإحرام',
        'لبس ثوبي الإحرام للرجل (إزار ورداء أبيضين)، والمرأة تلبس ملابسها العادية الساترة',
        'الصلاة في الميقات أو قبله',
        'النية بالقلب والنطق بالتلبية: "لبيك اللهم عمرة"',
        'الاستمرار في التلبية حتى بداية الطواف',
      ],
      stepsEn: [
        'Perform ghusl (ritual bath) and apply perfume before ihram',
        'Men wear two white cloths (izar and rida), women wear their regular modest clothing',
        'Pray at or before the miqat',
        'Make intention in the heart and say the talbiyah: "Labbayka Allahumma Umrah"',
        'Continue saying talbiyah until starting tawaf',
      ],
    },
    {
      titleAr: 'الطواف',
      titleEn: 'Tawaf (Circumambulation)',
      stepsAr: [
        'الطهارة (الوضوء أو الغسل)',
        'استلام الحجر الأسود أو الإشارة إليه وقول "بسم الله والله أكبر"',
        'الطواف سبعة أشواط حول الكعبة، جاعلاً الكعبة عن يساره',
        'الاضطباع للرجال (جعل الرداء تحت الإبط الأيمن وطرفه على الكتف الأيسر)',
        'الرمل في الأشواط الثلاثة الأولى للرجال (الإسراع مع تقارب الخطى)',
        'صلاة ركعتين خلف مقام إبراهيم أو في أي مكان من المسجد',
      ],
      stepsEn: [
        'Be in a state of purity (wudu or ghusl)',
        'Touch or point to the Black Stone and say "Bismillah Allahu Akbar"',
        'Make seven circuits around the Kaaba, keeping it on your left',
        'Idtiba for men (placing the upper garment under the right armpit)',
        'Raml for men in first three circuits (walking briskly with short steps)',
        'Pray two rakahs behind Maqam Ibrahim or anywhere in the mosque',
      ],
    },
    {
      titleAr: 'السعي بين الصفا والمروة',
      titleEn: 'Sai (Walking between Safa and Marwah)',
      stepsAr: [
        'الذهاب إلى الصفا والدعاء عنده',
        'السعي سبعة أشواط بين الصفا والمروة',
        'الذهاب من الصفا إلى المروة شوط، والعودة من المروة إلى الصفا شوط آخر',
        'الإسراع بين العلمين الأخضرين للرجال',
        'الدعاء والذكر أثناء السعي',
      ],
      stepsEn: [
        'Go to Safa and make dua',
        'Walk seven times between Safa and Marwah',
        'Going from Safa to Marwah is one lap, returning is another',
        'Men should jog between the green markers',
        'Make dua and dhikr during sai',
      ],
    },
    {
      titleAr: 'الحلق أو التقصير',
      titleEn: 'Halq or Taqsir (Shaving or Trimming)',
      stepsAr: [
        'حلق الشعر كله للرجال (أفضل)',
        'أو تقصير الشعر من جميع الرأس',
        'المرأة تقص قدر أنملة من شعرها',
        'بهذا تنتهي العمرة ويُحل من الإحرام',
      ],
      stepsEn: [
        'Men shave the entire head (preferable)',
        'Or trim hair from all parts of the head',
        'Women trim a fingertip\'s length of hair',
        'This completes the Umrah and one exits ihram',
      ],
    },
  ];

  const clothing = {
    titleAr: 'ملابس الإحرام',
    titleEn: 'Ihram Clothing',
    menAr: [
      'إزار: قطعة قماش بيضاء غير مخيطة تُلف حول الجزء السفلي',
      'رداء: قطعة قماش بيضاء غير مخيطة تُوضع على الكتفين',
      'نعال يظهر فيها ظهر القدم',
      'ممنوع: المخيط، تغطية الرأس، الطيب بعد الإحرام',
    ],
    menEn: [
      'Izar: White unsewn cloth wrapped around the lower body',
      'Rida: White unsewn cloth placed over the shoulders',
      'Sandals that show the top of the foot',
      'Prohibited: Stitched clothing, covering the head, perfume after ihram',
    ],
    womenAr: [
      'ملابس عادية ساترة لكامل الجسم',
      'يجب أن تكون فضفاضة وغير شفافة',
      'لا تغطي الوجه والكفين',
      'ممنوع: النقاب والقفازات، الطيب بعد الإحرام',
    ],
    womenEn: [
      'Regular modest clothing covering the entire body',
      'Should be loose and non-transparent',
      'Do not cover face and hands',
      'Prohibited: Niqab and gloves, perfume after ihram',
    ],
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 neomorph hover:neomorph-pressed">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.back}
        </Button>
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{content.description}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {sections.map((section, index) => (
            <AccordionItem key={index} value={`section-${index}`} className="border-none">
              <Card className="neomorph transition-all hover:neomorph-inset">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full">
                    <CardTitle className="text-left text-xl font-bold">
                      {settings.language === 'ar' ? section.titleAr : section.titleEn}
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4">
                    <ol className="list-decimal list-inside space-y-2">
                      {(settings.language === 'ar' ? section.stepsAr : section.stepsEn).map((step, i) => (
                        <li key={i} className="text-sm leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}

          <AccordionItem value="clothing" className="border-none">
            <Card className="neomorph transition-all hover:neomorph-inset">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardHeader className="p-0 w-full">
                  <CardTitle className="text-left text-xl font-bold">
                    {settings.language === 'ar' ? clothing.titleAr : clothing.titleEn}
                  </CardTitle>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{settings.language === 'ar' ? 'للرجال:' : 'For Men:'}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {(settings.language === 'ar' ? clothing.menAr : clothing.menEn).map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{settings.language === 'ar' ? 'للنساء:' : 'For Women:'}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {(settings.language === 'ar' ? clothing.womenAr : clothing.womenEn).map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default MakkahUmrah;
