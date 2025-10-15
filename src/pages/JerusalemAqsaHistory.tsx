import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Landmark, Layers, ShieldCheck, FlameKindling } from "lucide-react";

type TItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
};

const JerusalemAqsaHistory = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const timeline: TItem[] = [
    { icon: Landmark, titleAr: "مكان مبارك مذكور في القرآن", titleEn: "A Blessed Locale in the Qur'an",
      descAr: "ارتبط ذكر المسجد الأقصى بالإسراء، وبُورك ما حوله، وكان مركزًا للأنبياء عبر التاريخ.",
      descEn: "Al-Aqsa is tied to the Night Journey, blessed in its surroundings, and a center for many prophets through history.",
      badgeAr: "القرآن", badgeEn: "Qur'anic" },
    { icon: History, titleAr: "الفتح العادل (15هـ/637م)", titleEn: "Just Entry (15 AH / 637 CE)",
      descAr: "دخول الخليفة عمر بن الخطاب رضي الله عنه إلى القدس بعهد أمان، واحترام للناس ودور العبادة.",
      descEn: "Caliph ʿUmar entered with a pact of safety, showing respect for people and places of worship.",
      badgeAr: "الراشدون", badgeEn: "Rashidun" },
    { icon: Layers, titleAr: "العهد الأموي وبناء المعالم", titleEn: "Umayyad Monumental Works",
      descAr: "تشييد قبة الصخرة (691–692م) والجامع القبلي (حوالي 705م)، وإحياء عمران الحرم الشريف.",
      descEn: "Construction of the Dome of the Rock (691–692 CE) and the Qibli Mosque (~705 CE), revitalizing the sanctuary's fabric.",
      badgeAr: "أموي", badgeEn: "Umayyad" },
    { icon: ShieldCheck, titleAr: "التحرير والإحياء (1187م)", titleEn: "Restoration after Liberation (1187 CE)",
      descAr: "قيام صلاح الدين الأيوبي بإعادة تعظيم الأقصى وتطهيره وإعمار مؤسساته بعد حقبة صليبية.",
      descEn: "Salah al-Din restored the sanctity of Al-Aqsa and reinvigorated its institutions following Crusader rule.",
      badgeAr: "أيوبي/مملوكي", badgeEn: "Ayyubid/Mamluk" },
    { icon: History, titleAr: "العهد العثماني", titleEn: "Ottoman Era",
      descAr: "أعمال ترميم وصيانة للأروقة والأسقف والزخارف عبر قرون طويلة، مع رعاية أوقاف واسعة.",
      descEn: "Centuries of repairs to porticoes, roofs, and ornamentation, with sustained waqf patronage.",
      badgeAr: "عثماني", badgeEn: "Ottoman" },
    { icon: FlameKindling, titleAr: "حريق المنبر (1969م) وما تلاه", titleEn: "Minbar Arson (1969) & After",
      descAr: "تعرض منبر صلاح الدين للحرق؛ أعقب ذلك مشاريع ترميم وإعادة إنشاء المنبر وإصلاحات شاملة.",
      descEn: "Salah al-Din's minbar was burned; subsequent decades saw restoration programs and reconstruction of the pulpit.",
      badgeAr: "حديث", badgeEn: "Modern" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 glass-effect hover:glass-effect-hover" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {ar ? "تاريخ القدس والمسجد الأقصى" : "History of Jerusalem & Al-Aqsa"}
          </h1>
        </div>
        <p className="text-muted-foreground text-base md:text-lg">
          {ar ? "محطات مختصرة توضّح تطور المكان وأبرز أعمال البناء والترميم."
              : "A concise timeline of key phases, construction, and restorations."}
        </p>

        <div className="grid gap-4">
          {timeline.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-indigo-400/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{ar ? t.titleAr : t.titleEn}</h3>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                          {ar ? t.badgeAr : t.badgeEn}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ar ? t.descAr : t.descEn}</p>
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

export default JerusalemAqsaHistory;