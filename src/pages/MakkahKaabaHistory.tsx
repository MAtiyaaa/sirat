import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, History } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MakkahKaabaHistory = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'تاريخ الكعبة المشرفة' : 'History of the Kaaba',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'رحلة عبر تاريخ بيت الله الحرام من بنائه إلى يومنا هذا'
      : "A journey through the history of Allah's Sacred House from its construction to today",
  };

  const timeline = [
    { 
      titleAr: 'بناء آدم عليه السلام', 
      titleEn: 'Built by Adam (AS)', 
      descAr: 'يُروى أن آدم عليه السلام هو أول من بنى الكعبة بأمر من الله، وكان ذلك أول بيت وُضع للناس في الأرض للعبادة',
      descEn: 'It is narrated that Adam (AS) was the first to build the Kaaba by Allah\'s command, making it the first house of worship on earth'
    },
    { 
      titleAr: 'إعادة بناء إبراهيم وإسماعيل', 
      titleEn: 'Rebuilt by Ibrahim and Ismail', 
      descAr: 'بعد الطوفان، أمر الله إبراهيم وابنه إسماعيل عليهما السلام برفع قواعد البيت الحرام، قال تعالى: "وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ" (البقرة: 127)',
      descEn: 'After the flood, Allah commanded Ibrahim and his son Ismail (AS) to raise the foundations of the Sacred House. Allah says: "And [mention] when Ibrahim was raising the foundations of the House and [with him] Ismail" (2:127)'
    },
    { 
      titleAr: 'الحجر الأسود', 
      titleEn: 'The Black Stone', 
      descAr: 'أثناء البناء، جاء جبريل عليه السلام بالحجر الأسود من الجنة ووضعه إبراهيم في ركن الكعبة، وهو حجر أبيض من الجنة اسودّ من خطايا بني آدم',
      descEn: 'During construction, Jibreel (AS) brought the Black Stone from Paradise and Ibrahim placed it in the corner of the Kaaba. It was originally white but turned black from the sins of mankind'
    },
    { 
      titleAr: 'دعاء إبراهيم', 
      titleEn: "Ibrahim's Prayer", 
      descAr: 'دعا إبراهيم عليه السلام: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ" (البقرة: 127)، ودعا أن يبعث الله في ذريته نبياً، فكان محمد صلى الله عليه وسلم',
      descEn: 'Ibrahim prayed: "Our Lord, accept [this] from us. Indeed, You are the Hearing, the Knowing" (2:127). He also prayed for a prophet from his progeny, and that was Muhammad ﷺ'
    },
    { 
      titleAr: 'عصر قريش', 
      titleEn: 'The Quraysh Era', 
      descAr: 'قبل البعثة النبوية بخمس سنوات، أعادت قريش بناء الكعبة بعد تصدعها، وشارك النبي محمد صلى الله عليه وسلم وهو شاب في نقل الحجارة، وحلّ النزاع في وضع الحجر الأسود بحكمته',
      descEn: 'Five years before prophethood, Quraysh rebuilt the Kaaba after it cracked. Young Muhammad ﷺ helped carry stones and wisely resolved the dispute over placing the Black Stone'
    },
    { 
      titleAr: 'فتح مكة', 
      titleEn: 'The Conquest of Makkah', 
      descAr: 'في السنة الثامنة للهجرة، فتح النبي محمد صلى الله عليه وسلم مكة، ودخل الكعبة وحطم الأصنام التي كانت بداخلها وحولها، وطهّر البيت من الشرك',
      descEn: 'In the 8th year of Hijra, Prophet Muhammad ﷺ conquered Makkah, entered the Kaaba, destroyed the idols inside and around it, and purified the House from shirk'
    },
    { 
      titleAr: 'عبر التاريخ', 
      titleEn: 'Throughout History', 
      descAr: 'على مر العصور، تم ترميم وتوسعة الكعبة والمسجد الحرام عدة مرات، وكانت الكعبة دائماً محط أنظار المسلمين ومقصدهم في الحج والعمرة',
      descEn: 'Throughout the ages, the Kaaba and the Sacred Mosque were renovated and expanded several times. The Kaaba has always been the focus of Muslims and their destination for Hajj and Umrah'
    },
    { 
      titleAr: 'كسوة الكعبة', 
      titleEn: 'The Kiswah', 
      descAr: 'تُكسى الكعبة بثوب من الحرير الأسود المطرز بالذهب، ويتم تغييرها سنوياً يوم عرفة، وهي تقليد إسلامي عريق يرمز لتعظيم بيت الله',
      descEn: 'The Kaaba is covered with a black silk cloth embroidered with gold, replaced annually on the Day of Arafah. This is an ancient Islamic tradition symbolizing the glorification of Allah\'s House'
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
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{content.description}</p>
        </div>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <Card key={index} className="neomorph hover:neomorph-inset transition-all">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {settings.language === 'ar' ? event.titleAr : event.titleEn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{settings.language === 'ar' ? event.descAr : event.descEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakkahKaabaHistory;
