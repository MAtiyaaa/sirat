import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowLeft, Sparkles, BookOpen, Heart } from "lucide-react";
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
  detailsAr?: string;
  detailsEn?: string;
  references?: RefItem[];
};

/* -------------------------------------------
   Pleasant gradient tones (Empire vibe)
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
   Helpers for brief details (kept short)
--------------------------------------------*/
const d = (en: string, ar: string) => ({ en, ar });

/* -------------------------------------------
   The 99 Beautiful Names — all included
   (meanings widely-used; add/adjust as you like)
--------------------------------------------*/
const NAMES: NameEntry[] = [
  { ar: "ٱللّٰه", en: "Allah", meaning: "The Proper Name of God", ...d("The One true God, worthy of all worship.", "اسم الله العلم الجامع لصفات الكمال.") },
  { ar: "ٱلرَّحْمَٰن", en: "Ar-Rahman", meaning: "The Most Merciful", references: [{ source:"Quran", ref:"1:3", textAr:"الرَّحْمَٰنِ الرَّحِيمِ", textEn:"The Most Merciful, the Bestower of Mercy" }], ...d("Mercy that encompasses all creation.", "ذو الرحمة العامة الواسعة لكل الخلق.") },
  { ar: "ٱلرَّحِيم", en: "Ar-Raheem", meaning: "The Bestower of Mercy", references: [{ source:"Quran", ref:"1:3", textAr:"الرَّحْمَٰنِ الرَّحِيمِ", textEn:"The Most Merciful, the Bestower of Mercy" }], ...d("Special mercy for the believers.", "ذو الرحمة الخاصة بالمؤمنين.") },
  { ar: "ٱلْمَلِك", en: "Al-Malik", meaning: "The King", references: [{ source:"Quran", ref:"59:23", textAr:"الْمَلِكُ", textEn:"The King" }], ...d("Owner and sovereign of all.", "مالك الملك والمتصرف فيه.") },
  { ar: "ٱلْقُدُّوس", en: "Al-Quddus", meaning: "The Most Holy", references: [{ source:"Quran", ref:"59:23", textAr:"الْقُدُّوسُ", textEn:"The Most Holy" }], ...d("Perfectly pure from all defect.", "المنزه عن العيوب والنقائص.") },
  { ar: "ٱلسَّلَام", en: "As-Salam", meaning: "The Source of Peace", references: [{ source:"Quran", ref:"59:23", textAr:"السَّلَامُ", textEn:"The Source of Peace" }], ...d("Source of safety and wellbeing.", "الذي منه السلامة والأمن.") },
  { ar: "ٱلْمُؤْمِن", en: "Al-Mu'min", meaning: "The Granter of Security", references: [{ source:"Quran", ref:"59:23", textAr:"الْمُؤْمِنُ", textEn:"The Granter of Security" }], ...d("Affirms truth; grants safety.", "المصدق رسله والمانح الأمن لعباده.") },
  { ar: "ٱلْمُهَيْمِن", en: "Al-Muhaymin", meaning: "The Guardian", references: [{ source:"Quran", ref:"59:23", textAr:"الْمُهَيْمِنُ", textEn:"The Guardian" }], ...d("Watcher and Protector.", "الرقيب الحافظ.") },
  { ar: "ٱلْعَزِيز", en: "Al-Aziz", meaning: "The Almighty", references: [{ source:"Quran", ref:"59:23", textAr:"الْعَزِيزُ", textEn:"The Almighty" }], ...d("All-Strong, never overcome.", "الغالب الذي لا يُقهر.") },
  { ar: "ٱلْجَبَّار", en: "Al-Jabbar", meaning: "The Compeller", references: [{ source:"Quran", ref:"59:23", textAr:"الْجَبَّارُ", textEn:"The Compeller" }], ...d("Mends and compels by His might.", "يجبر الكسير ويقهر الجبارين.") },
  { ar: "ٱلْمُتَكَبِّر", en: "Al-Mutakabbir", meaning: "The Supreme", references: [{ source:"Quran", ref:"59:23", textAr:"الْمُتَكَبِّرُ", textEn:"The Supreme" }], ...d("Supremely Great beyond creation.", "المتعالي عن صفات المخلوقين.") },
  { ar: "ٱلْخَالِق", en: "Al-Khaliq", meaning: "The Creator", references: [{ source:"Quran", ref:"59:24", textAr:"الْخَالِقُ", textEn:"The Creator" }], ...d("Brings things into existence.", "الموجد لجميع الموجودات.") },
  { ar: "ٱلْبَارِئ", en: "Al-Bari", meaning: "The Maker", references: [{ source:"Quran", ref:"59:24", textAr:"الْبَارِئُ", textEn:"The Maker" }], ...d("Fashions from nothing in due proportion.", "المبدع المنشئ بلا مثال سابق.") },
  { ar: "ٱلْمُصَوِّر", en: "Al-Musawwir", meaning: "The Fashioner", references: [{ source:"Quran", ref:"59:24", textAr:"الْمُصَوِّرُ", textEn:"The Fashioner" }], ...d("Gives each creation its form.", "المعطي كل مخلوق صورته.") },
  { ar: "ٱلْغَفَّار", en: "Al-Ghaffar", meaning: "The Oft-Forgiving", references: [{ source:"Quran", ref:"20:82", textAr:"لَغَفَّارٌ لِّمَن تَابَ", textEn:"Most Forgiving to whoever repents" }], ...d("Forgives repeatedly and abundantly.", "كثير المغفرة لعباده.") },
  { ar: "ٱلْقَهَّار", en: "Al-Qahhar", meaning: "The Subduer", references: [{ source:"Quran", ref:"13:16", textAr:"الْقَهَّارُ", textEn:"The Subduer" }], ...d("Irresistibly dominant over all.", "الغالب لكل شيء.") },
  { ar: "ٱلْوَهَّاب", en: "Al-Wahhab", meaning: "The Bestower", references: [{ source:"Quran", ref:"3:8", textAr:"إِنَّكَ أَنتَ الْوَهَّابُ", textEn:"Indeed, You are the Bestower" }], ...d("Gives freely and constantly.", "كثير العطاء بلا مقابل.") },
  { ar: "ٱلرَّزَّاق", en: "Ar-Razzaq", meaning: "The Provider", references: [{ source:"Quran", ref:"51:58", textAr:"الرَّزَّاقُ ذُو الْقُوَّةِ", textEn:"The Provider, Possessor of Strength" }], ...d("Provides for all creation.", "الرازق لجميع الخلق.") },
  { ar: "ٱلْفَتَّاح", en: "Al-Fattah", meaning: "The Opener / Judge", references: [{ source:"Quran", ref:"34:26", textAr:"وَهُوَ الْفَتَّاحُ الْعَلِيمُ", textEn:"He is the Knowing Judge" }], ...d("Opens doors; decides with justice.", "الذي يفتح المغلق ويحكم بالحق.") },
  { ar: "ٱلْعَلِيم", en: "Al-‘Alim", meaning: "The All-Knowing", references: [{ source:"Quran", ref:"2:158", textAr:"اللَّهُ شَاكِرٌ عَلِيمٌ", textEn:"Allah is Appreciative, All-Knowing" }], ...d("Knows all, apparent and hidden.", "العالم بكل شيء دقيقه وجليله.") },
  { ar: "ٱلْقَابِض", en: "Al-Qabid", meaning: "The Withholder", ...d("Withholds by wisdom.", "القابض للأرزاق بحكمته.") },
  { ar: "ٱلْبَاسِط", en: "Al-Basit", meaning: "The Expander", references: [{ source:"Quran", ref:"2:245", textAr:"وَاللَّهُ يَقْبِضُ وَيَبْسُطُ", textEn:"Allah withholds and extends" }], ...d("Expands provision by grace.", "الباسط للأرزاق بفضله.") },
  { ar: "ٱلْخَافِض", en: "Al-Khafid", meaning: "The Reducer", references: [{ source:"Quran", ref:"56:3", textAr:"خَافِضَةٌ رَّافِعَةٌ", textEn:"Bringing down and raising up" }], ...d("Lowers whom He wills.", "يخفض أقواماً بعدله.") },
  { ar: "ٱلرَّافِع", en: "Ar-Rafi‘", meaning: "The Exalter", references: [{ source:"Quran", ref:"58:11", textAr:"يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا", textEn:"Allah raises those who believe" }], ...d("Raises ranks by His favor.", "يرفع درجات من يشاء.") },
  { ar: "ٱلْمُعِزّ", en: "Al-Mu‘izz", meaning: "The Honorer", references: [{ source:"Quran", ref:"3:26", textAr:"تُعِزُّ مَن تَشَاءُ", textEn:"You honor whom You will" }], ...d("Grants honor and strength.", "المعطي العزة لمن يشاء.") },
  { ar: "ٱلْمُذِلّ", en: "Al-Mudhill", meaning: "The Humiliator", references: [{ source:"Quran", ref:"3:26", textAr:"تُذِلُّ مَن تَشَاءُ", textEn:"You humble whom You will" }], ...d("Humbles the arrogant.", "المذل من شاء بحكمته.") },
  { ar: "ٱلسَّمِيع", en: "As-Sami‘", meaning: "The All-Hearing", references: [{ source:"Quran", ref:"2:127", textAr:"إِنَّكَ أَنتَ السَّمِيعُ", textEn:"Indeed, You are the All-Hearing" }], ...d("Hears every sound and whisper.", "يسمع كل الأصوات.") },
  { ar: "ٱلْبَصِير", en: "Al-Basir", meaning: "The All-Seeing", references: [{ source:"Quran", ref:"17:1", textAr:"إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ", textEn:"He is the All-Hearing, All-Seeing" }], ...d("Sees all things.", "يرى كل شيء.") },
  { ar: "ٱلْحَكَم", en: "Al-Hakam", meaning: "The Judge", references: [{ source:"Quran", ref:"40:48", textAr:"إِنَّ اللَّهَ يَحْكُمُ مَا يُرِيدُ", textEn:"Allah judges as He wills" }], ...d("His rule is perfect justice.", "الحاكم العدل.") },
  { ar: "ٱلْعَدْل", en: "Al-‘Adl", meaning: "The Utterly Just", references: [{ source:"Quran", ref:"4:40", textAr:"إِنَّ اللَّهَ لَا يَظْلِمُ", textEn:"Indeed, Allah does not wrong" }], ...d("Perfect equity, never wrongs.", "الذي لا يظلم أحداً.") },
  { ar: "ٱللَّطِيف", en: "Al-Latif", meaning: "The Subtle, Most Kind", references: [{ source:"Quran", ref:"6:103", textAr:"وَهُوَ اللَّطِيفُ الْخَبِيرُ", textEn:"He is the Subtle, All-Aware" }], ...d("Gentle, subtle in His care.", "اللطيف بعباده برّاً وستراً.") },
  { ar: "ٱلْخَبِير", en: "Al-Khabir", meaning: "The All-Aware", references: [{ source:"Quran", ref:"6:18", textAr:"الْحَكِيمُ الْخَبِيرُ", textEn:"The Wise, the All-Aware" }], ...d("Fully aware of all matters.", "المطلع على السرائر.") },
  { ar: "ٱلْحَلِيم", en: "Al-Halim", meaning: "The Forbearing", references: [{ source:"Quran", ref:"2:235", textAr:"غَفُورٌ حَلِيمٌ", textEn:"Forgiving and Forbearing" }], ...d("Patient, does not hasten punishment.", "لا يعجل بالعقوبة.") },
  { ar: "ٱلْعَظِيم", en: "Al-‘Azim", meaning: "The Magnificent", references: [{ source:"Quran", ref:"2:255", textAr:"الْعَظِيمُ", textEn:"The Magnificent" }], ...d("Tremendous in essence and attributes.", "العظيم في ذاته وصفاته.") },
  { ar: "ٱلْغَفُور", en: "Al-Ghafur", meaning: "The All-Forgiving", references: [{ source:"Quran", ref:"2:173", textAr:"غَفُورٌ رَّحِيمٌ", textEn:"Forgiving, Merciful" }], ...d("Covers and forgives sins.", "يغفر الذنوب جميعاً لمن تاب.") },
  { ar: "ٱلشَّكُور", en: "Ash-Shakur", meaning: "The Most Appreciative", references: [{ source:"Quran", ref:"35:30", textAr:"غَفُورٌ شَكُورٌ", textEn:"Forgiving and Appreciative" }], ...d("Rewards even small deeds greatly.", "يجزي القليل بالكثير.") },
  { ar: "ٱلْعَلِيّ", en: "Al-‘Aliyy", meaning: "The Most High", references: [{ source:"Quran", ref:"2:255", textAr:"الْعَلِيُّ", textEn:"The Most High" }], ...d("Exalted above all.", "العالي فوق خلقه.") },
  { ar: "ٱلْكَبِير", en: "Al-Kabir", meaning: "The Most Great", references: [{ source:"Quran", ref:"13:9", textAr:"الْكَبِيرُ الْمُتَعَالِ", textEn:"The Great, the Exalted" }], ...d("Infinitely great.", "العظيم الكبير قدراً.") },
  { ar: "ٱلْحَفِيظ", en: "Al-Hafiz", meaning: "The Preserver", references: [{ source:"Quran", ref:"11:57", textAr:"حَفِيظٌ", textEn:"Guardian over all things" }], ...d("Guards and preserves.", "الحافظ لكل شيء.") },
  { ar: "ٱلْمُقِيت", en: "Al-Muqit", meaning: "The Sustainer", references: [{ source:"Quran", ref:"4:85", textAr:"مُّقِيتًا", textEn:"A Keeper over all things" }], ...d("Apportions sustenance.", "المقيت الذي يقدر الأقوات.") },
  { ar: "ٱلْحَسِيب", en: "Al-Hasib", meaning: "The Reckoner", references: [{ source:"Quran", ref:"4:6", textAr:"كَفَىٰ بِاللَّهِ حَسِيبًا", textEn:"Sufficient is Allah as Reckoner" }], ...d("Sufficient, who takes account.", "الكافي المحاسب لعباده.") },
  { ar: "ٱلْجَلِيل", en: "Al-Jalil", meaning: "The Majestic", references: [{ source:"Quran", ref:"55:27", textAr:"ذُو الْجَلَالِ", textEn:"Owner of Majesty" }], ...d("Majesty and glory belong to Him.", "الجليل عظمةً وقدراً.") },
  { ar: "ٱلْكَرِيم", en: "Al-Karim", meaning: "The Most Generous", references: [{ source:"Quran", ref:"27:40", textAr:"غَنِيٌّ كَرِيمٌ", textEn:"Free of need and Generous" }], ...d("Gives without measure.", "كثير الخير والعطاء.") },
  { ar: "ٱلرَّقِيب", en: "Ar-Raqib", meaning: "The Watchful", references: [{ source:"Quran", ref:"5:117", textAr:"الرَّقِيبَ", textEn:"The Watcher" }], ...d("Ever-watchful over creation.", "الحافظ الرقيب على عباده.") },
  { ar: "ٱلْمُجِيب", en: "Al-Mujib", meaning: "The Responsive", references: [{ source:"Quran", ref:"11:61", textAr:"قَرِيبٌ مُّجِيبٌ", textEn:"Near and Responsive" }], ...d("Answers those who call upon Him.", "يستجيب دعوة الداعين.") },
  { ar: "ٱلْوَاسِع", en: "Al-Wasi‘", meaning: "The All-Encompassing", references: [{ source:"Quran", ref:"2:115", textAr:"اللَّهُ وَاسِعٌ عَلِيمٌ", textEn:"Allah is All-Encompassing, All-Knowing" }], ...d("Vast in bounty and knowledge.", "واسع الفضل والعلم.") },
  { ar: "ٱلْحَكِيم", en: "Al-Hakim", meaning: "The Most Wise", references: [{ source:"Quran", ref:"2:32", textAr:"الْعَلِيمُ الْحَكِيمُ", textEn:"All-Knowing, All-Wise" }], ...d("Perfect wisdom in decree.", "حكمته بالغة في كل أمر.") },
  { ar: "ٱلْوَدُود", en: "Al-Wadud", meaning: "The Most Loving", references: [{ source:"Quran", ref:"11:90", textAr:"رَحِيمٌ وَدُودٌ", textEn:"Merciful and Loving" }], ...d("Loves His righteous servants.", "يحب أولياءه ويقربهم.") },
  { ar: "ٱلْمَجِيد", en: "Al-Majid", meaning: "The Glorious, Most Honorable", references: [{ source:"Quran", ref:"11:73", textAr:"حَمِيدٌ مَّجِيدٌ", textEn:"Praiseworthy, Glorious" }], ...d("Abundant in honor and goodness.", "واسع المجد والكرم.") },
  { ar: "ٱلْبَاعِث", en: "Al-Ba‘ith", meaning: "The Resurrector", references: [{ source:"Quran", ref:"22:7", textAr:"اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ", textEn:"Allah will resurrect those in graves" }], ...d("Raises the dead to life.", "يبعث الخلق بعد الموت.") },
  { ar: "ٱلشَّهِيد", en: "Ash-Shahid", meaning: "The All and Ever Witnessing", references: [{ source:"Quran", ref:"4:166", textAr:"وَاللَّهُ يَشْهَدُ", textEn:"And Allah bears witness" }], ...d("Witness over every deed.", "الشاهد على كل شيء.") },
  { ar: "ٱلْحَقّ", en: "Al-Haqq", meaning: "The Absolute Truth", references: [{ source:"Quran", ref:"22:6", textAr:"اللَّهُ هُوَ الْحَقُّ", textEn:"Allah is the Truth" }], ...d("His promise and judgment are true.", "كل ما عنده حقّ لا ريب فيه.") },
  { ar: "ٱلْوَكِيل", en: "Al-Wakil", meaning: "The Trustee, Disposer of Affairs", references: [{ source:"Quran", ref:"3:173", textAr:"نِعْمَ الْوَكِيلُ", textEn:"Best Disposer of affairs" }], ...d("Sufficient for whoever relies.", "الكافي لمن توكل عليه.") },
  { ar: "ٱلْقَوِيّ", en: "Al-Qawiyy", meaning: "The All-Strong", references: [{ source:"Quran", ref:"22:40", textAr:"لَقَوِيٌّ عَزِيزٌ", textEn:"Powerful and Exalted in Might" }], ...d("Perfect strength.", "كامل القوة لا يُعجزه شيء.") },
  { ar: "ٱلْمَتِين", en: "Al-Matin", meaning: "The Firm, Steadfast", references: [{ source:"Quran", ref:"51:58", textAr:"ذُو الْقُوَّةِ الْمَتِينُ", textEn:"Possessor of strength, the Firm" }], ...d("Unshakeable power.", "شديد القوة لا يزل.") },
  { ar: "ٱلْوَلِيّ", en: "Al-Wali", meaning: "The Protective Guardian", references: [{ source:"Quran", ref:"3:68", textAr:"وَاللَّهُ وَلِيُّ الْمُؤْمِنِينَ", textEn:"Allah is the ally of the believers" }], ...d("Guardian and helper.", "الناصر المتولي لأمور عباده.") },
  { ar: "ٱلْحَمِيد", en: "Al-Hamid", meaning: "The Praiseworthy", references: [{ source:"Quran", ref:"22:24", textAr:"الْحَمِيدِ", textEn:"The Praiseworthy" }], ...d("Deserving of all praise.", "المحمود على كل حال.") },
  { ar: "ٱلْمُحْصِي", en: "Al-Muhsi", meaning: "The All-Enumerating", references: [{ source:"Quran", ref:"36:12", textAr:"كُلَّ شَيْءٍ أَحْصَيْنَاهُ", textEn:"We have enumerated all things" }], ...d("Counts and records everything.", "لا يغيب عنه شيء عدداً وقدراً.") },
  { ar: "ٱلْمُبْدِئ", en: "Al-Mubdi", meaning: "The Originator", references: [{ source:"Quran", ref:"85:13", textAr:"يُبْدِئُ وَيُعِيدُ", textEn:"He originates and repeats" }], ...d("Begins creation.", "المبدئ للخلق من عدم.") },
  { ar: "ٱلْمُعِيد", en: "Al-Mu‘id", meaning: "The Restorer", references: [{ source:"Quran", ref:"85:13", textAr:"يُبْدِئُ وَيُعِيدُ", textEn:"He originates and repeats" }], ...d("Brings back after death.", "يعيد الخلق بعد فنائه.") },
  { ar: "ٱلْمُحْيِي", en: "Al-Muhyi", meaning: "The Giver of Life", references: [{ source:"Quran", ref:"30:50", textAr:"يُحْيِي الْأَرْضَ", textEn:"He gives life to the earth" }], ...d("Bestows life.", "يمنح الحياة لمن يشاء.") },
  { ar: "ٱلْمُمِيت", en: "Al-Mumit", meaning: "The Bringer of Death", references: [{ source:"Quran", ref:"15:23", textAr:"نُحْيِي وَنُمِيتُ", textEn:"We give life and cause death" }], ...d("Decrees death.", "قابض الأرواح بوقتها.") },
  { ar: "ٱلْحَيّ", en: "Al-Hayy", meaning: "The Ever-Living", references: [{ source:"Quran", ref:"2:255", textAr:"الْحَيُّ", textEn:"The Ever-Living" }], ...d("Life perfect and eternal.", "الحياة الكاملة الدائمة له وحده.") },
  { ar: "ٱلْقَيُّوم", en: "Al-Qayyum", meaning: "The Self-Subsisting Sustainer", references: [{ source:"Quran", ref:"2:255", textAr:"الْقَيُّومُ", textEn:"The Sustainer" }], ...d("Upholds all things.", "القائم بنفسه المقيم لغيره.") },
  { ar: "ٱلْوَاجِد", en: "Al-Wajid", meaning: "The Perceiver / Finder", ...d("Finds and lacks nothing.", "الغني الذي لا يفوته شيء.") },
  { ar: "ٱلْمَاجِد", en: "Al-Majid", meaning: "The Illustrious, Most Glorious", references: [{ source:"Quran", ref:"85:15", textAr:"ذُو الْعَرْشِ الْمَجِيدُ", textEn:"Owner of the Throne, the Glorious" }], ...d("Vast in nobility and bounty.", "العظيم الماجد كرماً وشرفاً.") },
  { ar: "ٱلْوَاحِد", en: "Al-Wahid", meaning: "The One", references: [{ source:"Quran", ref:"13:16", textAr:"وَهُوَ الْوَاحِدُ الْقَهَّارُ", textEn:"He is the One, the Subduer" }], ...d("Alone without partner.", "المنفرد بالألوهية.") },
  { ar: "ٱلْأَحَد", en: "Al-Ahad", meaning: "The Indivisible One", references: [{ source:"Quran", ref:"112:1", textAr:"قُلْ هُوَ ٱللَّهُ أَحَدٌ", textEn:"Say: He is Allah, One" }], ...d("Unique, absolutely one.", "الفرد الذي لا مثيل له.") },
  { ar: "ٱلصَّمَد", en: "As-Samad", meaning: "The Eternal Refuge", references: [{ source:"Quran", ref:"112:2", textAr:"ٱللَّهُ ٱلصَّمَدُ", textEn:"Allah, the Eternal Refuge" }], ...d("The One on whom all depend.", "الذي تُقصَد إليه الحوائج.") },
  { ar: "ٱلْقَادِر", en: "Al-Qadir", meaning: "The Capable", references: [{ source:"Quran", ref:"6:65", textAr:"هُوَ الْقَادِرُ", textEn:"He is Capable" }], ...d("Able to do all things.", "القادر على كل شيء.") },
  { ar: "ٱلْمُقْتَدِر", en: "Al-Muqtadir", meaning: "The Omnipotent", references: [{ source:"Quran", ref:"54:42", textAr:"مُّقْتَدِرٍ", textEn:"Omnipotent" }], ...d("Irresistible in power.", "العظيم القدرة.") },
  { ar: "ٱلْمُقَدِّم", en: "Al-Muqaddim", meaning: "The Expediter", ...d("Brings forward whom He wills.", "يقدم من يشاء بفضله.") },
  { ar: "ٱلْمُؤَخِّر", en: "Al-Mu’akhkhir", meaning: "The Delayer", ...d("Delays whom He wills.", "يؤخر من يشاء بحكمته.") },
  { ar: "ٱلأَوَّل", en: "Al-Awwal", meaning: "The First", references: [{ source:"Quran", ref:"57:3", textAr:"هُوَ الْأَوَّلُ وَالْآخِرُ", textEn:"He is the First and the Last" }], ...d("Nothing before Him.", "ليس قبله شيء.") },
  { ar: "ٱلآخِر", en: "Al-Akhir", meaning: "The Last", references: [{ source:"Quran", ref:"57:3", textAr:"الْآخِرُ", textEn:"The Last" }], ...d("Nothing after Him.", "ليس بعده شيء.") },
  { ar: "ٱلظَّاهِر", en: "Az-Zahir", meaning: "The Manifest", references: [{ source:"Quran", ref:"57:3", textAr:"وَالظَّاهِرُ وَالْبَاطِنُ", textEn:"The Manifest and the Hidden" }], ...d("Above all, evident by signs.", "العالي الظاهر بآياته.") },
  { ar: "ٱلْبَاطِن", en: "Al-Batin", meaning: "The Hidden", references: [{ source:"Quran", ref:"57:3", textAr:"الْبَاطِنُ", textEn:"The Hidden" }], ...d("Close and subtle, beyond grasp.", "القريب في خفاء.") },
  { ar: "ٱلْوَالِي", en: "Al-Wali (Al-Waali)", meaning: "The Governor", ...d("Oversees and manages all affairs.", "الوالي المتصرف في الأمر.") },
  { ar: "ٱلْمُتَعَالِي", en: "Al-Muta‘ali", meaning: "The Self Exalted", references: [{ source:"Quran", ref:"13:9", textAr:"الْمُتَعَالِ", textEn:"The Exalted" }], ...d("Supremely exalted.", "المتعالي عن كل نقص.") },
  { ar: "ٱلْبَرّ", en: "Al-Barr", meaning: "The Source of All Goodness", references: [{ source:"Quran", ref:"52:28", textAr:"هُوَ الْبَرُّ الرَّحِيمُ", textEn:"He is the Most Kind, the Merciful" }], ...d("His goodness reaches all.", "الذي عمّ بِرُّه خلقه.") },
  { ar: "ٱلتَّوَّاب", en: "At-Tawwab", meaning: "The Accepter of Repentance", references: [{ source:"Quran", ref:"2:37", textAr:"إِنَّهُ هُوَ التَّوَّابُ", textEn:"Indeed He is the Accepter of repentance" }], ...d("Guides to and accepts repentance.", "يقبل توبة التائبين.") },
  { ar: "ٱلْمُنْتَقِم", en: "Al-Muntaqim", meaning: "The Avenger", references: [{ source:"Quran", ref:"32:22", textAr:"مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ", textEn:"We will take retribution" }], ...d("Takes justice upon oppressors.", "المعاقِب للمعتدين.") },
  { ar: "ٱلْعَفُوّ", en: "Al-‘Afuww", meaning: "The Pardoner", references: [{ source:"Quran", ref:"4:43", textAr:"عَفُوًّا غَفُورًا", textEn:"Pardoning, Forgiving" }], ...d("Erases sins entirely.", "يمحو الذنوب ويعفو عنها.") },
  { ar: "ٱلرَّؤُوف", en: "Ar-Ra’uf", meaning: "The Most Kind", references: [{ source:"Quran", ref:"2:143", textAr:"لَرَءُوفٌ رَّحِيمٌ", textEn:"Kind and Merciful" }], ...d("Extreme compassion and gentleness.", "بالغ الرأفة بعباده.") },
  { ar: "مَالِكُ ٱلْمُلْك", en: "Malik-ul-Mulk", meaning: "Master of the Kingdom", references: [{ source:"Quran", ref:"3:26", textAr:"مَالِكَ الْمُلْكِ", textEn:"Owner of Sovereignty" }], ...d("Absolute dominion is His.", "مالك الملك كله.") },
  { ar: "ذُو ٱلْجَلَالِ وَٱلْإِكْرَام", en: "Dhul-Jalali wal-Ikram", meaning: "Lord of Majesty & Honor", references: [{ source:"Quran", ref:"55:27", textAr:"ذُو الْجَلَالِ وَالْإِكْرَامِ", textEn:"Owner of Majesty and Honor" }], ...d("Majesty and generosity perfected.", "صاحب العظمة والفضل.") },
  { ar: "ٱلْمُقْسِط", en: "Al-Muqsit", meaning: "The Equitable", references: [{ source:"Quran", ref:"7:29", textAr:"إِنَّهُ يُحِبُّ الْمُقْسِطِينَ", textEn:"He loves the equitable" }], ...d("Perfectly fair and just.", "العادل المنصف.") },
  { ar: "ٱلْجَامِع", en: "Al-Jami‘", meaning: "The Gatherer", references: [{ source:"Quran", ref:"3:9", textAr:"إِنَّكَ جَامِعُ النَّاسِ", textEn:"Surely You will gather the people" }], ...d("Gathers creation and scattered needs.", "جامع الخلائق ومطالبهم.") },
  { ar: "ٱلْغَنِيّ", en: "Al-Ghaniyy", meaning: "The Self-Sufficient", references: [{ source:"Quran", ref:"2:267", textAr:"اللَّهَ غَنِيٌّ حَمِيدٌ", textEn:"Allah is Self-Sufficient, Praiseworthy" }], ...d("Free of all need.", "الغني عن خلقه.") },
  { ar: "ٱلْمُغْنِي", en: "Al-Mughni", meaning: "The Enricher", ...d("Enriches whom He wills.", "يُغني من يشاء بفضله.") },
  { ar: "ٱلْمَانِع", en: "Al-Mani‘", meaning: "The Withholder / Preventer", ...d("Prevents harm or grant by wisdom.", "يمنع ما شاء لحِكَمٍ.") },
  { ar: "ٱلضَّارّ", en: "Ad-Darr", meaning: "The Distresser", ...d("May decree harm for a wisdom.", "قد يقدر الضر لحكمة.") },
  { ar: "ٱلنَّافِع", en: "An-Nafi‘", meaning: "The Benefiter", ...d("Brings every benefit.", "المانح لكل نفع.") },
  { ar: "ٱلنُّور", en: "An-Nur", meaning: "The Light", references: [{ source:"Quran", ref:"24:35", textAr:"اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", textEn:"Allah is the Light of the heavens and the earth" }], ...d("Light of guidance.", "نور الهداية للخلق.") },
  { ar: "ٱلْهَادِي", en: "Al-Hadi", meaning: "The Guide", references: [{ source:"Quran", ref:"22:54", textAr:"اللَّهُ لَهَادِ الَّذِينَ آمَنُوا", textEn:"Allah is the Guide of those who believe" }], ...d("Guides to the straight path.", "الهادي إلى الصراط المستقيم.") },
  { ar: "ٱلْبَدِيع", en: "Al-Badi‘", meaning: "The Originator, Incomparable", references: [{ source:"Quran", ref:"2:117", textAr:"بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ", textEn:"Originator of the heavens and the earth" }], ...d("Creates without precedent.", "المبدع على غير مثال.") },
  { ar: "ٱلْبَاقِي", en: "Al-Baqi", meaning: "The Everlasting", references: [{ source:"Quran", ref:"55:27", textAr:"وَيَبْقَىٰ وَجْهُ رَبِّكَ", textEn:"And there will remain the Face of your Lord" }], ...d("His existence never ends.", "الباقي الذي لا يفنى.") },
  { ar: "ٱلْوَارِث", en: "Al-Warith", meaning: "The Inheritor", references: [{ source:"Quran", ref:"15:23", textAr:"وَنَحْنُ الْوَارِثُونَ", textEn:"And We are the Inheritors" }], ...d("All returns to Him.", "الذي يرث الأرض ومن عليها.") },
  { ar: "ٱلرَّشِيد", en: "Ar-Rashid", meaning: "The Guide to Right Conduct", ...d("Directs to sound outcomes.", "المرشد إلى سبيل الرشاد.") },
  { ar: "ٱلصَّبُور", en: "As-Sabur", meaning: "The Most Patient", ...d("Delays punishment though able.", "لا يعجل على عباده مع قدرته.") },
];

