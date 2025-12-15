import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Pause, 
  Play, 
  Search, 
  RotateCcw, 
  BookOpen,
  Sparkles,
  Building2,
  TreePalm,
  FileText
} from 'lucide-react';
import { fetchSurahs, Surah, getFirstAyahOfPage, clearSurahsCache } from '@/lib/quran-api';
import { getPageRangeDisplay, getJuzDisplay, toArabicNumerals } from '@/lib/surah-pages';
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
} from '@/components/ui/alert-dialog';

const Quran = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playingSurah, isPlaying, pauseSurah, resumeSurah } = useAudio();
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

  const isArabic = settings.language === 'ar';

  useEffect(() => {
    loadSurahs();
    loadProgress();
    loadBookmarks();
    loadLastViewed();
    localStorage.removeItem('quran_last_position');
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim()) {
        const pageNumber = parseInt(searchTerm);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= 604) {
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
        
        setPageSuggestion(null);
        
        const normalizeArabic = (text: string) => {
          return text
            .normalize('NFKC')
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/[ًٌٍَُِّْٰ]/g, '')
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
  }, [searchTerm, surahs]);

  const loadSurahs = async (clearCache = false) => {
    setLoading(true);
    try {
      if (clearCache) {
        clearSurahsCache();
      }
      
      const data = await fetchSurahs();
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No surahs data received');
      }
      
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error(
        isArabic 
          ? `فشل في تحميل السور. ${errorMessage}`
          : `Failed to load surahs. ${errorMessage}`,
        {
          action: {
            label: isArabic ? 'إعادة المحاولة' : 'Retry',
            onClick: () => loadSurahs(true)
          },
          duration: 15000
        }
      );
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
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    setSurahToReset(surahNumber);
    setResetDialogOpen(true);
  };

  const confirmResetSurahProgress = async () => {
    if (!surahToReset || !user) return;

    try {
      const { error: dbError } = await supabase
        .from('reading_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahToReset);

      if (dbError) throw dbError;

      await supabase
        .from('ayah_interactions')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahToReset);

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

      await loadProgress();

      toast.success(isArabic ? 'تم إعادة التعيين' : 'Progress reset');
      setResetDialogOpen(false);
      setSurahToReset(null);
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast.error(isArabic ? 'فشل إعادة التعيين' : 'Failed to reset progress');
    }
  };

  const toggleSurahBookmark = async (surahNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
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
        toast.success(isArabic ? 'تمت الإزالة' : 'Removed');
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: surahNumber,
            bookmark_type: 'surah'
          });
        
        setBookmarkedSurahs(prev => new Set([...prev, surahNumber]));
        toast.success(isArabic ? 'تمت الإضافة' : 'Added');
      }
      
      await loadBookmarks();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  if (loading) {
    return <IslamicFactsLoader />;
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <div className="relative pt-12 pb-8 px-4 animate-fade-in">
        {/* Decorative Islamic Pattern Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="islamic-pattern-quran" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0 L20 10 L10 20 L0 10 Z M10 5 L15 10 L10 15 L5 10 Z" fill="currentColor"/>
            </pattern>
            <rect width="100" height="100" fill="url(#islamic-pattern-quran)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        <div className="relative text-center space-y-4 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary tracking-wider">
              {isArabic ? '١١٤ سورة' : '114 Surahs'}
            </span>
          </div>

          {/* Main Title */}
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight relative z-10">
              <span className={`bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-sm ${isArabic ? 'arabic-regal' : ''}`} style={{ lineHeight: '1.2' }}>
                {isArabic ? 'القرآن الكريم' : 'The Holy Quran'}
              </span>
            </h1>
            <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-primary/50 via-emerald-500/50 to-primary/50 -z-10" />
          </div>

          {/* Subtitle */}
          <p className="text-base text-muted-foreground font-light tracking-wide">
            {isArabic ? 'اختر سورة للقراءة والتدبر' : 'Select a surah to read and reflect'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isArabic ? 'right-4' : 'left-4'}`} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isArabic ? 'ابحث عن سورة أو رقم الصفحة...' : 'Search surah name or page number (1-604)...'}
            className={`h-14 rounded-2xl glass-effect border-border/30 hover:border-primary/30 smooth-transition text-base backdrop-blur-xl shadow-lg ${isArabic ? 'pr-12 text-right' : 'pl-12'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Page Navigation Suggestion */}
      {pageSuggestion && (
        <div className="px-4 mb-6">
          <div 
            onClick={() => {
              navigate(`/quran/${pageSuggestion.surahNumber}?ayah=${pageSuggestion.ayahNumber}`);
              setSearchTerm('');
              setPageSuggestion(null);
            }}
            className="glass-effect rounded-2xl p-5 cursor-pointer hover:scale-[1.01] smooth-transition border border-primary/30 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">
                    {isArabic ? `الصفحة ${toArabicNumerals(pageSuggestion.pageNumber)}` : `Page ${pageSuggestion.pageNumber}`}
                  </p>
                  <p className="font-semibold">
                    {isArabic 
                      ? surahs.find(s => s.number === pageSuggestion.surahNumber)?.name
                      : surahs.find(s => s.number === pageSuggestion.surahNumber)?.englishName}
                  </p>
                </div>
              </div>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Continue Reading Card */}
      {lastViewedSurah && surahs.length > 0 && (() => {
        const currentSurah = surahs.find(s => s.number === lastViewedSurah);
        const currentProgress = progress[lastViewedSurah] || 0;
        const isCompleted = currentSurah && currentProgress >= currentSurah.numberOfAyahs;
        
        const displaySurah = isCompleted && lastViewedSurah < 114 
          ? surahs.find(s => s.number === lastViewedSurah + 1)
          : currentSurah;
        
        if (!displaySurah) return null;
        
        const displayProgress = progress[displaySurah.number] || 0;
        
        return (
          <div className="px-4 mb-6">
            <div 
              className="glass-effect rounded-2xl p-5 border border-primary/30 apple-shadow cursor-pointer hover:scale-[1.01] smooth-transition max-w-2xl mx-auto"
              onClick={() => {
                if (displayProgress > 0) {
                  navigate(`/quran/${displaySurah.number}?ayah=${displayProgress}`);
                } else {
                  navigate(`/quran/${displaySurah.number}`);
                }
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold">
                      {isArabic ? toArabicNumerals(displaySurah.number) : displaySurah.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                      {isArabic ? 'متابعة القراءة' : 'Continue Reading'}
                    </p>
                    <h3 className={`text-xl font-bold ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
                      {isArabic ? displaySurah.name : displaySurah.englishName}
                    </h3>
                    {!isArabic && (
                      <p className="text-sm text-muted-foreground">{displaySurah.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {playingSurah === displaySurah.number && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        isPlaying ? pauseSurah() : resumeSurah();
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-primary" />
                      ) : (
                        <Play className="h-5 w-5 text-primary" />
                      )}
                    </Button>
                  )}
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              {displayProgress > 0 && (
                <div className="mt-4 pt-3 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">
                      {isArabic 
                        ? `الآية ${toArabicNumerals(displayProgress)} من ${toArabicNumerals(displaySurah.numberOfAyahs)}`
                        : `Ayah ${displayProgress} of ${displaySurah.numberOfAyahs}`}
                    </span>
                    <span className="text-primary font-semibold">
                      {((displayProgress / displaySurah.numberOfAyahs) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(displayProgress / displaySurah.numberOfAyahs) * 100} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Overall Progress */}
      {overallProgress > 0 && (
        <div className="px-4 mb-6">
          <div className="glass-effect rounded-2xl p-5 border border-border/30 apple-shadow max-w-2xl mx-auto backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">
                {isArabic ? 'التقدم الإجمالي' : 'Overall Progress'}
              </span>
              <span className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      )}

      {/* Surah List */}
      <div className="space-y-3 px-4 max-w-2xl mx-auto">
        {filteredSurahs.map((surah, index) => {
          const surahProgress = progress[surah.number] || 0;
          const surahProgressPercent = (surahProgress / surah.numberOfAyahs) * 100;
          const isBookmarked = bookmarkedSurahs.has(surah.number);
          const isMeccan = surah.revelationType === 'Meccan';

          return (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="block animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <div className={`glass-effect rounded-2xl p-5 smooth-transition hover:scale-[1.01] apple-shadow hover:shadow-xl border ${isBookmarked ? 'border-primary/40 bg-primary/5' : 'border-border/30'} hover:border-primary/30 backdrop-blur-xl`}>
                <div className="flex items-start gap-4">
                  {/* Surah Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-md">
                    <span className="text-primary font-bold">
                      {isArabic ? toArabicNumerals(surah.number) : surah.number}
                    </span>
                  </div>

                  {/* Surah Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className={`text-lg font-semibold leading-tight ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
                          {isArabic ? surah.name : surah.englishName}
                        </h3>
                        {!isArabic && (
                          <p className="text-sm text-muted-foreground mt-0.5">{surah.name}</p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {playingSurah === surah.number && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
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
                            className="h-8 w-8"
                            onClick={(e) => handleResetClick(surah.number, e)}
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => toggleSurahBookmark(surah.number, e)}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Translation - Only for English */}
                    {!isArabic && (
                      <p className="text-xs text-muted-foreground mb-2">{surah.englishNameTranslation}</p>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                      {/* Verse Count */}
                      <span className="flex items-center gap-1">
                        {isArabic 
                          ? `${toArabicNumerals(surah.numberOfAyahs)} آية`
                          : `${surah.numberOfAyahs} verses`}
                      </span>
                      
                      <span className="text-border">•</span>
                      
                      {/* Revelation Type with Icon */}
                      <span className="flex items-center gap-1">
                        {isMeccan ? (
                          <Building2 className="h-3 w-3" />
                        ) : (
                          <TreePalm className="h-3 w-3" />
                        )}
                        {isArabic 
                          ? (isMeccan ? 'مكية' : 'مدنية')
                          : surah.revelationType}
                      </span>
                      
                      <span className="text-border">•</span>
                      
                      {/* Page Range */}
                      <span>{getPageRangeDisplay(surah.number, settings.language)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {surahProgressPercent > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {isArabic 
                          ? `الآية ${toArabicNumerals(surahProgress)} من ${toArabicNumerals(surah.numberOfAyahs)}`
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

      {/* Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? 'سيتم حذف تقدمك في قراءة هذه السورة. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will delete your reading progress for this surah. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetSurahProgress} className="bg-destructive hover:bg-destructive/90">
              {isArabic ? 'إعادة التعيين' : 'Reset'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quran;
