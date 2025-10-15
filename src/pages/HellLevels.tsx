import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowLeft, Flame, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* -------------------------------------------
   Types
--------------------------------------------*/
type RefItem = {
  source: "Quran" | "Hadith";
  ref: string;
  textAr: string;
  textEn: string;
};

type Level = {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string;
  detailsEn: string;
  references: RefItem[];
};

/* -------------------------------------------
   Color tones (fiery palette per row)
--------------------------------------------*/
const TONES = [
  { gradient: "from-red-500/25 via-orange-500/20 to-amber-500/20", iconBg: "bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" },
  { gradient: "from-rose-500/25 via-red-500/20 to-orange-500/20", iconBg: "bg-rose-500/10", iconColor: "text-rose-600 dark:text-rose-400" },
  { gradient: "from-orange-500/25 via-amber-500/20 to-yellow-500/20", iconBg: "bg-orange-500/10", iconColor: "text-orange-600 dark:text-orange-400" },
  { gradient: "from-red-600/25 via-rose-500/20 to-orange-500/20", iconBg: "bg-red-600/10", iconColor: "text-red-700 dark:text-red-400" },
  { gradient: "from-amber-600/25 via-orange-500/20 to-red-500/20", iconBg: "bg-amber-600/10", iconColor: "text-amber-700 dark:text-amber-400" },
  { gradient: "from-red-700/25 via-red-500/20 to-rose-500/20", iconBg: "bg-red-700/10", iconColor: "text-red-700 dark:text-red-400" },
  { gradient: "from-stone-800/25 via-red-700/20 to-amber-600/20", iconBg: "bg-stone-800/10", iconColor: "text-stone-700 dark:text-stone-300" },
];
const toneFor = (i: number) => TONES[i % TONES.length];

