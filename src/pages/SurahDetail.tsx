import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  fetchSurahArabic, 
  fetchSurahTranslation, 
  fetchTafsir, 
  fetchWordByWord,
  getAyahAudioUrl,
  WordData,
  fetchSurahs,
  getPageNumber
} from '@/lib/quran-api';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  ChevronDown, 
  Volume2,
  MessageSquare,
  Bookmark,
  Search,
  Eye,
  Share2
} from 'lucide-react';
import { IslamicFactsLoader } from '@/components/IslamicFactsLoader';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AyahChatDialog from '@/components/AyahChatDialog';
import { toast } from 'sonner';
import { useAudio } from '@/contexts/AudioContext';
import DOMPurify from 'dompurify';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialAyah = searchParams.get('ayah');
  const { settings } = useSettings();
  const { playingSurah, playingAyah: globalPlayingAyah, isPlaying, playSurah: playGlobalSurah, pauseSurah, resumeSurah, stopSurah } = useAudio();
  
  // State management
  const [surahData, setSurahData] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [openWordPopover, setOpenWordPopover] = useState<string | null>(null);
  const [wordData, setWordData] = useState<Record<number, WordData[]>>({});
  const [tafsirData, setTafsirData] = useState<Record<number, string>>({});
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const [lastVisibleAyah, setLastVisibleAyah] = useState<number>(1);
  const [chatAyah, setChatAyah] = useState<{ text: string; number: number } | null>(null);
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);
  const [isSurahBookmarked, setIsSurahBookmarked] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [nextSurahData, setNextSurahData] = useState<any>(null);
  const [nextSurahProgress, setNextSurahProgress] = useState<number>(0);
  const [ayahPages, setAyahPages] = useState<Record<number, number>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Share helpers (only URL, no title/text) ---
  const shareOrCopy = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      throw new Error('no web share'); // force to clipboard if not supported
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(settings.language === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
      } catch {
        toast.error(settings.language === 'ar' ? 'تعذر مشاركة الرابط' : 'Could not share link');
      }
    }
  };
  const surahUrl = () => `${window.location.origin}/quran/${surahNumber}`;
  const ayahUrl = (ayahNum: number) => `${window.location.origin}/quran/${surahNumber}?ayah=${ayahNum}`;

  useEffect(() => {
    loadSurah();
    setHasRestoredScroll(false);
    setHasUserScrolled(false);
    loadUser();
    loadBookmarks();
    saveLastViewed();
    loadNextSurahInfo();

    if (surahNumber && initialAyah) {
      localStorage.setItem('quran_last_position', JSON.stringify({ 
        surahNumber: parseInt(surahNumber), 
        ayahNumber: parseInt(initialAyah)
      }));
    }

    if (initialAyah) {
      setTimeout(() => {
        const element = document.querySelector(`[data-ayah="${initialAyah}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
    }
  }, [surahNumber, initialAyah, settings.translationEnabled, settings.translationSource]);

  // Restore scroll position after data loads
  useEffect(() => {
    if (!surahData || hasRestoredScroll) return;

    const restoreScroll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !surahNumber) return;

      let ayahNumber: number | null = null;

      const trackingMode = settings.readingTrackingMode;

      if (trackingMode === 'auto') {
        const promises = [
          supabase
            .from('reading_progress')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .maybeSingle(),
          supabase
            .from('bookmarks')
            .select('ayah_number, created_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('bookmark_type', 'ayah')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('ayah_interactions')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('interaction_type', 'recite')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('ayah_interactions')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('interaction_type', 'click')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ];

        const results = await Promise.all(promises);
        
        let mostRecent: { ayah: number; time: string } | null = null;
        
        results.forEach((result, index) => {
          if (result.data) {
            const timeField = index === 0 || index === 2 || index === 3 ? 'updated_at' : 'created_at';
            const time = result.data[timeField] as string;
            const ayah = result.data.ayah_number;
            if (!mostRecent || new Date(time) > new Date(mostRecent.time)) {
              mostRecent = { ayah, time };
            }
          }
        });
        
        ayahNumber = mostRecent?.ayah || null;
      } else if (trackingMode === 'scroll') {
        const { data } = await supabase
          .from('reading_progress')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'bookmark') {
        const { data } = await supabase
          .from('bookmarks')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('bookmark_type', 'ayah')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'reciting') {
        const { data } = await supabase
          .from('ayah_interactions')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('interaction_type', 'recite')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'click') {
        const { data } = await supabase
          .from('ayah_interactions')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('interaction_type', 'click')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      }

      if (ayahNumber) {
        setTimeout(() => {
          const element = document.querySelector(`[data-ayah="${ayahNumber}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHasRestoredScroll(true);
          }
        }, 500);
      } else {
        setHasRestoredScroll(true);
      }
    };

    restoreScroll();
  }, [surahData, surahNumber, hasRestoredScroll, settings.readingTrackingMode]);

  // Track scroll progress and save to database
  useEffect(() => {
    if (!surahData) return;

    const handleScroll = () => {
      if (!hasUserScrolled) setHasUserScrolled(true);

      const ayahElements = document.querySelectorAll('[data-ayah]');
      let maxVisible = 1;

      ayahElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
          const ayahNum = parseInt(el.getAttribute('data-ayah') || '1');
          if (ayahNum > maxVisible) maxVisible = ayahNum;
        }
      });

      setLastVisibleAyah(maxVisible);

      if (surahNumber) {
        localStorage.setItem('quran_last_position', JSON.stringify({ 
          surahNumber: parseInt(surahNumber), 
          ayahNumber: maxVisible 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [surahData, surahNumber, hasUserScrolled]);

  // Save progress to database (only when user has actually scrolled)
  useEffect(() => {
    if (!hasUserScrolled) return;
    if (lastVisibleAyah === 1 && !hasRestoredScroll) return;

    const saveProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !surahNumber) return;

      try {
        await supabase
          .from('reading_progress')
          .upsert({
            user_id: session.user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: lastVisibleAyah,
            progress_type: 'scroll',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number',
            ignoreDuplicates: false,
          });
      } catch (error) {
        console.error('[DB Save] Exception saving scroll progress:', error);
      }
    };

    const timeoutId = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timeoutId);
  }, [lastVisibleAyah, surahNumber, hasUserScrolled, hasRestoredScroll]);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const loadNextSurahInfo = async () => {
    if (!surahNumber || parseInt(surahNumber) >= 114) return;
    const nextSurahNum = parseInt(surahNumber) + 1;
    try {
      const surahs = await fetchSurahs();
      const nextSurah = surahs.find(s => s.number === nextSurahNum);
      setNextSurahData(nextSurah);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', nextSurahNum)
          .maybeSingle();
        setNextSurahProgress(progressData?.ayah_number || 0);
      }
    } catch (error) {
      console.error('Error loading next surah info:', error);
    }
  };

  const loadBookmarks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || !surahNumber) return;

    const { data: surahBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('surah_number', parseInt(surahNumber))
      .eq('bookmark_type', 'surah')
      .maybeSingle();

    setIsSurahBookmarked(!!surahBookmark);

    const { data: ayahBookmarks } = await supabase
      .from('bookmarks')
      .select('ayah_number')
      .eq('user_id', session.user.id)
      .eq('surah_number', parseInt(surahNumber))
      .eq('bookmark_type', 'ayah');

    if (ayahBookmarks) {
      setBookmarkedAyahs(new Set(ayahBookmarks.map(b => b.ayah_number).filter(Boolean) as number[]));
    }
  };

  const saveLastViewed = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || !surahNumber) return;

    try {
      await supabase
        .from('last_viewed_surah')
        .upsert({
          user_id: session.user.id,
          surah_number: parseInt(surahNumber),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    } catch (error) {
      console.error('Error saving last viewed:', error);
    }
  };

  const toggleSurahBookmark = async () => {
    if (!user || !surahNumber) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      if (isSurahBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('bookmark_type', 'surah');
        
        setIsSurahBookmarked(false);
        toast.success(settings.language === 'ar' ? 'تمت الإزالة' : 'Removed');
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            bookmark_type: 'surah'
          });
        
        setIsSurahBookmarked(true);
        toast.success(settings.language === 'ar' ? 'تمت الإضافة' : 'Added');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const toggleAyahBookmark = async (ayahNumber: number) => {
    if (!user || !surahNumber) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      const isBookmarked = bookmarkedAyahs.has(ayahNumber);
      
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('ayah_number', ayahNumber)
          .eq('bookmark_type', 'ayah');
        
        setBookmarkedAyahs(prev => {
          const newSet = new Set(prev);
          newSet.delete(ayahNumber);
          return newSet;
        });
        toast.success(settings.language === 'ar' ? 'تمت الإزالة' : 'Removed');
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            bookmark_type: 'ayah'
          });
        
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'bookmark',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        setBookmarkedAyahs(prev => new Set([...prev, ayahNumber]));
        toast.success(settings.language === 'ar' ? 'تمت الإضافة' : 'Added');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleAyahChat = async (ayah: any) => {
    setLastVisibleAyah(ayah.numberInSurah);
    
    if (user && surahNumber) {
      try {
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayah.numberInSurah,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
    setChatAyah({ text: ayah.text, number: ayah.numberInSurah });
  };

  const loadSurah = async () => {
    if (!surahNumber) return;
    
    setLoading(true);
    try {
      const arabic = await fetchSurahArabic(parseInt(surahNumber));
      setSurahData(arabic);
      
      if (settings.translationEnabled) {
        const edition = settings.translationSource === 'transliteration' 
          ? 'en.transliteration' 
          : settings.translationSource;
        const trans = await fetchSurahTranslation(parseInt(surahNumber), edition);
        setTranslation(trans);
      } else {
        setTranslation(null);
      }
      
      if (arabic?.ayahs) {
        const wordPromises = arabic.ayahs.map((ayah: any) => 
          fetchWordByWord(parseInt(surahNumber), ayah.numberInSurah)
            .then(words => ({ ayahNumber: ayah.numberInSurah, words }))
            .catch(() => null)
        );
        const pagePromises = arabic.ayahs.map((ayah: any) =>
          getPageNumber(parseInt(surahNumber), ayah.numberInSurah)
            .then(page => ({ ayahNumber: ayah.numberInSurah, page }))
            .catch(() => null)
        );
        const [wordResults, pageResults] = await Promise.all([
          Promise.all(wordPromises),
          Promise.all(pagePromises)
        ]);
        const newWordData: Record<number, any[]> = {};
        wordResults.forEach(result => {
          if (result) newWordData[result.ayahNumber] = result.words;
        });
        setWordData(newWordData);
        const newPageData: Record<number, number> = {};
        pageResults.forEach(result => {
          if (result && result.page) newPageData[result.ayahNumber] = result.page;
        });
        setAyahPages(newPageData);
      }
    } catch (error) {
      console.error('Error loading surah:', error);
      toast.error('Failed to load surah');
    } finally {
      setLoading(false);
    }
  };

  const loadWordByWord = async (ayahNumber: number) => {
    if (wordData[ayahNumber]) return;
    try {
      const words = await fetchWordByWord(parseInt(surahNumber!), ayahNumber);
      setWordData(prev => ({ ...prev, [ayahNumber]: words }));
    } catch (error) {
      console.error('Error loading word by word:', error);
    }
  };

  const loadTafsir = async (ayahNumber: number) => {
    if (tafsirData[ayahNumber]) return;

    setLastVisibleAyah(ayahNumber);

    if (user && surahNumber) {
      try {
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
    
    try {
      const tafsir = await fetchTafsir(
        parseInt(surahNumber!), 
        ayahNumber,
        settings.tafsirSource
      );
      setTafsirData(prev => ({ ...prev, [ayahNumber]: tafsir }));
    } catch (error) {
      console.error('Error loading tafsir:', error);
    }
  };

  const playAyah = async (ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }

    setLastVisibleAyah(ayahNumber);

    if (user && surahNumber) {
      try {
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'recite',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }

    const audioUrl = getAyahAudioUrl('ar.alafasy', parseInt(surahNumber!), ayahNumber);
    
    if (audioRef.current) audioRef.current.pause();
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play()
      .catch(() => {
        toast.error('Failed to play audio');
      });
    setPlayingAyah(ayahNumber);
    
    audioRef.current.onended = () => setPlayingAyah(null);
    audioRef.current.onerror = () => {
      toast.error('Error loading audio');
      setPlayingAyah(null);
    };
  };

  const playSurah = () => {
    const currentSurahNumber = parseInt(surahNumber!);
    
    if (playingSurah === currentSurahNumber) {
      if (isPlaying) pauseSurah();
      else resumeSurah();
      return;
    }

    if (playingSurah && playingSurah !== currentSurahNumber) {
      stopSurah();
    }

    if (!surahData) return;
    playGlobalSurah(currentSurahNumber, surahData.numberOfAyahs);
  };

  // Auto-scroll to playing ayah when locked
  useEffect(() => {
    if (!playingSurah || !isPlaying || playingSurah !== parseInt(surahNumber!)) return;
    const isLocked = (window as any).quranLockState;
    if (!isLocked) return;
    const element = document.querySelector(`[data-ayah="${globalPlayingAyah}"]`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [globalPlayingAyah, playingSurah, isPlaying, surahNumber]);

  const handleWordClick = async (ayahNumber: number, wordIndex: number) => {
    const key = `${ayahNumber}-${wordIndex}`;
    setOpenWordPopover(openWordPopover === key ? null : key);
    setLastVisibleAyah(ayahNumber);

    if (user && surahNumber) {
      try {
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
  };

  const playWordAudio = (word: WordData) => {
    if (word.audio) new Audio(word.audio).play();
  };

  if (loading) return <IslamicFactsLoader />;

  if (!surahData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Surah not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Back to Quran List Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/quran')}
        className="fixed top-6 left-6 z-[60] rounded-full w-8 h-8 hover:bg-background/80"
        title={settings.language === 'ar' ? 'العودة للقائمة' : 'Back to list'}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Header */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${
              settings.fontType === 'normal' ? '' : 
              settings.fontType === 'amiri' ? 'amiri-font' :
              settings.fontType === 'scheherazade' ? 'scheherazade-font' :
              settings.fontType === 'lateef' ? 'lateef-font' :
              settings.fontType === 'noto-naskh' ? 'noto-naskh-font' :
              'quran-font'
            }`}>
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {settings.language === 'ar' ? surahData.name : surahData.englishName}
              </span>
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              {surahData.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'} • {surahData.revelationType}
            </p>
          </div>

          {/* Right actions - prevent shrinking so sizes stay consistent */}
          <div className="flex items-center gap-2 flex-none">
            <Button
              onClick={playSurah}
              className="rounded-full px-6 py-6 shadow-lg hover:shadow-xl smooth-transition shrink-0"
              size="lg"
            >
              {playingSurah === parseInt(surahNumber!) && isPlaying ? (
                <Pause className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
              <span className="font-semibold">
                {playingSurah === parseInt(surahNumber!) && isPlaying
                  ? (settings.language === 'ar' ? 'إيقاف مؤقت' : 'Pause')
                  : (settings.language === 'ar' ? 'تشغيل السورة' : 'Play Surah')}
              </span>
            </Button>

            <Button
              onClick={toggleSurahBookmark}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shrink-0"
              title={settings.language === 'ar' ? 'إضافة إشارة مرجعية' : 'Bookmark surah'}
            >
              <Bookmark className={`h-5 w-5 ${isSurahBookmarked ? 'fill-primary text-primary' : ''}`} />
            </Button>

            {/* Share Surah (only URL) */}
            <Button
              onClick={() => shareOrCopy(surahUrl())}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shrink-0"
              title={settings.language === 'ar' ? 'مشاركة السورة' : 'Share surah'}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bismillah */}
      {surahData.number !== 1 && surahData.number !== 9 && (
        <div className="text-center py-12 glass-effect rounded-3xl border border-border/50 backdrop-blur-xl apple-shadow">
          <p className="text-3xl md:text-4xl quran-font bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-effect rounded-2xl p-4">
        <div className="relative flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={settings.language === 'ar' ? 'ابحث في الآيات برقم أو نص...' : 'Search ayahs by number or text...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-border/50 bg-background/50"
            />
          </div>
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="rounded-2xl"
            >
              {settings.language === 'ar' ? 'مسح' : 'Clear'}
            </Button>
          )}
        </div>
      </div>

      {/* Ayahs */}
      <div className="space-y-6">
        {surahData.ayahs
          .filter((ayah: any, index: number) => {
            if (!searchTerm.trim()) return true;
            const searchNumber = parseInt(searchTerm);
            if (!isNaN(searchNumber)) return ayah.numberInSurah === searchNumber;

            const normalizeArabic = (text: string) =>
              text
                .normalize('NFKC')
                .replace(/[\u064B-\u065F\u0670]/g, '')
                .replace(/[ًٌٍَُِّْٰ]/g, '')
                .replace(/أ|إ|آ/g, 'ا')
                .replace(/ة/g, 'ه')
                .trim()
                .toLowerCase();
            
            const search = normalizeArabic(searchTerm);
            const arabicText = normalizeArabic(ayah.text || '');
            const translationText = (translation?.ayahs[index]?.text || '').toLowerCase();
            return arabicText.includes(search) || translationText.includes(search);
          })
          .map((ayah: any, index: number) => (
          <div
            key={ayah.number}
            data-ayah={ayah.numberInSurah}
            className={`glass-effect rounded-2xl p-6 space-y-4 smooth-transition ${
              playingSurah === parseInt(surahNumber!) && globalPlayingAyah === ayah.numberInSurah ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          >
            {/* Ayah Number & Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{ayah.numberInSurah}</span>
                </div>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setTimeout(() => {
                        const element = document.querySelector(`[data-ayah="${ayah.numberInSurah}"]`);
                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className="rounded-full gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {settings.language === 'ar' ? 'اذهب إلى' : 'View'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playAyah(ayah.numberInSurah)}
                  className="rounded-full"
                >
                  {playingAyah === ayah.numberInSurah ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAyahChat(ayah)}
                  className="rounded-full"
                  title={settings.language === 'ar' ? 'اسأل عن هذه الآية' : 'Ask about this ayah'}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleAyahBookmark(ayah.numberInSurah)}
                  className="rounded-full"
                  title={settings.language === 'ar' ? 'إضافة إشارة مرجعية' : 'Bookmark ayah'}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarkedAyahs.has(ayah.numberInSurah) ? 'fill-primary text-primary' : ''}`} />
                </Button>

                {/* Share Ayah (only URL) */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => shareOrCopy(ayahUrl(ayah.numberInSurah))}
                  className="rounded-full"
                  title={settings.language === 'ar' ? 'مشاركة الآية' : 'Share ayah'}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Arabic Text with word-by-word */}
            <div
              className={`text-2xl leading-loose text-right ${
                settings.fontType === 'normal' ? '' : 
                settings.fontType === 'amiri' ? 'amiri-font' :
                settings.fontType === 'scheherazade' ? 'scheherazade-font' :
                settings.fontType === 'lateef' ? 'lateef-font' :
                settings.fontType === 'noto-naskh' ? 'noto-naskh-font' :
                'quran-font'
              }`}
              dir="rtl"
            >
              {wordData[ayah.numberInSurah] ? (
                <div className="flex flex-wrap gap-2 justify-end text-right" dir="rtl">
                  {wordData[ayah.numberInSurah].map((word, wordIndex) => {
                    const popoverKey = `${ayah.numberInSurah}-${wordIndex}`;
                    return (
                      <Popover 
                        key={wordIndex}
                        open={openWordPopover === popoverKey}
                        onOpenChange={(open) => {
                          if (!open) setOpenWordPopover(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => handleWordClick(ayah.numberInSurah, wordIndex)}
                            className="cursor-pointer hover:text-primary smooth-transition inline-block bg-transparent border-0 p-0 m-0 font-inherit"
                            style={{ font: 'inherit' }}
                          >
                            {word.text}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-[280px] p-4 glass-effect backdrop-blur-xl border-border/50"
                          side="top"
                          align="center"
                          sideOffset={8}
                        >
                          <div className="space-y-3 text-left" dir="ltr">
                            <div>
                              <p className="font-semibold text-foreground text-base mb-1">{word.translation}</p>
                              <p className="text-muted-foreground italic text-sm">{word.transliteration}</p>
                            </div>
                            {word.audio && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playWordAudio(word);
                                }}
                                className="w-full"
                              >
                                <Volume2 className="h-3 w-3 mr-2" />
                                {settings.language === 'ar' ? 'تشغيل' : 'Play'}
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              ) : (
                <span>{ayah.text}</span>
              )}
            </div>

            {/* Translation or Transliteration */}
            {settings.translationEnabled && translation && (
              <p className={`${settings.translationSource === 'transliteration' ? 'italic' : ''} text-muted-foreground`}>
                {translation.ayahs[index]?.text}
              </p>
            )}

            {/* Page Number */}
            {ayahPages[ayah.numberInSurah] && (
              <p className="text-xs text-muted-foreground/60 italic">
                {settings.language === 'ar' ? `صفحة ${ayahPages[ayah.numberInSurah]}` : `Page ${ayahPages[ayah.numberInSurah]}`}
              </p>
            )}

            {/* Tafsir Dropdown */}
            {settings.tafsirEnabled && (
              <Collapsible
                open={openTafsir === ayah.numberInSurah}
                onOpenChange={(open) => {
                  if (open) {
                    setOpenTafsir(ayah.numberInSurah);
                    loadTafsir(ayah.numberInSurah);
                  } else {
                    setOpenTafsir(null);
                  }
                }}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <span>{settings.language === 'ar' ? 'التفسير' : 'Tafsir'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openTafsir === ayah.numberInSurah ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="glass-effect rounded-xl p-4 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                    {tafsirData[ayah.numberInSurah] ? (
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tafsirData[ayah.numberInSurah]) }} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        {settings.language === 'ar' ? 'جاري التحميل...' : 'Loading tafsir...'}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </div>
      
      {/* Next Surah Navigation */}
      {nextSurahData && (
        <div className="glass-effect rounded-3xl p-6 border border-border/50 backdrop-blur-xl">
          <Button
            onClick={async () => {
              const nextSurahNum = nextSurahData.number;
              if (user) {
                const { data: progressData } = await supabase
                  .from('reading_progress')
                  .select('ayah_number')
                  .eq('user_id', user.id)
                  .eq('surah_number', nextSurahNum)
                  .maybeSingle();
                const progress = progressData?.ayah_number || 0;
                if (progress > 0) {
                  navigate(`/quran/${nextSurahNum}?ayah=${progress}`);
                } else {
                  navigate(`/quran/${nextSurahNum}`);
                }
              } else {
                navigate(`/quran/${nextSurahNum}`);
              }
            }}
            variant="outline"
            className="w-full justify-between text-base h-14"
          >
            <span>{settings.language === 'ar' ? 'السورة التالية' : 'Next Surah'}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {settings.language === 'ar' ? nextSurahData.name : nextSurahData.englishName}
              </span>
              <ArrowLeft className={`h-4 w-4 ${settings.language === 'ar' ? '' : 'rotate-180'}`} />
            </div>
          </Button>
        </div>
      )}

      <AyahChatDialog
        open={!!chatAyah}
        onOpenChange={(open) => !open && setChatAyah(null)}
        ayahText={chatAyah?.text || ''}
        ayahNumber={chatAyah?.number || 0}
        surahName={surahData?.englishName || ''}
      />
    </div>
  );
};

export default SurahDetail;
