import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Landmark,
  Swords,
  Map,
  Coins,
  Building2,
  BookOpen,
  Network,
  Shield,
  Skull,
  ScrollText,
} from "lucide-react";

type TItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  gradient?: string;
};

const DelhiSultanateOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "التأسيس: قطب الدين أيبك (602هـ/1206م)",
      titleEn: "Foundation: Quṭb al-Dīn Aybak (1206 CE)",
      descAr:
        "قائد مملوكي ورث نفوذ الغوريين في شمال الهند وأرسى نواة السلطنة في دلهي.",
      descEn:
        "A Mamluk commander inheriting Ghurid domains in North India, laying the Delhi Sultanate’s foundations.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Landmark,
      titleAr: "إلتمش وتوطيد الحكم (607–633هـ/1211–1236م)",
      titleEn: "Iltutmish Consolidation (1211–1236)",
      descAr:
        "الاعتراف بالخلافة، ضرب السكة، تنظيم الولايات والحاميات، وترسيخ مركز دلهي.",
      descEn:
        "Caliphal recognition, stable coinage, provincial and garrison organization, and Delhi’s emergence as a firm center.",
      badgeAr: "ترسيخ",
      badgeEn: "Consolidation",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Swords,
      titleAr: "علاء الدين خلجي والإصلاح العسكري والمالي",
      titleEn: "ʿAlāʾ al-Dīn Khaljī: Military & Fiscal Reforms",
      descAr:
        "ضبط الأسعار، إحصاء الأراضي والضرائب، صد الغزوات المغولية، والتوسع نحو الدكن.",
      descEn:
        "Price controls, land and revenue surveys, repulsing Mongol raids, and expansion into the Deccan.",
      badgeAr: "إصلاح",
      badgeEn: "Reform",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Map,
      titleAr: "تغلق: تجارب وسياسات كبرى",
      titleEn: "Tughluqs: Grand Experiments",
      descAr:
        "محمد بن تغلق نقل العاصمة وجرّب عملة نحاسية وضرائب موسّعة؛ سياسات أحدثت اضطرابًا واسعًا.",
      descEn:
        "Muḥammad bin Tughluq’s capital shift, token currency trials, and expansive taxation—ambitious but destabilizing.",
      badgeAr: "سياسات",
      badgeEn: "Policies",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Shield,
      titleAr: "الدفاع ضد المغول",
      titleEn: "Defense Against Mongols",
      descAr:
        "تحصين الحدود ونُظُم الحاميات، مواجهات متكررة حافظت على قلب السلطنة.",
      descEn:
        "Frontier fortifications and garrison systems checked repeated incursions, safeguarding the core.",
      badgeAr: "عسكر",
      badgeEn: "Military",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Coins,
      titleAr: "النظام المالي والإقطاع",
      titleEn: "Revenue System & Iqṭāʿ",
      descAr:
        "إقطاعات للجند وإدارة أرضية متدرّجة، أسواق نشطة تربط دلهي بالمرافئ والداخل.",
      descEn:
        "Military iqṭāʿs and tiered land administration; vibrant markets linking Delhi to ports and hinterlands.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Building2,
      titleAr: "العمران: قطب منار والمساجد",
      titleEn: "Architecture: Qutb Minar & Mosques",
      descAr:
        "تقاليد معمارية مزجت عناصر هندية وإسلامية؛ مجمع قطب أبرز شواهد الفترة المبكرة.",
      descEn:
        "A hybrid Indo-Islamic idiom; the Qutb complex emblematic of early Sultanate monumentalism.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "الثقافة واللغة والتصوف",
      titleEn: "Culture, Language, and Sufism",
      descAr:
        "الفارسية لغة ديوان، نشوء هندوية/أردية مبكّرة، نشاط طرق صوفية كالجشتية عزّز التبادل الثقافي.",
      descEn:
        "Persian as chancery language, early Hindavi/Urdu formations, and Sufi orders (e.g., Chishtis) shaping cultural exchange.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Network,
      titleAr: "تشظّي الولايات وسلالات إقليمية",
      titleEn: "Provincial Splintering & Dynasties",
      descAr:
        "بنغال والدكن والبهمنيون وسلاطين الغجرات؛ صعود كيانات محلية مع بقاء رمز دلهي.",
      descEn:
        "Bengal, Deccan Bahmanis, and Gujarat sultanates; regional powers rose while Delhi retained symbolic primacy.",
      badgeAr: "أقاليم",
      badgeEn: "Provinces",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Skull,
      titleAr: "صدمة تيمور (801هـ/1398م)",
      titleEn: "Timur’s Sack (1398 CE)",
      descAr:
        "غزو تيمور هزّ المركز وأضعف دلهي، وأعاد تشكيل موازين القوى في الشمال.",
      descEn:
        "Timur’s invasion shattered the capital, weakening Delhi and realigning northern power balances.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-red-500/10 via-orange-400/10 to-rose-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "اللوديون والإصلاحات المتأخرة",
      titleEn: "Lodis & Late Reforms",
      descAr:
        "محاولات إدارية وعسكرية لاستعادة الهيبة، لكن تحديات الولايات والخصوم استمرت.",
      descEn:
        "Administrative and military efforts to restore prestige under the Lodis, amid persistent provincial and external challenges.",
      badgeAr: "إدارة",
      badgeEn: "Administration",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Swords,
      titleAr: "نهاية السلطنة وبداية المغول (932هـ/1526م)",
      titleEn: "End of Sultanate, Rise of Mughals (1526 CE)",
      descAr:
        "هُزِم إبراهيم لودي في بانيبات على يد بابر، لتبدأ الإمبراطورية المغولية في الهند.",
      descEn:
        "Ibrāhīm Lodi fell to Bābur at Panipat, ushering in the Mughal Empire in India.",
      badgeAr: "خاتمة",
      badgeEn: "Conclusion",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 glass-effect hover:glass-effect-hover"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {ar ? "سلطنة دلهي (603–932هـ / 1206–1526م)" : "Delhi Sultanate (1206–1526 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لحقبة سلطنة دلهي: التأسيس، الترسّيخ، إصلاحات الخلجيين، تجارب التغلق، الدفاع ضد المغول، الاقتصاد والعمران، الثقافة والتصوف، التشظّي الإقليمي، صدمة تيمور، إصلاحات اللوديين، والخاتمة في بانيبات."
            : "Concise cards for the Delhi Sultanate: foundation, consolidation, Khalji reforms, Tughluq experiments, Mongol defense, economy and architecture, culture and Sufism, regional splintering, Timur’s sack, Lodi reforms, and the Panipat conclusion."}
        </p>

        <div className="grid gap-4">
          {items.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    t.gradient ?? "from-amber-500/10 via-indigo-400/10 to-emerald-500/10"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {ar ? t.titleAr : t.titleEn}
                        </h3>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                          {ar ? t.badgeAr : t.badgeEn}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ar ? t.descAr : t.descEn}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DelhiSultanateOverview;
