import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Volume2, Pause, Play, Search, RotateCcw, Share2, ArrowRight, BookOpen } from 'lucide-react';
import { fetchSurahs, Surah, getFirstAyahOfPage } from '@/lib/quran-api';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { IslamicFactsLoader } from '@/components/IslamicFactsLoader';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Quran = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playingSurah, isPlaying, playSurah, pauseSurah, resumeSurah, stopSurah } = useAudio();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<Set<number>>(new Set());
  const [lastViewedSurah, setLastViewedSurah] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [surahToReset, setSurahToReset] = useState<number | null>(null);
  const [pageSuggestion, setPageSuggestion] = useState<{pageNumber: number, surahNumber: number, ayahNumber: number} | null>(null);

  useEffect(() => {
    loadSurahs();
    loadProgress();
    loadBookmarks();
    loadLastViewed();
    
    // Clear saved position when viewing Quran home
    localStorage.removeItem('quran_last_position');
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim()) {
        // Check if search is a page number (1-604)
        const pageNumber = parseInt(searchTerm);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= 604) {
          // Load page suggestion
          try {
            const firstAyah = await getFirstAyahOfPage(pageNumber);
            if (firstAyah) {
              setPageSuggestion({
                pageNumber,
                surahNumber: firstAyah.surahNumber,
                ayahNumber: firstAyah.ayahNumber
              });
              setFilteredSurahs([]);
              return;
            }
          } catch (error) {
            console.error('Error loading page suggestion:', error);
          }
        }
        
        // Clear page suggestion if not a page number
        setPageSuggestion(null);
        
        // Normalize and remove diacritics for better Arabic matching
        const normalizeArabic = (text: string) => {
          return text
            .normalize('NFKC') // Normalize Unicode
            .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics
            .replace(/[ًٌٍَُِّْٰ]/g, '') // Remove more diacritics
            .trim();
        };
        
        const normalizedSearch = normalizeArabic(searchTerm.toLowerCase());
        
        const filtered = surahs.filter(s => {
          const englishName = s.englishName.toLowerCase();
          const arabicName = normalizeArabic(s.name.toLowerCase());
          const translation = s.englishNameTranslation.toLowerCase();
          const numberMatch = s.number.toString() === searchTerm;
          
          return englishName.includes(normalizedSearch) ||
                 arabicName.includes(normalizedSearch) ||
                 translation.includes(normalizedSearch) ||
                 numberMatch;
        });
        
        setFilteredSurahs(filtered);
      } else {
        setFilteredSurahs(surahs);
        setPageSuggestion(null);
      }
    };

    handleSearch();
  }, [searchTerm, surahs, navigate]);

  const loadSurahs = async () => {
    setLoading(true);
    try {
      const data = await fetchSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
      toast.error('Failed to load surahs');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', session.user.id);

    if (data && !error) {
      const progressMap: Record<number, number> = {};
      let totalAyahs = 6236;
      let completedAyahs = 0;

      data.forEach(p => {
        progressMap[p.surah_number] = p.ayah_number;
        completedAyahs += p.ayah_number;
      });

      setProgress(progressMap);
      setOverallProgress((completedAyahs / totalAyahs) * 100);
    }
  };

  const loadBookmarks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from('bookmarks')
      .select('surah_number')
      .eq('user_id', session.user.id)
      .eq('bookmark_type', 'surah');

    if (data) {
      setBookmarkedSurahs(new Set(data.map(b => b.surah_number)));
    }
  };

  const loadLastViewed = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from('last_viewed_surah')
      .select('surah_number')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (data?.surah_number) {
      setLastViewedSurah(data.surah_number);
    }
  };

  const handleResetClick = (surahNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    setSurahToReset(surahNumber);
    setResetDialogOpen(true);
  };

  const confirmResetSurahProgress = async () => {
    if (!surahToReset || !user) return;

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('reading_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahToReset);

      if (dbError) throw dbError;

      // Delete ayah interactions for this surah
      await supabase
        .from('ayah_interactions')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahToReset);

      // Clear localStorage for this surah
      const savedPosition = localStorage.getItem('quran_last_position');
      if (savedPosition) {
        try {
          const position = JSON.parse(savedPosition);
          if (position.surahNumber === surahToReset) {
            localStorage.removeItem('quran_last_position');
          }
        } catch (e) {
          console.error('Error parsing saved position:', e);
        }
      }

      // Reload progress from database to ensure sync
      await loadProgress();

      toast.success(settings.language === 'ar' ? 'تم إعادة التعيين' : 'Progress reset');
      setResetDialogOpen(false);
      setSurahToReset(null);
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast.error(settings.language === 'ar' ? 'فشل إعادة التعيين' : 'Failed to reset progress');
    }
  };

  const handleShareSurah = async (surahNumber: number, surahName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/quran/${surahNumber}`;
    const title = `${surahName} - ${settings.language === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(settings.language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleSurahBookmark = async (surahNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      const isBookmarked = bookmarkedSurahs.has(surahNumber);
      
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', surahNumber)
          .eq('bookmark_type', 'surah');
        
        setBookmarkedSurahs(prev => {
          const newSet = new Set(prev);
          newSet.delete(surahNumber);
          return newSet;
        });
        toast.success(settings.language === 'ar' ? 'تمت الإزالة' : 'Removed');
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: surahNumber,
            bookmark_type: 'surah'
          });
        
        setBookmarkedSurahs(prev => new Set([...prev, surahNumber]));
        toast.success(settings.language === 'ar' ? 'تمت الإضافة' : 'Added');
      }
      
      // Reload bookmarks to ensure sync
      await loadBookmarks();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  if (loading) {
    return <IslamicFactsLoader />;
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="text-center space-y-4 py-8 px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-sm">
            {settings.language === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar' 
            ? 'اختر سورة للقراءة'
            : 'Select a surah to read'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={settings.language === 'ar' ? 'ابحث عن سورة أو رقم الصفحة...' : 'Search for a surah or page number...'}
            className="pl-12 h-16 rounded-3xl glass-effect border-border/30 hover:border-primary/30 smooth-transition text-base backdrop-blur-xl shadow-lg"
          />
        </div>
      </div>

      {/* Page Suggestion */}
      {pageSuggestion && (
        <div className="px-4">
          <div 
            onClick={() => {
              navigate(`/quran/${pageSuggestion.surahNumber}?ayah=${pageSuggestion.ayahNumber}`);
              setSearchTerm('');
              setPageSuggestion(null);
            }}
            className="glass-effect rounded-2xl p-6 cursor-pointer hover:scale-[1.02] smooth-transition border border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {settings.language === 'ar' ? `الصفحة ${pageSuggestion.pageNumber}` : `Page ${pageSuggestion.pageNumber}`}
                </p>
                <p className="text-lg font-semibold">
                  {settings.language === 'ar' ? 'اذهب إلى هذه الصفحة' : 'Go to this page'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {settings.language === 'ar' 
                    ? `سورة ${surahs.find(s => s.number === pageSuggestion.surahNumber)?.name || pageSuggestion.surahNumber} - آية ${pageSuggestion.ayahNumber}`
                    : `Surah ${surahs.find(s => s.number === pageSuggestion.surahNumber)?.englishName || pageSuggestion.surahNumber} - Ayah ${pageSuggestion.ayahNumber}`}
                </p>
              </div>
              <Search className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      )}

      {lastViewedSurah && surahs.length > 0 && (() => {
        const currentSurah = surahs.find(s => s.number === lastViewedSurah);
        const currentProgress = progress[lastViewedSurah] || 0;
        const isCompleted = currentSurah && currentProgress >= currentSurah.numberOfAyahs;
        
        // If completed, show next surah
        const displaySurah = isCompleted && lastViewedSurah < 114 
          ? surahs.find(s => s.number === lastViewedSurah + 1)
          : currentSurah;
        
        if (!displaySurah) return null;
        
        const displayProgress = progress[displaySurah.number] || 0;
        
        return (
          <div 
            className="glass-effect rounded-3xl p-6 md:p-8 border border-primary/30 apple-shadow cursor-pointer hover:scale-[1.02] smooth-transition mx-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1" onClick={() => {
                if (displayProgress > 0) {
                  navigate(`/quran/${displaySurah.number}?ayah=${displayProgress}`);
                } else {
                  navigate(`/quran/${displaySurah.number}`);
                }
              }}>
                <p className="text-sm text-muted-foreground mb-2">
                  {settings.language === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}
                </p>
                <h3 className="text-2xl font-bold">
                  {displaySurah[settings.language === 'ar' ? 'name' : 'englishName']}
                </h3>
                {displayProgress > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {settings.language === 'ar' 
                      ? `الآية ${displayProgress}`
                      : `Ayah ${displayProgress}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {playingSurah === displaySurah.number && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      isPlaying ? pauseSurah() : resumeSurah();
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-primary" />
                    ) : (
                      <Play className="h-6 w-6 text-primary" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayProgress > 0) {
                      navigate(`/quran/${displaySurah.number}?ayah=${displayProgress}`);
                    } else {
                      navigate(`/quran/${displaySurah.number}`);
                    }
                  }}
                >
                  <BookOpen className="h-8 w-8 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {overallProgress > 0 && (
        <div className="glass-effect rounded-3xl p-8 space-y-5 border border-border/30 apple-shadow mx-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              {settings.language === 'ar' ? 'التقدم الإجمالي' : 'Overall Progress'}
            </span>
            <span className="text-3xl font-bold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      )}

      <div className="space-y-3 px-4">
        {filteredSurahs.map((surah) => {
          const surahProgress = progress[surah.number] || 0;
          const surahProgressPercent = (surahProgress / surah.numberOfAyahs) * 100;

          return (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="block"
            >
              <div className="glass-effect rounded-3xl p-6 md:p-8 smooth-transition hover:scale-[1.01] apple-shadow hover:shadow-2xl border border-border/30 hover:border-primary/30 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
                    <span className="text-primary font-bold text-lg">{surah.number}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-xl font-semibold ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
                        {settings.language === 'ar' ? surah.name : surah.englishName}
                      </h3>
                      <div className="flex items-center gap-1">
                        {playingSurah === surah.number && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              isPlaying ? pauseSurah() : resumeSurah();
                            }}
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4 text-primary" />
                            ) : (
                              <Play className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                        )}
                        {surahProgressPercent > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={(e) => handleResetClick(surah.number, e)}
                            title={settings.language === 'ar' ? 'إعادة تعيين التقدم' : 'Reset progress'}
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => toggleSurahBookmark(surah.number, e)}
                          title={settings.language === 'ar' ? 'إضافة إشارة مرجعية' : 'Bookmark surah'}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedSurahs.has(surah.number) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {settings.language === 'ar' ? surah.englishName : surah.englishNameTranslation}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        {settings.language === 'ar' 
                          ? `${surah.numberOfAyahs} آية`
                          : `${surah.numberOfAyahs} verses`}
                      </span>
                      <span>•</span>
                      <span>
                        {settings.language === 'ar' 
                          ? (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية')
                          : surah.revelationType}
                      </span>
                    </div>
                  </div>
                </div>

                {surahProgressPercent > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {settings.language === 'ar' 
                          ? `الآية ${surahProgress} من ${surah.numberOfAyahs}`
                          : `Ayah ${surahProgress} of ${surah.numberOfAyahs}`}
                      </span>
                      <span className="text-primary font-semibold">{surahProgressPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={surahProgressPercent} className="h-1.5" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {settings.language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {settings.language === 'ar'
                ? 'سيتم حذف تقدمك في قراءة هذه السورة. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will delete your reading progress for this surah. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {settings.language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetSurahProgress} className="bg-destructive hover:bg-destructive/90">
              {settings.language === 'ar' ? 'إعادة التعيين' : 'Reset'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quran;
