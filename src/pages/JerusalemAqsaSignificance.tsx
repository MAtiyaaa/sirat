import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Star, Footprints, Landmark, Compass, Users } from "lucide-react";

const JerusalemAqsaSignificance = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items = [
    { icon: Star, titleAr: "ثالث الحرمين", titleEn: "The Third of the Two Sacred Sanctuaries",
      descAr: "المسجد الأقصى أحد المساجد الثلاثة التي تُشدّ إليها الرحال، ومضاعفة الأجر فيه ثابتة في فضائله.",
      descEn: "Al-Aqsa is one of three mosques to which journeys are encouraged; prayer there carries special virtue.",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20", iconBg: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
    { icon: BookOpen, titleAr: "ارتباط قرآني", titleEn: "Qur'anic Connection",
      descAr: "ذُكر في مطلع سورة الإسراء: "سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا...".",
      descEn: "Mentioned at the opening of Surah Al-Isra': "Glory be to Him who took His servant by night…".",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
    { icon: Footprints, titleAr: "أولى القبلتين", titleEn: "The First Qibla",
      descAr: "توجّه المسلمون إلى بيت المقدس في الصلاة في صدر الإسلام قبل تحويل القبلة إلى مكة.",
      descEn: "Muslims initially faced Jerusalem in prayer prior to the Qibla being changed to Makkah.",
      gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20", iconBg: "bg-sky-500/10", iconColor: "text-sky-600 dark:text-sky-400" },
    { icon: Landmark, titleAr: "مركز حضاري", titleEn: "Civilizational Center",
      descAr: "شكّل عبر العصور مركزًا للعلم والعبادة، واحتضن مؤسسات ومدارس ووقفًا لخدمة الزائرين.",
      descEn: "Across eras it hosted learning, worship, and endowments serving visitors and residents.",
      gradient: "from-teal-500/20 via-emerald-400/20 to-green-500/20", iconBg: "bg-teal-500/10", iconColor: "text-teal-600 dark:text-teal-400" },
    { icon: Compass, titleAr: "صلة روحية", titleEn: "Spiritual Bond",
      descAr: "يرتبط به المسلمون في مشارق الأرض ومغاربها دعاءً وشوقًا وزيارةً.",
      descEn: "Muslims worldwide feel a living spiritual bond with Al-Aqsa.",
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20", iconBg: "bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" },
    { icon: Users, titleAr: "فضائل الزيارة", titleEn: "Virtues of Visiting",
      descAr: "تشمل الصلاة والدعاء وطلب العلم وإعمار المسجد بالأدب والسكينة.",
      descEn: "Includes prayer, supplication, learning, and dignified presence within the sanctuary.",
      gradient: "from-indigo-500/20 via-violet-400/20 to-fuchsia-500/20", iconBg: "bg-indigo-500/10", iconColor: "text-indigo-600 dark:text-indigo-400" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 glass-effect hover:glass-effect-hover" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {ar ? "فضائل المسجد الأقصى" : "Virtues of Al-Aqsa"}
          </h1>
        </div>
        <p className="text-muted-foreground text-base md:text-lg">
          {ar ? "نظرة موجزة إلى مكانة الأقصى الروحية والتاريخية في وجدان المسلمين."
              : "A concise overview of Al-Aqsa's spiritual and historical standing in the Muslim world."}
        </p>

        <div className="grid gap-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${it.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${it.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-6 w-6 ${it.iconColor}`} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-lg">{ar ? it.titleAr : it.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{ar ? it.descAr : it.descEn}</p>
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

export default JerusalemAqsaSignificance;