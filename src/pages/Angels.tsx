import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import {
  ArrowLeft,
  Sparkles,      // Jibril
  CloudRain,      // Mikail
  Megaphone,      // Israfil (Trumpet stand-in)
  Hourglass,      // Angel of Death
  Star,           // Ridwan
  Flame,          // Malik / Zabaniyah
  HelpCircle,     // Munkar & Nakir (questioning)
  BookOpen,       // Raqib & Atid (recording)
  Crown,          // Bearers of the Throne
} from "lucide-react";

/* -------------------------------------------
   Types
--------------------------------------------*/
type Reference = {
  source: "Quran" | "Hadith";
  ref: string;
  textAr: string;
  textEn: string;
};

type Angel = {
  icon: any;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string;
  detailsEn: string;
  references: Reference[];
};

/* -------------------------------------------
   Color tones (Empire vibe)
--------------------------------------------*/
const TONES = [
  { gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20", iconBg: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
  { gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
  { gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20", iconBg: "bg-sky-500/10", iconColor: "text-sky-600 dark:text-sky-400" },
  { gradient: "from-lime-500/20 via-green-400/20 to-emerald-500/20", iconBg: "bg-lime-500/10", iconColor: "text-lime-600 dark:text-lime-400" },
  { gradient: "from-fuchsia-500/20 via-rose-400/20 to-pink-500/20", iconBg: "bg-fuchsia-500/10", iconColor: "text-fuchsia-600 dark:text-fuchsia-400" },
  { gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20", iconBg: "bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
  { gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20", iconBg: "bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" },
  { gradient: "from-yellow-500/20 via-amber-400/20 to-orange-500/20", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-600 dark:text-yellow-400" },
];
const toneFor = (i: number) => TONES[i % TONES.length];

/* -------------------------------------------
   Angels data
--------------------------------------------*/
const ANGELS: Angel[] = [
  {
    icon: Sparkles,
    nameAr: "جبريل عليه السلام",
    nameEn: "Jibril (Gabriel)",
    roleAr: "ملك الوحي",
    roleEn: "Angel of Revelation",
    descAr: "أعظم الملائكة، موكل بإنزال الوحي على الأنبياء والرسل",
    descEn: "The greatest angel, responsible for delivering revelation to prophets and messengers",
    detailsAr: "روح القدس الذي نزل بالقرآن على قلب النبي محمد صلى الله عليه وسلم",
    detailsEn: "The Holy Spirit who brought down the Quran to the heart of Prophet Muhammad ﷺ",
    references: [
      {
        source: "Quran",
        ref: "2:97",
        textAr: "قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ",
        textEn:
          'Say, "Whoever is an enemy to Gabriel - it is he who has brought the Quran down upon your heart"',
      },
    ],
  },
  {
    icon: CloudRain,
    nameAr: "ميكائيل عليه السلام",
    nameEn: "Mikail (Michael)",
    roleAr: "ملك الرزق",
    roleEn: "Angel of Sustenance",
    descAr: "موكل بإنزال المطر وإنبات النبات والرزق",
    descEn: "Responsible for bringing rain, plant growth, and provisions",
    detailsAr: "الملك الموكل بالقطر والنبات، يدبر أمور الرزق بإذن الله",
    detailsEn: "The angel in charge of rain and plants, managing sustenance by Allah's permission",
    references: [
      {
        source: "Quran",
        ref: "2:98",
        textAr: "مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ",
        textEn:
          "Whoever is an enemy to Allah and His angels and His messengers and Gabriel and Michael",
      },
    ],
  },
  {
    icon: Megaphone,
    nameAr: "إسرافيل عليه السلام",
    nameEn: "Israfil",
    roleAr: "ملك الصور",
    roleEn: "Angel of the Trumpet",
    descAr: "موكل بالنفخ في الصور يوم القيامة",
    descEn: "Tasked with blowing the trumpet on the Day of Judgment",
    detailsAr: "ينفخ في الصور نفختين: نفخة الفناء ونفخة البعث",
    detailsEn: "Will blow the trumpet twice: the blast of destruction and the blast of resurrection",
    references: [
      {
        source: "Quran",
        ref: "39:68",
        textAr: "وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ",
        textEn: "And the Horn will be blown, and whoever is in the heavens will fall dead",
      },
    ],
  },
  {
    icon: Hourglass,
    nameAr: "ملك الموت عليه السلام",
    nameEn: "Azrael",
    roleAr: "ملك الموت",
    roleEn: "Angel of Death",
    descAr: "موكل بقبض الأرواح عند الموت",
    descEn: "Responsible for taking souls at the time of death",
    detailsAr: "يقبض أرواح العباد عندما يأتي أجلهم المحدد",
    detailsEn: "Takes the souls of servants when their appointed time comes",
    references: [
      {
        source: "Quran",
        ref: "32:11",
        textAr: "قُلْ يَتَوَفَّاكُم مَّلَكُ الْمَوْتِ الَّذِي وُكِّلَ بِكُمْ",
        textEn: "Say, The angel of death will take you who has been entrusted with you",
      },
    ],
  },
  {
    icon: Star,
    nameAr: "رضوان عليه السلام",
    nameEn: "Ridwan",
    roleAr: "خازن الجنة",
    roleEn: "Keeper of Paradise",
    descAr: "الملك الموكل بالجنة وخزانتها",
    descEn: "The angel in charge of Paradise and its treasures",
    detailsAr: "يستقبل أهل الجنة ويفتح لهم أبوابها",
    detailsEn: "Welcomes the people of Paradise and opens its gates for them",
    references: [{ source: "Hadith", ref: "Muslim", textAr: "رضوان خازن الجنة", textEn: "Ridwan, the keeper of Paradise" }],
  },
  {
    icon: Flame,
    nameAr: "مالك عليه السلام",
    nameEn: "Malik",
    roleAr: "خازن النار",
    roleEn: "Keeper of Hellfire",
    descAr: "الملك الموكل بالنار وعذابها",
    descEn: "The angel in charge of Hellfire and its punishment",
    detailsAr: "لا يضحك أبداً ولا يبتسم من شدة ما يرى من عذاب النار",
    detailsEn: "Never laughs or smiles due to the severity of what he sees of the Fire's punishment",
    references: [
      {
        source: "Quran",
        ref: "43:77",
        textAr: "وَنَادَوْا يَا مَالِكُ لِيَقْضِ عَلَيْنَا رَبُّكَ",
        textEn: "And they will call, O Malik, let your Lord put an end to us!",
      },
    ],
  },
  {
    icon: HelpCircle,
    nameAr: "منكر ونكير",
    nameEn: "Munkar and Nakir",
    roleAr: "ملائكة القبر",
    roleEn: "Angels of the Grave",
    descAr: "الموكلان بسؤال الموتى في قبورهم",
    descEn: "Responsible for questioning the dead in their graves",
    detailsAr: "يسألان الميت: من ربك؟ وما دينك؟ ومن نبيك؟",
    detailsEn: "They ask the deceased: Who is your Lord? What is your religion? Who is your prophet?",
    references: [
      {
        source: "Hadith",
        ref: "Tirmidhi",
        textAr: "إذا قُبر الميت أتاه ملكان",
        textEn: "When the deceased is buried, two angels come to him",
      },
    ],
  },
  {
    icon: BookOpen,
    nameAr: "رقيب وعتيد",
    nameEn: "Raqib and Atid",
    roleAr: "ملائكة الكتابة",
    roleEn: "Recording Angels",
    descAr: "الموكلان بكتابة أعمال بني آدم",
    descEn: "Tasked with recording the deeds of humans",
    detailsAr: "أحدهما عن اليمين يكتب الحسنات، والآخر عن الشمال يكتب السيئات",
    detailsEn: "One on the right records good deeds, the other on the left records bad deeds",
    references: [
      {
        source: "Quran",
        ref: "50:17-18",
        textAr: "مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ",
        textEn: "Man does not utter any word except that with him is an observer prepared",
      },
    ],
  },
  {
    icon: Crown,
    nameAr: "حملة العرش",
    nameEn: "Bearers of the Throne",
    roleAr: "حملة عرش الرحمن",
    roleEn: "Carriers of Allah's Throne",
    descAr: "الموكلون بحمل عرش الله العظيم",
    descEn: "Responsible for carrying the Magnificent Throne of Allah",
    detailsAr: "هم الآن أربعة، ويوم القيامة يكونون ثمانية",
    detailsEn: "They are currently four, and on the Day of Judgment they will be eight",
    references: [
      {
        source: "Quran",
        ref: "69:17",
        textAr: "وَيَحْمِلُ عَرْشَ رَبِّكَ فَوْقَهُمْ يَوْمَئِذٍ ثَمَانِيَةٌ",
        textEn: "And there will bear the Throne of your Lord above them, that Day, eight",
      },
    ],
  },
  {
    icon: Flame,
    nameAr: "الزبانية",
    nameEn: "Az-Zabaniyah",
    roleAr: "ملائكة العذاب",
    roleEn: "Angels of Punishment",
    descAr: "الموكلون بتعذيب أهل النار",
    descEn: "Responsible for punishing the inhabitants of Hell",
    detailsAr: "تسعة عشر ملكاً غلاظاً شداداً لا يعصون الله",
    detailsEn: "Nineteen stern and severe angels who never disobey Allah",
    references: [
      {
        source: "Quran",
        ref: "74:30-31",
        textAr: "عَلَيْهَا تِسْعَةَ عَشَرَ",
        textEn: "Over it are nineteen angels",
      },
    ],
  },
];

/* -------------------------------------------
   Component
--------------------------------------------*/
const Angels: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const dir = ar ? "rtl" : "ltr";

  const [selected, setSelected] = React.useState<Angel | null>(null);

  const content = {
    title: ar ? "الملائكة" : "Angels",
    back: ar ? "رجوع" : "Back",
    description: ar
      ? "تعرف على الملائكة العظام وأدوارهم في الإسلام"
      : "Learn about the mighty angels and their roles in Islam",
  };

  return (
    <div className="min-h-screen pb-20" dir={dir}>
      {/* Header */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (selected ? setSelected(null) : navigate(-1))}
            aria-label={content.back}
            className="shrink-0 neomorph hover:neomorph-pressed"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        {!selected && (
          <p className={`text-muted-foreground px-1 mb-2 ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
            {content.description}
          </p>
        )}
      </div>

      {/* LIST VIEW */}
      {!selected && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid gap-4">
            {ANGELS.map((angel, idx) => {
              const Icon = angel.icon;
              const tone = toneFor(idx);
              return (
                <div key={angel.nameEn} onClick={() => setSelected(angel)} className="cursor-pointer group">
                  <div className="relative overflow-hidden rounded-2xl">
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                    />
                    <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                        >
                          <Icon className={`h-7 w-7 ${tone.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-lg mb-1 ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal`}>
                            {ar ? angel.nameAr : angel.nameEn}
                          </h3>
                          <p className={`text-sm text-muted-foreground ${ar ? "text-right arabic-regal" : ""} line-clamp-2 break-words whitespace-normal text-pretty hyphens-auto`}>
                            {ar ? angel.descAr : angel.descEn}
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
      )}

      {/* DETAIL VIEW */}
      {selected && (
        <div className="max-w-2xl mx-auto px-6">
          {/* Accent header */}
          <div className="relative overflow-hidden rounded-3xl mb-6">
            {(() => {
              const idx = Math.max(0, ANGELS.findIndex((a) => a.nameEn === selected.nameEn));
              const tone = toneFor(idx);
              return (
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-3xl blur-2xl opacity-70`} />
              );
            })()}
            <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
              {(() => {
                const idx = Math.max(0, ANGELS.findIndex((a) => a.nameEn === selected.nameEn));
                const tone = toneFor(idx);
                const Icon = selected.icon;
                return (
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${tone.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className={`text-2xl font-semibold mb-1 ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal`}>
                        {ar ? selected.nameAr : selected.nameEn}
                      </h2>
                      <p className={`text-sm text-muted-foreground ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal`}>
                        {ar ? selected.roleAr : selected.roleEn}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </div>

          {/* Meta blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="neomorph backdrop-blur-xl p-4 rounded-2xl">
              <div className={`text-xs uppercase text-muted-foreground ${ar ? "text-right" : ""}`}>
                {ar ? "الدور" : "Role"}
              </div>
              <div className={`text-sm mt-1 ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal`}>
                {ar ? selected.roleAr : selected.roleEn}
              </div>
            </Card>
            <Card className="neomorph backdrop-blur-xl p-4 rounded-2xl">
              <div className={`text-xs uppercase text-muted-foreground ${ar ? "text-right" : ""}`}>
                {ar ? "وصف مختصر" : "Summary"}
              </div>
              <div className={`text-sm mt-1 ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
                {ar ? selected.descAr : selected.descEn}
              </div>
            </Card>
          </div>

          {/* Details */}
          <Card className="neomorph backdrop-blur-xl p-6 rounded-3xl mb-6">
            <p className={`text-base leading-relaxed ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
              {ar ? selected.detailsAr : selected.detailsEn}
            </p>
          </Card>

          {/* References */}
          {selected.references?.length > 0 && (
            <div className="grid gap-3 mb-8">
              {selected.references.map((ref, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full neomorph hover:neomorph-pressed justify-start h-auto py-3"
                  onClick={() => {
                    if (ref.source === "Quran") {
                      const surah = ref.ref.split(":")[0];
                      navigate(`/quran/${surah}`);
                    }
                  }}
                >
                  <div className={`flex flex-col gap-1 w-full ${ar ? "text-right" : "text-left"}`}>
                    <div className="font-semibold text-sm text-primary break-words whitespace-normal">
                      {ref.source} {ref.ref}
                    </div>
                    <div className={`text-xs text-muted-foreground ${ar ? "arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
                      {ar ? ref.textAr : ref.textEn}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Angels;
