import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { MapPin, ArrowLeft, Star, History, Eye, Users, Book, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Jerusalem = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const content = {
    title: isArabic ? "القدس" : "Jerusalem",
    back: isArabic ? "رجوع" : "Back",
    cards: [
      {
        icon: Star,
        titleAr: "فضائل المسجد الأقصى",
        titleEn: "Virtues of Al-Aqsa",
        descAr: "مكانته الدينية وفضل شدّ الرحال إليه",
        descEn: "Its religious status and the virtue of traveling to it",
        link: "/jerusalem/aqsa-significance",
        gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
      },
      {
        icon: History,
        titleAr: "تاريخ القدس والأقصى",
        titleEn: "History of Jerusalem & Al-Aqsa",
        descAr: "محطات مفصلية عبر العصور",
        descEn: "Key milestones across the ages",
        link: "/jerusalem/aqsa-history",
        gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
      {
        icon: Book,
        titleAr: "الإسراء والمعراج",
        titleEn: "Al-Isrā' & Al-Miʿrāj",
        descAr: "الرحلة المباركة ودلالاتها",
        descEn: "The blessed night journey and its meanings",
        link: "/jerusalem/isra-miraj",
        gradient: "from-teal-500/20 via-emerald-400/20 to-green-500/20",
        iconBg: "bg-teal-500/10",
        iconColor: "text-teal-600 dark:text-teal-400",
      },
      {
        icon: Compass,
        titleAr: "تحويل القبلة",
        titleEn: "Change of Qibla",
        descAr: "من بيت المقدس إلى مكة المكرمة",
        descEn: "From Bayt al-Maqdis to Makkah",
        link: "/jerusalem/qibla-change",
        gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20",
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600 dark:text-sky-400",
      },
      {
        icon: Eye,
        titleAr: "البث المباشر",
        titleEn: "Live View",
        descAr: "شاهد الأقصى مباشرة",
        descEn: "Watch Al-Aqsa live",
        link: "/jerusalem/live-view",
        gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
        iconBg: "bg-green-500/10",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        icon: Users,
        titleAr: "الزيارة والصلاة",
        titleEn: "Visiting & Prayer",
        descAr: "آداب الزيارة وخطوات الصلاة",
        descEn: "Etiquette of visiting and how to pray there",
        link: "/jerusalem/prayer",
        gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: MapPin,
        titleAr: "معالم وخريطة",
        titleEn: "Landmarks & Map",
        descAr: "قبة الصخرة، الجامع القبلي، المصلى المرواني، الأبواب",
        descEn: "Dome of the Rock, Qibli Mosque, Marwani Hall, gates",
        link: "/jerusalem/landmarks-map",
        gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-600 dark:text-red-400",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 glass-effect hover:glass-effect-hover"
            aria-label={content.back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {content.title}
          </h1>
        </div>

        <div className="grid gap-4">
          {content.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} onClick={() => navigate(card.link)} className="cursor-pointer group">
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                  />
                  <Card className="relative glass-effect hover:glass-effect-hover smooth-transition backdrop-blur-xl p-6 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                      >
                        <Icon className={`h-7 w-7 ${card.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {isArabic ? card.titleAr : card.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? card.descAr : card.descEn}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Jerusalem;