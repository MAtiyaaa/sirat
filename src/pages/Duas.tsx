import React, { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Sun,
  Moon,
  Utensils,
  Home,
  Shield,
  ArrowRight,
  ArrowLeft,
  CircleDot,
  Plane,
  BookOpen,
  Sparkles,
  CloudRain,
  Users,
  Bed,
  BedDouble,
  Droplet,
  Search,
  RefreshCcw,
  FolderOpen,
  Filter,
  Globe,
  Copy,
  Check,
  Bookmark,
  Layers,
  Tags,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ---------- Types ----------
type IconType = React.ElementType;

interface Dua {
  id: number | string;
  icon: IconType | any;
  titleAr: string;
  titleEn: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category?: string; // normalized main category
  subcategory?: string; // normalized subcategory
  tags?: string[];
  ref?: string;
  sourceFile?: string;
  hash?: string;
}

// ---------- Supabase helper (avoid TS deep/never errors for new table) ----------
const sbAny = supabase as any;

// ---------- Icons ----------
const ICONS: Record<string, IconType> = {
  sun: Sun,
  moon: Moon,
  sleep: BedDouble,
  waking: Bed,
  wudu: Droplet,
  food: Utensils,
  home: Home,
  travel: Plane,
  protection: Shield,
  knowledge: BookOpen,
  forgiveness: Sparkles,
  parents: Users,
  rain: CloudRain,
  istikhara: Sparkles,
  default: Sparkles,
};

// ---------- Category normalization ----------

// Curated main categories (in display order)
const MAIN_CATEGORY_ORDER = ["Daily", "Personal", "Life", "General"] as const;
type MainCategory = (typeof MAIN_CATEGORY_ORDER)[number];

// Per-main-category sort order of subcategories
const SUBCATEGORY_ORDER: Record<MainCategory, string[]> = {
  Daily: ["Morning Adhkar", "Evening Adhkar", "After Salah", "Selected Duas", "Daily Dua"],
  Personal: ["Protection", "Forgiveness", "Guidance", "Knowledge", "Family"],
  Life: ["Food", "Home", "Travel", "Sleep / Waking", "Sleep / Before Sleep", "Wudu", "Rain"],
  General: [],
};

const AR_LABELS: Record<string, string> = {
  // main cats
  Daily: "يومي",
  Personal: "شخصي",
  Life: "حياة",
  General: "عام",
  // subcats
  "Morning Adhkar": "أذكار الصباح",
  "Evening Adhkar": "أذكار المساء",
  "After Salah": "أذكار بعد الصلاة",
  "Selected Duas": "أدعية مختارة",
  "Daily Dua": "أدعية يومية",
  Protection: "حفظ",
  Forgiveness: "استغفار",
  Guidance: "استخارة/هداية",
  Knowledge: "علم",
  Family: "الوالدين/الأسرة",
  Food: "طعام",
  Home: "المنزل",
  Travel: "السفر",
  "Sleep / Waking": "الاستيقاظ",
  "Sleep / Before Sleep": "قبل النوم",
  Wudu: "الوضوء",
  Rain: "المطر",
};

// Map GitHub path / raw hints to nice (main, sub) categories
function normalizeCategoryFromPath(
  path: string,
  rawHints: { category?: string; section?: string; group?: string; tags?: string[] },
): { main: MainCategory; sub: string } {
  const p = path.toLowerCase();
  const hints = [rawHints.category, rawHints.section, rawHints.group, ...(rawHints.tags || [])]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());

  const has = (...keys: string[]) => [p, ...hints].some((s) => keys.some((k) => s.includes(k)));

  // Daily collections from repo
  if (has("morning-dhikr", "الصباح", "morning")) return { main: "Daily", sub: "Morning Adhkar" };
  if (has("evening-dhikr", "المساء", "evening")) return { main: "Daily", sub: "Evening Adhkar" };
  if (has("dhikr-after-salah", "بعد الصلاة", "after salah", "adhkar after salah"))
    return { main: "Daily", sub: "After Salah" };
  if (has("daily-dua", "daily dua")) return { main: "Daily", sub: "Daily Dua" };
  if (has("selected-dua", "selected duas")) return { main: "Daily", sub: "Selected Duas" };

  // Life situations
  if (has("food", "eat", "طعام", "أكل")) return { main: "Life", sub: "Food" };
  if (has("home", "house", "منزل")) return { main: "Life", sub: "Home" };
  if (has("travel", "سفر")) return { main: "Life", sub: "Travel" };
  if (has("sleep", "نوم", "before sleep"))
    return { main: "Life", sub: p.includes("before") ? "Sleep / Before Sleep" : "Sleep / Waking" };
  if (has("wudu", "وضوء")) return { main: "Life", sub: "Wudu" };
  if (has("rain", "مطر")) return { main: "Life", sub: "Rain" };

  // Personal / spiritual
  if (has("protection", "حفظ", "عافية", "وقاية")) return { main: "Personal", sub: "Protection" };
  if (has("forgive", "استغفار")) return { main: "Personal", sub: "Forgiveness" };
  if (has("istikhara", "guidance", "استخارة", "هداية")) return { main: "Personal", sub: "Guidance" };
  if (has("knowledge", "علم")) return { main: "Personal", sub: "Knowledge" };
  if (has("parent", "والدين", "family")) return { main: "Personal", sub: "Family" };

  // Fallbacks for noisy folders like `core` etc.
  if (has("core")) return { main: "Daily", sub: "Selected Duas" };

  // Default
  return { main: "General", sub: "Selected Duas" };
}

