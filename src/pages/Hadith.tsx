import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Loader2, Bookmark, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Book { id?: number; bookName: string; bookSlug: string; }
interface Chapter { chapterEnglish?: string; chapterArabic?: string; }
interface Hadith {
  hadithNumber: number;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  book: Book;
  chapter?: Chapter;
}

const API_KEY = "$2y$10$c2FKqCmEsIJn7cJdNQoxvO9YwsvS8ak8EgpoC1It5ONBEeala";

const fetchHadithPage = async (bookSlug: string, pageNum = 1, search = ""): Promise<Hadith[]> => {
  let url = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}&book=${bookSlug}&paginate=20&page=${pageNum}`;
  if (search.trim()) {
    const isArabic = /[\u0600-\u06FF]/.test(search);
    url += isArabic ? `&hadithArabic=${encodeURIComponent(search)}` : `&hadithEnglish=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hadiths");
  const data = await res.json();
  return data.hadiths?.data || [];
};

const fetchHadithByNumber = async (bookSlug: string, number: number): Promise<Hadith | null> => {
  let page = 1;
  const MAX_PAGES = 200;
  while (page <= MAX_PAGES) {
    const batch = await fetchHadithPage(bookSlug, page);
    if (!batch.length) break;
    const found = batch.find(h => Number(h.hadithNumber) === number);
    if (found) return found;
    page++;
  }
  return null;
};

