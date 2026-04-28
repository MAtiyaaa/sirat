import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Book,
  Heart,
  Users,
  Sparkles,
  Cloud,
  Flame,
  MapPin,
  ChevronRight,
  GraduationCap,
  Scroll,
  Compass,
  Star,
} from "lucide-react";
import {
  PageContainer,
  PageHeader,
  PageSection,
  QuickActionsRow,
  type QuickAction,
} from "@/components/PageTemplate";

type EduItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  link: string;
  gradient: string;
};

type EduSection = {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: any;
  accent: string;
  items: EduItem[];
};

const StoriesAndNames = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  const sections: EduSection[] = [
    {
      id: "stories",
      labelAr: "القصص والسير",
      labelEn: "Stories & Sirah",
      icon: Scroll,
      accent: "from-purple-500 to-pink-500",
      items: [
        {
          icon: Book,
          titleAr: "قصص الأنبياء",
          titleEn: "Prophet Stories",
          descAr: "تعلم من قصص الأنبياء والرسل",
          descEn: "Learn from the stories of prophets and messengers",
          link: "/prophet-stories",
          gradient: "from-purple-500 to-pink-500",
        },
        {
          icon: Sparkles,
          titleAr: "ألقاب النبي ﷺ",
          titleEn: "Titles of the Prophet ﷺ",
          descAr: "أسماء وألقاب النبي صلى الله عليه وسلم",
          descEn: "The blessed names and titles of the Final Messenger ﷺ",
          link: "/names-of-muhammad",
          gradient: "from-amber-500 to-orange-500",
        },
      ],
    },
    {
      id: "history",
      labelAr: "التاريخ والحضارة",
      labelEn: "History & Civilization",
      icon: GraduationCap,
      accent: "from-emerald-500 to-teal-500",
      items: [
        {
          icon: GraduationCap,
          titleAr: "التاريخ الإسلامي",
          titleEn: "Islamic History",
          descAr: "محطات التاريخ الإسلامي عبر العصور",
          descEn: "Key phases of Islamic history through the ages",
          link: "/islamichistory",
          gradient: "from-emerald-500 to-teal-500",
        },
      ],
    },
    {
      id: "places",
      labelAr: "الأماكن المقدسة",
      labelEn: "Sacred Places",
      icon: Compass,
      accent: "from-cyan-500 to-blue-500",
      items: [
        {
          icon: MapPin,
          titleAr: "المدن المقدسة",
          titleEn: "Holy Cities",
          descAr: "مكة، المدينة، والقدس",
          descEn: "Makkah, Madinah, and Jerusalem",
          link: "/holy-cities",
          gradient: "from-cyan-500 to-blue-500",
        },
      ],
    },
    {
      id: "beliefs",
      labelAr: "العقيدة والإيمان",
      labelEn: "Beliefs & Faith",
      icon: Star,
      accent: "from-islamic-gold to-amber-500",
      items: [
        {
          icon: Heart,
          titleAr: "أسماء الله الحسنى",
          titleEn: "99 Names of Allah",
          descAr: "الأسماء الحسنى ومعانيها",
          descEn: "The beautiful names and their meanings",
          link: "/names-of-allah",
          gradient: "from-rose-500 to-pink-500",
        },
        {
          icon: Users,
          titleAr: "الملائكة",
          titleEn: "Angels",
          descAr: "تعرف على الملائكة ومهامهم",
          descEn: "Learn about angels and their duties",
          link: "/angels",
          gradient: "from-blue-500 to-indigo-500",
        },
        {
          icon: Cloud,
          titleAr: "درجات الجنة",
          titleEn: "Doors of Heaven",
          descAr: "درجات الجنة ونعيمها",
          descEn: "Doors of Paradise and its blessings",
          link: "/heaven-levels",
          gradient: "from-green-500 to-emerald-500",
        },
        {
          icon: Flame,
          titleAr: "دركات جهنم",
          titleEn: "Levels of Hell",
          descAr: "دركات النار وعذابها",
          descEn: "Levels of Hellfire and its punishment",
          link: "/hell-levels",
          gradient: "from-red-500 to-rose-500",
        },
      ],
    },
  ];

  const totalCount = sections.reduce((s, sec) => s + sec.items.length, 0);

  const quickActions: QuickAction[] = [
    {
      icon: Book,
      label: isArabic ? "قصص الأنبياء" : "Prophets",
      onClick: () => navigate("/prophet-stories"),
      gradient: "from-purple-500 to-pink-500",
      ariaLabel: isArabic ? "قصص الأنبياء" : "Prophet Stories",
    },
    {
      icon: Heart,
      label: isArabic ? "أسماء الله" : "99 Names",
      onClick: () => navigate("/names-of-allah"),
      gradient: "from-rose-500 to-pink-500",
      ariaLabel: isArabic ? "أسماء الله الحسنى" : "Names of Allah",
    },
    {
      icon: GraduationCap,
      label: isArabic ? "التاريخ" : "History",
      onClick: () => navigate("/islamichistory"),
      gradient: "from-emerald-500 to-teal-500",
      ariaLabel: isArabic ? "التاريخ الإسلامي" : "Islamic History",
    },
    {
      icon: MapPin,
      label: isArabic ? "المدن" : "Cities",
      onClick: () => navigate("/holy-cities"),
      gradient: "from-cyan-500 to-blue-500",
      ariaLabel: isArabic ? "المدن المقدسة" : "Holy Cities",
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow={isArabic ? "اعرف دينك" : "Knowledge Hub"}
        title={isArabic ? "تعليم" : "Education"}
        subtitle={
          isArabic
            ? `${totalCount} موضوعًا في ${sections.length} أقسام`
            : `${totalCount} topics across ${sections.length} categories`
        }
      />

      {/* Persistent Quick Actions */}
      <QuickActionsRow actions={quickActions} />

        {/* Hero summary */}
        <div className="relative overflow-hidden premium-card rounded-3xl p-6 islamic-pattern-bg animate-fade-in">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-islamic-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center rich-shadow">
              <GraduationCap className="h-7 w-7 text-primary-foreground" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold leading-tight">
                {isArabic
                  ? "اكتشف العلوم الإسلامية"
                  : "Discover Islamic Knowledge"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic
                  ? `${totalCount} موضوعًا مقسمة إلى ${sections.length} أقسام`
                  : `${totalCount} topics across ${sections.length} categories`}
              </p>
            </div>
          </div>
        </div>

      {/* Sections */}
      {sections.map((section, sIdx) => {
        const itemCountLabel = `${section.items.length} ${
          isArabic
            ? section.items.length === 1
              ? "موضوع"
              : "مواضيع"
            : section.items.length === 1
            ? "topic"
            : "topics"
        }`;
        return (
          <PageSection
            key={section.id}
            icon={section.icon}
            label={isArabic ? section.labelAr : section.labelEn}
            hint={itemCountLabel}
            accent={section.accent}
            delay={100 + sIdx * 80}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {section.items.map((card) => {
                const Icon = card.icon;
                const titleText = isArabic ? card.titleAr : card.titleEn;
                return (
                  <button
                    key={card.link}
                    onClick={() => navigate(card.link)}
                    aria-label={titleText}
                    className="text-left press-tile group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <div className="glass-card rounded-2xl p-4 hover:border-primary/30 smooth-transition relative overflow-hidden h-full">
                      <div
                        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 blur-2xl smooth-transition`}
                        aria-hidden="true"
                      />
                      <div className="flex items-center gap-4 relative">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 smooth-transition`}
                          aria-hidden="true"
                        >
                          <Icon
                            className="h-5 w-5 text-white drop-shadow-sm"
                            strokeWidth={2.2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[15px] leading-tight">
                            {titleText}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {isArabic ? card.descAr : card.descEn}
                          </p>
                        </div>
                        <ChevronRight
                          className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 smooth-transition flex-shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </PageSection>
        );
      })}
    </PageContainer>
  );
};

export default StoriesAndNames;
