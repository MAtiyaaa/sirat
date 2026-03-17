import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Book, Heart, Users, Sparkles, Cloud, Flame, ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StoriesAndNames = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const content = {
    title: isArabic ? "تعليم" : "Education",
    subtitle: isArabic ? "اكتشف ثراء التراث الإسلامي" : "Discover the richness of Islamic heritage",
    cards: [
      {
        icon: Book,
        titleAr: "قصص الأنبياء",
        titleEn: "Prophet Stories",
        descAr: "تعلم من قصص الأنبياء والرسل",
        descEn: "Learn from the stories of prophets and messengers",
        link: "/prophet-stories",
        gradient: "from-purple-500 to-pink-500",
        accentBg: "bg-purple-500/8",
      },
      {
        icon: Book,
        titleAr: "التاريخ الإسلامي",
        titleEn: "Islamic History",
        descAr: "محطات التاريخ الإسلامي عبر العصور",
        descEn: "Key phases of Islamic history through the ages",
        link: "/islamichistory",
        gradient: "from-emerald-500 to-teal-500",
        accentBg: "bg-emerald-500/8",
      },
      {
        icon: MapPin,
        titleAr: "المدن المقدسة",
        titleEn: "Holy Cities",
        descAr: "المدينتان المقدستان في الإسلام",
        descEn: "The Holy Cities of Islam",
        link: "/holy-cities",
        gradient: "from-cyan-500 to-blue-500",
        accentBg: "bg-cyan-500/8",
      },
      {
        icon: Heart,
        titleAr: "أسماء الله الحسنى",
        titleEn: "99 Names of Allah",
        descAr: "الأسماء الحسنى ومعانيها",
        descEn: "The beautiful names and their meanings",
        link: "/names-of-allah",
        gradient: "from-emerald-500 to-green-500",
        accentBg: "bg-emerald-500/8",
      },
      {
        icon: Sparkles,
        titleAr: "أسماء النبي محمد",
        titleEn: "Names of Muhammad",
        descAr: "أسماء وألقاب النبي صلى الله عليه وسلم",
        descEn: "Names and titles of Prophet Muhammad ﷺ",
        link: "/names-of-muhammad",
        gradient: "from-amber-500 to-orange-500",
        accentBg: "bg-amber-500/8",
      },
      {
        icon: Users,
        titleAr: "الملائكة",
        titleEn: "Angels",
        descAr: "تعرف على الملائكة ومهامهم",
        descEn: "Learn about angels and their duties",
        link: "/angels",
        gradient: "from-blue-500 to-indigo-500",
        accentBg: "bg-blue-500/8",
      },
      {
        icon: Cloud,
        titleAr: "درجات الجنة",
        titleEn: "Doors of Heaven",
        descAr: "درجات الجنة ونعيمها",
        descEn: "Doors of Paradise and its blessings",
        link: "/heaven-levels",
        gradient: "from-green-500 to-emerald-500",
        accentBg: "bg-green-500/8",
      },
      {
        icon: Flame,
        titleAr: "دركات جهنم",
        titleEn: "Levels of Hell",
        descAr: "دركات النار وعذابها",
        descEn: "Levels of Hellfire and its punishment",
        link: "/hell-levels",
        gradient: "from-red-500 to-orange-500",
        accentBg: "bg-red-500/8",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 rounded-full hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold ios-26-style">{content.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{content.subtitle}</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-3">
          {content.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                onClick={() => navigate(card.link)} 
                className="cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="glass-card-elevated rounded-2xl p-5 hover:border-primary/20 smooth-transition hover-lift relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.accentBg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                  
                  <div className="flex items-center gap-4 relative">
                    <div className={`flex-shrink-0 w-13 h-13 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center icon-badge group-hover:scale-105 smooth-spring`}>
                      <Icon className="h-6 w-6 text-white relative z-10 drop-shadow-sm" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-0.5">{isArabic ? card.titleAr : card.titleEn}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{isArabic ? card.descAr : card.descEn}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 smooth-transition">
                        <ChevronRight className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 smooth-transition" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoriesAndNames;
