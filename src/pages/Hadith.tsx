import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Loader2, Bookmark } from 'lucide-react';
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
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedBook, setSelectedBook] = useState('sahih-bukhari');
  const [page, setPage] = useState(1);
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

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
        // Check if search term is Arabic
        const isArabic = /[\u0600-\u06FF]/.test(search);
        if (isArabic) {
          url += `&hadithArabic=${encodeURIComponent(search)}`;
        } else {
          url += `&hadithEnglish=${encodeURIComponent(search)}`;
        }
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch hadiths');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setHadiths(data.hadiths?.data || []);
      } else {
        setHadiths(prev => [...prev, ...(data.hadiths?.data || [])]);
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      toast.error('Failed to load hadiths. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from('hadith_bookmarks')
      .select('hadith_number, book_slug')
      .eq('user_id', userId);
    
    if (data) {
      setBookmarkedHadiths(new Set(data.map(b => `${b.book_slug}-${b.hadith_number}`)));
    }
  };

  const toggleBookmark = async (hadith: Hadith) => {
    if (!userId) {
      toast.error('Please sign in to bookmark hadiths');
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
        setBookmarkedHadiths(prev => {
          const newSet = new Set(prev);
          newSet.delete(bookmarkKey);
          return newSet;
        });
        toast.success(settings.language === 'ar' ? 'تمت إزالة الإشارة المرجعية' : 'Bookmark removed');
      }
    } else {
      const { error } = await supabase
        .from('hadith_bookmarks')
        .insert({
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
        setBookmarkedHadiths(prev => new Set(prev).add(bookmarkKey));
        toast.success(settings.language === 'ar' ? 'تمت إضافة الإشارة المرجعية' : 'Bookmark added');
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  useEffect(() => {
    setPage(1);
    fetchHadiths(selectedBook, 1, searchTerm);
  }, [selectedBook, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHadiths(selectedBook, nextPage, searchTerm);
  };

  return (
    <div className="min-h-screen pb-24">
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

        {/* Search and Filter */}
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
                  <Card
                    key={`${hadith.hadithNumber}-${index}`}
                    className="glass-effect rounded-3xl p-8 space-y-5 smooth-transition hover:scale-[1.01] border border-border/50 apple-shadow"
                  >
                    <div className="flex items-center justify-between text-sm text-muted-foreground ios-26-style">
                      <span className="font-medium">
                        {t.hadithNumber}: {hadith.hadithNumber}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{hadith.book?.bookName || ''}</span>
                        <button
                          onClick={() => toggleBookmark(hadith)}
                          className="smooth-transition hover:scale-110 p-1"
                        >
                          <Bookmark
                            className={`h-6 w-6 ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        </button>
                      </div>
                    </div>

                   {hadith.chapter && (
                     <div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl ios-26-style">
                       {t.chapter}: {settings.language === 'ar' ? hadith.chapter.chapterArabic : hadith.chapter.chapterEnglish}
                     </div>
                   )}

                   <div className="space-y-5">
                     {settings.language === 'ar' ? (
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
    </div>
  );
};

export default Hadith;
