import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Landmark,
  Swords,
  Scale,
  Coins,
  Building2,
  BookOpen,
  Globe,
  Network,
  Shield,
  Skull,
  Route,
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

const MughalOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "التأسيس: بابر وبانيبات الأولى (932هـ/1526م)",
      titleEn: "Foundation: Bābur & 1st Panipat (1526 CE)",
      descAr:
        "حسم بابر الصراع في شمال الهند وأقام دولة جديدة جمعت تراث ما وراء النهر والهند.",
      descEn:
        "Bābur’s victory created a new polity in North India, blending Transoxianan and Indic traditions.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Swords,
      titleAr: "همایون وشیر شاه سوري وإعادة التشكل",
      titleEn: "Humāyūn, Sher Shah Suri & Reconfiguration",
      descAr:
        "تراجُع مؤقت ثم عودة؛ إصلاحات شير شاه في الطرق والضرائب والعملة تركت أثرًا دائمًا.",
      descEn:
        "A setback and restoration; Sher Shah’s roads, revenue, and coinage reforms left lasting imprints.",
      badgeAr: "تحولات",
      badgeEn: "Transitions",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Scale,
      titleAr: "عهد أكبر: الإدارة والمنصبدارية",
      titleEn: "Akbar: Governance & Mansabdari",
      descAr:
        "نظام المناصب والرواتب، تنظيم الضرائب (تودرمَل)، توسيع المشاركة النخبوية وتثبيت المركز.",
      descEn:
        "Mansabdari ranks and salaries, Todar Mal’s revenue system, broader elite inclusion and stronger centralization.",
      badgeAr: "إدارة",
      badgeEn: "Administration",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Landmark,
      titleAr: "العواصم: أغرة، فتحپور سيكري، شاهجهان آباد",
      titleEn: "Capitals: Agra, Fatehpur Sikri, Shahjahanabad",
      descAr:
        "نقل المراكز بحسب العهود؛ تخطيط عمراني ملكي ومساجد كبرى وقصور وحدائق.",
      descEn:
        "Shifting seats across reigns; royal urban planning with grand mosques, palaces, and gardens.",
      badgeAr: "عمران",
      badgeEn: "Urbanism",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Building2,
      titleAr: "الفنون والعمارة: التاج ومجمّعات كبرى",
      titleEn: "Arts & Architecture: Taj and Grand Ensembles",
      descAr:
        "ذروة زخرفية في عهد شاهجهان؛ الرخام المعرّق، القباب، والحدائق المتناظرة.",
      descEn:
        "Shah Jahan’s era of inlaid marble, grand domes, and charbagh symmetry reached iconic heights.",
      badgeAr: "فن/عمارة",
      badgeEn: "Art/Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "الثقافة والمعرفة",
      titleEn: "Culture & Learning",
      descAr:
        "رعاية للآداب والتاريخ والرسم والمنمنمات؛ تفاعل فارسي-هندي في اللغات والعلوم.",
      descEn:
        "Courtly patronage of literature, history, and miniature painting; Indo-Persian synthesis in language and learning.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Globe,
      titleAr: "الاقتصاد والتجارة",
      titleEn: "Economy & Trade",
      descAr:
        "زراعة نقدية ونُظُم ضرائب، أسواق مدن وموانئ ناشطة، وصلات مع الخليج وآسيا الوسطى والمحيط الهندي.",
      descEn:
        "Cash-crop agrarian base and revenue systems; vibrant urban–port markets and links across the Indian Ocean world.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Shield,
      titleAr: "أورنكزيب: الاتساع والحوكمة",
      titleEn: "Aurangzeb: Expansion & Rule",
      descAr:
        "ذروة المساحة مع حملات الجنوب؛ تشدد مالي وعسكري أثقل المركز وأثار تحديات إقليمية.",
      descEn:
        "Territorial maximum through southern wars; fiscal–military strain intensified regional challenges.",
      badgeAr: "ذروة/تحديات",
      badgeEn: "Apex/Strain",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Network,
      titleAr: "القوى الإقليمية: المرااثا والسيخ وغيرهم",
      titleEn: "Regional Powers: Marathas, Sikhs & Others",
      descAr:
        "تصاعد كيانات محلية شبكية قلّص قبضة المركز وفرضَ ترتيبات تفاوضية جديدة.",
      descEn:
        "Networked regional polities rose, reducing central grip and forcing negotiated arrangements.",
      badgeAr: "أقاليم",
      badgeEn: "Provinces",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Route,
      titleAr: "طرق البريد والطرق الإمبراطورية",
      titleEn: "Post Roads & Imperial Routes",
      descAr:
        "دعم تنقّل الجند والجباية والتجارة عبر شبكة طرق وخانات وجسور.",
      descEn:
        "Mobility for troops, revenues, and trade via maintained roads, caravanserais, and bridges.",
      badgeAr: "بنية",
      badgeEn: "Infrastructure",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأزمات والصدمة الفارسية (1739م) ثم النهاية (1857م)",
      titleEn: "Crises: 1739 Persian Sack & End (1857)",
      descAr:
        "سقوط دلهي على يد نادر شاه هزّ الشرعية؛ لاحقًا أنهت بريطانيا الحكم بعد ثورة 1857.",
      descEn:
        "Nādir Shāh’s sack of Delhi shattered prestige; British rule ultimately ended the dynasty after the 1857 revolt.",
      badgeAr: "منعطف/نهاية",
      badgeEn: "Turning Point/End",
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
            {ar ? "الإمبراطورية المغولية في الهند (932–1274هـ / 1526–1857م)" : "Mughal Empire (1526–1857 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لحقبة المغول: التأسيس، التحولات المبكرة، إدارة أكبر والمنصبدارية، العواصم، العمارة والفنون، الاقتصاد، اتساع أورنكزيب، صعود القوى الإقليمية، البنية الطرقية، والأزمات وصولًا للنهاية."
            : "Concise cards for the Mughals: foundation, early transitions, Akbar’s administration, capitals, arts and architecture, economy, Aurangzeb’s expansion, rise of regional powers, route infrastructure, and crises to the end."}
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

export default MughalOverview;
