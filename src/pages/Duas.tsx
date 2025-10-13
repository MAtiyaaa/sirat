import React, { useMemo, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
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
} from "lucide-react";

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
  icon?: React.ComponentType<any>; // optional, we’ll safely fallback
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
  eating: { labelEn: "Food & Drink", labelAr: "الطعام والشراب", icon: Home }, // we’ll show utensil icon on cards
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

// Safe getters (prevents crashes if something is off)
const FALLBACK_CATEGORY: CategoryKey = "general";
const getCatMeta = (key: CategoryKey) => CAT_META[key] ?? CAT_META[FALLBACK_CATEGORY];
const FallbackIcon = Shield;

/* ----------------------------------------------------------------
   Duas dataset (expanded, categorized)
   Notes: Arabic text uses standard versions; transliterations are concise.
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
    id: "before-eating",
    // icon intentionally omitted to prove safe fallback works
    categories: ["eating", "gratitude"],
    titleAr: "قبل الطعام",
    titleEn: "Before Eating",
    arabic: "بِسْمِ اللّٰهِ",
    transliteration: "Bismillāh.",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: "after-eating",
    icon: Home, // (card icon only; category chip uses CAT_META)
    categories: ["eating", "gratitude"],
    titleAr: "بعد الطعام",
    titleEn: "After Eating",
    arabic: "الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Al-ḥamdu lillāhil-ladhī aṭʿamanā wa saqānā wa jaʿalanā Muslimīn.",
    translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    reference: "Tirmidhi",
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
    id: "visiting-sick",
    icon: MessageSquareHeart,
    categories: ["visiting_sick", "mercy"],
    titleAr: "عند عيادة المريض",
    titleEn: "When Visiting the Sick",
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللّٰهُ",
    transliteration: "Lā baʾsa ṭahūrun in shāʾa Allāh.",
    translation: "No harm; it is purification, if Allah wills.",
    reference: "Bukhari",
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
    id: "meeting-speech",
    icon: MessageSquareHeart,
    categories: ["meeting", "character", "guidance"],
    titleAr: "افتتاح الكلام",
    titleEn: "Opening Speech",
    arabic: "الْحَمْدُ لِلّٰهِ، نَحْمَدُهُ وَنَسْتَعِينُهُ... (خطبة الحاجة المشهورة باختصار)",
    transliteration: "Al-ḥamdu lillāh, naḥmaduhu wa nastaʿīnu... (khuṭbat al-ḥājah abridged)",
    translation: "All praise is for Allah; we praise Him and seek His help... (abridged).",
    reference: "Abu Dawud",
  },
];

/* ----------------------------------------------------------------
   Component
------------------------------------------------------------------*/
const Duas: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [category, setCategory] = useState<CategoryKey>("all");
  const [query, setQuery] = useState("");

  const langIsAr = settings.language === "ar";
  const showTranslit = settings.translationEnabled && settings.translationSource === "transliteration";
  const showTranslation = settings.translationEnabled && settings.translationSource !== "transliteration";

  // Build categories from data, but only keep those that exist in CAT_META
  const categoriesInUse: CategoryKey[] = useMemo(() => {
    const set = new Set<CategoryKey>(["all"]);
    for (const d of ALL_DUAS) {
      for (const c of d.categories) {
        if (CAT_META[c]) set.add(c);
        else console.warn(`[Duas] Unknown category key in a dua: "${c}" — skipping chip.`);
      }
    }
    return Array.from(set);
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

  const t = (en: string, ar: string) => (langIsAr ? ar : en);

  const handleCopy = async (dua: Dua) => {
    const textToCopy = langIsAr ? dua.arabic : showTranslit ? dua.transliteration || dua.translation : dua.translation;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (e) {
      console.warn("[Duas] Clipboard copy failed:", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="text-center space-y-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t("Dua & Athkar", "الأدعية والأذكار")}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t(
            "Authentic daily supplications, neatly organized by moments of your day.",
            "أدعية يومية صحيحة، مصنّفة بعناية حسب لحظات يومك.",
          )}
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search duas, Arabic or English…", "ابحث عن دعاء بالعربية أو الإنجليزية…")}
            className="w-full rounded-2xl border bg-background px-12 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            dir={langIsAr ? "rtl" : "ltr"}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Categories (guarded) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categoriesInUse.map((key) => {
            const meta = getCatMeta(key);
            if (!meta) return null; // extra guard (shouldn’t happen)
            const Icon = meta.icon || CheckCircle2;
            const active = category === key;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                  active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t(meta.labelEn, meta.labelAr)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div className="mt-3 text-sm text-muted-foreground">
        {t("Showing", "المعروض")} {filtered.length} {t("duas", "دعاء")}
      </div>

      {/* Grid of duas */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((dua) => {
          const IconComp = dua.icon || FallbackIcon;
          return (
            <div key={dua.id} className="relative rounded-3xl border bg-card p-6 shadow-sm hover:shadow-md transition">
              {/* Icon + Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <IconComp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="leading-tight">
                    <h3 className="text-base md:text-lg font-semibold">{langIsAr ? dua.titleAr : dua.titleEn}</h3>
                    {dua.reference && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("Ref:", "المصدر:")} {dua.reference}
                      </p>
                    )}
                  </div>
                </div>

                {/* Copy */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleCopy(dua)}
                  title={t("Copy", "نسخ")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("Copy", "نسخ")}
                </Button>
              </div>

              {/* Arabic */}
              <div className="mt-4">
                <p className={`text-xl leading-relaxed ${settings.fontType === "quran" ? "font-quran" : ""}`} dir="rtl">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliteration or Translation per settings */}
              {showTranslit && dua.transliteration && (
                <p className="mt-3 text-sm text-muted-foreground italic">{dua.transliteration}</p>
              )}
              {showTranslation && <p className="mt-3 text-sm text-muted-foreground">{dua.translation}</p>}

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {dua.repeat && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-1">
                    ×{dua.repeat} {t("times", "مرات")}
                  </span>
                )}
                {dua.categories.slice(0, 3).map((c) => {
                  if (c === "all" || !CAT_META[c]) {
                    if (!CAT_META[c]) {
                      console.warn(`[Duas] Badge skip unknown category: "${c}"`);
                    }
                    return null;
                  }
                  return (
                    <span key={c} className="inline-flex items-center rounded-full bg-muted text-xs px-2 py-1">
                      {t(CAT_META[c].labelEn, CAT_META[c].labelAr)}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-8 rounded-2xl border p-5 text-sm text-muted-foreground flex items-start gap-3">
        <ArrowRight className="h-4 w-4 mt-0.5" />
        <p>
          {t(
            "Tip: Use the category chips above or search in Arabic/English. The copy button copies in your current language.",
            "نصيحة: استخدم التصنيفات بالأعلى أو ابحث بالعربية/الإنجليزية. زر النسخ ينسخ باللغة الحالية لديك.",
          )}
        </p>
      </div>
    </div>
  );
};

export default Duas;
