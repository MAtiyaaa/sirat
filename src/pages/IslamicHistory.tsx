import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Star } from "lucide-react";

type TItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  link: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const IslamicHistory = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const cards: TItem[] = [
    {
      icon: Crown,
      titleAr: "الإمبراطوريات الإسلامية",
      titleEn: "Islamic Empires",
      descAr: "استعرض كُبرى الإمبراطوريات مرتبة زمنيًا",
      descEn: "Browse the major empires in chronological order",
      link: "/empires",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Star,
      titleAr: "العصر الذهبي للإسلام",
      titleEn: "Golden Age of Islam",
      descAr: "الترجمة والعلوم والفنون وازدهار الحضارة",
      descEn: "Translation movement, sciences, arts, and civilizational bloom",
      link: "/islamichistory/golden-age",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">
            {ar ? "التاريخ الإسلامي" : "Islamic History"}
          </h1>
        </div>

        <div className="grid gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} onClick={() => navigate(card.link)} className="cursor-pointer group">
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                  />
                  <Card className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                      >
                        <Icon className={`h-7 w-7 ${card.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {ar ? card.titleAr : card.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ar ? card.descAr : card.descEn}
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

export default IslamicHistory;
