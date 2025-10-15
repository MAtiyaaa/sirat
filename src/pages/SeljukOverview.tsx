import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Swords,
  Landmark,
  BookOpen,
  Map,
  Shield,
  ScrollText,
  Building2,
  Route,
  Skull,
  Coins,
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

const SeljukOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "النشأة والتأسيس (1037م)",
      titleEn: "Origins & Foundation (1037 CE)",
      descAr:
        "بزعامة طغرل بك، برز السلاجقة من آسيا الوسطى قوةً تركية-فارسية أعادت تشكيل ميزان القوى في خراسان وإيران.",
      descEn:
        "Under Ṭughril Beg, the Seljuks emerged from Central Asia as a Turko-Persian force reshaping Khurasan and Iran.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Swords,
      titleAr: "دنداناقان (1040م)",
      titleEn: "Dandanaqan (1040 CE)",
      descAr:
        "انتصار حاسم على الغزنويين ثبّت نفوذ السلاجقة في خراسان ومهّد للتوسع غربًا.",
      descEn:
        "Decisive victory over the Ghaznavids secured Khurasan and opened the road west.",
      badgeAr: "معركة",
      badgeEn: "Battle",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Landmark,
      titleAr: "دخول بغداد (1055م) وشرعية الخلافة",
      titleEn: "Entry into Baghdad (1055 CE) & Caliphal Legitimacy",
      descAr:
        "استُقبل طغرل بك في بغداد ونال تفويض الخليفة العباسي، فأضحى السلاجقة حماة الخلافة وسلطتها الزمنية.",
      descEn:
        "Ṭughril entered Baghdad and received Abbasid investiture, becoming temporal protectors of the caliphate.",
      badgeAr: "شرعية",
      badgeEn: "Legitimacy",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "نظام الملك والإدارة والإقطاع",
      titleEn: "Niẓām al-Mulk: Administration & Iqṭāʿ",
      descAr:
        "وضع الوزير نظام الملك أسس الحكم والدواوين ونظام الإقطاع العسكري، وألف \"سياست نامه\" مرشدًا للإدارة.",
      descEn:
        "Grand vizier Niẓām al-Mulk structured bureaucracy and the military iqṭāʿ system; authored the Siyar al-Mulūk (Siyāsatnāma).",
      badgeAr: "حوكمة",
      badgeEn: "Governance",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "المدارس النظامية",
      titleEn: "Niẓāmiyya Madrasas",
      descAr:
        "شبكة مدارس في بغداد ومدن كبرى أرست تقاليد التعليم السنّي وأسهمت في نهضة الفقه والحديث.",
      descEn:
        "A network of madrasas in Baghdad and other hubs anchored Sunni learning and advanced law and hadith.",
      badgeAr: "تعليم",
      badgeEn: "Education",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Map,
      titleAr: "ملاذكرد (1071م) وحدود الأناضول",
      titleEn: "Manzikert (1071 CE) & Anatolian Frontier",
      descAr:
        "نصر ألب أرسلان على البيزنطيين فتح الأناضول أمام القبائل التركية ومهّد لسلطنة سلاجقة الروم.",
      descEn:
        "Alp Arslan’s victory over Byzantium opened Anatolia to Turkmen settlement, paving the way for the Seljuks of Rum.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Building2,
      titleAr: "قمة العهد: ملكشاه الأول (1072–1092م)",
      titleEn: "Apex under Malik-Shah I (1072–1092)",
      descAr:
        "اتساع النفوذ من إيران والعراق إلى الشام، وازدهار عمراني وثقافي برعاية البلاط.",
      descEn:
        "Empire spanned Iran, Iraq, and the Levant; courtly patronage spurred architectural and cultural florescence.",
      badgeAr: "ذروة",
      badgeEn: "Apex",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Shield,
      titleAr: "الحشاشون والتحديات الداخلية",
      titleEn: "Nizari Ismailis (Assassins) & Internal Strains",
      descAr:
        "اغتيالات وصراعات نفوذ أربكت البلاط وأضعفت تماسك المركز، لاسيما بعد مقتل نظام الملك.",
      descEn:
        "Assassinations and factionalism unsettled the court, especially after Niẓām al-Mulk’s death, eroding cohesion.",
      badgeAr: "توتر",
      badgeEn: "Strain",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Route,
      titleAr: "التفكك والسلالات المحلية",
      titleEn: "Fragmentation & Regional Dynasties",
      descAr:
        "انبثاق سلاجقة الروم وأتابكة محليين (زنكيون، سلاجقة كرمان) وتراجع المركز إلى سلطات إقليمية.",
      descEn:
        "Rise of Seljuks of Rum and powerful atabegates (Zengids, Kerman Seljuks) as central authority devolved.",
      badgeAr: "أقاليم",
      badgeEn: "Provinces",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Coins,
      titleAr: "الطرق والقوافل والخان",
      titleEn: "Roads, Caravans, and Khans",
      descAr:
        "حماية طرق التجارة وإنشاء خانات وقيساريات دعمت الحركة الاقتصادية والتواصل بين الحواضر.",
      descEn:
        "Secured trade routes with caravanserais and bazaars, sustaining long-distance commerce and urban links.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأفول (1194م)",
      titleEn: "Decline (1194 CE)",
      descAr:
        "انتهى السلطان السلجوقي الأخير في إيران أمام الخوارزميين؛ بقيت كيانات سلجوقية إقليمية في الأناضول.",
      descEn:
        "The last Iranian Seljuk fell to the Khwarazmians; Seljuk successor states endured regionally in Anatolia.",
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
            {ar ? "السلاجقة العظام (1037–1194م)" : "Great Seljuk Empire (1037–1194 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لملامح الحقبة السلجوقية: التأسيس، المعارك المفصلية، الشرعية، الإدارة والعلم، ملاذكرد، الذروة، التحديات، التفكك، الاقتصاد، والأفول."
            : "Concise cards of the Seljuk era: foundation, key battles, legitimacy, administration and learning, Manzikert, apex, challenges, fragmentation, economy, and decline."}
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

export default SeljukOverview;
