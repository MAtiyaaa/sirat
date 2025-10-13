import React, { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Heart,
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
  Star,
  StarOff,
  RefreshCcw,
  FolderOpen,
  Filter,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface DuaBase {
  id?: number | string;
  icon?: IconType | any;
  titleAr?: string;
  titleEn?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  // Extended:
  category?: string; // derived from folder / file
  tags?: string[]; // optional tags if present
  ref?: string; // reference if present in data
  sourceFile?: string; // filename in repo
  hash?: string; // stable id for favorites
}

interface Dua
  extends Required<
    Pick<DuaBase, "id" | "icon" | "titleAr" | "titleEn" | "arabic" | "transliteration" | "translation">
  > {
  category?: string;
  tags?: string[];
  ref?: string;
  sourceFile?: string;
  hash?: string;
}

const ICONS: Record<string, IconType> = {
  sun: Sun,
  moon: Moon,
  morning: Sun,
  evening: Moon,
  sleep: BedDouble,
  waking: Bed,
  wudu: Droplet,
  food: Utensils,
  eat: Utensils,
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
    category: "Daily / Morning",
    hash: "default-1",
    sourceFile: "local-default",
    ref: "",
    tags: ["morning", "daily"],
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
    category: "Daily / Evening",
    hash: "default-2",
    sourceFile: "local-default",
    ref: "",
    tags: ["evening", "daily"],
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
    category: "Sleep / Waking",
    hash: "default-3",
    sourceFile: "local-default",
    ref: "",
    tags: ["waking", "sleep"],
  },
  {
    id: 4,
    icon: BedDouble,
    titleAr: "دعاء النوم",
    titleEn: "Before Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name O Allah, I die and I live",
    category: "Sleep / Before Sleep",
    hash: "default-4",
    sourceFile: "local-default",
    ref: "",
    tags: ["sleep"],
  },
  {
    id: 5,
    icon: Utensils,
    titleAr: "دعاء قبل الطعام",
    titleEn: "Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah",
    category: "Food",
    hash: "default-5",
    sourceFile: "local-default",
    ref: "",
    tags: ["food", "before eating"],
  },
  {
    id: 6,
    icon: Heart,
    titleAr: "دعاء بعد الطعام",
    titleEn: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    translation: "All praise is due to Allah who has fed us and given us drink and made us Muslims",
    category: "Food",
    hash: "default-6",
    sourceFile: "local-default",
    ref: "",
    tags: ["food", "after eating"],
  },
  {
    id: 7,
    icon: Droplet,
    titleAr: "دعاء بعد الوضوء",
    titleEn: "After Wudu",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ ...",
    transliteration: "Ashhadu an la ilaha illallahu ...",
    translation: "I bear witness that none has the right to be worshipped except Allah...",
    category: "Wudu",
    hash: "default-7",
    sourceFile: "local-default",
    ref: "",
    tags: ["wudu"],
  },
  {
    id: 8,
    icon: Home,
    titleAr: "دعاء دخول المنزل",
    titleEn: "Entering Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا ...",
    transliteration: "Bismillahi walajna ...",
    translation: "In the name of Allah we enter, in the name of Allah we leave...",
    category: "Home",
    hash: "default-8",
    sourceFile: "local-default",
    ref: "",
    tags: ["home"],
  },
  {
    id: 9,
    icon: Plane,
    titleAr: "دعاء السفر",
    titleEn: "Travel Dua",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا ...",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha ...",
    translation: "Glory is to Him Who has subjected this to us...",
    category: "Travel",
    hash: "default-9",
    sourceFile: "local-default",
    ref: "",
    tags: ["travel"],
  },
  {
    id: 10,
    icon: Shield,
    titleAr: "دعاء الحفظ",
    titleEn: "Protection Dua",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ ...",
    transliteration: "A'udhu bikalimatillahit-tammati ...",
    translation: "I seek refuge in the perfect words of Allah...",
    category: "Protection",
    hash: "default-10",
    sourceFile: "local-default",
    ref: "",
    tags: ["protection"],
  },
  {
    id: 11,
    icon: BookOpen,
    titleAr: "دعاء طلب العلم",
    titleEn: "Seeking Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge",
    category: "Knowledge",
    hash: "default-11",
    sourceFile: "local-default",
    ref: "",
    tags: ["knowledge"],
  },
  {
    id: 12,
    icon: Sparkles,
    titleAr: "دعاء الاستغفار",
    titleEn: "Seeking Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ ...",
    transliteration: "Astaghfirullaha al-'Azeem ...",
    translation: "I seek forgiveness from Allah the Mighty...",
    category: "Forgiveness",
    hash: "default-12",
    sourceFile: "local-default",
    ref: "",
    tags: ["forgiveness"],
  },
  {
    id: 13,
    icon: Users,
    titleAr: "دعاء للوالدين",
    titleEn: "For Parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani saghira",
    translation: "My Lord, have mercy upon them...",
    category: "Family",
    hash: "default-13",
    sourceFile: "local-default",
    ref: "",
    tags: ["parents", "family"],
  },
  {
    id: 14,
    icon: CloudRain,
    titleAr: "دعاء المطر",
    titleEn: "When it Rains",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    transliteration: "Allahumma sayyiban nafi'a",
    translation: "O Allah, let it be a beneficial rain",
    category: "Rain",
    hash: "default-14",
    sourceFile: "local-default",
    ref: "",
    tags: ["rain"],
  },
  {
    id: 15,
    icon: Sparkles,
    titleAr: "دعاء الاستخارة",
    titleEn: "Istikhara (Seeking Guidance)",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ ...",
    transliteration: "Allahumma inni astakhiruka bi'ilmika ...",
    translation: "O Allah, I seek Your guidance through Your knowledge...",
    category: "Guidance / Istikhara",
    hash: "default-15",
    sourceFile: "local-default",
    ref: "",
    tags: ["istikhara", "guidance"],
  },
];

