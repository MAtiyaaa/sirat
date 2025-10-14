import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { MapPin, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HolyCities = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const content = {
    title: isArabic ? "المدن المقدسة" : "Holy Cities",
    back: isArabic ? "رجوع" : "Back",
    cards: [
      {
        titleAr: "مكة المكرمة",
        titleEn: "Makkah",
        descAr: "البيت الحرام وقبلة المسلمين",
        descEn: "The Sacred House and Qibla of Muslims",
        link: "/makkah",
        gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
        iconBg: "bg-emerald-500/10",
      },
      {
        titleAr: "المدينة المنورة",
        titleEn: "Madinah",
        descAr: "مدينة الرسول صلى الله عليه وسلم",
        descEn: "The City of Prophet Muhammad ﷺ",
        link: "/madinah",
        gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
        iconBg: "bg-blue-500/10",
      },
      {
        titleAr: "القدس",
        titleEn: "Jerusalem",
        descAr: "المسجد الأقصى وبيت المقدس",
        descEn: "Al-Aqsa Mosque and Bayt al-Maqdis",
        link: "/jerusalem",
        gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
        iconBg: "bg-amber-500/10",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph hover:neomorph-pressed"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{content.title}</h1>
        </div>

        <div className="grid gap-4">
          {content.cards.map((card, index) => (
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
                      <MapPin className="h-7 w-7 text-primary" />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolyCities;
