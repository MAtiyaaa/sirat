import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Landmark,
  Swords,
  Shield,
  Scale,
  Coins,
  Building2,
  Network,
  BookOpen,
  Globe,
  Ship,
  Skull,
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

const SafavidOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "إسماعيل الصفوي وبداية الدولة (907هـ/1501م)",
      titleEn: "Ismāʿīl I & Foundation (1501 CE)",
      descAr:
        "انتقال الطريقة الصفوية إلى مُلك سياسي؛ إعلان التشيّع الاثني عشري وإعادة رسم الخريطة الإيرانية.",
      descEn:
        "Safavid Sufi order evolved into a polity; Twelver Shiʿism declared and Iran’s political map redefined.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Scale,
      titleAr: "التشيّع مذهب الدولة",
      titleEn: "Twelver Shi‘ism as State Creed",
      descAr:
        "ترسيخ المذهب عبر العلماء والمؤسسات القضائية والتعليمية ونشر الهوية المذهبية في الأقاليم.",
      descEn:
        "State-backed clerical, judicial, and educational institutions embedded Shiʿi identity across provinces.",
      badgeAr: "عقيدة",
      badgeEn: "Creed",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Swords,
      titleAr: "چالديران (920هـ/1514م) مع العثمانيين",
      titleEn: "Chaldiran vs. Ottomans (1514 CE)",
      descAr:
        "هزيمة مفصلية قلّصت التوسع الصفوي وأظهرت ضرورة تبنّي سلاح النار وتنظيم الجيش.",
      descEn:
        "A decisive defeat curbed expansion and underscored the need for gunpowder and army reorganization.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
    {
      icon: Shield,
      titleAr: "القِزلباش والغِلْمان وإصلاح الجند",
      titleEn: "Qizilbash, Ghulāms & Military Reform",
      descAr:
        "توازن بين نخب القزلباش التركمان وقوات غلمان قوقازيين مماليك لتقوية المركز وضبط الأقاليم.",
      descEn:
        "Balanced Turkmen Qizilbash elites with Caucasian ghulām slave-soldiers to bolster central authority.",
      badgeAr: "عسكر",
      badgeEn: "Military",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Landmark,
      titleAr: "عباس الأول ونقل العاصمة إلى أصفهان (1006هـ/1598م)",
      titleEn: "ʿAbbās I & Isfahan Capital (1598 CE)",
      descAr:
        "إعادة بناء الدولة وإصلاحات عسكرية واقتصادية، وتحويل أصفهان إلى مركز سياسي وثقافي مزدهر.",
      descEn:
        "State consolidation with military–fiscal reforms; transformed Isfahan into a vibrant political–cultural capital.",
      badgeAr: "إدارة",
      badgeEn: "Administration",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Building2,
      titleAr: "أصفهان: نصفُ العالم",
      titleEn: "Isfahan: Half the World",
      descAr:
        "مجمّع نقش جهان، قصور وجوامع وأسواق وجسور؛ ذروة الذائقة الصفوية في العمران والفنون.",
      descEn:
        "Naqsh-e Jahan ensemble—palaces, mosques, bazaars, bridges—epitomizing Safavid architectural and artistic zenith.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Coins,
      titleAr: "التجارة والحرير وجلفا الجديدة",
      titleEn: "Trade, Silk & New Julfa",
      descAr:
        "تنظيم تجارة الحرير واستقدام أرمن جلفا إلى أصفهان؛ شبكات وساطة ربطت الخليج والبحر الأسود والبحر المتوسط.",
      descEn:
        "Regulated silk trade and relocated Armenian merchants to Isfahan’s New Julfa; intermediaries linked Gulf, Black Sea, and Mediterranean.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Ship,
      titleAr: "الخليج والعلاقات الأوروبية",
      titleEn: "The Gulf & European Ties",
      descAr:
        "تعاونات مع البرتغاليين ثم الإنجليز/الهولنديين، وصراع على الموانئ والمضائق الحيوية.",
      descEn:
        "Shifting alliances with Portuguese then English/Dutch; contests over strategic Gulf ports and straits.",
      badgeAr: "بحرية/تجارة",
      badgeEn: "Maritime/Trade",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Network,
      titleAr: "الحدود والتوازنات مع العثمانيين والأوزبك",
      titleEn: "Frontiers vs. Ottomans & Uzbeks",
      descAr:
        "معاهدات وحدود متغيّرة في القوقاز والعراق وخراسان؛ سياسة توازن دائم على الأطراف.",
      descEn:
        "Shifting borders and treaties across the Caucasus, Iraq, and Khurasan; perpetual balancing on contested frontiers.",
      badgeAr: "جغرافيا",
      badgeEn: "Geopolitics",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "الثقافة والفنون",
      titleEn: "Culture & Arts",
      descAr:
        "مدارس خط ومنمنمات وموسيقى وصناعات؛ رعاية رسمية صاغت ذائقة فارسية بارزة.",
      descEn:
        "Calligraphy, miniature painting, music, and crafts under court patronage shaped a distinctive Persian aesthetic.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Globe,
      titleAr: "التنوع الاجتماعي",
      titleEn: "Social Diversity",
      descAr:
        "تعايش جماعات فارسية وقوقازية وتركمانية وأرمنية ويهودية ضمن بنى حضرية وتجارية متعددة.",
      descEn:
        "Persian, Caucasian, Turkmen, Armenian, and Jewish communities coexisted within layered urban–commercial structures.",
      badgeAr: "اجتماع",
      badgeEn: "Society",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأفول والسقوط (1135–1149هـ / 1722–1736م)",
      titleEn: "Decline & Fall (1722–1736 CE)",
      descAr:
        "أزمة داخلية وغزو أفغاني أسقط أصفهان؛ برز نادر شاه لاحقًا وأنهى السلالة الصفوية.",
      descEn:
        "Internal crises and Afghan invasion toppled Isfahan; Nādir Shāh’s rise subsequently ended the Safavid line.",
      badgeAr: "نهاية",
      badgeEn: "End",
      gradient: "from-red-500/10 via-orange-400/10 to-rose-500/10",
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
            {ar ? "الدولة الصفوية (907–1149هـ / 1501–1736م)" : "Safavid Empire (1501–1736 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة ترسم ملامح الصفويين: التأسيس والعقيدة، چالديران، الجيش والإصلاح، أصفهان والعمران، التجارة والحرير، الخليج والعلاقات الأوروبية، التوازنات الحدودية، الثقافة والمجتمع، والأفول."
            : "Concise cards on the Safavids: foundation and creed, Chaldiran, military reforms, Isfahan and architecture, silk and trade, Gulf–European ties, frontier balances, culture and society, and decline."}
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

export default SafavidOverview;
