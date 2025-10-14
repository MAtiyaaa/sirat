import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, History } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MakkahKaabaHistory = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === "ar" ? "تاريخ الكعبة المشرفة" : "History of the Kaaba",
    back: settings.language === "ar" ? "رجوع" : "Back",
    description:
      settings.language === "ar"
        ? "رحلة عبر تاريخ بيت الله الحرام من بنائه إلى يومنا هذا"
        : "A journey through the history of Allah's Sacred House from its construction to today",
  };

  const timeline = [
    {
      titleAr: "بناء آدم عليه السلام",
      titleEn: "Built by Adam (AS)",
      descAr:
        "يُروى أن آدم عليه السلام هو أول من بنى الكعبة بأمر من الله، وكان ذلك أول بيت وُضع للناس في الأرض للعبادة.",
      descEn:
        "It is narrated that Adam (AS) was the first to build the Kaaba by Allah’s command, making it the first house of worship on earth.",
    },
    {
      titleAr: "إعادة بناء إبراهيم وإسماعيل",
      titleEn: "Rebuilt by Ibrahim and Ismail",
      descAr:
        'بعد الطوفان، أمر الله إبراهيم وابنه إسماعيل عليهما السلام برفع قواعد البيت الحرام: "وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ" (البقرة: 127).',
      descEn:
        "After the flood, Allah commanded Ibrahim and his son Ismail (AS) to raise the foundations of the Sacred House (Qur’an 2:127).",
    },
    {
      titleAr: "الحجر الأسود",
      titleEn: "The Black Stone",
      descAr:
        "جاء جبريل عليه السلام بالحجر الأسود من الجنة فوضعه إبراهيم في ركن الكعبة. كان أبيض ثم اسودّ من خطايا بني آدم.",
      descEn:
        "Jibreel (AS) brought the Black Stone from Paradise and Ibrahim placed it in the corner of the Kaaba. It was originally white but turned black from the sins of mankind.",
    },
    {
      titleAr: "دعاء إبراهيم",
      titleEn: "Ibrahim's Prayer",
      descAr:
        'قال: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ" (البقرة: 127)، ودعا أن يبعث الله في ذريته نبيًا فكان محمد ﷺ.',
      descEn:
        "He prayed: “Our Lord, accept [this] from us. Indeed, You are the Hearing, the Knowing” (2:127), and supplicated for a prophet from his progeny—Muhammad ﷺ.",
    },

    // Year of the Elephant
    {
      titleAr: "عام الفيل (~570م)",
      titleEn: "Year of the Elephant (~570 CE)",
      descAr:
        "حاول أبرهة هدم الكعبة بجيشٍ يضم فيلة، فحفظ الله بيته وأرسل عليهم طيرًا أبابيل كما في سورة الفيل (القرآن 105). رسّخ الحدث قُدسية البيت بين العرب.",
      descEn:
        "Abraha marched to demolish the Kaaba with an army including elephants, but Allah protected His House—birds in flocks pelted them (Surah al-Fil, Qur’an 105)—cementing its sanctity.",
    },

    // Quraysh Kiswah policy (annual single covering)
    {
      titleAr: "سياسة قريش في الكسوة: إزالة الكسوات المتراكمة واعتماد السنوية",
      titleEn: "Quraysh Kiswah Policy: Removing Old Layers & Annual Replacement",
      descAr:
        "في الجاهلية تراكمت كسوات متعددة على الكعبة. أزالت قريش الكسوات القديمة لتخفيف الثقل والخطر، ثم اعتمدت كسوة واحدة تُجدد سنويًا، وأصبح تعظيم البيت بكسوة واحدة عادة راسخة.",
      descEn:
        "In pre-Islamic times, multiple Kiswah layers accumulated on the Kaaba. Quraysh removed the old coverings to reduce weight and risk, adopting a single Kiswah renewed annually—setting a lasting practice.",
    },

    // Ground-up reconstructions (from the foundations)
    {
      titleAr: "إعادة بناء قريش من الأساس (~605م)",
      titleEn: "Quraysh Ground-Up Rebuild (~605 CE)",
      descAr:
        "بعد تَصدُّع الكعبة، هدمتها قريش حتى الأساس وأعادت بناءها، ورفعت الباب، ولم تُدخل الحِجْر، وحَكَمَ النبي ﷺ شابًا في وضع الحجر الأسود فجمع القبائل على رضًا.",
      descEn:
        "After structural damage, Quraysh demolished the Kaaba down to the foundations and rebuilt it, raising the door and excluding the Hijr. Young Muhammad ﷺ resolved the Black Stone dispute with wisdom.",
    },

    {
      titleAr: "فتح مكة (8 هـ / 630م)",
      titleEn: "The Conquest of Makkah (8 AH / 630 CE)",
      descAr: "دخل النبي ﷺ مكة وطهّر الكعبة من الأصنام وأبطل الشعائر الوثنية حولها.",
      descEn:
        "The Prophet ﷺ entered Makkah, purified the Kaaba of idols, and abolished the pagan rites surrounding it.",
    },

    {
      titleAr: "إعادة بناء ابن الزبير من الأساس (683م)",
      titleEn: "Ibn al-Zubayr Ground-Up Reconstruction (683 CE)",
      descAr:
        "بعد احتراقها خلال حصار مكة، هدم عبد الله بن الزبير الكعبة حتى القواعد وبناها على قواعد إبراهيم، وأدخل الحِجْر وجعل لها بابين على الأرض كما تمنى النبي ﷺ.",
      descEn:
        "After a fire during the siege of Makkah, ʿAbdullah ibn al-Zubayr demolished the Kaaba to the foundations and rebuilt it on Ibrahim’s footprint, including the Hijr and adding two ground-level doors as the Prophet ﷺ had wished.",
    },

    {
      titleAr: "بناء الحجاج في عهد عبد الملك (693م)",
      titleEn: "Al-Hajjaj/ʿAbd al-Malik Reconstruction (693 CE)",
      descAr:
        "بأمر الخليفة عبد الملك، أعاد الحجاج بناء الكعبة على هيئة قريش السابقة، فأخرج الحِجْر وأبقى بابًا واحدًا مرتفعًا.",
      descEn:
        "By order of Caliph ʿAbd al-Malik, al-Hajjaj rebuilt the Kaaba to the earlier Quraysh layout—removing the Hijr from the enclosed structure and restoring a single raised door.",
    },

    {
      titleAr: "إعادة البناء العثمانية بعد السيل (1629م)",
      titleEn: "Ottoman Ground-Up Reconstruction after Flood (1629 CE)",
      descAr:
        "تسبّبت السيول بانهيارات كبيرة، فأُعيد بناء جدران الكعبة من الأساس في العهد العثماني مع تقوية الدعائم واستبدال الأسقف والأخشاب.",
      descEn:
        "Severe flooding caused major collapses; under the Ottomans the Kaaba’s walls were rebuilt from the foundations, with reinforced supports and new roofing/timbers.",
    },

    // Modern large-scale restoration (not ground-up)
    {
      titleAr: "الترميم الشامل الحديث (1996–1997م)",
      titleEn: "Comprehensive Modern Restoration (1996–1997)",
      descAr:
        "أكبر عملية ترميم حديثة دون هدم من الأساس: ترقيم الأحجار وتنظيفها، تدعيم الجدران والقواعد، واستبدال السقف والأخشاب مع الإبقاء على مواضع الأحجار الأصلية.",
      descEn:
        "The most extensive modern restoration (not from the ground up): stones were numbered and cleaned, walls and foundation reinforced, and the roof/timbers replaced while preserving the original stone positions.",
    },

    {
      titleAr: "كسوة الكعبة اليوم",
      titleEn: "The Kiswah Today",
      descAr: "تُصنع الكسوة من الحرير الأسود الموشّى بالذهب وتُبدّل سنويًا يوم عرفة تعظيمًا لبيت الله.",
      descEn:
        "The Kiswah is black silk embroidered with gold and is replaced annually on the Day of Arafah to honor Allah’s House.",
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
                  {settings.language === "ar" ? event.titleAr : event.titleEn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{settings.language === "ar" ? event.descAr : event.descEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakkahKaabaHistory;