function displayMain(main: MainCategory, lang: "ar" | "en"): string {
  return lang === "ar" ? (AR_LABELS[main] ?? main) : main;
}

function displaySub(sub: string, lang: "ar" | "en"): string {
  return lang === "ar" ? (AR_LABELS[sub] ?? sub) : sub;
}

// ---------- Utils ----------
const GH_LIST_URL = "https://api.github.com/repos/fitrahive/dua-dhikr/contents/data?ref=main";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function pickIconFromCategory(main?: string, sub?: string): IconType {
  const cat = `${main || ""} ${sub || ""}`.toLowerCase();
  if (cat.includes("morning")) return ICONS.sun;
  if (cat.includes("evening")) return ICONS.moon;
  if (cat.includes("sleep") && cat.includes("before")) return ICONS.sleep;
  if (cat.includes("waking")) return ICONS.waking;
  if (cat.includes("wudu")) return ICONS.wudu;
  if (cat.includes("home")) return ICONS.home;
  if (cat.includes("travel")) return ICONS.travel;
  if (cat.includes("protect")) return ICONS.protection;
  if (cat.includes("knowledge")) return ICONS.knowledge;
  if (cat.includes("parent") || cat.includes("family")) return ICONS.parents;
  if (cat.includes("rain")) return ICONS.rain;
  if (cat.includes("istikhara") || cat.includes("guidance")) return ICONS.istikhara;
  if (cat.includes("food")) return ICONS.food;
  return ICONS.default;
}

function getIconComponent(d: { icon?: any; category?: string; subcategory?: string }): IconType {
  const candidate = d?.icon || pickIconFromCategory(d?.category, d?.subcategory) || ICONS.default;
  if (typeof candidate === "function") return candidate as IconType;
  if (candidate && typeof candidate === "object" && "render" in candidate) return candidate as IconType;
  return ICONS.default;
}