const DEFAULT_DHIKR = [
  {
    id: 1,
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    count: 33,
  },
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

// Helpers
const GH_LIST_URL = "https://api.github.com/repos/fitrahive/dua-dhikr/contents/data?ref=main";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function pickIconFromCategory(cat?: string): IconType {
  if (!cat) return ICONS.default;
  const key = cat.toLowerCase();
  if (key.includes("morning") || key.includes("صباح")) return ICONS.sun;
  if (key.includes("evening") || key.includes("مساء")) return ICONS.moon;
  if (key.includes("sleep") || key.includes("نوم")) return ICONS.sleep;
  if (key.includes("wudu") || key.includes("وضوء")) return ICONS.wudu;
  if (key.includes("home") || key.includes("منزل") || key.includes("house")) return ICONS.home;
  if (key.includes("travel") || key.includes("سفر")) return ICONS.travel;
  if (key.includes("protect") || key.includes("حفظ") || key.includes("عافية")) return ICONS.protection;
  if (key.includes("knowledge") || key.includes("علم")) return ICONS.knowledge;
  if (key.includes("parent") || key.includes("والدين")) return ICONS.parents;
  if (key.includes("rain") || key.includes("مطر")) return ICONS.rain;
  if (key.includes("istikhara") || key.includes("استخارة")) return ICONS.istikhara;
  if (key.includes("food") || key.includes("طعام") || key.includes("eat")) return ICONS.food;
  return ICONS.default;
}

function normalizeDua(raw: any, fallbackCategory: string, sourceFile: string, idx: number): Dua {
  // Flexible keys to match various JSON shapes
  const arabic = raw.arabic ?? raw.dua_arabic ?? raw.dua ?? raw.text ?? "";
  const transliteration = raw.transliteration ?? raw.translit ?? raw.transcription ?? "";
  const translation = raw.translation ?? raw.en ?? raw.meaning ?? "";
  const titleEn =
    raw.titleEn ?? raw.title_en ?? raw.title ?? raw.name ?? raw.topic ?? (raw.tags?.[0] ? String(raw.tags[0]) : "Dua");
  const titleAr = raw.titleAr ?? raw.title_ar ?? raw.title_arabic ?? raw.titleArabic ?? titleEn;

  const category = raw.category ?? raw.section ?? raw.group ?? fallbackCategory;

  const tags: string[] | undefined =
    raw.tags && Array.isArray(raw.tags) ? raw.tags.map((t: any) => String(t)) : undefined;

  const ref = raw.reference ?? raw.source ?? raw.ref ?? "";

  const hashSeed = `${sourceFile}:${idx}:${arabic?.slice(0, 50)}`;
  const hash = slugify(hashSeed);
  const icon = pickIconFromCategory(category);

  return {
    id: hash,
    icon,
    titleAr: titleAr || "دعاء",
    titleEn: titleEn || "Dua",
    arabic: String(arabic || ""),
    transliteration: String(transliteration || ""),
    translation: String(translation || ""),
    category,
    tags,
    ref,
    sourceFile,
    hash,
  };
}

async function getDirectoryRecursive(pathUrl: string, acc: any[] = []): Promise<any[]> {
  const res = await fetch(pathUrl);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const list = await res.json();
  for (const item of list) {
    if (item.type === "dir") {
      const nextUrl = item.url; // api.github.com.../contents/<subdir>
      const nested = await getDirectoryRecursive(nextUrl, []);
      acc.push(...nested);
    } else if (item.type === "file") {
      acc.push(item);
    }
  }
  return acc;
}

async function fetchRepoDuas(): Promise<Dua[]> {
  // Cache for 7 days
  const CACHE_KEY = "duaRepoCacheV1";
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.ts < CACHE_TTL && Array.isArray(cached.duas)) {
        return cached.duas;
      }
    }
  } catch {}

  const files = await getDirectoryRecursive(GH_LIST_URL, []);
  // Only JSON files
  const jsonFiles = files.filter((f) => typeof f.name === "string" && f.name.toLowerCase().endsWith(".json"));

  const all: Dua[] = [];
  for (const file of jsonFiles) {
    try {
      // file.download_url provides raw content URL
      const rawRes = await fetch(file.download_url);
      if (!rawRes.ok) continue;

      const content = await rawRes.json();
      const relPath: string = file.path || file.name || "unknown.json";

      // Category from path: data/<category>/.../file.json
      const pathParts = relPath.split("/");
      const cat = pathParts.length > 2 ? pathParts.slice(1, -1).join(" / ") : "General";

      if (Array.isArray(content)) {
        content.forEach((item, i) => {
          all.push(normalizeDua(item, cat, relPath, i));
        });
      } else if (content && typeof content === "object") {
        // Some files may be an object with {items: [...]}
        const items = Array.isArray(content.items) ? content.items : [content];
        items.forEach((item: any, i: number) => {
          all.push(normalizeDua(item, cat, relPath, i));
        });
      }
    } catch {
      // ignore malformed files
      continue;
    }
  }

  // Cache
  try {
    localStorage.setItem("duaRepoCacheV1", JSON.stringify({ ts: Date.now(), duas: all }));
  } catch {}

  return all;
}

