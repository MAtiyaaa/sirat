import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import {
  ArrowLeft,
  Crown,
  Swords,
  Shield,
  Globe,
  Landmark,
  Building2,
  Mountain,
  ScrollText,
  Map,
  Pyramid,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EmpireCard = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  link: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  start: number; // start year for chronological sorting
};

const IslamicEmpires = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const cards: EmpireCard[] = [
    // 632
    {
      icon: Swords,
      titleAr: "الخلافة الراشدة",
      titleEn: "Rashidun Caliphate",
      descAr: "اتساع سريع بعد عصر النبوة",
      descEn: "Rapid expansion after the Prophetic era",
      link: "/empires/rashidun",
      gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
      start: 632,
    },
    // 661
    {
      icon: Crown,
      titleAr: "الخلافة الأموية",
      titleEn: "Umayyad Caliphate",
      descAr: "أكبر إمبراطورية إسلامية متصلة في ذروتها",
      descEn: "Largest contiguous Islamic empire at its peak",
      link: "/empires/umayyad",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      start: 661,
    },
    // 750
    {
      icon: Landmark,
      titleAr: "الخلافة العباسية",
      titleEn: "Abbasid Caliphate",
      descAr: "عصر الازدهار العلمي وبغداد مركز العالم",
      descEn: "Golden age of learning with Baghdad at the center",
      link: "/empires/abbasid",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      start: 750,
    },
    // 909
    {
      icon: Landmark,
      titleAr: "الخلافة الفاطمية",
      titleEn: "Fatimid Caliphate",
      descAr: "قاهرة العلم والتجارة في العصور الوسطى",
      descEn: "Cairo’s medieval hub of learning and trade",
      link: "/empires/fatimid",
      gradient: "from-rose-500/20 via-red-400/20 to-orange-500/20",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      start: 909,
    },
    // 1037
    {
      icon: Globe,
      titleAr: "السلاجقة العظام",
      titleEn: "Great Seljuk Empire",
      descAr: "قوة تركية فارسية أعادت تشكيل المشرق",
      descEn: "Turko-Persian power reshaping the Middle East",
      link: "/empires/seljuk",
      gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600 dark:text-sky-400",
      start: 1037,
    },
    // 1147
    {
      icon: Pyramid,
      titleAr: "الموحدون",
      titleEn: "Almohad Caliphate",
      descAr: "المغرب والأندلس تحت منظومة واحدة",
      descEn: "Maghreb & al-Andalus under one polity",
      link: "/empires/almohad",
      gradient: "from-lime-500/20 via-green-400/20 to-emerald-500/20",
      iconBg: "bg-lime-500/10",
      iconColor: "text-lime-600 dark:text-lime-400",
      start: 1147,
    },
    // 1206
    {
      icon: Map,
      titleAr: "سلطنة دلهي",
      titleEn: "Delhi Sultanate",
      descAr: "سلالات متعددة شكلت تاريخ شمال الهند",
      descEn: "Multi-dynastic power shaping North India",
      link: "/empires/delhi-sultanate",
      gradient: "from-yellow-500/20 via-amber-400/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      start: 1206,
    },
    // 1299
    {
      icon: Shield,
      titleAr: "الدولة العثمانية",
      titleEn: "Ottoman Empire",
      descAr: "أطول الخلافات عمراً وتأثيراً",
      descEn: "The longest-lasting great Islamic empire",
      link: "/empires/ottoman",
      gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      start: 1299,
    },
    // 1370
    {
      icon: Mountain,
      titleAr: "الدولة التيمورية",
      titleEn: "Timurid Empire",
      descAr: "راعية للفنون والعمارة من سمرقند",
      descEn: "Patron of arts & architecture from Samarkand",
      link: "/empires/timurid",
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
      start: 1370,
    },
    // 1501
    {
      icon: ScrollText,
      titleAr: "الدولة الصفوية",
      titleEn: "Safavid Empire",
      descAr: "إعادة تشكيل إيران سياسياً ومذهبياً",
      descEn: "Reshaped Iran’s politics & confession",
      link: "/empires/safavid",
      gradient: "from-fuchsia-500/20 via-rose-400/20 to-pink-500/20",
      iconBg: "bg-fuchsia-500/10",
      iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
      start: 1501,
    },
    // 1526
    {
      icon: Building2,
      titleAr: "الإمبراطورية المغولية (الهند)",
      titleEn: "Mughal Empire",
      descAr: "قوة شبه القارة وعمارتها الخالدة",
      descEn: "Subcontinental power & enduring architecture",
      link: "/empires/mughal",
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      start: 1526,
    },
  ];

  const sorted = [...cards].sort((a, b) => a.start - b.start);

  const content = {
    title: isArabic ? "الإمبراطوريات الإسلامية عبر التاريخ" : "Islamic Empires",
    back: isArabic ? "رجوع" : "Back",
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph hover:neomorph-pressed"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{content.title}</h1>
        </div>

        <div className="grid gap-4">
          {sorted.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} onClick={() => navigate(card.link)} className="cursor-pointer group">
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                  />
                  <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                      >
                        <Icon className={`h-7 w-7 ${card.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {isArabic ? card.titleAr : card.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? card.descAr : card.descEn}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IslamicEmpires;
