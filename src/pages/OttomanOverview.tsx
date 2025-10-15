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
  Ship,
  Map,
  Coins,
  Scale,
  Building2,
  BookOpen,
  Network,
  ScrollText,
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

const OttomanOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "البدايات والبيليك العثماني (أواخر القرن 7هـ/13م)",
      titleEn: "Beginnings as an Anatolian Beylik (late 13th c.)",
      descAr:
        "نشأة تحت قيادة عثمان بن أرطغرل على تخوم بيزنطة، توسّع تدريجي وتحوّل من إمارة حدودية إلى دولة.",
      descEn:
        "Founded by Osman I on the Byzantine frontier; gradual expansion from a frontier beylik into a state.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Landmark,
      titleAr: "فتح القسطنطينية (857هـ/1453م)",
      titleEn: "Conquest of Constantinople (1453 CE)",
      descAr:
        "محمد الفاتح أنهى الإمبراطورية البيزنطية واتخذ إسطنبول عاصمةً، فُتِحت مرحلة إمبراطورية جديدة.",
      descEn:
        "Mehmed II ended Byzantium and made Istanbul the capital, inaugurating a new imperial phase.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Swords,
      titleAr: "التوسّع البري",
      titleEn: "Land Expansion",
      descAr:
        "البلقان والمجر والأناضول والشام ومصر والحجاز وشمال أفريقيا؛ ترسيم سلطة واسعة عبر ولايات وإيالات.",
      descEn:
        "Balkans, Hungary, Anatolia, Levant, Egypt, Hijaz, and North Africa; vast governance via provinces and eyalets.",
      badgeAr: "الفتوحات",
      badgeEn: "Conquests",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Ship,
      titleAr: "القوة البحرية",
      titleEn: "Naval Power",
      descAr:
        "هيمنة في شرق المتوسط والبحر الأسود، صدامات كبرى مثل ليبانتو، وتنافس مع قوى أوروبية.",
      descEn:
        "Dominance in the Eastern Mediterranean and Black Sea; major clashes like Lepanto; rivalry with European powers.",
      badgeAr: "أسطول",
      badgeEn: "Navy",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Shield,
      titleAr: "الإنكشارية والدوشيرمة",
      titleEn: "Janissaries & Devshirme",
      descAr:
        "نظام تجنيد خاص كوّن نخبة عسكرية وإدارية؛ لاحقًا صار مصدر توتر وإصلاحات جذرية.",
      descEn:
        "A levy creating elite military–administrative corps; later a source of tension prompting radical reforms.",
      badgeAr: "عسكر",
      badgeEn: "Military",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Scale,
      titleAr: "نظام الملل والإدارة",
      titleEn: "Millet System & Administration",
      descAr:
        "تنظيم الجماعات الدينية تحت زعامات معترف بها؛ إدارة متعددة اللغات والثقافات لضبط إمبراطورية واسعة.",
      descEn:
        "Religious communities organized under recognized leaders; multi-lingual, multi-cultural governance across a vast empire.",
      badgeAr: "حوكمة",
      badgeEn: "Governance",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Coins,
      titleAr: "التمليك/التيمار والاقتصاد",
      titleEn: "Timar System & Economy",
      descAr:
        "نظام إقطاع عسكري مرتبط بالإيرادات الريفية؛ شبكات تجارة متوسطية وبرية ربطت الأناضول بالبلقان والعالم العربي.",
      descEn:
        "Military fiefs tied to agrarian revenues; Mediterranean and overland trade linking Anatolia, the Balkans, and Arab lands.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Building2,
      titleAr: "العمران والفنون",
      titleEn: "Architecture & Arts",
      descAr:
        "مساجد ومدارس وجسور وخانات؛ معمار سنان مثال للذروة الكلاسيكية في إسطنبول وأدرنة.",
      descEn:
        "Mosques, madrasas, bridges, and caravanserais; Mimar Sinan epitomizes the classical zenith in Istanbul and Edirne.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "سليمان القانوني والذروة (926–974هـ/1520–1566م)",
      titleEn: "Suleiman the Magnificent (1520–1566)",
      descAr:
        "اتساع إقليمي وتشريع وتنظيم قضائي؛ توازن بين الجهاد والدبلوماسية والهيبة الثقافية.",
      descEn:
        "Territorial reach with legal codification and judicial order; balance of warfare, diplomacy, and cultural prestige.",
      badgeAr: "ذروة",
      badgeEn: "Apex",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Network,
      titleAr: "الدبلوماسية والتحالفات",
      titleEn: "Diplomacy & Alliances",
      descAr:
        "علاقات مع فرنسا والجمهوريات الإيطالية، واتفاقات هدنة وحماية طرق التجارة.",
      descEn:
        "Ententes with France and Italian republics; truces and capitulations shaping trade and geopolitics.",
      badgeAr: "علاقات",
      badgeEn: "Diplomacy",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "الإصلاحات والتنظيمات (1808–1876م)",
      titleEn: "Reforms & Tanzimat (1808–1876)",
      descAr:
        "تفكيك الإنكشارية، تحديث الجيش والقانون والإدارة والضرائب، وسعي لإعادة مركزية الدولة.",
      descEn:
        "Abolition of the Janissaries; modernization of army, law, administration, and taxation; efforts to recentralize.",
      badgeAr: "إصلاح",
      badgeEn: "Reform",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأفول والنهاية (1908–1922م)",
      titleEn: "Decline & End (1908–1922)",
      descAr:
        "أزمات قومية وحروب كبرى وانهيارات إقليمية بلغت ذروتها بعد الحرب العالمية الأولى، وانتهت بإنهاء السلطنة.",
      descEn:
        "Nationalist crises, great wars, and territorial losses culminating after WWI, ending with the abolition of the sultanate.",
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
            {ar ? "الدولة العثمانية (حوالي 699–1341هـ / 1299–1922م)" : "Ottoman Empire (c. 1299–1922 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لحقبة الدولة العثمانية: النشأة، فتح القسطنطينية، التوسّع والبحرية، الجيش والملل، التيمار والاقتصاد، العمران والفنون، ذروة سليمان، الدبلوماسية، التنظيمات، والأفول."
            : "Concise cards for the Ottoman era: origins, Constantinople, expansion and navy, military and millets, timar and economy, architecture, Suleiman’s apex, diplomacy, Tanzimat reforms, and decline."}
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

export default OttomanOverview;