function normalizeDua(raw: any, relPath: string, idx: number): Dua {
  const arabic = raw.arabic ?? raw.dua_arabic ?? raw.dua ?? raw.text ?? "";
  const transliteration = raw.transliteration ?? raw.translit ?? raw.transcription ?? "";
  const translation = raw.translation ?? raw.en ?? raw.meaning ?? "";
  const titleEn =
    raw.titleEn ?? raw.title_en ?? raw.title ?? raw.name ?? raw.topic ?? (raw.tags?.[0] ? String(raw.tags[0]) : "Dua");
  const titleAr = raw.titleAr ?? raw.title_ar ?? raw.title_arabic ?? raw.titleArabic ?? titleEn;

  // NEW: normalize main/sub categories based on path + raw hints
  const { main, sub } = normalizeCategoryFromPath(relPath, {
    category: raw.category,
    section: raw.section,
    group: raw.group,
    tags: raw.tags,
  });

  const tags: string[] | undefined =
    raw.tags && Array.isArray(raw.tags) ? raw.tags.map((t: any) => String(t)) : undefined;

  const ref = raw.reference ?? raw.source ?? raw.ref ?? "";
  const hashSeed = `${relPath}:${idx}:${String(arabic).slice(0, 50)}`;
  const hash = slugify(hashSeed);
  const icon = pickIconFromCategory(main, sub);

  return {
    id: hash,
    icon,
    titleAr: titleAr || "دعاء",
    titleEn: titleEn || "Dua",
    arabic: String(arabic || ""),
    transliteration: String(transliteration || ""),
    translation: String(translation || ""),
    category: main,
    subcategory: sub,
    tags,
    ref,
    sourceFile: relPath,
    hash,
  };
}

async function getDirectoryRecursive(pathUrl: string, acc: any[] = []): Promise<any[]> {
  const res = await fetch(pathUrl);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const list = await res.json();
  for (const item of list) {
    if (item.type === "dir") {
      const nested = await getDirectoryRecursive(item.url, []);
      acc.push(...nested);
    } else if (item.type === "file") {
      acc.push(item);
    }
  }
  return acc;
}

async function fetchRepoDuas(): Promise<Dua[]> {
  const CACHE_KEY = "duaRepoCacheV2"; // bump cache key because of new normalization
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.ts < CACHE_TTL && Array.isArray(cached.duas)) {
        return cached.duas as Dua[];
      }
    }
  } catch {}

  const files = await getDirectoryRecursive(GH_LIST_URL, []);
  const jsonFiles = files.filter((f) => typeof f.name === "string" && f.name.toLowerCase().endsWith(".json"));

  const all: Dua[] = [];
  for (const file of jsonFiles) {
    try {
      const rawRes = await fetch(file.download_url);
      if (!rawRes.ok) continue;
      const content = await rawRes.json();
      const relPath: string = file.path || file.name || "unknown.json";

      if (Array.isArray(content)) {
        content.forEach((item, i) => {
          all.push(normalizeDua(item, relPath, i));
        });
      } else if (content && typeof content === "object") {
        const items = Array.isArray(content.items) ? content.items : [content];
        items.forEach((item: any, i: number) => {
          all.push(normalizeDua(item, relPath, i));
        });
      }
    } catch {
      continue;
    }
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), duas: all }));
  } catch {}
  return all;
}

