import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Sparkles, BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageSection } from "@/components/PageTemplate";

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
    title: ar ? "ألقاب النبي ﷺ" : "Titles of the Prophet ﷺ",
    eyebrow: ar ? "أسماؤه المباركة" : "His Blessed Names",
    intro: ar
      ? "ألقاب وأسماء خاتم الأنبياء والمرسلين صلى الله عليه وسلم"
      : "The names and titles of the Final Messenger ﷺ",
    detailsLabel: ar ? "التفاصيل" : "About this title",
    meaningLabel: ar ? "المعنى" : "Meaning",
    referencesLabel: ar ? "المراجع" : "Sources",
    back: ar ? "رجوع للقائمة" : "Back to all titles",
  };

  const [selected, setSelected] = React.useState<number | null>(null);
  const Chev = ar ? ChevronLeft : ChevronRight;

  if (selected !== null) {
    const n = NAMES[selected];
    const tone = toneFor(selected);
    return (
      <PageContainer>
        <PageHeader
          eyebrow={content.eyebrow}
          title={n.en}
          subtitle={n.meaning}
          showBack
          backTo={undefined as any}
          right={
            <button
              onClick={() => setSelected(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full glass-card hover:border-primary/40 smooth-transition focus-ring"
            >
              {content.back}
            </button>
          }
        />

        {/* Hero medallion */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} blur-2xl opacity-70`} aria-hidden="true" />
          <div className="absolute inset-0 islamic-pattern-bg opacity-40" aria-hidden="true" />
          <div className="relative premium-card rounded-3xl p-7 md:p-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-islamic-gold/40 to-primary/30 blur-xl animate-glow-pulse" aria-hidden="true" />
              <div className={`relative w-full h-full rounded-full ${tone.iconBg} flex items-center justify-center border border-islamic-gold/30`}>
                <Star className={`h-9 w-9 ${tone.iconColor}`} strokeWidth={1.6} />
              </div>
            </div>
            <p className="section-label mb-2">{content.eyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-3 quran-font text-primary leading-tight" dir="rtl">{n.ar}</h2>
            <div className="ornate-divider max-w-[120px] mx-auto mb-3" aria-hidden="true" />
            <p className="text-base font-semibold">{n.en}</p>
            <p className="text-sm text-muted-foreground mt-1">{n.meaning}</p>
          </div>
        </div>

        <PageSection icon={BookOpen} label={content.detailsLabel} accent="from-primary to-islamic-gold">
          <div className="glass-card rounded-2xl p-5">
            <p className={`text-sm leading-relaxed ${ar ? "text-right" : ""} break-words`} dir={ar ? "rtl" : "ltr"}>
              {ar ? n.detailsAr : n.detailsEn}
            </p>
          </div>
        </PageSection>

        {n.references?.length > 0 && (
          <PageSection icon={Sparkles} label={content.referencesLabel} accent="from-islamic-gold to-amber-500">
            <div className="space-y-2.5">
              {n.references.map((ref, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (ref.source === "Quran") {
                      const surahNum = ref.ref.split(":")[0];
                      navigate(`/quran/${surahNum}`);
                    }
                  }}
                  className="press-tile w-full glass-card rounded-2xl p-4 text-left border-border/40 hover:border-primary/40 smooth-transition focus-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-2">
                        {ref.source} · {ref.ref}
                      </span>
                      <p className="quran-font text-base text-foreground/90 leading-relaxed mb-1.5 break-words" dir="rtl">
                        {ref.textAr}
                      </p>
                      <p className="text-xs text-muted-foreground italic break-words">
                        "{ref.textEn}"
                      </p>
                    </div>
                    {ref.source === "Quran" && (
                      <Chev className="h-4 w-4 text-muted-foreground shrink-0 mt-1" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </PageSection>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.intro}
      />

      {/* Hero count card */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-islamic-gold/15 to-orange-500/20 blur-2xl" aria-hidden="true" />
        <div className="absolute inset-0 islamic-pattern-bg opacity-50" aria-hidden="true" />
        <div className="relative premium-card rounded-3xl p-6 text-center">
          <Sparkles className="h-6 w-6 text-islamic-gold mx-auto mb-2 animate-glow-pulse" />
          <p className="text-3xl font-bold bg-gradient-to-r from-islamic-gold via-amber-500 to-islamic-gold bg-clip-text text-transparent">
            {NAMES.length}
          </p>
          <p className="section-label mt-1">
            {ar ? "لقباً مباركاً" : "Blessed Titles"}
          </p>
        </div>
      </div>

      <PageSection icon={Star} label={ar ? "كل الألقاب" : "All Titles"} accent="from-amber-500 to-orange-500">
        <div className="grid gap-3">
          {NAMES.map((n, idx) => {
            const tone = toneFor(idx);
            return (
              <button
                key={`${n.en}-${idx}`}
                onClick={() => setSelected(idx)}
                className="press-tile group text-left glass-card rounded-2xl p-4 border-border/40 hover:border-primary/30 smooth-transition focus-ring animate-fade-in"
                style={{ animationDelay: `${idx * 25}ms` }}
                dir={ar ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${tone.iconBg} flex items-center justify-center border border-border/50 group-hover:scale-105 smooth-transition`} aria-hidden="true">
                    <Star className={`h-6 w-6 ${tone.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="quran-font text-lg font-bold text-primary leading-tight mb-0.5 break-words">{n.ar}</h3>
                    <p className="text-sm font-semibold break-words">{n.en}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 break-words line-clamp-1">{n.meaning}</p>
                  </div>
                  <Chev className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </PageSection>
    </PageContainer>
  );
};

export default NamesOfMuhammad;
