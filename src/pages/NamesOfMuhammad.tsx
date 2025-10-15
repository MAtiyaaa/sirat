import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowLeft, Sparkles, BookOpen, Star } from "lucide-react";
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

type NameEntry = {
  ar: string;
  en: string;
  meaning: string;
  detailsAr: string;
  detailsEn: string;
  references: RefItem[];
};

/* -------------------------------------------
   Pleasant gradient tones (like Empires)
--------------------------------------------*/
const TONES = [
  { gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20", iconBg: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
  { gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20", iconBg: "bg-sky-500/10", iconColor: "text-sky-600 dark:text-sky-400" },
  { gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
  { gradient: "from-lime-500/20 via-green-400/20 to-emerald-500/20", iconBg: "bg-lime-500/10", iconColor: "text-lime-600 dark:text-lime-400" },
  { gradient: "from-fuchsia-500/20 via-rose-400/20 to-pink-500/20", iconBg: "bg-fuchsia-500/10", iconColor: "text-fuchsia-600 dark:text-fuchsia-400" },
  { gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20", iconBg: "bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
];
const toneFor = (i: number) => TONES[i % TONES.length];

/* -------------------------------------------
   Data
--------------------------------------------*/
const NAMES: NameEntry[] = [
  { ar: "محمد", en: "Muhammad", meaning: "The Praised One", detailsAr: "الكثير الخصال الحميدة، المحمود في السماوات والأرض", detailsEn: "One with abundant praiseworthy qualities, praised in the heavens and earth", references: [{ source: "Quran", ref: "3:144", textAr: "وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ", textEn: "Muhammad is not but a messenger" }] },
  { ar: "أحمد", en: "Ahmad", meaning: "Most Praiseworthy", detailsAr: "أكثر الناس حمداً لله، وأحق الناس بالحمد", detailsEn: "The one who praises Allah the most, and most deserving of praise", references: [{ source: "Quran", ref: "61:6", textAr: "وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ", textEn: "Giving good tidings of a messenger to come after me, whose name is Ahmad" }] },
  { ar: "الماحي", en: "Al-Mahi", meaning: "The Eraser", detailsAr: "الذي يمحو الله به الكفر", detailsEn: "The one through whom Allah erases disbelief", references: [{ source: "Hadith", ref: "Bukhari", textAr: "أنا محمد وأحمد والماحي", textEn: "I am Muhammad, Ahmad, and Al-Mahi" }] },
  { ar: "الحاشر", en: "Al-Hashir", meaning: "The Gatherer", detailsAr: "الذي يُحشر الناس على قدمه", detailsEn: "The one at whose feet people will be gathered", references: [{ source: "Hadith", ref: "Bukhari", textAr: "والحاشر الذي يحشر الناس على قدمي", textEn: "And Al-Hashir, the one at whose feet people will be gathered" }] },
  { ar: "العاقب", en: "Al-Aqib", meaning: "The Last", detailsAr: "آخر الأنبياء", detailsEn: "The last of the prophets", references: [{ source: "Hadith", ref: "Bukhari", textAr: "والعاقب الذي ليس بعده نبي", textEn: "And Al-Aqib, after whom there is no prophet" }] },
  { ar: "خاتم النبيين", en: "Khatam an-Nabiyyin", meaning: "Seal of the Prophets", detailsAr: "آخر الأنبياء والمرسلين", detailsEn: "The last of the prophets and messengers", references: [{ source: "Quran", ref: "33:40", textAr: "وَخَاتَمَ النَّبِيِّينَ", textEn: "And [he is] the Seal of the Prophets" }] },
  { ar: "نبي الرحمة", en: "Nabi ar-Rahmah", meaning: "Prophet of Mercy", detailsAr: "النبي المرسل رحمة للعالمين", detailsEn: "The prophet sent as mercy to all worlds", references: [{ source: "Quran", ref: "21:107", textAr: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ", textEn: "And We have not sent you except as a mercy to the worlds" }] },
  { ar: "السراج المنير", en: "As-Siraj al-Munir", meaning: "The Illuminating Lamp", detailsAr: "المنير بالهداية والعلم", detailsEn: "The one who illuminates with guidance and knowledge", references: [{ source: "Quran", ref: "33:46", textAr: "وَدَاعِيًا إِلَى اللَّهِ بِإِذْنِهِ وَسِرَاجًا مُّنِيرًا", textEn: "And as one who invites to Allah by His permission, and an illuminating lamp" }] },
  { ar: "الأمين", en: "Al-Amin", meaning: "The Trustworthy", detailsAr: "الأمين الذي ائتمنه الله على الوحي", detailsEn: "The trustworthy one whom Allah entrusted with revelation", references: [{ source: "Hadith", ref: "Bukhari", textAr: "كان يسمى الأمين", textEn: "He was called Al-Amin" }] },
  { ar: "الصادق", en: "As-Sadiq", meaning: "The Truthful", detailsAr: "الصادق في قوله وفعله", detailsEn: "The truthful in speech and action", references: [{ source: "Hadith", ref: "Bukhari", textAr: "الصادق المصدوق", textEn: "The truthful, the believed" }] },
  { ar: "المصدوق", en: "Al-Musaddaq", meaning: "The Believed", detailsAr: "المصدق الذي صدقه الله في كل ما قال", detailsEn: "The one believed, whom Allah confirmed in all he said", references: [{ source: "Hadith", ref: "Bukhari", textAr: "الصادق المصدوق", textEn: "The truthful, the believed" }] },
  { ar: "الرسول", en: "Ar-Rasul", meaning: "The Messenger", detailsAr: "المرسل من الله إلى الناس", detailsEn: "The one sent by Allah to mankind", references: [{ source: "Quran", ref: "48:29", textAr: "مُّحَمَّدٌ رَّسُولُ اللَّهِ", textEn: "Muhammad is the Messenger of Allah" }] },
  { ar: "النبي", en: "An-Nabi", meaning: "The Prophet", detailsAr: "المختار من الله لتبليغ الرسالة", detailsEn: "The chosen one by Allah to convey the message", references: [{ source: "Quran", ref: "33:40", textAr: "وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ", textEn: "But [he is] the Messenger of Allah and the Seal of the Prophets" }] },
  { ar: "الشاهد", en: "Ash-Shahid", meaning: "The Witness", detailsAr: "الشاهد على أمته يوم القيامة", detailsEn: "The witness over his nation on the Day of Judgment", references: [{ source: "Quran", ref: "33:45", textAr: "يَا أَيُّهَا النَّبِيُّ إِنَّا أَرْسَلْنَاكَ شَاهِدًا", textEn: "O Prophet, indeed We have sent you as a witness" }] },
  { ar: "المبشر", en: "Al-Mubashshir", meaning: "Bearer of Good News", detailsAr: "المبشر بالجنة لمن أطاع الله", detailsEn: "The bearer of good news of Paradise to those who obey Allah", references: [{ source: "Quran", ref: "33:45", textAr: "وَمُبَشِّرًا", textEn: "And as a bearer of good tidings" }] },
  { ar: "النذير", en: "An-Nadhir", meaning: "The Warner", detailsAr: "المنذر من عذاب الله لمن عصاه", detailsEn: "The warner of punishment to those who disobey", references: [{ source: "Quran", ref: "33:45", textAr: "وَنَذِيرًا", textEn: "And as a warner" }] },
  { ar: "الداعي إلى الله", en: "Ad-Dai ila Allah", meaning: "Caller to Allah", detailsAr: "الداعي إلى توحيد الله وطاعته", detailsEn: "The caller to the oneness and obedience of Allah", references: [{ source: "Quran", ref: "33:46", textAr: "وَدَاعِيًا إِلَى اللَّهِ بِإِذْنِهِ", textEn: "And one who invites to Allah by His permission" }] },
  { ar: "البشير", en: "Al-Bashir", meaning: "Announcer of Good", detailsAr: "البشير بالخير والثواب", detailsEn: "The announcer of good and reward", references: [{ source: "Quran", ref: "7:188", textAr: "إِنْ أَنَا إِلَّا نَذِيرٌ وَبَشِيرٌ", textEn: "I am only a warner and a bringer of good tidings" }] },
  { ar: "المصطفى", en: "Al-Mustafa", meaning: "The Chosen One", detailsAr: "المختار والمصطفى من الله", detailsEn: "The one chosen and selected by Allah", references: [{ source: "Hadith", ref: "Muslim", textAr: "إن الله اصطفى من ولد إبراهيم إسماعيل", textEn: "Allah chose Ismail from the children of Ibrahim" }] },
  { ar: "حبيب الله", en: "Habib Allah", meaning: "Beloved of Allah", detailsAr: "حبيب الله ومحبوبه", detailsEn: "The beloved and loved one of Allah", references: [{ source: "Hadith", ref: "Tirmidhi", textAr: "أنت حبيب الله", textEn: "You are the beloved of Allah" }] },
  { ar: "صفي الله", en: "Safi Allah", meaning: "Pure One of Allah", detailsAr: "الصفي المختار من الله", detailsEn: "The pure one chosen by Allah", references: [{ source: "Hadith", ref: "Ibn Majah", textAr: "أنا صفي الله", textEn: "I am the pure one of Allah" }] },
  { ar: "نبي التوبة", en: "Nabi at-Tawbah", meaning: "Prophet of Repentance", detailsAr: "النبي الذي فتح الله به باب التوبة", detailsEn: "The prophet through whom Allah opened the door of repentance", references: [{ source: "Hadith", ref: "Muslim", textAr: "أنا نبي التوبة", textEn: "I am the prophet of repentance" }] },
  { ar: "نبي الملحمة", en: "Nabi al-Malhamah", meaning: "Prophet of the Great Battle", detailsAr: "نبي الملاحم والجهاد", detailsEn: "The prophet of battles and struggle", references: [{ source: "Hadith", ref: "Muslim", textAr: "وأنا نبي الملحمة", textEn: "And I am the prophet of the great battle" }] },
  { ar: "المتوكل", en: "Al-Mutawakkil", meaning: "Reliant on Allah", detailsAr: "المتوكل على الله في جميع أموره", detailsEn: "The one who relies upon Allah in all his affairs", references: [{ source: "Hadith", ref: "Bukhari", textAr: "أنا المتوكل", textEn: "I am Al-Mutawakkil" }] },
  { ar: "الفاتح", en: "Al-Fatih", meaning: "The Opener", detailsAr: "الفاتح الذي فتح الله به الهداية", detailsEn: "The opener through whom Allah opened guidance", references: [{ source: "Hadith", ref: "Muslim", textAr: "أنا الفاتح", textEn: "I am the opener" }] },
  { ar: "الأمي", en: "Al-Ummi", meaning: "The Unlettered", detailsAr: "النبي الأمي الذي لم يقرأ ولم يكتب", detailsEn: "The unlettered prophet who did not read or write", references: [{ source: "Quran", ref: "7:157", textAr: "الَّذِينَ يَتَّبِعُونَ الرَّسُولَ النَّبِيَّ الْأُمِّيَّ", textEn: "Those who follow the Messenger, the unlettered prophet" }] },
  { ar: "القاسم", en: "Al-Qasim", meaning: "The Distributor", detailsAr: "المقسم الذي يقسم بأمر الله", detailsEn: "The distributor who distributes by Allah command", references: [{ source: "Hadith", ref: "Muslim", textAr: "إنما أنا قاسم والله يعطي", textEn: "I am only a distributor, and Allah is the giver" }] },
  { ar: "المقفي", en: "Al-Muqaffi", meaning: "The Follower", detailsAr: "التابع للأنبياء من قبله", detailsEn: "The one who follows the prophets before him", references: [{ source: "Hadith", ref: "Bukhari", textAr: "أنا المقفي", textEn: "I am Al-Muqaffi" }] },
  { ar: "نبي الهدى", en: "Nabi al-Huda", meaning: "Prophet of Guidance", detailsAr: "النبي الهادي إلى الحق", detailsEn: "The prophet who guides to the truth", references: [{ source: "Quran", ref: "28:56", textAr: "إِنَّكَ لَا تَهْدِي مَنْ أَحْبَبْتَ", textEn: "Indeed, you do not guide whom you like" }] },
  { ar: "الرؤوف الرحيم", en: "Ar-Rauf ar-Rahim", meaning: "Kind and Merciful", detailsAr: "الرؤوف الرحيم بالمؤمنين", detailsEn: "The kind and merciful to the believers", references: [{ source: "Quran", ref: "9:128", textAr: "بِالْمُؤْمِنِينَ رَءُوفٌ رَّحِيمٌ", textEn: "To the believers he is kind and merciful" }] },
];

/* -------------------------------------------
   Component
--------------------------------------------*/
const NamesOfMuhammad: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const content = {
    title: ar ? "أسماء النبي محمد ﷺ" : "Names of Prophet Muhammad ﷺ",
    back: ar ? "رجوع" : "Back",
    intro: ar
      ? "أسماء وألقاب خاتم الأنبياء والمرسلين صلى الله عليه وسلم"
      : "Names and titles of the Final Prophet and Messenger ﷺ",
    detailsLabel: ar ? "التفاصيل" : "Details",
    meaningLabel: ar ? "المعنى" : "Meaning",
    referencesLabel: ar ? "المراجع" : "References",
  };

  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (selected !== null ? setSelected(null) : navigate(-1))}
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
          <p className={`text-muted-foreground text-center mb-6 ${ar ? "arabic-regal" : ""}`}>
            {content.intro}
          </p>
        )}
      </div>

      {/* LIST VIEW (vertical cards like Empires) */}
      {selected === null && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid gap-4">
            {NAMES.map((n, idx) => {
              const tone = toneFor(idx);
              return (
                <div
                  key={`${n.en}-${idx}`}
                  onClick={() => setSelected(idx)}
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
                          <Star className={`h-7 w-7 ${tone.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 text-primary">{n.ar}</h3>
                          <p className="text-sm font-medium">{n.en}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {content.meaningLabel}: {n.meaning}
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

      {/* DETAIL VIEW (page-like, no routing) */}
      {selected !== null && (() => {
        const n = NAMES[selected];
        const tone = toneFor(selected);
        return (
          <div className="max-w-2xl mx-auto px-6">
            {/* Accent header */}
            <div className="relative overflow-hidden mb-6">
              <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-3xl blur-2xl opacity-70`} />
              <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
                    <Star className={`h-7 w-7 ${tone.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1 text-primary">{n.ar}</h2>
                    <p className="text-sm text-muted-foreground">{n.en}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {content.meaningLabel}: {n.meaning}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
              <Card className="neomorph backdrop-blur-xl p-5 rounded-2xl">
                <div className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {content.detailsLabel}
                </div>
                <div className={`text-sm ${ar ? "text-right arabic-regal" : ""}`}>
                  {ar ? n.detailsAr : n.detailsEn}
                </div>
              </Card>
            </div>

            {/* References */}
            {n.references?.length > 0 && (
              <div className="grid gap-3 mb-10">
                <h3 className="font-semibold text-primary">{content.referencesLabel}</h3>
                {n.references.map((ref, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full neomorph hover:neomorph-pressed justify-start h-auto py-3"
                    onClick={() => {
                      if (ref.source === "Quran") {
                        const surahNum = ref.ref.split(":")[0];
                        navigate(`/quran/${surahNum}`);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1 w-full text-left">
                      <div className="font-semibold text-sm text-primary">
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
        );
      })()}
    </div>
  );
};

export default NamesOfMuhammad;
