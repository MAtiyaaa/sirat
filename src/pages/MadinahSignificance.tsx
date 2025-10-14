import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Star } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MadinahSignificance = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'فضل المدينة المنورة' : 'Significance of Madinah',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'مدينة رسول الله وفضائلها العظيمة'
      : "The city of Allah's Messenger and its great virtues",
  };

  const points = [
    { 
      titleAr: 'مدينة الرسول صلى الله عليه وسلم', 
      titleEn: "The Prophet's City", 
      descAr: 'المدينة المنورة هي مدينة النبي محمد صلى الله عليه وسلم التي هاجر إليها ونشر فيها الإسلام، وبها قبره الشريف ومسجده',
      descEn: 'Madinah is the city of Prophet Muhammad ﷺ to which he migrated and spread Islam. It contains his blessed grave and mosque'
    },
    { 
      titleAr: 'الحرم المدني', 
      titleEn: 'The Sacred Sanctuary', 
      descAr: 'جعل النبي صلى الله عليه وسلم المدينة حرماً آمناً، قال: "إني حرَّمت المدينة كما حرَّم إبراهيم مكة"، فلا يُصاد صيدها ولا يُقطع شجرها',
      descEn: 'The Prophet ﷺ made Madinah a sacred sanctuary, saying: "I have made Madinah sacred as Ibrahim made Makkah sacred." Its game cannot be hunted and its trees cannot be cut'
    },
    { 
      titleAr: 'مضاعفة الأجر', 
      titleEn: 'Multiplied Rewards', 
      descAr: 'الصلاة في المسجد النبوي خير من ألف صلاة فيما سواه إلا المسجد الحرام، قال النبي: "صلاة في مسجدي هذا خير من ألف صلاة فيما سواه إلا المسجد الحرام"',
      descEn: 'Prayer in the Prophet\'s Mosque is better than a thousand prayers elsewhere except the Sacred Mosque. The Prophet ﷺ said: "Prayer in this mosque of mine is better than a thousand prayers elsewhere, except the Sacred Mosque"'
    },
    { 
      titleAr: 'المدينة تنفي خبثها', 
      titleEn: 'Madinah Expels Evil', 
      descAr: 'المدينة تنفي خبثها كما ينفي الكير خبث الحديد، قال النبي: "المدينة كالكير تنفي خبثها وينصع طيبها"',
      descEn: 'Madinah expels its impurities as the bellows expel the impurities of iron. The Prophet ﷺ said: "Madinah is like bellows; it expels its impurities and purifies its good"'
    },
    { 
      titleAr: 'محفوفة بالملائكة', 
      titleEn: 'Protected by Angels', 
      descAr: 'على أنقاب المدينة ملائكة يحرسونها من الدجال والطاعون، قال النبي: "على أنقاب المدينة ملائكة، لا يدخلها الطاعون ولا الدجال"',
      descEn: 'Angels guard the entrances of Madinah from the Dajjal and plague. The Prophet ﷺ said: "At the entrances of Madinah there are angels; neither plague nor Dajjal can enter it"'
    },
    { 
      titleAr: 'طيبة الطيبة', 
      titleEn: 'Taybah the Pure', 
      descAr: 'سماها النبي صلى الله عليه وسلم بأسماء عديدة منها: طيبة، وطابة، والمسكينة، والمحبوبة، والجابرة، كلها تدل على حبها وفضلها',
      descEn: 'The Prophet ﷺ gave it many names including: Taybah, Tabah, al-Miskinah, al-Mahboobah, and al-Jabirah - all indicating love and virtue'
    },
    { 
      titleAr: 'الإيمان يأرز إليها', 
      titleEn: 'Faith Returns to It', 
      descAr: 'قال النبي صلى الله عليه وسلم: "إن الإيمان ليأرز إلى المدينة كما تأرز الحية إلى جحرها"، فالمدينة ملجأ الإيمان',
      descEn: 'The Prophet ﷺ said: "Faith returns to Madinah as a snake returns to its hole" - Madinah is the refuge of faith'
    },
    { 
      titleAr: 'من مات في المدينة', 
      titleEn: 'Dying in Madinah', 
      descAr: 'من استطاع أن يموت بالمدينة فليفعل، قال النبي: "من استطاع أن يموت بالمدينة فليمت بها، فإني أشفع لمن يموت بها"',
      descEn: 'The Prophet ﷺ said: "Whoever can die in Madinah, let him do so, for I will intercede for whoever dies there"'
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

export default MadinahSignificance;
