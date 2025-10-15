import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  Flame,
  Landmark,
  Globe,
  Map,
  Swords,
  Scale,
  Coins,
  Network,
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

const AlmohadOverview = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Crown,
      titleAr: "النشأة: ابن تومرت وعبد المؤمن (القرن 6هـ/12م)",
      titleEn: "Origins: Ibn Tumart & ʿAbd al-Mu’min (12th c.)",
      descAr:
        "دعوة توحيدية إصلاحية في الأطلس؛ وحّد عبد المؤمن القبائل وأسقط المرابطين وأقام دولة موحّدة.",
      descEn:
        "A rigorist tawḥīd movement in the Atlas; ʿAbd al-Mu’min united tribes, overthrew the Almoravids, and forged a unified state.",
      badgeAr: "تأسيس",
      badgeEn: "Foundation",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Flame,
      titleAr: "العقيدة والإصلاح",
      titleEn: "Doctrine & Reform",
      descAr:
        "تشديد على التوحيد والانضباط الديني، إصلاح القضاء والوعظ، وتوحيد الممارسات الدينية في الحواضر.",
      descEn:
        "Strong emphasis on tawḥīd and religious discipline, judicial reforms and preaching, standardizing practice in urban centers.",
      badgeAr: "دين",
      badgeEn: "Religion",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Globe,
      titleAr: "مجال الحكم",
      titleEn: "Realm",
      descAr:
        "امتداد من المغرب والأطلس إلى إفريقية والأندلس، مركز ثقل في مراكش وفاس وإشبيلية.",
      descEn:
        "Rule spanning the Maghreb and Atlas to Ifriqiya and al-Andalus, with power hubs in Marrakesh, Fez, and Seville.",
      badgeAr: "جغرافيا",
      badgeEn: "Geography",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
    },
    {
      icon: Map,
      titleAr: "الأندلس",
      titleEn: "Al-Andalus",
      descAr:
        "تعزيز الوجود في الأندلس بعد المرابطين، إدارة الولايات وصدّ الضغط القشتالي والبرغندي.",
      descEn:
        "Consolidation in Iberia after the Almoravids, governing taifas and countering Castilian and Portuguese pressure.",
      badgeAr: "إدارة",
      badgeEn: "Administration",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Swords,
      titleAr: "معارك مفصلية: الأرك (1195م) ثم العقاب (1212م)",
      titleEn: "Pivotal Battles: Alarcos (1195) then Las Navas (1212)",
      descAr:
        "نصر كبير في الأرك أعقبه تحالف مسيحي حاسم في العقاب قلب موازين القوى بالأندلس.",
      descEn:
        "Major victory at Alarcos followed by a decisive Christian coalition at Las Navas de Tolosa that reversed Iberian fortunes.",
      badgeAr: "منعطف",
      badgeEn: "Turning Point",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
    {
      icon: Network,
      titleAr: "القبائل والحكم المحلي",
      titleEn: "Tribal Networks & Local Rule",
      descAr:
        "موازنة بين سلطة المركز والتحالفات القبلية، وتعيين ولاة وقادة لضبط الأطراف.",
      descEn:
        "Balancing central authority with tribal coalitions; governors and commanders managed frontier provinces.",
      badgeAr: "حوكمة",
      badgeEn: "Governance",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Coins,
      titleAr: "الاقتصاد والتجارة",
      titleEn: "Economy & Trade",
      descAr:
        "ازدهار طرق القوافل، وتجارة المتوسط والأطلسي، وسك نقد موحّد دعم الخزينة.",
      descEn:
        "Flourishing caravan routes, Mediterranean and Atlantic commerce, and unified coinage sustaining revenues.",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Landmark,
      titleAr: "العمارة والمعالم",
      titleEn: "Architecture & Monuments",
      descAr:
        "الكتبية بمراكش، الخيرالدا بإشبيلية، صومعة حسان بالرباط؛ طراز موحّدي مميّز وأفق مديني متجدّد.",
      descEn:
        "Koutoubia (Marrakesh), Giralda (Seville), Hassan Tower (Rabat); a distinct Almohad style reshaping urban skylines.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Scale,
      titleAr: "السياسة والشرعية",
      titleEn: "Policy & Legitimacy",
      descAr:
        "مزج بين الشرعية الدينية والانضباط الإداري؛ رسائل وخطب لتثبيت المركز وهيبة الدولة.",
      descEn:
        "Blend of religious legitimacy with administrative discipline; chancery rhetoric reinforced central prestige.",
      badgeAr: "شرعية",
      badgeEn: "Legitimacy",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Skull,
      titleAr: "الأفول والتفكك (1269م)",
      titleEn: "Decline & Dissolution (1269 CE)",
      descAr:
        "صدمات عسكرية بالأندلس، توترات قبلية، وقيام المرينيين أنهى الحكم الموحدي في المغرب.",
      descEn:
        "Iberian defeats, tribal fissures, and the rise of the Marinids ended Almohad rule in the Maghreb.",
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
            {ar ? "الموحدون (541–667هـ / 1147–1269م)" : "Almohad Caliphate (1147–1269 CE)"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة لملامح الدولة الموحدية: النشأة والعقيدة، المجال الجغرافي، الأندلس، المعارك المفصلية، شبكات القبائل، الاقتصاد، العمارة، الشرعية، والأفول."
            : "Concise cards on the Almohads: origins and doctrine, realm, al-Andalus, pivotal battles, tribal networks, economy, architecture, legitimacy, and decline."}
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

export default AlmohadOverview;