const Hadith = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  // URL params (same page deep-link)
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const viewBook = params.get("book") || "";
  const viewNumber = params.get("number") ? Number(params.get("number")) : NaN;
  const viewingDetail = Boolean(viewBook && !Number.isNaN(viewNumber));

  // List state
  const [selectedBook, setSelectedBook] = useState("sahih-bukhari");
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Auth & bookmarks
  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // Detail state
  const [detail, setDetail] = useState<Hadith | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailBookmarked, setDetailBookmarked] = useState(false);

  const t = {
    title: settings.language === "ar" ? "الأحاديث النبوية" : "Hadith Collection",
    search: settings.language === "ar" ? "بحث في الأحاديث..." : "Search hadiths...",
    chapter: settings.language === "ar" ? "الباب" : "Chapter",
    hadithNumber: settings.language === "ar" ? "رقم الحديث" : "Hadith Number",
    loadMore: settings.language === "ar" ? "تحميل المزيد" : "Load More",
    loading: settings.language === "ar" ? "جاري التحميل..." : "Loading...",
    back: settings.language === "ar" ? "رجوع" : "Back",
    notFound: settings.language === "ar" ? "لم يتم العثور على الحديث" : "Hadith not found",
    books: {
      bukhari: settings.language === "ar" ? "صحيح البخاري" : "Sahih Bukhari",
      muslim: settings.language === "ar" ? "صحيح مسلم" : "Sahih Muslim",
      abudawud: settings.language === "ar" ? "سنن أبي داود" : "Sunan Abu Dawud",
      tirmidhi: settings.language === "ar" ? "جامع الترمذي" : "Jami at-Tirmidhi",
      nasai: settings.language === "ar" ? "سنن النسائي" : "Sunan an-Nasa'i",
      ibnmajah: settings.language === "ar" ? "سنن ابن ماجه" : "Sunan Ibn Majah",
    },
  };

  const books = [
    { value: "sahih-bukhari", label: t.books.bukhari },
    { value: "sahih-muslim", label: t.books.muslim },
    { value: "abu-dawood", label: t.books.abudawud },
    { value: "al-tirmidhi", label: t.books.tirmidhi },
    { value: "sunan-nasai", label: t.books.nasai },
    { value: "ibn-e-majah", label: t.books.ibnmajah },
  ];

  // Lock horizontal overflow (fix mobile swipe whitespace)
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = prev; };
  }, []);

  // Auth
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  // Load bookmarks
  useEffect(() => {
    (async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("hadith_bookmarks")
        .select("hadith_number, book_slug")
        .eq("user_id", userId);
      if (data) setBookmarked(new Set(data.map((b: any) => `${b.book_slug}-${b.hadith_number}`)));
    })();
  }, [userId]);

  // Accept ?book & ?search for list defaults
  useEffect(() => {
    const bookParam = params.get("book");
    const searchParam = params.get("search"); // for list searches
    const map: Record<string, string> = {
      bukhari: "sahih-bukhari",
      muslim: "sahih-muslim",
      abudawud: "abu-dawood",
      tirmidhi: "al-tirmidhi",
      nasai: "sunan-nasai",
      ibnmajah: "ibn-e-majah",
    };
    if (bookParam && !viewingDetail) setSelectedBook(map[bookParam] || bookParam);
    if (searchParam) { setSearchInput(searchParam); setSearchTerm(searchParam); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // using params above

  // Fetch list
  useEffect(() => {
    (async () => {
      if (viewingDetail) return; // don’t refetch list while in detail
      setLoading(true);
      try {
        const first = await fetchHadithPage(selectedBook, 1, searchTerm);
        setHadiths(first);
        setPage(1);
      } catch {
        toast.error("Failed to load hadiths");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedBook, searchTerm, viewingDetail]);

  const handleSearch = () => setSearchTerm(searchInput);

  const handleLoadMore = async () => {
    const next = page + 1;
    setLoading(true);
    try {
      const batch = await fetchHadithPage(selectedBook, next, searchTerm);
      setHadiths(prev => [...prev, ...batch]);
      setPage(next);
    } catch {
      toast.error("Failed to load more");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (h: Hadith) => {
    const sp = new URLSearchParams(location.search);
    sp.set("book", h.book?.bookSlug);
    sp.set("number", String(h.hadithNumber));
    navigate({ pathname: "/hadith", search: sp.toString() }, { replace: false });
  };

  const closeDetail = () => {
    const sp = new URLSearchParams(location.search);
    sp.delete("number");
    // keep ?book & ?search if they were present
    navigate({ pathname: "/hadith", search: sp.toString() }, { replace: false });
    setDetail(null);
  };

  // Fetch detail when query shows one
  useEffect(() => {
    (async () => {
      if (!viewingDetail) { setDetail(null); setDetailBookmarked(false); return; }
      setDetailLoading(true);
      try {
        const found = await fetchHadithByNumber(viewBook, viewNumber);
        setDetail(found);
        if (userId && found) {
          setDetailBookmarked(bookmarked.has(`${found.book?.bookSlug}-${found.hadithNumber}`));
        }
      } catch {
        toast.error(settings.language === "ar" ? "فشل التحميل" : "Failed to load");
      } finally {
        setDetailLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewingDetail, viewBook, viewNumber, userId, bookmarked]);

  const toggleBookmarkList = async (h: Hadith) => {
    if (!userId) { toast.error(settings.language === "ar" ? "يرجى تسجيل الدخول" : "Please sign in"); return; }
    const key = `${h.book?.bookSlug}-${h.hadithNumber}`;
    if (bookmarked.has(key)) {
      const { error } = await supabase.from("hadith_bookmarks").delete()
        .eq("user_id", userId).eq("hadith_number", h.hadithNumber).eq("book_slug", h.book?.bookSlug);
      if (!error) setBookmarked(prev => { const n = new Set(prev); n.delete(key); return n; });
    } else {
      const { error } = await supabase.from("hadith_bookmarks").insert({
        user_id: userId,
        hadith_number: h.hadithNumber,
        book_slug: h.book?.bookSlug,
        book_name: h.book?.bookName,
        hadith_english: h.hadithEnglish,
        hadith_arabic: h.hadithArabic,
        narrator: h.englishNarrator,
        chapter_english: h.chapter?.chapterEnglish,
        chapter_arabic: h.chapter?.chapterArabic,
      });
      if (!error) setBookmarked(prev => new Set(prev).add(key));
    }
  };

  const toggleBookmarkDetail = async () => {
    if (!detail || !userId) { toast.error(settings.language === "ar" ? "يرجى تسجيل الدخول" : "Please sign in"); return; }
    const key = `${detail.book?.bookSlug}-${detail.hadithNumber}`;
    if (detailBookmarked) {
      const { error } = await supabase.from("hadith_bookmarks").delete()
        .eq("user_id", userId).eq("hadith_number", detail.hadithNumber).eq("book_slug", detail.book?.bookSlug);
      if (!error) { setDetailBookmarked(false); setBookmarked(prev => { const n = new Set(prev); n.delete(key); return n; }); }
    } else {
      const { error } = await supabase.from("hadith_bookmarks").insert({
        user_id: userId,
        hadith_number: detail.hadithNumber,
        book_slug: detail.book?.bookSlug,
        book_name: detail.book?.bookName,
        hadith_english: detail.hadithEnglish,
        hadith_arabic: detail.hadithArabic,
        narrator: detail.englishNarrator,
        chapter_english: detail.chapter?.chapterEnglish,
        chapter_arabic: detail.chapter?.chapterArabic,
      });
      if (!error) { setDetailBookmarked(true); setBookmarked(prev => new Set(prev).add(key)); }
    }
  };

  const shareDetail = async () => {
    const url = window.location.href;
    const title = detail?.book?.bookName ? `${detail.book.bookName} #${detail.hadithNumber}` : "Hadith";
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success(settings.language === "ar" ? "تم نسخ الرابط" : "Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success(settings.language === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  };

  const showArabicFirst = settings.language === "ar";

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden">
      {/* LIST VIEW (hidden while viewing detail) */}
      {!viewingDetail && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 py-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <BookOpen className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  {t.title}
                </span>
              </h1>
            </div>
          </div>

          {/* Search & Picker */}
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

          {/* List */}
          <div className="space-y-4">
            {loading && page === 1 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {hadiths.map((h, idx) => {
                  const key = `${h.book?.bookSlug}-${h.hadithNumber}`;
                  const isBm = bookmarked.has(key);
                  return (
                    <Card
                      key={`${h.hadithNumber}-${idx}`}
                      className="glass-effect rounded-3xl p-8 space-y-5 border border-border/50"
                    >
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-medium">
                          {t.hadithNumber}: {h.hadithNumber}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{h.book?.bookName || ""}</span>
                          <button onClick={() => toggleBookmarkList(h)} className="p-1" title="Bookmark">
                            <Bookmark className={`h-6 w-6 ${isBm ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          </button>
                        </div>
                      </div>

                      {h.chapter && (
                        <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl">
                          {t.chapter}: {settings.language === "ar" ? h.chapter.chapterArabic : h.chapter.chapterEnglish}
                        </div>
                      )}

                      <button
                        onClick={() => openDetail(h)}
                        className="block text-left w-full hover:opacity-90"
                        title={settings.language === "ar" ? "افتح الحديث" : "Open hadith"}
                      >
                        <div className="space-y-5">
                          {showArabicFirst ? (
                            <>
                              <p className="text-xl leading-loose text-right font-arabic">{h.hadithArabic}</p>
                              {settings.translationEnabled && (
                                <p className="text-base leading-relaxed text-muted-foreground">{h.hadithEnglish}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-base leading-relaxed">{h.hadithEnglish}</p>
                              {settings.translationEnabled && (
                                <p className="text-xl font-arabic text-right leading-loose text-muted-foreground">
                                  {h.hadithArabic}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </button>
                    </Card>
                  );
                })}

                {hadiths.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <Button onClick={handleLoadMore} disabled={loading} className="rounded-2xl px-10 h-14 text-base" size="lg">
                      {loading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />{t.loading}</>) : t.loadMore}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* DETAIL VIEW (same page, true page-like) */}
      {viewingDetail && (
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
          {/* Back */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetail}
            className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
            title={t.back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {detailLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !detail ? (
            <div className="text-center py-24 text-muted-foreground">{t.notFound}</div>
          ) : (
            <Card className="glass-effect rounded-3xl p-8 border border-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">
                    {detail.book?.bookName} — #{detail.hadithNumber}
                  </h1>
                  {detail.chapter && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.chapter}: {settings.language === "ar" ? detail.chapter.chapterArabic : detail.chapter.chapterEnglish}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleBookmarkDetail}
                    className="rounded-full"
                    title={detailBookmarked ? (settings.language === "ar" ? "إزالة الحفظ" : "Remove bookmark") : (settings.language === "ar" ? "حفظ" : "Bookmark")}
                  >
                    <Bookmark className={`h-4 w-4 ${detailBookmarked ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareDetail}
                    className="rounded-full"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {showArabicFirst ? (
                  <>
                    <p className="text-2xl leading-loose text-right font-arabic">{detail.hadithArabic}</p>
                    {settings.translationEnabled && (
                      <p className="text-base leading-relaxed text-muted-foreground">{detail.hadithEnglish}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-base leading-relaxed">{detail.hadithEnglish}</p>
                    {settings.translationEnabled && (
                      <p className="text-2xl font-arabic text-right leading-loose text-muted-foreground">{detail.hadithArabic}</p>
                    )}
                  </>
                )}

                <div className="pt-3 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl">
                  {(settings.language === "ar" ? "الراوي" : "Narrator")}: {detail.englishNarrator}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Hadith;
