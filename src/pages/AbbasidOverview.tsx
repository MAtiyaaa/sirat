import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Swords,
  Landmark,
  BookOpen,
  FlaskConical,
  Scale,
  Building2,
  Map,
  Coins,
  Shield,
  Globe,
  Feather,
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

const AbbasidOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Swords,
      titleAr: "الثورة العباسية وبداية الحكم (132هـ/750م)",
      titleEn: "Abbasid Revolution & Rise (750 CE)",
      descAr:
        "تحالف واسع في خراسان أنهى الحكم الأموي وأقام الخلافة العباسية على أساس الشرعية الهاشمية.",
      descEn:
        "A Khurasani coalition ended Umayyad rule and installed the Abbasids, claiming Hashemite legitimacy.",
      badgeAr: "تحوّل سياسي",
      badgeEn: "Political Shift",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Landmark,
      titleAr: "بغداد عاصمةً (145هـ/762م)",
      titleEn: "Baghdad as Capital (762 CE)",
      descAr:
        "تأسيس مدينة مدوّرة التصميم مركزًا للحكم والعلم والتجارة، صارت عقدة عالمية لعدة قرون.",
      descEn:
        "A purpose-built round city became the seat of power, scholarship, and commerce—a global hub for centuries.",
      badgeAr: "عاصمة",
      badgeEn: "Capital",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "بيت الحكمة وحركة الترجمة",
      titleEn: "Bayt al-Hikma & Translation Movement",
      descAr:
        "رعاية ترجمة العلوم اليونانية والفارسية والهندية وتأليف شروح وابتكارات في الطب والرياضيات والفلك.",
      descEn:
        "State-backed translation of Greek, Persian, and Indian sciences with original advances in medicine, math, and astronomy.",
      badgeAr: "معرفة",
      badgeEn: "Knowledge",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Scale,
      titleAr: "المِحنة (218–234هـ / 833–848م)",
      titleEn: "The Mihna (833–848 CE)",
      descAr:
        "امتحان عقدي رسمي ارتبط بمسألة خلق القرآن، أبرز التوتر بين السلطة والعلماء ثم انتهى برفعها.",
      descEn:
        "A doctrinal inquisition over the createdness of the Qur’an, highlighting state–scholar tensions before its repeal.",
      badgeAr: "عقيدة/سلطة",
      badgeEn: "Creed/Authority",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Shield,
      titleAr: "الحرس التركي وإعادة تشكيل الجيش",
      titleEn: "Turkic Guard & Military Reforms",
      descAr:
        "اعتماد على جند أتراك وتنظيمات جديدة عززت القوة العسكرية وأثّرت في توازن النفوذ داخل البلاط.",
      descEn:
        "Reliance on Turkic troops and new formations strengthened the army and reshaped court power dynamics.",
      badgeAr: "عسكر",
      badgeEn: "Military",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Building2,
      titleAr: "سرّ من رأى (سامرّاء) وتحول البلاط (836م)",
      titleEn: "Samarra Court Shift (836 CE)",
      descAr:
        "نقل البلاط إلى سامرّاء لعقود، ما عكس توازنات جديدة وأتاح مشاريع عمرانية كبرى.",
      descEn:
        "Court relocation to Samarra for decades signaled changing balances and enabled major urban projects.",
      badgeAr: "إدارة",
      badgeEn: "Administration",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Map,
      titleAr: "اللامركزية وتنامي استقلال الأقاليم",
      titleEn: "Provincial Autonomy & Fragmentation",
      descAr:
        "صعود إمارات وسلالات محلية (كالطولونيين والسامانيين والبويهيين) مع بقاء الخلافة رمزًا جامعًا.",
      descEn:
        "Rise of autonomous dynasties (e.g., Tulunids, Samanids, Buyids) while the caliphate retained symbolic primacy.",
      badgeAr: "أقاليم",
      badgeEn: "Provinces",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Coins,
      titleAr: "الاقتصاد والبريد والأسواق",
      titleEn: "Economy, Post, and Markets",
      descAr:
        "شبكات بريد وتجارات عابرة للأقاليم، نظم ضرائب ونقد متطوّرة، وأسواق مزدهرة في الحواضر.",
      descEn:
        "Interprovincial post and trade networks, sophisticated taxation and coinage, and flourishing urban markets.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Feather,
      titleAr: "الأدب والثقافة",
      titleEn: "Literature & Culture",
      descAr:
        "ازدهار الشعر واللغة والفقه والتاريخ والجغرافيا، وتدوين واسع للتراث العلمي والديني.",
      descEn:
        "Bloom of poetry, philology, law, history, and geography; large-scale compilation of religious and scientific heritage.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Globe,
      titleAr: "اتساع العالم العباسي وروابطه",
      titleEn: "Abbasid World & Connectivity",
      descAr:
        "روابط بحرية وبرية نحو الهند وآسيا الوسطى والبحر المتوسط، وتبادل سلع وأفكار واسع.",
      descEn:
        "Maritime and overland links to India, Central Asia, and the Mediterranean, enabling broad exchange of goods and ideas.",
      badgeAr: "شبكات",
      badgeEn: "Networks",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Skull,
      titleAr: "سقوط بغداد (656هـ/1258م)",
      titleEn: "Fall of Baghdad (1258 CE)",
      descAr:
        "اجتياح المغول أنهى المرحلة الكلاسيكية في بغداد؛ استمرّت شرعية الخلافة لاحقًا بشكل رمزي في القاهرة.",
      descEn:
        "The Mongol sack ended the classical Baghdad phase; caliphal legitimacy later persisted symbolically in Cairo.",
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
            {ar ? "الدولة العباسية (132–656هـ / 750–1258م)" : "Abbasid Caliphate (750–1258 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة ترسم ملامح الحقبة العباسية: الثورة، بغداد، بيت الحكمة، المِحنة، الجيش، الانتقال إلى سامرّاء، اللامركزية، الاقتصاد، الثقافة، والختام بسقوط بغداد."
            : "Concise cards outlining the Abbasid era: revolution, Baghdad, House of Wisdom, the Mihna, the army, shift to Samarra, provincial autonomy, economy, culture, and the 1258 fall."}
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

export default AbbasidOverview;
