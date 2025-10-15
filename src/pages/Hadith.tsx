import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  BookOpen,
  Loader2,
  Bookmark,
  Share2,
  ArrowLeft,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedBook, setSelectedBook] = useState('sahih-bukhari');
  const [page, setPage] = useState(1);
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  // detail state (same-page full view)
  const [viewingDetail, setViewingDetail] = useState(false);
  const [detailHadith, setDetailHadith] = useState<Hadith | null>(null);

  const content = {
    ar: {
      title: 'الأحاديث النبوية',
      search: 'بحث في الأحاديث...',
      book: 'الكتاب',
      hadithNumber: 'رقم الحديث',
      narrator: 'الراوي',
      chapter: 'الباب',
      loadMore: 'تحميل المزيد',
      loading: 'جاري التحميل...',
      bukhari: 'صحيح البخاري',
      muslim: 'صحيح مسلم',
      abudawud: 'سنن أبي داود',
      tirmidhi: 'جامع الترمذي',
      nasai: 'سنن النسائي',
      ibnmajah: 'سنن ابن ماجه',
      back: 'رجوع',
      share: 'مشاركة',
      copied: 'تم نسخ الرابط',
    },
    en: {
      title: 'Hadith Collection',
      search: 'Search hadiths...',
      book: 'Book',
      hadithNumber: 'Hadith Number',
      narrator: 'Narrator',
      chapter: 'Chapter',
      loadMore: 'Load More',
      loading: 'Loading...',
      bukhari: 'Sahih Bukhari',
      muslim: 'Sahih Muslim',
      abudawud: 'Sunan Abu Dawud',
      tirmidhi: 'Jami at-Tirmidhi',
      nasai: "Sunan an-Nasa'i",
      ibnmajah: 'Sunan Ibn Majah',
      back: 'Back',
      share: 'Share',
      copied: 'Link copied',
    },
  };
  const t = content[settings.language];

  const books = [
    { value: 'sahih-bukhari', label: t.bukhari },
    { value: 'sahih-muslim', label: t.muslim },
    { value: 'abu-dawood', label: t.abudawud },
    { value: 'al-tirmidhi', label: t.tirmidhi },
    { value: 'sunan-nasai', label: t.nasai },
    { value: 'ibn-e-majah', label: t.ibnmajah },
  ];

  const fetchHadiths = async (bookName: string, pageNum: number = 1, search: string = '') => {
    setLoading(true);
    try {
      let url = `https://hadithapi.com/api/hadiths?apiKey=$2y$10$c2FKqCmEsIJn7cJdNQoxvO9YwsvS8ak8EgpoC1It5ONBEeala&book=${bookName}&paginate=20&page=${pageNum}`;

      if (search.trim()) {
        const isArabic = /[\u0600-\u06FF]/.test(search);
        if (isArabic) url += `&hadithArabic=${encodeURIComponent(search)}`;
        else url += `&hadithEnglish=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch hadiths');
      const data = await response.json();

      const list: Hadith[] = data.hadiths?.data || [];
      if (pageNum === 1) setHadiths(list);
      else setHadiths((prev) => [...prev, ...list]);

      // if opening via URL (?book=...&hadith=...), pick the one
      const params = new URLSearchParams(location.search);
      const deepBook = mapBookParam(params.get('book'));
      const deepNum = params.get('hadith');
      if (deepBook && deepNum && deepBook === bookName) {
        const found = list.find((h) => String(h.hadithNumber) === String(deepNum));
        if (found) {
          setDetailHadith(found);
          setViewingDetail(true);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load hadiths. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const mapBookParam = (val: string | null) => {
    if (!val) return null;
    const bookMap: Record<string, string> = {
      bukhari: 'sahih-bukhari',
      muslim: 'sahih-muslim',
      abudawud: 'abu-dawood',
      tirmidhi: 'al-tirmidhi',
      nasai: 'sunan-nasai',
      ibnmajah: 'ibn-e-majah',
    };
    return bookMap[val] || val;
  };

  const fetchBookmarks = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('hadith_bookmarks')
      .select('hadith_number, book_slug')
      .eq('user_id', userId);

    if (data) setBookmarkedHadiths(new Set(data.map((b) => `${b.book_slug}-${b.hadith_number}`)));
  };

  const toggleBookmark = async (hadith: Hadith) => {
    if (!userId) {
      toast.error(settings.language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please sign in to bookmark hadiths');
      return;
    }

    const bookmarkKey = `${hadith.book?.bookSlug}-${hadith.hadithNumber}`;
    const isBookmarked = bookmarkedHadiths.has(bookmarkKey);

    if (isBookmarked) {
      const { error } = await supabase
        .from('hadith_bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('hadith_number', hadith.hadithNumber)
        .eq('book_slug', hadith.book?.bookSlug);

      if (!error) {
        setBookmarkedHadiths((prev) => {
          const n = new Set(prev);
          n.delete(bookmarkKey);
          return n;
        });
        toast.success(settings.language === 'ar' ? 'تمت الإزالة' : 'Removed');
      }
    } else {
      const { error } = await supabase.from('hadith_bookmarks').insert({
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
        toast.success(settings.language === 'ar' ? 'تم الحفظ' : 'Bookmark added');
      }
    }
  };

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id || null));
  }, []);
  useEffect(() => {
    if (userId) fetchBookmarks();
  }, [userId]);

  // read params (book/search/hadith)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookParam = mapBookParam(params.get('book'));
    const searchParam = params.get('search') || '';
    if (bookParam) setSelectedBook(bookParam);
    if (searchParam) {
      setSearchInput(searchParam);
      setSearchTerm(searchParam);
    }
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

  // open/close detail
  const openDetail = (h: Hadith) => {
    setDetailHadith(h);
    setViewingDetail(true);

    const params = new URLSearchParams(location.search);
    params.set('book', selectedBook);
    params.set('hadith', String(h.hadithNumber));
    const next = `${location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', next);
  };

  const closeDetail = () => {
    setViewingDetail(false);
    setDetailHadith(null);

    const params = new URLSearchParams(location.search);
    params.delete('hadith');
    const next = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    window.history.replaceState(null, '', next);
  };

  const shareDetail = async () => {
    if (!detailHadith) return;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('book', selectedBook);
    params.set('hadith', String(detailHadith.hadithNumber));
    url.search = params.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${detailHadith.book?.bookName} #${detailHadith.hadithNumber}`,
          text: detailHadith.hadithEnglish?.slice(0, 120) || 'Hadith',
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(url.toString());
        toast.success(t.copied);
      }
    } catch {
      await navigator.clipboard.writeText(url.toString());
      toast.success(t.copied);
    }
  };

  const langIsAr = settings.language === 'ar';

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Global Back Button (list: history back, detail: close detail) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => (viewingDetail ? closeDetail() : navigate(-1))}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        aria-label={t.back}
        title={t.back}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {!viewingDetail && (
        <div className="max-w-4xl mx-auto space-y-6">
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

          {/* Search & Filter */}
          <Card className="glass-effect rounded-3xl p-6 space-y-4 border border-border/50 apple-shadow">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                {books.map((book) => (
                  <SelectItem key={book.value} value={book.value} className="text-base">
                    {book.label}
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
                    <button
                      key={`${hadith.hadithNumber}-${index}`}
                      onClick={() => openDetail(hadith)}
                      className="w-full text-left"
                    >
                      <Card className="glass-effect rounded-3xl p-8 space-y-5 smooth-transition hover:scale-[1.01] border border-border/50 apple-shadow">
                        <div className="flex items-center justify-between text-sm text-muted-foreground ios-26-style">
                          <span className="font-medium">
                            {t.hadithNumber}: {hadith.hadithNumber}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{hadith.book?.bookName || ''}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(hadith);
                              }}
                              className="smooth-transition hover:scale-110 p-1"
                              aria-label="bookmark"
                            >
                              <Bookmark
                                className={`h-6 w-6 ${
                                  isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {hadith.chapter && (
                          <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl ios-26-style">
                            {t.chapter}:{' '}
                            {settings.language === 'ar' ? hadith.chapter.chapterArabic : hadith.chapter.chapterEnglish}
                          </div>
                        )}

                        <div className="space-y-5">
                          {settings.language === 'ar' ? (
                            <>
                              <p className="text-xl leading-loose text-right font-arabic">{hadith.hadithArabic}</p>
                              {settings.translationEnabled && (
                                <p className="text-base leading-relaxed text-muted-foreground ios-26-style">
                                  {hadith.hadithEnglish}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-base leading-relaxed ios-26-style">{hadith.hadithEnglish}</p>
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
                    </button>
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
      )}

      {viewingDetail && detailHadith && (
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-24">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {detailHadith.book?.bookName} — #{detailHadith.hadithNumber}
              </h2>
              {detailHadith.chapter && (
                <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl inline-block">
                  {t.chapter}:{' '}
                  {settings.language === 'ar'
                    ? detailHadith.chapter.chapterArabic
                    : detailHadith.chapter.chapterEnglish}
                </div>
              )}
            </div>

            <Card className="glass-effect rounded-3xl p-8 space-y-5 border border-border/50 apple-shadow">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareDetail}
                  className="rounded-full"
                  title={t.share}
                  aria-label={t.share}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const url = new URL(window.location.href);
                    await navigator.clipboard.writeText(url.toString());
                    toast.success(t.copied);
                  }}
                  className="rounded-full"
                  title={t.copied}
                  aria-label={t.copied}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {langIsAr ? (
                  <>
                    <p className="text-2xl leading-loose text-right font-arabic">{detailHadith.hadithArabic}</p>
                    {settings.translationEnabled && (
                      <p className="text-base leading-relaxed text-muted-foreground">{detailHadith.hadithEnglish}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-base leading-relaxed">{detailHadith.hadithEnglish}</p>
                    {settings.translationEnabled && (
                      <p className="text-2xl font-arabic text-right leading-loose text-muted-foreground">
                        {detailHadith.hadithArabic}
                      </p>
                    )}
                  </>
                )}

                <div className="pt-3 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/20 rounded-xl">
                  {t.narrator}: {detailHadith.englishNarrator}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hadith;
