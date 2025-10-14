import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, History } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MadinahHistory = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'تاريخ المدينة المنورة' : 'History of Madinah',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'رحلة عبر تاريخ مدينة رسول الله صلى الله عليه وسلم'
      : "A journey through the history of the Messenger of Allah's ﷺ city",
  };

  const timeline = [
    { 
      titleAr: 'يثرب قبل الإسلام', 
      titleEn: 'Yathrib Before Islam', 
      descAr: 'كانت المدينة تُعرف باسم يثرب، وكان يسكنها الأوس والخزرج من العرب، واليهود من بني قينقاع وبني النضير وبني قريظة، وكانت بينهم حروب طويلة',
      descEn: 'The city was known as Yathrib, inhabited by the Arab tribes of Aws and Khazraj, and the Jewish tribes of Banu Qaynuqa, Banu Nadir, and Banu Qurayza. Long wars existed between them'
    },
    { 
      titleAr: 'بيعة العقبة', 
      titleEn: 'The Pledge of Aqabah', 
      descAr: 'في السنة الثالثة عشرة من البعثة، بايع الأنصار من الأوس والخزرج النبي صلى الله عليه وسلم في العقبة على نصرته وحمايته، مهدوا الطريق للهجرة',
      descEn: 'In the 13th year of prophethood, the Ansar from Aws and Khazraj pledged allegiance to the Prophet ﷺ at Aqabah to support and protect him, paving the way for migration'
    },
    { 
      titleAr: 'الهجرة النبوية', 
      titleEn: "The Prophet's Migration", 
      descAr: 'في السنة الأولى للهجرة، هاجر النبي محمد صلى الله عليه وسلم من مكة إلى يثرب، واستقبله أهلها بالترحاب والفرح، وأصبحت مدينة الرسول',
      descEn: 'In the first year of Hijra, Prophet Muhammad ﷺ migrated from Makkah to Yathrib. Its people welcomed him with joy, and it became the City of the Messenger'
    },
    { 
      titleAr: 'بناء المسجد النبوي', 
      titleEn: 'Building the Prophet\'s Mosque', 
      descAr: 'بنى النبي صلى الله عليه وسلم المسجد النبوي في المكان الذي بركت فيه ناقته، واشترى الأرض من غلامين يتيمين، وشارك بنفسه في البناء',
      descEn: 'The Prophet ﷺ built the Prophet\'s Mosque where his she-camel knelt. He purchased the land from two orphan boys and participated in the construction himself'
    },
    { 
      titleAr: 'المؤاخاة بين المهاجرين والأنصار', 
      titleEn: 'Brotherhood Between Migrants and Helpers', 
      descAr: 'آخى النبي صلى الله عليه وسلم بين المهاجرين والأنصار، فكان كل أنصاري يشارك أخاه المهاجر في ماله وبيته، نموذج فريد في التكافل',
      descEn: 'The Prophet ﷺ established brotherhood between the Muhajirun and Ansar. Each Ansari shared his wealth and home with his Muhajir brother - a unique model of solidarity'
    },
    { 
      titleAr: 'صحيفة المدينة', 
      titleEn: 'The Constitution of Madinah', 
      descAr: 'وضع النبي صلى الله عليه وسلم وثيقة تنظم العلاقة بين المسلمين واليهود والقبائل، وهي من أوائل الدساتير في التاريخ التي تضمن الحقوق والواجبات',
      descEn: 'The Prophet ﷺ established a document organizing relations between Muslims, Jews, and tribes - one of the earliest constitutions in history guaranteeing rights and duties'
    },
    { 
      titleAr: 'غزوات المدينة', 
      titleEn: 'Battles of Madinah', 
      descAr: 'شهدت المدينة وما حولها غزوات عظيمة مثل بدر وأحد والخندق والأحزاب، وفيها انتصر المسلمون ودافعوا عن دينهم ومدينتهم',
      descEn: 'Madinah and its surroundings witnessed great battles like Badr, Uhud, the Trench, and the Confederates, where Muslims defended their religion and city'
    },
    { 
      titleAr: 'وفاة النبي صلى الله عليه وسلم', 
      titleEn: "The Prophet's Passing", 
      descAr: 'توفي النبي صلى الله عليه وسلم في المدينة المنورة في السنة الحادية عشرة للهجرة، ودُفن في حجرة عائشة رضي الله عنها، ويزوره المسلمون من كل العالم',
      descEn: 'The Prophet ﷺ passed away in Madinah in the 11th year of Hijra and was buried in Aisha\'s chamber (may Allah be pleased with her). Muslims from around the world visit him'
    },
    { 
      titleAr: 'عبر التاريخ الإسلامي', 
      titleEn: 'Through Islamic History', 
      descAr: 'ظلت المدينة المنورة عاصمة للخلافة الراشدة، ثم مركزاً علمياً ودينياً مهماً، وتوسع المسجد النبوي عبر العصور، وبقيت قبلة للمسلمين',
      descEn: 'Madinah remained the capital of the Rightly Guided Caliphate, then an important scholarly and religious center. The Prophet\'s Mosque expanded through the ages, remaining a destination for Muslims'
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

export default MadinahHistory;
