import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Swords,
  Landmark,
  Building2,
  FlaskConical,
  BookOpen,
  Map,
  Coins,
  Shield,
  Skull,
  Route,
  Globe,
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

const TimuridOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "التأسيس: تيمور لنك (771هـ/1370م)",
      titleEn: "Foundation: Tīmūr (Tamerlane) (1370 CE)",
      descAr:
        "صعود قائد تركي-مغولي من ما وراء النهر، وحّد ما حول سمرقند مؤسِّسًا دولة مقاتلة واسعة.",
      descEn:
        "A Turco-Mongol commander from Transoxiana rose to unify lands around Samarkand, founding a formidable conquest state.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Swords,
      titleAr: "حملات التوسّع",
      titleEn: "Campaigns of Expansion",
      descAr:
        "غزوات إلى خراسان وإيران والعراق والقوقاز والأناضول والهند؛ صياغة هيبة عسكرية رادعة.",
      descEn:
        "Campaigns into Khurasan, Iran, Iraq, the Caucasus, Anatolia, and India forged a fearsome military reputation.",
      badgeAr: "الفتوحات",
      badgeEn: "Conquests",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Landmark,
      titleAr: "سمرقند العاصمة",
      titleEn: "Samarkand as Capital",
      descAr:
        "جعل سمرقند مركز الحكم والهيبة؛ مشاريع عمرانية واسعة وطرق لإمداد الحرف والفنون.",
      descEn:
        "Samarkand became the political and symbolic center, with grand urban projects and patronage of crafts and arts.",
      badgeAr: "عاصمة",
      badgeEn: "Capital",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Building2,
      titleAr: "نهضة فنية ومعمارية",
      titleEn: "Artistic & Architectural Renaissance",
      descAr:
        "قِباب ومآذن مزخرفة وخزف لازوردي ومدارس؛ إرث بصري مؤثّر امتد لاحقًا إلى هرات وإصفهان ودلهي.",
      descEn:
        "Glazed azure tiles, lofty domes and madrasas; a visual idiom later echoed in Herat, Isfahan, and Delhi.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: FlaskConical,
      titleAr: "العلم والرصد: أولوغ بيك",
      titleEn: "Science & Astronomy: Ulugh Beg",
      descAr:
        "راعية للعلوم في سمرقند؛ مرصد أولوغ بيك وجداول فلكية دقيقة تركت أثرًا طويلًا.",
      descEn:
        "State patronage saw Ulugh Beg’s observatory in Samarkand produce influential astronomical tables.",
      badgeAr: "علوم",
      badgeEn: "Science",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Map,
      titleAr: "أنقرة (804هـ/1402م) وإعادة تشكيل الأناضول",
      titleEn: "Ankara (1402) & Reordering Anatolia",
      descAr:
        "هزيمة بايزيد الأول شتّتت العثمانيين مؤقتًا وبدّلت موازين القوى بالأناضول.",
      descEn:
        "Defeat of Bayezid I fractured the Ottomans temporarily, reshaping Anatolian power balances.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Shield,
      titleAr: "الجيش والتكتيك",
      titleEn: "Army & Tactics",
      descAr:
        "قوات مركّبة من فرسان وخيّالة وسلاح حصار؛ مناورة مرنة وتعبئة قبلية/إقطاعية.",
      descEn:
        "Composite forces of cavalry, horse archers, and siege craft; flexible maneuver with tribal/iqṭāʿ mobilization.",
      badgeAr: "عسكر",
      badgeEn: "Military",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Coins,
      titleAr: "الاقتصاد وطريق الحرير",
      titleEn: "Economy & Silk Road",
      descAr:
        "رعاية التجارة عبر سُبل القوافل وخانات، وجبايات مدروسة لتمويل البلاط والمشاريع.",
      descEn:
        "Caravan routes and caravanserais underwritten long-distance trade; fiscal systems funded court and works.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Globe,
      titleAr: "هرات مركزًا ثقافيًا",
      titleEn: "Herat as a Cultural Center",
      descAr:
        "ازدهار الأدب والرسم والمنمنمات في هرات خاصةً بعهد شاهرخ؛ دائرة فنية أثّرت في إيران والهند.",
      descEn:
        "Herat blossomed—literature and miniature painting flourished under Shāhrukh, radiating influence to Iran and India.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Route,
      titleAr: "الخلافة والتعاقب بعد تيمور",
      titleEn: "Succession After Timur",
      descAr:
        "نزاعات أبناء وأحفاد تيمور قسّمت السلطة بين سمرقند وهرات، وتراجُع السيطرة على الأطراف.",
      descEn:
        "Contests among Timur’s heirs split power between Samarkand and Herat, loosening control over frontiers.",
      badgeAr: "وراثة",
      badgeEn: "Succession",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأفول والورثة (912هـ/1507م)",
      titleEn: "Decline & Successors (1507 CE)",
      descAr:
        "انتهت الهيمنة في ما وراء النهر أمام الأوزبك الشيبانيين؛ قاد بابُر الفرع التيموري لاحقًا لتأسيس المغول بالهند.",
      descEn:
        "Shaybanid Uzbeks ended Timurid rule in Transoxiana; Timurid prince Bābur later founded the Mughals in India.",
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
            {ar ? "الدولة التيمورية (771–912هـ / 1370–1507م)" : "Timurid Empire (1370–1507 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لحقبة التيموريين: التأسيس وحملات التوسّع وسمرقند والنهضة العمرانية والعلمية، أنقرة، الجيش والاقتصاد، هرات الثقافية، تعاقب الحكم، والنهاية."
            : "Concise cards on the Timurids: foundation, campaigns, Samarkand and the artistic–scientific renaissance, Ankara, army and economy, Herat’s culture, succession, and the end."}
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

export default TimuridOverview;
