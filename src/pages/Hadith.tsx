import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [selectedBook, setSelectedBook] = useState('sahih-bukhari');
  const [page, setPage] = useState(1);

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

  const fetchHadiths = async (bookName: string, pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hadithapi.com/api/hadiths?apiKey=$2y$10$c2FKqCmEsIJn7cJdNQoxvO9YwsvS8ak8EgpoC1It5ONBEeala&book=${bookName}&paginate=20&page=${pageNum}`
      );
      
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

  useEffect(() => {
    setPage(1);
    fetchHadiths(selectedBook, 1);
  }, [selectedBook]);

  const filteredHadiths = hadiths.filter((hadith) => {
    const search = searchTerm.toLowerCase();
    return (
      hadith.hadithEnglish?.toLowerCase().includes(search) ||
      hadith.hadithArabic?.includes(searchTerm) ||
      hadith.englishNarrator?.toLowerCase().includes(search)
    );
  });

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHadiths(selectedBook, nextPage);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="glass-effect p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-border/50 bg-background/50"
            />
          </div>

          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="rounded-2xl border-border/50 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {books.map((book) => (
                <SelectItem key={book.value} value={book.value}>
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
              {filteredHadiths.map((hadith, index) => (
                <Card
                  key={`${hadith.hadithNumber}-${index}`}
                  className="glass-effect p-6 space-y-4 rounded-2xl smooth-transition hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {t.hadithNumber}: {hadith.hadithNumber}
                    </span>
                    <span>{hadith.book?.bookName || ''}</span>
                  </div>

                  {hadith.chapter && (
                    <div className="text-sm text-muted-foreground">
                      {t.chapter}: {settings.language === 'ar' ? hadith.chapter.chapterArabic : hadith.chapter.chapterEnglish}
                    </div>
                  )}

                  <div className="space-y-4">
                    {settings.language === 'ar' ? (
                      <>
                        <p className="text-lg leading-relaxed text-right font-arabic">
                          {hadith.hadithArabic}
                        </p>
                        <p className="text-base text-muted-foreground">
                          {hadith.hadithEnglish}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base leading-relaxed">
                          {hadith.hadithEnglish}
                        </p>
                        <p className="text-lg font-arabic text-right text-muted-foreground">
                          {hadith.hadithArabic}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="pt-2 text-sm text-muted-foreground">
                    {t.narrator}: {hadith.englishNarrator}
                  </div>
                </Card>
              ))}

              {filteredHadiths.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="rounded-2xl px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
