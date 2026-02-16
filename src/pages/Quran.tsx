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
    // Find first surah of the juz
    const firstSurahOfJuz = Object.entries(SURAH_JUZ).find(([_, juz]) => juz === juzNum);
    if (firstSurahOfJuz) {
      navigate(`/quran/${firstSurahOfJuz[0]}`);
      setQuickNavOpen(false);
      setJuzInput('');
    }
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
                
                <span className="text-border">•</span>
                
                {/* Juz */}
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {getJuzDisplay(surah.number, settings.language)}
                </span>
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
      <div className="px-4 mb-4">
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

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-2xl mx-auto scrollbar-hide">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                // Toggle off if clicking the same filter (except 'all')
                if (activeFilter === tab.key && tab.key !== 'all') {
                  setActiveFilter('all');
                } else {
                  setActiveFilter(tab.key);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap smooth-transition ${
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'glass-effect border border-border/30 hover:border-primary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {isArabic ? tab.labelAr : tab.labelEn}
            </button>
          ))}
          <button
            onClick={() => setGroupByJuz(!groupByJuz)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap smooth-transition flex items-center gap-2 ${
              groupByJuz
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'glass-effect border border-border/30 hover:border-primary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="h-4 w-4" />
            {isArabic ? 'تجميع حسب الجزء' : 'Group by Juz'}
          </button>
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

      {/* Finish Quran in Ramadan */}
      {isRamadan() && (
        <div className="px-4 mb-6 max-w-2xl mx-auto">
          <RamadanQuranPlan />
        </div>
      )}

      {/* Surah List */}
      <div className="space-y-3 px-4 max-w-2xl mx-auto">
        {groupByJuz ? (
          // Grouped by Juz
          Object.entries(surahsByJuz)
            .filter(([_, surahs]) => surahs.length > 0)
            .map(([juz, juzSurahs]) => (
              <Collapsible
                key={juz}
                open={expandedJuz.has(parseInt(juz))}
                onOpenChange={() => toggleJuzExpanded(parseInt(juz))}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">
                          {isArabic ? `الجزء ${toArabicNumerals(parseInt(juz))}` : `Juz ${juz}`}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? `${toArabicNumerals(juzSurahs.length)} سورة` : `${juzSurahs.length} surahs`}
                        </p>
                      </div>
                    </div>
                    {expandedJuz.has(parseInt(juz)) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3">
                  {juzSurahs.map((surah, index) => renderSurahCard(surah, index))}
                </CollapsibleContent>
              </Collapsible>
            ))
        ) : (
          // Flat list
          filteredSurahs.map((surah, index) => renderSurahCard(surah, index))
        )}
      </div>

      {/* Floating Quick Navigate Button */}
      <button
        onClick={() => setQuickNavOpen(true)}
        className="fixed bottom-24 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 smooth-transition z-50"
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
