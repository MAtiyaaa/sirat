import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HadithBook {
  id: string;
  name: string;
  arabicName: string;
}

interface Hadith {
  id: string;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  book: string;
  chapter: string;
}

const hadithBooks: HadithBook[] = [
  { id: 'bukhari', name: 'Sahih Bukhari', arabicName: 'صحيح البخاري' },
  { id: 'muslim', name: 'Sahih Muslim', arabicName: 'صحيح مسلم' },
  { id: 'abudawud', name: 'Abu Dawud', arabicName: 'سنن أبي داود' },
  { id: 'tirmidhi', name: 'Tirmidhi', arabicName: 'سنن الترمذي' },
  { id: 'nasai', name: 'Nasai', arabicName: 'سنن النسائي' },
  { id: 'ibnmajah', name: 'Ibn Majah', arabicName: 'سنن ابن ماجه' },
];

const Hadith = () => {
  const { settings } = useSettings();
  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [searchTerm, setSearchTerm] = useState('');
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [filteredHadiths, setFilteredHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHadiths();
  }, [selectedBook, currentPage]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = hadiths.filter(h =>
        h.hadithEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.hadithArabic.includes(searchTerm) ||
        h.englishNarrator.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHadiths(filtered);
    } else {
      setFilteredHadiths(hadiths);
    }
  }, [searchTerm, hadiths]);

  const loadHadiths = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hadithapi.com/api/hadiths?apiKey=$2y$10$2oUKRYx1Kf3bF8Y0rNvQdOLDn5C0QFhLxh8LVBqnS3HJKMeJ6e6G&book=${selectedBook}&page=${currentPage}&paginate=20`
      );
      
      if (!response.ok) throw new Error('Failed to fetch hadiths');
      
      const data = await response.json();
      setHadiths(data.hadiths.data || []);
      setFilteredHadiths(data.hadiths.data || []);
      setTotalPages(data.hadiths.last_page || 1);
    } catch (error) {
      console.error('Error loading hadiths:', error);
      toast.error(settings.language === 'ar' ? 'فشل تحميل الأحاديث' : 'Failed to load hadiths');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-4 py-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'الأحاديث النبوية' : 'Hadith Collection'}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {settings.language === 'ar' 
            ? 'اقرأ أحاديث الرسول صلى الله عليه وسلم'
            : 'Read the sayings of Prophet Muhammad ﷺ'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3 px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={settings.language === 'ar' ? 'ابحث في الأحاديث...' : 'Search hadiths...'}
            className="pl-12 h-14 rounded-2xl glass-effect border-border/50 text-base"
          />
        </div>

        <Select value={selectedBook} onValueChange={(val) => { setSelectedBook(val); setCurrentPage(1); }}>
          <SelectTrigger className="h-14 rounded-2xl glass-effect border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hadithBooks.map(book => (
              <SelectItem key={book.id} value={book.id}>
                {settings.language === 'ar' ? book.arabicName : book.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hadiths List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4 px-4">
            {filteredHadiths.length === 0 ? (
              <div className="text-center py-12 glass-effect rounded-3xl border border-border/50">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {settings.language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </p>
              </div>
            ) : (
              filteredHadiths.map((hadith, index) => (
                <div
                  key={hadith.id || index}
                  className="glass-effect rounded-3xl p-6 border border-border/50 space-y-4 smooth-transition hover:scale-[1.01] apple-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary mb-1">
                        {settings.language === 'ar' ? 'الراوي' : 'Narrator'}: {hadith.englishNarrator}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {settings.language === 'ar' ? 'الحديث رقم' : 'Hadith'} #{hadith.hadithNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {settings.language === 'ar' ? (
                      <>
                        <div className="quran-font text-lg leading-relaxed text-right" dir="rtl">
                          {hadith.hadithArabic}
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                          {hadith.hadithEnglish}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-base leading-relaxed">
                          {hadith.hadithEnglish}
                        </div>
                        <div className="quran-font text-lg leading-relaxed text-right border-t border-border/30 pt-4" dir="rtl">
                          {hadith.hadithArabic}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl"
              >
                {settings.language === 'ar' ? 'السابق' : 'Previous'}
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                {settings.language === 'ar' 
                  ? `${currentPage} من ${totalPages}`
                  : `${currentPage} of ${totalPages}`}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl"
              >
                {settings.language === 'ar' ? 'التالي' : 'Next'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Hadith;
