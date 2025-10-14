import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Star } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MakkahKaabaSignificance = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'فضل الكعبة المشرفة' : 'Significance of the Kaaba',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'بيت الله الحرام وقبلة المسلمين في كل أنحاء العالم'
      : "Allah's Sacred House and the Qibla of Muslims worldwide",
  };

  const points = [
    { 
      titleAr: 'أول بيت وضع للناس', 
      titleEn: 'The First House for Mankind', 
      descAr: 'الكعبة هي أول بيت وُضع للناس في الأرض للعبادة، كما قال تعالى: "إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا" (آل عمران: 96)',
      descEn: 'The Kaaba is the first house established for people on earth for worship, as Allah says: "Indeed, the first House [of worship] established for mankind was that at Makkah - blessed and a guidance for the worlds" (3:96)'
    },
    { 
      titleAr: 'قبلة المسلمين', 
      titleEn: 'The Qibla of Muslims', 
      descAr: 'هي القبلة التي يتوجه إليها المسلمون في صلواتهم الخمس في كل مكان من العالم، قال تعالى: "فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ" (البقرة: 144)',
      descEn: 'It is the direction that Muslims face in their five daily prayers from anywhere in the world. Allah says: "So turn your face toward al-Masjid al-Haram" (2:144)'
    },
    { 
      titleAr: 'بيت مبارك', 
      titleEn: 'A Blessed House', 
      descAr: 'الكعبة بيت مبارك، فيه البركة والخير والهدى للعالمين، وهي مضاعفة الأجر فيها، فالصلاة فيها بمائة ألف صلاة',
      descEn: 'The Kaaba is a blessed house filled with blessings, goodness, and guidance for all people. Prayers there are multiplied - one prayer equals 100,000 prayers'
    },
    { 
      titleAr: 'مثابة للناس وأمناً', 
      titleEn: 'A Place of Return and Safety', 
      descAr: 'جعله الله مثابة للناس يعودون إليه ويحجون ويعتمرون، وجعله أمناً وحرماً آمناً، قال تعالى: "وَإِذْ جَعَلْنَا الْبَيْتَ مَثَابَةً لِّلنَّاسِ وَأَمْنًا" (البقرة: 125)',
      descEn: 'Allah made it a place people return to for Hajj and Umrah, and a sanctuary of safety. Allah says: "And [mention] when We made the House a place of return for the people and [a place of] security" (2:125)'
    },
    { 
      titleAr: 'تعظيم شعائر الله', 
      titleEn: 'Honoring the Symbols of Allah', 
      descAr: 'تعظيم الكعبة من تعظيم شعائر الله وحرماته، وهو من تقوى القلوب، قال تعالى: "ذَٰلِكَ وَمَن يُعَظِّمْ شَعَائِرَ اللَّهِ فَإِنَّهَا مِن تَقْوَى الْقُلُوبِ" (الحج: 32)',
      descEn: 'Honoring the Kaaba is honoring the symbols and sanctities of Allah, which stems from the piety of hearts. Allah says: "And whoever honors the symbols of Allah - indeed, it is from the piety of hearts" (22:32)'
    },
    { 
      titleAr: 'مقام إبراهيم', 
      titleEn: 'The Station of Ibrahim', 
      descAr: 'فيها مقام إبراهيم عليه السلام الذي وقف عليه عند بناء الكعبة، وهو مصلى للمسلمين، قال تعالى: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى" (البقرة: 125)',
      descEn: 'It contains the Station of Ibrahim where he stood while building the Kaaba, which serves as a place of prayer. Allah says: "And take, [O believers], from the standing place of Ibrahim a place of prayer" (2:125)'
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
            <Star className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{content.description}</p>
        </div>
        <div className="space-y-4">
          {points.map((point, index) => (
            <Card key={index} className="neomorph hover:neomorph-inset transition-all">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {settings.language === 'ar' ? point.titleAr : point.titleEn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{settings.language === 'ar' ? point.descAr : point.descEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakkahKaabaSignificance;
