import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Flame,
  Globe,
  Landmark,
  Coins,
  Building2,
  Ship,
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

const UmayyadOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    // Founder
    {
      icon: Crown,
      titleAr: "معاوية بن أبي سفيان (مؤسّس الدولة الأموية)",
      titleEn: "Muʿāwiya ibn Abī Sufyān (Founder of the Umayyads)",
      descAr:
        "نقل مركز الحكم إلى دمشق، رسّخ نظام الخلافة الوراثية، اعتمد الدبلوماسية وإدارة فعّالة، ووطّد الأسطول.",
      descEn:
        "Shifted the capital to Damascus, established hereditary succession, emphasized diplomacy and efficient governance, and strengthened the navy.",
      badgeAr: "المؤسِّس",
      badgeEn: "Founder",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    // Fitnas
    {
      icon: Flame,
      titleAr: "الفتنة الأولى (656–661م)",
      titleEn: "First Fitna (656–661 CE)",
      descAr:
        "صراع داخلي سابق على قيام الدولة الأموية؛ انتهى بتنازل الحسن بن علي لمعاوية وتوحّد الحكم.",
      descEn:
        "Early civil war preceding Umayyad rule; concluded with Ḥasan ibn ʿAlī’s abdication to Muʿāwiya, unifying authority.",
      badgeAr: "صراع داخلي",
      badgeEn: "Civil Strife",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
    {
      icon: Flame,
      titleAr: "الفتنة الثانية (680–692م)",
      titleEn: "Second Fitna (680–692 CE)",
      descAr:
        "نزاعات على الخلافة بعد يزيد بن معاوية، أحداث كربلاء، وحسم عبد الملك بن مروان الصراع وتثبيت الحكم.",
      descEn:
        "Succession crises after Yazīd I; includes Karbalāʾ. ʿAbd al-Malik ibn Marwān ultimately prevailed and consolidated Umayyad control.",
      badgeAr: "صراع داخلي",
      badgeEn: "Civil Strife",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Flame,
      titleAr: "الفتنة الثالثة (744–750م)",
      titleEn: "Third Fitna (744–750 CE)",
      descAr:
        "اضطرابات أواخر الدولة، تنافس داخلي وإقليمي مهّد لسقوط الأمويين وقيام العباسيين.",
      descEn:
        "Late-period turmoil—internal and regional contests that paved the way for the Umayyad fall and Abbasid rise.",
      badgeAr: "صراع داخلي",
      badgeEn: "Civil Strife",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    // Themes
    {
      icon: Globe,
      titleAr: "التوسّع الجغرافي",
      titleEn: "Geographic Expansion",
      descAr:
        "امتداد نحو المغرب والأندلس غربًا، و Transoxiana والسند شرقًا؛ توطيد ولايات واسعة تحت إدارة مركزية.",
      descEn:
        "Expansion into the Maghreb and al-Andalus in the west, and Transoxiana and Sind in the east; large provinces tied to a central administration.",
      badgeAr: "الفتوحات",
      badgeEn: "Conquests",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "العَرْبنة والإدارة",
      titleEn: "Arabization & Administration",
      descAr:
        "تعريب الدواوين تدريجيًا، توحيد الصكوك والوزن، وتنظيم البريد والطرقات لربط الأقاليم.",
      descEn:
        "Gradual Arabization of state registers, standardizing weights and documents, and organizing post routes to link provinces.",
      badgeAr: "حوكمة",
      badgeEn: "Governance",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Coins,
      titleAr: "الإصلاحات النقدية",
      titleEn: "Monetary Reforms",
      descAr:
        "سكّ الدنانير والدراهم ذات الصيغ الإسلامية الموحّدة في عهد عبد الملك؛ خطوة سيادية واقتصادية مفصلية.",
      descEn:
        "Unified Islamic coinage (dīnars/dirhams) under ʿAbd al-Malik—a key marker of fiscal and political sovereignty.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Landmark,
      titleAr: "العمارة والمعالم",
      titleEn: "Architecture & Monuments",
      descAr:
        "قبة الصخرة (691–692م) والجامع الأموي بدمشق؛ حضور بصري وسياسي في حواضر العالم الإسلامي.",
      descEn:
        "Dome of the Rock (691–692 CE) and the Umayyad Mosque of Damascus; visual-political statements in major urban centers.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Building2,
      titleAr: "دمشق عاصمةً",
      titleEn: "Damascus as Capital",
      descAr:
        "مركز القرار والإدارة والاقتصاد، عقدة طرقٍ بين الشام ومصر والجزيرة، ومنصّة لإدارة الأطراف.",
      descEn:
        "Hub of decision-making, administration, and commerce—linking Syria, Egypt, and the Jazīra; a platform to govern far provinces.",
      badgeAr: "عاصمة",
      badgeEn: "Capital",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Ship,
      titleAr: "القوة البحرية",
      titleEn: "Naval Power",
      descAr:
        "استمرار تطوير الأسطول في المتوسط والدفاع عن السواحل؛ حضور بحري مكمل للنفوذ البري.",
      descEn:
        "Sustained Mediterranean naval capacity and coastal defense—a maritime complement to land power.",
      badgeAr: "أسطول",
      badgeEn: "Navy",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
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
            {ar ? "الدولة الأموية (41–132هـ / 661–750م)" : "Umayyad Caliphate (661–750 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة تشرح أعلام الحقبة ومحطّاتها: المؤسّس، الفتن، التوسّع، الإدارة، النقد، العمارة، والعاصمة."
            : "Concise cards covering key figures and phases: the founder, the Fitnas, expansion, administration, coinage, architecture, and the capital."}
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

export default UmayyadOverview;
