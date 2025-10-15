import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, BookOpen, Trash2, Loader2, ArrowLeft, BookMarked } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSurahs, Surah } from '@/lib/quran-api';

interface BookmarkData {
  id: string;
  surah_number: number;
  ayah_number: number | null;
  bookmark_type: 'ayah' | 'surah';
  created_at: string;
}

interface HadithBookmark {
  id: string;
  hadith_number: number;
  book_slug: string;
  book_name: string;
  hadith_english: string;
  hadith_arabic: string;
  narrator: string;
  chapter_english: string;
  chapter_arabic: string;
  created_at: string;
}

interface DuaBookmark {
  id: string;
  dua_title: string;
  dua_arabic: string | null;
  dua_transliteration: string | null;
  dua_english: string | null;
  category: string | null;
  created_at: string;
}

const Bookmarks = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [hadithBookmarks, setHadithBookmarks] = useState<HadithBookmark[]>([]);
  const [duaBookmarks, setDuaBookmarks] = useState<DuaBookmark[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Load bookmarks, hadith bookmarks, dua bookmarks, and surahs in parallel
      const [bookmarksResult, hadithResult, duaResult, surahsData] = await Promise.all([
        supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('hadith_bookmarks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('dua_bookmarks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        fetchSurahs()
      ]);

      if (bookmarksResult.data) {
        setBookmarks(bookmarksResult.data as BookmarkData[]);
      }
      if (hadithResult.data) {
        setHadithBookmarks(hadithResult.data as HadithBookmark[]);
      }
      if (duaResult.data) {
        setDuaBookmarks(duaResult.data as DuaBookmark[]);
      }
      setSurahs(surahsData);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast.error(settings.language === 'ar' ? 'فشل تحميل الإشارات المرجعية' : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string, type: 'quran' | 'hadith' | 'dua' = 'quran') => {
    try {
      const table = type === 'hadith' ? 'hadith_bookmarks' : type === 'dua' ? 'dua_bookmarks' : 'bookmarks';
      await supabase.from(table).delete().eq('id', bookmarkId);
      
      if (type === 'hadith') {
        setHadithBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      } else if (type === 'dua') {
        setDuaBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      } else {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      }
      toast.success(settings.language === 'ar' ? 'تمت الإزالة' : 'Removed');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error(settings.language === 'ar' ? 'فشل الحذف' : 'Failed to remove bookmark');
    }
  };

  const getSurahName = (surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return '';
    return settings.language === 'ar' ? surah.name : surah.englishName;
  };

  const ayahBookmarks = bookmarks.filter(b => b.bookmark_type === 'ayah');
  const surahBookmarks = bookmarks.filter(b => b.bookmark_type === 'surah');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">
          {settings.language === 'ar' 
            ? 'يجب تسجيل الدخول لعرض الإشارات المرجعية'
            : 'Please sign in to view bookmarks'}
        </p>
        <Button onClick={() => navigate('/auth')}>
          {settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 glass-effect hover:glass-effect-hover w-10 h-10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'المحفوظات' : 'Bookmarks'}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          {settings.language === 'ar' 
            ? 'الآيات والسور والأحاديث والأدعية المحفوظة'
            : 'Your saved ayahs, surahs, hadiths, and duas'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ayahs" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-effect">
          <TabsTrigger value="ayahs">
            {settings.language === 'ar' ? `آيات (${ayahBookmarks.length})` : `Ayahs (${ayahBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="surahs">
            {settings.language === 'ar' ? `سور (${surahBookmarks.length})` : `Surahs (${surahBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="hadiths">
            {settings.language === 'ar' ? `أحاديث (${hadithBookmarks.length})` : `Hadiths (${hadithBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="duas">
            {settings.language === 'ar' ? `أدعية (${duaBookmarks.length})` : `Duas (${duaBookmarks.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ayahs" className="space-y-4 mt-6">
          {ayahBookmarks.length === 0 ? (
            <div className="text-center py-12 glass-effect rounded-3xl">
              <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {settings.language === 'ar' 
                  ? 'لا توجد آيات محفوظة'
                  : 'No bookmarked ayahs yet'}
              </p>
            </div>
          ) : (
            ayahBookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                onClick={() => navigate(`/quran/${bookmark.surah_number}`)}
                className="glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{getSurahName(bookmark.surah_number)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {settings.language === 'ar' 
                            ? `الآية ${bookmark.ayah_number}`
                            : `Ayah ${bookmark.ayah_number}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(bookmark.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="surahs" className="space-y-4 mt-6">
          {surahBookmarks.length === 0 ? (
            <div className="text-center py-12 glass-effect rounded-3xl">
              <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {settings.language === 'ar' 
                  ? 'لا توجد سور محفوظة'
                  : 'No bookmarked surahs yet'}
              </p>
            </div>
          ) : (
            surahBookmarks.map(bookmark => {
              const surah = surahs.find(s => s.number === bookmark.surah_number);
              return (
                <div
                  key={bookmark.id}
                  onClick={() => navigate(`/quran/${bookmark.surah_number}`)}
                  className="glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                        <span className="text-white font-bold text-xl">{bookmark.surah_number}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{getSurahName(bookmark.surah_number)}</h3>
                        {surah && (
                          <p className="text-sm text-muted-foreground">
                            {surah.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="hadiths" className="space-y-4 mt-6">
          {hadithBookmarks.length === 0 ? (
            <div className="text-center py-12 glass-effect rounded-3xl">
              <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {settings.language === 'ar' 
                  ? 'لا توجد أحاديث محفوظة'
                  : 'No bookmarked hadiths yet'}
              </p>
            </div>
          ) : (
            hadithBookmarks.map(bookmark => (
              <Card
                key={bookmark.id}
                className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{bookmark.book_name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {settings.language === 'ar' 
                          ? `حديث رقم ${bookmark.hadith_number}`
                          : `Hadith ${bookmark.hadith_number}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.id, 'hadith')}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {settings.language === 'ar' ? (
                      <>
                        <p className="text-base font-arabic text-right" dir="rtl">
                          {bookmark.hadith_arabic}
                        </p>
                        {settings.translationEnabled && (
                          <p className="text-sm text-muted-foreground">
                            {bookmark.hadith_english}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-base">
                          {bookmark.hadith_english}
                        </p>
                        {settings.translationEnabled && (
                          <p className="text-sm font-arabic text-right text-muted-foreground" dir="rtl">
                            {bookmark.hadith_arabic}
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                      {settings.language === 'ar' ? 'الراوي: ' : 'Narrator: '}{bookmark.narrator}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="duas" className="space-y-4 mt-6">
          {duaBookmarks.length === 0 ? (
            <div className="text-center py-12 glass-effect rounded-3xl">
              <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {settings.language === 'ar' 
                  ? 'لا توجد أدعية محفوظة'
                  : 'No bookmarked duas yet'}
              </p>
            </div>
          ) : (
            duaBookmarks.map(bookmark => (
              <Card
                key={bookmark.id}
                className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg">{bookmark.dua_title}</h3>
                      {bookmark.category && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {bookmark.category}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.id, 'dua')}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {bookmark.dua_arabic && (
                    <p 
                      className={`text-2xl leading-loose text-right ${settings.fontType === 'quran' ? 'quran-font' : ''}`}
                      dir="rtl"
                    >
                      {bookmark.dua_arabic}
                    </p>
                  )}

                  {bookmark.dua_transliteration && (
                    <p className="text-sm text-muted-foreground italic">
                      {bookmark.dua_transliteration}
                    </p>
                  )}

                  {bookmark.dua_english && (
                    <p className="text-base">
                      {bookmark.dua_english}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookmarks;