// ---------- Local defaults (mapped to new categories) ----------
const DEFAULT_DUAS: Dua[] = [
  {
    id: 1,
    icon: Sun,
    titleAr: "دعاء الصباح",
    titleEn: "Morning Dua",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah",
    translation:
      "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah",
    category: "Daily",
    subcategory: "Morning Adhkar",
    sourceFile: "local-default",
    hash: "default-1",
  },
  {
    id: 2,
    icon: Moon,
    titleAr: "دعاء المساء",
    titleEn: "Evening Dua",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah",
    translation:
      "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah",
    category: "Daily",
    subcategory: "Evening Adhkar",
    sourceFile: "local-default",
    hash: "default-2",
  },
  {
    id: 3,
    icon: Bed,
    titleAr: "دعاء الاستيقاظ",
    titleEn: "Upon Waking",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    translation:
      "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection",
    category: "Life",
    subcategory: "Sleep / Waking",
    sourceFile: "local-default",
    hash: "default-3",
  },
  {
    id: 4,
    icon: BedDouble,
    titleAr: "دعاء النوم",
    titleEn: "Before Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name O Allah, I die and I live",
    category: "Life",
    subcategory: "Sleep / Before Sleep",
    sourceFile: "local-default",
    hash: "default-4",
  },
  {
    id: 5,
    icon: Utensils,
    titleAr: "دعاء قبل الطعام",
    titleEn: "Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah",
    category: "Life",
    subcategory: "Food",
    sourceFile: "local-default",
    hash: "default-5",
  },
  {
    id: 6,
    icon: Sparkles,
    titleAr: "دعاء بعد الطعام",
    titleEn: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    translation: "All praise is due to Allah who has fed us and given us drink and made us Muslims",
    category: "Life",
    subcategory: "Food",
    sourceFile: "local-default",
    hash: "default-6",
  },
  {
    id: 7,
    icon: Droplet,
    titleAr: "دعاء بعد الوضوء",
    titleEn: "After Wudu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
    translation:
      "I bear witness that none has the right to be worshipped except Allah, alone without partner, and I bear witness that Muhammad is His slave and Messenger",
    category: "Life",
    subcategory: "Wudu",
    sourceFile: "local-default",
    hash: "default-7",
  },
  {
    id: 8,
    icon: Home,
    titleAr: "دعاء دخول المنزل",
    titleEn: "Entering Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'alallahi rabbina tawakkalna",
    translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust",
    category: "Life",
    subcategory: "Home",
    sourceFile: "local-default",
    hash: "default-8",
  },
  {
    id: 9,
    icon: Plane,
    titleAr: "دعاء السفر",
    titleEn: "Travel Dua",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    translation:
      "Glory is to Him Who has subjected this to us, and we could never have it by our efforts. Surely, unto our Lord we are returning",
    category: "Life",
    subcategory: "Travel",
    sourceFile: "local-default",
    hash: "default-9",
  },
  {
    id: 10,
    icon: Shield,
    titleAr: "دعاء الحفظ",
    titleEn: "Protection Dua",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created",
    category: "Personal",
    subcategory: "Protection",
    sourceFile: "local-default",
    hash: "default-10",
  },
  {
    id: 11,
    icon: BookOpen,
    titleAr: "دعاء طلب العلم",
    titleEn: "Seeking Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge",
    category: "Personal",
    subcategory: "Knowledge",
    sourceFile: "local-default",
    hash: "default-11",
  },
  {
    id: 12,
    icon: Sparkles,
    titleAr: "دعاء الاستغفار",
    titleEn: "Seeking Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-'Azeem alladhi la ilaha illa Huwal-Hayyul-Qayyum wa atubu ilayh",
    translation:
      "I seek forgiveness from Allah the Mighty, Whom there is none worthy of worship except Him, The Living, The Eternal, and I repent to Him",
    category: "Personal",
    subcategory: "Forgiveness",
    sourceFile: "local-default",
    hash: "default-12",
  },
  {
    id: 13,
    icon: Users,
    titleAr: "دعاء للوالدين",
    titleEn: "For Parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani saghira",
    translation: "My Lord, have mercy upon them as they brought me up when I was small",
    category: "Personal",
    subcategory: "Family",
    sourceFile: "local-default",
    hash: "default-13",
  },
  {
    id: 14,
    icon: CloudRain,
    titleAr: "دعاء المطر",
    titleEn: "When it Rains",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    transliteration: "Allahumma sayyiban nafi'a",
    translation: "O Allah, let it be a beneficial rain",
    category: "Life",
    subcategory: "Rain",
    sourceFile: "local-default",
    hash: "default-14",
  },
  {
    id: 15,
    icon: Sparkles,
    titleAr: "دعاء الاستخارة",
    titleEn: "Istikhara (Seeking Guidance)",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ",
    transliteration:
      "Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka biqudratika, wa as'aluka min fadlikal-'azim, fa innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa anta 'allamul-ghuyub",
    translation:
      "O Allah, I seek Your guidance through Your knowledge, and I seek ability through Your power, and I ask You of Your great bounty. You have power; I have none. And You know; I know not. You are the Knower of hidden things",
    category: "Personal",
    subcategory: "Guidance",
    sourceFile: "local-default",
    hash: "default-15",
  },
];