const Duas: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [repoDuas, setRepoDuas] = useState<Dua[] | null>(null);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [errorRepo, setErrorRepo] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // favorites in localStorage by dua.hash
  const FAV_KEY = "duaFavoritesV1";
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // load repo duas
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

  // merge defaults + repo
  const allDuas: Dua[] = useMemo(() => {
    const base = [...DEFAULT_DUAS];
    if (repoDuas && repoDuas.length) {
      // De-dup by hash+arabic
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

  // categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allDuas.forEach((d) => {
      if (d.category && d.category.trim()) set.add(d.category);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allDuas]);

  // filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allDuas.filter((d) => {
      if (showOnlyFavorites && !favorites[d.hash ?? String(d.id)]) return false;
      if (activeCategory !== "All" && (d.category ?? "") !== activeCategory) return false;
      if (!q) return true;
      const hay = [
        d.titleAr,
        d.titleEn,
        d.arabic,
        d.transliteration,
        d.translation,
        d.category ?? "",
        (d.tags ?? []).join(" "),
        d.ref ?? "",
        d.sourceFile ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allDuas, query, activeCategory, favorites, showOnlyFavorites]);

  const dhikr = DEFAULT_DHIKR;

  function toggleFavorite(d: Dua) {
    const key = d.hash ?? String(d.id);
    setFavorites((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  }

  function IconFor(d: Dua) {
    const IconComp: IconType = d.icon || pickIconFromCategory(d.category) || ICONS.default;
    return <IconComp className="h-6 w-6 text-white" />;
  }

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

  // UI
  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 pb-16">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
        aria-label={settings.language === "ar" ? "رجوع" : "Back"}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === "ar" ? "الأدعية والأذكار" : "Daily Duas & Dhikr"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === "ar"
            ? "أدعية وأذكار من السنة النبوية، مصنفة حسب الموضوع مع بحث ومفضلة"
            : "Supplications from the Sunnah, organized by category with search & favorites."}
        </p>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-center pt-2">
          <div className="flex items-center gap-2 neomorph rounded-2xl px-3 py-2 w-full md:w-[420px]">
            <Search className="h-5 w-5 opacity-70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={settings.language === "ar" ? "ابحث عن دعاء أو فئة..." : "Search dua or category..."}
              className="bg-transparent outline-none w-full text-sm"
              aria-label="Search duas"
            />
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
              {settings.language === "ar" ? "مسح" : "Clear"}
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant={showOnlyFavorites ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setShowOnlyFavorites((v) => !v)}
              title={settings.language === "ar" ? "المفضلة" : "Favorites"}
            >
              {showOnlyFavorites ? <Star className="h-4 w-4 mr-2" /> : <StarOff className="h-4 w-4 mr-2" />}
              {settings.language === "ar" ? "المفضلة" : "Favorites"}
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setActiveCategory("All");
                setQuery("");
                setShowOnlyFavorites(false);
              }}
              title={settings.language === "ar" ? "تصفير" : "Reset"}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              {settings.language === "ar" ? "تصفير" : "Reset"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center pt-1">
          <span className="inline-flex items-center gap-2 text-sm opacity-70">
            <FolderOpen className="h-4 w-4" />
            {settings.language === "ar" ? "الفئات:" : "Categories:"}
          </span>
          <div className="w-full" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm border smooth-transition ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/50 hover:bg-background border-border"
              }`}
              title={cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-sm text-muted-foreground flex items-center justify-center gap-3">
          <Filter className="h-4 w-4" />
          {settings.language === "ar" ? `النتائج: ${filtered.length} دعاء` : `Results: ${filtered.length} duas`}
          <span className="opacity-60">•</span>
          <Globe className="h-4 w-4" />
          {loadingRepo
            ? settings.language === "ar"
              ? "يتم جلب محتوى GitHub..."
              : "Loading from GitHub..."
            : errorRepo
              ? settings.language === "ar"
                ? "تعذر التحميل، عرض المحتوى المحلي"
                : "Load failed, showing local defaults"
              : settings.language === "ar"
                ? "تم الدمج مع مستودع GitHub"
                : "Merged with GitHub repository"}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {settings.language === "ar" ? "الأدعية" : "Duas"}
        </h2>

        {loadingRepo && (
          <div className="text-center text-sm text-muted-foreground">
            {settings.language === "ar" ? "جارٍ تحميل الأدعية من المستودع..." : "Fetching duas from repository..."}
          </div>
        )}

        {errorRepo && (
          <div className="text-center text-sm text-red-600">
            {settings.language === "ar" ? `خطأ: ${errorRepo}` : `Error: ${errorRepo}`}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((dua) => {
            const key = dua.hash ?? String(dua.id);
            const isFav = !!favorites[key];
            const Icon = () => IconFor(dua);

            return (
              <div key={key} className="neomorph rounded-3xl p-6 space-y-4 hover:neomorph-pressed smooth-transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {settings.language === "ar" && dua.titleAr ? dua.titleAr : dua.titleEn || "Dua"}
                      </h3>
                      <div className="text-xs text-muted-foreground">
                        {dua.category || (settings.language === "ar" ? "عام" : "General")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <CopyBtn
                      id={`copy-${key}`}
                      text={[
                        settings.language === "ar" && dua.titleAr ? dua.titleAr : dua.titleEn || "",
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
                      onClick={() => toggleFavorite(dua)}
                      className="w-9 h-9"
                      title={
                        isFav
                          ? settings.language === "ar"
                            ? "إزالة من المفضلة"
                            : "Remove Favorite"
                          : settings.language === "ar"
                            ? "أضِف إلى المفضلة"
                            : "Add Favorite"
                      }
                    >
                      {isFav ? <Star className="h-5 w-5 text-yellow-500" /> : <StarOff className="h-5 w-5" />}
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
                      {settings.language === "ar" ? `مرجع: ${dua.ref}` : `Ref: ${dua.ref}`}
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
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          {settings.language === "ar" ? "الأذكار" : "Daily Dhikr"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dhikr.map((item) => (
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

        {/* Track Dhikr Card */}
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
                <h3 className="text-xl font-bold">{settings.language === "ar" ? "تتبعها" : "Track Them"}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings.language === "ar" ? "التسبيح الرقمي" : "Digital Tasbih Counter"}
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 smooth-transition" />
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-muted-foreground">
        {settings.language === "ar"
          ? "ملاحظة: يتم جلب الأدعية من مستودع GitHub ودمجها مع المحتوى المحلي. يتم التخزين مؤقتًا لمدة 7 أيام."
          : "Note: Duas are fetched from the GitHub repository and merged with local defaults. Cached for 7 days."}
      </div>
    </div>
  );
};

export default Duas;
