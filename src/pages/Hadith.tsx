import { useState, useEffect, useMemo } from "react";
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
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  // NEW: detail view
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);

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
      back: "رجوع",
      copied: "تم نسخ الرابط",
      copyFail: "تعذّر النسخ",
      shareFail: "تعذّر المشاركة",
      removed: "تمت الإزالة",
      added: "تمت الإضافة",
      signIn: "يرجى تسجيل الدخول للحفظ",
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
      back: "Back",
      copied: "Link copied",
      copyFail: "Copy failed",
      shareFail: "Share failed",
      removed: "Removed",
      added: "Bookmark added",
      signIn: "Please sign in to bookmark hadiths",
    },
  };
  const t = content[settings.language];

  const books = useMemo(
    () => [
      { value: "sahih-bukhari", label: t.bukhari },
      { value: "sahih-muslim", label: t.muslim },
      { value: "abu-dawood", label: t.abudawud },
      { value: "al-tirmidhi", label: t.tirmidhi },
      { value: "sunan-nasai", label: t.nasai },
      { value: "ibn-e-majah", label: t.ibnmajah },
    ],
    [t]
  );

  // Prevent horizontal swipe/blank space on mobile
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.overflowX;
    const prevB = body.style.overflowX;
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";
    return () => {
      html.style.overflowX = prevH;
      body.style.overflowX = prevB;
    };
  }, []);

  const fetchHadiths = async (bookName: string, pageNum: number = 1, search: string = "") => {
    setLoading(true);
    try {
      let url = `https://hadithapi.com/api/hadiths?apiKey=$2y$10$c2FKqCmEsIJn7cJdNQoxvO9YwsvS8ak8EgpoC1It5ONBEeala&book=${bookName}&paginate=20&page=${pageNum}`;
      if (search.trim()) {
        const isArabic = /[\u0600-\u06FF]/.test(search);
        url += isArabic ? `&hadithArabic=${encodeURIComponent(search)}` : `&hadithEnglish=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch hadiths");
      const data = await response.json();
      const next = data.hadiths?.data || [];
      setHadiths((prev) => (pageNum === 1 ? next : [...prev, ...next]));
      // If URL points to a specific hadith, open it once data arrives
      const params = new URLSearchParams(window.location.search);
      const wanted = params.get("hadith");
      if (pageNum === 1 && wanted) {
        const [slug, num] = wanted.split("-");
        const found = next.find(
          (h: Hadith) => h.book?.bookSlug === slug && String(h.hadithNumber) === String(num)
        );
        if (found) setSelectedHadith(found);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load hadiths. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!userId) return;
    const { data } = await supabase.from("hadith_bookmarks").select("hadith_number, book_slug").eq("user_id", userId);
    if (data) setBookmarkedHadiths(new Set(data.map((b) => `${b.book_slug}-${b.hadith_number}`)));
  };

  const toggleBookmark = async (hadith: Hadith) => {
    if (!userId) {
      toast.error(t.signIn);
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
          const s = new Set(prev);
          s.delete(bookmarkKey);
          return s;
        });
        toast.success(t.removed);
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
        toast.success(t.added);
      }
    }
  };

  // auth + bookmarks
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id || null));
  }, []);
  useEffect(() => {
    if (userId) fetchBookmarks();
  }, [userId]);

  // handle URL params from navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookParam = params.get("book");
    const searchParam = params.get("search");
    const hadithParam = params.get("hadith");

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
    // If hadith param exists, we'll open it after first fetch in fetchHadiths.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // fetch on filters
  useEffect(() => {
    setPage(1);
    fetchHadiths(selectedBook, 1, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchHadiths(selectedBook, next, searchTerm);
  };

  // Helpers
  const openHadith = (h: Hadith) => {
    setSelectedHadith(h);
    // add a shareable query param (no extra routes needed)
    const url = new URL(window.location.href);
    url.searchParams.set("book", selectedBook);
    url.searchParams.set("hadith", `${h.book?.bookSlug}-${h.hadithNumber}`);
    window.history.replaceState({}, "", url.toString());
  };

  const closeHadith = () => {
    setSelectedHadith(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("hadith");
    window.history.replaceState({}, "", url.toString());
  };

  const shareHadith = async (h: Hadith) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("book", selectedBook);
      url.searchParams.set("hadith", `${h.book?.bookSlug}-${h.hadithNumber}`);
      const link = url.toString();

      if ((navigator as any).share) {
        await (navigator as any).share({
          title: settings.language === "ar" ? "حديث" : "Hadith",
          text:
            settings.language === "ar"
              ? `رقم ${h.hadithNumber} - ${h.book?.bookName}`
              : `#${h.hadithNumber} - ${h.book?.bookName}`,
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        toast.success(t.copied);
      }
    } catch {
      // Fallback copy if share failed
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("book", selectedBook);
        url.searchParams.set("hadith", `${h.book?.bookSlug}-${h.hadithNumber}`);
        await navigator.clipboard.writeText(url.toString());
        toast.success(t.copied);
      } catch {
        toast.error(t.shareFail);
      }
    }
  };

  /* -------------------- Detail Page -------------------- */
  if (selectedHadith) {
    const bookmarkKey = `${selectedHadith.book?.bookSlug}-${selectedHadith.hadithNumber}`;
    const isBookmarked = bookmarkedHadiths.has(bookmarkKey);
    return (
      <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
        {/* Back to list */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closeHadith}
          className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
          aria-label={t.back}
          title={t.back}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Soft background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[-6rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-40" />
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-20 pb-24 space-y-6">
          <div className="text-center space-y-2">
            <BookOpen className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedHadith.book?.bookName} • {t.hadithNumber}: {selectedHadith.hadithNumber}
            </h1>
          </div>

          {selectedHadith.chapter && (
            <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl">
              {t.chapter}: {settings.language === "ar" ? selectedHadith.chapter.chapterArabic : selectedHadith.chapter.chapterEnglish}
            </div>
          )}

          <Card className="glass-effect rounded-3xl p-6 border border-border/50">
            {settings.language === "ar" ? (
              <>
                <p className="text-xl leading-loose text-right font-arabic">{selectedHadith.hadithArabic}</p>
                {settings.translationEnabled && (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{selectedHadith.hadithEnglish}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-base leading-relaxed">{selectedHadith.hadithEnglish}</p>
                {settings.translationEnabled && (
                  <p className="mt-4 text-xl font-arabic text-right leading-loose text-muted-foreground">
                    {selectedHadith.hadithArabic}
                  </p>
                )}
              </>
            )}
          </Card>

          <div className="pt-1 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl">
            {t.narrator}: {selectedHadith.englishNarrator}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => shareHadith(selectedHadith)}
              title="Share"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                const txt = settings.language === "ar"
                  ? `${selectedHadith.hadithArabic}\n\n${selectedHadith.hadithEnglish}`
                  : `${selectedHadith.hadithEnglish}\n\n${selectedHadith.hadithArabic}`;
                navigator.clipboard.writeText(txt).then(
                  () => toast.success(settings.language === "ar" ? "تم النسخ" : "Copied"),
                  () => toast.error(settings.language === "ar" ? "فشل النسخ" : "Copy failed")
                );
              }}
              title={settings.language === "ar" ? "نسخ" : "Copy"}
              aria-label={settings.language === "ar" ? "نسخ" : "Copy"}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => toggleBookmark(selectedHadith)}
              title={isBookmarked ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
              aria-label={isBookmarked ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- List Page -------------------- */
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden pb-24">
      {/* Global back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        aria-label={t.back}
        title={t.back}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="text-center space-y-4 pt-16">
          <div className="flex flex-col items-center justify-center gap-3">
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>
          </div>
        </div>

        {/* Search & Filter */}
        <Card className="glass-effect rounded-3xl p-6 space-y-4 border border-border/50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 text-base"
              />
            </div>
            <Button onClick={handleSearch} className="rounded-2xl h-14 px-6">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-background/50 text-base">
              <SelectValue placeholder={t.book} />
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

        {/* List */}
        <div className="space-y-4">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {hadiths.map((hadith, idx) => {
                const bookmarkKey = `${hadith.book?.bookSlug}-${hadith.hadithNumber}`;
                const isBookmarked = bookmarkedHadiths.has(bookmarkKey);

                return (
                  <Card
                    key={`${hadith.hadithNumber}-${idx}`}
                    className="glass-effect rounded-3xl p-8 space-y-5 transition hover:shadow-md border border-border/50 cursor-pointer"
                    onClick={() => openHadith(hadith)}
                  >
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium">
                        {t.hadithNumber}: {hadith.hadithNumber}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{hadith.book?.bookName || ""}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(hadith);
                          }}
                          className="hover:scale-110 p-1"
                          title={isBookmarked ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
                          aria-label={isBookmarked ? (settings.language === "ar" ? "إزالة الإشارة" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
                        >
                          <Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        </button>
                      </div>
                    </div>

                    {hadith.chapter && (
                      <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl">
                        {t.chapter}: {settings.language === "ar" ? hadith.chapter.chapterArabic : hadith.chapter.chapterEnglish}
                      </div>
                    )}

                    <div className="space-y-5">
                      {settings.language === "ar" ? (
                        <>
                          <p className="text-xl leading-loose text-right font-arabic">{hadith.hadithArabic}</p>
                          {settings.translationEnabled && (
                            <p className="text-base leading-relaxed text-muted-foreground">{hadith.hadithEnglish}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-base leading-relaxed">{hadith.hadithEnglish}</p>
                          {settings.translationEnabled && (
                            <p className="text-xl font-arabic text-right leading-loose text-muted-foreground">{hadith.hadithArabic}</p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="pt-3 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl">
                      {t.narrator}: {hadith.englishNarrator}
                    </div>
                  </Card>
                );
              })}

              {hadiths.length > 0 && (
                <div className="flex justify-center pt-6">
                  <Button onClick={handleLoadMore} disabled={loading} className="rounded-2xl px-10 h-14 text-base" size="lg">
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
    </div>
  );
};

export default Hadith;
