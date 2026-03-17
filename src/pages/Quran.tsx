import React, { useState, useEffect, useMemo } from 'react';
import RamadanQuranPlan from '@/components/RamadanQuranPlan';
import { isRamadan } from '@/components/RamadanBanner';
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
  FileText,
  Navigation,
  ChevronDown,
  ChevronRight,
  Star,
  X,
  Layers
} from 'lucide-react';
import { fetchSurahs, Surah, getFirstAyahOfPage, clearSurahsCache } from '@/lib/quran-api';
import { getPageRangeDisplay, getJuzDisplay, toArabicNumerals, SURAH_JUZ } from '@/lib/surah-pages';
import { JUZ_BOUNDARIES } from '@/lib/juz-data';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type FilterType = 'all' | 'meccan' | 'medinan' | 'bookmarked' | 'inprogress';

const POPULAR_SURAHS = [
  { number: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha' },
  { number: 36, nameAr: 'يس', nameEn: 'Ya-Sin' },
  { number: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman' },
  { number: 67, nameAr: 'الملك', nameEn: 'Al-Mulk' },
  { number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf' },
  { number: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqia' },
  { number: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas' },
  { number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqara' },
];

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
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [juzInput, setJuzInput] = useState('');
  const [groupByJuz, setGroupByJuz] = useState(false);
  const [expandedJuz, setExpandedJuz] = useState<Set<number>>(new Set());

  const isArabic = settings.language === 'ar';

  const filterTabs: { key: FilterType; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'meccan', labelAr: 'مكية', labelEn: 'Meccan' },
    { key: 'medinan', labelAr: 'مدنية', labelEn: 'Medinan' },
    { key: 'bookmarked', labelAr: 'المحفوظة', labelEn: 'Bookmarked' },
    { key: 'inprogress', labelAr: 'قيد القراءة', labelEn: 'In Progress' },
  ];

  useEffect(() => {
    loadSurahs();
    loadProgress();
    loadBookmarks();
    loadLastViewed();
    localStorage.removeItem('quran_last_position');
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      let baseFiltered = surahs;

      // Apply active filter first
      switch (activeFilter) {
        case 'meccan':
          baseFiltered = surahs.filter(s => s.revelationType === 'Meccan');
          break;
        case 'medinan':
          baseFiltered = surahs.filter(s => s.revelationType === 'Medinan');
          break;
        case 'bookmarked':
          baseFiltered = surahs.filter(s => bookmarkedSurahs.has(s.number));
          break;
        case 'inprogress':
          baseFiltered = surahs.filter(s => progress[s.number] && progress[s.number] > 0 && progress[s.number] < s.numberOfAyahs);
          break;
      }

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
        
        const filtered = baseFiltered.filter(s => {
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
        setFilteredSurahs(baseFiltered);
        setPageSuggestion(null);
      }
    };

    handleSearch();
  }, [searchTerm, surahs, activeFilter, bookmarkedSurahs, progress]);

  // Group surahs by Juz
  const surahsByJuz = useMemo(() => {
    const grouped: Record<number, Surah[]> = {};
    for (let i = 1; i <= 30; i++) {
      grouped[i] = [];
    }
    filteredSurahs.forEach(surah => {
      const juz = SURAH_JUZ[surah.number] || 1;
      if (!grouped[juz]) grouped[juz] = [];
      grouped[juz].push(surah);
    });
    return grouped;
  }, [filteredSurahs]);

  // Compute Juz cards for Juz display mode
  const juzCards = useMemo(() => {
    if (settings.quranDisplayMode !== 'juz' || surahs.length === 0) return [];
    
    return JUZ_BOUNDARIES.map(boundary => {
      const juzSurahs: (Surah & { startAyah: number; endAyah: number })[] = [];
      
      for (let s = boundary.start.surah; s <= boundary.end.surah; s++) {
        const surah = surahs.find(su => su.number === s);
        if (surah) {
          juzSurahs.push({
            ...surah,
            startAyah: s === boundary.start.surah ? boundary.start.ayah : 1,
            endAyah: s === boundary.end.surah ? boundary.end.ayah : surah.numberOfAyahs,
          });
        }
      }
      
      let totalAyahs = 0;
      let readAyahs = 0;
      juzSurahs.forEach(s => {
        const juzAyahsCount = s.endAyah - s.startAyah + 1;
        totalAyahs += juzAyahsCount;
        const userProgress = progress[s.number] || 0;
        const readInJuz = Math.max(0, Math.min(userProgress, s.endAyah) - s.startAyah + 1);
        readAyahs += Math.max(0, readInJuz);
      });
      
      return {
        juz: boundary.juz,
        surahs: juzSurahs,
        totalAyahs,
        readAyahs,
        progressPercent: totalAyahs > 0 ? (readAyahs / totalAyahs) * 100 : 0,
      };
    });
  }, [settings.quranDisplayMode, surahs, progress]);

  const renderJuzCard = (juzInfo: typeof juzCards[0]) => {
    const { juz, surahs: juzSurahs, totalAyahs, readAyahs, progressPercent } = juzInfo;
    const uniqueNames = [...new Set(juzSurahs.map(s => isArabic ? s.name : s.englishName))];
    
    return (
      <Link key={juz} to={`/quran/juz/${juz}`} className="block animate-fade-in group">
        <div className="glass-card-elevated rounded-2xl p-5 smooth-transition hover-lift hover:border-primary/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/3 rounded-full blur-2xl opacity-0 group-hover:opacity-100 smooth-transition" />
          <div className="flex items-start gap-4 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/8 flex items-center justify-center border border-primary/10 group-hover:scale-105 smooth-spring">
              <span className="text-primary font-bold text-sm">
                {isArabic ? toArabicNumerals(juz) : juz}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold leading-tight">
                {isArabic ? `الجزء ${toArabicNumerals(juz)}` : `Juz ${juz}`}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {uniqueNames.join(' \u2022 ')}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                <span className="font-medium">{isArabic ? `${toArabicNumerals(totalAyahs)} آية` : `${totalAyahs} ayahs`}</span>
              </div>
            </div>
          </div>
          {progressPercent > 0 && (
            <div className="mt-4 pt-3 border-t border-border/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {isArabic 
                    ? `${toArabicNumerals(readAyahs)} من ${toArabicNumerals(totalAyahs)} آية`
                    : `${readAyahs} of ${totalAyahs} ayahs`}
                </span>
                <span className="text-primary font-bold">{progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          )}
        </div>
      </Link>
    );
  };

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

  const handleQuickNavPage = async () => {
    const page = parseInt(pageInput);
    if (isNaN(page) || page < 1 || page > 604) {
      toast.error(isArabic ? 'رقم الصفحة غير صالح' : 'Invalid page number');
      return;
    }
    try {
      const firstAyah = await getFirstAyahOfPage(page);
      if (firstAyah) {
        navigate(`/quran/${firstAyah.surahNumber}?ayah=${firstAyah.ayahNumber}`);
        setQuickNavOpen(false);
        setPageInput('');
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleQuickNavJuz = () => {
    const juzNum = parseInt(juzInput);
    if (isNaN(juzNum) || juzNum < 1 || juzNum > 30) {
      toast.error(isArabic ? 'رقم الجزء غير صالح' : 'Invalid juz number');
      return;
    }
    if (settings.quranDisplayMode === 'juz') {
      navigate(`/quran/juz/${juzNum}`);
    } else {
      const firstSurahOfJuz = Object.entries(SURAH_JUZ).find(([_, juz]) => juz === juzNum);
      if (firstSurahOfJuz) {
        navigate(`/quran/${firstSurahOfJuz[0]}`);
      }
    }
    setQuickNavOpen(false);
    setJuzInput('');
  };

  const toggleJuzExpanded = (juz: number) => {
    setExpandedJuz(prev => {
      const newSet = new Set(prev);
      if (newSet.has(juz)) {
        newSet.delete(juz);
      } else {
        newSet.add(juz);
      }
      return newSet;
    });
  };

  const renderSurahCard = (surah: Surah, index: number) => {
    const surahProgress = progress[surah.number] || 0;
    const surahProgressPercent = (surahProgress / surah.numberOfAyahs) * 100;
    const isBookmarked = bookmarkedSurahs.has(surah.number);
    const isMeccan = surah.revelationType === 'Meccan';

    return (
      <Link
        key={surah.number}
        to={`/quran/${surah.number}`}
        className="block animate-fade-in group"
        style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
      >
        <div className={`glass-card-elevated rounded-2xl p-5 smooth-transition hover-lift relative overflow-hidden ${isBookmarked ? 'border-primary/30 bg-primary/3' : ''} hover:border-primary/25`}>
          {isBookmarked && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
          )}
          <div className="flex items-start gap-4 relative">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/8 flex items-center justify-center border border-primary/10 group-hover:scale-105 smooth-spring ${surahProgressPercent >= 100 ? 'from-islamic-emerald/20 to-islamic-emerald/8 border-islamic-emerald/15' : ''}`}>
              <span className={`font-bold text-sm tabular-nums ${surahProgressPercent >= 100 ? 'text-islamic-emerald' : 'text-primary'}`}>
                {isArabic ? toArabicNumerals(surah.number) : surah.number}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className={`text-lg font-bold leading-tight ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
                    {isArabic ? surah.name : surah.englishName}
                  </h3>
                  {!isArabic && (
                    <p className="text-sm text-muted-foreground mt-0.5">{surah.name}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {playingSurah === surah.number && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
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
                      className="h-8 w-8 rounded-full hover:bg-destructive/10"
                      onClick={(e) => handleResetClick(surah.number, e)}
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive smooth-transition" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={(e) => toggleSurahBookmark(surah.number, e)}
                  >
                    <Bookmark className={`h-4 w-4 smooth-transition ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>
              
              {!isArabic && (
                <p className="text-xs text-muted-foreground mb-2">{surah.englishNameTranslation}</p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium">
                  {isArabic 
                    ? `${toArabicNumerals(surah.numberOfAyahs)} آية`
                    : `${surah.numberOfAyahs} verses`}
                </span>
                
                <span className="text-border/60">•</span>
                
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
                
                <span className="text-border/60">•</span>
                
                <span>{getPageRangeDisplay(surah.number, settings.language)}</span>
                
                <span className="text-border/60">•</span>
                
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {getJuzDisplay(surah.number, settings.language)}
                </span>
              </div>
            </div>
          </div>

          {surahProgressPercent > 0 && (
            <div className="mt-4 pt-3 border-t border-border/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {isArabic 
                    ? `الآية ${toArabicNumerals(surahProgress)} من ${toArabicNumerals(surah.numberOfAyahs)}`
                    : `Ayah ${surahProgress} of ${surah.numberOfAyahs}`}
                </span>
                <span className="text-primary font-bold">{surahProgressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={surahProgressPercent} className="h-1.5" />
            </div>
          )}
        </div>
      </Link>
    );
  };

  if (loading) {
    return <IslamicFactsLoader />;
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <div className="relative pt-10 pb-6 px-4 animate-fade-in">
        <div className="absolute inset-0 overflow-hidden pointer-events-none islamic-pattern-subtle opacity-40" />

        <div className="absolute -top-8 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-glow-breathe" />
        <div className="absolute -top-4 right-1/4 w-56 h-56 bg-islamic-emerald/6 rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }} />

        <div className="relative text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card-elevated animate-text-reveal">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-glow-pulse" />
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              {isArabic ? '١١٤ سورة' : '114 Surahs'}
            </span>
          </div>

          <div className="relative animate-text-reveal" style={{ animationDelay: '100ms' }}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight relative z-10 ios-26-style">
              <span className={`bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-sm ${isArabic ? 'arabic-regal' : ''}`} style={{ lineHeight: '1.2' }}>
                {isArabic ? 'القرآن الكريم' : 'The Holy Quran'}
              </span>
            </h1>
            <div className="absolute inset-0 blur-3xl opacity-15 bg-gradient-to-r from-primary/40 via-islamic-emerald/30 to-primary/40 -z-10" />
          </div>

          <p className="text-sm text-muted-foreground font-light tracking-wide animate-text-reveal" style={{ animationDelay: '200ms' }}>
            {isArabic ? 'اختر سورة للقراءة والتدبر' : 'Select a surah to read and reflect'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <div className="relative max-w-2xl mx-auto">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 ${isArabic ? 'right-4' : 'left-4'}`} />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground smooth-transition ${isArabic ? 'left-4' : 'right-4'}`}
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isArabic ? 'ابحث عن سورة أو رقم الصفحة...' : 'Search surah name or page number (1-604)...'}
            className={`h-13 rounded-2xl glass-card-elevated border-border/30 hover:border-primary/20 focus:border-primary/40 smooth-transition text-base ${isArabic ? 'pr-12 text-right' : 'pl-12'} ${searchTerm ? (isArabic ? 'pl-10' : 'pr-10') : ''}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-2xl mx-auto scrollbar-hide">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                if (activeFilter === tab.key && tab.key !== 'all') {
                  setActiveFilter('all');
                } else {
                  setActiveFilter(tab.key);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap smooth-transition ${
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground primary-glow'
                  : 'glass-card border-border/20 hover:border-primary/20 text-muted-foreground hover:text-foreground'
              }`}
            >
              {isArabic ? tab.labelAr : tab.labelEn}
            </button>
          ))}
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
          <div className="px-4 mb-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div 
              className="glass-card-elevated rounded-2xl p-5 border-primary/20 cursor-pointer hover-lift smooth-transition max-w-2xl mx-auto relative overflow-hidden group"
              onClick={() => {
                if (settings.quranDisplayMode === 'juz') {
                  const juz = JUZ_BOUNDARIES.find(b => 
                    displaySurah.number >= b.start.surah && displaySurah.number <= b.end.surah
                  );
                  if (juz) navigate(`/quran/juz/${juz.juz}`);
                } else if (displayProgress > 0) {
                  navigate(`/quran/${displaySurah.number}?ayah=${displayProgress}`);
                } else {
                  navigate(`/quran/${displaySurah.number}`);
                }
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between gap-4 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center icon-badge group-hover:scale-105 smooth-spring">
                    <span className="text-primary-foreground font-bold relative z-10 text-sm">
                      {isArabic ? toArabicNumerals(displaySurah.number) : displaySurah.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xs font-bold text-primary mb-0.5 uppercase tracking-widest">
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
                      className="h-10 w-10 rounded-full"
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
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 smooth-transition">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              {displayProgress > 0 && (
                <div className="mt-4 pt-3 border-t border-border/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">
                      {isArabic 
                        ? `الآية ${toArabicNumerals(displayProgress)} من ${toArabicNumerals(displaySurah.numberOfAyahs)}`
                        : `Ayah ${displayProgress} of ${displaySurah.numberOfAyahs}`}
                    </span>
                    <span className="text-primary font-bold">
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
        <div className="px-4 mb-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="glass-card-elevated rounded-2xl p-5 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/3 via-transparent to-islamic-emerald/3" />
            <div className="flex items-center justify-between mb-3 relative">
              <span className="text-sm font-bold">
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

      {/* Finish Quran in Ramadan */}
      {isRamadan() && (
        <div className="px-4 mb-6 max-w-2xl mx-auto">
          <RamadanQuranPlan />
        </div>
      )}

      {/* Main List */}
      <div className="space-y-3 px-4 max-w-2xl mx-auto" style={{ animationDelay: '300ms' }}>
        {settings.quranDisplayMode === 'juz' ? (
          juzCards
            .filter(juz => {
              if (!searchTerm.trim()) return true;
              const num = parseInt(searchTerm);
              if (!isNaN(num)) return juz.juz === num;
              const term = searchTerm.toLowerCase();
              return juz.surahs.some(s => 
                s.englishName.toLowerCase().includes(term) || s.name.includes(searchTerm)
              );
            })
            .map(juzInfo => renderJuzCard(juzInfo))
        ) : (
          filteredSurahs.map((surah, index) => renderSurahCard(surah, index))
        )}
      </div>

      {/* Floating Quick Navigate Button */}
      <button
        onClick={() => setQuickNavOpen(true)}
        className="fixed bottom-[6.5rem] right-4 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground primary-glow flex items-center justify-center hover:scale-110 active:scale-95 smooth-spring z-50"
      >
        <Navigation className="h-4 w-4" />
      </button>

      {/* Quick Navigate Dialog */}
      <Dialog open={quickNavOpen} onOpenChange={setQuickNavOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isArabic ? 'التنقل السريع' : 'Quick Navigate'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Go to Page */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'اذهب إلى الصفحة' : 'Go to Page'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={604}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder={isArabic ? '١-٦٠٤' : '1-604'}
                  className="flex-1"
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <Button onClick={handleQuickNavPage} disabled={!pageInput}>
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Go to Juz */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'اذهب إلى الجزء' : 'Go to Juz'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={juzInput}
                  onChange={(e) => setJuzInput(e.target.value)}
                  placeholder={isArabic ? '١-٣٠' : '1-30'}
                  className="flex-1"
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <Button onClick={handleQuickNavJuz} disabled={!juzInput}>
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Popular Surahs */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'السور الشائعة' : 'Popular Surahs'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_SURAHS.map(surah => (
                  <button
                    key={surah.number}
                    onClick={() => {
                      navigate(`/quran/${surah.number}`);
                      setQuickNavOpen(false);
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl glass-effect border border-border/30 hover:border-primary/30 smooth-transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {isArabic ? surah.nameAr : surah.nameEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? toArabicNumerals(surah.number) : surah.number}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