/* -------------------------------------------
   Component
--------------------------------------------*/
const NamesOfAllah: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const content = {
    title: ar ? "أسماء الله الحسنى" : "99 Names of Allah",
    back: ar ? "رجوع" : "Back",
    intro: ar ? "الأسماء الحسنى التسعة والتسعون لله تعالى" : "The 99 Beautiful Names of Allah",
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
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        {selected === null && (
          <p className={`text-muted-foreground text-center mb-6 ${ar ? "arabic-regal" : ""}`}>
            {content.intro}
          </p>
        )}
      </div>

      {/* LIST VIEW */}
      {selected === null && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid gap-4">
            {NAMES.map((n, idx) => {
              const tone = toneFor(idx);
              return (
                <div key={`${n.en}-${idx}`} onClick={() => setSelected(idx)} className="cursor-pointer group">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* keep the gradient bounded and subtle */}
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                    <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                          <Sparkles className={`h-7 w-7 ${tone.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{idx + 1}</span>
                            <h3 className="font-semibold text-lg text-primary mb-1 truncate">{n.ar}</h3>
                          </div>
                          <p className="text-sm font-medium">{n.en}</p>
                          <p className="text-xs text-muted-foreground mt-1 break-words whitespace-normal">
                            {content.meaningLabel}: {n.meaning}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
      {selected !== null && (() => {
        const n = NAMES[selected];
        const tone = toneFor(selected);
        return (
          <div className="max-w-2xl mx-auto px-6">
            {/* Accent header (bounded so it never covers the screen) */}
            <div className="relative overflow-hidden mb-6 rounded-3xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} blur-2xl opacity-70`} />
              <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
                    <Sparkles className={`h-7 w-7 ${tone.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{selected + 1}</span>
                      <h2 className="text-2xl font-semibold text-primary mb-1 break-words">{n.ar}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.en}</p>
                    <p className="text-xs text-muted-foreground mt-1 break-words whitespace-normal">
                      {content.meaningLabel}: {n.meaning}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            {(n.detailsAr || n.detailsEn) && (
              <div className="grid grid-cols-1 gap-4 mb-6">
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
            )}

            {/* References */}
            {n.references?.length ? (
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
                      <div className="font-semibold text-sm text-primary break-words whitespace-normal">
                        {ref.source} {ref.ref}
                      </div>
                      <div className={`text-xs text-muted-foreground break-words whitespace-normal ${ar ? "text-right arabic-regal" : ""}`}>
                        {ar ? ref.textAr : ref.textEn}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })()}
    </div>
  );
};

export default NamesOfAllah;
