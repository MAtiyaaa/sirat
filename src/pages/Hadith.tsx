import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  BookOpen,
  Loader2,
  Bookmark,
  ArrowLeft,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/* -------------------------------- Types -------------------------------- */

interface Book {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string;
  writerDeath: string;
  bookSlug: string;
}

interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

interface Hadith {
  hadithNumber: number;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  book: Book;
  chapter: Chapter;
}

type DeepLinkTarget = { slug: string; num: number } | null;

/* -------------------------- Config & API helpers ------------------------ */

const apiKey = "$2y$10$c2FKqCmEsIJn7cJdNQoxvO9YwsvS8ak8EgpoC1It5ONBEeala";

async function fetchHadithPage(
  bookSlug: string,
  pageNum = 1,
  search = ""
): Promise<Hadith[]> {
  let url = `https://hadithapi.com/api/hadiths?apiKey=${apiKey}&book=${bookSlug}&paginate=20&page=${pageNum}`;
  if (search.trim()) {
    const isArabic = /[\u0600-\u06FF]/.test(search);
    url += isArabic
      ? `&hadithArabic=${encodeURIComponent(search)}`
      : `&hadithEnglish=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hadiths");
  const data = await res.json();
  return data.hadiths?.data || [];
}

/* -------------------------------- Component ----------------------------- */

const Hadith = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [selectedBook, setSelectedBook] = useState("sahih-bukhari");
  const [page, setPage] = useState(1);

  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<Set<string>>(
    new Set()
  );
  const [userId, setUserId] = useState<string | null>(null);

  // Detail view state
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);

  // Deep link target (?hadith=sahih-bukhari-1234)
  const [deepLink, setDeepLink] = useState<DeepLinkTarget>(null);

  const content = {
    ar: {
      title: "الأحاديث النبوية",
      search: "بحث في الأحاديث...",
      book: "الكتاب",
      hadithNumber: "رقم الحديث",
      narrator: "الراوي",
      chapter: "الباب",
      loadMore: "تحميل المزيد",
      loading: "جاري التحميل...",
      bukhari: "صحيح البخاري",
      muslim: "صحيح مسلم",
      abudawud: "سنن أبي داود",
      tirmidhi: "جامع الترمذي",
      nasai: "سنن النسائي",
      ibnmajah: "سنن ابن ماجه",
      shareCopied: "تم نسخ رابط الحديث",
      openHadith: "فتح الحديث",
      back: "رجوع",
    },
    en: {
      title: "Hadith Collection",
      search: "Search hadiths...",
      book: "Book",
      hadithNumber: "Hadith Number",
      narrator: "Narrator",
      chapter: "Chapter",
      loadMore: "Load More",
      loading: "Loading...",
      bukhari: "Sahih Bukhari",
      muslim: "Sahih Muslim",
      abudawud: "Sunan Abu Dawud",
      tirmidhi: "Jami at-Tirmidhi",
      nasai: "Sunan an-Nasa'i",
      ibnmajah: "Sunan Ibn Majah",
      shareCopied: "Hadith link copied",
      openHadith: "Open hadith",
      back: "Back",
    },
  };

  const t = content[settings.language];

  const books = [
    { value: "sahih-bukhari", label: t.bukhari },
    { value: "sahih-muslim", label: t.muslim },
    { value: "abu-dawood", label: t.abudawud },
    { value: "al-tirmidhi", label: t.tirmidhi },
    { value: "sunan-nasai", label: t.nasai },
    { value: "ibn-e-majah", label: t.ibnmajah },
  ];

  /* ---------------------------- Supabase Auth --------------------------- */

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  const fetchBookmarks = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("hadith_bookmarks")
      .select("hadith_number, book_slug")
      .eq("user_id", userId);

    if (data) {
      setBookmarkedHadiths(
        new Set(data.map((b: any) => `${b.book_slug}-${b.hadith_number}`))
      );
    }
  };

  useEffect(() => {
    if (userId) fetchBookmarks();
  }, [userId]);

  const toggleBookmark = async (hadith: Hadith) => {
    if (!userId) {
      toast.error(settings.language === "ar" ? "يرجى تسجيل الدخول" : "Please sign in to bookmark hadiths");
      return;
    }

    const bookmarkKey = `${hadith.book?.bookSlug}-${hadith.hadithNumber}`;
    const isBookmarked = bookmarkedHadiths.has(bookmarkKey);

    if (isBookmarked) {
      const { error } = await supabase
        .from("hadith_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("hadith_number", hadith.hadithNumber)
        .eq("book_slug", hadith.book?.bookSlug);

      if (!error) {
        setBookmarkedHadiths((prev) => {
          const next = new Set(prev);
          next.delete(bookmarkKey);
          return next;
        });
        toast.success(settings.language === "ar" ? "تمت الإزالة" : "Removed");
      }
    } else {
      const { error } = await supabase.from("hadith_bookmarks").insert({
        user_id: userId,
        hadith_number: hadith.hadithNumber,
        book_slug: hadith.book?.bookSlug,
        book_name: hadith.book?.bookName,
        hadith_english: hadith.hadithEnglish,
        hadith_arabic: hadith.hadithArabic,
        narrator: hadith.englishNarrator,
        chapter_english: hadith.chapter?.chapterEnglish,
        chapter_arabic: hadith.chapter?.chapterArabic,
      });

      if (!error) {
        setBookmarkedHadiths((prev) => new Set(prev).add(bookmarkKey));
        toast.success(
          settings.language === "ar" ? "تمت الإضافة" : "Bookmark added"
        );
      }
    }
  };

  /* ----------------------------- URL Handling --------------------------- */

  // Read URL params for book/search/hadith deep-link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookParam = params.get("book");
    const searchParam = params.get("search");
    const hadithParam = params.get("hadith"); // e.g. sahih-bukhari-1234

    // Map short names to API slugs (compat)
    const bookMap: Record<string, string> = {
      bukhari: "sahih-bukhari",
      muslim: "sahih-muslim",
      abudawud: "abu-dawood",
      tirmidhi: "al-tirmidhi",
      nasai: "sunan-nasai",
      ibnmajah: "ibn-e-majah",
    };

    if (bookParam) setSelectedBook(bookMap[bookParam] || bookParam);
    if (searchParam) {
      setSearchInput(searchParam);
      setSearchTerm(searchParam);
    }

    if (hadithParam) {
      const match = hadithParam.match(/(.+)-(\d+)$/);
      if (match) {
        const [, slug, num] = match;
        setDeepLink({ slug, num: Number(num) });
      }
    }
  }, [location.search]);

  /* ---------------------------- Fetch & Paging -------------------------- */

  // Normal fetch for page 1 whenever book/search changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const first = await fetchHadithPage(selectedBook, 1, searchTerm);
        setHadiths(first);
        setPage(1);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load hadiths. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedBook, searchTerm]);

  // Deep-link resolver: page until target is found, then open detail
  useEffect(() => {
    if (!deepLink || deepLink.slug !== selectedBook) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        let pageNum = 1;
        const MAX_PAGES = 200; // safety cap

        while (!cancelled && pageNum <= MAX_PAGES) {
          const batch =
            pageNum === 1 ? hadiths : await fetchHadithPage(selectedBook, pageNum, "");
          const found = batch.find(
            (h) =>
              h.book?.bookSlug === deepLink.slug &&
              Number(h.hadithNumber) === deepLink.num
          );
          if (found) {
            setSelectedHadith(found);
            break;
          }
          pageNum++;
          if (!batch.length) break;
        }
      } catch {
        /* ignore; list stays visible */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deepLink, selectedBook, hadiths]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const next = await fetchHadithPage(selectedBook, nextPage, searchTerm);
      setHadiths((prev) => [...prev, ...next]);
      setPage(nextPage);
    } catch {
      toast.error("Failed to load more.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------- Detail / Share Logic ---------------------- */

  const buildHadithLink = (h: Hadith) => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams(location.search);
    params.set("book", h.book?.bookSlug || selectedBook);
    params.set("hadith", `${h.book?.bookSlug}-${h.hadithNumber}`);
    return `${base}?${params.toString()}`;
  };

  const openHadith = (h: Hadith) => {
    setSelectedHadith(h);
    const url = buildHadithLink(h);
    window.history.replaceState({}, "", url);
  };

  const closeHadith = () => {
    setSelectedHadith(null);
    const params = new URLSearchParams(location.search);
    params.delete("hadith");
    const base = window.location.pathname + (params.toString() ? `?${params}` : "");
    window.history.replaceState({}, "", base);
  };

  const shareHadith = async (h: Hadith) => {
    const url = buildHadithLink(h);
    const title = h.book?.bookName || "Hadith";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t.shareCopied);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success(t.shareCopied);
    }
  };

  /* -------------------------------- Render ------------------------------ */

  const showArabicFirst = settings.language === "ar";

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold ios-26-style tracking-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>
          </div>
        </div>

        {/* Search & Book Picker */}
        <Card className="glass-effect rounded-3xl p-6 space-y-4 border border-border/50 apple-shadow">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 text-base ios-26-style"
              />
            </div>
            <Button onClick={handleSearch} className="rounded-2xl h-14 px-6 ios-26-style">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-background/50 text-base ios-26-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {books.map((b) => (
                <SelectItem key={b.value} value={b.value} className="text-base">
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Hadiths List */}
        <div className="space-y-4">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {hadiths.map((hadith, index) => {
                const bookmarkKey = `${hadith.book?.bookSlug}-${hadith.hadithNumber}`;
                const isBookmarked = bookmarkedHadiths.has(bookmarkKey);

                return (
                  <Card
                    key={`${hadith.hadithNumber}-${index}`}
                    className="glass-effect rounded-3xl p-8 space-y-5 smooth-transition hover:scale-[1.01] border border-border/50 apple-shadow cursor-pointer"
                    onClick={() => openHadith(hadith)}
                    title={t.openHadith}
                  >
                    <div className="flex items-center justify-between text-sm text-muted-foreground ios-26-style">
                      <span className="font-medium">
                        {t.hadithNumber}: {hadith.hadithNumber}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {hadith.book?.bookName || ""}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(hadith);
                          }}
                          className="smooth-transition hover:scale-110 p-1"
                          title="Bookmark"
                        >
                          <Bookmark
                            className={`h-6 w-6 ${
                              isBookmarked
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {hadith.chapter && (
                      <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl ios-26-style">
                        {t.chapter}:{" "}
                        {settings.language === "ar"
                          ? hadith.chapter.chapterArabic
                          : hadith.chapter.chapterEnglish}
                      </div>
                    )}

                    <div className="space-y-5">
                      {showArabicFirst ? (
                        <>
                          <p className="text-xl leading-loose text-right font-arabic">
                            {hadith.hadithArabic}
                          </p>
                          {settings.translationEnabled && (
                            <p className="text-base leading-relaxed text-muted-foreground ios-26-style">
                              {hadith.hadithEnglish}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-base leading-relaxed ios-26-style">
                            {hadith.hadithEnglish}
                          </p>
                          {settings.translationEnabled && (
                            <p className="text-xl font-arabic text-right leading-loose text-muted-foreground">
                              {hadith.hadithArabic}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="pt-3 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl ios-26-style">
                      {t.narrator}: {hadith.englishNarrator}
                    </div>
                  </Card>
                );
              })}

              {hadiths.length > 0 && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="rounded-2xl px-10 h-14 text-base ios-26-style"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        {t.loading}
                      </>
                    ) : (
                      t.loadMore
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail View (no extra route needed) */}
      {selectedHadith && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto p-6 pt-20">
            <div className="relative glass-effect rounded-3xl border border-border/50 p-6">
              {/* Close */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeHadith}
                className="absolute top-4 right-4 rounded-full w-10 h-10"
                title={t.back}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Title */}
              <div className="text-center space-y-2 mb-4">
                <h2 className="text-2xl font-semibold">
                  {selectedHadith.book?.bookName} — #{selectedHadith.hadithNumber}
                </h2>
                {selectedHadith.chapter && (
                  <div className="text-sm text-muted-foreground">
                    {t.chapter}:{" "}
                    {settings.language === "ar"
                      ? selectedHadith.chapter.chapterArabic
                      : selectedHadith.chapter.chapterEnglish}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="space-y-6">
                {showArabicFirst ? (
                  <>
                    <p className="text-2xl leading-loose text-right font-arabic">
                      {selectedHadith.hadithArabic}
                    </p>
                    {settings.translationEnabled && (
                      <p className="text-base leading-relaxed text-muted-foreground ios-26-style">
                        {selectedHadith.hadithEnglish}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-base leading-relaxed ios-26-style">
                      {selectedHadith.hadithEnglish}
                    </p>
                    {settings.translationEnabled && (
                      <p className="text-2xl font-arabic text-right leading-loose text-muted-foreground">
                        {selectedHadith.hadithArabic}
                      </p>
                    )}
                  </>
                )}

                <div className="pt-3 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl ios-26-style">
                  {t.narrator}: {selectedHadith.englishNarrator}
                </div>

                {/* Share */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => shareHadith(selectedHadith)}
                    title="Share hadith"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Back floating button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeHadith}
              className="fixed top-6 left-6 z-[70] rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hadith;
