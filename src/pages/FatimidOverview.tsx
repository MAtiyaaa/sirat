import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Landmark,
  BookOpen,
  Globe,
  Coins,
  Ship,
  Network,
  Swords,
  Shield,
  Building2,
  ScrollText,
  Scale,
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

const FatimidOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "الأصول والدعوة الإسماعيلية (297هـ/909م)",
      titleEn: "Origins & Isma'ili Da'wa (909 CE)",
      descAr:
        "قيام الدولة في إفريقية بقيادة عبيد الله المهدي، اعتماد شبكة دعوة واسعة ونهج إمامي مميّز.",
      descEn:
        "State founded in Ifriqiya under ʿUbayd Allāh al-Mahdī; expansive Isma'ili missionary network and distinct Imamate doctrine.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Landmark,
      titleAr: "فتح مصر وتأسيس القاهرة (358هـ/969م)",
      titleEn: "Conquest of Egypt & Founding Cairo (969 CE)",
      descAr:
        "الاستقرار في مصر بعد حملة جوهر الصقلي، وتأسيس القاهرة مركزًا للحكم والإدارة.",
      descEn:
        "After Jawhar al-Ṣiqillī’s campaign, Egypt became the base; Cairo was founded as the new seat of governance.",
      badgeAr: "عاصمة",
      badgeEn: "Capital",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "الأزهر الشريف (359هـ/970م)",
      titleEn: "Al-Azhar (970 CE)",
      descAr:
        "إنشاء الجامع/المؤسسة العلمية التي غدت لاحقًا أحد أهم مراكز العلم في العالم الإسلامي.",
      descEn:
        "Establishment of al-Azhar—later a premier center of learning across the Islamic world.",
      badgeAr: "علم",
      badgeEn: "Learning",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Network,
      titleAr: "شبكات الدعوة والإدارة",
      titleEn: "Missionary & Administrative Networks",
      descAr:
        "تنظيم الدعوة عبر القارات مع جهاز ديواني متقدّم وربط للأقاليم بخطوط بريد ومراسلات.",
      descEn:
        "Missionary operations spanned regions; sophisticated chancery linked provinces via post and correspondence.",
      badgeAr: "حوكمة",
      badgeEn: "Governance",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Coins,
      titleAr: "النقد والتجارة",
      titleEn: "Coinage & Commerce",
      descAr:
        "سكّ نقد قوي وانتعاش موانئ المتوسط والبحر الأحمر، وسيطرة على طرق العبور بين الشرق والغرب.",
      descEn:
        "Robust coinage; thriving Mediterranean and Red Sea ports; key choke-points between east–west trade.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Ship,
      titleAr: "الأسطول والقوة البحرية",
      titleEn: "Fleet & Naval Power",
      descAr:
        "تنمية الأسطول لحماية طرق التجارة والسواحل، وموازنة نفوذ خصوم المتوسط.",
      descEn:
        "Expanded navy secured trade lanes and coasts, counterbalancing Mediterranean rivals.",
      badgeAr: "أسطول",
      badgeEn: "Navy",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Globe,
      titleAr: "مجال النفوذ",
      titleEn: "Sphere of Influence",
      descAr:
        "امتداد نحو الشام والحجاز واليمن وشمال أفريقيا، وتنافس مع العباسيين والبويهيين والسلاجقة.",
      descEn:
        "Influence from the Levant and Ḥijāz to Yemen and North Africa; rivalry with Abbasids, Buyids, and Seljuks.",
      badgeAr: "جغرافيا",
      badgeEn: "Geography",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Building2,
      titleAr: "العمران والفنون",
      titleEn: "Architecture & Arts",
      descAr:
        "طرز زخرفية وخطية مميّزة، عمارة قصور ومساجد وأسوار، ورفاه حضري في القاهرة.",
      descEn:
        "Distinct decorative and epigraphic styles; palatial, mosque, and fortification projects; urban flourish in Cairo.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "السياسة الدينية",
      titleEn: "Religious Policy",
      descAr:
        "إظهار الهوية الإسماعيلية مع مساحة للمدارس الأخرى؛ احتفاليات ومواسم عزّزت الشرعية.",
      descEn:
        "Public Isma'ili identity while accommodating other traditions; ceremonial calendar bolstered legitimacy.",
      badgeAr: "شرعية",
      badgeEn: "Legitimacy",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Swords,
      titleAr: "العلاقات مع الصليبيين",
      titleEn: "Relations with Crusaders",
      descAr:
        "مزيج من المواجهة والتحالف المرحلي بحسب التوازنات في الشام، ولا سيما قبيل العهد الأيوبي.",
      descEn:
        "Alternated between confrontation and tactical alliances in the Levant, especially on the eve of the Ayyubids.",
      badgeAr: "توازنات",
      badgeEn: "Realpolitik",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Scale,
      titleAr: "الأزمات والتحوّلات",
      titleEn: "Strains & Transitions",
      descAr:
        "تقلّبات اقتصادية ونزاعات داخلية وصراعات نفوذ أدّت إلى تراجع المركزية وظهور ولات أقوياء.",
      descEn:
        "Economic swings, internal rivalries, and power-broker viziers eroded central control.",
      badgeAr: "ديناميات",
      badgeEn: "Dynamics",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
    {
      icon: Skull,
      titleAr: "النهاية وسقوط الخلافة (567هـ/1171م)",
      titleEn: "End of the Caliphate (1171 CE)",
      descAr:
        "أنهى صلاح الدين الأيوبي الخلافة الفاطمية في مصر، لتعود الخطبة للعباسيين وتبدأ مرحلة أيوبيّة جديدة.",
      descEn:
        "Ṣalāḥ al-Dīn abolished the Fatimid caliphate in Egypt; allegiance shifted to the Abbasids, ushering in the Ayyubid era.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
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
            {ar ? "الخلافة الفاطمية (297–567هـ / 909–1171م)" : "Fatimid Caliphate (909–1171 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة ترسم صورة الحقبة الفاطمية: الأصول، القاهرة والأزهر، شبكات الدعوة، التجارة والبحرية، المجال الجغرافي، الفنون، السياسات، الأزمات، والنهاية."
            : "Concise cards capturing the Fatimid era: origins, Cairo and al-Azhar, da'wa networks, commerce and navy, sphere of influence, arts, religious policy, strains, and the end."}
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

export default FatimidOverview;
