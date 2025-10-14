import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { MapPin, ArrowLeft, Star, History, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Madinah = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const content = {
    title: isArabic ? "المدينة المنورة" : "Madinah",
    back: isArabic ? "رجوع" : "Back",
    cards: [
      {
        icon: Star,
        titleAr: "فضل المدينة",
        titleEn: "Significance of Madinah",
        descAr: "مدينة الرسول ومكان هجرته وفضائلها",
        descEn: "The city of the Prophet, place of his migration and its virtues",
        link: "/madinah/significance",
        gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
        iconBg: "bg-green-500/10",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        icon: History,
        titleAr: "تاريخ المدينة",
        titleEn: "History of Madinah",
        descAr: "رحلة عبر تاريخ المدينة المنورة",
        descEn: "A journey through the history of the Illuminated City",
        link: "/madinah/history",
        gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: Eye,
        titleAr: "البث المباشر",
        titleEn: "Live View",
        descAr: "شاهد المسجد النبوي مباشرة",
        descEn: "Watch the Prophet's Mosque live",
        link: "/madinah/live-view",
        gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 neomorph hover:neomorph-pressed">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{content.title}</h1>
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

                  <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                      >
                        <Icon className={`h-7 w-7 ${card.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{isArabic ? card.titleAr : card.titleEn}</h3>
                        <p className="text-sm text-muted-foreground">{isArabic ? card.descAr : card.descEn}</p>
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

export default Madinah;
