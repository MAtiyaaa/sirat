import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Landmark, Layers, Swords } from "lucide-react";

type TItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  diedAr: string;
  diedEn: string;
  successorAr: string;
  successorEn: string;
  badgeAr: string;
  badgeEn: string;
  gradient: string;
};

const RashidunCaliphs = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const caliphs: TItem[] = [
    {
      icon: ShieldCheck,
      titleAr: "أبو بكر الصديق (11–13هـ / 632–634م)",
      titleEn: "Abu Bakr al-Ṣiddīq (11–13 AH / 632–634 CE)",
      highlightsAr: [
        "تثبيت الدولة بعد وفاة النبي ﷺ وخوض حروب الردة.",
        "بدء حملات الشام والعراق ضد الروم والفرس.",
        "الشروع في جمع القرآن لأول مرة (تكليف زيد بن ثابت).",
      ],
      highlightsEn: [
        "Stabilized the state after the Prophet ﷺ; fought the Ridda wars.",
        "Launched campaigns into Syria and Iraq against Byzantines and Sasanians.",
        "Initiated the first Qur’an compilation (tasked Zayd ibn Thābit).",
      ],
      diedAr: "تُوفّي سنة 13هـ/634م على الأرجح بمرض/حمّى، ودُفن بجوار النبي ﷺ.",
      diedEn: "Died in 13 AH / 634 CE, likely of illness/fever; buried beside the Prophet ﷺ.",
      successorAr: "اختار عمر بن الخطاب خليفةً بعده بنصٍ واضح.",
      successorEn: "Explicitly designated ʿUmar ibn al-Khaṭṭāb as his successor.",
      badgeAr: "الخليفة الأول",
      badgeEn: "1st Caliph",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Landmark,
      titleAr: "عمر بن الخطاب (13–23هـ / 634–644م)",
      titleEn: "ʿUmar ibn al-Khaṭṭāb (13–23 AH / 634–644 CE)",
      highlightsAr: [
        "اتساع الفتوحات: الشام ومصر والعراق وفارس.",
        "تنظيم الدواوين والولايات والقضاء وبيت المال.",
        "اعتماد التقويم الهجري وتأسيس أمصار مثل الكوفة والبصرة والفسطاط.",
      ],
      highlightsEn: [
        "Major conquests: Levant, Egypt, Iraq, and Persia.",
        "Built administrative institutions: dīwāns, judiciary, treasury; structured provinces.",
        "Adopted the Hijri calendar; founded garrison cities (Kufa, Basra, Fustat).",
      ],
      diedAr: "اغتيل بطعنةٍ في المدينة سنة 23هـ/644م على يد أبي لؤلؤة.",
      diedEn: "Assassinated in Medina in 23 AH / 644 CE by Abū Lu’lu’a.",
      successorAr: "لم يُسمِّ خليفةً بعينه؛ شكّل لجنة شورى (ستة) لاختيار الخليفة التالي.",
      successorEn: "Did not name a successor; appointed a six-man shūrā to choose the next caliph.",
      badgeAr: "الخليفة الثاني",
      badgeEn: "2nd Caliph",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Layers,
      titleAr: "عثمان بن عفان (23–35هـ / 644–656م)",
      titleEn: "ʿUthmān ibn ʿAffān (23–35 AH / 644–656 CE)",
      highlightsAr: [
        "توحيد المصاحف وإرسال نُسخ إلى الأمصار.",
        "التوسع البحري والانتصار في \"ذات الصواري\" (655م).",
        "استمرار الفتوحات في خراسان وشمال أفريقيا مع تطوير الإدارة.",
      ],
      highlightsEn: [
        "Standardized Qur’ān codices and sent copies to major cities.",
        "Naval expansion; victory at the Battle of the Masts (655 CE).",
        "Continued conquests in Khurasan & North Africa; administrative growth.",
      ],
      diedAr: "قُتل في داره بالمدينة سنة 35هـ/656م أثناء حصارٍ سياسي.",
      diedEn: "Killed in his home in Medina in 35 AH / 656 CE during a political siege.",
      successorAr: "لم يُعيّن خليفةً من بعده.",
      successorEn: "Did not designate a successor.",
      badgeAr: "الخليفة الثالث",
      badgeEn: "3rd Caliph",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Swords,
      titleAr: "علي بن أبي طالب (35–40هـ / 656–661م)",
      titleEn: "ʿAlī ibn Abī Ṭālib (35–40 AH / 656–661 CE)",
      highlightsAr: [
        "نقل مركز الحكم إلى الكوفة وإدارة مرحلة الفتن.",
        "وقائع الجمل وصفّين والتحكيم وظهور الخوارج.",
        "التأكيد على العدل والشورى وتطهير الإدارة.",
      ],
      highlightsEn: [
        "Moved the capital to Kufa; governed amid civil strife.",
        "Battles of Jamal and Ṣiffīn; arbitration; rise of the Khārijites.",
        "Emphasized justice, consultation, and administrative rectitude.",
      ],
      diedAr: "اغتيل بالكوفة سنة 40هـ/661م بضربة ابن ملجم من الخوارج.",
      diedEn: "Assassinated in Kufa in 40 AH / 661 CE by Ibn Muljam (a Khārijite).",
      successorAr: "لم يُسمِّ خليفةً رسمياً؛ بويع ابنه الحسن بعده في الكوفة ثم تنازلَ لاحقاً لمعاوية.",
      successorEn: "Did not formally appoint a successor; his son Ḥasan was recognized in Kufa, later abdicated to Muʿāwiya.",
      badgeAr: "الخليفة الرابع",
      badgeEn: "4th Caliph",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
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
            {ar ? "الخلافة الراشدة" : "Rashidun Caliphate"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "بطاقات موجزة تُعرّف بكل خليفة راشد: أبرز إنجازاته، وكيف تُوفّي، وهل عيّن خليفةً من بعده."
            : "Concise profiles for each Rightly Guided Caliph: key highlights, how they died, and whether they chose a successor."}
        </p>

        <div className="grid gap-4">
          {caliphs.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${c.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {ar ? c.titleAr : c.titleEn}
                        </h3>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                          {ar ? c.badgeAr : c.badgeEn}
                        </span>
                      </div>

                      <ul className="list-disc ms-5 text-sm text-muted-foreground space-y-1">
                        {(ar ? c.highlightsAr : c.highlightsEn).map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>

                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                          <div className="text-foreground/80 font-medium mb-1">
                            {ar ? "الوفاة" : "Death"}
                          </div>
                          <div className="text-muted-foreground">
                            {ar ? c.diedAr : c.diedEn}
                          </div>
                        </div>
                        <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                          <div className="text-foreground/80 font-medium mb-1">
                            {ar ? "الخلافة من بعده" : "Successor"}
                          </div>
                          <div className="text-muted-foreground">
                            {ar ? c.successorAr : c.successorEn}
                          </div>
                        </div>
                      </div>
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

export default RashidunCaliphs;