const DEFAULT_DHIKR = [
  { id: 1, arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", translation: "Glory be to Allah", count: 33 },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is due to Allah",
    count: 33,
  },
  {
    id: 3,
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    count: 34,
  },
  {
    id: 4,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    translation: "There is no god but Allah",
    count: 100,
  },
];

// ---------- Component ----------
const Duas: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [repoDuas, setRepoDuas] = useState<Dua[] | null>(null);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [errorRepo, setErrorRepo] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeMain, setActiveMain] = useState<MainCategory | "All">("All");
  const [activeSub, setActiveSub] = useState<string>("All");

  const [user, setUser] = useState<any>(null);
  const [bookmarkSet, setBookmarkSet] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem("duaLocalBookmarksV1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // Load auth + bookmarks
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);

      if (session?.user) {
        setLoadingBookmarks(true);
        const { data, error } = await sbAny.from("dua_bookmarks").select("dua_hash").eq("user_id", session.user.id);

        if (!mounted) return;
        if (!error && Array.isArray(data)) {
          const next: Record<string, boolean> = {};
          (data as Array<{ dua_hash: string }>).forEach((row) => {
            if (row?.dua_hash) next[row.dua_hash] = true;
          });
          setBookmarkSet(next);
        }
        setLoadingBookmarks(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist local-only bookmarks if logged out
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem("duaLocalBookmarksV1", JSON.stringify(bookmarkSet));
      } catch {}
    }
  }, [bookmarkSet, user]);

  // Load repo duas
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingRepo(true);
      setErrorRepo(null);
      try {
        const data = await fetchRepoDuas();
        if (!mounted) return;
        setRepoDuas(data);
      } catch (e: any) {
        setErrorRepo(e?.message || "Failed to load duas");
      } finally {
        if (mounted) setLoadingRepo(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Merge defaults + repo
  const allDuas: Dua[] = useMemo(() => {
    const base = [...DEFAULT_DUAS];
    if (repoDuas && repoDuas.length) {
      const seen = new Set<string>();
      const merged: Dua[] = [];
      for (const d of base) {
        const key = `${d.hash ?? d.id}-${d.arabic}`;
        seen.add(key);
        merged.push(d);
      }
      for (const d of repoDuas) {
        const key = `${d.hash ?? d.id}-${d.arabic}`;
        if (!seen.has(key)) {
          merged.push(d);
          seen.add(key);
        }
      }
      return merged;
    }
    return base;
  }, [repoDuas]);

  // Build main + sub sets
  const mainCategories = useMemo(() => {
    const set = new Set<MainCategory>();
    allDuas.forEach((d) => {
      if (d.category && (MAIN_CATEGORY_ORDER as readonly string[]).includes(d.category)) {
        set.add(d.category as MainCategory);
      }
    });
    const arr = Array.from(set);
    // Sort by our curated order
    arr.sort((a, b) => MAIN_CATEGORY_ORDER.indexOf(a) - MAIN_CATEGORY_ORDER.indexOf(b));
    return ["All", ...arr] as const;
  }, [allDuas]);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    allDuas.forEach((d) => {
      if (activeMain !== "All" && d.category !== activeMain) return;
      if (d.subcategory) set.add(d.subcategory);
    });
    const arr = Array.from(set);
    // Sort by curated order for the chosen main, else alpha
    if (activeMain !== "All") {
      const desired = SUBCATEGORY_ORDER[activeMain] || [];
      arr.sort((a, b) => {
        const ia = desired.indexOf(a);
        const ib = desired.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
    } else {
      arr.sort((a, b) => a.localeCompare(b));
    }
    return ["All", ...arr];
  }, [allDuas, activeMain]);

  // Filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (
      allDuas
        .filter((d) => {
          if (activeMain !== "All" && d.category !== activeMain) return false;
          if (activeSub !== "All" && d.subcategory !== activeSub) return false;
          if (!q) return true;
          const hay = [
            d.titleAr,
            d.titleEn,
            d.arabic,
            d.transliteration,
            d.translation,
            d.category ?? "",
            d.subcategory ?? "",
            (d.tags ?? []).join(" "),
            d.ref ?? "",
            d.sourceFile ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
        // sort by main order, then sub order for a consistent listing
        .sort((a, b) => {
          const ia = MAIN_CATEGORY_ORDER.indexOf((a.category as MainCategory) || "General");
          const ib = MAIN_CATEGORY_ORDER.indexOf((b.category as MainCategory) || "General");
          if (ia !== ib) return ia - ib;
          const main = (a.category as MainCategory) || "General";
          const subs = SUBCATEGORY_ORDER[main] || [];
          const sa = subs.indexOf(a.subcategory || "");
          const sb = subs.indexOf(b.subcategory || "");
          if (sa === -1 && sb === -1) return (a.subcategory || "").localeCompare(b.subcategory || "");
          if (sa === -1) return 1;
          if (sb === -1) return -1;
          return sa - sb;
        })
    );
  }, [allDuas, query, activeMain, activeSub]);

  // Copy
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  function CopyBtn({ text, id }: { text: string; id: string | number }) {
    const isCopied = copiedId === id;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1200);
          } catch {}
        }}
        className="w-9 h-9"
        title={settings.language === "ar" ? "نسخ" : "Copy"}
      >
        {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
      </Button>
    );
  }

  // Toggle bookmark
  async function toggleBookmark(dua: Dua) {
    const key = dua.hash ?? String(dua.id);

    // Logged out => local
    if (!user) {
      setBookmarkSet((prev) => ({ ...prev, [key]: !prev[key] }));
      toast.info(
        settings.language === "ar" ? "تم الحفظ محليًا. سجّل الدخول للتزامن." : "Saved locally. Sign in to sync.",
      );
      return;
    }

    // Logged in => Supabase
    const isBookmarked = !!bookmarkSet[key];
    if (isBookmarked) {
      const { error } = await sbAny.from("dua_bookmarks").delete().eq("user_id", user.id).eq("dua_hash", key);

      if (error) {
        toast.error(settings.language === "ar" ? "فشل إزالة الإشارة" : "Failed to remove bookmark");
        return;
      }
      setBookmarkSet((prev) => ({ ...prev, [key]: false }));
      toast.success(settings.language === "ar" ? "أزيلت من المحفوظات" : "Removed from bookmarks");
    } else {
      const payload = {
        user_id: user.id,
        dua_hash: key,
        title_ar: dua.titleAr ?? null,
        title_en: dua.titleEn ?? null,
        arabic: dua.arabic,
        transliteration: dua.transliteration ?? null,
        translation: dua.translation ?? null,
        category: dua.category ?? null,
        source_file: dua.sourceFile ?? null,
        subcategory: dua.subcategory ?? null,
      };
      const { error } = await sbAny.from("dua_bookmarks").insert(payload);
      if (error) {
        toast.error(settings.language === "ar" ? "فشل الحفظ" : "Failed to bookmark");
        return;
      }
      setBookmarkSet((prev) => ({ ...prev, [key]: true }));
      toast.success(settings.language === "ar" ? "أُضيفت إلى المحفوظات" : "Added to bookmarks");
    }
  }

  const lang = settings.language === "ar" ? "ar" : "en";

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 pb-16">
      {/* Back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
        aria-label={lang === "ar" ? "رجوع" : "Back"}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {lang === "ar" ? "الأدعية والأذكار" : "Daily Duas & Dhikr"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          {lang === "ar"
            ? "أدعية من السنة مصنفة بتصنيف مرتب وواضح، مع بحث وإشارات مرجعية"
            : "Supplications from the Sunnah, organized with clean categories, plus search & bookmarks"}
        </p>

        {/* Search + Reset */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-center pt-2">
          <div className="flex items-center gap-2 neomorph rounded-2xl px-3 py-2 w-full md:w-[560px]">
            <Search className="h-5 w-5 opacity-70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن دعاء..." : "Search duas..."}
              className="bg-transparent outline-none w-full text-sm"
              aria-label="Search duas"
            />
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
              {lang === "ar" ? "مسح" : "Clear"}
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setActiveMain("All");
                setActiveSub("All");
                setQuery("");
              }}
              title={lang === "ar" ? "تصفير" : "Reset"}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              {lang === "ar" ? "تصفير" : "Reset"}
            </Button>
          </div>
        </div>

        {/* Category chips (Main) */}
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          <span className="inline-flex items-center gap-2 text-sm opacity-70">
            <Layers className="h-4 w-4" />
            {lang === "ar" ? "الفئات الرئيسية:" : "Main categories:"}
          </span>
          <div className="w-full" />
          {mainCategories.map((main) => (
            <button
              key={String(main)}
              onClick={() => {
                setActiveMain(main as MainCategory | "All");
                setActiveSub("All");
              }}
              className={`px-3 py-1.5 rounded-full text-sm border smooth-transition ${
                activeMain === main
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/50 hover:bg-background border-border"
              }`}
              title={String(main)}
            >
              {main === "All" ? (lang === "ar" ? "الكل" : "All") : displayMain(main as MainCategory, lang)}
            </button>
          ))}
        </div>

        {/* Subcategory chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="inline-flex items-center gap-2 text-sm opacity-70">
            <Tags className="h-4 w-4" />
            {lang === "ar" ? "الفئات الفرعية:" : "Subcategories:"}
          </span>
          <div className="w-full" />
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`px-3 py-1.5 rounded-full text-sm border smooth-transition ${
                activeSub === sub
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/50 hover:bg-background border-border"
              }`}
              title={sub}
            >
              {sub === "All" ? (lang === "ar" ? "الكل" : "All") : displaySub(sub, lang)}
            </button>
          ))}
        </div>

        {/* Status line */}
        <div className="text-sm text-muted-foreground flex items-center justify-center gap-3">
          <Filter className="h-4 w-4" />
          {lang === "ar" ? `النتائج: ${filtered.length} دعاء` : `Results: ${filtered.length} duas`}
          <span className="opacity-60">•</span>
          <Globe className="h-4 w-4" />
          {loadingRepo
            ? lang === "ar"
              ? "جاري جلب محتوى GitHub..."
              : "Loading from GitHub..."
            : errorRepo
              ? lang === "ar"
                ? "تعذر التحميل، عرض المحتوى المحلي"
                : "Load failed, showing local defaults"
              : lang === "ar"
                ? "مُدمج مع المستودع"
                : "Merged with repository"}
          {loadingBookmarks && (
            <span className="opacity-60">• {lang === "ar" ? "تحميل المحفوظات..." : "Loading bookmarks..."}</span>
          )}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{lang === "ar" ? "الأدعية" : "Duas"}</h2>

        {loadingRepo && (
          <div className="text-center text-sm text-muted-foreground">
            {lang === "ar" ? "جارٍ تحميل الأدعية من المستودع..." : "Fetching duas from repository..."}
          </div>
        )}

        {errorRepo && (
          <div className="text-center text-sm text-red-600">
            {lang === "ar" ? `خطأ: ${errorRepo}` : `Error: ${errorRepo}`}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((dua) => {
            const key = dua.hash ?? String(dua.id);
            const isBookmarked = !!bookmarkSet[key];
            const IconComp = getIconComponent(dua);

            return (
              <div
                key={key}
                className="neomorph rounded-3xl p-6 space-y-4 hover:neomorph-pressed smooth-transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-105 smooth-transition">
                      <IconComp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {lang === "ar" && dua.titleAr ? dua.titleAr : dua.titleEn || "Dua"}
                      </h3>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {dua.category
                            ? displayMain(dua.category as MainCategory, lang)
                            : lang === "ar"
                              ? "عام"
                              : "General"}
                        </span>
                        {dua.subcategory && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary/20">
                            {displaySub(dua.subcategory, lang)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <CopyBtn
                      id={`copy-${key}`}
                      text={[
                        lang === "ar" && dua.titleAr ? dua.titleAr : dua.titleEn || "",
                        dua.arabic,
                        settings.translationEnabled && settings.translationSource === "transliteration"
                          ? dua.transliteration || ""
                          : "",
                        settings.translationEnabled && settings.translationSource !== "transliteration"
                          ? dua.translation || ""
                          : "",
                        dua.ref ? `Ref: ${dua.ref}` : "",
                      ]
                        .filter(Boolean)
                        .join("\n")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(dua)}
                      className={`w-9 h-9 rounded-full ${isBookmarked ? "bg-primary/10 text-primary" : ""}`}
                      title={
                        isBookmarked
                          ? lang === "ar"
                            ? "إزالة الإشارة"
                            : "Remove bookmark"
                          : lang === "ar"
                            ? "إضافة إشارة"
                            : "Add bookmark"
                      }
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                <p className={`text-xl leading-relaxed ${settings.fontType === "quran" ? "font-quran" : ""}`} dir="rtl">
                  {dua.arabic}
                </p>

                {settings.translationEnabled &&
                  settings.translationSource === "transliteration" &&
                  dua.transliteration && <p className="text-sm text-muted-foreground italic">{dua.transliteration}</p>}

                {settings.translationEnabled && settings.translationSource !== "transliteration" && dua.translation && (
                  <p className="text-sm text-muted-foreground">{dua.translation}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {dua.tags?.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      #{t}
                    </span>
                  ))}
                  {dua.ref && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {lang === "ar" ? `مرجع: ${dua.ref}` : `Ref: ${dua.ref}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dhikr */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center">{lang === "ar" ? "الأذكار" : "Daily Dhikr"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_DHIKR.map((item) => (
            <div
              key={item.id}
              className="neomorph rounded-3xl p-6 text-center space-y-3 hover:neomorph-pressed smooth-transition"
            >
              <p className={`text-2xl font-bold ${settings.fontType === "quran" ? "font-quran" : ""}`} dir="rtl">
                {item.arabic}
              </p>

              {settings.translationEnabled && settings.translationSource === "transliteration" && (
                <p className="text-sm text-muted-foreground italic">{item.transliteration}</p>
              )}

              {settings.translationEnabled && settings.translationSource !== "transliteration" && (
                <p className="text-xs text-muted-foreground">{item.translation}</p>
              )}

              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                {item.count}×
              </div>
            </div>
          ))}
        </div>

        {/* Tasbih CTA */}
        <div
          onClick={() => navigate("/tasbih")}
          className="relative overflow-hidden neomorph rounded-2xl p-8 cursor-pointer hover:neomorph-pressed smooth-transition group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 smooth-transition" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <CircleDot className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{lang === "ar" ? "تتبعها" : "Track Them"}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar" ? "التسبيح الرقمي" : "Digital Tasbih Counter"}
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 smooth-transition" />
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-muted-foreground">
        {lang === "ar"
          ? "ملاحظة: تُنظَّم الأقسام تلقائيًا إلى رئيسية وفرعية لعرض أنظف. تُحفَظ الإشارات في حسابك عند تسجيل الدخول، وإلا فمحليًا."
          : "Note: Categories are auto-normalized into main/sub for a cleaner view. Bookmarks save to your account if signed in, otherwise locally."}
      </div>
    </div>
  );
};

export default Duas;