/* -------------------------------------------
   Component
--------------------------------------------*/
const HellLevels: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const content = {
    title: ar ? "دركات جهنم" : "Levels of Hell",
    back: ar ? "رجوع" : "Back",
    intro: ar
      ? "لجهنم سبع دركات، كل دركة أشد من التي فوقها عذاباً"
      : "Hellfire has seven levels, each one more severe in punishment than the one above it",
    warning: ar ? "نعوذ بالله من النار" : "We seek refuge in Allah from the Fire",
    detailsLabel: ar ? "التفاصيل" : "Details",
    referencesLabel: ar ? "المراجع" : "References",
    descLabel: ar ? "الوصف" : "Description",
  };

  const LEVELS: Level[] = [
    {
      nameAr: "جهنم",
      nameEn: "Jahannam",
      descAr: "الطبقة الأولى من النار",
      descEn: "The first level of the Fire",
      detailsAr: "للمسلمين العصاة الذين يدخلون النار ثم يخرجون منها بشفاعة أو برحمة الله",
      detailsEn: "For sinful Muslims who will eventually exit through intercession or Allah's mercy",
      references: [
        {
          source: "Quran",
          ref: "4:55",
          textAr:
            "فَمِنْهُم مَّنْ آمَنَ بِهِ وَمِنْهُم مَّن صَدَّ عَنْهُ ۚ وَكَفَىٰ بِجَهَنَّمَ سَعِيرًا",
          textEn:
            "And among them were those who believed in it, and among them were those who were averse to it. And sufficient is Hell as a blaze",
        },
      ],
    },
    {
      nameAr: "لظى",
      nameEn: "Ladha",
      descAr: "الطبقة الثانية، نار شديدة اللهب",
      descEn: "The second level, an intensely blazing fire",
      detailsAr: "نار تتلظى وتشتعل، تنزع الجلد عن العظم",
      detailsEn: "A fire that blazes intensely, stripping skin from bone",
      references: [
        {
          source: "Quran",
          ref: "70:15-16",
          textAr: "كَلَّا ۖ إِنَّهَا لَظَىٰ * نَزَّاعَةً لِّلشَّوَىٰ",
          textEn: "No! Indeed, it is the Flame [of Hell], a remover of exteriors",
        },
      ],
    },
    {
      nameAr: "الحطمة",
      nameEn: "Al-Hutamah",
      descAr: "الطبقة الثالثة، تحطم كل ما يلقى فيها",
      descEn: "The third level, crushes everything thrown into it",
      detailsAr: "نار تطلع على الأفئدة",
      detailsEn: "A fire that reaches the hearts",
      references: [
        {
          source: "Quran",
          ref: "104:4-7",
          textAr:
            "كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ * وَمَا أَدْرَاكَ مَا الْحُطَمَةُ * نَارُ اللَّهِ الْمُوقَدَةُ",
          textEn:
            "No! He will surely be thrown into the Crusher. And what can make you know what is the Crusher? It is the fire of Allah, [eternally] fueled",
        },
      ],
    },
    {
      nameAr: "سعير",
      nameEn: "Sa'ir",
      descAr: "الطبقة الرابعة، نار مستعرة",
      descEn: "The fourth level, blazing flames",
      detailsAr: "نار شديدة الاشتعال والسعير",
      detailsEn: "Intensely flaming and blazing fire",
      references: [
        {
          source: "Quran",
          ref: "4:10",
          textAr:
            "إِنَّ الَّذِينَ يَأْكُلُونَ أَمْوَالَ الْيَتَامَىٰ ظُلْمًا إِنَّمَا يَأْكُلُونَ فِي بُطُونِهِمْ نَارًا ۖ وَسَيَصْلَوْنَ سَعِيرًا",
          textEn:
            "Indeed, those who devour the property of orphans unjustly are only consuming into their bellies fire. And they will be burned in a Blaze",
        },
      ],
    },
    {
      nameAr: "سقر",
      nameEn: "Saqar",
      descAr: "الطبقة الخامسة، نار لا تبقي ولا تذر",
      descEn: "The fifth level, a fire that spares nothing and leaves nothing",
      detailsAr: "تحرق الجلود وتسود الوجوه، لا تبقي على شيء ولا تذر شيئاً",
      detailsEn: "Burns the skin and blackens faces, sparing nothing and leaving nothing",
      references: [
        {
          source: "Quran",
          ref: "74:26-28",
          textAr: "سَأُصْلِيهِ سَقَرَ * وَمَا أَدْرَاكَ مَا سَقَرُ * لَا تُبْقِي وَلَا تَذَرُ",
          textEn:
            "I will drive him into Saqar. And what can make you know what is Saqar? It lets nothing remain and leaves nothing [unburned]",
        },
      ],
    },
    {
      nameAr: "الجحيم",
      nameEn: "Al-Jahim",
      descAr: "الطبقة السادسة، نار عظيمة شديدة التأجج",
      descEn: "The sixth level, great intensely raging fire",
      detailsAr: "نار شديدة الحرارة والتأجج",
      detailsEn: "Fire of extreme heat and rage",
      references: [
        {
          source: "Quran",
          ref: "26:91",
          textAr: "وَبُرِّزَتِ الْجَحِيمُ لِلْغَاوِينَ",
          textEn: "And Hellfire will be brought forth for the deviators",
        },
      ],
    },
    {
      nameAr: "الهاوية",
      nameEn: "Al-Hawiyah",
      descAr: "الطبقة السابعة وأسفل دركات النار",
      descEn: "The seventh and lowest level of the Fire",
      detailsAr: "للمنافقين الذين أظهروا الإيمان وأبطنوا الكفر، أشد العذاب",
      detailsEn:
        "For hypocrites who showed faith but concealed disbelief, the severest punishment",
      references: [
        {
          source: "Quran",
          ref: "101:9-11",
          textAr: "فَأُمُّهُ هَاوِيَةٌ * وَمَا أَدْرَاكَ مَا هِيَهْ * نَارٌ حَامِيَةٌ",
          textEn:
            "His refuge will be an abyss. And what can make you know what that is? It is a Fire, intensely hot",
        },
        {
          source: "Quran",
          ref: "4:145",
          textAr: "إِنَّ الْمُنَافِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ",
          textEn: "Indeed, the hypocrites will be in the lowest depths of the Fire",
        },
      ],
    },
  ];

  const [selected, setSelected] = React.useState<Level | null>(null);

  return (
    <div className="min-h-screen pb-20">
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
            <Flame className="h-6 w-6 text-destructive" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        {!selected && (
          <div className="space-y-2 mb-4">
            <p className={`text-muted-foreground ${ar ? "text-right arabic-regal" : ""}`}>
              {content.intro}
            </p>
            <p className="text-destructive font-semibold">{content.warning}</p>
          </div>
        )}
      </div>

      {/* LIST VIEW (vertical cards, no routing) */}
      {!selected && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid gap-4">
            {LEVELS.map((lvl, idx) => {
              const tone = toneFor(idx);
              return (
                <div
                  key={lvl.nameEn}
                  onClick={() => setSelected(lvl)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                    />
                    <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                        >
                          <span className={`text-lg font-bold ${tone.iconColor}`}>{idx + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {ar ? lvl.nameAr : lvl.nameEn}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ar ? lvl.descAr : lvl.descEn}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {ar ? lvl.detailsAr : lvl.detailsEn}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-destructive"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
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

      {/* DETAIL VIEW (page-like; no routing) */}
      {selected && (
        <div className="max-w-2xl mx-auto px-6">
          {/* Gradient accent header */}
          <div className="relative overflow-hidden mb-6">
            {(() => {
              const idx = Math.max(0, LEVELS.findIndex((l) => l.nameEn === selected.nameEn));
              const tone = toneFor(idx);
              return (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-3xl blur-2xl opacity-70`}
                />
              );
            })()}
            <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
              {(() => {
                const idx = Math.max(0, LEVELS.findIndex((l) => l.nameEn === selected.nameEn));
                const tone = toneFor(idx);
                return (
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}
                    >
                      <Flame className={`h-7 w-7 ${tone.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-1">
                        {ar ? selected.nameAr : selected.nameEn}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {ar ? selected.descAr : selected.descEn}
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
              <div className="text-xs uppercase text-muted-foreground">{content.descLabel}</div>
              <div className={`text-sm mt-1 ${ar ? "text-right" : ""}`}>
                {ar ? selected.descAr : selected.descEn}
              </div>
            </Card>
            <Card className="neomorph backdrop-blur-xl p-4 rounded-2xl">
              <div className="text-xs uppercase text-muted-foreground">{content.detailsLabel}</div>
              <div className={`text-sm mt-1 ${ar ? "text-right" : ""}`}>
                {ar ? selected.detailsAr : selected.detailsEn}
              </div>
            </Card>
          </div>

          {/* References */}
          {selected.references?.length > 0 && (
            <div className="grid gap-3 mb-2">
              <h3 className="font-semibold text-destructive">{content.referencesLabel}</h3>
              {selected.references.map((ref, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full neomorph hover:neomorph-pressed justify-start h-auto py-3 border-destructive/30"
                  onClick={() => {
                    if (ref.source === "Quran") {
                      const surahNum = ref.ref.split(":")[0];
                      navigate(`/quran/${surahNum}`);
                    }
                  }}
                >
                  <div className="flex flex-col gap-1 w-full text-left">
                    <div className="font-semibold text-sm text-destructive">
                      {ref.source} {ref.ref}
                    </div>
                    <div className={`text-xs text-muted-foreground ${ar ? "text-right arabic-regal" : ""}`}>
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

export default HellLevels;
