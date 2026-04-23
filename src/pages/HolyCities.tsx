import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { MapPin, ArrowLeft, ChevronRight, Compass, Star } from "lucide-react";
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
        gradient: "from-emerald-500 to-teal-500",
      },
      {
        titleAr: "المدينة المنورة",
        titleEn: "Madinah",
        descAr: "مدينة الرسول صلى الله عليه وسلم",
        descEn: "The City of Prophet Muhammad ﷺ",
        link: "/madinah",
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        titleAr: "القدس",
        titleEn: "Jerusalem",
        descAr: "المسجد الأقصى وبيت المقدس",
        descEn: "Al-Aqsa Mosque and Bayt al-Maqdis",
        link: "/jerusalem",
        gradient: "from-amber-500 to-orange-500",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 rounded-xl"
            aria-label={content.back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="section-label">{isArabic ? "أماكن مباركة" : "Sacred Places"}</p>
            <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden premium-card rounded-3xl p-6 islamic-pattern-bg animate-fade-in">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-islamic-gold/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-islamic-gold to-amber-500 flex items-center justify-center rich-shadow">
              <Compass className="h-7 w-7 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-tight">
                {isArabic ? "ثلاث مدن مقدسة" : "Three Sacred Cities"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic
                  ? "اكتشف الأماكن المباركة في الإسلام"
                  : "Explore the blessed places of Islam"}
              </p>
            </div>
          </div>
        </div>

        {/* Cities — large feature cards */}
        <div className="grid gap-4">
          {content.cards.map((card, index) => (
            <button
              key={card.link}
              onClick={() => navigate(card.link)}
              className="text-left press-tile group animate-fade-in"
              style={{ animationDelay: `${100 + index * 80}ms` }}
            >
              <div className="relative overflow-hidden glass-card rounded-3xl hover:border-primary/30 smooth-transition">
                {/* Gradient banner */}
                <div className={`relative h-28 bg-gradient-to-br ${card.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 islamic-pattern-bg opacity-30" />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                      <Star className="h-3 w-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {isArabic ? "مقدّس" : "Sacred"}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 smooth-transition">
                      <MapPin className="h-6 w-6 text-white drop-shadow" strokeWidth={2.2} />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl leading-tight">
                      {isArabic ? card.titleAr : card.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isArabic ? card.descAr : card.descEn}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 smooth-transition flex-shrink-0" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolyCities;
