import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import {
  ArrowLeft,
  Sparkles,
  Hand,        // Salah
  Droplets,    // Ar-Rayyan (thirst -> quenched)
  HandCoins,   // Charity
  Landmark,    // Hajj/Umrah
  Swords,      // Jihad
  ShieldCheck, // Restrain anger & forgive
  BadgeCheck,  // Companions of the Right
  RotateCcw,   // Repentance / Remembrance
} from "lucide-react";

/* -------------------------------------------
   Types
--------------------------------------------*/
type RefItem = {
  source: "Quran" | "Hadith";
  reference: string;
  text: { ar: string; en: string };
};

type Door = {
  icon: any;
  nameAr: string;
  nameEn: string;
  whoEnters: { ar: string; en: string };
  description: { ar: string; en: string };
  details: { ar: string; en: string };
  references: RefItem[];
};

/* -------------------------------------------
   Color tones (same vibe as your other pages)
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
];
const toneFor = (i: number) => TONES[i % TONES.length];

/* -------------------------------------------
   Copy
--------------------------------------------*/
const DoorsOfHeaven: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const content = {
    title: ar ? "أبواب الجنة" : "Doors of Paradise",
    back: ar ? "رجوع" : "Back",
    description: ar
      ? "تعرف على الأبواب الثمانية للجنة ومن يدخل منها"
      : "Learn about the eight doors of Paradise and who enters through them",
    intro: ar
      ? "للجنة ثمانية أبواب، كل باب منها يدخل منه أهل عمل معين من الأعمال الصالحة. ومن كان من أهل عمل من الأعمال دُعي من بابه الذي يناسب عمله."
      : "Paradise has eight doors. Each door admits people who excelled in specific righteous deeds. Those who excelled in a deed will be called from the door that matches their actions.",
    details: ar ? "التفاصيل" : "Details",
    references: ar ? "المراجع" : "References",
    whoEnters: ar ? "من يدخل منه" : "Who Enters",
    descLabel: ar ? "الوصف" : "Description",
    blessingsTitle: ar ? "نعيم الجنة" : "Blessings of Paradise",
  };

  /* -------------------------------------------
     Data (your exact text preserved)
  --------------------------------------------*/
  const DOORS: Door[] = [
    {
      icon: Hand,
      nameAr: "باب الصلاة",
      nameEn: "Door of Prayer (Bab as-Salah)",
      whoEnters: {
        ar: "المداومون على الصلوات الخمس في أوقاتها",
        en: "Those who consistently performed the five daily prayers on time",
      },
      description: {
        ar: "باب خاص بأهل الصلاة الذين حافظوا عليها في أوقاتها وأتموا أركانها وخشعوا فيها",
        en: "A special door for those who maintained their prayers on time, completed their pillars, and had humility in them",
      },
      details: {
        ar: "هذا الباب يدخل منه من حافظ على الصلوات الخمس في أوقاتها، وأداها بخشوع وطمأنينة، واستشعر عظمة الله فيها. الصلاة عماد الدين وأول ما يحاسب عليه العبد يوم القيامة، فمن حافظ عليها كانت له نوراً وبرهاناً ونجاةً يوم القيامة.",
        en: "This door admits those who maintained the five daily prayers on time, performed them with humility and tranquility, and felt Allah's greatness in them. Prayer is the pillar of religion and the first thing a servant will be accountable for on the Day of Judgment. Those who maintain it will have light, proof, and salvation on the Day of Judgment.",
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Muslim",
          text: {
            ar: "من توضأ فأحسن الوضوء، ثم أتى الجمعة فاستمع وأنصت، غفر له ما بينه وبين الجمعة وزيادة ثلاثة أيام",
            en: "Whoever performs ablution perfectly and then goes to Friday prayer, listens attentively, will have his sins between that Friday and the next forgiven, plus three more days",
          },
        },
      ],
    },
    {
      icon: Droplets,
      nameAr: "باب الريان",
      nameEn: "Door of Ar-Rayyan",
      whoEnters: { ar: "الصائمون", en: "Those who fasted" },
      description: {
        ar: "باب مخصص للصائمين الذين صاموا رمضان وتطوعاً لله",
        en: "A door designated for those who fasted Ramadan and voluntary fasts for Allah",
      },
      details: {
        ar: "الريان باب من أبواب الجنة لا يدخله إلا الصائمون، فإذا دخلوا أُغلق فلا يدخل منه أحد غيرهم. سُمي الريان لأن الصائمين يصيبهم الظمأ في الدنيا من صيامهم، فيُسقون من هذا الباب حين يدخلونه فلا يظمأون بعده أبداً. وهذا من كرامة الله للصائمين.",
        en: "Ar-Rayyan is a door of Paradise that only those who fasted will enter. When they enter, it will be closed and no one else will enter through it. It's named Ar-Rayyan (the well-watered) because those who fasted experienced thirst in this world from their fasting, so they will be given drink from this door when they enter it and will never thirst after that. This is from Allah's honor for those who fasted.",
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Bukhari",
          text: {
            ar: "إن في الجنة باباً يقال له الريان، يدخل منه الصائمون يوم القيامة، لا يدخل منه أحد غيرهم",
            en: "There is a gate in Paradise called Ar-Rayyan, through which only those who fasted will enter on the Day of Resurrection, and no one else will enter through it",
          },
        },
      ],
    },
    {
      icon: HandCoins,
      nameAr: "باب الصدقة",
      nameEn: "Door of Charity (Bab as-Sadaqah)",
      whoEnters: { ar: "المتصدقون", en: "Those who gave charity" },
      description: {
        ar: "باب لأهل الصدقة الذين أنفقوا أموالهم في سبيل الله",
        en: "A door for those of charity who spent their wealth in the way of Allah",
      },
      details: {
        ar: "يدخل من هذا الباب الذين كانوا يتصدقون بأموالهم ابتغاء مرضاة الله، سواء كانت صدقة واجبة كالزكاة أو صدقة تطوع. الصدقة تطفئ الخطيئة كما يطفئ الماء النار، وتظل صاحبها يوم القيامة. والله يضاعف الصدقة لصاحبها أضعافاً كثيرة.",
        en: "Those who gave charity with their wealth seeking Allah's pleasure will enter through this door, whether it was obligatory charity like Zakat or voluntary charity. Charity extinguishes sin as water extinguishes fire, and it will shade its giver on the Day of Judgment. Allah multiplies charity for its giver many times over.",
      },
      references: [
        {
          source: "Quran",
          reference: "2:261",
          text: {
            ar: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ",
            en: "The example of those who spend their wealth in the way of Allah is like a seed that produces seven ears, in each ear is a hundred grains",
          },
        },
      ],
    },
    {
      icon: Landmark,
      nameAr: "باب الحج",
      nameEn: "Door of Hajj (Bab al-Hajj)",
      whoEnters: { ar: "الحجاج والمعتمرون", en: "Those who performed Hajj and Umrah" },
      description: {
        ar: "باب لمن حج واعتمر وأدى النسك خالصاً لله",
        en: "A door for those who performed Hajj and Umrah purely for Allah's sake",
      },
      details: {
        ar: "يدخل من هذا الباب من أدى فريضة الحج أو عمرة مبرورة، وزار بيت الله الحرام تعظيماً لله وطاعةً له. الحج المبرور ليس له جزاء إلا الجنة، وهو من أفضل الأعمال عند الله. من حج فلم يرفث ولم يفسق رجع من ذنوبه كيوم ولدته أمه.",
        en: "Those who fulfilled the obligation of Hajj or performed an accepted Umrah, and visited the Sacred House of Allah in glorification and obedience to Him, will enter through this door. An accepted Hajj has no reward except Paradise, and it is among the best deeds with Allah. Whoever performs Hajj without committing obscenity or sin returns from his sins as the day his mother bore him.",
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Bukhari",
          text: {
            ar: "من حج فلم يرفث ولم يفسق رجع كيوم ولدته أمه",
            en: "Whoever performs Hajj and does not commit any obscenity or transgression, will return (free from sins) as the day his mother bore him",
          },
        },
      ],
    },
    {
      icon: Swords,
      nameAr: "باب الجهاد",
      nameEn: "Door of Jihad (Bab al-Jihad)",
      whoEnters: { ar: "المجاهدون في سبيل الله", en: "Those who strived in the way of Allah" },
      description: {
        ar: "باب للمجاهدين الذين قاتلوا في سبيل الله لإعلاء كلمته",
        en: "A door for those who fought in Allah's way to elevate His word",
      },
      details: {
        ar: "يدخل منه من جاهد في سبيل الله بالنفس والمال، ونصر دين الله، وأعلى كلمة الله. الجهاد ذروة سنام الإسلام، ومن قاتل لتكون كلمة الله هي العليا فهو في سبيل الله. وللشهداء منزلة عظيمة عند الله، فهم أحياء عند ربهم يرزقون.",
        en: "Those who strived in Allah's way with their lives and wealth, supported Allah's religion, and elevated Allah's word will enter through it. Jihad is the peak of Islam's hump, and whoever fights so that Allah's word is supreme is in Allah's way. Martyrs have a magnificent status with Allah; they are alive with their Lord, receiving provision.",
      },
      references: [
        {
          source: "Quran",
          reference: "3:169",
          text: {
            ar: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ",
            en: "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord, receiving provision",
          },
        },
      ],
    },
    {
      icon: ShieldCheck,
      nameAr: "باب الكاظمين الغيظ",
      nameEn: "Door of Those Who Restrain Anger",
      whoEnters: { ar: "من كظم غيظه وعفا عن الناس", en: "Those who restrained their anger and forgave people" },
      description: {
        ar: "باب لمن كظم غيظه وصبر على الأذى وعفا عمن ظلمه",
        en: "A door for those who restrained their anger, were patient with harm, and forgave those who wronged them",
      },
      details: {
        ar: "يدخل من هذا الباب من ملك نفسه عند الغضب، وعفا عن الناس مع قدرته على الانتقام، وصبر على أذى الآخرين ابتغاء مرضاة الله. وقد وصف الله المتقين بأنهم (الْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ)، ووعدهم بأنهم من المحسنين الذين يحبهم الله.",
        en: "Those who controlled themselves when angry, forgave people despite having the power to retaliate, and were patient with others' harm seeking Allah's pleasure will enter through this door. Allah described the righteous as 'those who restrain anger and pardon people,' and promised them they are among the good-doers whom Allah loves.",
      },
      references: [
        {
          source: "Quran",
          reference: "3:134",
          text: {
            ar: "الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
            en: "Who spend in prosperity and adversity, and who restrain anger and pardon people. And Allah loves the doers of good",
          },
        },
      ],
    },
    {
      icon: BadgeCheck,
      nameAr: "باب الأيمن",
      nameEn: "Door of the Right (Bab al-Ayman)",
      whoEnters: { ar: "أصحاب اليمين", en: "The companions of the right" },
      description: {
        ar: "باب لأصحاب اليمين الذين يؤتون كتبهم بأيمانهم",
        en: "A door for the companions of the right who will be given their records in their right hands",
      },
      details: {
        ar: "يدخل منه أصحاب اليمين، وهم المؤمنون الصالحون الذين عملوا الخير في الدنيا. سُموا بأصحاب اليمين لأنهم يأخذون كتبهم بأيمانهم يوم القيامة، وهذه علامة السعادة والفلاح. هؤلاء هم الفائزون الذين أعد الله لهم جنات تجري من تحتها الأنهار.",
        en: "The companions of the right will enter through it - they are the righteous believers who did good in this world. They're called companions of the right because they will take their records with their right hands on the Day of Judgment, which is a sign of happiness and success. These are the winners for whom Allah has prepared gardens beneath which rivers flow.",
      },
      references: [
        {
          source: "Quran",
          reference: "56:27-28",
          text: {
            ar: "وَأَصْحَابُ الْيَمِينِ مَا أَصْحَابُ الْيَمِينِ ۝ فِي سِدْرٍ مَّخْضُودٍ",
            en: "The companions of the right - what are the companions of the right? [They will be] among thornless lote trees",
          },
        },
      ],
    },
    {
      icon: RotateCcw,
      nameAr: "باب التوبة / باب الذكر",
      nameEn: "Door of Repentance / Door of Remembrance",
      whoEnters: { ar: "التائبون والذاكرون", en: "Those who repented and remembered Allah" },
      description: {
        ar: "باب للتائبين من ذنوبهم والمكثرين من ذكر الله",
        en: "A door for those who repented from their sins and frequently remembered Allah",
      },
      details: {
        ar: "يدخل من هذا الباب من تاب إلى الله توبة نصوحاً، وندم على ما فعل من الذنوب، وعزم على عدم العودة إليها. وكذلك من أكثر من ذكر الله في قلبه ولسانه، فالذكر من أحب الأعمال إلى الله وأيسرها. والتوبة الصادقة تمحو الذنوب مهما عظمت، والله يفرح بتوبة العبد.",
        en: "Those who repented to Allah sincerely, regretted their sins, and resolved not to return to them will enter through this door. Also those who frequently remembered Allah in their hearts and tongues, as remembrance is among the most beloved and easiest deeds to Allah. Sincere repentance erases sins no matter how great, and Allah rejoices at His servant's repentance.",
      },
      references: [
        {
          source: "Quran",
          reference: "39:53",
          text: {
            ar: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
            en: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins'",
          },
        },
      ],
    },
  ];

  const BLESSINGS = {
    title: content.blessingsTitle,
    items: ar
      ? [
          "أنهار من ماء غير آسن وأنهار من لبن ولم يتغير طعمه وأنهار من خمر لذة للشاربين وأنهار من عسل مصفى",
          "حور عين كأمثال اللؤلؤ المكنون",
          "فواكه كثيرة لا مقطوعة ولا ممنوعة",
          "قصور وخيام من درّ مجوف",
          "فرش مرفوعة وأكواب موضوعة ونمارق مصفوفة",
          "لا يسمع فيها لغو ولا تأثيم",
          "لا موت فيها ولا مرض ولا هرم ولا حزن",
          "رضوان الله الأكبر",
        ]
      : [
          "Rivers of pure water, rivers of milk, rivers of wine delicious to drinkers, and rivers of clarified honey",
          "Fair maidens like hidden pearls",
          "Abundant fruits, never ending and never forbidden",
          "Palaces and pavilions of hollow pearls",
          "Raised couches, placed cups, and arranged cushions",
          "No ill speech therein and no sinful discourse",
          "No death, disease, old age, or sorrow",
          "The greatest pleasure: Allah's satisfaction",
        ],
  };

  const [selected, setSelected] = React.useState<Door | null>(null);

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
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        {!selected && (
          <>
            <p className={`text-muted-foreground px-1 mb-2 ${ar ? "text-right arabic-regal" : ""}`}>
              {content.intro}
            </p>
            <p className="text-muted-foreground px-1 mb-6">{content.description}</p>
          </>
        )}
      </div>

      {/* LIST VIEW (vertical cards) */}
      {!selected && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid gap-4">
            {DOORS.map((door, idx) => {
              const Icon = door.icon;
              const tone = toneFor(idx);
              return (
                <div key={door.nameEn} onClick={() => setSelected(door)} className="cursor-pointer group">
                  <div className="relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                    />
                    <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}
                        >
                          <Icon className={`h-7 w-7 ${tone.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {ar ? door.nameAr : door.nameEn}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ar ? door.description.ar : door.description.en}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">{content.whoEnters}:</span>{" "}
                            {ar ? door.whoEnters.ar : door.whoEnters.en}
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

          {/* Blessings block below the list */}
          <div className="mt-6">
            <Card className="neomorph backdrop-blur-xl p-6 rounded-3xl">
              <h3 className="text-2xl text-center text-primary mb-4">{BLESSINGS.title}</h3>
              <ul className={`space-y-3 ${ar ? "text-right arabic-regal" : ""}`}>
                {BLESSINGS.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* DETAIL VIEW (page-like; no routing) */}
      {selected && (
        <div className="max-w-2xl mx-auto px-6">
          {/* Gradient accent */}
          <div className="relative overflow-hidden mb-6">
            {(() => {
              const idx = Math.max(0, DOORS.findIndex((d) => d.nameEn === selected.nameEn));
              const tone = toneFor(idx);
              return <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-3xl blur-2xl opacity-70`} />;
            })()}
            <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
              {(() => {
                const idx = Math.max(0, DOORS.findIndex((d) => d.nameEn === selected.nameEn));
                const tone = toneFor(idx);
                const Icon = selected.icon;
                return (
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${tone.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-1">
                        {ar ? selected.nameAr : selected.nameEn}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{content.whoEnters}:</span>{" "}
                        {ar ? selected.whoEnters.ar : selected.whoEnters.en}
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
                {ar ? selected.description.ar : selected.description.en}
              </div>
            </Card>
            <Card className="neomorph backdrop-blur-xl p-4 rounded-2xl">
              <div className="text-xs uppercase text-muted-foreground">{content.whoEnters}</div>
              <div className={`text-sm mt-1 ${ar ? "text-right" : ""}`}>
                {ar ? selected.whoEnters.ar : selected.whoEnters.en}
              </div>
            </Card>
          </div>

          {/* Details */}
          <Card className="neomorph backdrop-blur-xl p-6 rounded-3xl mb-6">
            <h3 className="font-semibold mb-2 text-primary">{content.details}</h3>
            <p className={`text-base leading-relaxed ${ar ? "text-right arabic-regal" : ""}`}>
              {ar ? selected.details.ar : selected.details.en}
            </p>
          </Card>

          {/* References */}
          {selected.references?.length > 0 && (
            <div className="grid gap-3 mb-2">
              <h3 className="font-semibold text-primary">{content.references}</h3>
              {selected.references.map((ref, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full neomorph hover:neomorph-pressed justify-start h-auto py-3"
                  onClick={() => {
                    if (ref.source === "Quran") {
                      const surahNum = ref.reference.split(":")[0];
                      navigate(`/quran/${surahNum}`);
                    }
                  }}
                >
                  <div className="flex flex-col gap-1 w-full text-left">
                    <div className="font-semibold text-sm">
                      {ref.source} {ref.reference}
                    </div>
                    <div className={`text-xs text-muted-foreground ${ar ? "text-right arabic-regal" : ""}`}>
                      {ar ? ref.text.ar : ref.text.en}
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

export default DoorsOfHeaven;
