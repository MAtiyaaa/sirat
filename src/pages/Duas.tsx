import React, { useMemo, useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bed,
  BedDouble,
  BookOpen,
  CloudRain,
  Compass,
  Droplet,
  Home,
  Info,
  MapPin,
  Moon,
  Plane,
  Search,
  Shield,
  Sparkles,
  Sun,
  Users,
  Briefcase,
  Coins,
  Gauge,
  Handshake,
  Heart,
  Hospital,
  AlarmClock,
  MessageSquareHeart,
  Landmark,
  CheckCircle2,
  Copy,
  Utensils,
  RefreshCcw,
  Bookmark,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ----------------------------------------------------------------
   Types
------------------------------------------------------------------*/
type CategoryKey =
  | "all"
  | "morning"
  | "evening"
  | "sleep"
  | "waking"
  | "eating"
  | "home"
  | "travel"
  | "protection"
  | "knowledge"
  | "forgiveness"
  | "parents"
  | "rain"
  | "istikhara"
  | "wudu"
  | "salah"
  | "guidance"
  | "health"
  | "anxiety"
  | "gratitude"
  | "rizq"
  | "repentance"
  | "patience"
  | "character"
  | "mercy"
  | "marriage"
  | "work"
  | "calamity"
  | "illness"
  | "visiting_sick"
  | "graveyard"
  | "meeting"
  | "debt"
  | "study"
  | "general";

interface Dua {
  id: string;
  icon?: React.ComponentType<any>;
  categories: CategoryKey[];
  titleAr: string;
  titleEn: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
  repeat?: number;
}

/* ----------------------------------------------------------------
   Category metadata
------------------------------------------------------------------*/
const CAT_META: Record<CategoryKey, { labelEn: string; labelAr: string; icon: React.ComponentType<any> }> = {
  all: { labelEn: "All", labelAr: "الكل", icon: CheckCircle2 },
  morning: { labelEn: "Morning", labelAr: "الصباح", icon: Sun },
  evening: { labelEn: "Evening", labelAr: "المساء", icon: Moon },
  sleep: { labelEn: "Before Sleep", labelAr: "قبل النوم", icon: BedDouble },
  waking: { labelEn: "Upon Waking", labelAr: "عند الاستيقاظ", icon: Bed },
  eating: { labelEn: "Food & Drink", labelAr: "الطعام والشراب", icon: Utensils },
  home: { labelEn: "Home", labelAr: "المنزل", icon: Home },
  travel: { labelEn: "Travel", labelAr: "السفر", icon: Plane },
  protection: { labelEn: "Protection", labelAr: "الحفظ والحماية", icon: Shield },
  knowledge: { labelEn: "Knowledge", labelAr: "طلب العلم", icon: BookOpen },
  forgiveness: { labelEn: "Forgiveness", labelAr: "الاستغفار", icon: Sparkles },
  parents: { labelEn: "Parents", labelAr: "الوالدان", icon: Users },
  rain: { labelEn: "Rain", labelAr: "المطر", icon: CloudRain },
  istikhara: { labelEn: "Istikhara", labelAr: "الاستخارة", icon: Heart },
  wudu: { labelEn: "Wudu", labelAr: "الوضوء", icon: Droplet },
  salah: { labelEn: "Salah", labelAr: "الصلاة", icon: Landmark },
  guidance: { labelEn: "Guidance", labelAr: "الهداية", icon: Compass },
  health: { labelEn: "Health", labelAr: "الصحة", icon: Hospital },
  anxiety: { labelEn: "Anxiety & Worry", labelAr: "الهم والقلق", icon: Gauge },
  gratitude: { labelEn: "Gratitude", labelAr: "الشكر", icon: CheckCircle2 },
  rizq: { labelEn: "Provision", labelAr: "الرزق", icon: Coins },
  repentance: { labelEn: "Repentance", labelAr: "التوبة", icon: Sparkles },
  patience: { labelEn: "Patience", labelAr: "الصبر", icon: AlarmClock },
  character: { labelEn: "Good Character", labelAr: "حسن الخلق", icon: Handshake },
  mercy: { labelEn: "Mercy", labelAr: "الرحمة", icon: Heart },
  marriage: { labelEn: "Marriage", labelAr: "الزواج", icon: Heart },
  work: { labelEn: "Work", labelAr: "العمل", icon: Briefcase },
  calamity: { labelEn: "Affliction", labelAr: "البلاء", icon: Info },
  illness: { labelEn: "Illness", labelAr: "المرض", icon: Hospital },
  visiting_sick: { labelEn: "Visiting Sick", labelAr: "عيادة المريض", icon: MessageSquareHeart },
  graveyard: { labelEn: "Graveyard", labelAr: "القبور", icon: Landmark },
  meeting: { labelEn: "Meeting & Speech", labelAr: "الاجتماع والخطاب", icon: MessageSquareHeart },
  debt: { labelEn: "Debt", labelAr: "الدَّيْن", icon: Coins },
  study: { labelEn: "Study", labelAr: "الدراسة", icon: BookOpen },
  general: { labelEn: "General", labelAr: "عام", icon: MapPin },
};

const FALLBACK_ICON = Shield;

/* ----------------------------------------------------------------
   Duas dataset (expanded, categorized)
------------------------------------------------------------------*/
const ALL_DUAS: Dua[] = [
  // Morning / Evening
  {
    id: "morning-opening",
    icon: Sun,
    categories: ["morning", "gratitude", "protection"],
    titleAr: "أذكار الصباح – الافتتاح",
    titleEn: "Morning – Opening",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ...",
    transliteration: "Asbaḥnā wa asbaḥal-mulku lillāh, wal-ḥamdu lillāh...",
    translation: "We have reached the morning and to Allah belongs all sovereignty; all praise is for Allah.",
    reference: "Muslim",
  },
  {
    id: "evening-opening",
    icon: Moon,
    categories: ["evening", "gratitude", "protection"],
    titleAr: "أذكار المساء – الافتتاح",
    titleEn: "Evening – Opening",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ...",
    transliteration: "Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh...",
    translation: "We have reached the evening and to Allah belongs all sovereignty; all praise is for Allah.",
    reference: "Muslim",
  },
  {
    id: "ayatul-kursi",
    icon: Shield,
    categories: ["morning", "evening", "protection", "general"],
    titleAr: "آية الكرسي",
    titleEn: "Ayat al-Kursi",
    arabic: "اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... (البقرة: 255)",
    transliteration: "Allāhu lā ilāha illā Huwa-l-Ḥayyul-Qayyūm... (2:255)",
    translation: "Allah—none has the right to be worshipped except Him, the Ever-Living, the Sustainer of all. (2:255)",
    reference: "Bukhari; Muslim",
  },
  {
    id: "three-quls",
    icon: Shield,
    categories: ["morning", "evening", "protection"],
    titleAr: "المعوذات",
    titleEn: "Three Quls",
    arabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    transliteration: "Qul Huwa Allāhu Aḥad • Qul Aʿūdhu birabbil-falaq • Qul Aʿūdhu birabbin-nās",
    translation:
      "Say: He is Allah, One • Say: I seek refuge with the Lord of daybreak • Say: I seek refuge with the Lord of mankind.",
    reference: "Abu Dawud; Tirmidhi",
    repeat: 3,
  },
  {
    id: "morning-dhikr-1",
    icon: Sun,
    categories: ["morning", "gratitude", "protection"],
    titleAr: "دعاء الصباح الأول",
    titleEn: "Morning Supplication 1",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allāhumma bika asbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr.",
    translation:
      "O Allah, by Your grace we reach the morning, by Your grace we reach the evening, by Your grace we live, and by Your grace we die, and to You is the resurrection.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: "morning-dhikr-2",
    icon: Sun,
    categories: ["morning", "gratitude", "protection"],
    titleAr: "دعاء الصباح الثاني",
    titleEn: "Morning Supplication 2",
    arabic:
      "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
    transliteration:
      "Asbaḥnā ʿalā fitratil-islām, wa ʿalā kalimatil-ikhlāṣ, wa ʿalā dīni nabiyyinā Muḥammadin ṣallallāhu ʿalayhi wa sallam, wa ʿalā millati abīnā Ibrāhīma ḥanīfan muslimā wa mā kāna minal-mushrikīn.",
    translation:
      "We have reached the morning following the natural disposition of Islam, the word of sincerity, the religion of our Prophet Muhammad, the religion of our father Abraham, upright in devotion to Allah, never associating partners with Him.",
    reference: "Ahmad",
  },
  {
    id: "morning-dhikr-3",
    icon: Sun,
    categories: ["morning", "protection"],
    titleAr: "دعاء الصباح الثالث",
    titleEn: "Morning Supplication 3",
    arabic:
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    transliteration:
      "Subḥānallāhi wa biḥamdihī ʿadada khalqihī, wa riḍā nafsihī, wa zinata ʿarshihī, wa midāda kalimātihī.",
    translation:
      "Glory is to Allah and praise is to Him, according to the number of His creations, equal to His pleasure, equal to the weight of His Throne, and equal to the ink used in recording His words.",
    reference: "Muslim",
    repeat: 3,
  },
  {
    id: "evening-dhikr-1",
    icon: Moon,
    categories: ["evening", "gratitude", "protection"],
    titleAr: "دعاء المساء الأول",
    titleEn: "Evening Supplication 1",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā ʿabduka, wa anā ʿalā ʿahdika wa waʿdika mā istaṭaʿtu, aʿūdhu bika min sharri mā ṣanaʿtu, abūʾu laka bi niʿmatika ʿalayya, wa abūʾu laka bi dhanbī faghfir lī fa innahu lā yaghfirudhunūba illā anta.",
    translation:
      "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide by Your covenant and promise as best I can, I seek refuge in You from the evil of what I have done, I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
    reference: "Bukhari",
  },
  {
    id: "evening-dhikr-2",
    icon: Moon,
    categories: ["evening", "protection"],
    titleAr: "دعاء المساء الثاني",
    titleEn: "Evening Supplication 2",
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliteration:
      "Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr, rabbi as'aluka khayra mā fī hādhihil-laylati wa khayra mā baʿdahā, wa aʿūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā baʿdahā, rabbi aʿūdhu bika minal-kasali wa sū'il-kibar, rabbi aʿūdhu bika min ʿadhābin fin-nāri wa ʿadhābin fil-qabr.",
    translation:
      "We have reached the evening and at this evening all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the evils of old age. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
    reference: "Muslim",
  },
  {
    id: "evening-dhikr-3",
    icon: Moon,
    categories: ["evening", "protection"],
    titleAr: "دعاء المساء الثالث",
    titleEn: "Evening Supplication 3",
    arabic:
      "بِاسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillāhil-ladhī lā yaḍurru maʿa ismihī shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-samīʿul-ʿalīm.",
    translation:
      "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud, Tirmidhi",
    repeat: 3,
  },

  // Waking / Sleep / Eating
  {
    id: "upon-waking",
    icon: Bed,
    categories: ["waking", "gratitude"],
    titleAr: "دعاء الاستيقاظ",
    titleEn: "Upon Waking",
    arabic: "الْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr.",
    translation: "All praise is for Allah who gave us life after He caused us to die; to Him is the resurrection.",
    reference: "Bukhari",
  },
  {
    id: "upon-waking-2",
    icon: Bed,
    categories: ["waking", "gratitude"],
    titleAr: "دعاء الاستيقاظ الثاني",
    titleEn: "Upon Waking 2",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ",
    transliteration: "Al-ḥamdu lillāhil-ladhī ʿāfānī fī jasadī wa radda ʿalayya rūḥī, wa adhina lī bi dhikrih.",
    translation:
      "All praise is for Allah who has restored my health, returned my soul, and allowed me to remember Him.",
    reference: "Tirmidhi",
  },
  {
    id: "before-sleep",
    icon: BedDouble,
    categories: ["sleep", "protection"],
    titleAr: "دعاء النوم",
    titleEn: "Before Sleep",
    arabic: "بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allāhumma amūtu wa aḥyā.",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Bukhari",
  },
  {
    id: "before-sleep-2",
    icon: BedDouble,
    categories: ["sleep", "protection"],
    titleAr: "دعاء النوم الثاني",
    titleEn: "Before Sleep 2",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allāhumma qinī ʿadhābaka yawma tabʿathu ʿibādak.",
    translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
    reference: "Tirmidhi",
  },
  {
    id: "before-sleep-3",
    icon: BedDouble,
    categories: ["sleep", "protection"],
    titleAr: "دعاء النوم الثالث",
    titleEn: "Before Sleep 3",
    arabic:
      "بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    transliteration:
      "Bismika rabbi waḍaʿtu janbī, wa bika arfaʿuh, fa in amsakta nafsī farḥamhā, wa in arsaltahā faḥfaẓhā bimā taḥfaẓu bihi ʿibādakaṣ-ṣāliḥīn.",
    translation:
      "In Your name, my Lord, I place my side, and by Your will I raise it. If You take my soul, have mercy on it, and if You release it, protect it with that which You protect Your righteous servants.",
    reference: "Bukhari, Muslim",
  },
  {
    id: "before-sleep-4",
    icon: BedDouble,
    categories: ["sleep", "protection"],
    titleAr: "دعاء النوم الرابع",
    titleEn: "Before Sleep 4",
    arabic:
      "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
    transliteration:
      "Allāhumma aslamtu nafsī ilayk, wa fawwaḍtu amrī ilayk, wa wajjahtu wajhī ilayk, wa alja'tu ẓahrī ilayk, raghbatan wa rahbatan ilayk, lā malja'a wa lā manjā minka illā ilayk, āmantu bikitābikal-ladhī anzalta, wa binabiyyikal-ladhī arsalta.",
    translation:
      "O Allah, I have submitted my soul to You, and I have entrusted my affairs to You, and I have turned my face to You, and I have sought refuge in You out of desire and fear of You. There is no refuge or escape from You except to You. I have believed in Your Book which You have revealed, and in Your Prophet whom You have sent.",
    reference: "Bukhari, Muslim",
  },
  {
    id: "before-eating",
    icon: Utensils,
    categories: ["eating", "gratitude"],
    titleAr: "قبل الطعام",
    titleEn: "Before Eating",
    arabic: "بِسْمِ اللّٰهِ",
    transliteration: "Bismillāh.",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: "before-eating-2",
    icon: Utensils,
    categories: ["eating", "gratitude"],
    titleAr: "قبل الطعام الثاني",
    titleEn: "Before Eating 2",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Allāhumma bārik lanā fīmā razaqtanā wa qinā ʿadhāban-nār.",
    translation: "O Allah, bless what You have provided us with and protect us from the punishment of the Fire.",
    reference: "Muslim",
  },
  {
    id: "after-eating",
    icon: Utensils,
    categories: ["eating", "gratitude"],
    titleAr: "بعد الطعام",
    titleEn: "After Eating",
    arabic: "الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Al-ḥamdu lillāhil-ladhī aṭʿamanā wa saqānā wa jaʿalanā Muslimīn.",
    translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    reference: "Tirmidhi",
  },
  {
    id: "after-eating-2",
    icon: Utensils,
    categories: ["eating", "gratitude"],
    titleAr: "بعد الطعام الثاني",
    titleEn: "After Eating 2",
    arabic:
      "الْحَمْدُ لِلَّهِ كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبُّنَا",
    transliteration:
      "Al-ḥamdu lillāhi kaṭīran ṭayyiban mubārakan fīh, ghayra makfiyyin wa lā mawwadaʿin wa lā mustaghnan ʿanhu rabbunā.",
    translation:
      "All praise is for Allah, abundant, pure, and blessed, a praise that is insufficient, cannot be abandoned, and from which we cannot be independent, our Lord.",
    reference: "Bukhari",
  },
  {
    id: "forgetting-bismillah",
    icon: Utensils,
    categories: ["eating", "gratitude"],
    titleAr: "نسيان البسملة",
    titleEn: "Forgetting Bismillah",
    arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
    transliteration: "Bismillāhi awwalahu wa ākhirahu.",
    translation: "In the name of Allah at its beginning and its end.",
    reference: "Abu Dawud, Tirmidhi",
  },

  // Home / Travel
  {
    id: "enter-home",
    icon: Home,
    categories: ["home", "protection"],
    titleAr: "دخول المنزل",
    titleEn: "Entering Home",
    arabic: "بِسْمِ اللّٰهِ وَلَجْنَا، وَبِسْمِ اللّٰهِ خَرَجْنَا، وَعَلَى اللّٰهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillāhi walajnā, wa bismillāhi kharajnā, wa ʿalallāhi rabbinā tawakkalnā.",
    translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
    reference: "Abu Dawud",
  },
  {
    id: "enter-home-2",
    icon: Home,
    categories: ["home", "protection"],
    titleAr: "دخول المنزل الثاني",
    titleEn: "Entering Home 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِاسْمِ اللَّهِ وَلَجْنَا، وَبِاسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Allāhumma innī as'aluka khayral-mawliji wa khayral-makhraji, bismillāhi walajnā, wa bismillāhi kharajnā, wa ʿalallāhi rabbinā tawakkalnā.",
    translation:
      "O Allah, I ask You for the best of entering and the best of exiting. In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
    reference: "Abu Dawud",
  },
  {
    id: "leave-home",
    icon: MapPin,
    categories: ["home", "travel", "protection"],
    titleAr: "الخروج من المنزل",
    titleEn: "Leaving Home",
    arabic: "بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    transliteration: "Bismillāh, tawakkaltu ʿalallāh, lā ḥawla wa lā quwwata illā billāh.",
    translation: "In the name of Allah, I rely upon Allah; there is no might nor power except with Allah.",
    reference: "Tirmidhi",
  },
  {
    id: "leave-home-2",
    icon: MapPin,
    categories: ["home", "travel", "protection"],
    titleAr: "الخروج من المنزل الثاني",
    titleEn: "Leaving Home 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
    transliteration:
      "Allāhumma innī aʿūdhu bika an aḍilla aw uḍalla, aw azilla aw uzalla, aw aẓlima aw uẓlama, aw ajhala aw yujhala ʿalayya.",
    translation:
      "O Allah, I seek refuge in You from going astray or being led astray, from slipping or being made to slip, from oppressing or being oppressed, from acting ignorantly or being treated ignorantly.",
    reference: "Abu Dawud, Tirmidhi, Ibn Majah",
  },
  {
    id: "travel",
    icon: Plane,
    categories: ["travel", "protection"],
    titleAr: "دعاء السفر",
    titleEn: "Travel",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ",
    transliteration: "Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā lamunqalibūn.",
    translation:
      "Glory be to Him who subjected this to us, and we could not have done so on our own. Surely, to our Lord we will return.",
    reference: "Muslim",
  },
  {
    id: "travel-2",
    icon: Plane,
    categories: ["travel", "protection"],
    titleAr: "دعاء السفر الثاني",
    titleEn: "Travel 2",
    arabic:
      "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
    transliteration:
      "Allāhumma innā nas'aluka fī safarinā hādhal-birra wat-taqwā, wa minal-ʿamali mā tarḍā, Allāhumma hawwin ʿalaynā safaranā hādhā wa ṭwi ʿannā buʿdahu, Allāhumma antaṣ-ṣāḥibu fis-safar, wal-khalīfatu fil-ahli, Allāhumma innī aʿūdhu bika min waʿthā'is-safar, wa kābatil-manẓar, wa sū'il-munqabali fil-māli wal-ahli.",
    translation:
      "O Allah, we ask You on this journey for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and shorten its distance. O Allah, You are the Companion on the journey and the Successor over the family. O Allah, I seek refuge in You from the hardships of travel, from having a bad appearance, and from bad outcomes in wealth and family.",
    reference: "Muslim",
  },
  {
    id: "travel-return",
    icon: Plane,
    categories: ["travel", "gratitude"],
    titleAr: "دعاء العودة من السفر",
    titleEn: "Returning from Travel",
    arabic: "آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ",
    transliteration: "Āyibūn, tā'ibūn, ʿābidūn, li-rabbinā ḥāmidūn.",
    translation: "We return, repentant, worshipping, and praising our Lord.",
    reference: "Muslim",
  },

  // Protection & General
  {
    id: "protection-words",
    icon: Shield,
    categories: ["protection", "general"],
    titleAr: "الاستعاذة",
    titleEn: "Seeking Protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "Aʿūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He created.",
    reference: "Muslim",
  },
  {
    id: "protection-words-2",
    icon: Shield,
    categories: ["protection", "general"],
    titleAr: "الاستعاذة الثانية",
    titleEn: "Seeking Protection 2",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ",
    transliteration:
      "Aʿūdhu bikalimātillāhit-tāmmati min ghaḍabihi wa ʿiqābih, wa sharri ʿibādih, wa min hamazātish-shayāṭīni wa an yaḥḍurūn.",
    translation:
      "I seek refuge in the perfect words of Allah from His wrath and punishment, from the evil of His servants, and from the whisperings of devils and their presence.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: "protection-words-3",
    icon: Shield,
    categories: ["protection", "general"],
    titleAr: "الاستعاذة الثالثة",
    titleEn: "Seeking Protection 3",
    arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "Aʿūdhu billāhis-samīʿil-ʿalīmi minash-shayṭānir-rajīm.",
    translation: "I seek refuge in Allah, the All-Hearing, the All-Knowing, from the accursed Satan.",
    reference: "Quran 41:36",
  },
  {
    id: "calamity",
    icon: Info,
    categories: ["calamity", "protection", "patience"],
    titleAr: "عند المصيبة",
    titleEn: "When Afflicted",
    arabic: "إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    transliteration: "Innā lillāhi wa innā ilayhi rājiʿūn.",
    translation: "Surely we belong to Allah and to Him we shall return.",
    reference: "Qur'an 2:156",
  },
  {
    id: "calamity-2",
    icon: Info,
    categories: ["calamity", "protection", "patience"],
    titleAr: "عند المصيبة الثانية",
    titleEn: "When Afflicted 2",
    arabic: "اللَّهُمَّ أَجِرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
    transliteration: "Allāhumma ajirnī fī muṣībatī wa akhlif lī khayran minhā.",
    translation: "O Allah, reward me in my affliction and compensate me with something better.",
    reference: "Muslim",
  },

  // Knowledge / Study
  {
    id: "knowledge",
    icon: BookOpen,
    categories: ["knowledge", "study", "guidance"],
    titleAr: "طلب العلم",
    titleEn: "Seeking Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidnī ʿilmā.",
    translation: "My Lord, increase me in knowledge.",
    reference: "Qur'an 20:114",
  },
  {
    id: "knowledge-2",
    icon: BookOpen,
    categories: ["knowledge", "study", "guidance"],
    titleAr: "طلب العلم الثاني",
    titleEn: "Seeking Knowledge 2",
    arabic:
      "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا، الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ، وَأَعُوذُ بِاللَّهِ مِنْ حَالِ أَهْلِ النَّارِ",
    transliteration:
      "Allāhumma nfaʿnī bimā ʿallamtanī, wa ʿallimnī mā yanfaʿunī, wa zidnī ʿilmā, al-ḥamdu lillāhi ʿalā kulli ḥālin, wa aʿūdhu billāhi min ḥāli ahlin-nār.",
    translation:
      "O Allah, benefit me with what You have taught me, and teach me what will benefit me, and increase me in knowledge. Praise is to Allah in all circumstances, and I seek refuge in Allah from the condition of the people of the Fire.",
    reference: "Ibn Majah",
  },
  {
    id: "study",
    icon: BookOpen,
    categories: ["study", "knowledge", "guidance"],
    titleAr: "دعاء قبل الدراسة",
    titleEn: "Before Studying",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْتَوْدِعُكَ مَا عَلَّمْتَنِيهِ فَارْدُدْهُ إِلَيَّ عِنْدَ حَاجَتِي إِلَيْهِ وَلَا تَنْسَنِيهِ يَا رَبَّ الْعَالَمِينَ",
    transliteration:
      "Allāhumma innī astawdiʿuka mā ʿallamtanīhi fardudhu ilayya ʿinda ḥājatī ilayhi wa lā tansanīhi yā rabbal-ʿālamīn.",
    translation:
      "O Allah, I entrust to You what You have taught me, so return it to me when I need it, and do not make me forget it, O Lord of the worlds.",
    reference: "Hisnul Muslim",
  },

  // Forgiveness / Repentance / Patience
  {
    id: "sayyidul-istighfar",
    icon: Sparkles,
    categories: ["forgiveness", "repentance", "general"],
    titleAr: "سيد الاستغفار",
    titleEn: "Master of Seeking Forgiveness",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي، لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ... (النص الكامل معروف)",
    transliteration: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī wa anā ʿabduka ...",
    translation: "O Allah, You are my Lord; none has the right to be worshipped but You... (abridged).",
    reference: "Bukhari",
  },
  {
    id: "forgiveness-1",
    icon: Sparkles,
    categories: ["forgiveness", "repentance", "general"],
    titleAr: "دعاء الاستغفار الأول",
    titleEn: "Seeking Forgiveness 1",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ، الْحَيَّ الْقَيُّومَ، وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullāhal-ʿaẓīmalladhī lā ilāha illā huwa, al-ḥayyal-qayyūm, wa atūbu ilayh.",
    translation:
      "I seek forgiveness from Allah the Mighty, besides whom there is none worthy of worship, the Ever-Living, the Sustainer, and I turn to Him in repentance.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: "forgiveness-2",
    icon: Sparkles,
    categories: ["forgiveness", "repentance", "general"],
    titleAr: "دعاء الاستغفار الثاني",
    titleEn: "Seeking Forgiveness 2",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn.",
    translation:
      "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will be among the losers.",
    reference: "Quran 7:23",
  },
  {
    id: "forgiveness-3",
    icon: Sparkles,
    categories: ["forgiveness", "repentance", "general"],
    titleAr: "دعاء الاستغفار الثالث",
    titleEn: "Seeking Forgiveness 3",
    arabic:
      "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",
    transliteration:
      "Allāhumma ighfir lī dhanbī kullahu, diqqahu wa jillahu, wa awwalahu wa ākhirahu, wa ʿalāniyatahu wa sirrahu.",
    translation:
      "O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the hidden.",
    reference: "Muslim",
  },
  {
    id: "repentance-1",
    icon: Sparkles,
    categories: ["repentance", "forgiveness", "general"],
    titleAr: "دعاء التوبة الأول",
    titleEn: "Repentance 1",
    arabic: "أَتُوبُ إِلَى اللَّهِ",
    transliteration: "Atūbu ilallāh.",
    translation: "I turn to Allah in repentance.",
    reference: "Tirmidhi",
    repeat: 100,
  },
  {
    id: "repentance-2",
    icon: Sparkles,
    categories: ["repentance", "forgiveness", "general"],
    titleAr: "دعاء التوبة الثاني",
    titleEn: "Repentance 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَتُوبُ إِلَيْكَ مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمْدًا أَوْ خَطَأً، سِرًّا أَوْ عَلَانِيَةً، وَأَتُوبُ إِلَيْكَ مِنَ الذُّنُوبِ الَّتِي أَنْتَ أَعْلَمُ بِهَا مِنِّي",
    transliteration:
      "Allāhumma innī atūbu ilayka min kulli dhanbin adhanbtuhu ʿamdan aw khaṭan, sirran aw ʿalāniyatan, wa atūbu ilayka minadh-dhunūbi allatī anta aʿlamu bihā minnī.",
    translation:
      "O Allah, I turn to You in repentance from every sin I have committed, intentionally or unintentionally, secretly or openly, and I turn to You from the sins that You know better than I do.",
    reference: "Hisnul Muslim",
  },
  {
    id: "patience-dua",
    icon: AlarmClock,
    categories: ["patience", "general"],
    titleAr: "طلب الصبر",
    titleEn: "Asking for Patience",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا",
    transliteration: "Rabbana afrigh ʿalaynā ṣabrā.",
    translation: "Our Lord, pour upon us patience.",
    reference: "Qur'an 2:250",
  },
  {
    id: "patience-dua-2",
    icon: AlarmClock,
    categories: ["patience", "general"],
    titleAr: "طلب الصبر الثاني",
    titleEn: "Asking for Patience 2",
    arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا",
    transliteration: "Rabbana lā tu'ākhidhnā in nasīnā aw akhta'nā.",
    translation: "Our Lord, do not impose blame upon us if we forget or make a mistake.",
    reference: "Quran 2:286",
  },

  // Parents / Marriage / Mercy / Character
  {
    id: "parents",
    icon: Users,
    categories: ["parents", "mercy", "character"],
    titleAr: "للْوَالِدَيْن",
    titleEn: "For Parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbi rḥamhumā kamā rabbayānī ṣaghīrā.",
    translation: "My Lord, have mercy upon them as they brought me up when I was small.",
    reference: "Qur'an 17:24",
  },
  {
    id: "parents-2",
    icon: Users,
    categories: ["parents", "mercy", "character"],
    titleAr: "دعاء للوالدين الثاني",
    titleEn: "For Parents 2",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration: "Rabbighfir lī wa liwālidayya wal-lil-mu'minīna yawma yaqūm-ul-ḥisāb.",
    translation: "My Lord, forgive me and my parents and the believers on the Day the account is established.",
    reference: "Quran 14:41",
  },
  {
    id: "spouse-love",
    icon: Heart,
    categories: ["marriage", "mercy", "character"],
    titleAr: "مودة ورحمة",
    titleEn: "Affection & Mercy",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
    transliteration: "Rabbana hab lanā min azwājinā wa dhurriyyātinā qurrata aʿyun.",
    translation: "Our Lord, grant us from our spouses and offspring comfort to our eyes.",
    reference: "Qur'an 25:74",
  },
  {
    id: "marriage-1",
    icon: Heart,
    categories: ["marriage", "guidance"],
    titleAr: "دعاء للمتزوج",
    titleEn: "For the Newly Married",
    arabic: "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    transliteration: "Bārakallāhu laka, wa bāraka ʿalayka, wa jamaʿa baynakumā fī khayr.",
    translation: "May Allah bless you, and shower His blessings upon you, and unite you both in goodness.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: "marriage-2",
    icon: Heart,
    categories: ["marriage", "guidance"],
    titleAr: "دعاء عند ليلة الزفاف",
    titleEn: "On Wedding Night",
    arabic: "اللَّهُمَّ بَارِكْ لِي فِي أَهْلِي وَبَارِكْ لَهُمْ فِيَّ",
    transliteration: "Allāhumma bārik lī fī ahlī wa bārik lahum fīya.",
    translation: "O Allah, bless my family for me and bless me for them.",
    reference: "Ibn Majah",
  },
  {
    id: "character-1",
    icon: Handshake,
    categories: ["character", "mercy", "general"],
    titleAr: "حسن الخلق",
    titleEn: "Good Character",
    arabic: "اللَّهُمَّ أَحْسِنْ خُلُقِي",
    transliteration: "Allāhumma aḥsin khuluqī.",
    translation: "O Allah, improve my character.",
    reference: "Hisnul Muslim",
  },
  {
    id: "character-2",
    icon: Handshake,
    categories: ["character", "mercy", "general"],
    titleAr: "دعاء حسن الخلق الثاني",
    titleEn: "Good Character 2",
    arabic:
      "اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ، وَاصْرِفْ عَنِّي سَيِّئَهَا لَا يَصْرِفُ عَنِّي سَيِّئَهَا إِلَّا أَنْتَ",
    transliteration:
      "Allāhumma hdinī li-aḥsani-l-akhlāq lā yahdī li-aḥsanihā illā anta, wa ṣrif ʿannī sayyi'ahā lā yaṣrifu ʿannī sayyi'ahā illā anta.",
    translation:
      "O Allah, guide me to the best of manners, for none can guide to the best of them except You, and turn away from me evil manners, for none can turn away evil manners from me except You.",
    reference: "Muslim",
  },

  // Rizq / Work
  {
    id: "rizq",
    icon: Coins,
    categories: ["rizq", "work", "gratitude"],
    titleAr: "طلب الرزق",
    titleEn: "Provision",
    arabic: "اللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration: "Allāhumma ikfinī bi-ḥalālika ʿan ḥarāmik, wa aghninī bi-faḍlika ʿamman siwāk.",
    translation:
      "O Allah, suffice me with what You made lawful over what You made unlawful, and enrich me by Your bounty from all others.",
    reference: "Tirmidhi",
  },
  {
    id: "rizq-2",
    icon: Coins,
    categories: ["rizq", "work", "gratitude"],
    titleAr: "طلب الرزق الثاني",
    titleEn: "Provision 2",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ فَإِنَّهُ لَا يَمْلِكُهَا إِلَّا أَنْتَ",
    transliteration: "Allāhumma innī as'aluka min faḍlika wa raḥmatika fa innahu lā yamlikuhā illā anta.",
    translation: "O Allah, I ask You for Your bounty and mercy, for none possesses them except You.",
    reference: "Hisnul Muslim",
  },
  {
    id: "rizq-3",
    icon: Coins,
    categories: ["rizq", "work", "gratitude"],
    titleAr: "طلب الرزق الثالث",
    titleEn: "Provision 3",
    arabic:
      "اللَّهُمَّ بَارِكْ لِي فِي رِزْقِي وَلَا تَجْعَلْ لِي فِي شَيْءٍ مِنْهُ حَاجَةً إِلَى أَحَدٍ مِنْ خَلْقِكَ",
    transliteration: "Allāhumma bārik lī fī rizqī wa lā tajʿal lī fī shay'in minhu ḥājatan ilā aḥadin min khalqik.",
    translation: "O Allah, bless my provision and do not make me in need of any of Your creation for any part of it.",
    reference: "Hisnul Muslim",
  },
  {
    id: "work-ease",
    icon: Briefcase,
    categories: ["work", "guidance"],
    titleAr: "تيسير الأمور",
    titleEn: "Ease in Affairs",
    arabic: "رَبِّ يَسِّرْ وَلَا تُعَسِّرْ، وَتَمِّمْ بِالْخَيْرِ",
    transliteration: "Rabbi yassir wa lā tuʿassir, wa tammim bil-khayr.",
    translation: "My Lord, make it easy and do not make it difficult; complete it with goodness.",
    reference: "Duʿāʾ mashhūr",
  },
  {
    id: "work-1",
    icon: Briefcase,
    categories: ["work", "guidance"],
    titleAr: "دعاء عند بدء العمل",
    titleEn: "Starting Work",
    arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Bismillāh, Allāhumma innī as'aluka min faḍlik.",
    translation: "In the name of Allah, O Allah, I ask You for Your bounty.",
    reference: "Hisnul Muslim",
  },
  {
    id: "work-2",
    icon: Briefcase,
    categories: ["work", "guidance"],
    titleAr: "دعاء عند الانتهاء من العمل",
    titleEn: "Finishing Work",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
    transliteration: "Al-ḥamdu lillāhil-ladhī bi niʿmatihī tatimmuṣ-ṣāliḥāt.",
    translation: "Praise is to Allah by whose grace good deeds are completed.",
    reference: "Hisnul Muslim",
  },

  // Anxiety / Health / Illness / Visiting sick
  {
    id: "anxiety",
    icon: Gauge,
    categories: ["anxiety", "guidance", "protection"],
    titleAr: "ذهاب الهمّ",
    titleEn: "Removal of Worry",
    arabic: "اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ...",
    transliteration: "Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wa aʿūdhu bika minal-ʿajzi wal-kasal...",
    translation: "O Allah, I seek refuge in You from worry and grief, and from incapacity and laziness...",
    reference: "Bukhari",
  },
  {
    id: "anxiety-2",
    icon: Gauge,
    categories: ["anxiety", "guidance", "protection"],
    titleAr: "ذهاب الهمّ الثاني",
    titleEn: "Removal of Worry 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allāhumma innī aʿūdhu bika minal-hammi wal-ḥuzni, wal-ʿajzi wal-kasali, wal-jubni wal-bukhli, wa ḍalaʿid-dayni wa ghalabatir-rijāl.",
    translation:
      "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from being overwhelmed by debt and from being overpowered by men.",
    reference: "Bukhari",
  },
  {
    id: "anxiety-3",
    icon: Gauge,
    categories: ["anxiety", "guidance", "protection"],
    titleAr: "ذهاب الهمّ الثالث",
    titleEn: "Removal of Worry 3",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Ḥasbiyallāhu lā ilāha illā huwa, ʿalayhi tawakkaltu wa huwa rabbul-ʿarshil-ʿaẓīm.",
    translation:
      "Allah is sufficient for me. There is none worthy of worship except Him. I have placed my trust in Him, and He is the Lord of the Mighty Throne.",
    reference: "Quran 9:129",
    repeat: 7,
  },
  {
    id: "illness",
    icon: Hospital,
    categories: ["illness", "health", "mercy"],
    titleAr: "دعاء المريض",
    titleEn: "For the Sick",
    arabic: "اللّٰهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي...",
    transliteration: "Allāhumma rabba-nnās, adhhibil-baʾs, ishfi anta-sh-Shāfī...",
    translation: "O Allah, Lord of the people, remove the harm; heal, for You are the Healer...",
    reference: "Bukhari; Muslim",
  },
  {
    id: "illness-2",
    icon: Hospital,
    categories: ["illness", "health", "mercy"],
    titleAr: "دعاء المريض الثاني",
    titleEn: "For the Sick 2",
    arabic: "اللَّهُمَّ اشْفِهِ شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration: "Allāhumma shfih shifā'an lā yughādiru saqaman.",
    translation: "O Allah, heal him with a healing that leaves no illness.",
    reference: "Bukhari",
  },
  {
    id: "illness-3",
    icon: Hospital,
    categories: ["illness", "health", "mercy"],
    titleAr: "دعاء المريض الثالث",
    titleEn: "For the Sick 3",
    arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
    transliteration: "As'alullāhal-ʿaẓīma rabba-l-ʿarshil-ʿaẓīmi an yashfīyak.",
    translation: "I ask Allah the Mighty, Lord of the Mighty Throne, to heal you.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: "visiting-sick",
    icon: MessageSquareHeart,
    categories: ["visiting_sick", "mercy"],
    titleAr: "عند عيادة المريض",
    titleEn: "When Visiting the Sick",
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
    transliteration: "Lā baʾsa ṭahūrun in shāʾa Allāh.",
    translation: "No harm; it is purification, if Allah wills.",
    reference: "Bukhari",
  },
  {
    id: "visiting-sick-2",
    icon: MessageSquareHeart,
    categories: ["visiting_sick", "mercy"],
    titleAr: "دعاء للمريض عند زيارته",
    titleEn: "Dua for the Sick During Visit",
    arabic: "اللَّهُمَّ أَذْهِبِ الْهَمَّ، وَاشْفِ السَّقَمَ، وَارْحَمْ رَحْمَتَكَ",
    transliteration: "Allāhumma adhhibil-hamma, washfis-saqama, warḥam raḥmatak.",
    translation: "O Allah, remove the worry, heal the affliction, and have mercy on Your mercy.",
    reference: "Hisnul Muslim",
  },
  {
    id: "health-1",
    icon: Hospital,
    categories: ["health", "gratitude", "protection"],
    titleAr: "دعاء للصحة",
    titleEn: "For Health",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    transliteration: "Allāhumma ʿāfinī fī badanī, Allāhumma ʿāfinī fī samʿī, Allāhumma ʿāfinī fī baṣarī.",
    translation:
      "O Allah, grant me well-being in my body, O Allah, grant me well-being in my hearing, O Allah, grant me well-being in my sight.",
    reference: "Abu Dawud",
  },
  {
    id: "health-2",
    icon: Hospital,
    categories: ["health", "gratitude", "protection"],
    titleAr: "دعاء للصحة الثاني",
    titleEn: "For Health 2",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allāhumma innī as'alukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah.",
    translation: "O Allah, I ask You for pardon and well-being in this life and the next.",
    reference: "Tirmidhi",
  },

  // Rain / Weather
  {
    id: "rain-dua",
    icon: CloudRain,
    categories: ["rain", "mercy"],
    titleAr: "عند نزول المطر",
    titleEn: "When it Rains",
    arabic: "اللّٰهُمَّ صَيِّبًا نَافِعًا",
    transliteration: "Allāhumma ṣayiban nāfiʿā.",
    translation: "O Allah, let it be a beneficial rain.",
    reference: "Bukhari",
  },
  {
    id: "rain-dua-2",
    icon: CloudRain,
    categories: ["rain", "mercy"],
    titleAr: "عند سماع الرعد",
    titleEn: "When Hearing Thunder",
    arabic: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",
    transliteration: "Subḥānal-ladhī yusabbiḥur-raʿdu biḥamdihi wal-malā'ikatu min khīfatih.",
    translation: "Glory is to Him, whom thunder glorifies with His praise, and the angels from fear of Him.",
    reference: "Malik, Tirmidhi",
  },
  {
    id: "rain-dua-3",
    icon: CloudRain,
    categories: ["rain", "mercy"],
    titleAr: "دعاء الاستسقاء",
    titleEn: "Prayer for Rain",
    arabic: "اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا",
    transliteration: "Allāhumma aghithnā, Allāhumma aghithnā, Allāhumma aghithnā.",
    translation: "O Allah, give us rain, O Allah, give us rain, O Allah, give us rain.",
    reference: "Bukhari, Muslim",
  },

  // Istikhara
  {
    id: "istikhara",
    icon: Heart,
    categories: ["istikhara", "guidance"],
    titleAr: "دعاء الاستخارة",
    titleEn: "Istikhara (Seeking Guidance)",
    arabic: "اللّٰهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ...",
    transliteration: "Allāhumma innī astakhīruka bi-ʿilmik, wa astaqdiruka bi-qudratik...",
    translation: "O Allah, I seek Your guidance through Your knowledge and seek ability through Your power...",
    reference: "Bukhari",
  },

  // Wudu / Salah / Graveyard / Meeting
  {
    id: "after-wudu",
    icon: Droplet,
    categories: ["wudu", "salah", "protection"],
    titleAr: "بعد الوضوء",
    titleEn: "After Wudu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ashhadu an lā ilāha illā Allāhu waḥdahu lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhu wa rasūluh.",
    translation:
      "I bear witness that none has the right to be worshipped but Allah, alone with no partner; and I bear witness that Muhammad is His servant and Messenger.",
    reference: "Muslim",
  },
  {
    id: "after-wudu-2",
    icon: Droplet,
    categories: ["wudu", "salah", "protection"],
    titleAr: "دعاء بعد الوضوء الثاني",
    titleEn: "After Wudu 2",
    arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    transliteration: "Allāhumma ijʿalnī minat-tawwabīn, wajʿalnī minal-mutaṭahhirīn.",
    translation: "O Allah, make me of those who repent and make me of those who purify themselves.",
    reference: "Tirmidhi",
  },
  {
    id: "before-wudu",
    icon: Droplet,
    categories: ["wudu", "salah"],
    titleAr: "قبل الوضوء",
    titleEn: "Before Wudu",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillāh.",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: "salah-start",
    icon: Landmark,
    categories: ["salah", "guidance"],
    titleAr: "افتتاح الصلاة",
    titleEn: "Opening Prayer",
    arabic:
      "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ",
    transliteration:
      "Allāhumma bāʿid baynī wa bayna khaṭāyāya kamā bāʿadta baynal-mashriqi wal-maghrib, Allāhumma naqqinī minal-khaṭāyā kamā yunaqqath-thawbul-abyaḍu minad-danas, Allāhummaghsil khaṭāyāya bil-mā'ith-thalji wal-barad.",
    translation:
      "O Allah, distance me from my sins as You have distanced the east from the west. O Allah, cleanse me of my sins as a white garment is cleansed of dirt. O Allah, wash away my sins with water, snow and hail.",
    reference: "Bukhari, Muslim",
  },
  {
    id: "salah-end",
    icon: Landmark,
    categories: ["salah", "gratitude"],
    titleAr: "بعد الصلاة",
    titleEn: "After Prayer",
    arabic:
      "أَسْتَغْفِرُ اللَّهَ (ثَلَاثًا)، اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration:
      "Astagfirullāh (thalāthan), Allāhumma antas-salām, wa minkas-salām, tabārakta yā dhā-l-jalāli wal-ikrām.",
    translation:
      "I seek forgiveness from Allah (three times), O Allah, You are Peace and from You comes peace, blessed are You, O Possessor of majesty and honor.",
    reference: "Muslim",
  },
  {
    id: "enter-graveyard",
    icon: Landmark,
    categories: ["graveyard", "mercy"],
    titleAr: "دخول المقابر",
    titleEn: "Entering the Graveyard",
    arabic: "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ...",
    transliteration: "As-salāmu ʿalaykum ahla-d-diyāri minal-muʾminīna wal-muslimīn...",
    translation: "Peace be upon you, O inhabitants of the dwellings from the believers and Muslims...",
    reference: "Muslim",
  },
  {
    id: "graveyard-dua",
    icon: Landmark,
    categories: ["graveyard", "mercy"],
    titleAr: "دعاء في المقابر",
    titleEn: "Dua in the Graveyard",
    arabic: "اللَّهُمَّ اغْفِرْ لِأَهْلِ الْقُبُورِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ",
    transliteration: "Allāhumma ighfir li-ahli-l-qubūril-mu'minīna wal-mu'mināt, wal-muslimīna wal-muslimāt.",
    translation: "O Allah, forgive the believing men and women, and the Muslim men and women of the graves.",
    reference: "Hisnul Muslim",
  },
  {
    id: "meeting-speech",
    icon: MessageSquareHeart,
    categories: ["meeting", "character", "guidance"],
    titleAr: "افتتاح الكلام",
    titleEn: "Opening Speech",
    arabic: "الْحَمْدُ لِلّٰهِ، نَحْمَدُهُ وَنَسْتَعِينُهُ... (خطبة الحاجة المختصرة)",
    transliteration: "Al-ḥamdu lillāh, naḥmaduhu wa nastaʿīnu... (khuṭbat al-ḥājah abridged)",
    translation: "All praise is for Allah; we praise Him and seek His help... (abridged).",
    reference: "Abu Dawud",
  },
  {
    id: "meeting-dua",
    icon: MessageSquareHeart,
    categories: ["meeting", "character", "guidance"],
    titleAr: "دعاء المجلس",
    titleEn: "Gathering Dua",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār.",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "Quran 2:201",
  },
  {
    id: "meeting-end",
    icon: MessageSquareHeart,
    categories: ["meeting", "character", "guidance"],
    titleAr: "ختام المجلس",
    titleEn: "Closing a Gathering",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    transliteration: "Subḥānakallāhumma wa biḥamdik, ashhadu an lā ilāha illā anta, astaghfiruka wa atūbu ilayk.",
    translation:
      "Glory is to You, O Allah, and praise. I bear witness that there is none worthy of worship but You. I seek Your forgiveness and turn to You in repentance.",
    reference: "Abu Dawud, Tirmidhi",
  },

  // Debt / Financial
  {
    id: "debt-dua",
    icon: Coins,
    categories: ["debt", "rizq", "guidance"],
    titleAr: "دعاء الدين",
    titleEn: "For Debt",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration: "Allāhumma ikfinī biḥalālika ʿan ḥarāmik, wa aghninī bi-faḍlika ʿamman siwāk.",
    translation:
      "O Allah, suffice me with what You have made lawful over what You have made unlawful, and enrich me by Your bounty over all others.",
    reference: "Tirmidhi",
  },
  {
    id: "debt-dua-2",
    icon: Coins,
    categories: ["debt", "rizq", "guidance"],
    titleAr: "دعاء الدين الثاني",
    titleEn: "For Debt 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allāhumma innī aʿūdhu bika minal-hammi wal-ḥuzni, wal-ʿajzi wal-kasali, wal-bukhli wal-jubni, wa ḍalaʿid-dayni wa ghalabatir-rijāl.",
    translation:
      "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from being overwhelmed by debt and from being overpowered by men.",
    reference: "Bukhari",
  },
  {
    id: "debt-dua-3",
    icon: Coins,
    categories: ["debt", "rizq", "guidance"],
    titleAr: "دعاء الدين الثالث",
    titleEn: "For Debt 3",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي",
    transliteration: "Allāhumma innī as'alukal-ʿafwa wal-ʿāfiyata fī dīnī wa dunyāya wa ahlī wa mālī.",
    translation:
      "O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth.",
    reference: "Abu Dawud",
  },

  // Gratitude
  {
    id: "gratitude-dua",
    icon: CheckCircle2,
    categories: ["gratitude", "general"],
    titleAr: "دعاء الشكر",
    titleEn: "Gratitude Dua",
    arabic:
      "اللَّهُمَّ لَكَ الْحَمْدُ كُلُّهُ، اللَّهُمَّ لَا قَابِضَ لِمَا بَسَطْتَ، وَلَا بَاسِطَ لِمَا قَبَضْتَ، وَلَا هَادِيَ لِمَنْ أَضْلَلْتَ، وَلَا مُضِلَّ لِمَنْ هَدَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا مَانِعَ لِمَا أَعْطَيْتَ، اللَّهُمَّ لَكَ الْحَمْدُ عَلَى كُلِّ حَالٍ",
    transliteration:
      "Allāhumma lakal-ḥamdu kulluh, Allāhumma lā qābiḍa limā basaṭta, wa lā bāsiṭa limā qabaḍta, wa lā hādiya liman aḍlalta, wa lā muḍilla liman hadayta, wa lā muʿṭiya limā manaʿta, wa lā māniʿa limā aʿṭayta, Allāhumma lakal-ḥamdu ʿalā kulli ḥāl.",
    translation:
      "O Allah, all praise is Yours. O Allah, there is none who can withhold what You give, and none can give what You withhold, and no wealth or fortune can benefit anyone against Your will. O Allah, all praise is Yours in every condition.",
    reference: "Ibn Majah",
  },
  {
    id: "gratitude-dua-2",
    icon: CheckCircle2,
    categories: ["gratitude", "general"],
    titleAr: "دعاء الشكر الثاني",
    titleEn: "Gratitude Dua 2",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
    transliteration: "Al-ḥamdu lillāhil-ladhī bi niʿmatihī tatimmuṣ-ṣāliḥāt.",
    translation: "Praise is to Allah by whose grace good deeds are completed.",
    reference: "Hisnul Muslim",
  },
  {
    id: "gratitude-dua-3",
    icon: CheckCircle2,
    categories: ["gratitude", "general"],
    titleAr: "دعاء الشكر الثالث",
    titleEn: "Gratitude Dua 3",
    arabic:
      "اللَّهُمَّ لَكَ الْحَمْدُ شُكْرًا لَكَ، وَمَعْذِرَةً إِلَيْكَ، وَمَعْصِيَةً لَكَ، وَتَوْبَةً لَكَ، وَصَبْرًا لَكَ، وَرِضًا بِقَضَائِكَ، وَذُلًّا لَكَ، وَعُزًّا بِكَ، وَتَوَكُّلًا عَلَيْكَ",
    transliteration:
      "Allāhumma lakal-ḥamdu shukran laka, wa maʿdhiratan ilayka, wa maʿṣiyatan laka, wa tawbatan laka, wa ṣabran laka, wa riḍan bi-qaḍā'ika, wa dhullan laka, wa ʿuzzan bika, wa tawakkulan ʿalayka.",
    translation:
      "O Allah, to You is all praise as gratitude to You, as an apology to You, as a disobedience to You, as a repentance to You, as patience for You, as contentment with Your decree, as humility to You, as honor through You, and as reliance upon You.",
    reference: "Hisnul Muslim",
  },

  // Guidance
  {
    id: "guidance-dua",
    icon: Compass,
    categories: ["guidance", "general"],
    titleAr: "دعاء الهداية",
    titleEn: "Guidance Dua",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdināṣ-ṣirāṭal-mustaqīm.",
    translation: "Guide us to the straight path.",
    reference: "Quran 1:6",
  },
  {
    id: "guidance-dua-2",
    icon: Compass,
    categories: ["guidance", "general"],
    titleAr: "دعاء الهداية الثاني",
    titleEn: "Guidance Dua 2",
    arabic:
      "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    transliteration:
      "Rabbana lā tuzigh qulūbanā baʿda idh hadaytanā wa hab lanā min ladunka raḥmatan innaka antal-wahhāb.",
    translation:
      "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
    reference: "Quran 3:8",
  },
  {
    id: "guidance-dua-3",
    icon: Compass,
    categories: ["guidance", "general"],
    titleAr: "دعاء الهداية الثالث",
    titleEn: "Guidance Dua 3",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh ʿalaynā ṣabran wa thabbit aqdāmanā wanṣurnā ʿalal-qawmil-kāfirīn.",
    translation:
      "Our Lord, pour upon us patience and make our feet firm and assist us against the disbelieving people.",
    reference: "Quran 2:250",
  },

  // General
  {
    id: "general-dua-1",
    icon: MapPin,
    categories: ["general", "gratitude"],
    titleAr: "دعاء عام الأول",
    titleEn: "General Dua 1",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    transliteration: "Allāhumma innī as'alukal-hudā wat-tuqā wal-ʿafāf wal-ghinā.",
    translation: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
    reference: "Muslim",
  },
  {
    id: "general-dua-2",
    icon: MapPin,
    categories: ["general", "protection"],
    titleAr: "دعاء عام الثاني",
    titleEn: "General Dua 2",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ",
    transliteration:
      "Allāhumma innī aʿūdhu bika min ʿadhābil-qabr, wa aʿūdhu bika min fitnatil-masīḥid-dajjāl, wa aʿūdhu bika min fitnatil-maḥyā wal-mamāt.",
    translation:
      "O Allah, I seek refuge in You from the punishment of the grave, and I seek refuge in You from the trial of the False Messiah, and I seek refuge in You from the trials of life and death.",
    reference: "Bukhari, Muslim",
  },
  {
    id: "general-dua-3",
    icon: MapPin,
    categories: ["general", "protection"],
    titleAr: "دعاء عام الثالث",
    titleEn: "General Dua 3",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ",
    transliteration:
      "Allāhumma innī aʿūdhu bika min jahdil-balā', wa darakish-shaqā', wa sū'il-qaḍā', wa shāmatatil-aʿdā'.",
    translation:
      "O Allah, I seek refuge in You from the severity of calamity, from overwhelming misery, from an evil decree, and from the rejoicing of enemies.",
    reference: "Bukhari",
  },
  {
    id: "general-dua-4",
    icon: MapPin,
    categories: ["general", "protection"],
    titleAr: "دعاء عام الرابع",
    titleEn: "General Dua 4",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    transliteration: "Allāhumma innī as'alukal-jannah wa aʿūdhu bika minan-nār.",
    translation: "O Allah, I ask You for Paradise and I seek refuge in You from the Fire.",
    reference: "Abu Dawud",
  },
  {
    id: "general-dua-5",
    icon: MapPin,
    categories: ["general", "protection"],
    titleAr: "دعاء عام الخامس",
    titleEn: "General Dua 5",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allāhumma innī as'aluka ʿilman nāfiʿan, wa rizqan ṭayyiban, wa ʿamalan mutaqabbalan.",
    translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
    reference: "Ibn Majah",
  },
  {
    id: "general-dua-6",
    icon: MapPin,
    categories: ["general", "protection"],
    titleAr: "دعاء عام السادس",
    titleEn: "General Dua 6",
    arabic:
      "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ",
    transliteration:
      "Allāhumma aṣliḥ lī dīnī alladhī huwa ʿiṣmatu amrī, wa aṣliḥ lī dunyāya allatī fīhā maʿāshī, wa aṣliḥ lī ākhiratī allatī fīhā maʿādī, wajʿalil-ḥayāta ziyādatan lī fī kulli khayr, wajʿalil-mawta rāḥatan lī min kulli sharr.",
    translation:
      "O Allah, rectify my religion which is the safeguard of my affairs, rectify my worldly affairs wherein is my livelihood, and rectify my Hereafter wherein is my return. Make life for me an increase in all good, and make death for me a relief from all evil.",
    reference: "Muslim",
  },
];

/* ----------------------------------------------------------------
   Component
------------------------------------------------------------------*/
const Duas: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [bookmarkedDuas, setBookmarkedDuas] = useState<Set<string>>(new Set());

  const [category, setCategory] = useState<CategoryKey>("all");
  const [query, setQuery] = useState("");
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  // HARD-FIX: stop horizontal scroll/blank right space on mobile
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflowX;
    const prevBody = body.style.overflowX;
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";
    return () => {
      html.style.overflowX = prevHtml;
      body.style.overflowX = prevBody;
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;
    const { data } = await supabase.from("dua_bookmarks").select("dua_title").eq("user_id", user.id);
    if (data) setBookmarkedDuas(new Set(data.map((b) => b.dua_title)));
  };

  const toggleBookmark = async (dua: Dua) => {
    if (!user) {
      toast.error(settings.language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please sign in first");
      navigate("/auth");
      return;
    }
    const isBookmarked = bookmarkedDuas.has(dua.titleEn);
    if (isBookmarked) {
      const { error } = await supabase
        .from("dua_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("dua_title", dua.titleEn);
      if (error) return toast.error(settings.language === "ar" ? "فشل الحذف" : "Failed to remove");
      setBookmarkedDuas((prev) => {
        const next = new Set(prev);
        next.delete(dua.titleEn);
        return next;
      });
      toast.success(settings.language === "ar" ? "تم الحذف" : "Bookmark removed");
    } else {
      const { error } = await supabase.from("dua_bookmarks").insert({
        user_id: user.id,
        dua_title: dua.titleEn,
        dua_arabic: dua.arabic,
        dua_transliteration: dua.transliteration || null,
        dua_english: dua.translation,
        category: dua.categories[0] || "general",
      });
      if (error) return toast.error(settings.language === "ar" ? "فشل الحفظ" : "Failed to bookmark");
      setBookmarkedDuas((prev) => new Set(prev).add(dua.titleEn));
      toast.success(settings.language === "ar" ? "تم الحفظ" : "Bookmarked");
    }
  };

  const langIsAr = settings.language === "ar";
  const showTranslit = settings.translationEnabled && settings.translationSource === "transliteration";
  const showTranslation = settings.translationEnabled && settings.translationSource !== "transliteration";
  const t = (en: string, ar: string) => (langIsAr ? ar : en);

  const categoriesInUse: CategoryKey[] = useMemo(() => {
    const base: CategoryKey[] = ["all"];
    const set = new Set<CategoryKey>();
    for (const d of ALL_DUAS) for (const c of d.categories) set.add(c);
    return base.concat([...set].filter((c) => c in CAT_META));
  }, []);

  const filtered = useMemo(() => {
    const byCat = category === "all" ? ALL_DUAS : ALL_DUAS.filter((d) => d.categories.includes(category));
    if (!query.trim()) return byCat;
    const q = query.toLowerCase();
    return byCat.filter((d) => {
      const fields = [d.titleAr, d.titleEn, d.arabic, d.transliteration ?? "", d.translation, d.reference ?? ""]
        .join(" ")
        .toLowerCase();
      return fields.includes(q);
    });
  }, [category, query]);

  const handleCopy = async (dua: Dua) => {
    const textToCopy = langIsAr ? dua.arabic : showTranslit ? dua.transliteration || dua.translation : dua.translation;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(t("Copied", "تم النسخ"));
    } catch {
      toast.error(t("Copy failed", "فشل النسخ"));
    }
  };

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
  };

  /* ---------------------- Detail “page” ---------------------- */
  if (selectedDua) {
    const Icon = selectedDua.icon || FALLBACK_ICON;
    return (
      <div
        className="relative min-h-[100dvh] w-full overflow-x-hidden overscroll-x-none touch-pan-y"
        dir={langIsAr ? "rtl" : "ltr"}
      >
        {/* Back to list (local back) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDua(null)}
          className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
          aria-label={t("Back", "رجوع")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[-6rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-40" />
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto pt-20 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {langIsAr ? selectedDua.titleAr : selectedDua.titleEn}
          </h1>
          {selectedDua.reference && (
            <p className="text-sm text-muted-foreground">
              {t("Ref:", "المصدر:")} {selectedDua.reference}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6 pb-24">
          <div className="glass-effect rounded-3xl p-6 border border-border/30 backdrop-blur-xl">
            <p className={`text-2xl leading-relaxed ${settings.fontType === "quran" ? "font-quran" : ""}`} dir="rtl">
              {selectedDua.arabic}
            </p>

            {showTranslit && selectedDua.transliteration && (
              <p className="mt-4 text-sm text-muted-foreground italic" dir="ltr">
                {selectedDua.transliteration}
              </p>
            )}
            {showTranslation && (
              <p className={`mt-4 text-sm text-muted-foreground ${langIsAr ? "text-right" : ""}`}>
                {selectedDua.translation}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedDua.repeat && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-1">
                  ×{selectedDua.repeat} {t("times", "مرات")}
                </span>
              )}
              {selectedDua.categories.slice(0, 3).map((c) => {
                if (c === "all" || !(c in CAT_META)) return null;
                return (
                  <span key={c} className="inline-flex items-center rounded-full bg-muted text-xs px-2 py-1">
                    {t(CAT_META[c].labelEn, CAT_META[c].labelAr)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Actions – ICON ONLY */}
          <div className={`flex ${langIsAr ? "justify-start" : "justify-end"} gap-2`}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => toggleBookmark(selectedDua)}
              title={bookmarkedDuas.has(selectedDua.titleEn) ? t("Remove bookmark", "إزالة الإشارة") : t("Bookmark", "حفظ")}
              aria-label={bookmarkedDuas.has(selectedDua.titleEn) ? t("Remove bookmark", "إزالة الإشارة") : t("Bookmark", "حفظ")}
            >
              <Bookmark className={`h-4 w-4 ${bookmarkedDuas.has(selectedDua.titleEn) ? "fill-primary text-primary" : ""}`} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => handleCopy(selectedDua)}
              title={t("Copy", "نسخ")}
              aria-label={t("Copy", "نسخ")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------- List view ---------------------- */
  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden overscroll-x-none touch-pan-y"
      dir={settings.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute right-1/2 translate-x-1/2 bottom-[-7rem] h-80 w-80 rounded-full bg-secondary/20 blur-3xl opacity-40" />
      </div>

      {/* Global back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        aria-label={settings.language === "ar" ? "رجوع" : "Back"}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Hero */}
      <header className="pt-16 md:pt-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            {settings.language === "ar" ? "مكتبة الأدعية والأذكار" : "Dua & Athkar Library"}
          </span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {settings.language === "ar"
            ? "أدعية يومية صحيحة مصمّمة بعناية. تصفّح، وابحث، وانسخ فورًا."
            : "Authentic daily supplications, beautifully organized. Read, search, and copy instantly."}
        </p>
      </header>

      {/* Controls */}
      <section className="mt-8 md:mt-10 px-4">
        <div className="sticky top-16 z-30">
          <div className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-3 md:p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_300px_auto] items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    settings.language === "ar" ? "ابحث عن دعاء بالعربية أو الإنجليزية…" : "Search duas in Arabic or English…"
                  }
                  className="w-full rounded-xl border bg-background px-11 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <Select value={category} onValueChange={(val) => setCategory(val as CategoryKey)}>
                  <SelectTrigger className="w-full rounded-xl h-11 border bg-background">
                    <SelectValue placeholder={settings.language === "ar" ? "اختر التصنيف" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {categoriesInUse.map((key) => {
                      const meta = CAT_META[key];
                      const Icon = meta?.icon || FALLBACK_ICON;
                      return (
                        <SelectItem key={key} value={key} className="flex items-center">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{settings.language === "ar" ? meta.labelAr : meta.labelEn}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset */}
              <div className="flex md:justify-end">
                <Button variant="outline" onClick={resetFilters} className="rounded-xl h-11">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {settings.language === "ar" ? "إعادة الضبط" : "Reset"}
                </Button>
              </div>
            </div>

            <div className="mt-3 text-xs md:text-sm text-muted-foreground">
              {(settings.language === "ar" ? "المعروض" : "Showing") + " " + filtered.length + " " + (settings.language === "ar" ? "دعاء" : "duas")}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="px-4 mt-6 pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center text-muted-foreground bg-background/50 backdrop-blur">
            {settings.language === "ar" ? "لا توجد نتائج. جرّب بحثًا أو تصنيفًا مختلفًا." : "No results. Try a different search or category."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((dua) => {
              const IconComp = dua.icon || FALLBACK_ICON;
              const saved = bookmarkedDuas.has(dua.titleEn);
              return (
                <article
                  key={dua.id}
                  onClick={() => setSelectedDua(dua)}
                  className="group relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-6 shadow-sm transition hover:shadow-md cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow">
                        <IconComp className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="leading-tight">
                        <h3 className="text-base md:text-lg font-semibold">
                          {settings.language === "ar" ? dua.titleAr : dua.titleEn}
                        </h3>
                        {dua.reference && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {settings.language === "ar" ? "المصدر:" : "Ref:"} {dua.reference}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ICON-ONLY actions (stop click bubbling) */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => toggleBookmark(dua)}
                        title={saved ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
                        aria-label={saved ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleCopy(dua)}
                        title={settings.language === "ar" ? "نسخ" : "Copy"}
                        aria-label={settings.language === "ar" ? "نسخ" : "Copy"}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <div className="mt-4">
                    <p className={`text-xl leading-relaxed ${settings.fontType === "quran" ? "font-quran" : ""}`} dir="rtl">
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Transliteration / Translation */}
                  {showTranslit && dua.transliteration && (
                    <p className="mt-3 text-sm text-muted-foreground italic" dir="ltr">
                      {dua.transliteration}
                    </p>
                  )}
                  {showTranslation && (
                    <p className={`mt-3 text-sm text-muted-foreground ${settings.language === "ar" ? "text-right" : ""}`}>
                      {dua.translation}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {dua.repeat && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-1">
                        ×{dua.repeat} {settings.language === "ar" ? "مرات" : "times"}
                      </span>
                    )}
                    {dua.categories.slice(0, 3).map((c) => {
                      if (c === "all" || !(c in CAT_META)) return null;
                      return (
                        <span key={c} className="inline-flex items-center rounded-full bg-muted text-xs px-2 py-1">
                          {settings.language === "ar" ? CAT_META[c].labelAr : CAT_META[c].labelEn}
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Duas;
