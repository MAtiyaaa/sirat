import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, BookOpen, Trash2, Loader2, ArrowLeft, BookMarked, Heart } from 'lucide-react';
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

  const getCardGradient = (index: number) => {
    const gradients = [
      { gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
      { gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20", iconBg: "bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
      { gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
      { gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20", iconBg: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
      { gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20", iconBg: "bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" },
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Bookmark className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {settings.language === 'ar' ? 'يجب تسجيل الدخول' : 'Sign In Required'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {settings.language === 'ar' 
                ? 'يجب تسجيل الدخول لعرض الإشارات المرجعية'
                : 'Please sign in to view bookmarks'}
            </p>
            <Button onClick={() => navigate('/auth')} size="lg">
              {settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isRTL = settings.language === 'ar';

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={settings.language === 'ar' ? 'رجوع' : 'Back'}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="text-3xl font-bold">
            {settings.language === 'ar' ? 'المحفوظات' : 'Bookmarks'}
          </h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ayahs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-effect">
            <TabsTrigger value="ayahs" className="text-xs sm:text-sm">
              {settings.language === 'ar' ? `آيات (${ayahBookmarks.length})` : `Ayahs (${ayahBookmarks.length})`}
            </TabsTrigger>
            <TabsTrigger value="surahs" className="text-xs sm:text-sm">
              {settings.language === 'ar' ? `سور (${surahBookmarks.length})` : `Surahs (${surahBookmarks.length})`}
            </TabsTrigger>
            <TabsTrigger value="hadiths" className="text-xs sm:text-sm">
              {settings.language === 'ar' ? `أحاديث (${hadithBookmarks.length})` : `Hadiths (${hadithBookmarks.length})`}
            </TabsTrigger>
            <TabsTrigger value="duas" className="text-xs sm:text-sm">
              {settings.language === 'ar' ? `أدعية (${duaBookmarks.length})` : `Duas (${duaBookmarks.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Ayahs Tab */}
          <TabsContent value="ayahs" className="space-y-4 mt-6">
            {ayahBookmarks.length === 0 ? (
              <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {settings.language === 'ar' ? 'لا توجد آيات محفوظة' : 'No Bookmarked Ayahs'}
                </h3>
                <p className="text-muted-foreground">
                  {settings.language === 'ar' 
                    ? 'احفظ آياتك المفضلة لتجدها هنا'
                    : 'Save your favorite ayahs to find them here'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ayahBookmarks.map((bookmark, index) => {
                  const style = getCardGradient(index);
                  return (
                    <div key={bookmark.id} className="cursor-pointer group">
                      <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                        
                        <Card 
                          className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6"
                          onClick={() => navigate(`/quran/${bookmark.surah_number}?ayah=${bookmark.ayah_number}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                              <BookOpen className={`h-7 w-7 ${style.iconColor}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 truncate">
                                {getSurahName(bookmark.surah_number)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {settings.language === 'ar' 
                                  ? `الآية ${bookmark.ayah_number}`
                                  : `Ayah ${bookmark.ayah_number}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeBookmark(bookmark.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Surahs Tab */}
          <TabsContent value="surahs" className="space-y-4 mt-6">
            {surahBookmarks.length === 0 ? (
              <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {settings.language === 'ar' ? 'لا توجد سور محفوظة' : 'No Bookmarked Surahs'}
                </h3>
                <p className="text-muted-foreground">
                  {settings.language === 'ar' 
                    ? 'احفظ السور المفضلة لديك لتجدها هنا'
                    : 'Save your favorite surahs to find them here'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {surahBookmarks.map((bookmark, index) => {
                  const style = getCardGradient(index);
                  const surah = surahs.find(s => s.number === bookmark.surah_number);
                  return (
                    <div key={bookmark.id} className="cursor-pointer group">
                      <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                        
                        <Card 
                          className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6"
                          onClick={() => navigate(`/quran/${bookmark.surah_number}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                              <span className={`font-bold text-xl ${style.iconColor}`}>{bookmark.surah_number}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 truncate">
                                {getSurahName(bookmark.surah_number)}
                              </h3>
                              {surah && (
                                <p className="text-sm text-muted-foreground">
                                  {surah.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeBookmark(bookmark.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Hadiths Tab */}
          <TabsContent value="hadiths" className="space-y-4 mt-6">
            {hadithBookmarks.length === 0 ? (
              <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {settings.language === 'ar' ? 'لا توجد أحاديث محفوظة' : 'No Bookmarked Hadiths'}
                </h3>
                <p className="text-muted-foreground">
                  {settings.language === 'ar' 
                    ? 'احفظ الأحاديث المفضلة لتجدها هنا'
                    : 'Save your favorite hadiths to find them here'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {hadithBookmarks.map((bookmark, index) => {
                  const style = getCardGradient(index);
                  return (
                    <div key={bookmark.id} className="group">
                      <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                        
                        <Card className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                                  <BookOpen className={`h-7 w-7 ${style.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg mb-1">{bookmark.book_name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {settings.language === 'ar' 
                                      ? `حديث رقم ${bookmark.hadith_number}`
                                      : `Hadith ${bookmark.hadith_number}`}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => removeBookmark(bookmark.id, 'hadith')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-3 pl-[72px]">
                              {settings.language === 'ar' ? (
                                <>
                                  <p className="text-base font-arabic text-right leading-relaxed" dir="rtl">
                                    {bookmark.hadith_arabic}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {bookmark.hadith_english}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-base leading-relaxed">
                                    {bookmark.hadith_english}
                                  </p>
                                  <p className="text-sm font-arabic text-right text-muted-foreground" dir="rtl">
                                    {bookmark.hadith_arabic}
                                  </p>
                                </>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {settings.language === 'ar' ? 'الراوي: ' : 'Narrator: '}{bookmark.narrator}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Duas Tab */}
          <TabsContent value="duas" className="space-y-4 mt-6">
            {duaBookmarks.length === 0 ? (
              <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {settings.language === 'ar' ? 'لا توجد أدعية محفوظة' : 'No Bookmarked Duas'}
                </h3>
                <p className="text-muted-foreground">
                  {settings.language === 'ar' 
                    ? 'احفظ الأدعية المفضلة لتجدها هنا'
                    : 'Save your favorite duas to find them here'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {duaBookmarks.map((bookmark, index) => {
                  const style = getCardGradient(index);
                  return (
                    <div key={bookmark.id} className="group">
                      <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                        
                        <Card className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                                  <Heart className={`h-7 w-7 ${style.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                  <h3 className="font-semibold text-lg">{bookmark.dua_title}</h3>
                                  {bookmark.category && (
                                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                      {bookmark.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => removeBookmark(bookmark.id, 'dua')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-3 pl-[72px]">
                              {bookmark.dua_arabic && (
                                <p 
                                  className={`text-2xl leading-loose text-right ${settings.fontType === 'quran' ? 'quran-font' : 'font-arabic'}`}
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
                          </div>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookmarks;
