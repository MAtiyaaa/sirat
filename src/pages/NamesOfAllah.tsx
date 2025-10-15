import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowLeft, Heart, Sparkles, BookOpen } from "lucide-react";
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
   99 Names — your dataset (wrapped)
--------------------------------------------*/
const NAMES: NameEntry[] = [
  { ar: 'الرَّحْمَن', en: 'Ar-Rahman', meaning: 'The Most Merciful', detailsAr: 'ذو الرحمة الواسعة التي وسعت كل شيء', detailsEn: 'The One whose Mercy encompasses all creation', references: [{ source: 'Quran', ref: '1:3', textAr: 'الرَّحْمَٰنِ الرَّحِيمِ', textEn: 'The Most Merciful, the Bestower of Mercy' }] },
  { ar: 'الرَّحِيم', en: 'Ar-Raheem', meaning: 'The Bestower of Mercy', detailsAr: 'الذي يرحم عباده المؤمنين رحمة خاصة', detailsEn: 'The One who bestows special mercy on believers', references: [{ source: 'Quran', ref: '1:3', textAr: 'الرَّحْمَٰنِ الرَّحِيمِ', textEn: 'The Most Merciful, the Bestower of Mercy' }] },
  { ar: 'الْمَلِك', en: 'Al-Malik', meaning: 'The King', detailsAr: 'مالك الملك، له الملك كله', detailsEn: 'The Owner of all sovereignty', references: [{ source: 'Quran', ref: '59:23', textAr: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ', textEn: 'He is Allah, other than whom there is no deity, the King' }] },
  { ar: 'الْقُدُّوس', en: 'Al-Quddus', meaning: 'The Most Holy', detailsAr: 'المنزه عن كل عيب ونقص', detailsEn: 'The One free from all imperfections', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْقُدُّوسُ السَّلَامُ', textEn: 'The Most Holy, the Source of Peace' }] },
  { ar: 'السَّلاَم', en: 'As-Salam', meaning: 'The Source of Peace', detailsAr: 'ذو السلامة من جميع العيوب والنقائص', detailsEn: 'The One who is free from all defects', references: [{ source: 'Quran', ref: '59:23', textAr: 'السَّلَامُ الْمُؤْمِنُ', textEn: 'The Source of Peace, the Granter of Security' }] },
  { ar: 'الْمُؤْمِن', en: "Al-Mu'min", meaning: 'The Granter of Security', detailsAr: 'المصدق لرسله بإظهار معجزاتهم', detailsEn: 'The One who grants security and affirms the truth', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْمُؤْمِنُ الْمُهَيْمِنُ', textEn: 'The Granter of Security, the Guardian' }] },
  { ar: 'الْمُهَيْمِن', en: 'Al-Muhaymin', meaning: 'The Guardian', detailsAr: 'الشهيد على خلقه، الحافظ لهم', detailsEn: 'The Witness over creation, the Protector', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْمُهَيْمِنُ الْعَزِيزُ', textEn: 'The Guardian, the Almighty' }] },
  { ar: 'الْعَزِيز', en: 'Al-Aziz', meaning: 'The Almighty', detailsAr: 'الذي لا يغلب ولا يقهر', detailsEn: 'The Invincible, who cannot be defeated', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْعَزِيزُ الْجَبَّارُ', textEn: 'The Almighty, the Compeller' }] },
  { ar: 'الْجَبَّار', en: 'Al-Jabbar', meaning: 'The Compeller', detailsAr: 'الذي يجبر الخلق على ما يريد', detailsEn: 'The One who compels creation to His will', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْجَبَّارُ الْمُتَكَبِّرُ', textEn: 'The Compeller, the Supreme' }] },
  { ar: 'الْمُتَكَبِّر', en: 'Al-Mutakabbir', meaning: 'The Supreme', detailsAr: 'المتعالي عن صفات الخلق', detailsEn: 'The One who is supremely great', references: [{ source: 'Quran', ref: '59:23', textAr: 'الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ', textEn: 'The Supreme. Exalted is Allah' }] },
  { ar: 'الْخَالِق', en: 'Al-Khaliq', meaning: 'The Creator', detailsAr: 'خالق كل شيء', detailsEn: 'The Creator of all things', references: [{ source: 'Quran', ref: '59:24', textAr: 'هُوَ اللَّهُ الْخَالِقُ', textEn: 'He is Allah, the Creator' }] },
  { ar: 'الْبَارِئ', en: 'Al-Bari', meaning: 'The Maker', detailsAr: 'الذي خلق الخلق بقدرته', detailsEn: 'The One who creates from nothing', references: [{ source: 'Quran', ref: '59:24', textAr: 'الْخَالِقُ الْبَارِئُ', textEn: 'The Creator, the Maker' }] },
  { ar: 'الْمُصَوِّر', en: 'Al-Musawwir', meaning: 'The Fashioner', detailsAr: 'المصور لكل موجود', detailsEn: 'The One who shapes all creation', references: [{ source: 'Quran', ref: '59:24', textAr: 'الْبَارِئُ الْمُصَوِّرُ', textEn: 'The Maker, the Fashioner' }] },
  { ar: 'الْغَفَّار', en: 'Al-Ghaffar', meaning: 'The Oft-Forgiving', detailsAr: 'الذي يغفر الذنوب مهما كثرت', detailsEn: 'The One who forgives sins abundantly', references: [{ source: 'Quran', ref: '20:82', textAr: 'وَإِنِّي لَغَفَّارٌ لِّمَن تَابَ', textEn: 'I am surely the Oft-Forgiving to whoever repents' }] },
  { ar: 'الْقَهَّار', en: 'Al-Qahhar', meaning: 'The Subduer', detailsAr: 'الذي قهر كل شيء وخضع له', detailsEn: 'The One who has power over all things', references: [{ source: 'Quran', ref: '13:16', textAr: 'قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ وَهُوَ الْوَاحِدُ الْقَهَّارُ', textEn: 'Say, "Allah is the Creator of all things, and He is the One, the Subduer"' }] },
  { ar: 'الْوَهَّاب', en: 'Al-Wahhab', meaning: 'The Bestower', detailsAr: 'كثير العطاء والهبات', detailsEn: 'The One who gives freely and abundantly', references: [{ source: 'Quran', ref: '3:8', textAr: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا... إِنَّكَ أَنتَ الْوَهَّابُ', textEn: 'Our Lord... grant us from Yourself mercy. Indeed, You are the Bestower' }] },
  { ar: 'الرَّزَّاق', en: 'Ar-Razzaq', meaning: 'The Provider', detailsAr: 'الذي يرزق جميع خلقه', detailsEn: 'The One who provides for all creation', references: [{ source: 'Quran', ref: '51:58', textAr: 'إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ', textEn: 'Indeed, it is Allah who is the Provider, the possessor of strength' }] },
  { ar: 'الْفَتَّاح', en: 'Al-Fattah', meaning: 'The Opener', detailsAr: 'الذي يفتح أبواب الرحمة والرزق', detailsEn: 'The One who opens doors of mercy and provision', references: [{ source: 'Quran', ref: '34:26', textAr: 'ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ... وَهُوَ الْفَتَّاحُ الْعَلِيمُ', textEn: 'Then He will judge between us in truth. And He is the Knowing Judge' }] },
  { ar: 'الْعَلِيم', en: 'Al-Alim', meaning: 'The All-Knowing', detailsAr: 'العالم بكل شيء', detailsEn: 'The One who knows everything', references: [{ source: 'Quran', ref: '2:158', textAr: 'فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ', textEn: 'Indeed, Allah is Appreciative and All-Knowing' }] },
  { ar: 'الْقَابِض', en: 'Al-Qabid', meaning: 'The Withholder', detailsAr: 'الذي يقبض الأرزاق بحكمته', detailsEn: 'The One who withholds with wisdom', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ', textEn: 'O Allah, I seek refuge in You from the removal of Your blessing' }] },
  { ar: 'الْبَاسِط', en: 'Al-Basit', meaning: 'The Extender', detailsAr: 'الذي يبسط الرزق لمن يشاء', detailsEn: 'The One who extends provision to whom He wills', references: [{ source: 'Quran', ref: '2:245', textAr: 'وَاللَّهُ يَقْبِضُ وَيَبْسُطُ', textEn: 'And Allah withholds and extends' }] },
  { ar: 'الْخَافِض', en: 'Al-Khafid', meaning: 'The Reducer', detailsAr: 'الذي يخفض الظالمين', detailsEn: 'The One who humbles the oppressors', references: [{ source: 'Quran', ref: '56:3', textAr: 'خَافِضَةٌ رَّافِعَةٌ', textEn: 'Bringing down [some] and raising up [others]' }] },
  { ar: 'الرَّافِع', en: 'Ar-Rafi', meaning: 'The Exalter', detailsAr: 'الذي يرفع المؤمنين درجات', detailsEn: 'The One who elevates the believers', references: [{ source: 'Quran', ref: '58:11', textAr: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا... دَرَجَاتٍ', textEn: 'Allah will raise those who have believed... by degrees' }] },
  { ar: 'الْمُعِزّ', en: "Al-Mu'izz", meaning: 'The Honorer', detailsAr: 'الذي يعز من يشاء', detailsEn: 'The One who honors whom He wills', references: [{ source: 'Quran', ref: '3:26', textAr: 'تُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ', textEn: 'You honor whom You will and You humble whom You will' }] },
  { ar: 'الْمُذِلّ', en: 'Al-Mudhill', meaning: 'The Humiliator', detailsAr: 'الذي يذل الكافرين', detailsEn: 'The One who humiliates the disbelievers', references: [{ source: 'Quran', ref: '3:26', textAr: 'تُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ', textEn: 'You honor whom You will and You humble whom You will' }] },
  { ar: 'السَّمِيع', en: 'As-Sami', meaning: 'The All-Hearing', detailsAr: 'الذي يسمع كل شيء', detailsEn: 'The One who hears all things', references: [{ source: 'Quran', ref: '2:127', textAr: 'إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ', textEn: 'Indeed, You are the All-Hearing, the All-Knowing' }] },
  { ar: 'الْبَصِير', en: 'Al-Basir', meaning: 'The All-Seeing', detailsAr: 'الذي يرى كل شيء', detailsEn: 'The One who sees all things', references: [{ source: 'Quran', ref: '17:1', textAr: 'إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ', textEn: 'Indeed, He is the All-Hearing, the All-Seeing' }] },
  { ar: 'الْحَكَم', en: 'Al-Hakam', meaning: 'The Judge', detailsAr: 'الحاكم العادل', detailsEn: 'The Just Judge', references: [{ source: 'Quran', ref: '40:48', textAr: 'إِنَّ اللَّهَ يَحْكُمُ مَا يُرِيدُ', textEn: 'Indeed, Allah judges as He wills' }] },
  { ar: 'الْعَدْل', en: 'Al-Adl', meaning: 'The Just', detailsAr: 'العادل الذي لا يظلم', detailsEn: 'The One who is perfectly just', references: [{ source: 'Quran', ref: '4:40', textAr: 'إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ', textEn: "Indeed, Allah does not do injustice, even as much as an atom's weight" }] },
  { ar: 'اللَّطِيف', en: 'Al-Latif', meaning: 'The Subtle', detailsAr: 'اللطيف بعباده', detailsEn: 'The One who is kind and subtle', references: [{ source: 'Quran', ref: '6:103', textAr: 'وَهُوَ اللَّطِيفُ الْخَبِيرُ', textEn: 'He is the Subtle, the All-Aware' }] },
  { ar: 'الْخَبِير', en: 'Al-Khabir', meaning: 'The All-Aware', detailsAr: 'الخبير بكل شيء', detailsEn: 'The One who is aware of all things', references: [{ source: 'Quran', ref: '6:18', textAr: 'وَهُوَ الْحَكِيمُ الْخَبِيرُ', textEn: 'And He is the Wise, the All-Aware' }] },
  { ar: 'الْحَلِيم', en: 'Al-Halim', meaning: 'The Forbearing', detailsAr: 'الحليم الذي لا يعجل بالعقوبة', detailsEn: 'The One who is patient and forbearing', references: [{ source: 'Quran', ref: '2:235', textAr: 'وَاعْلَمُوا أَنَّ اللَّهَ غَفُورٌ حَلِيمٌ', textEn: 'And know that Allah is Forgiving and Forbearing' }] },
  { ar: 'الْعَظِيم', en: 'Al-Azim', meaning: 'The Magnificent', detailsAr: 'العظيم في ذاته وصفاته', detailsEn: 'The One who is supremely great', references: [{ source: 'Quran', ref: '2:255', textAr: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', textEn: 'And He is the Most High, the Magnificent' }] },
  { ar: 'الْغَفُور', en: 'Al-Ghafur', meaning: 'The All-Forgiving', detailsAr: 'الغفور لذنوب عباده', detailsEn: 'The One who forgives all sins', references: [{ source: 'Quran', ref: '2:173', textAr: 'فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ', textEn: 'Indeed, Allah is Forgiving and Merciful' }] },
  { ar: 'الشَّكُور', en: 'Ash-Shakur', meaning: 'The Appreciative', detailsAr: 'الذي يشكر القليل من العمل', detailsEn: 'The One who appreciates good deeds', references: [{ source: 'Quran', ref: '35:30', textAr: 'إِنَّهُ غَفُورٌ شَكُورٌ', textEn: 'Indeed, He is Forgiving and Appreciative' }] },
  { ar: 'الْعَلِيّ', en: 'Al-Ali', meaning: 'The Most High', detailsAr: 'العلي فوق خلقه', detailsEn: 'The One who is exalted above all', references: [{ source: 'Quran', ref: '2:255', textAr: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', textEn: 'And He is the Most High, the Magnificent' }] },
  { ar: 'الْكَبِير', en: 'Al-Kabir', meaning: 'The Great', detailsAr: 'الكبير في قدره وعظمته', detailsEn: 'The One who is great in status', references: [{ source: 'Quran', ref: '13:9', textAr: 'الْكَبِيرُ الْمُتَعَالِ', textEn: 'The Great, the Exalted' }] },
  { ar: 'الْحَفِيظ', en: 'Al-Hafiz', meaning: 'The Preserver', detailsAr: 'الحافظ لكل شيء', detailsEn: 'The One who preserves all things', references: [{ source: 'Quran', ref: '11:57', textAr: 'إِنَّ رَبِّي عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ', textEn: 'Indeed, my Lord is Guardian over all things' }] },
  { ar: 'الْمُقِيت', en: 'Al-Muqit', meaning: 'The Sustainer', detailsAr: 'المقيت الذي يعطي القوت', detailsEn: 'The One who provides sustenance', references: [{ source: 'Quran', ref: '4:85', textAr: 'وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا', textEn: 'And Allah is ever, over all things, a Keeper' }] },
  { ar: 'الْحَسِيب', en: 'Al-Hasib', meaning: 'The Reckoner', detailsAr: 'الذي يحاسب الخلق', detailsEn: 'The One who takes account', references: [{ source: 'Quran', ref: '4:6', textAr: 'وَكَفَىٰ بِاللَّهِ حَسِيبًا', textEn: 'And sufficient is Allah as a Reckoner' }] },
  { ar: 'الْجَلِيل', en: 'Al-Jalil', meaning: 'The Majestic', detailsAr: 'الجليل في قدره', detailsEn: 'The One who is majestic', references: [{ source: 'Quran', ref: '55:27', textAr: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', textEn: 'Owner of Majesty and Honor' }] },
  { ar: 'الْكَرِيم', en: 'Al-Karim', meaning: 'The Generous', detailsAr: 'الكريم في عطائه', detailsEn: 'The One who is generous', references: [{ source: 'Quran', ref: '27:40', textAr: 'إِنَّ رَبِّي غَنِيٌّ كَرِيمٌ', textEn: 'Indeed, my Lord is Free of need and Generous' }] },
  { ar: 'الرَّقِيب', en: 'Ar-Raqib', meaning: 'The Watchful', detailsAr: 'الرقيب على كل شيء', detailsEn: 'The One who watches over all', references: [{ source: 'Quran', ref: '5:117', textAr: 'وَكُنتَ أَنتَ الرَّقِيبَ عَلَيْهِمْ', textEn: 'And You were the Witness over them' }] },
  { ar: 'الْمُجِيب', en: 'Al-Mujib', meaning: 'The Responsive', detailsAr: 'المجيب لدعاء الداعين', detailsEn: 'The One who responds to prayers', references: [{ source: 'Quran', ref: '11:61', textAr: 'إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ', textEn: 'Indeed, my Lord is near and responsive' }] },
  { ar: 'الْوَاسِع', en: 'Al-Wasi', meaning: 'The All-Encompassing', detailsAr: 'الواسع في علمه ورحمته', detailsEn: 'The One whose knowledge is vast', references: [{ source: 'Quran', ref: '2:115', textAr: 'إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ', textEn: 'Indeed, Allah is All-Encompassing and All-Knowing' }] },
  { ar: 'الْحَكِيم', en: 'Al-Hakim', meaning: 'The Wise', detailsAr: 'الحكيم في أفعاله وأحكامه', detailsEn: 'The One who is perfectly wise', references: [{ source: 'Quran', ref: '2:32', textAr: 'إِنَّكَ أَنتَ الْعَلِيمُ الْحَكِيمُ', textEn: 'Indeed, You are the All-Knowing, the All-Wise' }] },
  { ar: 'الْوَدُود', en: 'Al-Wadud', meaning: 'The Loving', detailsAr: 'المحب لعباده المؤمنين', detailsEn: 'The One who loves His believing servants', references: [{ source: 'Quran', ref: '11:90', textAr: 'إِنَّ رَبِّي رَحِيمٌ وَدُودٌ', textEn: 'Indeed, my Lord is Merciful and Loving' }] },
  { ar: 'الْمَجِيد', en: 'Al-Majid', meaning: 'The Glorious', detailsAr: 'المجيد في أسمائه وصفاته', detailsEn: 'The One who is glorious', references: [{ source: 'Quran', ref: '11:73', textAr: 'إِنَّهُ حَمِيدٌ مَّجِيدٌ', textEn: 'Indeed, He is Praiseworthy and Glorious' }] },
  { ar: 'الْبَاعِث', en: "Al-Ba'ith", meaning: 'The Resurrector', detailsAr: 'الذي يبعث الموتى', detailsEn: 'The One who resurrects the dead', references: [{ source: 'Quran', ref: '22:7', textAr: 'وَأَنَّ اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ', textEn: 'And that Allah will resurrect those in the graves' }] },
  { ar: 'الشَّهِيد', en: 'Ash-Shahid', meaning: 'The Witness', detailsAr: 'الشاهد على كل شيء', detailsEn: 'The Witness over all things', references: [{ source: 'Quran', ref: '5:117', textAr: 'إِنَّكَ أَنتَ عَلَّامُ الْغُيُوبِ', textEn: 'Indeed, You are Knower of the unseen' }] },
  { ar: 'الْحَقّ', en: 'Al-Haqq', meaning: 'The Truth', detailsAr: 'الحق في ذاته وصفاته', detailsEn: 'The One who is the absolute truth', references: [{ source: 'Quran', ref: '22:6', textAr: 'ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ', textEn: 'That is because Allah is the Truth' }] },
  { ar: 'الْوَكِيل', en: 'Al-Wakil', meaning: 'The Trustee', detailsAr: 'الوكيل الذي يتوكل عليه', detailsEn: 'The One upon whom we rely', references: [{ source: 'Quran', ref: '3:173', textAr: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', textEn: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs' }] },
  { ar: 'الْقَوِيّ', en: 'Al-Qawi', meaning: 'The Strong', detailsAr: 'القوي الذي لا يعجزه شيء', detailsEn: 'The One who is all-powerful', references: [{ source: 'Quran', ref: '22:40', textAr: 'إِنَّ اللَّهَ لَقَوِيٌّ عَزِيزٌ', textEn: 'Indeed, Allah is Powerful and Exalted in Might' }] },
  { ar: 'الْمَتِين', en: 'Al-Matin', meaning: 'The Firm', detailsAr: 'المتين في قوته', detailsEn: 'The One whose strength is firm', references: [{ source: 'Quran', ref: '51:58', textAr: 'ذُو الْقُوَّةِ الْمَتِينُ', textEn: 'The possessor of strength, the Firm' }] },
  { ar: 'الْوَلِيّ', en: 'Al-Wali', meaning: 'The Protecting Friend', detailsAr: 'ولي المؤمنين وناصرهم', detailsEn: 'The Protector and helper of believers', references: [{ source: 'Quran', ref: '3:68', textAr: 'وَاللَّهُ وَلِيُّ الْمُؤْمِنِينَ', textEn: 'And Allah is the Protector of the believers' }] },
  { ar: 'الْحَمِيد', en: 'Al-Hamid', meaning: 'The Praiseworthy', detailsAr: 'المحمود بكل لسان', detailsEn: 'The One who is praised', references: [{ source: 'Quran', ref: '22:24', textAr: 'إِلَىٰ صِرَاطِ الْحَمِيدِ', textEn: 'To the path of the Praiseworthy' }] },
  { ar: 'الْمُحْصِي', en: 'Al-Muhsi', meaning: 'The Reckoner', detailsAr: 'الذي أحصى كل شيء', detailsEn: 'The One who accounts for all things', references: [{ source: 'Quran', ref: '36:12', textAr: 'وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ', textEn: 'And all things We have enumerated' }] },
  { ar: 'الْمُبْدِئ', en: 'Al-Mubdi', meaning: 'The Originator', detailsAr: 'الذي بدأ الخلق', detailsEn: 'The One who originates creation', references: [{ source: 'Quran', ref: '85:13', textAr: 'إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ', textEn: 'Indeed, it is He who originates and repeats' }] },
  { ar: 'الْمُعِيد', en: "Al-Mu'id", meaning: 'The Restorer', detailsAr: 'الذي يعيد الخلق بعد الموت', detailsEn: 'The One who restores creation', references: [{ source: 'Quran', ref: '85:13', textAr: 'يُبْدِئُ وَيُعِيدُ', textEn: 'Originates and repeats' }] },
  { ar: 'الْمُحْيِي', en: 'Al-Muhyi', meaning: 'The Giver of Life', detailsAr: 'الذي يحيي الموتى', detailsEn: 'The One who gives life', references: [{ source: 'Quran', ref: '30:50', textAr: 'كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا', textEn: 'How He gives life to the earth after its lifelessness' }] },
  { ar: 'الْمُمِيت', en: 'Al-Mumit', meaning: 'The Bringer of Death', detailsAr: 'الذي يميت كل حي', detailsEn: 'The One who causes death', references: [{ source: 'Quran', ref: '15:23', textAr: 'إِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ', textEn: 'Indeed, We give life and cause death' }] },
  { ar: 'الْحَيّ', en: 'Al-Hayy', meaning: 'The Ever-Living', detailsAr: 'الحي الذي لا يموت', detailsEn: 'The One who is eternally alive', references: [{ source: 'Quran', ref: '2:255', textAr: 'الْحَيُّ الْقَيُّومُ', textEn: 'The Ever-Living, the Sustainer' }] },
  { ar: 'الْقَيُّوم', en: 'Al-Qayyum', meaning: 'The Self-Sustaining', detailsAr: 'القائم بنفسه المقيم لغيره', detailsEn: 'The Self-Sustaining Sustainer of all', references: [{ source: 'Quran', ref: '2:255', textAr: 'الْحَيُّ الْقَيُّومُ', textEn: 'The Ever-Living, the Sustainer' }] },
  { ar: 'الْوَاجِد', en: 'Al-Wajid', meaning: 'The Finder', detailsAr: 'الواجد لكل شيء', detailsEn: 'The One who finds all things', references: [{ source: 'Quran', ref: '38:44', textAr: 'إِنَّا وَجَدْنَاهُ صَابِرًا', textEn: 'Indeed, We found him patient' }] },
  { ar: 'الْمَاجِد', en: 'Al-Majid', meaning: 'The Noble', detailsAr: 'الماجد في ذاته', detailsEn: 'The One who is noble', references: [{ source: 'Quran', ref: '85:15', textAr: 'ذُو الْعَرْشِ الْمَجِيدُ', textEn: 'Owner of the Throne, the Glorious' }] },
  { ar: 'الْوَاحِد', en: 'Al-Wahid', meaning: 'The One', detailsAr: 'الواحد الأحد', detailsEn: 'The Unique, the Only One', references: [{ source: 'Quran', ref: '13:16', textAr: 'وَهُوَ الْوَاحِدُ الْقَهَّارُ', textEn: 'He is the One, the Subduer' }] },
  { ar: 'الصَّمَد', en: 'As-Samad', meaning: 'The Eternal Refuge', detailsAr: 'الذي تصمد إليه الخلائق', detailsEn: 'The One upon whom all depend', references: [{ source: 'Quran', ref: '112:2', textAr: 'اللَّهُ الصَّمَدُ', textEn: 'Allah, the Eternal Refuge' }] },
  { ar: 'الْقَادِر', en: 'Al-Qadir', meaning: 'The Capable', detailsAr: 'القادر على كل شيء', detailsEn: 'The One who is capable of everything', references: [{ source: 'Quran', ref: '6:65', textAr: 'قُلْ هُوَ الْقَادِرُ...', textEn: 'Say, He is the Capable...' }] },
  { ar: 'الْمُقْتَدِر', en: 'Al-Muqtadir', meaning: 'The Omnipotent', detailsAr: 'المقتدر الذي لا يعجز', detailsEn: 'The One whose power is absolute', references: [{ source: 'Quran', ref: '54:42', textAr: 'أَخْذَ عَزِيزٍ مُّقْتَدِرٍ', textEn: 'Seizure of One Exalted in Might and Omnipotent' }] },
  { ar: 'الْمُقَدِّم', en: 'Al-Muqaddim', meaning: 'The Expediter', detailsAr: 'الذي يقدم من يشاء', detailsEn: 'The One who brings forward whom He wills', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ', textEn: 'You are the Expediter and the Delayer' }] },
  { ar: 'الْمُؤَخِّر', en: "Al-Mu'akhkhir", meaning: 'The Delayer', detailsAr: 'الذي يؤخر من يشاء', detailsEn: 'The One who delays whom He wills', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ', textEn: 'You are the Expediter and the Delayer' }] },
  { ar: 'الأَوَّل', en: 'Al-Awwal', meaning: 'The First', detailsAr: 'الأول بلا ابتداء', detailsEn: 'The First with no beginning', references: [{ source: 'Quran', ref: '57:3', textAr: 'هُوَ الْأَوَّلُ وَالْآخِرُ', textEn: 'He is the First and the Last' }] },
  { ar: 'الآخِر', en: 'Al-Akhir', meaning: 'The Last', detailsAr: 'الآخر بلا انتهاء', detailsEn: 'The Last with no end', references: [{ source: 'Quran', ref: '57:3', textAr: 'هُوَ الْأَوَّلُ وَالْآخِرُ', textEn: 'He is the First and the Last' }] },
  { ar: 'الظَّاهِر', en: 'Az-Zahir', meaning: 'The Manifest', detailsAr: 'الظاهر فوق كل شيء', detailsEn: 'The Manifest above all things', references: [{ source: 'Quran', ref: '57:3', textAr: 'وَالظَّاهِرُ وَالْبَاطِنُ', textEn: 'The Manifest and the Hidden' }] },
  { ar: 'الْبَاطِن', en: 'Al-Batin', meaning: 'The Hidden', detailsAr: 'الباطن الذي لا يدرك', detailsEn: 'The Hidden who cannot be fully comprehended', references: [{ source: 'Quran', ref: '57:3', textAr: 'وَالظَّاهِرُ وَالْبَاطِنُ', textEn: 'The Manifest and the Hidden' }] },
  { ar: 'الْوَالِي', en: 'Al-Wali', meaning: 'The Governor', detailsAr: 'الوالي المتصرف في الخلق', detailsEn: 'The Governor who manages all affairs', references: [{ source: 'Quran', ref: '13:11', textAr: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ', textEn: 'Allah will not change the condition of a people' }] },
  { ar: 'الْمُتَعَالِي', en: "Al-Muta'ali", meaning: 'The Most Exalted', detailsAr: 'المتعالي عن صفات الخلق', detailsEn: 'The One who is supremely exalted', references: [{ source: 'Quran', ref: '13:9', textAr: 'الْكَبِيرُ الْمُتَعَالِ', textEn: 'The Great, the Exalted' }] },
  { ar: 'الْبَرّ', en: 'Al-Barr', meaning: 'The Source of All Goodness', detailsAr: 'البر الذي عم بره جميع خلقه', detailsEn: 'The Source of goodness to all creation', references: [{ source: 'Quran', ref: '52:28', textAr: 'إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ', textEn: 'Indeed, He is the Source of All Goodness, the Merciful' }] },
  { ar: 'التَّوَّاب', en: 'At-Tawwab', meaning: 'The Acceptor of Repentance', detailsAr: 'التواب الذي يقبل توبة عباده', detailsEn: 'The One who accepts repentance', references: [{ source: 'Quran', ref: '2:37', textAr: 'إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ', textEn: 'Indeed, He is the Acceptor of Repentance, the Merciful' }] },
  { ar: 'الْمُنْتَقِم', en: 'Al-Muntaqim', meaning: 'The Avenger', detailsAr: 'المنتقم من الظالمين', detailsEn: 'The One who takes retribution from the oppressors', references: [{ source: 'Quran', ref: '32:22', textAr: 'إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ', textEn: 'Indeed We, from the criminals, will take retribution' }] },
  { ar: 'الْعَفُوّ', en: 'Al-Afuww', meaning: 'The Pardoner', detailsAr: 'العفو الذي يمحو الذنوب', detailsEn: 'The One who pardons and erases sins', references: [{ source: 'Quran', ref: '4:43', textAr: 'إِنَّ اللَّهَ كَانَ عَفُوًّا غَفُورًا', textEn: 'Indeed, Allah is ever Pardoning and Forgiving' }] },
  { ar: 'الرَّؤُوف', en: "Ar-Ra'uf", meaning: 'The Most Kind', detailsAr: 'الرؤوف بعباده', detailsEn: 'The One who is full of kindness', references: [{ source: 'Quran', ref: '2:143', textAr: 'إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ', textEn: 'Indeed, Allah is, to the people, Kind and Merciful' }] },
  { ar: 'مَالِكُ الْمُلْك', en: 'Malik-ul-Mulk', meaning: 'Master of the Kingdom', detailsAr: 'مالك الملك كله', detailsEn: 'The Owner of all dominion', references: [{ source: 'Quran', ref: '3:26', textAr: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ', textEn: 'Say, O Allah, Owner of Sovereignty' }] },
  { ar: 'ذُو الْجَلاَلِ وَالإكْرَام', en: 'Dhul-Jalali wal-Ikram', meaning: 'Possessor of Majesty and Honor', detailsAr: 'ذو الجلال والإكرام', detailsEn: 'The Possessor of Glory and Honor', references: [{ source: 'Quran', ref: '55:27', textAr: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', textEn: 'Owner of Majesty and Honor' }] },
  { ar: 'الْمُقْسِط', en: 'Al-Muqsit', meaning: 'The Equitable', detailsAr: 'المقسط العادل', detailsEn: 'The One who is perfectly just', references: [{ source: 'Quran', ref: '7:29', textAr: 'إِنَّهُ يُحِبُّ الْمُقْسِطِينَ', textEn: 'Indeed, He loves the equitable' }] },
  { ar: 'الْجَامِع', en: 'Al-Jami', meaning: 'The Gatherer', detailsAr: 'الجامع للخلائق يوم القيامة', detailsEn: 'The One who gathers all on the Day of Judgment', references: [{ source: 'Quran', ref: '3:9', textAr: 'إِنَّكَ جَامِعُ النَّاسِ', textEn: 'Surely You will gather the people' }] },
  { ar: 'الْغَنِيّ', en: 'Al-Ghani', meaning: 'The Self-Sufficient', detailsAr: 'الغني الذي لا يحتاج لأحد', detailsEn: 'The One who is free of all needs', references: [{ source: 'Quran', ref: '2:267', textAr: 'اللَّهُ غَنِيٌّ حَمِيدٌ', textEn: 'Allah is Self-Sufficient and Praiseworthy' }] },
  { ar: 'الْمُغْنِي', en: 'Al-Mughni', meaning: 'The Enricher', detailsAr: 'المغني الذي يغني من يشاء', detailsEn: 'The One who enriches whom He wills', references: [{ source: 'Quran', ref: '9:74', textAr: '...', textEn: '...' }] },
  { ar: 'الْمَانِع', en: 'Al-Mani', meaning: 'The Preventer', detailsAr: 'المانع الذي يمنع ما يشاء', detailsEn: 'The One who prevents what He wills', references: [{ source: 'Hadith', ref: 'Muslim', textAr: 'اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ', textEn: 'O Allah, there is no preventer of what You give' }] },
  { ar: 'الضَّارّ', en: 'Ad-Darr', meaning: 'The Distressor', detailsAr: 'الضار بمن يشاء بحكمته', detailsEn: 'The One who brings hardship with wisdom', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'وَالضَّارُّ النَّافِعُ', textEn: 'The Distressor, the Benefiter' }] },
  { ar: 'النَّافِع', en: 'An-Nafi', meaning: 'The Benefiter', detailsAr: 'النافع بمن يشاء', detailsEn: 'The One who benefits whom He wills', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'وَالضَّارُّ النَّافِعُ', textEn: 'The Distressor, the Benefiter' }] },
  { ar: 'النُّور', en: 'An-Nur', meaning: 'The Light', detailsAr: 'نور السماوات والأرض', detailsEn: 'The Light of the heavens and earth', references: [{ source: 'Quran', ref: '24:35', textAr: 'اللَّّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', textEn: 'Allah is the Light of the heavens and the earth' }] },
  { ar: 'الْهَادِي', en: 'Al-Hadi', meaning: 'The Guide', detailsAr: 'الهادي إلى الصراط المستقيم', detailsEn: 'The Guide to the straight path', references: [{ source: 'Quran', ref: '22:54', textAr: 'لَهَادِ الَّذِينَ آمَنُوا...', textEn: 'He is the Guide of those who believe...' }] },
  { ar: 'الْبَدِيع', en: 'Al-Badi', meaning: 'The Incomparable Originator', detailsAr: 'بديع السماوات والأرض', detailsEn: 'The Originator of the heavens and earth', references: [{ source: 'Quran', ref: '2:117', textAr: 'بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ', textEn: 'Originator of the heavens and the earth' }] },
  { ar: 'الْبَاقِي', en: 'Al-Baqi', meaning: 'The Everlasting', detailsAr: 'الباقي الذي لا يفنى', detailsEn: 'The One who remains forever', references: [{ source: 'Quran', ref: '55:27', textAr: 'وَيَبْقَىٰ وَجْهُ رَبِّكَ', textEn: 'And there will remain the Face of your Lord' }] },
  { ar: 'الْوَارِث', en: 'Al-Warith', meaning: 'The Inheritor', detailsAr: 'الوارث الذي يرث كل شيء', detailsEn: 'The One who inherits all', references: [{ source: 'Quran', ref: '15:23', textAr: 'وَنَحْنُ الْوَارِثُونَ', textEn: 'And We are the Inheritors' }] },
  { ar: 'الرَّشِيد', en: 'Ar-Rashid', meaning: 'The Guide to the Right Path', detailsAr: 'الرشيد الذي يرشد الخلق', detailsEn: 'The One who guides aright', references: [{ source: 'Quran', ref: '11:87', textAr: 'إِنَّكَ لَأَنتَ الْحَلِيمُ الرَّشِيدُ', textEn: 'Indeed, You are the Forbearing, the Guide' }] },
  { ar: 'الصَّبُور', en: 'As-Sabur', meaning: 'The Most Patient', detailsAr: 'الصبور الذي لا يعجل بالعقوبة', detailsEn: 'The One who does not hasten punishment', references: [{ source: 'Hadith', ref: 'Tirmidhi', textAr: 'وَاللَّهُ صَبُورٌ', textEn: 'And Allah is Most Patient' }] },
];

/* -------------------------------------------
   Component
--------------------------------------------*/
const NamesOfAllah: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const dir = ar ? "rtl" : "ltr";

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
    <div className="min-h-screen pb-20" dir={dir}>
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
            <Heart className="h-7 w-7 text-primary" />
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
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                    <Card className="relative neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl p-6 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                          <Sparkles className={`h-7 w-7 ${tone.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{idx + 1}</span>
                            <h3 className="font-semibold text-lg text-primary mb-1 truncate">{n.ar}</h3>
                          </div>

                          <p className="text-sm font-medium truncate">{n.en}</p>

                          {/* Proper description preview + HARD WRAP */}
                          <p
                            className={`text-xs text-muted-foreground mt-1 ${ar ? "text-right arabic-regal" : ""} line-clamp-2 break-words whitespace-normal text-pretty hyphens-auto`}
                            title={(ar ? n.detailsAr : n.detailsEn) || (ar ? `المعنى: ${n.meaning}` : `Meaning: ${n.meaning}`)}
                          >
                            {(ar ? n.detailsAr : n.detailsEn) || (ar ? `المعنى: ${n.meaning}` : `Meaning: ${n.meaning}`)}
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
      {selected !== null && (() => {
        const n = NAMES[selected];
        const tone = toneFor(selected);
        return (
          <div className="max-w-2xl mx-auto px-6">
            {/* Accent header (bounded) */}
            <div className="relative overflow-hidden rounded-3xl mb-6">
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.gradient} rounded-3xl blur-2xl opacity-70`} />
              <Card className="relative neomorph smooth-transition backdrop-blur-xl p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
                    <Sparkles className={`h-7 w-7 ${tone.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-semibold mb-1 text-primary break-words whitespace-normal">{n.ar}</h2>
                    <p className="text-sm text-muted-foreground break-words whitespace-normal">{n.en}</p>
                    <p className="text-xs text-muted-foreground mt-1 break-words whitespace-normal">
                      {content.meaningLabel}: {n.meaning}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <Card className="neomorph backdrop-blur-xl p-5 rounded-2xl">
                <div className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {content.detailsLabel}
                </div>
                <div className={`text-sm ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
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
                      <div className="font-semibold text-sm text-primary break-words whitespace-normal">
                        {ref.source} {ref.ref}
                      </div>
                      <div className={`text-xs text-muted-foreground ${ar ? "text-right arabic-regal" : ""} break-words whitespace-normal text-pretty hyphens-auto`}>
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

export default NamesOfAllah;
